
import React, { useState, useEffect } from 'react';
import Card from './Card';
import Button from './Button';
import { hbdiQuestions } from '../constants';

const optionStyles: { [key: string]: string } = {
    a: 'hover:bg-hbdi-blue/20 border-hbdi-blue',
    b: 'hover:bg-hbdi-green/20 border-hbdi-green',
    c: 'hover:bg-hbdi-red/20 border-hbdi-red',
    d: 'hover:bg-hbdi-yellow/20 border-hbdi-yellow',
};
const selectedOptionStyles: { [key: string]: string } = {
    a: 'bg-hbdi-blue text-white',
    b: 'bg-hbdi-green text-white',
    c: 'bg-hbdi-red text-white',
    d: 'bg-hbdi-yellow text-white',
};


const HBDIAssessment: React.FC<{ onComplete: (answers: { [key: number]: string }) => void }> = ({ onComplete }) => {
    const [answers, setAnswers] = useState<{ [key: number]: string }>(() => {
        try {
            const savedAnswers = localStorage.getItem('hbdiAnswers');
            return savedAnswers ? JSON.parse(savedAnswers) : {};
        } catch (error) {
            console.error("Failed to parse saved HBDI answers:", error);
            return {};
        }
    });
    const [error, setError] = useState('');
    
    useEffect(() => {
        try {
            localStorage.setItem('hbdiAnswers', JSON.stringify(answers));
        } catch (error) {
            console.error("Failed to save HBDI answers:", error);
        }
    }, [answers]);
    
    const handleSubmit = () => {
        if (Object.keys(answers).length < hbdiQuestions.length) {
            setError('Please answer all questions.');
            return;
        }
        setError('');
        localStorage.removeItem('hbdiAnswers'); // Clean up on completion
        onComplete(answers);
    };

    return (
        <Card className="max-w-3xl mx-auto">
            <h2 className="text-xl font-bold mb-4">M-CET Step 2: HBDI Assessment</h2>
            <p className="text-brand-text-muted mb-6">For each question, choose the option that best describes you.</p>
            <div className="space-y-6 max-h-[60vh] overflow-y-auto pr-4">
                {hbdiQuestions.map((item, i) => (
                    <div key={i} className="border-b border-brand-border pb-4">
                        <p className="font-medium mb-4">{i + 1}. {item.q}</p>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                           {(['a', 'b', 'c', 'd'] as const).map(opt => (
                                <label key={opt} className={`flex items-center space-x-3 p-3 rounded-md border-2 transition-colors cursor-pointer ${answers[i] === opt ? selectedOptionStyles[opt] : `bg-brand-surface ${optionStyles[opt]}`}`}>
                                    <input type="radio" name={`q-${i}`} value={opt} checked={answers[i] === opt} onChange={() => setAnswers(prev => ({...prev, [i]: opt}))} className="hidden" />
                                    <div className={`w-5 h-5 rounded-full border-2 flex-shrink-0 ${answers[i] === opt ? 'bg-white border-white' : 'border-brand-border'}`} />
                                    <span>{(item as any)[opt]}</span>
                                </label>
                           ))}
                        </div>
                    </div>
                ))}
            </div>
            {error && <p className="text-red-500 mt-4 text-center">{error}</p>}
            <Button onClick={handleSubmit} className="mt-6 w-full">Continue</Button>
        </Card>
    );
};

export default HBDIAssessment;