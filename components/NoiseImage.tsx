import React from 'react';

interface NoiseImageProps {
  color: string;
}

const NoiseImage: React.FC<NoiseImageProps> = ({ color }) => {
  return (
    <div className="w-full h-full relative bg-black overflow-hidden group">
      {/* Base Noise Layer */}
      <svg className="w-full h-full opacity-40 mix-blend-screen">
        <filter id="noiseFilter">
          <feTurbulence 
            type="fractalNoise" 
            baseFrequency="0.65" 
            numOctaves="4" 
            stitchTiles="stitch"
          />
        </filter>
        <rect width="100%" height="100%" filter="url(#noiseFilter)" />
      </svg>

      {/* Color Overlay */}
      <div 
        className="absolute inset-0 mix-blend-color transition-colors duration-1000"
        style={{ backgroundColor: color }}
      ></div>

      {/* Dynamic Glow Layer */}
      <div 
        className="absolute inset-0 animate-pulse-glow"
        style={{ backgroundColor: color }}
      ></div>
      
      {/* Vignette & Depth Gradients */}
      <div 
        className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black opacity-60"
      ></div>
      <div 
        className="absolute inset-0 bg-gradient-to-r from-black/40 via-transparent to-black/40"
      ></div>

      {/* Scanning Line Effect */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="w-full h-[1px] bg-white/10 absolute top-0 animate-[scan_4s_linear_infinite]"></div>
      </div>
    </div>
  );
};

export default NoiseImage;
