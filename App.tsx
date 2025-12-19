import React, { useState, useEffect, useCallback } from 'react';
import { UserProfile, AssessmentStage, LogEntry } from './types';
import * as geminiService from './services/geminiService';
import { audioService } from './services/audioService';
import Card from './components/Card';
import Button from './components/Button';
import FoldingSquareLoader from './components/games/FoldingSquareLoader';
import { BrainCircuit, Dna, Menu, X, Home, ClipboardList, Volume2, Settings as SettingsIcon } from 'lucide-react';
import MiMap from './components/MiMap';
import CircuitBreakerDashboard from './components/MiTools';
import MiSound from './components/MiSound';
import TfmAuditConsole from './components/TfmAuditConsole';
import WelcomeScreen from './components/WelcomeScreen';
import AccessTierSelector from './components/AccessTierSelector';
import MTraAssessment from './components/MTraAssessment';
import MTraResultsScreen from './components/MTraResultsScreen';
import HBDIAssessment from './components/HBDIAssessment';
import HBDIResultsScreen from './components/HBDIResultsScreen';
import MBTIAssessment from './components/MBTIAssessment';
import MBTIResultsScreen from './components/MBTIResultsScreen';
import Logo from './components/Logo';
import SettingsDashboard from './components/SettingsDashboard';

// A simple component to render after the profile is generated, replacing the complex MiOS boot screen.
const ProfileCompleteScreen: React.FC<{ userProfile: UserProfile, onEnter: () => void }> = ({ userProfile, onEnter }) => {
    if (!userProfile.baseArchetype) return null;
    return (
        <Card className="text-center max-w-lg mx-auto animate-fade-in">
            <Logo size={48} className="mx-auto mb-4" />
            <h1 className="text-3xl font-bold">Cognitive Profile Complete</h1>
            <p className="text-brand-text-muted mt-2">Welcome, {userProfile.baseArchetype.name}.</p>
            <p className="mt-4">Your personalized Cognitive Dashboard is now ready.</p>
            <Button onClick={onEnter} className="mt-8 text-lg py-3 px-8">
                Enter OS Dashboard
            </Button>
        </Card>
    );
};

const App: React.FC = () => {
    const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
    const [assessmentStage, setAssessmentStage] = useState<AssessmentStage>('welcome');
    const [assessmentData, setAssessmentData] = useState<any>({});
    const [isLoading, setIsLoading] = useState(true);
    const [isGeneratingProfile, setIsGeneratingProfile] = useState(false);
    const [activeTab, setActiveTab] = useState('mimap');
    const [isNavOpen, setIsNavOpen] = useState(false);
    const [colorMode, setColorMode] = useState('normal');

    useEffect(() => {
        const loadInitialData = async () => {
            try {
                // Pre-load all audio assets and load profile/settings
                await audioService.init();
                
                const savedProfileString = localStorage.getItem('userProfile');
                if (savedProfileString) {
                    const savedProfile: UserProfile = JSON.parse(savedProfileString);
                    if (savedProfile.baseArchetype && savedProfile.egotend && savedProfile.highertend) {
                        setUserProfile(savedProfile);
                        setAssessmentStage('complete');
                    }
                }
                const savedColorMode = localStorage.getItem('colorMode');
                if (savedColorMode) {
                    setColorMode(savedColorMode);
                }
            } catch (error) {
                console.error("Failed to load initial data:", error);
                localStorage.clear(); // Clear potentially corrupted data
            } finally {
                setIsLoading(false);
            }
        };

        loadInitialData();
    }, []);

    const saveProfile = useCallback((profile: UserProfile) => {
        setUserProfile(profile);
        localStorage.setItem('userProfile', JSON.stringify(profile));
    }, []);

    const handleSetColorMode = (mode: string) => {
        setColorMode(mode);
        localStorage.setItem('colorMode', mode);
    }

    const handleGoHome = () => {
        setAssessmentStage('welcome');
        setActiveTab('mimap');
    };

    const handleWelcomeChoice = (choice: 'assessment' | 'dashboard') => {
        if (choice === 'assessment') {
            localStorage.removeItem('userProfile');
            localStorage.removeItem('mtraAnswers');
            localStorage.removeItem('hbdiAnswers');
            localStorage.removeItem('mbtiAnswers');
            setUserProfile(null);
            setAssessmentData({});
            setAssessmentStage('tier');
        } else if (choice === 'dashboard' && userProfile?.baseArchetype) {
            setAssessmentStage('complete');
        }
    };

    const handleSelectTier = (tier: 'basic' | 'full') => {
        const newProfile: UserProfile = {
            accessTier: tier, baseArchetype: null, egotend: null, highertend: null,
            ctSuppressors: null, changeThreshold: null, log: [], stateBalance: 0,
            mtraAnswers: {}, hbdiAnswers: {}, mbtiAnswers: {}
        };
        saveProfile(newProfile);
        setAssessmentStage(tier === 'full' ? 'mtra' : 'basic-taster');
    };

    const handleCompleteMTra = (results: { changeThreshold: 'High' | 'Moderate' | 'Low', ctSuppressors: string[] }, answers: Record<number, number>) => {
        if (userProfile) {
            const updatedProfile = { 
                ...userProfile, 
                ...results, 
                mtraAnswers: answers as unknown as Record<string, number> 
            };
            saveProfile(updatedProfile);
            setAssessmentData({ mtraResults: results });
            setAssessmentStage('mtra-results');
        }
    };

    const handleCompleteHBDI = async (answers: { [key: number]: string }) => {
        setAssessmentData((prev: any) => ({ ...prev, hbdiAnswers: answers, hbdiSummary: null }));
        setAssessmentStage('hbdi-results');
        try {
            const summary = await geminiService.analyzeHbdiForSummary(answers);
            setAssessmentData((prev: any) => ({ ...prev, hbdiSummary: summary }));
        } catch (error) {
            console.error("Failed to get HBDI summary:", error);
            setAssessmentData((prev: any) => ({ ...prev, hbdiSummary: "Could not generate summary." }));
        }
    };

    const handleCompleteMBTI = async (answers: { [key: number]: string }) => {
        setAssessmentData((prev: any) => ({ ...prev, mbtiAnswers: answers, mbtiResults: null }));
        setAssessmentStage('mbti-results');
        try {
            const results = await geminiService.analyzeMbtiForSummary(answers);
            setAssessmentData((prev: any) => ({ ...prev, mbtiResults: results }));
        } catch (error) {
            console.error("Failed to get MBTI summary:", error);
            setAssessmentData((prev: any) => ({ ...prev, mbtiResults: { mbtiType: "Error", summary: "Could not generate summary." } }));
        }
    };
    
    const handleGenerateFullProfile = async () => {
        if (!userProfile || !assessmentData.mtraResults || !assessmentData.hbdiAnswers || !assessmentData.mbtiAnswers) return;
        setIsGeneratingProfile(true);

        try {
            const finalProfileParts = await geminiService.generateFullProfileFromAssessments(
                assessmentData.mtraResults,
                assessmentData.hbdiAnswers,
                assessmentData.mbtiAnswers
            );
            const finalProfile: UserProfile = {
                ...userProfile,
                baseArchetype: finalProfileParts.baseArchetype,
                egotend: finalProfileParts.egotend,
                highertend: finalProfileParts.highertend,
                ctSuppressors: assessmentData.mtraResults.ctSuppressors,
                changeThreshold: assessmentData.mtraResults.changeThreshold,
                hbdiAnswers: assessmentData.hbdiAnswers,
                mbtiAnswers: assessmentData.mbtiAnswers,
            };
            saveProfile(finalProfile);
            setAssessmentStage('mios-boot');
        } catch (error) {
            console.error("Failed to generate final profile", error);
            alert("An error occurred while generating your profile. Please try again.");
            setAssessmentStage('mbti-results');
        } finally {
            setIsGeneratingProfile(false);
        }
    };


    const handleLogEvent = (logEntry: LogEntry) => {
        if (!userProfile) return;
        const newLog = [logEntry, ...userProfile.log];
        let newBalance = userProfile.stateBalance || 0;
        if (logEntry.type === 'highertend' || logEntry.type === 'egotend') {
            const balanceChange = logEntry.type === 'highertend' ? 0.1 : -0.1;
            newBalance = Math.max(-1, Math.min(1, newBalance + balanceChange));
        }
        const updatedProfile: UserProfile = { ...userProfile, log: newLog, stateBalance: newBalance };
        saveProfile(updatedProfile);
    };

    const handleImportProfile = (data: UserProfile) => {
        saveProfile(data);
        setAssessmentStage('complete');
    };

    const renderAssessment = () => {
        if (isGeneratingProfile) {
            return <FoldingSquareLoader />;
        }

        switch (assessmentStage) {
            case 'welcome':
                return <WelcomeScreen onChoice={handleWelcomeChoice} isProfileComplete={!!(userProfile && userProfile.baseArchetype)} onImportProfile={handleImportProfile} />;
            case 'tier':
                return <AccessTierSelector onSelect={handleSelectTier} />;
            case 'mtra':
                return <MTraAssessment onComplete={handleCompleteMTra} />;
            case 'mtra-results':
                return <MTraResultsScreen results={assessmentData.mtraResults} onContinue={() => setAssessmentStage('hbdi')} />;
            case 'hbdi':
                return <HBDIAssessment onComplete={handleCompleteHBDI} />;
            case 'hbdi-results':
                return <HBDIResultsScreen summary={assessmentData.hbdiSummary} onContinue={() => setAssessmentStage('mbti')} />;
            case 'mbti':
                return <MBTIAssessment onComplete={handleCompleteMBTI} />;
            case 'mbti-results':
                return <MBTIResultsScreen results={assessmentData.mbtiResults} onContinue={handleGenerateFullProfile} />;
            case 'mios-boot':
                return userProfile ? <ProfileCompleteScreen userProfile={userProfile} onEnter={() => setAssessmentStage('complete')} /> : <FoldingSquareLoader />;
            default:
                return <WelcomeScreen onChoice={handleWelcomeChoice} isProfileComplete={!!(userProfile && userProfile.baseArchetype)} onImportProfile={handleImportProfile} />;
        }
    };

    const renderTabContent = () => {
        if (!userProfile) return <FoldingSquareLoader />;
        switch(activeTab) {
            case 'mimap': return <MiMap userProfile={userProfile} onLogEvent={handleLogEvent} />;
            case 'circuit-breaker-dashboard': return <CircuitBreakerDashboard />;
            case 'misound': return <MiSound />;
            case 'tfm-audit': return <TfmAuditConsole />;
            case 'settings': return <SettingsDashboard userProfile={userProfile} onImportProfile={handleImportProfile} currentColorMode={colorMode} setColorMode={handleSetColorMode} />;
            default: return <MiMap userProfile={userProfile} onLogEvent={handleLogEvent} />;
        }
    };

    if (isLoading) {
        return <FoldingSquareLoader />;
    }

    const wrapperClassName = `theme-${colorMode}`;

    if (assessmentStage !== 'complete' || !userProfile?.baseArchetype) {
        return (
            <div className={wrapperClassName}>
                <div className="min-h-screen flex items-center justify-center p-4 bg-brand-bg relative">
                    {assessmentStage !== 'welcome' && (
                        <Button onClick={handleGoHome} className="absolute top-6 left-6 !p-2 z-10" aria-label="Go Home" variant="secondary">
                            <Home size={20} />
                        </Button>
                    )}
                    {renderAssessment()}
                </div>
            </div>
        );
    }

    const navItems = [
        { id: 'mimap', label: 'MiMap', icon: Dna },
        { id: 'circuit-breaker-dashboard', label: 'Circuit Breaker', icon: BrainCircuit },
        { id: 'misound', label: 'MiSound', icon: Volume2 },
        { id: 'tfm-audit', label: 'TFM Audit', icon: ClipboardList },
        { id: 'settings', label: 'Settings', icon: SettingsIcon },
    ];

    return (
        <div className={`min-h-screen bg-brand-bg ${wrapperClassName}`}>
            <header className="md:hidden bg-brand-surface border-b border-brand-border p-4 flex justify-between items-center fixed top-0 left-0 right-0 z-40 h-16">
                 <h1 className="text-lg font-bold text-white flex items-center gap-2"><Logo size={20} showLetters={false} /> MiType+ OS</h1>
                 <div className="flex items-center gap-2">
                    <button onClick={() => setIsNavOpen(!isNavOpen)} className="text-white">
                        {isNavOpen ? <X size={24} /> : <Menu size={24} />}
                    </button>
                 </div>
            </header>
            <div className="flex">
                <nav className={`fixed top-0 left-0 h-full w-64 bg-brand-surface p-4 border-r border-brand-border flex flex-col z-30 transform transition-transform duration-300 ease-in-out ${isNavOpen ? 'translate-x-0' : '-translate-x-full'} md:relative md:translate-x-0 md:h-screen`}>
                    <div className="hidden md:block mb-8">
                        <h1 className="text-2xl font-bold text-white flex items-center gap-3"><Logo size={28} showLetters={false} /> MiType+ OS</h1>
                    </div>
                     <div className="md:hidden h-16" />
                    <ul className="space-y-2 flex-grow">
                        {navItems.map(item => (
                            <li key={item.id}>
                                <button
                                    onClick={() => { setActiveTab(item.id); setIsNavOpen(false); }}
                                    className={`w-full flex items-center gap-3 p-2 rounded-md text-left transition-colors ${activeTab === item.id ? 'bg-brand-primary text-white' : 'hover:bg-brand-border text-brand-text-muted'}`}
                                >
                                    <item.icon size={20} />
                                    {item.label}
                                </button>
                            </li>
                        ))}
                    </ul>
                    <div className="mt-4 pt-4 border-t border-brand-border space-y-4">
                         <button
                            onClick={handleGoHome}
                            className={`w-full flex items-center gap-3 p-2 rounded-md text-left transition-colors hover:bg-brand-border text-brand-text-muted`}
                        >
                            <Home size={20} />
                            Go Home
                        </button>
                    </div>
                </nav>
                <main className="flex-1 w-full p-4 md:p-8 pt-20 md:pt-8 overflow-y-auto">
                    <div className="max-w-7xl mx-auto">
                        {renderTabContent()}
                    </div>
                </main>
            </div>
        </div>
    );
};

export default App;