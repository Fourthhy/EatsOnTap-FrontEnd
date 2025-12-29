import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ChevronDown, Check } from 'lucide-react';

// 1. IMPORT CONTEXT
import { useData } from "../../../../../context/DataContext";

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
                        borderRadius: '6px', // 6px Radius
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
                                    backgroundColor: 'white', borderRadius: '6px',
                                    boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1), 0 2px 4px -1px rgba(0,0,0,0.06)',
                                    border: '1px solid #f3f4f6', zIndex: 150, maxHeight: '200px', overflowY: 'auto'
                                }}
                            >
                                {options.length > 0 ? options.map((opt) => (
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
                                )) : (
                                    <div style={{ padding: '10px 12px', fontSize: '12px', color: '#9ca3af', textAlign: 'center' }}>
                                        No existing advisers found
                                    </div>
                                )}
                            </motion.div>
                        </>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
};

export const AddSectionModal = ({ isOpen, onClose, onAdd }) => {
    // 2. USE DATA FROM CONTEXT
    const { programsAndSections } = useData();

    const [formData, setFormData] = useState({
        level: '',
        sectionName: '',
        adviser: ''
    });

    const [isHovered, setIsHovered] = useState(false);

    // Extract unique levels
    const levelOptions = useMemo(() => {
        if (!programsAndSections) return [];
        const levels = [];
        programsAndSections.forEach(cat => cat.levels.forEach(l => levels.push(l.gradeLevel)));
        return [...new Set(levels)];
    }, [programsAndSections]);

    // Extract Adviser names dynamically
    const adviserOptions = useMemo(() => {
        if (!programsAndSections) return [];
        const advisers = new Set();
        programsAndSections.forEach(cat => {
            cat.levels.forEach(lvl => {
                lvl.sections.forEach(sec => {
                    if (sec.adviser && sec.adviser !== "Unassigned") {
                        advisers.add(sec.adviser);
                    }
                });
            });
        });
        return Array.from(advisers).sort();
    }, [programsAndSections]);

    // --- 🟢 UPDATED SUBMIT LOGIC ---
    const handleSubmit = () => {
        // Only require Level and Section Name
        if (formData.level && formData.sectionName) {
            onAdd({
                ...formData,
                // Default to "Unassigned" if empty
                adviser: formData.adviser || "Unassigned"
            });
            setFormData({ level: '', sectionName: '', adviser: '' });
            onClose();
        }
    };

    // --- 🟢 UPDATED VALIDATION ---
    // Adviser is no longer required for the button to enable
    const isDisabled = !formData.level || !formData.sectionName;

    // Button Colors
    const buttonBgColor = isDisabled ? '#2CA4DD' : (isHovered ? '#33549F' : '#4268BD');

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    key="modal-overlay"
                    initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                    onClick={onClose}
                    style={{ position: 'fixed', inset: 0, zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(2px)' }}
                >
                    <motion.div
                        key="modal-content"
                        initial={{ opacity: 0, scale: 0.95, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 20 }}
                        onClick={(e) => e.stopPropagation()}
                        style={{ backgroundColor: 'white', borderRadius: '6px', padding: '24px', width: '400px', boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)', position: 'relative', zIndex: 110 }}
                    >
                        {/* Header */}
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                            <h3 style={{ fontSize: '18px', fontWeight: 600, color: '#111827', margin: 0 }}>Add New Section</h3>
                            <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#6b7280', padding: '4px' }}><X size={20} /></button>
                        </div>

                        {/* Form */}
                        <ModalDropdown
                            label="Grade Level / Year"
                            value={formData.level}
                            options={levelOptions}
                            onChange={(val) => setFormData({ ...formData, level: val })}
                        />

                        <div style={{ marginBottom: '16px' }}>
                            <label style={{ display: 'block', fontSize: '12px', fontWeight: 500, color: '#374151', marginBottom: '6px' }}>{formData.level.includes("Year") ? "Program Name" : "Section Name"}</label>
                            <input
                                type="text"
                                placeholder="e.g. Rizal, A, 101"
                                value={formData.sectionName}
                                onChange={(e) => setFormData({ ...formData, sectionName: e.target.value })}
                                style={{ width: '100%', padding: '10px 12px', fontSize: '13px', borderRadius: '6px', border: '1px solid #d1d5db', outline: 'none', fontFamily: 'inherit' }}
                            />
                        </div>

                        {formData.level.includes("Year") ? "" : (
                            <ModalDropdown
                                // 🟢 Label updated to indicate optionality
                                label="Assigned Adviser (Optional)"
                                value={formData.adviser}
                                options={adviserOptions}
                                onChange={(val) => setFormData({ ...formData, adviser: val })}
                                placeholder="Select or leave empty..."
                            />
                        )}

                        {/* Actions */}
                        <div style={{ display: 'flex', gap: '12px', marginTop: '24px' }}>
                            <button
                                onClick={onClose}
                                style={{ flex: 1, padding: '10px', borderRadius: '6px', border: '1px solid #e5e7eb', backgroundColor: 'white', color: '#374151', fontSize: '13px', fontWeight: 500, cursor: 'pointer' }}
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleSubmit}
                                disabled={isDisabled}
                                onMouseEnter={() => setIsHovered(true)}
                                onMouseLeave={() => setIsHovered(false)}
                                style={{
                                    flex: 1, padding: '10px', borderRadius: '6px', border: 'none',
                                    backgroundColor: buttonBgColor,
                                    color: 'white', fontSize: '13px', fontWeight: 500, cursor: isDisabled ? 'not-allowed' : 'pointer',
                                    transition: 'background-color 0.2s'
                                }}
                            >
                                Create {formData.level.includes("Year") ? "Program" : "Section"}
                            </button>
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};