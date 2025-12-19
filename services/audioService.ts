class AudioService {
    private audioContext: AudioContext | null = null;
    private proceduralSounds = new Map<string, AudioBuffer>();
    private isInitialized = false;

    private async createProceduralSounds() {
        if (!this.audioContext) return;
        const context = this.audioContext;

        // Error Sound
        const errorDuration = 0.2;
        const errorBuffer = context.createBuffer(1, context.sampleRate * errorDuration, context.sampleRate);
        const errorData = errorBuffer.getChannelData(0);
        for (let i = 0; i < errorData.length; i++) {
            const t = i / context.sampleRate;
            errorData[i] = (Math.random() * 2 - 1) * Math.exp(-t * 25); // White noise with decay
        }
        this.proceduralSounds.set('error', errorBuffer);

        // Alarm Sound
        const alarmDuration = 0.15;
        const alarmBuffer = context.createBuffer(1, context.sampleRate * alarmDuration, context.sampleRate);
        const alarmData = alarmBuffer.getChannelData(0);
        for (let i = 0; i < alarmData.length; i++) {
            alarmData[i] = Math.sin(2 * Math.PI * 880 * (i / context.sampleRate)) * Math.exp(-i / context.sampleRate * 5);
        }
        this.proceduralSounds.set('alarm', alarmBuffer);

        // FIX: Add victory and fanfare procedural sounds to resolve errors
        // Victory Fanfare
        const fanfareDuration = 0.6;
        const fanfareBuffer = context.createBuffer(1, context.sampleRate * fanfareDuration, context.sampleRate);
        const fanfareData = fanfareBuffer.getChannelData(0);
        const noteDuration = context.sampleRate * 0.15;
        const freqs = [261.63, 329.63, 392.00, 523.25]; // C4, E4, G4, C5
        for (let n = 0; n < freqs.length; n++) {
            for (let i = 0; i < noteDuration; i++) {
                const idx = i + n * Math.floor(noteDuration * 0.9);
                if (idx < fanfareData.length) {
                    fanfareData[idx] += Math.sin(2 * Math.PI * freqs[n] * (i / context.sampleRate)) * Math.exp(-i / (noteDuration * 1.5)) * 0.7;
                }
            }
        }
        this.proceduralSounds.set('fanfare', fanfareBuffer);

        // Victory Sound (simple chime)
        const victoryDuration = 0.5;
        const victoryBuffer = context.createBuffer(1, context.sampleRate * victoryDuration, context.sampleRate);
        const victoryData = victoryBuffer.getChannelData(0);
        const fundamental = 523.25; // C5
        for (let i = 0; i < victoryData.length; i++) {
            const t = i / context.sampleRate;
            const sine1 = Math.sin(2 * Math.PI * fundamental * t);
            const sine2 = Math.sin(2 * Math.PI * fundamental * 2 * t) * 0.5; // octave higher
            victoryData[i] = (sine1 + sine2) * Math.exp(-t * 8) * 0.6;
        }
        this.proceduralSounds.set('victory', victoryBuffer);
    }
    
    public async init() {
        if (this.isInitialized) return;
        // @ts-ignore
        this.audioContext = new (window.AudioContext || window.webkitAudioContext)();

        try {
            console.log("AudioService: Initializing...");
            await this.createProceduralSounds();
            this.isInitialized = true;
            console.log("AudioService: Initialization complete. Procedural sounds loaded.");
        } catch (error) {
            console.error("AudioService: Failed to initialize audio assets:", error);
        }
    }

    // FIX: Update play method to return AudioBuffer to allow duration checking
    private play(buffer: AudioBuffer | undefined, volume = 1.0): AudioBuffer | undefined {
        if (!this.audioContext || !buffer) return undefined;
        if (this.audioContext.state === 'suspended') {
            this.audioContext.resume();
        }
        const source = this.audioContext.createBufferSource();
        const gainNode = this.audioContext.createGain();
        
        source.buffer = buffer;
        gainNode.gain.setValueAtTime(volume, this.audioContext.currentTime);

        source.connect(gainNode);
        gainNode.connect(this.audioContext.destination);
        source.start();
        return buffer;
    }
    
    public playErrorSound(): AudioBuffer | undefined {
        return this.play(this.proceduralSounds.get('error'), 0.3);
    }

    public playAlarmSound(): AudioBuffer | undefined {
        return this.play(this.proceduralSounds.get('alarm'), 0.5);
    }

    // FIX: Add missing methods to fix WinnerOverlay.tsx errors.
    public playVictorySound(message: string): AudioBuffer | undefined {
        // NOTE: The 'message' parameter is currently unused as there's no TTS engine in this service.
        // A generic victory chime is played instead. The method signature is kept for compatibility with the caller.
        if (message) {
             // This is just to satisfy linters and demonstrate the parameter is acknowledged.
            console.log(`Playing victory sound for: "${message}"`);
        }
        return this.play(this.proceduralSounds.get('victory'), 0.6);
    }

    public playVictoryFanfare(): AudioBuffer | undefined {
        return this.play(this.proceduralSounds.get('fanfare'), 0.4);
    }
}

// Export a singleton instance
export const audioService = new AudioService();