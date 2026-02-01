import React, { useState, useEffect, useRef } from 'react';
import { Search, Calendar, FileQuestion } from 'lucide-react'; // 🟢 Added FileQuestion
import { ButtonGroup } from '../ButtonGroup';
import { PrimaryActionButton } from './PrimaryActionButton';
import { TablePagination } from './TablePagination';
import { motion, AnimatePresence } from "framer-motion";

// --- IMPORTS ---
import { useLoader } from '../../../context/LoaderContext';
import { Skeleton } from '../../global/Skeleton';

const ITEM_HEIGHT_ESTIMATE_PX = 40;

const GenericTable = ({
    // Content Props
    title,
    subtitle,
    data = [],
    columns = [],
    renderRow,
    metrics,

    // 🟢 New Prop for Customization
    emptyMessage = "No records found",
    emptyMessageIcon = <FileQuestion size={30} strokeWidth={1.5} />,

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

    primaryLabel = "",

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
    primaryKey = 'id',
}) => {
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(maxItems);
    const [isMobile, setIsMobile] = useState(false);
    const tableWrapperRef = useRef(null);

    // --- HOOK: LOADER STATE ---
    const { isLoading } = useLoader();

    // --- HELPER: Date --- 
    function getFormattedDate() {
        const today = new Date();
        const options = { month: 'long', day: 'numeric', year: 'numeric' };
        return today.toLocaleDateString('en-US', options);
    }

    // --- DETECT MOBILE ---
    useEffect(() => {
        const checkMobile = () => setIsMobile(window.innerWidth < 768);
        checkMobile();
        window.addEventListener('resize', checkMobile);
        return () => window.removeEventListener('resize', checkMobile);
    }, []);

    // --- EFFECT: Height Calculation ---
    useEffect(() => {
        const wrapper = tableWrapperRef.current;
        if (!wrapper) return;

        const observer = new ResizeObserver(entries => {
            if (!entries || !entries[0]) return;

            if (window.innerWidth < 768) {
                setItemsPerPage(9999);
                return;
            }

            const containerHeight = entries[0].contentRect.height;
            const headerBuffer = 55;
            const availableSpace = containerHeight - headerBuffer;

            if (availableSpace > 0) {
                const calculatedItems = Math.floor(availableSpace / ITEM_HEIGHT_ESTIMATE_PX);
                const newItemsPerPage = Math.max(minItems, Math.min(maxItems, calculatedItems));

                setItemsPerPage(prev => {
                    if (prev !== newItemsPerPage) {
                        setCurrentPage(1);
                        return newItemsPerPage;
                    }
                    return prev;
                });
            }
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
        <div className="w-full h-[calc(100vh-80px)] md:h-[calc(100vh-90px)] flex flex-col p-2 md:p-6 font-['Geist',sans-serif] text-gray-900 overflow-hidden">

            {/* 1. TOP TOOLBAR */}
            <div
                className="w-full h-auto flex flex-col md:flex-row justify-between items-start md:items-center px-4 py-3 md:py-2 mb-4 bg-white rounded-md shadow-md border border-gray-200 gap-4 md:gap-0"
                style={{ marginTop: 15, marginBottom: 15 }}
            >
                {/* TABS SECTION */}
                {isMobile ? "" : (
                    <div className="w-full md:w-auto overflow-x-auto pb-1 md:pb-0 hide-scrollbar" style={{ padding: 3 }}>
                        {isLoading ? (
                            <div className="flex gap-2 p-1">
                                <Skeleton className="h-8 w-24 rounded-md" />
                                <Skeleton className="h-8 w-24 rounded-md" />
                            </div>
                        ) : (
                            tabs.length === 0 ? "" :
                                <ButtonGroup
                                    buttonListGroup={tabs}
                                    activeId={activeTab}
                                    onSetActiveId={(id) => {
                                        onTabChange?.(id);
                                        setCurrentPage(1);
                                    }}
                                    activeColor="#4268BD"
                                />
                        )}
                    </div>
                )}

                {/* ACTIONS SECTION */}
                <div className="w-full h-full md:w-auto flex items-center justify-end gap-2">
                    {isLoading ? (
                        <>
                            <Skeleton className="h-9 w-20 md:w-32 rounded-md" />
                            <Skeleton className="h-9 w-20 md:w-32 rounded-md" />
                        </>
                    ) : (
                        <>
                            <div style={{ marginRight: "10px" }}>
                                {customActions}
                            </div>
                            {primaryActionLabel && primaryActionIcon && (
                                <PrimaryActionButton
                                    label={primaryActionLabel}
                                    icon={primaryActionIcon}
                                    onClick={onPrimaryAction}
                                    className="cursor-pointer text-sm font-medium shadow-sm flex-1 md:flex-none justify-center h-full items-center"
                                    style={{
                                        padding: '10px 20px', borderRadius: 6, fontSize: 12, fontFamily: 'geist',
                                        boxShadow: "0 2px 6px #e5eaf0ac",
                                    }}
                                />
                            )}
                            {secondaryActionLabel && secondaryActionIcon && (
                                <PrimaryActionButton
                                    label={secondaryActionLabel}
                                    icon={secondaryActionIcon}
                                    onClick={onSecondaryAction}
                                    className="cursor-pointer text-sm font-medium shadow-sm flex-1 md:flex-none justify-center"
                                    style={{
                                        padding: '10px 20px', borderRadius: 6, fontSize: 12, fontFamily: 'geist',
                                        boxShadow: "0 2px 6px #e5eaf0ac",
                                    }}
                                />
                            )}
                            {primaryLabel !== "" ? (
                                <p className="font-geist text-gray-500 text-xs md:text-sm">{primaryLabel}</p>
                            ) : ""}
                        </>
                    )}
                </div>
            </div>

            {/* 2. MAIN CARD */}
            <div className="bg-white rounded-md shadow-lg border border-gray-200 flex flex-col flex-1 min-h-0 overflow-hidden">

                {/* 2a. HEADER */}
                <div className="shrink-0 border-b border-gray-100">
                    <div className="px-4 py-4 md:px-6 md:pt-6 md:pb-4">
                        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4" style={{ padding: 10 }}>
                            {/* TITLE & SUBTITLE */}
                            <div>
                                {isLoading ? (
                                    <>
                                        <Skeleton className="h-5 w-48 mb-2 rounded" />
                                        <Skeleton className="h-3 w-64 rounded" />
                                    </>
                                ) : (
                                    <>
                                        <h1 className="font-geist font-semibold text-gray-900 text-lg md:text-base">{title}</h1>
                                        <p className="font-geist text-gray-500 text-xs md:text-sm">{subtitle}</p>
                                    </>
                                )}
                            </div>

                            {/* METRICS */}
                            <div className="flex flex-wrap gap-4 md:gap-6 w-full md:w-auto">
                                {metrics && metrics.map((metric, index) => (
                                    <div key={index} className="text-left md:text-right">
                                        <span className="font-geist font-semibold text-sm">{metric.label}: </span>
                                        {isLoading ? (
                                            <Skeleton className="inline-block h-5 w-16 rounded ml-2 align-middle" />
                                        ) : (
                                            <span className="font-geist font-bold text-lg" style={{ color: metric.color || '#000000' }}>{metric.value}</span>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    <hr className="w-full border-gray-100" />

                    {/* 2b. DYNAMIC HEADER ROW */}
                    <div className="p-3 md:p-0 md:h-[50px] flex flex-col justify-center">
                        {overrideHeader ? (
                            <div className="w-full h-[100%]">
                                {overrideHeader}
                            </div>
                        ) : (
                            <div className="md:px-6 flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between" style={{ padding: 10 }}>
                                <div className="relative flex-1 md:max-w-md">
                                    {isLoading ? (
                                        <Skeleton className="h-9 w-full rounded-md" />
                                    ) : (
                                        <>
                                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-600" size={14} />
                                            <input
                                                type="text"
                                                placeholder="Search"
                                                className="w-full text-sm focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                                                style={{
                                                    paddingLeft: '40px', paddingRight: '16px', paddingTop: '8px',
                                                    paddingBottom: '8px', backgroundColor: '#F0F1F6', border: 'none', borderRadius: '6px',
                                                    fontSize: 14, fontFamily: "geist"
                                                }}
                                                value={searchTerm}
                                                onChange={(e) => onSearchChange?.(e.target.value)}
                                            />
                                        </>
                                    )}
                                </div>

                                <div className="flex gap-2 md:ml-auto">
                                    {isLoading ? (
                                        <Skeleton className="h-8 w-32 rounded-md" />
                                    ) : (
                                        <button className="text-sm font-medium text-gray-600 flex items-center justify-center w-full md:w-auto hover:bg-gray-200 transition-colors"
                                            style={{ padding: '8px 12px', backgroundColor: '#f3f4f6', borderRadius: '6px', fontSize: 12, gap: '8px' }}>
                                            {getFormattedDate()} <Calendar size={12} />
                                        </button>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* 3. TABLE SECTION */}
                <div ref={tableWrapperRef} className="flex-1 overflow-auto w-full relative">
                    <table className="w-full text-left border-collapse min-w-full">

                        {/* 3a. TABLE HEADER */}
                        {customThead ? customThead : (
                            <thead className="bg-gray-50 sticky top-0 z-20 shadow-sm">
                                <tr style={{ height: '45px' }}>
                                    {selectable && (
                                        <th className="border-b border-gray-200 bg-gray-50"
                                            style={{ width: '48px', padding: 0, position: 'sticky', left: 0, zIndex: 30 }}>
                                            <div className="flex items-center justify-center h-full w-full bg-gray-50">
                                                {isLoading ? (
                                                    <Skeleton className="h-4 w-4 rounded-sm" />
                                                ) : (
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
                                                                cursor: 'pointer'
                                                            }}
                                                        />
                                                    </label>
                                                )}
                                            </div>
                                        </th>
                                    )}

                                    {!selectable && (
                                        <th style={{ fontSize: 12 }} className="font-geist py-3 px-6 font-medium text-gray-500 w-16"></th>
                                    )}

                                    {columns.map((col, idx) => (
                                        <th key={idx} style={{ fontSize: 12, whiteSpace: 'nowrap' }} className="font-geist py-3 px-6 font-medium text-gray-500">
                                            {isLoading ? <Skeleton className="h-3 w-20 rounded" /> : col}
                                        </th>
                                    ))}
                                </tr>
                            </thead>
                        )}

                        {/* 3b. TABLE BODY */}
                        <tbody className="divide-y divide-gray-100">
                            {isLoading ? (
                                Array(isMobile ? 10 : itemsPerPage).fill(0).map((_, i) => (
                                    <tr key={`skeleton-${i}`} style={{ height: ITEM_HEIGHT_ESTIMATE_PX }}>
                                        <td className="px-6 py-3" style={{ width: selectable ? '48px' : '64px' }}>
                                            <div className="flex justify-center"><Skeleton className="h-4 w-4 rounded-sm" /></div>
                                        </td>
                                        {columns.map((_, colIndex) => (
                                            <td key={colIndex} className="px-6 py-3">
                                                <Skeleton className="h-4 rounded" style={{ width: `${Math.floor(Math.random() * 40) + 40}%` }} />
                                            </td>
                                        ))}
                                    </tr>
                                ))
                            ) : currentData.length === 0 ? (
                                // 🟢 3. EMPTY STATE ROW
                                <tr>
                                    <td colSpan={columns.length + (selectable ? 1 : 1) + 20} className="text-center" style={{ paddingTop: "20px" }}>
                                        <motion.div
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            className="flex flex-col items-center justify-center text-gray-400"
                                        >
                                            {emptyMessageIcon}
                                            <p className="font-geist text-sm">{emptyMessage}</p>
                                        </motion.div>
                                    </td>
                                </tr>
                            ) : (
                                // DATA ROWS
                                <AnimatePresence mode="wait">
                                    {currentData.map((item, index) => {
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

                                        return (
                                            <motion.tr
                                                key={item[primaryKey] || index}
                                                layout
                                                initial={{ opacity: 0, y: 10 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                exit={{ opacity: 0, y: -10 }}
                                                transition={{ duration: 0.2, delay: index * 0.03 }}
                                                {...rowContent.props}
                                            >
                                                {rowContent.props.children}
                                            </motion.tr>
                                        );
                                    })}
                                </AnimatePresence>
                            )}

                            {/* Padding Rows - Only show if has data and not on mobile */}
                            {!isLoading && !isMobile && currentData.length > 0 && currentData.length < itemsPerPage && Array(itemsPerPage - currentData.length).fill(0).map((_, i) => (
                                <tr key={`pad-${i}`} style={{ height: ITEM_HEIGHT_ESTIMATE_PX }}>
                                    <td colSpan={columns.length + (selectable ? 1 : 1) + (customThead ? 20 : 0)}></td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* 4. FOOTER */}
                {!isMobile && (
                    <TablePagination
                        currentPage={currentPage}
                        totalPages={isLoading ? 1 : totalPages}
                        onPageChange={handlePageChange}
                    />
                )}
            </div>
        </div >
    );
};

export { GenericTable };