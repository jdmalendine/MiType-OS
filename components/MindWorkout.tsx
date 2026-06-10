import React from 'react';
import { BrainCircuit, Zap } from 'lucide-react';
import Card from './Card';
import RapidPatternRecognition from './games/RapidPatternRecognition';

const Pattern: React.FC = () => {
    return (
        <div className="space-y-10">
            <div className="flex items-center gap-4 text-3xl font-black font-header tracking-tighter italic uppercase">
                <div className="p-3 glass-panel rounded-xl text-brand-primary shadow-[0_0_20px_rgba(99,102,241,0.3)]">
                    <BrainCircuit size={32} />
                </div>
                <h1>NEURAL PATTERN WORKOUT</h1>
            </div>

            <Card>
                <h2 className="text-2xl font-black mb-4 flex items-center gap-3 font-header tracking-tight italic uppercase"><Zap className="text-hbdi-yellow" /> RAPID RECOGNITION</h2>
                <p className="text-brand-text-muted leading-relaxed font-medium max-w-3xl">Sharpen your cognitive architecture with this high-velocity neural challenge. Designed to optimize focus, processing speed, and pattern synthesis.</p>
            </Card>

            <Card className="p-0 overflow-hidden border-0 shadow-[0_0_50px_rgba(0,0,0,0.5)]">
                 <RapidPatternRecognition />
            </Card>
        </div>
    );
};

export default Pattern;
