import React, { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ChevronDown, Check, Loader2 } from 'lucide-react';

// IMPORT CONTEXT
import { useData } from "../../../../../context/DataContext";

// 🟢 IMPORT THE API FUNCTION
// Make sure the export name matches your file ({ addSectionProgram })
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
    const [isSubmitting, setIsSubmitting] = useState(false); // Track loading state
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
        }
    }, [isOpen]);

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

    // 🟢 3. LOGIC: CHECK IF HIGHER ED
    const isHigherEd = formData.department === 'Higher Education';

    // Get Levels based on selection
    const filteredLevelOptions = useMemo(() => {
        if (!formData.department) return [];
        return DEPARTMENT_LEVELS[formData.department] || [];
    }, [formData.department, DEPARTMENT_LEVELS]);

    // Get Advisers (Global List)
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

    // Validation
    const isFormValid = formData.department && formData.level && formData.nameInput;

    // 🟢 4. SUBMIT HANDLER (Updated with API Logic)
    const handleSubmit = async () => {
        if (!isFormValid || isSubmitting) return;

        setIsSubmitting(true);

        const payload = {
            department: formData.department,
            year: formData.level,
            
            // Logic: Only include adviser if NOT Higher Ed
            handleAdviser: isHigherEd ? undefined : formData.adviser,

            // Logic: Map generic input to specific DB fields
            program: isHigherEd ? formData.nameInput : undefined,
            section: !isHigherEd ? formData.nameInput : undefined,
        };

        try {
            // 1. Call Backend
            await addSectionProgram(payload);
            
            // 2. Refresh Parent Data (if onAdd handles refetching)
            if (onAdd) onAdd(payload); 

            // 3. Success Feedback & Close
            alert(`${isHigherEd ? 'Program' : 'Section'} created successfully!`);
            onClose();
        } catch (error) {
            console.error(error);
            alert(`Error: ${error.message}`);
        } finally {
            setIsSubmitting(false);
        }
    }

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
                    onClick={!isSubmitting ? onClose : undefined} // Prevent closing while submitting
                    style={{ position: 'fixed', inset: 0, zIndex: 9000, display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(2px)' }}
                >
                    <motion.div
                        key="modal-content"
                        variants={modalVariants}
                        onClick={(e) => e.stopPropagation()}
                        style={{
                            backgroundColor: 'white', borderRadius: '6px', padding: '24px', width: '400px',
                            boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)', position: 'relative', zIndex: 110
                        }}
                    >
                        {/* Header Changes Title Dynamically */}
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                            <h3 style={{ fontSize: '18px', fontWeight: 600, color: '#111827', margin: 0 }}>
                                {isHigherEd ? "Add New Program" : "Add New Section"}
                            </h3>
                            <button onClick={onClose} disabled={isSubmitting} style={{ background: 'none', border: 'none', cursor: isSubmitting ? 'not-allowed' : 'pointer', color: '#6b7280', padding: '4px', opacity: isSubmitting ? 0.5 : 1 }}><X size={20} /></button>
                        </div>

                        {/* 1. Department Dropdown (The Switcher) */}
                        <ModalDropdown
                            label="Department"
                            value={formData.department}
                            options={friendlyDeptOptions}
                            // Reset other fields when department changes to avoid invalid states
                            onChange={(val) => setFormData({ ...formData, department: val, level: '', adviser: '' })}
                        />

                        {/* 2. Level Dropdown */}
                        <ModalDropdown
                            label={isHigherEd ? "Year Level" : "Grade Level"}
                            value={formData.level}
                            options={filteredLevelOptions}
                            placeholder={formData.department ? "Select Level..." : "Select Department first"}
                            onChange={(val) => setFormData({ ...formData, level: val })}
                        />

                        {/* 3. Dynamic Input: Section Name OR Program Name */}
                        <div style={{ marginBottom: '16px' }}>
                            <label style={{ display: 'block', fontSize: '12px', fontWeight: 500, color: '#374151', marginBottom: '6px' }}>
                                {isHigherEd ? "Program Name (e.g. BSIT)" : "Section Name"}
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

                        {/* 4. Adviser Dropdown (Visible ONLY if NOT Higher Ed) */}
                        {!isHigherEd && (
                            <ModalDropdown
                                label="Assigned Adviser (Optional)"
                                value={formData.adviser}
                                options={adviserOptions}
                                onChange={(val) => setFormData({ ...formData, adviser: val })}
                            />
                        )}

                        {/* Actions */}
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
                            <button
                                onClick={handleSubmit}
                                disabled={!isFormValid || isSubmitting}
                                style={{
                                    flex: 1, padding: '10px', borderRadius: '6px', fontSize: '13px',
                                    transition: 'background-color 0.2s',
                                    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
                                    ...(!isFormValid || isSubmitting ? disabledStyles : activeStyles)
                                }}
                            >
                                {isSubmitting && <Loader2 size={14} className="animate-spin" />}
                                {isSubmitting ? "Creating..." : (isHigherEd ? "Create Program" : "Create Section")}
                            </button>
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};