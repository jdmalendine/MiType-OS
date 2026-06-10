
import React, { useState } from 'react';
import { UserProfile } from '../types';
import { useScript } from '../hooks/useScript';
import Card from './Card';
import Button from './Button';
import Modal from './Modal';
import Logo from './Logo';

const SECRET_KEY = "MiType-Static-Secret-Key-For-Demo";

const WelcomeScreen: React.FC<{
    onChoice: (choice: 'assessment' | 'dashboard' | 'clinician') => void;
    isProfileComplete: boolean;
    onImportProfile: (data: UserProfile) => void;
}> = ({ onChoice, isProfileComplete, onImportProfile }) => {
    useScript("https://cdnjs.cloudflare.com/ajax/libs/crypto-js/4.1.1/crypto-js.min.js");

    const [isImportModalOpen, setIsImportModalOpen] = useState(false);
    const [importCode, setImportCode] = useState('');
    const [error, setError] = useState('');

    const handleImport = () => {
        if (!importCode) {
            setError('Please paste your import code.');
            return;
        }
        // @ts-ignore
        if (typeof CryptoJS === 'undefined') {
            setError("Encryption library not loaded yet. Please wait a moment and try again.");
            return;
        }

        setError('');
        try {
            // @ts-ignore
            const bytes = CryptoJS.AES.decrypt(importCode, SECRET_KEY);
            // @ts-ignore
            const decryptedString = bytes.toString(CryptoJS.enc.Utf8);
            if(!decryptedString) {
                throw new Error("Decryption failed. Invalid code or key.");
            }
            const decryptedData = JSON.parse(decryptedString);

            if (decryptedData.accessTier && decryptedData.baseArchetype) {
                onImportProfile(decryptedData);
                setIsImportModalOpen(false);
            } else {
                throw new Error("Invalid data structure in imported profile.");
            }
        } catch (e) {
            console.error(e);
            setError('Import failed. The code is invalid or corrupted.');
        }
    };

    return (
        <>
            <Card className="max-w-lg mx-auto text-center p-12 glass-panel border-brand-primary/30">
                <div className="flex justify-center mb-8">
                    <Logo size={120} />
                </div>
                <h1 className="text-5xl font-extrabold mb-6 font-header tracking-tight">MiType+ OS</h1>
                <p className="text-brand-text-muted mb-12 text-xl font-light leading-relaxed">Welcome to your personal dashboard for self-awareness and growth. Choose your path to begin.</p>
                <div className="space-y-6">
                    <Button onClick={() => onChoice('assessment')} className="w-full text-xl py-4 rounded-2xl">
                        {isProfileComplete ? 'Retake Assessment' : 'Start Your Assessment'}
                    </Button>
                    <Button
                        onClick={() => onChoice('dashboard')}
                        variant="secondary"
                        className="w-full text-xl py-4 rounded-2xl"
                        disabled={!isProfileComplete}
                        aria-disabled={!isProfileComplete}
                    >
                        Go to OS Dashboard
                    </Button>
                </div>
                <div className="mt-10 flex flex-col gap-4">
                    <button onClick={() => setIsImportModalOpen(true)} className="text-brand-primary hover:text-brand-primary-hover transition-colors font-medium">
                        Have an export code? Import profile.
                    </button>
                    <button onClick={() => onChoice('clinician')} className="text-brand-text-muted hover:text-brand-primary transition-colors text-[10px] font-black uppercase tracking-[0.3em] opacity-40 hover:opacity-100">
                        Clinician Access
                    </button>
                </div>
                {!isProfileComplete && <p className="text-sm text-brand-text-muted mt-8 opacity-60">The OS Dashboard will be available once you complete the assessment.</p>}
            </Card>

            <Modal isOpen={isImportModalOpen} onClose={() => setIsImportModalOpen(false)} title="Import Profile">
                <div className="space-y-4">
                    <p className="text-brand-text-muted">Paste your encrypted code below to restore your profile. This will overwrite any existing data.</p>
                    <textarea
                        value={importCode}
                        onChange={(e) => setImportCode(e.target.value)}
                        placeholder="Paste your code here..."
                        className="w-full h-32 bg-brand-bg border border-brand-border rounded-md p-2 font-mono text-xs"
                        aria-label="Import code input"
                    />
                    {error && <p className="text-red-500 text-sm text-center">{error}</p>}
                    <Button onClick={handleImport} className="w-full">
                        Import and Launch OS
                    </Button>
                </div>
            </Modal>
        </>
    );
};

export default WelcomeScreen;
