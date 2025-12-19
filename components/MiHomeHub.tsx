
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
        
        // This robustly generates the alert message without potential TypeScript
        // issues from .replace() on a union type and fixes the formatting.
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
      return { light: 'Soft Green', lightColor: 'text-green-400', sound: 'Calm Ambient', message: 'Highertend state detected. Environment configured for growth and flow.' };
    } else if (stateBalance < -0.3) {
      // Direct implementation from user's log: Deep Blue for rising EIS II (Internal Intensity)
      return { light: 'Deep Blue', lightColor: 'text-blue-400', sound: 'Focused White Noise', message: 'Egotend state detected. Environment recalibrating to reduce cognitive load.' };
    }
    return { light: 'Neutral White', lightColor: 'text-white', sound: 'Silence', message: 'System state is balanced. Environment is neutral.' };
  };

  const acm = getAcmSettings();
  const getStatusColor = (status: string) => status === 'Nominal' ? 'text-green-400' : 'text-yellow-400';

  return (
    <div className="space-y-8">
      <Card>
        <h1 className="text-2xl font-bold mb-2 flex items-center gap-2"><Home /> MiHome Hub</h1>
        <p className="text-brand-text-muted">A simulation of your integrated MiType+ ecosystem. Monitor your cognitive state and manage your environment.</p>
      </Card>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* MiSentry Panel */}
        <Card className="lg:col-span-2">
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2"><Shield /> MiSentry Vigilance System</h2>
            <div className="space-y-3">
                <div className="flex justify-between items-center bg-brand-bg p-3 rounded-md">
                    <span className="font-semibold">Cognitive Drift</span>
                    <span className={`font-bold ${getStatusColor(sentryStatus.cognitiveDrift)}`}>{sentryStatus.cognitiveDrift}</span>
                </div>
                <div className="flex justify-between items-center bg-brand-bg p-3 rounded-md">
                    <span className="font-semibold">Pattern Rigidity</span>
                    <span className={`font-bold ${getStatusColor(sentryStatus.patternRigidity)}`}>{sentryStatus.patternRigidity}</span>
                </div>
                <div className="flex justify-between items-center bg-brand-bg p-3 rounded-md">
                    <span className="font-semibold">Stress Response</span>
                    <span className={`font-bold ${getStatusColor(sentryStatus.stressResponse)}`}>{sentryStatus.stressResponse}</span>
                </div>
            </div>
            {sentryAlert && (
                 <div className="mt-4 p-4 bg-yellow-900/50 border border-yellow-600 rounded-lg flex items-start gap-3">
                    <AlertTriangle className="text-yellow-400 mt-1 flex-shrink-0" />
                    <div>
                        <h4 className="font-bold text-yellow-400">MiSentry Alert</h4>
                        <p className="text-sm text-yellow-200">{sentryAlert}</p>
                        <p className="text-sm text-yellow-200 mt-1">Visit the <strong className="font-semibold">Adaptive Cycle</strong> module to log your state.</p>
                    </div>
                </div>
            )}
        </Card>

        {/* MiZone Panel */}
        <Card className="flex flex-col justify-between">
            <div>
                <h2 className="text-xl font-bold mb-2 flex items-center gap-2"><Activity /> MiZone Protocol</h2>
                <p className="text-brand-text-muted text-sm mb-4">Instantly shift your environment to a low-friction state to reduce cognitive load and promote clarity.</p>
            </div>
            <div className={`p-4 rounded-md text-center transition-colors duration-500 ${miZoneActive ? 'bg-brand-primary' : 'bg-brand-bg'}`}>
                <p className="font-bold text-lg">{miZoneActive ? 'MiZone Activated' : 'System Standby'}</p>
                <p className="text-sm">{miZoneActive ? 'Low-friction environment engaged.' : 'Ready to activate.'}</p>
            </div>
            <Button onClick={handleActivateMiZone} disabled={miZoneActive} className="w-full mt-4">
                {miZoneActive ? 'Active...' : 'Activate MiZone'}
            </Button>
        </Card>
      </div>

      {/* Aesthetic Cognitive Mapping Panel */}
      <Card>
        <h2 className="text-xl font-bold mb-4">Aesthetic Cognitive Mapping (ACM)</h2>
        <p className="text-brand-text-muted mb-4">{acm.message}</p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-brand-bg p-4 rounded-lg flex items-center gap-3">
                <Lightbulb size={24} className={acm.lightColor} />
                <div>
                    <p className="text-sm text-brand-text-muted">Simulated Lighting</p>
                    <p className="font-bold text-lg">{acm.light}</p>
                </div>
            </div>
            <div className="bg-brand-bg p-4 rounded-lg flex items-center gap-3">
                <Volume2 size={24} className="text-brand-secondary" />
                <div>
                    <p className="text-sm text-brand-text-muted">Simulated Soundscape</p>
                    <p className="font-bold text-lg">{acm.sound}</p>
                </div>
            </div>
        </div>
      </Card>
    </div>
  );
};

export default MiHomeHub;
