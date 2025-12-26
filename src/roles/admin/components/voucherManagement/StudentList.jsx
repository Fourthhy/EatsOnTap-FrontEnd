import React, { useState, useMemo } from 'react';
import { Search, Plus, User, ArrowLeft, School, Users } from 'lucide-react';
import { FaChalkboardTeacher } from "react-icons/fa";
import { AnimatePresence } from 'framer-motion';

// --- IMPORTS ---
import { generateData } from './mockData';
import { AddStudentModal } from './AddStudentModal';
import { LinkStatusBadge } from './LinkStatusBadge';
import { GenericTable } from '../../../../components/global/table/GenericTable';

// --- SEPARATED CONCERNS ---
import { programsAndSections, adviserRegistry } from './studentListConfig';
import { SelectionActionBar } from './SelectionActionBar';
import { SwitcherButton } from './SwitcherButton';

const StudentList = () => {
    // --- STATE ---
    const [viewMode, setViewMode] = useState('sections'); 
    const [activeTab, setActiveTab] = useState('all');
    const [searchTerm, setSearchTerm] = useState('');
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    
    // Selection State
    const [selectedSection, setSelectedSection] = useState(null); 
    const [isActionBarVisible, setIsActionBarVisible] = useState(false); 
    const [activeActionDropdown, setActiveActionDropdown] = useState(null); 

    const allStudents = useMemo(() => generateData(), []);

    // --- HELPER: Flatten Levels for Action Bar logic ---
    const allLevelsFlat = useMemo(() => {
        let levels = [];
        programsAndSections.forEach(cat => {
            cat.levels.forEach(lvl => {
                levels.push({ ...lvl, category: cat.category });
            });
        });
        return levels;
    }, []);

    const getNextLevelSections = (currentLevelName) => {
        const currentIndex = allLevelsFlat.findIndex(l => l.gradeLevel === currentLevelName);
        if (currentIndex !== -1 && currentIndex < allLevelsFlat.length - 1) {
            return allLevelsFlat[currentIndex + 1].sections;
        }
        return [];
    };

    // --- HELPER: Filtering Sections ---
    const getFlattenedSections = () => {
        const relevantCategories = activeTab === 'all' 
            ? programsAndSections 
            : programsAndSections.filter(p => p.category === activeTab);

        const flatList = [];
        relevantCategories.forEach(cat => {
            cat.levels.forEach(level => {
                level.sections.forEach(section => {
                    const searchLower = searchTerm.toLowerCase();
                    const matchesSearch = 
                        section.name.toLowerCase().includes(searchLower) || 
                        section.adviser.toLowerCase().includes(searchLower) ||
                        level.gradeLevel.toLowerCase().includes(searchLower);

                    if (matchesSearch) {
                        flatList.push({
                            id: `${level.gradeLevel}-${section.name}`,
                            category: cat.category,
                            level: level.gradeLevel,
                            sectionName: section.name,
                            adviser: section.adviser,
                            studentCount: section.studentCount
                        });
                    }
                });
            });
        });
        return flatList;
    };

    // --- HELPER: Filtering Advisers ---
    const getAdviserData = () => {
        const tabToDeptMap = {
            'all': 'All',
            'preschool': 'Preschool',
            'primaryEducation': 'Primary Education',
            'intermediate': 'Intermediate',
            'juniorHighSchool': 'Junior High School',
            'seniorHighSchool': 'Senior High School',
            'higherEducation': 'Higher Education'
        };

        const targetDept = tabToDeptMap[activeTab];

        return adviserRegistry.filter(teacher => {
            const matchesTab = activeTab === 'all' || teacher.department === targetDept;
            const matchesSearch = teacher.name.toLowerCase().includes(searchTerm.toLowerCase());
            return matchesTab && matchesSearch;
        });
    };

    // --- MAIN FILTER LOGIC ---
    const getTableData = () => {
        if (viewMode === 'advisers') return getAdviserData();
        if (viewMode === 'sections') return getFlattenedSections();

        if (viewMode === 'drilldown' && selectedSection) {
            return allStudents.filter(s => {
                const studentProgram = (s.program || "").toLowerCase();
                const level = (selectedSection.level || "").toLowerCase();
                const sectionName = (selectedSection.sectionName || "").toLowerCase();
                return studentProgram === level || sectionName.includes(studentProgram);
            });
        }

        return allStudents.filter(student => {
            let matchesTab = true;
            const level = (student.program || student.section || "").toLowerCase();

            if (activeTab !== 'all') {
                const isGradeLevel = (s, min, max) => {
                    if (!s.includes("grade")) return false;
                    const m = s.match(/\d+/);
                    return m && parseInt(m[0]) >= min && parseInt(m[0]) <= max;
                };
                const isHigherEd = (s) => s.startsWith('bs') || s.startsWith('ab');

                switch (activeTab) {
                    case 'preschool': matchesTab = level.includes('kinder') || level.includes('preschool'); break;
                    case 'primaryEducation': matchesTab = isGradeLevel(level, 1, 3); break;
                    case 'intermediate': matchesTab = isGradeLevel(level, 4, 6); break;
                    case 'juniorHighSchool': matchesTab = isGradeLevel(level, 7, 10); break;
                    case 'seniorHighSchool': matchesTab = isGradeLevel(level, 11, 12); break;
                    case 'higherEducation': matchesTab = isHigherEd(level); break;
                    default: matchesTab = false;
                }
            }
            if (searchTerm && matchesTab) {
                matchesTab = student.name.toLowerCase().includes(searchTerm.toLowerCase());
            }
            return matchesTab;
        });
    };

    // --- RENDER FUNCTIONS ---
    const cellStyle = {
        fontFamily: 'geist, sans-serif', fontSize: '12px', color: '#4b5563',
        padding: '6px 0px', borderBottom: '1px solid #f3f4f6'
    };

    const renderStudentRow = (student, index, startIndex) => (
        <tr key={student.id} className="hover:bg-gray-50 transition-colors">
            <td style={{ ...cellStyle, textAlign: 'center', width: '48px' }}></td>
            <td style={{ ...cellStyle, fontWeight: 500, color: '#111827' }}>
                <div className="flex items-center gap-3">
                    <div className="w-8 h-7.5 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden text-gray-500">
                        <User size={16} />
                    </div>
                    <span>{student.name}</span>
                </div>
            </td>
            <td style={cellStyle}>{student.studentId}</td>
            <td style={cellStyle}>{student.type}</td>
            <td style={cellStyle}>{student.program}</td>
            <td style={cellStyle}><LinkStatusBadge isLinked={student.isLinked} student={student} /></td>
        </tr>
    );

    const renderSectionRow = (section, index, startIndex) => {
        const isSelected = selectedSection && selectedSection.id === section.id;
        return (
            <tr 
                key={section.id} 
                onClick={() => {
                    if (!isSelected) {
                        setSelectedSection(section);
                        setIsActionBarVisible(true);
                    } else {
                        setSelectedSection(null);
                    }
                }}
                className="transition-colors cursor-pointer"
                style={{ backgroundColor: isSelected ? '#eff6ff' : 'transparent' }}
            >
                <td style={{ ...cellStyle, textAlign: 'center', width: '48px' }}></td>
                <td style={{ ...cellStyle, fontWeight: 500, color: '#111827' }}>{section.level}</td>
                <td style={cellStyle}>{section.sectionName}</td>
                <td style={cellStyle}>
                    <div className="flex items-center gap-2">
                        <div className="w-8 h-7.5 rounded-full bg-blue-50 flex items-center justify-center text-blue-600">
                            <User size={16} />
                        </div>
                        {section.adviser}
                    </div>
                </td>
                <td style={cellStyle}>{section.studentCount}</td>
            </tr>
        );
    };

    const renderAdviserRow = (adviser, index, startIndex) => (
        <tr key={adviser.id} className="h-11 hover:bg-gray-50 transition-colors">
            <td style={{ ...cellStyle, textAlign: 'center', width: '48px' }}></td>
            <td style={{ ...cellStyle, fontWeight: 500, color: '#111827' }}>{adviser.name}</td>
            <td style={cellStyle}>{adviser.department}</td>
            <td style={cellStyle}>{adviser.assignment}</td>
            <td style={cellStyle}>{adviser.years} Years</td>
        </tr>
    );

    // --- VARIABLES ---
    const isSectionView = viewMode === 'sections';
    const isDrilldown = viewMode === 'drilldown';
    const isAdviserView = viewMode === 'advisers';

    const getColumns = () => {
        if (isSectionView) return ['Level', 'Section Name', 'Adviser', 'Student Count'];
        if (isAdviserView) return ['Teacher Name', 'Department', 'Assignment', 'Years of Service'];
        return ['Student Name', 'Student ID', 'Type', 'Program / Section', 'RFID Link'];
    };

    const getRenderRow = () => {
        if (isSectionView) return renderSectionRow;
        if (isAdviserView) return renderAdviserRow;
        return renderStudentRow;
    };

    const actionBarWithAnimation = (
        <AnimatePresence onExitComplete={() => setIsActionBarVisible(false)}>
            {isSectionView && selectedSection && (
                <SelectionActionBar 
                    key="action-bar"
                    selectedSection={selectedSection}
                    onClearSelection={() => setSelectedSection(null)}
                    activeDropdown={activeActionDropdown}
                    onToggleDropdown={(type) => setActiveActionDropdown(prev => prev === type ? null : type)}
                    nextSections={getNextLevelSections(selectedSection.level)}
                    onViewStudents={() => setViewMode('drilldown')}
                />
            )}
        </AnimatePresence>
    );

    const viewSwitcher = !isDrilldown ? (
        <div style={{ backgroundColor: '#f3f4f6', padding: '4px', borderRadius: '8px', display: 'flex', gap: '4px' }}>
            <SwitcherButton 
                mode="sections" 
                currentMode={viewMode} 
                icon={<School size={14} />} 
                label="View Sections" 
                onClick={() => { setViewMode('sections'); setSelectedSection(null); setIsActionBarVisible(false); }} 
            />
            <SwitcherButton 
                mode="students" 
                currentMode={viewMode} 
                icon={<Users size={14} />} 
                label="View Students" 
                onClick={() => { setViewMode('students'); setSelectedSection(null); setIsActionBarVisible(false); }} 
            />
            <SwitcherButton 
                mode="advisers" 
                currentMode={viewMode} 
                icon={<FaChalkboardTeacher size={14} />} 
                label="View Advisers" 
                onClick={() => { setViewMode('advisers'); setSelectedSection(null); setIsActionBarVisible(false); }} 
            />
        </div>
    ) : null;

    return (
        <>
            <AddStudentModal isOpen={isAddModalOpen} onClose={() => setIsAddModalOpen(false)} />

            <GenericTable
                title={isDrilldown ? `Students in ${selectedSection?.level} - ${selectedSection?.sectionName}` : 
                      (isSectionView ? "Section Overview" : 
                      (isAdviserView ? "Faculty Management" : "Student Master List"))}
                
                subtitle={isDrilldown ? "Manage students in this specific section" : 
                         (isSectionView ? "Manage academic sections and advisers" : 
                         (isAdviserView ? "Manage teacher assignments" : "Manage individual student records"))}
                
                tabs={isDrilldown ? [] : [
                    { label: 'All', id: 'all' },
                    { label: 'Preschool', id: 'preschool' },
                    { label: 'Primary Education', id: 'primaryEducation' },
                    { label: 'Intermediate', id: 'intermediate' },
                    { label: 'Junior High School', id: 'juniorHighSchool' },
                    { label: 'Senior High School', id: 'seniorHighSchool' },
                    { label: 'Higher Education', id: 'higherEducation' },
                ]}
                activeTab={activeTab}
                onTabChange={setActiveTab}
                
                searchTerm={searchTerm}
                onSearchChange={setSearchTerm}

                metrics={[{ label: "Total Records", value: getTableData().length }]}
                customActions={viewSwitcher}
                overrideHeader={isActionBarVisible ? actionBarWithAnimation : null}

                onPrimaryAction={() => {
                    if (isDrilldown) {
                        setViewMode('sections');
                        setSelectedSection(null);
                        setIsActionBarVisible(false);
                    } else if (isSectionView) {
                        console.log("Add Section Modal");
                    } else if (isAdviserView) {
                        console.log("Add Teacher Modal");
                    } else {
                        setIsAddModalOpen(true);
                    }
                }}
                primaryActionLabel={isDrilldown ? "Go Back" : (isSectionView ? "Add Section" : (isAdviserView ? "Add Teacher" : "Add Student"))}
                primaryActionIcon={isDrilldown ? <ArrowLeft size={16} /> : <Plus size={16} />}

                columns={getColumns()}
                data={getTableData()}
                renderRow={getRenderRow()}
            />
        </>
    );
};

export { StudentList };