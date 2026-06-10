import React, { useRef, useEffect, useCallback } from 'react';

// --- CONFIGURATION ---
const SQUARE_SIZE = 20;
const PADDING = 2;
const MIN_SHIMMER_SPEED = 0.005;
const MAX_SHIMMER_SPEED = 0.02;

const baseColor = '#374151'; // restored brand-border
const colors = ['#3B82F6', '#22C55E', '#EF4444', '#EAB308'];
const colorPalette = [baseColor, ...colors];

interface Square {
  x: number;
  y: number;
  r: number; g: number; b: number; // current color
  targetR: number; targetG: number; targetB: number; // target color
  progress: number;
  speed: number;
}

// Helper to convert hex to RGB
const hexToRgb = (hex: string) => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16),
    } : { r: 0, g: 0, b: 0 };
};

// Helper for linear interpolation
const lerp = (start: number, end: number, amount: number) => {
    return (1 - amount) * start + amount * end;
};

const SnakeLoader: React.FC = () => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const animationFrameId = useRef<number>(0);
    const gridRef = useRef<Square[][]>([]);

    const initCanvas = useCallback(() => {
        const canvas = canvasRef.current;
        const container = canvas?.parentElement;
        if (!canvas || !container) return;

        const dpr = window.devicePixelRatio || 1;
        const rect = container.getBoundingClientRect();
        canvas.width = rect.width * dpr;
        canvas.height = rect.height * dpr;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;
        ctx.scale(dpr, dpr);

        const fullSquareSize = SQUARE_SIZE + PADDING;
        const cols = Math.floor(rect.width / fullSquareSize);
        const rows = Math.floor(rect.height / fullSquareSize);

        const newGrid: Square[][] = [];
        for (let y = 0; y < rows; y++) {
            const row: Square[] = [];
            for (let x = 0; x < cols; x++) {
                const baseRgb = hexToRgb(baseColor);
                row.push({
                    x, y,
                    r: baseRgb.r,
                    g: baseRgb.g,
                    b: baseRgb.b,
                    targetR: baseRgb.r,
                    targetG: baseRgb.g,
                    targetB: baseRgb.b,
                    progress: Math.random(),
                    speed: Math.random() * (MAX_SHIMMER_SPEED - MIN_SHIMMER_SPEED) + MIN_SHIMMER_SPEED,
                });
            }
            newGrid.push(row);
        }
        gridRef.current = newGrid;
    }, []);
    
    useEffect(() => {
        initCanvas();
        window.addEventListener('resize', initCanvas);
        return () => window.removeEventListener('resize', initCanvas);
    }, [initCanvas]);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        const animate = () => {
            const { width, height } = canvas.getBoundingClientRect();
            ctx.clearRect(0, 0, width, height);
            
            const fullSquareSize = SQUARE_SIZE + PADDING;
            
            gridRef.current.forEach(row => {
                row.forEach(square => {
                    square.progress += square.speed;
                    
                    if (square.progress >= 1) {
                        square.progress = 0;
                        square.r = square.targetR;
                        square.g = square.targetG;
                        square.b = square.targetB;
                        
                        const newColorHex = colorPalette[Math.floor(Math.random() * colorPalette.length)];
                        const newColorRgb = hexToRgb(newColorHex);
                        square.targetR = newColorRgb.r;
                        square.targetG = newColorRgb.g;
                        square.targetB = newColorRgb.b;
                    }
                    
                    const r = lerp(square.r, square.targetR, square.progress);
                    const g = lerp(square.g, square.targetG, square.progress);
                    const b = lerp(square.b, square.targetB, square.progress);

                    ctx.fillStyle = `rgb(${r}, ${g}, ${b})`;
                    ctx.fillRect(
                        square.x * fullSquareSize + PADDING / 2, 
                        square.y * fullSquareSize + PADDING / 2,
                        SQUARE_SIZE, SQUARE_SIZE
                    );
                });
            });
            
            animationFrameId.current = requestAnimationFrame(animate);
        };
        animate();

        return () => {
            if (animationFrameId.current) cancelAnimationFrame(animationFrameId.current);
        };
    }, []);

    return (
        <div className="fixed inset-0 bg-brand-bg z-50 flex items-center justify-center">
            <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />
        </div>
    );
};

export default SnakeLoader;