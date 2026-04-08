import React, { useState, useEffect, useRef } from 'react';
import { format, addDays, isBefore, startOfDay, differenceInDays } from 'date-fns';
import { CalendarX2, AlertCircle, CheckCircle2, Loader2, X, Check, ArrowRight, ChevronDown } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { suspendOperations, resumeOperations, getActiveSuspension } from "../../../../functions/admin/settingManagement";

export const MealOverridePanel = () => {
    // --- STATE ---
    const [isExpanded, setIsExpanded] = useState(false);
    const [startDate, setStartDate] = useState(format(addDays(new Date(), 1), 'yyyy-MM-dd'));
    const [endDate, setEndDate] = useState(format(addDays(new Date(), 1), 'yyyy-MM-dd'));
    const [reason, setReason] = useState('');

    const [isLoading, setIsLoading] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);
    const [showResumeConfirm, setShowResumeConfirm] = useState(false);
    const [feedback, setFeedback] = useState({ type: '', message: '' });
    const [suspensionStatus, setSuspensionStatus] = useState(null);

    // 🟢 Ref to track the bottom of the component
    const bottomRef = useRef(null);

    // 🟢 THE FIX: Fetch the live status the moment the component mounts!
    useEffect(() => {
        const fetchStatus = async () => {
            try {
                const data = await getActiveSuspension();
                if (data.isSuspended) {
                    setSuspensionStatus({
                        days: data.daysCount,
                        reason: data.reason
                    });
                }
            } catch (error) {
                console.error("Failed to fetch initial suspension status", error);
            }
        };

        fetchStatus();
    }, []);

    const minStartDate = format(addDays(new Date(), 1), 'yyyy-MM-dd');

    // --- HANDLERS ---
    const handleInitialClick = () => {
        const start = startOfDay(new Date(startDate));
        const end = startOfDay(new Date(endDate));
        const tomorrow = startOfDay(addDays(new Date(), 1));

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
        try {
            // 🟢 CALL THE ACTUAL API
            await suspendOperations({ startDate, endDate, reason });

            const daysCount = differenceInDays(new Date(endDate), new Date(startDate)) + 1;
            setFeedback({ type: 'success', message: `Meals successfully suspended for ${daysCount} day(s).` });
            setSuspensionStatus({ days: daysCount, reason: reason });
            setReason('');

            setTimeout(() => { setIsExpanded(false); setFeedback({ type: '', message: '' }); }, 3000);
        } catch (error) {
            // 🟢 Display actual backend error if available
            setFeedback({ type: 'error', message: error.message || 'Failed to update schedule.' });
        } finally {
            setIsLoading(false);
        }
    };

    const executeResume = async () => {
        setIsLoading(true);
        setShowResumeConfirm(false);
        try {
            // 🟢 CALL THE ACTUAL API
            await resumeOperations();

            setFeedback({ type: 'success', message: 'Meal operations have been successfully resumed.' });
            setSuspensionStatus(null);

            setTimeout(() => { setIsExpanded(false); setFeedback({ type: '', message: '' }); }, 3000);
        } catch (error) {
            // 🟢 Display actual backend error if available
            setFeedback({ type: 'error', message: error.message || 'Failed to resume operations.' });
        } finally {
            setIsLoading(false);
        }
    };

    const calculatedDays = differenceInDays(new Date(endDate), new Date(startDate)) + 1;

    return (
        <div style={{ backgroundColor: 'white', borderRadius: '12px', border: '1px solid #E5E7EB', padding: '20px', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)' }}>

            {/* ACCORDION HEADER */}
            <div onClick={() => setIsExpanded(!isExpanded)} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <div style={{ backgroundColor: suspensionStatus ? '#FEF2F2' : '#F3F4F6', padding: '8px', borderRadius: '8px', color: suspensionStatus ? '#DC2626' : '#6B7280' }}>
                        <CalendarX2 size={20} />
                    </div>
                    <div>
                        <h3 style={{ fontSize: '16px', fontWeight: 700, color: '#1F2937', margin: 0, fontFamily: 'geist' }}>Schedule Suspensions</h3>
                        <p style={{ fontSize: '12px', color: '#6B7280', margin: '0 0 4px 0' }}>
                            {suspensionStatus ? `Currently blocking claims for ${suspensionStatus.days} day(s).` : 'Close meal operations for specific dates'}
                        </p>
                        <span style={{ padding: '2px 8px', borderRadius: '9999px', fontSize: '11px', fontWeight: 600, backgroundColor: suspensionStatus ? '#FEF2F2' : '#F0FDF4', color: suspensionStatus ? '#DC2626' : '#16A34A', border: `1px solid ${suspensionStatus ? '#FECACA' : '#BBF7D0'}` }}>
                            {suspensionStatus ? 'Suspension Scheduled' : 'Normal Operations'}
                        </span>
                    </div>
                </div>
                <ChevronDown size={18} color="#6B7280" style={{ transform: isExpanded ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.3s' }} />
            </div>

            <AnimatePresence initial={false}>
                {isExpanded && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        style={{ overflow: "hidden" }}
                    >
                        <div style={{ marginTop: '20px', paddingTop: '20px', borderTop: '1px solid #F3F4F6' }}>
                            {suspensionStatus ? (
                                <>
                                    <div style={{ backgroundColor: '#FEF2F2', padding: '16px', borderRadius: '8px', border: '1px solid #FECACA', marginBottom: '16px' }}>
                                        <h4 style={{ color: '#991B1B', fontSize: '14px', fontWeight: 600, margin: '0 0 8px 0' }}>Active Suspension Details</h4>
                                        <p style={{ color: '#DC2626', fontSize: '13px', margin: 0 }}><strong>Reason:</strong> {suspensionStatus.reason}</p>
                                    </div>
                                    <div style={{ backgroundColor: '#F9FAFB', padding: '16px', borderRadius: '8px', border: `1px dashed ${showResumeConfirm ? '#3B82F6' : '#D1D5DB'}`, marginBottom: '16px' }}>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                            <div>
                                                <p style={{ fontSize: '14px', fontWeight: 600, color: '#1F2937', margin: 0 }}>Resume Operation</p>
                                                <p style={{ fontSize: '12px', color: '#6B7280', margin: 0 }}>End this suspension early.</p>
                                            </div>
                                            <button onClick={() => setShowResumeConfirm(true)} disabled={isLoading} style={{ padding: '8px 16px', borderRadius: '6px', border: 'none', backgroundColor: '#2563EB', color: 'white', fontWeight: 600, cursor: 'pointer' }}>
                                                {isLoading ? <Loader2 size={16} className="animate-spin" /> : "Resume"}
                                            </button>
                                        </div>
                                        {showResumeConfirm && (
                                            <div style={{ marginTop: '16px', paddingTop: '16px', borderTop: '1px solid #E5E7EB' }}>
                                                <p style={{ fontSize: '13px', color: '#4B5563', marginBottom: '12px' }}>This operation is not on schedule. Are you sure you want to <strong>Force Resume</strong>?</p>
                                                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
                                                    <button onClick={() => setShowResumeConfirm(false)} style={{ padding: '6px 12px', border: '1px solid #D1D5DB', borderRadius: '6px', cursor: 'pointer' }}>Cancel</button>
                                                    <button onClick={executeResume} style={{ padding: '6px 12px', color: 'white', backgroundColor: '#2563EB', border: 'none', borderRadius: '6px', cursor: 'pointer' }}>Confirm Resume</button>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </>
                            ) : (
                                <>
                                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '12px' }}>
                                        <div>
                                            <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, marginBottom: '6px' }}>Start Date</label>
                                            <input type="date" min={minStartDate} value={startDate} onChange={(e) => setStartDate(e.target.value)} style={{ width: '100%', padding: '8px', borderRadius: '6px', border: '1px solid #D1D5DB' }} />
                                        </div>
                                        <div>
                                            <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, marginBottom: '6px' }}>End Date</label>
                                            <input type="date" min={startDate} value={endDate} onChange={(e) => setEndDate(e.target.value)} style={{ width: '100%', padding: '8px', borderRadius: '6px', border: '1px solid #D1D5DB' }} />
                                        </div>
                                    </div>
                                    <div style={{ marginBottom: '16px' }}>
                                        <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, marginBottom: '6px' }}>Reason <span style={{ color: '#DC2626' }}>*</span></label>
                                        <input type="text" value={reason} onChange={(e) => setReason(e.target.value)} placeholder="Reason for suspension..." style={{ width: '100%', padding: '8px', borderRadius: '6px', border: '1px solid #D1D5DB' }} />
                                    </div>
                                    <div style={{ backgroundColor: '#F9FAFB', padding: '16px', borderRadius: '8px', border: `1px dashed ${showConfirm ? '#F87171' : '#D1D5DB'}`, marginBottom: '16px' }}>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                            <div>
                                                <p style={{ fontSize: '14px', fontWeight: 600, color: '#1F2937', margin: 0 }}>Suspend Meals</p>
                                                <p style={{ fontSize: '12px', color: '#6B7280', margin: 0 }}>Zero out reports for these dates.</p>
                                            </div>
                                            <button onClick={handleInitialClick} disabled={isLoading} style={{ padding: '8px 16px', borderRadius: '6px', border: 'none', backgroundColor: '#DC2626', color: 'white', fontWeight: 600, cursor: 'pointer' }}>
                                                {isLoading ? <Loader2 size={16} className="animate-spin" /> : "Suspend"}
                                            </button>
                                        </div>
                                        {showConfirm && (
                                            <div style={{ marginTop: '16px', paddingTop: '16px', borderTop: '1px solid #E5E7EB' }}>
                                                <p style={{ fontSize: '13px', color: '#4B5563', marginBottom: '12px' }}>Confirm suspension for <strong>{calculatedDays} day(s)</strong>?</p>
                                                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
                                                    <button onClick={() => setShowConfirm(false)} style={{ padding: '6px 12px', border: '1px solid #D1D5DB', borderRadius: '6px', cursor: 'pointer' }}>Cancel</button>
                                                    <button onClick={executeAction} style={{ padding: '6px 12px', color: 'white', backgroundColor: '#DC2626', border: 'none', borderRadius: '6px', cursor: 'pointer' }}>Confirm Suspension</button>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </>
                            )}

                            {/* FEEDBACK MESSAGES */}
                            {feedback.message && (
                                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '8px', padding: '10px', borderRadius: '6px', backgroundColor: feedback.type === 'error' ? '#FEF2F2' : '#F0FDF4', border: `1px solid ${feedback.type === 'error' ? '#FECACA' : '#BBF7D0'}` }}>
                                    <AlertCircle size={16} color={feedback.type === 'error' ? "#DC2626" : "#16A34A"} />
                                    <p style={{ fontSize: '12px', color: feedback.type === 'error' ? '#991B1B' : '#166534', margin: 0 }}>{feedback.message}</p>
                                </div>
                            )}

                            {/* 🟢 THE INVISIBLE SCROLL TARGET */}
                            <div ref={bottomRef} style={{ height: '1px' }} />
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};