import React, { useState, useEffect, useRef } from 'react';
import { Search, Calendar } from 'lucide-react';
import { ButtonGroup } from '../ButtonGroup';
import { PrimaryActionButton } from './PrimaryActionButton';
import { TablePagination } from './TablePagination';

import { motion, AnimatePresence } from "framer-motion";

const ITEM_HEIGHT_ESTIMATE_PX = 40;

const GenericTable = ({
    // Content Props
    title,
    subtitle,
    data = [],
    columns = [],
    renderRow,
    metrics,

    // Header & Navigation Props
    tabs = [],
    activeTab,
    onTabChange,
    customActions = null,
    overrideHeader = null,
    customThead = null,

    // Primary Action Props
    onPrimaryAction,
    primaryActionLabel = "",
    primaryActionIcon = null,

    // Secondary Action Props
    onSecondaryAction,
    secondaryActionLabel = "",
    secondaryActionIcon = null,

    // Search Props
    searchTerm,
    onSearchChange,

    // Pagination Config
    minItems = 4,
    maxItems = 15,

    // Selection Props
    selectable = false,
    selectedIds = [],
    onSelectionChange,
    primaryKey = 'id'
}) => {
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(maxItems);
    const tableWrapperRef = useRef(null);

    // --- HELPER: Date --- 
    function getFormattedDate() {
        const today = new Date();
        const options = { month: 'long', day: 'numeric', year: 'numeric' };
        return today.toLocaleDateString('en-US', options);
    }

    // --- EFFECT: Height Calculation ---
    useEffect(() => {
        const wrapper = tableWrapperRef.current;
        if (!wrapper) return;

        const observer = new ResizeObserver(entries => {
            const containerHeight = entries[0].contentRect.height;
            // Subtract approx header height (45px) to get body space
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

    // --- SELECTION LOGIC ---
    const isAllSelected = currentData.length > 0 && currentData.every(item => selectedIds.includes(item[primaryKey]));
    const isIndeterminate = currentData.some(item => selectedIds.includes(item[primaryKey])) && !isAllSelected;

    const handleSelectAll = (e) => {
        if (e.target.checked) {
            const currentPageIds = currentData.map(item => item[primaryKey]);
            const newSelection = [...new Set([...selectedIds, ...currentPageIds])];
            onSelectionChange?.(newSelection);
        } else {
            const currentPageIds = currentData.map(item => item[primaryKey]);
            const newSelection = selectedIds.filter(id => !currentPageIds.includes(id));
            onSelectionChange?.(newSelection);
        }
    };

    return (
        <div className="w-full h-[calc(100vh-90px)] flex flex-col p-6 font-['Geist',sans-serif] text-gray-900 overflow-hidden">

            {/* 1. TOP TOOLBAR (Tabs + Actions) - STATIC (No Animation to prevent dizzying) */}
            <div
                className="w-full flex justify-between items-center px-4 py-2 mb-4 bg-white rounded-md shadow-md border border-gray-200"
                style={{ padding: 5, marginTop: 15, marginBottom: 15 }}
            >
                {tabs.length == 0 ? <>&nbsp;</> :
                    <ButtonGroup
                        buttonListGroup={tabs}
                        activeId={activeTab}
                        onSetActiveId={(id) => {
                            onTabChange?.(id);
                            setCurrentPage(1);
                        }}
                        activeColor="#4268BD"
                    />
                }

                <div className="ml-auto flex items-center" style={{ gap: '10px' }}>
                    {customActions}

                    {/* Primary Action Button */}
                    {primaryActionLabel && primaryActionIcon && (
                        <PrimaryActionButton
                            label={primaryActionLabel}
                            icon={primaryActionIcon}
                            onClick={onPrimaryAction}
                            className="cursor-pointer text-sm font-medium shadow-sm"
                            style={{
                                padding: '10px 20px', borderRadius: 6, fontSize: 12, fontFamily: 'geist',
                                boxShadow: "0 2px 6px #e5eaf0ac",
                            }}
                        />
                    )}

                    {/* Secondary Action Button */}
                    {secondaryActionLabel && secondaryActionIcon && (
                        <PrimaryActionButton
                            label={secondaryActionLabel}
                            icon={secondaryActionIcon}
                            onClick={onSecondaryAction}
                            className="cursor-pointer text-sm font-medium shadow-sm"
                            style={{
                                padding: '10px 20px', borderRadius: 6, fontSize: 12, fontFamily: 'geist',
                                boxShadow: "0 2px 6px #e5eaf0ac",
                            }}
                        />
                    )}
                </div>
            </div>

            {/* 2. MAIN CARD */}
            <div className="bg-white rounded-md shadow-lg border border-gray-200 flex flex-col flex-1 min-h-0 overflow-hidden">

                {/* 2a. STATIC HEADER (Title & Metrics) */}
                <div className="shrink-0 border-b border-gray-100">
                    <div className="px-6 pt-6 pb-4" style={{ padding: 15 }}>
                        <div className="flex justify-between items-center">
                            <div>
                                <h1 className="font-geist font-semibold text-gray-900" style={{ fontSize: 16 }}>{title}</h1>
                                <p className="font-geist text-gray-500" style={{ fontSize: 13 }}>{subtitle}</p>
                            </div>

                            <div className="flex gap-6">
                                {metrics && metrics.map((metric, index) => (
                                    <div key={index} className="text-right" style={{ paddingRight: 10 }}>
                                        <span className="font-geist font-semibold" style={{ fontSize: 14 }}>{metric.label}: </span>
                                        <span className="font-geist font-bold" style={{ fontSize: 18, color: metric.color || '#000000' }}>{metric.value}</span>
                                    </div>
                                ))
                                }</div>
                        </div>
                    </div>

                    <hr className="w-full border-gray-100" />

                    {/* 2b. DYNAMIC HEADER ROW (Search OR Override) */}
                    <div style={{ height: '50px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                        {overrideHeader ? (
                            <div className="w-full h-full">
                                {overrideHeader}
                            </div>
                        ) : (
                            <div className="px-6 flex gap-4 items-center justify-between" style={{ padding: 15 }}>
                                <div className="relative flex-1 max-w-md flex-row">
                                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-600" size={14} />
                                    <input
                                        type="text"
                                        placeholder="Search"
                                        className="w-full text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                                        style={{
                                            width: '100%', paddingLeft: '40px', paddingRight: '16px', paddingTop: '6px',
                                            paddingBottom: '6px', backgroundColor: '#F0F1F6', border: 'none', borderRadius: '8px',
                                            fontSize: 14, fontFamily: "geist"
                                        }}
                                        value={searchTerm}
                                        onChange={(e) => onSearchChange?.(e.target.value)}
                                    />
                                </div>
                                <div className="flex gap-2 ml-auto">
                                    <button className="text-sm font-medium text-gray-600 flex items-center hover:bg-gray-200" style={{ padding: '8px 12px', backgroundColor: '#f3f4f6', borderRadius: '8px', fontSize: 12, display: 'flex', alignItems: 'center', gap: '8px' }}>
                                        {getFormattedDate()} <Calendar size={12} />
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* 3. TABLE SECTION */}
                <div ref={tableWrapperRef} className="flex-1 overflow-y-hidden w-full">
                    <table className="w-full text-left border-collapse">

                        {/* 3a. TABLE HEADER */}
                        {customThead ? customThead : (
                            <thead className="bg-gray-50 sticky top-0 z-20">
                                <tr style={{ height: '45px' }}>
                                    {selectable && (
                                        <th className="border-b border-gray-200 bg-gray-50"
                                            style={{ width: '48px', padding: 0, position: 'relative', zIndex: 30 }}>
                                            <div className="flex items-center justify-center h-full w-full">
                                                <label className="flex items-center justify-center w-full h-full cursor-pointer">
                                                    <input
                                                        type="checkbox"
                                                        className="cursor-pointer"
                                                        checked={isAllSelected}
                                                        ref={input => { if (input) input.indeterminate = isIndeterminate; }}
                                                        onChange={handleSelectAll}
                                                        onClick={(e) => e.stopPropagation()}
                                                        style={{
                                                            width: '16px', height: '16px', accentColor: '#4268BD',
                                                            cursor: 'pointer', position: 'relative', zIndex: 40
                                                        }}
                                                    />
                                                </label>
                                            </div>
                                        </th>
                                    )}

                                    {!selectable && (
                                        <th style={{ fontSize: 12 }} className="font-geist py-3 px-6 font-medium text-gray-500 w-16"></th>
                                    )}

                                    {columns.map((col, idx) => (
                                        <th key={idx} style={{ fontSize: 12 }} className="font-geist py-3 px-6 font-medium text-gray-500">
                                            {col}
                                        </th>
                                    ))}
                                </tr>
                            </thead>
                        )}

                        {/* 3b. ANIMATED TABLE BODY */}
                        <tbody className="divide-y divide-gray-100">
                            <AnimatePresence mode="wait">
                                {currentData.map((item, index) => {
                                    // Render the standard row
                                    const rowContent = renderRow(item, index, startIndex, {
                                        isSelected: selectedIds.includes(item[primaryKey]),
                                        toggleSelection: () => {
                                            const id = item[primaryKey];
                                            if (selectedIds.includes(id)) {
                                                onSelectionChange?.(selectedIds.filter(sid => sid !== id));
                                            } else {
                                                onSelectionChange?.([...selectedIds, id]);
                                            }
                                        }
                                    });

                                    // WRAPPER: Convert the returned <tr> into a <motion.tr>
                                    // This assumes renderRow returns a <tr>. We clone it to add motion props.
                                    // NOTE: If renderRow returns a Fragment or custom component, this might need adjustment.
                                    // But typically for GenericTable, it returns a <tr>.
                                    return (
                                        <motion.tr
                                            key={item[primaryKey] || index}
                                            layout // Smoothly animate position changes (reordering)
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0, y: -10 }}
                                            transition={{ duration: 0.2, delay: index * 0.03 }} // Staggered delay
                                            // Pass through props from the original <tr>
                                            {...rowContent.props}
                                        >
                                            {rowContent.props.children}
                                        </motion.tr>
                                    );
                                })}
                            </AnimatePresence>

                            {/* STATIC PADDING ROWS (No Animation) */}
                            {currentData.length < itemsPerPage && Array(itemsPerPage - currentData.length).fill(0).map((_, i) => (
                                <tr key={`pad-${i}`} style={{ height: ITEM_HEIGHT_ESTIMATE_PX }}>
                                    <td colSpan={columns.length + (selectable ? 1 : 1) + (customThead ? 20 : 0)}></td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* 4. FOOTER */}
                <TablePagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={handlePageChange}
                />
            </div>
        </div >
    );
};

export { GenericTable };