
import React, { useState } from 'react';
import { UserProfile, LogEntry, IntensityLog } from '../types';
import Card from './Card';
import Button from './Button';
import Modal from './Modal';
import { Activity, Zap, TrendingUp, TrendingDown, Info, BarChart, ShieldAlert } from 'lucide-react';

const Slider: React.FC<{ label: string; value: number; onChange: (e: React.ChangeEvent<HTMLInputElement>) => void; }> = ({ label, value, onChange }) => (
    <div className="group">
        <label className="flex justify-between items-center text-xs font-black uppercase tracking-widest mb-3 group-hover:text-brand-primary transition-colors">
            <span>{label}</span>
            <span className="font-data text-brand-primary text-lg">{value}</span>
        </label>
        <div className="relative flex items-center">
            <input 
                type="range" 
                min="1" 
                max="5" 
                value={value} 
                onChange={onChange} 
                className="w-full h-1.5 bg-white/10 rounded-full appearance-none cursor-pointer accent-brand-primary hover:accent-brand-primary/80 transition-all" 
            />
            <div className="absolute -z-10 w-full h-1.5 bg-brand-primary/10 rounded-full blur-[2px]" />
        </div>
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
        <div className="space-y-10">
             <div className="flex items-center gap-4 text-3xl font-black font-header tracking-tighter italic uppercase">
                <div className="p-3 glass-panel rounded-xl text-brand-primary shadow-[0_0_20px_rgba(99,102,241,0.3)]">
                    <Activity size={32} />
                </div>
                <h1>ADAPTIVE CYCLE MODULE</h1>
            </div>

            <Card>
                <p className="text-brand-text-muted leading-relaxed font-medium max-w-3xl">Log your cognitive state to engage preventative (ARC) or emergency (ERP) protocols. Real-time neural monitoring for peak performance.</p>
            </Card>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                <Card className="relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-4">
                        <div className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border ${arcState === 'pre' ? 'border-hbdi-red/50 text-hbdi-red' : 'border-hbdi-green/50 text-hbdi-green'} animate-pulse`}>
                            {arcState === 'pre' ? 'Pre-Calibration' : 'Post-Calibration'}
                        </div>
                    </div>

                    <h2 className="text-2xl font-black mb-8 font-header tracking-tight uppercase italic">{arcState === 'pre' ? 'Log Pre-Recharge State' : 'Log Post-Recharge State'}</h2>
                    
                    {arcState === 'pre' ? (
                        <div className="space-y-10">
                            <div className="space-y-6">
                                <div className="flex items-center gap-3 mb-2">
                                    <TrendingDown className="text-hbdi-red" size={20} />
                                    <h3 className="text-sm font-black uppercase tracking-widest">Egotend Intensity Score (EIS)</h3>
                                </div>
                                <div className="space-y-8 pl-6 border-l border-brand-border/20">
                                    <Slider label="Analysis Paralysis" value={eis.ap} onChange={(e) => setEis(p => ({...p, ap: +e.target.value}))} />
                                    <Slider label="Internal Intensity" value={eis.ii} onChange={(e) => setEis(p => ({...p, ii: +e.target.value}))} />
                                    <Slider label="Pedantic Urge" value={eis.pu} onChange={(e) => setEis(p => ({...p, pu: +e.target.value}))} />
                                </div>
                            </div>
                            <div className="space-y-6">
                                <div className="flex items-center gap-3 mb-2">
                                    <Zap className="text-hbdi-yellow" size={20} />
                                    <h3 className="text-sm font-black uppercase tracking-widest">Environmental Load Score (ELS)</h3>
                                </div>
                                <div className="space-y-8 pl-6 border-l border-brand-border/20">
                                    <Slider label="External Load" value={els} onChange={(e) => setEls(+e.target.value)} />
                                </div>
                            </div>
                            <Button onClick={handleLogPreArc} className="w-full py-5 text-xl font-black tracking-widest uppercase shadow-[0_0_20px_rgba(99,102,241,0.2)]">Log & Start Recharge</Button>
                        </div>
                    ) : (
                        <div className="space-y-10">
                            <div className="glass-panel p-6 rounded-2xl border border-brand-primary/20 shadow-lg text-center">
                                <h3 className="text-lg font-black font-header tracking-tight uppercase italic text-brand-primary mb-2">Recharge Cycle Active</h3>
                                <p className="text-brand-text-muted text-sm font-medium leading-relaxed">Take a moment. Step away, breathe, or use a technique from the MiShift Gym. When you're ready, log your state below.</p>
                            </div>
                            <div className="space-y-6">
                                <div className="flex items-center gap-3 mb-2">
                                    <TrendingUp className="text-hbdi-green" size={20} />
                                    <h3 className="text-sm font-black uppercase tracking-widest">Resilience State Score (RSS)</h3>
                                </div>
                                 <div className="space-y-8 pl-6 border-l border-brand-border/20">
                                    <Slider label="Cognitive Clarity" value={rss.cc} onChange={(e) => setRss(p => ({...p, cc: +e.target.value}))} />
                                    <Slider label="Productive Readiness" value={rss.pr} onChange={(e) => setRss(p => ({...p, pr: +e.target.value}))} />
                                </div>
                            </div>
                            <div className="space-y-4">
                                <Button onClick={handleCompleteArc} className="w-full py-5 text-xl font-black tracking-widest uppercase shadow-[0_0_20px_rgba(99,102,241,0.2)]">Complete ARC & Log</Button>
                                <Button onClick={resetForm} variant="secondary" className="w-full py-3 text-xs font-black tracking-widest uppercase">Cancel Calibration</Button>
                            </div>
                        </div>
                    )}
                </Card>

                <Card className="flex flex-col">
                    <h2 className="text-2xl font-black mb-8 font-header tracking-tight uppercase italic flex items-center gap-3">
                        <BarChart className="text-brand-primary" /> Intensity Log History
                    </h2>
                    <div className="flex-1 overflow-y-auto space-y-4 pr-4 custom-scrollbar">
                        {intensityLogs.length > 0 ? intensityLogs.map(log => (
                            <div key={log.timestamp} className="glass-panel p-5 rounded-2xl border border-white/5 shadow-md group hover:border-brand-primary/30 transition-all duration-300">
                                <div className="flex justify-between items-start mb-3">
                                    <p className="font-data text-[10px] text-brand-text-muted uppercase tracking-widest">{new Date(log.timestamp).toLocaleString()}</p>
                                    <div className="px-2 py-0.5 rounded bg-brand-primary/10 text-brand-primary text-[10px] font-black uppercase tracking-widest">ARC Cycle</div>
                                </div>
                                <div className="flex items-end justify-between">
                                    <div>
                                        <p className="text-xs font-black uppercase tracking-widest text-brand-text-muted mb-1">Efficacy Score</p>
                                        <p className="text-3xl font-black font-header tracking-tighter text-brand-text drop-shadow-[0_0_10px_rgba(255,255,255,0.2)]">{log.arcEfficacyScore}</p>
                                    </div>
                                    {log.hctMaximizerTriggered && (
                                        <div className="flex items-center gap-2 text-hbdi-yellow text-[10px] font-black uppercase tracking-widest animate-pulse">
                                            <Info size={14} /> HCT Maximizer
                                        </div>
                                    )}
                                </div>
                            </div>
                        )) : (
                            <div className="flex flex-col items-center justify-center h-full py-12 opacity-30">
                                <BarChart size={48} className="mb-4" />
                                <p className="text-brand-text-muted font-black uppercase tracking-widest text-xs">No intensity cycles logged yet.</p>
                            </div>
                        )}
                    </div>
                </Card>
            </div>


            <Modal isOpen={erpModalOpen} onClose={() => setErpModalOpen(false)} title="EGOTEND REVERSAL PROTOCOL ACTIVATED!">
                <div className="space-y-8 p-4">
                    <div className="flex items-center gap-4 text-hbdi-red">
                        <ShieldAlert size={32} className="animate-pulse" />
                        <p className="text-sm font-black uppercase tracking-widest leading-relaxed">High Egotend intensity detected. Execute the following command immediately to prevent system gridlock.</p>
                    </div>
                    
                    <div className="glass-panel p-8 rounded-3xl border-2 border-hbdi-red shadow-[0_0_40px_rgba(239,68,68,0.2)] text-center">
                        <p className="text-2xl font-black font-header tracking-tight text-brand-text leading-tight italic">{erpCommand}</p>
                    </div>

                    {erpAdvancedInfo && (
                        <div className="glass-panel p-6 rounded-2xl border border-hbdi-yellow/30 bg-hbdi-yellow/5">
                             <h4 className="text-xs font-black text-hbdi-yellow uppercase tracking-widest mb-3 flex items-center gap-2">
                                <Info size={14} /> Advanced Protocol Insight
                             </h4>
                            <p className="text-sm text-brand-text-muted font-medium leading-relaxed">{erpAdvancedInfo}</p>
                        </div>
                    )}
                    
                    <Button onClick={() => { setErpModalOpen(false); resetForm(); }} className="w-full py-5 text-xl font-black tracking-widest uppercase shadow-[0_0_30px_rgba(239,68,68,0.3)]">Acknowledge & Reset System</Button>
                </div>
            </Modal>
        </div>
    );
};

export default AdaptiveCycle;
