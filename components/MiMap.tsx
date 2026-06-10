
import React, { useState, useMemo, useEffect } from 'react';
import { UserProfile, LogEntry, Archetype } from '../types';
import Card from './Card';
import Button from './Button';
import { Dna, ShieldAlert, ShieldCheck, Activity, Zap, TrendingUp, FileText, Download, BookOpen, Sparkles } from 'lucide-react';
import Modal from './Modal';
import * as geminiService from '../services/geminiService';
import { generatePDF } from '../services/pdfService';
import { 
    Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer,
    LineChart, Line, YAxis, Tooltip
} from 'recharts';
import { motion } from 'motion/react';

const twentyFourArchetypes = [
    "Imaginative Explorer", "Transformational Leader", "Innovative Designer",
    "Creative Problem Solver", "Visionary Conceptualiser", "Passionate Advocate",
    "Dynamic Motivator", "Intuitive Strategist", "Adaptive Analyst",
    "Logical Innovator", "Holistic Integrator", "Relationship Builder",
    "Personalised Coach", "Expressive Communicator", "Methodical Producer",
    "Structured Communicator", "Empathetic Supporter", "Reliable Executor",
    "Harmonious Facilitator", "Systematic Implementer", "Strategic Planner",
    "Efficient Analyst", "Harmonious Analyst", "Detailed Organiser"
];

const mbtiDescriptions: Record<string, string> = {
    "ISTJ": "The Inspector: Practical, fact-minded, and reliable. You value tradition and loyalty.",
    "ISFJ": "The Protector: Dedicated, warm, and responsible. You are always ready to defend your loved ones.",
    "INFJ": "The Advocate: Quiet, mystical, and inspiring idealist. You seek meaning and connection in all things.",
    "INTJ": "The Architect: Imaginative and strategic thinker. You have a plan for everything.",
    "ISTP": "The Virtuoso: Bold and practical experimenter. You are a master of all kinds of tools.",
    "ISFP": "The Adventurer: Flexible and charming artist. You are always ready to explore and experience something new.",
    "INFP": "The Mediator: Poetic, kind, and altruistic. You are always eager to help a good cause.",
    "INTP": "The Logician: Innovative inventor with unquenchable thirst for knowledge. You love logical analysis.",
    "ESTP": "The Entrepreneur: Smart, energetic, and perceptive. You truly enjoy living on the edge.",
    "ESFP": "The Entertainer: Spontaneous, energetic, and enthusiastic. Life is never boring around you.",
    "ENFP": "The Campaigner: Enthusiastic, creative, and sociable free spirit. You can always find a reason to smile.",
    "ENTP": "The Debater: Smart and curious thinker who cannot resist an intellectual challenge.",
    "ESTJ": "The Executive: Excellent administrator, unsurpassed at managing things or people.",
    "ESFJ": "The Consul: Extraordinarily caring, social, and popular. You are always eager to help.",
    "ENFJ": "The Protagonist: Charismatic and inspiring leader. You are able to mesmerize your listeners.",
    "ENTJ": "The Commander: Bold, imaginative, and strong-willed leader. You always find a way – or make one."
};

const mbtiPreferenceMap: Record<string, string> = {
    'E': 'Extraverted',
    'I': 'Introverted',
    'S': 'Sensing',
    'N': 'Intuitive',
    'T': 'Thinking',
    'F': 'Feeling',
    'J': 'Judging',
    'P': 'Perceiving'
};

const ctsDescriptions: Record<string, string> = {
    "High": "High Change Threshold: You're someone who really values a solid plan and a steady routine. Having things predictable helps you stay focused and do your best work. You like to take your time when things change so you can adjust comfortably.",
    "Moderate": "Moderate Change Threshold: You've got a great balance when it comes to change. You appreciate having a routine to keep things organized, but you're also totally capable of switching gears when life throws something new your way.",
    "Low": "Low Change Threshold: You're super comfortable with change and love trying new things. A strict routine might actually feel a bit boring to you; you really shine in fast-paced environments where every day is a little different."
};

const ctsColorMap: Record<string, string> = {
    'High': 'blue',
    'Moderate': 'green',
    'Low': 'yellow'
};

const HBDILegend: React.FC = () => (
    <div className="mt-6 pt-4 border-t border-brand-border/30">
        <h4 className="font-bold text-xs uppercase tracking-widest mb-3 text-brand-text-muted">HBDI Legend</h4>
        <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-[10px] font-data uppercase">
            <span className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-hbdi-blue shadow-[0_0_8px_rgba(59,130,246,0.6)]"></div>A: Analyst</span>
            <span className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-hbdi-green shadow-[0_0_8px_rgba(34,197,94,0.6)]"></div>B: Organizer</span>
            <span className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-hbdi-red shadow-[0_0_8px_rgba(239,68,68,0.6)]"></div>C: Harmonizer</span>
            <span className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-hbdi-yellow shadow-[0_0_8px_rgba(234,179,8,0.6)]"></div>D: Innovator</span>
        </div>
    </div>
);

const StateGauge: React.FC<{ balance: number }> = ({ balance }) => {
    // balance is -1 to 1. Map to 0 to 180 degrees for a semi-circle
    const rotation = (balance + 1) * 90; // -1 -> 0, 0 -> 90, 1 -> 180
    
    return (
        <div className="relative w-64 h-32 mx-auto mt-8 overflow-hidden">
            {/* Background Track */}
            <div className="absolute top-0 left-0 w-64 h-64 rounded-full border-[20px] border-brand-bg/50"></div>
            
            {/* Gradient Track */}
            <div className="absolute top-0 left-0 w-64 h-64 rounded-full border-[20px] border-transparent"
                 style={{
                     background: 'conic-gradient(from 270deg, #EF4444 0%, #EAB308 50%, #22C55E 100%) border-box',
                     mask: 'linear-gradient(#fff 0 0) padding-box, linear-gradient(#fff 0 0)',
                     maskComposite: 'exclude',
                     WebkitMaskComposite: 'destination-out'
                 }}>
            </div>

            {/* Needle */}
            <motion.div 
                className="absolute bottom-0 left-1/2 w-1 h-32 origin-bottom -translate-x-1/2 z-10"
                animate={{ rotate: rotation - 90 }}
                transition={{ type: 'spring', stiffness: 50, damping: 15 }}
            >
                <div className="w-full h-full bg-white shadow-[0_0_15px_rgba(255,255,255,0.8)] rounded-full"></div>
            </motion.div>
            
            {/* Center Hub */}
            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-4 h-4 bg-white rounded-full shadow-[0_0_10px_rgba(255,255,255,0.5)] z-20"></div>
        </div>
    );
};

const StateLogger: React.FC<{ onLogEvent: (log: LogEntry) => void; userProfile: UserProfile }> = ({ onLogEvent, userProfile }) => {
    const [selectedSuppressor, setSelectedSuppressor] = useState('');

    const handleLogEgotend = () => {
        if (!selectedSuppressor) return;
        onLogEvent({ type: 'egotend', suppressor: selectedSuppressor, timestamp: Date.now() });
        setSelectedSuppressor('');
    };
    
    const suppressors = userProfile.ctSuppressors || [];

    return (
        <Card className="glass-panel">
            <h3 className="font-bold text-xl mb-2 font-header">Log State Event</h3>
            <p className="text-sm text-brand-text-muted mb-6">Acknowledge a moment to track your patterns.</p>
            <div className="space-y-4">
                <div>
                    <label htmlFor="suppressor-select" className="block text-xs font-bold uppercase tracking-widest mb-2 text-brand-text-muted">Triggered Suppressor (Egotend)</label>
                    <select 
                        id="suppressor-select"
                        value={selectedSuppressor}
                        onChange={(e) => setSelectedSuppressor(e.target.value)}
                        className="w-full bg-brand-bg border border-brand-border rounded-xl p-3 text-sm text-brand-text focus:ring-2 focus:ring-brand-secondary outline-none transition-all cursor-pointer"
                        aria-label="Select a suppressor to log an Egotend moment"
                    >
                        <option value="" className="bg-brand-bg text-brand-text">Select a suppressor...</option>
                        {suppressors.map(s => (
                            <option key={s} value={s} className="bg-brand-bg text-brand-text">
                                {s}
                            </option>
                        ))}
                    </select>
                </div>
                <Button onClick={handleLogEgotend} disabled={!selectedSuppressor} className="w-full" variant="danger">
                    Log Egotend Moment
                </Button>
                <p className="text-[10px] text-brand-text-muted text-center italic">Engaged in a growth activity? Log it from the MiTools module.</p>
            </div>
        </Card>
    );
}

const MiMap: React.FC<{ userProfile: UserProfile, onLogEvent: (log: LogEntry) => void; }> = ({ userProfile, onLogEvent }) => {
    const [isCompareModalOpen, setIsCompareModalOpen] = useState(false);
    const [archetypeToCompare, setArchetypeToCompare] = useState('');
    const [comparisonData, setComparisonData] = useState<Archetype | null>(null);
    const [isComparing, setIsComparing] = useState(false);
    const [compareError, setCompareError] = useState('');
    const [archetypeInAction, setArchetypeInAction] = useState('');
    const [isLoadingAction, setIsLoadingAction] = useState(false);
    const [isGeneratingReport, setIsGeneratingReport] = useState(false);
    const [selectedView, setSelectedView] = useState<'hbdi' | 'mbti' | 'cts'>('hbdi');
    const [actionView, setActionView] = useState<'general' | 'egotend' | 'highertend'>('general');

    const { baseArchetype, egotend, highertend, stateBalance } = userProfile;

    useEffect(() => {
        const fetchAction = async () => {
            if (baseArchetype) {
                setIsLoadingAction(true);
                try {
                    const content = await geminiService.getArchetypeInAction(baseArchetype.name);
                    setArchetypeInAction(content);
                } catch (error) {
                    console.error("Failed to fetch archetype in action", error);
                    setArchetypeInAction("Your archetype's strengths are currently being analyzed for practical application.");
                } finally {
                    setIsLoadingAction(false);
                }
            }
        };
        fetchAction();
    }, [baseArchetype?.name]);

    const getArchetypeColor = () => {
        if (!baseArchetype || !baseArchetype.HBDI) return 'blue';
        const hbdi = baseArchetype.HBDI;
        if (hbdi.includes('A')) return 'blue';
        if (hbdi.includes('B')) return 'green';
        if (hbdi.includes('C')) return 'red';
        if (hbdi.includes('D')) return 'yellow';
        return 'blue';
    };

    const archetypeColor = getArchetypeColor();
    const accentClass = `text-hbdi-${archetypeColor}`;
    const borderClass = `neon-border-${archetypeColor}`;

    const getDynamicBorderClass = () => {
        if (actionView === 'general') return 'neon-border-blue';
        if (actionView === 'egotend') return 'neon-border-red';
        if (actionView === 'highertend') return 'neon-border-green';
        return borderClass;
    };

    const getMainCardBorderClass = () => {
        if (selectedView === 'hbdi') return borderClass;
        if (selectedView === 'mbti') return 'neon-border-yellow';
        if (selectedView === 'cts') return `neon-border-${ctsColorMap[baseArchetype.CTS] || 'blue'}`;
        return borderClass;
    };

    const getMainCardAccentClass = () => {
        if (selectedView === 'hbdi') return accentClass;
        if (selectedView === 'mbti') return 'text-hbdi-yellow';
        if (selectedView === 'cts') return `text-hbdi-${ctsColorMap[baseArchetype.CTS] || 'blue'}`;
        return accentClass;
    };

    const shadowClass = `shadow-[0_0_15px_rgba(${archetypeColor === 'blue' ? '59,130,246' : archetypeColor === 'green' ? '34,197,94' : archetypeColor === 'red' ? '239,68,68' : '234,179,8'},0.3)]`;
    
    // Calculate dynamic radar data from HBDI answers if available
    const radarData = useMemo(() => {
        if (!userProfile.hbdiAnswers) {
            return [
                { subject: 'Analyst', A: 85, fullMark: 100 },
                { subject: 'Organizer', A: 65, fullMark: 100 },
                { subject: 'Harmonizer', A: 45, fullMark: 100 },
                { subject: 'Innovator', A: 75, fullMark: 100 },
            ];
        }

        const counts = { a: 0, b: 0, c: 0, d: 0 };
        Object.values(userProfile.hbdiAnswers).forEach(val => {
            counts[val as 'a' | 'b' | 'c' | 'd']++;
        });

        // Map to 100
        const max = Math.max(...Object.values(counts), 1);
        
        return [
            { subject: 'Analyst', A: (counts.a / max) * 100, fullMark: 100 },
            { subject: 'Organizer', A: (counts.b / max) * 100, fullMark: 100 },
            { subject: 'Harmonizer', A: (counts.c / max) * 100, fullMark: 100 },
            { subject: 'Innovator', A: (counts.d / max) * 100, fullMark: 100 },
        ];
    }, [userProfile.hbdiAnswers]);

    if (!baseArchetype || !egotend || !highertend) {
        return <div className="p-8 text-center"><Card className="glass-panel">Your profile is still being generated. Please complete all assessments.</Card></div>;
    }

    const handleCompare = async (archetypeName: string) => {
        setArchetypeToCompare(archetypeName);
        if (!archetypeName) {
            setComparisonData(null);
            return;
        }
        setIsComparing(true);
        setComparisonData(null);
        setCompareError('');
        try {
            const details = await geminiService.getArchetypeDetails(archetypeName);
            setComparisonData({
                name: archetypeName,
                ...details,
                CTS: 'Moderate',
            });
        } catch (error) {
            console.error("Failed to get archetype details", error);
            setCompareError('Could not fetch archetype details. Please try again.');
        } finally {
            setIsComparing(false);
        }
    };

    const hasMbti = !!baseArchetype.MBTI;
    const hasCts = !!baseArchetype.CTS;

    return (
        <div className="space-y-8 pb-12">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Base Archetype Card */}
                <Card className={`${getMainCardBorderClass()} glass-panel relative overflow-hidden lg:col-span-1 transition-all duration-500`}>
                    <div className="absolute top-0 right-0 p-4 opacity-10">
                        <Dna size={80} />
                    </div>
                    <div className={`flex items-center gap-2 ${getMainCardAccentClass()} mb-4 transition-colors duration-500`}>
                        <Activity size={18} />
                        <h2 className="text-xs font-bold uppercase tracking-[0.2em] font-header">Base Archetype</h2>
                    </div>
                    <h3 className="text-3xl font-extrabold mb-2 font-header">{baseArchetype.name || "Reliable Executor"}</h3>
                    <p className="text-sm text-brand-text-muted mb-6 leading-relaxed">{baseArchetype.coreDrive}</p>
                    
                    <div className="flex flex-wrap gap-2 mb-8 font-data text-[10px]">
                        <button 
                            onClick={() => setSelectedView('hbdi')}
                            className={`px-3 py-1 rounded-full border transition-all duration-300 ${selectedView === 'hbdi' ? 'bg-hbdi-blue/20 text-hbdi-blue border-hbdi-blue/30 shadow-[0_0_10px_rgba(59,130,246,0.2)]' : 'bg-brand-bg/50 text-brand-text-muted border-brand-border/50 hover:border-brand-border'}`}
                        >
                            A Dominant (Analytical)
                        </button>
                        <button 
                            onClick={() => setSelectedView('mbti')}
                            className={`px-3 py-1 rounded-full border transition-all duration-300 ${selectedView === 'mbti' ? 'bg-hbdi-yellow/20 text-hbdi-yellow border-hbdi-yellow/30 shadow-[0_0_10px_rgba(234,179,8,0.2)]' : 'bg-brand-bg/50 text-brand-text-muted border-brand-border/50 hover:border-brand-border'}`}
                        >
                            {baseArchetype.MBTI || "ISTJ"}
                        </button>
                        <button 
                            onClick={() => setSelectedView('cts')}
                            className={`px-3 py-1 rounded-full border transition-all duration-300 ${selectedView === 'cts' ? `bg-hbdi-${ctsColorMap[baseArchetype.CTS] || 'green'}/20 text-hbdi-${ctsColorMap[baseArchetype.CTS] || 'green'} border-hbdi-${ctsColorMap[baseArchetype.CTS] || 'green'}/30 shadow-[0_0_10px_rgba(${ctsColorMap[baseArchetype.CTS] === 'blue' ? '59,130,246' : '34,197,94'},0.2)]` : 'bg-brand-bg/50 text-brand-text-muted border-brand-border/50 hover:border-brand-border'}`}
                        >
                            CTS: {baseArchetype.CTS || "Moderate"}
                        </button>
                    </div>

                    <div className="min-h-[250px] flex flex-col">
                        {selectedView === 'hbdi' && (
                            <motion.div 
                                key="hbdi-view"
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="flex-1"
                            >
                                <div className="h-48 w-full">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <RadarChart cx="50%" cy="50%" outerRadius="80%" data={radarData}>
                                            <PolarGrid stroke="rgba(255,255,255,0.1)" />
                                            <PolarAngleAxis dataKey="subject" tick={{ fill: '#9ca3af', fontSize: 10 }} />
                                            <Radar
                                                name="Profile"
                                                dataKey="A"
                                                stroke={archetypeColor === 'blue' ? '#3B82F6' : archetypeColor === 'green' ? '#22C55E' : archetypeColor === 'red' ? '#EF4444' : '#EAB308'}
                                                fill={archetypeColor === 'blue' ? '#3B82F6' : archetypeColor === 'green' ? '#22C55E' : archetypeColor === 'red' ? '#EF4444' : '#EAB308'}
                                                fillOpacity={0.4}
                                            />
                                        </RadarChart>
                                    </ResponsiveContainer>
                                </div>
                                <HBDILegend />
                            </motion.div>
                        )}

                        {selectedView === 'mbti' && (
                            <motion.div 
                                key="mbti-view"
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="flex-1 flex flex-col justify-center p-4 glass-panel rounded-2xl border border-hbdi-yellow/20"
                            >
                                <h4 className="text-xs font-black text-hbdi-yellow uppercase tracking-[0.3em] mb-3">MBTI Profile</h4>
                                {hasMbti ? (
                                    <>
                                        <div className="flex items-baseline gap-3 mb-4">
                                            <p className="text-4xl font-black text-brand-text font-header tracking-tighter italic">{baseArchetype.MBTI}</p>
                                            <div className="flex flex-wrap gap-1">
                                                {baseArchetype.MBTI.split('').map((char, i) => (
                                                    <span key={i} className="text-[10px] font-black text-brand-text-muted uppercase tracking-widest bg-white/5 px-2 py-0.5 rounded border border-white/5">
                                                        {mbtiPreferenceMap[char] || char}
                                                    </span>
                                                ))}
                                            </div>
                                        </div>
                                        <p className="text-sm text-brand-text-muted leading-relaxed font-medium">
                                            {mbtiDescriptions[baseArchetype.MBTI] || "Detailed MBTI analysis is currently being synthesized for your profile."}
                                        </p>
                                    </>
                                ) : (
                                    <p className="text-brand-text-muted italic text-sm">MBTI data calibration required.</p>
                                )}
                            </motion.div>
                        )}

                        {selectedView === 'cts' && (
                            <motion.div 
                                key="cts-view"
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className={`flex-1 flex flex-col justify-center p-4 glass-panel rounded-2xl border border-hbdi-${ctsColorMap[baseArchetype.CTS] || 'green'}/20 relative overflow-hidden`}
                            >
                                {/* Blinking LED with Echo Effect */}
                                <div className="absolute top-4 right-4 flex items-center justify-center">
                                    <div className={`absolute w-6 h-6 rounded-full border border-hbdi-${ctsColorMap[baseArchetype.CTS] || 'green'} animate-echo`} />
                                    <div className={`absolute w-6 h-6 rounded-full border border-hbdi-${ctsColorMap[baseArchetype.CTS] || 'green'} animate-echo`} style={{ animationDelay: '1.5s' }} />
                                    <div className={`w-2.5 h-2.5 rounded-full bg-hbdi-${ctsColorMap[baseArchetype.CTS] || 'green'} shadow-[0_0_10px_rgba(${ctsColorMap[baseArchetype.CTS] === 'blue' ? '59,130,246' : '34,197,94'},0.5)] animate-pulse`} />
                                </div>

                                <h4 className={`text-xs font-black text-hbdi-${ctsColorMap[baseArchetype.CTS] || 'green'} uppercase tracking-[0.3em] mb-3`}>Change Threshold System</h4>
                                <p className="text-4xl font-black text-brand-text mb-4 font-header tracking-tighter italic">{baseArchetype.CTS || "Moderate"} Threshold</p>
                                <p className="text-sm text-brand-text-muted leading-relaxed font-medium">
                                    {ctsDescriptions[baseArchetype.CTS] || ctsDescriptions['Moderate']}
                                </p>
                                <div className="mt-4 pt-4 border-t border-brand-border/10">
                                    <p className="text-[10px] text-brand-text-muted uppercase tracking-widest font-bold">MiType Significance</p>
                                    <p className="text-[11px] text-brand-text-muted/80 mt-1 italic">
                                        This threshold determines how your neural pathways respond to environmental shifts, influencing your transition between Egotend and Highertend states.
                                    </p>
                                </div>
                            </motion.div>
                        )}
                    </div>
                    
                    <Button onClick={() => setIsCompareModalOpen(true)} className="w-full mt-6 text-xs" variant="primary">Compare Archetypes</Button>
                </Card>

                {/* Archetype in Action / Tendencies Window */}
                <Card className={`${getDynamicBorderClass()} glass-panel relative overflow-hidden lg:col-span-2 transition-all duration-500`}>
                    <div className="absolute top-0 right-0 p-6 opacity-5">
                        <Sparkles size={120} />
                    </div>
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
                        <div className="flex items-center gap-3">
                            <div className={`p-2 rounded-lg bg-brand-bg/50 ${accentClass} ${shadowClass}`}>
                                <Activity size={24} />
                            </div>
                            <h2 className="text-xl font-black font-header tracking-tight italic uppercase">
                                How Your Base Archetype Serves You
                            </h2>
                        </div>
                        <div className="flex gap-2">
                            <button 
                                onClick={() => setActionView('general')}
                                className={`px-4 py-1.5 rounded-full border text-[10px] font-black tracking-widest uppercase transition-all duration-300 cursor-pointer z-10 ${actionView === 'general' ? 'bg-hbdi-blue/20 text-hbdi-blue border-hbdi-blue/30 shadow-[0_0_10px_rgba(59,130,246,0.2)]' : 'bg-brand-bg/50 text-brand-text-muted border-brand-border/50 hover:border-brand-border'}`}
                            >
                                BASE
                            </button>
                            <button 
                                onClick={() => setActionView(prev => prev === 'egotend' ? 'general' : 'egotend')}
                                className={`px-4 py-1.5 rounded-full border text-[10px] font-black tracking-widest uppercase transition-all duration-300 cursor-pointer z-10 ${actionView === 'egotend' ? 'bg-hbdi-red/20 text-hbdi-red border-hbdi-red/30 shadow-[0_0_10px_rgba(239,68,68,0.2)]' : 'bg-brand-bg/50 text-brand-text-muted border-brand-border/50 hover:border-brand-border'}`}
                            >
                                EGOTEND
                            </button>
                            <button 
                                onClick={() => setActionView(prev => prev === 'highertend' ? 'general' : 'highertend')}
                                className={`px-4 py-1.5 rounded-full border text-[10px] font-black tracking-widest uppercase transition-all duration-300 cursor-pointer z-10 ${actionView === 'highertend' ? 'bg-hbdi-green/20 text-hbdi-green border-hbdi-green/30 shadow-[0_0_10px_rgba(34,197,94,0.2)]' : 'bg-brand-bg/50 text-brand-text-muted border-brand-border/50 hover:border-brand-border'}`}
                            >
                                HIGHERTEND
                            </button>
                        </div>
                    </div>
                    
                    <div className="min-h-[400px]">
                        {actionView === 'general' ? (
                            <motion.div 
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="space-y-6"
                            >
                                {isLoadingAction ? (
                                    <div className="space-y-4 animate-pulse">
                                        <div className="h-4 bg-white/5 rounded w-3/4"></div>
                                        <div className="h-4 bg-white/5 rounded w-5/6"></div>
                                        <div className="h-4 bg-white/5 rounded w-2/3"></div>
                                    </div>
                                ) : (
                                    <div className="space-y-6 text-brand-text-muted leading-relaxed font-medium">
                                        {archetypeInAction.split('\n\n').map((para, idx) => (
                                            <p key={idx} className="font-sans">
                                                {para}
                                            </p>
                                        ))}
                                    </div>
                                )}
                            </motion.div>
                        ) : actionView === 'egotend' ? (
                            <motion.div 
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                className="space-y-6"
                            >
                                <div>
                                    <h3 className="text-2xl font-black text-hbdi-red font-header uppercase italic">EGOTEND</h3>
                                    <p className="text-xs font-bold text-brand-text-muted uppercase tracking-widest">Ego-driven tendencies</p>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    <div>
                                        <h4 className="text-xs font-black text-hbdi-red uppercase tracking-[0.2em] mb-4 font-header italic">Challenges</h4>
                                        <ul className="space-y-2">
                                            {(egotend.challenges || []).map(c => (
                                                <li key={c} className="text-sm text-brand-text-muted flex items-start gap-2">
                                                    <span className="text-hbdi-red mt-1">•</span>
                                                    <span>{c}</span>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                    <div>
                                        <h4 className="text-xs font-black text-hbdi-red uppercase tracking-[0.2em] mb-4 font-header italic">Warning Signs</h4>
                                        <ul className="space-y-2">
                                            {(egotend.warningSigns && egotend.warningSigns.length > 0 ? egotend.warningSigns : [
                                                "Rigid thinking patterns",
                                                "Analysis paralysis in decision making",
                                                "Perfectionism stalling progress",
                                                "Stalled decisions due to over-analysis"
                                            ]).map((sign, idx) => (
                                                <li key={idx} className="text-[11px] text-brand-text-muted flex items-start gap-2 leading-tight">
                                                    <div className="w-1 h-1 rounded-full bg-hbdi-red mt-1.5 shadow-[0_0_5px_rgba(239,68,68,0.5)]" />
                                                    <span>{sign}</span>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                </div>
                                <div className="pt-6 border-t border-brand-border/10">
                                    <h4 className="text-xs font-black text-hbdi-red uppercase tracking-[0.2em] mb-4 font-header italic">Common Triggers</h4>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        {(egotend.commonTriggers && egotend.commonTriggers.length > 0 ? egotend.commonTriggers : [
                                            "High levels of uncertainty",
                                            "Conflicting data points",
                                            "Tight, inflexible deadlines",
                                            "Sudden routine disruptions"
                                        ]).map((trigger, idx) => (
                                            <div key={idx} className="bg-white/5 p-3 rounded-xl border border-white/5 text-[11px] text-brand-text-muted flex items-center gap-3">
                                                <Zap size={14} className="text-hbdi-red shrink-0" />
                                                {trigger}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </motion.div>
                        ) : actionView === 'highertend' ? (
                            <motion.div 
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                className="space-y-6"
                            >
                                <div>
                                    <h3 className="text-2xl font-black text-hbdi-green font-header uppercase italic">HIGHERTEND</h3>
                                    <p className="text-xs font-bold text-brand-text-muted uppercase tracking-widest">Higher-self tendencies</p>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    <div>
                                        <h4 className="text-xs font-black text-hbdi-green uppercase tracking-[0.2em] mb-4 font-header italic">Path to Growth</h4>
                                        <ul className="space-y-2">
                                            {(highertend.pathToGrowth && highertend.pathToGrowth.length > 0 ? highertend.pathToGrowth : [
                                                "Identify one small step forward",
                                                "Engage in a creative hobby",
                                                "Connect with a trusted mentor",
                                                "Practice mindfulness for 5 minutes"
                                            ]).map(p => (
                                                <li key={p} className="text-sm text-brand-text-muted flex items-start gap-2">
                                                    <span className="text-hbdi-green mt-1">•</span>
                                                    <span>{p}</span>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                    <div>
                                        <h4 className="text-xs font-black text-hbdi-green uppercase tracking-[0.2em] mb-4 font-header italic">Strengths in Flow</h4>
                                        <ul className="space-y-2">
                                            {(highertend.strengthsInFlow && highertend.strengthsInFlow.length > 0 ? highertend.strengthsInFlow : [
                                                "Balanced decision-making",
                                                "Cognitive flexibility in crisis",
                                                "Timely action and execution",
                                                "Iterative progress mastery"
                                            ]).map((strength, idx) => (
                                                <li key={idx} className="text-[11px] text-brand-text-muted flex items-start gap-2 leading-tight">
                                                    <div className="w-1 h-1 rounded-full bg-hbdi-green mt-1.5 shadow-[0_0_5px_rgba(34,197,94,0.5)]" />
                                                    <span>{strength}</span>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                </div>
                                <div className="pt-6 border-t border-brand-border/10">
                                    <h4 className="text-xs font-black text-hbdi-green uppercase tracking-[0.2em] mb-4 font-header italic">Quick Activation</h4>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        {(highertend.quickActivation && highertend.quickActivation.length > 0 ? highertend.quickActivation : [
                                            "Set a 5-minute decision timer",
                                            "Practice 'good enough' iterations",
                                            "Schedule reflection breaks",
                                            "Focus on one micro-action"
                                        ]).map((tip, idx) => (
                                            <div key={idx} className="bg-white/5 p-3 rounded-xl border border-white/5 text-[11px] text-brand-text-muted flex items-center gap-3">
                                                <Sparkles size={14} className="text-hbdi-green shrink-0" />
                                                {tip}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </motion.div>
                        ) : null}
                    </div>
                </Card>
            </div>

            <div className="space-y-8">
                {/* Glossary and Report sections remain below */}

                {/* Section 2: Cognitive OS Glossary */}
                <Card className="glass-panel relative overflow-hidden border-t border-brand-border/30">
                    <div className="absolute top-0 right-0 p-6 opacity-5">
                        <BookOpen size={120} />
                    </div>
                    <div className="flex items-center gap-3 mb-8">
                        <div className="p-2 rounded-lg bg-brand-bg/50 text-brand-primary shadow-[0_0_15px_rgba(99,102,241,0.3)]">
                            <BookOpen size={24} />
                        </div>
                        <h2 className="text-xl font-black font-header tracking-tight italic uppercase">
                            Cognitive OS Glossary
                        </h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-8">
                        <div className="space-y-2">
                            <h3 className="text-sm font-black font-header tracking-widest text-brand-text uppercase">CTS (Change Threshold System)</h3>
                            <p className="text-xs text-brand-text-muted leading-relaxed font-medium">
                                This measures how you handle surprises or changes to your routine. A high score means you love a solid plan and stability, while a low score means you're a fan of variety and can go with the flow easily.
                            </p>
                        </div>
                        <div className="space-y-2">
                            <h3 className="text-sm font-black font-header tracking-widest text-brand-text uppercase">Egotend</h3>
                            <p className="text-xs text-brand-text-muted leading-relaxed font-medium">
                                Think of this as your "stress mode." It's when you're feeling a bit stuck or defensive, which can make it harder to make decisions or keep moving forward.
                            </p>
                        </div>
                        <div className="space-y-2">
                            <h3 className="text-sm font-black font-header tracking-widest text-brand-text uppercase">Highertend</h3>
                            <p className="text-xs text-brand-text-muted leading-relaxed font-medium">
                                This is you at your best! It's your "flow state" where you're feeling confident, flexible, and ready to take on the world with your natural strengths.
                            </p>
                        </div>
                        <div className="space-y-2">
                            <h3 className="text-sm font-black font-header tracking-widest text-brand-text uppercase">MiType</h3>
                            <p className="text-xs text-brand-text-muted leading-relaxed font-medium">
                                This is your personal "brain blueprint." It's the unique mix of your personality, how you handle change, and your thinking style that makes you, well, you!
                            </p>
                        </div>
                    </div>
                </Card>
            </div>

            {/* System Intelligence / Reports Card */}
            <Card className="glass-panel border-t-2 border-brand-primary/30 relative overflow-hidden group">
                <div className="absolute top-0 right-0 p-6 opacity-5 group-hover:opacity-10 transition-opacity">
                    <FileText size={120} />
                </div>
                <div className="flex flex-col md:flex-row items-center justify-between gap-8 p-4">
                    <div className="flex-1">
                        <div className="flex items-center gap-3 text-brand-primary mb-3">
                            <FileText size={24} />
                            <h2 className="text-xl font-black font-header tracking-tight italic uppercase">Cognitive Intelligence Report</h2>
                        </div>
                        <p className="text-sm text-brand-text-muted leading-relaxed max-w-2xl">
                            Generate a comprehensive, high-density technical record of your cognitive architecture. 
                            Includes executive summaries, state transition analysis, and full assessment data logs in a professional PDF format.
                        </p>
                    </div>
                    <div className="w-full md:w-auto">
                        <Button 
                            onClick={async () => {
                                setIsGeneratingReport(true);
                                try {
                                    await generatePDF(userProfile, archetypeInAction);
                                } finally {
                                    setIsGeneratingReport(false);
                                }
                            }} 
                            disabled={isGeneratingReport}
                            className="w-full md:w-auto flex items-center justify-center gap-3 py-4 px-10 text-lg font-black tracking-widest uppercase shadow-[0_0_20px_rgba(99,102,241,0.3)] hover:shadow-[0_0_30px_rgba(99,102,241,0.5)] transition-all"
                        >
                            {isGeneratingReport ? (
                                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white"></div>
                            ) : (
                                <><Download size={20} /> Generate Full Report</>
                            )}
                        </Button>
                    </div>
                </div>
            </Card>

             <Modal isOpen={isCompareModalOpen} onClose={() => setIsCompareModalOpen(false)} title="Compare Archetypes">
                <div className="space-y-6">
                    <p className="text-sm text-brand-text-muted leading-relaxed">Select an archetype from the list to see a side-by-side comparison with your own.</p>
                    <select
                        value={archetypeToCompare}
                        onChange={(e) => handleCompare(e.target.value)}
                        className="w-full bg-brand-bg border border-brand-border rounded-xl p-3 text-sm text-brand-text focus:ring-2 focus:ring-brand-primary outline-none cursor-pointer"
                        aria-label="Select archetype to compare"
                    >
                        <option value="" className="bg-brand-bg text-brand-text">Select Archetype...</option>
                        {twentyFourArchetypes.filter(a => a !== baseArchetype.name).map(name => (
                            <option key={name} value={name} className="bg-brand-bg text-brand-text">
                                {name}
                            </option>
                        ))}
                    </select>

                    {isComparing && <div className="text-center p-8"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand-primary mx-auto"></div></div>}
                    {compareError && <p className="text-red-500 text-sm text-center">{compareError}</p>}
                    
                    {comparisonData && !isComparing && (
                        <div className="mt-6 border-t border-brand-border/30 pt-6">
                            <div className="grid grid-cols-3 gap-4 text-xs font-data uppercase tracking-widest text-brand-text-muted mb-4">
                                <div>Attribute</div>
                                <div className="text-brand-primary">{baseArchetype.name}</div>
                                <div className="text-brand-secondary">{comparisonData.name}</div>
                            </div>
                            <div className="space-y-4">
                                <div className="grid grid-cols-3 gap-4 py-3 border-b border-brand-border/10">
                                    <div className="font-bold text-brand-text">Core Drive</div>
                                    <div className="text-[10px] leading-relaxed">{baseArchetype.coreDrive}</div>
                                    <div className="text-[10px] leading-relaxed">{comparisonData.coreDrive}</div>
                                </div>
                                <div className="grid grid-cols-3 gap-4 py-3 border-b border-brand-border/10">
                                    <div className="font-bold text-brand-text">HBDI</div>
                                    <div>{baseArchetype.HBDI}</div>
                                    <div>{comparisonData.HBDI}</div>
                                </div>
                                <div className="grid grid-cols-3 gap-4 py-3">
                                    <div className="font-bold text-brand-text">MBTI</div>
                                    <div>{baseArchetype.MBTI}</div>
                                    <div>{comparisonData.MBTI}</div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </Modal>
        </div>
    );
};

export default MiMap;
