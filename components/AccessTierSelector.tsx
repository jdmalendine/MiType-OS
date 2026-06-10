
import React from 'react';
import Card from './Card';
import Button from './Button';
import { ChevronLeft } from 'lucide-react';

const AccessTierSelector: React.FC<{ 
    onSelect: (tier: 'basic' | 'full' | 'questions') => void,
    onBack: () => void 
}> = ({ onSelect, onBack }) => (
    <Card className="max-w-lg mx-auto text-center p-12">
        <div className="flex items-center mb-4">
            <button onClick={onBack} className="p-2 hover:bg-white/10 rounded-full transition-colors mr-2">
                <ChevronLeft size={24} />
            </button>
            <h1 className="text-4xl font-black font-header tracking-tighter uppercase italic">Welcome to MiType+</h1>
        </div>
        <p className="text-brand-text-muted mb-10 font-medium leading-relaxed">Select your neural access parameters to initialize the cognitive OS experience.</p>
        <div className="space-y-6">
            <Button onClick={() => onSelect('full')} className="w-full py-6 text-xl font-black tracking-widest uppercase shadow-[0_0_30px_rgba(99,102,241,0.3)]">Full Access Assessment</Button>
            <Button onClick={() => onSelect('questions')} variant="secondary" className="w-full py-4 text-xs font-black tracking-[0.3em] uppercase">See questions</Button>
        </div>
    </Card>
);

export default AccessTierSelector;
