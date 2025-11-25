import React, { useState, useMemo } from 'react';
// Note: Assuming you import from the updated data.js in your actual file structure
import { departments, PROGRAM_STRUCTURE, getAllPrograms } from './data';
import { Calendar, Search, ChevronLeft, ChevronRight } from 'lucide-react';

// Helper function to concatenate program arrays (Logic remains the same)
const getProgramsForDepartments = (selectedDepts) => {
    if (selectedDepts.includes('All')) {
        return getAllPrograms();
    }
    const filteredPrograms = selectedDepts
        .filter(dept => dept !== 'All')
        .flatMap(dept => PROGRAM_STRUCTURE[dept] || []);
    return [...new Set(filteredPrograms)];
};


// 1. Left Panel: Add Event Form
export const AddEventForm = () => {
    // --- STATE MANAGEMENT ---
    const [eventName, setEventName] = useState('');
    const [eventDate, setEventDate] = useState(''); // State for the date
    const [selectedDepartments, setSelectedDepartments] = useState([]);
    const [selectedPrograms, setSelectedPrograms] = useState([]);
    const [validationError, setValidationError] = useState({});

    // --- PAGINATION STATE (Unchanged) ---
    const [currentPage, setCurrentPage] = useState(1);
    const ITEMS_PER_PAGE = 8;

    // --- DYNAMIC DATA & PAGINATION LOGIC (Unchanged) ---
    const allProgramsToDisplay = useMemo(() => {
        setCurrentPage(1);
        return getProgramsForDepartments(selectedDepartments);
    }, [selectedDepartments]);

    const totalPages = Math.ceil(allProgramsToDisplay.length / ITEMS_PER_PAGE);

    const programsToDisplay = useMemo(() => {
        const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
        const endIndex = startIndex + ITEMS_PER_PAGE;
        return allProgramsToDisplay.slice(startIndex, endIndex);
    }, [allProgramsToDisplay, currentPage]);

    // --- HANDLERS ---
    
    const handleEventNameChange = (e) => {
        const value = e.target.value;
        setEventName(value);
        if (validationError.eventName && value.trim()) {
            setValidationError(prev => ({ ...prev, eventName: false }));
        }
    };
    
    const handleEventDateChange = (e) => {
        const value = e.target.value;
        setEventDate(value);
        if (validationError.eventDate && value) {
            setValidationError(prev => ({ ...prev, eventDate: false }));
        }
    };

    const toggleDepartment = (dept) => {
        setSelectedDepartments(prevDepts => {
            if (dept === 'All') {
                return prevDepts.includes('All') ? [] : departments.filter(d => d !== 'All');
            }
            
            let newDepts = prevDepts.filter(d => d !== 'All');

            if (newDepts.includes(dept)) {
                newDepts = newDepts.filter(d => d !== dept);
            } else {
                newDepts = [...newDepts, dept];
            }

            const allNonAllSelected = departments.filter(d => d !== 'All').every(d => newDepts.includes(d));
            if (allNonAllSelected && newDepts.length > 0) {
                 newDepts = ['All', ...departments.filter(d => d !== 'All')];
            }

            if (validationError.departments && newDepts.length > 0) {
                 setValidationError(prev => ({ ...prev, departments: false }));
            }
            if (validationError.programs) {
                setValidationError(prev => ({ ...prev, programs: false }));
            }

            if (newDepts.length === 0) return [];
            
            return newDepts;
        });
        setSelectedPrograms([]);
    };
    
    const handleProgramToggle = (program) => {
        setSelectedPrograms(prevPrograms => {
            const isSelected = prevPrograms.includes(program);
            let nextPrograms = isSelected
                ? prevPrograms.filter(p => p !== program)
                : [...prevPrograms, program];

            if (validationError.programs && nextPrograms.length > 0) {
                setValidationError(prev => ({ ...prev, programs: false }));
            }
            return nextPrograms;
        });
    };

    const handlePageChange = (pageNumber) => {
        if (pageNumber >= 1 && pageNumber <= totalPages) {
            setCurrentPage(pageNumber);
        }
    };
    
    const handleCreateEvent = (e) => {
        e.preventDefault();
        const errors = {};

        if (!eventName.trim()) {
            errors.eventName = true;
        }
        
        // Validate Date
        if (!eventDate) {
            errors.eventDate = true;
        }

        if (selectedDepartments.length === 0) {
            errors.departments = true;
        }

        const mustSelectPrograms = selectedDepartments.length > 0 && allProgramsToDisplay.length > 0;
        if (mustSelectPrograms && selectedPrograms.length === 0) {
            errors.programs = true;
        }

        setValidationError(errors);

        if (Object.keys(errors).length === 0) {
            console.log('✅ Form Submitted Successfully! Data:', { eventName, eventDate, selectedDepartments, selectedPrograms });
            alert(`Event "${eventName}" scheduled for ${eventDate} is valid!`);
        } else {
             console.log('❌ Validation Failed. Errors:', errors);
        }
    };

    // --- STYLES ---
    const formContainerStyle = {
        backgroundColor: 'white',
        padding: '1.5rem',
        borderRadius: '0.75rem',
        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -2px rgba(0, 0, 0, 0.1)',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        gap: 10,
    };
    const inputStyle = {
        backgroundColor: '#f3f4f6',
        border: 'none',
        padding: '10px 10px',
        borderRadius: '0.5rem',
        width: '100%',
        outline: 'none',
        color: '#374151',
        fontSize: 14,
        fontFamily: "geist"
    };
    const departmentChipStyle = (dept) => ({
        padding: '5px 10px',
        borderRadius: 12,
        fontSize: 12,
        cursor: 'pointer',
        backgroundColor: selectedDepartments.includes(dept) ? '#3b82f6' : '#f3f4f6',
        color: selectedDepartments.includes(dept) ? 'white' : '#4b5563',
        fontFamily: "geist",
        transition: 'all 0.15s ease-in-out'
    });
    const selectedChipStyle = {
        padding: '5px 10px',
        borderRadius: '9999px',
        fontSize: 13,
        display: 'flex',
        alignItems: 'center',
        gap: '0.5rem',
        width: 'fit-content',
        backgroundColor: '#60a5fa',
        color: 'white',
        fontFamily: "geist"
    };
    const labelStyle = (isError) => ({
        fontSize: 14,
        fontWeight: 450,
        fontFamily: "geist",
        color: isError ? 'red' : 'inherit'
    });

    // UPDATED STYLE: Date button/input style
    const dateButtonStyle = (isError) => ({
        position: 'relative', // Key for positioning the hidden input
        padding: "5px 10px",
        fontSize: 12,
        fontFamily: "geist",
        fontWeight: 450,
        borderRadius: 8,
        border: isError ? '1px solid red' : '1px solid #e5e7eb',
        backgroundColor: 'white',
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        gap: '4px',
        // Text color logic for the visible span
        color: isError ? 'red' : (eventDate ? '#374151' : '#4b5563'), 
    });
    
    // Logic to format the displayed date text
    const displayDateText = eventDate
        ? `Event for ${new Date(eventDate).toLocaleDateString('en-US')}`
        : 'Pick a date';


    return (
        <form style={formContainerStyle} onSubmit={handleCreateEvent}>
            {/* Header */}
            <div className="flex justify-between items-center flex-shrink-0">
                <h2 style={{
                    fontSize: 16,
                    fontFamily: "geist",
                    fontWeight: 450
                }}>
                    Add Event
                </h2>
                
                {/* 🎯 FIXED DATE INPUT COMPONENT */}
                <label 
                    htmlFor="event-date-picker"
                    style={dateButtonStyle(validationError.eventDate)} 
                    className="hover:bg-gray-50 transition-colors"
                >
                    {/* 1. Visible Text */}
                    <span style={{ 
                        color: validationError.eventDate ? 'red' : (eventDate ? '#374151' : 'inherit'),
                        fontWeight: eventDate ? 500 : 450 
                    }}>
                        {displayDateText}
                    </span>
                    
                    {/* 2. Calendar Icon */}
                    <Calendar 
                        size={12} 
                        style={{ color: validationError.eventDate ? 'red' : '#4b5563' }} 
                    />
                    
                    {/* 3. Hidden Input Type="date" */}
                    <input
                        id="event-date-picker"
                        type="date"
                        value={eventDate}
                        onChange={handleEventDateChange}
                        // KEY: Hide the native input but keep it functional via the parent label
                        style={{
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            width: '100%',
                            height: '100%',
                            opacity: 0, // Makes it invisible but clickable
                            cursor: 'pointer',
                        }}
                    />
                </label>
            </div>

            {/* Event Name */}
            <div className="flex items-center gap-4 w-full flex-shrink-0">
                <label style={labelStyle(validationError.eventName)} className="w-[150px]">
                    Event Name:
                </label>
                <input
                    type="text"
                    placeholder="e.g., Celebration Day!"
                    style={{ ...inputStyle, border: validationError.eventName ? '1px solid red' : 'none' }}
                    value={eventName}
                    onChange={handleEventNameChange} 
                />
            </div>

            {/* Department Selection */}
            <label style={labelStyle(validationError.departments)}>Select Department/s:</label>
            <div className='flex flex-col gap-3 border-gray-200 border-[1px] rounded-md flex-shrink-0' style={{ padding: 10 }}>
                <div className="flex flex-wrap gap-2.5">
                    {departments.map((dept, i) => (
                        <span
                            key={i}
                            style={departmentChipStyle(dept)}
                            className="transition-colors hover:bg-gray-200"
                            onClick={() => toggleDepartment(dept)} 
                        >
                            {dept}
                        </span>
                    ))}
                </div>
            </div>

            {/* Selected Departments Area */}
            <div className='flex-shrink-0'>
                <label style={labelStyle(validationError.departments)}>Selected Department/s:</label>
                <div style={{ border: '1px solid #e5e7eb', borderRadius: '0.5rem', padding: '1rem', minHeight: '60px' }}>
                    <div className="flex flex-wrap gap-2.5">
                        {selectedDepartments
                            .filter(dept => dept !== 'All')
                            .map((dept, i) => (
                                <div key={i} style={selectedChipStyle}>
                                    {dept}
                                    <span
                                        className="cursor-pointer"
                                        onClick={() => toggleDepartment(dept)} 
                                    >
                                        ✕
                                    </span>
                                </div>
                            ))}
                    </div>
                </div>
            </div>

            {/* Specific Sections List (The main content area that needs to grow/scroll) */}
            <div className="flex flex-col flex-grow min-h-0">
                <div style={{ marginBottom: 10 }}>
                    <label style={labelStyle(validationError.programs)}>Select specific sections and programs:</label>
                </div>

                {selectedDepartments.length === 0 ? (
                    <div style={{ padding: 16, backgroundColor: '#fef3c7', borderRadius: 8, textAlign: 'center', color: '#92400e' }}>
                        Please select a Department first to view the available sections.
                    </div>
                ) : (
                    <>
                        {/* Search Bar & Select All */}
                        <div className="w-full flex justify-between flex-shrink-0" style={{ marginBottom: 10 }}>
                            <div className="relative flex-1 max-w-md flex-row">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-600" size={14} />
                                <input
                                    type="text"
                                    placeholder="Search"
                                    className="w-full text-sm focus:ring-1 focus:ring-blue-200 outline-none"
                                    style={{
                                        width: '100%', paddingLeft: '40px', paddingRight: '16px', paddingTop: '6px',
                                        paddingBottom: '6px', backgroundColor: '#F0F1F6', border: 'none', borderRadius: 8,
                                        fontSize: 12, fontFamily: "geist", fontWeight: 450
                                    }}
                                />
                            </div>
                            <div className="flex items-center gap-2 text-sm">
                                <input
                                    type="checkbox"
                                    className="accent-blue-600 w-4 h-4 border-gray-200 rounded-md"
                                    checked={selectedPrograms.length === allProgramsToDisplay.length && allProgramsToDisplay.length > 0}
                                    onChange={(e) => {
                                        const programsToSelect = e.target.checked ? allProgramsToDisplay : [];
                                        setSelectedPrograms(programsToSelect);
                                        if (validationError.programs && programsToSelect.length > 0) {
                                            setValidationError(prev => ({ ...prev, programs: false }));
                                        }
                                    }}
                                />
                                <label style={{ fontWeight: 450, fontSize: 12, fontFamily: "geist" }}>Select All</label>
                            </div>
                        </div>

                        {/* Program List Container */}
                        <div className="bg-blue-50 rounded-lg p-4 flex flex-col flex-grow min-h-0">

                            {/* List Items */}
                            <div className="overflow-y-auto flex-grow min-h-0">
                                {programsToDisplay.map((program, idx) => (
                                    <div
                                        key={idx}
                                        style={{ padding: 10, backgroundColor: selectedPrograms.includes(program) ? '#bfdbfe' : 'transparent' }}
                                        className="flex items-center gap-3 py-2 px-2 transition-colors hover:bg-blue-100 rounded"
                                        onClick={() => handleProgramToggle(program)} 
                                    >
                                        <input
                                            type="checkbox"
                                            className="accent-blue-600 w-4 h-4"
                                            checked={selectedPrograms.includes(program)}
                                            readOnly
                                        />
                                        <span style={{ fontWeight: 450, fontSize: 12, fontFamily: "geist" }}>{program}</span>
                                    </div>
                                ))}
                                {programsToDisplay.length === 0 && (
                                    <div style={{ padding: 10, textAlign: 'center', color: '#6b7280' }}>
                                        No programs found for the selected department(s).
                                    </div>
                                )}
                            </div>

                            {/* Pagination */}
                            {allProgramsToDisplay.length > ITEMS_PER_PAGE && (
                                <div
                                    style={{
                                        padding: '16px', borderTop: '1px solid #f3f4f6', display: 'flex',
                                        alignItems: 'center', justifyContent: 'center', gap: '8px',
                                    }}
                                    className="flex-shrink-0"
                                >
                                    {/* Previous Button */}
                                    <button
                                        type="button"
                                        onClick={() => handlePageChange(currentPage - 1)}
                                        disabled={currentPage === 1}
                                        className="hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                                        style={{
                                            padding: '8px 12px',
                                            borderRadius: '6px',
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: '4px',
                                            fontSize: '0.875rem', 
                                            color: '#4b5563', 
                                            backgroundColor: 'transparent',
                                            border: 'none',
                                            cursor: 'pointer',
                                            fontFamily: "geist",
                                            fontSize: 12,
                                            fontWeight: 450
                                        }}
                                    >
                                        <ChevronLeft size={16} /> Previous
                                    </button>

                                    {/* Page Number Buttons */}
                                    {[...Array(totalPages)].slice(0, 3).map((_, i) => {
                                        const pageNumber = i + 1;
                                        return (
                                            <button
                                                key={pageNumber}
                                                type="button"
                                                onClick={() => handlePageChange(pageNumber)}
                                                className={`
                                                    ${currentPage === pageNumber
                                                        ? 'bg-gray-900 text-white' 
                                                        : 'text-gray-600 hover:bg-gray-100'
                                                    }
                                                `}
                                                style={{
                                                    width: '32px',
                                                    height: '32px',
                                                    borderRadius: '6px',
                                                    fontSize: '0.875rem',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'center',
                                                    border: 'none',
                                                    cursor: 'pointer',
                                                    fontFamily: "geist",
                                                    fontSize: 12,
                                                    fontWeight: 450
                                                }}
                                            >
                                                {pageNumber}
                                            </button>
                                        );
                                    })}
                                    
                                    {/* Ellipsis */}
                                    {totalPages > 3 && <span className="text-gray-400">...</span>}

                                    {/* Next Button */}
                                    <button
                                        type="button"
                                        onClick={() => handlePageChange(currentPage + 1)}
                                        disabled={currentPage === totalPages}
                                        className="hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                                        style={{
                                            padding: '8px 12px',
                                            borderRadius: '6px',
                                            fontSize: '0.875rem',
                                            color: '#4b5563',
                                            backgroundColor: '#f3f4f6',
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: '4px',
                                            border: 'none',
                                            cursor: 'pointer',
                                            fontFamily: "geist",
                                            fontSize: 12,
                                            fontWeight: 450
                                        }}
                                    >
                                        Next <ChevronRight size={16} />
                                    </button>
                                </div>
                            )}
                        </div>
                    </>
                )}
            </div>

            {/* Submit Button */}
            <div className="flex justify-end flex-shrink-0">
                <button
                    type="submit"
                    className="transition-colors hover:bg-blue-700 shadow-md"
                    style={{
                        background: 'linear-gradient(to right, #4268BD, #3F6AC9)',
                        color: 'white',
                        padding: '10px 24px',
                        borderRadius: '0.5rem',
                        fontWeight: '600',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        border: 'none',
                        fontFamily: "geist",
                        fontSize: 12,
                    }}
                >
                    <span>✓</span> Submit
                </button>
            </div>
        </form>
    );
};