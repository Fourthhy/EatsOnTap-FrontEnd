import React, { useState, useMemo, useEffect } from 'react';
import { Plus, ArrowLeft, User, Pencil, MoreVertical } from 'lucide-react'; 
import { AnimatePresence, motion } from 'framer-motion'; 

import { GenericTable } from '../../../../../components/global/table/GenericTable';
import { SelectionActionBar } from '../SelectionActionBar';
import { useData } from "../../../../../context/DataContext";
import { AddStudentModal } from '../AddStudentModal';
import { CustomEditDropdown } from '../components/CustomEditDropdown';
import { LinkStatusBadge } from '../LinkStatusBadge';
import { UpdateRecordsModal } from '../components/UpdateRecordsModal';

// --- 🟢 NEW: 3-DOT ACTION MENU COMPONENT ---
const TableActionsMenu = ({ onAdd, onUpdate }) => {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div style={{ position: 'relative' }}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                style={{
                    padding: '8px', backgroundColor: 'white', border: '1px solid #d1d5db',
                    borderRadius: '6px', cursor: 'pointer', display: 'flex', alignItems: 'center', 
                    justifyContent: 'center', boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)', color: '#374151',
                    transition: 'background-color 0.2s'
                }}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f9fafb'}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'white'}
            >
                <MoreVertical size={18} />
            </button>

            <AnimatePresence>
                {isOpen && (
                    <>
                        {/* Invisible overlay to catch clicks outside the dropdown */}
                        <div style={{ position: 'fixed', inset: 0, zIndex: 40 }} onClick={() => setIsOpen(false)} />
                        
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: -5 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: -5 }}
                            transition={{ duration: 0.15 }}
                            style={{
                                position: 'absolute', top: '100%', right: 0, marginTop: '8px',
                                backgroundColor: 'white', borderRadius: '6px', 
                                boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
                                border: '1px solid #e5e7eb', zIndex: 50, minWidth: '180px', overflow: 'hidden',
                                display: 'flex', flexDirection: 'column'
                            }}
                        >
                            <button
                                onClick={() => { setIsOpen(false); onAdd(); }}
                                style={{
                                    width: '100%', padding: '12px 16px', display: 'flex', alignItems: 'center', gap: '10px',
                                    fontSize: '0.875rem', fontWeight: '500', color: '#374151', backgroundColor: 'transparent', 
                                    border: 'none', borderBottom: '1px solid #f3f4f6', cursor: 'pointer', textAlign: 'left'
                                }}
                                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f9fafb'}
                                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                            >
                                <Plus size={16} style={{ color: '#2563eb' }} />
                                Add Student
                            </button>
                            <button
                                onClick={() => { setIsOpen(false); onUpdate(); }}
                                style={{
                                    width: '100%', padding: '12px 16px', display: 'flex', alignItems: 'center', gap: '10px',
                                    fontSize: '0.875rem', fontWeight: '500', color: '#374151', backgroundColor: 'transparent', 
                                    border: 'none', cursor: 'pointer', textAlign: 'left'
                                }}
                                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f9fafb'}
                                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                            >
                                <Pencil size={16} style={{ color: '#059669' }} />
                                Update Records
                            </button>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </div>
    );
};

export const StudentListView = ({ switcher, drilldownContext, onGoBack }) => {
    // 🟢 1. GET THE UNIFIED DATA
    const { schoolData } = useData();

    // --- STATE ---
    const [activeTab, setActiveTab] = useState('all');
    const [searchTerm, setSearchTerm] = useState('');
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false); // 🟢 Moved this here!

    // Selection & Actions
    const [selectedItem, setSelectedItem] = useState(null);
    const [selectedIds, setSelectedIds] = useState([]);
    const [headerVisible, setHeaderVisible] = useState(false);

    // Edit Mode
    const [isEditing, setIsEditing] = useState(false);
    const [editFormData, setEditFormData] = useState({});

    // --- EFFECT: HEADER VISIBILITY ---
    const shouldShowActions = selectedIds.length > 0 || selectedItem !== null;
    useEffect(() => {
        if (shouldShowActions) setHeaderVisible(true);
        else {
            const timer = setTimeout(() => setHeaderVisible(false), 300);
            return () => clearTimeout(timer);
        }
    }, [shouldShowActions]);

    // --- DYNAMIC LABEL ---
    const getSectionLabel = () => {
        if (activeTab === 'all') return "Section / Program";
        if (activeTab === 'higherEducation') return "Program";
        return "Section";
    };

    // --- 🟢 HELPER: FLATTEN MASTER TREE ---
    const allStudentsFlat = useMemo(() => {
        if (!schoolData || schoolData.length === 0) return [];
        const students = [];

        schoolData.forEach(cat => {
            if (cat.levels) {
                cat.levels.forEach(lvl => {
                    if (lvl.sections) {
                        lvl.sections.forEach(sec => {
                            if (sec.students) {
                                sec.students.forEach(s => {
                                    students.push({
                                        ...s,
                                        gradeLevel: s.gradeLevel || lvl.levelName,
                                        program: s.program || s.section || sec.section,
                                        category: cat.category,
                                    });
                                });
                            }
                        });
                    }
                });
            }
        });
        return students;
    }, [schoolData]);

    // --- 🟢 UNIFIED FILTERING LOGIC ---
    const filteredStudents = useMemo(() => {
        if (drilldownContext) {
            let list = drilldownContext.students || [];
            if (searchTerm) {
                const lower = searchTerm.toLowerCase();
                list = list.filter(s => 
                    (s.name || "").toLowerCase().includes(lower) ||
                    (s.studentId || "").toLowerCase().includes(lower)
                );
            }
            return list.map(s => ({
                ...s,
                gradeLevel: s.gradeLevel || drilldownContext.level,
                program: s.program || s.section || drilldownContext.sectionName
            }));
        }

        return allStudentsFlat.filter(student => {
            let matchesTab = true;
            if (activeTab !== 'all') {
                if (student.category !== activeTab) matchesTab = false;
            }
            if (searchTerm && matchesTab) {
                const searchString = `${student.name} ${student.studentId} ${student.gradeLevel} ${student.program}`.toLowerCase();
                matchesTab = searchString.includes(searchTerm.toLowerCase());
            }
            return matchesTab;
        });

    }, [allStudentsFlat, drilldownContext, activeTab, searchTerm]);

    // --- HANDLERS ---
    const handleEditSave = () => { setSelectedItem(editFormData); setIsEditing(false); };
    
    const handleStudentClick = (student) => {
        if (isEditing) return;
        if (selectedItem?.id === student.id) setSelectedItem(null);
        else setSelectedItem(student);
    };

    // --- RENDER ROW ---
    const cellStyle = { fontSize: '12px', color: '#4b5563', borderBottom: '1px solid #f3f4f6', height: '44px', verticalAlign: 'middle' };
    
    // 🟢 NEW: Inline styles for Edit Inputs
    const inputStyle = {
        width: '100%',
        padding: '6px',
        border: '1px solid #e5e7eb', 
        borderRadius: '4px',
        fontSize: '12px',
        color: '#111827',
        fontFamily: 'inherit'
    };

    const renderRow = (student, index, startIndex) => {
        if (isEditing && selectedItem?.id === student.id) {
            return (
                <tr key={student.id} style={{ backgroundColor: '#eff6ff' }}>
                    <td style={cellStyle}>
                        <div style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#3b82f6', margin: '0 auto' }} />
                    </td>
                    <td style={cellStyle}>
                        <input 
                            style={inputStyle} 
                            value={editFormData.name} 
                            onChange={e => setEditFormData({ ...editFormData, name: e.target.value })} 
                        />
                    </td>
                    <td style={cellStyle}>
                        <input 
                            style={inputStyle} 
                            value={editFormData.studentId} 
                            onChange={e => setEditFormData({ ...editFormData, studentId: e.target.value })} 
                        />
                    </td>
                    <td style={cellStyle}>
                        <CustomEditDropdown 
                            value={editFormData.type} 
                            options={['Regular', 'Irregular']} 
                            onChange={v => setEditFormData({ ...editFormData, type: v })} 
                        />
                    </td>
                    <td style={cellStyle}>
                        <span style={{ color: '#6b7280', fontSize: '12px' }}>{student.gradeLevel}</span>
                    </td>
                    <td style={cellStyle}>
                        <input 
                            style={inputStyle} 
                            value={editFormData.program} 
                            onChange={e => setEditFormData({ ...editFormData, program: e.target.value })} 
                        />
                    </td>
                    <td style={cellStyle}>
                        <span style={{ color: '#9ca3af', fontStyle: 'italic', fontSize: '12px' }}>Editing...</span>
                    </td>
                </tr>
            );
        }

        const isSelected = selectedItem?.id === student.id;
        
        return (
            <tr key={student.id} onClick={() => handleStudentClick(student)} className="hover:bg-gray-50 transition-colors cursor-pointer" style={{ backgroundColor: isSelected ? '#eff6ff' : 'transparent' }}>
                <td style={{ ...cellStyle, textAlign: 'center', width: '48px' }} onClick={e => e.stopPropagation()}>
                    {startIndex + index + 1}
                </td>
                <td style={{ ...cellStyle, fontWeight: 500, color: '#111827' }}>
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-gray-500"><User size={16} /></div>
                        {student.name}
                    </div>
                </td>
                <td style={cellStyle}>{student.studentId}</td>
                <td style={cellStyle}>{student.type || "Regular"}</td>
                <td style={cellStyle}>{student.gradeLevel}</td>
                <td style={cellStyle}>{student.program}</td>
                <td style={cellStyle} onClick={(e) => e.stopPropagation()}>
                    <LinkStatusBadge isLinked={student.isLinked} student={student} />
                </td>
            </tr>
        );
    };

    // --- ACTION BAR ---
    const actionBar = (
        <AnimatePresence>
            {shouldShowActions && (
                <SelectionActionBar
                    key="bar" 
                    variant="student"
                    selectedItem={selectedItem}
                    onClearSelection={() => { setSelectedItem(null); setIsEditing(false); }}
                    isEditing={isEditing} 
                    onEditStudent={() => { setEditFormData({ ...selectedItem }); setIsEditing(true); }} 
                    onSaveStudent={handleEditSave} 
                    onCancelEdit={() => { setIsEditing(false); setEditFormData({}); }}
                    selectedCount={selectedIds.length} 
                />
            )}
        </AnimatePresence>
    );

    return (
        <>
            {/* 🟢 MODALS */}
            <AddStudentModal isOpen={isAddModalOpen} onClose={() => setIsAddModalOpen(false)} />
            <UpdateRecordsModal isOpen={isUpdateModalOpen} onClose={() => setIsUpdateModalOpen(false)} />
            
            <GenericTable
                title={drilldownContext ? `Students in ${drilldownContext.level} - ${drilldownContext.sectionName}` : "Student Master List"}
                subtitle={drilldownContext ? "Manage students in this section" : "Manage all student records"}
                
                tabs={!drilldownContext ? [
                    { label: 'All', id: 'all' }, { label: 'Preschool', id: 'preschool' }, { label: 'Primary Education', id: 'primaryEducation' },
                    { label: 'Intermediate', id: 'intermediate' }, { label: 'Junior High School', id: 'juniorHighSchool' }, { label: 'Senior High School', id: 'seniorHighSchool' }, { label: 'Higher Education', id: 'higherEducation' }
                ] : []}
                
                activeTab={activeTab} onTabChange={setActiveTab} 
                searchTerm={searchTerm} onSearchChange={setSearchTerm} 
                
                // 🟢 Inject the 3-dot menu alongside the switcher (only when NOT in drilldown)
                customActions={
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        {!drilldownContext && switcher}
                        {!drilldownContext && (
                            <TableActionsMenu 
                                onAdd={() => setIsAddModalOpen(true)} 
                                onUpdate={() => setIsUpdateModalOpen(true)} // 🟢 Now properly opens the Wizard
                            />
                        )}
                    </div>
                }
                
                overrideHeader={headerVisible ? actionBar : null}
                
                onPrimaryAction={drilldownContext ? () => onGoBack() : undefined}
                primaryActionLabel={drilldownContext ? "Go Back" : undefined} 
                primaryActionIcon={drilldownContext ? <ArrowLeft size={16} /> : undefined}
                
                columns={['Student Name', 'Student ID', 'Type', 'Grade Level', getSectionLabel(), 'RFID Link']}
                data={filteredStudents} 
                renderRow={renderRow} 
                metrics={[{ label: "Total Students", value: filteredStudents.length }]}
            />
        </>
    );
};