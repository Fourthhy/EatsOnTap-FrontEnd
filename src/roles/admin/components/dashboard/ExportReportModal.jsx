import React, { useState, useEffect } from 'react';
import { X, FileText, Download, CheckSquare, Square } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const ExportReportModal = ({ isOpen, onClose }) => {
    // --- STATE ---
    // 🟢 Hardcoded to 'pdf' and auto-selected IDs for the demo
    const [selectedFormats, setSelectedFormats] = useState('pdf'); 
    const [selectedReports, setSelectedReports] = useState(['bar_chart', 'line_chart', 'banded_tadmc', 'banded_cur', 'banded_ocf', 'individual_claims']);
    const [selectedScopes, setSelectedScopes] = useState(['daily', 'weekly', 'monthly']);

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

    // --- THE "FAKE" EXPORT LOGIC ---
    const handleExport = () => {
        console.log("Simulating Export...");

        // 🟢 SIMULATED DOWNLOAD LOGIC
        // This looks for a file in your 'public' folder named 'Report_Demo.pdf'
        const link = document.createElement('a');
        link.href = '/eot_pdf_report.pdf'; // Path to your fake file in public folder
        link.download = `System_Report_${new Date().toLocaleDateString().replace(/\//g, '-')}.pdf`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        // Close after a tiny delay so it feels like it "processed"
        setTimeout(() => {
            onClose();
        }, 500);
    };

    // --- STYLES ---
    const overlayStyle = {
        position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.4)', backdropFilter: 'blur(3px)',
        zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center',
    };

    const modalStyle = {
        backgroundColor: 'white', width: '600px', maxHeight: '98vh',
        overflowY: 'auto', borderRadius: '12px', padding: '24px',
        fontFamily: 'geist', position: 'relative',
    };

    const sectionTitleStyle = {
        fontSize: '11px', fontWeight: 600, color: '#9ca3af', 
        textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '8px'
    };

    const checkboxRowStyle = (isSelected) => ({
        display: 'flex', alignItems: 'center', gap: '10px',
        padding: '8px 12px', borderRadius: '6px', cursor: 'pointer',
        backgroundColor: isSelected ? '#eff6ff' : 'transparent',
        border: isSelected ? '1px solid #bfdbfe' : '1px solid transparent',
        transition: 'all 0.15s ease'
    });

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} style={overlayStyle} onClick={onClose}>
                    <motion.div 
                        initial={{ scale: 0.95, opacity: 0, y: 10 }} 
                        animate={{ scale: 1, opacity: 1, y: 0 }} 
                        exit={{ scale: 0.95, opacity: 0, y: 10 }} 
                        style={modalStyle} 
                        onClick={e => e.stopPropagation()}
                    >
                        {/* Header */}
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '24px' }}>
                            <div>
                                <h2 style={{ fontSize: '18px', fontWeight: 600, color: '#111827', margin: 0 }}>Export System Report</h2>
                                <p style={{ fontSize: '13px', color: '#6b7280', margin: '4px 0 0 0' }}>All system analytics are pre-selected for full export.</p>
                            </div>
                            <button onClick={onClose} style={{ border: 'none', background: 'transparent', cursor: 'pointer', color: '#9ca3af' }}><X size={20} /></button>
                        </div>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                            {/* SECTION 1: REPORTS */}
                            <div>
                                <div style={sectionTitleStyle}>1. Analytics Included</div>
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '4px' }}>
                                    {reportOptions.map((opt) => (
                                        <div key={opt.id} style={checkboxRowStyle(true)}>
                                            <CheckSquare size={18} color="#4268BD" />
                                            <span style={{ fontSize: '13px', fontWeight: 500 }}>{opt.label}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* SECTION 2: SCOPE */}
                            <div>
                                <div style={sectionTitleStyle}>2. Data Scope</div>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                                    {scopeOptions.map((opt) => (
                                        <div key={opt.id} style={checkboxRowStyle(true)}>
                                            <CheckSquare size={18} color="#4268BD" />
                                            <span style={{ fontSize: '13px', fontWeight: 500 }}>{opt.label}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* SECTION 3: FORMAT */}
                            <div>
                                <div style={sectionTitleStyle}>3. Export Format</div>
                                <div style={{ 
                                    padding: '16px', border: '2px solid #4268BD', borderRadius: '8px', 
                                    backgroundColor: '#eff6ff', display: 'flex', alignItems: 'center', gap: '12px' 
                                }}>
                                    <FileText size={32} color="#b91c1c" />
                                    <div>
                                        <p style={{ margin: 0, fontSize: '14px', fontWeight: 600 }}>PDF Document</p>
                                        <p style={{ margin: 0, fontSize: '12px', color: '#6b7280' }}>Optimized for presentation and printing.</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Footer */}
                        <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end', marginTop: '32px', borderTop: '1px solid #f3f4f6', paddingTop: '20px' }}>
                            <button onClick={onClose} style={{ padding: '8px 16px', borderRadius: '6px', border: '1px solid #e5e7eb', background: 'white', cursor: 'pointer' }}>Cancel</button>
                            <button 
                                onClick={handleExport}
                                style={{ 
                                    padding: '8px 24px', borderRadius: '6px', border: 'none', 
                                    background: 'linear-gradient(to right, #4268BD, #3F6AC9)', 
                                    color: 'white', fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px'
                                }}
                            >
                                <Download size={18} /> Generate PDF
                            </button>
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export { ExportReportModal };