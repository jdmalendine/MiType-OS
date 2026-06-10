import { jsPDF } from "jspdf";
import { UserProfile } from "../types";
import * as geminiService from "./geminiService";

export const generatePDF = async (userProfile: UserProfile, archetypeInAction?: string) => {
    const doc = new jsPDF();
    const margin = 25;
    const pageWidth = doc.internal.pageSize.width;
    const pageHeight = doc.internal.pageSize.height;
    const contentWidth = pageWidth - (margin * 2);
    
    // Premium Professional Palette
    const colors: { [key: string]: [number, number, number] } = {
        bg: [13, 17, 23],
        accent: [99, 102, 241], // Indigo-500
        text: [249, 250, 251], // Gray-50
        textMuted: [156, 163, 175], // Gray-400
        egotendRed: [239, 68, 68],
        highertendGreen: [34, 197, 94],
        primaryBlue: [59, 130, 246]
    };

    let currentY = margin;

    const drawBackground = () => {
        doc.setFillColor(colors.bg[0], colors.bg[1], colors.bg[2]);
        doc.rect(0, 0, pageWidth, pageHeight, 'F');
    };

    const drawLogo = (x: number, y: number, size: number = 8) => {
        const s = size / 2;
        doc.setFillColor(59, 130, 246); doc.rect(x, y, s, s, 'F');
        doc.setFillColor(234, 179, 8); doc.rect(x + s, y, s, s, 'F');
        doc.setFillColor(34, 197, 94); doc.rect(x, y + s, s, s, 'F');
        doc.setFillColor(239, 68, 68); doc.rect(x + s, y + s, s, s, 'F');
        
        doc.setFont("helvetica", "bold");
        doc.setFontSize(14);
        doc.setTextColor(255, 255, 255);
        doc.text("MiType", x + size + 4, y + size - 1);
    };

    const addStateCard = (x: number, y: number, width: number, title: string, subtitle: string, body: string, color: [number, number, number]) => {
        const padding = 8;
        doc.setDrawColor(color[0], color[1], color[2], 80);
        doc.setLineWidth(0.3);
        
        const cardHeight = 110; 

        // Card background
        doc.setFillColor(30, 35, 45); 
        doc.roundedRect(x, y, width, cardHeight, 3, 3, 'F');
        doc.roundedRect(x, y, width, cardHeight, 3, 3, 'D');

        let innerY = y + 10;
        doc.setFont("helvetica", "bold");
        doc.setFontSize(11);
        doc.setTextColor(colors.text[0], colors.text[1], colors.text[2]);
        doc.text(doc.splitTextToSize(title, width - (padding * 2)), x + padding, innerY);
        innerY += 8;

        doc.setFont("helvetica", "italic");
        doc.setFontSize(8);
        doc.setTextColor(color[0], color[1], color[2]);
        doc.text(subtitle, x + padding, innerY);
        innerY += 10;

        doc.setFont("helvetica", "bold");
        doc.setFontSize(9);
        doc.setTextColor(colors.text[0], colors.text[1], colors.text[2]);
        doc.text("Operational Focus", x + padding, innerY);
        innerY += 5;

        doc.setFont("helvetica", "normal");
        doc.setFontSize(8);
        doc.setTextColor(colors.textMuted[0], colors.textMuted[1], colors.textMuted[2]);
        // Extract challenges or strengths as bullet points if possible, otherwise just text
        const bodyText = body.split('\n\n')[0];
        doc.text(doc.splitTextToSize(bodyText, width - (padding * 2)), x + padding, innerY);
        
        return cardHeight;
    };

    const checkNewPage = (neededHeight: number) => {
        if (currentY + neededHeight > pageHeight - margin - 15) {
            doc.addPage();
            drawBackground();
            currentY = margin;
            return true;
        }
        return false;
    };

    const addSectionHeader = (text: string, color: [number, number, number] = colors.accent) => {
        checkNewPage(25);
        doc.setFont("helvetica", "bold");
        doc.setFontSize(13);
        doc.setTextColor(color[0], color[1], color[2]);
        doc.text(text.toUpperCase(), margin, currentY);
        currentY += 8;
        doc.setDrawColor(color[0], color[1], color[2]);
        doc.setLineWidth(0.3);
        doc.line(margin, currentY - 2, margin + 40, currentY - 2);
        currentY += 10;
    };

    const addParagraph = (text: string, color: [number, number, number] = colors.text, size: number = 10, isItalic: boolean = false) => {
        doc.setFont("helvetica", isItalic ? "italic" : "normal");
        doc.setFontSize(size);
        doc.setTextColor(color[0], color[1], color[2]);
        const lines = doc.splitTextToSize(text, contentWidth);
        const height = lines.length * (size * 0.5);
        checkNewPage(height + 5);
        doc.text(lines, margin, currentY);
        currentY += height + 8;
    };

    const addStateBox = (title: string, subtitle: string, body: string, borderColor: [number, number, number]) => {
        const padding = 10;
        doc.setFont("helvetica", "bold");
        doc.setFontSize(11);
        const titleLines = doc.splitTextToSize(title, contentWidth - (padding * 2));
        doc.setFont("helvetica", "italic");
        doc.setFontSize(9);
        const subtitleLines = doc.splitTextToSize(subtitle, contentWidth - (padding * 2));
        doc.setFont("helvetica", "normal");
        doc.setFontSize(10);
        const bodyLines = doc.splitTextToSize(body, contentWidth - (padding * 2));
        
        const totalHeight = (titleLines.length + subtitleLines.length + bodyLines.length) * 5 + 25;
        checkNewPage(totalHeight);

        // Border and soft background
        doc.setDrawColor(borderColor[0], borderColor[1], borderColor[2]);
        doc.setLineWidth(0.2);
        doc.rect(margin, currentY, contentWidth, totalHeight);
        doc.setFillColor(borderColor[0], borderColor[1], borderColor[2], 0.03);
        doc.rect(margin, currentY, contentWidth, totalHeight, 'F');

        let innerY = currentY + 10;
        doc.setFont("helvetica", "bold");
        doc.setFontSize(11);
        doc.setTextColor(borderColor[0], borderColor[1], borderColor[2]);
        doc.text(titleLines, margin + padding, innerY);
        innerY += titleLines.length * 5 + 2;

        doc.setFont("helvetica", "italic");
        doc.setFontSize(9);
        doc.setTextColor(colors.textMuted[0], colors.textMuted[1], colors.textMuted[2]);
        doc.text(subtitleLines, margin + padding, innerY);
        innerY += subtitleLines.length * 5 + 6;

        doc.setFont("helvetica", "normal");
        doc.setFontSize(10);
        doc.setTextColor(colors.text[0], colors.text[1], colors.text[2]);
        doc.text(bodyLines, margin + padding, innerY);
        
        currentY += totalHeight + 12;
    };

    const drawFooter = (pageNum: number, totalPages: number) => {
        doc.setFont("helvetica", "normal");
        doc.setFontSize(8);
        doc.setTextColor(colors.textMuted[0], colors.textMuted[1], colors.textMuted[2]);
        doc.text("MiType+ Cognitive OS | Private Intelligence Report", margin, pageHeight - 10);
        doc.text(`Page ${pageNum} of ${totalPages}`, pageWidth - margin, pageHeight - 10, { align: 'right' });
    };

    // --- PAGE 1: TITLE & EXECUTIVE SUMMARY ---
    drawBackground();
    drawLogo(margin, margin);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(42);
    doc.setTextColor(colors.text[0], colors.text[1], colors.text[2]);
    doc.text("COGNITIVE\nINTELLIGENCE", margin, margin + 45);
    currentY = margin + 95;

    addSectionHeader("Executive Summary");
    const archetypeRef = userProfile.baseArchetype;
    
    // Executive Summary Box
    const boxPadding = 12;
    doc.setFillColor(30, 35, 45);
    const boxHeight = 45;
    doc.roundedRect(margin, currentY, contentWidth, boxHeight, 4, 4, 'F');
    
    doc.setFont("helvetica", "bold");
    doc.setFontSize(11);
    doc.setTextColor(255, 255, 255);
    doc.text(`Archetype: ${archetypeRef.name}`, margin + boxPadding, currentY + 12);
    doc.text(`Type Identifier: ${archetypeRef.MBTI} | Threshold: ${archetypeRef.CTS}`, margin + boxPadding, currentY + 19);
    
    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    doc.setTextColor(colors.textMuted[0], colors.textMuted[1], colors.textMuted[2]);
    const coreDriveLines = doc.splitTextToSize(`Core Drive: ${archetypeRef.coreDrive}`, contentWidth - (boxPadding * 2));
    doc.text(coreDriveLines, margin + boxPadding, currentY + 30);
    
    currentY += boxHeight + 20;
    
    addParagraph(`Welcome to your customized Cognitive Intelligence Report. You have been identified as a ${archetypeRef.name}. By understanding the unique architecture of your focus, you can better navigate stress and unlock a consistent flow state in both professional and personal domains.`);

    // --- PAGE 2: COGNITIVE STATES (Side-by-Side) ---
    doc.addPage();
    drawBackground();
    currentY = margin;
    addSectionHeader("Cognitive States");
    
    const cardWidth = (contentWidth - 10) / 2;
    addStateCard(
        margin, currentY, cardWidth,
        `Egotend: ${userProfile.egotend.name}`,
        "(Reactive State)",
        `Challenges: ${userProfile.egotend.challenges.join(", ")}\n\nWarning Signs: ${userProfile.egotend.warningSigns?.join(", ")}`,
        colors.egotendRed
    );

    addStateCard(
        margin + cardWidth + 10, currentY, cardWidth,
        `Highertend: ${userProfile.highertend.name}`,
        "(Integrated State)",
        `Flow Strengths: ${userProfile.highertend.strengthsInFlow?.join(", ")}\n\nActivation: ${userProfile.highertend.quickActivation?.join(", ")}`,
        colors.highertendGreen
    );
    
    currentY += 125;
    addParagraph("Recognition of these states is the first step toward self-mastery. Your Egotend serves as a defense mechanism, while your Highertend represents your optimal contribution to any system.", colors.textMuted, 9, true);

    // --- PAGE 3: ARCHETYPE IN ACTION ---
    doc.addPage();
    drawBackground();
    currentY = margin;
    addSectionHeader("Your Archetype in Action");
    
    let actionContent = archetypeInAction;
    if (!actionContent) {
        try {
            actionContent = await geminiService.getArchetypeInAction(archetypeRef.name);
        } catch (error) {
            console.error("Action content fetch failed", error);
        }
    }

    if (actionContent) {
        const paragraphs = actionContent.split('\n\n');
        paragraphs.forEach(p => addParagraph(p));
    } else {
        addParagraph("Generating deep narrative mapping of your cognitive behaviors...");
    }

    // --- PAGE 4: DETAILED COGNITIVE MAPPING ---
    doc.addPage();
    drawBackground();
    currentY = margin;
    addSectionHeader("Detailed Cognitive Mapping");

    // MTRA
    addParagraph("MTRA – Change Threshold", colors.accent, 12, false);
    addParagraph("The MTRA provides a window into your neural adaptability—how your brain manages the shift from the familiar to the unknown.");
    const mtraInterp = userProfile.changeThreshold === 'High' 
        ? "With a High Change Threshold, you are a natural explorer. You find energy in novelty and are likely the first to volunteer for unproven or rapidly evolving projects."
        : userProfile.changeThreshold === 'Low'
        ? "A Low Change Threshold indicates you are a master of stability. You thrive by perfecting systems and finding deep satisfaction in reliable, predictable outcomes."
        : "Your Moderate Threshold means you are a flexible stabilizer. You can maintain order when needed but are resilient enough to pivot when the objective shifts.";
    addParagraph(mtraInterp, colors.textMuted, 10, true);
    currentY += 5;

    // HBDI
    addParagraph("HBDI – Cognitive Preference Profile", colors.accent, 12, false);
    addParagraph("The HBDI maps how you prefer to process information across four logical and creative quadrants.");
    const hbdiProfileName = archetypeRef.HBDI || "Strategic Core Profile";
    addParagraph(`Operating with a ${hbdiProfileName}, you have a natural 'home base' for your thinking. This means when you are presented with a problem, your mind first filters it through a specific lens—whether that's analytical data, practical steps, relational impact, or experimental possibilities.`, colors.textMuted, 10, true);
    currentY += 5;

    // MBTI
    addParagraph("MBTI – Personality Type", colors.accent, 12, false);
    addParagraph("MBTI provides a framework for understanding how you orient yourself to the world and where you gain your energy.");
    const mbtiInterp = `As an ${archetypeRef.MBTI}, you lead with a clear sense of purpose. This orientation determines how you communicate with peers, how you organize your daily workspace, and where you find your deepest professional fulfillment. You are a unique asset to any team, providing a perspective that is essential for holistic system success.`;
    addParagraph(mbtiInterp, colors.textMuted, 10, true);

    addParagraph("\n\nThis report is your neural compass. Use it to navigate high-pressure environments and to find your way back to your highest potential every single day.", colors.accent, 11, true);

    // Final Post-processing: Footers
    const totalPages = doc.getNumberOfPages();
    for (let i = 1; i <= totalPages; i++) {
        doc.setPage(i);
        drawFooter(i, totalPages);
    }

    doc.save(`MiType_Intelligence_Report_${archetypeRef.MBTI}_${new Date().toISOString().split('T')[0]}.pdf`);
};
