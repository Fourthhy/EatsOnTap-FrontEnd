import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, X, ChevronDown, Check, Loader2, FileText, ListFilter, Calendar } from 'lucide-react';
import { fetchProgramCodes } from "../../../functions/adminAssistant/fetchProgramCodes";

// --- CUSTOM DROPDOWN COMPONENT ---
const CustomDropdown = ({ label, value, options, onChange }) => {
    const [isOpen, setIsOpen] = useState(false);
    const getLabel = (opt) => (typeof opt === 'object' ? opt.label : opt);
    const getValue = (opt) => (typeof opt === 'object' ? opt.value : opt);
    const selectedLabel = options.find(opt => getValue(opt) === value)?.label || value || "Select...";

    return (
        <div style={{ position: 'relative', width: '100%' }}>
            {label && (
                <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', color: '#374151', marginBottom: '4px', textAlign: 'left' }}>
                    {label}
                </label>
            )}
            <button
                type="button"
                onClick={() => setIsOpen(!isOpen)}
                style={{
                    width: '100%', padding: '10px 14px', fontSize: '0.875rem', textAlign: 'left',
                    backgroundColor: 'white', border: '1px solid #d1d5db', borderRadius: '6px',
                    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                    cursor: 'pointer', color: value ? '#1f2937' : '#9ca3af',
                    boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)', fontFamily: 'geist'
                }}
            >
                <span>{selectedLabel}</span>
                <ChevronDown size={16} className={`text-gray-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
            </button>

            <AnimatePresence>
                {isOpen && (
                    <>
                        <div style={{ position: 'fixed', inset: 0, zIndex: 9050 }} onClick={() => setIsOpen(false)} />
                        <motion.div
                            initial={{ opacity: 0, y: -5 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -5 }}
                            transition={{ duration: 0.15 }}
                            style={{
                                position: 'absolute', top: '100%', left: 0, right: 0, marginTop: '4px',
                                backgroundColor: 'white', borderRadius: '6px',
                                boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1), 0 2px 4px -1px rgba(0,0,0,0.06)',
                                border: '1px solid #f3f4f6', zIndex: 9051, maxHeight: '200px', overflowY: 'auto'
                            }}
                        >
                            {options.map((opt) => {
                                const optLabel = getLabel(opt);
                                const optValue = getValue(opt);
                                const isSelected = value === optValue;
                                return (
                                    <button
                                        key={optValue}
                                        type="button"
                                        onClick={() => { onChange(optValue); setIsOpen(false); }}
                                        style={{
                                            width: '100%', padding: '10px 14px', fontSize: '0.875rem', textAlign: 'left',
                                            backgroundColor: 'transparent', border: 'none', cursor: 'pointer',
                                            display: 'flex', alignItems: 'center', gap: '8px', color: '#374151',
                                            borderBottom: '1px solid #f9fafb', fontFamily: 'geist'
                                        }}
                                        onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f9fafb'}
                                        onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                                    >
                                        {isSelected && <Check size={14} className="text-blue-600" />}
                                        <span style={{ marginLeft: isSelected ? 0 : '22px' }}>{optLabel}</span>
                                    </button>
                                );
                            })}
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </div>
    );
};

// --- SUBMISSION TYPE DROPDOWN ---
function SubmissionTypeDropdown({ selectedSubmissionType, setSelectedSubmissionType }) {
    const options = [
        { label: 'Meal Eligibility Request', value: 'mealEligibility' },
        { label: 'Event Meal Request', value: 'eventMeal' },
    ];

    return (
        <div style={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'flex-start', justifyContent: 'center', padding: "7px" }}>
            <h1 style={{ fontFamily: 'geist', fontSize: '0.90rem', fontWeight: 400, paddingBottom: 10, color: '#374151' }}>
                Submission Type
            </h1>
            <div className="font-geist" style={{ width: '100%' }}>
                <CustomDropdown
                    value={selectedSubmissionType}
                    options={options}
                    onChange={setSelectedSubmissionType}
                />
            </div>
        </div>
    );
}

// --- STEP 1 ---
const Step1 = ({
    submissionType,
    setSubmissionType,
    selectedDays,
    setSelectedDays,
    startDate,
    setStartDate,
    endDate,
    setEndDate,
    isStep1Valid,
    paginate
}) => {
    const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

    const toggleDay = (day) => {
        if (selectedDays.includes(day)) {
            setSelectedDays(selectedDays.filter(d => d !== day));
        } else {
            setSelectedDays([...selectedDays, day]);
        }
    };

    return (
        <div className="w-full h-full flex flex-col items-center justify-center p-8 text-center min-h-[630px]">
            {/* Header Circle */}
            <div style={{ marginBottom: "10px" }} className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center">
                <span className="text-2xl font-bold text-blue-600 font-geist">1</span>
            </div>

            <h3 className="text-xl font-bold text-gray-800 font-geist">Configuration</h3>
            <p style={{ marginBottom: "20px" }} className="text-gray-500 font-geist text-sm">
                Select request type and schedule.
            </p>

            <div className="w-full max-w-md mx-auto flex flex-col gap-6">

                {/* 1. Submission Type Dropdown */}
                <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
                    <SubmissionTypeDropdown
                        selectedSubmissionType={submissionType}
                        setSelectedSubmissionType={setSubmissionType}
                    />
                </div>

                {/* 2. DYNAMIC CONTENT AREA */}
                <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100 animate-in fade-in slide-in-from-top-2 duration-300" style={{ padding: "15px" }}>

                    {submissionType === 'mealEligibility' ? (
                        // --- MEAL ELIGIBILITY: DAY GRID ---
                        <>
                            <div style={{ marginBottom: '8px', textAlign: 'left' }}>
                                <label style={{ fontSize: '0.875rem', fontWeight: '500', color: '#374151', fontFamily: 'geist' }}>
                                    Select Days
                                </label>
                            </div>
                            <div className="grid grid-cols-3 gap-3">
                                {daysOfWeek.map((day, idx) => {
                                    const isSelected = selectedDays.includes(day);
                                    return (
                                        <div
                                            key={idx}
                                            onClick={() => toggleDay(day)}
                                            className={`flex items-center p-2 rounded-md cursor-pointer border transition-all duration-200
                                            ${isSelected
                                                    ? 'bg-blue-50 border-blue-200 shadow-sm'
                                                    : 'bg-white border-gray-100 hover:border-gray-300 hover:bg-gray-50'
                                                }`}
                                            style={{ height: '40px' }}
                                        >
                                            <div className="flex items-center justify-center w-8 shrink-0 mr-2">
                                                <input
                                                    type="checkbox"
                                                    className="accent-blue-600 w-4 h-4 cursor-pointer"
                                                    checked={isSelected}
                                                    readOnly
                                                />
                                            </div>
                                            <span
                                                className="truncate"
                                                style={{
                                                    fontWeight: 500, fontSize: 12, fontFamily: "geist",
                                                    color: isSelected ? '#1e40af' : '#111827'
                                                }}
                                                title={day}
                                            >
                                                {day}
                                            </span>
                                        </div>
                                    );
                                })}
                            </div>
                        </>
                    ) : (
                        // --- EVENT MEAL: DATE RANGE PICKER ---
                        <div
                            style={{
                                display: "flex",
                                flexDirection: "column",
                                gap: "16px", // gap-4
                                textAlign: "left",
                            }}
                        >
                            {/* Start Date */}
                            <div
                                style={{
                                    display: "flex",
                                    flexDirection: "column",
                                    gap: "4px", // gap-1
                                }}
                            >
                                <label
                                    style={{
                                        fontSize: "0.875rem",
                                        fontWeight: 500,
                                        color: "#374151", // gray-700
                                        fontFamily: "Geist, sans-serif",
                                    }}
                                >
                                    Start Date
                                </label>

                                <div style={{ position: "relative" }}>
                                    <Calendar
                                        size={16}
                                        style={{
                                            position: "absolute",
                                            left: "12px", // left-3
                                            top: "50%",
                                            transform: "translateY(-50%)",
                                            color: "#9CA3AF", // gray-400
                                            pointerEvents: "none",
                                        }}
                                    />

                                    <input
                                        type="date"
                                        value={startDate}
                                        onChange={(e) => setStartDate(e.target.value)}
                                        style={{
                                            width: "100%",
                                            paddingLeft: "40px", // pl-10
                                            paddingRight: "12px", // pr-3
                                            paddingTop: "8px", // py-2
                                            paddingBottom: "8px",
                                            border: "1px solid #D1D5DB", // gray-300
                                            borderRadius: "6px", // rounded-md
                                            outline: "none",
                                            fontSize: "14px", // text-sm
                                            fontFamily: "Geist, sans-serif",
                                            color: "#374151", // gray-700
                                        }}
                                        onFocus={(e) => {
                                            e.target.style.border = "2px solid #3B82F6"; // blue-500
                                        }}
                                        onBlur={(e) => {
                                            e.target.style.border = "1px solid #D1D5DB";
                                        }}
                                    />
                                </div>
                            </div>

                            {/* End Date */}
                            <div
                                style={{
                                    display: "flex",
                                    flexDirection: "column",
                                    gap: "4px",
                                }}
                            >
                                <label
                                    style={{
                                        fontSize: "0.875rem",
                                        fontWeight: 500,
                                        color: "#374151",
                                        fontFamily: "Geist, sans-serif",
                                    }}
                                >
                                    End Date{" "}
                                    <span
                                        style={{
                                            color: "#9CA3AF", // gray-400
                                            fontWeight: 400,
                                        }}
                                    >
                                        (Optional)
                                    </span>
                                </label>

                                <div style={{ position: "relative" }}>
                                    <Calendar
                                        size={16}
                                        style={{
                                            position: "absolute",
                                            left: "12px",
                                            top: "50%",
                                            transform: "translateY(-50%)",
                                            color: "#9CA3AF",
                                            pointerEvents: "none",
                                        }}
                                    />

                                    <input
                                        type="date"
                                        value={endDate}
                                        onChange={(e) => setEndDate(e.target.value)}
                                        min={startDate}
                                        style={{
                                            width: "100%",
                                            paddingLeft: "40px",
                                            paddingRight: "12px",
                                            paddingTop: "8px",
                                            paddingBottom: "8px",
                                            border: "1px solid #D1D5DB",
                                            borderRadius: "6px",
                                            outline: "none",
                                            fontSize: "14px",
                                            fontFamily: "Geist, sans-serif",
                                            color: "#374151",
                                        }}
                                        onFocus={(e) => {
                                            e.target.style.border = "2px solid #3B82F6";
                                        }}
                                        onBlur={(e) => {
                                            e.target.style.border = "1px solid #D1D5DB";
                                        }}
                                    />
                                </div>
                            </div>

                            {/* Info Box */}
                            <div
                                style={{
                                    backgroundColor: "#EFF6FF", // blue-50
                                    border: "1px solid #DBEAFE", // blue-100
                                    borderRadius: "6px",
                                    padding: "12px", // p-3
                                }}
                            >
                                <p
                                    style={{
                                        fontSize: "12px", // text-xs
                                        color: "#1D4ED8", // blue-700
                                        fontFamily: "Geist, sans-serif",
                                        lineHeight: "1.6", // leading-relaxed
                                    }}
                                >
                                    Leaving the end date blank implies the event is only for the start date.
                                </p>
                            </div>
                        </div>

                    )}
                </div>
            </div>

            {/* Next Button Only (Step 1 has no previous) */}
            <div
                className={`max-w-sm mx-auto rounded-lg shadow-sm w-[20%] transition-colors border border-gray-200 
                ${!isStep1Valid() ? 'bg-gray-100 cursor-not-allowed opacity-50' : 'bg-white cursor-pointer hover:bg-gray-50'}`}
                style={{ padding: "10px", marginTop: "30px" }}
                onClick={() => !isStep1Valid() ? null : paginate(1)}
            >
                <span className={`text-sm font-medium font-geist ${!isStep1Valid() ? 'text-gray-400' : 'text-gray-700'}`}>
                    Next
                </span>
            </div>
        </div>
    );
};

// --- ELIGIBLE PROGRAMS FORM ---
const EligibleProgramsForm = ({ checkedPrograms, handleCheckboxChange, toggleSelectAll, isAllSelected, programCodes }) => {
    const programs = ["BSSW", "BSA", "BSAIS", "BAB", "BSIS", "ACT"];
    const years = [1, 2, 3, 4];

    const globalStyle = { fontSize: "0.75rem", fontWeight: 400 };

    const renderCheckbox = (programCode, year) => {
        const programId = `${programCode} - ${year}`;
        if (!programCodes.includes(programId)) return null;
        const isChecked = !!checkedPrograms[programId];

        return (
            <div key={programId} style={{ ...globalStyle, marginRight: "1.5rem", marginBottom: "0.5rem", display: "flex", alignItems: "center" }}>
                <input
                    type="checkbox"
                    id={programId}
                    checked={isChecked}
                    onChange={() => handleCheckboxChange(programId)}
                    style={{ marginRight: "0.5rem", width: "18px", height: "18px", accentColor: isChecked ? "#1976D2" : "inherit", cursor: "pointer" }}
                />
                <label htmlFor={programId} style={{ ...globalStyle, cursor: 'pointer' }}>{programId}</label>
            </div>
        );
    };

    return (
        <div style={{ ...globalStyle, padding: "20px", borderRadius: "8px", width: "100%", height: "100%" }} className="font-geist">
            <div style={{ marginBottom: "1rem", display: "flex", alignItems: "center", justifyContent: 'space-between' }}>
                <h1 style={{ color: "#232323", fontFamily: 'geist', fontSize: '0.90rem', fontWeight: 600 }}>Eligible Programs</h1>
            </div>

            {programCodes.length === 0 ? (
                <div className="flex justify-center items-center h-32">
                    <Loader2 className="animate-spin text-blue-500" size={24} />
                </div>
            ) : (
                <div style={{ display: "flex", flexWrap: "wrap", gap: "2rem", }} className="font-geist">
                    {programs.map((program) => (
                        <div key={program} style={{ display: "flex", flexDirection: "column" }}>
                            {years.map((year) => renderCheckbox(program, year))}
                        </div>
                    ))}
                    <div className="flex items-center">
                        <input
                            type="checkbox"
                            id="selectAll"
                            checked={isAllSelected}
                            onChange={toggleSelectAll}
                            disabled={programCodes.length === 0}
                            style={{ marginRight: "0.5rem", width: "18px", height: "18px", cursor: "pointer", accentColor: isAllSelected ? "#1976D2" : "inherit" }}
                        />
                        <label htmlFor="selectAll" style={{ ...globalStyle, fontWeight: 700, cursor: 'pointer' }} className="font-geist">Select All</label>
                    </div>
                </div>
            )}
        </div>
    );
};

// --- MAIN COMPONENT ---
export const MealSchedulingManagement = ({ isOpen, isClose }) => {
    const [isVisible, setIsVisible] = useState(isOpen);
    const [step, setStep] = useState(1);
    const [direction, setDirection] = useState(0);
    const TOTAL_STEPS = 3;

    // --- DATA STATE ---
    const [submissionType, setSubmissionType] = useState('mealEligibility');
    const [selectedDays, setSelectedDays] = useState([]);
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");

    const [checkedPrograms, setCheckedPrograms] = useState({});
    const [programCodes, setProgramCodes] = useState([]);

    // --- FETCH DATA ---
    useEffect(() => {
        const fetchCodes = async () => {
            try {
                const codes = await fetchProgramCodes();
                if (Array.isArray(codes)) {
                    setProgramCodes(codes);
                } else {
                    console.warn("fetchProgramCodes did not return an array", codes);
                    setProgramCodes([]);
                }
            } catch (error) {
                console.error("Failed to fetch program codes:", error);
                setProgramCodes([]);
            }
        };

        if (isOpen) {
            fetchCodes();
        }
    }, [isOpen]);

    // --- DATA HANDLERS ---
    const handleCheckboxChange = (programId) => {
        setCheckedPrograms((prev) => ({
            ...prev,
            [programId]: !prev[programId],
        }));
    };

    const isAllSelected = useMemo(() => {
        if (programCodes.length === 0) return false;
        return programCodes.every((code) => checkedPrograms[code]);
    }, [checkedPrograms, programCodes]);

    const toggleSelectAll = () => {
        if (isAllSelected) {
            setCheckedPrograms({});
        } else {
            const allChecked = {};
            programCodes.forEach((code) => { allChecked[code] = true; });
            setCheckedPrograms(allChecked);
        }
    };

    // Validation
    const hasSelectedPrograms = useMemo(() => {
        return Object.values(checkedPrograms).some(isChecked => isChecked);
    }, [checkedPrograms]);

    const isStep1Valid = () => {
        if (!submissionType) return false;
        if (submissionType === 'mealEligibility') {
            return selectedDays.length > 0;
        } else {
            return startDate !== "";
        }
    };

    const isNextDisabled = (step === 1 && !isStep1Valid()) || (step === 2 && !hasSelectedPrograms) || step === TOTAL_STEPS;

    // --- VISIBILITY & NAV ---
    useEffect(() => {
        setIsVisible(isOpen);
        if (isOpen) {
            setStep(1);
            setDirection(0);
        }
    }, [isOpen]);

    const handleClose = () => {
        isClose();
        setIsVisible(false);
    }

    useEffect(() => {
        const handleKeyDown = (e) => {
            if (isVisible && e.key === 'Escape') handleClose();
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [isVisible]);

    const paginate = (newDirection) => {
        const nextStep = step + newDirection;
        if (nextStep > 0 && nextStep <= TOTAL_STEPS) {
            setDirection(newDirection);
            setStep(nextStep);
        }
    };

    const Step2 = () => (
        <div className="w-full h-full flex flex-col items-center justify-evenly text-center min-h-[650px]">

            <div className="flex flex-col items-center mb-6">
                <div className="w-16 h-16 rounded-full flex items-center justify-center mb-4">
                    <span className="text-2xl font-bold text-blue-600 font-geist">2</span>
                </div>
                <h3 className="text-xl font-bold text-gray-800 font-geist">Program Selection</h3>
                <p className="text-gray-500 mt-1 font-geist text-sm">Select the programs eligible for this meal request.</p>
            </div>

            <div className="w-[90%] max-w-2xl mx-auto overflow-y-auto flex flex-col justify-center">
                <EligibleProgramsForm
                    checkedPrograms={checkedPrograms}
                    handleCheckboxChange={handleCheckboxChange}
                    toggleSelectAll={toggleSelectAll}
                    isAllSelected={isAllSelected}
                    programCodes={programCodes}
                />
            </div>

            {/* 🟢 STEP 2 NAVIGATION: PREVIOUS + NEXT */}
            <div className="flex gap-4 w-full max-w-sm mx-auto mt-5">
                {/* PREVIOUS BUTTON */}
                <div
                    className="flex-1 rounded-lg shadow-sm transition-colors border border-gray-200 bg-white cursor-pointer hover:bg-gray-50"
                    style={{ padding: "10px" }}
                    onClick={() => paginate(-1)}
                >
                    <span className="text-sm font-medium font-geist text-gray-700">Previous</span>
                </div>

                {/* NEXT BUTTON */}
                <div
                    className={`flex-1 rounded-lg shadow-sm transition-colors border border-gray-200 ${!hasSelectedPrograms ? 'bg-gray-100 cursor-not-allowed opacity-50' : 'bg-white cursor-pointer hover:bg-gray-50'}`}
                    style={{ padding: "10px" }}
                    onClick={() => !hasSelectedPrograms ? null : paginate(1)}
                >
                    <span className={`text-sm font-medium font-geist ${!hasSelectedPrograms ? 'text-gray-400' : 'text-gray-700'}`}>Next</span>
                </div>
            </div>
        </div>
    );

    const Step3 = () => {
        const [isHover, setIsHover] = useState(false);

        const selectedList = Object.entries(checkedPrograms)
            .filter(([_, isChecked]) => isChecked)
            .map(([id]) => id);

        const typeLabel = submissionType === "mealEligibility"
            ? "Meal Eligibility Request"
            : "Event Meal Request";

        return (
            <div style={{ width: "100%", height: "100%", minHeight: "650px", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", textAlign: "center", padding: "20px" }}>
                <div style={{ display: "flex", flexDirection: "column", alignItems: "center", marginBottom: "24px" }}>
                    <div style={{ width: "64px", height: "64px", backgroundColor: "#EFF6FF", borderRadius: "9999px", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: "16px" }}>
                        <span style={{ fontSize: "24px", fontWeight: "700", color: "#2563EB", fontFamily: "Geist, sans-serif" }}>3</span>
                    </div>

                    <h3 style={{ fontSize: "20px", fontWeight: "700", color: "#1F2933", fontFamily: "Geist, sans-serif" }}>Confirmation</h3>
                    <p style={{ color: "#6B7280", marginTop: "4px", fontSize: "14px", fontFamily: "Geist, sans-serif" }}>Review your selections before proceeding.</p>
                </div>

                <div style={{ width: "100%", maxWidth: "512px", margin: "0 auto", backgroundColor: "#F9FAFB", borderRadius: "12px", border: "1px solid #E5E7EB", padding: "24px", display: "flex", flexDirection: "column", gap: "16px", textAlign: "left", overflow: "hidden" }}>
                    {/* Submission Type */}
                    <div style={{ borderBottom: "1px solid #E5E7EB", paddingBottom: "12px" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "4px" }}>
                            <FileText size={16} style={{ color: "#2563EB" }} />
                            <span style={{ fontSize: "12px", fontWeight: "700", textTransform: "uppercase", letterSpacing: "0.05em", color: "#6B7280", fontFamily: "Geist, sans-serif" }}>Request Type</span>
                        </div>
                        <p style={{ color: "#1F2933", fontWeight: "500", paddingLeft: "24px", fontFamily: "Geist, sans-serif" }}>{typeLabel}</p>
                    </div>

                    {/* Schedule / Date Info */}
                    <div style={{ borderBottom: "1px solid #E5E7EB", paddingBottom: "12px" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "4px" }}>
                            <Calendar size={16} style={{ color: "#2563EB" }} />
                            <span style={{ fontSize: "12px", fontWeight: "700", textTransform: "uppercase", letterSpacing: "0.05em", color: "#6B7280", fontFamily: "Geist, sans-serif" }}>Schedule</span>
                        </div>
                        <div style={{ paddingLeft: "24px", fontFamily: "Geist, sans-serif", fontSize: "14px", color: "#374151" }}>
                            {submissionType === 'mealEligibility' ? (
                                selectedDays.length > 0 ? selectedDays.join(", ") : "No days selected"
                            ) : (
                                <span>
                                    {startDate} {endDate ? ` to ${endDate}` : "(Single Day)"}
                                </span>
                            )}
                        </div>
                    </div>

                    {/* Selected Programs */}
                    <div style={{ flex: 1, overflowY: "auto", minHeight: 0 }}>
                        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "8px" }}>
                            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                                <ListFilter size={16} style={{ color: "#2563EB" }} />
                                <span style={{ fontSize: "12px", fontWeight: "700", textTransform: "uppercase", letterSpacing: "0.05em", color: "#6B7280", fontFamily: "Geist, sans-serif" }}>Selected Programs</span>
                            </div>
                            <span style={{ backgroundColor: "#DBEAFE", color: "#1D4ED8", fontSize: "12px", fontWeight: "700", padding: "4px 8px", borderRadius: "9999px" }}>{selectedList.length}</span>
                        </div>

                        <div style={{ paddingLeft: "24px", display: "flex", flexWrap: "wrap", gap: "8px" }}>
                            {selectedList.length > 0 ? (
                                selectedList.map((program) => (
                                    <span key={program} style={{ backgroundColor: "#FFFFFF", border: "1px solid #E5E7EB", color: "#374151", fontSize: "12px", padding: "4px 12px", borderRadius: "6px", boxShadow: "0 1px 2px rgba(0,0,0,0.05)", fontFamily: "Geist, sans-serif" }}>
                                        {program}
                                    </span>
                                ))
                            ) : (
                                <p style={{ color: "#EF4444", fontSize: "14px", fontStyle: "italic" }}>No programs selected.</p>
                            )}
                        </div>
                    </div>
                </div>

                {/* 🟢 STEP 3 NAVIGATION: PREVIOUS + SUBMIT */}
                <div className="flex gap-4 w-full max-w-sm mx-auto mt-5 justify-center" style={{ marginTop: 15 }}>
                    {/* PREVIOUS BUTTON */}
                    <div
                        className="rounded-lg shadow-sm transition-colors border border-gray-200 bg-white cursor-pointer hover:bg-gray-50 flex-1 text-center"
                        style={{ padding: "12px" }}
                        onClick={() => paginate(-1)}
                    >
                        <span className="text-sm font-medium font-geist text-gray-700">Previous</span>
                    </div>

                    {/* SUBMIT BUTTON */}
                    <div
                        onMouseEnter={() => setIsHover(true)}
                        onMouseLeave={() => setIsHover(false)}
                        onClick={() => alert("Submitted!")}
                        style={{ flex: 1, backgroundColor: isHover ? "#1D4ED8" : "#2563EB", color: "#FFFFFF", borderRadius: "8px", boxShadow: "0 4px 6px rgba(0,0,0,0.1)", padding: "12px", cursor: "pointer", transition: "background-color 0.2s ease" }}
                    >
                        <span style={{ fontSize: "14px", fontWeight: "700", fontFamily: "Geist, sans-serif" }}>Confirm & Submit</span>
                    </div>
                </div>
            </div>
        );
    };

    const slideVariants = {
        enter: (direction) => ({ x: direction > 0 ? '100%' : '-100%', opacity: 0, scale: 0.95, position: 'absolute' }),
        center: { zIndex: 1, x: 0, opacity: 1, scale: 1, position: 'relative', transition: { x: { type: "spring", stiffness: 300, damping: 30 }, opacity: { duration: 0.2 } } },
        exit: (direction) => ({ zIndex: 0, x: direction < 0 ? '100%' : '-100%', opacity: 0, scale: 0.95, position: 'absolute', transition: { x: { type: "spring", stiffness: 300, damping: 30 }, opacity: { duration: 0.2 } } })
    };

    return (
        <AnimatePresence>
            {isVisible && (
                <motion.div
                    className="fixed inset-0 flex items-center justify-center overflow-hidden"
                    style={{ zIndex: 9500 }}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0, transition: { duration: 0.2, ease: "easeInOut" } }}
                >
                    <motion.div
                        className="absolute inset-0 bg-black/60 backdrop-blur-sm cursor-pointer"
                        onClick={handleClose}
                    />

                    <div className="relative z-10 flex flex-col items-center gap-6 w-full h-full justify-center pointer-events-none p-4">
                        <div className="flex items-center gap-4 md:gap-8 w-full justify-center flex-1 min-h-0">
                            {/* 🟢 REMOVED SIDE BUTTONS (< AND >) */}

                            <motion.div
                                onClick={(e) => e.stopPropagation()}
                                initial={{ scale: 0.95, opacity: 0, y: 20 }}
                                animate={{ scale: 1, opacity: 1, y: 0 }}
                                exit={{ scale: 0.95, opacity: 0, y: 20, transition: { duration: 0.2 } }}
                                className="pointer-events-auto relative bg-white rounded-2xl shadow-2xl overflow-hidden flex flex-col transition-all duration-300 ease-in-out"
                                style={{ minWidth: '600px', minHeight: '450px', width: 'auto', height: 'auto', maxWidth: '98%', maxHeight: '95vh' }}
                            >
                                <button onClick={handleClose} className="absolute top-4 right-4 z-50 text-gray-300 hover:text-gray-500 transition-colors p-1"><X size={20} /></button>

                                <div className="flex-1 relative flex items-center justify-center overflow-hidden">
                                    <AnimatePresence initial={false} custom={direction} mode="popLayout">
                                        <motion.div key={step} custom={direction} variants={slideVariants} initial="enter" animate="center" exit="exit" className="w-full h-full flex flex-col">
                                            {/* 🟢 STEP 1 PROPS */}
                                            {step === 1 && (
                                                <Step1
                                                    submissionType={submissionType}
                                                    setSubmissionType={setSubmissionType}
                                                    selectedDays={selectedDays}
                                                    setSelectedDays={setSelectedDays}
                                                    startDate={startDate}
                                                    setStartDate={setStartDate}
                                                    endDate={endDate}
                                                    setEndDate={setEndDate}
                                                    isStep1Valid={isStep1Valid}
                                                    paginate={paginate}
                                                />
                                            )}
                                            {step === 2 && <Step2 />}
                                            {step === 3 && <Step3 />}
                                        </motion.div>
                                    </AnimatePresence>
                                </div>
                            </motion.div>
                        </div>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};