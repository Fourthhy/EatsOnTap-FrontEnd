import React, { useState } from 'react';
import { format, addDays, isBefore, startOfDay, differenceInDays } from 'date-fns';
import { CalendarX2, AlertCircle, CheckCircle2, Loader2, X, Check, ArrowRight, ChevronDown } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export const MealOverridePanel = () => {
    // --- STATE ---
    const [isExpanded, setIsExpanded] = useState(false);
    const [startDate, setStartDate] = useState(format(addDays(new Date(), 1), 'yyyy-MM-dd'));
    const [endDate, setEndDate] = useState(format(addDays(new Date(), 1), 'yyyy-MM-dd'));
    const [reason, setReason] = useState('');

    const [isLoading, setIsLoading] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);
    const [feedback, setFeedback] = useState({ type: '', message: '' });

    // 🟢 NEW: State to track if there is currently an active/scheduled suspension
    const [suspensionStatus, setSuspensionStatus] = useState(null);

    // Ensure the date is at least tomorrow
    const minStartDate = format(addDays(new Date(), 1), 'yyyy-MM-dd');

    // --- HANDLERS ---
    const handleInitialClick = () => {
        const start = startOfDay(new Date(startDate));
        const end = startOfDay(new Date(endDate));
        const tomorrow = startOfDay(addDays(new Date(), 1));

        // Validation
        if (isBefore(start, tomorrow)) {
            setFeedback({ type: 'error', message: 'Suspensions must start at least 1 day in advance.' });
            return;
        }
        if (isBefore(end, start)) {
            setFeedback({ type: 'error', message: 'End date cannot be before the start date.' });
            return;
        }
        if (!reason.trim()) {
            setFeedback({ type: 'error', message: 'Please provide a reason for this suspension.' });
            return;
        }

        setFeedback({ type: '', message: '' });
        setShowConfirm(true);
    };

    const executeAction = async () => {
        setIsLoading(true);
        setShowConfirm(false);
        setFeedback({ type: '', message: '' });

        try {
            // TODO: Replace with your actual backend API call
            // await setMealSuspensionApi({ startDate, endDate, reason });

            // Simulating API delay
            await new Promise(resolve => setTimeout(resolve, 1000));

            const daysCount = differenceInDays(new Date(endDate), new Date(startDate)) + 1;

            setFeedback({
                type: 'success',
                message: `Meals successfully suspended for ${daysCount} day(s).`
            });

            // 🟢 NEW: Update the global status badge for the panel
            setSuspensionStatus({
                days: daysCount,
                reason: reason
            });

            // Clear form
            setReason('');

            // Auto-close accordion after 3 seconds on success
            setTimeout(() => {
                setIsExpanded(false);
                setFeedback({ type: '', message: '' });
            }, 3000);

        } catch (error) {
            setFeedback({ type: 'error', message: error.message || 'Failed to update schedule.' });
        } finally {
            setIsLoading(false);
        }
    };

    // Calculate days for the confirmation UI
    const calculatedDays = differenceInDays(new Date(endDate), new Date(startDate)) + 1;

    // --- RENDER ---
    return (
        <div style={{ backgroundColor: 'white', borderRadius: '12px', border: '1px solid #E5E7EB', padding: '20px', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)', transition: 'all 0.3s ease' }}>

            {/* 1. CLICKABLE ACCORDION HEADER */}
            <div
                onClick={() => setIsExpanded(!isExpanded)}
                style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer', userSelect: 'none' }}
            >
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    {/* 🟢 MODIFIED: Icon color reflects current status */}
                    <div style={{ backgroundColor: suspensionStatus ? '#FEF2F2' : '#F3F4F6', padding: '8px', borderRadius: '8px', color: suspensionStatus ? '#DC2626' : '#6B7280', transition: 'all 0.3s' }}>
                        <CalendarX2 size={20} />
                    </div>
                    <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '2px' }}>
                            <h3 style={{ fontSize: '16px', fontWeight: 700, color: '#1F2937', margin: 0, fontFamily: 'geist, sans-serif' }}>
                                Schedule Suspensions
                            </h3>
                        </div>
                        <p style={{ fontSize: '12px', color: '#6B7280', margin: 0 }}>
                            {suspensionStatus ? `Currently blocking claims for ${suspensionStatus.days} upcoming day(s).` : 'Optional: Block claims for specific dates.'}
                        </p>
                        {/* 🟢 NEW: Persistent Status Badge */}
                        <span style={{
                            padding: '2px 8px',
                            marginBottom: '6px',
                            borderRadius: '9999px',
                            fontSize: '11px',
                            fontWeight: 600,
                            backgroundColor: suspensionStatus ? '#FEF2F2' : '#F0FDF4',
                            color: suspensionStatus ? '#DC2626' : '#16A34A',
                            border: `1px solid ${suspensionStatus ? '#FECACA' : '#BBF7D0'}`,
                            transition: 'all 0.3s ease'
                        }}>
                            {suspensionStatus ? 'Suspension Scheduled' : 'Normal Operations'}
                        </span>
                    </div>
                </div>

                {/* Rotating Chevron Icon */}
                <div style={{ padding: '4px', backgroundColor: '#F3F4F6', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <ChevronDown
                        size={18}
                        color="#6B7280"
                        style={{ transform: isExpanded ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.3s ease' }}
                    />
                </div>
            </div>

            {/* 2. ANIMATED ACCORDION BODY */}
            <AnimatePresence initial={false}>
                {isExpanded && (
                    <motion.div
                        key="accordion-content"
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3, ease: "easeInOut" }}
                        style={{ overflow: "hidden" }}
                    >
                        <div style={{ marginTop: '20px', paddingTop: '20px', borderTop: '1px solid #F3F4F6' }}>

                            {/* DATE RANGE INPUTS */}
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '12px' }}>
                                <div>
                                    <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#374151', marginBottom: '6px' }}>Start Date</label>
                                    <input
                                        type="date" min={minStartDate} value={startDate} disabled={isLoading || showConfirm}
                                        onChange={(e) => {
                                            setStartDate(e.target.value);
                                            // Auto-adjust end date if start date goes past it
                                            if (isBefore(new Date(endDate), new Date(e.target.value))) setEndDate(e.target.value);
                                            setShowConfirm(false); setFeedback({ type: '', message: '' });
                                        }}
                                        style={{ width: '100%', padding: '8px 12px', borderRadius: '6px', border: '1px solid #D1D5DB', fontSize: '14px', fontFamily: 'geist, sans-serif' }}
                                    />
                                </div>
                                <div>
                                    <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#374151', marginBottom: '6px' }}>End Date</label>
                                    <input
                                        type="date" min={startDate} value={endDate} disabled={isLoading || showConfirm}
                                        onChange={(e) => {
                                            setEndDate(e.target.value);
                                            setShowConfirm(false); setFeedback({ type: '', message: '' });
                                        }}
                                        style={{ width: '100%', padding: '8px 12px', borderRadius: '6px', border: '1px solid #D1D5DB', fontSize: '14px', fontFamily: 'geist, sans-serif' }}
                                    />
                                </div>
                            </div>

                            {/* REASON INPUT */}
                            <div style={{ marginBottom: '16px' }}>
                                <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#374151', marginBottom: '6px' }}>
                                    Reason for Suspension <span style={{ color: '#DC2626' }}>*</span>
                                </label>
                                <input
                                    type="text"
                                    placeholder="e.g., Typhoon Class Suspension, School Holiday"
                                    value={reason}
                                    disabled={isLoading || showConfirm}
                                    onChange={(e) => {
                                        setReason(e.target.value);
                                        setShowConfirm(false); setFeedback({ type: '', message: '' });
                                    }}
                                    style={{ width: '100%', padding: '8px 12px', borderRadius: '6px', border: '1px solid #D1D5DB', fontSize: '14px', fontFamily: 'geist, sans-serif' }}
                                />
                            </div>

                            {/* ACTION AREA & INLINE CONFIRMATION */}
                            <div style={{ backgroundColor: '#F9FAFB', padding: '16px', borderRadius: '8px', border: `1px dashed ${showConfirm ? '#F87171' : '#D1D5DB'}`, marginBottom: '16px', transition: 'border 0.3s ease' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <div>
                                        <p style={{ fontSize: '14px', fontWeight: 600, color: '#1F2937', margin: 0 }}>Suspend Meals</p>
                                        <p style={{ fontSize: '12px', color: '#6B7280', margin: 0 }}>Zero out reports for these dates.</p>
                                    </div>

                                    <button
                                        onClick={handleInitialClick} disabled={isLoading || showConfirm}
                                        style={{ padding: '8px 16px', borderRadius: '6px', border: 'none', backgroundColor: '#DC2626', color: 'white', fontSize: '13px', fontWeight: 600, cursor: (isLoading || showConfirm) ? 'not-allowed' : 'pointer', opacity: showConfirm ? 0.5 : 1 }}
                                    >
                                        {isLoading ? <Loader2 size={16} className="animate-spin" /> : "Suspend"}
                                    </button>
                                </div>

                                {/* INLINE CONFIRMATION REVEAL */}
                                {showConfirm && calculatedDays > 0 && (
                                    <div style={{ marginTop: '16px', paddingTop: '16px', borderTop: '1px solid #E5E7EB' }}>
                                        <p style={{ fontSize: '13px', color: '#4B5563', marginBottom: '12px', lineHeight: 1.5 }}>
                                            Are you sure you want to <strong>SUSPEND</strong> meals for <strong>{calculatedDays} day(s)</strong>?<br />
                                            <span style={{ color: '#1F2937', fontWeight: 600 }}>{format(new Date(startDate), 'MMM dd')} <ArrowRight size={12} style={{ display: 'inline', margin: '0 4px' }} /> {format(new Date(endDate), 'MMM dd, yyyy')}</span><br />
                                            <span style={{ color: '#DC2626', fontSize: '12px', fontStyle: 'italic' }}>Reason: "{reason}"</span>
                                        </p>
                                        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
                                            <button onClick={() => setShowConfirm(false)} style={{ padding: '6px 12px', fontSize: '12px', fontWeight: 600, color: '#4B5563', backgroundColor: 'white', border: '1px solid #D1D5DB', borderRadius: '6px', cursor: 'pointer' }}>
                                                <X size={14} style={{ display: 'inline', marginBottom: '-2px', marginRight: '4px' }} /> Cancel
                                            </button>
                                            <button onClick={executeAction} style={{ padding: '6px 12px', fontSize: '12px', fontWeight: 600, color: 'white', backgroundColor: '#DC2626', border: 'none', borderRadius: '6px', cursor: 'pointer' }}>
                                                <Check size={14} style={{ display: 'inline', marginBottom: '-2px', marginRight: '4px' }} /> Confirm Suspension
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* FEEDBACK MESSAGES */}
                            {feedback.message && (
                                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '8px', padding: '10px', borderRadius: '6px', backgroundColor: feedback.type === 'error' ? '#FEF2F2' : '#F0FDF4', border: `1px solid ${feedback.type === 'error' ? '#FECACA' : '#BBF7D0'}` }}>
                                    {feedback.type === 'error' ? <AlertCircle size={16} color="#DC2626" style={{ marginTop: '2px' }} /> : <CheckCircle2 size={16} color="#16A34A" style={{ marginTop: '2px' }} />}
                                    <p style={{ fontSize: '12px', color: feedback.type === 'error' ? '#991B1B' : '#166534', margin: 0, lineHeight: 1.4 }}>{feedback.message}</p>
                                </div>
                            )}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};