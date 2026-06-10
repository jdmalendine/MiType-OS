import React, { useState } from 'react';
import Reflex from './CircuitBreaker';
import TickTockGame from './games/RecallClockGame';
import PatternChallengeGame from './games/PatternChallengeGame';
import { Zap, Clock, BrainCircuit } from 'lucide-react';

type ActiveTab = 'pattern' | 'reflex' | 'tick-tock';

const CircuitBreakerDashboard: React.FC = () => {
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
                return <PatternChallengeGame />;
        }
    };
    
    const tabs = [
        { id: 'pattern', label: 'NEURAL PATTERN', icon: BrainCircuit },
        { id: 'reflex', label: 'REFLEX CALIBRATION', icon: Zap },
        { id: 'tick-tock', label: 'TEMPORAL RECALL', icon: Clock },
    ];

    return (
        <div className="space-y-10">
            <div className="glass-panel p-1 rounded-2xl flex border border-brand-border/20 shadow-[0_0_30px_rgba(0,0,0,0.3)] overflow-hidden">
                 {tabs.map(tab => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id as ActiveTab)}
                        className={`flex-1 text-center py-4 px-2 font-black transition-all duration-300 flex items-center justify-center gap-3 text-xs uppercase tracking-widest font-header italic ${
                            activeTab === tab.id 
                            ? 'bg-brand-primary text-brand-text shadow-[inset_0_0_20px_rgba(255,255,255,0.1)]' 
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

export default CircuitBreakerDashboard;