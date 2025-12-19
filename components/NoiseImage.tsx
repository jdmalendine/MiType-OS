import React from 'react';

interface NoiseImageProps {
  color: string;
}

const NoiseImage: React.FC<NoiseImageProps> = ({ color }) => {
  return (
    <div className="w-full h-full relative bg-black">
      <svg className="w-full h-full">
        <filter id="noiseFilter">
          <feTurbulence 
            type="fractalNoise" 
            baseFrequency="0.8" 
            numOctaves="3" 
            stitchTiles="stitch"
          />
        </filter>
        <rect width="100%" height="100%" filter="url(#noiseFilter)" />
      </svg>
      <div 
        className="absolute inset-0 mix-blend-color"
        style={{ backgroundColor: color }}
      ></div>
       <div 
        className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-black/50"
      ></div>
    </div>
  );
};

export default NoiseImage;
