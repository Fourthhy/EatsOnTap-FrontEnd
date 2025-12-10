// MealClaimRecordsTable.jsx (Updated with Comprehensive Search)

import React, { useState, useMemo, useEffect, useRef } from 'react';
import { Search, Calendar, Filter, ChevronLeft, ChevronRight, Check, X, User } from 'lucide-react';
import { IoGrid } from "react-icons/io5";
import { generateData } from './mockData'; 
// Assuming generateData and mockData are available globally or imported correctly

// --- CONFIGURATION ---
const MIN_ITEMS = 4;
const MAX_ITEMS = 13;
const ITEM_HEIGHT_ESTIMATE_PX = 45; 

// --- REUSABLE SUB-COMPONENTS (Kept for completeness) ---

// 1. Claim Status Badge
const ClaimStatusBadge = ({ isClaimed }) => {
    const status = isClaimed ? 'Claimed' : 'Unclaimed';
    const styles = {
        Claimed: { backgroundColor: '#d1fae5', color: '#047857', dotColor: '#10b981', text: 'Claimed' },
        Unclaimed: { backgroundColor: '#fee2e2', color: '#b91c1c', dotColor: '#ef4444', text: 'Unclaimed' }
    };
    const currentStyle = styles[status];
    return (
        <span
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
        width: 32, height: 32, borderRadius: 9999, 
        backgroundColor: '#e5e7eb', 
        color: '#6b7280', 
        display: 'flex', alignItems: 'center', justifyContent: 'center', 
        overflow: 'hidden', 
        marginRight: 12 
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

    // NOTE: generateData() is assumed to return the base student list. 
    // We enhance it here to include the new required fields for searching.
    const baseStudents = useMemo(() => generateData(), []);

    const allStudents = useMemo(() => {
        // Enhance data with the new claim fields for searching and display
        return baseStudents.map((student, index) => ({
            ...student,
            isClaimed: index % 3 === 0,
            claimTime: (index % 4) === 0 ? '11:00 AM' : '12:30 PM',
            mealTypeClaim: (index % 2) === 0 ? 'Customized Order' : 'Pre-Packed Food',
            valueClaimed: 'P60' // Static as per request
        }));
    }, [baseStudents]);


    // --- HEIGHT CALCULATION LOGIC ---
    useEffect(() => {
        const wrapper = tableWrapperRef.current;
        if (!wrapper) return;

        const observer = new ResizeObserver(entries => {
            const entry = entries[0];
            const containerHeight = entry.contentRect.height;
            const availableSpace = containerHeight - 45;
            const calculatedItems = Math.floor(availableSpace / ITEM_HEIGHT_ESTIMATE_PX);
            const newItemsPerPage = Math.max(MIN_ITEMS, Math.min(MAX_ITEMS, calculatedItems));

            setItemsPerPage(prev => {
                if (prev !== newItemsPerPage) {
                    setCurrentPage(1); 
                    return newItemsPerPage;
                }
                return prev;
            });
        });

        observer.observe(wrapper);
        return () => observer.disconnect();
    }, []);

    const tabs = [
        'All', 'Preschool', 'Primary Education', 'Intermediate',
        'Junior High School', 'Senior High School', 'Higher Education'
    ];

    // --- FILTERS & DATA (UPDATED FOR MULTI-FIELD SEARCH) ---
    
    const filteredStudents = useMemo(() => {
        const lowerCaseSearch = searchTerm.toLowerCase();

        return allStudents.filter(student => {
            // 1. Tab filtering logic (kept original logic structure for context)
            let matchesTab = true;
            // ... (Tab filtering logic unchanged)
            const program = student.program;

            if (activeTab !== 'All') {
                switch (activeTab) {
                    case 'Preschool': matchesTab = program.includes('Kinder'); break;
                    case 'Primary Education':
                    case 'Intermediate': matchesTab = (student.type === 'Regular' || student.type === 'Irregular'); break; // Simplified filter
                    case 'Junior High School': matchesTab = (student.type === 'Regular' || student.type === 'Irregular'); break; // Simplified filter
                    case 'Senior High School': matchesTab = (student.type === 'Regular' || student.type === 'Irregular'); break; // Simplified filter
                    case 'Higher Education': matchesTab = (student.type === 'Regular' || student.type === 'Irregular'); break; // Simplified filter
                    default: matchesTab = false;
                }
            }


            // 2. MULTI-FIELD SEARCH LOGIC
            const searchFields = [
                student.name, 
                student.studentId, 
                student.program, 
                student.claimTime, 
                student.isClaimed ? 'claimed' : 'unclaimed', // Searchable status text
                student.mealTypeClaim, 
                student.valueClaimed
            ];

            const matchesSearch = searchFields.some(field => 
                field && field.toLowerCase().includes(lowerCaseSearch)
            );

            return matchesTab && matchesSearch;
        });
    }, [allStudents, searchTerm, activeTab]); // Depend on allStudents (which includes new data fields)

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
        <div style={{
            width: '100%',
            height: 'calc(100vh - 90px)',
            display: 'flex',
            flexDirection: 'column',
            padding: 10,
            fontFamily: "'Geist', sans-serif",
            color: '#1f2937',
            overflow: 'hidden',
        }}>

            {/* Top Navigation Tabs (Fixed Height) */}
            <div className="flex flex-wrap gap-2 mb-6 shrink-0" style={{ marginTop: 15, marginBottom: 15 }}>
                <div className="flex flex-wrap gap-1">
                    {tabs.map((tab) => (
                        <button
                            key={tab}
                            onClick={() => { setActiveTab(tab); setCurrentPage(1); }}
                            className={`hover:cursor-pointer text-xs font-medium transition-colors ${activeTab === tab ? '' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
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
                                <span className="font-geist font-bold text-[#037847]" style={{ fontSize: 16 }}>{baseStudents.filter(s => s.status === 'Eligible').length}</span>
                            </div>
                            <div className="text-right" style={{ paddingRight: 30 }}>
                                <span className="font-geist font-semibold text-[#8B0000]" style={{ fontSize: 14 }}>Ineligible: </span>
                                <span className="font-geist font-bold text-[#8B0000]" style={{ fontSize: 16 }}>{baseStudents.filter(s => s.status === 'Ineligible').length}</span>
                            </div>
                            <div className="text-right" style={{ paddingRight: 20 }}>
                                <span className="font-geist font-semibold" style={{ fontSize: 14 }}>Total Claims: </span>
                                <span className="font-geist font-bold text-gray-900" style={{ fontSize: 16 }}>{allStudents.length}</span>
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
                                placeholder="Search name, program/section, etc."
                                className="w-full text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                                style={{
                                    width: '100%', paddingLeft: '40px', paddingRight: '16px', paddingTop: '4px',
                                    paddingBottom: '4px', backgroundColor: '#F0F1F6', border: 'none', borderRadius: '8px',
                                    fontSize: 13, fontFamily: "geist"
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
                                <span className="font-bold">Today:</span> July 21, 2025 <Calendar size={12} />
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
                        {/* HYDRATION FIX: Removed whitespace */}
                        <thead className="bg-gray-50/50 sticky top-0 z-10" style={{ height: '45px' }}><tr>
                            <th style={{ fontSize: 12 }} className="font-geist py-3 px-6 font-medium text-gray-500 w-16"></th>
                            <th style={{ fontSize: 12 }} className="font-geist py-3 px-6 font-medium text-gray-500">Student Name</th>
                            <th style={{ fontSize: 12 }} className="font-geist py-3 px-3 font-medium text-gray-500">Student ID</th>
                            <th style={{ fontSize: 12 }} className="font-geist py-3 px-6 font-medium text-gray-500">Program/Section</th>
                            <th style={{ fontSize: 12 }} className="font-geist py-3 px-6 font-medium text-gray-500">Claim Time</th>
                            <th style={{ fontSize: 12 }} className="font-geist py-3 px-6 font-medium text-gray-500">Status</th>
                            <th style={{ fontSize: 12 }} className="font-geist py-3 px-6 font-medium text-gray-500">Meal Type Claim</th>
                            <th style={{ fontSize: 12 }} className="font-geist py-3 px-6 font-medium text-gray-500">Value Claimed</th>
                        </tr></thead>

                        <tbody className="divide-y divide-gray-100">
                            {currentData.map((student, index) => (
                                <tr key={student.id} className="hover:bg-gray-50/80 transition-colors group" style={{ height: ITEM_HEIGHT_ESTIMATE_PX }}>
                                    {/* 1. INDEX */}
                                    <td className="font-geist text-black flex items-center justify-center" style={{ paddingTop: '10px', paddingBottom: '10px', fontSize: 13, height: '100%' }}>
                                        {startIndex + index + 1}
                                    </td>
                                    
                                    {/* 2. STUDENT NAME */}
                                    <td className="py-4 px-6">
                                        <div style={{ paddingLeft: 5, display: 'flex', alignItems: 'center' }}>
                                            <Avatar />
                                            <span style={{ fontSize: 12, fontWeight: 450, fontFamily: "geist", color: "black" }}>{student.name}</span>
                                        </div>
                                    </td>
                                    
                                    {/* 3. STUDENT ID */}
                                    <td style={{ fontSize: 12, fontFamily: "geist", color: "black" }}>{student.studentId}</td>
                                    
                                    {/* 4. PROGRAM/SECTION */}
                                    <td style={{ fontSize: 12, fontFamily: "geist", color: "black" }}>{student.program}</td>
                                    
                                    {/* 5. CLAIM TIME (NEW) */}
                                    <td style={{ fontSize: 12, fontFamily: "geist", color: "black" }}>{student.claimTime}</td>
                                    
                                    {/* 6. STATUS (NEW - Claimed/Unclaimed) */}
                                    <td style={{ fontSize: 12 }} className="font-geist py-4 px-6">
                                        <ClaimStatusBadge isClaimed={student.isClaimed} />
                                    </td>
                                    
                                    {/* 7. MEAL TYPE CLAIM (NEW) */}
                                    <td style={{ fontSize: 12, fontFamily: "geist", color: "black" }}>{student.mealTypeClaim}</td>
                                    
                                    {/* 8. VALUE CLAIMED (NEW) */}
                                    <td style={{ fontSize: 12, fontFamily: "geist", color: "black" }}>{student.valueClaimed}</td>
                                </tr>
                            ))}
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