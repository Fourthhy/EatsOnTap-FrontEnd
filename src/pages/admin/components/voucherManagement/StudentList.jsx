// StudentList.jsx

import React, { useState, useMemo } from 'react';
import { Search, Calendar, Filter, ChevronLeft, ChevronRight, Plus, User } from 'lucide-react';
import { generateData } from './mockData';
import { AddStudentModal, LinkIDModal } from './AddStudentModal'; // Import both modals

const StudentList = () => {
    // --- CONFIGURATION ---
    const ITEMS_PER_PAGE = 13;

    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [isLinkModalOpen, setIsLinkModalOpen] = useState(false); // NEW STATE
    const [studentToLink, setStudentToLink] = useState(null);       // NEW STATE
    
    const [activeTab, setActiveTab] = useState('All');
    const [currentPage, setCurrentPage] = useState(1);
    const [searchTerm, setSearchTerm] = useState('');

    const allStudents = useMemo(() => generateData(), []);

    // Derive unique program sections for the dropdown
    const programSections = useMemo(() => {
        const programs = new Set(allStudents.map(s => s.program));
        return [...programs].sort(); 
    }, [allStudents]);

    const tabs = [
        'All', 'Preschool', 'Primary Education', 'Intermediate',
        'Junior High School', 'Senior High School', 'Higher Education'
    ];

    // --- NEW LINKING HANDLERS ---
    const handleOpenLinkModal = (student) => {
        setStudentToLink(student);
        setIsLinkModalOpen(true);
    };

    const handleCloseLinkModal = () => {
        setIsLinkModalOpen(false);
        setStudentToLink(null);
    };

    // --- HELPERS (Keep the existing getProgramHeaderLabel, isGradeLevel, isHigherEducation, filteredStudents, etc.) ---
    
    const getProgramHeaderLabel = () => {
        if (activeTab === 'All') return 'Program / Section';
        if (activeTab === 'Higher Education') return 'Programs';
        return 'Section';
    };

    const isGradeLevel = (program, min, max) => {
        const match = program.match(/Grade (\d+)/);
        if (match) {
            const grade = parseInt(match[1], 10);
            return grade >= min && grade <= max;
        }
        return false;
    };

    const isHigherEducation = (program) => {
        return program.startsWith('BS') || program.startsWith('BAB') || program.startsWith('AB');
    };
    
    const filteredStudents = allStudents.filter(student => {
        let matchesTab = true;
        const program = student.program;

        if (activeTab !== 'All') {
            switch (activeTab) {
                case 'Preschool':
                    matchesTab = program.includes('Kinder');
                    break;
                case 'Primary Education':
                case 'Intermediate':
                    matchesTab = isGradeLevel(program, 1, 6);
                    break;
                case 'Junior High School':
                    matchesTab = isGradeLevel(program, 7, 10);
                    break;
                case 'Senior High School':
                    matchesTab = isGradeLevel(program, 11, 12);
                    break;
                case 'Higher Education':
                    matchesTab = isHigherEducation(program);
                    break;
                default:
                    matchesTab = false;
            }
        }

        const matchesSearch = student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            student.studentId.toLowerCase().includes(searchTerm.toLowerCase());

        return matchesTab && matchesSearch;
    });

    const totalPages = Math.ceil(filteredStudents.length / ITEMS_PER_PAGE);
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const currentData = filteredStudents.slice(startIndex, startIndex + ITEMS_PER_PAGE);

    const handlePageChange = (newPage) => {
        if (newPage >= 1 && newPage <= totalPages) {
            setCurrentPage(newPage);
        }
    };

    // Status Badge Component (for Eligibility)
    const StatusBadge = ({ status }) => {
        const styles = {
            Eligible: { backgroundColor: '#d1fae5', color: '#047857', dotColor: '#10b981' },
            Ineligible: { backgroundColor: '#fee2e2', color: '#b91c1c', dotColor: '#ef4444' },
            Waived: { backgroundColor: '#f3f4f6', color: '#4b5563', dotColor: '#6b7280' }
        };

        const currentStyle = styles[status] || styles.Waived;
        const currentDotColor = currentStyle.dotColor;

        return (
            <span
                className="text-xs font-medium flex items-center w-fit"
                style={{
                    padding: '4px 12px', borderRadius: 12, display: 'flex', alignItems: 'center',
                    gap: '6px', backgroundColor: currentStyle.backgroundColor, color: currentStyle.color,
                }}
            >
                <span
                    style={{ width: '6px', height: '6px', borderRadius: 12, backgroundColor: currentDotColor }}
                ></span>
                {status}
            </span>
        );
    };

    // NEW: Link Status Component
    const LinkStatusBadge = ({ isLinked, student }) => {
        // Linked uses Eligible design, Unlinked uses Ineligible design
        const status = isLinked ? 'Linked' : 'Unlinked';
        
        const styles = {
            Linked: { 
                backgroundColor: '#d1fae5', 
                color: '#047857', 
                dotColor: '#10b981', 
                text: 'Linked' 
            },
            Unlinked: { 
                backgroundColor: '#fee2e2', 
                color: '#b91c1c', 
                dotColor: '#ef4444', 
                text: 'Unlinked' 
            }
        };

        const currentStyle = styles[status];

        return (
            <span
                onClick={() => !isLinked && handleOpenLinkModal(student)}
                className={`text-xs font-medium flex items-center w-fit transition-all ${!isLinked ? 'cursor-pointer hover:bg-red-200 hover:text-red-800' : ''}`}
                style={{
                    padding: '4px 12px', borderRadius: 12, display: 'flex', alignItems: 'center',
                    gap: '6px', backgroundColor: currentStyle.backgroundColor, color: currentStyle.color,
                }}
            >
                <span style={{ width: '6px', height: '6px', borderRadius: 12, backgroundColor: currentStyle.dotColor }}></span>
                {/* Dynamic Text on Hover */}
                <span className={`${!isLinked ? 'group-hover:hidden inline' : ''}`}>
                    {currentStyle.text}
                </span>
                <span className={`hidden ${!isLinked ? 'group-hover:inline' : ''}`} style={{ fontWeight: 600 }}>
                    Link ID now
                </span>
            </span>
        );
    };


    return (
        <div className="w-full min-h-screen p-6 font-['Geist',sans-serif] text-gray-900">

            {/* --- MODALS --- */}
            <AddStudentModal
                isOpen={isAddModalOpen}
                onClose={() => setIsAddModalOpen(false)}
                programSections={programSections}
            />
             {studentToLink && (
                <LinkIDModal
                    isOpen={isLinkModalOpen}
                    onClose={handleCloseLinkModal}
                    student={studentToLink}
                />
            )}
            {/* -------------- */}


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
                                padding: '10px 20px', borderRadius: '12px',
                                backgroundImage: activeTab === tab ? 'linear-gradient(to bottom, #4268BD, #3F6AC9)' : undefined,
                                color: activeTab === tab ? 'white' : undefined,
                                transitionProperty: 'color, background-color, border-color, text-decoration-color, fill, stroke, opacity, box-shadow, transform, filter, backdrop-filter',
                                transitionTimingFunction: 'cubic-bezier(0.4, 0, 0.2, 1)', transitionDuration: '150ms', marginRight: 10
                            }}
                        >
                            {tab}
                        </button>
                    ))}
                </div>
                
                <button
                    onClick={() => setIsAddModalOpen(true)}
                    className="ml-auto hover:bg-blue-700 text-sm font-medium flex items-center shadow-sm"
                    style={{
                        marginLeft: 'auto', backgroundColor: '#2563eb', color: 'white',
                        padding: '10px 20px', borderRadius: 12, fontSize: '0.875rem',
                        display: 'flex', alignItems: 'center', gap: '8px',
                        boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
                    }}
                >
                    <Plus size={16} />
                    Add Student
                </button>
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
                                    width: '100%', paddingLeft: '40px', paddingRight: '16px', paddingTop: '4px',
                                    paddingBottom: '4px', backgroundColor: '#F0F1F6', border: 'none', borderRadius: '8px',
                                    fontSize: 14, fontFamily: "geist"
                                }}
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                        <div className="flex gap-2 ml-auto">
                            <button
                                className="text-sm font-medium text-gray-600 flex items-center hover:bg-gray-200"
                                style={{
                                    padding: '8px 12px', backgroundColor: '#f3f4f6', borderRadius: '8px',
                                    fontSize: 12, display: 'flex', alignItems: 'center', gap: '8px',
                                }}
                            >
                                July 21, 2025 <Calendar size={12} />
                            </button>
                            <button
                                className="hover:cursor-pointer hover:bg-gray-100 text-sm font-medium text-gray-600 flex items-center gap-2"
                                style={{
                                    padding: '8px 12px', borderRadius: '8px', fontSize: 12,
                                    display: 'flex', alignItems: 'center', gap: '2',
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
                                <th style={{ fontSize: 12 }} className="font-geist py-3 px-6 font-medium text-gray-500">{getProgramHeaderLabel()}</th>
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
                                        <td style={{ fontSize: 12 }} className="font-geist py-4 px-3 text-black">{student.studentId}</td>
                                        
                                        {/* UPDATED: Link Status Column */}
                                        <td style={{ fontSize: 12 }} className="font-geist py-4 px-6">
                                            <LinkStatusBadge isLinked={student.isLinked} student={student} />
                                        </td>
                                        
                                        <td style={{ fontSize: 12 }} className="font-geist py-4 px-6 text-black">{student.program}</td>
                                        <td style={{ fontSize: 12 }} className="font-geist py-4 px-6 text-black text-left">{student.type}</td>
                                        <td style={{ fontSize: 12 }} className="font-geist py-4 px-6">
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
                        padding: '16px', borderTop: '1px solid #f3f4f6', display: 'flex',
                        alignItems: 'center', justifyContent: 'center', gap: '8px',
                    }}
                >
                    <button
                        onClick={() => handlePageChange(currentPage - 1)}
                        disabled={currentPage === 1}
                        className="flex items-center gap-1 text-sm font-medium text-gray-600 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                        style={{ padding: '8px 12px', borderRadius: '6px' }}
                    >
                        <ChevronLeft size={16} /> Previous
                    </button>

                    {[...Array(Math.min(3, totalPages))].map((_, i) => (
                        <button
                            key={i}
                            onClick={() => handlePageChange(i + 1)}
                            className={`w-8 h-8 rounded-md text-sm font-medium flex items-center justify-center ${currentPage === i + 1
                                ? 'bg-gray-900 text-white'
                                : 'text-gray-600 hover:bg-gray-100'
                                }`}
                            style={{ width: '32px', height: '32px', borderRadius: '6px' }}
                        >
                            {i + 1}
                        </button>
                    ))}
                    {totalPages > 3 && <span className="text-gray-400">...</span>}

                    <button
                        onClick={() => handlePageChange(currentPage + 1)}
                        disabled={currentPage === totalPages}
                        className="text-sm font-medium text-gray-600 hover:bg-gray-100 bg-gray-100 flex items-center gap-1"
                        style={{ padding: '8px 12px', borderRadius: '6px' }}
                    >
                        Next <ChevronRight size={16} />
                    </button>
                </div>

            </div>
        </div>
    );
};

export { StudentList };