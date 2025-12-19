
import React from 'react';
import Card from './Card';
import Button from './Button';
import { BrainCircuit } from 'lucide-react';

interface HBDIResultsScreenProps {
    summary: string | null;
    onContinue: () => void;
}

const HBDIResultsScreen: React.FC<HBDIResultsScreenProps> = ({ summary, onContinue }) => {
    return (
        <Card className="max-w-xl mx-auto text-center animate-fade-in">
            <BrainCircuit size={48} className="text-brand-primary mx-auto mb-4" />
            <h1 className="text-3xl font-bold">HBDI Analysis</h1>
            <p className="text-brand-text-muted mt-2 mb-6">Based on your answers, here is a summary of your dominant cognitive preferences.</p>
            
            <div className="text-left bg-brand-bg p-6 rounded-lg border border-brand-border min-h-[100px] flex items-center justify-center">
                {summary ? (
                    <p className="text-brand-text">{summary}</p>
                ) : (
                    <p>Analyzing...</p>
                )}
            </div>

            <Button onClick={onContinue} disabled={!summary} className="mt-8 text-lg py-3 px-8 w-full">
                Continue to MBTI Assessment
            </Button>
        </Card>
    );
};

export default HBDIResultsScreen;
