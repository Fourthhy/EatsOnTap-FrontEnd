import React, { useState } from 'react';
import { X, Download, AlertTriangle, Info } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { exportAndArchiveReport } from "../../../../functions/admin/exportAndArchiveReport";
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable'; // 🟢 Import it as a function

const ExportReportModal = ({ isOpen, onClose }) => {
    const [isProcessing, setIsProcessing] = useState(false);

    // --- PDF GENERATOR ENGINE ---
    const generatePDF = (reportData) => {
        const doc = new jsPDF('p', 'mm', 'a4');

        // 1. Header & Title
        doc.setFontSize(22);
        doc.setTextColor(30, 58, 138); // Dark Blue
        doc.text(`Monthly System Report: ${reportData.bucketMonth}`, 14, 20);

        doc.setFontSize(11);
        doc.setTextColor(100, 116, 139); // Slate Gray
        doc.text(`Academic Year: ${reportData.academicYear}`, 14, 28);
        doc.text(`Exported on: ${new Date().toLocaleString()}`, 14, 34);

        // 2. Decorative Line
        doc.setDrawColor(226, 232, 240);
        doc.line(14, 40, 196, 40);

        // 3. Prepare Executive Summary Data
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

        // 5. Save the File
        doc.save(`EOT_Archive_${reportData.bucketMonth}.pdf`);
    };

    const handleExport = async () => {
        setIsProcessing(true);
        try {
            // 🟢 Using the new clean function
            const result = await exportAndArchiveReport({ bucketMonth: "2026-03" });

            console.log("✅ Data retrieved from central API function:", result);

            // Generate the PDF using the returned data
            generatePDF(result.data);

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
                                <h2 style={{ fontSize: '18px', fontWeight: 600, color: '#111827', margin: 0 }}>Export & Archive Report</h2>
                                <p style={{ fontSize: '13px', color: '#6b7280', margin: '4px 0 0 0' }}>Generate a secure PDF backup of your monthly meal operations.</p>
                            </div>
                            <button onClick={onClose} style={{ border: 'none', background: 'transparent', cursor: 'pointer', color: '#9ca3af' }}><X size={20} /></button>
                        </div>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>

                            {/* SECTION 1: EXPECTED CONTENT */}
                            <div style={{ backgroundColor: '#f9fafb', padding: '16px', borderRadius: '8px', border: '1px solid #e5e7eb' }}>
                                <h3 style={{ fontSize: '14px', fontWeight: 600, color: '#374151', margin: '0 0 8px 0', display: 'flex', alignItems: 'center', gap: '6px' }}>
                                    <Info size={16} color="#4268BD" /> What is included in this PDF?
                                </h3>
                                <ul style={{ margin: 0, paddingLeft: '24px', color: '#4b5563', fontSize: '13px', lineHeight: '1.6' }}>
                                    <li><strong>Executive Summary:</strong> Total eligible vs. claimed meals for the month.</li>
                                    <li><strong>Daily Breakdowns:</strong> Operational data and menus for every active day.</li>
                                    <li><strong>Financial Metrics:</strong> Daily Cost Averages (TADMC), Utilization (CUR), and Overclaim (OCF) statistics.</li>
                                </ul>
                            </div>

                            {/* SECTION 2: THE PURGE WARNING */}
                            <div style={{ backgroundColor: '#fef2f2', padding: '16px', borderRadius: '8px', border: '1px solid #fecaca' }}>
                                <h3 style={{ fontSize: '14px', fontWeight: 600, color: '#991b1b', margin: '0 0 8px 0', display: 'flex', alignItems: 'center', gap: '6px' }}>
                                    <AlertTriangle size={16} color="#dc2626" /> 24-Hour Automated Purge
                                </h3>
                                <p style={{ margin: 0, color: '#991b1b', fontSize: '13px', lineHeight: '1.5' }}>
                                    To optimize database performance, exporting this document will schedule the raw daily data for hard deletion.
                                    <strong> You will have a 24-hour recovery window</strong> to re-download the file or cancel the purge. Top-level historical monthly aggregates will be permanently retained.
                                </p>
                            </div>
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
                                <Download size={18} /> {isProcessing ? "Processing..." : "Export & Archive"}
                            </button>
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export { ExportReportModal };