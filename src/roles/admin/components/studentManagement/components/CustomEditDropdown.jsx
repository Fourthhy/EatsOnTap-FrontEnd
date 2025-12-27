import React, { useState } from 'react';
import { Check, ChevronDown } from 'lucide-react';

export const CustomEditDropdown = ({ value, options, onChange, placeholder = "Select" }) => {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div style={{ position: 'relative', width: '100%' }}>
            <button 
                onClick={(e) => { e.stopPropagation(); setIsOpen(!isOpen); }}
                style={{
                    width: '100%', padding: '6px 12px', fontSize: '12px', textAlign: 'left',
                    backgroundColor: 'white', border: '1px solid #e5e7eb', borderRadius: '6px',
                    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                    cursor: 'pointer', color: value ? '#111827' : '#9ca3af'
                }}
            >
                <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {value || placeholder}
                </span>
                <ChevronDown size={12} className="text-gray-400" />
            </button>

            {isOpen && (
                <>
                    <div 
                        style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, zIndex: 40 }} 
                        onClick={(e) => { e.stopPropagation(); setIsOpen(false); }}
                    />
                    
                    <div style={{
                        position: 'absolute', top: '100%', left: 0, right: 0, marginTop: '4px',
                        backgroundColor: 'white', borderRadius: '6px', 
                        boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1), 0 2px 4px -1px rgba(0,0,0,0.06)',
                        border: '1px solid #f3f4f6', zIndex: 50, maxHeight: '200px', overflowY: 'auto'
                    }}>
                        {options.map((opt) => (
                            <button
                                key={opt}
                                onClick={(e) => { e.stopPropagation(); onChange(opt); setIsOpen(false); }}
                                style={{
                                    width: '100%', padding: '8px 12px', fontSize: '12px', textAlign: 'left',
                                    backgroundColor: 'transparent', border: 'none', cursor: 'pointer',
                                    display: 'flex', alignItems: 'center', gap: '8px',
                                    color: '#374151',
                                }}
                                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f9fafb'}
                                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                            >
                                <div style={{ width: '14px', display: 'flex', justifyContent: 'center' }}>
                                    {value === opt && <Check size={12} className="text-blue-600" />}
                                </div>
                                {opt}
                            </button>
                        ))}
                    </div>
                </>
            )}
        </div>
    );
};