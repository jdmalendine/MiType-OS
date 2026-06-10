
import React from 'react';

const Logo: React.FC<{ size?: number; className?: string; showLetters?: boolean; }> = ({ size = 24, className = '', showLetters = true }) => {
    const containerStyle = { width: size, height: size };
    let mainFontSize, multiLetterFontSize;

    if (size >= 80) { // For MiOS boot screen
        mainFontSize = '2.5rem';
        multiLetterFontSize = '2rem';
    } else if (size >= 64) { // For Welcome Screen
        mainFontSize = '2rem';
        multiLetterFontSize = '1.6rem';
    } else if (size >= 48) {
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
        <div className={`grid grid-cols-2 gap-[2px] ${className} p-[2px] bg-white/5 rounded-2xl backdrop-blur-xl shadow-[0_0_30px_rgba(255,255,255,0.05)] border border-white/10 group hover:scale-110 transition-transform duration-500`} style={containerStyle}>
            <div className="relative bg-gradient-to-br from-hbdi-blue via-blue-600 to-blue-900 rounded-tl-xl flex items-center justify-center text-brand-text font-black overflow-hidden shadow-[inset_0_0_10px_rgba(255,255,255,0.2)]">
                {showLetters && <span style={{ fontSize: mainFontSize }} className="drop-shadow-[0_0_10px_rgba(255,255,255,0.5)] z-10 font-header italic">M</span>}
                <div className="absolute inset-0 bg-white/10 opacity-30 skew-x-12 translate-x-2 group-hover:translate-x-4 transition-transform duration-700"></div>
            </div>
            <div className="relative bg-gradient-to-br from-hbdi-yellow via-yellow-500 to-yellow-800 rounded-tr-xl flex items-center justify-center text-brand-text font-black overflow-hidden shadow-[inset_0_0_10px_rgba(255,255,255,0.2)]">
                {showLetters && <span style={{ fontSize: mainFontSize }} className="drop-shadow-[0_0_10px_rgba(255,255,255,0.5)] z-10 font-header italic">I</span>}
                <div className="absolute inset-0 bg-white/10 opacity-30 -skew-x-12 -translate-x-2 group-hover:-translate-x-4 transition-transform duration-700"></div>
            </div>
            <div className="relative bg-gradient-to-br from-hbdi-green via-green-600 to-green-900 rounded-bl-xl flex items-center justify-center text-brand-text font-black overflow-hidden shadow-[inset_0_0_10px_rgba(255,255,255,0.2)]">
                {showLetters && <span style={{ fontSize: multiLetterFontSize }} className="drop-shadow-[0_0_10px_rgba(255,255,255,0.5)] z-10 font-header italic">Ty</span>}
                <div className="absolute inset-0 bg-white/10 opacity-30 skew-x-12 translate-x-2 group-hover:translate-x-4 transition-transform duration-700"></div>
            </div>
            <div className="relative bg-gradient-to-br from-hbdi-red via-red-600 to-red-900 rounded-br-xl flex items-center justify-center text-brand-text font-black overflow-hidden shadow-[inset_0_0_10px_rgba(255,255,255,0.2)]">
                {showLetters && <span style={{ fontSize: multiLetterFontSize }} className="drop-shadow-[0_0_10px_rgba(255,255,255,0.5)] z-10 font-header italic">Pe</span>}
                <div className="absolute inset-0 bg-white/10 opacity-30 -skew-x-12 -translate-x-2 group-hover:-translate-x-4 transition-transform duration-700"></div>
            </div>
        </div>
    );
};

export default Logo;
