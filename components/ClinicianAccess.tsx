import React, { useState } from 'react';
import Card from './Card';
import Button from './Button';
import { ShieldCheck, Lock, ChevronLeft } from 'lucide-react';

interface ClinicianAccessProps {
    onBack: () => void;
    onAuthenticated: (mtra: string, hbdi: string, mbti: string) => void;
    isAuthenticated: boolean;
    onAuthenticate: (val: boolean) => void;
    isGenerating?: boolean;
}

const ClinicianAccess: React.FC<ClinicianAccessProps> = ({ onBack, onAuthenticated, isAuthenticated, onAuthenticate, isGenerating }) => {
    const [password, setPassword] = useState('');
    const [mtraInput, setMtraInput] = useState('');
    const [hbdiInput, setHbdiInput] = useState('');
    const [mbtiInput, setMbtiInput] = useState('');
    const [error, setError] = useState('');

    const handleAuth = (e: React.FormEvent) => {
        e.preventDefault();
        if (password === 'changethresholdsystem') {
            onAuthenticate(true);
            setError('');
        } else {
            setError('ACCESS DENIED: INVALID NEURAL KEY');
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (isGenerating) return;
        
        if (mtraInput.length !== 20 || hbdiInput.length !== 20 || mbtiInput.length !== 20) {
            setError('ERROR: ALL STRINGS MUST BE EXACTLY 20 CHARACTERS');
            return;
        }
        onAuthenticated(mtraInput, hbdiInput, mbtiInput);
    };

    if (!isAuthenticated) {
        return (
            <Card className="max-w-md mx-auto p-12 text-center">
                <div className="flex items-center mb-6">
                    <button onClick={onBack} className="p-2 hover:bg-white/10 rounded-full transition-colors mr-2">
                        <ChevronLeft size={24} />
                    </button>
                    <h1 className="text-2xl font-black font-header tracking-tighter uppercase italic">Clinician Access</h1>
                </div>
                <div className="p-4 glass-panel rounded-2xl inline-block mb-8 text-brand-primary">
                    <Lock size={48} />
                </div>
                <form onSubmit={handleAuth} className="space-y-6">
                    <input
                        type="password"
                        placeholder="ENTER NEURAL ENCRYPTION KEY"
                        className="w-full bg-black/40 border border-brand-border/30 rounded-xl px-4 py-4 text-center font-mono focus:outline-none focus:border-brand-primary transition-colors"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        autoFocus
                    />
                    {error && <p className="text-hbdi-red text-xs font-bold animate-pulse">{error}</p>}
                    <Button type="submit" className="w-full py-4 text-sm font-black tracking-widest uppercase">
                        Authenticate
                    </Button>
                </form>
            </Card>
        );
    }

    return (
        <Card className="max-w-lg mx-auto p-12 text-center relative overflow-hidden">
            {isGenerating && (
                <div className="absolute inset-0 z-50 bg-brand-bg/80 backdrop-blur-md flex flex-col items-center justify-center gap-6 animate-fade-in">
                    <div className="w-16 h-16 border-t-4 border-brand-primary border-r-4 border-r-transparent rounded-full animate-spin"></div>
                    <div className="space-y-2">
                        <p className="text-brand-primary font-black uppercase tracking-[0.3em] animate-pulse">Neural Injection Active</p>
                        <p className="text-brand-text-muted text-[10px] font-mono italic">Calibrating cognitive vectors...</p>
                    </div>
                </div>
            )}
             <div className="flex items-center mb-6">
                <button onClick={() => onAuthenticate(false)} className="p-2 hover:bg-white/10 rounded-full transition-colors mr-2">
                    <ChevronLeft size={24} />
                </button>
                <h1 className="text-2xl font-black font-header tracking-tighter uppercase italic">Neural Data Input</h1>
            </div>
            <div className="p-4 glass-panel rounded-2xl inline-block mb-8 text-hbdi-green">
                <ShieldCheck size={48} />
            </div>
            <p className="text-brand-text-muted mb-8 font-medium">Inject raw assessment data strings directly into the cognitive OS.</p>
            <form onSubmit={handleSubmit} className="space-y-6 text-left">
                <div>
                    <label className="block text-[10px] font-black uppercase tracking-widest mb-2 px-2">MTra String (20 digits, 1-5)</label>
                    <input
                        type="text"
                        placeholder="e.g. 44555554552322244335"
                        className="w-full bg-black/40 border border-brand-border/30 rounded-xl px-4 py-3 font-mono focus:outline-none focus:border-brand-primary transition-colors"
                        value={mtraInput}
                        onChange={(e) => setMtraInput(e.target.value.replace(/[^1-5]/g, '').slice(0, 20))}
                        disabled={isGenerating}
                    />
                </div>
                <div>
                    <label className="block text-[10px] font-black uppercase tracking-widest mb-2 px-2">HBDI String (20 chars, B/G/R/Y)</label>
                    <input
                        type="text"
                        placeholder="e.g. BGYGGGGGGGGGGYGGGGGG"
                        className="w-full bg-black/40 border border-brand-border/30 rounded-xl px-4 py-3 font-mono focus:outline-none focus:border-brand-primary transition-colors uppercase"
                        value={hbdiInput}
                        onChange={(e) => setHbdiInput(e.target.value.toUpperCase().replace(/[^BGRY]/g, '').slice(0, 20))}
                        disabled={isGenerating}
                    />
                </div>
                <div>
                    <label className="block text-[10px] font-black uppercase tracking-widest mb-2 px-2">MBTI String (20 digits, 1-2)</label>
                    <input
                        type="text"
                        placeholder="e.g. 11111121111211121112"
                        className="w-full bg-black/40 border border-brand-border/30 rounded-xl px-4 py-3 font-mono focus:outline-none focus:border-brand-primary transition-colors"
                        value={mbtiInput}
                        onChange={(e) => setMbtiInput(e.target.value.replace(/[^1-2]/g, '').slice(0, 20))}
                        disabled={isGenerating}
                    />
                </div>
                {error && <p className="text-hbdi-red text-xs font-bold text-center mt-4 animate-pulse">{error}</p>}
                <Button type="submit" className="w-full py-6 text-lg font-black tracking-[0.2em] uppercase mt-4" disabled={isGenerating}>
                    {isGenerating ? "Injecting..." : "Generate Profile"}
                </Button>
            </form>
        </Card>
    );
};

export default ClinicianAccess;
