import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Utensils, CalendarDays, Wallet, FileDown, Calendar, Clock, Settings, Users, UserRoundPlus } from "lucide-react"; 

import { markNotificationsAsRead } from '../../functions/markNotificationAsRead'; 

// --- HELPER ---
const getNotificationConfig = (type) => {
    switch (type) {
        case 'Meal Request': return { icon: Utensils, color: '#3B82F6', bg: '#EFF6FF' };
        case 'Event Creation': return { icon: CalendarDays, color: '#F68A3A', bg: '#FFF7ED' };
        case 'Export Report': return { icon: FileDown, color: '#2cc970', bg: '#f4ffef' };
        case 'Export Student Backup': return { icon: FileDown, color: '#2cc970', bg: '#f4ffef' };
        case 'Setting Change': return { icon: Settings, color: '#6B7280', bg: '#F3F4F6' };
        case 'Upcoming Event': return { icon: Calendar, color: '#F68A3A', bg: '#FFF7ED' };
        case 'Update Student Registry': return { icon: Users, color: '#8B5CF6', bg: '#F5F3FF' };
        case 'Event Credit Allottment': return { icon: Wallet, color: '#F68A3A', bg: '#FFF7ED' };
        case 'Add Section Request': return { icon: UserRoundPlus, color: '#3B82F6', bg: '#EFF6FF'};
        default: return { icon: Clock, color: '#6B7280', bg: '#F3F4F6' };
    }
};

export const NotificationDropdown = ({ 
    isOpen, 
    onClose, 
    notifications = [], 
    userName,
    userRole,
    userEmail,
    userAvatar,
    currentUserID, 
    onRefresh      
}) => {

    // 🟢 NEW: Track ONLY the IDs of notifications we are optimistically marking as read
    const [optimisticReadIds, setOptimisticReadIds] = useState([]);

    // 🟢 UPDATED: Optimistic UI Update + API Call
    useEffect(() => {
        if (isOpen && currentUserID && notifications.length > 0) {
            const unreadIds = [];
            
            // 1. Find items that are unread AND haven't been optimistically marked yet
            notifications.forEach(group => {
                group?.data?.forEach(item => {
                    if (item.isRead === false && !optimisticReadIds.includes(item.notificationId)) {
                        unreadIds.push(item.notificationId);
                    }
                });
            });

            // 2. If we found anything to mark as read...
            if (unreadIds.length > 0) {
                // Instantly update the UI so the dots disappear
                setOptimisticReadIds(prev => [...prev, ...unreadIds]);

                // Fire the API silently in the background
                markNotificationsAsRead(unreadIds, currentUserID)
                    .then(() => {
                        // Tell parent to update so next time it opens, data is fresh
                        if (onRefresh) onRefresh(); 
                    })
                    .catch(error => {
                        console.error("Failed to mark as read in background:", error);
                    });
            }
        }
    }, [isOpen, currentUserID, notifications, optimisticReadIds]); // Safe to include notifications now!

    const dropdownStyle = {
        position: 'fixed', top: '70px', right: '20px', width: '420px', maxHeight: '80vh',
        backgroundColor: 'white', 
        borderRadius: '6px', 
        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25), 0 0 0 1px rgba(0,0,0,0.05)',
        zIndex: 9000, display: 'flex', flexDirection: 'column', overflow: 'hidden', fontFamily: 'geist'
    };

    const profileHeaderStyle = {
        padding: '16px 24px', 
        borderBottom: '1px solid #f3f4f6',
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        backgroundColor: 'white', 
        zIndex: 10
    };

    const sectionHeaderStyle = {
        padding: '12px 24px',
        borderBottom: '1px solid #f3f4f6',
        fontSize: '13px',
        fontWeight: 600,
        color: '#374151',
        backgroundColor: '#F9FAFB'
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    <div style={{ position: 'fixed', inset: 0, zIndex: 8999 }} onClick={onClose} />
                    
                    <motion.div
                        initial={{ opacity: 0, y: -10, scale: 0.98 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -10, scale: 0.98 }}
                        transition={{ duration: 0.2 }}
                        style={dropdownStyle}
                    >
                        {/* 1. PROFILE HEADER */}
                        <div style={profileHeaderStyle}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                {/* AVATAR */}
                                {userAvatar ? (
                                    <img 
                                        src={userAvatar} 
                                        alt="Profile" 
                                        style={{ 
                                            width: '40px', height: '40px', 
                                            borderRadius: '12px', 
                                            objectFit: 'cover',
                                            border: '1px solid #e5e7eb'
                                        }} 
                                    />
                                ) : (
                                    <div style={{ width: '40px', height: '40px', borderRadius: '12px', backgroundColor: '#F3F4F6', border: '1px solid #e5e7eb' }} />
                                )}

                                {/* TEXT DETAILS */}
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '14px', fontWeight: 600, color: '#111827' }}>
                                        <span>{userName || 'User'}</span>
                                        <span style={{ color: '#E5E7EB' }}>|</span>
                                        <span style={{ color: '#4B5563', fontSize: '13px', fontWeight: 500 }}>{userRole || 'Role'}</span>
                                    </div>
                                    <span style={{ fontSize: '12px', color: '#6B7280' }}>{userEmail || ''}</span>
                                </div>
                            </div>

                            <button onClick={onClose} style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: '#9CA3AF', padding: '4px', alignSelf: 'flex-start' }}>
                                <X size={18} />
                            </button>
                        </div>

                        {/* 2. NOTIFICATIONS HEADER */}
                        <div style={sectionHeaderStyle}>
                            Notifications
                        </div>

                        {/* 3. LIST */}
                        <div style={{ overflowY: 'auto', padding: '0 0 12px 0' }}>
                            {/* 🟢 Render directly from the props.notifications array */}
                            {notifications?.length > 0 ? (
                                notifications.map((group, groupIndex) => (
                                    <div key={`group-${groupIndex}`}>
                                        <div style={{ padding: '12px 24px 8px', fontSize: '11px', fontWeight: 600, color: '#9CA3AF', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                                            {group?.date || 'Unknown Date'}
                                        </div>
                                        {group?.data?.map((item, itemIndex) => {
                                            const config = getNotificationConfig(item?.notificationType);
                                            const Icon = config.icon;
                                            
                                            // 🟢 Determine if it should show the blue dot based on our local ID tracker
                                            const isCurrentlyUnread = item?.isRead === false && !optimisticReadIds.includes(item?.notificationId);

                                            return (
                                                <div key={item?.notificationId || itemIndex} className="hover:bg-gray-50 transition-colors" style={{ padding: '12px 24px', display: 'flex', gap: '16px', cursor: 'pointer', borderBottom: '1px solid #f9fafb' }}>
                                                    <div style={{ minWidth: '36px', height: '36px', borderRadius: '6px', backgroundColor: config.bg, color: config.color, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                                        <Icon size={18} />
                                                    </div>
                                                    <div style={{ flex: 1 }}>
                                                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '2px' }}>
                                                            <span style={{ fontSize: '13px', fontWeight: 600, color: '#374151' }}>{item?.notificationType || 'Notification'}</span>
                                                            <span style={{ fontSize: '11px', color: '#9CA3AF' }}>{item?.time || ''}</span>
                                                        </div>
                                                        <p style={{ margin: 0, fontSize: '13px', color: '#6B7280', lineHeight: '1.4' }}>{item?.description || 'No description provided.'}</p>
                                                    </div>
                                                    
                                                    {/* 🟢 Render the dot conditionally */}
                                                    {isCurrentlyUnread && (
                                                        <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#3B82F6', alignSelf: 'center' }} />
                                                    )}
                                                </div>
                                            );
                                        })}
                                    </div>
                                ))
                            ) : (
                                <div style={{ padding: '32px 24px', textAlign: 'center', color: '#9CA3AF', fontSize: '13px' }}>
                                    No new notifications.
                                </div>
                            )}
                        </div>

                        {/* Footer */}
                        {notifications?.length > 0 && (
                            <div style={{ padding: '12px', borderTop: '1px solid #f3f4f6', textAlign: 'center' }}>
                                <button style={{ background: 'transparent', border: 'none', fontSize: '12px', fontWeight: 500, color: '#4268BD', cursor: 'pointer' }}>
                                    Mark all as read
                                </button>
                            </div>
                        )}
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
};