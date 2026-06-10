import React, { useState, useEffect, useCallback } from 'react';
import { audioService } from '../../services/audioService';

type GridCellState = 'default' | 'highlight' | 'success';

const PatternInterruptGame: React.FC<{ onComplete: () => void }> = ({ onComplete }) => {
    const [sequence, setSequence] = useState<number[]>([]);
    const [playerInput, setPlayerInput] = useState<Set<number>>(new Set());
    const [isShowingSequence, setIsShowingSequence] = useState(true);
    const [message, setMessage] = useState('Watch carefully...');
    const [gridState, setGridState] = useState<GridCellState[]>(Array(9).fill('default'));
    const [isGlitching, setIsGlitching] = useState(false);

    const triggerGlitch = useCallback(() => {
        setIsGlitching(true);
        setTimeout(() => setIsGlitching(false), 200);
    }, []);

    const generateAndShowSequence = useCallback(() => {
        const newSequence: number[] = [];
        while (newSequence.length < 3) {
            const rand = Math.floor(Math.random() * 9);
            if (!newSequence.includes(rand)) {
                newSequence.push(rand);
            }
        }
        setSequence(newSequence);
        setIsShowingSequence(true);
        setMessage('Watch carefully...');

        let delay = 500;
        newSequence.forEach(index => {
            setTimeout(() => {
                setGridState(prev => {
                    const newState = [...prev];
                    newState[index] = 'highlight';
                    return newState;
                });
                setTimeout(() => {
                    setGridState(prev => {
                        const newState = [...prev];
                        newState[index] = 'default';
                        return newState;
                    });
                }, 300); // How long each tile is lit
            }, delay);
            delay += 400; // Time between tiles
        });

        // Set player turn after sequence is shown
        setTimeout(() => {
            setIsShowingSequence(false);
            setMessage('Repeat the pattern');
        }, delay);
    }, []);

    useEffect(() => {
        generateAndShowSequence();
    }, [generateAndShowSequence]);

    const handlePlayerClick = (index: number) => {
        if (isShowingSequence || playerInput.has(index)) return;

        // Only allow clicking on tiles that are part of the sequence
        if (sequence.includes(index)) {
            const newPlayerInput = new Set(playerInput);
            newPlayerInput.add(index);
            setPlayerInput(newPlayerInput);

            if (newPlayerInput.size === 3) {
                setMessage('Circuit Broken!');
                setGridState(Array(9).fill('success'));
                setTimeout(onComplete, 1200);
            }
        } else {
            // Trigger glitch on wrong click
            triggerGlitch();
            audioService.playErrorSound();
        }
    };
    
    const getTileClass = (index: number) => {
        if (gridState[index] === 'success') return 'bg-hbdi-green border-hbdi-green shadow-[0_0_15px_rgba(34,197,94,0.5)]';
        if (playerInput.has(index)) return 'bg-brand-secondary border-brand-secondary shadow-[0_0_15px_rgba(99,102,241,0.5)]'; // Correctly clicked tile
        if (gridState[index] === 'highlight') return 'bg-hbdi-yellow border-hbdi-yellow shadow-[0_0_15px_rgba(234,179,8,0.5)]';
        return 'bg-white/5 border-white/10';
    };

    const getCursorClass = (index: number) => {
        if (isShowingSequence || playerInput.has(index)) {
            return 'cursor-default';
        }
        // Make only the correct, un-clicked tiles clickable
        if (sequence.includes(index)) {
            return 'cursor-pointer hover:opacity-80';
        }
        return 'cursor-not-allowed opacity-50';
    };

    return (
        <div className="flex flex-col items-center">
            <p className="mb-4 text-lg font-semibold h-7">{message}</p>
            <div className={`grid grid-cols-3 gap-4 p-4 bg-black/40 rounded-xl border border-white/5 shadow-2xl transition-all duration-300 ${isGlitching ? 'animate-glitch' : ''}`}>
                {Array.from({ length: 9 }).map((_, i) => (
                    <div
                        key={i}
                        onClick={() => handlePlayerClick(i)}
                        className={`w-20 h-20 rounded-lg border transition-all duration-200 ${getTileClass(i)} ${getCursorClass(i)}`}
                        aria-label={`Grid cell ${i + 1}`}
                        role="button"
                    />
                ))}
            </div>
        </div>
    );
};

export default PatternInterruptGame;
