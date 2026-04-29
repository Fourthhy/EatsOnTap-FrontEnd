import React, { useState, useEffect } from 'react';
import { PanelLeftOpen, PanelRightOpen, RotateCcw } from "lucide-react"; 
import { useOutletContext } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion"; 
import { NotificationDropdown } from './NotificationDropdown';

// --- MOCK DATA ---
const NOTIFICATION_TEMPLATE = [
    {
        date: "Today",
        data: [
            { notificationType: "Meal Request", description: "Ms. Santos submitted a meal request for 1-Luke", time: "10:23 AM" },
            { notificationType: "Event Creation", description: "A new event 'Joji conert' has been scheduled", time: "09:00 AM" }
        ]
    },
    {
        date: "December 25, 2025",
        data: [
            { notificationType: "Export Report", description: "Monthly Report downloaded!", time: "11:15 AM" },
            { notificationType: "Export Student Backup", description: "Student Backup downloded!", time: "11:15 AM" },
            { notificationType: "Setting Change", description: "Setting for Meal Request has been adjusted to 6:00 AM – 7:00 AM", time: "11:15 AM" },
        ]
    },
    {
        date: "December 24, 2025",
        data: [
            { notificationType: "Upcoming Event", description: "Tomorrow is the scheduled 'Higher Education Graduation' event", time: "12:00 AM" },
            { notificationType: "Event Credit Allottment", description: "Meal Credits has been allotted in the 'Higher Education Graduation' event", time: "12:00 AM" },
            { notificationType: "Update Student Registry", description: "Maria Leonora Teresa has been added to student registry", time: "12:00 AM" },
            { notificationType: "Update Student Registry", description: "720 Students has been added through csv input", time: "12:00 AM" },
            
        ]
    }
];

function HeaderBar({ 
    headerTitle, 
    hasNotification = false,
    notificationList = NOTIFICATION_TEMPLATE
}) {
    const context = useOutletContext() || {};
    const [isExpanded, setIsExpanded] = useState(context.isSidebarOpen || false);
    const handleToggleSidebar = context.handleToggleSidebar || (() => console.warn("Sidebar toggle not available"));

    const [isScrolled, setIsScrolled] = useState(false);
    const [isSimulating, setIsSimulating] = useState(false); 
    const [triggerShake, setTriggerShake] = useState(false); 
    const [isProfileOpen, setIsProfileOpen] = useState(false); 

    // 🟢 NEW: State to hold the dynamic user data
    const [userData, setUserData] = useState({
        fullName: 'Loading...',
        role: 'USER',
        email: 'user@laverdad.edu.ph',
        photoURL: null
    });

    // 🟢 NEW: Fetch the real user data from local storage when Header loads
    useEffect(() => {
        const storedInfo = localStorage.getItem('userInformation');
        if (storedInfo) {
            const parsedInfo = JSON.parse(storedInfo);
            setUserData({
                fullName: parsedInfo.fullName || `${parsedInfo.first_name} ${parsedInfo.last_name}`,
                role: parsedInfo.role ? parsedInfo.role.replace('-', ' ') : 'USER',
                email: parsedInfo.email || '',
                photoURL: parsedInfo.photoURL || null
            });
        }
    }, []);

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 10);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    useEffect(() => {
        if (context.isSidebarOpen !== undefined) {
            setIsExpanded(context.isSidebarOpen);
        }
    }, [context.isSidebarOpen]);

    const handleSimulationToggle = () => {
        setTriggerShake(true);
        setTimeout(() => setTriggerShake(false), 500); 
        setIsSimulating(prev => !prev); 
    };

    const handleProfileClick = () => {
        setIsProfileOpen(!isProfileOpen);
        if (isSimulating) setIsSimulating(false);
    };

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
    }, [animationPhase]);

    const greetingStyle = {
        position: 'absolute', right: 0, display: 'flex', alignItems: 'center', justifyContent: 'flex-end',
        width: '300px', fontFamily: "geist", fontSize: 14, fontWeight: 500, color: "#6B7280",
        transition: 'all 0.6s cubic-bezier(0.16, 1, 0.3, 1)',
        transform: animationPhase === 'intro' ? 'translateY(-20px)' : animationPhase === 'hold' ? 'translateY(0)' : 'translateY(20px)',
        opacity: animationPhase === 'hold' ? 1 : 0, pointerEvents: 'none',
    };

    const profileStyle = {
        display: 'flex', flexDirection: 'row', gap: '12px', alignItems: 'center',
        transition: 'transform 0.6s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.6s',
        transform: animationPhase === 'swap' ? 'translateY(0)' : 'translateY(-20px)',
        opacity: animationPhase === 'swap' ? 1 : 0,
        minWidth: '150px', 
        justifyContent: 'flex-end'
    };

    const isNotified = hasNotification || isSimulating;
    
    // 🟢 THE FIX: Use the Google photo if it exists, otherwise fallback to your default image
    const avatarSrc = userData.photoURL || "/default_image.png"; 

    return (
        <div style={{ height: '60px', width: '100%' }}>
            
            <style>
                {`
                    @keyframes bounceProfile {
                        0%, 20%, 50%, 80%, 100% {transform: translateY(0);}
                        40% {transform: translateY(-10px);}
                        60% {transform: translateY(-5px);}
                    }
                    @keyframes shake {
                        0%, 100% { transform: rotate(0deg); }
                        25% { transform: rotate(-10deg); }
                        75% { transform: rotate(10deg); }
                    }
                `}
            </style>

            <NotificationDropdown 
                isOpen={isProfileOpen} 
                onClose={() => setIsProfileOpen(false)} 
                notifications={notificationList}
                // 🟢 THE FIX: Pass dynamic data to the Dropdown
                userName={userData.fullName}
                userRole={userData.role}
                userEmail={userData.email}
                userAvatar={avatarSrc}
            />

            {/* --- 3. FLOATING AVATAR (SCENARIO B - Scrolled) --- */}
            <div 
                style={{
                    position: 'fixed', top: '10px', right: '20px', zIndex: 8000,
                    pointerEvents: (isScrolled && !isProfileOpen) ? 'auto' : 'none',
                    transition: 'all 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
                    transform: isScrolled ? 'translateY(0)' : 'translateY(-20px)',
                    opacity: isScrolled ? 1 : 0
                }}
            >
                <AnimatePresence>
                    {!isProfileOpen && (
                        <motion.div 
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.9 }}
                            onClick={handleProfileClick}
                            style={{ position: 'relative', cursor: 'pointer' }}
                        >
                            <img 
                                src={avatarSrc} alt="Profile" 
                                style={{ 
                                    width: '40px', height: '40px', 
                                    borderRadius: '12px',
                                    objectFit: 'cover',
                                    border: '2px solid white', boxShadow: '0 4px 12px rgba(255,255,255,0.1)',
                                    animation: triggerShake 
                                        ? 'shake 0.4s ease-in-out' 
                                        : (isNotified && isScrolled) ? 'bounceProfile 2s infinite' : 'none'
                                }} 
                            />
                            {isNotified && (
                                <div style={{
                                    position: 'absolute', bottom: -2, right: -2, width: '12px', height: '12px', 
                                    backgroundColor: isSimulating ? '#F68A3A' : '#EF4444', 
                                    borderRadius: '50%', border: '2px solid white' 
                                }} />
                            )}
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            {/* --- 4. MAIN HEADER BAR (SCENARIO A - Present State) --- */}
            <div
                className="w-full flex flex-col"
                style={{
                    height: '60px', position: 'fixed', top: 0, left: 0, width: '100%', zIndex: 50,
                    backgroundColor: 'white', boxShadow: "0 10px 24px 0 rgba(214, 221, 224, 0.32)",
                    paddingLeft: '10px',
                    transform: isScrolled ? 'translateY(-100%)' : 'translateY(0)',
                    transition: 'transform 0.4s cubic-bezier(0.16, 1, 0.3, 1)'
                }}
            >
                <div className="flex-1 flex items-center gap-4 justify-between" style={{ height: '100%' }}>
                    
                    <div className="w-auto h-auto flex gap-2">
                        <div style={{ 
                            width: '30px', height: '20px', 
                            paddingLeft: isExpanded ? "290px" : "80px", 
                            transition: "padding-left 0.3s cubic-bezier(0.4, 0, 0.2, 1)" 
                        }}></div>
                        <p style={{ fontWeight: '500' }} className="font-geist text-[2vh]"> 
                            {headerTitle}
                        </p>
                    </div>

                    <div style={{ marginRight: "20px", position: 'relative', height: '100%', display: 'flex', alignItems: 'center' }}>
                        {animationPhase !== 'swap' && (
                            <div style={greetingStyle}>
                                {/* 🟢 THE FIX: Safely split the full name to get their first name */}
                                {greeting} <span style={{ color: '#000', fontWeight: 600, marginLeft: '4px' }}>{userData.fullName.split(' ')[0]}</span>
                            </div>
                        )}

                        <div style={profileStyle}>
                            <AnimatePresence>
                                {!isProfileOpen && (
                                    <motion.div
                                        initial={{ opacity: 0, x: 10 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        exit={{ opacity: 0, x: 10 }} 
                                        transition={{ duration: 0.2 }}
                                        style={{ display: 'flex', flexDirection: 'row', gap: '12px', alignItems: 'center' }}
                                    >
                                        <div 
                                            onClick={handleProfileClick} 
                                            className="w-auto h-auto flex items-center justify-center" 
                                            style={{ 
                                                position: 'relative', cursor: 'pointer',
                                                animation: (isNotified && !isScrolled && animationPhase === 'swap') ? 'bounceProfile 2s infinite' : 'none'
                                            }}
                                        >
                                            <img
                                                style={{ borderRadius: 12, width: 40, height: 40, objectFit: 'cover' }}
                                                src={avatarSrc}
                                                alt="User Avatar"
                                            />
                                            {isNotified && (
                                                <div style={{
                                                    position: 'absolute', bottom: -2, right: -2, width: '12px', height: '12px', 
                                                    backgroundColor: isSimulating ? '#F68A3A' : '#EF4444', 
                                                    borderRadius: '50%', border: '2px solid white' 
                                                }} />
                                            )}
                                        </div>

                                        <div className="flex flex-col items-start justify-start">
                                            <span style={{ fontFamily: "geist", color: "#000", fontWeight: "600", fontSize: 13, lineHeight: '1.2' }}>
                                                {/* 🟢 THE FIX: Inject real name */}
                                                {userData.fullName}
                                            </span>
                                            <span style={{ fontFamily: "geist", color: "#9CA3AF", fontWeight: "400", fontSize: 11, textTransform: 'capitalize' }}>
                                                {/* 🟢 THE FIX: Inject real role */}
                                                {userData.role.toLowerCase()}
                                            </span>
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export { HeaderBar };