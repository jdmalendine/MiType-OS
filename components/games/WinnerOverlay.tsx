import React, { useRef, useEffect, useState } from 'react';
import { audioService } from '../../services/audioService';

interface Star {
  x: number; y: number;
  radius: number;
  alpha: number;
  maxAlpha: number;
  speed: number;
  color: string;
}

const victoryColors = ['#6366f1', '#ec4899', '#22c55e', '#eab308'];

const createStars = (width: number, height: number): Star[] => {
    const stars: Star[] = [];
    const count = 150;
    for (let i = 0; i < count; i++) {
        stars.push({
            x: Math.random() * width,
            y: Math.random() * height,
            radius: Math.random() * 2 + 0.5,
            alpha: 0,
            maxAlpha: Math.random() * 0.8 + 0.2,
            speed: Math.random() * 0.03 + 0.01,
            color: victoryColors[Math.floor(Math.random() * victoryColors.length)],
        });
    }
    return stars;
};

const WinnerOverlay: React.FC<{ message?: string; onComplete?: () => void }> = ({ message = "VICTORY", onComplete }) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [isVisible, setIsVisible] = useState(true);

    useEffect(() => {
        audioService.playVictoryFanfare();
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        const handleResize = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        };
        handleResize();
        window.addEventListener('resize', handleResize);

        let stars = createStars(canvas.width, canvas.height);
        let animationFrameId: number;

        const draw = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            stars.forEach(star => {
                star.alpha += star.speed;
                if (star.alpha >= star.maxAlpha || star.alpha <= 0) {
                    star.speed *= -1;
                }
                ctx.globalAlpha = Math.max(0, star.alpha);
                ctx.fillStyle = star.color;
                ctx.beginPath();
                ctx.arc(star.x, star.y, star.radius, 0, Math.PI * 2);
                ctx.fill();
            });
            animationFrameId = requestAnimationFrame(draw);
        };
        draw();

        const timer = setTimeout(() => {
            setIsVisible(false);
            if (onComplete) onComplete();
        }, 3500);

        return () => {
            window.removeEventListener('resize', handleResize);
            cancelAnimationFrame(animationFrameId);
            clearTimeout(timer);
        };
    }, [onComplete]);

    if (!isVisible) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center pointer-events-none overflow-hidden bg-brand-bg/40 backdrop-blur-sm animate-fade-in">
            <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />
            <div className="relative text-center z-10 animate-bounce">
                <h1 className="victory-text font-black text-brand-text drop-shadow-[0_0_30px_rgba(99,102,241,0.8)] tracking-tighter">
                    {message}
                </h1>
                <div className="mt-4 inline-block px-6 py-2 bg-brand-primary rounded-full text-brand-text font-bold animate-pulse">
                    CIRCUIT BROKEN
                </div>
            </div>
        </div>
    );
};

export default WinnerOverlay;