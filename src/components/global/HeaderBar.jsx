import React, { useState, useEffect } from 'react';
import { Menu } from "lucide-react";
import { useOutletContext } from "react-router-dom";

function HeaderBar({ userAvatar, headerTitle, userName = "Sample Name", userRole = "Sample Role" }) {
    const context = useOutletContext() || {};
    const handleToggleSidebar = context.handleToggleSidebar || (() => { });

    // --- ANIMATION STATE ---
    // Check session storage immediately to set the initial state
    const [animationPhase, setAnimationPhase] = useState(() => {
        const hasShown = sessionStorage.getItem('has_shown_greeting');
        return hasShown ? 'swap' : 'intro';
    });
    
    const [greeting, setGreeting] = useState('');

    useEffect(() => {
        // If we already showed the greeting, just set the text variable (needed for static render) and exit
        if (animationPhase === 'swap') {
            return; 
        }

        // 1. Determine Time of Day
        const hour = new Date().getHours();
        if (hour < 12) setGreeting("Good Morning,");
        else if (hour < 18) setGreeting("Good Afternoon,");
        else setGreeting("Good Evening,");

        // 2. Animation Sequence
        
        // Step 1: Slide In Greeting
        const timer1 = setTimeout(() => setAnimationPhase('hold'), 100);

        // Step 2: Swap to Profile & Mark as Shown
        const timer2 = setTimeout(() => {
            setAnimationPhase('swap');
            sessionStorage.setItem('has_shown_greeting', 'true'); // SAVE FLAG
        }, 3000);

        return () => {
            clearTimeout(timer1);
            clearTimeout(timer2);
        };
    }, []); // Empty dependency array ensures this runs once on mount

    // --- DYNAMIC STYLES ---
    
    const greetingStyle = {
        position: 'absolute',
        right: 0,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'flex-end',
        width: '300px',
        fontFamily: "geist",
        fontSize: 14,
        fontWeight: 500,
        color: "#6B7280",
        transition: 'all 0.6s cubic-bezier(0.16, 1, 0.3, 1)',
        // If phase is 'swap' (default for revisit), keep it hidden below
        transform: animationPhase === 'intro' ? 'translateY(-20px)' 
                 : animationPhase === 'hold' ? 'translateY(0)' 
                 : 'translateY(20px)',
        opacity: animationPhase === 'hold' ? 1 : 0,
        pointerEvents: 'none',
    };

    const profileStyle = {
        display: 'flex',
        flexDirection: 'row',
        gap: '12px',
        alignItems: 'center',
        transition: 'all 0.6s cubic-bezier(0.16, 1, 0.3, 1)',
        // If phase is 'swap' (default for revisit), keep it visible at 0
        transform: animationPhase === 'swap' ? 'translateY(0)' : 'translateY(-20px)',
        opacity: animationPhase === 'swap' ? 1 : 0,
    };

    return (
        <div style={{ height: '60px' }} className="w-full flex flex-col">
            <div
                style={{
                    paddingLeft: '10px',
                    background: "white",
                    boxShadow: "0 10px 24px 0 rgba(214, 221, 224, 0.32)"
                }}
                className="flex-1 flex items-center gap-4 justify-between"
            >
                {/* LEFT SIDE: Menu & Title */}
                <div className="w-auto h-auto flex gap-2">
                    <div className="w-auto h-auto">
                        <Menu size={20} onClick={handleToggleSidebar} className="hover:cursor-pointer" />
                    </div>
                    <p style={{ fontWeight: '500' }} className="font-geist text-[2vh]"> 
                        {headerTitle}
                    </p>
                </div>

                {/* RIGHT SIDE: Animation Container */}
                <div
                    style={{ marginRight: "20px", position: 'relative', height: '100%', display: 'flex', alignItems: 'center' }}
                    className="w-auto"
                >
                    {/* 1. GREETING LAYER (Only renders if we are actively animating) */}
                    {animationPhase !== 'swap' && (
                        <div style={greetingStyle}>
                            {greeting} <span style={{ color: '#000', fontWeight: 600, marginLeft: '4px' }}>{userName.split(' ')[0]}</span>
                        </div>
                    )}

                    {/* 2. PROFILE LAYER */}
                    <div style={profileStyle}>
                        <div className="w-auto h-auto flex items-center justify-center">
                            <img
                                style={{ borderRadius: 12, width: 40, height: 40, objectFit: 'cover' }}
                                src="https://xsgames.co/randomusers/avatar.php?g=male"
                                alt="User Avatar"
                            />
                        </div>

                        <div className="flex flex-col items-start justify-start">
                            <span style={{ fontFamily: "geist", color: "#000", fontWeight: "600", fontSize: 13, lineHeight: '1.2' }}>
                                {userName}
                            </span>
                            <p style={{ fontFamily: "geist", color: "#9CA3AF", fontWeight: "400", fontSize: 11 }}>
                                {userRole}
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export { HeaderBar };