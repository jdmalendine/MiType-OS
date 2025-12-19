
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
    return <Card>Error: Profile data is incomplete. Please restart the assessment.</Card>
  }

  const { baseArchetype, egotend, highertend } = userProfile;

  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center p-4 bg-brand-bg text-brand-text">
      <div className="w-full max-w-4xl">
        {!isBootComplete ? (
           <Card className="border-brand-primary border-2">
             <div className="flex items-center gap-4 mb-4">
                <Cpu size={32} className="text-brand-primary animate-pulse" />
                <h1 className="text-2xl font-bold">Initializing MiOS Subsystem</h1>
             </div>
             <div className="h-64 bg-black/50 rounded-md p-4 font-mono text-sm text-green-400 overflow-y-auto">
               {bootLog.map((line, i) => (
                 <p key={i}>> {line}</p>
               ))}
               <div className="animate-pulse">_</div>
             </div>
           </Card>
        ) : (
          <div className={`transition-opacity duration-1000 ${isProfileVisible ? 'opacity-100' : 'opacity-0'}`}>
            <div className="text-center mb-8">
              <Logo size={48} className="mx-auto mb-4" />
              <h1 className="text-3xl font-bold">Cognitive Profile Synthesis Complete</h1>
              <p className="text-brand-text-muted">Welcome, <Typewriter text={baseArchetype.name} /></p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
               <Card className="border-t-4 border-hbdi-blue text-center">
                    <Dna size={32} className="mx-auto text-hbdi-blue mb-2" />
                    <h2 className="text-xl font-bold">Base Archetype</h2>
                    <p className="text-lg mt-1">{baseArchetype.name}</p>
                    <p className="text-sm text-brand-text-muted h-10 mt-2">{baseArchetype.coreDrive}</p>
                </Card>
                <Card className="border-t-4 border-red-500 text-center">
                    <ShieldAlert size={32} className="mx-auto text-red-500 mb-2" />
                    <h2 className="text-xl font-bold">Egotend State</h2>
                    <p className="text-lg mt-1">{egotend.name}</p>
                    <p className="text-sm text-brand-text-muted h-10 mt-2">Your primary stress-state expression.</p>
                </Card>
                <Card className="border-t-4 border-green-500 text-center">
                    <ShieldCheck size={32} className="mx-auto text-green-500 mb-2" />
                    <h2 className="text-xl font-bold">Highertend State</h2>
                    <p className="text-lg mt-1">{highertend.name}</p>
                     <p className="text-sm text-brand-text-muted h-10 mt-2">Your highest potential for growth.</p>
                </Card>
            </div>
            
            <div className="text-center">
              <Button onClick={onEnterDashboard} className="text-lg py-3 px-8">
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