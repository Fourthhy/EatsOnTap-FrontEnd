import React, { useState, useCallback, useRef, useMemo } from 'react';
import { ChevronLeft, Plus, Upload, FileText, X, User, Wifi } from 'lucide-react';

// 🟢 IMPORT CONTEXT
import { useData } from "../../../../context/DataContext";

// --- STYLES CONSTANTS ---
const activeStyles = { background: 'linear-gradient(to right, #4268BD, #3F6AC9)', cursor: 'pointer', fontWeight: '600', color: 'white', border: 'none' };
const disabledStyles = { backgroundColor: '#cccccc', background: '#cccccc', cursor: 'not-allowed', fontWeight: '400', color: 'white', border: 'none' };

// Component for the Manual Add form fields
const ManualAddForm = () => {
    // 🟢 1. GET UNIFIED DATA
    const { schoolData } = useData();

    // 🟢 2. FORM STATE (Wired up to support disabled/active button styles)
    const [formData, setFormData] = useState({
        lastName: '',
        firstName: '',
        middleName: '',
        studentId: '',
        type: 'Regular',
        section: ''
    });

    // 🟢 3. EXTRACT SECTIONS DYNAMICALLY
    const sectionOptions = useMemo(() => {
        if (!schoolData) return [];
        const opts = [];
        schoolData.forEach(cat => {
            if (cat.levels) {
                cat.levels.forEach(lvl => {
                    if (lvl.sections) {
                        lvl.sections.forEach(sec => {
                            // Create a readable string: "Grade 1 - Rizal"
                            const label = `${lvl.levelName} - ${sec.section}`;
                            opts.push(label);
                        });
                    }
                });
            }
        });
        return opts.sort();
    }, [schoolData]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.id]: e.target.value });
    };

    // Validation: Require Name, ID, and Section
    const isFormValid = formData.lastName && formData.firstName && formData.studentId && formData.section;

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', paddingTop: '16px' }}>
            {/* Last Name, First Name, Middle Name Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px' }}>
                <div style={{ gridColumn: 'span 1 / span 1' }}>
                    <label htmlFor="lastName" style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', color: '#374151' }}>Last Name</label>
                    <input
                        type="text"
                        id="lastName"
                        value={formData.lastName} onChange={handleChange}
                        className="block w-full shadow-sm p-2 text-sm focus:border-blue-500 focus:ring-blue-500"
                        style={{
                            marginTop: '4px', padding: '8px', fontSize: '0.875rem', 
                            borderRadius: '6px', // 🟢 6px
                            border: '1px solid #d1d5db',
                            boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)', width: '100%', boxSizing: 'border-box', outline: 'none'
                        }}
                        placeholder="e.g., Dela Cruz"
                    />
                </div>
                <div style={{ gridColumn: 'span 1 / span 1' }}>
                    <label htmlFor="firstName" style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', color: '#374151' }}>First Name</label>
                    <input
                        type="text"
                        id="firstName"
                        value={formData.firstName} onChange={handleChange}
                        className="mt-1 block w-full shadow-sm p-2 text-sm focus:border-blue-500 focus:ring-blue-500"
                        style={{
                            marginTop: '4px', padding: '8px', fontSize: '0.875rem', 
                            borderRadius: '6px', // 🟢 6px
                            border: '1px solid #d1d5db',
                            boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)', width: '100%', boxSizing: 'border-box', outline: 'none'
                        }}
                        placeholder="e.g., Juan"
                    />
                </div>
                <div style={{ gridColumn: 'span 1 / span 1' }}>
                    <label htmlFor="middleName" style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', color: '#374151' }}>Middle Name</label>
                    <input
                        type="text"
                        id="middleName"
                        value={formData.middleName} onChange={handleChange}
                        className="mt-1 block w-full shadow-sm p-2 text-sm focus:border-blue-500 focus:ring-blue-500"
                        style={{
                            marginTop: '4px', padding: '8px', fontSize: '0.875rem', 
                            borderRadius: '6px', // 🟢 6px
                            border: '1px solid #d1d5db',
                            boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)', width: '100%', boxSizing: 'border-box', outline: 'none'
                        }}
                        placeholder="e.g., A."
                    />
                </div>
            </div>

            {/* Student ID */}
            <div>
                <label htmlFor="studentId" style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', color: '#374151' }}>Student ID</label>
                <input
                    type="text"
                    id="studentId"
                    value={formData.studentId} onChange={handleChange}
                    className="mt-1 block w-full shadow-sm p-2 text-sm focus:border-blue-500 focus:ring-blue-500"
                    style={{
                        marginTop: '4px', padding: '8px', fontSize: '0.875rem', 
                        borderRadius: '6px', // 🟢 6px
                        border: '1px solid #d1d5db',
                        boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)', width: '100%', boxSizing: 'border-box', outline: 'none'
                    }}
                    placeholder="e.g., 25-00001JAD"
                />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '16px' }}>
                {/* Regular or Irregular Dropdown */}
                <div>
                    <label htmlFor="type" style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', color: '#374151' }}>Regular or Irregular</label>
                    <select
                        id="type"
                        value={formData.type} onChange={handleChange}
                        className="mt-1 block w-full shadow-sm p-2 text-sm focus:border-blue-500 focus:ring-blue-500 bg-white"
                        style={{
                            marginTop: '4px', padding: '8px', fontSize: '0.875rem', 
                            borderRadius: '6px', // 🟢 6px
                            border: '1px solid #d1d5db',
                            boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)', width: '100%', boxSizing: 'border-box', backgroundColor: 'white', outline: 'none'
                        }}
                    >
                        <option value="Regular">Regular</option>
                        <option value="Irregular">Irregular</option>
                    </select>
                </div>

                {/* Program Section Dropdown */}
                <div>
                    <label htmlFor="section" style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', color: '#374151' }}>Program / Section</label>
                    <select
                        id="section"
                        value={formData.section} onChange={handleChange}
                        className="mt-1 block w-full shadow-sm p-2 text-sm focus:border-blue-500 focus:ring-blue-500 bg-white"
                        style={{
                            marginTop: '4px', padding: '8px', fontSize: '0.875rem', 
                            borderRadius: '6px', // 🟢 6px
                            border: '1px solid #d1d5db',
                            boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)', width: '100%', boxSizing: 'border-box', backgroundColor: 'white', outline: 'none'
                        }}
                    >
                        <option value="">Select Section...</option>
                        {sectionOptions.map(section => (
                            <option key={section} value={section}>{section}</option>
                        ))}
                    </select>
                </div>
            </div>

            {/* Save Button */}
            <div style={{ display: 'flex', justifyContent: 'flex-end', paddingTop: '16px' }}>
                <button
                    type="submit"
                    disabled={!isFormValid}
                    style={{
                        padding: '10px 16px', 
                        borderRadius: '6px', // 🟢 6px
                        fontSize: '0.875rem',
                        transition: 'background-color 0.2s',
                        // 🟢 DYNAMIC STYLES
                        ...(isFormValid ? activeStyles : disabledStyles)
                    }}
                >
                    Save Student
                </button>
            </div>
        </div>
    );
};

// Component for the Upload from CSV option
const UploadFromCSV = () => {
    const fileInputRef = useRef(null);

    const handleButtonClick = () => {
        if (fileInputRef.current) {
            fileInputRef.current.click();
        }
    };

    const handleFileChange = (event) => {
        const file = event.target.files[0];
        if (file) {
            console.log(`File selected: ${file.name}`);
        }
    };

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', paddingTop: '16px', textAlign: 'center' }}>
            <div
                className="hover:bg-gray-50"
                style={{
                    padding: '32px', border: '2px dashed #d1d5db', 
                    borderRadius: '6px', // 🟢 6px
                    backgroundColor: '#f9fafb',
                }}
            >
                <FileText style={{ height: '40px', width: '40px', color: '#9ca3af', margin: '0 auto', marginBottom: '8px' }} />
                <p style={{ fontSize: '0.875rem', color: '#4b5563' }}>Drag and drop your CSV file here, or click to select.</p>

                <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileChange}
                    accept=".csv"
                    style={{ display: 'none' }}
                />
            </div>

            <button
                onClick={handleButtonClick}
                style={{
                    padding: '10px 16px', border: '1px solid #d1d5db', boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
                    fontSize: '0.875rem', fontWeight: '500', 
                    borderRadius: '6px', // 🟢 6px
                    color: '#374151',
                    backgroundColor: 'white', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer'
                }}
            >
                <Upload size={16} style={{ marginRight: '8px' }} />
                Browse Files
            </button>
        </div>
    );
};

// Main Modal Component
const AddStudentModal = ({ isOpen, onClose }) => {
    // Note: 'programSections' prop removed as it's fetched internally now
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

    const animationClass = isClosing
        ? 'animate-out fade-out slide-out-to-top-3'
        : 'animate-in fade-in slide-in-from-top-3';

    return (
        <div
            className={`fixed inset-0 flex items-center justify-center transition-opacity ${isClosing ? 'opacity-0' : 'opacity-100'} backdrop-blur-sm bg-black/50`}
            style={{ backgroundColor: 'rgba(0, 0, 0, 0.3)', zIndex: 2000 }}
            onClick={handleClose}
        >
            {/* Modal Container */}
            <div
                className={`bg-white rounded-xl shadow-2xl w-full max-w-lg p-6 transform ${animationClass}`}
                onClick={(e) => e.stopPropagation()}
                style={{
                    borderRadius: '6px', // 🟢 6px
                    boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
                    padding: '24px', position: 'relative', width: '100%', maxWidth: '512px', fontFamily: "inherit"
                }}
            >
                {/* Header */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: '16px', borderBottom: '1px solid #f3f4f6' }}>
                    <h2 style={{ fontSize: '1.125rem', fontWeight: '600', color: '#1f2937' }}>Add New Student</h2>
                    <button
                        onClick={handleClose}
                        className="text-gray-400 hover:text-gray-600 p-1 rounded-full hover:bg-gray-50"
                        style={{ border: 'none', background: 'transparent', cursor: 'pointer' }}
                    >
                        <X size={20} />
                    </button>
                </div>

                {/* Content based on Mode */}
                {mode === 'initial' && (
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '16px', padding: '24px 0' }}>
                        {/* Option 1: Manual Add */}
                        <button
                            onClick={() => setMode('manual')}
                            className="hover:shadow-lg transition-shadow hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            style={{ 
                                border: '1px solid #d1d5db', 
                                borderRadius: '6px', // 🟢 6px
                                padding: '24px', textAlign: 'center', cursor: 'pointer', background: 'white' 
                            }}
                        >
                            <Plus size={24} style={{ margin: '0 auto', color: '#2563eb', marginBottom: '8px' }} />
                            <span style={{ fontWeight: '500', color: '#1f2937', fontSize: '0.875rem' }}>Manual Add</span>
                            <p style={{ fontSize: '0.75rem', color: '#6b7280', marginTop: '4px' }}>Enter student details one by one.</p>
                        </button>

                        {/* Option 2: Upload from CSV */}
                        <button
                            onClick={() => setMode('csv')}
                            className="hover:shadow-lg transition-shadow hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            style={{ 
                                border: '1px solid #d1d5db', 
                                borderRadius: '6px', // 🟢 6px
                                padding: '24px', textAlign: 'center', cursor: 'pointer', background: 'white' 
                            }}
                        >
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
                        <ManualAddForm />
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

const LinkIDModal = ({ isOpen, onClose, student }) => {
    const [isClosing, setIsClosing] = useState(false);
    const [rfidTag, setRfidTag] = useState('');

    const handleClose = useCallback(() => {
        setIsClosing(true);
        setTimeout(() => {
            onClose();
            setRfidTag(''); 
            setIsClosing(false);
        }, 300);
    }, [onClose]);

    if (!isOpen && !isClosing) return null;

    const handleLinkAccept = () => {
        if (!rfidTag.trim()) {
            alert('Please scan or enter an RFID tag.');
            return;
        }
        alert(`Linked ${student.name} (ID: ${student.studentId}) with RFID: ${rfidTag}`);
        handleClose();
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