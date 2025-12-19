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
        { id: 'pattern', label: 'Pattern', icon: BrainCircuit },
        { id: 'reflex', label: 'Reflex', icon: Zap },
        { id: 'tick-tock', label: 'Tick Tock', icon: Clock },
    ];

    return (
        <div className="space-y-8">
            <div className="border-b border-brand-border flex">
                 {tabs.map(tab => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id as ActiveTab)}
                        className={`flex-1 text-center py-3 px-2 font-semibold transition-colors flex items-center justify-center gap-2 ${
                            activeTab === tab.id 
                            ? 'text-brand-primary border-b-2 border-brand-primary' 
                            : 'text-brand-text-muted hover:text-brand-text'
                        }`}
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

export default CircuitBreakerDashboard;