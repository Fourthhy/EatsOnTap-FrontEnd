import React, { useState } from 'react';
import { Power, CheckCircle2, Lock, ChevronDown, ChevronUp } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// 🟢 IMPORTS
import { PasswordConfirmationModal } from './PasswordConfirmationModal';
import { DeactivationWarningModal } from './DeactivationWarningModal';
import { ExportReportModal } from '../dashboard/ExportReportModal'; 
import { ReasonInputModal } from './ReasonInputModal'; // 🟢 New Import

const SystemActivationControl = ({ systemStatus, setSystemStatus }) => {
    const isSystemActive = systemStatus === 'active';

    // --- STATE MANAGEMENT ---
    const [isControlsUnlocked, setIsControlsUnlocked] = useState(false); // Controls Accordion
    const [unlockReason, setUnlockReason] = useState(null); // Store log reason

    const [pendingAction, setPendingAction] = useState(null); 
    const [tempReactivationDate, setTempReactivationDate] = useState(null);

    // Modal Visibilities
    const [showReasonModal, setShowReasonModal] = useState(false);
    const [showWarningModal, setShowWarningModal] = useState(false);
    const [showExportModal, setShowExportModal] = useState(false);
    const [showPasswordModal, setShowPasswordModal] = useState(false);

    // --- HANDLERS ---

    // 1. Trigger the Unlock Process
    const handleExpandRequest = () => {
        if (isControlsUnlocked) {
            // If already open, just close it
            setIsControlsUnlocked(false);
        } else {
            // If closed, require reason
            setShowReasonModal(true);
        }
    };

    // 2. Reason Confirmed -> Unlock Controls
    const handleReasonConfirmed = (reason) => {
        console.log("Controls Unlocked. Reason:", reason);
        setUnlockReason(reason); // You can use this later for logs
        setShowReasonModal(false);
        setIsControlsUnlocked(true); // 🟢 Open Accordion
    };

    // --- EXISTING ACTIONS (Hidden inside accordion) ---
    const handleDeactivateClick = () => {
        setPendingAction('deactivate');
        setShowWarningModal(true);
    };

    const handleScheduledClick = () => {
        setPendingAction('scheduled');
        setShowWarningModal(true);
    };

    const handleActivateClick = () => {
        setPendingAction('activate');
        setShowPasswordModal(true); 
    };

    // --- WARNING FLOW ---
    const handleExportTrigger = () => setShowExportModal(true);

    const handleProceedFromWarning = (date) => {
        if (pendingAction === 'scheduled') setTempReactivationDate(date);
        setShowWarningModal(false);
        setTimeout(() => setShowPasswordModal(true), 200);
    };

    // --- PASSWORD FLOW ---
    const handlePasswordConfirmed = (password) => {
        // Log the unlock reason along with the action
        console.log(`Action: ${pendingAction} | Reason: ${unlockReason} | Password Verified`);
        
        if (pendingAction === 'scheduled') {
            setSystemStatus('inactive');
        } else if (pendingAction === 'deactivate') {
            setSystemStatus('inactive');
        } else if (pendingAction === 'activate') {
            setSystemStatus('active');
        }

        setShowPasswordModal(false);
        setIsControlsUnlocked(false); // Auto-collapse after success
        setPendingAction(null);
    };

    // --- STYLES ---
    const theme = {
        fonts: { main: "'Geist', sans-serif" },
        colors: {
            white: '#FFFFFF', textMain: '#111827', textSec: '#6B7280',
            dangerBg: '#FEF2F2', dangerBorder: '#FCA5A5', dangerText: '#991B1B',
            success: '#16A34A'
        },
        radius: { lg: '12px', md: '8px' },
        shadows: { sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)' }
    };

    const styles = {
        card: {
            backgroundColor: isSystemActive ? theme.colors.white : theme.colors.dangerBg,
            borderRadius: theme.radius.lg,
            boxShadow: theme.shadows.sm,
            border: `1px solid ${isSystemActive ? '#E5E7EB' : theme.colors.dangerBorder}`,
            padding: '24px', transition: 'all 0.3s ease',
            fontFamily: theme.fonts.main, position: 'relative', overflow: 'hidden'
        },
        headerText: {
            fontSize: '18px', fontWeight: '700', marginBottom: '4px',
            color: isSystemActive ? theme.colors.textMain : theme.colors.dangerText
        },
        subText: {
            fontSize: '14px', lineHeight: '1.5',
            color: isSystemActive ? theme.colors.textSec : '#B91C1C'
        },
        iconBox: {
            width: '40px', height: '40px', borderRadius: '50%',
            backgroundColor: isSystemActive ? '#F3F4F6' : '#FEE2E2',
            color: isSystemActive ? '#374151' : '#DC2626',
            display: 'flex', alignItems: 'center', justifyContent: 'center'
        },
        // Buttons hidden inside accordion
        actionButton: {
            padding: '10px 20px', borderRadius: theme.radius.md, fontSize: '14px', fontWeight: '500', 
            cursor: 'pointer', border: 'none', display: 'flex', alignItems: 'center', gap: '8px',
            fontFamily: theme.fonts.main
        }
    };

    return (
        <section style={styles.card}>
            {/* Strip Indicator */}
            {!isSystemActive && (
                <div style={{ position: 'absolute', top: 0, left: 0, bottom: 0, width: '6px', backgroundColor: '#DC2626' }} />
            )}

            {/* --- HEADER (CLICK TO UNLOCK) --- */}
            <div 
                style={{ display: 'flex', gap: '16px', alignItems: 'center', cursor: 'pointer' }}
                onClick={handleExpandRequest}
            >
                <div style={styles.iconBox}>
                    {isSystemActive ? <Power size={20} /> : <Lock size={20} />}
                </div>

                <div style={{ flex: 1 }}>
                    <h2 style={styles.headerText}>
                        {isSystemActive ? 'System Activation Control' : 'System is Deactivated'}
                    </h2>
                    <p style={styles.subText}>
                        {isSystemActive 
                            ? "Manage system availability and access controls." 
                            : "System requires reactivation to resume services."}
                    </p>
                </div>

                {/* Chevron Indicator */}
                <div style={{ color: theme.colors.textSec }}>
                    {isControlsUnlocked ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                </div>
            </div>

            {/* --- ACCORDION CONTENT (HIDDEN CONTROLS) --- */}
            <AnimatePresence>
                {isControlsUnlocked && (
                    <motion.div
                        initial={{ height: 0, opacity: 0, marginTop: 0 }}
                        animate={{ height: 'auto', opacity: 1, marginTop: 24 }}
                        exit={{ height: 0, opacity: 0, marginTop: 0 }}
                        transition={{ duration: 0.3, ease: 'easeInOut' }}
                        style={{ overflow: 'hidden' }}
                    >
                        <div style={{ 
                            paddingTop: '16px', borderTop: `1px dashed ${isSystemActive ? '#E5E7EB' : '#FCA5A5'}`,
                            display: 'flex', gap: '12px', flexWrap: 'wrap' 
                        }}>
                            {isSystemActive ? (
                                <>
                                    <button 
                                        onClick={handleDeactivateClick}
                                        style={{ ...styles.actionButton, backgroundColor: '#DC2626', color: 'white' }}
                                    >
                                        <Power size={16} /> Deactivate Now
                                    </button>
                                    <button 
                                        onClick={handleScheduledClick}
                                        style={{ 
                                            ...styles.actionButton, 
                                            backgroundColor: '#FEF3C7', color: '#92400E', border: '1px solid #FCD34D' 
                                        }}
                                    >
                                        <Lock size={16} /> Scheduled Deactivation
                                    </button>
                                </>
                            ) : (
                                <button 
                                    onClick={handleActivateClick} 
                                    style={{ ...styles.actionButton, backgroundColor: theme.colors.success, color: 'white' }}
                                >
                                    <CheckCircle2 size={16} /> Reactivate System
                                </button>
                            )}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* --- MODALS --- */}
            <ReasonInputModal 
                isOpen={showReasonModal}
                onClose={() => setShowReasonModal(false)}
                onConfirm={handleReasonConfirmed}
            />

            <DeactivationWarningModal 
                isOpen={showWarningModal}
                onClose={() => setShowWarningModal(false)}
                type={pendingAction === 'scheduled' ? 'scheduled' : 'manual'}
                onExportTrigger={handleExportTrigger}
                onProceed={handleProceedFromWarning}
            />

            <ExportReportModal 
                isOpen={showExportModal}
                onClose={() => setShowExportModal(false)}
            />

            <PasswordConfirmationModal 
                isOpen={showPasswordModal}
                onClose={() => setShowPasswordModal(false)}
                onConfirm={handlePasswordConfirmed}
                actionTitle={pendingAction === 'activate' ? 'System Reactivation' : 'Confirm System Change'}
            />
        </section>
    );
};

export { SystemActivationControl };