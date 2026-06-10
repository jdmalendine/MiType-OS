import React from 'react';
import Button from '../Button';
import { AlertTriangle, Timer, BrainCircuit } from 'lucide-react';
import { audioService } from '../../services/audioService';

const GRID_SIZE = 16; // 4x4 grid
const INITIAL_TIME = 20;
const MIN_TIME = 5;
const TIME_DECREMENT_PER_LEVEL = 1;

// 0: default, 1: purple, 2: green, 3: red, 4: yellow
const cellColors = [
    'bg-white/5 border border-white/10',
    'bg-hbdi-blue border border-hbdi-blue/50 shadow-[0_0_15px_rgba(59,130,246,0.4)]',
    'bg-hbdi-green border border-hbdi-green/50 shadow-[0_0_15px_rgba(34,197,94,0.4)]',
    'bg-hbdi-red border border-hbdi-red/50 shadow-[0_0_15px_rgba(239,68,68,0.4)]',
    'bg-hbdi-yellow border border-hbdi-yellow/50 shadow-[0_0_15px_rgba(234,179,8,0.4)]',
];

const generatePattern = (level: number): number[] => {
    const pattern = Array(GRID_SIZE).fill(0);
    const cellsToColor = Math.min(3 + level, Math.floor(GRID_SIZE / 2));
    let count = 0;
    while (count < cellsToColor) {
        const index = Math.floor(Math.random() * GRID_SIZE);
        if (pattern[index] === 0) {
            pattern[index] = Math.floor(Math.random() * (cellColors.length - 1)) + 1;
            count++;
        }
    }
    return pattern;
};

const areArraysEqual = (a: number[], b: number[]): boolean => {
    if (a.length !== b.length) return false;
    for (let i = 0; i < a.length; i++) {
        if (a[i] !== b[i]) return false;
    }
    return true;
};

const PatternChallengeGame: React.FC = () => {
    const [level, setLevel] = React.useState(1);
    const [score, setScore] = React.useState(0);
    const [targetPattern, setTargetPattern] = React.useState<number[]>([]);
    const [userGrid, setUserGrid] = React.useState<number[]>(Array(GRID_SIZE).fill(0));
    const [gameState, setGameState] = React.useState<'ready' | 'playing' | 'levelComplete' | 'gameOver'>('ready');
    const [timeLeft, setTimeLeft] = React.useState(INITIAL_TIME);
    const [errorCellIndex, setErrorCellIndex] = React.useState<number | null>(null);
    const [isGlitching, setIsGlitching] = React.useState(false);
    
    const timerRef = React.useRef<number | null>(null);
    const isPlayingRef = React.useRef(false);

    React.useEffect(() => {
        isPlayingRef.current = gameState === 'playing';
    }, [gameState]);

    const setupNewLevel = React.useCallback((lvl: number) => {
        setTargetPattern(generatePattern(lvl));
        setUserGrid(Array(GRID_SIZE).fill(0));
        const newTime = Math.max(MIN_TIME, INITIAL_TIME - (lvl - 1) * TIME_DECREMENT_PER_LEVEL);
        setTimeLeft(newTime);
        setGameState('playing');
    }, []);
    
    const handleStartGame = React.useCallback(() => {
        setLevel(1);
        setScore(0);
        setupNewLevel(1);
    }, [setupNewLevel]);
    
    const handleNextLevel = React.useCallback(() => {
        const newLevel = level + 1;
        setLevel(newLevel);
        setupNewLevel(newLevel);
    }, [level, setupNewLevel]);

    React.useEffect(() => {
        if (gameState === 'levelComplete') {
            const timer = setTimeout(() => {
                handleNextLevel();
            }, 1500);
            return () => clearTimeout(timer);
        }

        if (gameState === 'playing') {
            timerRef.current = window.setInterval(() => {
                if (!isPlayingRef.current) {
                    if (timerRef.current) clearInterval(timerRef.current);
                    return;
                }
                
                setTimeLeft(prev => {
                    if (prev <= 1) {
                        setGameState('gameOver');
                        audioService.playErrorSound();
                        triggerGlitch();
                        if(timerRef.current) clearInterval(timerRef.current);
                        return 0;
                    }
                    if (prev <= 6 && prev > 1) { // Play sound from 5 down to 1
                         audioService.playAlarmSound();
                    }
                    return prev - 1;
                });
            }, 1000);
        } else {
            if (timerRef.current) clearInterval(timerRef.current);
        }
        return () => {
            if (timerRef.current) clearInterval(timerRef.current);
        };
    }, [gameState, handleNextLevel]);
    
    const triggerGlitch = React.useCallback(() => {
        setIsGlitching(true);
        setTimeout(() => setIsGlitching(false), 200);
    }, []);

    const handleCellClick = (index: number) => {
        if (gameState !== 'playing') return;

        // Trigger subtle glitch on every click for "neural" feedback
        triggerGlitch();

        const newUserGrid = [...userGrid];
        // Cycle through colors 0, 1, 2, 3, 4.
        const currentColor = newUserGrid[index];
        const newColor = (currentColor + 1) % 5;
        newUserGrid[index] = newColor;
        setUserGrid(newUserGrid);

        if (areArraysEqual(newUserGrid, targetPattern)) {
            const points = 100 * level + timeLeft * 10;
            setScore(prev => prev + points);
            setGameState('levelComplete');
        }
    };

    if (gameState === 'ready') {
        return (
            <div className="w-full mx-auto flex flex-col items-center p-8 pt-12 min-h-[450px] text-center">
                <BrainCircuit size={64} className="text-brand-primary mb-6" />
                <h2 className="text-3xl font-bold text-brand-text mb-2">Ready for a challenge?</h2>
                <p className="text-brand-text-muted mb-8">Recreate the colored patterns on the grid. Click the active cells to cycle through colors until your grid exactly matches the target pattern.</p>
                <div className="flex gap-4">
                    <Button onClick={handleStartGame} className="text-lg py-3 px-8">Start Game</Button>
                </div>
            </div>
        )
    }

    const GameContent = () => (
         <div className={`p-1 rounded-lg transition-shadow duration-300 ${gameState === 'levelComplete' ? 'animate-pulse-green' : ''} ${isGlitching ? 'animate-glitch' : ''}`}>
             <div className="grid grid-cols-2 gap-6 md:gap-10">
                <div>
                    <h3 className="text-[10px] font-black text-center mb-3 text-brand-text-muted uppercase tracking-[0.2em]">Target Pattern</h3>
                    <div className="grid grid-cols-4 gap-2 p-3 bg-black/40 rounded-xl border border-white/5 shadow-2xl">
                        {targetPattern.map((colorIndex, i) => (
                            <div key={i} className={`aspect-square rounded-lg transition-all duration-500 ${cellColors[colorIndex || 0]}`} />
                        ))}
                    </div>
                </div>
                <div>
                    <h3 className="text-[10px] font-black text-center mb-3 text-brand-text-muted uppercase tracking-[0.2em]">Your Grid</h3>
                    <div className="grid grid-cols-4 gap-2 p-3 bg-black/40 rounded-xl border border-white/5 shadow-2xl">
                        {userGrid.map((colorIndex, i) => {
                            const isError = errorCellIndex === i;
                            const errorClass = isError ? '!bg-red-500 !border-red-400 shadow-[0_0_20px_rgba(239,68,68,0.8)]' : '';
                            return (
                                <button
                                    key={i}
                                    onClick={() => handleCellClick(i)}
                                    aria-label={`Grid cell ${i + 1}`}
                                    disabled={gameState !== 'playing'}
                                    className={`aspect-square rounded-lg transition-all duration-200 ${errorClass} ${cellColors[colorIndex]} cursor-pointer hover:scale-105 active:scale-95 hover:brightness-125`}
                                />
                            )
                        })}
                    </div>
                </div>
            </div>
         </div>
    );

    return (
        <div className="w-full max-w-lg mx-auto">
            <div>
                <div className="flex justify-between items-center mb-4 text-brand-text-muted">
                    <div className="flex items-center gap-4">
                       <span className="font-bold text-lg">Score: <span className="text-brand-text">{score}</span></span>
                       <span className="font-bold text-lg">Level: <span className="text-brand-text">{level}</span></span>
                    </div>
                    <span className={`font-bold text-lg flex items-center gap-1 ${timeLeft <= 5 ? 'text-red-500 animate-pulse' : 'text-brand-text'}`}>
                        <Timer size={18} /> {timeLeft}s
                    </span>
                </div>
                
                <div className="min-h-[300px]">
                    {gameState === 'gameOver' ? (
                         <div className="flex flex-col items-center justify-center h-full bg-brand-bg rounded-lg p-4">
                             <AlertTriangle className="w-16 h-16 text-red-500 mb-4" />
                             <h2 className="text-3xl font-bold text-brand-text">Game Over</h2>
                             <p className="text-brand-text-muted mt-2">Final Score: {score}</p>
                             <Button onClick={handleStartGame} className="mt-6">Play Again</Button>
                         </div>
                    ) : (
                        <GameContent />
                    )}
                </div>
                
                <div className="mt-4 text-center text-sm text-brand-text-muted h-5">
                    {gameState === 'playing' && "Click active cells to cycle colors and match the target."}
                    {gameState === 'levelComplete' && <span className="text-green-400 font-semibold">Level Complete!</span>}
                </div>
            </div>
        </div>
    );
};

export default PatternChallengeGame;