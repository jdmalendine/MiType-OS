import { jsPDF } from "jspdf";
import { UserProfile } from "../types";
import { mtraQuestions, hbdiQuestions, mbtiQuestions } from "../constants";

export const generatePDF = (userProfile: UserProfile) => {
    const doc = new jsPDF();
    const margin = 20;
    const pageWidth = doc.internal.pageSize.width;
    const pageHeight = doc.internal.pageSize.height;
    const contentWidth = pageWidth - (margin * 2);
    let y = 20;

    const addPageBreakIfNeeded = (heightNeeded: number) => {
        if (y + heightNeeded > pageHeight - margin) {
            doc.addPage();
            y = 20;
        }
    };

    const addText = (text: string, fontSize: number = 10, isBold: boolean = false, color: string = '#000000', align: 'left' | 'center' | 'right' = 'left') => {
        doc.setFontSize(fontSize);
        doc.setFont("helvetica", isBold ? "bold" : "normal");
        doc.setTextColor(color);
        
        const lines = doc.splitTextToSize(text, contentWidth);
        const height = lines.length * (fontSize * 0.5); // approximate height

        addPageBreakIfNeeded(height + 2);

        doc.text(lines, align === 'center' ? pageWidth / 2 : (align === 'right' ? pageWidth - margin : margin), y, { align });
        y += height + (fontSize * 0.3);
    };

    const addDivider = () => {
        addPageBreakIfNeeded(5);
        doc.setDrawColor(200, 200, 200);
        doc.line(margin, y, pageWidth - margin, y);
        y += 10;
    };

    // --- Header ---
    addText("MiType+ Cognitive Profile Report", 22, true, '#4f46e5', 'center'); // Brand Primary approx
    addText(`Generated on: ${new Date().toLocaleDateString()}`, 10, false, '#6b7280', 'center');
    y += 10;
    addDivider();

    // --- Profile Overview ---
    if (userProfile.baseArchetype) {
        addText("Base Profile", 16, true, '#111827');
        y += 5;
        addText(`Archetype: ${userProfile.baseArchetype.name}`, 12, true);
        addText(`Core Drive: ${userProfile.baseArchetype.coreDrive}`, 10, false, '#374151');
        
        y += 5;
        addText(`HBDI Preference: ${userProfile.baseArchetype.HBDI}`, 10);
        addText(`MBTI Type: ${userProfile.baseArchetype.MBTI}`, 10);
        addText(`Change Threshold: ${userProfile.baseArchetype.CTS}`, 10);
        
        y += 5;
        addDivider();
    }

    // --- Deep Dive ---
    if (userProfile.egotend && userProfile.highertend) {
        addText("Cognitive States", 16, true, '#111827');
        y += 5;
        
        // Egotend
        addText("Egotend (Stress State)", 14, true, '#ef4444');
        addText(`Name: ${userProfile.egotend.name}`, 11, true);
        addText("Challenges & Triggers:", 10, true);
        userProfile.egotend.challenges.forEach(c => addText(`• ${c}`, 9));
        if (userProfile.ctSuppressors && userProfile.ctSuppressors.length > 0) {
            addText("Identified Suppressors: " + userProfile.ctSuppressors.join(", "), 9);
        }

        y += 5;

        // Highertend
        addText("Highertend (Growth State)", 14, true, '#22c55e');
        addText(`Name: ${userProfile.highertend.name}`, 11, true);
        addText("Path to Growth:", 10, true);
        userProfile.highertend.pathToGrowth.forEach(p => addText(`• ${p}`, 9));

        y += 5;
        addDivider();
    }

    // --- Assessment Data ---
    addText("Assessment Details", 16, true, '#111827');
    y += 5;

    // MTra
    if (userProfile.mtraAnswers) {
        addText("MTra (Threshold Reaction) Responses", 12, true, '#374151');
        mtraQuestions.forEach((q, i) => {
            const score = userProfile.mtraAnswers ? userProfile.mtraAnswers[i] : '-';
            addText(`${i + 1}. ${q} (Score: ${score}/5)`, 9);
        });
        y += 5;
    }

    // HBDI
    if (userProfile.hbdiAnswers) {
        addText("HBDI Responses", 12, true, '#374151');
        hbdiQuestions.forEach((q, i) => {
            const answerKey = userProfile.hbdiAnswers ? userProfile.hbdiAnswers[i] : null;
            // @ts-ignore
            const answerText = answerKey ? q[answerKey] : 'Not answered';
            addText(`${i + 1}. ${q.q}`, 9, true);
            addText(`   Selected: ${answerText}`, 9);
            y += 2;
        });
        y += 5;
    }

    // MBTI
    if (userProfile.mbtiAnswers) {
        addText("MBTI Responses", 12, true, '#374151');
        mbtiQuestions.forEach((q, i) => {
            const answerKey = userProfile.mbtiAnswers ? userProfile.mbtiAnswers[i] : null;
            // @ts-ignore
            const answerText = answerKey ? q[answerKey] : 'Not answered';
            addText(`${i + 1}. ${q.q}`, 9, true);
            addText(`   Selected: ${answerText}`, 9);
            y += 2;
        });
    }

    // Footer
    const pageCount = doc.getNumberOfPages();
    for(let i = 1; i <= pageCount; i++) {
        doc.setPage(i);
        doc.setFontSize(8);
        doc.setTextColor('#9ca3af');
        doc.text('MiType+ Cognitive OS', margin, pageHeight - 10);
        doc.text(`Page ${i} of ${pageCount}`, pageWidth - margin, pageHeight - 10, { align: 'right' });
    }

    doc.save(`MiType_Profile_${new Date().toISOString().split('T')[0]}.pdf`);
};