import React, { useState } from 'react';
import { X } from 'lucide-react';
import { motion } from 'framer-motion';

export const PromotionModal = ({ isOpen, onClose, onSelectType, nextSections, onBulkPromote }) => {
    if (!isOpen) return null;

    const [selectedBulkSection, setSelectedBulkSection] = useState(null);

    return (
        <div style={{ position: 'fixed', inset: 0, zIndex: 60, display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: 'rgba(0,0,0,0.5)' }}>
            <motion.div 
                initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
                style={{ backgroundColor: 'white', borderRadius: '12px', padding: '24px', width: '400px', maxWidth: '90%', boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)' }}
            >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                    <h3 style={{ fontSize: '18px', fontWeight: 600, color: '#111827', margin: 0 }}>Promote Students</h3>
                    <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#6b7280' }}><X size={20} /></button>
                </div>

                {!selectedBulkSection ? (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                        <p style={{ fontSize: '14px', color: '#6b7280', marginBottom: '8px' }}>Choose how you want to promote these students:</p>
                        
                        <button 
                            onClick={() => setSelectedBulkSection('selecting')} 
                            style={{ padding: '16px', borderRadius: '8px', border: '1px solid #e5e7eb', backgroundColor: '#f9fafb', textAlign: 'left', cursor: 'pointer', transition: 'all 0.2s' }}
                            onMouseEnter={(e) => e.currentTarget.style.borderColor = '#4268BD'} onMouseLeave={(e) => e.currentTarget.style.borderColor = '#e5e7eb'}
                        >
                            <div style={{ fontWeight: 600, fontSize: '14px', color: '#111827', marginBottom: '4px' }}>Bulk Promote (All)</div>
                            <div style={{ fontSize: '12px', color: '#6b7280' }}>Move everyone to the same section in the next level.</div>
                        </button>

                        <button 
                            onClick={() => onSelectType('individual')}
                            style={{ padding: '16px', borderRadius: '8px', border: '1px solid #e5e7eb', backgroundColor: 'white', textAlign: 'left', cursor: 'pointer', transition: 'all 0.2s' }}
                            onMouseEnter={(e) => e.currentTarget.style.borderColor = '#4268BD'} onMouseLeave={(e) => e.currentTarget.style.borderColor = '#e5e7eb'}
                        >
                            <div style={{ fontWeight: 600, fontSize: '14px', color: '#111827', marginBottom: '4px' }}>Individual Select</div>
                            <div style={{ fontSize: '12px', color: '#6b7280' }}>Manually pick students and assign them to specific sections.</div>
                        </button>
                    </div>
                ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                        <p style={{ fontSize: '14px', color: '#6b7280' }}>Select destination section:</p>
                        <div style={{ maxHeight: '200px', overflowY: 'auto', border: '1px solid #e5e7eb', borderRadius: '8px' }}>
                            {nextSections.length > 0 ? nextSections.map((sect, idx) => (
                                <button 
                                    key={idx}
                                    onClick={() => onBulkPromote(sect.name)}
                                    style={{ width: '100%', padding: '12px', textAlign: 'left', background: 'white', borderBottom: '1px solid #f3f4f6', cursor: 'pointer', fontSize: '13px' }}
                                >
                                    {sect.name}
                                </button>
                            )) : <div style={{ padding: '12px', fontSize: '13px', color: '#9ca3af' }}>No available sections</div>}
                        </div>
                        <button onClick={() => setSelectedBulkSection(null)} style={{ fontSize: '13px', color: '#6b7280', background: 'none', border: 'none', cursor: 'pointer', alignSelf: 'flex-start', marginTop: '8px' }}>Back</button>
                    </div>
                )}
            </motion.div>
        </div>
    );
};

export const AssignmentModal = ({ isOpen, onClose, nextSections, onConfirm }) => {
    if (!isOpen) return null;
    return (
        <div style={{ position: 'fixed', inset: 0, zIndex: 70, display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: 'rgba(0,0,0,0.5)' }}>
            <motion.div 
                initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
                style={{ backgroundColor: 'white', borderRadius: '12px', padding: '24px', width: '350px', boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)' }}
            >
                <h3 style={{ fontSize: '16px', fontWeight: 600, marginBottom: '16px' }}>Assign Section</h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    {nextSections.map((sect, idx) => (
                        <button 
                            key={idx}
                            onClick={() => onConfirm(sect.name)}
                            style={{ padding: '10px', borderRadius: '6px', border: '1px solid #e5e7eb', background: 'white', cursor: 'pointer', textAlign: 'left', fontSize: '13px' }}
                            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f9fafb'}
                            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'white'}
                        >
                            {sect.name}
                        </button>
                    ))}
                </div>
                <button onClick={onClose} style={{ marginTop: '16px', width: '100%', padding: '8px', background: '#f3f4f6', border: 'none', borderRadius: '6px', cursor: 'pointer' }}>Cancel</button>
            </motion.div>
        </div>
    );
};