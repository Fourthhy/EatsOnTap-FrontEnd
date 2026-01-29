import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, X, ChevronDown, Check, Loader2, FileText, ListFilter, Users, School } from 'lucide-react';
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
        <div style={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'flex-start', justifyContent: 'center' }}>
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
        <div style={{ ...globalStyle, padding: "20px", borderRadius: "8px", boxShadow: "0 2px 4px rgba(0,0,0,0.1)", width: "100%", height: "100%" }} className="font-geist">
            <div style={{ marginBottom: "1rem", display: "flex", alignItems: "center", justifyContent: 'space-between' }}>
                <h1 style={{ color: "#232323", fontFamily: 'geist', fontSize: '0.90rem', fontWeight: 600 }}>Eligible Programs</h1>
            </div>

            {programCodes.length === 0 ? (
                <div className="flex justify-center items-center h-32">
                    <Loader2 className="animate-spin text-blue-500" size={24} />
                </div>
            ) : (
                <div style={{ display: "flex", flexWrap: "wrap", gap: "2rem" }} className="font-geist">
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

    // 🟢 VALIDATION FOR STEP 2
    const hasSelectedPrograms = useMemo(() => {
        return Object.values(checkedPrograms).some(isChecked => isChecked);
    }, [checkedPrograms]);

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

    const isNextDisabled = (step === 1 && !submissionType) || (step === 2 && !hasSelectedPrograms) || step === TOTAL_STEPS;

    // --- INTERNAL STEPS ---
    const Step1 = ({ submissionType, setSubmissionType }) => (
        <div className="w-full h-full flex flex-col items-center justify-center p-8 text-center min-h-[350px]">
            <div style={{ marginBottom: "10px" }} className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center">
                <span className="text-2xl font-bold text-blue-600 font-geist">1</span>
            </div>
            <h3 className="text-xl font-bold text-gray-800 font-geist">Submission Type</h3>
            <p style={{ marginBottom: "20px" }} className="text-gray-500 font-geist text-sm">Select the type of request you want to create.</p>

            <div style={{ padding: "20px" }} className="w-full max-w-sm mx-auto bg-white p-4 rounded-lg shadow-sm">
                <SubmissionTypeDropdown
                    selectedSubmissionType={submissionType}
                    setSelectedSubmissionType={setSubmissionType}
                />
            </div>

            <div
                className={`max-w-sm mx-auto rounded-lg shadow-sm w-[20%] transition-colors border border-gray-200 ${!submissionType ? 'bg-gray-100 cursor-not-allowed opacity-50' : 'bg-white cursor-pointer hover:bg-gray-50'}`}
                style={{ padding: "10px", marginTop: "20px" }}
                onClick={() => !submissionType ? null : paginate(1)}
            >
                <span className={`text-sm font-medium font-geist ${!submissionType ? 'text-gray-400' : 'text-gray-700'}`}>Next</span>
            </div>
        </div>
    );

    const Step2 = () => (
        <div className="w-full h-full flex flex-col items-center justify-start text-center min-h-[350px]" style={{ padding: "15px" }}>
            <div className="flex flex-col items-center mb-6">
                <div className="w-16 h-16 rounded-full flex items-center justify-center mb-4">
                    <span className="text-2xl font-bold text-blue-600 font-geist">2</span>
                </div>
                <h3 className="text-xl font-bold text-gray-800 font-geist">Program Selection</h3>
                <p className="text-gray-500 mt-1 font-geist text-sm">Select the programs eligible for this meal request.</p>
            </div>

            <div className="w-full max-w-2xl mx-auto flex-1 overflow-y-auto">
                <EligibleProgramsForm
                    checkedPrograms={checkedPrograms}
                    handleCheckboxChange={handleCheckboxChange}
                    toggleSelectAll={toggleSelectAll}
                    isAllSelected={isAllSelected}
                    programCodes={programCodes}
                />
            </div>

            <div
                className={`max-w-sm mx-auto rounded-lg shadow-sm w-[20%] transition-colors border border-gray-200 ${!hasSelectedPrograms ? 'bg-gray-100 cursor-not-allowed opacity-50' : 'bg-white cursor-pointer hover:bg-gray-50'}`}
                style={{ padding: "10px", marginTop: "20px" }}
                onClick={() => !hasSelectedPrograms ? null : paginate(1)}
            >
                <span className={`text-sm font-medium font-geist ${!hasSelectedPrograms ? 'text-gray-400' : 'text-gray-700'}`}>Next</span>
            </div>
        </div>
    );

    const Step3 = () => {
        const [isHover, setIsHover] = useState(false);

        const selectedList = Object.entries(checkedPrograms)
            .filter(([_, isChecked]) => isChecked)
            .map(([id]) => id);

        const typeLabel =
            submissionType === "mealEligibility"
                ? "Meal Eligibility Request"
                : "Event Meal Request";

        return (
            <div style={{ width: "100%", height: "100%", minHeight: "350px", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "flex-start", textAlign: "center", padding: "20px" }}>
                <div style={{ display: "flex", flexDirection: "column", alignItems: "center", marginBottom: "24px" }}>
                    <div style={{ width: "64px", height: "64px", backgroundColor: "#EFF6FF", borderRadius: "9999px", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: "16px" }}>
                        <span style={{ fontSize: "24px", fontWeight: "700", color: "#2563EB", fontFamily: "Geist, sans-serif" }}>3</span>
                    </div>

                    <h3 style={{ fontSize: "20px", fontWeight: "700", color: "#1F2933", fontFamily: "Geist, sans-serif" }}>Confirmation</h3>
                    <p style={{ color: "#6B7280", marginTop: "4px", fontSize: "14px", fontFamily: "Geist, sans-serif" }}>Review your selections before proceeding.</p>
                </div>

                <div style={{ width: "100%", maxWidth: "512px", margin: "0 auto", backgroundColor: "#F9FAFB", borderRadius: "12px", border: "1px solid #E5E7EB", padding: "24px", display: "flex", flexDirection: "column", gap: "16px", textAlign: "left", overflow: "hidden" }}>
                    <div style={{ borderBottom: "1px solid #E5E7EB", paddingBottom: "12px" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "4px" }}>
                            <FileText size={16} style={{ color: "#2563EB" }} />
                            <span style={{ fontSize: "12px", fontWeight: "700", textTransform: "uppercase", letterSpacing: "0.05em", color: "#6B7280", fontFamily: "Geist, sans-serif" }}>Request Type</span>
                        </div>
                        <p style={{ color: "#1F2933", fontWeight: "500", paddingLeft: "24px", fontFamily: "Geist, sans-serif" }}>{typeLabel}</p>
                    </div>

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

                <div
                    onMouseEnter={() => setIsHover(true)}
                    onMouseLeave={() => setIsHover(false)}
                    onClick={() => alert("Submitted!")}
                    style={{ maxWidth: "384px", margin: "20px auto 0", width: "30%", backgroundColor: isHover ? "#1D4ED8" : "#2563EB", color: "#FFFFFF", borderRadius: "8px", boxShadow: "0 4px 6px rgba(0,0,0,0.1)", padding: "12px", cursor: "pointer", transition: "background-color 0.2s ease", textAlign: "center" }}
                >
                    <span style={{ fontSize: "14px", fontWeight: "700", fontFamily: "Geist, sans-serif" }}>Confirm & Submit</span>
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
                    {/* Backdrop */}
                    <motion.div
                        className="absolute inset-0 bg-black/60 backdrop-blur-sm cursor-pointer"
                        onClick={handleClose}
                    />

                    {/* Main Content Wrapper */}
                    <div className="relative z-10 flex flex-col items-center gap-6 w-full h-full justify-center pointer-events-none p-4">

                        {/* Title Section (Animated Entry/Exit) */}
                        <motion.div
                            initial={{ y: -20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            exit={{ y: -20, opacity: 0, transition: { duration: 0.2 } }}

                            className="text-center pointer-events-auto flex-shrink-0"
                        >
                            <div className="flex items-center justify-center gap-2 mt-3" style={{ paddingTop: "50px" }}>
                                {Array.from({ length: TOTAL_STEPS }).map((_, i) => (
                                    <div key={i + 1} className={`h-2 rounded-full transition-all duration-300 shadow-sm ${step === i + 1 ? "w-8 bg-[#4268BD]" : (step > i + 1 ? "w-2 bg-blue-300/80" : "w-2 bg-white/30")}`} />
                                ))}
                                <span className="text-white/90 text-xs font-medium font-geist ml-3 uppercase tracking-widest">Step {step} / {TOTAL_STEPS}</span>
                            </div>
                        </motion.div>

                        <div className="flex items-center gap-4 md:gap-8 w-full justify-center flex-1 min-h-0">
                            {/* Prev Button */}
                            <motion.button
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20, transition: { duration: 0.2 } }}
                                onClick={() => paginate(-1)}
                                disabled={step === 1}
                                className={`pointer-events-auto p-4 rounded-full backdrop-blur-md transition-all duration-300 flex-shrink-0 ${step === 1 ? 'bg-white/5 text-white/20 cursor-not-allowed' : 'bg-white/10 text-white hover:bg-white/20 hover:scale-110 shadow-lg'}`}
                            >
                                <ChevronLeft size={32} />
                            </motion.button>



                            {/* Center Card (Animated Entry/Exit) */}
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
                                            {step === 1 && <Step1 submissionType={submissionType} setSubmissionType={setSubmissionType} />}
                                            {step === 2 && <Step2 />}
                                            {step === 3 && <Step3 />}
                                        </motion.div>
                                    </AnimatePresence>
                                </div>
                            </motion.div>

                            {/* Next Button */}
                            <motion.button
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: 20, transition: { duration: 0.2 } }}
                                onClick={() => paginate(1)}
                                disabled={isNextDisabled}
                                className={`pointer-events-auto p-4 rounded-full backdrop-blur-md transition-all duration-300 flex-shrink-0 ${isNextDisabled ? 'bg-white/5 text-white/20 cursor-not-allowed' : 'bg-white/10 text-white hover:bg-white/20 hover:scale-110 shadow-lg'}`}
                            >
                                <ChevronRight size={32} />
                            </motion.button>
                        </div>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};