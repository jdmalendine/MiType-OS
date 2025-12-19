
import React, { useState } from 'react';
import { UserProfile } from '../types';
import AccessibilitySettings from './AccessibilitySettings';
import BackupDashboard from './BackupDashboard';
import { Eye, FileKey, Settings, FileText, Download } from 'lucide-react';
import Card from './Card';
import Button from './Button';
import { generatePDF } from '../services/pdfService';

interface SettingsDashboardProps {
    userProfile: UserProfile;
    onImportProfile: (data: UserProfile) => void;
    currentColorMode: string;
    setColorMode: (mode: string) => void;
}

type ActiveTab = 'accessibility' | 'backup' | 'report';

const SettingsDashboard: React.FC<SettingsDashboardProps> = ({ userProfile, onImportProfile, currentColorMode, setColorMode }) => {
    const [activeTab, setActiveTab] = useState<ActiveTab>('accessibility');

    const tabs = [
        { id: 'accessibility', label: 'Accessibility', icon: Eye },
        { id: 'backup', label: 'Backup & Restore', icon: FileKey },
        { id: 'report', label: 'Reports', icon: FileText },
    ];

    const handleDownloadPDF = () => {
        try {
            generatePDF(userProfile);
        } catch (e) {
            console.error("PDF Generation failed:", e);
            alert("Failed to generate PDF. Please ensure your browser supports this feature.");
        }
    };

    const renderTabContent = () => {
        switch (activeTab) {
            case 'accessibility':
                return <AccessibilitySettings currentColorMode={currentColorMode} setColorMode={setColorMode} />;
            case 'backup':
                return <BackupDashboard userProfile={userProfile} onImportProfile={onImportProfile} />;
            case 'report':
                return (
                    <div className="space-y-8 animate-fade-in">
                        <Card>
                             <h2 className="text-xl font-bold mb-2 flex items-center gap-2"><FileText /> Cognitive Profile Report</h2>
                             <p className="text-brand-text-muted mb-6">Download a comprehensive PDF report of your MiType+ Cognitive Profile. This report includes your detailed analysis (Archetype, Egotend, Highertend) and a record of your assessment answers.</p>
                             <Button onClick={handleDownloadPDF} className="w-full flex items-center justify-center gap-2 py-4 text-lg">
                                <Download size={20} /> Download Full Report
                             </Button>
                        </Card>
                        <Card>
                             <h3 className="font-semibold mb-2">What is included?</h3>
                             <ul className="list-disc list-inside text-sm text-brand-text-muted space-y-1">
                                <li>Full Cognitive Profile Summary</li>
                                <li>Egotend & Highertend Definitions</li>
                                <li>Complete MTra Assessment Data</li>
                                <li>HBDI & MBTI Selection Record</li>
                             </ul>
                        </Card>
                    </div>
                );
            default:
                return null;
        }
    };

    return (
        <div className="space-y-8">
             <div className="flex items-center gap-2 text-2xl font-bold">
                <Settings size={28} />
                <h1>Settings</h1>
            </div>
            <div className="border-b border-brand-border flex">
                {tabs.map(tab => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id as ActiveTab)}
                        className={`flex-1 text-center py-3 px-2 font-semibold transition-colors flex items-center justify-center gap-2 ${
                            activeTab === tab.id
                                ? 'text-brand-primary border-b-2 border-brand-primary'
                                : 'text-brand-text-muted hover:text-brand-text'
                        }`}
                    >
                        <tab.icon size={16} />
                        {tab.label}
                    </button>
                ))}
            </div>
            <div>
                {renderTabContent()}
            </div>
        </div>
    );
};

export default SettingsDashboard;