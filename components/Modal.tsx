
import React from 'react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, title, children }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex justify-center items-center z-50">
      <div className="bg-brand-surface rounded-lg p-6 w-full max-w-md mx-4 border border-brand-border">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-brand-text">{title}</h2>
          <button onClick={onClose} className="text-brand-text-muted hover:text-brand-text">&times;</button>
        </div>
        <div>{children}</div>
      </div>
    </div>
  );
};

export default Modal;