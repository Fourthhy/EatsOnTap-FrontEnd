import React, { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ChevronDown, Check, Info, RefreshCw, ArrowRight, ArrowLeft } from 'lucide-react';
import { useData } from "../../../../../context/DataContext";

// Reusable Dropdown
const ModalDropdown = ({ label, value, options, onChange, placeholder = "Select..." }) => {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div style={{ marginBottom: '0px' }}>
            <label style={{ display: 'block', fontSize: '12px', fontWeight: 500, color: '#374151', marginBottom: '6px' }}>{label}</label>
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
                    <span style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{value || placeholder}</span>
                    <ChevronDown size={14} className="text-gray-400 flex-shrink-0" />
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
                                    backgroundColor: 'white', borderRadius: '6px',
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

const AddAdviserModal = ({ isOpen, onClose, onAdd }) => {
    const { classAdvisers } = useData();

    // STEPS: 1 = Form, 2 = Confirmation
    const [step, setStep] = useState(1);
    const [idMode, setIdMode] = useState('automatic');
    const [manualIdConfirmed, setManualIdConfirmed] = useState(false);
    
    const [formData, setFormData] = useState({
        honorific: '', firstName: '', middleName: '', lastName: '', department: '', assignment: '', manualUserId: ''
    });

    // Reset on close
    useEffect(() => { if(!isOpen) { setStep(1); setFormData({ honorific: '', firstName: '', middleName: '', lastName: '', department: '', assignment: '', manualUserId: '' }); }}, [isOpen]);

    // --- ID GENERATION LOGIC ---
    const generatedId = useMemo(() => {
        if (!isOpen) return '';
        let maxSeq = 0;
        const currentYearPrefix = new Date().getFullYear().toString().slice(-2);
        
        if (classAdvisers && classAdvisers.length > 0) {
            classAdvisers.forEach(adv => {
                const parts = adv.userID.split('-');
                if (parts.length === 2) {
                    const numPart = parts[1].match(/^(\d+)/);
                    if (numPart) {
                        const seq = parseInt(numPart[1], 10);
                        if (seq > maxSeq) maxSeq = seq;
                    }
                }
            });
        }
        
        const nextSeq = (maxSeq + 1).toString().padStart(3, '0');
        
        let suffix = 'XXX';
        const fName = formData.firstName.trim();
        const mName = formData.middleName.trim();
        const lName = formData.lastName.trim();

        if (fName && lName) {
            const firstParts = fName.split(' ').filter(Boolean);
            if (firstParts.length >= 2) suffix = (firstParts[0][0] + firstParts[1][0] + lName[0]).toUpperCase();
            else {
                const midInit = mName ? mName[0] : 'X';
                suffix = (fName[0] + midInit + lName[0]).toUpperCase();
            }
        }
        return `${currentYearPrefix}-${nextSeq}${suffix}`;
    }, [classAdvisers, formData.firstName, formData.middleName, formData.lastName, isOpen]);

    // Validation
    const isBasicInfoValid = formData.firstName && formData.lastName && formData.honorific;
    let isFormValid = idMode === 'automatic' ? isBasicInfoValid : (isBasicInfoValid && formData.manualUserId && manualIdConfirmed);

    const handleNext = () => { if (isFormValid) setStep(2); };

    const handleConfirm = () => {
        const finalUserID = idMode === 'automatic' ? generatedId : formData.manualUserId;
        const email = `${formData.firstName.replace(/\s+/g, '').toLowerCase()}.${formData.lastName.replace(/\s+/g, '').toLowerCase()}@laverdad.edu.ph`;

        const payload = {
            userID: finalUserID,
            honorific: formData.honorific,
            first_name: formData.firstName,
            middle_name: formData.middleName,
            last_name: formData.lastName,
            department: formData.department,
            section: formData.assignment,
            email: email,
            password: 'EatsOnTapClassAdviser123',
            role: 'CLASS-ADVISER'
        };

        onAdd(payload);
        onClose();
    };

    const honorificOptions = ['Mr.', 'Ms.'];
    const departmentOptions = ['Preschool', 'Primary Education', 'Intermediate', 'Junior High School', 'Senior High School', 'Higher Education'];

    // Styles
    const activeStyles = { background: 'linear-gradient(to right, #4268BD, #3F6AC9)', cursor: 'pointer', fontWeight: '600', color: 'white', border: 'none' };
    const disabledStyles = { backgroundColor: '#cccccc', background: '#cccccc', cursor: 'not-allowed', fontWeight: '400', color: 'white', border: 'none' };
    const overlayVariants = { hidden: { opacity: 0 }, visible: { opacity: 1 }, exit: { opacity: 0, transition: { duration: 0.2 } } };
    const modalVariants = { hidden: { opacity: 0, scale: 0.95, y: 20 }, visible: { opacity: 1, scale: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 30 } }, exit: { opacity: 0, scale: 0.95, y: 20, transition: { duration: 0.2 } } };

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div variants={overlayVariants} initial="hidden" animate="visible" exit="exit" onClick={onClose} style={{ position: 'fixed', inset: 0, zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(2px)' }}>
                    <motion.div variants={modalVariants} onClick={(e) => e.stopPropagation()} style={{ backgroundColor: 'white', borderRadius: '6px', padding: '24px', width: '450px', boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)', position: 'relative', zIndex: 110 }}>
                        
                        {/* HEADER */}
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                            <h3 style={{ fontSize: '18px', fontWeight: 600, color: '#111827', margin: 0 }}>
                                {step === 1 ? "Add New Teacher" : "Confirm Account Creation"}
                            </h3>
                            <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#6b7280', padding: '4px' }}><X size={20} /></button>
                        </div>

                        {/* STEP 1: FORM */}
                        {step === 1 ? (
                            <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -10 }}>
                                {/* Name Row */}
                                <div style={{ display: 'flex', gap: '12px', marginBottom: '12px' }}>
                                    <div style={{ flex: '0 0 80px' }}>
                                        <ModalDropdown label="Title" value={formData.honorific} options={honorificOptions} onChange={(val) => setFormData({...formData, honorific: val})} placeholder="Title" />
                                    </div>
                                    <div style={{ flex: 1 }}>
                                        <label style={{ display: 'block', fontSize: '12px', fontWeight: 500, color: '#374151', marginBottom: '6px' }}>First Name <span className="text-red-500">*</span></label>
                                        <input type="text" placeholder="e.g. Jose Marie" value={formData.firstName} onChange={(e) => setFormData({...formData, firstName: e.target.value})} style={{ width: '100%', padding: '10px 12px', fontSize: '13px', borderRadius: '6px', border: '1px solid #d1d5db', outline: 'none' }} />
                                    </div>
                                </div>
                                <div style={{ display: 'flex', gap: '12px', marginBottom: '20px' }}>
                                    <div style={{ flex: 1 }}>
                                        <label style={{ display: 'block', fontSize: '12px', fontWeight: 500, color: '#374151', marginBottom: '6px' }}>Middle Name</label>
                                        <input type="text" placeholder="e.g. Borja" value={formData.middleName} onChange={(e) => setFormData({...formData, middleName: e.target.value})} style={{ width: '100%', padding: '10px 12px', fontSize: '13px', borderRadius: '6px', border: '1px solid #d1d5db', outline: 'none' }} />
                                    </div>
                                    <div style={{ flex: 1 }}>
                                        <label style={{ display: 'block', fontSize: '12px', fontWeight: 500, color: '#374151', marginBottom: '6px' }}>Last Name <span className="text-red-500">*</span></label>
                                        <input type="text" placeholder="e.g. Chan" value={formData.lastName} onChange={(e) => setFormData({...formData, lastName: e.target.value})} style={{ width: '100%', padding: '10px 12px', fontSize: '13px', borderRadius: '6px', border: '1px solid #d1d5db', outline: 'none' }} />
                                    </div>
                                </div>

                                {/* ID Section */}
                                <div style={{ backgroundColor: '#f9fafb', padding: '12px', borderRadius: '6px', marginBottom: '20px', border: '1px solid #e5e7eb' }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                                        <label style={{ fontSize: '12px', fontWeight: 600, color: '#374151' }}>User ID Generation</label>
                                        <div style={{ display: 'flex', gap: '12px', fontSize: '11px' }}>
                                            <label style={{ display: 'flex', alignItems: 'center', gap: '4px', cursor: 'pointer' }}><input type="radio" checked={idMode === 'automatic'} onChange={() => setIdMode('automatic')} /> Automatic</label>
                                            <label style={{ display: 'flex', alignItems: 'center', gap: '4px', cursor: 'pointer' }}><input type="radio" checked={idMode === 'manual'} onChange={() => setIdMode('manual')} /> Manual</label>
                                        </div>
                                    </div>
                                    {idMode === 'automatic' ? (
                                        <div style={{ position: 'relative' }}>
                                            <input type="text" value={generatedId} readOnly style={{ width: '100%', padding: '10px 12px', paddingRight: '35px', fontSize: '13px', fontWeight: '600', borderRadius: '6px', border: '1px solid #d1d5db', backgroundColor: '#e5e7eb', color: '#4b5563', outline: 'none' }} />
                                            <RefreshCw size={14} style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', color: '#6b7280' }} />
                                        </div>
                                    ) : (
                                        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                            <input type="text" placeholder="e.g. 25-001ABC" value={formData.manualUserId} onChange={(e) => setFormData({...formData, manualUserId: e.target.value})} style={{ width: '100%', padding: '10px 12px', fontSize: '13px', borderRadius: '6px', border: '1px solid #d1d5db', outline: 'none' }} />
                                            <label style={{ display: 'flex', alignItems: 'flex-start', gap: '8px', fontSize: '11px', color: '#4b5563', cursor: 'pointer' }}><input type="checkbox" checked={manualIdConfirmed} onChange={(e) => setManualIdConfirmed(e.target.checked)} style={{ marginTop: '2px' }}/> I confirm this ID is correct.</label>
                                        </div>
                                    )}
                                </div>

                                {/* Assignment */}
                                <div style={{ marginBottom: '16px' }}><ModalDropdown label="Department (Optional)" value={formData.department} options={departmentOptions} onChange={(val) => setFormData({...formData, department: val})} /></div>
                                <div style={{ marginBottom: '16px' }}>
                                    <label style={{ display: 'block', fontSize: '12px', fontWeight: 500, color: '#374151', marginBottom: '6px' }}>Current Assignment (Optional)</label>
                                    <input type="text" placeholder="e.g. Grade 1 Adviser" value={formData.assignment} onChange={(e) => setFormData({...formData, assignment: e.target.value})} style={{ width: '100%', padding: '10px 12px', fontSize: '13px', borderRadius: '6px', border: '1px solid #d1d5db', outline: 'none' }} />
                                </div>

                                {/* Step 1 Actions */}
                                <div style={{ display: 'flex', gap: '12px', marginTop: '12px' }}>
                                    <button onClick={onClose} style={{ flex: 1, padding: '10px', borderRadius: '6px', border: '1px solid #e5e7eb', backgroundColor: 'white', color: '#374151', fontSize: '13px', fontWeight: 500, cursor: 'pointer' }}>Cancel</button>
                                    <button onClick={handleNext} disabled={!isFormValid} style={{ flex: 1, padding: '10px', borderRadius: '6px', fontSize: '13px', transition: 'background-color 0.2s', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', ...(isFormValid ? activeStyles : disabledStyles) }}>
                                        Next <ArrowRight size={14} />
                                    </button>
                                </div>
                            </motion.div>
                        ) : (
                            /* STEP 2: CONFIRMATION */
                            <motion.div initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }}>
                                <div style={{ backgroundColor: '#eff6ff', border: '1px solid #dbeafe', borderRadius: '6px', padding: '16px', marginBottom: '20px' }}>
                                    <div style={{ display: 'flex', gap: '10px', alignItems: 'center', marginBottom: '8px' }}>
                                        <Info size={18} className="text-blue-600" />
                                        <h4 style={{ margin: 0, fontSize: '13px', fontWeight: 600, color: '#1e40af' }}>Account Creation Notice</h4>
                                    </div>
                                    <p style={{ fontSize: '12px', color: '#1e3a8a', margin: 0, lineHeight: '1.5' }}>
                                        A new system account will be generated for <strong>{formData.honorific} {formData.lastName}</strong>.
                                    </p>
                                    <div style={{ marginTop: '12px', paddingTop: '12px', borderTop: '1px solid #bfdbfe', display: 'grid', gap: '8px' }}>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px' }}>
                                            <span style={{ color: '#60a5fa' }}>User ID:</span>
                                            <span style={{ fontWeight: 600, color: '#1e40af' }}>{idMode === 'automatic' ? generatedId : formData.manualUserId}</span>
                                        </div>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px' }}>
                                            <span style={{ color: '#60a5fa' }}>Email:</span>
                                            <span style={{ fontWeight: 600, color: '#1e40af' }}>{formData.firstName.replace(/\s+/g, '').toLowerCase()}.{formData.lastName.replace(/\s+/g, '').toLowerCase()}@laverdad.edu.ph</span>
                                        </div>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px' }}>
                                            <span style={{ color: '#60a5fa' }}>Default Password:</span>
                                            <span style={{ fontWeight: 600, color: '#1e40af' }}>EatsOnTapClassAdviser123</span>
                                        </div>
                                    </div>
                                </div>
                                
                                <p style={{ fontSize: '12px', color: '#6b7280', textAlign: 'center', marginBottom: '20px', fontStyle: 'italic' }}>
                                    The user will be prompted to change this password upon their first login.
                                </p>

                                {/* Step 2 Actions */}
                                <div style={{ display: 'flex', gap: '12px', marginTop: '12px' }}>
                                    <button onClick={() => setStep(1)} style={{ flex: 1, padding: '10px', borderRadius: '6px', border: '1px solid #e5e7eb', backgroundColor: 'white', color: '#374151', fontSize: '13px', fontWeight: 500, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}>
                                        <ArrowLeft size={14} /> Back
                                    </button>
                                    <button onClick={handleConfirm} style={{ flex: 1, padding: '10px', borderRadius: '6px', fontSize: '13px', transition: 'background-color 0.2s', ...activeStyles }}>
                                        Confirm & Create
                                    </button>
                                </div>
                            </motion.div>
                        )}
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export { AddAdviserModal };