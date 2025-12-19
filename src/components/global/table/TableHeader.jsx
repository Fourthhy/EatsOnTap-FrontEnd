import React, { useState, useMemo, useEffect, useRef } from 'react';
import { Search, Filter, Calendar } from "lucide-react"

const dateToday = () => {
    const today = new Date();

    const monthNames = [
        "January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"
    ];

    const month = monthNames[today.getMonth()]; // month in words [web:8]
    const day = String(today.getDate()).padStart(2, "0"); // 01–31 [web:4]
    const year = today.getFullYear(); // 4-digit year [web:4]

    return `${month} ${day}, ${year}`;
}

// DONT FORGE TO REVERT THE DECLARATION OF FUNTION INTO THIS STATE --> function Table({ tableInformation }) { 
function TableHeader({
    children,
    tableHeaderInformation,
    onAutoPassItemHeightEstimate,
    onAutoPassMaxItems,
    onAutoPassMinItems,
    onAutoPassItemsPerPage,
    onAutoPassCurrentPage,
    forCurrentDisplayData,
    filterId,
    customContentComponent
}) {


    // --- TABLE ITEM HEIGHT CONFIGURATION ---
    const MIN_ITEMS = 4;
    const MAX_ITEMS = 15;
    // Estimated row height (based on py-4 + font size + border) ~65px
    const ITEM_HEIGHT_ESTIMATE_PX = 40;

    // --- PAGINATION --- 
    const [itemsPerPage, setItemsPerPage] = useState(MAX_ITEMS);
    const [currentPage, setCurrentPage] = useState(1);

    // Refs for height calculation
    const tableWrapperRef = useRef(null);

    // --- HEIGHT CALCULATION LOGIC   
    useEffect(() => {
        //pass the Item Height to Parent Component
        onAutoPassItemHeightEstimate(ITEM_HEIGHT_ESTIMATE_PX);
        onAutoPassMaxItems(MAX_ITEMS);
        onAutoPassMinItems(MIN_ITEMS);
        onAutoPassItemsPerPage(itemsPerPage);
        onAutoPassCurrentPage(currentPage);

        const wrapper = tableWrapperRef.current;
        if (!wrapper) return;

        const observer = new ResizeObserver(entries => {
            const entry = entries[0];
            const containerHeight = entry.contentRect.height;

            // Subtract Table Header Height (approx 45px)
            const availableSpace = containerHeight - 45;

            // Calculate items that fit
            const calculatedItems = Math.floor(availableSpace / ITEM_HEIGHT_ESTIMATE_PX);

            // Apply constraints (Min 5, Max 13)
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

    const tableHeaderStyle = "font-geist py-3 px-6 font-medium text-gray-500"

    return (
        <>
            {/* MAIN CARD */}
            <div className="bg-white rounded-md shadow-sm border border-gray-200 flex flex-col flex-1 min-h-0 overflow-hidden">
                {/* HEADER SECTION */}
                <div className="p-6 border-b border-gray-100 shrink-0">
                    {/* TITLE and GENERAL INFO */}
                    <div className="flex justify-between items-start" style={{ marginBottom: 12, marginTop: 12, }}>
                        <div style={{ paddingLeft: 20 }}>
                            <h1 className="font-geist font-semibold text-gray-900" style={{ fontSize: 16 }}>{tableHeaderInformation.title}</h1>
                            <p className="font-geist text-gray-500" style={{ fontSize: 13 }}>{tableHeaderInformation.subtitle}</p>
                        </div>
                        <div className="text-right" style={{ paddingRight: 20 }}>
                            <span className="font-geist font-semibold" style={{ fontSize: 14 }}>Total Students: </span>
                            <span className="font-geist font-bold text-gray-900" style={{ fontSize: 18 }}>50</span>
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
                                {dateToday()} <Calendar size={12} />
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

                {/* MAIN TABLE */}
                <div
                    ref={tableWrapperRef}
                    className="flex-1 overflow-y-hidden w-full"
                >
                    <table className="w-full text-left border-collapse">
                        {/* TABLE HEADERS */}
                        <thead className="bg-gray-50/50 sticky top-0 z-10" style={{ height: '45px' }}>
                            <tr>
                                {tableHeaderInformation.tableHeaders.map((header, index) => {
                                    const isEmpty = header === "";
                                    const baseClass = `${tableHeaderStyle}${isEmpty ? " w-16" : ""}`;

                                    const label = Array.isArray(header)
                                        ? header[tableHeaderInformation.conditionalDisplay] // pick which text to show
                                        : header;

                                    return (
                                        <th
                                            key={index}
                                            style={{ fontSize: 12 }}
                                            className={baseClass}
                                        >
                                            {label}
                                        </th>
                                    );
                                })}
                            </tr>
                        </thead>

                        {/* TABLE ITEMS*/}
                        {children}

                    </table>
                </div>
            </div>
        </>
    )
}

export { TableHeader };