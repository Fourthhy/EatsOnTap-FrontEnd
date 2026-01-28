import React, { useState, useMemo, useRef, useEffect } from 'react';
import { departments, PROGRAM_STRUCTURE, getAllPrograms } from './data'; // Adjust path
import { Calendar, Search, X, Check, Tag, Edit2, ChevronLeft, ChevronRight } from 'lucide-react';
import { addEvent } from '../../../../functions/admin/addEvent';

// --- CONSTANTS ---
const EVENT_COLORS = [
    { name: 'Blue', value: '#dbeafe', text: '#1e40af' },
    { name: 'Red', value: '#fee2e2', text: '#991b1b' },
    { name: 'Green', value: '#dcfce7', text: '#166534' },
    { name: 'Yellow', value: '#fef9c3', text: '#854d0e' },
    { name: 'Orange', value: '#ffedd5', text: '#9a3412' },
    { name: 'Violet', value: '#f3e8ff', text: '#6b21a8' },
];

const getProgramsForDepartments = (selectedDepts) => {
    if (selectedDepts.includes('All')) return getAllPrograms();
    const filteredPrograms = selectedDepts
        .filter(dept => dept !== 'All')
        .flatMap(dept => PROGRAM_STRUCTURE[dept] || []);
    return [...new Set(filteredPrograms)];
};

// --- 🟢 ANIMATED PAGE BUTTON COMPONENT ---
const AnimatedPageButton = ({ page, isActive, onClick }) => {
    const [animState, setAnimState] = useState({ width: '0%', opacity: 0 });

    useEffect(() => {
        if (isActive) {
            setAnimState({ width: '0%', opacity: 0 });
            const timer = setTimeout(() => {
                setAnimState({ width: '100%', opacity: 1 });
            }, 10);
            return () => clearTimeout(timer);
        } else {
            setAnimState({ width: '0%', opacity: 0 });
        }
    }, [isActive]);

    const baseStyle = {
        width: '28px',
        height: '28px',
        borderRadius: '6px',
        boxShadow: isActive ? "0 2px 6px #e5eaf0ac" : "none",
        position: 'relative',
        overflow: 'hidden',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: '12px',
        fontWeight: 500,
        cursor: 'pointer',
        border: 'none',
        fontFamily: 'geist',
        transition: 'color 200ms ease',
        backgroundColor: 'transparent',
    };

    return (
        <button
            type="button"
            onClick={() => onClick(page)}
            className={`${isActive ? 'text-[#EEEEEE]' : 'text-gray-500 hover:bg-white hover:text-gray-700'}`}
            style={baseStyle}
        >
            {isActive && (
                <div
                    style={{
                        position: 'absolute', top: 0, left: 0, height: '100%',
                        backgroundColor: '#4268BD', zIndex: 0,
                        width: animState.width, opacity: animState.opacity,
                        transition: 'width 300ms cubic-bezier(0.4, 0, 0.2, 1), opacity 300ms ease',
                    }}
                />
            )}
            <span style={{ position: 'relative', zIndex: 10 }}>{page}</span>
        </button>
    );
};

export const AddEventForm = () => {
    // --- MODAL STATE ---
    const [isOpen, setIsOpen] = useState(false);
    const [isClosing, setIsClosing] = useState(false);
    
    // --- UI INTERACTION STATE ---
    const [isTriggerHovered, setIsTriggerHovered] = useState(false);
    const [isEditingName, setIsEditingName] = useState(true); 
    const [isDeptContainerHovered, setIsDeptContainerHovered] = useState(false);

    // --- FORM STATE ---
    const [eventName, setEventName] = useState('');
    const [eventDate, setEventDate] = useState('');
    const [selectedColor, setSelectedColor] = useState(EVENT_COLORS[0].value);
    const [selectedDepartments, setSelectedDepartments] = useState([]);
    const [selectedPrograms, setSelectedPrograms] = useState([]);
    const [validationError, setValidationError] = useState({});

    const nameInputRef = useRef(null);

    // --- PAGINATION ---
    const [currentPage, setCurrentPage] = useState(1);
    const ITEMS_PER_PAGE = 5;

    // --- LOGIC ---
    const allProgramsToDisplay = useMemo(() => {
        if (!isOpen) return [];
        setCurrentPage(1);
        return getProgramsForDepartments(selectedDepartments);
    }, [selectedDepartments, isOpen]);

    const totalPages = Math.ceil(allProgramsToDisplay.length / ITEMS_PER_PAGE);

    const programsToDisplay = useMemo(() => {
        const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
        const endIndex = startIndex + ITEMS_PER_PAGE;
        return allProgramsToDisplay.slice(startIndex, endIndex);
    }, [allProgramsToDisplay, currentPage]);

    // --- PAGINATION LOGIC HELPER ---
    const getVisiblePages = () => {
        const pages = [];
        if (totalPages <= 5) { 
            for (let i = 1; i <= totalPages; i++) pages.push(i);
        } else {
            if (currentPage <= 3) {
                pages.push(1, 2, 3, 4);
            } else if (currentPage >= totalPages - 2) {
                pages.push(totalPages - 3, totalPages - 2, totalPages - 1, totalPages);
            } else {
                pages.push(currentPage - 1, currentPage, currentPage + 1);
            }
        }
        return pages;
    };
    const visiblePages = getVisiblePages();

    // --- HANDLERS ---
    const resetForm = () => {
        setEventName('');
        setEventDate('');
        setSelectedDepartments([]);
        setSelectedPrograms([]);
        setValidationError({});
        setSelectedColor(EVENT_COLORS[0].value);
        setCurrentPage(1);
        setIsEditingName(true);
    };

    const handleCloseModal = () => {
        if (isClosing) return;
        setIsClosing(true);
        setTimeout(() => {
            setIsOpen(false);
            setIsClosing(false);
        }, 300);
    };

    const handleEventNameChange = (e) => {
        const value = e.target.value;
        setEventName(value);
        if (validationError.eventName && value.trim()) setValidationError(prev => ({ ...prev, eventName: false }));
    };

    useEffect(() => {
        if (isEditingName && nameInputRef.current) {
            nameInputRef.current.focus();
        }
    }, [isEditingName]);

    const handleNameBlur = () => {
        if (eventName.trim()) {
            setIsEditingName(false);
        }
    };

    const handleEventDateChange = (e) => {
        const value = e.target.value;
        setEventDate(value);
        if (validationError.eventDate && value) setValidationError(prev => ({ ...prev, eventDate: false }));
    };

    const toggleDepartment = (dept) => {
        setSelectedDepartments(prevDepts => {
            let newDepts;
            if (dept === 'All') {
                newDepts = prevDepts.includes('All') ? [] : departments.filter(d => d !== 'All');
            } else {
                newDepts = prevDepts.filter(d => d !== 'All');
                if (newDepts.includes(dept)) {
                    newDepts = newDepts.filter(d => d !== dept);
                } else {
                    newDepts = [...newDepts, dept];
                }
            }
            const allNonAllSelected = departments.filter(d => d !== 'All').every(d => newDepts.includes(d));
            if (allNonAllSelected && newDepts.length > 0) newDepts = ['All', ...departments.filter(d => d !== 'All')];
            if (validationError.departments && newDepts.length > 0) setValidationError(prev => ({ ...prev, departments: false }));
            if (validationError.programs) setValidationError(prev => ({ ...prev, programs: false }));
            if (newDepts.length === 0) return [];
            return newDepts;
        });
        setSelectedPrograms([]);
    };

    const handleProgramToggle = (program) => {
        setSelectedPrograms(prevPrograms => {
            const isSelected = prevPrograms.includes(program);
            let nextPrograms = isSelected ? prevPrograms.filter(p => p !== program) : [...prevPrograms, program];
            if (validationError.programs && nextPrograms.length > 0) setValidationError(prev => ({ ...prev, programs: false }));
            return nextPrograms;
        });
    };

    const handlePageChange = (pageNumber) => {
        if (pageNumber >= 1 && pageNumber <= totalPages) setCurrentPage(pageNumber);
    };

    // 🟢 UPDATED: SUBMIT HANDLER TO MATCH BACKEND MODEL
    const handleCreateEvent = async (e) => {
        e.preventDefault();
        
        const errors = {};
        if (!eventName.trim()) errors.eventName = true;
        if (!eventDate) errors.eventDate = true;
        if (selectedDepartments.length === 0) errors.departments = true;
        const mustSelectPrograms = selectedDepartments.length > 0 && allProgramsToDisplay.length > 0;
        if (mustSelectPrograms && selectedPrograms.length === 0) errors.programs = true;

        setValidationError(errors);

        if (Object.keys(errors).length === 0) {
            try {
                // 1. Parse Date
                const dateObj = new Date(eventDate);
                const startDay = dateObj.getDate();
                const endDay = dateObj.getDate(); 
                const startMonth = dateObj.toLocaleString('default', { month: 'long' });
                const endMonth = dateObj.toLocaleString('default', { month: 'long' });

                // 2. Determine Scope
                const eventScope = selectedDepartments.includes('All') 
                    ? 'School-Wide' 
                    : 'Departmental';

                // 3. Construct Payload (Matching the new Model/Controller)
                const payload = {
                    eventName: eventName,
                    eventScope: eventScope,
                    startDay: startDay,
                    endDay: endDay,
                    startMonth: startMonth,
                    endMonth: endMonth,
                    eventColor: selectedColor, // 🟢 Sending the Color
                    forEligibleSection: selectedPrograms,
                    forEligibleProgramsAndYear: [],
                    forTemporarilyWaived: [] 
                };

                console.log('Sending Payload:', payload);

                // 4. Call API
                const response = await addEvent(payload);

                alert(response.message || "Event Created Successfully!");
                handleCloseModal();
                resetForm();

            } catch (error) {
                console.error(error);
                alert(`Error: ${error.message}`);
            }
        }
    };

    const isFormComplete = eventName.trim() && eventDate && selectedDepartments.length > 0 &&
        (allProgramsToDisplay.length === 0 || selectedPrograms.length > 0);
    const isButtonDisabled = !isFormComplete || Object.keys(validationError).length > 0;

    // --- STYLES ---

    const animationClass = isClosing
        ? 'animate-out fade-out slide-out-to-top-3'
        : 'animate-in fade-in slide-in-from-top-3';

    // 🟢 REPLICATED CELL STYLE (For Sections)
    const cellStyle = {
        fontFamily: 'geist, sans-serif', 
        fontSize: '12px', 
        color: '#4b5563',
        borderBottom: '1px solid #f3f4f6', 
        height: '43.5px', 
        display: 'flex', 
        alignItems: 'center',
        padding: '0 12px',
        cursor: 'pointer',
        transition: 'background-color 0.2s ease'
    };

    const buttonContainerStyle = {
        position: 'relative', padding: '8px 16px', borderRadius: 6, fontSize: 12, fontWeight: 500, fontFamily: 'geist', cursor: 'pointer', border: 'none', backgroundColor: '#4268BD', color: 'white', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center'
    };
    const buttonIndicatorStyle = {
        position: 'absolute', top: 0, left: 0, height: '100%', backgroundColor: '#33549F', zIndex: 0, transition: 'width 300ms cubic-bezier(0.4, 0, 0.2, 1)', width: isTriggerHovered ? '100%' : '0%',
    };
    const buttonTextStyle = { position: 'relative', zIndex: 10, pointerEvents: 'none' };

    const modalOverlayStyle = { position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0, 0, 0, 0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9000, backdropFilter: 'blur(2px)', opacity: isClosing ? 0 : 1, transition: 'opacity 0.3s ease-in-out' };
    const modalContentStyle = { backgroundColor: 'white', borderRadius: '0.75rem', boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)', width: '90%', maxWidth: '900px', maxHeight: '95vh', height: '95vh', display: 'flex', flexDirection: 'row', position: 'relative', overflow: 'hidden' };

    const leftPanelStyle = { flex: 1.4, padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: 10, overflowY: 'auto' };
    const rightPanelStyle = { flex: 1, backgroundColor: '#f9fafb', borderLeft: '1px solid #e5e7eb', padding: '1.5rem', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', gap: '1rem' };

    const inputStyle = { backgroundColor: '#f3f4f6', border: 'none', padding: '10px 10px', borderRadius: '0.5rem', width: '100%', outline: 'none', color: '#374151', fontSize: 14, fontFamily: "geist" };
    const departmentChipStyle = (dept) => ({ padding: '5px 10px', borderRadius: 12, fontSize: 12, cursor: 'pointer', backgroundColor: selectedDepartments.includes(dept) ? '#3b82f6' : '#f3f4f6', color: selectedDepartments.includes(dept) ? 'white' : '#4b5563', fontFamily: "geist", transition: 'all 0.15s ease-in-out' });
    const labelStyle = (isError) => ({ fontSize: 14, fontWeight: 450, fontFamily: "geist", color: isError ? 'red' : 'inherit', whiteSpace: 'nowrap' });
    const colorSwatchStyle = (color, isSelected) => ({ width: '24px', height: '24px', borderRadius: '50%', backgroundColor: color, cursor: 'pointer', border: isSelected ? '2px solid #3b82f6' : '1px solid #e5e7eb', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'transform 0.1s ease', transform: isSelected ? 'scale(1.1)' : 'scale(1)', boxShadow: isSelected ? '0 2px 4px rgba(0,0,0,0.1)' : 'none' });
    const dateButtonStyle = (isError) => ({ position: 'relative', padding: "5px 10px", fontSize: 12, fontFamily: "geist", fontWeight: 450, borderRadius: 8, border: isError ? '1px solid red' : '1px solid #e5e7eb', backgroundColor: 'white', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px', color: isError ? 'red' : (eventDate ? '#374151' : '#4b5563') });
    const submitButtonStyle = (isDisabled) => {
        const activeStyles = { background: 'linear-gradient(to right, #4268BD, #3F6AC9)', cursor: 'pointer', fontWeight: '600' };
        const disabledStyles = { backgroundColor: '#cccccc', background: '#cccccc', cursor: 'not-allowed', fontWeight: '400' };
        return { color: 'white', padding: '10px 24px', borderRadius: '0.5rem', display: 'flex', alignItems: 'center', gap: '8px', border: 'none', fontFamily: "geist", fontSize: 12, ...(isDisabled ? disabledStyles : activeStyles) };
    };

    const currentColorObj = EVENT_COLORS.find(c => c.value === selectedColor) || EVENT_COLORS[0];

    return (
        <>
            <button style={buttonContainerStyle} onClick={() => setIsOpen(true)} onMouseEnter={() => setIsTriggerHovered(true)} onMouseLeave={() => setIsTriggerHovered(false)}>
                <div style={buttonIndicatorStyle} />
                <span style={buttonTextStyle}>Add Event</span>
            </button>

            {isOpen && (
                <div style={modalOverlayStyle} onClick={handleCloseModal}>
                    <form style={modalContentStyle} onSubmit={handleCreateEvent} className={animationClass} onClick={(e) => e.stopPropagation()}>
                        <button type="button" onClick={handleCloseModal} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors z-10" style={{ background: 'transparent', border: 'none', cursor: 'pointer' }}><X size={20} /></button>

                        {/* LEFT COLUMN */}
                        <div style={leftPanelStyle}>
                            <div className="flex justify-between items-center flex-shrink-0">
                                <h2 style={{ fontSize: 16, fontFamily: "geist", fontWeight: 450 }}>Add Event</h2>
                            </div>
                            
                            <div className="flex justify-between items-center flex-shrink-0">
                                <div className="flex gap-2 max-h-[40px] items-center">
                                    <label style={dateButtonStyle(validationError.eventDate)} className="hover:bg-gray-50 transition-colors">
                                        <span style={{ color: validationError.eventDate ? 'red' : (eventDate ? '#374151' : 'inherit'), fontWeight: eventDate ? 500 : 450 }}>{eventDate ? new Date(eventDate).toLocaleDateString('en-US') : 'Pick a date'}</span>
                                        <Calendar size={12} style={{ color: validationError.eventDate ? 'red' : '#4b5563' }} />
                                        <input type="date" value={eventDate} onChange={handleEventDateChange} onClick={(e) => { try { if (e.target.showPicker) e.target.showPicker(); } catch (error) { } }} style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', opacity: 0, cursor: 'pointer' }} />
                                    </label>
                                </div>
                                <button type="submit" disabled={isButtonDisabled} style={submitButtonStyle(isButtonDisabled)} className="transition-colors hover:bg-blue-700 shadow-md"><span>✓</span> Submit</button>
                            </div>

                            <div className="flex items-center gap-4 w-full flex-shrink-0">
                                <label style={labelStyle(validationError.eventName)} className="w-[120px]">Event Name:</label>
                                {isEditingName ? (
                                    <input 
                                        ref={nameInputRef}
                                        type="text" 
                                        placeholder="e.g., Celebration Day!" 
                                        style={{ ...inputStyle, border: validationError.eventName ? '1px solid red' : 'none' }} 
                                        value={eventName} 
                                        onChange={handleEventNameChange} 
                                        onBlur={handleNameBlur}
                                    />
                                ) : (
                                    <div 
                                        onClick={() => setIsEditingName(true)} 
                                        className="w-full flex items-center justify-between cursor-pointer hover:bg-gray-100 rounded px-2 py-2 group"
                                    >
                                        <span style={{ fontSize: 18, fontWeight: 600, fontFamily: 'geist', color: '#111827' }}>
                                            {eventName}
                                        </span>
                                        <Edit2 size={14} className="text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                                    </div>
                                )}
                            </div>

                            <div className="flex items-center gap-4 w-full flex-shrink-0">
                                <label style={labelStyle(false)} className="w-[120px]">Color Tag:</label>
                                <div className="flex gap-2">
                                    {EVENT_COLORS.map((colorObj) => (
                                        <div key={colorObj.name} title={colorObj.name} onClick={() => setSelectedColor(colorObj.value)} style={colorSwatchStyle(colorObj.value, selectedColor === colorObj.value)}>
                                            {selectedColor === colorObj.value && <Check size={14} className="text-blue-600" strokeWidth={3} />}
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Department Selection */}
                            <div 
                                onMouseEnter={() => setIsDeptContainerHovered(true)} 
                                onMouseLeave={() => setIsDeptContainerHovered(false)}
                                className="flex flex-col gap-2 flex-shrink-0 transition-all duration-300 ease-in-out"
                            >
                                {!isDeptContainerHovered && selectedDepartments.length > 0 ? (
                                    <div className="flex items-center gap-3 h-[45px]">
                                        <label style={labelStyle(validationError.departments)}>Selected Department/s:</label>
                                        <div className="flex flex-wrap gap-2">
                                            {selectedDepartments.slice(0, 2).map((dept, i) => (
                                                <span key={i} style={{...departmentChipStyle(dept), cursor: 'default'}}>{dept}</span>
                                            ))}
                                            {selectedDepartments.length > 2 && (
                                                <span style={{ padding: '5px 10px', borderRadius: 12, fontSize: 12, backgroundColor: '#e5e7eb', color: '#374151', fontFamily: "geist", cursor: 'default' }}>
                                                    +{selectedDepartments.length - 2}
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                ) : (
                                    <>
                                        <label style={labelStyle(validationError.departments)}>Select Department/s:</label>
                                        <div className="flex flex-wrap gap-2.5 border-gray-200 border-[1px] rounded-md p-3 bg-white">
                                            {departments.map((dept, i) => (
                                                <span key={i} style={departmentChipStyle(dept)} className="transition-colors hover:bg-gray-200" onClick={() => toggleDepartment(dept)}>{dept}</span>
                                            ))}
                                        </div>
                                    </>
                                )}
                            </div>

                            {/* Program Section */}
                            <div className="flex flex-col flex-grow min-h-0">
                                <div style={{ marginBottom: 5 }}><label style={labelStyle(validationError.programs)}>Select sections:</label></div>
                                {selectedDepartments.length === 0 ? (
                                    <div className="flex items-center justify-center h-full" style={{ padding: 16, backgroundColor: '#fef3c7', borderRadius: 8, color: '#92400e', fontFamily: "geist", fontSize: 14, fontWeight: 450 }}>Please select a Department.</div>
                                ) : (
                                    <>
                                        <div className="w-full flex justify-between flex-shrink-0" style={{ marginBottom: 10 }}>
                                            <div className="relative flex-1 max-w-md flex-row">
                                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-600" size={14} />
                                                <input type="text" placeholder="Search" className="w-full text-sm outline-none" style={{ width: '100%', paddingLeft: '40px', paddingRight: '16px', paddingTop: '6px', paddingBottom: '6px', backgroundColor: '#F0F1F6', border: 'none', borderRadius: 8, fontSize: 12, fontFamily: "geist", fontWeight: 450 }} />
                                            </div>
                                            <div className="flex items-center gap-2 text-sm ml-4">
                                                <input type="checkbox" className="accent-blue-600 w-4 h-4" checked={selectedPrograms.length === allProgramsToDisplay.length && allProgramsToDisplay.length > 0} onChange={(e) => { const programsToSelect = e.target.checked ? allProgramsToDisplay : []; setSelectedPrograms(programsToSelect); if (validationError.programs && programsToSelect.length > 0) setValidationError(prev => ({ ...prev, programs: false })); }} />
                                                <label style={{ fontWeight: 450, fontSize: 12, fontFamily: "geist" }}>Select All</label>
                                            </div>
                                        </div>
                                        
                                        {/* 🟢 LIST CONTAINER: Now uses white background with simple border, similar to table */}
                                        <div className="rounded-lg border border-gray-200 flex flex-col flex-grow min-h-0 overflow-hidden bg-white">
                                            <div className="overflow-y-auto flex-grow">
                                                {programsToDisplay.map((program, idx) => (
                                                    <div 
                                                        key={idx} 
                                                        onClick={() => handleProgramToggle(program)}
                                                        // 🟢 Applying cellStyle here + Hover/Active states
                                                        style={{
                                                            ...cellStyle,
                                                            backgroundColor: selectedPrograms.includes(program) ? '#eff6ff' : 'transparent', // Matches table selected row
                                                        }}
                                                        className="hover:bg-gray-50"
                                                    >
                                                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '48px', marginRight: '10px' }}>
                                                            <input 
                                                                type="checkbox" 
                                                                className="accent-blue-600 w-4 h-4 cursor-pointer" 
                                                                checked={selectedPrograms.includes(program)} 
                                                                readOnly 
                                                            />
                                                        </div>
                                                        <span style={{ fontWeight: 500, fontSize: 12, fontFamily: "geist", color: '#111827' }}>
                                                            {program}
                                                        </span>
                                                    </div>
                                                ))}
                                            </div>
                                            
                                            {/* PAGINATION UI */}
                                            {allProgramsToDisplay.length > ITEMS_PER_PAGE && (
                                                <div style={{ paddingTop: '10px', borderTop: '1px solid #f3f4f6', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', paddingBottom: '10px' }} className="flex-shrink-0 bg-white">
                                                    <button
                                                        type="button"
                                                        onClick={() => handlePageChange(currentPage - 1)}
                                                        disabled={currentPage === 1}
                                                        className="flex items-center gap-1 text-xs font-medium text-gray-500 hover:bg-gray-100 hover:text-gray-700 transition-colors duration-300 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                                                        style={{ padding: '6px 10px', borderRadius: '6px', border: 'none', background: 'transparent' }}
                                                    >
                                                        <ChevronLeft size={14} /> Previous
                                                    </button>

                                                    {totalPages > 5 && visiblePages[0] > 1 && (
                                                        <>
                                                            <AnimatedPageButton page={1} isActive={currentPage === 1} onClick={handlePageChange} />
                                                            <span className="text-gray-400 text-xs">...</span>
                                                        </>
                                                    )}

                                                    {visiblePages.map((page) => (
                                                        <AnimatedPageButton
                                                            key={page}
                                                            page={page}
                                                            isActive={currentPage === page}
                                                            onClick={handlePageChange}
                                                        />
                                                    ))}

                                                    {totalPages > 5 && visiblePages[visiblePages.length - 1] < totalPages && (
                                                        <>
                                                            <span className="text-gray-400 text-xs">...</span>
                                                            <AnimatedPageButton page={totalPages} isActive={currentPage === totalPages} onClick={handlePageChange} />
                                                        </>
                                                    )}

                                                    <button
                                                        type="button"
                                                        onClick={() => handlePageChange(currentPage + 1)}
                                                        disabled={currentPage === totalPages}
                                                        className="flex items-center gap-1 text-xs font-medium text-gray-500 hover:bg-gray-100 hover:text-gray-700 transition-colors duration-300 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                                                        style={{ padding: '6px 10px', borderRadius: '6px', border: 'none', background: 'transparent' }}
                                                    >
                                                        Next <ChevronRight size={14} />
                                                    </button>
                                                </div>
                                            )}
                                        </div>
                                    </>
                                )}
                            </div>
                        </div>

                        {/* RIGHT COLUMN (Preview) */}
                        <div style={rightPanelStyle}>
                            <h3 style={{ fontFamily: 'geist', fontSize: 12, color: '#6b7280', fontWeight: 500, letterSpacing: '0.05em', textTransform: 'uppercase' }}>Preview Card</h3>
                            <div style={{ width: '280px', height: '380px', backgroundColor: selectedColor, borderRadius: '16px', padding: '24px', display: 'flex', flexDirection: 'column', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)', transition: 'background-color 0.3s ease', position: 'relative' }}>
                                <div style={{ backgroundColor: 'rgba(255,255,255,0.6)', padding: '4px 10px', borderRadius: '8px', alignSelf: 'flex-start', marginBottom: '20px', fontSize: 12, fontWeight: 600, fontFamily: 'geist', color: currentColorObj.text, display: 'flex', alignItems: 'center', gap: 6 }}>
                                    <Calendar size={12} />
                                    {eventDate ? new Date(eventDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) : 'Date'}
                                </div>
                                <div style={{ flex: 1 }}>
                                    <h3 style={{ fontFamily: 'geist', fontSize: 24, fontWeight: 600, color: currentColorObj.text, lineHeight: 1.2, wordBreak: 'break-word' }}>{eventName || "Event Title Goes Here"}</h3>
                                    <div style={{ marginTop: 8, fontSize: 13, color: currentColorObj.text, opacity: 0.8, fontFamily: 'geist' }}>{selectedPrograms.length > 0 ? `${selectedPrograms.length} section${selectedPrograms.length !== 1 ? 's' : ''} selected` : "No sections selected"}</div>
                                </div>
                                <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginTop: 'auto' }}>
                                    {selectedDepartments.length > 0 ? (selectedDepartments.slice(0, 3).map((dept, i) => <span key={i} style={{ fontSize: 10, backgroundColor: 'white', padding: '4px 8px', borderRadius: 20, fontFamily: 'geist', color: currentColorObj.text, fontWeight: 500 }}>{dept}</span>)) : (<div style={{ display: 'flex', alignItems: 'center', gap: 4, opacity: 0.5 }}><Tag size={14} color={currentColorObj.text} /><span style={{ fontSize: 12, fontFamily: 'geist', color: currentColorObj.text }}>Departments</span></div>)}
                                    {selectedDepartments.length > 3 && (<span style={{ fontSize: 10, backgroundColor: 'white', padding: '4px 8px', borderRadius: 20, fontFamily: 'geist', color: currentColorObj.text }}>+{selectedDepartments.length - 3}</span>)}
                                </div>
                            </div>
                        </div>
                    </form>
                </div>
            )}
        </>
    );
};