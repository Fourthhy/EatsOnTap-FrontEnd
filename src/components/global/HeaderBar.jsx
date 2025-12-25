import React, { useState, useEffect } from 'react';
import { Menu, PanelLeftOpen, PanelRightOpen } from "lucide-react";
import { useOutletContext } from "react-router-dom";

function HeaderBar({ userAvatar, headerTitle, userName = "Sample Name", userRole = "Sample Role" }) {
    const context = useOutletContext() || {};
    
    // Attempt to sync with context state if available, otherwise default to false
    const [isExpanded, setIsExpanded] = useState(context.isSidebarOpen || false);

    const handleToggleSidebar = context.handleToggleSidebar || (() => { });

    // --- HANDLER: SYNC BUTTON MOVEMENT WITH SIDEBAR ---
    const handleMenuClick = () => {
        setIsExpanded(prev => !prev); // Move the button
        handleToggleSidebar();        // Trigger the actual sidebar action
    };

    // Optional: Sync state if context changes externally (e.g. clicking overlay closes sidebar)
    useEffect(() => {
        if (context.isSidebarOpen !== undefined) {
            setIsExpanded(context.isSidebarOpen);
        }
    }, [context.isSidebarOpen]);

    // --- ANIMATION STATE (GREETING) ---
    const [animationPhase, setAnimationPhase] = useState(() => {
        const hasShown = sessionStorage.getItem('has_shown_greeting');
        return hasShown ? 'swap' : 'intro';
    });
    
    const [greeting, setGreeting] = useState('');

    useEffect(() => {
        if (animationPhase === 'swap') return; 

        const hour = new Date().getHours();
        if (hour < 12) setGreeting("Good Morning,");
        else if (hour < 18) setGreeting("Good Afternoon,");
        else setGreeting("Good Evening,");

        const timer1 = setTimeout(() => setAnimationPhase('hold'), 100);
        const timer2 = setTimeout(() => {
            setAnimationPhase('swap');
            sessionStorage.setItem('has_shown_greeting', 'true'); 
        }, 3000);

        return () => { clearTimeout(timer1); clearTimeout(timer2); };
    }, []);

    // --- STYLES ---
    const greetingStyle = {
        position: 'absolute', right: 0, display: 'flex', alignItems: 'center', justifyContent: 'flex-end',
        width: '300px', fontFamily: "geist", fontSize: 14, fontWeight: 500, color: "#6B7280",
        transition: 'all 0.6s cubic-bezier(0.16, 1, 0.3, 1)',
        transform: animationPhase === 'intro' ? 'translateY(-20px)' : animationPhase === 'hold' ? 'translateY(0)' : 'translateY(20px)',
        opacity: animationPhase === 'hold' ? 1 : 0, pointerEvents: 'none',
    };

    const profileStyle = {
        display: 'flex', flexDirection: 'row', gap: '12px', alignItems: 'center',
        transition: 'all 0.6s cubic-bezier(0.16, 1, 0.3, 1)',
        transform: animationPhase === 'swap' ? 'translateY(0)' : 'translateY(-20px)',
        opacity: animationPhase === 'swap' ? 1 : 0,
    };

    return (
        <div style={{ height: '60px' }} className="w-full flex flex-col">
            
            {/* --- FIXED MENU ICON --- */}
            <div 
                onClick={handleMenuClick} // UPDATED: Uses the wrapper handler
                className="hover:bg-gray-100"
                style={{
                    position: 'fixed',
                    top: '15px', // Centered vertically ((60-30)/2)
                    // LOGIC: Moves between 85px (collapsed) and 293px (expanded)
                    left: isExpanded ? '293px' : '90px', 
                    zIndex: 8000, 
                    backgroundColor: 'white', 
                    width: '30px',
                    height: '30px',
                    borderRadius: 6,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                    boxShadow: '0 2px 5px rgba(0,0,0,0.1)',
                    // UPDATED: Added transition for smooth sliding
                    transition: 'left 0.3s cubic-bezier(0.4, 0, 0.2, 1), background-color 0.2s' 
                }}
            >
                {isExpanded ? <PanelRightOpen size={20} color={"#4b5563"}/> : <PanelLeftOpen size={20} color={"#4b5563"}/>}
            </div>

            <div
                style={{
                    paddingLeft: '10px',
                    background: "white",
                    boxShadow: "0 10px 24px 0 rgba(214, 221, 224, 0.32)"
                }}
                className="flex-1 flex items-center gap-4 justify-between"
            >
                {/* LEFT SIDE: Title (With Spacer) */}
                <div className="w-auto h-auto flex gap-2">
                    {/* SPACER: Keeps the Title in the correct position since the real icon is fixed */}
                    <div style={{ width: '30px', height: '20px' }}></div>
                    
                    <p style={{ fontWeight: '500' }} className="font-geist text-[2vh]"> 
                        {headerTitle}
                    </p>
                </div>

                {/* RIGHT SIDE: Animation Container */}
                <div
                    style={{ marginRight: "20px", position: 'relative', height: '100%', display: 'flex', alignItems: 'center' }}
                    className="w-auto"
                >
                    {animationPhase !== 'swap' && (
                        <div style={greetingStyle}>
                            {greeting} <span style={{ color: '#000', fontWeight: 600, marginLeft: '4px' }}>{userName.split(' ')[0]}</span>
                        </div>
                    )}

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