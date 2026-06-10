
import React from 'react';

const LoadingSpinner: React.FC<{ size?: number }> = ({ size = 12 }) => {
  return (
    <div className="flex justify-center items-center relative">
      {/* Outer spinning ring */}
      <div
        className="animate-spin rounded-full border-2 border-brand-primary/20 border-t-brand-primary shadow-[0_0_15px_rgba(99,102,241,0.3)]"
        style={{ width: size * 4, height: size * 4 }}
      ></div>
      
      {/* Inner counter-spinning ring */}
      <div
        className="absolute animate-spin-reverse rounded-full border border-brand-secondary/20 border-b-brand-secondary shadow-[0_0_10px_rgba(236,72,153,0.2)]"
        style={{ width: size * 2.5, height: size * 2.5 }}
      ></div>

      {/* Center pulsing core */}
      <div
        className="absolute rounded-full bg-white animate-pulse shadow-[0_0_20px_rgba(255,255,255,0.5)]"
        style={{ width: size * 0.8, height: size * 0.8 }}
      ></div>
    </div>
  );
};

export default LoadingSpinner;