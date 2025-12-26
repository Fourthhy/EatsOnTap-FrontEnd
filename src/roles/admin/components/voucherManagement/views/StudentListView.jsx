import React, { useState, useMemo } from 'react';
import { Plus, ArrowLeft, GraduationCap, User } from 'lucide-react';
import { AnimatePresence } from 'framer-motion';

import { GenericTable } from '../../../../../components/global/table/GenericTable';
import { SelectionActionBar } from '../SelectionActionBar';
import { generateData } from '../mockData';
import { programsAndSections } from '../studentListConfig';
import { AddStudentModal } from '../AddStudentModal';
import { PromotionModal, AssignmentModal } from '../components/PromotionModals';
import { CustomEditDropdown } from '../components/CustomEditDropdown';
import { LinkStatusBadge } from '../LinkStatusBadge';

export const StudentListView = ({ switcher, drilldownContext, onGoBack }) => {
    // --- STATE ---
    const [activeTab, setActiveTab] = useState('all');
    const [searchTerm, setSearchTerm] = useState('');
    const [allStudents, setAllStudents] = useState(() => generateData());
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);

    // Selection
    const [selectedItem, setSelectedItem] = useState(null);
    const [selectedIds, setSelectedIds] = useState([]);
    const [isActionBarVisible, setIsActionBarVisible] = useState(false);
    const [activeActionDropdown, setActiveActionDropdown] = useState(null);

    // Edit Mode
    const [isEditing, setIsEditing] = useState(false);
    const [editFormData, setEditFormData] = useState({});

    // Promotion Mode
    const [promotionMode, setPromotionMode] = useState(null); // 'individual', 'graduation'
    const [isPromotionModalOpen, setIsPromotionModalOpen] = useState(false);
    const [isAssignmentModalOpen, setIsAssignmentModalOpen] = useState(false);

    // --- HELPERS ---
    const allLevelsFlat = useMemo(() => {
        let levels = [];
        programsAndSections.forEach(cat => cat.levels.forEach(lvl => levels.push({ ...lvl, category: cat.category })));
        return levels;
    }, []);

    const isGraduatingLevel = (levelName) => {
        const index = allLevelsFlat.findIndex(l => l.gradeLevel === levelName);
        return index === allLevelsFlat.length - 1;
    };

    const getNextLevelSections = (currentLevelName) => {
        const index = allLevelsFlat.findIndex(l => l.gradeLevel === currentLevelName);
        if (index !== -1 && index < allLevelsFlat.length - 1) return allLevelsFlat[index + 1].sections;
        return [];
    };

    const getSectionsForStudent = (program) => {
        const levelObj = allLevelsFlat.find(l => program.includes(l.gradeLevel));
        return levelObj ? levelObj.sections.map(s => s.name) : [];
    };

    // --- FILTERING ---
    const filteredStudents = useMemo(() => {
        // 1. Drilldown Context (Specific Section)
        if (drilldownContext) {
            return allStudents.filter(s => {
                const program = (s.program || "").toLowerCase();
                const level = drilldownContext.level.toLowerCase();
                const section = drilldownContext.sectionName.toLowerCase();
                // Match program to either the level name or the specific section name
                return program === level || section.includes(program) || program.includes(section);
            });
        }
        
        // 2. Global List (All Students with Tabs)
        return allStudents.filter(student => {
            let matchesTab = true;
            const level = (student.program || student.section || "").toLowerCase();

            if (activeTab !== 'all') {
                const isGradeLevel = (s, min, max) => {
                    if (!s.includes("grade")) return false;
                    const m = s.match(/\d+/);
                    return m && parseInt(m[0]) >= min && parseInt(m[0]) <= max;
                };
                const isHigherEd = (s) => s.startsWith('bs') || s.startsWith('ab') || s.startsWith('associate');

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
                        matchesTab = isHigherEd(level); 
                        break;
                    default: 
                        matchesTab = false;
                }
            }

            if (searchTerm && matchesTab) {
                matchesTab = student.name.toLowerCase().includes(searchTerm.toLowerCase());
            }
            return matchesTab;
        });
    }, [allStudents, drilldownContext, activeTab, searchTerm]);

    // --- HANDLERS: PROMOTION ---
    const handlePromoteClick = () => {
        if (!drilldownContext) return;
        if (isGraduatingLevel(drilldownContext.level)) {
            setPromotionMode('graduation');
            setSelectedIds(filteredStudents.map(s => s.id));
            setIsActionBarVisible(true);
        } else {
            setIsPromotionModalOpen(true);
        }
    };

    const handleBulkPromote = (newSection) => {
        const idsToPromote = filteredStudents.map(s => s.id);
        setAllStudents(prev => prev.map(s => idsToPromote.includes(s.id) ? { ...s, program: newSection } : s));
        setIsPromotionModalOpen(false);
    };

    const handleIndividualAssign = (newSection) => {
        setAllStudents(prev => prev.map(s => selectedIds.includes(s.id) ? { ...s, program: newSection } : s));
        setIsAssignmentModalOpen(false);
        setSelectedIds([]);
    };

    const exitPromotion = () => {
        setPromotionMode(null);
        setSelectedIds([]);
        setIsActionBarVisible(false);
    };

    // --- HANDLERS: EDIT ---
    const handleEditSave = () => {
        setAllStudents(prev => prev.map(s => s.id === selectedItem.id ? editFormData : s));
        setSelectedItem(editFormData);
        setIsEditing(false);
    };

    const handleStudentClick = (student) => {
        if (isEditing || promotionMode) return;
        
        if (selectedItem?.id === student.id) {
            setSelectedItem(null);
            setIsActionBarVisible(false);
        } else {
            setSelectedItem(student);
            setIsActionBarVisible(true);
        }
    };

    // --- RENDERERS ---
    const cellStyle = { fontSize: '12px', color: '#4b5563', borderBottom: '1px solid #f3f4f6', height: '44px', verticalAlign: 'middle' };

    const renderRow = (student, index, startIndex) => {
        if (isEditing && selectedItem?.id === student.id) {
            const availableSections = getSectionsForStudent(student.program);
            return (
                <tr key={student.id} style={{ backgroundColor: '#eff6ff' }}>
                    <td style={cellStyle}><div className="w-1.5 h-1.5 rounded-full bg-blue-500 mx-auto"/></td>
                    <td style={cellStyle}><input className="w-full p-1.5 border rounded text-xs" value={editFormData.name} onChange={e => setEditFormData({...editFormData, name: e.target.value})} /></td>
                    <td style={cellStyle}><input className="w-full p-1.5 border rounded text-xs" value={editFormData.studentId} onChange={e => setEditFormData({...editFormData, studentId: e.target.value})} /></td>
                    <td style={cellStyle}><CustomEditDropdown value={editFormData.type} options={['Regular', 'Irregular']} onChange={v => setEditFormData({...editFormData, type: v})} /></td>
                    <td style={cellStyle}><CustomEditDropdown value={editFormData.program} options={availableSections.length ? availableSections : [student.program]} onChange={v => setEditFormData({...editFormData, program: v})} /></td>
                    <td style={cellStyle}><span className="text-gray-400 italic">Editing...</span></td>
                </tr>
            );
        }

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
                <td style={{ ...cellStyle, fontWeight: 500, color: '#111827' }}>
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-gray-500"><User size={16} /></div>
                        {student.name}
                    </div>
                </td>
                <td style={cellStyle}>{student.studentId}</td>
                <td style={cellStyle}>{student.type}</td>
                <td style={cellStyle}>{student.program}</td>
                <td style={cellStyle}><LinkStatusBadge isLinked={student.isLinked} student={student} /></td>
            </tr>
        );
    };

    // --- ACTION BAR ---
    let variant = 'student';
    if (promotionMode === 'individual') variant = 'promotion';
    if (promotionMode === 'graduation') variant = 'graduation';

    const actionBar = (
        <AnimatePresence onExitComplete={() => setIsActionBarVisible(false)}>
            {(isActionBarVisible || promotionMode) && (
                <SelectionActionBar 
                    key="bar"
                    variant={variant}
                    selectedItem={selectedItem}
                    onClearSelection={() => {
                        if (promotionMode) exitPromotion();
                        else { setSelectedItem(null); setIsActionBarVisible(false); setIsEditing(false); }
                    }}
                    // Edit
                    isEditing={isEditing}
                    onEditStudent={() => { setEditFormData({...selectedItem}); setIsEditing(true); }}
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
                onSelectType={t => { setIsPromotionModalOpen(false); if(t === 'individual') { setPromotionMode('individual'); setIsActionBarVisible(true); } }}
            />
            <AssignmentModal 
                isOpen={isAssignmentModalOpen} onClose={() => setIsAssignmentModalOpen(false)}
                nextSections={drilldownContext ? getNextLevelSections(drilldownContext.level) : []}
                onConfirm={handleIndividualAssign}
            />

            <GenericTable
                title={drilldownContext ? `Students in ${drilldownContext.level} - ${drilldownContext.sectionName}` : "Student Master List"}
                subtitle={drilldownContext ? "Manage students in this section" : "Manage all student records"}
                
                // FIXED: Full Tabs Configuration
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
                overrideHeader={actionBar}
                onPrimaryAction={() => drilldownContext ? onGoBack() : setIsAddModalOpen(true)}
                primaryActionLabel={drilldownContext ? "Go Back" : "Add Student"}
                primaryActionIcon={drilldownContext ? <ArrowLeft size={16}/> : <Plus size={16}/>}
                onSecondaryAction={handlePromoteClick}
                secondaryActionLabel={drilldownContext && !promotionMode ? "Promote Students" : null}
                secondaryActionIcon={drilldownContext && !promotionMode ? <GraduationCap size={16} /> : null}
                columns={['Student Name', 'Student ID', 'Type', 'Program/Section', 'RFID Link']}
                data={filteredStudents}
                renderRow={renderRow}
                metrics={[{ label: "Total Students", value: filteredStudents.length }]}
            />
        </>
    );
};