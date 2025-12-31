import React, { useState, useEffect, useMemo } from 'react';
import { useParams } from "react-router-dom";
import { Check } from "lucide-react";

// 🟢 IMPORT THE NEW MODAL
import { ConfirmModal } from "./components/ConfirmModal"; 

// 🟢 CONTEXTS
import { useData } from "../../context/DataContext";
import { useClassAdviser } from "../../context/ClassAdviserContext";

// 🟢 FUNCTIONS
import { SubmitStudentMealList } from "../../functions/classAdviser/SubmitStudentMealList";
import { isStudentMealSubmitted } from "../../functions/classAdviser/isStudentMealSubmitted";

// 🟢 COMPONENTS
import { GenericTable } from "../../components/global/table/GenericTable";

export default function SubmitMealList() {
    const { section, userID } = useParams();
    const { schoolData } = useData(); 
    const { currentAdviser } = useClassAdviser(); 

    const [selected, setSelected] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [loading, setLoading] = useState(true);
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [showModal, setShowModal] = useState(false);

    // --- 1. FETCH STUDENTS LOGIC ---
    const students = useMemo(() => {
        if (!schoolData || schoolData.length === 0) return [];
        let foundStudents = [];
        schoolData.forEach(cat => {
            if(cat.levels) cat.levels.forEach(lvl => {
                if(lvl.sections) lvl.sections.forEach(sec => {
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
        setLoading(true);
        isStudentMealSubmitted(section)
            .then(setIsSubmitted)
            .catch(console.error)
            .finally(() => setTimeout(() => setLoading(false), 500));
    }, [section]);

    // --- 3. SUBMIT LOGIC ---
    const handleSubmit = async () => {
        try {
            await SubmitStudentMealList(userID, section, selected);
            setIsSubmitted(true);
            setShowModal(false); // Close modal on success
        } catch (error) {
            console.error(error);
            setIsSubmitted(false);
            // Optionally handle error state here
        }
    };

    // --- 4. RENDER ROW ---
    const cellStyle = {
        fontFamily: 'geist, sans-serif', fontSize: '12px', color: '#4b5563',
        borderBottom: '1px solid #f3f4f6', height: '43.5px', verticalAlign: 'middle'
    };

    const renderRow = (student, index, startIndex, { isSelected, toggleSelection }) => {
        const handleRowClick = () => { if (!isSubmitted) toggleSelection(); };

        return (
            <tr 
                key={student.studentId} 
                onClick={handleRowClick}
                className={`transition-colors cursor-pointer group ${isSelected ? "bg-blue-50" : "hover:bg-gray-50"}`}
                style={{ backgroundColor: isSelected ? '#eff6ff' : 'transparent' }}
            >
                {/* Checkbox Column */}
                <td style={{ padding: '0 12px', width: '48px', borderBottom: '1px solid #f3f4f6', textAlign: 'center' }} onClick={(e) => e.stopPropagation()}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        {!isSubmitted ? (
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

                {/* Index Column (#) */}
                <td style={{ ...cellStyle, textAlign: 'center', width: '48px' }}>
                    <span className="text-gray-400 font-medium">{startIndex + index + 1}</span>
                </td>

                {/* Student Name */}
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

                {/* Student ID */}
                <td style={cellStyle}>
                    <span className="font-mono text-xs">{student.studentId}</span>
                </td>

                {/* Status Column */}
                <td style={cellStyle} className="text-right">
                    {isSubmitted ? (
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${student.mealEligibilityStatus === "INELIGIBLE" ? "bg-gray-100 text-gray-500 border-gray-200" : "bg-green-50 text-green-600 border-green-100"}`}>
                            {student.mealEligibilityStatus === "INELIGIBLE" ? "PENDING" : "SUBMITTED"}
                        </span>
                    ) : (
                        <span className={`text-xs font-medium ${isSelected ? "text-blue-600" : "text-gray-300"}`}>
                            {isSelected ? "Selected" : "—"}
                        </span>
                    )}
                </td>
            </tr>
        );
    };

    const columns = ['#', 'Student Name', 'Student ID', 'Status'];
    
    const metrics = [
        { label: "Total Students", value: students.length },
        { label: "Selected", value: selected.length, color: "#2563EB" }
    ];

    return (
        <div className="bg-[#F4F6F9] font-geist flex flex-col overflow-hidden">
            <ConfirmModal 
                visible={showModal} 
                onCancel={() => setShowModal(false)} 
                onConfirm={handleSubmit} 
            />

            {/* MAIN CONTENT */}
            <div className="flex-1 flex flex-col relative">
                <GenericTable
                    title="Student Roster"
                    subtitle={`Manage meal attendance for ${section}`}
                    
                    data={students}
                    columns={columns}
                    renderRow={renderRow}
                    metrics={metrics}
                    
                    searchTerm={searchTerm}
                    onSearchChange={setSearchTerm}

                    selectable={!isSubmitted} 
                    selectedIds={selected}
                    onSelectionChange={setSelected}
                    primaryKey="studentId" 

                    primaryActionLabel={isSubmitted ? "Submitted" : "Submit List"}
                    primaryActionIcon={<Check size={18} />} 
                    onPrimaryAction={isSubmitted ? null : () => setShowModal(true)}
                />
            </div>
        </div>
    );
}