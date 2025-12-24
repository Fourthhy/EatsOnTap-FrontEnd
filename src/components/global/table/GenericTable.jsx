import React, { useState, useEffect, useRef } from 'react';
import { Search, Calendar } from 'lucide-react'; // Removed Chevron/Filter imports as they are now in the sub-component
import { ButtonGroup } from '../ButtonGroup'; 
import { PrimaryActionButton } from './PrimaryActionButton';
import { TablePagination } from './TablePagination'; 


const ITEM_HEIGHT_ESTIMATE_PX = 40;

const GenericTable = ({
    title,
    subtitle,
    tabs = [], 
    activeTab,
    onTabChange,
    onPrimaryAction,
    primaryActionLabel = "",
    primaryActionIcon = null,
    searchTerm,
    onSearchChange,
    metrics, 
    columns = [], 
    data = [],
    renderRow, 
    dynamicHeaderLabel, 
    minItems = 4, 
    maxItems = 15,   
}) => {
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(maxItems);
    const tableWrapperRef = useRef(null);

    // --- GET DATE --- 
    function getFormattedDate() {
        const today = new Date();
        const options = { month: 'long', day: 'numeric', year: 'numeric' };
        return today.toLocaleDateString('en-US', options);
    }

    // --- HEIGHT CALCULATION LOGIC ---
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
    }, [minItems, maxItems]);

    // --- DATA SLICING ---
    const totalPages = Math.ceil(data.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const currentData = data.slice(startIndex, startIndex + itemsPerPage);

    const handlePageChange = (newPage) => {
        if (newPage >= 1 && newPage <= totalPages) setCurrentPage(newPage);
    };

    // NOTE: Removed getVisiblePages() because GenericTablePagination handles that logic now.

    return (
        <div className="w-full h-[calc(100vh-90px)] flex flex-col p-6 font-['Geist',sans-serif] text-gray-900 overflow-hidden">

            {/* Top Navigation */}
            <div
                className="w-full flex justify-between items-center px-4 py-2 mb-4 bg-white rounded-md shadow-md border border-gray-200"
                style={{ padding: 5, marginTop: 15, marginBottom: 15 }}
            >
                <ButtonGroup
                    buttonListGroup={tabs}
                    activeId={activeTab}
                    onSetActiveId={(id) => {
                        onTabChange(id);
                        setCurrentPage(1);
                    }}
                    activeColor="#4268BD"
                />

                {primaryActionLabel && primaryActionIcon ? (
                    <PrimaryActionButton
                        label={primaryActionLabel}
                        icon={primaryActionIcon}
                        onClick={onPrimaryAction}
                        className="ml-auto cursor-pointer text-sm font-medium shadow-sm"
                        style={{
                            marginLeft: 'auto', marginRight: 10,
                            padding: '10px 20px', borderRadius: 6, fontSize: 12, fontFamily: 'geist',
                            boxShadow: "0 2px 6px #e5eaf0ac",
                        }}
                    />
                ) : null}
            </div>

            <div className="bg-white rounded-md shadow-lg border border-gray-200 flex flex-col flex-1 min-h-0 overflow-hidden">
                {/* Header Section */}
                <div className="p-6 border-b border-gray-100 shrink-0">
                    <div className="flex justify-between items-center" style={{ marginBottom: 12, marginTop: 12 }}>
                        <div style={{ paddingLeft: 20 }}>
                            <h1 className="font-geist font-semibold text-gray-900" style={{ fontSize: 16 }}>{title}</h1>
                            <p className="font-geist text-gray-500" style={{ fontSize: 13 }}>{subtitle}</p>
                        </div>

                        {metrics && metrics.map((metric, index) => (
                            <div key={index} className="text-right" style={{ paddingRight: 20 }}>
                                <span className="font-geist font-semibold" style={{ fontSize: 14 }}>{metric.label}: </span>
                                <span className="font-geist font-bold" style={{ fontSize: 18, color: metric.color || '#000000' }}>{metric.value}</span>
                            </div>
                        ))}
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
                                {getFormattedDate()} <Calendar size={12} />
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

                {/* 3. REPLACED THE OLD PAGINATION DIV WITH THE NEW COMPONENT 
                   Notice how we map 'handlePageChange' to 'onPageChange'
                */}
                <TablePagination 
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={handlePageChange}
                />
            </div>
        </div>
    );
};

export { GenericTable };