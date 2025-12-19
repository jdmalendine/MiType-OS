
import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
}

const Card: React.FC<CardProps> = ({ children, className = '' }) => {
  return (
    <div className={`bg-brand-surface border border-brand-border rounded-lg p-6 transition-all duration-300 hover:scale-[1.02] hover:shadow-lg hover:shadow-brand-primary/10 ${className}`}>
      {children}
    </div>
  );
};

export default Card;
