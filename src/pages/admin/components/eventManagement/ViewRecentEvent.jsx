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
};

// --- CONFIGURATION ---
const MIN_ITEMS = 5;
const MAX_ITEMS = 12;
// Estimated height of a single list item (0.75rem padding top + 0.75rem padding bottom + 1px border + font ~ 45px)
const ITEM_HEIGHT_ESTIMATE_PX = 45;

function ViewRecentEvent() {
    // Mock data (14 items total)
    const sections = [
        { name: "Pre-kinder", total: 12 },
        { name: "Kinder", total: 15 },
        { name: "Grade 1", total: 25 },
        { name: "Grade 2", total: 22 },
        { name: "Grade 3", total: 19 },
        { name: "Grade 4", total: 25 },
        { name: "Grade 5", total: 25 },
        { name: "Grade 6", total: 25 },
        { name: "Grade 7", total: 25 },
        { name: "Grade 8", total: 25 },
        { name: "Grade 9", total: 25 },
        { name: "Grade 10", total: 25 },
        { name: "Grade 11", total: 25 },
        { name: "Grade 12", total: 25 },
    ];

    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(MAX_ITEMS); // Default to max, will adjust on mount
    const [pageNumbers, setPageNumbers] = useState([]);

    // REFS
    // We observe the OUTER wrapper (the white box) because its size is controlled by the screen.
    const tableWrapperRef = useRef(null);
    // We need the footer ref to subtract its height from the calculation.
    const footerRef = useRef(null);

    // --- ROBUST HEIGHT CALCULATION ---
    useEffect(() => {
        const wrapper = tableWrapperRef.current;
        if (!wrapper) return;

        const observer = new ResizeObserver(entries => {
            const entry = entries[0];
            // 1. Get the total height of the white box container
            const totalWrapperHeight = entry.contentRect.height;

            // 2. Define heights of static elements inside that box
            // Header: ~20px text + 0.5rem(8px) margin + 0.5rem(8px) padding + 1px border = approx 37-40px. 
            // We use 45px to be safe.
            const HEADER_SPACE = 45;

            // Padding: The wrapper has p-4 (1rem = 16px) on top and bottom. Total 32px.
            const WRAPPER_PADDING = 32;

            // Footer: Measure dynamically or estimate. 
            // If footer ref exists, use it, otherwise assume approx 50px (padding + button height).
            const footerHeight = footerRef.current ? footerRef.current.offsetHeight : 50;

            // 3. Calculate exactly how much space is left for the list items
            const availableSpaceForList = totalWrapperHeight - HEADER_SPACE - WRAPPER_PADDING - footerHeight;

            // 4. Divide by item height
            const calculatedMaxItems = Math.floor(availableSpaceForList / ITEM_HEIGHT_ESTIMATE_PX);

            // 5. Constrain (Min 5, Max 12)
            // We ensure it doesn't drop below 0 if screen is tiny
            const safeCalculation = Math.max(0, calculatedMaxItems);
            let newItemsPerPage = Math.max(MIN_ITEMS, Math.min(MAX_ITEMS, safeCalculation));

            setItemsPerPage(prev => {
                if (prev !== newItemsPerPage) {
                    // Only log/update if it actually changes
                    return newItemsPerPage;
                }
                return prev;
            });
        });

        observer.observe(wrapper);

        return () => observer.disconnect();
    }, []); // Run on mount

    // --- Pagination Logic ---
    const totalPages = Math.ceil(sections.length / itemsPerPage);
    // Safety check: if resize makes current page invalid, reset it
    useEffect(() => {
        if (currentPage > totalPages && totalPages > 0) {
            setCurrentPage(1);
        }
    }, [totalPages, currentPage]);

    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const currentItems = sections.slice(startIndex, endIndex);

    useEffect(() => {
        const numbers = [];
        if (totalPages <= 5) {
            for (let i = 1; i <= totalPages; i++) {
                numbers.push(i);
            }
        } else {
            numbers.push(1);
            if (currentPage > 2) numbers.push('...');
            if (currentPage > 1 && currentPage < totalPages) numbers.push(currentPage);
            if (currentPage < totalPages - 1 && currentPage !== 1) numbers.push('...');
            if (totalPages > 1) numbers.push(totalPages);
        }
        setPageNumbers([...new Set(numbers)]);
    }, [totalPages, currentPage]);


    const nextPage = () => setCurrentPage(prev => Math.min(prev + 1, totalPages));
    const prevPage = () => setCurrentPage(prev => Math.max(prev - 1, 1));
    const isPrevDisabled = currentPage === 1;
    const isNextDisabled = currentPage >= totalPages || totalPages === 0;

    return (
        <div style={{ width: '100%', height: 'calc(100vh - 60px)' }}>

            <div style={{ width: '100%', height: '100%', display: 'grid', gridTemplateColumns: '2% 96% 2%' }}>
                <div style={{ height: 'calc(100% - 10px)' }}>
                    <div
                        className="cursor-pointer hover:bg-gray-100"
                        style={{ marginTop: '1rem', borderRadius: '9999px', padding: '0.25rem', width: 'fit-content' }}
                    >
                        <ChevronLeft />
                    </div>
                </div>

                <div
                    style={{
                        width: '100%',
                        height: 'calc(100% - 10px)',
                        display: 'flex',
                        alignItems: 'flex-start',
                        justifyContent: 'center',
                        backgroundColor: 'white',
                        borderRadius: 8
                    }}
                >

                    <div
                        style={{
                            width: '100%',
                            height: '100%',
                            display: 'flex',
                            flexDirection: 'column',
                            padding: 10
                        }}
                    >
                        {/*HEADER*/}
                        <div
                            style={{
                                height: '50px',
                                width: '100%',
                                display: 'flex',
                                justifyContent: 'space-between',
                                flexShrink: 0
                            }}
                        >
                            <div>
                                <p style={{ fontSize: 16, fontFamily: 'geist', fontWeight: 500 }}>Sample Event Name</p>
                                <h2 style={{ fontSize: 13, fontFamily: 'geist', fontWeight: 400, color: "#4C4B4B" }}>View Recent Event</h2>
                            </div>
                            <button
                                type="submit"
                                style={{
                                    background: 'linear-gradient(to right, #4268BD, #3F6AC9)',
                                    cursor: 'pointer',
                                    fontWeight: '600',
                                    color: 'white',
                                    border: 'none',
                                    height: 'auto',
                                    borderRadius: 12,
                                    fontSize: '14px',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '5px',
                                    padding: "0px 20px",
                                }}
                                className="transition-colors hover:bg-blue-700 shadow-md"
                            >
                                <Edit2 size={20} color="white" /> Edit
                            </button>
                        </div>

                        {/*BODY*/}
                        <div
                            style={{
                                width: '100%',
                                flex: '1 1 0%',
                                display: 'grid',
                                gridTemplateColumns: 'repeat(2, 1fr)',
                                gap: '1rem',
                                paddingTop: 15,
                                overflow: 'hidden'
                            }}
                        >
                            {/*LEFT SIDE CONTENT*/}
                            <div
                                style={{
                                    height: '100%',
                                    width: '100%',
                                    display: 'flex',
                                    flexDirection: 'column'
                                }}
                            >
                                {/* Inputs Row */}
                                <div
                                    style={{
                                        display: 'flex',
                                        flexDirection: 'column',
                                        width: '100%',
                                        gap: '1rem',
                                        marginBottom: 20,
                                        flexShrink: 0
                                    }}
                                >
                                    <div style={{ flex: '1 1 0%', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                        <label className="font-geist" style={{ fontSize: '0.875rem', color: twColors['black'], flexShrink: 0, fontWeight: 500, marginRight: '0.5rem' }}>
                                            Event Name:
                                        </label>
                                        <input type="text" defaultValue="Teachers' Day" className="focus:outline-none focus:ring-2 focus:ring-blue-500/20 font-geist" style={{ width: '100%', backgroundColor: '#F3F4F8', height: '40px', color: twColors['gray-700'], paddingLeft: '0.75rem', paddingRight: '0.75rem', borderRadius: 4, fontSize: 13 }} />
                                    </div>
                                    <div style={{ flex: '1 1 0%', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                        <label className="font-geist" style={{ fontSize: '0.875rem', color: twColors['black'], flexShrink: 0, fontWeight: 500, marginRight: '0.5rem' }}>
                                            Department/s:
                                        </label>
                                        <input type="text" defaultValue="All Departments" className="focus:outline-none focus:ring-2 focus:ring-blue-500/20 font-geist" style={{ width: '100%', backgroundColor: '#F3F4F8', height: '40px', color: twColors['gray-700'], paddingLeft: '0.75rem', paddingRight: '0.75rem', borderRadius: 4, fontSize: 13 }} />
                                    </div>
                                </div>

                                {/* TABLE SECTION */}
                                <div
                                    className="font-geist"
                                    style={{
                                        width: '100%',
                                        display: 'flex',
                                        flexDirection: 'column',
                                        flex: '1 1 0%',
                                        overflow: 'hidden'
                                    }}
                                >
                                    <label style={{ fontSize: '0.875rem', color: twColors['black'], fontWeight: 500, marginBottom: '0.5rem', display: 'block', flexShrink: 0 }}>
                                        Sections/Programs:
                                    </label>

                                    {/* TABLE WRAPPER - Observed by ResizeObserver */}
                                    <div
                                        ref={tableWrapperRef}
                                        style={{
                                            borderWidth: '1px',
                                            borderColor: twColors['gray-100'],
                                            borderRadius: '0.5rem',
                                            padding: '1rem',
                                            display: 'flex',
                                            flexDirection: 'column',
                                            flex: '1 1 0%', // Grows/Shrinks with screen
                                            backgroundColor: 'white',
                                            boxShadow: '0px 0px 4px rgba(0,0,0,0.05)',
                                            minHeight: 0 // Crucial for flex shrinking
                                        }}
                                    >
                                        {/* Table Header */}
                                        <div
                                            style={{
                                                display: 'flex',
                                                justifyContent: 'space-between',
                                                fontSize: '0.75rem',
                                                color: twColors['gray-400'],
                                                paddingBottom: '0.5rem',
                                                borderBottomWidth: '1px',
                                                borderBottomColor: twColors['gray-50'],
                                                marginBottom: '0.5rem',
                                                paddingLeft: '0.5rem',
                                                paddingRight: '0.5rem',
                                                flexShrink: 0,
                                            }}
                                        >
                                            <span>All</span>
                                            <span>Total</span>
                                        </div>

                                        {/* List Content */}
                                        <div
                                            style={{
                                                flexGrow: 1,
                                                overflowY: 'hidden', // No scrolling
                                                paddingRight: '0.25rem',
                                                display: 'flex',
                                                flexDirection: 'column',
                                            }}
                                        >
                                            {currentItems.map((section, index) => (
                                                <div
                                                    key={index}
                                                    className="hover:bg-gray-50"
                                                    style={{
                                                        display: 'flex',
                                                        justifyContent: 'space-between',
                                                        alignItems: 'center',
                                                        paddingTop: '0.75rem',
                                                        paddingBottom: '0.75rem',
                                                        borderBottomWidth: '1px',
                                                        borderBottomColor: twColors['gray-50'],
                                                        fontSize: '0.875rem',
                                                        color: twColors['gray-800'],
                                                        paddingLeft: '0.5rem',
                                                        paddingRight: '0.5rem',
                                                        height: ITEM_HEIGHT_ESTIMATE_PX,
                                                        flexShrink: 0
                                                    }}
                                                >
                                                    <span>{section.name}</span>
                                                    <span>{section.total}</span>
                                                </div>
                                            ))}

                                            {/* Padding Divs (to maintain visual consistency if items < limit) */}
                                            {currentItems.length < itemsPerPage &&
                                                Array(itemsPerPage - currentItems.length).fill(0).map((_, index) => (
                                                    <div
                                                        key={`pad-${index}`}
                                                        style={{
                                                            height: ITEM_HEIGHT_ESTIMATE_PX,
                                                            borderBottomWidth: index === (itemsPerPage - currentItems.length - 1) && endIndex >= sections.length ? '0' : '1px',
                                                            borderBottomColor: twColors['gray-50'],
                                                            flexShrink: 0
                                                        }}
                                                    />
                                                ))}
                                        </div>

                                        {/* Pagination Footer */}
                                        <div
                                            ref={footerRef}
                                            style={{
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                gap: '1rem',
                                                paddingTop: '1rem',
                                                marginTop: 'auto',
                                                flexShrink: 0,
                                                opacity: totalPages <= 1 ? 0 : 1, // Hide visually if 1 page but keep height for math
                                                pointerEvents: totalPages <= 1 ? 'none' : 'auto'
                                            }}
                                        >
                                            <button
                                                onClick={prevPage}
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
                                                onClick={nextPage}
                                                disabled={isNextDisabled}
                                                className="hover:bg-gray-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                                style={{ display: 'flex', alignItems: 'center', backgroundColor: twColors['gray-100'], paddingLeft: '0.75rem', paddingRight: '0.75rem', paddingTop: '0.375rem', paddingBottom: '0.375rem', borderRadius: '0.25rem', fontSize: '0.75rem', fontWeight: 500, color: twColors['black'], cursor: isNextDisabled ? 'default' : 'pointer' }}
                                            >
                                                Next <ChevronRight size={16} style={{ marginLeft: '0.25rem' }} />
                                            </button>
                                        </div>
                                    </div>
                                </div>

                            </div>

                            {/* RIGHT SIDE PLACEHOLDER */}
                            <div style={{ height: '100%', width: '100%', borderWidth: '1px', borderColor: twColors['gray-200'], borderRadius: '0.5rem', display: 'flex', alignItems: 'center', justifyContent: 'center', color: twColors['gray-400'], fontSize: '0.875rem' }}>
                                Right side content
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