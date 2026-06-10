
import React, { useState } from 'react';
import { UserProfile } from '../types';
import Card from './Card';
import Button from './Button';
import { useScript } from '../hooks/useScript';

// Simple symmetric encryption for demonstration purposes.
// In a real application, use a more secure, server-based approach.
const SECRET_KEY = "MiType-Static-Secret-Key-For-Demo";

const BackupDashboard: React.FC<{ userProfile: UserProfile; onImportProfile: (data: UserProfile) => void }> = ({ userProfile, onImportProfile }) => {
    // This hook loads the CryptoJS library for encryption/decryption.
    useScript("https://cdnjs.cloudflare.com/ajax/libs/crypto-js/4.1.1/crypto-js.min.js");

    const [exportCode, setExportCode] = useState('');
    const [importCode, setImportCode] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const handleExport = () => {
        // @ts-ignore
        if (typeof CryptoJS === 'undefined') {
            setError("Encryption library not loaded yet. Please wait a moment and try again.");
            return;
        }
        setError('');
        setSuccess('');
        try {
            const dataString = JSON.stringify(userProfile);
            // @ts-ignore
            const encrypted = CryptoJS.AES.encrypt(dataString, SECRET_KEY).toString();
            setExportCode(encrypted);
            setSuccess('Export code generated successfully.');
        } catch (e) {
            console.error("Export failed:", e);
            setError("Could not generate export code.");
        }
    };

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
        setSuccess('');
        try {
            // @ts-ignore
            const bytes = CryptoJS.AES.decrypt(importCode, SECRET_KEY);
            // @ts-ignore
            const decryptedString = bytes.toString(CryptoJS.enc.Utf8);
            if (!decryptedString) {
                throw new Error("Decryption resulted in an empty string. Invalid key or data.");
            }
            const decryptedData = JSON.parse(decryptedString);
            
            // Basic validation to ensure the imported object looks like a user profile.
            if (decryptedData.accessTier && decryptedData.baseArchetype) {
                onImportProfile(decryptedData);
                setSuccess('Profile imported successfully!');
                setImportCode('');
            } else {
                throw new Error("Invalid data structure in imported profile.");
            }
        } catch (e) {
            console.error("Import failed:", e);
            setError('Import failed. The code is invalid or corrupted.');
        }
    };

    const handleCopy = () => {
        if (!exportCode) return;
        navigator.clipboard.writeText(exportCode)
            .then(() => setSuccess('Code copied to clipboard!'))
            .catch(() => setError('Failed to copy code.'));
    };


    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            <Card className="flex flex-col">
                <h2 className="text-2xl font-black mb-4 font-header tracking-tight uppercase italic">Neural Export</h2>
                <p className="text-brand-text-muted mb-8 font-medium leading-relaxed">Generate a high-security encrypted string to preserve your cognitive architecture. Store this in a secure physical or digital vault.</p>
                <div className="mt-auto">
                    <Button onClick={handleExport} className="w-full py-4 text-lg font-black tracking-widest uppercase shadow-[0_0_20px_rgba(99,102,241,0.2)]">Generate Export Code</Button>
                    {exportCode && (
                        <div className="mt-6 animate-fade-in">
                            <textarea
                                readOnly
                                aria-label="Exported Profile Code"
                                value={exportCode}
                                className="w-full h-40 bg-black/40 border border-brand-border/30 rounded-2xl p-4 font-data text-[10px] leading-relaxed resize-none shadow-inner focus:outline-none"
                            />
                            <Button onClick={handleCopy} variant="secondary" className="mt-4 w-full py-3 text-xs font-black tracking-[0.2em] uppercase shadow-[0_0_15px_rgba(236,72,153,0.1)]">Copy to Secure Clipboard</Button>
                        </div>
                    )}
                </div>
            </Card>
            <Card className="flex flex-col">
                <h2 className="text-2xl font-black mb-4 font-header tracking-tight uppercase italic">Neural Import</h2>
                <p className="text-brand-text-muted mb-8 font-medium leading-relaxed">Restore your cognitive profile from an encrypted string. This operation will overwrite all local neural data with the imported baseline.</p>
                <textarea
                    value={importCode}
                    onChange={(e) => setImportCode(e.target.value)}
                    placeholder="Paste encrypted neural string here..."
                    aria-label="Import Profile Code"
                    className="w-full h-40 bg-black/40 border border-brand-border/30 rounded-2xl p-4 font-data text-[10px] leading-relaxed resize-none shadow-inner focus:outline-none focus:border-brand-primary/50 transition-all duration-300 mb-6"
                />
                <div className="mt-auto">
                    <Button onClick={handleImport} className="w-full py-4 text-lg font-black tracking-widest uppercase shadow-[0_0_20px_rgba(99,102,241,0.2)]">Restore Profile Baseline</Button>
                </div>
            </Card>
            {(error || success) && (
                <div className="md:col-span-2 flex justify-center mt-4">
                    <div className={`glass-panel px-8 py-3 rounded-full border ${error ? 'border-red-500/50 text-red-500' : 'border-hbdi-green/50 text-hbdi-green'} font-black text-xs uppercase tracking-widest animate-pulse`}>
                        {error || success}
                    </div>
                </div>
            )}
        </div>
    );
};

export default BackupDashboard;
