import React from 'react';

export const Skeleton = ({ className = "", style = {} }) => {
    return (
        <div 
            className={`bg-gray-200 relative overflow-hidden ${className}`}
            style={{ 
                ...style,
                // Ensures the background doesn't collapse if empty
                minHeight: style.height || 'auto' 
            }}
        >
            {/* The Shimmer Animation Layer */}
            <div 
                className="absolute inset-0"
                style={{
                    background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.5), transparent)',
                    animation: 'shimmer 1.5s infinite',
                    transform: 'skewX(-20deg)',
                }}
            />
            
            {/* INLINE STYLE FOR ANIMATION (Put this in your global CSS if preferred) */}
            <style>{`
                @keyframes shimmer {
                    0% { transform: translateX(-150%) skewX(-20deg); }
                    100% { transform: translateX(150%) skewX(-20deg); }
                }
            `}</style>
        </div>
    );
};