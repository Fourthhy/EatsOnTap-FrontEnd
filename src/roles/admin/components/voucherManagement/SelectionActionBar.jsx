import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { archiveStudent } from "../../../../functions/admin/archiveStudent";
import { X, Archive, ChevronDown, Eye, Edit, Save, UserPlus, CheckCircle, CalendarClock, AlertTriangle, Loader2, XCircle } from 'lucide-react';

export const SelectionActionBar = ({
    selectedItem,
    variant = 'section',
    isEditing = false,

    // Common
    onClearSelection,

    // Section Specific
    onViewStudents,

    // Program Specific
    onEditSchedule,

    // Student Specific (Edit Mode)
    activeDropdown,
    onToggleDropdown,
    onEditStudent,
    onSaveStudent,
    onCancelEdit,
    onArchiveOption,

    // Promotion / Graduation Specific
    selectedCount = 0,
    onAssignStudents,
    onSavePromotion,
    onCancelPromotion
}) => {
    const [internalDropdown, setInternalDropdown] = useState(null);
    
    // 🟢 MODAL STATES
    const [showArchiveModal, setShowArchiveModal] = useState(false);
    const [archiveStatus, setArchiveStatus] = useState('idle'); // 'idle', 'loading', 'success', 'error'
    const [archiveMessage, setArchiveMessage] = useState('');

    const isControlled = activeDropdown !== undefined;
    const currentDropdown = isControlled ? activeDropdown : internalDropdown;

    const handleToggle = (menu) => {
        if (isControlled && onToggleDropdown) {
            onToggleDropdown(menu);
        } else {
            setInternalDropdown(prev => prev === menu ? null : menu);
        }
    };

    const handleArchiveClick = (e) => {
        e.stopPropagation();
        if (!selectedItem) return;
        setArchiveStatus('idle');
        setArchiveMessage('');
        setShowArchiveModal(true);
    };

    // 🟢 HANDLE CLOSING & CLEANUP
    const handleCloseModal = () => {
        setShowArchiveModal(false);
        // Only clear selection if the archive was successful
        if (archiveStatus === 'success' && onClearSelection) {
            onClearSelection(); 
        }
        // Reset status after animation completes
        setTimeout(() => setArchiveStatus('idle'), 300);
    };

    // 🟢 API CALL WITH MODAL STATE UPDATES
    const confirmArchiveStudent = async () => {
        setArchiveStatus('loading');       
        const targetId = selectedItem._id || selectedItem.id;

        try {
            const response = await archiveStudent({ id: targetId });

            if (response && response.success) {
                setArchiveStatus('success');
                setArchiveMessage("Student successfully archived.");
            } else {
                setArchiveStatus('error');
                setArchiveMessage(response?.message || "Failed to archive student.");
            }
        } catch (error) {
            console.error("Archive error:", error);
            setArchiveStatus('error');
            setArchiveMessage("An error occurred while archiving the student.");
        }
    };

    const styles = {
        actionBarContainer: {
            height: '100%', width: '100%', backgroundColor: '#4268BD', color: 'white',
            padding: '0 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            fontFamily: 'geist, sans-serif',
            zIndex: 8000,
            position: 'relative'
        },
        primaryButton: {
            backgroundColor: 'white', color: '#4268BD', padding: '8px 16px',
            borderRadius: '8px', fontSize: '13px', fontWeight: 600, border: 'none', cursor: 'pointer',
            display: 'flex', alignItems: 'center', gap: '8px', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
        },
        whiteButton: {
            backgroundColor: 'white', color: '#EF4444', padding: '8px 16px',
            borderRadius: '8px', fontSize: '13px', fontWeight: 600, border: 'none', cursor: 'pointer',
            display: 'flex', alignItems: 'center', gap: '8px', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
        },
        saveButton: {
            backgroundColor: '#10B981', color: 'white', padding: '8px 16px',
            borderRadius: '8px', fontSize: '13px', fontWeight: 600, border: 'none', cursor: 'pointer',
            display: 'flex', alignItems: 'center', gap: '8px', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
        },
        cancelButton: {
            backgroundColor: 'white', color: '#EF4444', padding: '8px 16px',
            borderRadius: '8px', fontSize: '13px', fontWeight: 600, border: 'none', cursor: 'pointer',
            display: 'flex', alignItems: 'center', gap: '8px', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
        },
        dropdownMenu: {
            position: 'absolute', right: 0, top: '100%', marginTop: '8px', 
            backgroundColor: 'white', borderRadius: '8px',
            boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
            overflow: 'hidden', zIndex: 8001, color: '#1f2937', padding: '4px 0', minWidth: '160px'
        },
        dropdownItem: {
            width: '100%', textAlign: 'left', padding: '10px 16px', fontSize: '13px',
            backgroundColor: 'transparent', border: 'none', cursor: 'pointer', color: '#374151',
            transition: 'background-color 0.15s'
        },
        disabledButton: {
            opacity: 0.5, cursor: 'not-allowed', backgroundColor: 'rgba(255,255,255,0.8)', color: '#EF4444',
            padding: '8px 16px', borderRadius: '8px', fontSize: '13px', fontWeight: 600, border: 'none',
            display: 'flex', alignItems: 'center', gap: '8px'
        }
    };

    const renderArchiveDropdown = () => (
        <div style={{ position: 'relative' }}>
            <button
                onClick={(e) => { e.stopPropagation(); handleToggle('archive'); }}
                style={styles.whiteButton}
            >
                <Archive size={16} /> Archive <ChevronDown size={14} />
            </button>
            {currentDropdown === 'archive' && (
                <div style={styles.dropdownMenu}>
                    {['Graduate', 'Transfer', 'Drop'].map(opt => (
                        <button
                            key={opt}
                            style={styles.dropdownItem}
                            onClick={(e) => {
                                e.stopPropagation();
                                if (onArchiveOption) onArchiveOption(opt);
                                handleToggle(null);
                            }}
                            onMouseEnter={(e) => e.target.style.backgroundColor = '#F3F4F6'}
                            onMouseLeave={(e) => e.target.style.backgroundColor = 'transparent'}
                        >
                            {opt}
                        </button>
                    ))}
                </div>
            )}
        </div>
    );

    const renderActions = () => {
        if (variant === 'program') {
            return (
                <button onClick={onEditSchedule} style={styles.primaryButton}>
                    <CalendarClock size={16} /> Edit Schedule
                </button>
            );
        }

        if (isEditing) {
            return (
                <>
                    <button style={styles.cancelButton} onClick={onCancelEdit}>
                        <X size={16} /> Cancel
                    </button>
                    <button style={styles.saveButton} onClick={onSaveStudent}>
                        <Save size={16} /> Save Changes
                    </button>
                </>
            );
        }

        if (variant === 'promotion') {
            return (
                <>
                    <button
                        style={selectedCount === 0 ? styles.disabledButton : styles.primaryButton}
                        onClick={selectedCount > 0 ? onAssignStudents : undefined}
                    >
                        <UserPlus size={16} /> Assign
                    </button>
                    <button style={styles.saveButton} onClick={onSavePromotion}>
                        <CheckCircle size={16} /> Save
                    </button>
                </>
            );
        }

        if (variant === 'graduation') {
            return (
                <>
                    {renderArchiveDropdown()}
                    <button style={styles.cancelButton} onClick={onCancelPromotion}>
                        <X size={16} /> Cancel
                    </button>
                </>
            );
        }

        if (variant === 'section' || variant === 'adviser') {
            return (
                <>
                    {renderArchiveDropdown()}
                    {variant === 'section' && (
                        <button onClick={onViewStudents} style={styles.primaryButton}>
                            <Eye size={16} /> View Students
                        </button>
                    )}
                </>
            );
        }

        if (variant === 'student') {
            return (
                <>
                    <button
                        onClick={handleArchiveClick}
                        style={archiveStatus === 'loading' ? styles.disabledButton : styles.whiteButton}
                        disabled={archiveStatus === 'loading'}
                    >
                        <Archive size={16} /> Archive
                    </button>
                    <button onClick={onEditStudent} style={styles.primaryButton}>
                        <Edit size={16} /> Edit
                    </button>
                </>
            );
        }
    };

    const getLabel = () => {
        if (variant === 'promotion' || variant === 'graduation') return `${selectedCount} Students Selected`;
        if (variant === 'section') return `${selectedItem?.level || ''} - ${selectedItem?.sectionName || ''}`;
        if (variant === 'program') return `${selectedItem?.programName} (${selectedItem?.year} Year)`;
        if (variant === 'student') return selectedItem?.name || 'Student';
        if (variant === 'adviser') return selectedItem?.name || 'Adviser';
        return 'Item Selected';
    };

    return (
        <>
            <motion.div
                key="action-bar"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
                transition={{ type: "spring", stiffness: 300, damping: 25 }}
                style={styles.actionBarContainer}
            >
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                    <button onClick={onClearSelection} style={{ padding: '8px', borderRadius: '50%', background: 'transparent', border: 'none', cursor: 'pointer', color: 'white', display: 'flex' }}>
                        <X size={20} />
                    </button>
                    <span style={{ fontWeight: 500, fontSize: '14px' }}>
                        {getLabel()}
                    </span>
                </div>

                <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                    {renderActions()}
                </div>
            </motion.div>

            {/* 🟢 CUSTOM CONFIRMATION MODAL WITH MULTI-STATE */}
            <AnimatePresence>
                {showArchiveModal && (
                    <motion.div 
                        initial={{ opacity: 0 }} 
                        animate={{ opacity: 1 }} 
                        exit={{ opacity: 0 }} 
                        className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/50 backdrop-blur-sm"
                        onClick={archiveStatus === 'loading' ? undefined : handleCloseModal} // Prevent close while loading
                    >
                        <motion.div 
                            initial={{ scale: 0.95, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.95, opacity: 0 }}
                            className="bg-white rounded-xl shadow-2xl w-full max-w-md flex flex-col justify-center"
                            onClick={(e) => e.stopPropagation()}
                            style={{ fontFamily: 'geist, sans-serif', padding: '24px', margin: '0 16px', minHeight: '220px' }}
                        >
                            
                            <AnimatePresence mode="wait">
                                {/* STATE 1: IDLE / CONFIRMATION */}
                                {archiveStatus === 'idle' && (
                                    <motion.div key="confirm" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                                        <div className="flex items-center gap-4" style={{ marginBottom: '16px' }}>
                                            <div className="bg-red-100 rounded-full text-red-600" style={{ padding: '12px' }}>
                                                <AlertTriangle size={24} />
                                            </div>
                                            <h2 className="text-xl font-bold text-gray-900">Archive Student?</h2>
                                        </div>
                                        
                                        <p className="text-gray-600" style={{ marginBottom: '8px' }}>
                                            You are about to archive <strong>{selectedItem?.name || 'this student'}</strong>.
                                        </p>
                                        <p className="text-sm text-red-600 bg-red-50 rounded-lg border border-red-100 font-medium" style={{ padding: '12px', marginBottom: '24px' }}>
                                            Warning: This action will move the student to the archive database and remove them from active rosters. <strong>No undo is possible.</strong>
                                        </p>

                                        <div className="flex justify-end gap-3" style={{ marginTop: '24px' }}>
                                            <button 
                                                onClick={handleCloseModal}
                                                className="text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
                                                style={{ padding: '8px 16px', border: 'none', cursor: 'pointer' }}
                                            >
                                                Cancel
                                            </button>
                                            <button 
                                                onClick={confirmArchiveStudent}
                                                className="text-sm font-medium text-white bg-red-600 hover:bg-red-700 rounded-lg shadow-sm transition-colors flex items-center gap-2"
                                                style={{ padding: '8px 16px', border: 'none', cursor: 'pointer' }}
                                            >
                                                <Archive size={16} />
                                                Confirm Archive
                                            </button>
                                        </div>
                                    </motion.div>
                                )}

                                {/* STATE 2: LOADING */}
                                {archiveStatus === 'loading' && (
                                    <motion.div key="loading" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex flex-col items-center justify-center py-6" style={{ gap: '16px' }}>
                                        <Loader2 size={40} className="animate-spin text-blue-500" />
                                        <p className="text-gray-600 font-medium">Archiving student record...</p>
                                    </motion.div>
                                )}

                                {/* STATE 3: SUCCESS */}
                                {archiveStatus === 'success' && (
                                    <motion.div key="success" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} className="flex flex-col items-center justify-center text-center">
                                        <div className="bg-green-100 text-green-600 rounded-full" style={{ padding: '16px', marginBottom: '16px' }}>
                                            <CheckCircle size={40} />
                                        </div>
                                        <h2 className="text-xl font-bold text-gray-900" style={{ marginBottom: '8px' }}>Success!</h2>
                                        <p className="text-gray-600" style={{ marginBottom: '24px' }}>{archiveMessage}</p>
                                        
                                        <button 
                                            onClick={handleCloseModal}
                                            className="w-full text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors"
                                            style={{ padding: '10px', border: 'none', cursor: 'pointer' }}
                                        >
                                            Done
                                        </button>
                                    </motion.div>
                                )}

                                {/* STATE 4: ERROR */}
                                {archiveStatus === 'error' && (
                                    <motion.div key="error" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} className="flex flex-col items-center justify-center text-center">
                                        <div className="bg-red-100 text-red-600 rounded-full" style={{ padding: '16px', marginBottom: '16px' }}>
                                            <XCircle size={40} />
                                        </div>
                                        <h2 className="text-xl font-bold text-gray-900" style={{ marginBottom: '8px' }}>Error</h2>
                                        <p className="text-gray-600" style={{ marginBottom: '24px' }}>{archiveMessage}</p>
                                        
                                        <div className="flex gap-3 w-full">
                                            <button 
                                                onClick={handleCloseModal}
                                                className="flex-1 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
                                                style={{ padding: '10px', border: 'none', cursor: 'pointer' }}
                                            >
                                                Cancel
                                            </button>
                                            <button 
                                                onClick={() => setArchiveStatus('idle')} // Go back to confirm screen
                                                className="flex-1 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors"
                                                style={{ padding: '10px', border: 'none', cursor: 'pointer' }}
                                            >
                                                Try Again
                                            </button>
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>

                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
};