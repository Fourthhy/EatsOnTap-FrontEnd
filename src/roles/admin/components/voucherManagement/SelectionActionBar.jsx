import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { X, Archive, ChevronDown, Eye, Edit, Save, UserPlus, CheckCircle, CalendarClock } from 'lucide-react';

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
    // 🟢 LOCAL STATE: Fallback if parent doesn't control dropdowns
    const [internalDropdown, setInternalDropdown] = useState(null);

    // Helper to determine which state to use
    const isControlled = activeDropdown !== undefined;
    const currentDropdown = isControlled ? activeDropdown : internalDropdown;

    const handleToggle = (menu) => {
        if (isControlled && onToggleDropdown) {
            onToggleDropdown(menu);
        } else {
            setInternalDropdown(prev => prev === menu ? null : menu);
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
        // 🟢 UPDATED: Aligns dropdown below the button
        dropdownMenu: {
            position: 'absolute',
            right: 0,
            top: '100%', // Positions top edge of menu at bottom edge of button
            marginTop: '8px', // Adds spacing between button and menu
            backgroundColor: 'white',
            borderRadius: '8px',
            boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
            overflow: 'hidden',
            zIndex: 8001,
            color: '#1f2937',
            padding: '4px 0',
            minWidth: '160px'
        },
        dropdownItem: {
            width: '100%', textAlign: 'left', padding: '10px 16px', fontSize: '13px',
            backgroundColor: 'transparent', border: 'none', cursor: 'pointer', color: '#374151',
            transition: 'background-color 0.15s'
        },
        disabledButton: {
            opacity: 0.5, cursor: 'not-allowed', backgroundColor: 'rgba(255,255,255,0.5)', color: '#4268BD',
            padding: '8px 16px', borderRadius: '8px', fontSize: '13px', fontWeight: 600, border: 'none',
            display: 'flex', alignItems: 'center', gap: '8px'
        }
    };

    // Shared Archive Dropdown JSX
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
                                handleToggle(null); // Close after click
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
        // --- 1. PROGRAM MODE ---
        if (variant === 'program') {
            return (
                <button onClick={onEditSchedule} style={styles.primaryButton}>
                    <CalendarClock size={16} /> Edit Schedule
                </button>
            );
        }

        // --- 2. EDIT MODE ---
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

        // --- 3. PROMOTION MODE ---
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

        // --- 4. GRADUATION MODE ---
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

        // --- 5. SECTION & ADVISER VIEW ---
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

        // --- 6. STUDENT VIEW ---
        if (variant === 'student') {
            return (
                <>
                    {/* {renderArchiveDropdown()} */}
                    <button
                        onClick={(e) => { e.stopPropagation(); handleToggle('archive'); }}
                        style={styles.whiteButton}
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