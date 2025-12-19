
import React, { useState } from 'react';
import { UserProfile } from '../types';
import { useScript } from '../hooks/useScript';
import Card from './Card';
import Button from './Button';
import Modal from './Modal';
import Logo from './Logo';

const SECRET_KEY = "MiType-Static-Secret-Key-For-Demo";

const WelcomeScreen: React.FC<{
    onChoice: (choice: 'assessment' | 'dashboard') => void;
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
            <Card className="max-w-md mx-auto text-center">
                <div className="flex justify-center mb-4">
                    <Logo size={64} />
                </div>
                <h1 className="text-3xl font-bold mb-2">MiType+ Cognitive OS</h1>
                <p className="text-brand-text-muted mb-8">Welcome to your personal dashboard for self-awareness and growth. Choose your path to begin.</p>
                <div className="space-y-4">
                    <Button onClick={() => onChoice('assessment')} className="w-full text-lg py-3">
                        {isProfileComplete ? 'Retake Assessment' : 'Start Your Assessment'}
                    </Button>
                    <Button
                        onClick={() => onChoice('dashboard')}
                        variant="secondary"
                        className="w-full text-lg py-3"
                        disabled={!isProfileComplete}
                        aria-disabled={!isProfileComplete}
                    >
                        Go to OS Dashboard
                    </Button>
                </div>
                <div className="mt-6">
                    <button onClick={() => setIsImportModalOpen(true)} className="text-sm text-brand-primary hover:underline">
                        Have an export code? Import profile.
                    </button>
                </div>
                {!isProfileComplete && <p className="text-xs text-brand-text-muted mt-4">The OS Dashboard will be available once you complete the assessment.</p>}
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
