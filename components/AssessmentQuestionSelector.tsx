
import React from 'react';
import Card from './Card';
import Button from './Button';
import { ChevronLeft } from 'lucide-react';

interface AssessmentQuestionSelectorProps {
    onSelect: (type: 'mtra' | 'hbdi' | 'mbti') => void;
    onBack: () => void;
}

const AssessmentQuestionSelector: React.FC<AssessmentQuestionSelectorProps> = ({ onSelect, onBack }) => (
    <Card className="max-w-lg mx-auto text-center p-12">
        <div className="flex items-center mb-6">
            <button onClick={onBack} className="p-2 hover:bg-white/10 rounded-full transition-colors mr-2">
                <ChevronLeft size={24} />
            </button>
            <h1 className="text-3xl font-black font-header tracking-tighter uppercase italic">Assessment Modules</h1>
        </div>
        <p className="text-brand-text-muted mb-10 font-medium leading-relaxed">Select a module to review its diagnostic neural probes.</p>
        <div className="grid grid-cols-1 gap-4">
            <Button onClick={() => onSelect('mtra')} className="py-4 text-sm font-black tracking-widest uppercase">
                MTra Questions (Change Threshold)
            </Button>
            <Button onClick={() => onSelect('hbdi')} className="py-4 text-sm font-black tracking-widest uppercase">
                HBDI Questions (Cognitive Quadrants)
            </Button>
            <Button onClick={() => onSelect('mbti')} className="py-4 text-sm font-black tracking-widest uppercase">
                MBTI Questions (Base Orientation)
            </Button>
        </div>
    </Card>
);

export default AssessmentQuestionSelector;
