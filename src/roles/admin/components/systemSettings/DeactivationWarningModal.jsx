import React, { useState, useEffect } from 'react';
import { AlertTriangle, Download, Calendar, ArrowRight, X } from 'lucide-react';

const DeactivationWarningModal = ({ 
    isOpen, 
    onClose, 
    type, // 'manual' or 'scheduled'
    onExportTrigger, // Callback to open the existing ExportReportModal
    onProceed 
}) => {
    // --- STATE ---
    const [isRendered, setIsRendered] = useState(false);
    const [isVisible, setIsVisible] = useState(false);
    
    // Form States
    const [hasExported, setHasExported] = useState(false); // Checkbox state
    const [reactivationDate, setReactivationDate] = useState('');

    // --- ANIMATION LOGIC ---
    useEffect(() => {
        if (isOpen) {
            setIsRendered(true);
            const timer = setTimeout(() => setIsVisible(true), 10);
            return () => clearTimeout(timer);
        } else {
            setIsVisible(false);
            const timer = setTimeout(() => setIsRendered(false), 200);
            setHasExported(false); // Reset on close
            setReactivationDate('');
            return () => clearTimeout(timer);
        }
    }, [isOpen]);

    if (!isRendered) return null;

    // --- LOGIC ---
    const isScheduled = type === 'scheduled';
    const canProceed = isScheduled ? (hasExported && reactivationDate) : hasExported;

    // --- STYLES ---
    const theme = {
        fonts: { main: "'Geist', sans-serif" },
        colors: { 
            textMain: '#111827', textSec: '#6B7280', 
            warningBg: '#FEF3C7', warningText: '#92400E',
            border: '#E5E7EB', primary: '#4268BD'
        },
        radius: { lg: '12px', md: '8px' }
    };

    const overlayStyle = {
        position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.4)', backdropFilter: 'blur(4px)',
        zIndex: 60, // Higher than standard, lower than Password Modal
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        opacity: isVisible ? 1 : 0, transition: 'opacity 0.2s ease-in-out'
    };

    const modalStyle = {
        backgroundColor: 'white', width: '500px', borderRadius: theme.radius.lg,
        boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)', padding: '32px', position: 'relative',
        transform: isVisible ? 'scale(1) translateY(0)' : 'scale(0.95) translateY(10px)',
        opacity: isVisible ? 1 : 0, transition: 'transform 0.2s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.2s ease',
        fontFamily: theme.fonts.main
    };

    return (
        <div style={overlayStyle} onClick={onClose}>
            <div style={modalStyle} onClick={e => e.stopPropagation()}>
                
                {/* Header */}
                <div style={{ display: 'flex', gap: '16px', marginBottom: '20px' }}>
                    <div style={{ 
                        width: '48px', height: '48px', borderRadius: '50%', backgroundColor: '#FEE2E2', 
                        color: '#DC2626', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 
                    }}>
                        <AlertTriangle size={24} />
                    </div>
                    <div>
                        <h2 style={{ fontSize: '18px', fontWeight: '700', color: theme.colors.textMain, marginBottom: '4px' }}>
                            {isScheduled ? "Scheduled System Pause" : "System Deactivation"}
                        </h2>
                        <p style={{ fontSize: '14px', color: theme.colors.textSec, lineHeight: '1.5' }}>
                            {isScheduled 
                                ? "This will automatically stop all operations until the selected date." 
                                : "This will immediately stop all data collection and user access."}
                        </p>
                    </div>
                </div>

                {/* Content Body */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                    
                    {/* 1. Force Export Warning */}
                    <div style={{ backgroundColor: '#F9FAFB', padding: '16px', borderRadius: theme.radius.md, border: `1px solid ${theme.colors.border}` }}>
                        <h4 style={{ fontSize: '14px', fontWeight: '600', marginBottom: '8px', color: theme.colors.textMain }}>
                            Step 1: Secure Data Backup
                        </h4>
                        <p style={{ fontSize: '13px', color: theme.colors.textSec, marginBottom: '12px' }}>
                            Before proceeding, you must generate an export of the current system reports to ensure no data is lost during the downtime.
                        </p>
                        <button 
                            onClick={onExportTrigger}
                            style={{ 
                                display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 16px', 
                                backgroundColor: 'white', border: `1px solid ${theme.colors.border}`, 
                                borderRadius: '6px', fontSize: '13px', fontWeight: '500', cursor: 'pointer',
                                color: theme.colors.primary, boxShadow: '0 1px 2px rgba(0,0,0,0.05)'
                            }}
                        >
                            <Download size={16} /> Open Export Manager
                        </button>
                    </div>

                    {/* 2. Scheduled Date Picker (Conditional) */}
                    {isScheduled && (
                        <div>
                            <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', marginBottom: '8px', color: theme.colors.textMain }}>
                                Step 2: Set Reactivation Date
                            </label>
                            <div style={{ position: 'relative' }}>
                                <Calendar size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: theme.colors.textSec }} />
                                <input 
                                    type="date" 
                                    min={new Date().toISOString().split('T')[0]} // Disable past dates
                                    value={reactivationDate}
                                    onChange={(e) => setReactivationDate(e.target.value)}
                                    style={{ 
                                        width: '100%', padding: '10px 10px 10px 40px', borderRadius: '8px', 
                                        border: `1px solid ${theme.colors.border}`, fontSize: '14px', fontFamily: theme.fonts.main,
                                        outline: 'none', color: theme.colors.textMain
                                    }} 
                                />
                            </div>
                            <p style={{ fontSize: '12px', color: theme.colors.textSec, marginTop: '6px' }}>
                                The system will automatically reactivate at 00:00 on this date.
                            </p>
                        </div>
                    )}

                    {/* 3. Acknowledgement Checkbox */}
                    <div style={{ marginTop: '4px' }}>
                        <label style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', cursor: 'pointer' }}>
                            <input 
                                type="checkbox" 
                                checked={hasExported}
                                onChange={(e) => setHasExported(e.target.checked)}
                                style={{ marginTop: '3px', accentColor: theme.colors.primary }}
                            />
                            <span style={{ fontSize: '13px', color: theme.colors.textMain }}>
                                I confirm that I have exported the necessary reports and understand that {isScheduled ? "manual login" : "manual activation"} will be required to resume operations {isScheduled ? "if I wish to start before the scheduled date." : "again."}
                            </span>
                        </label>
                    </div>

                </div>

                {/* Footer Actions */}
                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '32px' }}>
                    <button 
                        onClick={onClose}
                        style={{ 
                            padding: '10px 20px', borderRadius: '8px', border: 'none', 
                            backgroundColor: '#F3F4F6', color: '#374151', fontSize: '14px', 
                            fontWeight: '500', cursor: 'pointer', fontFamily: theme.fonts.main 
                        }}
                    >
                        Cancel
                    </button>
                    <button 
                        onClick={() => onProceed(reactivationDate)}
                        disabled={!canProceed}
                        style={{ 
                            padding: '10px 24px', borderRadius: '8px', border: 'none', 
                            backgroundColor: canProceed ? '#DC2626' : '#FCA5A5', 
                            color: 'white', fontSize: '14px', fontWeight: '500', 
                            cursor: canProceed ? 'pointer' : 'not-allowed', 
                            display: 'flex', alignItems: 'center', gap: '8px',
                            fontFamily: theme.fonts.main, transition: 'background-color 0.2s'
                        }}
                    >
                        Proceed to Security Check <ArrowRight size={16} />
                    </button>
                </div>

            </div>
        </div>
    );
};

export { DeactivationWarningModal };