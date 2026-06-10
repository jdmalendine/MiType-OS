
import React, { useState, useEffect } from 'react';
import Card from './Card';
import Button from './Button';
import { mbtiQuestions } from '../constants';
import { ChevronLeft } from 'lucide-react';

const optionStyles: { [key: string]: string } = {
    a: 'hover:bg-hbdi-blue/10 border-hbdi-blue/30 text-hbdi-blue shadow-[0_0_10px_rgba(59,130,246,0.1)]',
    b: 'hover:bg-hbdi-green/10 border-hbdi-green/30 text-hbdi-green shadow-[0_0_10px_rgba(34,197,94,0.1)]',
    c: 'hover:bg-hbdi-red/10 border-hbdi-red/30 text-hbdi-red shadow-[0_0_10px_rgba(239,68,68,0.1)]',
    d: 'hover:bg-hbdi-yellow/10 border-hbdi-yellow/30 text-hbdi-yellow shadow-[0_0_10px_rgba(255,215,0,0.1)]',
};
const selectedOptionStyles: { [key: string]: string } = {
    a: 'bg-hbdi-blue/20 border-hbdi-blue text-brand-text shadow-[0_0_20px_rgba(59,130,246,0.3)]',
    b: 'bg-hbdi-green/20 border-hbdi-green text-brand-text shadow-[0_0_20px_rgba(34,197,94,0.3)]',
    c: 'bg-hbdi-red/20 border-hbdi-red text-brand-text shadow-[0_0_20px_rgba(239,68,68,0.3)]',
    d: 'bg-hbdi-yellow/20 border-hbdi-yellow text-brand-text shadow-[0_0_20px_rgba(255,215,0,0.3)]',
};

const MBTIAssessment: React.FC<{ 
    onComplete: (answers: { [key: number]: string }) => void,
    onBack: () => void 
}> = ({ onComplete, onBack }) => {
    const [answers, setAnswers] = useState<{ [key: number]: string }>(() => {
        try {
            const savedAnswers = localStorage.getItem('mbtiAnswers');
            return savedAnswers ? JSON.parse(savedAnswers) : {};
        } catch (error) {
            console.error("Failed to parse saved MBTI answers:", error);
            return {};
        }
    });
    const [error, setError] = useState('');
    
    useEffect(() => {
        try {
            localStorage.setItem('mbtiAnswers', JSON.stringify(answers));
        } catch (error) {
            console.error("Failed to save MBTI answers:", error);
        }
    }, [answers]);

    const handleSubmit = () => {
        if (Object.keys(answers).length < mbtiQuestions.length) {
            setError('Please answer all questions.');
            return;
        }
        setError('');
        localStorage.removeItem('mbtiAnswers'); // Clean up on completion
        onComplete(answers);
    };

    return (
        <Card className="max-w-4xl mx-auto p-8 md:p-12">
            <div className="flex items-center mb-8">
                <button onClick={onBack} className="p-2 hover:bg-white/10 rounded-full transition-colors mr-2">
                    <ChevronLeft size={24} />
                </button>
                <div className="flex-grow text-center">
                    <h2 className="text-3xl font-black text-brand-text mb-4 font-header tracking-tighter italic uppercase">M-CET STEP 3: MBTI ASSESSMENT</h2>
                </div>
            </div>
            <div className="text-center mb-12">
                <p className="text-brand-text-muted font-medium leading-relaxed max-w-2xl mx-auto">For each question, choose the option that best describes your psychological type. Finalizing neural profile synthesis.</p>
            </div>

            <div className="space-y-10 max-h-[60vh] overflow-y-auto pr-6 custom-scrollbar">
                {mbtiQuestions.map((item, i) => (
                    <div key={i} className="border-b border-brand-border/20 pb-10 last:border-0">
                        <div className="flex items-start gap-4 mb-6">
                            <span className="font-data text-brand-primary text-lg font-black opacity-50">{(i + 1).toString().padStart(2, '0')}</span>
                            <p className="text-xl font-bold text-brand-text font-header tracking-tight leading-snug">{item.q}</p>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                           {(['a', 'b', 'c', 'd'] as const).map(opt => (
                               (item as any)[opt] && (
                                <label key={opt} className={`flex items-center space-x-4 p-5 rounded-2xl border-2 transition-all duration-300 cursor-pointer group ${answers[i] === opt ? selectedOptionStyles[opt] : `bg-white/5 ${optionStyles[opt]}`}`}>
                                    <input type="radio" name={`q-${i}`} value={opt} checked={answers[i] === opt} onChange={() => setAnswers(prev => ({...prev, [i]: opt}))} className="hidden" />
                                    <div className={`w-6 h-6 rounded-full border-2 flex-shrink-0 transition-all duration-300 ${answers[i] === opt ? 'bg-white border-white shadow-[0_0_10px_rgba(255,255,255,0.5)]' : 'border-brand-border/50 group-hover:border-white/30'}`} />
                                    <span className="font-bold text-brand-text tracking-wide">{ (item as any)[opt] }</span>
                                </label>
                               )
                           ))}
                        </div>
                    </div>
                ))}
            </div>
            {error && <p className="text-red-500 mt-8 text-center font-bold uppercase tracking-widest text-xs animate-pulse">{error}</p>}
            <Button onClick={handleSubmit} className="mt-10 w-full py-6 text-xl font-black tracking-widest uppercase shadow-[0_0_30px_rgba(99,102,241,0.2)]">Generate Cognitive Profile</Button>
        </Card>
    );
};

export default MBTIAssessment;