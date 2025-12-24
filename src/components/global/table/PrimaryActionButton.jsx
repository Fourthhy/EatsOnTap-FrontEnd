import React, { useState, useEffect } from 'react';

const PrimaryActionButton = ({ label, icon, onClick, style, className }) => {
  // 1. The Animation State
  // We start with width: 0 and opacity: 0
  const [isMounted, setIsMounted] = useState(false);

  // 2. The Trigger
  // As soon as this button renders, we trigger the animation to slide to 100%
  useEffect(() => {
    // Small timeout ensures the browser paints the "0" state first
    const timer = setTimeout(() => setIsMounted(true), 10);
    return () => clearTimeout(timer);
  }, []);

  return (
    <button
      onClick={onClick}
      // Combine your tailwind classes with the necessary layout essentials
      className={`relative overflow-hidden group ${className}`}
      style={{
        ...style,
        // Ensure these defaults exist if not passed in style
        position: 'relative',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        border: "1px solid #ddddddaf", // Keep your border
        backgroundColor: 'transparent', // IMPORTANT: Base button is clear
      }}
    >
      {/* 3. The Sliding Background (The "Indicator") */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          height: '100%',
          backgroundColor: '#4268BD', // Your blue color
          zIndex: 0, // Behind the text
          // The Animation Magic:
          width: isMounted ? '100%' : '0%', 
          opacity: isMounted ? 1 : 0,
          transition: 'width 300ms cubic-bezier(0.4, 0, 0.2, 1), opacity 300ms ease',
        }}
      />

      {/* 4. The Content (Text & Icon) */}
      {/* zIndex-10 ensures text sits ON TOP of the sliding background */}
      <span className="relative z-10 flex items-center gap-2 text-[#EEEEEE]">
        {icon} {label}
      </span>
    </button>
  );
};

export { PrimaryActionButton }