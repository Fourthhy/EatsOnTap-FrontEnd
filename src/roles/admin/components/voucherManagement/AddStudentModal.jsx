import React, { useState, useCallback, useRef, useMemo, useEffect, use } from 'react';
import { ChevronDown, Check, ChevronUp, ChevronLeft, Plus, Upload, FileText, X, User, Wifi, CheckCircle, Loader } from 'lucide-react';
import { createStudent } from "../../../../functions/admin/createStudent";
import { useData } from "../../../../context/DataContext";
import { AnimatePresence, motion } from 'framer-motion';
import { studentRFIDLinking } from "../../../../functions/admin/studentRFIDLinking";
import { uploadStudentCSV } from "../../../../functions/admin/addStudentUsingCSV";

// --- STYLES CONSTANTS ---
const activeStyles = { background: 'linear-gradient(to right, #4268BD, #3F6AC9)', cursor: 'pointer', fontWeight: '600', color: 'white', border: 'none' };
const disabledStyles = { backgroundColor: '#cccccc', background: '#cccccc', cursor: 'not-allowed', fontWeight: '400', color: 'white', border: 'none' };

// --- CUSTOM DROPDOWN COMPONENT ---
const CustomDropdown = ({ label, value, options, onChange }) => {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div style={{ position: 'relative', width: '100%' }}>
            <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', color: '#374151', marginBottom: '4px' }}>
                {label}
            </label>
            <button
                type="button"
                onClick={() => setIsOpen(!isOpen)}
                style={{
                    width: '100%', padding: '8px 12px', fontSize: '0.875rem', textAlign: 'left',
                    backgroundColor: 'white', border: '1px solid #d1d5db', borderRadius: '6px',
                    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                    cursor: 'pointer', color: value ? '#1f2937' : '#9ca3af',
                    boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)'
                }}
            >
                <span>{value}</span>
                <ChevronDown size={16} className={`text-gray-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
            </button>

            <AnimatePresence>
                {isOpen && (
                    <>
                        <div
                            style={{ position: 'fixed', inset: 0, zIndex: 9000 }}
                            onClick={() => setIsOpen(false)}
                        />
                        <motion.div
                            initial={{ opacity: 0, y: -5 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -5 }}
                            transition={{ duration: 0.15 }}
                            style={{
                                position: 'absolute', top: '100%', left: 0, right: 0, marginTop: '4px',
                                backgroundColor: 'white', borderRadius: '6px',
                                boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1), 0 2px 4px -1px rgba(0,0,0,0.06)',
                                border: '1px solid #f3f4f6', zIndex: 9800, maxHeight: '200px', overflowY: 'auto'
                            }}
                        >
                            {options.map((opt) => (
                                <button
                                    key={opt}
                                    type="button"
                                    onClick={() => { onChange(opt); setIsOpen(false); }}
                                    style={{
                                        width: '100%', padding: '8px 12px', fontSize: '0.875rem', textAlign: 'left',
                                        backgroundColor: 'transparent', border: 'none', cursor: 'pointer',
                                        display: 'flex', alignItems: 'center', gap: '8px', color: '#374151',
                                        borderBottom: '1px solid #f9fafb'
                                    }}
                                    onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f9fafb'}
                                    onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                                >
                                    {value === opt && <Check size={14} className="text-blue-600" />}
                                    <span style={{ marginLeft: value === opt ? 0 : '22px' }}>{opt}</span>
                                </button>
                            ))}
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </div>
    );
};

// --- MAIN FORM COMPONENT ---
const ManualAddForm = ({ onClose }) => {
    const [isSuccess, setIsSuccess] = useState(false);

    // 🟢 FORM STATE
    const [formData, setFormData] = useState({
        lastName: '',
        firstName: '',
        middleName: '',
        studentId: '',
        department: 'Basic Education', // Default
        type: 'Regular',
        yearLevel: '',
        section: '' // Acts as generic field for Section OR Program
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.id]: e.target.value });
    };

    // Helper to update dropdowns
    const handleDropdownChange = (key, value) => {
        setFormData({ ...formData, [key]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // 🟢 PAYLOAD MAPPING
        const isHigherEd = formData.department === 'Higher Education';

        const payload = {
            ...formData,
            // Logic: If Higher Ed, send 'program'. If Basic Ed, send 'section'.
            program: isHigherEd ? formData.section : undefined,
            section: !isHigherEd ? formData.section : undefined,
        };

        try {
            console.log(payload)
            await createStudent(payload);
            setIsSuccess(true);
            setTimeout(() => { if (onClose) onClose(); }, 1500);
        } catch (error) {
            console.error(error.message);
            alert("Error creating student: " + error.message);
        }
    };

    const isFormValid = formData.lastName && formData.firstName && formData.studentId && formData.yearLevel && formData.section;
    const isHigherEd = formData.department === 'Higher Education';

    // Styles
    const inputStyle = {
        marginTop: '4px', padding: '8px', fontSize: '0.875rem',
        borderRadius: '6px', border: '1px solid #d1d5db',
        boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)', width: '100%', boxSizing: 'border-box', outline: 'none'
    };

    // --- SUCCESS VIEW ---
    if (isSuccess) {
        return (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '400px', animation: 'fadeIn 0.5s ease-in-out' }}>
                <div style={{ position: 'relative' }}>
                    <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: '80px', height: '80px', borderRadius: '50%', backgroundColor: '#dcfce7', animation: 'ping 1s cubic-bezier(0, 0, 0.2, 1) infinite' }} />
                    <CheckCircle size={64} color="#16a34a" style={{ position: 'relative', zIndex: 9000 }} />
                </div>
                <h3 style={{ marginTop: '24px', fontSize: '1.25rem', fontWeight: '600', color: '#16a34a' }}>Student Added!</h3>
                <p style={{ color: '#6b7280', fontSize: '0.875rem', marginTop: '8px' }}>Closing window...</p>
                <style>{`@keyframes ping { 75%, 100% { transform: translate(-50%, -50%) scale(2); opacity: 0; } } @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }`}</style>
            </div>
        );
    }

    // --- FORM VIEW ---
    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', paddingTop: '16px' }}>

            {/* 1. Name Fields */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px' }}>
                <div>
                    <label htmlFor="lastName" style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', color: '#374151' }}>Last Name</label>
                    <input type="text" id="lastName" value={formData.lastName} onChange={handleChange} style={inputStyle} placeholder="e.g., Dela Cruz" />
                </div>
                <div>
                    <label htmlFor="firstName" style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', color: '#374151' }}>First Name</label>
                    <input type="text" id="firstName" value={formData.firstName} onChange={handleChange} style={inputStyle} placeholder="e.g., Juan" />
                </div>
                <div>
                    <label htmlFor="middleName" style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', color: '#374151' }}>Middle Name</label>
                    <input type="text" id="middleName" value={formData.middleName} onChange={handleChange} style={inputStyle} placeholder="e.g., A." />
                </div>
            </div>

            {/* 2. ID & Department */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div>
                    <label htmlFor="studentId" style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', color: '#374151' }}>Student ID</label>
                    <input type="text" id="studentId" value={formData.studentId} onChange={handleChange} style={inputStyle} placeholder="e.g., 25-00001JAD" />
                </div>

                {/* 🟢 CUSTOM DROPDOWN: DEPARTMENT */}
                <div style={{ zIndex: 30 }}>
                    <CustomDropdown
                        label="Department"
                        value={formData.department}
                        options={["Basic Education", "Higher Education"]}
                        onChange={(val) => handleDropdownChange('department', val)}
                    />
                </div>
            </div>

            {/* 3. Type, Year, Section/Program */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px' }}>

                {/* 🟢 CUSTOM DROPDOWN: TYPE */}
                <div style={{ zIndex: 20 }}>
                    <CustomDropdown
                        label="Student Type"
                        value={formData.type}
                        options={["Regular", "Irregular"]}
                        onChange={(val) => handleDropdownChange('type', val)}
                    />
                </div>

                <div>
                    <label htmlFor="yearLevel" style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', color: '#374151' }}>
                        {isHigherEd ? "Year Level" : "Grade Level"}
                    </label>
                    <input
                        type="text"
                        id="yearLevel"
                        value={formData.yearLevel}
                        onChange={handleChange}
                        style={inputStyle}
                        placeholder={isHigherEd ? "e.g., 1st Year" : "e.g., Grade 7"}
                    />
                </div>

                <div>
                    {/* 🟢 DYNAMIC LABEL & PLACEHOLDER */}
                    <label htmlFor="section" style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', color: '#374151' }}>
                        {isHigherEd ? "Program" : "Section"}
                    </label>
                    <input
                        type="text"
                        id="section"
                        value={formData.section}
                        onChange={handleChange}
                        style={inputStyle}
                        placeholder={isHigherEd ? "e.g., BSIT" : "e.g., Rizal"}
                    />
                </div>
            </div>

            {/* Save Button */}
            <div style={{ display: 'flex', justifyContent: 'flex-end', paddingTop: '16px' }}>
                <button
                    type="button"
                    disabled={!isFormValid}
                    onClick={handleSubmit}
                    style={{
                        padding: '10px 16px', borderRadius: '6px', fontSize: '0.875rem',
                        transition: 'background-color 0.2s',
                        ...(isFormValid ? activeStyles : disabledStyles)
                    }}
                >
                    Save Student
                </button>
            </div>
        </div>
    );
};

// --- 🟢 NEW: UPLOAD SUCCESS MODAL ---
const UploadSuccessModal = ({ onClose, message }) => {
    const [timeLeft, setTimeLeft] = useState(5);

    useEffect(() => {
        // Start the countdown timer
        const timer = setInterval(() => {
            setTimeLeft((prevTime) => {
                if (prevTime <= 1) {
                    clearInterval(timer);
                    onClose(); // Auto-close when it hits 0
                    return 0;
                }
                return prevTime - 1;
            });
        }, 1000);

        // Cleanup interval on unmount
        return () => clearInterval(timer);
    }, [onClose]);

    return (
        <div
            className="fixed inset-0 flex items-center justify-center z-[9999] backdrop-blur-sm"
            style={{ backgroundColor: 'rgba(0, 0, 0, 0.4)' }}
            onClick={onClose} // Closes if they click the background
        >
            <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 10 }}
                className="bg-white rounded-xl shadow-2xl p-6 flex flex-col items-center max-w-sm w-full mx-4 text-center"
                onClick={(e) => e.stopPropagation()} // Prevents closing when clicking inside the modal
                style={{ fontFamily: "inherit" }}
            >
                {/* Animated Check Circle */}
                <div style={{ position: 'relative', marginBottom: '20px' }}>
                    <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: '64px', height: '64px', borderRadius: '50%', backgroundColor: '#dcfce7', animation: 'ping 1s cubic-bezier(0, 0, 0.2, 1) infinite' }} />
                    <CheckCircle size={56} color="#16a34a" style={{ position: 'relative', zIndex: 10 }} />
                </div>

                <h3 style={{ fontSize: '1.25rem', fontWeight: '600', color: '#111827', marginBottom: '8px' }}>
                    Upload Successful!
                </h3>

                <p style={{ color: '#4b5563', fontSize: '0.875rem', marginBottom: '24px', lineHeight: '1.5' }}>
                    {message}
                </p>

                <button
                    onClick={onClose}
                    style={{
                        width: '100%', padding: '10px 16px', backgroundColor: '#2563eb', color: 'white',
                        fontWeight: '500', borderRadius: '6px', border: 'none', cursor: 'pointer',
                        transition: 'background-color 0.2s', display: 'flex', justifyContent: 'center', alignItems: 'center'
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#1d4ed8'}
                    onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#2563eb'}
                >
                    Okay ({timeLeft})
                </button>
                <style>{`@keyframes ping { 75%, 100% { transform: translate(-50%, -50%) scale(1.5); opacity: 0; } }`}</style>
            </motion.div>
        </div>
    );
};

// --- UPLOAD FROM CSV COMPONENT (Updated with Custom Modal) ---
const UploadFromCSV = () => {
    const fileInputRef = useRef(null);
    const [isLoading, setIsLoading] = useState(false);

    // 🟢 NEW: State to control the Success Modal
    const [successMessage, setSuccessMessage] = useState("");
    const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);

    const handleButtonClick = () => {
        if (fileInputRef.current && !isLoading) {
            fileInputRef.current.click();
        }
    };

    const processFile = async (file) => {
        if (!file) return;

        // Validation
        if (file.type !== 'text/csv' && !file.name.endsWith('.csv')) {
            alert("Please upload a valid CSV file."); // (Kept alert for errors, but can be modaled later)
            return;
        }

        setIsLoading(true);

        try {
            console.log(`Uploading: ${file.name}`);
            const response = await uploadStudentCSV(file);

            // 🟢 THE FIX: Replaced alert() with Modal state
            setSuccessMessage(response.message); // e.g., "Successfully Created 50 students"
            setIsSuccessModalOpen(true);

        } catch (error) {
            console.error(error);
            alert(error.message || "An error occurred during upload.");
        } finally {
            setIsLoading(false);
            if (fileInputRef.current) fileInputRef.current.value = '';
        }
    };

    const handleFileChange = (event) => {
        const file = event.target.files[0];
        processFile(file);
    };

    const handleDragOver = (e) => {
        e.preventDefault();
    };

    const handleDrop = (e) => {
        e.preventDefault();
        if (isLoading) return;
        const file = e.dataTransfer.files[0];
        processFile(file);
    };

    return (
        <>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', paddingTop: '16px', textAlign: 'center' }}>
                <div
                    className="hover:bg-gray-50"
                    onDragOver={handleDragOver}
                    onDrop={handleDrop}
                    style={{
                        padding: '32px', border: '2px dashed #d1d5db', borderRadius: '6px',
                        backgroundColor: isLoading ? '#f3f4f6' : '#f9fafb',
                        cursor: isLoading ? 'not-allowed' : 'pointer',
                        transition: 'background-color 0.2s'
                    }}
                >
                    <FileText style={{ height: '40px', width: '40px', color: '#9ca3af', margin: '0 auto', marginBottom: '8px' }} />
                    <p style={{ fontSize: '0.875rem', color: '#4b5563' }}>
                        {isLoading ? "Uploading and syncing schedules..." : "Drag and drop your CSV file here, or click to select."}
                    </p>
                    <input
                        type="file"
                        ref={fileInputRef}
                        onChange={handleFileChange}
                        accept=".csv"
                        style={{ display: 'none' }}
                        disabled={isLoading}
                    />
                </div>
                <button
                    onClick={handleButtonClick}
                    disabled={isLoading}
                    style={{
                        padding: '10px 16px', border: '1px solid #d1d5db', boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
                        fontSize: '0.875rem', fontWeight: '500', borderRadius: '6px',
                        color: isLoading ? '#9ca3af' : '#374151', backgroundColor: 'white',
                        display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                        cursor: isLoading ? 'not-allowed' : 'pointer',
                        opacity: isLoading ? 0.7 : 1
                    }}
                >
                    {isLoading ? (
                        <><Loader className="animate-spin" size={16} style={{ marginRight: '8px' }} /> Processing...</>
                    ) : (
                        <><Upload size={16} style={{ marginRight: '8px' }} /> Browse Files</>
                    )}
                </button>
            </div>

            {/* 🟢 NEW: Mount the modal conditionally using AnimatePresence for smooth transitions */}
            <AnimatePresence>
                {isSuccessModalOpen && (
                    <UploadSuccessModal
                        message={successMessage}
                        onClose={() => setIsSuccessModalOpen(false)}
                    />
                )}
            </AnimatePresence>
        </>
    );
};

// Main Modal Component
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
        <div className={`fixed inset-0 flex items-center justify-center transition-opacity ${isClosing ? 'opacity-0' : 'opacity-100'} backdrop-blur-sm bg-black/50`} style={{ backgroundColor: 'rgba(0, 0, 0, 0.3)', zIndex: 9500 }} onClick={handleClose}>
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

// LinkIDModal
const LinkIDModal = ({ isOpen, onClose, student }) => {
    const [isClosing, setIsClosing] = useState(false);
    const [rfidTag, setRfidTag] = useState('');
    const [isLoading, setIsLoading] = useState(false);
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