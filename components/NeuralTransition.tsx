import React from 'react';
import { motion, AnimatePresence } from 'motion/react';

interface NeuralTransitionProps {
  children: React.ReactNode;
  show: boolean;
  className?: string;
}

const NeuralTransition: React.FC<NeuralTransitionProps> = ({ children, show, className = '' }) => {
  return (
    <AnimatePresence mode="wait">
      {show && (
        <motion.div
          key="neural-content"
          initial={{ opacity: 0, scale: 0.95, filter: 'blur(10px)' }}
          animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
          exit={{ 
            opacity: 0, 
            scale: 1.05, 
            filter: 'blur(20px) brightness(1.5)',
            transition: { duration: 0.4, ease: "circIn" }
          }}
          transition={{ 
            duration: 0.6, 
            ease: [0.16, 1, 0.3, 1] // Custom ease-out-expo
          }}
          className={`relative ${className}`}
        >
          {/* Neural Assembly Lines (SVG) */}
          <svg className="absolute inset-0 w-full h-full pointer-events-none -z-10 opacity-30" overflow="visible">
            <motion.path
                d="M 0 0 L 100 100 M 0 100 L 100 0"
                stroke="currentColor"
                strokeWidth="0.5"
                fill="none"
                initial={{ pathLength: 0, opacity: 0 }}
                animate={{ pathLength: 1, opacity: 0.2 }}
                exit={{ pathLength: 0, opacity: 0 }}
                transition={{ duration: 1, ease: "easeInOut" }}
                className="text-brand-primary"
                style={{ vectorEffect: 'non-scaling-stroke' }}
            />
            {/* Random neural paths */}
            {[...Array(5)].map((_, i) => (
                <motion.path
                    key={i}
                    d={`M ${Math.random() * 100} ${Math.random() * 100} Q ${Math.random() * 100} ${Math.random() * 100} ${Math.random() * 100} ${Math.random() * 100}`}
                    stroke="currentColor"
                    strokeWidth="0.2"
                    fill="none"
                    initial={{ pathLength: 0, opacity: 0 }}
                    animate={{ pathLength: 1, opacity: 0.15 }}
                    exit={{ pathLength: 0, opacity: 0 }}
                    transition={{ duration: 0.8, delay: i * 0.1 }}
                    className="text-brand-primary"
                    style={{ vectorEffect: 'non-scaling-stroke' }}
                />
            ))}
          </svg>
          
          {children}
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default NeuralTransition;
