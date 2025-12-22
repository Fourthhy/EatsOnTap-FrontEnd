import React, { useState, useEffect, useRef } from 'react';
import { Search, Calendar, Filter, ChevronLeft, ChevronRight, Plus } from 'lucide-react';
import { ButtonGroup } from '../ButtonGroup'; // Your provided component

const ITEM_HEIGHT_ESTIMATE_PX = 40;

const GenericTable = ({
    title,
    subtitle,
    tabs = [], // Array of { label, id }
    activeTab,
    onTabChange,
    onPrimaryAction,
    primaryActionLabel = "",
    primaryActionIcon = null,
    searchTerm,
    onSearchChange,
    totalRecords,
    columns = [], // Array of strings or { label, width }
    data = [],
    renderRow, // Function: (item, index, startIndex) => ReactNode
    dynamicHeaderLabel, // The label that changes based on filter
    minItems = 4, // The minimum number of items, set 4 by default
    maxItems = 15,   // The maximum number of items, set 15 by default
}) => {
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(maxItems);
    const tableWrapperRef = useRef(null);

    // --- EXACT ORIGINAL HEIGHT CALCULATION LOGIC ---
    useEffect(() => {
        const wrapper = tableWrapperRef.current;
        if (!wrapper) return;
        const observer = new ResizeObserver(entries => {
            const containerHeight = entries[0].contentRect.height;
            const availableSpace = containerHeight - 45;
            const calculatedItems = Math.floor(availableSpace / ITEM_HEIGHT_ESTIMATE_PX);
            const newItemsPerPage = Math.max(minItems, Math.min(maxItems, calculatedItems));
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

    const totalPages = Math.ceil(data.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const currentData = data.slice(startIndex, startIndex + itemsPerPage);

    const handlePageChange = (newPage) => {
        if (newPage >= 1 && newPage <= totalPages) setCurrentPage(newPage);
    };

    // --- NEW DYNAMIC PAGINATION LOGIC ---
    const getVisiblePages = () => {
        const maxVisible = 3;
        let start = Math.max(1, currentPage - 1);
        let end = Math.min(totalPages, start + maxVisible - 1);

        // Adjust if we are at the end of the list
        if (end - start + 1 < maxVisible) {
            start = Math.max(1, end - maxVisible + 1);
        }

        const pages = [];
        for (let i = start; i <= end; i++) {
            pages.push(i);
        }
        return pages;
    };

    return (
        <div className="w-full h-[calc(100vh-90px)] flex flex-col p-6 font-['Geist',sans-serif] text-gray-900 overflow-hidden">

            {/* Top Navigation using your ButtonGroup */}
            <div className="flex flex-wrap gap-2 mb-6 shrink-0" style={{ marginTop: 15, marginBottom: 15, marginLeft: 10 }}>
                <ButtonGroup
                    buttonListGroup={tabs}
                    initialActiveId={activeTab}
                    onSetActiveId={(id) => { onTabChange(id); setCurrentPage(1); }}
                    activeColor="#2CA4DD3f"
                />
                {primaryActionLabel && primaryActionIcon ? (
                    <button
                        onClick={onPrimaryAction}
                        className="ml-auto bg-[#2CA4DD3f] hover:bg-[#2CA4DD5f] color-[#231F20] cursor-pointer text-sm font-medium flex items-center shadow-sm transition-colors duration-200"
                        style={{
                            marginLeft: 'auto', marginRight: 10,
                            padding: '10px 20px', borderRadius: 6, fontSize: 12, fontFamily: 'geist',
                            display: 'flex', alignItems: 'center', gap: '8px',
                            boxShadow: "0 2px 6px #e5eaf0ac",
                            border: "1px solid #ddddddaf",
                        }}
                    >
                        {primaryActionIcon} {primaryActionLabel}
                    </button>
                ) : ""}

            </div>

            <div className="bg-white rounded-md shadow-sm border border-gray-200 flex flex-col flex-1 min-h-0 overflow-hidden">
                {/* Header Section */}
                <div className="p-6 border-b border-gray-100 shrink-0">
                    <div className="flex justify-between items-start" style={{ marginBottom: 12, marginTop: 12 }}>
                        <div style={{ paddingLeft: 20 }}>
                            <h1 className="font-geist font-semibold text-gray-900" style={{ fontSize: 16 }}>{title}</h1>
                            <p className="font-geist text-gray-500" style={{ fontSize: 13 }}>{subtitle}</p>
                        </div>
                        <div className="text-right" style={{ paddingRight: 20 }}>
                            <span className="font-geist font-semibold" style={{ fontSize: 14 }}>Total: </span>
                            <span className="font-geist font-bold text-gray-900" style={{ fontSize: 18 }}>{totalRecords}</span>
                        </div>
                    </div>
                    <hr className="w-full" />
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
                                onChange={(e) => onSearchChange(e.target.value)}
                            />
                        </div>
                        <div className="flex gap-2 ml-auto" style={{ marginRight: 10 }}>
                            <button className="text-sm font-medium text-gray-600 flex items-center hover:bg-gray-200" style={{ padding: '8px 12px', backgroundColor: '#f3f4f6', borderRadius: '8px', fontSize: 12, display: 'flex', alignItems: 'center', gap: '8px' }}>
                                July 21, 2025 <Calendar size={12} />
                            </button>
                        </div>
                    </div>
                    <hr className="w-full" />
                </div>

                {/* Table Section */}
                <div ref={tableWrapperRef} className="flex-1 overflow-y-hidden w-full">
                    <table className="w-full text-left border-collapse">
                        <thead className="bg-gray-50/50 sticky top-0 z-10" style={{ height: '45px' }}>
                            <tr>
                                <th style={{ fontSize: 12 }} className="font-geist py-3 px-6 font-medium text-gray-500 w-16"></th>
                                {columns.map((col, idx) => (
                                    <th key={idx} style={{ fontSize: 12 }} className="font-geist py-3 px-6 font-medium text-gray-500">
                                        {col === 'DYNAMIC' ? dynamicHeaderLabel : col}
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {currentData.map((item, index) => renderRow(item, index, startIndex))}
                            {currentData.length < itemsPerPage && Array(itemsPerPage - currentData.length).fill(0).map((_, i) => (
                                <tr key={`pad-${i}`} style={{ height: ITEM_HEIGHT_ESTIMATE_PX }}>
                                    <td colSpan={columns.length + 1}></td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Pagination Footer */}
                <div className="p-4 border-t border-gray-100 flex items-center justify-center gap-2 shrink-0 bg-white" style={{ padding: '16px', borderTop: '1px solid #f3f4f6', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                    <button
                        onClick={() => handlePageChange(currentPage - 1)}
                        disabled={currentPage === 1}
                        className="flex items-center gap-1 text-sm font-medium text-gray-500 bg-none hover:bg-gray-300 hover:text-gray-700 transition-colors duration-300 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                        style={{ padding: '8px 12px', borderRadius: '6px' }}
                    >
                        <ChevronLeft size={16} /> Previous
                    </button>

                    {getVisiblePages().map((page) => (
                        <button
                            key={page}
                            onClick={() => handlePageChange(page)}
                            className={`w-8 h-8 rounded-md text-sm font-medium flex items-center justify-center ${currentPage === page ? 'bg-[#2CA4DD3f] color-[#231F20]' : 'text-gray-500 hover:bg-gray-200 hover:text-gray-700 transition-colors duration-200 cursor-pointer'}`}
                            style={{ width: '32px', height: '32px', borderRadius: '6px', boxShadow: "0 2px 6px #e5eaf0ac", border: "1px solid #ddddddaf", }}
                        >
                            {page}
                        </button>
                    ))}

                    {totalPages > getVisiblePages()[getVisiblePages().length - 1] && <span className="text-gray-400">...</span>}

                    <button
                        onClick={() => handlePageChange(currentPage + 1)}
                        disabled={currentPage === totalPages || totalPages === 0}
                        className="text-sm font-medium text-gray-500 bg-none hover:bg-gray-300 hover:text-gray-700 transition-colors duration-300 cursor-pointer flex items-center gap-1"
                        style={{ padding: '8px 12px', borderRadius: '6px' }}
                    >
                        Next <ChevronRight size={16} />
                    </button>
                </div>
            </div>
        </div>
    );
};

export { GenericTable };