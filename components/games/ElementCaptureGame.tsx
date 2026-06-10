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
            const timer = setTimeout(() => setGameState('ready'), 3000);
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
        }, 850);

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
            <div className="w-full mx-auto flex flex-col items-center p-12 min-h-[450px] text-center animate-fade-in">
                <div className="p-6 glass-panel rounded-3xl text-brand-primary shadow-[0_0_30px_rgba(99,102,241,0.3)] mb-8 animate-bounce-subtle">
                    <Zap size={64} />
                </div>
                <h2 className="text-4xl font-black text-brand-text mb-4 font-header tracking-tighter uppercase italic">Neural Reflex Test</h2>
                <p className="text-brand-text-muted mb-10 max-w-md font-medium leading-relaxed">When the target element appears in a square, click to capture it. The grid will shuffle periodically. Capture all four targets to optimize your processing speed.</p>
                <Button onClick={setupGame} className="text-xl py-4 px-12 font-black tracking-widest uppercase shadow-[0_0_20px_rgba(99,102,241,0.2)]">Initialize Protocol</Button>
            </div>
        );
    }
    
    return (
        <div className="w-full max-w-md mx-auto flex flex-col items-center animate-fade-in">
             <div className="w-full flex flex-col items-center">
                <div className="mb-10 text-center h-24">
                    <p className="text-[10px] font-black uppercase tracking-[0.2em] text-brand-primary mb-2">Target Acquisition</p>
                    {targetElement ? (
                        <div className="animate-scale-in">
                            <h2 className="text-5xl font-black text-brand-text font-header tracking-tighter italic drop-shadow-[0_0_15px_rgba(255,255,255,0.3)]">{targetElement.symbol}</h2>
                            <p className="font-data text-xs text-brand-text-muted uppercase tracking-widest mt-1">{targetElement.name}</p>
                        </div>
                    ) : <div className="h-16" />}
                </div>

                <div className="relative p-6 glass-panel rounded-[2.5rem] border-brand-border/30 shadow-2xl">
                    {gameState === 'won' && (
                        <div className="absolute inset-0 bg-brand-bg/80 backdrop-blur-md flex items-center justify-center z-20 rounded-[2.5rem] animate-fade-in border-2 border-hbdi-green/50 shadow-[0_0_50px_rgba(34,197,94,0.2)]">
                            <h2 className="text-5xl font-black text-brand-text font-header tracking-tighter italic uppercase animate-pulse">Neural Sync Complete</h2>
                        </div>
                    )}
                    <div className="grid grid-cols-2 gap-6">
                        {Array.from({ length: 4 }).map((_, i) => {
                            const isCaptured = !!captured[i];
                            const element = gridElements[i];
                            return (
                                <button
                                    key={i}
                                    onClick={() => handleSquareClick(i)}
                                    disabled={isCaptured || gameState !== 'playing'}
                                    aria-label={`Grid cell ${i + 1}`}
                                    className={`w-32 h-32 md:w-36 md:h-36 rounded-3xl flex flex-col items-center justify-center transition-all duration-300 relative overflow-hidden group
                                    ${isCaptured 
                                        ? `bg-brand-primary/20 border-2 border-brand-primary text-brand-text shadow-[0_0_30px_rgba(99,102,241,0.4)] scale-105 cursor-default`
                                        : `bg-black/40 border-2 border-white/5 ${ gameState === 'playing' ? 'hover:border-brand-primary/50 hover:bg-black/60 hover:scale-105' : ''}`}`
                                    }
                                >
                                    {element && (
                                        <div className="animate-scale-in flex flex-col items-center">
                                            <span className="text-4xl font-black text-brand-text font-header tracking-tighter italic">{element.symbol}</span>
                                            <span className="text-[10px] font-data text-brand-text-muted uppercase tracking-widest mt-1">{element.name}</span>
                                        </div>
                                    )}
                                    {isCaptured && (
                                        <div className="absolute top-2 right-2">
                                            <div className="w-2 h-2 rounded-full bg-brand-primary animate-pulse shadow-[0_0_10px_rgba(99,102,241,1)]" />
                                        </div>
                                    )}
                                </button>
                            )
                        })}
                    </div>
                </div>
                
                <div className="mt-10 flex gap-2">
                    {captured.map((c, i) => (
                        <div key={i} className={`w-3 h-3 rounded-full transition-all duration-500 ${c ? 'bg-brand-primary shadow-[0_0_10px_rgba(99,102,241,0.8)] scale-125' : 'bg-white/10'}`} />
                    ))}
                </div>
             </div>
        </div>
    );
};

export default ElementCaptureGame;