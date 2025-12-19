
import React, { useState } from 'react';
import { UserProfile, LogEntry, Archetype } from '../types';
import Card from './Card';
import Button from './Button';
import { Dna, ShieldAlert, ShieldCheck } from 'lucide-react';
import Modal from './Modal';
import * as geminiService from '../services/geminiService';

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

const getHBDIColor = (hbdi: string | undefined): string => {
    if (!hbdi) return 'border-brand-border';
    if (hbdi.includes('A') || hbdi.includes('Blue')) return 'border-hbdi-blue';
    if (hbdi.includes('B') || hbdi.includes('Green')) return 'border-hbdi-green';
    if (hbdi.includes('C') || hbdi.includes('Red')) return 'border-hbdi-red';
    if (hbdi.includes('D') || hbdi.includes('Yellow')) return 'border-hbdi-yellow';
    return 'border-brand-border';
};

const HBDILegend: React.FC = () => (
    <div className="mt-4 pt-4 border-t border-brand-border">
        <h4 className="font-semibold text-sm mb-2">HBDI Legend</h4>
        <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-xs">
            <span className="flex items-center gap-1.5"><div className="w-3 h-3 rounded-full bg-hbdi-blue border border-brand-border"></div>A: Analyst</span>
            <span className="flex items-center gap-1.5"><div className="w-3 h-3 rounded-full bg-hbdi-green border border-brand-border"></div>B: Organizer</span>
            <span className="flex items-center gap-1.5"><div className="w-3 h-3 rounded-full bg-hbdi-red border border-brand-border"></div>C: Harmonizer</span>
            <span className="flex items-center gap-1.5"><div className="w-3 h-3 rounded-full bg-hbdi-yellow border border-brand-border"></div>D: Innovator</span>
        </div>
    </div>
);


const StateGauge: React.FC<{ balance: number; egotendName: string; highertendName: string; }> = ({ balance, egotendName, highertendName }) => {
    const percentage = (balance + 1) / 2 * 100;
    const color = balance > 0.05 ? 'bg-green-500' : balance < -0.05 ? 'bg-red-500' : 'bg-brand-text-muted';

    return (
        <div className="w-full my-4 relative group">
            <div className="w-full bg-brand-bg rounded-full h-2.5">
                <div className={`h-2.5 rounded-full transition-all duration-500 ${color}`} style={{ width: `${percentage}%` }}></div>
            </div>
            <div className="absolute bottom-full mb-2 w-full text-center bg-brand-surface border border-brand-border text-brand-text text-xs rounded py-1 px-2 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10" role="tooltip">
                 {balance > 0.05 ? highertendName : balance < -0.05 ? egotendName : 'Balanced'}
                <div className="absolute top-full left-1/2 -translate-x-1/2 w-0 h-0 border-x-4 border-x-transparent border-t-4 border-t-brand-border"></div>
            </div>
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
        <Card>
            <h3 className="font-bold mb-2">Log State Event</h3>
            <p className="text-sm text-brand-text-muted mb-4">Acknowledge a moment to track your patterns.</p>
            <div className="mb-4">
                <label htmlFor="suppressor-select" className="block text-sm font-medium mb-1">Triggered Suppressor (Egotend)</label>
                <select 
                    id="suppressor-select"
                    value={selectedSuppressor}
                    onChange={(e) => setSelectedSuppressor(e.target.value)}
                    className="w-full bg-brand-bg border border-brand-border rounded-md p-2"
                    aria-label="Select a suppressor to log an Egotend moment"
                >
                    <option value="">Select a suppressor...</option>
                    {suppressors.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
                <Button onClick={handleLogEgotend} disabled={!selectedSuppressor} className="w-full mt-2" variant="danger">
                    Log Egotend Moment
                </Button>
            </div>
            <div>
              <p className="text-sm text-brand-text-muted mb-2">Engaged in a growth activity? Log it from the MiTools module.</p>
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

    const { baseArchetype, egotend, highertend, stateBalance } = userProfile;

    if (!baseArchetype || !egotend || !highertend) {
        return <Card>Your profile is still being generated. Please complete all assessments.</Card>;
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
                CTS: 'Moderate', // Default CTS for comparison
            });
        } catch (error) {
            console.error("Failed to get archetype details", error);
            setCompareError('Could not fetch archetype details. Please try again.');
        } finally {
            setIsComparing(false);
        }
    };

    const hbdiColorClass = getHBDIColor(baseArchetype.HBDI);

    return (
        <div className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card className={`border-t-4 ${hbdiColorClass}`}>
                    <h2 className="text-xl font-bold flex items-center gap-2"><Dna className="text-brand-primary" /> Base Archetype</h2>
                    <h3 className="text-2xl font-semibold mt-2">{baseArchetype.name}</h3>
                    <p className="text-brand-text-muted mt-1">{baseArchetype.coreDrive}</p>
                    <div className="text-xs mt-4 space-x-2">
                        <span className="bg-brand-bg px-2 py-1 rounded">{baseArchetype.HBDI}</span>
                        <span className="bg-brand-bg px-2 py-1 rounded">{baseArchetype.MBTI}</span>
                        <span className="bg-brand-bg px-2 py-1 rounded">CTS: {baseArchetype.CTS}</span>
                    </div>
                    <div className="mt-4 pt-4 border-t border-brand-border">
                        <Button onClick={() => setIsCompareModalOpen(true)} className="w-full" variant="secondary">Compare Archetypes</Button>
                    </div>
                    <HBDILegend />
                </Card>
                <Card className="border-t-4 border-red-500">
                     <h2 className="text-xl font-bold flex items-center gap-2"><ShieldAlert className="text-red-500" /> Egotend State</h2>
                    <h3 className="text-2xl font-semibold mt-2">{egotend.name}</h3>
                    <ul className="list-disc list-inside mt-2 text-brand-text-muted space-y-1">
                        {egotend.challenges.map(c => <li key={c}>{c}</li>)}
                    </ul>
                </Card>
                <Card className="border-t-4 border-green-500">
                    <h2 className="text-xl font-bold flex items-center gap-2"><ShieldCheck className="text-green-500" /> Highertend State</h2>
                    <h3 className="text-2xl font-semibold mt-2">{highertend.name}</h3>
                    <ul className="list-disc list-inside mt-2 text-brand-text-muted space-y-1">
                        {highertend.pathToGrowth.map(p => <li key={p}>{p}</li>)}
                    </ul>
                </Card>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                 <Card>
                    <h3 className="font-bold mb-2">State Balance</h3>
                    <div className="flex justify-between text-sm font-semibold">
                        <span className="text-red-500">Egotend</span>
                        <span className="text-green-500">Highertend</span>
                    </div>
                    <StateGauge balance={stateBalance} egotendName={egotend.name} highertendName={highertend.name}/>
                    <p className="text-sm text-brand-text-muted text-center">Your current cognitive state based on recent logged events.</p>
                </Card>
                <StateLogger onLogEvent={onLogEvent} userProfile={userProfile} />
            </div>

             <Modal isOpen={isCompareModalOpen} onClose={() => setIsCompareModalOpen(false)} title="Compare Archetypes">
                <div className="space-y-4">
                    <p className="text-sm text-brand-text-muted">Select an archetype from the list to see a side-by-side comparison with your own.</p>
                    <select
                        value={archetypeToCompare}
                        onChange={(e) => handleCompare(e.target.value)}
                        className="w-full bg-brand-bg border border-brand-border rounded-md p-2"
                        aria-label="Select archetype to compare"
                    >
                        <option value="">Select Archetype...</option>
                        {twentyFourArchetypes.filter(a => a !== baseArchetype.name).map(name => <option key={name} value={name}>{name}</option>)}
                    </select>

                    {isComparing && <div className="text-center p-4"><p>Comparing...</p></div>}
                    {compareError && <p className="text-red-500 text-sm text-center">{compareError}</p>}
                    
                    {comparisonData && !isComparing && (
                        <div className="mt-6 border-t border-brand-border pt-4">
                            <table className="w-full text-left text-sm table-fixed">
                                <thead>
                                    <tr className="border-b border-brand-border">
                                        <th className="py-2 font-semibold w-1/4">Attribute</th>
                                        <th className="py-2 text-brand-primary w-[37.5%]">{baseArchetype.name}</th>
                                        <th className="py-2 text-brand-secondary w-[37.5%]">{comparisonData.name}</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-brand-border">
                                    <tr className="align-top">
                                        <td className="py-2 font-semibold">Core Drive</td>
                                        <td className="py-2 text-brand-text-muted">{baseArchetype.coreDrive}</td>
                                        <td className="py-2 text-brand-text-muted">{comparisonData.coreDrive}</td>
                                    </tr>
                                    <tr>
                                        <td className="py-2 font-semibold">HBDI</td>
                                        <td className="py-2 text-brand-text-muted">{baseArchetype.HBDI}</td>
                                        <td className="py-2 text-brand-text-muted">{comparisonData.HBDI}</td>
                                    </tr>
                                    <tr>
                                        <td className="py-2 font-semibold">MBTI</td>
                                        <td className="py-2 text-brand-text-muted">{baseArchetype.MBTI}</td>
                                        <td className="py-2 text-brand-text-muted">{comparisonData.MBTI}</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </Modal>
        </div>
    );
};

export default MiMap;
