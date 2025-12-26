// components/SelectionActionBar.jsx
import React from 'react';
import { motion } from 'framer-motion';
import { X, Archive, ChevronDown, TrendingUp, Eye } from 'lucide-react';

export const SelectionActionBar = ({ 
    selectedSection, 
    onClearSelection, 
    activeDropdown, 
    onToggleDropdown, 
    nextSections, 
    onViewStudents 
}) => {
    const styles = {
        actionBarContainer: {
            height: '100%', width: '100%', backgroundColor: '#4268BD', color: 'white',
            padding: '0 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            fontFamily: 'geist, sans-serif'
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
        dropdownMenu: {
            position: 'absolute', right: 0, marginTop: '8px', backgroundColor: 'white',
            borderRadius: '8px', boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
            overflow: 'hidden', zIndex: 50, color: '#1f2937', padding: '4px 0', minWidth: '160px'
        },
        dropdownItem: {
            width: '100%', textAlign: 'left', padding: '8px 16px', fontSize: '14px',
            backgroundColor: 'transparent', border: 'none', cursor: 'pointer', color: '#374151',
            transition: 'background-color 0.15s'
        },
        sectionLabel: {
            fontSize: '11px', fontWeight: 600, color: '#9ca3af', textTransform: 'uppercase',
            letterSpacing: '0.05em', padding: '8px 16px'
        }
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
                    {selectedSection.level} - {selectedSection.sectionName} Selected
                </span>
            </div>

            <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                <div style={{ position: 'relative' }}>
                    <button 
                        onClick={(e) => { e.stopPropagation(); onToggleDropdown('archive'); }}
                        style={styles.ghostButton}
                        onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.2)'}
                        onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.1)'}
                    >
                        <Archive size={16} /> Archive <ChevronDown size={14} />
                    </button>
                    {activeDropdown === 'archive' && (
                        <div style={styles.dropdownMenu}>
                            <button style={styles.dropdownItem} onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f3f4f6'} onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}>
                                Graduate
                            </button>
                        </div>
                    )}
                </div>

                <div style={{ position: 'relative' }}>
                    <button 
                        onClick={(e) => { e.stopPropagation(); onToggleDropdown('advance'); }}
                        style={styles.ghostButton}
                        onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.2)'}
                        onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.1)'}
                    >
                        <TrendingUp size={16} /> Advance <ChevronDown size={14} />
                    </button>
                    {activeDropdown === 'advance' && (
                        <div style={{ ...styles.dropdownMenu, minWidth: '192px', maxHeight: '240px', overflowY: 'auto' }}>
                            <div style={styles.sectionLabel}>Move to Next Level</div>
                            {nextSections.length > 0 ? (
                                nextSections.map((sect, idx) => (
                                    <button key={idx} style={styles.dropdownItem} onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f3f4f6'} onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}>
                                        {sect.name}
                                    </button>
                                ))
                            ) : (
                                <div style={{ padding: '8px 16px', fontSize: '12px', color: '#9ca3af', fontStyle: 'italic' }}>No next level found</div>
                            )}
                        </div>
                    )}
                </div>

                <button 
                    onClick={onViewStudents}
                    style={styles.primaryButton}
                    onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f9fafb'}
                    onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'white'}
                >
                    <Eye size={16} /> View Students
                </button>
            </div>
        </motion.div>
    );
};