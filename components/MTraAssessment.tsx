
import React, { useState, useEffect } from 'react';
import Button from './Button';
import Card from './Card';
import { ChevronLeft } from 'lucide-react';
import * as geminiService from '../services/geminiService';
import { mtraQuestions } from '../constants';

const MTraAssessment: React.FC<{ 
    onComplete: (results: any, answers: { [key: number]: number }) => void,
    onBack: () => void
}> = ({ onComplete, onBack }) => {
    const [answers, setAnswers] = useState<{ [key: number]: number }>(() => {
        try {
            const savedAnswers = localStorage.getItem('mtraAnswers');
            return savedAnswers ? JSON.parse(savedAnswers) : {};
        } catch (error) {
            console.error("Failed to parse saved MTra answers:", error);
            return {};
        }
    });
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        try {
            localStorage.setItem('mtraAnswers', JSON.stringify(answers));
        } catch (error) {
            console.error("Failed to save MTra answers:", error);
        }
    }, [answers]);

    const handleSubmit = async () => {
        if (Object.keys(answers).length < mtraQuestions.length) {
            setError('Please answer all questions.');
            return;
        }
        setIsLoading(true);
        setError('');
        try {
            const results = await geminiService.analyzeMTra(answers);
            // We pass answers up to App to save in profile, and can clear local storage later if desired
            localStorage.removeItem('mtraAnswers');
            onComplete(results, answers);
        } catch (e) {
            setError('Failed to analyze your results. Please try again.');
            console.error(e);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Card className="max-w-4xl mx-auto p-8 md:p-12">
            <div className="flex items-center mb-8">
                <button onClick={onBack} className="p-2 hover:bg-white/10 rounded-full transition-colors mr-2">
                    <ChevronLeft size={24} />
                </button>
                <div className="flex-grow text-center">
                    <h2 className="text-3xl font-black font-header tracking-tighter italic uppercase">M-CET STEP 1: MTRA ASSESSMENT</h2>
                </div>
            </div>
            <div className="text-center mb-12">
                <p className="text-brand-text-muted font-medium leading-relaxed max-w-2xl mx-auto">Rate your agreement with the following statements. This data forms the baseline for your cognitive trigger analysis.</p>
            </div>

            <div className="space-y-10 max-h-[60vh] overflow-y-auto pr-6 custom-scrollbar">
                {mtraQuestions.map((q, i) => (
                    <div key={i} className="border-b border-brand-border/20 pb-10 last:border-0">
                        <div className="flex items-start gap-4 mb-8">
                            <span className="font-data text-brand-primary text-lg font-black opacity-50">{(i + 1).toString().padStart(2, '0')}</span>
                            <p className="text-xl font-bold font-header tracking-tight leading-snug">{q}</p>
                        </div>
                        <div className="flex justify-between items-center px-4 md:px-12">
                            <span className="text-[10px] font-black text-brand-text-muted uppercase tracking-widest">Strongly Disagree</span>
                            <div className="flex gap-4 md:gap-8">
                                {[1, 2, 3, 4, 5].map(val => (
                                    <label key={val} className="flex flex-col items-center gap-3 cursor-pointer group">
                                        <span className={`text-xs font-data transition-colors ${answers[i] === val ? 'text-brand-primary font-black' : 'text-brand-text-muted group-hover:text-brand-text'}`}>{val}</span>
                                        <div className="relative">
                                            <input
                                                type="radio"
                                                name={`q-${i}`}
                                                value={val}
                                                checked={answers[i] === val}
                                                onChange={() => setAnswers(prev => ({ ...prev, [i]: val }))}
                                                className="hidden"
                                            />
                                            <div className={`w-8 h-8 rounded-full border-2 transition-all duration-300 flex items-center justify-center ${answers[i] === val ? 'bg-brand-primary/20 border-brand-primary shadow-[0_0_15px_rgba(99,102,241,0.4)]' : 'border-brand-border/50 group-hover:border-brand-primary/30'}`}>
                                                {answers[i] === val && <div className="w-2.5 h-2.5 rounded-full bg-brand-primary shadow-[0_0_10px_rgba(99,102,241,0.8)]" />}
                                            </div>
                                        </div>
                                    </label>
                                ))}
                            </div>
                             <span className="text-[10px] font-black text-brand-text-muted uppercase tracking-widest">Strongly Agree</span>
                        </div>
                    </div>
                ))}
            </div>
            {error && <p className="text-red-500 mt-8 text-center font-bold uppercase tracking-widest text-xs animate-pulse">{error}</p>}
            <Button onClick={handleSubmit} disabled={isLoading} className="mt-10 w-full py-6 text-xl font-black tracking-widest uppercase shadow-[0_0_30px_rgba(99,102,241,0.2)]">
                {isLoading ? 'Calibrating Neural Triggers...' : 'Analyze My Triggers'}
            </Button>
        </Card>
    );
};

export default MTraAssessment;