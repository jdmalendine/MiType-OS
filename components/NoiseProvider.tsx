import React, { createContext, useContext, useState, useRef, useCallback, useEffect } from 'react';

export type NoiseType = 'pink' | 'brown' | 'white';

interface NoiseState {
    isPlaying: boolean;
    volume: number;
}

interface NoiseContextType {
    states: Record<NoiseType, NoiseState>;
    togglePlay: (type: NoiseType) => void;
    setVolume: (type: NoiseType, volume: number) => void;
}

const NoiseContext = createContext<NoiseContextType | undefined>(undefined);

export const useNoise = () => {
    const context = useContext(NoiseContext);
    if (!context) throw new Error('useNoise must be used within a NoiseProvider');
    return context;
};

export const NoiseProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [states, setStates] = useState<Record<NoiseType, NoiseState>>({
        pink: { isPlaying: false, volume: 0.5 },
        brown: { isPlaying: false, volume: 0.5 },
        white: { isPlaying: false, volume: 0.5 },
    });

    const audioContextRef = useRef<AudioContext | null>(null);
    const nodesRef = useRef<Record<NoiseType, { gain: GainNode, noise: ScriptProcessorNode } | null>>({
        pink: null,
        brown: null,
        white: null,
    });

    const createNoiseNode = useCallback((context: AudioContext, type: NoiseType): ScriptProcessorNode => {
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
                    output[i] *= 3.5;
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
    }, []);

    // Manage audio nodes based on state
    useEffect(() => {
        Object.keys(states).forEach(key => {
            const type = key as NoiseType;
            const { isPlaying, volume } = states[type];
            const existingNodes = nodesRef.current[type];

            if (isPlaying && !existingNodes) {
                // Start audio
                if (!audioContextRef.current) {
                    // @ts-ignore
                    audioContextRef.current = new (window.AudioContext || window.webkitAudioContext)();
                }
                const context = audioContextRef.current;
                if (context.state === 'suspended') {
                    context.resume();
                }

                const gainNode = context.createGain();
                gainNode.gain.setValueAtTime(volume, context.currentTime);
                gainNode.connect(context.destination);
                
                const noiseNode = createNoiseNode(context, type);
                noiseNode.connect(gainNode);
                
                nodesRef.current[type] = { gain: gainNode, noise: noiseNode };
            } else if (!isPlaying && existingNodes) {
                // Stop audio - be extremely aggressive with cleanup
                try {
                    existingNodes.gain.gain.cancelScheduledValues(audioContextRef.current!.currentTime);
                    existingNodes.gain.gain.setValueAtTime(0, audioContextRef.current!.currentTime);
                    existingNodes.noise.onaudioprocess = null;
                    existingNodes.noise.disconnect();
                    existingNodes.gain.disconnect();
                } catch (e) {
                    console.error("Error stopping audio node:", e);
                }
                nodesRef.current[type] = null;
            } else if (isPlaying && existingNodes) {
                // Update volume
                if (audioContextRef.current) {
                    existingNodes.gain.gain.setTargetAtTime(volume, audioContextRef.current.currentTime, 0.05);
                }
            }
        });
    }, [states, createNoiseNode]);

    const togglePlay = useCallback((type: NoiseType) => {
        setStates(prev => ({
            ...prev,
            [type]: { ...prev[type], isPlaying: !prev[type].isPlaying }
        }));
    }, []);

    const setVolume = useCallback((type: NoiseType, volume: number) => {
        setStates(prev => ({
            ...prev,
            [type]: { ...prev[type], volume }
        }));
    }, []);

    // Cleanup on unmount
    useEffect(() => {
        return () => {
            Object.keys(nodesRef.current).forEach(type => {
                const nodes = nodesRef.current[type as NoiseType];
                if (nodes) {
                    try {
                        nodes.noise.onaudioprocess = null;
                        nodes.noise.disconnect();
                        nodes.gain.disconnect();
                    } catch (e) {}
                }
            });
            if (audioContextRef.current) {
                audioContextRef.current.close();
            }
        };
    }, []);

    return (
        <NoiseContext.Provider value={{ states, togglePlay, setVolume }}>
            {children}
        </NoiseContext.Provider>
    );
};
