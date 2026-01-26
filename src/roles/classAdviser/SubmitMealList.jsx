import React, { useState, useEffect, useMemo, useRef } from 'react';
import { useParams } from "react-router-dom";
import { Check, Lock, ChevronDown, ChevronUp } from "lucide-react"; 
import { useBreakpoint } from "use-breakpoint";

// 🟢 IMPORT THE NEW MODAL
import { ConfirmModal } from "./components/ConfirmModal";

// 🟢 CONTEXTS
import { useData } from "../../context/DataContext";
import { useClassAdviser } from "../../context/ClassAdviserContext";

// 🟢 FUNCTIONS
import { SubmitStudentMealList } from "../../functions/classAdviser/SubmitStudentMealList";
import { isStudentMealSubmitted } from "../../functions/classAdviser/isStudentMealSubmitted";
import { isSettingActive } from '../../functions/isSettingActive';

// 🟢 COMPONENTS
import { HeaderBar } from "../../components/global/HeaderBar";
import { GenericTable } from "../../components/global/table/GenericTable";

// 🟢 Define Breakpoints
const BREAKPOINTS = {
    mobile: 0,
    tablet: 768,
    desktop: 1024,
    wide: 1440
};

// --- 🟢 STATUS BADGE (STATIC - Uses Dot) ---
const StatusBadge = ({ type }) => {
    const styles = {
        Eligible: { backgroundColor: '#d1fae5', color: '#047857', dotColor: '#10b981', text: 'Eligible' },
        Waived: { backgroundColor: '#ffedd5', color: '#c2410c', dotColor: '#f97316', text: 'Waived' },
        Absent: { backgroundColor: '#f3f4f6', color: '#4b5563', dotColor: '#9ca3af', text: 'Absent' }
    };
    
    const currentStyle = styles[type] || styles.Waived;

    return (
        <span
            style={{
                padding: '4px 16px', borderRadius: '12px', display: 'inline-flex', alignItems: 'center',
                gap: '6px', backgroundColor: currentStyle.backgroundColor, color: currentStyle.color,
                width: 'fit-content', fontSize: '12px', fontWeight: 500, fontFamily: 'geist, sans-serif'
            }}
        >
            <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: currentStyle.dotColor }}></span>
            <span>{currentStyle.text}</span>
        </span>
    );
};

// --- 🟢 STATUS DROPDOWN (INTERACTIVE - Uses Chevron) ---
const StatusDropdown = ({ currentStatus, onChange, disabled }) => {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef(null);

    // Styles Map
    const styles = {
        Waived: { backgroundColor: '#ffedd5', color: '#c2410c' },
        Absent: { backgroundColor: '#f3f4f6', color: '#4b5563' }
    };
    const activeStyle = styles[currentStatus] || styles.Waived;

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const handleSelect = (status) => {
        onChange(status);
        setIsOpen(false);
    };

    if (disabled) {
        return <StatusBadge type={currentStatus} />;
    }

    return (
        <div 
            ref={dropdownRef}
            style={{ position: 'relative', display: 'inline-block' }} 
            onClick={(e) => e.stopPropagation()} 
        >
            {/* 1. THE TRIGGER */}
            <div 
                onClick={() => setIsOpen(!isOpen)}
                style={{ 
                    cursor: 'pointer', 
                    padding: '4px 12px', 
                    borderRadius: '12px', 
                    display: 'inline-flex', 
                    alignItems: 'center',
                    gap: '6px', 
                    backgroundColor: activeStyle.backgroundColor, 
                    color: activeStyle.color,
                    width: 'fit-content', 
                    fontSize: '12px', 
                    fontWeight: 500, 
                    fontFamily: 'geist, sans-serif',
                    transition: 'all 0.2s',
                    userSelect: 'none'
                }}
            >
                {isOpen ? <ChevronUp size={14} strokeWidth={2.5} /> : <ChevronDown size={14} strokeWidth={2.5} />}
                <span>{currentStatus}</span>
            </div>

            {/* 2. THE MENU */}
            {isOpen && (
                <div style={{
                    position: 'absolute',
                    top: '120%', right: 0, zIndex: 50,
                    minWidth: '120px',
                    backgroundColor: 'white',
                    borderRadius: '12px',
                    boxShadow: '0 4px 20px rgba(0,0,0,0.1), 0 2px 8px rgba(0,0,0,0.05)',
                    padding: '4px',
                    border: '1px solid #f3f4f6',
                    animation: 'fadeIn 0.1s ease-out'
                }}>
                    {/* Option: Waived */}
                    <div 
                        onClick={() => handleSelect('Waived')}
                        style={{
                            padding: '8px 12px', borderRadius: '8px', cursor: 'pointer',
                            fontSize: '12px', fontWeight: 500, color: '#c2410c',
                            backgroundColor: currentStatus === 'Waived' ? '#fff7ed' : 'transparent',
                            display: 'flex', alignItems: 'center', gap: '8px',
                            transition: 'background-color 0.1s'
                        }}
                        onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#fff7ed'}
                        onMouseLeave={(e) => e.currentTarget.style.backgroundColor = currentStatus === 'Waived' ? '#fff7ed' : 'transparent'}
                    >
                        <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#f97316' }}></span>
                        Waived
                    </div>

                    {/* Option: Absent */}
                    <div 
                        onClick={() => handleSelect('Absent')}
                        style={{
                            padding: '8px 12px', borderRadius: '8px', cursor: 'pointer',
                            fontSize: '12px', fontWeight: 500, color: '#4b5563',
                            backgroundColor: currentStatus === 'Absent' ? '#f3f4f6' : 'transparent',
                            display: 'flex', alignItems: 'center', gap: '8px',
                            marginTop: '2px', transition: 'background-color 0.1s'
                        }}
                        onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f3f4f6'}
                        onMouseLeave={(e) => e.currentTarget.style.backgroundColor = currentStatus === 'Absent' ? '#f3f4f6' : 'transparent'}
                    >
                        <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#9ca3af' }}></span>
                        Absent
                    </div>
                </div>
            )}
            <style>{`@keyframes fadeIn { from { opacity: 0; transform: translateY(-5px); } to { opacity: 1; transform: translateY(0); } }`}</style>
        </div>
    );
};

export default function SubmitMealList() {
    const { breakpoint } = useBreakpoint(BREAKPOINTS, 'desktop');
    const isMobile = breakpoint === 'mobile';
    const isTablet = breakpoint === 'tablet';

    const { section, userID } = useParams();
    const { schoolData } = useData();

    const [selected, setSelected] = useState([]); // Tracks "Eligible" IDs
    const [exceptions, setExceptions] = useState({}); // Tracks "Absent" IDs
    
    const [searchTerm, setSearchTerm] = useState("");
    const [loading, setLoading] = useState(true);
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [settingActive, setSettingActive] = useState(false);

    const selectionInitialized = useRef(false);

    // --- FETCH STUDENTS LOGIC ---
    const students = useMemo(() => {
        if (!schoolData || schoolData.length === 0) return [];
        let foundStudents = [];
        schoolData.forEach(cat => {
            if (cat.levels) cat.levels.forEach(lvl => {
                if (lvl.sections) lvl.sections.forEach(sec => {
                    if (sec.section === section) foundStudents = sec.students || [];
                });
            });
        });

        let filtered = foundStudents;
        if (searchTerm) {
            const lower = searchTerm.toLowerCase();
            filtered = foundStudents.filter(s =>
                s.name.toLowerCase().includes(lower) ||
                s.studentId.toLowerCase().includes(lower)
            );
        }

        return filtered.sort((a, b) => a.name.localeCompare(b.name));
    }, [schoolData, section, searchTerm]);

    // --- CHECK STATUS ON LOAD ---
    useEffect(() => {
        let isMounted = true;
        setLoading(true);

        Promise.all([
            isStudentMealSubmitted(section).catch(err => { console.error(err); return false; }),
            isSettingActive("SUBMIT-MEAL-REQUEST").catch(err => { console.error(err); return false; })
        ])
            .then(([submittedStatus, activeStatus]) => {
                if (isMounted) {
                    setIsSubmitted(submittedStatus);
                    setSettingActive(activeStatus);
                }
            })
            .finally(() => {
                if (isMounted) setLoading(false);
            });

        return () => { isMounted = false; };
    }, [section]);

    // --- AUTO-SELECT ALL LOGIC ---
    useEffect(() => {
        if (!loading && students.length > 0 && !selectionInitialized.current) {
            if (!isSubmitted && settingActive) {
                const allIds = students.map(s => s.studentId);
                setSelected(allIds);
            }
            selectionInitialized.current = true;
        }
    }, [loading, students, isSubmitted, settingActive]);

    // --- HANDLE EXCEPTION CHANGE ---
    const handleExceptionChange = (studentId, newStatus) => {
        setExceptions(prev => {
            const next = { ...prev };
            if (newStatus === 'Absent') {
                next[studentId] = 'Absent';
            } else {
                delete next[studentId]; // Back to default (Waived)
            }
            return next;
        });
    };

    // --- HANDLE SUBMIT ---
    const handleSubmit = async () => {
        try {
            const forEligible = selected;
            // Get IDs where value is explicitly 'Absent'
            const forAbsent = Object.keys(exceptions).filter(id => exceptions[id] === 'Absent');
            
            await SubmitStudentMealList(userID, section, forEligible, forAbsent);
            setIsSubmitted(true);
            setShowModal(false);
        } catch (error) {
            console.error(error);
            alert("Failed to submit. Please try again.");
            setIsSubmitted(false);
        }
    };

    // --- RENDER ROW LOGIC ---
    const cellStyle = {
        fontFamily: 'geist, sans-serif', fontSize: '12px', color: '#4b5563',
        borderBottom: '1px solid #f3f4f6', height: '43.5px', verticalAlign: 'middle'
    };

    const renderRow = (student, index, startIndex, { isSelected, toggleSelection }) => {

        const handleRowClick = () => {
            if (!isSubmitted && settingActive) {
                toggleSelection();
                if (!isSelected) {
                    handleExceptionChange(student.studentId, 'Waived');
                }
            }
        };

        // 🟢 FIXED STATUS LOGIC
        let statusDisplay;
        
        if (isSubmitted) {
            // 🟢 1. Try to use Server Data (If refreshed)
            const serverStatus = student.mealEligibilityStatus;
            
            if (serverStatus) {
                // If backend data exists, map strictly
                let type = "Eligible";
                if (serverStatus === "INELIGIBLE") type = "Waived";
                else if (serverStatus === "ABSENT") type = "Absent";
                
                statusDisplay = <StatusBadge type={type} />;
            } else {
                // 🟢 2. Fallback to Local State (Immediate View after Click)
                // This ensures "Absent" stays "Absent" right after submission
                if (selected.includes(student.studentId)) {
                    statusDisplay = <StatusBadge type="Eligible" />;
                } else if (exceptions[student.studentId] === 'Absent') {
                    statusDisplay = <StatusBadge type="Absent" />;
                } else {
                    statusDisplay = <StatusBadge type="Waived" />;
                }
            }
        } else {
            // 🟢 Active Editing Mode
            if (isSelected) {
                statusDisplay = <StatusBadge type="Eligible" />;
            } else {
                const currentException = exceptions[student.studentId] || 'Waived';
                statusDisplay = (
                    <StatusDropdown 
                        currentStatus={currentException}
                        disabled={!settingActive}
                        onChange={(val) => handleExceptionChange(student.studentId, val)}
                    />
                );
            }
        }

        // --- MOBILE VIEW ---
        if (isMobile) {
            return (
                <tr
                    key={student.studentId}
                    onClick={handleRowClick}
                    className={`transition-all border-b border-gray-100 ${isSelected ? "bg-blue-50/50" : "bg-white"} ${!settingActive ? "cursor-not-allowed opacity-75" : ""}`}
                >
                    <td colSpan={4} style={{ padding: '12px 16px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold text-sm shrink-0">
                                    {student.name.charAt(0)}
                                </div>
                                <div style={{ display: 'flex', flexDirection: 'column' }}>
                                    <span style={{ fontSize: '14px', fontWeight: 600, color: '#111827' }}>
                                        {student.name}
                                    </span>
                                    <span style={{ fontSize: '12px', color: '#6b7280', fontFamily: 'monospace' }}>
                                        {student.studentId}
                                    </span>
                                </div>
                            </div>
                            <div onClick={(e) => e.stopPropagation()}>
                                {statusDisplay}
                            </div>
                        </div>
                    </td>
                </tr>
            );
        }

        // --- SHARED CELLS ---
        const commonCells = (
            <>
                <td style={{ ...cellStyle, textAlign: 'center', width: '48px' }}>
                    <span className="text-gray-400 font-medium">{startIndex + index + 1}</span>
                </td>
                <td style={{ ...cellStyle, fontWeight: 500, color: '#111827' }}>
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold text-xs">
                            {student.name.charAt(0)}
                        </div>
                        <div className="flex flex-col">
                            <span>{student.name}</span>
                        </div>
                    </div>
                </td>
                <td style={cellStyle}>
                    <span className="font-mono text-xs">{student.studentId}</span>
                </td>
                <td style={{ ...cellStyle, textAlign: 'right', paddingRight: isTablet ? '16px' : '0' }}>
                    <div style={{ display: 'flex', justifyContent: isTablet ? 'flex-end' : 'flex-start' }} onClick={(e) => e.stopPropagation()}>
                        {statusDisplay}
                    </div>
                </td>
            </>
        );

        // --- TABLET/DESKTOP WRAPPERS ---
        const rowClass = `transition-colors cursor-pointer group ${isSelected ? "bg-blue-50" : "hover:bg-gray-50"} ${!settingActive ? "cursor-not-allowed opacity-75" : ""}`;
        const rowStyle = { backgroundColor: isSelected ? '#eff6ff' : 'transparent' };

        if (isTablet) {
            return (
                <tr key={student.studentId} onClick={handleRowClick} className={rowClass} style={rowStyle}>
                    {commonCells}
                </tr>
            );
        }

        return (
            <tr key={student.studentId} onClick={handleRowClick} className={rowClass} style={rowStyle}>
                <td style={{ padding: '0 12px', width: '48px', borderBottom: '1px solid #f3f4f6', textAlign: 'center' }} onClick={(e) => e.stopPropagation()}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        {!isSubmitted && settingActive ? (
                            <input
                                type="checkbox"
                                checked={isSelected}
                                onChange={handleRowClick}
                                style={{ width: '16px', height: '16px', borderRadius: '4px', cursor: 'pointer', accentColor: '#4268BD' }}
                            />
                        ) : (
                            <div style={{ width: '16px', height: '16px' }} />
                        )}
                    </div>
                </td>
                {commonCells}
            </tr>
        );
    };

    const columns = ['#', 'Student Name', 'Student ID', 'Status'];
    const absentCount = Object.values(exceptions).filter(v => v === 'Absent').length;
    const metrics = [
        { label: "Total Students", value: students.length },
        { label: "Eligible", value: selected.length, color: "#059669" }, 
        { label: "Absent", value: absentCount, color: "#4b5563" }, 
    ];

    const tabletThead = (
        <thead className="bg-gray-50 sticky top-0 z-20 shadow-sm">
            <tr style={{ height: '45px' }}>
                {columns.map((col, idx) => (
                    <th key={idx} style={{ fontSize: 12, whiteSpace: 'nowrap', padding: '12px 16px' }} className="font-geist font-medium text-gray-500">{col}</th>
                ))}
            </tr>
        </thead>
    );

    const customTheadProp = isMobile ? <thead /> : (isTablet ? tabletThead : null);
    const isSelectable = settingActive && !isSubmitted && !isMobile && !isTablet;

    const getPrimaryActionLabel = () => {
        if (!settingActive) return ""; 
        if (isSubmitted) return "";
        return "Submit List";
    };

    const getPrimaryLabelContent = () => {
        if (isSubmitted) return (
            <p className="w-full flex h-full items-center gap-1" style={{ padding: "10px 10px 10px 0px", color: '#059669' }}>
                <Check size={18} /><span> Submitted </span>
            </p>
        );
        if (!settingActive) return (
            <p className="w-full flex h-full items-center gap-2" style={{ padding: "10px 10px 10px 0px", color: '#6b7280' }}>
                <Lock size={18} /><span> Submission Closed </span>
            </p>
        );
        return null;
    };

    return (
        <div className="bg-[#F4F6F9] font-geist flex flex-col overflow-hidden" style={{ padding: isMobile ? 8 : 10 }}>
            <ConfirmModal
                visible={showModal}
                onCancel={() => setShowModal(false)}
                onConfirm={() => { setShowModal(false); handleSubmit(); }}
                title="Confirm Submission?"
                message={`You are submitting: ${selected.length} Eligible, ${absentCount} Absent. This cannot be undone.`}
            />

            <div className="flex-1 flex flex-col relative">
                <GenericTable
                    title="Student Roster"
                    subtitle={`Manage meal attendance for ${section}`}
                    data={students}
                    columns={isMobile ? [] : columns}
                    renderRow={renderRow}
                    metrics={metrics}
                    searchTerm={searchTerm}
                    onSearchChange={setSearchTerm}
                    selectable={isSelectable}
                    selectedIds={selected}
                    onSelectionChange={setSelected}
                    primaryKey="studentId"
                    primaryActionLabel={getPrimaryActionLabel()}
                    primaryActionIcon={(!isSubmitted && settingActive) ? <Check size={18} /> : null}
                    onPrimaryAction={(!isSubmitted && settingActive) ? () => setShowModal(true) : null}
                    primaryLabel={getPrimaryLabelContent()}
                    customThead={customTheadProp}
                />
            </div>
        </div>
    );
}