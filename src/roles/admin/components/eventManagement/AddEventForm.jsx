import React, { useState, useMemo, useEffect } from 'react';
import { Search, X, Check, ChevronLeft, ChevronRight, Plus } from 'lucide-react';
import { getSchoolStructure } from '../../../../functions/admin/getSchoolStructure';
import { addEvent } from "../../../../functions/admin/addEvent";

// --- HELPERS ---
const formatDeptName = (name) => {
    if (!name) return "";
    const result = name.replace(/([A-Z])/g, " $1");
    return result.charAt(0).toUpperCase() + result.slice(1);
};

const PrimaryActionButton = ({ label, icon, onClick }) => {
    return (
        <button
            onClick={onClick}
            className="flex items-center bg-[#4268BD] text-white rounded-md text-sm font-medium hover:bg-[#3556a0] transition-all shadow-sm"
            style={{ border: 'none', cursor: 'pointer', padding: '8px 16px', gap: '8px' }}
        >
            {icon || <Plus size={16} />} {label}
        </button>
    );
};

const EVENT_COLORS = [
    { name: 'Blue', value: '#dbeafe', text: '#1e40af' },
    { name: 'Red', value: '#fee2e2', text: '#991b1b' },
    { name: 'Green', value: '#dcfce7', text: '#166534' },
    { name: 'Yellow', value: '#fef9c3', text: '#854d0e' },
    { name: 'Orange', value: '#ffedd5', text: '#9a3412' },
    { name: 'Violet', value: '#f3e8ff', text: '#6b21a8' },
];

export const AddEventForm = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [structureData, setStructureData] = useState([]);
    const [isLoadingData, setIsLoadingData] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Form State
    const [eventName, setEventName] = useState('');
    const [eventDate, setEventDate] = useState('');
    const [eventEndDate, setEventEndDate] = useState('');
    const [selectedColor, setSelectedColor] = useState(EVENT_COLORS[0].value);
    const [selectedDepartments, setSelectedDepartments] = useState([]);
    const [selectedPrograms, setSelectedPrograms] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [currentPage, setCurrentPage] = useState(1);

    // 🟢 PAGINATION CONSTANTS
    const ITEMS_PER_PAGE = 10;

    useEffect(() => {
        if (isOpen) {
            const fetchData = async () => {
                setIsLoadingData(true);
                try {
                    const data = await getSchoolStructure();
                    // Ensure the response is strictly an array before saving it to state
                    if (Array.isArray(data)) setStructureData(data);
                } catch (error) {
                    console.error(error);
                } finally {
                    setIsLoadingData(false);
                }
            };
            fetchData();
        }
    }, [isOpen]);

    const availableDepartments = useMemo(() => structureData.map(item => item.category), [structureData]);

    // 🟢 THE BULLETPROOF FIX: Zero map/flatMap used here. Impossible to throw "reading 'map' of undefined"
    const allProgramsToDisplay = useMemo(() => {
        if (!isOpen || !Array.isArray(structureData) || structureData.length === 0) {
            return [];
        }

        const relevantDepts = selectedDepartments.includes('All') 
            ? structureData 
            : structureData.filter(dept => dept && selectedDepartments.includes(dept.category));

        const results = [];

        for (const dept of relevantDepts) {
            if (!dept || !Array.isArray(dept.levels)) continue;

            const isHigherEd = dept.category?.toLowerCase().includes("college") || dept.category === "higherEducation";
            const type = isHigherEd ? 'HIGHER_ED' : 'BASIC_ED';

            for (const level of dept.levels) {
                if (!level) continue;

                const levelNameStr = String(level.levelName || level.gradeLevel || 'N/A');
                
                // Safely extract the array no matter what it's named
                const itemsArray = Array.isArray(level.sections) 
                    ? level.sections 
                    : Array.isArray(level.programs) 
                        ? level.programs 
                        : [];

                for (const item of itemsArray) {
                    if (!item) continue;
                    
                    results.push({
                        id: `${levelNameStr}-${item}`,
                        section: item, 
                        year: levelNameStr,
                        display: `${levelNameStr} - ${item}`,
                        type: type,
                        category: dept.category 
                    });
                }
            }
        }

        return results.sort((a, b) => a.display.localeCompare(b.display));
    }, [selectedDepartments, isOpen, structureData]);

    const filteredPrograms = useMemo(() => {
        if (!searchQuery.trim()) return allProgramsToDisplay;
        return allProgramsToDisplay.filter(p => p.display.toLowerCase().includes(searchQuery.toLowerCase()));
    }, [allProgramsToDisplay, searchQuery]);

    const programsToDisplay = useMemo(() => {
        const start = (currentPage - 1) * ITEMS_PER_PAGE;
        const end = start + ITEMS_PER_PAGE;
        const sliced = filteredPrograms.slice(start, end);

        const padded = [...sliced];
        while (padded.length < ITEMS_PER_PAGE) {
            padded.push({ id: `empty-${padded.length}`, isEmpty: true });
        }
        return padded;
    }, [filteredPrograms, currentPage]);

    const totalPages = Math.ceil(filteredPrograms.length / ITEMS_PER_PAGE);

    const handleCreateEvent = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        try {
            const actualDepts = selectedDepartments.includes('All') ? availableDepartments : selectedDepartments;
            let finalPayloadItems = [];

            actualDepts.forEach(deptName => {
                const manuallySelectedInDept = selectedPrograms.filter(p => p.category === deptName);
                if (manuallySelectedInDept.length > 0) {
                    finalPayloadItems.push(...manuallySelectedInDept);
                } else {
                    const allSectionsInDept = allProgramsToDisplay.filter(p => p.category === deptName);
                    finalPayloadItems.push(...allSectionsInDept);
                }
            });

            const basicEdSelections = finalPayloadItems.filter(p => p.type !== 'HIGHER_ED');
            const higherEdSelections = finalPayloadItems.filter(p => p.type === 'HIGHER_ED');

            // 🟢 TIMEZONE SAFE DATE PARSING
            const [startYear, startMonthNum, startDayNum] = eventDate.split('-');
            const [endYear, endMonthNum, endDayNum] = eventEndDate ? eventEndDate.split('-') : [startYear, startMonthNum, startDayNum];
            const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

            const payload = {
                eventName,
                eventScope: selectedDepartments.includes('All') ? 'School-Wide' : 'Departmental',
                
                // Parsed purely from strings so timezones can't shift the day backward
                startDay: parseInt(startDayNum, 10),
                endDay: parseInt(endDayNum, 10),
                startMonth: monthNames[parseInt(startMonthNum, 10) - 1],
                endMonth: monthNames[parseInt(endMonthNum, 10) - 1],
                
                eventColor: selectedColor,

                forEligibleSection: basicEdSelections.map(p => ({ section: p.section, year: p.year })),
                forEligibleProgramsAndYear: higherEdSelections.map(p => ({ program: p.section, year: p.year })),

                submissionStatus: 'APPROVED',
                scheduleStatus: 'ONGOING'
            };

            await addEvent(payload);
            setIsOpen(false);
        } catch (error) {
            console.error(error);
        } finally {
            setIsSubmitting(false);
        }
    };

    const currentColorObj = EVENT_COLORS.find(c => c.value === selectedColor) || EVENT_COLORS[0];

    return (
        <>
            <PrimaryActionButton label="Add Event" onClick={() => setIsOpen(true)} />

            {/* OVERLAY */}
            <div
                style={{
                    position: 'fixed', top: 0, left: 0, width: '100%', height: '100%',
                    backgroundColor: 'rgba(0,0,0,0.3)', backdropFilter: 'blur(4px)',
                    zIndex: 9000, visibility: isOpen ? 'visible' : 'hidden',
                    opacity: isOpen ? 1 : 0, transition: 'all 0.4s cubic-bezier(0.16, 1, 0.3, 1)'
                }}
                onClick={() => setIsOpen(false)}
            >
                {/* PREVIEW CONTAINER */}
                <div
                    style={{
                        position: 'absolute', left: '30%', top: '50%', transform: 'translate(-50%, -50%)',
                        zIndex: 9001, pointerEvents: 'none', transition: 'all 0.5s ease',
                        opacity: isOpen ? 1 : 0, scale: isOpen ? 1 : 0.8
                    }}
                >
                    <div style={{ padding: '10px', backgroundColor: 'white', borderRadius: '24px', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.25)' }}>
                        <div style={{ width: '320px', height: '420px', backgroundColor: selectedColor, borderRadius: '20px', padding: '30px', display: 'flex', flexDirection: 'column', transition: 'background-color 0.4s ease' }}>
                            <div style={{ backgroundColor: 'white', width: 'fit-content', padding: '6px 12px', borderRadius: '10px', fontSize: 12, fontWeight: 700, color: currentColorObj.text, marginBottom: '20px' }}>
                                {eventDate ? new Date(eventDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) : 'DATE'}
                                {eventEndDate && ` - ${new Date(eventEndDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}`}
                            </div>
                            <h2 style={{ fontSize: 28, fontWeight: 800, color: currentColorObj.text, lineHeight: 1.1, fontFamily: 'geist' }}>
                                {eventName || "New Event"}
                            </h2>
                            <div style={{ marginTop: 'auto', display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                                {selectedDepartments.map(d => (
                                    <span key={d} style={{ fontSize: 10, background: 'white', padding: '4px 10px', borderRadius: 20, color: currentColorObj.text, fontWeight: 600 }}>
                                        {formatDeptName(d)}
                                    </span>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                {/* SLIDE PANEL (RIGHT) */}
                <div
                    style={{
                        position: 'absolute', right: 0, top: 0, width: '450px', height: '100%',
                        backgroundColor: 'white', boxShadow: '-10px 0 30px rgba(0,0,0,0.1)',
                        transform: isOpen ? 'translateX(0)' : 'translateX(100%)',
                        transition: 'transform 0.5s cubic-bezier(0.16, 1, 0.3, 1)',
                        display: 'flex', flexDirection: 'column', padding: '40px 30px'
                    }}
                    onClick={(e) => e.stopPropagation()}
                >
                    <div className="flex justify-between items-center" style={{ marginBottom: '32px' }}>
                        <h2 className="text-lg font-geist" style={{ fontWeight: 400 }}>Create Event</h2>
                        <button onClick={() => setIsOpen(false)} className="hover:bg-gray-100 rounded-full" style={{ border: 'none', cursor: 'pointer', padding: '8px' }}><X size={20} /></button>
                    </div>

                    <div style={{ flex: 1, overflowY: 'auto', paddingRight: '10px' }} className="custom-scrollbar">
                        {/* Dates Row */}
                        <div className="flex" style={{ gap: '16px', marginBottom: '24px' }}>
                            <div className="flex-1">
                                <label className="text-xs font-geist text-gray-500 uppercase block" style={{ marginBottom: '8px', fontWeight: 420 }}>Start Date</label>
                                <input type="date" value={eventDate} onChange={(e) => setEventDate(e.target.value)} className="font-geist w-full bg-gray-50 rounded-lg text-sm border-none outline-none" style={{ padding: '12px' }} />
                            </div>
                            <div className="flex-1">
                                <label className="text-xs font-geist text-gray-500 uppercase block" style={{ marginBottom: '8px', fontWeight: 420 }}>End Date</label>
                                <input type="date" min={eventDate} value={eventEndDate} onChange={(e) => setEventEndDate(e.target.value)} className="font-geist w-full bg-gray-50 rounded-lg text-sm border-none outline-none" style={{ padding: '12px' }} />
                            </div>
                        </div>

                        {/* Name Input */}
                        <div style={{ marginBottom: '24px' }}>
                            <label className="text-xs font-geist text-gray-500 uppercase block" style={{ marginBottom: '8px', fontWeight: 420 }}>Event Name</label>
                            <input
                                type="text" placeholder="e.g. Culminating Activity, Meeting" value={eventName}
                                onChange={(e) => setEventName(e.target.value)}
                                className="font-geist w-full bg-gray-50 rounded-lg text-sm border-none outline-none"
                                style={{ padding: '12px' }}
                            />
                        </div>

                        {/* Theme Colors */}
                        <div style={{ marginBottom: '24px' }}>
                            <label className="text-xs font-geist text-gray-500 uppercase block" style={{ marginBottom: '12px', fontWeight: 420 }}>Theme Color</label>
                            <div className="flex" style={{ gap: '12px' }}>
                                {EVENT_COLORS.map(c => (
                                    <div
                                        key={c.value} onClick={() => setSelectedColor(c.value)}
                                        style={{ width: 28, height: 28, background: c.value, borderRadius: '50%', cursor: 'pointer', border: selectedColor === c.value ? '2px solid #3b82f6' : '2px solid transparent' }}
                                    />
                                ))}
                            </div>
                        </div>

                        {/* Departments Chips */}
                        <div style={{ marginBottom: '24px' }}>
                            <label className="text-xs font-geist text-gray-500 uppercase block" style={{ marginBottom: '12px', fontWeight: 420 }}>Departments</label>
                            <div className="flex flex-wrap" style={{ gap: '8px' }}>
                                <span
                                    onClick={() => setSelectedDepartments(['All', ...availableDepartments])}
                                    className={`font-bold cursor-pointer transition-all ${selectedDepartments.includes('All') ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-600'}`}
                                    style={{ padding: '6px 12px', borderRadius: '20px', fontSize: '11px' }}
                                >
                                    ALL
                                </span>
                                {availableDepartments.map(d => (
                                    <span
                                        key={d} onClick={() => setSelectedDepartments(prev => prev.includes(d) ? prev.filter(x => x !== d) : [...prev, d])}
                                        className={`font-bold cursor-pointer transition-all ${selectedDepartments.includes(d) ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-600'}`}
                                        style={{ padding: '6px 12px', borderRadius: '20px', fontSize: '11px' }}
                                    >
                                        {formatDeptName(d)}
                                    </span>
                                ))}
                            </div>
                        </div>

                        {/* 🟢 FIXED SIZE SECTION LIST */}
                        <div>
                            <div className="flex justify-between items-center" style={{ marginBottom: '12px' }}>
                                <label className="text-xs font-bold text-gray-500 uppercase">Specific Sections (Optional)</label>
                                <div className="flex items-center" style={{ gap: '8px' }}>
                                    <Search size={14} className="text-gray-400" />
                                    <input
                                        value={searchQuery} onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1); }}
                                        placeholder="Search..." className="bg-transparent text-xs outline-none w-20 border-b border-gray-200"
                                        style={{ paddingBottom: '4px' }}
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-2" style={{ gap: '8px', marginBottom: '16px', minHeight: '230px' }}>
                                {programsToDisplay.map(p => {
                                    if (p.isEmpty) {
                                        return (
                                            <div key={p.id} style={{ padding: '8px', border: '1px dashed #f3f4f6', height: '34px', borderRadius: '6px' }} />
                                        );
                                    }
                                    const isSelected = selectedPrograms.find(x => x.id === p.id);
                                    return (
                                        <div
                                            key={p.id} onClick={() => setSelectedPrograms(prev => isSelected ? prev.filter(x => x.id !== p.id) : [...prev, p])}
                                            className={`rounded-md border text-[10px] font-bold cursor-pointer flex justify-between items-center transition-all ${isSelected ? 'border-blue-500 bg-blue-50 text-blue-700' : 'border-gray-100 text-gray-500 hover:border-gray-300'}`}
                                            style={{ padding: '8px', height: '34px' }}
                                        >
                                            <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{p.display}</span>
                                            {isSelected && <Check size={12} />}
                                        </div>
                                    );
                                })}
                            </div>

                            {totalPages > 1 && (
                                <div className="flex justify-center" style={{ gap: '16px' }}>
                                    <button disabled={currentPage === 1} onClick={() => setCurrentPage(p => p - 1)} className="disabled:opacity-30" style={{ border: 'none', background: 'transparent', padding: '4px', cursor: 'pointer' }}><ChevronLeft size={16} /></button>
                                    <span className="text-xs font-bold text-gray-400" style={{ display: 'flex', alignItems: 'center' }}>{currentPage} / {totalPages}</span>
                                    <button disabled={currentPage === totalPages} onClick={() => setCurrentPage(p => p + 1)} className="disabled:opacity-30" style={{ border: 'none', background: 'transparent', padding: '4px', cursor: 'pointer' }}><ChevronRight size={16} /></button>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Footer Submit */}
                    <div style={{ paddingTop: '24px', borderTop: '1px solid #e5e7eb', marginTop: 'auto' }}>
                        <button
                            disabled={isSubmitting || !eventName || !eventDate || selectedDepartments.length === 0}
                            onClick={handleCreateEvent}
                            className="w-full bg-[#4268BD] text-white rounded-xl font-bold text-sm shadow-lg shadow-blue-200 hover:bg-[#3556a0] transition-all disabled:grayscale disabled:opacity-50"
                            style={{ padding: '16px', border: 'none', cursor: 'pointer' }}
                        >
                            {isSubmitting ? 'CREATING EVENT...' : 'CREATE EVENT'}
                        </button>
                    </div>
                </div>
            </div>
        </>
    );
};