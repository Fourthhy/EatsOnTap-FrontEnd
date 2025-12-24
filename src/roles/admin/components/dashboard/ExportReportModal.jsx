import React, { useState } from 'react';
import { X, FileSpreadsheet, FileText, Table, Download, CheckSquare, Square } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const ExportReportModal = ({ isOpen, onClose }) => {
    // --- STATE ---
    const [selectedFormats, setSelectedFormats] = useState('csv'); // Single Select
    const [selectedReports, setSelectedReports] = useState([]);    // Multi Select
    const [selectedScopes, setSelectedScopes] = useState([]);      // Multi Select

    // --- OPTIONS DATA ---
    const reportOptions = [
        { id: 'bar_chart', label: 'Bar Chart' },
        { id: 'line_chart', label: 'Line Chart' },
        { id: 'banded_tadmc', label: 'Banded Chart TADMC' },
        { id: 'banded_cur', label: 'Banded Chart CUR' },
        { id: 'banded_ocf', label: 'Banded Chart OCF' },
        { id: 'individual_claims', label: 'Individual Claims' },
    ];

    const scopeOptions = [
        { id: 'daily', label: 'All past data in daily format' },
        { id: 'weekly', label: 'All past data in weekly format' },
        { id: 'monthly', label: 'All past data in monthly format' },
    ];

    // --- HANDLERS ---
    const toggleReport = (id) => {
        setSelectedReports(prev => 
            prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
        );
    };

    const toggleScope = (id) => {
        setSelectedScopes(prev => 
            prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
        );
    };

    const handleExport = () => {
        console.log("Exporting:", {
            reports: selectedReports,
            scope: selectedScopes,
            format: selectedFormats
        });
        onClose();
    };

    // --- STYLES (Cleaned of manual transitions) ---
    const overlayStyle = {
        position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.4)',
        backdropFilter: 'blur(3px)',
        zIndex: 9999,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
    };

    const modalStyle = {
        backgroundColor: 'white',
        width: '600px',
        maxHeight: '98vh',
        overflowY: 'auto',
        borderRadius: '12px',
        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
        padding: '24px',
        fontFamily: 'geist',
        position: 'relative',
    };

    const sectionTitleStyle = {
        fontSize: '11px', fontWeight: 600, color: '#9ca3af', 
        textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '8px'
    };

    const checkboxRowStyle = (isSelected) => ({
        display: 'flex', alignItems: 'center', gap: '10px',
        padding: '8px 12px',
        borderRadius: '6px',
        cursor: 'pointer',
        backgroundColor: isSelected ? '#eff6ff' : 'transparent',
        border: isSelected ? '1px solid #bfdbfe' : '1px solid transparent',
        transition: 'all 0.15s ease'
    });

    const formatCardStyle = (id) => ({
        flex: 1,
        display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px',
        padding: '12px',
        border: selectedFormats === id ? '2px solid #4268BD' : '1px solid #e5e7eb',
        borderRadius: '8px',
        cursor: 'pointer',
        backgroundColor: selectedFormats === id ? '#eff6ff' : 'white',
        transition: 'all 0.2s ease',
        textAlign: 'center'
    });

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    style={overlayStyle} 
                    onClick={onClose}
                >
                    <motion.div 
                        initial={{ scale: 0.95, opacity: 0, y: 10 }}
                        animate={{ scale: 1, opacity: 1, y: 0 }}
                        exit={{ scale: 0.95, opacity: 0, y: 10 }}
                        transition={{ type: "spring", duration: 0.5, bounce: 0.3 }}
                        style={modalStyle} 
                        onClick={e => e.stopPropagation()}
                    >
                        
                        {/* Header */}
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '24px' }}>
                            <div>
                                <h2 style={{ fontSize: '18px', fontWeight: 600, color: '#111827', margin: 0 }}>Export Report</h2>
                                <p style={{ fontSize: '13px', color: '#6b7280', margin: '4px 0 0 0' }}>Configure the data and format you wish to export.</p>
                            </div>
                            <button 
                                onClick={onClose} 
                                style={{ border: 'none', background: 'transparent', cursor: 'pointer', color: '#9ca3af' }}
                            >
                                <X size={20} />
                            </button>
                        </div>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                            
                            {/* SECTION 1: REPORT TYPES */}
                            <div>
                                <div style={sectionTitleStyle}>1. Select Reports</div>
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '4px' }}>
                                    {reportOptions.map((opt) => {
                                        const isSelected = selectedReports.includes(opt.id);
                                        return (
                                            <div key={opt.id} style={checkboxRowStyle(isSelected)} onClick={() => toggleReport(opt.id)}>
                                                <div style={{ color: isSelected ? '#4268BD' : '#d1d5db', display: 'flex' }}>
                                                    {isSelected ? <CheckSquare size={18} /> : <Square size={18} />}
                                                </div>
                                                <span style={{ fontSize: '13px', color: isSelected ? '#1f2937' : '#4b5563', fontWeight: 500 }}>
                                                    {opt.label}
                                                </span>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>

                            {/* SECTION 2: SCOPE */}
                            <div>
                                <div style={sectionTitleStyle}>2. Select Scope</div>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                                    {scopeOptions.map((opt) => {
                                        const isSelected = selectedScopes.includes(opt.id);
                                        return (
                                            <div key={opt.id} style={checkboxRowStyle(isSelected)} onClick={() => toggleScope(opt.id)}>
                                                <div style={{ color: isSelected ? '#4268BD' : '#d1d5db', display: 'flex' }}>
                                                    {isSelected ? <CheckSquare size={18} /> : <Square size={18} />}
                                                </div>
                                                <span style={{ fontSize: '13px', color: isSelected ? '#1f2937' : '#4b5563', fontWeight: 500 }}>
                                                    {opt.label}
                                                </span>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>

                            {/* SECTION 3: FILE FORMAT */}
                            <div>
                                <div style={sectionTitleStyle}>3. File Format</div>
                                <div style={{ display: 'flex', gap: '12px' }}>
                                    <div style={formatCardStyle('csv')} onClick={() => setSelectedFormats('csv')}>
                                        <div style={{ color: selectedFormats === 'csv' ? '#4268BD' : '#6b7280' }}><Table size={24} /></div>
                                        <span style={{ fontSize: '12px', fontWeight: 500, color: '#374151' }}>CSV</span>
                                    </div>
                                    <div style={formatCardStyle('excel')} onClick={() => setSelectedFormats('excel')}>
                                        <div style={{ color: selectedFormats === 'excel' ? '#166534' : '#6b7280' }}><FileSpreadsheet size={24} /></div>
                                        <span style={{ fontSize: '12px', fontWeight: 500, color: '#374151' }}>Excel</span>
                                    </div>
                                    <div style={formatCardStyle('pdf')} onClick={() => setSelectedFormats('pdf')}>
                                        <div style={{ color: selectedFormats === 'pdf' ? '#b91c1c' : '#6b7280' }}><FileText size={24} /></div>
                                        <span style={{ fontSize: '12px', fontWeight: 500, color: '#374151' }}>PDF</span>
                                    </div>
                                </div>
                            </div>

                        </div>

                        {/* Footer */}
                        <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end', paddingTop: '24px', marginTop: '24px', borderTop: '1px solid #f3f4f6' }}>
                            <button 
                                onClick={onClose}
                                style={{ 
                                    padding: '8px 16px', borderRadius: '6px', border: '1px solid #e5e7eb', 
                                    backgroundColor: 'white', color: '#374151', fontSize: '13px', fontWeight: 500, cursor: 'pointer' 
                                }}
                            >
                                Cancel
                            </button>
                            <button 
                                onClick={handleExport}
                                style={{ 
                                    padding: '8px 24px', borderRadius: '6px', border: 'none', 
                                    background: 'linear-gradient(to right, #4268BD, #3F6AC9)', 
                                    color: 'white', fontSize: '13px', fontWeight: 500, 
                                    cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px',
                                    boxShadow: '0 1px 2px rgba(0,0,0,0.1)'
                                }}
                            >
                                <Download size={16} /> Export Data
                            </button>
                        </div>

                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export { ExportReportModal };