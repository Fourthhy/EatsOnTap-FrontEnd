// StudentClaimsHistory.jsx (New component for Matrix View)

import React, { useState, useMemo, useEffect, useRef } from 'react';
import { Search, Calendar, Filter, ChevronLeft, ChevronRight, Check, X } from 'lucide-react';
import { generateData } from './mockData';
// --- Configuration (Same as base) ---
const MIN_ITEMS = 4;
const MAX_ITEMS = 13;
const ITEM_HEIGHT_ESTIMATE_PX = 40; // Reduced height estimate for matrix rows

// --- Helper Functions (Mock Data and UI) ---

// Assume generateData() is available globally to fetch base student list
const generateClaimHistory = (students) => {
    return students.map(student => {
        const history = [];
        for (let i = 0; i < 15; i++) {
            const random = Math.random();
            let status = 'check';
            if (random < 0.2) {
                status = 'cross';
            } else if (random < 0.3) {
                status = 'dash';
            }
            history.push(status);
        }
        return {
            ...student,
            claimHistory: history,
        };
    });
};

const CheckIcon = () => <Check size={18} style={{ color: '#047857' }} />; // Green check
const CrossIcon = () => <X size={18} style={{ color: '#b91c1c' }} />; // Red cross

// Component to generate 15 column headers
const renderDayHeaders = (matrixData) => {
    // This is no longer needed since the matrixData contains the full nested structure
    return null;
};


const OverallClaims = () => {
    // --- SETUP: Dynamic Date Calculation ---
    const CURRENT_DATE_FOR_MATRIX = new Date(); // Use current real date
    const getDynamicMonthMatrix = (currentDate) => {
        const today = new Date(currentDate);
        const year = today.getFullYear();
        const month = today.getMonth();

        const firstDayOfMonth = new Date(year, month, 1);
        const dayOfWeek = firstDayOfMonth.getDay() === 0 ? 7 : firstDayOfMonth.getDay();
        const offsetToMonday = (dayOfWeek === 1) ? 0 : (dayOfWeek - 1);

        const startMatrixDate = new Date(firstDayOfMonth);
        startMatrixDate.setDate(firstDayOfMonth.getDate() - offsetToMonday);

        const monthLabel = firstDayOfMonth.toLocaleString('default', { month: 'long', year: 'numeric' });
        const matrix = { monthLabel, weeks: [] };
        let currentWeekDays = [];
        let currentDateIterator = new Date(startMatrixDate);
        let weekNumber = 1;

        // Loop runs for 5 weeks (30 days total) + extra buffer to ensure all days of the month are included
        while (matrix.weeks.length < 5 || (currentDateIterator.getMonth() === month && currentDateIterator.getDay() !== 1)) {

            // If the iterator rolls over to the next month, we break after finishing the current week display
            if (matrix.weeks.length >= 5 && currentDateIterator.getDay() === 1 && currentDateIterator.getMonth() !== month) break;

            currentWeekDays.push({
                date: currentDateIterator.getDate(),
                isCurrentMonth: currentDateIterator.getMonth() === month,
            });

            // Sunday is 0, but we use Monday=1 start. Day 6 of our week is Saturday
            if (currentWeekDays.length === 6) {
                matrix.weeks.push({
                    label: `Week ${weekNumber}`,
                    days: currentWeekDays,
                });
                currentWeekDays = [];
                weekNumber++;
            }

            currentDateIterator.setDate(currentDateIterator.getDate() + 1);
        }

        return matrix;
    };

    const matrixData = useMemo(() => getDynamicMonthMatrix(CURRENT_DATE_FOR_MATRIX), []);
    const totalDayColumns = matrixData.weeks.reduce((sum, week) => sum + week.days.length, 0);


    // --- STATE ---
    const [activeTab, setActiveTab] = useState('All');
    const [currentPage, setCurrentPage] = useState(1);
    const [searchTerm, setSearchTerm] = useState('');
    const [itemsPerPage, setItemsPerPage] = useState(MAX_ITEMS);

    // --- REFS ---
    const tableWrapperRef = useRef(null);
    const tableHeaderRef = useRef(null);
    const paginationFooterRef = useRef(null);

    // --- DATA ---
    const baseStudents = useMemo(() => generateData(), []);
    // Note: Claim history is generated for 15 days, which won't exactly match the dynamic matrix width. 
    // We will truncate the history to match `totalDayColumns` in the render step.
    const studentsWithHistory = useMemo(() => generateClaimHistory(baseStudents), [baseStudents]);


    // --- HEIGHT CALCULATION LOGIC ---
    useEffect(() => {
        const wrapper = tableWrapperRef.current;
        const header = tableHeaderRef.current;
        const footer = paginationFooterRef.current;
        if (!wrapper || !header || !footer) return;

        const observer = new ResizeObserver(entries => {
            const entry = entries[0];
            const totalCardHeight = entry.contentRect.height;

            const controlsHeight = 100;
            const headerHeight = header.offsetHeight;
            const footerHeight = footer.offsetHeight;

            const availableSpace = totalCardHeight - controlsHeight - headerHeight - footerHeight - 50;

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
    }, [totalDayColumns]);

    // --- PAGINATION AND FILTERING ---
    const filteredStudents = studentsWithHistory.filter(student =>
        student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        student.program.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const totalPages = Math.ceil(filteredStudents.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const currentData = filteredStudents.slice(startIndex, startIndex + itemsPerPage);

    const handlePageChange = (newPage) => {
        if (newPage >= 1 && newPage <= totalPages) {
            setCurrentPage(newPage);
        }
    };

    const tabs = ['All', 'Preschool', 'Primary Education', 'Intermediate', 'Junior High School', 'Senior High School', 'Higher Education'];

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
            backgroundColor: '#f9fafb'
        }}>

            {/* Top Navigation Tabs (Fixed Height) */}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '1.5rem', flexShrink: 0 }}>
                {tabs.map((tab) => (
                    <button
                        key={tab}
                        onClick={() => { setActiveTab(tab); setCurrentPage(1); }}
                        className={`hover:cursor-pointer text-xs font-medium transition-colors ${activeTab === tab ? '' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
                        style={{ padding: '10px 20px', borderRadius: '12px', backgroundImage: activeTab === tab ? 'linear-gradient(to bottom, #4268BD, #3F6AC9)' : undefined, color: activeTab === tab ? 'white' : undefined, transitionProperty: 'all', transitionTimingFunction: 'cubic-bezier(0.4, 0, 0.2, 1)', transitionDuration: '150ms', marginRight: 10 }}
                    >
                        {tab}
                    </button>
                ))}
            </div>

            {/* Main Card (Flex Grow to fill space) */}
            <div
                ref={tableWrapperRef}
                style={{
                    backgroundColor: 'white', borderRadius: '0.75rem', boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
                    border: '1px solid #e5e7eb', display: 'flex', flexDirection: 'column',
                    flex: '1 1 0%', minHeight: 0, overflow: 'hidden', fontFamily: 'geist'
                }}
            >

                {/* Header Section (Fixed Height - Contains Title and Search/Filters) */}
                <div style={{ padding: '1.5rem', borderBottom: '1px solid #f3f4f6', flexShrink: 0 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                        <div>
                            <h1 style={{ fontWeight: 500, fontSize: 16, color: '#1f2937' }}>All Students' History</h1>
                            <p style={{ color: '#667085', fontSize: 12 }}>This table is where you can see the students' history of meal claiming.</p>
                        </div>
                        <div className="relative flex-1 max-w-sm flex-row" style={{ marginLeft: 10 }}>
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[#4C4B4B]" size={16} />
                            <input
                                type="text"
                                placeholder="Search"
                                className="w-full text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                                style={{
                                    width: '100%', paddingLeft: '40px', paddingRight: '16px', paddingTop: '4px',
                                    paddingBottom: '4px', backgroundColor: '#F0F1F6', border: 'none', borderRadius: '8px',
                                    fontSize: 13, fontFamily: "geist", color: "#4C4B4B"
                                }}
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                    </div>
                </div>

                {/* Table Body (Scrollable Horizontally, Constrained Vertically) */}
                {/* FIX: Ensure the inner div handles horizontal overflow */}
                <div style={{ flex: '1 1 0%', overflowY: 'hidden', overflowX: 'auto' }}>
                    <table style={{ width: '100%', minWidth: '1500px', textAlign: 'left', borderCollapse: 'collapse' }}> {/* Increased minWidth to guarantee scrolling */}

                        {/* Nested Headers Structure */}
                        <thead ref={tableHeaderRef} style={{ backgroundColor: '#f9fafb', position: 'sticky', top: 0, zIndex: 10 }}>
                            {/* Row 1: Month/Week Headers */}
                            <tr style={{ height: '40px' }}>
                                <th rowSpan="2" style={{ width: '250px', padding: '12px 24px', fontWeight: 500, color: '#1f2937', fontSize: '0.875rem', borderBottom: '1px solid #e5e7eb' }}>
                                    {matrixData.monthLabel}
                                </th>
                                {/* Dynamically rendered week headers */}
                                {matrixData.weeks.map((week, index) => (
                                    <th key={`week-${index}`} colSpan={week.days.length} style={{ padding: '8px 0', textAlign: 'center', fontWeight: 700, color: '#1f2937', fontSize: '0.75rem', borderBottom: '1px solid #e5e7eb', borderLeft: index > 0 ? '1px solid #e5e7eb' : 'none' }}>
                                        {week.label}
                                    </th>
                                ))}
                            </tr>
                            {/* Row 2: Day Headers */}
                            <tr>
                                {/* Dynamically rendered day headers */}
                                {matrixData.weeks.map(week => (
                                    week.days.map((day, dayIndex) => (
                                        <th key={`${week.label}-${dayIndex}`} style={{ padding: '12px 0px', textAlign: 'center', width: '40px', fontWeight: 500, color: day.isCurrentMonth ? '#1f2937' : '#9ca3af', fontSize: '0.75rem', borderBottom: '1px solid #e5e7eb' }}>
                                            {day.date.toString().padStart(2, '0')}
                                        </th>
                                    ))
                                ))}
                            </tr>
                        </thead>

                        <tbody style={{ borderSpacing: 0, borderTop: '1px solid #f3f4f6' }}>
                            {currentData.map((student, rowIndex) => (
                                <tr key={student.id} className="hover:bg-gray-50 transition-colors" style={{ height: ITEM_HEIGHT_ESTIMATE_PX, borderBottom: '1px solid #f3f4f6' }}>

                                    {/* Student Info Column */}
                                    <td style={{
                                        padding: '1rem 1.5rem',
                                        fontSize: '0.875rem',
                                        fontWeight: 500,
                                        color: '#1f2937',
                                        width: '250px',
                                        verticalAlign: 'top',
                                        borderRight: '1px solid #e5e7eb'
                                    }}>
                                        <div style={{ marginBottom: '0.25rem' }}>{student.name}</div>
                                        <div style={{ fontSize: '0.75rem', fontWeight: 400, color: '#4b5563' }}>{student.program}</div>
                                    </td>

                                    {/* Claim History Columns (Must match totalDayColumns length) */}
                                    {student.claimHistory.slice(0, totalDayColumns).map((status, dayIndex) => (
                                        <td key={dayIndex} style={{
                                            padding: '0.5rem 0',
                                            textAlign: 'center',
                                            fontSize: '0.875rem',
                                            width: '40px'
                                        }}>
                                            {status === 'check' ? <CheckIcon /> :
                                                status === 'cross' ? <CrossIcon /> :
                                                    <span style={{ color: '#9ca3af' }}>-</span>}
                                        </td>
                                    ))}
                                </tr>
                            ))}

                            {/* Padding Rows */}
                            {currentData.length < itemsPerPage && Array(itemsPerPage - currentData.length).fill(0).map((_, i) => (
                                <tr key={`pad-${i}`} style={{ height: ITEM_HEIGHT_ESTIMATE_PX, borderBottom: '1px solid #f3f4f6' }}>
                                    <td colSpan={totalDayColumns + 1}></td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Footer Section */}
                <div ref={paginationFooterRef} style={{
                    padding: '1.5rem', borderTop: '1px solid #f3f4f6', display: 'flex',
                    flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between',
                    gap: '1rem', flexShrink: 0, backgroundColor: 'white'
                }}>
                    <div style={{ display: 'flex', gap: '1.5rem', fontSize: '0.875rem', fontWeight: 500 }}>
                        <span style={{ color: '#4b5563' }}>Total Students: <span style={{ color: '#1f2937', fontWeight: 700 }}>{filteredStudents.length}</span></span>
                        <span style={{ color: '#047857' }}>Claimed: <span style={{ fontWeight: 700 }}>{filteredStudents.filter(s => s.claimHistory.includes('check')).length}</span></span>
                        <span style={{ color: '#b91c1c' }}>Missed: <span style={{ fontWeight: 700 }}>{filteredStudents.filter(s => s.claimHistory.includes('cross')).length}</span></span>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <button
                            onClick={() => handlePageChange(currentPage - 1)}
                            disabled={currentPage === 1}
                            className="flex items-center gap-1 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                            style={{ padding: '0.5rem 0.75rem', borderRadius: '0.5rem', fontSize: '0.875rem', fontWeight: 500, color: '#4b5563', display: 'flex', alignItems: 'center', gap: '0.25rem' }}
                        >
                            <ChevronLeft size={16} /> Previous
                        </button>

                        {[...Array(Math.min(3, totalPages))].map((_, i) => (
                            <button
                                key={i}
                                onClick={() => handlePageChange(i + 1)}
                                className={`transition-colors`}
                                style={{ width: '2rem', height: '2rem', borderRadius: '0.5rem', fontSize: '0.875rem', fontWeight: 500, display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: currentPage === i + 1 ? '#1f2937' : 'transparent', color: currentPage === i + 1 ? 'white' : '#4b5563' }}
                            >
                                {i + 1}
                            </button>
                        ))}
                        {totalPages > 3 && <span style={{ color: '#9ca3af' }}>...</span>}

                        <button
                            onClick={() => handlePageChange(currentPage + 1)}
                            disabled={currentPage === totalPages}
                            className="flex items-center gap-1 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                            style={{ padding: '0.5rem 0.75rem', borderRadius: '0.5rem', fontSize: '0.875rem', fontWeight: 500, color: '#4b5563', display: 'flex', alignItems: 'center', gap: '0.25rem' }}
                        >
                            Next <ChevronRight size={16} />
                        </button>

                    </div>
                </div>
            </div>
        </div>
    );
};

export { OverallClaims };