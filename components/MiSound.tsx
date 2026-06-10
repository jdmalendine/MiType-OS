import React from 'react';
import Card from './Card';
import Button from './Button';
import { Volume2, Play, Pause } from 'lucide-react';
import NoiseImage from './NoiseImage';
import { useNoise, NoiseType } from './NoiseProvider';

const NoiseGenerator: React.FC<{ type: NoiseType, title: string, description: string, color: string }> = ({ type, title, description, color }) => {
    const { states, togglePlay, setVolume } = useNoise();
    const { isPlaying, volume } = states[type];

    return (
        <Card className="flex flex-col h-full group">
            <h3 className="text-lg font-black mb-4 font-header tracking-tight italic group-hover:text-brand-primary transition-colors">{title}</h3>
            <div className="w-full aspect-video rounded-xl overflow-hidden mb-6 border border-brand-border/20 shadow-inner relative">
                <NoiseImage color={color} />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent pointer-events-none"></div>
            </div>
            <p className="text-sm text-brand-text-muted flex-grow leading-relaxed font-medium">{description}</p>
            <div className="mt-6 flex items-center gap-4">
                <Button onClick={() => togglePlay(type)} className="!p-4 rounded-xl shadow-[0_0_15px_rgba(99,102,241,0.2)]">
                    {isPlaying ? <Pause size={24} /> : <Play size={24} />}
                </Button>
                <div className="flex-grow space-y-2">
                    <div className="flex justify-between text-[10px] font-data text-brand-text-muted uppercase tracking-widest">
                        <span>Volume</span>
                        <span>{Math.round(volume * 100)}%</span>
                    </div>
                    <input
                        type="range"
                        min="0"
                        max="1"
                        step="0.01"
                        value={volume}
                        onChange={(e) => setVolume(type, parseFloat(e.target.value))}
                        className="w-full h-1.5 bg-white/5 rounded-full appearance-none cursor-pointer accent-brand-primary hover:accent-brand-primary/80 transition-all"
                        aria-label={`${title} volume`}
                    />
                </div>
            </div>
        </Card>
    );
};


const MiSound: React.FC = () => {
    return (
        <div className="space-y-10">
             <div className="flex items-center gap-4 text-3xl font-black font-header tracking-tighter italic">
                <div className="p-3 glass-panel rounded-xl text-brand-primary shadow-[0_0_20px_rgba(99,102,241,0.3)]">
                    <Volume2 size={32} />
                </div>
                <h1>MISOUND MODULE</h1>
            </div>

            <Card>
                <h2 className="text-2xl font-black mb-4 flex items-center gap-3 font-header tracking-tight italic"><Volume2 className="text-brand-primary" /> NEURAL SOUNDSCAPES</h2>
                <p className="text-brand-text-muted leading-relaxed font-medium max-w-3xl">Select and control ambient soundscapes to enhance your focus or promote relaxation. All sounds are generated in real-time using high-fidelity neural synthesis.</p>
            </Card>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                <NoiseGenerator
                    type="pink"
                    title="PINK NOISE"
                    description="Reduces the difference between high and low frequencies, making it ideal for focus and blocking out distracting sounds."
                    color="#FFC0CB"
                />
                <NoiseGenerator
                    type="brown"
                    title="BROWN NOISE"
                    description="A deeper, rumbling sound. Excellent for relaxation, meditation, and improving sleep quality."
                    color="#A52A2A"
                />
                <NoiseGenerator
                    type="white"
                    title="WHITE NOISE"
                    description="Contains all audible frequencies at equal intensity, creating a 'hiss' that can effectively mask other sounds."
                    color="#FFFFFF"
                />
            </div>
        </div>
    );
};

export default MiSound;
