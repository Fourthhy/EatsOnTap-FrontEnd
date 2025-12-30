import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ChevronDown, Check, Info } from 'lucide-react';

// Reusable Dropdown Component
const ModalDropdown = ({ label, value, options, onChange, placeholder = "Select..." }) => {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div style={{ marginBottom: '0px' }}> {/* Adjusted margin for flex layouts */}
            <label style={{ display: 'block', fontSize: '12px', fontWeight: 500, color: '#374151', marginBottom: '6px' }}>
                {label}
            </label>
            <div style={{ position: 'relative' }}>
                <button
                    onClick={(e) => { e.stopPropagation(); setIsOpen(!isOpen); }}
                    style={{
                        width: '100%', padding: '10px 12px', fontSize: '13px', textAlign: 'left',
                        backgroundColor: 'white', border: '1px solid #d1d5db', 
                        borderRadius: '6px', // 🟢 RADIUS 6px
                        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                        cursor: 'pointer', color: value ? '#111827' : '#9ca3af'
                    }}
                >
                    <span style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {value || placeholder}
                    </span>
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
                                    backgroundColor: 'white', 
                                    borderRadius: '6px', // 🟢 RADIUS 6px
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
    const [formData, setFormData] = useState({
        honorific: '',
        name: '',
        department: '',
        assignment: ''
        // Years removed
    });

    const honorificOptions = ['Mr.', 'Ms.'];
    
    const departmentOptions = [
        'Preschool',
        'Primary Education',
        'Intermediate',
        'Junior High School',
        'Senior High School',
    ];

    // 🟢 VALIDATION: Name AND Honorific are required
    const isFormValid = formData.name.trim().length > 0 && formData.honorific;

    const handleSubmit = () => {
        if (isFormValid) {
            onAdd(formData);
            setFormData({ honorific: '', name: '', department: '', assignment: '' });
            onClose();
        }
    };

    // 🟢 BUTTON STYLES
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
                    variants={overlayVariants}
                    initial="hidden" animate="visible" exit="exit"
                    onClick={onClose}
                    style={{ position: 'fixed', inset: 0, zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(2px)' }}
                >
                    <motion.div
                        variants={modalVariants}
                        onClick={(e) => e.stopPropagation()}
                        style={{ 
                            backgroundColor: 'white', 
                            borderRadius: '6px', // 🟢 RADIUS 6px
                            padding: '24px', width: '420px', // Slightly wider for the side-by-side inputs
                            boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)', position: 'relative', zIndex: 110 
                        }}
                    >
                        {/* Header */}
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                            <h3 style={{ fontSize: '18px', fontWeight: 600, color: '#111827', margin: 0 }}>Add New Teacher</h3>
                            <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#6b7280', padding: '4px' }}><X size={20} /></button>
                        </div>

                        {/* 🟢 NOTICE BOX */}
                        <div style={{ 
                            backgroundColor: '#eff6ff', border: '1px solid #dbeafe', 
                            borderRadius: '6px', padding: '12px', marginBottom: '20px',
                            display: 'flex', gap: '10px', alignItems: 'flex-start'
                        }}>
                            <Info size={16} className="text-blue-600 flex-shrink-0" style={{ marginTop: '2px' }} />
                            <p style={{ fontSize: '11px', color: '#1e40af', margin: 0, lineHeight: '1.4' }}>
                                Creating this new adviser will reflect in creating their new account with the <strong>name as their email</strong>, and <strong>EatsOnTapClassAdviser123</strong> as their default password. They will be forced to change their password upon entry.
                            </p>
                        </div>

                        {/* Form Row 1: Honorific + Name */}
                        <div style={{ display: 'flex', gap: '12px', marginBottom: '16px' }}>
                            <div style={{ flex: '0 0 90px' }}> {/* Fixed width for Honorific */}
                                <ModalDropdown 
                                    label="Title" 
                                    value={formData.honorific} 
                                    options={honorificOptions} 
                                    onChange={(val) => setFormData({...formData, honorific: val})} 
                                    placeholder="Title"
                                />
                            </div>
                            <div style={{ flex: 1 }}>
                                <label style={{ display: 'block', fontSize: '12px', fontWeight: 500, color: '#374151', marginBottom: '6px' }}>Teacher Name <span className="text-red-500">*</span></label>
                                <input 
                                    type="text" 
                                    placeholder="e.g. Maria Clara"
                                    value={formData.name}
                                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                                    style={{ 
                                        width: '100%', padding: '10px 12px', fontSize: '13px', 
                                        borderRadius: '6px', // 🟢 RADIUS 6px
                                        border: '1px solid #d1d5db', outline: 'none' 
                                    }}
                                />
                            </div>
                        </div>

                        {/* Form Row 2: Department */}
                        <div style={{ marginBottom: '16px' }}>
                            <ModalDropdown 
                                label="Department (Optional)" 
                                value={formData.department} 
                                options={departmentOptions} 
                                onChange={(val) => setFormData({...formData, department: val})} 
                            />
                        </div>

                        {/* Form Row 3: Assignment */}
                        <div style={{ marginBottom: '16px' }}>
                            <label style={{ display: 'block', fontSize: '12px', fontWeight: 500, color: '#374151', marginBottom: '6px' }}>Current Assignment (Optional)</label>
                            <input 
                                type="text" 
                                placeholder="e.g. Grade 1 Adviser"
                                value={formData.assignment}
                                onChange={(e) => setFormData({...formData, assignment: e.target.value})}
                                style={{ 
                                    width: '100%', padding: '10px 12px', fontSize: '13px', 
                                    borderRadius: '6px', // 🟢 RADIUS 6px
                                    border: '1px solid #d1d5db', outline: 'none' 
                                }}
                            />
                        </div>

                        {/* Actions */}
                        <div style={{ display: 'flex', gap: '12px', marginTop: '24px' }}>
                            <button 
                                onClick={onClose}
                                style={{ 
                                    flex: 1, padding: '10px', 
                                    borderRadius: '6px', // 🟢 RADIUS 6px
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
                                    flex: 1, padding: '10px', 
                                    borderRadius: '6px', // 🟢 RADIUS 6px
                                    fontSize: '13px', 
                                    transition: 'background-color 0.2s',
                                    // 🟢 DYNAMIC STYLES
                                    ...(isFormValid ? activeStyles : disabledStyles)
                                }}
                            >
                                Add Teacher
                            </button>
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export { AddAdviserModal };