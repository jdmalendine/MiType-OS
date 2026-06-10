import React from 'react';

const LOADER_SIZE = 64; // px
const SQUARE_SIZE = LOADER_SIZE / 2;

const FoldingSquareLoader: React.FC = () => {
    return (
        <div className="fixed inset-0 bg-brand-bg z-50 flex flex-col items-center justify-center overflow-hidden">
            {/* Background neural pulse */}
            <div className="absolute inset-0 bg-neural-pattern opacity-10"></div>
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-brand-primary/5 rounded-full blur-[100px] animate-pulse"></div>

            <div className="relative mb-12" style={{ width: LOADER_SIZE, height: LOADER_SIZE }}>
                <div
                    className="absolute top-0 left-0 bg-hbdi-blue shadow-[0_0_15px_rgba(59,130,246,0.5)] rounded-sm"
                    style={{
                        width: SQUARE_SIZE,
                        height: SQUARE_SIZE,
                        animation: `square-tl 2.4s ease-in-out infinite`
                    }}></div>
                <div
                    className="absolute top-0 right-0 bg-hbdi-yellow shadow-[0_0_15px_rgba(234,179,8,0.5)] rounded-sm"
                    style={{
                        width: SQUARE_SIZE,
                        height: SQUARE_SIZE,
                        animation: `square-tr 2.4s ease-in-out infinite`
                    }}></div>
                <div
                    className="absolute bottom-0 left-0 bg-hbdi-green shadow-[0_0_15px_rgba(34,197,94,0.5)] rounded-sm"
                    style={{
                        width: SQUARE_SIZE,
                        height: SQUARE_SIZE,
                        animation: `square-bl 2.4s ease-in-out infinite`
                    }}></div>
                <div
                    className="absolute bottom-0 right-0 bg-hbdi-red shadow-[0_0_15px_rgba(239,68,68,0.5)] rounded-sm"
                    style={{
                        width: SQUARE_SIZE,
                        height: SQUARE_SIZE,
                        animation: `square-br 2.4s ease-in-out infinite`
                    }}></div>
            </div>

            <div className="text-center animate-fade-in">
                <h2 className="text-xl font-black font-header tracking-[0.3em] text-brand-text uppercase italic mb-2">System Initializing</h2>
                <div className="flex items-center justify-center gap-2">
                    <span className="w-1 h-1 bg-brand-primary rounded-full animate-pulse"></span>
                    <p className="text-[10px] font-data text-brand-text-muted uppercase tracking-widest">Calibrating Neural Pathways</p>
                    <span className="w-1 h-1 bg-brand-primary rounded-full animate-pulse" style={{ animationDelay: '0.5s' }}></span>
                </div>
            </div>
            
            <div className="absolute bottom-12 left-12 right-12 flex justify-between items-end">
                <div className="font-data text-[8px] text-brand-text-muted/30 uppercase tracking-widest space-y-1">
                    <p>CORE_OS_VERSION: 2.0.26</p>
                    <p>NEURAL_ENGINE: ACTIVE</p>
                </div>
                <div className="w-32 h-[1px] bg-white/5 relative overflow-hidden">
                    <div className="absolute inset-0 bg-brand-primary/50 w-1/2 animate-[loading-bar_2s_ease-in-out_infinite]"></div>
                </div>
            </div>
        </div>
    );
};

export default FoldingSquareLoader;
