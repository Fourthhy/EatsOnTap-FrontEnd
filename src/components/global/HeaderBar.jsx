import React, { useState, useEffect, useRef } from 'react';
import { 
    PanelLeftOpen, 
    PanelRightOpen, 
    RotateCcw, 
    X, 
    Utensils, 
    CalendarDays, 
    Wallet, 
    FileDown, 
    Calendar,
    Clock
} from "lucide-react"; 
import { useOutletContext } from "react-router-dom";
import { motion, AnimatePresence } from 'framer-motion';

// --- MOCK DATA (As requested format) ---
const DEFAULT_NOTIFICATIONS = [
    {
        date: "Today",
        data: [
            { notificationType: "Meal Request", description: "Ms. Santos submitted a meal request for 1-Luke", time: "10:23 AM" },
            { notificationType: "Credit Change", description: "Virtual Credit value updated to ₱70.00", time: "09:00 AM" }
        ]
    },
    {
        date: "December 25, 2025",
        data: [
            { notificationType: "Event Meal Request", description: "Request for 'Sports Fest' approved", time: "2:30 PM" },
            { notificationType: "Export Report", description: "Weekly consumption report downloaded", time: "11:15 AM" }
        ]
    },
    {
        date: "December 24, 2025",
        data: [
            { notificationType: "Upcoming Event", description: "System Maintenance scheduled for midnight", time: "5:00 PM" }
        ]
    }
];

// --- HELPER: GET ICON & COLOR BY TYPE ---
const getNotificationConfig = (type) => {
    switch (type) {
        case 'Meal Request':
            return { icon: Utensils, color: '#3B82F6', bg: '#EFF6FF' }; // Blue
        case 'Event Meal Request':
            return { icon: CalendarDays, color: '#F68A3A', bg: '#FFF7ED' }; // Orange
        case 'Credit Change':
            return { icon: Wallet, color: '#EAB308', bg: '#FEFCE8' }; // Yellow
        case 'Export Report':
            return { icon: FileDown, color: '#6B7280', bg: '#F3F4F6' }; // Gray
        case 'Upcoming Event':
            return { icon: Calendar, color: '#8B5CF6', bg: '#F5F3FF' }; // Purple
        default:
            return { icon: Clock, color: '#6B7280', bg: '#F3F4F6' };
    }
};

// --- SUB-COMPONENT: NOTIFICATION DROPDOWN ---
const NotificationDropdown = ({ isOpen, onClose, notifications }) => {
    // Styles extracted/adapted from your ExportReportModal
    const dropdownStyle = {
        position: 'fixed',
        top: '70px', // Below the 60px header
        right: '20px',
        width: '420px', // Adapted width (600px is too wide for a corner dropdown, 420px is standard large)
        maxHeight: '80vh',
        backgroundColor: 'white',
        borderRadius: '12px',
        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25), 0 0 0 1px rgba(0,0,0,0.05)',
        zIndex: 9000,
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
        fontFamily: 'geist'
    };

    const headerStyle = {
        padding: '20px 24px',
        borderBottom: '1px solid #f3f4f6',
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        backgroundColor: 'white', zIndex: 10
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Invisible Backdrop to close on click outside */}
                    <div 
                        style={{ position: 'fixed', inset: 0, zIndex: 8999 }} 
                        onClick={onClose} 
                    />
                    
                    <motion.div
                        initial={{ opacity: 0, y: -10, scale: 0.98 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -10, scale: 0.98 }}
                        transition={{ duration: 0.2 }}
                        style={dropdownStyle}
                    >
                        {/* Header */}
                        <div style={headerStyle}>
                            <div>
                                <h3 style={{ margin: 0, fontSize: '16px', fontWeight: 600, color: '#111827' }}>Notifications</h3>
                                <p style={{ margin: '2px 0 0 0', fontSize: '12px', color: '#6B7280' }}>You have unread updates.</p>
                            </div>
                            <button onClick={onClose} style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: '#9CA3AF' }}>
                                <X size={18} />
                            </button>
                        </div>

                        {/* Scrollable Content */}
                        <div style={{ overflowY: 'auto', padding: '0 0 12px 0' }}>
                            {notifications.map((group, groupIndex) => (
                                <div key={groupIndex}>
                                    {/* Date Header */}
                                    <div style={{ 
                                        padding: '12px 24px 8px', 
                                        fontSize: '11px', fontWeight: 600, color: '#9CA3AF', 
                                        textTransform: 'uppercase', letterSpacing: '0.05em' 
                                    }}>
                                        {group.date}
                                    </div>

                                    {/* Items */}
                                    {group.data.map((item, itemIndex) => {
                                        const config = getNotificationConfig(item.notificationType);
                                        const Icon = config.icon;
                                        
                                        return (
                                            <div 
                                                key={itemIndex}
                                                className="hover:bg-gray-50 transition-colors"
                                                style={{ 
                                                    padding: '12px 24px', 
                                                    display: 'flex', gap: '16px', 
                                                    cursor: 'pointer', borderBottom: '1px solid #f9fafb' 
                                                }}
                                            >
                                                {/* Icon Box */}
                                                <div style={{
                                                    minWidth: '36px', height: '36px', 
                                                    borderRadius: '8px', 
                                                    backgroundColor: config.bg, color: config.color,
                                                    display: 'flex', alignItems: 'center', justifyContent: 'center'
                                                }}>
                                                    <Icon size={18} />
                                                </div>

                                                {/* Text Content */}
                                                <div style={{ flex: 1 }}>
                                                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '2px' }}>
                                                        <span style={{ fontSize: '13px', fontWeight: 600, color: '#374151' }}>
                                                            {item.notificationType}
                                                        </span>
                                                        <span style={{ fontSize: '11px', color: '#9CA3AF' }}>
                                                            {item.time}
                                                        </span>
                                                    </div>
                                                    <p style={{ margin: 0, fontSize: '13px', color: '#6B7280', lineHeight: '1.4' }}>
                                                        {item.description}
                                                    </p>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            ))}
                        </div>
                        
                        {/* Footer */}
                        <div style={{ padding: '12px', borderTop: '1px solid #f3f4f6', textAlign: 'center' }}>
                            <button style={{ 
                                background: 'transparent', border: 'none', 
                                fontSize: '12px', fontWeight: 500, color: '#4268BD', cursor: 'pointer' 
                            }}>
                                Mark all as read
                            </button>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
};

// --- MAIN COMPONENT ---
function HeaderBar({ 
    userAvatar, 
    headerTitle, 
    userName = "Sample Name", 
    userRole = "Sample Role",
    hasNotification = false,
    notificationList = DEFAULT_NOTIFICATIONS // Default to mock data if prop not provided
}) {
    const context = useOutletContext() || {};
    const [isExpanded, setIsExpanded] = useState(context.isSidebarOpen || false);
    const handleToggleSidebar = context.handleToggleSidebar || (() => { });

    // --- STATE ---
    const [isScrolled, setIsScrolled] = useState(false);
    const [isSimulating, setIsSimulating] = useState(false); 
    const [triggerShake, setTriggerShake] = useState(false); 
    const [isProfileOpen, setIsProfileOpen] = useState(false); // Controls Notification Modal

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 10);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // --- SIDEBAR SYNC ---
    const handleMenuClick = () => {
        setIsExpanded(prev => !prev);
        handleToggleSidebar();
    };

    useEffect(() => {
        if (context.isSidebarOpen !== undefined) {
            setIsExpanded(context.isSidebarOpen);
        }
    }, [context.isSidebarOpen]);

    // --- HANDLERS ---
    const handleSimulationToggle = () => {
        setTriggerShake(true);
        setTimeout(() => setTriggerShake(false), 500); 
        setIsSimulating(prev => !prev); 
    };

    const handleProfileClick = () => {
        setIsProfileOpen(!isProfileOpen);
        // Optional: Reset simulation when opening profile
        if (isSimulating) setIsSimulating(false);
    };

    // --- GREETING ANIMATION STATE ---
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

    const isNotified = hasNotification || isSimulating;
    const avatarSrc = "/should_i_call_you_mister.png"; 

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

            {/* --- NOTIFICATION DROPDOWN --- */}
            <NotificationDropdown 
                isOpen={isProfileOpen} 
                onClose={() => setIsProfileOpen(false)} 
                notifications={notificationList}
            />

            {/* --- 1. FIXED MENU ICON --- */}
            <div 
                onClick={handleMenuClick} 
                className="hover:bg-gray-100"
                style={{
                    position: 'fixed', top: '15px', left: isExpanded ? '293px' : '90px', 
                    zIndex: 8000, backgroundColor: 'white', width: '30px', height: '30px', borderRadius: 6,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    cursor: 'pointer', boxShadow: '0 2px 5px rgba(0,0,0,0.1)',
                    transition: 'left 0.3s cubic-bezier(0.4, 0, 0.2, 1), background-color 0.2s' 
                }}
            >
                {isExpanded ? <PanelRightOpen size={20} color={"#263C70"}/> : <PanelLeftOpen size={20} color={"#263C70"}/>}
            </div>

            {/* --- 2. SIMULATION TRIGGER --- */}
            <div 
                onClick={handleSimulationToggle} 
                className="hover:bg-gray-100"
                style={{
                    position: 'fixed', top: '15px', left: isExpanded ? '333px' : '130px', 
                    zIndex: 8000, backgroundColor: 'white', width: '30px', height: '30px', borderRadius: 6,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    cursor: 'pointer', boxShadow: '0 2px 5px rgba(0,0,0,0.1)',
                    transition: 'left 0.3s cubic-bezier(0.4, 0, 0.2, 1), background-color 0.2s' 
                }}
                title="Toggle Notification Simulation"
            >
                <RotateCcw size={16} color={"#F68A3A"} />
            </div>

            {/* --- 3. FLOATING AVATAR (SCENARIO B - Scrolled) --- */}
            <div 
                onClick={handleProfileClick} // UPDATED: Opens Notification Modal
                style={{
                    position: 'fixed', top: '10px', right: '20px', zIndex: 8000,
                    opacity: isScrolled ? 1 : 0, pointerEvents: isScrolled ? 'auto' : 'none',
                    transition: 'all 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
                    transform: isScrolled ? 'translateY(0)' : 'translateY(-20px)',
                    animation: triggerShake 
                        ? 'shake 0.4s ease-in-out' 
                        : (isNotified && isScrolled) ? 'bounceProfile 2s infinite' : 'none'
                }}
            >
                <div style={{ position: 'relative', cursor: 'pointer' }}>
                    <img 
                        src={avatarSrc} alt="Profile" 
                        style={{ 
                            width: '40px', height: '40px', borderRadius: '12px', objectFit: 'cover',
                            border: '2px solid white', boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
                        }} 
                    />
                    {hasNotification && (
                        <div style={{
                            position: 'absolute', bottom: -2, right: -2, width: '12px', height: '12px', 
                            backgroundColor: '#EF4444', borderRadius: '50%', border: '2px solid white' 
                        }} />
                    )}
                    {isSimulating && (
                        <div style={{
                            position: 'absolute', bottom: -2, right: -2, width: '12px', height: '12px', 
                            backgroundColor: '#F68A3A', borderRadius: '50%', border: '2px solid white' 
                        }} />
                    )}
                </div>
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
                            paddingLeft: isExpanded ? "360px" : "150px", 
                            transition: "padding-left 0.3s cubic-bezier(0.4, 0, 0.2, 1)" 
                        }}></div>
                        <p style={{ fontWeight: '500' }} className="font-geist text-[2vh]"> 
                            {headerTitle}
                        </p>
                    </div>

                    <div style={{ marginRight: "20px", position: 'relative', height: '100%', display: 'flex', alignItems: 'center' }}>
                        {animationPhase !== 'swap' && (
                            <div style={greetingStyle}>
                                {greeting} <span style={{ color: '#000', fontWeight: 600, marginLeft: '4px' }}>{userName.split(' ')[0]}</span>
                            </div>
                        )}

                        <div style={profileStyle}>
                            <div 
                                onClick={handleProfileClick} // UPDATED: Opens Notification Modal
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
                                {(hasNotification || isSimulating) && (
                                    <div style={{
                                        position: 'absolute', bottom: -2, right: -2, width: '12px', height: '12px', 
                                        backgroundColor: isSimulating ? '#F68A3A' : '#EF4444', 
                                        borderRadius: '50%', border: '2px solid white' 
                                    }} />
                                )}
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
        </div>
    );
}

export { HeaderBar };