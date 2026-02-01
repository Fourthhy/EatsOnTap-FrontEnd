// components/system/ReasonInputModal.jsx
import React, { useState } from 'react';
import { X, Unlock } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export const ReasonInputModal = ({ isOpen, onClose, onConfirm }) => {
    const [reason, setReason] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        if (reason.trim().length > 0) {
            onConfirm(reason);
            setReason(''); // Reset
        }
    };

    if (!isOpen) return null;

    return (
        <AnimatePresence>
            <div style={{ position: 'fixed', inset: 0, zIndex: 9900, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <div 
                    onClick={onClose} 
                    style={{ position: 'absolute', inset: 0, backgroundColor: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(2px)' }} 
                />
                
                <motion.div 
                    initial={{ scale: 0.95, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.95, opacity: 0 }}
                    style={{ 
                        backgroundColor: 'white', borderRadius: '12px', padding: '24px', width: '100%', maxWidth: '400px', 
                        zIndex: 10, boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1)', fontFamily: "'Geist', sans-serif"
                    }}
                >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                        <h3 style={{ fontSize: '18px', fontWeight: '700', color: '#1F2937', display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <Unlock size={20} className="text-blue-600" /> Unlock Controls
                        </h3>
                        <button onClick={onClose} style={{ border: 'none', background: 'none', cursor: 'pointer', color: '#9CA3AF' }}><X size={20}/></button>
                    </div>

                    <p style={{ fontSize: '14px', color: '#6B7280', marginBottom: '16px' }}>
                        Please provide a reason for accessing the system deactivation controls. This action will be logged.
                    </p>

                    <form onSubmit={handleSubmit}>
                        <textarea 
                            value={reason}
                            onChange={(e) => setReason(e.target.value)}
                            placeholder="Reason for access..."
                            required
                            style={{ 
                                width: '100%', minHeight: '80px', padding: '10px', borderRadius: '8px', 
                                border: '1px solid #E5E7EB', fontSize: '14px', marginBottom: '16px', outline: 'none'
                            }}
                        />
                        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
                            <button type="button" onClick={onClose} style={{ padding: '8px 16px', borderRadius: '6px', border: 'none', background: '#F3F4F6', color: '#4B5563', cursor: 'pointer', fontSize: '14px', fontWeight: 500 }}>Cancel</button>
                            <button 
                                type="submit" 
                                disabled={reason.trim().length === 0}
                                style={{ 
                                    padding: '8px 16px', borderRadius: '6px', border: 'none', 
                                    background: reason.trim().length > 0 ? '#2563EB' : '#93C5FD', 
                                    color: 'white', cursor: reason.trim().length > 0 ? 'pointer' : 'not-allowed', 
                                    fontSize: '14px', fontWeight: 500 
                                }}
                            >
                                Unlock
                            </button>
                        </div>
                    </form>
                </motion.div>
            </div>
        </AnimatePresence>
    );
};