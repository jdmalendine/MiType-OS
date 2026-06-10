
import React from 'react';
import Card from './Card';
import Button from './Button';
import { User, ChevronLeft } from 'lucide-react';

interface MBTIResultsScreenProps {
    results: { mbtiType: string, summary: string } | null;
    onContinue: () => void;
    onBack: () => void;
}

const MBTIResultsScreen: React.FC<MBTIResultsScreenProps> = ({ results, onContinue, onBack }) => {
    return (
        <Card className="max-w-2xl mx-auto text-center p-12">
            <div className="flex items-center mb-8">
                <button onClick={onBack} className="p-2 hover:bg-white/10 rounded-full transition-colors mr-2">
                    <ChevronLeft size={24} />
                </button>
            </div>
            <div className="p-4 glass-panel rounded-2xl inline-block mb-8 text-brand-primary shadow-[0_0_30px_rgba(99,102,241,0.3)]">
                <User size={64} />
            </div>
            <h1 className="text-4xl font-black text-brand-text font-header tracking-tighter italic uppercase mb-4">MBTI SYNTHESIS COMPLETE</h1>
            <p className="text-brand-text-muted font-medium text-lg leading-relaxed mb-10 max-w-lg mx-auto">Your psychological processing style has been identified. Finalizing full cognitive profile integration.</p>
            
            <div className="glass-panel p-8 rounded-3xl border border-brand-border/30 shadow-[0_0_40px_rgba(0,0,0,0.5)] min-h-[200px] flex flex-col justify-center text-left">
                {results ? (
                    <div className="space-y-6">
                        <div>
                            <h2 className="text-xs font-black text-brand-primary uppercase tracking-[0.3em] mb-2">Estimated Neural Type</h2>
                            <p className="text-5xl font-black text-brand-text font-header tracking-tighter drop-shadow-[0_0_15px_rgba(255,255,255,0.3)]">{results.mbtiType}</p>
                        </div>
                        <div className="h-px bg-brand-border/20 w-full" />
                        <p className="text-lg font-medium leading-relaxed text-brand-text/80">{results.summary}</p>
                    </div>
                ) : (
                    <div className="flex flex-col items-center gap-4 py-8">
                        <div className="w-12 h-12 border-4 border-brand-primary/30 border-t-brand-primary rounded-full animate-spin" />
                        <p className="font-data text-xs uppercase tracking-[0.3em] text-brand-primary animate-pulse">Analyzing Psychological Vectors...</p>
                    </div>
                )}
            </div>

            <Button onClick={onContinue} disabled={!results} className="mt-12 text-xl font-black tracking-widest uppercase py-6 px-12 w-full shadow-[0_0_30px_rgba(99,102,241,0.2)]">
                Synthesize Full Cognitive Profile
            </Button>
        </Card>
    );
};

export default MBTIResultsScreen;
