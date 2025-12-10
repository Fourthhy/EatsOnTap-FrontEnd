// StudentList.jsx

import React, { useState, useMemo, useEffect, useRef } from 'react';
import { Search, Calendar, Filter, ChevronLeft, ChevronRight, Check, X, User } from 'lucide-react';
import { IoGrid } from "react-icons/io5";
import { generateData } from './mockData';
// import { AddStudentModal, LinkIDModal } from './AddStudentModal'; // Commented out modals for clean build

// --- CONFIGURATION ---
const MIN_ITEMS = 4;
const MAX_ITEMS = 13;
const ITEM_HEIGHT_ESTIMATE_PX = 45;

// --- REUSABLE SUB-COMPONENTS ---

// 1. Repurposed Status Badge for Claim Status
const ClaimStatusBadge = ({ isClaimed }) => {
    // Reuses the styles from Linked/Unlinked (Eligible/Ineligible)
    const status = isClaimed ? 'Claimed' : 'Unclaimed';

    const styles = {
        Claimed: { backgroundColor: '#d1fae5', color: '#047857', dotColor: '#10b981', text: 'Claimed' }, // Green/Linked style
        Unclaimed: { backgroundColor: '#fee2e2', color: '#b91c1c', dotColor: '#ef4444', text: 'Unclaimed' } // Red/Unlinked style
    };

    const currentStyle = styles[status];

    return (
        <span
            // Removed onClick and hover class names as per instruction
            className="text-xs font-medium"
            style={{
                padding: '4px 12px', borderRadius: 12, display: 'flex', alignItems: 'center',
                gap: '6px', backgroundColor: currentStyle.backgroundColor, color: currentStyle.color,
                width: 'fit-content'
            }}
        >
            <span style={{ width: '6px', height: '6px', borderRadius: 12, backgroundColor: currentStyle.dotColor }}></span>
            <span>{currentStyle.text}</span>
        </span>
    );
};

// 2. Generic Avatar
const Avatar = () => (
    <div style={{
        width: 32, height: 32, borderRadius: 9999, // rounded-full
        backgroundColor: '#e5e7eb', // bg-gray-200
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        overflow: 'hidden', color: '#6b7280', // text-gray-500
        marginRight: 12 // gap-3 converted to marginRight for inline cell
    }}>
        <User size={16} />
    </div>
);


const MealClaimRecordsTable = () => {

    // --- STATE ---
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [isLinkModalOpen, setIsLinkModalOpen] = useState(false);
    const [studentToLink, setStudentToLink] = useState(null);

    const [activeTab, setActiveTab] = useState('All');
    const [currentPage, setCurrentPage] = useState(1);
    const [searchTerm, setSearchTerm] = useState('');

    // Dynamic Pagination State
    const [itemsPerPage, setItemsPerPage] = useState(MAX_ITEMS);

    // Refs for height calculation
    const tableWrapperRef = useRef(null);

    const allStudents = useMemo(() => generateData(), []);

    // --- HEIGHT CALCULATION LOGIC ---
    useEffect(() => {
        const wrapper = tableWrapperRef.current;
        if (!wrapper) return;

        const observer = new ResizeObserver(entries => {
            const entry = entries[0];
            const containerHeight = entry.contentRect.height;

            // Subtract Table Header Height (approx 45px)
            const availableSpace = containerHeight - 45;

            // Calculate items that fit
            const calculatedItems = Math.floor(availableSpace / ITEM_HEIGHT_ESTIMATE_PX);

            // Apply constraints (Min 4, Max 13)
            const newItemsPerPage = Math.max(MIN_ITEMS, Math.min(MAX_ITEMS, calculatedItems));

            setItemsPerPage(prev => {
                if (prev !== newItemsPerPage) {
                    // Reset to page 1 to avoid out-of-bounds errors on resize
                    setCurrentPage(1);
                    return newItemsPerPage;
                }
                return prev;
            });
        });

        observer.observe(wrapper);
        return () => observer.disconnect();
    }, []);


    // Derive unique program sections for the dropdown
    const programSections = useMemo(() => {
        const programs = new Set(allStudents.map(s => s.program));
        return [...programs].sort();
    }, [allStudents]);

    const tabs = [
        'All', 'Preschool', 'Primary Education', 'Intermediate',
        'Junior High School', 'Senior High School', 'Higher Education'
    ];

    // --- HANDLERS ---
    const handleOpenLinkModal = (student) => {
        setStudentToLink(student);
        setIsLinkModalOpen(true);
    };

    const handleCloseLinkModal = () => {
        setIsLinkModalOpen(false);
        setStudentToLink(null);
    };

    // --- FILTERS & DATA ---
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
                case 'Preschool': matchesTab = program.includes('Kinder'); break;
                case 'Primary Education':
                case 'Intermediate': matchesTab = isGradeLevel(program, 1, 6); break;
                case 'Junior High School': matchesTab = isGradeLevel(program, 7, 10); break;
                case 'Senior High School': matchesTab = isGradeLevel(program, 11, 12); break;
                case 'Higher Education': matchesTab = isHigherEducation(program); break;
                default: matchesTab = false;
            }
        }

        const matchesSearch = student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            student.studentId.toLowerCase().includes(searchTerm.toLowerCase());

        return matchesTab && matchesSearch;
    });

    const totalPages = Math.ceil(filteredStudents.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const currentData = filteredStudents.slice(startIndex, startIndex + itemsPerPage);

    // Safety check for pagination index
    useEffect(() => {
        if (currentPage > totalPages && totalPages > 0) {
            setCurrentPage(1);
        }
    }, [totalPages, currentPage]);

    const handlePageChange = (newPage) => {
        if (newPage >= 1 && newPage <= totalPages) {
            setCurrentPage(newPage);
        }
    };

    // --- RENDER ---
    return (
        // Changed from min-h-screen to h-screen flex flex-col to bound the height
        <div className="w-full h-[calc(100vh-90px)] flex flex-col p-6 font-['Geist',sans-serif] text-gray-900 overflow-hidden">

            {/* --- MODALS --- (Kept structure commented out) */}
            {/* <AddStudentModal ... /> */}
            {/* {studentToLink && ( <LinkIDModal ... /> )} */}

            {/* Top Navigation Tabs (Fixed Height) */}
            <div className="flex flex-wrap gap-2 mb-6 shrink-0" style={{ marginTop: 15, marginBottom: 15 }}>
                <div className="flex flex-wrap gap-1">
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
                        marginLeft: 'auto', backgroundImage: 'linear-gradient(to right, #4268BD, #3F6AC9)', color: 'white',
                        padding: '10px 20px', borderRadius: 12, fontSize: '0.875rem',
                        display: 'flex', alignItems: 'center', gap: '8px',
                        boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
                    }}
                >
                    <IoGrid size={16} />
                    View Weekly Claims
                </button>
            </div>

            {/* Main Card (Flex Grow to fill space) */}
            <div className="bg-white rounded-md shadow-sm border border-gray-200 flex flex-col flex-1 min-h-0 overflow-hidden">

                {/* Header Section (Fixed Height) */}
                <div className="p-6 border-b border-gray-100 shrink-0">
                    <div className="flex justify-between items-center" style={{ marginBottom: 12, marginTop: 12, }}>
                        <div style={{ paddingLeft: 20 }}>
                            <h1 className="font-geist font-semibold text-gray-900" style={{ fontSize: 16 }}>All Meal Claim Records</h1>
                            <p className="font-geist text-gray-500" style={{ fontSize: 13 }}>This table is about students' history of meal claiming.</p>
                        </div>
                        <div className="w-auto flex flex-row items-center h-full">
                            <div className="text-right" style={{ paddingRight: 30 }}>
                                <span className="font-geist font-semibold text-[#037847]" style={{ fontSize: 14 }}>Eligible: </span>
                                <span className="font-geist font-bold text-[#037847]" style={{ fontSize: 16 }}>{filteredStudents.length}</span>
                            </div>
                            <div className="text-right" style={{ paddingRight: 30 }}>
                                <span className="font-geist font-semibold text-[#8B0000]" style={{ fontSize: 14 }}>Ineligible: </span>
                                <span className="font-geist font-bold text-[#8B0000]" style={{ fontSize: 16 }}>{filteredStudents.length}</span>
                            </div>
                            <div className="text-right" style={{ paddingRight: 20 }}>
                                <span className="font-geist font-semibold" style={{ fontSize: 14 }}>Total Claims: </span>
                                <span className="font-geist font-bold text-gray-900" style={{ fontSize: 16 }}>{filteredStudents.length}</span>
                            </div>
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

                {/* Table Section (Flexible Height) */}
                <div
                    ref={tableWrapperRef}
                    className="flex-1 overflow-y-hidden w-full"
                >
                    <table className="w-full text-left border-collapse">
                        <thead className="bg-gray-50/50 sticky top-0 z-10" style={{ height: '45px' }}>
                            {/* HYDRATION FIX: Remove whitespace/line breaks inside <thead> */}
                            <tr>
                                <th style={{ fontSize: 12 }} className="font-geist py-3 px-6 font-medium text-gray-500 w-16"></th>
                                <th style={{ fontSize: 12 }} className="font-geist py-3 px-6 font-medium text-gray-500">Student Name</th>
                                <th style={{ fontSize: 12 }} className="font-geist py-3 px-3 font-medium text-gray-500">Student ID</th>
                                <th style={{ fontSize: 12 }} className="font-geist py-3 px-6 font-medium text-gray-500">Program/Section</th>
                                {/* NEW COLUMNS START */}
                                <th style={{ fontSize: 12 }} className="font-geist py-3 px-6 font-medium text-gray-500">Claim Time</th>
                                <th style={{ fontSize: 12 }} className="font-geist py-3 px-6 font-medium text-gray-500">Status</th>
                                <th style={{ fontSize: 12 }} className="font-geist py-3 px-6 font-medium text-gray-500">Meal Type Claim</th>
                                <th style={{ fontSize: 12 }} className="font-geist py-3 px-6 font-medium text-gray-500">Value Claimed</th>
                                {/* NEW COLUMNS END */}
                            </tr>
                        </thead>

                        <tbody className="divide-y divide-gray-100">
                            {currentData.map((student, index) => {
                                // MOCK NEW DATA FIELDS
                                const isClaimed = index % 3 === 0;
                                const claimTime = (index % 4) === 0 ? '11:00 AM' : '12:30 PM';
                                const mealType = (index % 2) === 0 ? 'Customized Order' : 'Pre-Packed Food';

                                return (
                                    <tr key={student.id} className="hover:bg-gray-50/80 transition-colors group" style={{ height: ITEM_HEIGHT_ESTIMATE_PX }}>
                                        {/* 1. INDEX */}
                                        <td className="font-geist text-black flex items-center justify-center" style={{ paddingTop: '10px', paddingBottom: '10px', fontSize: 13, height: '100%' }}>
                                            {startIndex + index + 1}
                                        </td>

                                        {/* 2. STUDENT NAME */}
                                        <td className="py-4 px-6">
                                            <div style={{ paddingLeft: 5, display: 'flex', alignItems: 'center', gap: 12 }}> {/* 12px gap for avatar/text */}
                                                <Avatar />
                                                <span style={{ fontSize: 12, fontWeight: 450, fontFamily: "geist", color: "black" }}>{student.name}</span>
                                            </div>
                                        </td>

                                        {/* 3. STUDENT ID */}
                                        <td style={{ fontSize: 12, fontFamily: "geist", color: "black" }}>{student.studentId}</td>

                                        {/* 4. PROGRAM/SECTION */}
                                        <td style={{ fontSize: 12, fontFamily: "geist", color: "black" }}>{student.program}</td>

                                        {/* 5. CLAIM TIME (NEW) */}
                                        <td style={{ fontSize: 12, fontFamily: "geist", color: "black" }}>{claimTime}</td>

                                        {/* 6. STATUS (NEW - Claimed/Unclaimed) */}
                                        <td style={{ fontSize: 12 }} className="font-geist py-4 px-6">
                                            <ClaimStatusBadge isClaimed={isClaimed} />
                                        </td>

                                        {/* 7. MEAL TYPE CLAIM (NEW) */}
                                        <td style={{ fontSize: 12, fontFamily: "geist", color: "black" }}>{mealType}</td>

                                        {/* 8. VALUE CLAIMED (NEW) */}
                                        <td style={{ fontSize: 12, fontFamily: "geist", color: "black" }}>P60</td>
                                    </tr>
                                );
                            })}
                            {/* Padding Rows to keep layout stable */}
                            {currentData.length < itemsPerPage && Array(itemsPerPage - currentData.length).fill(0).map((_, i) => (
                                <tr key={`pad-${i}`} style={{ height: ITEM_HEIGHT_ESTIMATE_PX }}>
                                    <td colSpan="8"></td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Pagination Footer (Fixed Height) */}
                <div
                    className="p-4 border-t border-gray-100 flex items-center justify-center gap-2 shrink-0 bg-white"
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

export { MealClaimRecordsTable };