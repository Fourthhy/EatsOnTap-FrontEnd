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
const MAX_ITEMS_RIGHT = 13; // Max items for Student List
const ITEM_HEIGHT_ESTIMATE_PX = 45; // Height of one row

// --- DATA ENHANCEMENT & GENERATION ---
const generateSections = () => {
    return [
        { name: "Pre-kinder", total: 12 }, { name: "Kinder", total: 15 },
        { name: "Grade 1", total: 25 }, { name: "Grade 2", total: 22 },
        { name: "Grade 3", total: 19 }, { name: "Grade 4", total: 25 },
        { name: "Grade 5", total: 25 }, { name: "Grade 6", total: 25 },
        { name: "Grade 7", total: 25 }, { name: "Grade 8", total: 25 },
        { name: "Grade 9", total: 25 }, { name: "Grade 10", total: 25 },
        { name: "Grade 11", total: 25 }, { name: "Grade 12", total: 25 },
    ].map(section => ({
        ...section,
        // Calculate unclaimed as a random number between 1 and total
        unclaimed: Math.floor(Math.random() * (section.total - 1)) + 1 
    }));
};

const generateStudents = () => {
    const mockStudents = [
        { id: 1, name: "Santos, Michaella Avaine", program: "Grade 10", status: "Eligible" },
        { id: 2, name: "Nabor, Samantha Roselle", program: "BSA 4", status: "Eligible" },
        { id: 3, name: "Manalo, Erica Kai", program: "BSAIS 3", status: "Ineligible" },
        { id: 4, name: "Silangon, Cherry Rose", program: "Grade 12", status: "Eligible" },
        { id: 5, name: "Feliciano, Keysi Star", program: "Grade 12", status: "Eligible" },
        { id: 6, name: "Concepcion, Princess Angel", program: "BSIS 1", status: "Eligible" },
        { id: 7, name: "Martin, Fiona Margarette", program: "BAB 3", status: "Eligible" },
        { id: 8, name: "Uson, Tracy Haven", program: "BAB 1", status: "Eligible" },
        { id: 9, name: "Roldan, Jamie Mae", program: "BSIT 2", status: "Eligible" },
        { id: 10, name: "Adna, Arjumina Nana", program: "BSAIS 1", status: "Eligible" },
        { id: 11, name: "Conception, Akira", program: "BSA 2", status: "Eligible" },
        { id: 12, name: "Dela Cruz, Juan", program: "BSIS 4", status: "Eligible" },
        { id: 13, name: "Reyes, Maria", program: "BSIS 4", status: "Eligible" },
    ];

    return mockStudents.map(student => ({
        ...student,
        // Randomly assign 'PF' or 'CO' for Claim Type
        claimType: Math.random() < 0.5 ? 'PF' : 'CO',
        // Static Claim Time for mock purposes
        claimTime: '10:30 AM' 
    }));
};

// --- CUSTOM HOOK: Handles Height Responsiveness & Pagination ---
const useTablePagination = (data, maxItems, itemHeight, minItems) => {
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(maxItems);
    const [pageNumbers, setPageNumbers] = useState([]);
    
    const wrapperRef = useRef(null);
    const footerRef = useRef(null);

    useEffect(() => {
        const wrapper = wrapperRef.current;
        if (!wrapper) return;

        const observer = new ResizeObserver(entries => {
            const entry = entries[0];
            const totalWrapperHeight = entry.contentRect.height;
            
            const HEADER_AND_PADDING = 72; // Header (40px) + Wrapper Padding (32px)
            const footerHeight = footerRef.current ? footerRef.current.offsetHeight : 50;

            const availableSpace = totalWrapperHeight - HEADER_AND_PADDING - footerHeight;

            const calculatedItems = Math.floor(availableSpace / itemHeight);
            
            const safeItems = Math.max(minItems, Math.min(maxItems, calculatedItems));
            
            setItemsPerPage(prev => {
                if (prev !== safeItems) {
                    setCurrentPage(1);
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

    // Generate Page Numbers 
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
    // Generate initials (Surname + First initial)
    const nameParts = name.split(',').map(s => s.trim());
    const surname = nameParts[0].substring(0, 1);
    const firstNameInitial = nameParts.length > 1 ? nameParts[1].substring(0, 1) : '';
    const initials = (firstNameInitial + surname).toUpperCase();
    
    return (
        <div style={{ width: 32, height: 32, borderRadius: '50%', backgroundColor: twColors['gray-200'], display: 'flex', alignItems: 'center', justifyContent: 'center', marginRight: '0.75rem', flexShrink: 0 }}>
            <span style={{ fontSize: '0.7rem', fontWeight: 600, color: twColors['gray-600'] }}>{initials}</span>
        </div>
    );
};


function ViewRecentEvent({ eventID, onBackToDashboard }) {
    // 1. DATA: Sections (with calculated unclaimed status)
    const sections = generateSections();

    // 2. DATA: Students (with random claim data)
    const initialMockStudents = generateStudents();

    // 3. HOOKS: Initialize Logic for Left and Right tables
    const leftTable = useTablePagination(sections, MAX_ITEMS_LEFT, ITEM_HEIGHT_ESTIMATE_PX, MIN_ITEMS_LEFT);
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
                                        {/* Table Header (Updated: Added Unclaimed) */}
                                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 0.5fr 0.5fr', fontSize: '0.75rem', color: twColors['gray-400'], paddingBottom: '0.5rem', borderBottomWidth: '1px', borderBottomColor: twColors['gray-50'], marginBottom: '0.5rem', paddingLeft: '0.5rem', paddingRight: '0.5rem', flexShrink: 0 }}>
                                            <span style={{ textAlign: 'left' }}>All</span>
                                            <span style={{ textAlign: 'center' }}>Unclaimed</span>
                                            <span style={{ textAlign: 'right' }}>Total</span>
                                        </div>
                                        <div style={{ flexGrow: 1, overflowY: 'hidden', paddingRight: '0.25rem', display: 'flex', flexDirection: 'column' }}>
                                            {leftTable.currentItems.map((section, index) => (
                                                <div key={index} className="hover:bg-gray-50" style={{ display: 'grid', gridTemplateColumns: '1fr 0.5fr 0.5fr', alignItems: 'center', paddingTop: '0.75rem', paddingBottom: '0.75rem', borderBottomWidth: '1px', borderBottomColor: twColors['gray-50'], fontSize: '0.875rem', color: twColors['gray-800'], paddingLeft: '0.5rem', paddingRight: '0.5rem', height: ITEM_HEIGHT_ESTIMATE_PX, flexShrink: 0 }}>
                                                    <span>{section.name}</span>
                                                    <span style={{textAlign: 'center'}}>{section.unclaimed}</span>
                                                    <span style={{textAlign: 'right'}}>{section.total}</span>
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
                                    {/* Table Header (Updated: Added Claim Type and Time) */}
                                    <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 0.8fr 0.5fr 0.8fr', fontSize: '0.75rem', color: twColors['gray-400'], paddingBottom: '0.5rem', borderBottomWidth: '1px', borderBottomColor: twColors['gray-50'], marginBottom: '0.5rem', paddingLeft: '0.5rem', paddingRight: '0.5rem', flexShrink: 0 }}>
                                        <span style={{ textAlign: 'left' }}>Student Name</span>
                                        <span style={{ textAlign: 'center' }}>Section/Program</span>
                                        <span style={{ textAlign: 'center' }}>Status</span>
                                        <span style={{ textAlign: 'center' }}>Claim Type</span>
                                        <span style={{ textAlign: 'right' }}>Claim Time</span>
                                    </div>

                                    {/* Student Rows */}
                                    <div style={{ flexGrow: 1, overflowY: 'hidden', paddingRight: '0.25rem', display: 'flex', flexDirection: 'column' }}>
                                        {rightTable.currentItems.map((student, index) => (
                                            <div 
                                                key={index} 
                                                className="hover:bg-gray-50"
                                                style={{ 
                                                    display: 'grid', gridTemplateColumns: '2fr 1fr 0.8fr 0.5fr 0.8fr', alignItems: 'center', 
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
                                                <div style={{ textAlign: 'center', color: student.status === 'Eligible' ? twColors['green-600'] : twColors['gray-600'], fontWeight: 600 }}>
                                                    {student.status}
                                                </div>
                                                
                                                {/* Col 4: Claim Type (New) */}
                                                <div style={{ textAlign: 'center', fontWeight: 500 }}>
                                                    {student.claimType}
                                                </div>

                                                {/* Col 5: Claim Time (New) */}
                                                <div style={{ textAlign: 'right', fontWeight: 500 }}>
                                                    {student.claimTime}
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

export { ViewRecentEvent };