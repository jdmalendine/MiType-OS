
import React, { useState } from 'react';
import Card from './Card';
import * as geminiService from '../services/geminiService';
import Button from './Button';

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


const TfmAuditConsole: React.FC = () => {
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
            const result = await geminiService.interpretFrictionMarkers(communicationData, auditResults);
            setInterpretation(result);
        } catch (e) {
            console.error(e);
            setInterpretationError('Mi could not complete the interpretation. Please try again.');
        } finally {
            setIsInterpreting(false);
        }
    };

    return (
        <div className="space-y-8">
            <Card>
                <h1 className="text-2xl font-bold mb-2">TFM Audit Console</h1>
                <p className="text-brand-text-muted">Analyze team communication for hidden friction markers.</p>
            </Card>

            <Card>
                <h2 className="text-xl font-bold mb-4">Communication Data Input</h2>
                <textarea 
                  value={communicationData}
                  onChange={(e) => setCommunicationData(e.target.value)}
                  className="w-full h-48 bg-brand-bg text-brand-text p-3 rounded-lg border border-brand-border focus:outline-none focus:ring-2 focus:ring-brand-primary" 
                  placeholder="Paste anonymized team communication text here for TFM analysis..."></textarea>
                <Button 
                    onClick={runAudit}
                    disabled={!communicationData.trim()}
                    className="mt-4 w-full">
                    Run TFM Audit
                </Button>
            </Card>
            
            {auditResults && (
                <Card>
                    <h2 className="text-xl font-bold mb-4">Organizational Friction Markers</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 text-center">
                        <div className="bg-brand-bg p-4 rounded-lg">
                            <p className="text-lg font-semibold text-hbdi-yellow">Cognitive Friction</p>
                            <p className="text-sm text-brand-text-muted">Vague Language</p>
                            <div className="mt-2 text-5xl font-extrabold text-white">{auditResults.vagueCount}</div>
                        </div>
                        <div className="bg-brand-bg p-4 rounded-lg">
                            <p className="text-lg font-semibold text-hbdi-red">Emotional Friction</p>
                            <p className="text-sm text-brand-text-muted">Negativity</p>
                            <div className="mt-2 text-5xl font-extrabold text-white">{auditResults.negativeCount}</div>
                        </div>
                        <div className="bg-brand-bg p-4 rounded-lg">
                            <p className="text-lg font-semibold text-hbdi-blue">Systemic Friction</p>
                            <p className="text-sm text-brand-text-muted">Avoidance</p>
                            <div className="mt-2 text-5xl font-extrabold text-white">{auditResults.avoidanceCount}</div>
                        </div>
                         <div className="bg-brand-bg p-4 rounded-lg">
                            <p className="text-lg font-semibold text-hbdi-green">Valence Score</p>
                            <p className="text-sm text-brand-text-muted">Sentiment</p>
                            <div className="mt-2 text-5xl font-extrabold text-white">{auditResults.valenceScore.toFixed(2)}</div>
                        </div>
                    </div>
                    
                    <div className="mt-8 text-center">
                        <Button 
                            onClick={handleInterpret}
                            disabled={isInterpreting}
                            variant="secondary"
                            className="flex items-center justify-center mx-auto"
                        >
                            {isInterpreting ? 'Interpreting...' : 'Ask Mi to Interpret Results'}
                        </Button>
                    </div>

                    {interpretationError && <p className="text-red-500 text-center mt-4">{interpretationError}</p>}

                    {interpretation && (
                        <div className="bg-brand-bg p-4 rounded-lg mt-8">
                            <h3 className="text-lg font-semibold text-brand-secondary">Mi's Interpretation</h3>
                            <div className="prose prose-invert mt-4 text-brand-text-muted max-w-none whitespace-pre-wrap" dangerouslySetInnerHTML={{ __html: interpretation.replace(/\n/g, '<br />') }}></div>
                        </div>
                    )}
                </Card>
            )}
        </div>
    );
};

export default TfmAuditConsole;
