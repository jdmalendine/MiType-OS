import React from 'react';
import { Palette } from 'lucide-react';

interface ThemeSelectorProps {
    currentColorMode: string;
    setColorMode: (mode: string) => void;
    className?: string;
}

const colorModes = [
    { id: 'normal', name: 'Normal' },
    { id: 'monochrome', name: 'Monochrome' },
    { id: 'protanopia', name: 'Protanopia' },
    { id: 'deuteranopia', name: 'Deuteranopia' },
    { id: 'tritanopia', name: 'Tritanopia' },
];

const ThemeSelector: React.FC<ThemeSelectorProps> = ({ currentColorMode, setColorMode, className = '' }) => {
    return (
        <div className={`relative flex items-center ${className}`}>
            <label htmlFor="theme-select" className="sr-only">Select Theme</label>
            <Palette size={16} className="absolute left-2 top-1/2 -translate-y-1/2 text-brand-text-muted pointer-events-none" />
            <select
                id="theme-select"
                value={currentColorMode}
                onChange={(e) => setColorMode(e.target.value)}
                className="w-full bg-brand-bg border border-brand-border rounded-md pl-8 pr-2 py-1.5 text-sm appearance-none focus:outline-none focus:ring-2 focus:ring-brand-primary cursor-pointer"
                aria-label="Select color theme"
            >
                {colorModes.map((mode) => (
                    <option key={mode.id} value={mode.id}>
                        {mode.name}
                    </option>
                ))}
            </select>
        </div>
    );
};

export default ThemeSelector;
