import React from 'react';
import Card from './Card';
import ElementCaptureGame from './games/ElementCaptureGame';
import { Zap } from 'lucide-react';

const Reflex: React.FC = () => {
    return (
        <div className="space-y-6">
            <Card>
                <h2 className="text-xl font-semibold mb-2 text-center flex items-center justify-center gap-2"><Zap /> Reflex: Element Capture</h2>
                <p className="text-brand-text-muted mb-6 text-center">A game to interrupt cognitive loops. Capture the elements as they appear to reset your focus.</p>
            </Card>
            <Card>
                <ElementCaptureGame />
            </Card>
        </div>
    );
};

export default Reflex;
