import React, { useState, useEffect, useCallback, useRef } from 'react';
import Button from '../Button';
import { Zap } from 'lucide-react';

interface Element {
  symbol: string;
  name: string;
}

const elements: Element[] = [
    { symbol: 'H', name: 'Hydrogen' }, { symbol: 'He', name: 'Helium' }, { symbol: 'Li', name: 'Lithium' },
    { symbol: 'Be', name: 'Beryllium' }, { symbol: 'B', name: 'Boron' }, { symbol: 'C', name: 'Carbon' },
    { symbol: 'N', name: 'Nitrogen' }, { symbol: 'O', name: 'Oxygen' }, { symbol: 'F', name: 'Fluorine' },
    { symbol: 'Ne', name: 'Neon' }, { symbol: 'Na', name: 'Sodium' }, { symbol: 'Mg', name: 'Magnesium' },
    { symbol: 'Al', name: 'Aluminium' }, { symbol: 'Si', name: 'Silicon' }, { symbol: 'P', name: 'Phosphorus' },
    { symbol: 'S', name: 'Sulfur' }, { symbol: 'Cl', name: 'Chlorine' }, { symbol: 'Ar', name: 'Argon' },
    { symbol: 'K', name: 'Potassium' }, { symbol: 'Ca', name: 'Calcium' }, { symbol: 'Fe', name: 'Iron' },
    { symbol: 'Ni', name: 'Nickel' }, { symbol: 'Cu', name: 'Copper' }, { symbol: 'Zn', name: 'Zinc' },
];

const ElementCaptureGame: React.FC = () => {
    const [gameState, setGameState] = useState<'ready' | 'playing' | 'won'>('ready');
    const [targetElement, setTargetElement] = useState<Element | null>(null);
    const [captured, setCaptured] = useState<(Element | null)[]>(Array(4).fill(null));
    const [gridElements, setGridElements] = useState<(Element | null)[]>(Array(4).fill(null));
    
    const gameLoopRef = useRef<number | null>(null);

    const pickNewTarget = useCallback((currentCaptured: (Element | null)[]) => {
        const capturedCount = currentCaptured.filter(Boolean).length;
        if (capturedCount >= 4) {
            setTargetElement(null);
            setGameState('won');
            return;
        }

        const capturedSymbols = new Set(currentCaptured.filter(Boolean).map(el => el!.symbol));
        const availableForTarget = elements.filter(el => !capturedSymbols.has(el.symbol));
        
        if (availableForTarget.length > 0) {
            const newTarget = availableForTarget[Math.floor(Math.random() * availableForTarget.length)];
            setTargetElement(newTarget);
        } else {
             setTargetElement(null);
             setGameState('won');
        }
    }, []);
    
    const setupGame = () => {
        const initialCaptured = Array(4).fill(null);
        setCaptured(initialCaptured);
        setGridElements(initialCaptured);
        pickNewTarget(initialCaptured);
        setGameState('playing');
    };

    useEffect(() => {
        if (gameState === 'won') {
            const timer = setTimeout(() => setGameState('ready'), 2000);
            return () => clearTimeout(timer);
        }

        if (gameState !== 'playing' || !targetElement) {
            if (gameLoopRef.current) clearInterval(gameLoopRef.current);
            return;
        }

        gameLoopRef.current = window.setInterval(() => {
            setGridElements(currentGrid => {
                const newGrid = [...captured];
                const availableSlots = newGrid.map((v, i) => v === null ? i : -1).filter(i => i !== -1);
                const usedSymbols = new Set(captured.filter(Boolean).map(el => el!.symbol));

                if (Math.random() < 0.25 && availableSlots.length > 0 && targetElement) {
                    const targetSlot = availableSlots.splice(Math.floor(Math.random() * availableSlots.length), 1)[0];
                    newGrid[targetSlot] = targetElement;
                    usedSymbols.add(targetElement.symbol);
                }
                
                availableSlots.forEach(slotIndex => {
                    let randomElement;
                    do {
                        randomElement = elements[Math.floor(Math.random() * elements.length)];
                    } while (usedSymbols.has(randomElement.symbol));
                    newGrid[slotIndex] = randomElement;
                    usedSymbols.add(randomElement.symbol);
                });

                return newGrid;
            });
        }, 900);

        return () => { if (gameLoopRef.current) clearInterval(gameLoopRef.current); };

    }, [gameState, targetElement, captured, pickNewTarget]);

    const handleSquareClick = (index: number) => {
        if (gameState !== 'playing' || captured[index] || !gridElements[index] || !targetElement) return;
        
        if (gridElements[index]?.symbol === targetElement.symbol) {
            const newCaptured = [...captured];
            newCaptured[index] = targetElement;
            setCaptured(newCaptured);
            pickNewTarget(newCaptured);
        }
    };

    if (gameState === 'ready') {
        return (
            <div className="w-full mx-auto flex flex-col items-center p-8 pt-12 min-h-[450px] text-center">
                <Zap size={64} className="text-brand-primary mb-6" />
                <h2 className="text-3xl font-bold text-white mb-2">Test your reflexes.</h2>
                <p className="text-brand-text-muted mb-8 max-w-md">When the target element appears in a square, click to capture it. The grid will shuffle periodically. Capture all four targets to win.</p>
                <Button onClick={setupGame} className="text-lg py-3 px-8">Start Game</Button>
            </div>
        );
    }
    
    return (
        <div className="w-full max-w-md mx-auto flex flex-col items-center">
             <div className="w-full flex flex-col items-center">
                <div className="mb-6 text-center h-20">
                    <p className="text-brand-text-muted">Target Element</p>
                    {targetElement ? (
                        <>
                            <h2 className="text-4xl font-bold text-brand-primary">{targetElement.symbol}</h2>
                            <p className="font-semibold">{targetElement.name}</p>
                        </>
                    ) : <div className="h-12" />}
                </div>

                <div className="relative">
                    {gameState === 'won' && (
                        <div className="absolute inset-0 bg-brand-bg/60 backdrop-blur-sm flex items-center justify-center z-10 rounded-lg animate-fade-in">
                            <h2 className="text-4xl font-bold text-green-400">SUCCESS!</h2>
                        </div>
                    )}
                    <div className="grid grid-cols-2 gap-4 p-3 bg-black/20 rounded-lg">
                        {Array.from({ length: 4 }).map((_, i) => {
                            const isCaptured = !!captured[i];
                            const element = gridElements[i];
                            return (
                                <button
                                    key={i}
                                    onClick={() => handleSquareClick(i)}
                                    disabled={isCaptured || gameState !== 'playing'}
                                    aria-label={`Grid cell ${i + 1}`}
                                    className={`w-28 h-28 md:w-32 md:h-32 rounded-lg flex flex-col items-center justify-center transition-all duration-200
                                    ${isCaptured ? `bg-brand-primary text-white shadow-lg scale-105 cursor-default ${gameState === 'won' ? 'animate-pulse-green' : ''}`
                                                : `bg-brand-surface border border-brand-border ${ gameState === 'playing' ? 'hover:border-brand-primary hover:scale-105' : ''}`}`
                                    }
                                >
                                    {element && (
                                        <>
                                            <span className="text-4xl font-bold">{element.symbol}</span>
                                            <span className="text-xs text-brand-text-muted">{element.name}</span>
                                        </>
                                    )}
                                </button>
                            )
                        })}
                    </div>
                </div>
             </div>
        </div>
    );
};

export default ElementCaptureGame;