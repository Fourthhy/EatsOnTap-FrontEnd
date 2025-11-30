import React, { useState, useEffect, useRef } from "react";
import { ChevronLeft, ChevronRight, Edit2 } from "lucide-react";

// Helper for Tailwind color translation
const twColors = {
    'gray-50': '#f9fafb',
    'gray-100': '#f3f4f6',
    'gray-200': '#e5e7eb',
    'gray-400': '#9ca3af',
    'gray-600': '#4b5563',
    'gray-700': '#4b5563',
    'gray-800': '#1f2937',
    'black': 'black',
    'green-600': '#059669', // Added for eligible status
};

// --- CONFIGURATION ---
const MIN_ITEMS_LEFT = 5;
const MIN_ITEMS_RIGHT = 7;
const MAX_ITEMS_LEFT = 12;
const MAX_ITEMS_RIGHT = 13; // Set to 13 as requested
const ITEM_HEIGHT_ESTIMATE_PX = 45; // Height of one row

// --- CUSTOM HOOK: Handles Height Responsiveness & Pagination ---
// This encapsulates the ResizeObserver logic so we can use it for both tables easily.
const useTablePagination = (data, maxItems, itemHeight, minItems = 5) => {
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(maxItems);
    const [pageNumbers, setPageNumbers] = useState([]);
    
    // Refs for the container and footer to measure heights
    const wrapperRef = useRef(null);
    const footerRef = useRef(null);

    useEffect(() => {
        const wrapper = wrapperRef.current;
        if (!wrapper) return;

        const observer = new ResizeObserver(entries => {
            const entry = entries[0];
            const totalWrapperHeight = entry.contentRect.height;
            
            // --- HEIGHT MATH ---
            // Header: ~40px (Text + padding)
            // Wrapper Padding: 32px (1rem top + 1rem bottom)
            const HEADER_AND_PADDING = 72; 
            
            // Footer: Measure if available, else estimate 50px
            const footerHeight = footerRef.current ? footerRef.current.offsetHeight : 50;

            // Available space for the list rows
            const availableSpace = totalWrapperHeight - HEADER_AND_PADDING - footerHeight;

            const calculatedItems = Math.floor(availableSpace / itemHeight);
            
            // Apply Constraints
            const safeItems = Math.max(minItems, Math.min(maxItems, calculatedItems));
            
            setItemsPerPage(prev => {
                if (prev !== safeItems) {
                    setCurrentPage(1); // Reset to page 1 on resize
                    return safeItems;
                }
                return prev;
            });
        });

        observer.observe(wrapper);
        return () => observer.disconnect();
    }, [maxItems, itemHeight, minItems]);

    // --- PAGINATION LOGIC ---
    const totalPages = Math.ceil(data.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const currentItems = data.slice(startIndex, endIndex);
    const isPrevDisabled = currentPage === 1;
    const isNextDisabled = currentPage >= totalPages || totalPages === 0;

    // Generate Page Numbers [1, ..., 4, 5, 6, ..., 10]
    useEffect(() => {
        const numbers = [];
        if (totalPages <= 5) {
            for (let i = 1; i <= totalPages; i++) numbers.push(i);
        } else {
            numbers.push(1);
            if (currentPage > 2) numbers.push('...');
            if (currentPage > 1 && currentPage < totalPages) numbers.push(currentPage);
            if (currentPage < totalPages - 1 && currentPage !== 1) numbers.push('...');
            if (totalPages > 1) numbers.push(totalPages);
        }
        setPageNumbers([...new Set(numbers)]);
    }, [totalPages, currentPage]);

    return {
        wrapperRef,
        footerRef,
        currentItems,
        currentPage,
        setCurrentPage,
        itemsPerPage,
        totalPages,
        pageNumbers,
        isPrevDisabled,
        isNextDisabled
    };
};

// --- REUSABLE COMPONENT: Pagination Footer ---
const PaginationFooter = ({ logic }) => {
    const { footerRef, currentPage, setCurrentPage, totalPages, pageNumbers, isPrevDisabled, isNextDisabled } = logic;
    
    return (
        <div 
            ref={footerRef}
            style={{ 
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '1rem', 
                paddingTop: '1rem', marginTop: 'auto', flexShrink: 0,
                opacity: totalPages <= 1 ? 0 : 1, pointerEvents: totalPages <= 1 ? 'none' : 'auto'
            }}
        >
            <button
                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                disabled={isPrevDisabled}
                className="hover:text-black disabled:opacity-50 disabled:cursor-not-allowed"
                style={{ display: 'flex', alignItems: 'center', fontSize: '0.75rem', fontWeight: 500, color: twColors['gray-600'], cursor: isPrevDisabled ? 'default' : 'pointer' }}
            >
                <ChevronLeft size={16} style={{ marginRight: '0.25rem' }} /> Previous
            </button>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', fontSize: '0.75rem', fontWeight: 500, color: twColors['gray-600'] }}>
                {pageNumbers.map((page, index) => (
                    <span 
                        key={index}
                        onClick={() => page !== '...' && setCurrentPage(page)}
                        className={`cursor-pointer ${page === currentPage ? 'text-black' : 'hover:text-black'}`}
                        style={{ color: page === currentPage ? twColors['black'] : twColors['gray-600'], cursor: page === '...' ? 'default' : 'pointer' }}
                    >
                        {page}
                    </span>
                ))}
            </div>
            <button
                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                disabled={isNextDisabled}
                className="hover:bg-gray-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                style={{ display: 'flex', alignItems: 'center', backgroundColor: twColors['gray-100'], paddingLeft: '0.75rem', paddingRight: '0.75rem', paddingTop: '0.375rem', paddingBottom: '0.375rem', borderRadius: '0.25rem', fontSize: '0.75rem', fontWeight: 500, color: twColors['black'], cursor: isNextDisabled ? 'default' : 'pointer' }}
            >
                Next <ChevronRight size={16} style={{ marginLeft: '0.25rem' }} />
            </button>
        </div>
    );
};

// --- REUSABLE COMPONENT: Avatar Placeholder ---
const AvatarPlaceholder = ({ name }) => {
    // Generate initials
    const initials = name.split(',')[1] ? name.split(',')[1].trim().substring(0, 1) + name.split(',')[0].trim().substring(0, 1) : "ST";
    
    return (
        <div style={{ width: 32, height: 32, borderRadius: '50%', backgroundColor: twColors['gray-200'], display: 'flex', alignItems: 'center', justifyContent: 'center', marginRight: '0.75rem', flexShrink: 0 }}>
            <span style={{ fontSize: '0.7rem', fontWeight: 600, color: twColors['gray-600'] }}>{initials}</span>
        </div>
    );
};


function ViewUpcomingEvent({ eventID, onBackToDashboard }) {
    // 1. DATA: Sections
    const sections = [
        { name: "Pre-kinder", total: 12 }, { name: "Kinder", total: 15 },
        { name: "Grade 1", total: 25 }, { name: "Grade 2", total: 22 },
        { name: "Grade 3", total: 19 }, { name: "Grade 4", total: 25 },
        { name: "Grade 5", total: 25 }, { name: "Grade 6", total: 25 },
        { name: "Grade 7", total: 25 }, { name: "Grade 8", total: 25 },
        { name: "Grade 9", total: 25 }, { name: "Grade 10", total: 25 },
        { name: "Grade 11", total: 25 }, { name: "Grade 12", total: 25 },
    ];

    // 2. DATA: Students
    const initialMockStudents = [
        { id: 1, name: "Santos, Michaella Avaine", studentId: "25-00001MAS", program: "Grade 10", type: "Regular", status: "Eligible", isLinked: true },
        { id: 2, name: "Nabor, Samantha Roselle", studentId: "25-00002SRN", program: "BSA 4", type: "Regular", status: "Eligible", isLinked: false },
        { id: 3, name: "Manalo, Erica Kai", studentId: "25-00003EKM", program: "BSAIS 3", type: "Irregular", status: "Ineligible", isLinked: true },
        { id: 4, name: "Silangon, Cherry Rose", studentId: "25-00004CRS", program: "Grade 12", type: "Regular", status: "Eligible", isLinked: false },
        { id: 5, name: "Feliciano, Keysi Star", studentId: "25-00005KSF", program: "Grade 12", type: "Regular", status: "Eligible", isLinked: true },
        { id: 6, name: "Concepcion, Princess Angel", studentId: "25-00006PAC", program: "BSIS 1", type: "Regular", status: "Eligible", isLinked: false },
        { id: 7, name: "Martin, Fiona Margarette", studentId: "25-00007FMM", program: "BAB 3", type: "Regular", status: "Eligible", isLinked: true },
        { id: 8, name: "Uson, Tracy Haven", studentId: "25-00008THU", program: "BAB 1", type: "Regular", status: "Eligible", isLinked: true },
        { id: 9, name: "Roldan, Jamie Mae", studentId: "25-00009JMR", program: "BSIT 2", type: "Irregular", status: "Eligible", isLinked: false },
        { id: 10, name: "Adna, Arjumina Nana", studentId: "25-00010ANA", program: "BSAIS 1", type: "Regular", status: "Eligible", isLinked: true },
        { id: 11, name: "Conception, Akira", studentId: "25-00011AC", program: "BSA 2", type: "Regular", status: "Eligible", isLinked: true },
        { id: 12, name: "Dela Cruz, Juan", studentId: "25-00012JD", program: "BSIS 4", type: "Regular", status: "Eligible", isLinked: true },
        { id: 13, name: "Reyes, Maria", studentId: "25-00013MR", program: "BSIS 4", type: "Regular", status: "Eligible", isLinked: true },
    ];

    // 3. HOOKS: Initialize Logic for Left and Right tables
    // Left: Max 12
    const leftTable = useTablePagination(sections, MAX_ITEMS_LEFT, ITEM_HEIGHT_ESTIMATE_PX, MIN_ITEMS_LEFT);
    // Right: Max 13
    const rightTable = useTablePagination(initialMockStudents, MAX_ITEMS_RIGHT, ITEM_HEIGHT_ESTIMATE_PX, MIN_ITEMS_RIGHT);  

    return (
        <div style={{ width: '100%', height: 'calc(100vh - 60px)' }}>

            <div style={{ width: '100%', height: '100%', display: 'grid', gridTemplateColumns: '2% 96% 2%' }}>
                <div style={{ height: 'calc(100% - 10px)' }}>
                    <div className="cursor-pointer hover:bg-gray-100" style={{ marginTop: '1rem', borderRadius: '9999px', padding: '0.25rem', width: 'fit-content' }} onClick={onBackToDashboard}>
                        <ChevronLeft />
                    </div>
                </div>

                <div style={{ width: '100%', height: 'calc(100% - 10px)', display: 'flex', alignItems: 'flex-start', justifyContent: 'center', backgroundColor: 'white', borderRadius: 8 }}>
                    <div style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column', padding: 15 }}>
                        {/*HEADER*/}
                        <div style={{ height: '50px', width: '100%', display: 'flex', justifyContent: 'space-between', flexShrink: 0 }}>
                            <div>
                                <p style={{ fontSize: 16, fontFamily: 'geist', fontWeight: 500 }}>Sample Event Name</p>
                                <h2 style={{ fontSize: 13, fontFamily: 'geist', fontWeight: 400, color: "#4C4B4B" }}>View Recent Event</h2>
                            </div>
                            <button
                                type="submit"
                                style={{ background: 'linear-gradient(to right, #4268BD, #3F6AC9)', cursor: 'pointer', fontWeight: '600', color: 'white', border: 'none', height: 'auto', borderRadius: 12, fontSize: '14px', display: 'flex', alignItems: 'center', gap: '5px', padding: "0px 20px" }}
                                className="transition-colors hover:bg-blue-700 shadow-md"
                            >
                                <Edit2 size={20} color="white" /> Edit
                            </button>
                        </div>

                        {/*BODY*/}
                        <div style={{ width: '100%', flex: '1 1 0%', display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1rem', paddingTop: 15, overflow: 'hidden' }}>
                            
                            {/* --- LEFT SIDE CONTENT --- */}
                            <div style={{ height: '100%', width: '100%', display: 'flex', flexDirection: 'column', paddingTop: 20 }}>
                                {/* Inputs Row */}
                                <div style={{ display: 'flex', flexDirection: 'column', width: '100%', gap: '1rem', marginBottom: 20, flexShrink: 0 }}>
                                    <div style={{ flex: '1 1 0%', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                        <label className="font-geist" style={{ fontSize: '0.875rem', color: twColors['black'], flexShrink: 0, fontWeight: 500, marginRight: '0.5rem' }}>Event Name:</label>
                                        <input type="text" defaultValue="Teachers' Day" className="focus:outline-none focus:ring-2 focus:ring-blue-500/20 font-geist" style={{ width: '75%', backgroundColor: '#F3F4F8', height: '40px', color: twColors['gray-700'], paddingLeft: '0.75rem', paddingRight: '0.75rem', borderRadius: 4, fontSize: 13 }} />
                                    </div>
                                    <div style={{ flex: '1 1 0%', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                        <label className="font-geist" style={{ fontSize: '0.875rem', color: twColors['black'], flexShrink: 0, fontWeight: 500, marginRight: '0.5rem' }}>Department/s:</label>
                                        <input type="text" defaultValue="All Departments" className="focus:outline-none focus:ring-2 focus:ring-blue-500/20 font-geist" style={{ width: '75%', backgroundColor: '#F3F4F8', height: '40px', color: twColors['gray-700'], paddingLeft: '0.75rem', paddingRight: '0.75rem', borderRadius: 4, fontSize: 13 }} />
                                    </div>
                                </div>

                                {/* TABLE SECTION */}
                                <div className="font-geist" style={{ width: '100%', display: 'flex', flexDirection: 'column', flex: '1 1 0%', overflow: 'hidden' }}>
                                    <label style={{ fontSize: '0.875rem', color: twColors['black'], fontWeight: 500, marginBottom: '0.5rem', display: 'block', flexShrink: 0 }}>
                                        Sections/Programs:
                                    </label>
                                    
                                    <div ref={leftTable.wrapperRef} style={{ borderWidth: '1px', borderColor: twColors['gray-100'], borderRadius: '0.5rem', padding: '1rem', display: 'flex', flexDirection: 'column', flex: '1 1 0%', backgroundColor: 'white', boxShadow: '0px 0px 4px rgba(0,0,0,0.05)', minHeight: 0 }}>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: twColors['gray-400'], paddingBottom: '0.5rem', borderBottomWidth: '1px', borderBottomColor: twColors['gray-50'], marginBottom: '0.5rem', paddingLeft: '0.5rem', paddingRight: '0.5rem', flexShrink: 0 }}>
                                            <span>All</span><span>Total</span>
                                        </div>
                                        <div style={{ flexGrow: 1, overflowY: 'hidden', paddingRight: '0.25rem', display: 'flex', flexDirection: 'column' }}>
                                            {leftTable.currentItems.map((section, index) => (
                                                <div key={index} className="hover:bg-gray-50" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '0.75rem', paddingBottom: '0.75rem', borderBottomWidth: '1px', borderBottomColor: twColors['gray-50'], fontSize: '0.875rem', color: twColors['gray-800'], paddingLeft: '0.5rem', paddingRight: '0.5rem', height: ITEM_HEIGHT_ESTIMATE_PX, flexShrink: 0 }}>
                                                    <span>{section.name}</span><span>{section.total}</span>
                                                </div>
                                            ))}
                                            {leftTable.currentItems.length < leftTable.itemsPerPage && Array(leftTable.itemsPerPage - leftTable.currentItems.length).fill(0).map((_, i) => (
                                                <div key={`pad-${i}`} style={{ height: ITEM_HEIGHT_ESTIMATE_PX, borderBottomWidth: '1px', borderBottomColor: twColors['gray-50'], flexShrink: 0 }} />
                                            ))}
                                        </div>
                                        <PaginationFooter logic={leftTable} />
                                    </div>
                                </div>
                            </div>

                            {/* --- RIGHT SIDE CONTENT --- */}
                            <div style={{ height: '100%', width: '100%', display: 'flex', flexDirection: "column", paddingTop: 20 }}>
                                <div style={{ height: 20, width: "100%", fontFamily: "geist", display: "flex", justifyContent: "space-between", flexShrink: 0 }}>
                                    <span style={{ fontSize: 14, color: "black", fontWeight: 500 }}>Student List</span>
                                    <div className="h-auto flex items-end">
                                        <span style={{ fontSize: 14, color: twColors['gray-600'] }}> total: &nbsp; </span>
                                        <span style={{ fontSize: 18, color: twColors['black'], fontWeight: 600 }}> {initialMockStudents.length} </span>
                                    </div>
                                </div>
                                
                                {/* STUDENT TABLE WRAPPER */}
                                <div 
                                    ref={rightTable.wrapperRef} 
                                    style={{ 
                                        width: '100%', flex: '1 1 0%', marginTop: 15, borderWidth: '1px', borderColor: twColors['gray-200'], borderRadius: '0.5rem', 
                                        padding: '1rem', backgroundColor: 'white', boxShadow: '0px 0px 4px rgba(0,0,0,0.05)', display: 'flex', flexDirection: 'column', minHeight: 0 
                                    }}
                                >
                                    {/* Table Header */}
                                    <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr', fontSize: '0.75rem', color: twColors['gray-400'], paddingBottom: '0.5rem', borderBottomWidth: '1px', borderBottomColor: twColors['gray-50'], marginBottom: '0.5rem', paddingLeft: '0.5rem', paddingRight: '0.5rem', flexShrink: 0 }}>
                                        <span style={{ textAlign: 'left' }}>Student Name</span>
                                        <span style={{ textAlign: 'center' }}>Section/Program</span>
                                        <span style={{ textAlign: 'right' }}>Status</span>
                                    </div>

                                    {/* Student Rows */}
                                    <div style={{ flexGrow: 1, overflowY: 'hidden', paddingRight: '0.25rem', display: 'flex', flexDirection: 'column' }}>
                                        {rightTable.currentItems.map((student, index) => (
                                            <div 
                                                key={index} 
                                                className="hover:bg-gray-50"
                                                style={{ 
                                                    display: 'grid', gridTemplateColumns: '2fr 1fr 1fr', alignItems: 'center', 
                                                    paddingTop: '0.75rem', paddingBottom: '0.75rem', borderBottomWidth: '1px', borderBottomColor: twColors['gray-50'], 
                                                    fontSize: '0.875rem', color: twColors['gray-800'], paddingLeft: '0.5rem', paddingRight: '0.5rem', 
                                                    height: ITEM_HEIGHT_ESTIMATE_PX, flexShrink: 0 
                                                }}
                                            >
                                                {/* Col 1: Name + Avatar */}
                                                <div style={{ display: 'flex', alignItems: 'center' }}>
                                                    <AvatarPlaceholder name={student.name} />
                                                    <span style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', fontWeight: 500 }}>
                                                        {student.name}
                                                    </span>
                                                </div>
                                                
                                                {/* Col 2: Program */}
                                                <div style={{ textAlign: 'center', fontWeight: 500 }}>
                                                    {student.program}
                                                </div>

                                                {/* Col 3: Status */}
                                                <div style={{ textAlign: 'right', color: twColors['green-600'], fontWeight: 600 }}>
                                                    {student.status}
                                                </div>
                                            </div>
                                        ))}

                                        {/* Padding Rows */}
                                        {rightTable.currentItems.length < rightTable.itemsPerPage && Array(rightTable.itemsPerPage - rightTable.currentItems.length).fill(0).map((_, i) => (
                                            <div key={`pad-${i}`} style={{ height: ITEM_HEIGHT_ESTIMATE_PX, borderBottomWidth: '1px', borderBottomColor: twColors['gray-50'], flexShrink: 0 }} />
                                        ))}
                                    </div>
                                    
                                    <PaginationFooter logic={rightTable} />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div style={{ height: 'calc(100% - 10px)' }}></div>
            </div>
        </div>
    );
}

export { ViewUpcomingEvent };