// MealOrdersTable.jsx

import React, { useState, useMemo, useEffect, useRef } from 'react';
import { Search, Calendar, ChevronLeft, ChevronRight, Check, X } from 'lucide-react';
import { IoGrid } from "react-icons/io5";
// --- Import Child Components ---
import { PendingOrdersTable } from './PendingOrdersTable';
import { ConfirmedOrdersTable } from './ConfirmedOrdersTable';

// --- MOCK DATA GENERATION ---
const generateMockRequests = () => {
    const senders = [
        "Ms. Maria Santos", "Mr. Rudy Iba", "Ms. Jennifer Moderato", "Ms. Sophie Sarcia",
        "Mr. Joseph Washington", "Mr. Lorence Tagailog", "Mr. Rafael Marco", "Ms. Marco Marcos",
        "Mr. Francia Francisco", "Ms. Jeremiah Imperial", "Mr. Francisco Ebajan", "Ms. Josephine Santos", "Mr. Tagah Logis"
    ];
    const sections = [
        "1-Matthew", "1-Luke", "1-Marcos", "1-John", "1-Timothy",
        "2-Peter", "3-Paul", "4-Bartholomew", "4-Simon", "5-Jonas",
        "6-Job", "6-Abraham", "7-Moses", "5-Jonas"
    ];

    return sections.map((section, index) => ({
        id: index + 1,
        sectionProgram: section,
        sender: senders[index % senders.length],
        recipientCount: Math.floor(Math.random() * 40) + 30, // 30-70
        waivedCount: Math.floor(Math.random() * 15), // 0-14
        timeSent: "7:10 AM",
        // Assign specific statuses based on view type
        status: index % 2 === 0 ? "Approved" : (index === 13 ? "Rejected" : "Pending..."),
        isConfirmed: index % 2 === 0 || index === 13 // True for Approved/Rejected
    }));
};

// --- CONFIGURATION ---
const MIN_ITEMS = 4;
const MAX_ITEMS = 13;
const ITEM_HEIGHT_ESTIMATE_PX = 60;
const PADDING_TOP_BOTTOM = 24; // 1.5rem padding on main div

// --- REUSABLE FOOTER COMPONENT ---
const Footer = ({ totalPages, currentPage, handlePageChange, totalRequests = 1839 }) => (
    <div style={{
        padding: '1.5rem',
        borderTop: '1px solid #f3f4f6',
        display: 'flex',
        flexWrap: 'wrap',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '1rem',
        flexShrink: 0,
        backgroundColor: 'white'
    }}>
        {/* Left Side Totals */}
        <div style={{ display: 'flex', gap: '1.5rem', fontSize: '0.875rem', fontWeight: 500 }}>
            {/* These details match the Confirmed Orders image */}
            <span style={{ color: '#1f2937' }}>Total Food Requests: <span style={{ fontWeight: 700 }}>{totalRequests}</span></span>
            <span style={{ color: '#047857' }}>Approved: <span style={{ fontWeight: 700 }}>500</span></span>
            <span style={{ color: '#b91c1c' }}>Rejected: <span style={{ fontWeight: 700 }}>10</span></span>
        </div>

        {/* Pagination Controls */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="flex items-center gap-1 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                style={{
                    padding: '0.5rem 0.75rem', borderRadius: '0.5rem',
                    fontSize: '0.875rem', fontWeight: 500, color: '#4b5563',
                    display: 'flex', alignItems: 'center', gap: '0.25rem'
                }}
            >
                <ChevronLeft size={16} /> Previous
            </button>

            {[...Array(Math.min(3, totalPages))].map((_, i) => (
                <button
                    key={i}
                    onClick={() => handlePageChange(i + 1)}
                    className={`transition-colors`}
                    style={{
                        width: '2rem', height: '2rem', borderRadius: '0.5rem',
                        fontSize: '0.875rem', fontWeight: 500, display: 'flex',
                        alignItems: 'center', justifyContent: 'center',
                        backgroundColor: currentPage === i + 1 ? '#1f2937' : 'transparent',
                        color: currentPage === i + 1 ? 'white' : '#4b5563'
                    }}
                >
                    {i + 1}
                </button>
            ))}
            {totalPages > 3 && <span style={{ color: '#9ca3af' }}>...</span>}

            <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="flex items-center gap-1 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                style={{
                    padding: '0.5rem 0.75rem', borderRadius: '0.5rem',
                    fontSize: '0.875rem', fontWeight: 500, color: '#4b5563',
                    display: 'flex', alignItems: 'center', gap: '0.25rem'
                }}
            >
                Next <ChevronRight size={16} />
            </button>
        </div>
    </div>
);


const MealOrdersTable = () => {
    // --- STATE ---
    const [activeTab, setActiveTab] = useState('All');
    const [orderType, setOrderType] = useState('Pending Orders');
    const [currentPage, setCurrentPage] = useState(1);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedDate, setSelectedDate] = useState('July 21, 2025');

    // Dynamic Pagination State
    const [itemsPerPage, setItemsPerPage] = useState(MAX_ITEMS);

    // Refs for height calculation - Observing the table body wrapper
    const tableWrapperRef = useRef(null);
    const footerRef = useRef(null); // Ref for the footer inside the card

    const allRequests = useMemo(() => generateMockRequests(), []);

    // --- FILTER DATA BASED ON ORDER TYPE ---
    const filteredRequests = useMemo(() => {
        const baseFilter = allRequests.filter(request => {
            const matchesSearch = request.sectionProgram.toLowerCase().includes(searchTerm.toLowerCase()) ||
                request.sender.toLowerCase().includes(searchTerm.toLowerCase());
            return matchesSearch;
        });

        if (orderType === 'Confirmed Orders') {
            return baseFilter.filter(r => r.isConfirmed);
        } else {
            return baseFilter.filter(r => !r.isConfirmed);
        }
    }, [allRequests, searchTerm, orderType]);

    // --- HEIGHT CALCULATION LOGIC (Runs on component mount/resize) ---
    useEffect(() => {
        const wrapper = tableWrapperRef.current;
        const footer = footerRef.current;
        if (!wrapper || !footer) return;

        const observer = new ResizeObserver(entries => {
            const entry = entries[0];
            const totalCardHeight = entry.contentRect.height;

            // Measure fixed heights inside the card to determine space for rows
            const headerHeight = 220; // Estimated height of the header section (Title + Controls)
            const footerHeight = footer.offsetHeight; // Measured dynamically

            // Card inner padding: PADDING_TOP_BOTTOM * 2 + PADDING_RIGHT_LEFT * 2
            // Since the outer div has p-6 (24px) and the card is inside it, the card content area
            // available height is Card.height - Header.height - Footer.height

            const availableSpace = totalCardHeight - headerHeight - footerHeight;
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
    }, [orderType]); // Rerun logic if orderType changes (height changes slightly)


    // --- PAGINATION ---
    const totalPages = Math.ceil(filteredRequests.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const currentData = filteredRequests.slice(startIndex, startIndex + itemsPerPage);

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

    // Determine the component to render
    const TableComponent = orderType === 'Confirmed Orders' ? ConfirmedOrdersTable : PendingOrdersTable;

    return (
        <div style={{
            width: '100%',
            height: 'calc(100vh - 90px)',
            display: 'flex',
            flexDirection: 'column',
            padding: '1.5rem',
            fontFamily: "'Geist', sans-serif",
            color: '#1f2937',
            overflow: 'hidden',
            backgroundColor: '#f9fafb'
        }}>

            {/* Top Navigation & Order Type */}
            <div style={{
                display: 'flex', flexWrap: 'wrap', gap: '1rem', marginBottom: '1.5rem', flexShrink: 0,
                justifyContent: 'space-between', alignItems: 'center'
            }}>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                    {/* Tabs (omitted for brevity, assume they handle activeTab state) */}
                    {['All', 'Preschool', 'Primary Education', 'Intermediate', 'Junior High School', 'Senior High School', 'Higher Education'].map((tab) => (
                        <button
                            key={tab}
                            onClick={() => { setActiveTab(tab); setCurrentPage(1); }}
                            className={`hover:cursor-pointer hover:bg-gray-200 text-sm font-medium transition-colors ${activeTab === tab ? '' : 'text-gray-600'}`}
                            style={{ padding: '0.5rem 1rem', borderRadius: 12, fontSize: '0.875rem', fontWeight: 500, backgroundColor: activeTab === tab ? '#4268BD' : '#f3f4f6', color: activeTab === tab ? 'white' : '#4b5563' }}
                        >
                            {tab}
                        </button>
                    ))}
                </div>
                <div style={{ display: 'flex', backgroundColor: '#f3f4f6', borderRadius: '0.5rem', padding: '0.25rem' }}>
                    <button
                        onClick={() => setOrderType('Pending Orders')}
                        className={`flex items-center gap-2 transition-colors ${orderType === 'Pending Orders' ? 'shadow-sm' : 'hover:bg-gray-200 text-gray-600'}`}
                        style={{ padding: '0.5rem 1rem', borderRadius: '0.375rem', fontSize: '0.875rem', fontWeight: 500, display: 'flex', alignItems: 'center', gap: '0.5rem', backgroundColor: orderType === 'Pending Orders' ? '#4268BD' : 'transparent', color: orderType === 'Pending Orders' ? 'white' : '#4b5563' }}
                    >
                        <span style={{ width: '0.5rem', height: '0.5rem', borderRadius: '9999px', backgroundColor: orderType === 'Pending Orders' ? 'white' : 'transparent' }}></span> Pending Orders
                    </button>
                    <button
                        onClick={() => setOrderType('Confirmed Orders')}
                        className={`transition-colors ${orderType === 'Confirmed Orders' ? 'shadow-sm' : 'hover:bg-gray-200 text-gray-600'}`}
                        style={{ padding: '0.5rem 1rem', borderRadius: '0.375rem', fontSize: '0.875rem', fontWeight: 500, backgroundColor: orderType === 'Confirmed Orders' ? '#4268BD' : 'transparent', color: orderType === 'Confirmed Orders' ? 'white' : '#4b5563' }}
                    >
                        Confirmed Orders
                    </button>
                </div>
            </div>

            {/* Main Card */}
            <div style={{
                backgroundColor: 'white', borderRadius: '0.75rem', boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)', border: '1px solid #e5e7eb',
                display: 'flex', flexDirection: 'column', flex: '1 1 0%', minHeight: 0, overflow: 'hidden', fontFamily: 'geist'
            }}>

                {/* Header Section (Title + Controls) - Approx 220px high */}
                <div style={{ padding: '1.5rem', borderBottom: '1px solid #f3f4f6', flexShrink: 0 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                        <div>
                            <h1 style={{ fontFamily: "geist", fontWeight: 500, fontSize: 16, color: '#1f2937' }}>All Requests</h1>
                            <p style={{ fontFamlily: "geist", color: '#667085', fontSize: 12 }}>
                                {orderType === 'Confirmed Orders' ? "Here's a list of confirmed orders" : "Here's a list of upcoming orders"}
                            </p>
                        </div>
                        <button className="hover:bg-[#3557a0] transition-colors"
                            style={{ backgroundColor: '#4268BD', color: 'white', fontSize: 12, fontWeight: 550, padding: '0.75rem 1.5rem', borderRadius: 12, boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)' }}>
                            View Unsubmitted Sections
                        </button>
                    </div>

                    {/* Controls */} 
                    {/* Conditional Approve/Reject All Buttons */}
                    {orderType === 'Pending Orders' && (
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', alignItems: 'center', justifyContent: 'space-between' }}>
                            <div style={{ position: 'relative', flex: '1 1 0%', maxWidth: '28rem' }}>
                                <Search style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: '#4C4B4B' }} size={18} />
                                <input
                                    type="text" placeholder="Search" className="focus:ring-2 focus:ring-[#4268BD] outline-none"
                                    style={{ fontFamily: "geist", fontSize: 12, fontWeight: 400, width: '100%', paddingLeft: '2.5rem', paddingRight: '1rem', paddingTop: "8px", paddingBottom: "8px", backgroundColor: "#F0F1F6", border: 'none', borderRadius: 50 }}
                                    value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)}
                                />
                            </div>
                            <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
                                <button className="hover:bg-gray-200 transition-colors" style={{ backgroundColor: '#f3f4f6', color: '#4b5563', padding: "5px 10px", borderRadius: 5, fontSize: '0.875rem', fontWeight: 500, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                    {selectedDate} <Calendar size={16} />
                                </button>

                                <>
                                    <button className="hover:bg-[#3557a0] transition-colors shadow-sm"
                                        style={{ backgroundImage: 'linear-gradient(to right, #2A86F8, #337EDA)', color: 'white', padding: "10px 20px", borderRadius: 12, fontSize: '0.875rem', fontWeight: 500, display: 'flex', alignItems: 'center', gap: '0.2rem' }}>
                                        <Check size={18} strokeWidth={4} /> Approve All
                                    </button>
                                    <button className="hover:bg-[#e86a61] transition-colors shadow-sm"
                                        style={{ backgroundColor: '#FF8772', color: 'white', padding: "10px 20px", borderRadius: 12, fontSize: '0.875rem', fontWeight: 500, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                        <X size={18} strokeWidth={4} /> Reject All
                                    </button>
                                </>
                            </div>
                        </div>
                    )}
                </div>

                {/* Table Section - This container defines the available height */}
                <div
                    ref={tableWrapperRef}
                    style={{ flex: '1 1 0%', overflowY: 'hidden', width: '100%' }}
                >
                    {/* Conditional Table Render */}
                    <TableComponent
                        currentData={currentData}
                        itemsPerPage={itemsPerPage}
                        totalPages={totalPages}
                        handlePageChange={handlePageChange}
                    />
                </div>

                {/* Footer Section */}
                <Footer totalPages={totalPages} currentPage={currentPage} handlePageChange={handlePageChange} footerRef={footerRef} />
            </div>
        </div>
    );
};

export { MealOrdersTable };