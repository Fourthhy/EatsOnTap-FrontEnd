import React, { useState, useMemo, useEffect, useRef } from 'react';
import { Search, Calendar, ChevronLeft, ChevronRight, Check, X } from 'lucide-react';

// --- MOCK DATA GENERATION ---
const generateMockRequests = () => {
    const senders = [
        "Ms. Maria Santos", "Mr. Rudy Iba", "Ms. Jennifer Moderato", "Ms. Sophie Sarcia",
        "Mr. Joseph Washington", "Mr. Lorence Tagailog", "Mr. Rafael Marco", "Ms. Marco Marcos",
        "Mr. Francia Francisco", "Ms. Jeremiah Imperial", "Mr. Francisco Ebajan", "Ms. Josephine Santos"
    ];
    const sections = [
        "1-Matthew", "1-Luke", "1-Marcos", "1-John", "1-Timothy",
        "2-Peter", "3-Paul", "4-Bartholomew", "4-Simon", "5-Jonas",
        "6-Job", "6-Abraham", "7-Moses"
    ];

    return sections.map((section, index) => ({
        id: index + 1,
        sectionProgram: section,
        sender: senders[index % senders.length],
        recipientCount: Math.floor(Math.random() * 40) + 30, // 30-70
        waivedCount: Math.floor(Math.random() * 15), // 0-14
        timeSent: "7:10 AM",
        status: "Pending...",
    }));
};

// --- CONFIGURATION ---
const MIN_ITEMS = 4;
const MAX_ITEMS = 13;
const ITEM_HEIGHT_ESTIMATE_PX = 60; // Adjusted for new row height

const MealOrdersTable = () => {
    // --- STATE ---
    const [activeTab, setActiveTab] = useState('All');
    const [orderType, setOrderType] = useState('Pending Orders');
    const [currentPage, setCurrentPage] = useState(1);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedDate, setSelectedDate] = useState('July 21, 2025');

    // Dynamic Pagination State
    const [itemsPerPage, setItemsPerPage] = useState(MAX_ITEMS);

    // Refs for height calculation
    const tableWrapperRef = useRef(null);

    const allRequests = useMemo(() => generateMockRequests(), []);

    // --- HEIGHT CALCULATION LOGIC ---
    useEffect(() => {
        const wrapper = tableWrapperRef.current;
        if (!wrapper) return;

        const observer = new ResizeObserver(entries => {
            const entry = entries[0];
            const containerHeight = entry.contentRect.height;
            const availableSpace = containerHeight - 50; // Subtract header height
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

    // --- FILTERS & DATA ---
    const filteredRequests = allRequests.filter(request => {
        // Implement tab filtering logic here if needed based on sectionProgram
        const matchesSearch = request.sectionProgram.toLowerCase().includes(searchTerm.toLowerCase()) ||
            request.sender.toLowerCase().includes(searchTerm.toLowerCase());
        return matchesSearch;
    });

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

    // --- RENDER ---
    return (
        <div style={{
            width: '100%',
            height: 'calc(100vh - 90px)', // FIX: Re-establish constraint
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
                display: 'flex',
                flexWrap: 'wrap',
                gap: '1rem',
                marginBottom: '1.5rem',
                flexShrink: 0,
                justifyContent: 'space-between',
                alignItems: 'center'
            }}>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                    {tabs.map((tab) => (
                        <button
                            key={tab}
                            onClick={() => { setActiveTab(tab); setCurrentPage(1); }}
                            className={`hover:cursor-pointer hover:bg-gray-200 text-sm font-medium transition-colors ${activeTab === tab ? '' : 'text-gray-600'}`}
                            style={{
                                padding: '0.5rem 1rem',
                                borderRadius: 12, // rounded-full
                                fontSize: '0.875rem', // text-sm
                                fontWeight: 500, // font-medium
                                backgroundColor: activeTab === tab ? '#4268BD' : '#f3f4f6', // bg-[#4268BD] / bg-gray-100
                                color: activeTab === tab ? 'white' : '#4b5563', // text-white / text-gray-600
                            }}
                        >
                            {tab}
                        </button>
                    ))}
                </div>
                <div style={{ display: 'flex', backgroundColor: '#f3f4f6', borderRadius: '0.5rem', padding: '0.25rem' }}>
                    <button
                        onClick={() => setOrderType('Pending Orders')}
                        className={`flex items-center gap-2 transition-colors ${orderType === 'Pending Orders' ? 'shadow-sm' : 'hover:bg-gray-200 text-gray-600'}`}
                        style={{
                            padding: '0.5rem 1rem',
                            borderRadius: '0.375rem',
                            fontSize: '0.875rem',
                            fontWeight: 500,
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.5rem',
                            backgroundColor: orderType === 'Pending Orders' ? '#4268BD' : 'transparent',
                            color: orderType === 'Pending Orders' ? 'white' : '#4b5563'
                        }}
                    >
                        <span style={{ width: '0.5rem', height: '0.5rem', borderRadius: '9999px', backgroundColor: orderType === 'Pending Orders' ? 'white' : 'transparent' }}></span> Pending Orders
                    </button>
                    <button
                        onClick={() => setOrderType('Confirmed Orders')}
                        className={`transition-colors ${orderType === 'Confirmed Orders' ? 'shadow-sm' : 'hover:bg-gray-200 text-gray-600'}`}
                        style={{
                            padding: '0.5rem 1rem',
                            borderRadius: '0.375rem',
                            fontSize: '0.875rem',
                            fontWeight: 500,
                            backgroundColor: orderType === 'Confirmed Orders' ? '#4268BD' : 'transparent',
                            color: orderType === 'Confirmed Orders' ? 'white' : '#4b5563'
                        }}
                    >
                        Confirmed Orders
                    </button>
                </div>
            </div>

            {/* Main Card */}
            <div style={{
                backgroundColor: 'white',
                borderRadius: '0.75rem', // rounded-xl
                boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)', // shadow-sm
                border: '1px solid #e5e7eb', // border border-gray-200
                display: 'flex',
                flexDirection: 'column',
                flex: '1 1 0%', // flex-1 min-h-0
                minHeight: 0,
                overflow: 'hidden',
                fontFamily: 'geist'
            }}>

                {/* Header Section */}
                <div style={{
                    padding: '1.5rem',
                    borderBottom: '1px solid #f3f4f6', // border-b border-gray-100
                    flexShrink: 0
                }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                        <div>
                            <h1 style={{ fontFamily: "geist", fontWeight: 500, fontSize: 16, color: '#1f2937' }}>All Requests</h1>
                            <p style={{ fontFamlily: "geist", color: '#667085', fontSize: 12 }}>Here's a list of upcoming orders</p>
                        </div>
                        <button className="hover:bg-[#3557a0] transition-colors"
                            style={{
                                backgroundColor: '#4268BD',
                                color: 'white',
                                fontSize: 12,
                                fontWeight: 550,
                                padding: '0.75rem 1.5rem',
                                borderRadius: 12, // rounded-xl
                                boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)' // shadow-sm
                            }}>
                            View Unsubmitted Sections
                        </button>
                    </div>

                    {/* Controls */}
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', alignItems: 'center', justifyContent: 'space-between' }}>
                        <div style={{ position: 'relative', flex: '1 1 0%', maxWidth: '28rem' }}> {/* flex-1 max-w-md */}
                            <Search style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: '#4C4B4B' }} size={18} /> {/* left-4 text-gray-400 */}
                            <input
                                type="text"
                                placeholder="Search"
                                className="focus:ring-2 focus:ring-[#4268BD] outline-none"
                                style={{
                                    fontFamily: "geist",
                                    fontSize: 12,
                                    fontWeight: 400,
                                    width: '100%',
                                    paddingLeft: '2.5rem',
                                    paddingRight: '1rem',
                                    paddingTop: "8px",
                                    paddingBottom: "8px",
                                    backgroundColor: "#F0F1F6",
                                    border: 'none',
                                    borderRadius: 50,
                                    fontSize: '0.875rem',
                                }}
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                        <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
                            <button className="hover:bg-gray-200 transition-colors"
                                style={{
                                    backgroundColor: '#f3f4f6', // bg-gray-100
                                    color: '#4b5563', // text-gray-600
                                    padding: "5px 10px", // px-4 py-3
                                    borderRadius: 5, // rounded-xl
                                    fontSize: '0.875rem', // text-sm
                                    fontWeight: 500,
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '0.5rem'
                                }}>
                                {selectedDate} <Calendar size={16} />
                            </button>
                            <button className="hover:bg-[#3557a0] transition-colors shadow-sm"
                                style={{
                                    backgroundImage: 'linear-gradient(to right, #2A86F8, #337EDA)',
                                    color: 'white',
                                    padding: "10px 20px",
                                    borderRadius: 12, // rounded-xl
                                    fontSize: '0.875rem',
                                    fontWeight: 500,
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '0.2rem'
                                }}>
                                <Check size={18} strokeWidth={4} /> Approve All
                            </button>
                            <button className="hover:bg-[#e86a61] transition-colors shadow-sm"
                                style={{
                                    backgroundColor: '#FF8772',
                                    color: 'white',
                                    padding: "10px 20px",
                                    borderRadius: 12, // rounded-xl
                                    fontSize: '0.875rem',
                                    fontWeight: 500,
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '0.5rem'
                                }}>
                                <X size={18} strokeWidth={4} /> Reject All
                            </button>
                        </div>
                    </div>
                </div>

                {/* Table Section */}
                <div
                    ref={tableWrapperRef}
                    style={{
                        flex: '1 1 0%', // flex-1
                        overflowY: 'hidden',
                        width: '100%'
                    }}
                >
                    <table style={{ width: '100%', textAlign: 'left', borderCollapse: 'collapse' }}>
                        {/* FIX: Remove whitespace/line breaks inside <thead> */}
                        <thead style={{ backgroundColor: '#f9fafb', position: 'sticky', top: 0, zIndex: 10 }}><tr>
                            <th style={{ padding: '12px 24px', fontFamily: "geist", fontWeight: 450, color: '#667085', fontSize: '0.875rem' }}>Section/Program</th>
                            <th style={{ padding: '12px 24px', fontFamily: "geist", fontWeight: 450, color: '#667085', fontSize: '0.875rem' }}>Sender</th>
                            <th style={{ padding: '12px 24px', fontFamily: "geist", fontWeight: 450, color: '#667085', fontSize: '0.875rem' }}>Recipient Count</th>
                            <th style={{ padding: '12px 24px', fontFamily: "geist", fontWeight: 450, color: '#667085', fontSize: '0.875rem' }}>Waived Count</th>
                            <th style={{ padding: '12px 24px', fontFamily: "geist", fontWeight: 450, color: '#667085', fontSize: '0.875rem' }}>Time Sent</th>
                            <th style={{ padding: '12px 24px', fontFamily: "geist", fontWeight: 450, color: '#667085', fontSize: '0.875rem' }}>Status</th>
                            <th style={{ padding: '12px 24px', fontFamily: "geist", fontWeight: 450, color: '#667085', fontSize: '0.875rem', textAlign: 'center' }}>Action</th>
                        </tr></thead>
                        <tbody style={{ borderSpacing: 0, borderTop: '1px solid #f3f4f6' }}> {/* divide-y divide-gray-100 */}
                            {currentData.map((request, index) => (
                                <tr key={request.id} className="hover:bg-gray-50 transition-colors" style={{ height: ITEM_HEIGHT_ESTIMATE_PX, borderBottom: '1px solid #f3f4f6' }}>
                                    <td style={{ padding: '12px 24px', fontSize: '0.875rem', fontWeight: 500, color: '#1f2937' }}>{request.sectionProgram}</td>
                                    <td style={{ padding: '12px 24px', fontSize: '0.875rem', color: '#4b5563' }}>{request.sender}</td>
                                    <td style={{ padding: '12px 24px', fontSize: '0.875rem', color: '#4b5563' }}>{request.recipientCount}</td>
                                    <td style={{ padding: '12px 24px', fontSize: '0.875rem', color: '#4b5563' }}>{request.waivedCount}</td>
                                    <td style={{ padding: '12px 24px', fontSize: '0.875rem', color: '#4b5563' }}>{request.timeSent}</td>
                                    <td style={{ padding: '12px 24px' }}>
                                        <span style={{
                                            display: 'inline-flex',
                                            alignItems: 'center',
                                            gap: '0.375rem', // gap-1.5
                                            padding: '0.375rem 0.75rem', // px-3 py-1.5
                                            borderRadius: '9999px', // rounded-full
                                            fontSize: '0.75rem', // text-xs
                                            fontWeight: 500,
                                            backgroundColor: '#E8F0FE', // bg-[#E8F0FE]
                                            color: '#4268BD'
                                        }}>
                                            <span style={{ width: '0.375rem', height: '0.375rem', borderRadius: '9999px', backgroundColor: '#4268BD' }}></span>
                                            {request.status}
                                        </span>
                                    </td>
                                    <td style={{ padding: '1rem 1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
                                        <button className="hover:bg-[#3557a0] transition-colors"
                                            style={{
                                                backgroundColor: '#4268BD',
                                                color: 'white',
                                                padding: '0.375rem 0.75rem', // px-3 py-1.5
                                                borderRadius: '0.5rem', // rounded-lg
                                                fontSize: '0.75rem',
                                                fontWeight: 500,
                                                display: 'flex',
                                                alignItems: 'center',
                                                gap: '0.25rem'
                                            }}>
                                            <Check size={14} /> Approve
                                        </button>
                                        <button className="hover:bg-[#e86a61] transition-colors"
                                            style={{
                                                backgroundColor: '#FF7B72',
                                                color: 'white',
                                                padding: '0.375rem 0.75rem', // px-3 py-1.5
                                                borderRadius: '0.5rem', // rounded-lg
                                                fontSize: '0.75rem',
                                                fontWeight: 500,
                                                display: 'flex',
                                                alignItems: 'center',
                                                gap: '0.25rem'
                                            }}>
                                            <X size={14} /> Reject
                                        </button>
                                    </td>
                                </tr>
                            ))}
                            {currentData.length < itemsPerPage && Array(itemsPerPage - currentData.length).fill(0).map((_, i) => (
                                <tr key={`pad-${i}`} style={{ height: ITEM_HEIGHT_ESTIMATE_PX, borderBottom: '1px solid #f3f4f6' }}>
                                    <td colSpan="7"></td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Footer Section */}
                <div style={{
                    padding: '1.5rem', // p-6
                    borderTop: '1px solid #f3f4f6', // border-t border-gray-100
                    display: 'flex',
                    flexWrap: 'wrap',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: '1rem',
                    flexShrink: 0,
                    backgroundColor: 'white'
                }}>
                    <div style={{ display: 'flex', gap: '1.5rem', fontSize: '0.875rem', fontWeight: 500 }}>
                        <span style={{ color: '#4b5563' }}>Total Program/ Sections: <span style={{ color: '#1f2937', fontWeight: 700 }}>243</span></span>
                        <span style={{ color: '#047857' }}>Requests: <span style={{ fontWeight: 700 }}>500</span></span>
                        <span style={{ color: '#b91c1c' }}>Doesn't Submit: <span style={{ fontWeight: 700 }}>10</span></span>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <button
                            onClick={() => handlePageChange(currentPage - 1)}
                            disabled={currentPage === 1}
                            className="flex items-center gap-1 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                            style={{
                                padding: '0.5rem 0.75rem', // px-3 py-2
                                borderRadius: '0.5rem', // rounded-lg
                                fontSize: '0.875rem',
                                fontWeight: 500,
                                color: '#4b5563',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '0.25rem'
                            }}
                        >
                            <ChevronLeft size={16} /> Previous
                        </button>

                        {/* Page Number Buttons */}
                        {[...Array(Math.min(3, totalPages))].map((_, i) => (
                            <button
                                key={i}
                                onClick={() => handlePageChange(i + 1)}
                                className={`transition-colors`}
                                style={{
                                    width: '2rem', height: '2rem', // w-8 h-8
                                    borderRadius: '0.5rem', // rounded-lg
                                    fontSize: '0.875rem',
                                    fontWeight: 500,
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
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
                                padding: '0.5rem 0.75rem', // px-3 py-2
                                borderRadius: '0.5rem', // rounded-lg
                                fontSize: '0.875rem',
                                fontWeight: 500,
                                color: '#4b5563',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '0.25rem'
                            }}
                        >
                            Next <ChevronRight size={16} />
                        </button>
                    </div>
                </div>

            </div>
        </div>
    );
};

export { MealOrdersTable };