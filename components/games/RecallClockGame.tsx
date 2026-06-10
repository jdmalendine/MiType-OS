import React, { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import Button from '../Button';
import Card from '../Card';
import { audioService } from '../../services/audioService';
import { Clock } from 'lucide-react';

const CLOCK_SIZE = 320;
const DOT_SIZE = 32;
const NUMBER_SIZE = 24;

const TickTockGame: React.FC = () => {
    const [gameState, setGameState] = useState<'ready' | 'memorize' | 'recall' | 'feedback'>('ready');
    const [time, setTime] = useState({ hour: 12, minute: 0 });
    const [userSelection, setUserSelection] = useState<{ hour: number | null; minute: number | null }>({ hour: null, minute: null });
    const [feedbackMessage, setFeedbackMessage] = useState<{ text: string, correct: boolean } | null>(null);
    const [chaserPosition, setChaserPosition] = useState(0);

    const generateNewTime = useCallback(() => {
        const hour = Math.floor(Math.random() * 12) + 1;
        const minute = (Math.floor(Math.random() * 12)) * 5;
        setTime({ hour, minute });
    }, []);

    const startGame = useCallback(() => {
        generateNewTime();
        setUserSelection({ hour: null, minute: null });
        setFeedbackMessage(null);
        setGameState('memorize');
    }, [generateNewTime]);

    const handleStartClick = () => {
        startGame();
    };

    useEffect(() => {
        if (gameState === 'memorize') {
            const timer = setTimeout(() => {
                setGameState('recall');
            }, 2000);
            return () => clearTimeout(timer);
        }
    }, [gameState]);

    useEffect(() => {
        let intervalId: number | undefined;
        if (gameState === 'recall') {
            setChaserPosition(0);
            intervalId = window.setInterval(() => {
                setChaserPosition(prev => (prev + 1) % 12);
            }, 120);
        }
        return () => {
            if (intervalId) clearInterval(intervalId);
        };
    }, [gameState]);

    const handleDotClick = (position: number) => {
        if (gameState !== 'recall') return;

        if (userSelection.hour === null) {
            setUserSelection({ ...userSelection, hour: position });
        } else if (userSelection.minute === null) {
            setUserSelection({ ...userSelection, minute: position });
        }
    };

    const timeString = `${time.hour}:${String(time.minute).padStart(2, '0')}`;
    const correctHourPos = time.hour;
    const correctMinutePos = time.minute === 0 ? 12 : time.minute / 5;

    useEffect(() => {
        if (userSelection.hour !== null && userSelection.minute !== null) {
            const isCorrect = userSelection.hour === correctHourPos && userSelection.minute === correctMinutePos;
            if (isCorrect) {
                setFeedbackMessage({ text: 'Correct!', correct: true });
                setGameState('feedback');
            } else {
                 audioService.playErrorSound();
                 setFeedbackMessage({ text: 'Incorrect', correct: false });
                 setGameState('feedback');
            }
        }
    }, [userSelection, correctHourPos, correctMinutePos]);

    useEffect(() => {
        if (gameState === 'feedback') {
            const timer = setTimeout(() => {
                if(feedbackMessage?.correct) {
                    startGame();
                } else {
                    setUserSelection({ hour: null, minute: null });
                    setFeedbackMessage(null);
                    setGameState('recall');
                }
            }, feedbackMessage?.correct ? 1500 : 2000);
            return () => clearTimeout(timer);
        }
    }, [gameState, startGame, feedbackMessage]);

    const positions = useMemo(() => {
        return Array.from({ length: 12 }).map((_, i) => {
            const angle = (i * 30) - 60;
            const radius = CLOCK_SIZE / 2 - DOT_SIZE;
            const x = (CLOCK_SIZE / 2 - DOT_SIZE / 2) + radius * Math.cos(angle * Math.PI / 180);
            const y = (CLOCK_SIZE / 2 - DOT_SIZE / 2) + radius * Math.sin(angle * Math.PI / 180);
            return { x, y };
        });
    }, []);

    const chaserColors = useMemo(() => ['bg-hbdi-blue', 'bg-hbdi-yellow', 'bg-hbdi-green', 'bg-hbdi-red'], []);

    const getDotColor = (dotIndex: number) => {
        const positionNumber = dotIndex + 1;
        if (gameState === 'recall') {
            for (let i = 0; i < chaserColors.length; i++) {
                const chaserSegmentIndex = (chaserPosition - i + 12) % 12;
                if (dotIndex === chaserSegmentIndex) return chaserColors[i];
            }
            if (positionNumber === 12) return 'bg-hbdi-blue/30';
            if (positionNumber === 3) return 'bg-hbdi-yellow/30';
            if (positionNumber === 6) return 'bg-hbdi-red/30';
            if (positionNumber === 9) return 'bg-hbdi-green/30';
        } else {
            if (positionNumber === 12) return 'bg-hbdi-blue';
            if (positionNumber === 3) return 'bg-hbdi-yellow';
            if (positionNumber === 6) return 'bg-hbdi-red';
            if (positionNumber === 9) return 'bg-hbdi-green';
        }
        return 'bg-brand-border';
    };
    
    const renderGame = () => (
        <div className="flex flex-col items-center">
            <div
                className={`relative bg-brand-surface rounded-full border-4 border-brand-border transition-shadow duration-500
                ${gameState === 'feedback' && feedbackMessage?.correct ? 'animate-pulse-green' : ''}
                ${gameState === 'feedback' && !feedbackMessage?.correct ? 'animate-pulse-red' : ''}
                `}
                style={{ width: CLOCK_SIZE, height: CLOCK_SIZE }}
            >
                <div className="absolute inset-0 flex items-center justify-center text-center p-4">
                    {gameState === 'memorize' && <span className="text-6xl font-bold text-brand-text tracking-widest">{timeString}</span>}
                    {gameState === 'recall' && (
                        <div>
                            <p className="text-xl font-semibold text-brand-text-muted">What was the time?</p>
                            <p className="text-lg font-bold mt-2 text-brand-primary">
                                {userSelection.hour === null ? 'Select the HOUR' : 'Select the MINUTE'}
                            </p>
                        </div>
                    )}
                    {gameState === 'feedback' && feedbackMessage && (
                        <div>
                             <p className={`text-4xl font-bold ${feedbackMessage.correct ? 'text-green-500' : 'text-red-500'}`}>{feedbackMessage.text}</p>
                            <p className="text-lg text-brand-text-muted mt-2">The time was {timeString}</p>
                        </div>
                    )}
                </div>

                {positions.map((pos, i) => {
                    const positionNumber = i + 1;
                    const isSelectedHour = userSelection.hour === positionNumber;
                    const isSelectedMinute = userSelection.minute === positionNumber;
                    
                    let feedbackClass = '';
                    if (gameState === 'feedback' && !feedbackMessage?.correct) {
                        if (correctHourPos === positionNumber) feedbackClass = 'ring-4 ring-green-500 ring-offset-2 ring-offset-brand-surface';
                        if (correctMinutePos === positionNumber) {
                             feedbackClass = `ring-4 ${correctHourPos === correctMinutePos ? 'ring-purple-500' : 'ring-green-500'} ring-offset-2 ring-offset-brand-surface`;
                        }
                    }

                    const showNumbers = gameState === 'ready' || gameState === 'memorize';

                    return (
                        <div
                            key={i}
                            className={`absolute rounded-full flex items-center justify-center font-bold transition-all duration-300`}
                            style={{
                                width: showNumbers ? NUMBER_SIZE : DOT_SIZE,
                                height: showNumbers ? NUMBER_SIZE : DOT_SIZE,
                                top: showNumbers ? pos.y + ((DOT_SIZE-NUMBER_SIZE)/2) : pos.y,
                                left: showNumbers ? pos.x + ((DOT_SIZE-NUMBER_SIZE)/2) : pos.x,
                            }}
                        >
                            {showNumbers ? (
                                <span className="text-brand-text-muted text-2xl">{positionNumber}</span>
                            ) : (
                                <button
                                    onClick={() => handleDotClick(positionNumber)}
                                    aria-label={`Clock position ${positionNumber}`}
                                    className={`w-full h-full rounded-full transition-all duration-200 ${getDotColor(i)}
                                        ${gameState === 'recall' ? 'cursor-pointer hover:scale-125' : 'cursor-default'}
                                        ${(isSelectedHour || isSelectedMinute) ? 'ring-2 ring-white' : ''}
                                        ${feedbackClass}
                                    `}
                                />
                            )}
                        </div>
                    );
                })}
            </div>
        </div>
    );

    return (
        <Card>
            {gameState === 'ready' ? (
                 <div className="w-full mx-auto flex flex-col items-center p-8 pt-12 min-h-[450px] text-center">
                    <Clock size={64} className="text-brand-primary mb-6" />
                    <h2 className="text-3xl font-bold text-brand-text mb-2">Test your memory.</h2>
                    <p className="text-brand-text-muted mb-8 max-w-md">Memorize the time, then recall the hour and minute after the clock transforms. The colored dots are your anchors.</p>
                    <Button onClick={handleStartClick} className="text-lg py-3 px-8">Start Recall</Button>
                </div>
            ) : renderGame()}
        </Card>
    );
};

export default TickTockGame;