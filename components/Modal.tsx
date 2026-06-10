
import React from 'react';
import { X } from 'lucide-react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, title, children }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex justify-center items-center z-[100] p-4 animate-fade-in">
      <div className="glass-panel rounded-3xl p-8 w-full max-w-2xl border border-white/10 shadow-[0_0_100px_rgba(0,0,0,0.8)] relative overflow-hidden animate-scale-in">
        {/* Decorative corner glow */}
        <div className="absolute -top-20 -right-20 w-40 h-40 bg-brand-primary/20 rounded-full blur-[60px]" />
        
        <div className="flex justify-between items-center mb-8 relative z-10">
          <h2 className="text-2xl font-black font-header tracking-tight uppercase italic text-brand-text drop-shadow-[0_0_10px_rgba(255,255,255,0.2)]">{title}</h2>
          <button 
            onClick={onClose} 
            className="w-10 h-10 rounded-full glass-panel flex items-center justify-center text-brand-text-muted hover:text-brand-text hover:border-brand-primary/50 transition-all duration-300"
          >
            <X size={20} />
          </button>
        </div>
        <div className="relative z-10">{children}</div>
      </div>
    </div>
  );
};

export default Modal;