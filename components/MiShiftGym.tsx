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
        { id: 'pattern', label: 'Pattern', icon: BrainCircuit },
        { id: 'reflex', label: 'Reflex', icon: Zap },
        { id: 'tick-tock', label: 'Tick Tock', icon: Clock },
    ];

    return (
        <div className="space-y-8">
            <div className="bg-brand-surface border border-brand-border rounded-lg p-2 flex items-center justify-center space-x-2 flex-wrap">
                 {tabs.map(tab => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id as ActiveTab)}
                        className={`px-4 py-2 rounded-md font-semibold transition-colors text-sm flex items-center gap-2 ${activeTab === tab.id ? 'bg-brand-primary text-white' : 'text-brand-text-muted hover:bg-brand-border'}`}
                    >
                       <tab.icon size={16} />
                       {tab.label}
                    </button>
                 ))}
            </div>
            <div>
                {renderTabContent()}
            </div>
        </div>
    );
};

export default MiShiftGym;