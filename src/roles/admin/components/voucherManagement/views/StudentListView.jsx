import React, { useState, useMemo, useEffect } from 'react';
import { Plus, ArrowLeft, User } from 'lucide-react';
import { AnimatePresence } from 'framer-motion';

import { GenericTable } from '../../../../../components/global/table/GenericTable';
import { SelectionActionBar } from '../SelectionActionBar';
import { useData } from "../../../../../context/DataContext";
import { AddStudentModal } from '../AddStudentModal';
import { CustomEditDropdown } from '../components/CustomEditDropdown';
import { LinkStatusBadge } from '../LinkStatusBadge';

export const StudentListView = ({ switcher, drilldownContext, onGoBack }) => {
    // 🟢 1. GET THE UNIFIED DATA
    const { schoolData } = useData();

    // --- STATE ---
    const [activeTab, setActiveTab] = useState('all');
    const [searchTerm, setSearchTerm] = useState('');
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);

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
        border: '1px solid #e5e7eb', // gray-200
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
            <AddStudentModal isOpen={isAddModalOpen} onClose={() => setIsAddModalOpen(false)} />
            
            <GenericTable
                title={drilldownContext ? `Students in ${drilldownContext.level} - ${drilldownContext.sectionName}` : "Student Master List"}
                subtitle={drilldownContext ? "Manage students in this section" : "Manage all student records"}
                
                tabs={!drilldownContext ? [
                    { label: 'All', id: 'all' }, { label: 'Preschool', id: 'preschool' }, { label: 'Primary Education', id: 'primaryEducation' },
                    { label: 'Intermediate', id: 'intermediate' }, { label: 'Junior High School', id: 'juniorHighSchool' }, { label: 'Senior High School', id: 'seniorHighSchool' }, { label: 'Higher Education', id: 'higherEducation' }
                ] : []}
                
                activeTab={activeTab} onTabChange={setActiveTab} 
                searchTerm={searchTerm} onSearchChange={setSearchTerm} 
                
                customActions={drilldownContext ? null : switcher}
                
                overrideHeader={headerVisible ? actionBar : null}
                
                onPrimaryAction={() => drilldownContext ? onGoBack() : setIsAddModalOpen(true)}
                primaryActionLabel={drilldownContext ? "Go Back" : "Add Student"} 
                primaryActionIcon={drilldownContext ? <ArrowLeft size={16} /> : <Plus size={16} />}
                
                onSecondaryAction={null} 
                secondaryActionLabel={null} 
                secondaryActionIcon={null}
                
                columns={['Student Name', 'Student ID', 'Type', 'Grade Level', getSectionLabel(), 'RFID Link']}
                data={filteredStudents} 
                renderRow={renderRow} 
                metrics={[{ label: "Total Students", value: filteredStudents.length }]}
            />
        </>
    );
};