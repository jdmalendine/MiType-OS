import React from 'react';
import Card from './Card';
import Button from './Button';
import { ShieldAlert, ListChecks, ChevronLeft } from 'lucide-react';

interface MTraResultsScreenProps {
    results: {
        changeThreshold: 'High' | 'Moderate' | 'Low';
        ctSuppressors: string[];
    };
    onContinue: () => void;
    onBack: () => void;
}

const MTraResultsScreen: React.FC<MTraResultsScreenProps> = ({ results, onContinue, onBack }) => {
    return (
        <Card className="max-w-2xl mx-auto text-center p-12">
            <div className="flex items-center mb-8">
                <button onClick={onBack} className="p-2 hover:bg-white/10 rounded-full transition-colors mr-2">
                    <ChevronLeft size={24} />
                </button>
            </div>
            <div className="p-4 glass-panel rounded-2xl inline-block mb-8 text-brand-primary shadow-[0_0_30px_rgba(99,102,241,0.3)]">
                <ListChecks size={64} />
            </div>
            <h1 className="text-4xl font-black font-header tracking-tighter italic uppercase mb-4">MTRA CALIBRATION COMPLETE</h1>
            <p className="text-brand-text-muted font-medium text-lg leading-relaxed mb-10 max-w-lg mx-auto">Preliminary analysis of your change threshold triggers is finalized. Review your neural resistance baseline.</p>
            
            <div className="glass-panel p-8 rounded-3xl border border-brand-border/30 shadow-[0_0_40px_rgba(0,0,0,0.5)] text-left space-y-8">
                <div>
                    <h2 className="text-xs font-black text-brand-primary uppercase tracking-[0.3em] mb-3">Change Threshold</h2>
                    <p className={`text-5xl font-black font-header tracking-tighter drop-shadow-[0_0_15px_rgba(255,255,255,0.2)] ${
                        results.changeThreshold === 'High' ? 'text-hbdi-green' :
                        results.changeThreshold === 'Moderate' ? 'text-hbdi-yellow' : 'text-hbdi-red'
                    }`}>{results.changeThreshold}</p>
                </div>
                
                <div className="h-px bg-brand-border/20 w-full" />

                <div>
                    <h2 className="text-xs font-black text-brand-primary uppercase tracking-[0.3em] mb-4 flex items-center gap-2">
                        <ShieldAlert size={16} /> Top 3 CT Suppressors
                    </h2>
                    <ul className="space-y-3">
                        {results.ctSuppressors.map((s, idx) => (
                            <li key={s} className="flex items-center gap-4 group">
                                <span className="font-data text-[10px] text-brand-primary opacity-50 group-hover:opacity-100 transition-opacity">0{idx + 1}</span>
                                <span className="text-lg font-medium text-brand-text/90 group-hover:text-brand-text transition-colors">{s}</span>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>

            <Button onClick={onContinue} className="mt-12 text-xl font-black tracking-widest uppercase py-6 px-12 w-full shadow-[0_0_30px_rgba(99,102,241,0.2)]">
                Continue to HBDI Calibration
            </Button>
        </Card>
    );
};

export default MTraResultsScreen;
