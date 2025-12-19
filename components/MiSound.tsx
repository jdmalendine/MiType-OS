import React, { useState, useEffect, useRef, useCallback } from 'react';
import Card from './Card';
import Button from './Button';
import { Volume2, Play, Pause } from 'lucide-react';
import NoiseImage from './NoiseImage';

type NoiseType = 'pink' | 'brown' | 'white';

const NoiseGenerator: React.FC<{ type: NoiseType, title: string, description: string, color: string }> = ({ type, title, description, color }) => {
    const [isPlaying, setIsPlaying] = useState(false);
    const [volume, setVolume] = useState(0.5);

    const audioContextRef = useRef<AudioContext | null>(null);
    const gainNodeRef = useRef<GainNode | null>(null);
    const noiseNodeRef = useRef<AudioWorkletNode | ScriptProcessorNode | null>(null);

    const createNoiseNode = useCallback((context: AudioContext): ScriptProcessorNode => {
        const bufferSize = 4096;
        let lastOut = 0;
        let b0=0, b1=0, b2=0, b3=0, b4=0, b5=0, b6=0; // For pink noise

        const node = context.createScriptProcessor(bufferSize, 1, 1);
        node.onaudioprocess = (e) => {
            const output = e.outputBuffer.getChannelData(0);
            for (let i = 0; i < bufferSize; i++) {
                if (type === 'white') {
                    output[i] = Math.random() * 2 - 1;
                } else if (type === 'brown') {
                    const white = Math.random() * 2 - 1;
                    output[i] = (lastOut + (0.02 * white)) / 1.02;
                    lastOut = output[i];
                    output[i] *= 3.5; // brown noise is quiet
                } else { // pink
                     const white = Math.random() * 2 - 1;
                    b0 = 0.99886 * b0 + white * 0.0555179;
                    b1 = 0.99332 * b1 + white * 0.0750759;
                    b2 = 0.96900 * b2 + white * 0.1538520;
                    b3 = 0.86650 * b3 + white * 0.3104856;
                    b4 = 0.55000 * b4 + white * 0.5329522;
                    b5 = -0.7616 * b5 - white * 0.0168980;
                    output[i] = b0 + b1 + b2 + b3 + b4 + b5 + b6 + white * 0.5362;
                    output[i] *= 0.11;
                    b6 = white * 0.115926;
                }
            }
        };
        return node;
    }, [type]);

    const start = useCallback(() => {
        if (!audioContextRef.current) {
            // @ts-ignore
            const context = new (window.AudioContext || window.webkitAudioContext)();
            audioContextRef.current = context;
        }
        const context = audioContextRef.current;
        if (context.state === 'suspended') {
            context.resume();
        }

        const gainNode = context.createGain();
        gainNode.gain.setValueAtTime(volume, context.currentTime);
        gainNode.connect(context.destination);
        gainNodeRef.current = gainNode;
        
        const noiseNode = createNoiseNode(context);
        noiseNode.connect(gainNode);
        noiseNodeRef.current = noiseNode;

        setIsPlaying(true);
    }, [volume, createNoiseNode]);

    const stop = useCallback(() => {
        if (noiseNodeRef.current) {
            noiseNodeRef.current.disconnect();
            noiseNodeRef.current = null;
        }
        if (gainNodeRef.current) {
            gainNodeRef.current.disconnect();
            gainNodeRef.current = null;
        }
        // Do not close context, as it might be shared or reused
        setIsPlaying(false);
    }, []);

    const togglePlay = () => {
        if (isPlaying) {
            stop();
        } else {
            start();
        }
    };
    
    useEffect(() => {
        if (gainNodeRef.current && audioContextRef.current) {
            gainNodeRef.current.gain.setValueAtTime(volume, audioContextRef.current.currentTime);
        }
    }, [volume]);
    
    // Cleanup on unmount
    useEffect(() => {
        return () => {
           stop();
           if (audioContextRef.current) {
               audioContextRef.current.close();
           }
        }
    }, [stop]);

    return (
        <Card className="flex flex-col">
            <h3 className="text-xl font-bold mb-2">{title}</h3>
            <div className="w-full aspect-video rounded-lg overflow-hidden mb-4">
                <NoiseImage color={color} />
            </div>
            <p className="text-brand-text-muted flex-grow">{description}</p>
            <div className="mt-4 flex items-center gap-4">
                <Button onClick={togglePlay} className="p-3">
                    {isPlaying ? <Pause size={20} /> : <Play size={20} />}
                </Button>
                <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.01"
                    value={volume}
                    onChange={(e) => setVolume(parseFloat(e.target.value))}
                    className="w-full h-2 bg-brand-bg rounded-lg appearance-none cursor-pointer accent-brand-primary"
                    aria-label={`${title} volume`}
                />
            </div>
        </Card>
    );
};


const MiSound: React.FC = () => {
    return (
        <div className="space-y-8">
            <Card>
                <h1 className="text-2xl font-bold mb-2 flex items-center gap-2"><Volume2 /> MiSound Module</h1>
                <p className="text-brand-text-muted">Select and control ambient soundscapes to enhance your focus or promote relaxation. All sounds are generated in real-time.</p>
            </Card>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <NoiseGenerator
                    type="pink"
                    title="Pink Noise"
                    description="Reduces the difference between high and low frequencies, making it ideal for focus and blocking out distracting sounds."
                    color="#FFC0CB" // Himalayan Pink Salt
                />
                <NoiseGenerator
                    type="brown"
                    title="Brown Noise"
                    description="A deeper, rumbling sound. Excellent for relaxation, meditation, and improving sleep quality."
                    color="#A52A2A" // Brown
                />
                <NoiseGenerator
                    type="white"
                    title="White Noise"
                    description="Contains all audible frequencies at equal intensity, creating a 'hiss' that can effectively mask other sounds."
                    color="#FFFFFF" // White
                />
            </div>
        </div>
    );
};

export default MiSound;
