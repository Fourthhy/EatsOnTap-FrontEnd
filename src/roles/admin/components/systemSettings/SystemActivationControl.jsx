import React, { useState } from 'react';
import { Power, CheckCircle2, Lock } from 'lucide-react';
import { PasswordConfirmationModal } from './PasswordConfirmationModal';
import { DeactivationWarningModal } from './DeactivationWarningModal';
import { ExportReportModal } from '../dashboard/ExportReportModal'; // Ensure this path is correct

const SystemActivationControl = ({ systemStatus, setSystemStatus }) => {
    const isSystemActive = systemStatus === 'active';

    // --- STATE MANAGEMENT ---
    const [pendingAction, setPendingAction] = useState(null); // 'activate', 'deactivate', 'scheduled'
    const [tempReactivationDate, setTempReactivationDate] = useState(null);

    // Modal Visibilities
    const [showWarningModal, setShowWarningModal] = useState(false);
    const [showExportModal, setShowExportModal] = useState(false);
    const [showPasswordModal, setShowPasswordModal] = useState(false);

    // --- STEP 1: INITIAL CLICKS ---
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
        setShowPasswordModal(true); // No warning needed for activation, straight to password
    };

    // --- STEP 2: WARNING MODAL INTERACTIONS ---
    const handleExportTrigger = () => {
        setShowExportModal(true);
        // Note: We keep Warning Modal open behind it, or we could close it. 
        // Keeping it open maintains context.
    };

    const handleProceedFromWarning = (date) => {
        if (pendingAction === 'scheduled') {
            setTempReactivationDate(date);
        }
        setShowWarningModal(false);
        // Small delay to make transition smoother
        setTimeout(() => setShowPasswordModal(true), 200);
    };

    // --- STEP 3: FINAL PASSWORD CONFIRMATION ---
    const handlePasswordConfirmed = (password) => {
        console.log(`Action: ${pendingAction} confirmed. Password: ${password}`);
        
        if (pendingAction === 'scheduled') {
            console.log(`System scheduled to reactivate on: ${tempReactivationDate}`);
            setSystemStatus('inactive');
            // Add API logic to save the date
        } else if (pendingAction === 'deactivate') {
            setSystemStatus('inactive');
        } else if (pendingAction === 'activate') {
            setSystemStatus('active');
        }

        setShowPasswordModal(false);
        setPendingAction(null);
        setTempReactivationDate(null);
    };

    // --- STYLES ---
    const theme = {
        fonts: { main: "'Geist', sans-serif" },
        colors: {
            white: '#FFFFFF', textMain: '#111827', textSec: '#6B7280',
            dangerBg: '#FEF2F2', dangerBorder: '#FCA5A5', dangerText: '#991B1B',
            success: '#16A34A', buttonText: '#FFFFFF'
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
            padding: '32px', transition: 'all 0.3s ease',
            fontFamily: theme.fonts.main, position: 'relative', overflow: 'hidden'
        },
        headerText: {
            fontSize: '20px', fontWeight: '700', marginBottom: '8px',
            color: isSystemActive ? theme.colors.textMain : theme.colors.dangerText
        },
        subText: {
            fontSize: '14px', lineHeight: '1.5',
            color: isSystemActive ? theme.colors.textSec : '#B91C1C'
        },
        iconBox: {
            width: '48px', height: '48px', borderRadius: '50%',
            backgroundColor: isSystemActive ? '#F3F4F6' : '#FEE2E2',
            color: isSystemActive ? '#374151' : '#DC2626',
            display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '16px'
        },
        activateButton: {
            width: '100%', maxWidth: '240px', padding: '12px 24px',
            backgroundColor: theme.colors.success, color: 'white', border: 'none',
            borderRadius: theme.radius.md, fontSize: '15px', fontWeight: '600', cursor: 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
            boxShadow: '0 4px 6px -1px rgba(22, 163, 74, 0.2)', fontFamily: theme.fonts.main
        },
        deactivateButton: {
            padding: '10px 20px', backgroundColor: '#DC2626', color: 'white', border: 'none',
            borderRadius: theme.radius.md, fontSize: '14px', fontWeight: '500', cursor: 'pointer',
            fontFamily: theme.fonts.main
        }
    };

    const getPasswordTitle = () => {
        if (pendingAction === 'activate') return 'System Reactivation';
        if (pendingAction === 'scheduled') return 'Confirm Scheduled Pause';
        return 'Confirm System Deactivation';
    };

    return (
        <section style={styles.card}>
            {/* Visual Indicator Strip */}
            {!isSystemActive && (
                <div style={{ position: 'absolute', top: 0, left: 0, bottom: 0, width: '6px', backgroundColor: '#DC2626' }} />
            )}

            <div style={{ display: 'flex', gap: '20px', alignItems: 'flex-start' }}>
                <div style={styles.iconBox}>
                    {isSystemActive ? <Power size={24} /> : <Lock size={24} />}
                </div>

                <div style={{ flex: 1 }}>
                    <h2 style={styles.headerText}>
                        {isSystemActive ? 'System Activation Control' : 'System is Deactivated'}
                    </h2>
                    
                    <p style={styles.subText}>
                        {isSystemActive 
                            ? "The system is currently running. Deactivating it will prevent all students and staff from accessing the meal claiming features."
                            : "The system is currently locked. No claims or requests can be processed. You must provide an administrator password to reactivate the system."}
                    </p>

                    <div style={{ marginTop: '24px' }}>
                        {isSystemActive ? (
                            <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                                <button 
                                    onClick={handleDeactivateClick}
                                    style={styles.deactivateButton}
                                >
                                    Deactivate System
                                </button>
                                <button 
                                    onClick={handleScheduledClick}
                                    style={{ 
                                        ...styles.deactivateButton, 
                                        backgroundColor: '#FEF3C7', color: '#92400E', border: '1px solid #FCD34D' 
                                    }}
                                >
                                    Scheduled Deactivation
                                </button>
                            </div>
                        ) : (
                            <button onClick={handleActivateClick} style={styles.activateButton}>
                                <CheckCircle2 size={18} /> Reactivate System
                            </button>
                        )}
                    </div>
                </div>
            </div>

            {/* --- 1. WARNING MODAL (Pre-check) --- */}
            <DeactivationWarningModal 
                isOpen={showWarningModal}
                onClose={() => setShowWarningModal(false)}
                type={pendingAction === 'scheduled' ? 'scheduled' : 'manual'}
                onExportTrigger={handleExportTrigger}
                onProceed={handleProceedFromWarning}
            />

            {/* --- 2. EXPORT MODAL (Triggered by Warning Modal) --- */}
            <ExportReportModal 
                isOpen={showExportModal}
                onClose={() => setShowExportModal(false)}
            />

            {/* --- 3. PASSWORD MODAL (Final Check) --- */}
            <PasswordConfirmationModal 
                isOpen={showPasswordModal}
                onClose={() => setShowPasswordModal(false)}
                onConfirm={handlePasswordConfirmed}
                actionTitle={getPasswordTitle()}
            />
        </section>
    );
};

export { SystemActivationControl };