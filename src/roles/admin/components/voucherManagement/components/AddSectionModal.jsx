import React, { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ChevronDown, Check } from 'lucide-react';

// IMPORT CONTEXT
import { useData } from "../../../../../context/DataContext";

// Internal Dropdown Component (Unchanged)
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
                    <span>{value || placeholder}</span>
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
    const [formData, setFormData] = useState({
        department: '',
        level: '',
        sectionName: '',
        adviser: ''
    });

    // Reset form when modal closes/opens
    useEffect(() => {
        if (!isOpen) setFormData({ department: '', level: '', sectionName: '', adviser: '' });
    }, [isOpen]);

    // 🟢 2. HARDCODED LEVEL MAPPINGS (As requested)
    const DEPARTMENT_LEVELS = useMemo(() => ({
        'Preschool': ['0', 'Pre'],
        'Primary Education': ['1', '2', '3'],
        'Intermediate': ['4', '5', '6'],
        'Junior High School': ['7', '8', '9', '10'],
        'Senior High School': ['11', '12'],
        'Higher Education': ['1', '2', '3', '4']
    }), []);

    const friendlyToKeyMap = {
        'Preschool': 'preschool',
        'Primary Education': 'primaryEducation',
        'Intermediate': 'intermediate',
        'Junior High School': 'juniorHighSchool',
        'Senior High School': 'seniorHighSchool',
        'Higher Education': 'higherEducation'
    };

    // Options for Department Dropdown
    const friendlyDeptOptions = Object.keys(DEPARTMENT_LEVELS);

    // 🟢 3. GET LEVELS BASED ON SELECTION (Using Hardcoded Map)
    const filteredLevelOptions = useMemo(() => {
        if (!formData.department) return [];
        return DEPARTMENT_LEVELS[formData.department] || [];
    }, [formData.department, DEPARTMENT_LEVELS]);

    // 🟢 4. EXTRACT ADVISERS (Global List from Context)
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

    // 🟢 5. CONDITIONAL LOGIC
    const isHigherEd = formData.department === 'Higher Education';
    
    // Validation
    const isFormValid = formData.department && formData.level && formData.sectionName;

    const handleSubmit = () => {
        if (isFormValid) {
            const payload = {
                ...formData,
                adviser: isHigherEd ? null : formData.adviser,
                categoryKey: friendlyToKeyMap[formData.department] // Backend Key
            };
            onAdd(payload);
            onClose();
        }
    };

    // STYLES
    const activeStyles = { 
        background: 'linear-gradient(to right, #4268BD, #3F6AC9)', 
        cursor: 'pointer', fontWeight: '600', color: 'white', border: 'none'
    };
    
    const disabledStyles = { 
        backgroundColor: '#cccccc', background: '#cccccc', 
        cursor: 'not-allowed', fontWeight: '400', color: 'white', border: 'none'
    };

    // Animation Variants
    const overlayVariants = {
        hidden: { opacity: 0 }, visible: { opacity: 1 }, exit: { opacity: 0, transition: { duration: 0.2 } }
    };

    const modalVariants = {
        hidden: { opacity: 0, scale: 0.95, y: 20 },
        visible: { opacity: 1, scale: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 30 } },
        exit: { opacity: 0, scale: 0.95, y: 20, transition: { duration: 0.2 } }
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div 
                    key="modal-overlay"
                    variants={overlayVariants} initial="hidden" animate="visible" exit="exit"
                    onClick={onClose}
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
                        {/* Header */}
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                            <h3 style={{ fontSize: '18px', fontWeight: 600, color: '#111827', margin: 0 }}>
                                {isHigherEd ? "Add New Program" : "Add New Section"}
                            </h3>
                            <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#6b7280', padding: '4px' }}><X size={20} /></button>
                        </div>

                        {/* 1. Department Dropdown */}
                        <ModalDropdown 
                            label="Department" 
                            value={formData.department} 
                            options={friendlyDeptOptions} 
                            onChange={(val) => setFormData({ ...formData, department: val, level: '' })} 
                        />

                        {/* 2. Level Dropdown (Filtered by Hardcoded Map) */}
                        <ModalDropdown 
                            label={isHigherEd ? "Year Level" : "Grade Level"} 
                            value={formData.level} 
                            options={filteredLevelOptions} 
                            placeholder={formData.department ? "Select Level..." : "Select Department first"}
                            onChange={(val) => setFormData({...formData, level: val})} 
                        />

                        {/* 3. Section/Program Name Input */}
                        <div style={{ marginBottom: '16px' }}>
                            <label style={{ display: 'block', fontSize: '12px', fontWeight: 500, color: '#374151', marginBottom: '6px' }}>
                                {isHigherEd ? "Program Name (e.g. BSIT)" : "Section Name"}
                            </label>
                            <input 
                                type="text" 
                                placeholder={isHigherEd ? "e.g. BS Information Systems" : "e.g. Rizal, A, 101"}
                                value={formData.sectionName}
                                onChange={(e) => setFormData({...formData, sectionName: e.target.value})}
                                style={{ 
                                    width: '100%', padding: '10px 12px', fontSize: '13px', 
                                    borderRadius: '6px', border: '1px solid #d1d5db', outline: 'none', fontFamily: 'inherit' 
                                }}
                            />
                        </div>

                        {/* 4. Adviser Dropdown (Hidden for Higher Ed) */}
                        {!isHigherEd && (
                            <ModalDropdown 
                                label="Assigned Adviser (Optional)" 
                                value={formData.adviser} 
                                options={adviserOptions} 
                                onChange={(val) => setFormData({...formData, adviser: val})} 
                            />
                        )}

                        {/* Actions */}
                        <div style={{ display: 'flex', gap: '12px', marginTop: '24px' }}>
                            <button 
                                onClick={onClose}
                                style={{ 
                                    flex: 1, padding: '10px', borderRadius: '6px', 
                                    border: '1px solid #e5e7eb', backgroundColor: 'white', 
                                    color: '#374151', fontSize: '13px', fontWeight: 500, cursor: 'pointer' 
                                }}
                            >
                                Cancel
                            </button>
                            <button 
                                onClick={handleSubmit}
                                disabled={!isFormValid}
                                style={{ 
                                    flex: 1, padding: '10px', borderRadius: '6px', fontSize: '13px', 
                                    transition: 'background-color 0.2s',
                                    ...(isFormValid ? activeStyles : disabledStyles)
                                }}
                            >
                                {isHigherEd ? "Create Program" : "Create Section"}
                            </button>
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};