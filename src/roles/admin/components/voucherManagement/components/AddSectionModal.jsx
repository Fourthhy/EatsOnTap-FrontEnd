import React, { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ChevronDown, Check, Loader2, AlertCircle } from 'lucide-react';

// IMPORT CONTEXT
import { useData } from "../../../../../context/DataContext";

// IMPORT THE API FUNCTION
import { addSectionProgram } from "../../../../../functions/admin/addSectionProgram";

// Internal Dropdown Component
const ModalDropdown = ({ label, value, options, onChange, placeholder = "Select..." }) => {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div style={{ marginBottom: '16px' }}>
            <label style={{ display: 'block', fontSize: '12px', fontWeight: 500, color: '#374151', marginBottom: '6px' }}>
                {label}
            </label>
            <div style={{ position: 'relative' }}>
                <button
                    onClick={(e) => { e.stopPropagation(); setIsOpen(!isOpen); }}
                    style={{
                        width: '100%', padding: '10px 12px', fontSize: '13px', textAlign: 'left',
                        backgroundColor: 'white', border: '1px solid #d1d5db',
                        borderRadius: '6px',
                        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                        cursor: 'pointer', color: value ? '#111827' : '#9ca3af'
                    }}
                >
                    <span style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {value || placeholder}
                    </span>
                    <ChevronDown size={14} className="text-gray-400" />
                </button>

                <AnimatePresence>
                    {isOpen && (
                        <>
                            <div style={{ position: 'fixed', inset: 0, zIndex: 140 }} onClick={(e) => { e.stopPropagation(); setIsOpen(false); }} />
                            <motion.div
                                initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -5 }}
                                transition={{ duration: 0.2 }}
                                style={{
                                    position: 'absolute', top: '100%', left: 0, right: 0, marginTop: '4px',
                                    backgroundColor: 'white',
                                    borderRadius: '6px',
                                    boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1), 0 2px 4px -1px rgba(0,0,0,0.06)',
                                    border: '1px solid #f3f4f6', zIndex: 150, maxHeight: '200px', overflowY: 'auto'
                                }}
                            >
                                {options.map((opt) => (
                                    <button
                                        key={opt}
                                        onClick={(e) => { e.stopPropagation(); onChange(opt); setIsOpen(false); }}
                                        style={{
                                            width: '100%', padding: '10px 12px', fontSize: '13px', textAlign: 'left',
                                            backgroundColor: 'transparent', border: 'none', cursor: 'pointer',
                                            display: 'flex', alignItems: 'center', gap: '8px', color: '#374151',
                                            borderBottom: '1px solid #f9fafb'
                                        }}
                                        onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f9fafb'}
                                        onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                                    >
                                        {value === opt && <Check size={14} className="text-blue-600" />}
                                        <span style={{ marginLeft: value === opt ? 0 : '22px' }}>{opt}</span>
                                    </button>
                                ))}
                            </motion.div>
                        </>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
};

export const AddSectionModal = ({ isOpen, onClose, onAdd }) => {
    const { schoolData } = useData();

    // 🟢 1. STATE MANAGEMENT
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isConfirming, setIsConfirming] = useState(false); // NEW: Tracks confirmation overlay
    const [notification, setNotification] = useState(null); 
    
    const [formData, setFormData] = useState({
        department: '',
        level: '',
        nameInput: '',
        adviser: ''
    });

    // Reset form when modal closes/opens
    useEffect(() => {
        if (!isOpen) {
            setFormData({ department: '', level: '', nameInput: '', adviser: '' });
            setIsSubmitting(false);
            setIsConfirming(false); // Reset confirmation state
            setNotification(null); 
        }
    }, [isOpen]);

    // Auto-close Notification Effect (3 Seconds)
    useEffect(() => {
        let timer;
        if (notification) {
            timer = setTimeout(() => {
                const wasSuccess = !notification.isError;
                setNotification(null);
                
                if (wasSuccess) {
                    onClose();
                }
            }, 3000);
        }
        return () => clearTimeout(timer);
    }, [notification, onClose]);

    // 🟢 2. CONFIGURATION & MAPPINGS
    const DEPARTMENT_LEVELS = useMemo(() => ({
        'Preschool': ['0', 'Pre'],
        'Primary Education': ['1', '2', '3'],
        'Intermediate': ['4', '5', '6'],
        'Junior High School': ['7', '8', '9', '10'],
        'Senior High School': ['11', '12'],
        'Higher Education': ['1', '2', '3', '4']
    }), []);

    const friendlyDeptOptions = Object.keys(DEPARTMENT_LEVELS);
    const isHigherEd = formData.department === 'Higher Education';

    const filteredLevelOptions = useMemo(() => {
        if (!formData.department) return [];
        return DEPARTMENT_LEVELS[formData.department] || [];
    }, [formData.department, DEPARTMENT_LEVELS]);

    const adviserOptions = useMemo(() => {
        if (!schoolData) return [];
        let advisers = new Set();
        schoolData.forEach(cat => {
            if (cat.levels) {
                cat.levels.forEach(l => {
                    if (l.sections) {
                        l.sections.forEach(s => {
                            if (s.adviser && s.adviser !== "Unassigned") {
                                advisers.add(s.adviser);
                            }
                        });
                    }
                });
            }
        });
        return Array.from(advisers).sort();
    }, [schoolData]);

    const isFormValid = formData.department && formData.level && formData.nameInput;

    // 🟢 4. HANDLERS
    const handlePreSubmit = () => {
        if (!isFormValid || isSubmitting) return;
        setIsConfirming(true); // Trigger the confirmation overlay instead of submitting immediately
    };

    const executeSubmit = async () => {
        setIsSubmitting(true);
        setNotification(null);

        const payload = {
            department: formData.department,
            year: formData.level,
            handleAdviser: isHigherEd ? undefined : formData.adviser,
            program: isHigherEd ? formData.nameInput : undefined,
            section: !isHigherEd ? formData.nameInput : undefined,
        };

        try {
            await addSectionProgram(payload);
            if (onAdd) onAdd(payload);

            setIsConfirming(false); // Hide the confirmation overlay
            
            // Trigger Success Notification (Closes main modal automatically after 3s)
            setNotification({ 
                message: `${isHigherEd ? 'Program' : 'Section'} created successfully!`, 
                isError: false 
            });
            
        } catch (error) {
            console.error(error);
            setIsConfirming(false); // Hide confirmation overlay so they can fix the error
            
            // Trigger Error Notification
            setNotification({ 
                message: `Error: ${error.message || 'Something went wrong.'}`, 
                isError: true 
            });
            setIsSubmitting(false);
        }
    };

    // Styles
    const activeStyles = { background: 'linear-gradient(to right, #4268BD, #3F6AC9)', cursor: 'pointer', fontWeight: '600', color: 'white', border: 'none' };
    const disabledStyles = { backgroundColor: '#cccccc', background: '#cccccc', cursor: 'not-allowed', fontWeight: '400', color: 'white', border: 'none' };
    const overlayVariants = { hidden: { opacity: 0 }, visible: { opacity: 1 }, exit: { opacity: 0, transition: { duration: 0.2 } } };
    const modalVariants = { hidden: { opacity: 0, scale: 0.95, y: 20 }, visible: { opacity: 1, scale: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 30 } }, exit: { opacity: 0, scale: 0.95, y: 20, transition: { duration: 0.2 } } };

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    key="modal-overlay"
                    variants={overlayVariants} initial="hidden" animate="visible" exit="exit"
                    onClick={!isSubmitting && !isConfirming ? onClose : undefined} 
                    style={{ position: 'fixed', inset: 0, zIndex: 9000, display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(2px)' }}
                >
                    <motion.div
                        key="modal-content"
                        variants={modalVariants}
                        onClick={(e) => e.stopPropagation()}
                        style={{
                            backgroundColor: 'white', borderRadius: '6px', padding: '24px', width: '400px',
                            boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)', position: 'relative', zIndex: 110,
                            overflow: 'hidden' // Keeps overlays and notifications inside the boundaries
                        }}
                    >
                        {/* 🟢 NEW: Confirmation Overlay */}
                        <AnimatePresence>
                            {isConfirming && (
                                <motion.div
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                    style={{
                                        position: 'absolute', inset: 0, zIndex: 130, backgroundColor: 'rgba(255,255,255,0.85)', backdropFilter: 'blur(4px)',
                                        display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px'
                                    }}
                                >
                                    <motion.div
                                        initial={{ scale: 0.9, y: 10 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.9, y: 10 }}
                                        style={{
                                            backgroundColor: 'white', borderRadius: '8px', padding: '20px', width: '100%',
                                            boxShadow: '0 10px 25px -5px rgba(0,0,0,0.15)', border: '1px solid #E5E7EB',
                                            textAlign: 'center'
                                        }}
                                    >
                                        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '12px', color: '#4268BD' }}>
                                            <AlertCircle size={32} />
                                        </div>
                                        <h4 style={{ margin: '0 0 8px 0', fontSize: '16px', fontWeight: 600, color: '#111827' }}>Confirm Creation</h4>
                                        <p style={{ margin: '0 0 20px 0', fontSize: '13px', color: '#4B5563', lineHeight: 1.5 }}>
                                            Are you sure you want to create the {isHigherEd ? 'program' : 'section'} <strong>{formData.nameInput}</strong> for <strong>{formData.department}</strong> ({formData.level})?
                                        </p>
                                        
                                        <div style={{ display: 'flex', gap: '8px' }}>
                                            <button 
                                                onClick={() => setIsConfirming(false)} 
                                                disabled={isSubmitting}
                                                style={{ flex: 1, padding: '8px', borderRadius: '6px', border: '1px solid #D1D5DB', backgroundColor: 'white', color: '#374151', fontSize: '13px', fontWeight: 500, cursor: isSubmitting ? 'not-allowed' : 'pointer', opacity: isSubmitting ? 0.5 : 1 }}
                                            >
                                                Back
                                            </button>
                                            <button 
                                                onClick={executeSubmit} 
                                                disabled={isSubmitting}
                                                style={{ flex: 1, padding: '8px', borderRadius: '6px', border: 'none', background: 'linear-gradient(to right, #4268BD, #3F6AC9)', color: 'white', fontSize: '13px', fontWeight: 600, cursor: isSubmitting ? 'not-allowed' : 'pointer', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px', opacity: isSubmitting ? 0.7 : 1 }}
                                            >
                                                {isSubmitting && <Loader2 size={14} className="animate-spin" />}
                                                {isSubmitting ? "Creating..." : "Confirm"}
                                            </button>
                                        </div>
                                    </motion.div>
                                </motion.div>
                            )}
                        </AnimatePresence>

                        {/* Notification Banner Overlay */}
                        <AnimatePresence>
                            {notification && (
                                <motion.div
                                    initial={{ opacity: 0, y: -40 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -40 }}
                                    style={{
                                        position: 'absolute', top: 0, left: 0, right: 0, zIndex: 120,
                                        padding: '16px', textAlign: 'center', fontSize: '13px', fontWeight: 600,
                                        backgroundColor: notification.isError ? '#FEE2E2' : '#DCFCE7',
                                        color: notification.isError ? '#991B1B' : '#166534',
                                        borderBottom: `2px solid ${notification.isError ? '#F87171' : '#4ADE80'}`
                                    }}
                                >
                                    {notification.message}
                                </motion.div>
                            )}
                        </AnimatePresence>

                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', marginTop: notification ? '20px' : '0', transition: 'margin 0.3s ease' }}>
                            <h3 style={{ fontSize: '18px', fontWeight: 600, color: '#111827', margin: 0 }}>
                                {isHigherEd ? "Add New Program" : "Add New Section"}
                            </h3>
                            <button onClick={onClose} disabled={isSubmitting || isConfirming} style={{ background: 'none', border: 'none', cursor: (isSubmitting || isConfirming) ? 'not-allowed' : 'pointer', color: '#6b7280', padding: '4px', opacity: (isSubmitting || isConfirming) ? 0.5 : 1 }}><X size={20} /></button>
                        </div>

                        {/* Form contents stay the same, but they will be blurred underneath the confirmation overlay */}
                        <div style={{ filter: isConfirming ? 'blur(2px)' : 'none', transition: 'filter 0.3s' }}>
                            <ModalDropdown
                                label="Department"
                                value={formData.department}
                                options={friendlyDeptOptions}
                                onChange={(val) => setFormData({ ...formData, department: val, level: '', adviser: '' })}
                            />

                            <ModalDropdown
                                label={isHigherEd ? "Year Level" : "Grade Level"}
                                value={formData.level}
                                options={filteredLevelOptions}
                                placeholder={formData.department ? "Select Level..." : "Select Department first"}
                                onChange={(val) => setFormData({ ...formData, level: val })}
                            />

                            <div style={{ marginBottom: '16px' }}>
                                <label style={{ display: 'block', fontSize: '12px', fontWeight: 500, color: '#374151', marginBottom: '6px' }}>
                                    {isHigherEd ? "Program Name Initials (e.g. BSIT)" : "Section Name"}
                                </label>
                                <input
                                    type="text"
                                    placeholder={isHigherEd ? "e.g. BS Information Systems" : "e.g. Rizal, A, 101"}
                                    value={formData.nameInput}
                                    onChange={(e) => setFormData({ ...formData, nameInput: e.target.value })}
                                    style={{
                                        width: '100%', padding: '10px 12px', fontSize: '13px',
                                        borderRadius: '6px', border: '1px solid #d1d5db', outline: 'none', fontFamily: 'inherit'
                                    }}
                                />
                            </div>

                            {!isHigherEd && (
                                <ModalDropdown
                                    label="Assigned Adviser (Optional)"
                                    value={formData.adviser}
                                    options={adviserOptions}
                                    onChange={(val) => setFormData({ ...formData, adviser: val })}
                                />
                            )}

                            <div style={{ display: 'flex', gap: '12px', marginTop: '24px' }}>
                                <button
                                    onClick={onClose}
                                    disabled={isSubmitting}
                                    style={{
                                        flex: 1, padding: '10px', borderRadius: '6px',
                                        border: '1px solid #e5e7eb', backgroundColor: 'white',
                                        color: '#374151', fontSize: '13px', fontWeight: 500,
                                        cursor: isSubmitting ? 'not-allowed' : 'pointer',
                                        opacity: isSubmitting ? 0.6 : 1
                                    }}
                                >
                                    Cancel
                                </button>
                                
                                {/* 🟢 UPDATED: Triggers confirmation instead of direct submit */}
                                <button
                                    onClick={handlePreSubmit}
                                    disabled={!isFormValid || isSubmitting}
                                    style={{
                                        flex: 1, padding: '10px', borderRadius: '6px', fontSize: '13px',
                                        transition: 'background-color 0.2s',
                                        display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
                                        ...(!isFormValid || isSubmitting ? disabledStyles : activeStyles)
                                    }}
                                >
                                    {isHigherEd ? "Create Program" : "Create Section"}
                                </button>
                            </div>
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};