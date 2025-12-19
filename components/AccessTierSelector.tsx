
import React from 'react';
import Card from './Card';
import Button from './Button';

const AccessTierSelector: React.FC<{ onSelect: (tier: 'basic' | 'full') => void }> = ({ onSelect }) => (
    <Card className="max-w-md mx-auto text-center">
        <h1 className="text-2xl font-bold mb-4">Welcome to MiType+</h1>
        <p className="text-brand-text-muted mb-6">Choose your access level to begin your journey.</p>
        <div className="space-y-4">
            <Button onClick={() => onSelect('full')} className="w-full">Full Access Assessment</Button>
            <Button onClick={() => onSelect('basic')} variant="secondary" className="w-full" disabled>Basic Taster (Coming Soon)</Button>
        </div>
    </Card>
);

export default AccessTierSelector;
