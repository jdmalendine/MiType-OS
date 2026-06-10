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
import NeuralTransition from './components/NeuralTransition';
import AssessmentQuestionSelector from './components/AssessmentQuestionSelector';
import ClinicianAccess from './components/ClinicianAccess';

import { MBTI_ARCHETYPE_MAP } from './services/mbtiArchetypeService';

const calculateMbti = (answers: Record<number, string>): string => {
    const scores = { E: 0, I: 0, S: 0, N: 0, T: 0, F: 0, J: 0, P: 0 };
    Object.entries(answers).forEach(([idxStr, val]) => {
        const idx = parseInt(idxStr);
        const choice = val === 'a' ? 1 : 2; // a=1, b=2

        if (idx >= 0 && idx <= 4) {          // Q1-5: E/I
            choice === 1 ? scores.I++ : scores.E++;
        } else if (idx >= 5 && idx <= 9) {   // Q6-10: S/N
            choice === 1 ? scores.N++ : scores.S++;
        } else if (idx >= 10 && idx <= 14) { // Q11-15: T/F
            choice === 1 ? scores.F++ : scores.T++;
        } else if (idx >= 15 && idx <= 19) { // Q16-20: J/P
            choice === 1 ? scores.P++ : scores.J++;
        }
    });

    // Production logic: Majority wins (E>I, N>S, T>F, J>P)
    const result = 
        (scores.E > scores.I ? 'E' : 'I') +
        (scores.N > scores.S ? 'N' : 'S') +
        (scores.T > scores.F ? 'T' : 'F') +
        (scores.J > scores.P ? 'J' : 'P');

    console.log("Calculated MBTI Scores:", scores, "Result:", result);
    return result;
};

const calculateMTra = (answers: Record<number, number>): { changeThreshold: 'High' | 'Moderate' | 'Low', ctSuppressors: string[] } => {
    // 1-5: Emotional Reg (+), 6-10: Flex (+), 11-15: Stress (-), 16-20: Rigidity (-)
    let regFlexCount = 0;
    let stressRigidityCount = 0;
    
    Object.entries(answers).forEach(([idxStr, val]) => {
        const idx = parseInt(idxStr);
        if (idx < 10) regFlexCount += val;
        else stressRigidityCount += val;
    });

    const netScore = regFlexCount - (stressRigidityCount - 20); // Normalized
    let threshold: 'High' | 'Moderate' | 'Low' = 'Moderate';
    if (netScore > 40) threshold = 'High';
    else if (netScore < 10) threshold = 'Low';

    // Simplified suppressor logic for deterministic mode
    const suppressors = [];
    if (answers[10] >= 4 || answers[11] >= 4) suppressors.push("Emotional Reactivity");
    if (answers[12] >= 4 || answers[13] >= 4) suppressors.push("Avoidance");
    if (answers[14] >= 4 || answers[15] >= 4) suppressors.push("Catastrophizing");
    if (answers[16] >= 4 || answers[17] >= 4) suppressors.push("Analysis Paralysis");
    if (answers[18] >= 4 || answers[19] >= 4) suppressors.push("Rigid Thinking");
    
    if (suppressors.length === 0) suppressors.push("Minimal Friction", "Balanced Response", "Neural Alignment");
    
    return { 
        changeThreshold: threshold, 
        ctSuppressors: suppressors.slice(0, 3) 
    };
};

const ProfileCompleteScreen: React.FC<{ userProfile: UserProfile | null, onEnter: () => void }> = ({ userProfile, onEnter }) => {
    useEffect(() => {
        if (userProfile?.baseArchetype) {
            const timer = setTimeout(onEnter, 5000); // Auto-advance after 5 seconds
            return () => clearTimeout(timer);
        }
    }, [onEnter, userProfile]);

    if (!userProfile?.baseArchetype) {
        return (
            <div className="flex flex-col items-center gap-6">
                <FoldingSquareLoader />
                <p className="text-brand-primary font-data text-xs uppercase tracking-[0.3em] animate-pulse">Initializing Neural OS Interface...</p>
            </div>
        );
    }
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
    const [isClinicianAuthenticated, setIsClinicianAuthenticated] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [isGeneratingProfile, setIsGeneratingProfile] = useState(false);
    const [activeTab, setActiveTab] = useState('mimap');
    const [isNavOpen, setIsNavOpen] = useState(false);
    const [theme, setTheme] = useState<'light' | 'dark'>('dark');

    useEffect(() => {
        const loadInitialData = async () => {
            try {
                // Initialize audio service (non-blocking)
                audioService.init().catch(err => console.error("Audio init failed:", err));
                
                const savedProfileString = localStorage.getItem('userProfile');
                if (savedProfileString) {
                    try {
                        const savedProfile: UserProfile = JSON.parse(savedProfileString);
                        if (savedProfile.baseArchetype && savedProfile.egotend && savedProfile.highertend) {
                            setUserProfile(savedProfile);
                            setAssessmentStage('complete');
                        }
                    } catch (e) {
                        console.error("Profile parse failed:", e);
                        localStorage.removeItem('userProfile');
                    }
                }
                setTheme('dark');
            } catch (error) {
                console.error("Failed to load initial data:", error);
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

    const handleGoHome = () => {
        setAssessmentStage('welcome');
        setActiveTab('mimap');
        // We keep isClinicianAuthenticated true if they were authenticated in this session
    };

    const handleWelcomeChoice = (choice: 'assessment' | 'dashboard' | 'clinician') => {
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
        } else if (choice === 'clinician') {
            setAssessmentStage('clinician');
        }
    };

    const handleSelectTier = (tier: 'basic' | 'full' | 'questions') => {
        if (tier === 'questions') {
            setAssessmentStage('question-selector');
            return;
        }
        const newProfile: UserProfile = {
            accessTier: tier as 'basic' | 'full', baseArchetype: null, egotend: null, highertend: null,
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
            setAssessmentData({ mtraResults: results, mtraAnswers: answers });
            setAssessmentStage('mtra-results');
        }
    };

    const handleCompleteHBDI = async (answers: { [key: number]: string }) => {
        if (userProfile) {
            const updatedProfile = { ...userProfile, hbdiAnswers: answers };
            saveProfile(updatedProfile);
        }
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
        if (userProfile) {
            const updatedProfile = { ...userProfile, mbtiAnswers: answers };
            saveProfile(updatedProfile);
        }
        
        // Deterministic MBTI calculation
        const mbtiType = calculateMbti(answers);
        
        setAssessmentData((prev: any) => ({ ...prev, mbtiAnswers: answers, mbtiResults: null }));
        setAssessmentStage('mbti-results');
        try {
            // Still use Gemini for the summary but tell it exactly what type it is
            const results = await geminiService.analyzeMbtiForSummary(answers);
            // Force the deterministic result and use summary from LLM
            setAssessmentData((prev: any) => ({ 
                ...prev, 
                mbtiResults: { ...results, mbtiType } 
            }));
        } catch (error) {
            console.error("Failed to get MBTI summary:", error);
            setAssessmentData((prev: any) => ({ ...prev, mbtiResults: { mbtiType, summary: "Analysis complete." } }));
        }
    };

    const generateDeterministicProfile = (
        mtraResults: { changeThreshold: string; ctSuppressors: string[] },
        hbdiAnswers: Record<number, string>,
        mbtiType: string
    ): UserProfile => {
        const archetypeData = MBTI_ARCHETYPE_MAP[mbtiType] || MBTI_ARCHETYPE_MAP['ISTJ'];

        return {
            accessTier: 'full',
            baseArchetype: {
                name: archetypeData.name,
                coreDrive: archetypeData.coreDrive,
                HBDI: "Strategic Core Profile",
                MBTI: mbtiType,
                CTS: mtraResults.changeThreshold as 'High' | 'Moderate' | 'Low'
            },
            egotend: archetypeData.egotend,
            highertend: archetypeData.highertend,
            ctSuppressors: mtraResults.ctSuppressors,
            changeThreshold: mtraResults.changeThreshold as 'High' | 'Moderate' | 'Low',
            hbdiAnswers: hbdiAnswers,
            mbtiAnswers: {}, // Will be filled
            mtraAnswers: {}, // Will be filled
            log: [],
            stateBalance: 0
        };
    };

    const handleClinicianAuthenticated = async (mtraStr: string, hbdiStr: string, mbtiStr: string) => {
        setIsGeneratingProfile(true);
        console.log("Clinician injection initiated. Strings:", { mtraStr, hbdiStr, mbtiStr });
        const mtraAnswers: Record<number, number> = {};
        const hbdiAnswers: Record<number, string> = {};
        const mbtiAnswers: Record<number, string> = {};

        try {
            // Parse strings
            mtraStr.split('').forEach((char, i) => mtraAnswers[i] = parseInt(char));
            
            hbdiStr.split('').forEach((char, i) => {
                const map: Record<string, string> = { B: 'a', G: 'b', R: 'c', Y: 'd' };
                hbdiAnswers[i] = map[char] || 'a';
            });
            
            mbtiStr.split('').forEach((char, i) => mbtiAnswers[i] = char === '1' ? 'a' : 'b');

            const mtraResults = calculateMTra(mtraAnswers);
            const mbtiType = calculateMbti(mbtiAnswers);

            console.log("Clinician Parsed Data:", { mtraResults, mbtiType });

            let finalProfile: UserProfile;
            try {
                const finalProfileParts = await geminiService.generateFullProfileFromAssessments(
                    mtraResults,
                    hbdiAnswers,
                    mbtiAnswers,
                    mbtiType
                );
                console.log("Gemini Synthesis Response:", finalProfileParts);

                finalProfile = {
                    accessTier: 'full',
                    baseArchetype: {
                        ...finalProfileParts.baseArchetype,
                        MBTI: mbtiType,
                        CTS: mtraResults.changeThreshold as 'High' | 'Moderate' | 'Low'
                    },
                    egotend: finalProfileParts.egotend,
                    highertend: finalProfileParts.highertend,
                    ctSuppressors: mtraResults.ctSuppressors,
                    changeThreshold: mtraResults.changeThreshold as 'High' | 'Moderate' | 'Low',
                    hbdiAnswers,
                    mbtiAnswers,
                    mtraAnswers,
                    log: [],
                    stateBalance: 0
                };
            } catch (aiError) {
                console.error("AI synthesis failed, using deterministic fallback:", aiError);
                finalProfile = {
                    ...generateDeterministicProfile(mtraResults, hbdiAnswers, mbtiType),
                    mbtiAnswers,
                    mtraAnswers
                };
            }

            saveProfile(finalProfile);
            setAssessmentStage('mios-boot');
        } catch (error) {
            console.error("Clinician auto-gen failed:", error);
            alert("Neural injection failed: Check data string integrity.");
        } finally {
            setIsGeneratingProfile(false);
        }
    };
    
    const handleGenerateFullProfile = async () => {
        if (!assessmentData.mtraResults || !assessmentData.hbdiAnswers || !assessmentData.mbtiAnswers || !assessmentData.mbtiResults) {
            console.error("Incomplete assessment data for profile generation:", assessmentData);
            alert("Assessment sequence interrupted. Redirection required.");
            setAssessmentStage('question-selector');
            return;
        }
        setIsGeneratingProfile(true);

        try {
            const mbtiType = assessmentData.mbtiResults.mbtiType;
            console.log("Synthesizing full profile for identified type:", mbtiType);
            
            let finalProfile: UserProfile;
            try {
                const finalProfileParts = await geminiService.generateFullProfileFromAssessments(
                    assessmentData.mtraResults,
                    assessmentData.hbdiAnswers,
                    assessmentData.mbtiAnswers,
                    mbtiType
                );

                console.log("Full profile synthesis raw result:", finalProfileParts);

                finalProfile = {
                    accessTier: userProfile?.accessTier || 'full',
                    baseArchetype: {
                        ...finalProfileParts.baseArchetype,
                        MBTI: mbtiType,
                        CTS: assessmentData.mtraResults.changeThreshold as 'High' | 'Moderate' | 'Low'
                    },
                    egotend: finalProfileParts.egotend,
                    highertend: finalProfileParts.highertend,
                    ctSuppressors: assessmentData.mtraResults.ctSuppressors,
                    changeThreshold: assessmentData.mtraResults.changeThreshold as 'High' | 'Moderate' | 'Low',
                    hbdiAnswers: assessmentData.hbdiAnswers,
                    mbtiAnswers: assessmentData.mbtiAnswers,
                    mtraAnswers: assessmentData.mtraAnswers,
                    log: userProfile?.log || [],
                    stateBalance: userProfile?.stateBalance || 0
                };
            } catch (aiError) {
                console.error("AI synthesis failed during standard flow, using fallback:", aiError);
                finalProfile = {
                    ...generateDeterministicProfile(assessmentData.mtraResults, assessmentData.hbdiAnswers, mbtiType),
                    mbtiAnswers: assessmentData.mbtiAnswers,
                    mtraAnswers: assessmentData.mtraAnswers
                };
            }

            console.log("Saving Final Profile:", finalProfile);
            saveProfile(finalProfile);
            setAssessmentStage('mios-boot');
        } catch (error) {
            console.error("Critical failure in profile generator:", error);
            alert("System failure during neural synthesis. Resetting core...");
            setAssessmentStage('welcome');
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
        if (isGeneratingProfile && assessmentStage !== 'clinician') {
            return <FoldingSquareLoader />;
        }

        switch (assessmentStage) {
            case 'welcome':
                return <WelcomeScreen onChoice={handleWelcomeChoice} isProfileComplete={!!(userProfile && userProfile.baseArchetype)} onImportProfile={handleImportProfile} />;
            case 'tier':
                return <AccessTierSelector onSelect={handleSelectTier} onBack={() => setAssessmentStage('welcome')} />;
            case 'clinician':
                return <ClinicianAccess 
                    isAuthenticated={isClinicianAuthenticated}
                    onAuthenticate={(val) => setIsClinicianAuthenticated(val)}
                    onAuthenticated={handleClinicianAuthenticated} 
                    onBack={() => setAssessmentStage('welcome')} 
                    isGenerating={isGeneratingProfile}
                />;
            case 'question-selector':
                return <AssessmentQuestionSelector onSelect={(type) => setAssessmentStage(type)} onBack={() => setAssessmentStage('tier')} />;
            case 'mtra':
                return <MTraAssessment onComplete={handleCompleteMTra} onBack={() => setAssessmentStage(userProfile?.accessTier ? 'tier' : 'question-selector')} />;
            case 'mtra-results':
                return <MTraResultsScreen results={assessmentData.mtraResults} onContinue={() => setAssessmentStage('hbdi')} onBack={() => setAssessmentStage('mtra')} />;
            case 'hbdi':
                return <HBDIAssessment onComplete={handleCompleteHBDI} onBack={() => setAssessmentStage(userProfile?.accessTier ? 'mtra-results' : 'question-selector')} />;
            case 'hbdi-results':
                return <HBDIResultsScreen summary={assessmentData.hbdiSummary} onContinue={() => setAssessmentStage('mbti')} onBack={() => setAssessmentStage('hbdi')} />;
            case 'mbti':
                return <MBTIAssessment onComplete={handleCompleteMBTI} onBack={() => setAssessmentStage(userProfile?.accessTier ? 'hbdi-results' : 'question-selector')} />;
            case 'mbti-results':
                return <MBTIResultsScreen results={assessmentData.mbtiResults} onContinue={handleGenerateFullProfile} onBack={() => setAssessmentStage('mbti')} />;
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
            case 'tfm-audit': return <TfmAuditConsole userProfile={userProfile} />;
            case 'settings': return <SettingsDashboard userProfile={userProfile} onImportProfile={handleImportProfile} />;
            default: return <MiMap userProfile={userProfile} onLogEvent={handleLogEvent} />;
        }
    };

    if (isLoading) {
        return <FoldingSquareLoader />;
    }

    const wrapperClassName = `theme-${theme}`;

    if (assessmentStage !== 'complete' || !userProfile?.baseArchetype) {
        return (
            <div className={wrapperClassName}>
                <div className="min-h-screen flex items-center justify-center p-4 bg-brand-bg relative">
                    {assessmentStage !== 'welcome' && (
                        <Button onClick={handleGoHome} className="absolute top-6 left-6 !p-2 z-10" aria-label="Go Home" variant="secondary">
                            <Home size={20} />
                        </Button>
                    )}
                    <NeuralTransition show={true} key={assessmentStage}>
                        {renderAssessment()}
                    </NeuralTransition>
                </div>
            </div>
        );
    }

    const navItems = [
        { id: 'mimap', label: 'MiMap', icon: Dna },
        { id: 'circuit-breaker-dashboard', label: 'Circuit Breaker', icon: BrainCircuit },
        { id: 'misound', label: 'MiSound', icon: Volume2 },
        { id: 'tfm-audit', label: 'Tonal Flow Mapper', icon: ClipboardList },
        { id: 'settings', label: 'Settings', icon: SettingsIcon },
    ];

    return (
        <div className={`min-h-screen bg-brand-bg ${wrapperClassName} relative overflow-hidden`}>
            {/* Background Elements */}
            <div className="bg-neural-pattern"></div>
            <div className="glow-particle bg-hbdi-blue top-1/4 left-1/4 animate-pulse-neon"></div>
            <div className="glow-particle bg-hbdi-red top-3/4 left-1/3 animate-pulse-neon" style={{ animationDelay: '1s' }}></div>
            <div className="glow-particle bg-hbdi-green top-1/2 right-1/4 animate-pulse-neon" style={{ animationDelay: '2s' }}></div>
            <div className="glow-particle bg-hbdi-yellow top-1/3 right-1/3 animate-pulse-neon" style={{ animationDelay: '1.5s' }}></div>

            <header className="md:hidden glass-panel border-b border-brand-border/30 p-4 flex justify-between items-center fixed top-0 left-0 right-0 z-40 h-16">
                 <h1 className="text-lg font-bold text-brand-text flex items-center gap-2 font-header tracking-tight"><Logo size={24} showLetters={false} /> MiType+ OS</h1>
                 <div className="flex items-center gap-2">
                    <button onClick={() => setIsNavOpen(!isNavOpen)} className="text-brand-text p-2 hover:bg-white/10 rounded-lg transition-colors">
                        {isNavOpen ? <X size={24} /> : <Menu size={24} />}
                    </button>
                 </div>
            </header>
            <div className="flex">
                <nav className={`fixed top-0 left-0 h-full w-72 glass-panel p-6 border-r border-brand-border/30 flex flex-col z-30 transform transition-transform duration-500 ease-in-out ${isNavOpen ? 'translate-x-0' : '-translate-x-full'} md:relative md:translate-x-0 md:h-screen`}>
                    <div className="hidden md:block mb-12">
                        <h1 className="text-2xl font-black text-brand-text flex items-center gap-3 font-header tracking-tighter italic"><Logo size={32} showLetters={false} /> MiType+ OS</h1>
                    </div>
                     <div className="md:hidden h-16" />
                    <ul className="space-y-3 flex-grow">
                        {navItems.map(item => {
                            const Icon = item.icon;
                            const isActive = activeTab === item.id;
                            return (
                                <li key={item.id}>
                                    <button
                                        onClick={() => {
                                            setActiveTab(item.id);
                                            setIsNavOpen(false);
                                        }}
                                        className={`w-full flex items-center gap-4 px-4 py-3 rounded-xl transition-all duration-300 group ${isActive ? 'bg-brand-primary/20 text-brand-primary shadow-[0_0_15px_rgba(99,102,241,0.2)] border border-brand-primary/30' : 'text-brand-text-muted hover:bg-white/5 hover:text-brand-text'}`}
                                    >
                                        <Icon size={20} className={isActive ? 'text-brand-primary' : 'group-hover:text-brand-text'} />
                                        <span className="font-bold text-sm tracking-wide">{item.label}</span>
                                    </button>
                                </li>
                            );
                        })}
                    </ul>
                    
                    <div className="mt-auto pt-6 border-t border-brand-border/20">
                        <button onClick={handleGoHome} className="flex items-center gap-3 text-brand-text-muted hover:text-brand-text transition-colors px-4 py-2 font-bold text-sm">
                            <Home size={18} />
                            Go Home
                        </button>
                    </div>
                </nav>
                <main className="flex-grow p-6 md:p-10 h-screen overflow-y-auto pt-24 md:pt-10">
                    <div className="max-w-7xl mx-auto">
                        <NeuralTransition show={true} key={activeTab}>
                            {renderTabContent()}
                        </NeuralTransition>
                    </div>
                </main>
            </div>
        </div>
    );
};

export default App;