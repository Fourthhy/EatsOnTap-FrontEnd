import React, { useState, useMemo, useCallback, useRef } from 'react';
import { Search, Calendar, Filter, ChevronLeft, ChevronRight, MoreHorizontal, Plus, User, Upload, FileText, X } from 'lucide-react';

// --- MOCK DATA GENERATOR (UPDATED WITH 50 DETAILED RECORDS) ---
const generateData = () => {
    // Students 1-11: Detailed records provided by the user
    const initialMockStudents = [
        { id: 1, name: "Santos, Michaella Avaine", studentId: "25-00001MAS", program: "Grade 10", type: "Regular", status: "Eligible" },
        { id: 2, name: "Nabor, Samantha Roselle", studentId: "25-00002SRN", program: "BSA 4", type: "Regular", status: "Eligible" },
        { id: 3, name: "Manalo, Erica Kai", studentId: "25-00003EKM", program: "BSAIS 3", type: "Irregular", status: "Ineligible" },
        { id: 4, name: "Silangon, Cherry Rose", studentId: "25-00004CRS", program: "Grade 12", type: "Regular", status: "Eligible" },
        { id: 5, name: "Feliciano, Keysi Star", studentId: "25-00005KSF", program: "Grade 12", type: "Regular", status: "Eligible" },
        { id: 6, name: "Concepcion, Princess Angel", studentId: "25-00006PAC", program: "BSIS 1", type: "Regular", status: "Eligible" },
        { id: 7, name: "Martin, Fiona Margarette", studentId: "25-00007FMM", program: "BAB 3", type: "Regular", status: "Eligible" },
        { id: 8, name: "Uson, Tracy Haven", studentId: "25-00008THU", program: "BAB 1", type: "Regular", status: "Eligible" },
        { id: 9, name: "Roldan, Jamie Mae", studentId: "25-00009JMR", program: "BSIT 2", type: "Irregular", status: "Eligible" },
        { id: 10, name: "Adna, Arjumina Nana", studentId: "25-00010ANA", program: "BSAIS 1", type: "Regular", status: "Eligible" },
        { id: 11, name: "Conception, Akira", studentId: "25-00011AC", program: "BSA 2", type: "Regular", status: "Eligible" },
    ];

    // Students 12-50: Generated records
    const generateStudents = (startId, count) => {
        const names = [
            "Liam", "Olivia", "Noah", "Emma", "Oliver", "Ava", "Elijah", "Sophia", "Mateo", "Isabella",
            "Lucas", "Amelia", "Mia", "Benjamin", "Charlotte", "Ethan", "Harper", "Alexander", "Aurora",
            "William", "Avery", "Henry", "Luna", "James", "Chloe", "Theodore", "Zoe", "Daniel", "Ella",
            "Michael", "Scarlett", "Jacob", "Grace", "Logan", "Violet", "Sebastian", "Penelope", "Gabriel", "Lily"
        ];
        const programs = ['Kinder', 'Grade 1', 'Grade 3', 'Grade 5', 'Grade 7', 'Grade 8', 'Grade 9', 'BSCS 1', 'BSME 4', 'BSTM 2', 'BSEd 3', 'AB History 1'];
        const statuses = ['Eligible', 'Ineligible', 'Waived'];
        const types = ['Regular', 'Irregular'];
        const students = [];

        for (let i = 0; i < count; i++) {
            const currentId = startId + i;
            const entryNum = String(currentId).padStart(5, '0');
            const randomName = names[currentId % names.length];
            const lastName = `Dela Cruz ${i}`;
            const initials = `${randomName.charAt(0)}${lastName.charAt(0)}D`;

            students.push({
                id: currentId,
                name: `${lastName}, ${randomName}`,
                studentId: `25-${entryNum}${initials}`,
                program: programs[i % programs.length],
                type: types[i % 2], // Set to Regular or Irregular
                status: statuses[i % 3],
                avatar: null
            });
        }
        return students;
    };

    const generatedStudents = generateStudents(12, 39);

    return [...initialMockStudents, ...generatedStudents];
};

// --- NEW COMPONENTS FOR MODAL ---

// Component for the Manual Add form fields
// Component for the Manual Add form fields
const ManualAddForm = ({ programSections }) => {
    // NOTE: In a real app, you would manage the form state here and handle submission
    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', paddingTop: '16px' }}>
            {/* Last Name, First Name, Middle Name Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px' }}>
                <div style={{ gridColumn: 'span 1 / span 1' }}>
                    <label htmlFor="lastName" style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', color: '#374151' }}>Last Name</label>
                    <input
                        type="text"
                        id="lastName"
                        // Tailwind classes retained for focus/shadow utilities
                        className="block w-full rounded-lg border border-gray-300 shadow-sm p-2 text-sm focus:border-blue-500 focus:ring-blue-500"
                        style={{
                            marginTop: '4px',
                            padding: '8px',
                            fontSize: '0.875rem',
                            borderRadius: '8px',
                            border: '1px solid #d1d5db',
                            boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
                            width: '100%',
                            boxSizing: 'border-box'
                        }}
                        placeholder="e.g., Dela Cruz"
                    />
                </div>
                {/* First Name */}
                <div style={{ gridColumn: 'span 1 / span 1' }}>
                    <label htmlFor="firstName" style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', color: '#374151' }}>First Name</label>
                    <input
                        type="text"
                        id="firstName"
                        className="mt-1 block w-full rounded-lg border border-gray-300 shadow-sm p-2 text-sm focus:border-blue-500 focus:ring-blue-500"
                        style={{
                            marginTop: '4px',
                            padding: '8px',
                            fontSize: '0.875rem',
                            borderRadius: '8px',
                            border: '1px solid #d1d5db',
                            boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
                            width: '100%',
                            boxSizing: 'border-box'
                        }}
                        placeholder="e.g., Juan"
                    />
                </div>
                {/* Middle Name */}
                <div style={{ gridColumn: 'span 1 / span 1' }}>
                    <label htmlFor="middleName" style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', color: '#374151' }}>Middle Name</label>
                    <input
                        type="text"
                        id="middleName"
                        className="mt-1 block w-full rounded-lg border border-gray-300 shadow-sm p-2 text-sm focus:border-blue-500 focus:ring-blue-500"
                        style={{
                            marginTop: '4px',
                            padding: '8px',
                            fontSize: '0.875rem',
                            borderRadius: '8px',
                            border: '1px solid #d1d5db',
                            boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
                            width: '100%',
                            boxSizing: 'border-box'
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
                    className="mt-1 block w-full rounded-lg border border-gray-300 shadow-sm p-2 text-sm focus:border-blue-500 focus:ring-blue-500"
                    style={{
                        marginTop: '4px',
                        padding: '8px',
                        fontSize: '0.875rem',
                        borderRadius: '8px',
                        border: '1px solid #d1d5db',
                        boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
                        width: '100%',
                        boxSizing: 'border-box'
                    }}
                    placeholder="e.g., 25-00001JAD"
                />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '16px' }}>
                {/* Regular or Irregular Dropdown */}
                <div>
                    <label htmlFor="studentType" style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', color: '#374151' }}>Regular or Irregular</label>
                    <select
                        id="studentType"
                        className="mt-1 block w-full rounded-lg border border-gray-300 shadow-sm p-2 text-sm focus:border-blue-500 focus:ring-blue-500 bg-white"
                        style={{
                            marginTop: '4px',
                            padding: '8px',
                            fontSize: '0.875rem',
                            borderRadius: '8px',
                            border: '1px solid #d1d5db',
                            boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
                            width: '100%',
                            boxSizing: 'border-box',
                            backgroundColor: 'white'
                        }}
                    >
                        <option value="Regular">Regular</option>
                        <option value="Irregular">Irregular</option>
                    </select>
                </div>

                {/* Program Section Dropdown */}
                <div>
                    <label htmlFor="programSection" style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', color: '#374151' }}>Program / Section</label>
                    <select
                        id="programSection"
                        className="mt-1 block w-full rounded-lg border border-gray-300 shadow-sm p-2 text-sm focus:border-blue-500 focus:ring-blue-500 bg-white"
                        style={{
                            marginTop: '4px',
                            padding: '8px',
                            fontSize: '0.875rem',
                            borderRadius: '8px',
                            border: '1px solid #d1d5db',
                            boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
                            width: '100%',
                            boxSizing: 'border-box',
                            backgroundColor: 'white'
                        }}
                    >
                        {programSections.map(section => (
                            <option key={section} value={section}>{section}</option>
                        ))}
                    </select>
                </div>
            </div>

            {/* Save Button */}
            <div style={{ display: 'flex', justifyContent: 'flex-end', paddingTop: '16px' }}>
                <button
                    type="submit"
                    className="hover:bg-blue-700 transition-colors" // Retain hover transition
                    style={{
                        backgroundColor: '#2563eb', // bg-blue-600
                        color: 'white',
                        fontWeight: '500',
                        padding: '8px 16px', // py-2 px-4
                        borderRadius: '8px', // rounded-lg
                        fontSize: '0.875rem', // text-sm
                        border: 'none',
                        cursor: 'pointer'
                    }}
                >
                    Save Student
                </button>
            </div>
        </div>
    );
};

// Component for the Upload from CSV option
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
                className="hover:bg-gray-50" // Retain hover utility
                style={{
                    padding: '32px', // p-8
                    border: '2px dashed #d1d5db', // border border-dashed border-gray-300
                    borderRadius: '8px', // rounded-lg
                    backgroundColor: '#f9fafb', // bg-gray-50
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
                className="inline-flex items-center hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                style={{
                    padding: '8px 16px', // px-4 py-2
                    border: '1px solid #d1d5db',
                    boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)', // shadow-sm
                    fontSize: '0.875rem', // text-sm
                    fontWeight: '500', // font-medium
                    borderRadius: '8px', // rounded-lg
                    color: '#374151', // text-gray-700
                    backgroundColor: 'white', // bg-white
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer'
                }}
            >
                <Upload size={16} style={{ marginRight: '8px' }} />
                Browse Files
            </button>
        </div>
    );
};

// Main Modal Component
// Main Modal Component
const AddStudentModal = ({ isOpen, onClose, programSections }) => {
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

    // Retain Tailwind transition classes for animation effects
    const animationClass = isClosing
        ? 'animate-out fade-out slide-out-to-top-3' 
        : 'animate-in fade-in slide-in-from-top-3';

    return (
        <div 
            className={`fixed inset-0 z-50 flex items-center justify-center transition-opacity ${isClosing ? 'opacity-0' : 'opacity-100'} backdrop-blur-sm bg-black/50`}
            style={{
                backgroundColor: 'rgba(0, 0, 0, 0.3)', // Custom backdrop color/opacity
            }}
            onClick={handleClose}
        >
            {/* Modal Container */}
            <div
                className={`bg-white rounded-xl shadow-2xl w-full max-w-lg p-6 transform ${animationClass}`}
                onClick={(e) => e.stopPropagation()} 
                style={{
                    borderRadius: '12px',
                    boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
                    padding: '24px',
                    position: 'relative',
                    width: '100%',
                    maxWidth: '512px', // max-w-lg approximation
                    fontFamily: "inherit" // Use inherited Geist font
                }}
            >
                {/* Header */}
                <div 
                    style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: '16px', borderBottom: '1px solid #f3f4f6' }}
                >
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
                            className="border border-gray-300 rounded-xl p-6 text-center hover:shadow-lg transition-shadow hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            style={{ border: '1px solid #d1d5db', borderRadius: '12px', padding: '24px', textAlign: 'center', cursor: 'pointer', background: 'white' }}
                        >
                            <Plus size={24} style={{ margin: '0 auto', color: '#2563eb', marginBottom: '8px' }} />
                            <span style={{ fontWeight: '500', color: '#1f2937', fontSize: '0.875rem' }}>Manual Add</span>
                            <p style={{ fontSize: '0.75rem', color: '#6b7280', marginTop: '4px' }}>Enter student details one by one.</p>
                        </button>

                        {/* Option 2: Upload from CSV */}
                        <button
                            onClick={() => setMode('csv')}
                            className="border border-gray-300 rounded-xl p-6 text-center hover:shadow-lg transition-shadow hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            style={{ border: '1px solid #d1d5db', borderRadius: '12px', padding: '24px', textAlign: 'center', cursor: 'pointer', background: 'white' }}
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
                        <ManualAddForm programSections={programSections} />
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

// --- MAIN StudentList COMPONENT (MODIFIED) ---

const StudentList = () => {
    // --- CONFIGURATION ---
    const ITEMS_PER_PAGE = 13;

    // --- NEW STATE FOR MODAL ---
    const [isModalOpen, setIsModalOpen] = useState(false);
    // ---------------------------

    const [activeTab, setActiveTab] = useState('All');
    const [currentPage, setCurrentPage] = useState(1);
    const [searchTerm, setSearchTerm] = useState('');

    const allStudents = useMemo(() => generateData(), []);

    // Derive unique program sections for the dropdown
    const programSections = useMemo(() => {
        const programs = new Set(allStudents.map(s => s.program));
        return [...programs].sort(); // Sort for clean display
    }, [allStudents]);


    const tabs = [
        'All',
        'Preschool',
        'Primary Education',
        'Intermediate',
        'Junior High School',
        'Senior High School',
        'Higher Education'
    ];

    // --- HELPERS ---

    const getProgramHeaderLabel = () => {
        if (activeTab === 'All') return 'Program / Section';
        if (activeTab === 'Higher Education') return 'Programs';
        return 'Section';
    };

    const filteredStudents = allStudents.filter(student => {
        let matchesTab = true;
        if (activeTab !== 'All') {
            if (activeTab === 'Higher Education') matchesTab = student.program.includes('BS') || student.program.includes('BAB') || student.program.includes('AB');
            else if (activeTab === 'Preschool') matchesTab = student.program === 'Kinder';
            else matchesTab = student.program.includes('Grade');
        }

        const matchesSearch = student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            student.studentId.toLowerCase().includes(searchTerm.toLowerCase());

        return matchesTab && matchesSearch;
    });

    // Pagination Logic
    const totalPages = Math.ceil(filteredStudents.length / ITEMS_PER_PAGE);
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const currentData = filteredStudents.slice(startIndex, startIndex + ITEMS_PER_PAGE);

    const handlePageChange = (newPage) => {
        if (newPage >= 1 && newPage <= totalPages) {
            setCurrentPage(newPage);
        }
    };

    // Status Badge Component
    const StatusBadge = ({ status }) => {
        const styles = {
            Eligible: {
                backgroundColor: '#d1fae5', // bg-emerald-100
                color: '#047857', // text-emerald-700
                dotColor: '#10b981', // bg-emerald-500
            },
            Ineligible: {
                backgroundColor: '#fee2e2', // bg-red-100
                color: '#b91c1c', // text-red-700
                dotColor: '#ef4444', // bg-red-500
            },
            Waived: {
                backgroundColor: '#f3f4f6', // bg-gray-100
                color: '#4b5563', // text-gray-600
                dotColor: '#6b7280', // bg-gray-500
            }
        };

        const currentStyle = styles[status] || styles.Waived;
        const currentDotColor = currentStyle.dotColor;

        return (
            <span
                className="text-xs font-medium flex items-center w-fit"
                style={{
                    padding: '4px 12px',
                    borderRadius: 12,
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    backgroundColor: currentStyle.backgroundColor,
                    color: currentStyle.color,
                }}
            >
                <span
                    style={{
                        width: '6px',
                        height: '6px',
                        borderRadius: 12,
                        backgroundColor: currentDotColor,
                    }}
                ></span>
                {status}
            </span>
        );
    };

    return (
        <div className="w-full min-h-screen p-6 font-['Geist',sans-serif] text-gray-900">

            {/* --- NEW: Add Student Modal Component --- */}
            <AddStudentModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                programSections={programSections}
            />
            {/* ------------------------------------- */}


            {/* Top Navigation Tabs */}
            <div className="flex flex-wrap gap-2 mb-6" style={{ marginTop: 15, marginBottom: 15 }}>
                <div>
                    {tabs.map((tab) => (
                        <button
                            key={tab}
                            onClick={() => { setActiveTab(tab); setCurrentPage(1); }}
                            className={`hover:cursor-pointer text-xs font-medium transition-colors ${activeTab === tab
                                ? ''
                                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                }`}
                            style={{
                                padding: '10px 20px',
                                borderRadius: '12px',
                                backgroundImage: activeTab === tab
                                    ? 'linear-gradient(to bottom, #4268BD, #3F6AC9)'
                                    : undefined,
                                color: activeTab === tab ? 'white' : undefined,
                                transitionProperty: 'color, background-color, border-color, text-decoration-color, fill, stroke, opacity, box-shadow, transform, filter, backdrop-filter',
                                transitionTimingFunction: 'cubic-bezier(0.4, 0, 0.2, 1)',
                                transitionDuration: '150ms',
                                marginRight: 10
                            }}
                        >
                            {tab}
                        </button>
                    ))}
                </div>
                {/* --- MODIFIED: Add Student Button to Open Modal --- */}
                <button
                    onClick={() => setIsModalOpen(true)}
                    className="ml-auto hover:bg-blue-700 text-sm font-medium flex items-center shadow-sm"
                    style={{
                        marginLeft: 'auto',
                        backgroundColor: '#2563eb',
                        color: 'white',
                        padding: '10px 20px',
                        borderRadius: 12,
                        fontSize: '0.875rem',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
                    }}
                >
                    <Plus size={16} />
                    Add Student
                </button>
                {/* ---------------------------------------------------- */}
            </div>

            {/* Main Card */}
            <div className="bg-white rounded-md shadow-sm border border-gray-200 overflow-hidden">

                {/* Header Section */}
                <div className="p-6 border-b border-gray-100">
                    <div className="flex justify-between items-start" style={{ marginBottom: 12, marginTop: 12, }}>
                        <div style={{ paddingLeft: 20 }}>
                            <h1 className="font-geist font-semibold text-gray-900" style={{ fontSize: 16 }}>All Students List</h1>
                            <p className="font-geist text-gray-500" style={{ fontSize: 13 }}>Manage students' eligibility</p>
                        </div>
                        <div className="text-right" style={{ paddingRight: 20 }}>
                            <span className="font-geist font-semibold" style={{ fontSize: 14 }}>Total Students: </span>
                            <span className="font-geist font-bold text-gray-900" style={{ fontSize: 18 }}>{allStudents.length}</span>
                        </div>
                    </div>
                    <hr className="w-full" />

                    {/* Controls */}
                    <div className="flex gap-4 items-center justify-between" style={{ marginTop: 4, marginBottom: 4 }}>
                        <div className="relative flex-1 max-w-md flex-row" style={{ marginLeft: 10 }}>
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-600" size={14} />
                            <input
                                type="text"
                                placeholder="Search"
                                className="w-full text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                                style={{
                                    width: '100%',
                                    paddingLeft: '40px',
                                    paddingRight: '16px',
                                    paddingTop: '4px',
                                    paddingBottom: '4px',
                                    backgroundColor: '#F0F1F6',
                                    border: 'none',
                                    borderRadius: '8px',
                                    fontSize: 14,
                                    fontFamily: "geist"
                                }}
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                        <div className="flex gap-2 ml-auto">
                            <button
                                className="text-sm font-medium text-gray-600 flex items-center hover:bg-gray-200"
                                style={{
                                    padding: '8px 12px',
                                    backgroundColor: '#f3f4f6',
                                    borderRadius: '8px',
                                    fontSize: 12,
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '8px',
                                }}
                            >
                                July 21, 2025 <Calendar size={12} />
                            </button>
                            <button
                                className="hover:cursor-pointer hover:bg-gray-100 text-sm font-medium text-gray-600 flex items-center gap-2"
                                style={{
                                    padding: '8px 12px',
                                    borderRadius: '8px',
                                    fontSize: 12,
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '2',
                                }}
                            >
                                <Filter size={12} /> Filter by Status
                            </button>
                        </div>
                    </div>
                    <hr className="w-full" />
                </div>

                {/* Table */}
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead className="bg-gray-50/50 h-[5vh]">
                            <tr>
                                <th style={{ fontSize: 12 }} className="font-geist py-3 px-6 font-medium text-gray-500 w-16"></th>
                                <th style={{ fontSize: 12 }} className="font-geist py-3 px-6 font-medium text-gray-500">Student Name</th>
                                <th style={{ fontSize: 12 }} className="font-geist py-3 px-3 font-medium text-gray-500">Student ID</th>
                                <th style={{ fontSize: 12 }} className="font-geist py-3 px-6 font-medium text-gray-500 w-30">Link</th>
                                <th style={{ fontSize: 12 }} className="font-geist py-3 px-6 font-medium text-gray-500">
                                    {getProgramHeaderLabel()}
                                </th>
                                <th style={{ fontSize: 12 }} className="font-geist py-3 px-6 font-medium text-gray-500">Regular/Irregular</th>
                                <th style={{ fontSize: 12 }} className="font-geist py-3 px-6 font-medium text-gray-500">Status</th>
                            </tr>
                        </thead>

                        <tbody className="divide-y divide-gray-100">
                            {currentData.map((student, index) => (
                                <tr key={student.id} className="hover:bg-gray-50/80 transition-colors group">
                                    <td className="font-geist text-black flex items-center justify-center" style={{ paddingTop: '10px', paddingBottom: '10px', fontSize: 13 }}>
                                        {startIndex + index + 1}
                                    </td>
                                    <td className="py-4 px-6">
                                        <div className="flex items-center gap-3" style={{ paddingLeft: 5 }}>
                                            <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden text-gray-500">
                                                <User size={16} />
                                            </div>
                                            <span style={{ fontSize: 12, fontWeight: 450 }} className="font-geist text-black">{student.name}</span>
                                        </div>
                                    </td>
                                    <td style={{ fontSize: 12, paddingLeft: 5 }} className="font-geist py-4 px-3 text-black">{student.studentId}</td>
                                    <td style={{ fontSize: 12, paddingLeft: 5 }} className="font-geist py-4 px-6 text-blue-600 underline cursor-pointer"></td>
                                    <td style={{ fontSize: 12, paddingLeft: 5 }} className="font-geist py-4 px-6 text-black">{student.program}</td>
                                    <td style={{ fontSize: 12, paddingLeft: 5 }} className="font-geist py-4 px-6 text-black text-left">{student.type}</td>
                                    <td style={{ fontSize: 12, paddingLeft: 5 }} className="font-geist py-4 px-6">
                                        <StatusBadge status={student.status} />
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Pagination Footer */}
                <div
                    className="p-4 border-t border-gray-100 flex items-center justify-center gap-2"
                    style={{
                        padding: '16px',
                        borderTop: '1px solid #f3f4f6',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '8px',
                    }}
                >
                    <button
                        onClick={() => handlePageChange(currentPage - 1)}
                        disabled={currentPage === 1}
                        className="flex items-center gap-1 text-sm font-medium text-gray-600 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                        style={{
                            padding: '8px 12px',
                            borderRadius: '6px',
                        }}
                    >
                        <ChevronLeft size={16} /> Previous
                    </button>

                    {/* Simple Page Numbers */}
                    {[...Array(Math.min(3, totalPages))].map((_, i) => (
                        <button
                            key={i}
                            onClick={() => handlePageChange(i + 1)}
                            className={`w-8 h-8 rounded-md text-sm font-medium flex items-center justify-center ${currentPage === i + 1
                                ? 'bg-gray-900 text-white'
                                : 'text-gray-600 hover:bg-gray-100'
                                }`}
                            style={{
                                width: '32px',
                                height: '32px',
                                borderRadius: '6px',
                            }}
                        >
                            {i + 1}
                        </button>
                    ))}
                    {totalPages > 3 && <span className="text-gray-400">...</span>}

                    <button
                        onClick={() => handlePageChange(currentPage + 1)}
                        disabled={currentPage === totalPages}
                        className="text-sm font-medium text-gray-600 hover:bg-gray-100 bg-gray-100 flex items-center gap-1"
                        style={{
                            padding: '8px 12px',
                            borderRadius: '6px',
                        }}
                    >
                        Next <ChevronRight size={16} />
                    </button>
                </div>

            </div>
        </div>
    );
};

export { StudentList };