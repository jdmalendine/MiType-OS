import React from 'react';
import Card from './Card';
import RapidPatternRecognition from './games/RapidPatternRecognition';

const Pattern: React.FC = () => {
    return (
        <div className="space-y-6">
            <Card>
                <h2 className="text-xl font-semibold mb-2 text-center">Pattern: Rapid Recognition</h2>
                <p className="text-brand-text-muted mb-6 text-center">Sharpen your cognitive skills with this interactive challenge designed to improve focus and processing speed.</p>
            </Card>
            <Card>
                 <RapidPatternRecognition />
            </Card>
        </div>
    );
};

export default Pattern;
