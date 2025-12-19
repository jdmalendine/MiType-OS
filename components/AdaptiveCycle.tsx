
import React, { useState } from 'react';
import { UserProfile, LogEntry, IntensityLog } from '../types';
import Card from './Card';
import Button from './Button';
import Modal from './Modal';
import { Activity, Zap, TrendingUp, TrendingDown, Info, BarChart } from 'lucide-react';

const Slider: React.FC<{ label: string; value: number; onChange: (e: React.ChangeEvent<HTMLInputElement>) => void; }> = ({ label, value, onChange }) => (
    <div>
        <label className="flex justify-between items-center text-sm font-medium mb-1">
            <span>{label}</span>
            <span className="font-bold text-brand-primary">{value}</span>
        </label>
        <input type="range" min="1" max="5" value={value} onChange={onChange} className="w-full h-2 bg-brand-bg rounded-lg appearance-none cursor-pointer" />
    </div>
);

const AdaptiveCycle: React.FC<{ userProfile: UserProfile, onLogEvent: (log: LogEntry) => void; }> = ({ userProfile, onLogEvent }) => {
    const [arcState, setArcState] = useState<'pre' | 'post'>('pre');
    
    // Pre-ARC state
    const [eis, setEis] = useState({ ap: 1, ii: 1, pu: 1 }); // Egotend Intensity Score
    const [els, setEls] = useState(1); // Environmental Load Score
    
    // Post-ARC state
    const [rss, setRss] = useState({ cc: 1, pr: 1 }); // Resilience State Score

    const [preArcData, setPreArcData] = useState<{ eis: { ap: number; ii: number; pu: number; }, els: number } | null>(null);

    // ERP Modal state
    const [erpModalOpen, setErpModalOpen] = useState(false);
    const [erpCommand, setErpCommand] = useState('');
    const [erpAdvancedInfo, setErpAdvancedInfo] = useState<string | null>(null);

    const resetForm = () => {
        setEis({ ap: 1, ii: 1, pu: 1 });
        setEls(1);
        setRss({ cc: 1, pr: 1 });
        setArcState('pre');
        setPreArcData(null);
    };

    const handleLogPreArc = () => {
        const eisSum = eis.ap + eis.ii + eis.pu;
        
        // Algorithm 3: ERP Trigger Logic
        if (eisSum >= 12) {
            let newErpCommand = '';
            let newErpAdvancedInfo: string | null = null;

            const sortedEis = (Object.keys(eis) as Array<keyof typeof eis>).sort((a, b) => eis[b] - eis[a]);
            const primaryTrigger = sortedEis[0];
            const secondaryTrigger = sortedEis[1];
            
            // Prioritize most specific combinations first
            if (eis.ap >= 4 && eis.ii >= 4 && eis.pu >= 4) {
                newErpCommand = "Cognitive and emotional system overload. Cease all current activity. This is a hard reset. Stand, drink a glass of water, and look out a window for 2 minutes. No problem solving. Your only task is to observe.";
                newErpAdvancedInfo = "System Flush Protocol: All core egotend functions are firing simultaneously, leading to total gridlock. A forced disengagement and sensory reset is the only effective intervention to prevent a full system crash.";
            } else if (eis[primaryTrigger] >= 4 && eis[secondaryTrigger] >= 4) {
                const triggers = new Set([primaryTrigger, secondaryTrigger]);
                if (triggers.has('ap') && triggers.has('pu')) {
                    newErpCommand = "Analysis and perfectionism are creating a feedback loop. Set a 3-minute timer. You MUST make one irreversible decision related to your task before it ends. Action is the only exit.";
                    newErpAdvancedInfo = "Action Forcing Protocol: This specific combination creates total paralysis. An immediate, time-boxed, and irreversible action is required to break the cognitive lock.";
                } else if (triggers.has('ap') && triggers.has('ii')) {
                    newErpCommand = "You are over-thinking and over-feeling. Externalize immediately. Open a blank document and type your entire thought stream for 90 seconds without pausing or judging. Then, close it without re-reading.";
                    newErpAdvancedInfo = "Cognitive Offloading Protocol: The blend of intense analysis and emotion is overwhelming your working memory. A rapid data dump will clear the channel.";
                } else if (triggers.has('ii') && triggers.has('pu')) {
                     newErpCommand = "Emotional intensity is driving a need for absolute control. This is unsustainable. Verbally acknowledge one thing in your environment that is imperfect and acceptable. State: 'This is functional, not final.'";
                     newErpAdvancedInfo = "Emotional Regulation Override: This combination leads to brittle, emotionally-charged perfectionism. The goal is to introduce nuance and reduce the stakes, breaking the intensity-control loop.";
                }
            }
            
            // If no combo matched, fall back to primary trigger + ELS
            if (!newErpCommand) {
                 const highLoad = els >= 4;
                 switch (primaryTrigger) {
                    case 'ap':
                        newErpCommand = highLoad ? "External overload detected. Isolate the single most critical variable in your environment. Discard all others for the next 10 minutes. State this variable aloud now." : "You are in a cognitive loop. Stand up. Walk 20 paces. Return and write down the absolute worst-case scenario. Now, write the most likely one. The difference is your path forward.";
                        newErpAdvancedInfo = highLoad ? "Cognitive Channeling Protocol: Your analytical focus is scattered by external complexity. Anchoring to a single point will restore cognitive order." : "Pattern Interrupt Protocol: The lack of external pressure has allowed an internal analysis loop to form. A physical state change and catastrophic framing can break it.";
                        break;
                    case 'ii':
                        newErpCommand = highLoad ? "Sensory and social overload imminent. Find a quiet space immediately. No screens. Focus only on the sound of your own breathing for 60 seconds. Name three things you can physically feel." : "Internal pressure is critical. Place your hand on a solid surface. Describe its texture and temperature aloud. Verbally acknowledge: 'This is the present moment. This feeling is data, not a directive.'";
                        newErpAdvancedInfo = highLoad ? "Somatic Anchoring Protocol: High external load is amplifying internal intensity. Grounding in physical sensation will interrupt the feedback loop." : "Mindful Grounding Protocol: Internal intensity is spiraling without an external anchor. Use tactile sensation to force a shift from internal narrative to external reality.";
                        break;
                    case 'pu':
                        newErpCommand = highLoad ? "The system's complexity exceeds your control. Relinquish perfection. Identify one small, actionable part and complete it in the next 5 minutes. Delegate or defer one other part immediately." : "Perfectionism is blocking progress. Introduce one deliberate, minor 'flaw' into your current task (e.g., a typo you leave for a moment). Acknowledge that it is 'good enough for now' and move to the next step.";
                        newErpAdvancedInfo = highLoad ? "Control Deconstruction Protocol: Attempting to perfect a chaotic system leads to burnout. Focus on minimal viable action to regain momentum." : "Perfectionism Inversion Protocol: The urge to perfect a simple task is a form of procrastination. Deliberate imperfection breaks the spell and forces momentum.";
                        break;
                }
            }
            
            setErpCommand(newErpCommand || 'Error: No protocol matched. Take a deep breath.'); // Fallback command
            setErpAdvancedInfo(newErpAdvancedInfo);
            setErpModalOpen(true);

        } else {
            setPreArcData({ eis, els });
            setArcState('post');
        }
    };
    
    const handleCompleteArc = () => {
        if (!preArcData) return;
        
        // Algorithm 2: ARC Efficacy Scoring
        const eisAvg = (preArcData.eis.ap + preArcData.eis.ii + preArcData.eis.pu) / 3;
        const rssAvg = (rss.cc + rss.pr) / 2;
        const arcEfficacyScore = (((5 - eisAvg) + rssAvg) / 2 / 4 * 1).toFixed(2); // Normalize to 0-1 range approx.

        // Algorithm 1: HCT Maximizer Trigger Logic
        const hctMaximizerTriggered = rss.cc >= 4 && rss.pr < 4;

        const newLog: IntensityLog = {
            type: 'intensity',
            timestamp: Date.now(),
            preArc: preArcData,
            postArc: { rss },
            arcEfficacyScore: parseFloat(arcEfficacyScore),
            hctMaximizerTriggered,
        };
        
        onLogEvent(newLog);
        resetForm();
    };

    const intensityLogs = userProfile.log.filter((l): l is IntensityLog => l.type === 'intensity');

    return (
        <div className="space-y-8">
             <Card>
                <h1 className="text-2xl font-bold mb-2 flex items-center gap-2"><Activity /> Adaptive Cycle Module</h1>
                <p className="text-brand-text-muted">Log your cognitive state to engage preventative (ARC) or emergency (ERP) protocols.</p>
            </Card>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <Card>
                    <h2 className="text-xl font-bold mb-4">{arcState === 'pre' ? 'Step 1: Log Pre-Recharge State' : 'Step 2: Log Post-Recharge State'}</h2>
                    
                    {arcState === 'pre' ? (
                        <div className="space-y-6">
                            <div>
                                <h3 className="font-semibold flex items-center gap-2"><TrendingDown className="text-red-500" /> Egotend Intensity Score (EIS)</h3>
                                <p className="text-xs text-brand-text-muted mb-2">Internal pressure and cognitive stagnation.</p>
                                <div className="space-y-4 pl-4 border-l-2 border-brand-border">
                                    <Slider label="Analysis Paralysis" value={eis.ap} onChange={(e) => setEis(p => ({...p, ap: +e.target.value}))} />
                                    <Slider label="Internal Intensity" value={eis.ii} onChange={(e) => setEis(p => ({...p, ii: +e.target.value}))} />
                                    <Slider label="Pedantic Urge" value={eis.pu} onChange={(e) => setEis(p => ({...p, pu: +e.target.value}))} />
                                </div>
                            </div>
                            <div>
                                <h3 className="font-semibold flex items-center gap-2"><Zap className="text-yellow-500" /> Environmental Load Score (ELS)</h3>
                                <p className="text-xs text-brand-text-muted mb-2">External social or sensory complexity.</p>
                                <div className="pl-4 border-l-2 border-brand-border">
                                    <Slider label="External Load" value={els} onChange={(e) => setEls(+e.target.value)} />
                                </div>
                            </div>
                            <Button onClick={handleLogPreArc} className="w-full">Log & Start Recharge</Button>
                        </div>
                    ) : (
                        <div className="space-y-6">
                            <div className="bg-brand-bg p-4 rounded-md border border-brand-border">
                                <h3 className="font-semibold text-center">Recharge Cycle Active</h3>
                                <p className="text-brand-text-muted text-center text-sm">Take a moment. Step away, breathe, or use a technique from the MiShift Gym. When you're ready, log your state below.</p>
                            </div>
                            <div>
                                <h3 className="font-semibold flex items-center gap-2"><TrendingUp className="text-green-500" /> Resilience State Score (RSS)</h3>
                                <p className="text-xs text-brand-text-muted mb-2">Post-recharge readiness and cognitive quality.</p>
                                 <div className="space-y-4 pl-4 border-l-2 border-brand-border">
                                    <Slider label="Cognitive Clarity" value={rss.cc} onChange={(e) => setRss(p => ({...p, cc: +e.target.value}))} />
                                    <Slider label="Productive Readiness" value={rss.pr} onChange={(e) => setRss(p => ({...p, pr: +e.target.value}))} />
                                </div>
                            </div>
                            <Button onClick={handleCompleteArc} className="w-full">Complete ARC & Log</Button>
                            <Button onClick={resetForm} variant="secondary" className="w-full">Cancel</Button>
                        </div>
                    )}
                </Card>

                <Card>
                    <h2 className="text-xl font-bold mb-4 flex items-center gap-2"><BarChart /> Intensity Log History</h2>
                    <div className="max-h-96 overflow-y-auto space-y-3 pr-2">
                        {intensityLogs.length > 0 ? intensityLogs.map(log => (
                            <div key={log.timestamp} className="bg-brand-bg p-3 rounded-md text-sm">
                                <p className="font-semibold">Logged: {new Date(log.timestamp).toLocaleString()}</p>
                                <p className="text-brand-text-muted">Efficacy: <span className="font-bold text-brand-primary">{log.arcEfficacyScore}</span></p>
                                {log.hctMaximizerTriggered && <p className="text-yellow-400 text-xs flex items-center gap-1"><Info size={14} /> HCT Maximizer Triggered</p>}
                            </div>
                        )) : (
                            <p className="text-brand-text-muted text-center py-8">No intensity cycles logged yet.</p>
                        )}
                    </div>
                </Card>
            </div>


            <Modal isOpen={erpModalOpen} onClose={() => setErpModalOpen(false)} title="Egotend Reversal Protocol Activated!">
                <div className="space-y-4">
                    <p className="text-brand-text-muted">High Egotend intensity detected. Execute the following command immediately:</p>
                    <div className="bg-brand-bg p-4 rounded-md border border-brand-primary">
                        <p className="text-lg font-bold text-center text-brand-text">{erpCommand}</p>
                    </div>
                    {erpAdvancedInfo && (
                        <div className="bg-brand-bg p-4 rounded-md border border-yellow-500">
                             <h4 className="font-semibold text-yellow-500">Advanced Protocol Active</h4>
                            <p className="text-sm text-brand-text-muted mt-2">{erpAdvancedInfo}</p>
                        </div>
                    )}
                    <Button onClick={() => { setErpModalOpen(false); resetForm(); }} className="w-full">Acknowledge & Reset</Button>
                </div>
            </Modal>
        </div>
    );
};

export default AdaptiveCycle;
