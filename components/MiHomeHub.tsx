
import React, { useState, useEffect } from 'react';
import { UserProfile } from '../types';
import Card from './Card';
import Button from './Button';
import { Shield, Home, Activity, Lightbulb, Volume2, AlertTriangle } from 'lucide-react';

const MiHomeHub: React.FC<{ userProfile: UserProfile }> = ({ userProfile }) => {
  // MiSentry State
  const [sentryStatus, setSentryStatus] = useState({
    cognitiveDrift: 'Nominal',
    patternRigidity: 'Nominal',
    stressResponse: 'Nominal'
  });
  const [sentryAlert, setSentryAlert] = useState<string | null>(null);

  // MiZone State
  const [miZoneActive, setMiZoneActive] = useState(false);

  // MiSentry Simulation Logic
  useEffect(() => {
    const interval = setInterval(() => {
      if (sentryAlert) {
        // Reset any active alerts
        setSentryAlert(null);
        setSentryStatus({ cognitiveDrift: 'Nominal', patternRigidity: 'Nominal', stressResponse: 'Nominal' });
      } else if (Math.random() < 0.15) {
        // 15% chance of triggering a new alert if none is active
        const metrics: (keyof typeof sentryStatus)[] = ['cognitiveDrift', 'patternRigidity', 'stressResponse'];
        const metricToFlag = metrics[Math.floor(Math.random() * metrics.length)];
        
        setSentryStatus(prev => ({
          ...prev,
          [metricToFlag]: 'Elevated'
        }));
        
        let metricName = 'Metric';
        switch (metricToFlag) {
            case 'cognitiveDrift': metricName = 'Cognitive Drift'; break;
            case 'patternRigidity': metricName = 'Pattern Rigidity'; break;
            case 'stressResponse': metricName = 'Stress Response'; break;
        }
        setSentryAlert(`Elevated ${metricName} detected. A preventative ARC is recommended.`);
      }
    }, 20000);

    return () => clearInterval(interval);
  }, [sentryAlert]);


  // MiZone activation handler
  const handleActivateMiZone = () => {
    setMiZoneActive(true);
    // Auto-deactivate after 30 seconds for simulation purposes
    setTimeout(() => setMiZoneActive(false), 30000);
  };

  // ACM (Aesthetic Cognitive Mapping) Logic
  const getAcmSettings = () => {
    const { stateBalance } = userProfile;
    if (stateBalance > 0.3) {
      return { light: 'Soft Green', lightColor: 'text-hbdi-green', sound: 'Calm Ambient', message: 'Highertend state detected. Environment configured for growth and flow.' };
    } else if (stateBalance < -0.3) {
      return { light: 'Deep Blue', lightColor: 'text-brand-primary', sound: 'Focused White Noise', message: 'Egotend state detected. Environment recalibrating to reduce cognitive load.' };
    }
    return { light: 'Neutral White', lightColor: 'text-brand-text', sound: 'Silence', message: 'System state is balanced. Environment is neutral.' };
  };

  const acm = getAcmSettings();
  const getStatusColor = (status: string) => status === 'Nominal' ? 'text-hbdi-green' : 'text-hbdi-yellow';

  return (
    <div className="space-y-10">
      <div className="flex items-center gap-4 text-3xl font-black font-header tracking-tighter italic uppercase">
        <div className="p-3 glass-panel rounded-xl text-brand-primary shadow-[0_0_20px_rgba(99,102,241,0.3)]">
            <Home size={32} />
        </div>
        <h1>MIHOME HUB</h1>
      </div>

      <Card>
        <p className="text-brand-text-muted leading-relaxed font-medium max-w-3xl">A simulation of your integrated MiType+ ecosystem. Monitor your cognitive architecture and manage your environmental parameters in real-time.</p>
      </Card>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        {/* MiSentry Panel */}
        <Card className="lg:col-span-2 relative overflow-hidden">
            <div className="absolute top-0 right-0 p-6">
                <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-hbdi-green/10 border border-hbdi-green/30 text-hbdi-green text-[10px] font-black uppercase tracking-widest animate-pulse">
                    <div className="w-1.5 h-1.5 rounded-full bg-hbdi-green shadow-[0_0_8px_rgba(34,197,94,0.8)]" />
                    Vigilance Active
                </div>
            </div>

            <h2 className="text-2xl font-black mb-8 font-header tracking-tight uppercase italic flex items-center gap-3">
                <Shield className="text-brand-primary" /> MiSentry Vigilance System
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {[
                    { label: 'Cognitive Drift', value: sentryStatus.cognitiveDrift },
                    { label: 'Pattern Rigidity', value: sentryStatus.patternRigidity },
                    { label: 'Stress Response', value: sentryStatus.stressResponse }
                ].map((metric, i) => (
                    <div key={i} className="glass-panel p-6 rounded-2xl border border-white/5 shadow-inner flex flex-col items-center text-center group hover:border-brand-primary/30 transition-all duration-300">
                        <span className="text-[10px] font-black uppercase tracking-[0.2em] text-brand-text-muted mb-3">{metric.label}</span>
                        <span className={`text-xl font-black font-header tracking-tight uppercase italic ${getStatusColor(metric.value)} drop-shadow-[0_0_10px_rgba(0,0,0,0.5)]`}>
                            {metric.value}
                        </span>
                    </div>
                ))}
            </div>
            {sentryAlert && (
                 <div className="mt-8 p-6 glass-panel border border-hbdi-yellow/30 bg-hbdi-yellow/5 rounded-2xl flex items-start gap-4 animate-bounce-subtle">
                    <AlertTriangle className="text-hbdi-yellow mt-1 flex-shrink-0" size={24} />
                    <div>
                        <h4 className="font-black text-hbdi-yellow uppercase tracking-widest text-xs mb-2">MiSentry Neural Alert</h4>
                        <p className="text-sm text-brand-text/80 font-medium leading-relaxed">{sentryAlert}</p>
                        <p className="text-xs text-brand-text-muted mt-3 font-black uppercase tracking-widest">Action Required: Initialize Adaptive Cycle</p>
                    </div>
                </div>
            )}
        </Card>

        {/* MiZone Panel */}
        <Card className="flex flex-col relative overflow-hidden">
            <div className="mb-8">
                <h2 className="text-2xl font-black mb-4 font-header tracking-tight uppercase italic flex items-center gap-3">
                    <Activity className="text-brand-primary" /> MiZone Protocol
                </h2>
                <p className="text-brand-text-muted text-sm font-medium leading-relaxed">Instantly shift your environment to a low-friction state to reduce cognitive load and promote neural clarity.</p>
            </div>
            
            <div className="flex-1 flex flex-col justify-center items-center py-8">
                <div className={`relative w-32 h-32 rounded-full flex items-center justify-center transition-all duration-1000 ${miZoneActive ? 'bg-brand-primary/20 shadow-[0_0_60px_rgba(99,102,241,0.4)]' : 'bg-white/5'}`}>
                    <div className={`absolute inset-0 rounded-full border-2 border-dashed border-brand-primary/30 ${miZoneActive ? 'animate-spin-slow' : ''}`} />
                    <Activity size={48} className={miZoneActive ? 'text-brand-primary animate-pulse' : 'text-brand-text/20'} />
                </div>
                <div className="mt-8 text-center">
                    <p className="font-black font-header text-xl tracking-tight uppercase italic mb-1">{miZoneActive ? 'MiZone Activated' : 'System Standby'}</p>
                    <p className="text-[10px] font-black uppercase tracking-widest text-brand-text-muted">{miZoneActive ? 'Low-friction environment engaged' : 'Ready to activate'}</p>
                </div>
            </div>

            <Button onClick={handleActivateMiZone} disabled={miZoneActive} className="w-full py-5 text-lg font-black tracking-widest uppercase shadow-[0_0_20px_rgba(99,102,241,0.2)]">
                {miZoneActive ? 'Protocol Active' : 'Activate MiZone'}
            </Button>
        </Card>
      </div>

      {/* Aesthetic Cognitive Mapping Panel */}
      <Card className="relative overflow-hidden">
        <div className="absolute top-0 right-0 p-6 opacity-10">
            <Lightbulb size={120} />
        </div>

        <h2 className="text-2xl font-black mb-4 font-header tracking-tight uppercase italic flex items-center gap-3">
            <Lightbulb className="text-hbdi-yellow" /> Aesthetic Cognitive Mapping (ACM)
        </h2>
        <p className="text-brand-text-muted mb-10 font-medium leading-relaxed max-w-2xl">{acm.message}</p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="glass-panel p-8 rounded-3xl border border-white/5 flex items-center gap-6 group hover:border-brand-primary/30 transition-all duration-300">
                <div className={`p-4 rounded-2xl bg-white/5 ${acm.lightColor} shadow-lg`}>
                    <Lightbulb size={32} />
                </div>
                <div>
                    <p className="text-[10px] font-black uppercase tracking-[0.2em] text-brand-text-muted mb-1">Simulated Lighting</p>
                    <p className="text-2xl font-black font-header tracking-tight uppercase italic">{acm.light}</p>
                </div>
            </div>
            <div className="glass-panel p-8 rounded-3xl border border-white/5 flex items-center gap-6 group hover:border-brand-secondary/30 transition-all duration-300">
                <div className="p-4 rounded-2xl bg-white/5 text-brand-secondary shadow-lg">
                    <Volume2 size={32} />
                </div>
                <div>
                    <p className="text-[10px] font-black uppercase tracking-[0.2em] text-brand-text-muted mb-1">Simulated Soundscape</p>
                    <p className="text-2xl font-black font-header tracking-tight uppercase italic">{acm.sound}</p>
                </div>
            </div>
        </div>
      </Card>
    </div>
  );
};

export default MiHomeHub;
