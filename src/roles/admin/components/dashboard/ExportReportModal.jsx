import React, { useState } from 'react';
import { X, Download, AlertTriangle, Info, FileText, Users } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { exportAndArchiveReport } from "../../../../functions/admin/exportAndArchiveReport";
import { downloadStudentExports } from "../../../../functions/admin/downloadStudentExports";
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable'; 

const ExportReportModal = ({ isOpen, onClose }) => {
    const [isProcessing, setIsProcessing] = useState(false);
    
    // 🟢 STATE: Track export type, format, AND education level
    const [exportType, setExportType] = useState('report'); // 'report' or 'students'
    const [studentFormat, setStudentFormat] = useState('excel'); // 'excel' or 'csv'
    const [studentLevel, setStudentLevel] = useState('all'); // 'all', 'basic', or 'higher'

    // --- PDF GENERATOR ENGINE ---
    const generatePDF = (reportData) => {
        const doc = new jsPDF('p', 'mm', 'a4');

        doc.setFontSize(22);
        doc.setTextColor(30, 58, 138); 
        doc.text(`Monthly System Report: ${reportData.bucketMonth}`, 14, 20);

        doc.setFontSize(11);
        doc.setTextColor(100, 116, 139); 
        doc.text(`Academic Year: ${reportData.academicYear}`, 14, 28);
        doc.text(`Exported on: ${new Date().toLocaleString()}`, 14, 34);

        doc.setDrawColor(226, 232, 240);
        doc.line(14, 40, 196, 40);

        const summaryBody = [
            ['Total Eligible Students', reportData.statistics.totalEligible],
            ['Total Meals Claimed', reportData.statistics.totalMealsClaimed],
            ['Total Snacks Claimed', reportData.statistics.totalSnacksClaimed],
            ['Total Unclaimed (incl. Absences)', reportData.statistics.totalUnclaimed + reportData.statistics.totalAbsences],
            ['Total Allotted Credits', `PHP ${reportData.financials.totalAllottedCredits.toLocaleString()}`],
            ['Total Used Credits', `PHP ${reportData.financials.totalUsedCredits.toLocaleString()}`],
            ['Total On-Hand Cash (Extras)', `PHP ${reportData.financials.totalOnHandCash.toLocaleString()}`],
        ];

        autoTable(doc, {
            startY: 45,
            head: [['Operational Metric', 'Monthly Total']],
            body: summaryBody,
            theme: 'grid',
            headStyles: { fillColor: [66, 104, 189], fontSize: 11 },
            styles: { fontSize: 10, cellPadding: 5 },
            columnStyles: {
                0: { fontStyle: 'bold', cellWidth: 100 },
                1: { halign: 'right' }
            }
        });

        doc.save(`EOT_Archive_${reportData.bucketMonth}.pdf`);
    };

    // --- HANDLER ---
    const handleExport = async () => {
        setIsProcessing(true);
        try {
            if (exportType === 'report') {
                const result = await exportAndArchiveReport({ bucketMonth: "2026-03" });
                generatePDF(result.data);

            } else if (exportType === 'students') {
                // 🟢 Pass BOTH format and level to the API caller
                await downloadStudentExports(studentFormat, studentLevel);
            }

            setTimeout(() => {
                onClose();
            }, 1000);

        } catch (error) {
            console.error("❌ Export Error:", error.message);
            alert(`System Error: ${error.message}`);
        } finally {
            setIsProcessing(false);
        }
    };

    // --- STYLES ---
    const overlayStyle = {
        position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.4)', backdropFilter: 'blur(3px)',
        zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center',
    };

    const modalStyle = {
        backgroundColor: 'white', width: '550px', maxHeight: '98vh',
        overflowY: 'auto', borderRadius: '12px', padding: '24px',
        fontFamily: 'geist', position: 'relative',
    };

    const cardStyle = (isActive) => ({
        flex: 1, padding: '16px', borderRadius: '8px', cursor: 'pointer',
        border: isActive ? '2px solid #4268BD' : '1px solid #e5e7eb',
        backgroundColor: isActive ? '#EFF6FF' : '#ffffff',
        display: 'flex', alignItems: 'flex-start', gap: '12px',
        transition: 'all 0.2s ease'
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
                                <h2 style={{ fontSize: '18px', fontWeight: 600, color: '#111827', margin: 0 }}>Export Data Center</h2>
                                <p style={{ fontSize: '13px', color: '#6b7280', margin: '4px 0 0 0' }}>Select the type of data you wish to generate.</p>
                            </div>
                            <button onClick={onClose} style={{ border: 'none', background: 'transparent', cursor: 'pointer', color: '#9ca3af' }}><X size={20} /></button>
                        </div>

                        {/* TYPE SELECTION CARDS */}
                        <div style={{ display: 'flex', gap: '12px', marginBottom: '24px' }}>
                            <div style={cardStyle(exportType === 'report')} onClick={() => setExportType('report')}>
                                <FileText size={20} color={exportType === 'report' ? '#4268BD' : '#6b7280'} style={{ marginTop: '2px' }} />
                                <div>
                                    <div style={{ fontWeight: 600, fontSize: '14px', color: exportType === 'report' ? '#1e3a8a' : '#374151' }}>Monthly Report</div>
                                    <div style={{ fontSize: '12px', color: '#6b7280', marginTop: '2px' }}>Operational stats & financials</div>
                                </div>
                            </div>
                            <div style={cardStyle(exportType === 'students')} onClick={() => setExportType('students')}>
                                <Users size={20} color={exportType === 'students' ? '#4268BD' : '#6b7280'} style={{ marginTop: '2px' }} />
                                <div>
                                    <div style={{ fontWeight: 600, fontSize: '14px', color: exportType === 'students' ? '#1e3a8a' : '#374151' }}>Student Records</div>
                                    <div style={{ fontSize: '12px', color: '#6b7280', marginTop: '2px' }}>Master list export</div>
                                </div>
                            </div>
                        </div>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>

                            {/* CONDITIONAL UI: MONTHLY REPORT */}
                            {exportType === 'report' && (
                                <>
                                    <div style={{ backgroundColor: '#f9fafb', padding: '16px', borderRadius: '8px', border: '1px solid #e5e7eb' }}>
                                        <h3 style={{ fontSize: '14px', fontWeight: 600, color: '#374151', margin: '0 0 8px 0', display: 'flex', alignItems: 'center', gap: '6px' }}>
                                            <Info size={16} color="#4268BD" /> PDF Contents
                                        </h3>
                                        <ul style={{ margin: 0, paddingLeft: '24px', color: '#4b5563', fontSize: '13px', lineHeight: '1.6' }}>
                                            <li><strong>Executive Summary:</strong> Total eligible vs. claimed meals.</li>
                                            <li><strong>Daily Breakdowns:</strong> Operational data and menus.</li>
                                            <li><strong>Financial Metrics:</strong> Cost Averages (TADMC) & Utilization (CUR).</li>
                                        </ul>
                                    </div>

                                    <div style={{ backgroundColor: '#fef2f2', padding: '16px', borderRadius: '8px', border: '1px solid #fecaca' }}>
                                        <h3 style={{ fontSize: '14px', fontWeight: 600, color: '#991b1b', margin: '0 0 8px 0', display: 'flex', alignItems: 'center', gap: '6px' }}>
                                            <AlertTriangle size={16} color="#dc2626" /> 24-Hour Automated Purge
                                        </h3>
                                        <p style={{ margin: 0, color: '#991b1b', fontSize: '13px', lineHeight: '1.5' }}>
                                            Exporting this document will schedule the raw daily data for hard deletion.
                                            <strong> You will have a 24-hour recovery window</strong> to re-download the file or cancel the purge.
                                        </p>
                                    </div>
                                </>
                            )}

                            {/* 🟢 CONDITIONAL UI: STUDENT RECORDS */}
                            {exportType === 'students' && (
                                <>
                                    <div style={{ backgroundColor: '#f9fafb', padding: '16px', borderRadius: '8px', border: '1px solid #e5e7eb', display: 'flex', flexDirection: 'column', gap: '16px' }}>
                                        
                                        {/* Dropdown 1: Education Level */}
                                        <div>
                                            <h3 style={{ fontSize: '14px', fontWeight: 600, color: '#374151', margin: '0 0 8px 0' }}>Education Level</h3>
                                            <select 
                                                value={studentLevel} 
                                                onChange={(e) => setStudentLevel(e.target.value)}
                                                style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #d1d5db', outline: 'none', fontFamily: 'geist', fontSize: '14px' }}
                                            >
                                                <option value="all">All Students (Both Levels)</option>
                                                <option value="basic">Basic Education Only</option>
                                                <option value="higher">Higher Education Only</option>
                                            </select>
                                        </div>

                                        {/* Dropdown 2: Format */}
                                        <div>
                                            <h3 style={{ fontSize: '14px', fontWeight: 600, color: '#374151', margin: '0 0 8px 0' }}>File Format</h3>
                                            <select 
                                                value={studentFormat} 
                                                onChange={(e) => setStudentFormat(e.target.value)}
                                                style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #d1d5db', outline: 'none', fontFamily: 'geist', fontSize: '14px' }}
                                            >
                                                <option value="excel">Excel (.xlsx)</option>
                                                <option value="csv">CSV (.csv)</option>
                                            </select>
                                        </div>

                                    </div>

                                    <div style={{ backgroundColor: '#f0fdf4', padding: '16px', borderRadius: '8px', border: '1px solid #bbf7d0' }}>
                                        <h3 style={{ fontSize: '14px', fontWeight: 600, color: '#166534', margin: '0 0 8px 0', display: 'flex', alignItems: 'center', gap: '6px' }}>
                                            <Info size={16} color="#16a34a" /> Safe Download
                                        </h3>
                                        <p style={{ margin: 0, color: '#15803d', fontSize: '13px', lineHeight: '1.5' }}>
                                            This will automatically download <strong>{studentLevel === 'all' ? 'two files' : 'one file'}</strong>. This process is read-only and will <strong>not</strong> delete or purge any data.
                                        </p>
                                    </div>
                                </>
                            )}

                        </div>

                        {/* Footer */}
                        <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end', marginTop: '32px', borderTop: '1px solid #f3f4f6', paddingTop: '20px' }}>
                            <button
                                onClick={onClose}
                                disabled={isProcessing}
                                style={{ padding: '8px 16px', borderRadius: '6px', border: '1px solid #e5e7eb', background: 'white', cursor: isProcessing ? 'not-allowed' : 'pointer' }}
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleExport}
                                disabled={isProcessing}
                                style={{
                                    padding: '8px 24px', borderRadius: '6px', border: 'none',
                                    background: isProcessing ? '#9ca3af' : 'linear-gradient(to right, #4268BD, #3F6AC9)',
                                    color: 'white', fontWeight: 600, cursor: isProcessing ? 'not-allowed' : 'pointer',
                                    display: 'flex', alignItems: 'center', gap: '8px', transition: 'all 0.2s'
                                }}
                            >
                                <Download size={18} /> {isProcessing ? "Processing..." : (exportType === 'report' ? "Export & Archive" : "Download Records")}
                            </button>
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export { ExportReportModal };