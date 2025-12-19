import React, { useRef, useEffect, useCallback, useState } from 'react';
import { audioService } from '../../services/audioService';

// --- Starfield Animation ---
interface Star {
  x: number; y: number;
  radius: number;
  alpha: number;
  maxAlpha: number;
  speed: number;
  color: string;
}

// FIX: Use only the brand's core colors, removing purple and pink accents.
const victoryColors = ['#3B82F6', '#22C55E', '#EF4444', '#EAB308'];

const createStars = (width: number, height: number): Star[] => {
    const stars: Star[] = [];
    const count = 100; // A reasonable number of stars
    for (let i = 0; i < count; i++) {
        stars.push({
            x: Math.random() * width,
            y: Math.random() * height,
            radius: Math.random() * 2.5 + 0.5,
            alpha: 0,
            maxAlpha: Math.random() * 0.7 + 0.3,
            speed: Math.random() * 0.02 + 0.005,
            color: victoryColors[Math.floor(Math.random() * victoryColors.length)],
        });
    }
    return stars;
};


// --- Component ---
interface WinnerOverlayProps {
  isOpen: boolean;
  onClose: () => void;
}

export const victoryMessages = [
    "EXCELLENT!", "WELL DONE!", "GOOD JOB!", "NICE!", "AWESOME!", "GREAT ROUND!",
];

const WinnerOverlay: React.FC<WinnerOverlayProps> = ({ isOpen, onClose }) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const animationFrameId = useRef<number>(0);
    const starsRef = useRef<Star[]>([]);
    const [currentMessage, setCurrentMessage] = useState('');
    const [playState, setPlayState] = useState<'idle' | 'playing'>('idle');

    const animate = useCallback((ctx: CanvasRenderingContext2D, width: number, height: number) => {
        ctx.clearRect(0, 0, width, height);
        starsRef.current.forEach(star => {
            star.alpha += star.speed;
            if (star.alpha > star.maxAlpha) {
                star.speed *= -1;
            } else if (star.alpha < 0) {
                // Reset the star when it fades out
                star.x = Math.random() * width;
                star.y = Math.random() * height;
                star.alpha = 0;
                star.speed = Math.abs(star.speed);
            }
            
            ctx.beginPath();
            ctx.arc(star.x, star.y, star.radius, 0, Math.PI * 2);
            ctx.fillStyle = `${star.color}${Math.round(star.alpha * 255).toString(16).padStart(2, '0')}`;
            ctx.fill();
        });
        animationFrameId.current = requestAnimationFrame(() => animate(ctx, width, height));
    }, []);

    useEffect(() => {
        let closeTimer: number | undefined;

        if (isOpen && playState === 'idle') {
            setPlayState('playing');
            
            const canvas = canvasRef.current;
            if (canvas) {
                const dpr = window.devicePixelRatio || 1;
                const rect = canvas.getBoundingClientRect();
                canvas.width = rect.width * dpr;
                canvas.height = rect.height * dpr;
                const animationCtx = canvas.getContext('2d');
                if (animationCtx) {
                    animationCtx.scale(dpr, dpr);
                    starsRef.current = createStars(rect.width, rect.height);
                    if (animationFrameId.current) cancelAnimationFrame(animationFrameId.current);
                    animate(animationCtx, rect.width, rect.height);
                }
            }

            const randomMessage = victoryMessages[Math.floor(Math.random() * victoryMessages.length)];
            setCurrentMessage(randomMessage);
            const voiceBuffer = audioService.playVictorySound(randomMessage);
            audioService.playVictoryFanfare();

            const voiceDurationMs = voiceBuffer ? voiceBuffer.duration * 1000 : 1200;
            const displayDuration = Math.max(voiceDurationMs + 400, 1800); // Snappier timing
            closeTimer = window.setTimeout(onClose, displayDuration);

        } else if (!isOpen) {
            setPlayState('idle'); // Reset for the next victory
        }

        return () => {
            clearTimeout(closeTimer);
            if (animationFrameId.current) {
                cancelAnimationFrame(animationFrameId.current);
            }
        };
    }, [isOpen, playState, onClose, animate]);


    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-brand-bg/80 backdrop-blur-sm flex flex-col items-center justify-center z-50 text-white overflow-hidden animate-fade-in">
            <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />
            <div className="relative text-center p-4">
                <h2 className="victory-text font-extrabold" style={{ textShadow: '0px 4px 25px rgba(0, 0, 0, 0.5), 0 0 15px var(--color-brand-primary)' }}>
                    {currentMessage}
                </h2>
            </div>
        </div>
    );
};

export default WinnerOverlay;