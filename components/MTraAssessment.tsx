
import React, { useState, useEffect } from 'react';
import Button from './Button';
import Card from './Card';
import * as geminiService from '../services/geminiService';
import { mtraQuestions } from '../constants';

const MTraAssessment: React.FC<{ onComplete: (results: any, answers: { [key: number]: number }) => void }> = ({ onComplete }) => {
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
        <Card className="max-w-3xl mx-auto">
            <h2 className="text-xl font-bold mb-4">M-CET Step 1: MTra Assessment</h2>
            <p className="text-brand-text-muted mb-6">Rate your agreement with the following statements. (1 = Strongly Disagree, 5 = Strongly Agree)</p>
            <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-4">
                {mtraQuestions.map((q, i) => (
                    <div key={i} className="border-b border-brand-border pb-3">
                        <p className="font-medium mb-2">{i + 1}. {q}</p>
                        <div className="flex justify-between items-center space-x-2">
                            <span className="text-xs text-brand-text-muted">Disagree</span>
                            {[1, 2, 3, 4, 5].map(val => (
                                <label key={val} className="flex flex-col items-center space-y-1 cursor-pointer p-1">
                                    <span className="text-sm">{val}</span>
                                    <input
                                        type="radio"
                                        name={`q-${i}`}
                                        value={val}
                                        checked={answers[i] === val}
                                        onChange={() => setAnswers(prev => ({ ...prev, [i]: val }))}
                                        className="form-radio h-4 w-4 text-brand-primary bg-brand-bg border-brand-border focus:ring-brand-primary"
                                    />
                                </label>
                            ))}
                             <span className="text-xs text-brand-text-muted">Agree</span>
                        </div>
                    </div>
                ))}
            </div>
            {error && <p className="text-red-500 mt-4 text-center">{error}</p>}
            <Button onClick={handleSubmit} disabled={isLoading} className="mt-6 w-full">
                {isLoading ? 'Analyzing...' : 'Analyze My Triggers'}
            </Button>
        </Card>
    );
};

export default MTraAssessment;