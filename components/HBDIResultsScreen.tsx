
import React from 'react';
import Card from './Card';
import Button from './Button';
import { BrainCircuit, ChevronLeft } from 'lucide-react';

interface HBDIResultsScreenProps {
    summary: string | null;
    onContinue: () => void;
    onBack: () => void;
}

const HBDIResultsScreen: React.FC<HBDIResultsScreenProps> = ({ summary, onContinue, onBack }) => {
    return (
        <Card className="max-w-2xl mx-auto text-center p-12">
            <div className="flex items-center mb-8">
                <button onClick={onBack} className="p-2 hover:bg-white/10 rounded-full transition-colors mr-2">
                    <ChevronLeft size={24} />
                </button>
            </div>
            <div className="p-4 glass-panel rounded-2xl inline-block mb-8 text-brand-primary shadow-[0_0_30px_rgba(99,102,241,0.3)]">
                <BrainCircuit size={64} />
            </div>
            <h1 className="text-4xl font-black font-header tracking-tighter italic uppercase mb-4">HBDI CALIBRATION COMPLETE</h1>
            <p className="text-brand-text-muted font-medium text-lg leading-relaxed mb-10 max-w-lg mx-auto">Neural mapping of your dominant cognitive preferences is finalized. Review your baseline synthesis below.</p>
            
            <div className="glass-panel p-8 rounded-3xl border border-brand-border/30 shadow-[0_0_40px_rgba(0,0,0,0.5)] min-h-[160px] flex items-center justify-center text-left">
                {summary ? (
                    <p className="text-xl font-medium leading-relaxed text-brand-text/90">{summary}</p>
                ) : (
                    <div className="flex flex-col items-center gap-4">
                        <div className="w-12 h-12 border-4 border-brand-primary/30 border-t-brand-primary rounded-full animate-spin" />
                        <p className="font-data text-xs uppercase tracking-[0.3em] text-brand-primary animate-pulse">Synthesizing Neural Data...</p>
                    </div>
                )}
            </div>

            <Button onClick={onContinue} disabled={!summary} className="mt-12 text-xl font-black tracking-widest uppercase py-6 px-12 w-full shadow-[0_0_30px_rgba(99,102,241,0.2)]">
                Proceed to MBTI Synthesis
            </Button>
        </Card>
    );
};

export default HBDIResultsScreen;
