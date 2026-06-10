
import React, { useState } from 'react';
import { ClipboardList } from 'lucide-react';
import Card from './Card';
import * as geminiService from '../services/geminiService';
import Button from './Button';
import { UserProfile } from '../types';

// Comprehensive Linguistic Marker Implementation
// 1. Agency and Accountability Markers -> Systemic Friction
const agencyMarkers = [
    "was addressed", "was made", "was done", "has occurred", "is being looked at", "it is thought that", "it seems", "it happened", "management has requested", "according to the memo", "someone should"
];

// 2. Certainty (Hedges) & 4. Vagueness Markers -> Cognitive Friction
const cognitiveFrictionMarkers = [
    "may", "might", "could", "should", "i think", "i believe", "it seems that", "as far as i know", "maybe", "potentially", "sort of", "perhaps", "unclear", "i guess", "roughly", "about", "generally", "almost", "around that time", "a few", "several", "and so on", "etc", "or something like that", "things", "stuff", "situation"
];

// 3. Tone and Emotion Markers -> Emotional Friction & Valence Score
const emotionalFrictionMarkers = [
     "friction", "concern", "issue", "delay", "difficult", "constraint", "awful", "terrible", "impossible", "ridiculous", "fail", "mistake", "disaster", "failing", "sucks", "problem", "bad", "hate", "unfortunately"
];

const valenceLexicon: { [key: string]: number } = {
    // Positive
    'lol': 1, 'thanks': 2, 'thank you': 2, 'great': 2, 'good': 1, 'awesome': 2, 'excellent': 3, 'love': 2, 'happy': 2, 'pleasure': 2, 'appreciated': 3, 'exciting': 2, 'opportunity': 2, 'success': 3, 'smooth': 2, 'happily': 2, 'wow': 1,
    // Negative
    'fuck': -3, 'problem': -2, 'awful': -2, 'terrible': -2, 'impossible': -2, 'fail': -2, 'mistake': -2, 'disaster': -3, 'sucks': -2, 'issue': -1, 'bad': -1, 'hate': -2, 'concern': -1, 'friction': -2, 'delay': -1, 'difficult': -1, 'constraint': -1, 'unfortunately': -1, 'ugh': -1, "oh no": -1
};

interface TfmAuditConsoleProps {
    userProfile: UserProfile;
}

const TfmAuditConsole: React.FC<TfmAuditConsoleProps> = ({ userProfile }) => {
    const [communicationData, setCommunicationData] = useState('');
    const [auditResults, setAuditResults] = useState<{
        vagueCount: number;
        negativeCount: number;
        avoidanceCount: number;
        valenceScore: number;
    } | null>(null);
    const [interpretation, setInterpretation] = useState('');
    const [isInterpreting, setIsInterpreting] = useState(false);
    const [interpretationError, setInterpretationError] = useState('');

    const runAudit = () => {
        const input = communicationData.toLowerCase();
        setInterpretation('');
        setInterpretationError('');

        const countMarkers = (text: string, markers: string[]) => {
            return markers.reduce((count, marker) => {
                const regex = new RegExp(marker.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&'), 'gi');
                const matches = text.match(regex);
                return count + (matches ? matches.length : 0);
            }, 0);
        };
        
        // Path A: Valence Scoring
        const words = input.split(/\s+/);
        let totalValence = 0;
        let scoredWords = 0;
        words.forEach(word => {
            const cleanWord = word.replace(/[.,!?]/g, '');
            if (valenceLexicon[cleanWord]) {
                totalValence += valenceLexicon[cleanWord];
                scoredWords++;
            }
        });
        const valenceScore = scoredWords > 0 ? (totalValence / scoredWords) : 0;

        // Path B: Friction Cluster Tagging
        const vagueCount = countMarkers(input, cognitiveFrictionMarkers);
        const negativeCount = countMarkers(input, emotionalFrictionMarkers);
        const avoidanceCount = countMarkers(input, agencyMarkers);

        setAuditResults({ vagueCount, negativeCount, avoidanceCount, valenceScore });
    };

    const handleInterpret = async () => {
        if (!auditResults || !communicationData) return;
        setIsInterpreting(true);
        setInterpretationError('');
        try {
            const result = await geminiService.interpretFrictionMarkers(communicationData, auditResults, userProfile);
            setInterpretation(result);
        } catch (e) {
            console.error(e);
            setInterpretationError('Mi could not complete the interpretation. Please try again.');
        } finally {
            setIsInterpreting(false);
        }
    };

    return (
        <div className="space-y-10">
             <div className="flex items-center gap-4 text-3xl font-black font-header tracking-tighter italic">
                <div className="p-3 glass-panel rounded-xl text-brand-primary shadow-[0_0_20px_rgba(99,102,241,0.3)]">
                    <ClipboardList size={32} />
                </div>
                <h1>TONAL FLOW MAPPER</h1>
            </div>

            <Card>
                <h2 className="text-2xl font-black mb-4 flex items-center gap-3 font-header tracking-tight italic"><ClipboardList className="text-brand-primary" /> NEURAL LINGUISTIC ANALYSIS</h2>
                <p className="text-brand-text-muted leading-relaxed font-medium max-w-3xl">Analyze team communication for hidden friction markers and systemic cognitive load. All data is processed locally with forensic precision.</p>
            </Card>

            <Card>
                <h2 className="text-lg font-black mb-4 font-header tracking-tight uppercase italic">Communication Data Input</h2>
                <div className="relative group">
                    <textarea 
                      value={communicationData}
                      onChange={(e) => setCommunicationData(e.target.value)}
                      className="w-full h-64 bg-white/5 text-brand-text p-6 rounded-2xl border border-brand-border/30 focus:outline-none focus:border-brand-primary/50 transition-all duration-300 font-data text-sm leading-relaxed resize-none shadow-inner" 
                      placeholder="Paste anonymized team communication text here for forensic Tonal Flow analysis..."></textarea>
                    <div className="absolute bottom-4 right-4 text-[10px] font-data text-brand-text-muted uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity">
                        Forensic Mode Active
                    </div>
                </div>
                <Button 
                    onClick={runAudit}
                    disabled={!communicationData.trim()}
                    className="mt-6 w-full py-5 text-xl font-black tracking-widest uppercase shadow-[0_0_20px_rgba(99,102,241,0.2)]">
                    Run Tonal Flow Audit
                </Button>
            </Card>
            
            {auditResults && (
                <Card>
                    <h2 className="text-xl font-black mb-8 font-header tracking-tight uppercase italic text-center">Organizational Friction Markers</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                        <div className="glass-panel p-6 rounded-2xl text-center border-t-2 border-hbdi-yellow/30 shadow-[0_0_20px_rgba(255,215,0,0.05)]">
                            <p className="text-xs font-black text-hbdi-yellow uppercase tracking-widest mb-1">Cognitive Friction</p>
                            <p className="text-[10px] text-brand-text-muted uppercase tracking-widest mb-4">Vague Language</p>
                            <div className="text-6xl font-black text-brand-text font-header tracking-tighter drop-shadow-[0_0_10px_rgba(255,255,255,0.3)]">{auditResults.vagueCount}</div>
                        </div>
                        <div className="glass-panel p-6 rounded-2xl text-center border-t-2 border-hbdi-red/30 shadow-[0_0_20px_rgba(239,68,68,0.05)]">
                            <p className="text-xs font-black text-hbdi-red uppercase tracking-widest mb-1">Emotional Friction</p>
                            <p className="text-[10px] text-brand-text-muted uppercase tracking-widest mb-4">Negativity</p>
                            <div className="text-6xl font-black text-brand-text font-header tracking-tighter drop-shadow-[0_0_10px_rgba(255,255,255,0.3)]">{auditResults.negativeCount}</div>
                        </div>
                        <div className="glass-panel p-6 rounded-2xl text-center border-t-2 border-hbdi-blue/30 shadow-[0_0_20px_rgba(59,130,246,0.05)]">
                            <p className="text-xs font-black text-hbdi-blue uppercase tracking-widest mb-1">Systemic Friction</p>
                            <p className="text-[10px] text-brand-text-muted uppercase tracking-widest mb-4">Avoidance</p>
                            <div className="text-6xl font-black text-brand-text font-header tracking-tighter drop-shadow-[0_0_10px_rgba(255,255,255,0.3)]">{auditResults.avoidanceCount}</div>
                        </div>
                         <div className="glass-panel p-6 rounded-2xl text-center border-t-2 border-hbdi-green/30 shadow-[0_0_20px_rgba(34,197,94,0.05)]">
                            <p className="text-xs font-black text-hbdi-green uppercase tracking-widest mb-1">Valence Score</p>
                            <p className="text-[10px] text-brand-text-muted uppercase tracking-widest mb-4">Sentiment</p>
                            <div className="text-6xl font-black text-brand-text font-header tracking-tighter drop-shadow-[0_0_10px_rgba(255,255,255,0.3)]">{auditResults.valenceScore.toFixed(2)}</div>
                        </div>
                    </div>
                    
                    <div className="mt-12 text-center">
                        <Button 
                            onClick={handleInterpret}
                            disabled={isInterpreting}
                            variant="secondary"
                            className="flex items-center justify-center mx-auto py-4 px-10 text-lg font-black tracking-widest uppercase shadow-[0_0_20px_rgba(236,72,153,0.2)]"
                        >
                            {isInterpreting ? 'Interpreting...' : 'Ask Mi to Interpret Results'}
                        </Button>
                    </div>

                    {interpretationError && <p className="text-red-500 text-center mt-6 font-bold uppercase tracking-widest text-xs">{interpretationError}</p>}

                    {interpretation && (
                        <div className="glass-panel p-8 rounded-3xl mt-12 border border-brand-primary/20 shadow-[0_0_30px_rgba(99,102,241,0.1)]">
                            <h3 className="text-xl font-black text-brand-primary font-header tracking-tight uppercase italic mb-6">Mi's Interpretation</h3>
                            <div className="prose prose-invert mt-4 text-brand-text-muted max-w-none whitespace-pre-wrap font-medium leading-relaxed" dangerouslySetInnerHTML={{ __html: interpretation.replace(/\n/g, '<br />') }}></div>
                        </div>
                    )}
                </Card>
            )}
        </div>
    );
};

export default TfmAuditConsole;
