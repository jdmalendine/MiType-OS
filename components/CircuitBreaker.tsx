import React from 'react';
import Card from './Card';
import ElementCaptureGame from './games/ElementCaptureGame';
import { Zap } from 'lucide-react';

const Reflex: React.FC = () => {
    return (
        <div className="space-y-10">
             <div className="flex items-center gap-4 text-3xl font-black font-header tracking-tighter italic">
                <div className="p-3 glass-panel rounded-xl text-brand-primary shadow-[0_0_20px_rgba(99,102,241,0.3)]">
                    <Zap size={32} />
                </div>
                <h1>CIRCUIT BREAKER</h1>
            </div>
            
            <Card>
                <h2 className="text-2xl font-black mb-4 text-center flex items-center justify-center gap-3 font-header tracking-tight italic"><Zap className="text-brand-primary" /> REFLEX: ELEMENT CAPTURE</h2>
                <p className="text-brand-text-muted mb-8 text-center leading-relaxed font-medium max-w-2xl mx-auto">A game to interrupt cognitive loops. Capture the elements as they appear to reset your focus and recalibrate neural pathways.</p>
            </Card>
            
            <div className="glass-panel rounded-3xl p-8 border border-brand-border/30 shadow-[0_0_50px_rgba(0,0,0,0.5)]">
                <ElementCaptureGame />
            </div>
        </div>
    );
};

export default Reflex;
