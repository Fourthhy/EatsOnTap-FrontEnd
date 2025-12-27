import React from 'react';
import { motion } from 'framer-motion';
import { X, Check, Trash2 } from 'lucide-react';

export const MealOrdersActionBar = ({ selectedCount, totalCount, onDeselectAll, onSelectAll, onApprove, onReject }) => {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
            style={{
                height: '100%', width: '100%', backgroundColor: '#4268BD', color: 'white',
                padding: '0 24px', display: 'flex', flexDirection: 'column', justifyContent: 'center'
            }}
        >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                    <button onClick={onDeselectAll} style={{ padding: '8px', borderRadius: '50%', background: 'transparent', border: 'none', cursor: 'pointer', color: 'white', display: 'flex', alignItems: 'center', zIndex: 1000 }}>
                        <X size={20} />
                    </button>

                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
                        <span style={{ fontWeight: 500, fontSize: 14 }}>{selectedCount} Selected</span>
                        {selectedCount < totalCount ? (
                            <button
                                onClick={onSelectAll}
                                className="hover:text-blue-200 transition-colors"
                                style={{
                                    color: '#dbeafe', fontSize: '12px', background: 'none', border: 'none',
                                    padding: 0, cursor: 'pointer', textDecoration: 'underline', textAlign: 'left'
                                }}
                            >
                                Select all {totalCount} items
                            </button>
                        ) : (
                            <span style={{ color: '#dbeafe', fontSize: '12px' }}>All items selected</span>
                        )}
                    </div>
                </div>

                <div style={{ display: 'flex', gap: '12px' }}>
                    <button onClick={onApprove} style={{ backgroundColor: '#10B981', color: 'white', padding: '8px 16px', borderRadius: '8px', fontSize: '14px', fontWeight: 600, border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', boxShadow: '0 1px 2px 0 rgba(0,0,0,0.05)' }}>
                        <Check size={16} /> Approve
                    </button>
                    <button onClick={onReject} style={{ backgroundColor: 'white', color: '#EF4444', padding: '8px 16px', borderRadius: '8px', fontSize: '14px', fontWeight: 600, border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', boxShadow: '0 1px 2px 0 rgba(0,0,0,0.05)' }}>
                        <Trash2 size={16} /> Reject
                    </button>
                </div>
            </div>
        </motion.div>
    );
};