import React, { useState, useCallback, useRef, useMemo, useEffect, use } from 'react';
import { ChevronLeft, Plus, Upload, FileText, X, User, Wifi, CheckCircle } from 'lucide-react';
import { createStudent } from "../../../../functions/admin/createStudent";
import { useData } from "../../../../context/DataContext";

import { studentRFIDLinking } from "../../../../functions/admin/studentRFIDLinking";

// --- STYLES CONSTANTS ---
const activeStyles = { background: 'linear-gradient(to right, #4268BD, #3F6AC9)', cursor: 'pointer', fontWeight: '600', color: 'white', border: 'none' };
const disabledStyles = { backgroundColor: '#cccccc', background: '#cccccc', cursor: 'not-allowed', fontWeight: '400', color: 'white', border: 'none' };

// Component for the Manual Add form fields
// 🟢 ACCEPT onClose PROP
const ManualAddForm = ({ onClose }) => {
    // 🟢 1. GET UNIFIED DATA (Still useful if needed elsewhere, but less critical for inputs now)
    const { schoolData } = useData();
    const [isSuccess, setIsSuccess] = useState(false); // 🟢 Success State

    // 🟢 2. FORM STATE 
    const [formData, setFormData] = useState({
        lastName: '',
        firstName: '',
        middleName: '',
        studentId: '',
        type: 'Regular',
        yearLevel: '',
        section: ''
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.id]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const result = await createStudent(formData);

            // 🟢 ON SUCCESS: Show Animation & Close
            setIsSuccess(true);

            setTimeout(() => {
                if (onClose) onClose(); // Trigger the parent modal close
            }, 500); // Wait 2 seconds

        } catch (error) {
            console.error(error.message);
            alert("Error creating student: " + error.message); // Simple error feedback
        }
        // Don't clear form immediately if success, so user sees what they submitted if needed, 
        // or just to keep state stable during animation.
    };

    // Note: Removed dynamic extraction logic since inputs are now text fields

    const isFormValid = formData.lastName && formData.firstName && formData.studentId && formData.yearLevel && formData.section;

    const inputStyle = {
        marginTop: '4px', padding: '8px', fontSize: '0.875rem',
        borderRadius: '6px', border: '1px solid #d1d5db',
        boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)', width: '100%', boxSizing: 'border-box', outline: 'none'
    };

    // 🟢 RENDER SUCCESS VIEW
    if (isSuccess) {
        return (
            <div style={{
                display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                height: '400px', // Match approx height of form
                animation: 'fadeIn 0.5s ease-in-out'
            }}>
                <div style={{ position: 'relative' }}>
                    {/* Pulsing Circle Effect */}
                    <div style={{
                        position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)',
                        width: '80px', height: '80px', borderRadius: '50%', backgroundColor: '#dcfce7',
                        animation: 'ping 1s cubic-bezier(0, 0, 0.2, 1) infinite'
                    }} />
                    <CheckCircle size={64} color="#16a34a" style={{ position: 'relative', zIndex: 10 }} />
                </div>
                <h3 style={{ marginTop: '24px', fontSize: '1.25rem', fontWeight: '600', color: '#16a34a' }}>
                    Student Added!
                </h3>
                <p style={{ color: '#6b7280', fontSize: '0.875rem', marginTop: '8px' }}>
                    Closing window...
                </p>

                {/* Inline CSS for simple animations if Tailwind isn't fully handling it */}
                <style>{`
                    @keyframes ping {
                        75%, 100% { transform: translate(-50%, -50%) scale(2); opacity: 0; }
                    }
                    @keyframes fadeIn {
                        from { opacity: 0; } to { opacity: 1; }
                    }
                `}</style>
            </div>
        );
    }

    // 🟢 RENDER FORM VIEW (Standard)
    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', paddingTop: '16px' }}>
            {/* Last Name, First Name, Middle Name Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px' }}>
                <div style={{ gridColumn: 'span 1 / span 1' }}>
                    <label htmlFor="lastName" style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', color: '#374151' }}>Last Name</label>
                    <input type="text" id="lastName" value={formData.lastName} onChange={handleChange} style={inputStyle} placeholder="e.g., Dela Cruz" />
                </div>
                <div style={{ gridColumn: 'span 1 / span 1' }}>
                    <label htmlFor="firstName" style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', color: '#374151' }}>First Name</label>
                    <input type="text" id="firstName" value={formData.firstName} onChange={handleChange} style={inputStyle} placeholder="e.g., Juan" />
                </div>
                <div style={{ gridColumn: 'span 1 / span 1' }}>
                    <label htmlFor="middleName" style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', color: '#374151' }}>Middle Name</label>
                    <input type="text" id="middleName" value={formData.middleName} onChange={handleChange} style={inputStyle} placeholder="e.g., A." />
                </div>
            </div>

            {/* Student ID */}
            <div>
                <label htmlFor="studentId" style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', color: '#374151' }}>Student ID</label>
                <input type="text" id="studentId" value={formData.studentId} onChange={handleChange} style={inputStyle} placeholder="e.g., 25-00001JAD" />
            </div>

            {/* Type | Year Level | Section */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px' }}>
                <div>
                    <label htmlFor="type" style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', color: '#374151' }}>Type</label>
                    <select id="type" value={formData.type} onChange={handleChange} style={{ ...inputStyle, backgroundColor: 'white' }}>
                        <option value="Regular">Regular</option>
                        <option value="Irregular">Irregular</option>
                    </select>
                </div>

                {/* 🟢 CHANGED: Year Level is now a Text Input */}
                <div>
                    <label htmlFor="yearLevel" style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', color: '#374151' }}>Year Level</label>
                    <input
                        type="text"
                        id="yearLevel"
                        value={formData.yearLevel}
                        onChange={handleChange}
                        style={inputStyle}
                        placeholder="e.g., Grade 1 / 1st Year"
                    />
                </div>

                {/* 🟢 CHANGED: Section is now a Text Input */}
                <div>
                    <label htmlFor="section" style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', color: '#374151' }}>Section</label>
                    <input
                        type="text"
                        id="section"
                        value={formData.section}
                        onChange={handleChange}
                        style={inputStyle}
                        placeholder="e.g., Rizal / BSIT"
                    />
                </div>
            </div>

            {/* Save Button */}
            <div style={{ display: 'flex', justifyContent: 'flex-end', paddingTop: '16px' }}>
                <button type="submit" disabled={!isFormValid} onClick={handleSubmit} style={{ padding: '10px 16px', borderRadius: '6px', fontSize: '0.875rem', transition: 'background-color 0.2s', ...(isFormValid ? activeStyles : disabledStyles) }}>
                    Save Student
                </button>
            </div>
        </div>
    );
};

// ... UploadFromCSV Component (Unchanged) ...
const UploadFromCSV = () => {
    const fileInputRef = useRef(null);
    const handleButtonClick = () => { if (fileInputRef.current) fileInputRef.current.click(); };
    const handleFileChange = (event) => {
        const file = event.target.files[0];
        if (file) console.log(`File selected: ${file.name}`);
    };
    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', paddingTop: '16px', textAlign: 'center' }}>
            <div className="hover:bg-gray-50" style={{ padding: '32px', border: '2px dashed #d1d5db', borderRadius: '6px', backgroundColor: '#f9fafb' }}>
                <FileText style={{ height: '40px', width: '40px', color: '#9ca3af', margin: '0 auto', marginBottom: '8px' }} />
                <p style={{ fontSize: '0.875rem', color: '#4b5563' }}>Drag and drop your CSV file here, or click to select.</p>
                <input type="file" ref={fileInputRef} onChange={handleFileChange} accept=".csv" style={{ display: 'none' }} />
            </div>
            <button onClick={handleButtonClick} style={{ padding: '10px 16px', border: '1px solid #d1d5db', boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)', fontSize: '0.875rem', fontWeight: '500', borderRadius: '6px', color: '#374151', backgroundColor: 'white', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
                <Upload size={16} style={{ marginRight: '8px' }} /> Browse Files
            </button>
        </div>
    );
};

// Main Modal Component (Unchanged structure)
const AddStudentModal = ({ isOpen, onClose }) => {
    const [mode, setMode] = useState('initial');
    const [isClosing, setIsClosing] = useState(false);

    const handleClose = useCallback(() => {
        setIsClosing(true);
        setTimeout(() => {
            onClose();
            setMode('initial');
            setIsClosing(false);
        }, 300);
    }, [onClose]);

    if (!isOpen && !isClosing) return null;

    const animationClass = isClosing ? 'animate-out fade-out slide-out-to-top-3' : 'animate-in fade-in slide-in-from-top-3';

    return (
        <div className={`fixed inset-0 flex items-center justify-center transition-opacity ${isClosing ? 'opacity-0' : 'opacity-100'} backdrop-blur-sm bg-black/50`} style={{ backgroundColor: 'rgba(0, 0, 0, 0.3)', zIndex: 2000 }} onClick={handleClose}>
            <div className={`bg-white rounded-xl shadow-2xl w-full max-w-lg p-6 transform ${animationClass}`} onClick={(e) => e.stopPropagation()} style={{ borderRadius: '6px', boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)', padding: '24px', position: 'relative', width: '100%', maxWidth: '512px', fontFamily: "inherit" }}>

                {/* Header */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: '16px', borderBottom: '1px solid #f3f4f6' }}>
                    <h2 style={{ fontSize: '1.125rem', fontWeight: '600', color: '#1f2937' }}>Add New Student</h2>
                    <button onClick={handleClose} className="text-gray-400 hover:text-gray-600 p-1 rounded-full hover:bg-gray-50" style={{ border: 'none', background: 'transparent', cursor: 'pointer' }}>
                        <X size={20} />
                    </button>
                </div>

                {/* Content based on Mode */}
                {mode === 'initial' && (
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '16px', padding: '24px 0' }}>
                        <button onClick={() => setMode('manual')} className="hover:shadow-lg transition-shadow hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500" style={{ border: '1px solid #d1d5db', borderRadius: '6px', padding: '24px', textAlign: 'center', cursor: 'pointer', background: 'white' }}>
                            <Plus size={24} style={{ margin: '0 auto', color: '#2563eb', marginBottom: '8px' }} />
                            <span style={{ fontWeight: '500', color: '#1f2937', fontSize: '0.875rem' }}>Manual Add</span>
                            <p style={{ fontSize: '0.75rem', color: '#6b7280', marginTop: '4px' }}>Enter student details one by one.</p>
                        </button>
                        <button onClick={() => setMode('csv')} className="hover:shadow-lg transition-shadow hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500" style={{ border: '1px solid #d1d5db', borderRadius: '6px', padding: '24px', textAlign: 'center', cursor: 'pointer', background: 'white' }}>
                            <Upload size={24} style={{ margin: '0 auto', color: '#059669', marginBottom: '8px' }} />
                            <span style={{ fontWeight: '500', color: '#1f2937', fontSize: '0.875rem' }}>Upload from CSV</span>
                            <p style={{ fontSize: '0.75rem', color: '#6b7280', marginTop: '4px' }}>Bulk upload using a CSV file.</p>
                        </button>
                    </div>
                )}

                {/* Manual Add Form Interface */}
                {mode === 'manual' && (
                    <>
                        <button onClick={() => setMode('initial')} className="text-sm text-blue-600 hover:text-blue-800 flex items-center pt-4">
                            <ChevronLeft size={16} style={{ marginRight: '4px' }} /> Back to options
                        </button>
                        {/* 🟢 PASS handleClose to Form */}
                        <ManualAddForm onClose={handleClose} />
                    </>
                )}

                {/* Upload from CSV Interface */}
                {mode === 'csv' && (
                    <>
                        <button onClick={() => setMode('initial')} className="text-sm text-blue-600 hover:text-blue-800 flex items-center pt-4">
                            <ChevronLeft size={16} style={{ marginRight: '4px' }} /> Back to options
                        </button>
                        <UploadFromCSV />
                    </>
                )}
            </div>
        </div>
    );
};

// LinkIDModal unchanged...
const LinkIDModal = ({ isOpen, onClose, student }) => {
    const [isClosing, setIsClosing] = useState(false);
    const [rfidTag, setRfidTag] = useState('');
    const [isLoading, setIsLoading] = useState(false); // Optional: Add loading state
    const { fetchUnifiedSchoolData } = useData();

    const handleClose = useCallback(() => {
        setIsClosing(true);
        setTimeout(() => {
            onClose();
            setRfidTag('');
            setIsClosing(false);
        }, 300);
    }, [onClose]);

    if (!isOpen && !isClosing) return null;

    const handleLinkAccept = async () => {
        // 1. Basic Validation
        if (!rfidTag.trim()) {
            alert('Please scan or enter an RFID tag.');
            return;
        }

        setIsLoading(true);

        try {
            // 2. Call the API
            await studentRFIDLinking(student.studentId, rfidTag);
            
            setTimeout(async () => {
                await fetchUnifiedSchoolData()
            }, 1000)
            
            handleClose();

        } catch (error) {
            // 4. Error Feedback (e.g. "This RFID tag is already linked")
            console.error(error);
            alert(error.message);
        } finally {
            setIsLoading(false);
        }
    };

    const animationClass = isClosing ? 'animate-out fade-out slide-out-to-top-3' : 'animate-in fade-in slide-in-from-top-3';

    // Base style object for the main input/select fields
    const inputBaseStyle = {
        padding: '10px 12px', border: '1px solid #d1d5db',
        borderRadius: '6px', // 🟢 6px
        fontSize: '1rem', width: '100%', outline: 'none', backgroundColor: '#F9FAFB'
    };

    return (
        <div
            className={`fixed inset-0 flex items-center justify-center transition-opacity ${isClosing ? 'opacity-0' : 'opacity-100'} backdrop-blur-sm bg-black/50`}
            style={{
                backgroundColor: 'rgba(0, 0, 0, 0.3)', position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, zIndex: 2000,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}
            onClick={handleClose}
        >
            <div
                className={`bg-white rounded-xl shadow-2xl w-full max-w-sm p-6 transform ${animationClass}`}
                onClick={(e) => e.stopPropagation()}
                style={{
                    borderRadius: '6px', // 🟢 6px
                    boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
                    padding: '24px', position: 'relative', width: '100%', maxWidth: '400px',
                    backgroundColor: 'white', fontFamily: "inherit"
                }}
            >
                {/* Header */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: '16px', borderBottom: '1px solid #f3f4f6' }}>
                    <h2 style={{ fontSize: '1.125rem', fontWeight: '600', color: '#1f2937' }}>Link RFID to Student</h2>
                    <button onClick={handleClose} className="text-gray-400 hover:text-gray-600 p-1 rounded-full hover:bg-gray-50" style={{ border: 'none', background: 'transparent', cursor: 'pointer', padding: '4px', borderRadius: '50%' }}>
                        <X size={20} />
                    </button>
                </div>

                <div style={{ padding: '24px 0', display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    {/* Student Info Card */}
                    <div style={{
                        display: 'flex', alignItems: 'center', gap: '12px', padding: '12px',
                        backgroundColor: '#eff6ff',
                        borderRadius: '6px', // 🟢 6px
                        border: '1px solid #bfdbfe'
                    }}>
                        <User size={18} style={{ color: '#2563eb' }} />
                        <div style={{ fontSize: '0.875rem' }}>
                            <p style={{ fontWeight: '600', color: '#1f2937' }}>{student.name}</p>
                            <p style={{ color: '#4b5563' }}>{student.studentId}</p>
                        </div>
                    </div>

                    {/* RFID Scan Input */}
                    <div style={{ position: 'relative' }}>
                        <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', color: '#374151', marginBottom: '8px', alignItems: 'center', gap: '8px' }}>
                            <Wifi size={16} style={{ color: '#3b82f6' }} /> Scan RFID Tag:
                        </label>
                        <input
                            type="text" placeholder="Place ID on scanner..."
                            value={rfidTag} onChange={(e) => setRfidTag(e.target.value)}
                            style={inputBaseStyle}
                            className="focus:ring-2 focus:ring-blue-500 transition-shadow"
                            autoFocus
                        />
                    </div>
                </div>

                {/* Footer Buttons */}
                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', paddingTop: '12px', borderTop: '1px solid #f3f4f6' }}>
                    <button
                        onClick={handleClose}
                        style={{
                            padding: '8px 16px',
                            borderRadius: '6px', // 🟢 6px
                            fontSize: '0.875rem', fontWeight: '500',
                            color: '#374151', backgroundColor: '#e5e7eb', border: 'none', cursor: 'pointer'
                        }}
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleLinkAccept}
                        disabled={!rfidTag.trim()}
                        style={{
                            padding: '8px 16px',
                            borderRadius: '6px', // 🟢 6px
                            fontSize: '0.875rem',
                            transition: 'background-color 0.2s',
                            // 🟢 DYNAMIC STYLES
                            ...(rfidTag.trim() ? activeStyles : disabledStyles)
                        }}
                    >
                        Accept Link
                    </button>
                </div>
            </div>
        </div>
    );
};

export { AddStudentModal, LinkIDModal };