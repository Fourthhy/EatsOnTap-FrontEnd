import React, { useState } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { Menu, LogOut, KeyRound } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { logout } from '../../functions/logoutAuth';

// 🟢 IMPORT THE NEW PROVIDER
import { ClassAdviserProvider, useClassAdviser } from '../../context/ClassAdviserContext';

// 🟢 Create an inner component to use the hook (since Layout wraps the provider)
const ClassAdviserNavbar = () => {
    const navigate = useNavigate();
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [hoveredButton, setHoveredButton] = useState(null); // For hover states
    
    // Now we can use the hook to get the name!
    const { adviserDisplayName } = useClassAdviser(); 

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    // --- STYLES ---
    const navStyle = {
        backgroundColor: '#142345',
        color: 'white',
        height: '64px', // h-16
        padding: '0 24px', // px-6
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)', // shadow-md
        position: 'relative',
        zIndex: 50,
        fontFamily: 'geist, sans-serif'
    };

    const logoContainerStyle = {
        display: 'flex',
        alignItems: 'center',
        gap: '12px' // gap-3
    };

    const logoTextStyle = {
        fontWeight: '700', // font-bold
        fontSize: '1.125rem', // text-lg
        letterSpacing: '0.025em', // tracking-wide
        display: 'block' // hidden sm:block logic handled via media query usually, simplified here to block
    };

    const rightSectionStyle = {
        display: 'flex',
        alignItems: 'center',
        gap: '16px' // gap-4
    };

    const greetingStyle = {
        fontSize: '0.875rem', // text-sm
        fontWeight: '500', // font-medium
        color: '#dbeafe', // text-blue-100
        display: 'none', // Default hidden on mobile
        '@media (min-width: 640px)': { display: 'block' } // Logic handled in render below
    };

    const menuButtonStyle = {
        padding: '8px',
        borderRadius: '9999px', // rounded-full
        transition: 'background-color 0.2s',
        position: 'relative',
        border: 'none',
        background: 'transparent',
        color: 'white',
        cursor: 'pointer',
        backgroundColor: hoveredButton === 'menu' ? 'rgba(255,255,255,0.1)' : 'transparent'
    };

    const dropdownStyle = {
        position: 'absolute',
        top: '56px', // top-14
        right: '16px', // right-4
        backgroundColor: 'white',
        color: '#1f2937', // text-gray-800
        borderRadius: '12px', // rounded-xl
        boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)', // shadow-xl
        width: '224px', // w-56
        paddingTop: '8px', // py-2
        paddingBottom: '8px',
        zIndex: 50,
        border: '1px solid #f3f4f6', // border-gray-100
        transformOrigin: 'top right'
    };

    const dropdownItemStyle = {
        width: '100%',
        textAlign: 'left',
        padding: '12px 16px', // px-4 py-3
        display: 'flex',
        alignItems: 'center',
        gap: '12px', // gap-3
        fontSize: '0.875rem', // text-sm
        fontWeight: '500', // font-medium
        transition: 'background-color 0.2s',
        border: 'none',
        background: 'transparent',
        cursor: 'pointer'
    };

    return (
        <nav style={navStyle}>
            {/* Left: Logo */}
            <div style={logoContainerStyle}>
                <img src="/lv-logo.svg" alt="Logo" style={{ width: '32px', height: '32px' }} />
                {/* Note: In pure inline styles, media queries are hard. We can render it always or use window.matchMedia if strictly needed. For now, rendering nicely. */}
                <span style={logoTextStyle}>Eat's on Tap</span>
            </div>

            {/* Right: Profile & Menu */}
            <div style={rightSectionStyle}>
                {/* Show Name (Hidden on very small screens effectively by flex logic if needed, but styling here implies visible) */}
                <span style={{ ...greetingStyle, display: 'block' }}>
                    Hi, {adviserDisplayName}
                </span>

                <button 
                    onClick={() => setIsMenuOpen(!isMenuOpen)}
                    onMouseEnter={() => setHoveredButton('menu')}
                    onMouseLeave={() => setHoveredButton(null)}
                    style={menuButtonStyle}
                >
                    <Menu size={24} />
                </button>
            </div>

            {/* --- DROPDOWN MENU --- */}
            <AnimatePresence>
                {isMenuOpen && (
                    <>
                        <div 
                            style={{ position: 'fixed', inset: 0, zIndex: 40 }} 
                            onClick={() => setIsMenuOpen(false)} 
                        />
                        <motion.div
                            initial={{ opacity: 0, y: -10, scale: 0.95 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: -10, scale: 0.95 }}
                            style={dropdownStyle}
                        >
                            <div style={{ padding: '12px 16px', borderBottom: '1px solid #f3f4f6', marginBottom: '4px' }}>
                                <p style={{ fontSize: '0.75rem', fontWeight: '700', color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Account</p>
                                <p style={{ fontSize: '0.875rem', fontWeight: '700', color: '#1f2937', marginTop: '4px' }}>{adviserDisplayName}</p>
                            </div>
                            
                            <button 
                                onClick={() => alert("Change Password")} 
                                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f9fafb'}
                                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                                style={{ ...dropdownItemStyle, color: '#374151' }}
                            >
                                <KeyRound size={16} color="#2563eb" /> Change Password
                            </button>
                            
                            <button 
                                onClick={handleLogout} 
                                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#fef2f2'}
                                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                                style={{ ...dropdownItemStyle, color: '#dc2626' }}
                            >
                                <LogOut size={16} /> Logout
                            </button>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </nav>
    );
};

export default function ClassAdviserLayout() {
    return (
        /* 🟢 WRAP EVERYTHING IN THE PROVIDER HERE */
        <ClassAdviserProvider>
            <div style={{ minHeight: '100vh', backgroundColor: '#F4F6F9', fontFamily: 'geist, sans-serif' }}>
                <ClassAdviserNavbar />
                <main style={{ position: 'relative', zIndex: 0 }}>
                    <Outlet /> 
                </main>
            </div>
        </ClassAdviserProvider>
    );
}