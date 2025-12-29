import React, { useState, useMemo, useEffect } from 'react';
import { Plus, ArrowLeft, GraduationCap, User } from 'lucide-react';
import { AnimatePresence } from 'framer-motion';

import { GenericTable } from '../../../../../components/global/table/GenericTable';
import { SelectionActionBar } from '../SelectionActionBar';

// Context Data
import { useData } from "../../../../../context/DataContext";

import { AddStudentModal } from '../AddStudentModal';
import { PromotionModal, AssignmentModal } from '../components/PromotionModals';
import { CustomEditDropdown } from '../components/CustomEditDropdown';
import { LinkStatusBadge } from '../LinkStatusBadge';

export const StudentListView = ({ switcher, drilldownContext, onGoBack }) => {
    // Context Data 
    const { programsAndSections, allStudents } = useData();

    // --- STATE ---
    const [activeTab, setActiveTab] = useState('all');
    const [searchTerm, setSearchTerm] = useState('');
    const [allStudentsList, setAllStudentsList] = useState(allStudents);
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);

    // Selection & Actions
    const [selectedItem, setSelectedItem] = useState(null);
    const [selectedIds, setSelectedIds] = useState([]);
    const [activeActionDropdown, setActiveActionDropdown] = useState(null);

    // Header Visibility State
    const [headerVisible, setHeaderVisible] = useState(false);

    // Edit Mode
    const [isEditing, setIsEditing] = useState(false);
    const [editFormData, setEditFormData] = useState({});

    // Promotion Mode
    const [promotionMode, setPromotionMode] = useState(null);
    const [isPromotionModalOpen, setIsPromotionModalOpen] = useState(false);
    const [isAssignmentModalOpen, setIsAssignmentModalOpen] = useState(false);

    // --- EFFECT 1: MANAGE HEADER VISIBILITY ---
    const shouldShowActions = selectedIds.length > 0 || selectedItem !== null || promotionMode !== null;

    useEffect(() => {
        if (shouldShowActions) {
            setHeaderVisible(true);
        } else {
            const timer = setTimeout(() => {
                setHeaderVisible(false);
            }, 300);
            return () => clearTimeout(timer);
        }
    }, [shouldShowActions]);

    // --- EFFECT 2: SYNC DATA FROM CONTEXT ---
    // 🟢 Critical: Updates the list when API data arrives
    useEffect(() => {
        if (allStudents && allStudents.length > 0) {
            setAllStudentsList(allStudents);
        }
    }, [allStudents]);

    // --- HELPERS ---
    const allLevelsFlat = useMemo(() => {
        let levels = [];
        programsAndSections.forEach(cat => cat.levels.forEach(lvl => levels.push({ ...lvl, category: cat.category })));
        return levels;
    }, [programsAndSections]);

    const isGraduatingLevel = (levelName) => {
        const index = allLevelsFlat.findIndex(l => l.gradeLevel === levelName);
        return index === allLevelsFlat.length - 1;
    };

    const getNextLevelSections = (currentLevelName) => {
        const index = allLevelsFlat.findIndex(l => l.gradeLevel === currentLevelName);
        if (index !== -1 && index < allLevelsFlat.length - 1) return allLevelsFlat[index + 1].sections;
        return [];
    };

    const getSectionsForStudent = (gradeLevel) => {
        // Find sections based on the student's Grade Level
        const levelObj = allLevelsFlat.find(l => (gradeLevel || "").includes(l.gradeLevel));
        return levelObj ? levelObj.sections.map(s => s.name) : [];
    };

    // --- FILTERING ---
    const filteredStudents = useMemo(() => {
        // 1. Drilldown Context (Specific Section)
        if (drilldownContext) {
            return allStudentsList.filter(s => {
                const sProgram = (s.gradeLevel || "").toLowerCase(); // Check Grade
                const sSection = (s.program || s.section || "").toLowerCase(); // Check Section (mapped to program)
                
                const targetLevel = drilldownContext.level.toLowerCase();
                const targetSection = drilldownContext.sectionName.toLowerCase();
                
                return sProgram === targetLevel && sSection === targetSection;
            });
        }

        // 2. Global List (All Students with Tabs)
        return allStudentsList.filter(student => {
            let matchesTab = true;
            
            // 🟢 UPDATE: Filter by 'gradeLevel' property from API
            const level = (student.gradeLevel || "").toLowerCase(); 

            if (activeTab !== 'all') {
                const isGradeLevel = (s, min, max) => {
                    if (!s.includes("grade")) return false;
                    const m = s.match(/\d+/);
                    return m && parseInt(m[0]) >= min && parseInt(m[0]) <= max;
                };
                const isHigherEd = (s) => s.startsWith('bs') || s.startsWith('ab') || s.startsWith('associate') || !s.includes("grade");

                switch (activeTab) {
                    case 'preschool':
                        matchesTab = level.includes('kinder') || level.includes('preschool') || level.includes('nursery');
                        break;
                    case 'primaryEducation':
                        matchesTab = isGradeLevel(level, 1, 3);
                        break;
                    case 'intermediate':
                        matchesTab = isGradeLevel(level, 4, 6);
                        break;
                    case 'juniorHighSchool':
                        matchesTab = isGradeLevel(level, 7, 10);
                        break;
                    case 'seniorHighSchool':
                        matchesTab = isGradeLevel(level, 11, 12);
                        break;
                    case 'higherEducation':
                        matchesTab = isHigherEd(level) && !level.includes("preschool") && !level.includes("kinder");
                        break;
                    default:
                        matchesTab = false;
                }
            }

            // 🟢 UPDATE: Search includes Name, Grade, and Section
            if (searchTerm && matchesTab) {
                const searchString = `${student.name} ${student.studentId} ${student.gradeLevel} ${student.program}`.toLowerCase();
                matchesTab = searchString.includes(searchTerm.toLowerCase());
            }
            return matchesTab;
        });
    }, [allStudentsList, drilldownContext, activeTab, searchTerm]);

    // --- HANDLERS ---
    const handlePromoteClick = () => {
        if (!drilldownContext) return;
        if (isGraduatingLevel(drilldownContext.level)) {
            setPromotionMode('graduation');
            setSelectedIds(filteredStudents.map(s => s.id));
        } else {
            setIsPromotionModalOpen(true);
        }
    };

    const handleBulkPromote = (newSection) => {
        const idsToPromote = filteredStudents.map(s => s.id);
        // Note: In real app, you'd send API request here
        setAllStudentsList(prev => prev.map(s => idsToPromote.includes(s.id) ? { ...s, program: newSection } : s));
        setIsPromotionModalOpen(false);
    };

    const handleIndividualAssign = (newSection) => {
        setAllStudentsList(prev => prev.map(s => selectedIds.includes(s.id) ? { ...s, program: newSection } : s));
        setIsAssignmentModalOpen(false);
        setSelectedIds([]);
    };

    const exitPromotion = () => {
        setPromotionMode(null);
        setSelectedIds([]);
    };

    const handleEditSave = () => {
        setAllStudentsList(prev => prev.map(s => s.id === selectedItem.id ? editFormData : s));
        setSelectedItem(editFormData);
        setIsEditing(false);
    };

    const handleStudentClick = (student) => {
        if (isEditing || promotionMode) return;
        if (selectedItem?.id === student.id) {
            setSelectedItem(null);
        } else {
            setSelectedItem(student);
        }
    };

    // --- RENDERERS ---
    const cellStyle = { fontSize: '12px', color: '#4b5563', borderBottom: '1px solid #f3f4f6', height: '44px', verticalAlign: 'middle' };

    const renderRow = (student, index, startIndex) => {
        // --- RENDER EDIT MODE ROW ---
        if (isEditing && selectedItem?.id === student.id) {
            // Get sections based on the student's current Grade Level
            const availableSections = getSectionsForStudent(student.gradeLevel);
            
            return (
                <tr key={student.id} style={{ backgroundColor: '#eff6ff' }}>
                    <td style={cellStyle}><div className="w-1.5 h-1.5 rounded-full bg-blue-500 mx-auto" /></td>
                    
                    {/* Name Input */}
                    <td style={cellStyle}>
                        <input 
                            className="w-full p-1.5 border rounded text-xs" 
                            value={editFormData.name} 
                            onChange={e => setEditFormData({ ...editFormData, name: e.target.value })} 
                        />
                    </td>
                    
                    {/* ID Input */}
                    <td style={cellStyle}>
                        <input 
                            className="w-full p-1.5 border rounded text-xs" 
                            value={editFormData.studentId} 
                            onChange={e => setEditFormData({ ...editFormData, studentId: e.target.value })} 
                        />
                    </td>
                    
                    {/* Type Dropdown */}
                    <td style={cellStyle}>
                        <CustomEditDropdown 
                            value={editFormData.type} 
                            options={['Regular', 'Irregular']} 
                            onChange={v => setEditFormData({ ...editFormData, type: v })} 
                        />
                    </td>

                    {/* Grade Level (Read Only for now, or add dropdown if needed) */}
                     <td style={cellStyle}>
                        <span className="text-gray-500 text-xs">{student.gradeLevel}</span>
                    </td>

                    {/* Section Dropdown */}
                    <td style={cellStyle}>
                        <CustomEditDropdown 
                            value={editFormData.program} 
                            options={availableSections.length ? availableSections : [student.program]} 
                            onChange={v => setEditFormData({ ...editFormData, program: v })} 
                        />
                    </td>

                    <td style={cellStyle}><span className="text-gray-400 italic">Editing...</span></td>
                </tr>
            );
        }

        // --- RENDER STANDARD ROW ---
        const isSelected = selectedItem?.id === student.id;
        const isChecked = selectedIds.includes(student.id);
        const showCheckbox = !!promotionMode;

        return (
            <tr
                key={student.id}
                onClick={() => handleStudentClick(student)}
                className="hover:bg-gray-50 transition-colors cursor-pointer"
                style={{ backgroundColor: isSelected ? '#eff6ff' : 'transparent' }}
            >
                {/* 1. Index / Checkbox */}
                <td style={{ ...cellStyle, textAlign: 'center', width: '48px' }} onClick={e => e.stopPropagation()}>
                    {showCheckbox ? (
                        <div style={{ display: 'flex', justifyContent: 'center', zIndex: 50, position: 'relative' }}>
                            <input
                                type="checkbox"
                                checked={isChecked}
                                onChange={(e) => {
                                    e.stopPropagation();
                                    if (isChecked) setSelectedIds(prev => prev.filter(id => id !== student.id));
                                    else setSelectedIds(prev => [...prev, student.id]);
                                }}
                                style={{ cursor: 'pointer', width: '16px', height: '16px' }}
                            />
                        </div>
                    ) : (startIndex + index + 1)}
                </td>

                {/* 2. Student Name */}
                <td style={{ ...cellStyle, fontWeight: 500, color: '#111827' }}>
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-gray-500"><User size={16} /></div>
                        {student.name}
                    </div>
                </td>

                {/* 3. Student ID */}
                <td style={cellStyle}>{student.studentId}</td>

                {/* 4. Type */}
                <td style={cellStyle}>{student.type}</td>

                {/* 5. Grade Level (🟢 ADDED to match Headers) */}
                <td style={cellStyle}>{student.gradeLevel}</td>

                {/* 6. Program/Section (Now holds the Section Name) */}
                <td style={cellStyle}>{student.program}</td>

                {/* 7. RFID Link */}
                <td style={cellStyle}><LinkStatusBadge isLinked={student.isLinked} student={student} /></td>
            </tr>
        );
    };

    // --- ACTION BAR ---
    let variant = 'student';
    if (promotionMode === 'individual') variant = 'promotion';
    if (promotionMode === 'graduation') variant = 'graduation';

    const actionBar = (
        <AnimatePresence>
            {shouldShowActions && (
                <SelectionActionBar
                    key="bar"
                    variant={variant}
                    selectedItem={selectedItem}
                    onClearSelection={() => {
                        if (promotionMode) exitPromotion();
                        else { setSelectedItem(null); setIsEditing(false); }
                    }}
                    // Edit
                    isEditing={isEditing}
                    onEditStudent={() => { setEditFormData({ ...selectedItem }); setIsEditing(true); }}
                    onSaveStudent={handleEditSave}
                    onCancelEdit={() => { setIsEditing(false); setEditFormData({}); }}
                    activeDropdown={activeActionDropdown}
                    onToggleDropdown={t => setActiveActionDropdown(prev => prev === t ? null : t)}
                    onArchiveOption={opt => console.log(opt)}
                    // Promote
                    selectedCount={selectedIds.length}
                    onAssignStudents={() => setIsAssignmentModalOpen(true)}
                    onSavePromotion={() => { onGoBack(); }}
                    onCancelPromotion={exitPromotion}
                />
            )}
        </AnimatePresence>
    );

    return (
        <>
            <AddStudentModal isOpen={isAddModalOpen} onClose={() => setIsAddModalOpen(false)} />
            <PromotionModal
                isOpen={isPromotionModalOpen} onClose={() => setIsPromotionModalOpen(false)}
                nextSections={drilldownContext ? getNextLevelSections(drilldownContext.level) : []}
                onBulkPromote={handleBulkPromote}
                onSelectType={t => { setIsPromotionModalOpen(false); if (t === 'individual') { setPromotionMode('individual'); } }}
            />
            <AssignmentModal
                isOpen={isAssignmentModalOpen} onClose={() => setIsAssignmentModalOpen(false)}
                nextSections={drilldownContext ? getNextLevelSections(drilldownContext.level) : []}
                onConfirm={handleIndividualAssign}
            />

            <GenericTable
                title={drilldownContext ? `Students in ${drilldownContext.level} - ${drilldownContext.sectionName}` : "Student Master List"}
                subtitle={drilldownContext ? "Manage students in this section" : "Manage all student records"}

                tabs={!drilldownContext ? [
                    { label: 'All', id: 'all' },
                    { label: 'Preschool', id: 'preschool' },
                    { label: 'Primary Education', id: 'primaryEducation' },
                    { label: 'Intermediate', id: 'intermediate' },
                    { label: 'Junior High School', id: 'juniorHighSchool' },
                    { label: 'Senior High School', id: 'seniorHighSchool' },
                    { label: 'Higher Education', id: 'higherEducation' }
                ] : []}

                activeTab={activeTab}
                onTabChange={setActiveTab}
                searchTerm={searchTerm}
                onSearchChange={setSearchTerm}
                customActions={switcher}
                
                overrideHeader={headerVisible ? actionBar : null}

                onPrimaryAction={() => drilldownContext ? onGoBack() : setIsAddModalOpen(true)}
                primaryActionLabel={drilldownContext ? "Go Back" : "Add Student"}
                primaryActionIcon={drilldownContext ? <ArrowLeft size={16} /> : <Plus size={16} />}
                onSecondaryAction={handlePromoteClick}
                secondaryActionLabel={drilldownContext && !promotionMode ? "Promote Students" : null}
                secondaryActionIcon={drilldownContext && !promotionMode ? <GraduationCap size={16} /> : null}
                
                // 🟢 UPDATED COLUMNS: Added "Grade Level"
                columns={['Student Name', 'Student ID', 'Type', 'Grade Level', 'Program/Section', 'RFID Link']}
                data={filteredStudents}
                renderRow={renderRow}
                metrics={[{ label: "Total Students", value: filteredStudents.length }]}
            />
        </>
    );
};