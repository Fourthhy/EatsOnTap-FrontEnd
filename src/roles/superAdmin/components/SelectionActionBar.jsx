// components/SelectionActionBar.jsx
import React from 'react';
import { motion } from 'framer-motion';
import { 
    X, Archive, ChevronDown, Eye, Edit, Save, 
    UserPlus, CheckCircle, CalendarClock, RotateCcw 
} from 'lucide-react';

export const SelectionActionBar = ({ 
    selectedItem, 
    variant = 'section', // Options: 'section', 'student', 'promotion', 'graduation', 'program', 'user'
    isEditing = false,
    
    // Common
    onClearSelection, 
    
    // Section Specific
    onViewStudents,

    // Program Specific
    onEditSchedule,

    // User Management Specific (🟢 NEW)
    onEditUser,
    onResetPassword,

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
    const styles = {
        actionBarContainer: {
            height: '100%', width: '100%', backgroundColor: '#4268BD', color: 'white',
            padding: '0 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            fontFamily: 'geist, sans-serif',
            zIndex: 8000, 
            position: 'relative' 
        },
        ghostButton: {
            backgroundColor: 'rgba(255, 255, 255, 0.1)', color: 'white', padding: '8px 16px',
            borderRadius: '8px', fontSize: '13px', fontWeight: 500, border: 'none', cursor: 'pointer',
            display: 'flex', alignItems: 'center', gap: '8px', transition: 'background-color 0.2s'
        },
        primaryButton: {
            backgroundColor: 'white', color: '#4268BD', padding: '8px 16px',
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
            position: 'absolute', right: 0, marginTop: '8px', backgroundColor: 'white',
            borderRadius: '8px', boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
            overflow: 'hidden', zIndex: 8001,
            color: '#1f2937', padding: '4px 0', minWidth: '160px'
        },
        dropdownItem: {
            width: '100%', textAlign: 'left', padding: '8px 16px', fontSize: '14px',
            backgroundColor: 'transparent', border: 'none', cursor: 'pointer', color: '#374151',
            transition: 'background-color 0.15s'
        },
        disabledButton: {
            opacity: 0.5, cursor: 'not-allowed', backgroundColor: 'rgba(255,255,255,0.5)', color: '#4268BD',
            padding: '8px 16px', borderRadius: '8px', fontSize: '13px', fontWeight: 600, border: 'none',
            display: 'flex', alignItems: 'center', gap: '8px'
        }
    };

    const renderActions = () => {
        // --- 🟢 USER MODE ---
        if (variant === 'user') {
            return (
                <>
                    <button onClick={onEditUser} style={styles.primaryButton}>
                        <Edit size={16} /> Edit
                    </button>
                    <button onClick={onResetPassword} style={styles.primaryButton}>
                        <RotateCcw size={16} /> Reset Password
                    </button>
                </>
            );
        }

        // --- PROGRAM MODE ---
        if (variant === 'program') {
            return (
                <button onClick={onEditSchedule} style={styles.primaryButton}>
                    <CalendarClock size={16} /> Edit Schedule
                </button>
            );
        }

        // --- EDIT MODE ---
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

        // --- PROMOTION MODE ---
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

        // --- GRADUATION MODE ---
        if (variant === 'graduation') {
            return (
                <>
                    <div style={{ position: 'relative' }}>
                        <button 
                            onClick={(e) => { e.stopPropagation(); onToggleDropdown('archive'); }}
                            style={styles.ghostButton}
                        >
                            <Archive size={16} /> Archive <ChevronDown size={14} />
                        </button>
                        {activeDropdown === 'archive' && (
                            <div style={styles.dropdownMenu}>
                                {['Graduate', 'Transfer', 'Drop'].map(opt => (
                                    <button key={opt} style={styles.dropdownItem} onClick={() => onArchiveOption(opt)}>
                                        {opt}
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>
                    <button style={styles.cancelButton} onClick={onCancelPromotion}>
                        <X size={16} /> Cancel
                    </button>
                </>
            );
        }

        // --- SECTION VIEW ---
        if (variant === 'section') {
            return (
                <button onClick={onViewStudents} style={styles.primaryButton}>
                    <Eye size={16} /> View Students
                </button>
            );
        }

        // --- STUDENT VIEW ---
        if (variant === 'student') {
            return (
                <>
                    <div style={{ position: 'relative' }}>
                        <button 
                            onClick={(e) => { e.stopPropagation(); onToggleDropdown('archive'); }}
                            style={styles.ghostButton}
                        >
                            <Archive size={16} /> Archive <ChevronDown size={14} />
                        </button>
                        {activeDropdown === 'archive' && (
                            <div style={styles.dropdownMenu}>
                                {['Graduate', 'Transfer', 'Drop'].map(opt => (
                                    <button key={opt} style={styles.dropdownItem} onClick={() => onArchiveOption(opt)}>
                                        {opt}
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>

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
        
        // 🟢 User Label
        if (variant === 'user') return `${selectedItem?.first_name} ${selectedItem?.last_name}`;
        
        if (variant === 'student') return selectedItem?.name || 'Student';
        return 'Item Selected';
    };

    return (
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
    );
};