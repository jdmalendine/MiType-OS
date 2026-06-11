
import React, { useState } from 'react';
import { UserProfile } from '../types';
import BackupDashboard from './BackupDashboard';
import { Eye, FileKey, Settings, FileText, Download, Copy, Terminal, Database, ShieldCheck, Watch } from 'lucide-react';
import Card from './Card';
import Button from './Button';
import { generatePDF } from '../services/pdfService';
import { exportWatchProfileAsJson } from '../services/watchProfile';

interface SettingsDashboardProps {
    userProfile: UserProfile;
    onImportProfile: (data: UserProfile) => void;
}

type ActiveTab = 'backup' | 'report' | 'strings';

const SettingsDashboard: React.FC<SettingsDashboardProps> = ({ userProfile, onImportProfile }) => {
    const [activeTab, setActiveTab] = useState<ActiveTab>('backup');
    const [isGenerating, setIsGenerating] = useState(false);
    const [copyStatus, setCopyStatus] = useState<string | null>(null);

    const tabs = [
        { id: 'backup', label: 'Backup & Restore', icon: FileKey },
        { id: 'report', label: 'Reports', icon: FileText },
        { id: 'strings', label: 'Profile Strings', icon: Terminal },
        { id: 'wearables', label: 'Watch Companion', icon: Watch },
    ];

    const generateMtraString = () => {
        if (!userProfile.mtraAnswers) return "00000000000000000000";
        let str = "";
        for (let i = 0; i < 20; i++) {
            str += userProfile.mtraAnswers[i.toString()] || "0";
        }
        return str;
    };

    const generateHbdiString = () => {
        if (!userProfile.hbdiAnswers) return "BBBBBBBBBBBBBBBBBBBB";
        let str = "";
        const reverseMap: Record<string, string> = { a: 'B', b: 'G', c: 'R', d: 'Y' };
        for (let i = 0; i < 20; i++) {
            str += reverseMap[userProfile.hbdiAnswers[i.toString()]] || "B";
        }
        return str;
    };

    const generateMbtiString = () => {
        if (!userProfile.mbtiAnswers) return "11111111111111111111";
        let str = "";
        const reverseMap: Record<string, string> = { a: '1', b: '2' };
        for (let i = 0; i < 20; i++) {
            str += reverseMap[userProfile.mbtiAnswers[i.toString()]] || "1";
        }
        return str;
    };

    const copyToClipboard = (text: string, label: string) => {
        navigator.clipboard.writeText(text);
        setCopyStatus(label);
        setTimeout(() => setCopyStatus(null), 2000);
    };

    const downloadTxt = (text: string, filename: string) => {
        const element = document.createElement("a");
        const file = new Blob([text], {type: 'text/plain'});
        element.href = URL.createObjectURL(file);
        element.download = filename;
        document.body.appendChild(element);
        element.click();
    };

    const exportAsJson = () => {
        const data = {
            mtra: generateMtraString(),
            hbdi: generateHbdiString(),
            mbti: generateMbtiString(),
            timestamp: new Date().toISOString()
        };
        const element = document.createElement("a");
        const file = new Blob([JSON.stringify(data, null, 2)], {type: 'application/json'});
        element.href = URL.createObjectURL(file);
        element.download = `mitype_profile_strings_${new Date().getTime()}.json`;
        document.body.appendChild(element);
        element.click();
    };

    const handleDownloadPDF = async () => {
        setIsGenerating(true);
        try {
            await generatePDF(userProfile);
        } catch (e) {
            console.error("PDF Generation failed:", e);
            alert("Failed to generate PDF. Please ensure your browser supports this feature.");
        } finally {
            setIsGenerating(false);
        }
    };

    const renderTabContent = () => {
        switch (activeTab) {
            case 'backup':
                return <BackupDashboard userProfile={userProfile} onImportProfile={onImportProfile} />;
            case 'report':
                return (
                    <div className="space-y-8 animate-fade-in">
                        <Card className="neon-border-blue glass-panel relative overflow-hidden group">
                             <div className="absolute top-0 right-0 p-6 opacity-5 group-hover:opacity-10 transition-opacity">
                                 <FileText size={120} />
                             </div>
                             <h2 className="text-2xl font-black mb-4 flex items-center gap-3 font-header tracking-tight italic uppercase"><FileText className="text-brand-primary" /> COGNITIVE PROFILE REPORT</h2>
                             <p className="text-brand-text-muted mb-8 leading-relaxed font-medium max-w-2xl">Download a comprehensive, high-density PDF record of your MiType+ Cognitive Architecture. This report serves as a definitive technical document for personal analysis or professional consultation.</p>
                             <Button 
                                onClick={handleDownloadPDF} 
                                disabled={isGenerating}
                                className="w-full flex items-center justify-center gap-3 py-6 text-xl font-black tracking-widest uppercase shadow-[0_0_20px_rgba(99,102,241,0.2)]"
                             >
                                {isGenerating ? (
                                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white"></div>
                                ) : (
                                    <><Download size={24} /> Generate Full Report</>
                                )}
                             </Button>
                        </Card>
                        <Card className="glass-panel">
                             <h3 className="text-lg font-black mb-6 font-header tracking-tight uppercase italic border-b border-brand-border/20 pb-4">Report Composition</h3>
                             <ul className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm font-data text-brand-text-muted">
                                <li className="flex items-start gap-3">
                                    <div className="w-2 h-2 rounded-full bg-brand-primary mt-1 shadow-[0_0_8px_rgba(99,102,241,0.6)]" />
                                    <div>
                                        <span className="text-brand-text font-bold block mb-1">Executive Summary</span>
                                        <span>Archetype definition, Core Drive, and Change Threshold analysis.</span>
                                    </div>
                                </li>
                                <li className="flex items-start gap-3">
                                    <div className="w-2 h-2 rounded-full bg-hbdi-red mt-1 shadow-[0_0_8px_rgba(239,68,68,0.6)]" />
                                    <div>
                                        <span className="text-brand-text font-bold block mb-1">Cognitive States</span>
                                        <span>Side-by-side comparison of Egotend and Highertend states.</span>
                                    </div>
                                </li>
                                <li className="flex items-start gap-3">
                                    <div className="w-2 h-2 rounded-full bg-hbdi-blue mt-1 shadow-[0_0_8px_rgba(59,130,246,0.6)]" />
                                    <div>
                                        <span className="text-brand-text font-bold block mb-1">MTra Threshold Data</span>
                                        <span>Complete 22-point reaction baseline record.</span>
                                    </div>
                                </li>
                                <li className="flex items-start gap-3">
                                    <div className="w-2 h-2 rounded-full bg-hbdi-yellow mt-1 shadow-[0_0_8px_rgba(234,179,8,0.6)]" />
                                    <div>
                                        <span className="text-brand-text font-bold block mb-1">HBDI & MBTI Logs</span>
                                        <span>Full selection history for cognitive preference mapping.</span>
                                    </div>
                                </li>
                             </ul>
                        </Card>
                    </div>
                );
            case 'strings':
                const mtraStr = generateMtraString();
                const hbdiStr = generateHbdiString();
                const mbtiStr = generateMbtiString();

                return (
                    <div className="space-y-8 animate-fade-in pb-10">
                        <div className="glass-panel p-8 border-l-4 border-brand-primary">
                             <h2 className="text-2xl font-black mb-3 font-header tracking-tight uppercase italic flex items-center gap-3">
                                <Database className="text-brand-primary" /> EXPORT PROFILE STRINGS
                             </h2>
                             <p className="text-brand-text-muted font-medium max-w-2xl flex items-center gap-2">
                                <ShieldCheck size={16} className="text-brand-secondary" />
                                Export your current profile strings for backup, sharing, or re-import into another device. Your data stays private.
                             </p>
                        </div>

                        <div className="grid grid-cols-1 gap-6">
                            {[
                                { id: 'mtra', label: 'MTRA STRING', value: mtraStr, color: 'brand-primary' },
                                { id: 'hbdi', label: 'HBDI STRING', value: hbdiStr, color: 'brand-secondary' },
                                { id: 'mbti', label: 'MBTI STRING', value: mbtiStr, color: 'hbdi-red' },
                            ].map((item) => (
                                <Card key={item.id} className="glass-panel hover:bg-white/5 transition-colors group">
                                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                                        <div className="space-y-2">
                                            <h3 className={`text-xs font-black tracking-widest text-${item.color} uppercase`}>{item.label}</h3>
                                            <div className="font-mono text-xl tracking-[0.2em] font-black text-brand-text break-all select-all selection:bg-brand-primary/30">
                                                {item.value}
                                            </div>
                                        </div>
                                        <div className="flex gap-3">
                                            <button 
                                                onClick={() => copyToClipboard(item.value, item.id)}
                                                className="flex-1 md:flex-none p-4 glass-panel hover:border-brand-primary/50 transition-all flex items-center justify-center gap-2 text-xs font-black uppercase tracking-widest group/btn"
                                            >
                                                <Copy size={16} className={copyStatus === item.id ? 'text-brand-secondary' : 'text-brand-text-muted group-hover/btn:text-brand-primary'} />
                                                <span>{copyStatus === item.id ? 'Copied' : 'Copy'}</span>
                                            </button>
                                            <button 
                                                onClick={() => downloadTxt(item.value, `mitype_${item.id}_string.txt`)}
                                                className="flex-1 md:flex-none p-4 glass-panel hover:border-brand-secondary/50 transition-all flex items-center justify-center gap-2 text-xs font-black uppercase tracking-widest group/btn"
                                            >
                                                <Download size={16} className="text-brand-text-muted group-hover/btn:text-brand-secondary" />
                                                <span>.txt</span>
                                            </button>
                                        </div>
                                    </div>
                                </Card>
                            ))}
                        </div>

                        <Button 
                            onClick={exportAsJson}
                            className="w-full bg-brand-primary hover:bg-brand-primary/80 border-none py-6 text-xl font-black tracking-widest uppercase animate-pulse-purple mt-4 transition-all duration-500"
                        >
                            <Database size={24} className="mr-3" /> EXPORT ALL STRINGS AS JSON
                        </Button>
                    </div>
                );
            case 'wearables':
                const watchJson = exportWatchProfileAsJson(userProfile);
                const handleCopyWatch = () => {
                    navigator.clipboard.writeText(watchJson).then(() => {
                        setCopyStatus('watch');
                        setTimeout(() => setCopyStatus(null), 2000);
                    });
                };

                return (
                    <div className="space-y-8 animate-fade-in">
                        <Card className="glass-panel border-l-4 border-brand-primary">
                            <div className="flex items-start gap-4">
                                <div className="p-3 rounded-xl bg-brand-primary/10 text-brand-primary">
                                    <Watch size={28} />
                                </div>
                                <div>
                                    <h2 className="text-2xl font-black mb-2 font-header tracking-tight uppercase italic">SMARTWATCH COMPANION</h2>
                                    <p className="text-brand-text-muted font-medium leading-relaxed">
                                        Export a lightweight, glanceable version of your current MiType profile for <strong>Galaxy Watch (Wear OS)</strong> or Apple Watch infographics.
                                        This is designed as a <span className="text-brand-primary">supplement</span> — it pulls your Base Archetype, Egotend, Highertend, state balance, and quick activations directly from your main assessment results. Small JSON is ideal for the Wear OS Data Layer.
                                    </p>
                                </div>
                            </div>
                        </Card>

                        <Card>
                            <h3 className="font-black uppercase tracking-[2px] text-xs mb-3 text-brand-text-muted">What gets sent to the watch</h3>
                            <ul className="text-sm space-y-1.5 text-brand-text-muted font-medium list-disc pl-5">
                                <li>MBTI + Archetype name + Core Drive</li>
                                <li>Egotend (stress mode) name + key challenge/warning</li>
                                <li>Highertend (flow mode) name + top strength + 3 quick activations / micro-goals</li>
                                <li>Current state balance (for gauges / color coding)</li>
                                <li>Change Threshold + top suppressors</li>
                            </ul>
                        </Card>

                        <Button 
                            onClick={handleCopyWatch}
                            className="w-full py-6 text-lg font-black tracking-widest uppercase flex items-center justify-center gap-3"
                        >
                            <Copy size={20} />
                            {copyStatus === 'watch' ? 'COPIED TO CLIPBOARD — PASTE INTO YOUR WATCH APP' : 'COPY COMPACT WATCH PROFILE (JSON)'}
                        </Button>

                        <div className="text-[10px] text-brand-text-muted font-data bg-black/40 p-4 rounded-xl border border-white/10">
                            This JSON is intentionally small and self-contained — perfect for Wear OS Data Layer (recommended for Galaxy Watch) or Watch Connectivity on iOS.
                            <br /><br />
                            <strong>For Galaxy Watch 4 Classic (Wear OS):</strong> Hard-code this JSON while building your watch app with Gemini. Later, build the Android version of this app (`npx cap open android`), add a Wear module, and use the Data Layer API to push updates from the phone.
                            <br /><br />
                            Future: We can add a native "Sync to Wear" action that automatically pushes the latest profile.
                        </div>
                    </div>
                );
            default:
                return null;
        }
    };

    return (
        <div className="space-y-10">
             <div className="flex items-center gap-4 text-3xl font-black font-header tracking-tighter italic">
                <div className="p-3 glass-panel rounded-xl text-brand-primary shadow-[0_0_20px_rgba(99,102,241,0.3)]">
                    <Settings size={32} />
                </div>
                <h1>SYSTEM SETTINGS</h1>
            </div>
            
            <div className="glass-panel p-2 rounded-2xl flex gap-2 overflow-x-auto scrollbar-hide">
                {tabs.map(tab => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id as ActiveTab)}
                        className={`flex-1 min-w-[140px] py-4 px-4 font-bold rounded-xl transition-all duration-300 flex items-center justify-center gap-3 tracking-wide uppercase text-xs ${
                            activeTab === tab.id
                                ? 'bg-brand-primary/20 text-brand-primary shadow-[0_0_15px_rgba(99,102,241,0.2)] border border-brand-primary/30'
                                : 'text-brand-text-muted hover:bg-white/5 hover:text-brand-text'
                        }`}
                    >
                        <tab.icon size={18} />
                        {tab.label}
                    </button>
                ))}
            </div>
            
            <div className="mt-8">
                {renderTabContent()}
            </div>
        </div>
    );
};

export default SettingsDashboard;
