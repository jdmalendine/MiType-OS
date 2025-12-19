import React from 'react';
import Card from './Card';
import { Eye } from 'lucide-react';

interface AccessibilitySettingsProps {
    currentColorMode: string;
    setColorMode: (mode: string) => void;
}

const colorModes = [
    { id: 'normal', name: 'Normal', description: 'Default application color theme.' },
    { id: 'monochrome', name: 'Monochromatism', description: 'Simulates total color blindness. Useful for checking contrast.' },
    { id: 'protanopia', name: 'Protanopia', description: 'Simulates red-blindness. Reds appear as dark, brownish-yellow.' },
    { id: 'deuteranopia', name: 'Deuteranopia', description: 'Simulates green-blindness. Greens appear as brownish-yellow.' },
    { id: 'tritanopia', name: 'Tritanopia', description: 'Simulates blue-blindness. Blues appear greenish and yellows appear pinkish.' },
];

const AccessibilitySettings: React.FC<AccessibilitySettingsProps> = ({ currentColorMode, setColorMode }) => {
    return (
        <div className="space-y-8">
            <Card>
                <h1 className="text-2xl font-bold mb-2 flex items-center gap-2"><Eye /> Accessibility Settings</h1>
                <p className="text-brand-text-muted">Adjust display settings for different visual needs. These modes simulate how the app might look to users with various types of color vision deficiency.</p>
            </Card>

            <Card>
                <h2 className="text-xl font-bold mb-4">Color Vision Simulation</h2>
                <fieldset>
                    <legend className="sr-only">Choose a color vision simulation mode</legend>
                    <div className="space-y-4">
                        {colorModes.map((mode) => (
                            <label
                                key={mode.id}
                                className={`flex items-center p-4 rounded-lg border-2 cursor-pointer transition-all ${
                                    currentColorMode === mode.id
                                        ? 'bg-brand-primary/10 border-brand-primary'
                                        : 'bg-brand-surface border-brand-border hover:border-brand-text-muted'
                                }`}
                            >
                                <input
                                    type="radio"
                                    name="color-mode"
                                    value={mode.id}
                                    checked={currentColorMode === mode.id}
                                    onChange={() => setColorMode(mode.id)}
                                    className="h-5 w-5 text-brand-primary bg-brand-bg border-brand-border focus:ring-brand-primary"
                                />
                                <span className="ml-4 flex flex-col">
                                    <span className="text-lg font-semibold text-brand-text">{mode.name}</span>
                                    <span className="text-sm text-brand-text-muted">{mode.description}</span>
                                </span>
                            </label>
                        ))}
                    </div>
                </fieldset>
            </Card>
        </div>
    );
};

export default AccessibilitySettings;
