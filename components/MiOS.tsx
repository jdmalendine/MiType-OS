
import React, { useState, useEffect } from 'react';
import { UserProfile } from '../types';
import Card from './Card';
import Button from './Button';
import { Cpu, Dna, ShieldAlert, ShieldCheck } from 'lucide-react';
import Logo from './Logo';

const bootSequence = [
  "MIOS CORE KERNEL: Initializing...",
  "Running system diagnostics... OK",
  "Loading Cognitive Matrix Subroutines...",
  "Establishing secure connection to Gemini Core...",
  "Parsing assessment data packets...",
  "Cross-referencing archetypal patterns...",
  "Synthesizing psychometric signature...",
  "User profile integrity verified.",
  "Rendering Cognitive Dashboard Interface...",
  "MIOS Ready."
];

const Typewriter: React.FC<{ text: string; onComplete?: () => void }> = ({ text, onComplete }) => {
  const [displayText, setDisplayText] = useState('');
  useEffect(() => {
    setDisplayText('');
    let i = 0;
    const intervalId = setInterval(() => {
      if (i < text.length) {
        setDisplayText(prev => prev + text.charAt(i));
        i++;
      } else {
        clearInterval(intervalId);
        if (onComplete) onComplete();
      }
    }, 50);
    return () => clearInterval(intervalId);
  }, [text, onComplete]);

  return <span className="font-semibold text-2xl text-brand-primary">{displayText}</span>;
};


const MiOS: React.FC<{ userProfile: UserProfile; onEnterDashboard: () => void }> = ({ userProfile, onEnterDashboard }) => {
  const [bootLog, setBootLog] = useState<string[]>([]);
  const [currentBootStep, setCurrentBootStep] = useState(0);
  const [isBootComplete, setIsBootComplete] = useState(false);
  const [isProfileVisible, setIsProfileVisible] = useState(false);

  useEffect(() => {
    if (currentBootStep < bootSequence.length) {
      const timer = setTimeout(() => {
        setBootLog(prev => [...prev, bootSequence[currentBootStep]]);
        setCurrentBootStep(prev => prev + 1);
      }, 150 + Math.random() * 100);
      return () => clearTimeout(timer);
    } else {
      const finalTimer = setTimeout(() => setIsBootComplete(true), 500);
      return () => clearTimeout(finalTimer);
    }
  }, [currentBootStep]);

  useEffect(() => {
    if (isBootComplete) {
      const profileTimer = setTimeout(() => setIsProfileVisible(true), 500);
      return () => clearTimeout(profileTimer);
    }
  }, [isBootComplete]);

  if (!userProfile.baseArchetype || !userProfile.egotend || !userProfile.highertend) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6">
        <Card className="max-w-md text-center border-hbdi-red/50">
          <ShieldAlert size={48} className="mx-auto text-hbdi-red mb-4 animate-pulse" />
          <h2 className="text-xl font-black font-header uppercase tracking-widest mb-2">System Error</h2>
          <p className="text-brand-text-muted font-medium">Profile data integrity compromised. Please re-initialize the assessment sequence.</p>
        </Card>
      </div>
    );
  }

  const { baseArchetype, egotend, highertend } = userProfile;

  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center p-6 relative overflow-hidden">
      {/* Background elements specific to MiOS boot */}
      <div className="absolute inset-0 bg-black/40 backdrop-blur-3xl -z-10" />
      
      <div className="w-full max-w-5xl">
        {!isBootComplete ? (
           <Card className="border-brand-primary/50 border-2 shadow-[0_0_50px_rgba(99,102,241,0.2)] p-10">
             <div className="flex items-center gap-6 mb-8">
                <div className="p-4 glass-panel rounded-2xl text-brand-primary shadow-[0_0_20px_rgba(99,102,241,0.3)]">
                    <Cpu size={40} className="animate-pulse" />
                </div>
                <div>
                    <h1 className="text-3xl font-black font-header tracking-tighter uppercase italic">Initializing MiOS Subsystem</h1>
                    <p className="text-brand-text-muted text-xs font-black uppercase tracking-[0.3em]">Kernel Version 2026.04.06-ALPHA</p>
                </div>
             </div>
             <div className="h-80 bg-black/60 rounded-2xl p-8 font-data text-xs text-brand-text/80 overflow-y-auto custom-scrollbar border border-white/5 shadow-inner leading-relaxed">
               {bootLog.map((line, i) => (
                 <p key={i} className="mb-1 animate-fade-in">
                    <span className="text-brand-text/40 mr-2">[{new Date().toLocaleTimeString([], { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' })}]</span>
                    <span className="text-brand-text/20 mr-2">SYS_INIT:</span>
                    {line}
                 </p>
               ))}
               <div className="inline-block w-2 h-4 bg-brand-text/60 ml-1 animate-pulse align-middle" />
             </div>
           </Card>
        ) : (
          <div className={`transition-all duration-1000 transform ${isProfileVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            <div className="text-center mb-12">
              <Logo size={80} className="mx-auto mb-8 drop-shadow-[0_0_30px_rgba(255,255,255,0.2)]" />
              <h1 className="text-5xl font-black font-header tracking-tighter uppercase italic mb-4">Cognitive Profile Synthesis Complete</h1>
              <p className="text-brand-text-muted text-xl font-medium">Welcome back, <Typewriter text={baseArchetype.name} /></p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
               <Card className="text-center group hover:border-hbdi-blue/50 transition-all duration-500">
                    <div className="w-16 h-16 mx-auto mb-6 glass-panel rounded-2xl flex items-center justify-center text-hbdi-blue shadow-[0_0_20px_rgba(59,130,246,0.2)] group-hover:scale-110 transition-transform">
                        <Dna size={32} />
                    </div>
                    <h2 className="text-xs font-black uppercase tracking-[0.3em] text-brand-text-muted mb-2">Base Archetype</h2>
                    <p className="text-2xl font-black font-header tracking-tight uppercase italic text-brand-text mb-3">{baseArchetype.name}</p>
                    <p className="text-sm text-brand-text-muted font-medium leading-relaxed px-4">{baseArchetype.coreDrive}</p>
                    <div className="mt-6 h-1 w-full bg-hbdi-blue/20 rounded-full overflow-hidden">
                        <div className="h-full bg-hbdi-blue w-full animate-pulse" />
                    </div>
                </Card>
                <Card className="text-center group hover:border-hbdi-red/50 transition-all duration-500">
                    <div className="w-16 h-16 mx-auto mb-6 glass-panel rounded-2xl flex items-center justify-center text-hbdi-red shadow-[0_0_20px_rgba(239,68,68,0.2)] group-hover:scale-110 transition-transform">
                        <ShieldAlert size={32} />
                    </div>
                    <h2 className="text-xs font-black uppercase tracking-[0.3em] text-brand-text-muted mb-2">Egotend State</h2>
                    <p className="text-2xl font-black font-header tracking-tight uppercase italic text-brand-text mb-3">{egotend.name}</p>
                    <p className="text-sm text-brand-text-muted font-medium leading-relaxed px-4">Primary stress-state expression and cognitive resistance.</p>
                    <div className="mt-6 h-1 w-full bg-hbdi-red/20 rounded-full overflow-hidden">
                        <div className="h-full bg-hbdi-red w-full animate-pulse" />
                    </div>
                </Card>
                <Card className="text-center group hover:border-hbdi-green/50 transition-all duration-500">
                    <div className="w-16 h-16 mx-auto mb-6 glass-panel rounded-2xl flex items-center justify-center text-hbdi-green shadow-[0_0_20px_rgba(34,197,94,0.2)] group-hover:scale-110 transition-transform">
                        <ShieldCheck size={32} />
                    </div>
                    <h2 className="text-xs font-black uppercase tracking-[0.3em] text-brand-text-muted mb-2">Highertend State</h2>
                    <p className="text-2xl font-black font-header tracking-tight uppercase italic text-brand-text mb-3">{highertend.name}</p>
                    <p className="text-sm text-brand-text-muted font-medium leading-relaxed px-4">Peak potential for growth and neural optimization.</p>
                    <div className="mt-6 h-1 w-full bg-hbdi-green/20 rounded-full overflow-hidden">
                        <div className="h-full bg-hbdi-green w-full animate-pulse" />
                    </div>
                </Card>
            </div>
            
            <div className="text-center">
              <Button onClick={onEnterDashboard} className="text-2xl py-6 px-16 font-black tracking-widest uppercase shadow-[0_0_40px_rgba(99,102,241,0.4)] hover:scale-105 transition-all">
                Enter OS Dashboard
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MiOS;