import React from 'react';

const LOADER_SIZE = 64; // px
const SQUARE_SIZE = LOADER_SIZE / 2;

const FoldingSquareLoader: React.FC = () => {
    return (
        <div className="fixed inset-0 bg-brand-bg z-50 flex items-center justify-center">
            <div className="relative" style={{ width: LOADER_SIZE, height: LOADER_SIZE }}>
                <div
                    className="absolute top-0 left-0 bg-hbdi-blue"
                    style={{
                        width: SQUARE_SIZE,
                        height: SQUARE_SIZE,
                        animation: `square-tl 2.4s ease-in-out infinite`
                    }}></div>
                <div
                    className="absolute top-0 right-0 bg-hbdi-yellow"
                    style={{
                        width: SQUARE_SIZE,
                        height: SQUARE_SIZE,
                        animation: `square-tr 2.4s ease-in-out infinite`
                    }}></div>
                <div
                    className="absolute bottom-0 left-0 bg-hbdi-green"
                    style={{
                        width: SQUARE_SIZE,
                        height: SQUARE_SIZE,
                        animation: `square-bl 2.4s ease-in-out infinite`
                    }}></div>
                <div
                    className="absolute bottom-0 right-0 bg-hbdi-red"
                    style={{
                        width: SQUARE_SIZE,
                        height: SQUARE_SIZE,
                        animation: `square-br 2.4s ease-in-out infinite`
                    }}></div>
            </div>
        </div>
    );
};

export default FoldingSquareLoader;
