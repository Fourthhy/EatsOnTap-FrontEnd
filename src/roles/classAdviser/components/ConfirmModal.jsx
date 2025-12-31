import React from 'react';
import { motion, AnimatePresence } from "framer-motion";
import { MessageCircleWarning } from "lucide-react";

const ConfirmModal = ({ visible, onCancel, onConfirm }) => {
    
    // Animation Variants
    const overlayVariants = { hidden: { opacity: 0 }, visible: { opacity: 1 }, exit: { opacity: 0 } };
    const modalVariants = { hidden: { opacity: 0, scale: 0.95, y: 20 }, visible: { opacity: 1, scale: 1, y: 0 }, exit: { opacity: 0, scale: 0.95, y: 20 } };

    // Button Styles
    const activeStyles = { 
        background: 'linear-gradient(to right, #4268BD, #3F6AC9)', 
        cursor: 'pointer', fontWeight: '600', color: 'white', border: 'none',
        flex: 1, padding: '10px 16px', borderRadius: '6px', fontSize: '14px',
        transition: 'opacity 0.2s'
    };

    const cancelStyles = {
        backgroundColor: 'white', border: '1px solid #d1d5db', color: '#374151', 
        cursor: 'pointer', fontWeight: '500', 
        flex: 1, padding: '10px 16px', borderRadius: '6px', fontSize: '14px',
        transition: 'background-color 0.2s'
    };

    return (
        <AnimatePresence>
            {visible && (
                <motion.div
                    variants={overlayVariants}
                    initial="hidden" animate="visible" exit="exit"
                    style={{
                        position: 'fixed', inset: 0, zIndex: 9000,
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        backgroundColor: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(4px)'
                    }}
                    onClick={onCancel}
                >
                    <motion.div
                        variants={modalVariants}
                        onClick={(e) => e.stopPropagation()}
                        style={{
                            backgroundColor: 'white', borderRadius: '12px',
                            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
                            padding: '24px', width: '90vw', maxWidth: '384px',
                            position: 'relative'
                        }}
                    >
                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', gap: '16px' }}>
                            {/* Icon Bubble */}
                            <div style={{
                                width: '48px', height: '48px', backgroundColor: '#eff6ff', 
                                borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center'
                            }}>
                                <MessageCircleWarning size={24} color="#2563eb" />
                            </div>

                            {/* Text Content */}
                            <div>
                                <h3 style={{ fontSize: '1.125rem', fontWeight: 600, color: '#111827', margin: 0 }}>
                                    Confirm Submission
                                </h3>
                                <p style={{ fontSize: '0.875rem', color: '#6b7280', marginTop: '4px', lineHeight: '1.5' }}>
                                    Are you sure you want to submit the meal list for this section? This action cannot be undone.
                                </p>
                            </div>

                            {/* Actions */}
                            <div style={{ display: 'flex', gap: '12px', width: '100%', marginTop: '8px' }}>
                                <button
                                    onClick={onCancel}
                                    style={cancelStyles}
                                    onMouseEnter={(e) => e.target.style.backgroundColor = '#f9fafb'}
                                    onMouseLeave={(e) => e.target.style.backgroundColor = 'white'}
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={onConfirm}
                                    style={activeStyles}
                                    onMouseEnter={(e) => e.target.style.opacity = '0.9'}
                                    onMouseLeave={(e) => e.target.style.opacity = '1'}
                                >
                                    Confirm
                                </button>
                            </div>
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export { ConfirmModal };