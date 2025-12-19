
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
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <Card>
                <h2 className="text-xl font-bold mb-2">Export Profile</h2>
                <p className="text-brand-text-muted mb-4">Generate an encrypted code to save your profile data. Keep it safe!</p>
                <Button onClick={handleExport}>Generate Export Code</Button>
                {exportCode && (
                    <div className="mt-4">
                        <textarea
                            readOnly
                            aria-label="Exported Profile Code"
                            value={exportCode}
                            className="w-full h-32 bg-brand-bg border border-brand-border rounded-md p-2 font-mono text-xs resize-none"
                        />
                        <Button onClick={handleCopy} className="mt-2 w-full">Copy to Clipboard</Button>
                    </div>
                )}
            </Card>
            <Card>
                <h2 className="text-xl font-bold mb-2">Import Profile</h2>
                <p className="text-brand-text-muted mb-4">Paste your encrypted code here to restore your profile. This will overwrite current data.</p>
                <textarea
                    value={importCode}
                    onChange={(e) => setImportCode(e.target.value)}
                    placeholder="Paste your code here..."
                    aria-label="Import Profile Code"
                    className="w-full h-32 bg-brand-bg border border-brand-border rounded-md p-2 font-mono text-xs resize-none"
                />
                <Button onClick={handleImport} className="mt-2 w-full">Import Profile</Button>
            </Card>
            {error && <p className="md:col-span-2 text-red-500 mt-4 text-center">{error}</p>}
            {success && <p className="md:col-span-2 text-green-500 mt-4 text-center">{success}</p>}
        </div>
    );
};

export default BackupDashboard;
