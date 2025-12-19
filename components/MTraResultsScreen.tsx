import React from 'react';
import Card from './Card';
import Button from './Button';
import { ShieldAlert, ListChecks } from 'lucide-react';

interface MTraResultsScreenProps {
    results: {
        changeThreshold: 'High' | 'Moderate' | 'Low';
        ctSuppressors: string[];
    };
    onContinue: () => void;
}

const MTraResultsScreen: React.FC<MTraResultsScreenProps> = ({ results, onContinue }) => {
    return (
        <Card className="max-w-xl mx-auto text-center animate-fade-in">
            <ListChecks size={48} className="text-brand-primary mx-auto mb-4" />
            <h1 className="text-3xl font-bold">MTra Results</h1>
            <p className="text-brand-text-muted mt-2 mb-6">Here's a preliminary analysis of your change threshold triggers.</p>
            
            <div className="text-left space-y-4 bg-brand-bg p-6 rounded-lg border border-brand-border">
                <div>
                    <h2 className="font-semibold text-lg">Change Threshold</h2>
                    <p className={`text-xl font-bold ${
                        results.changeThreshold === 'High' ? 'text-green-400' :
                        results.changeThreshold === 'Moderate' ? 'text-yellow-400' : 'text-red-400'
                    }`}>{results.changeThreshold}</p>
                </div>
                <div>
                    <h2 className="font-semibold text-lg flex items-center gap-2"><ShieldAlert size={20} /> Top 3 CT Suppressors</h2>
                    <ul className="list-disc list-inside mt-2 text-brand-text-muted space-y-1">
                        {results.ctSuppressors.map(s => <li key={s}>{s}</li>)}
                    </ul>
                </div>
            </div>

            <Button onClick={onContinue} className="mt-8 text-lg py-3 px-8 w-full">
                Continue to HBDI Assessment
            </Button>
        </Card>
    );
};

export default MTraResultsScreen;
