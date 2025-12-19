
import React from 'react';
import Card from './Card';
import Button from './Button';
import { User } from 'lucide-react';

interface MBTIResultsScreenProps {
    results: { mbtiType: string, summary: string } | null;
    onContinue: () => void;
}

const MBTIResultsScreen: React.FC<MBTIResultsScreenProps> = ({ results, onContinue }) => {
    return (
        <Card className="max-w-xl mx-auto text-center animate-fade-in">
            <User size={48} className="text-brand-primary mx-auto mb-4" />
            <h1 className="text-3xl font-bold">MBTI Analysis</h1>
            <p className="text-brand-text-muted mt-2 mb-6">Your answers point towards the following processing style.</p>
            
            <div className="text-left bg-brand-bg p-6 rounded-lg border border-brand-border min-h-[150px] flex flex-col justify-center">
                {results ? (
                    <div>
                        <h2 className="font-semibold text-lg">Your Estimated Type</h2>
                        <p className="text-2xl font-bold text-brand-secondary">{results.mbtiType}</p>
                        <p className="text-brand-text mt-4">{results.summary}</p>
                    </div>
                ) : (
                    <p>Analyzing...</p>
                )}
            </div>

            <Button onClick={onContinue} disabled={!results} className="mt-8 text-lg py-3 px-8 w-full">
                Synthesize Full Profile
            </Button>
        </Card>
    );
};

export default MBTIResultsScreen;
