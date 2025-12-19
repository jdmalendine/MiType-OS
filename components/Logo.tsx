
import React from 'react';

const Logo: React.FC<{ size?: number; className?: string; showLetters?: boolean; }> = ({ size = 24, className = '', showLetters = true }) => {
    const containerStyle = { width: size, height: size };
    let mainFontSize, multiLetterFontSize;

    if (size >= 64) { // For Welcome Screen
        mainFontSize = '2rem';
        multiLetterFontSize = '1.6rem';
    } else if (size >= 48) { // For MiOS boot screen
        mainFontSize = '1.5rem';
        multiLetterFontSize = '1.25rem';
    } else if (size >= 24) { // For desktop nav
        mainFontSize = '0.8rem';
        multiLetterFontSize = '0.65rem';
    } else { // For mobile nav
        mainFontSize = '0.65rem';
        multiLetterFontSize = '0.5rem';
    }

    return (
        <div className={`grid grid-cols-2 gap-[1px] ${className}`} style={containerStyle}>
            <div className="relative bg-hbdi-blue rounded-tl-md flex items-center justify-center text-white font-bold overflow-hidden">
                {showLetters && <span style={{ fontSize: mainFontSize }}>M</span>}
            </div>
            <div className="relative bg-hbdi-yellow rounded-tr-md flex items-center justify-center text-white font-bold overflow-hidden">
                {showLetters && <span style={{ fontSize: mainFontSize }}>I</span>}
            </div>
            <div className="relative bg-hbdi-green rounded-bl-md flex items-center justify-center text-white font-bold overflow-hidden">
                {showLetters && <span style={{ fontSize: multiLetterFontSize }}>Ty</span>}
            </div>
            <div className="relative bg-hbdi-red rounded-br-md flex items-center justify-center text-white font-bold overflow-hidden">
                {showLetters && <span style={{ fontSize: multiLetterFontSize }}>Pe</span>}
            </div>
        </div>
    );
};

export default Logo;
