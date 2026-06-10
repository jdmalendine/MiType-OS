import React, { useState } from 'react';
import Reflex from './CircuitBreaker';
import TickTockGame from './games/RecallClockGame';
import PatternChallengeGame from './games/PatternChallengeGame';
import { Zap, Clock, BrainCircuit } from 'lucide-react';

type ActiveTab = 'pattern' | 'reflex' | 'tick-tock';

const MiShiftGym: React.FC = () => {
    const [activeTab, setActiveTab] = useState<ActiveTab>('pattern');

    const renderTabContent = () => {
        switch (activeTab) {
            case 'pattern':
                return <PatternChallengeGame />;
            case 'reflex':
                return <Reflex />;
            case 'tick-tock':
                 return <TickTockGame />;
            default:
                return null;
        }
    };
    
    const tabs = [
        { id: 'pattern', label: 'NEURAL PATTERN', icon: BrainCircuit },
        { id: 'reflex', label: 'REFLEX CALIBRATION', icon: Zap },
        { id: 'tick-tock', label: 'TEMPORAL RECALL', icon: Clock },
    ];

    return (
        <div className="space-y-12">
            <div className="glass-panel p-2 rounded-2xl flex items-center justify-center gap-2 flex-wrap border border-brand-border/20 shadow-[0_0_40px_rgba(0,0,0,0.4)]">
                 {tabs.map(tab => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id as ActiveTab)}
                        className={`px-6 py-3 rounded-xl font-black transition-all duration-300 text-xs flex items-center gap-3 uppercase tracking-widest font-header italic ${
                            activeTab === tab.id 
                            ? 'bg-brand-primary text-brand-text shadow-[0_0_20px_rgba(99,102,241,0.4)] scale-105 border border-white/20' 
                            : 'text-brand-text-muted hover:text-brand-text hover:bg-white/5'
                        }`}
                    >
                       <tab.icon size={18} className={activeTab === tab.id ? 'animate-pulse' : ''} />
                       {tab.label}
                    </button>
                 ))}
            </div>
            <div className="animate-fade-in">
                {renderTabContent()}
            </div>
        </div>
    );
};

export default MiShiftGym;