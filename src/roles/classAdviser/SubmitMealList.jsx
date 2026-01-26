import React, { useState, useEffect, useMemo, useRef } from 'react';
import { useParams } from "react-router-dom";
import { Check, Lock } from "lucide-react";
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

// --- STATUS BADGE COMPONENT ---
const StatusBadge = ({ type }) => {
    const styles = {
        Eligible: { backgroundColor: '#d1fae5', color: '#047857', dotColor: '#10b981', text: 'Eligible' },
        Waived: { backgroundColor: '#f3f4f6', color: '#6b7280', dotColor: '#9ca3af', text: 'Waived' }
    };
    const currentStyle = styles[type] || styles.Waived;

    return (
        <span
            style={{
                padding: '4px 12px', borderRadius: '12px', display: 'inline-flex', alignItems: 'center',
                gap: '6px', backgroundColor: currentStyle.backgroundColor, color: currentStyle.color,
                width: 'fit-content', fontSize: '12px', fontWeight: 500, fontFamily: 'geist, sans-serif'
            }}
        >
            <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: currentStyle.dotColor }}></span>
            <span>{currentStyle.text}</span>
        </span>
    );
};

export default function SubmitMealList() {
    // 🟢 Initialize Hook
    const { breakpoint } = useBreakpoint(BREAKPOINTS, 'desktop');
    const isMobile = breakpoint === 'mobile';
    const isTablet = breakpoint === 'tablet';

    const { section, userID } = useParams();
    const { schoolData } = useData();
    const { currentAdviser, adviserDisplayName } = useClassAdviser();

    const [selected, setSelected] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [loading, setLoading] = useState(true);
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [showModal, setShowModal] = useState(false);

    // 🟢 Default to false to prevent interaction before load
    const [settingActive, setSettingActive] = useState(false);

    // 🟢 Ref to ensure we only auto-select ONCE upon entry
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

    // --- 2. CHECK STATUS ON LOAD ---
    useEffect(() => {
        let isMounted = true; // 🟢 1. Track if component is still active
        setLoading(true);

        Promise.all([
            // 🟢 2. Attach .catch to EACH promise individually
            // If this fails, we return false (or null) so the other request still succeeds
            isStudentMealSubmitted(section).catch(err => {
                console.error("Error checking submission:", err);
                return false; // Default fallback
            }),

            isSettingActive("SUBMIT-MEAL-REQUEST").catch(err => {
                console.error("Error checking settings:", err);
                return false; // Default fallback
            })
        ])
            .then(([submittedStatus, activeStatus]) => {
                // 🟢 3. Only update state if the user is still on this section
                if (isMounted) {
                    setIsSubmitted(submittedStatus);
                    setSettingActive(activeStatus);
                }
            })
            .finally(() => {
                if (isMounted) setLoading(false);
            });

        // 🟢 4. Cleanup function
        return () => {
            isMounted = false;
        };

    }, [section]);

    // --- 🟢 3. AUTO-SELECT ALL LOGIC (Updated Condition) ---
    useEffect(() => {
        // Only run if loaded, have students, not initialized, NOT submitted, AND setting is ACTIVE
        if (!loading && students.length > 0 && !selectionInitialized.current) {
            if (!isSubmitted && settingActive) {
                const allIds = students.map(s => s.studentId);
                setSelected(allIds);
            }
            selectionInitialized.current = true;
        }
    }, [loading, students, isSubmitted, settingActive]);

    const handleSubmit = async () => {
        try {
            await SubmitStudentMealList(userID, section, selected);
            setIsSubmitted(true);
            setShowModal(false);
        } catch (error) {
            console.error(error);
            setIsSubmitted(false);
        }
    };

    // --- RENDER ROW LOGIC ---
    const cellStyle = {
        fontFamily: 'geist, sans-serif', fontSize: '12px', color: '#4b5563',
        borderBottom: '1px solid #f3f4f6', height: '43.5px', verticalAlign: 'middle'
    };

    const renderRow = (student, index, startIndex, { isSelected, toggleSelection }) => {

        // 🟢 BLOCK TOGGLE if setting is inactive
        const handleRowClick = () => {
            if (!isSubmitted && settingActive) {
                toggleSelection();
            }
        };

        // Determine Status for Badge
        let statusType = 'Waived';
        if (isSubmitted) {
            statusType = student.mealEligibilityStatus === "INELIGIBLE" ? "Waived" : "Eligible";
        } else {
            statusType = isSelected ? "Eligible" : "Waived";
        }

        // 🟢 A. MOBILE VIEW (Card Layout - No Checkbox)
        if (isMobile) {
            return (
                <tr
                    key={student.studentId}
                    onClick={handleRowClick}
                    className={`transition-all border-b border-gray-100 ${isSelected ? "bg-blue-50/50" : "bg-white"} ${!settingActive ? "cursor-not-allowed opacity-75" : ""}`}
                >
                    <td colSpan={4} style={{ padding: '12px 16px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
                            {/* Left: Avatar + Info */}
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

                            {/* Right: Status Badge Only */}
                            <div>
                                <StatusBadge type={statusType} />
                            </div>
                        </div>
                    </td>
                </tr>
            );
        }

        // 🟢 B. TABLET VIEW (No Checkbox Column)
        if (isTablet) {
            return (
                <tr
                    key={student.studentId}
                    onClick={handleRowClick}
                    className={`transition-colors cursor-pointer group ${isSelected ? "bg-blue-50" : "hover:bg-gray-50"} ${!settingActive ? "cursor-not-allowed opacity-75" : ""}`}
                    style={{ backgroundColor: isSelected ? '#eff6ff' : 'transparent' }}
                >
                    {/* Index Column (#) */}
                    <td style={{ ...cellStyle, textAlign: 'center', width: '48px', paddingLeft: '16px' }}>
                        <span className="text-gray-400 font-medium">{startIndex + index + 1}</span>
                    </td>

                    {/* Name */}
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

                    {/* ID */}
                    <td style={cellStyle}>
                        <span className="font-mono text-xs">{student.studentId}</span>
                    </td>

                    {/* Status Badge */}
                    <td style={{ ...cellStyle, textAlign: 'right', paddingRight: '16px' }}>
                        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                            <StatusBadge type={statusType} />
                        </div>
                    </td>
                </tr>
            );
        }

        // 🟢 C. DESKTOP VIEW (Standard Table with Checkbox)
        return (
            <tr
                key={student.studentId}
                onClick={handleRowClick}
                className={`transition-colors cursor-pointer group ${isSelected ? "bg-blue-50" : "hover:bg-gray-50"} ${!settingActive ? "cursor-not-allowed opacity-75" : ""}`}
                style={{ backgroundColor: isSelected ? '#eff6ff' : 'transparent' }}
            >
                {/* Checkbox Column */}
                <td style={{ padding: '0 12px', width: '48px', borderBottom: '1px solid #f3f4f6', textAlign: 'center' }} onClick={(e) => e.stopPropagation()}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        {!isSubmitted && settingActive ? ( // 🟢 Fixed: Only show checkbox if active AND not submitted
                            <input
                                type="checkbox"
                                checked={isSelected}
                                onChange={toggleSelection}
                                style={{
                                    width: '16px', height: '16px', borderRadius: '4px', cursor: 'pointer',
                                    accentColor: '#4268BD'
                                }}
                            />
                        ) : (
                            <div style={{ width: '16px', height: '16px' }} />
                        )}
                    </div>
                </td>

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

                <td style={{ ...cellStyle, textAlign: 'right' }}>
                    <div style={{ display: 'flex', justifyContent: 'flex-start' }}>
                        <StatusBadge type={statusType} />
                    </div>
                </td>
            </tr>
        );
    };

    const columns = ['#', 'Student Name', 'Student ID', 'Status'];
    const metrics = [
        { label: "Total Students", value: students.length },
        { label: "Selected", value: selected.length, color: "#2563EB" }
    ];

    const tabletThead = (
        <thead className="bg-gray-50 sticky top-0 z-20 shadow-sm">
            <tr style={{ height: '45px' }}>
                {columns.map((col, idx) => (
                    <th key={idx} style={{ fontSize: 12, whiteSpace: 'nowrap', padding: '12px 16px' }} className="font-geist font-medium text-gray-500">
                        {col}
                    </th>
                ))}
            </tr>
        </thead>
    );

    const customTheadProp = isMobile ? <thead /> : (isTablet ? tabletThead : null);

    // 🟢 FIXED: Selectable only if ACTIVE and NOT SUBMITTED
    const isSelectable = settingActive && !isSubmitted && !isMobile && !isTablet;

    // 🟢 HELPER: Determine Button State
    const getPrimaryActionLabel = () => {
        if (!settingActive) return ""; // Text is handled in primaryLabel
        if (isSubmitted) return "";    // Text is handled in primaryLabel
        return "Submit List";
    };

    const getPrimaryLabelContent = () => {
        if (isSubmitted) {
            return (
                <p className="w-full flex h-full items-center gap-1" style={{ padding: "10px 10px 10px 0px", color: '#059669' }}>
                    <Check size={18} />
                    <span> Submitted </span>
                </p>
            );
        }
        if (!settingActive) {
            return (
                <p className="w-full flex h-full items-center gap-2" style={{ padding: "10px 10px 10px 0px", color: '#6b7280' }}>
                    <Lock size={18} />
                    <span> Submission Closed </span>
                </p>
            );
        }
        return null; // Default button shows up
    };

    return (
        <div className="bg-[#F4F6F9] font-geist flex flex-col overflow-hidden" style={{ padding: isMobile ? 8 : 10 }}>
            <ConfirmModal
                visible={showModal}
                onCancel={() => setShowModal(false)}
                onConfirm={() => { setShowModal(false); handleSubmit(); }}
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

                    // 🟢 BUTTON LOGIC FIXED
                    primaryActionLabel={getPrimaryActionLabel()}
                    primaryActionIcon={(!isSubmitted && settingActive) ? <Check size={18} /> : null}
                    onPrimaryAction={(!isSubmitted && settingActive) ? () => setShowModal(true) : null}

                    // 🟢 CUSTOM TEXT FOR DISABLED STATES
                    primaryLabel={getPrimaryLabelContent()}

                    customThead={customTheadProp}
                />
            </div>
        </div>
    );
}