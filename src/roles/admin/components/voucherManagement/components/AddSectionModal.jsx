import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ChevronDown, Check } from 'lucide-react';
import { programsAndSections, adviserRegistry } from '../studentListConfig';

// Internal Dropdown for the Modal (Kept same as before)
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
                        backgroundColor: 'white', border: '1px solid #d1d5db', borderRadius: '8px',
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
                                    backgroundColor: 'white', borderRadius: '8px',
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
    const [formData, setFormData] = useState({
        level: '',
        sectionName: '',
        adviser: ''
    });

    // Extract unique levels from config
    const levelOptions = useMemo(() => {
        let levels = [];
        programsAndSections.forEach(cat => cat.levels.forEach(l => levels.push(l.gradeLevel)));
        return levels;
    }, []);

    // Extract adviser names
    const adviserOptions = useMemo(() => adviserRegistry.map(a => a.name), []);

    const handleSubmit = () => {
        if (formData.level && formData.sectionName && formData.adviser) {
            onAdd(formData);
            setFormData({ level: '', sectionName: '', adviser: '' }); // Reset
            onClose();
        }
    };

    // Define animations variants
    const overlayVariants = {
        hidden: { opacity: 0 },
        visible: { opacity: 1 },
        exit: { opacity: 0, transition: { duration: 0.2 } }
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
                    variants={overlayVariants}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                    onClick={onClose} // Close on clicking backdrop
                    style={{ position: 'fixed', inset: 0, zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(2px)' }}
                >
                    <motion.div
                        key="modal-content"
                        variants={modalVariants}
                        // initial, animate, exit are inherited from parent if variants match keys
                        onClick={(e) => e.stopPropagation()} // Prevent click inside modal closing it
                        style={{ backgroundColor: 'white', borderRadius: '12px', padding: '24px', width: '400px', boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)', position: 'relative', zIndex: 110 }}
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
                            onChange={(val) => setFormData({...formData, level: val})} 
                        />

                        <div style={{ marginBottom: '16px' }}>
                            <label style={{ display: 'block', fontSize: '12px', fontWeight: 500, color: '#374151', marginBottom: '6px' }}>Section Name</label>
                            <input 
                                type="text" 
                                placeholder="e.g. Rizal, A, 101"
                                value={formData.sectionName}
                                onChange={(e) => setFormData({...formData, sectionName: e.target.value})}
                                style={{ width: '100%', padding: '10px 12px', fontSize: '13px', borderRadius: '8px', border: '1px solid #d1d5db', outline: 'none', fontFamily: 'inherit' }}
                            />
                        </div>

                        <ModalDropdown 
                            label="Assigned Adviser" 
                            value={formData.adviser} 
                            options={adviserOptions} 
                            onChange={(val) => setFormData({...formData, adviser: val})} 
                        />

                        {/* Actions */}
                        <div style={{ display: 'flex', gap: '12px', marginTop: '24px' }}>
                            <button 
                                onClick={onClose}
                                style={{ flex: 1, padding: '10px', borderRadius: '8px', border: '1px solid #e5e7eb', backgroundColor: 'white', color: '#374151', fontSize: '13px', fontWeight: 500, cursor: 'pointer' }}
                            >
                                Cancel
                            </button>
                            <button 
                                onClick={handleSubmit}
                                disabled={!formData.level || !formData.sectionName || !formData.adviser}
                                style={{ 
                                    flex: 1, padding: '10px', borderRadius: '8px', border: 'none', 
                                    backgroundColor: (!formData.level || !formData.sectionName || !formData.adviser) ? '#93c5fd' : '#4268BD', 
                                    color: 'white', fontSize: '13px', fontWeight: 500, cursor: 'pointer',
                                    transition: 'background-color 0.2s'
                                }}
                            >
                                Create Section
                            </button>
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};