import React, { useState, useMemo } from 'react';
import { 
    Search, Calendar, Plus, User, 
    ArrowLeft, Archive, TrendingUp, Eye, 
    X, ChevronDown, School, Users 
} from 'lucide-react';
import { FaChalkboardTeacher } from "react-icons/fa";
import { motion, AnimatePresence } from 'framer-motion';
import { generateData } from './mockData';
import { AddStudentModal } from './AddStudentModal';
import { LinkStatusBadge } from './LinkStatusBadge';
import { GenericTable } from '../../../../components/global/table/GenericTable';

// --- DATA SOURCE: Programs & Sections ---
const programsAndSections = [
    {
        category: "preschool",
        levels: [
            { gradeLevel: "Nursery", sections: [{ name: "Sun", adviser: "Ms. Elena Ramos", studentCount: 15 }, { name: "Moon", adviser: "Ms. Clara Diaz", studentCount: 14 }] },
            { gradeLevel: "Kindergarten", sections: [{ name: "Angels", adviser: "Mrs. Lita Castro", studentCount: 20 }, { name: "Stars", adviser: "Ms. Joy Santos", studentCount: 22 }] }
        ]
    },
    {
        category: "primaryEducation",
        levels: [
            { gradeLevel: "Grade 1", sections: [{ name: "Luke", adviser: "Mr. Roberto Gomez", studentCount: 35 }, { name: "John", adviser: "Ms. Sarah Lim", studentCount: 34 }, { name: "Matthew", adviser: "Mrs. Anna Reyes", studentCount: 35 }, { name: "Mark", adviser: "Mr. Joseph Cruz", studentCount: 33 }] },
            { gradeLevel: "Grade 2", sections: [{ name: "Peter", adviser: "Ms. Maria Leon", studentCount: 30 }, { name: "James", adviser: "Mr. David Tan", studentCount: 31 }, { name: "Andrew", adviser: "Mrs. Grace Pua", studentCount: 29 }] },
            { gradeLevel: "Grade 3", sections: [{ name: "Philip", adviser: "Ms. Rose Villa", studentCount: 32 }, { name: "Bartholomew", adviser: "Mr. Kevin Sy", studentCount: 30 }, { name: "Thomas", adviser: "Mrs. Elena Co", studentCount: 31 }] }
        ]
    },
    {
        category: "intermediate",
        levels: [
            { gradeLevel: "Grade 4", sections: [{ name: "Michael", adviser: "Mr. Arthur King", studentCount: 35 }, { name: "Gabriel", adviser: "Ms. Felicity Ong", studentCount: 34 }, { name: "Raphael", adviser: "Mrs. Gina Lu", studentCount: 35 }] },
            { gradeLevel: "Grade 5", sections: [{ name: "Ignatius", adviser: "Mr. Paul Chua", studentCount: 36 }, { name: "Francis", adviser: "Ms. Irene Dy", studentCount: 35 }, { name: "Dominic", adviser: "Mrs. Helen Ng", studentCount: 36 }] },
            { gradeLevel: "Grade 6", sections: [{ name: "Lorenzo", adviser: "Mr. Victor Yu", studentCount: 40 }, { name: "Pedro", adviser: "Ms. Karen Go", studentCount: 38 }, { name: "Fatima", adviser: "Mrs. Linda Ho", studentCount: 39 }] }
        ]
    },
    {
        category: "juniorHighSchool",
        levels: [
            { gradeLevel: "Grade 7", sections: [{ name: "Rizal", adviser: "Mr. Antonio Luna", studentCount: 42 }, { name: "Bonifacio", adviser: "Ms. Melchora S.", studentCount: 41 }, { name: "Luna", adviser: "Mr. Juan Novicio", studentCount: 40 }] },
            { gradeLevel: "Grade 8", sections: [{ name: "Faith", adviser: "Ms. Charity Hope", studentCount: 40 }, { name: "Hope", adviser: "Mr. Peter Pan", studentCount: 40 }, { name: "Charity", adviser: "Mrs. Wendy D.", studentCount: 39 }] },
            { gradeLevel: "Grade 9", sections: [{ name: "Love", adviser: "Mr. Romeo Mon", studentCount: 41 }, { name: "Peace", adviser: "Ms. Juliet Cap", studentCount: 41 }, { name: "Joy", adviser: "Mrs. Mercy Grace", studentCount: 40 }] },
            { gradeLevel: "Grade 10", sections: [{ name: "St.Paul", adviser: "Mr. Timothy Teo", studentCount: 45 }, { name: "St.Augustine", adviser: "Ms. Monica A.", studentCount: 44 }, { name: "St.Peter", adviser: "Mr. Simon Key", studentCount: 45 }] }
        ]
    },
    {
        category: "seniorHighSchool",
        levels: [
            { gradeLevel: "Grade 11", sections: [{ name: "STEM A", adviser: "Mr. Isaac Newton", studentCount: 35 }, { name: "STEM B", adviser: "Ms. Marie Curie", studentCount: 34 }, { name: "ABM", adviser: "Mr. Adam Smith", studentCount: 38 }, { name: "HUMSS", adviser: "Ms. Jane Austen", studentCount: 36 }] },
            { gradeLevel: "Grade 12", sections: [{ name: "STEM A", adviser: "Mr. Albert E.", studentCount: 33 }, { name: "STEM B", adviser: "Ms. Rosalind F.", studentCount: 32 }, { name: "ABM", adviser: "Mr. John Keynes", studentCount: 35 }, { name: "HUMSS", adviser: "Ms. Virginia W.", studentCount: 34 }] }
        ]
    },
    {
        category: "higherEducation",
        levels: [
            { gradeLevel: "1st Year", sections: [{ name: "BSIT-1A", adviser: "Dr. Alan Turing", studentCount: 40 }, { name: "BSIT-1B", adviser: "Dr. Grace Hopper", studentCount: 38 }, { name: "BSCS-1A", adviser: "Dr. Ada Lovelace", studentCount: 35 }] },
            { gradeLevel: "2nd Year", sections: [{ name: "BSIT-2A", adviser: "Dr. Ken Thompson", studentCount: 35 }, { name: "BSIT-2B", adviser: "Dr. Dennis R.", studentCount: 34 }, { name: "BSCS-2A", adviser: "Dr. Linus T.", studentCount: 30 }] },
            { gradeLevel: "3rd Year", sections: [{ name: "BSIT-3A", adviser: "Dr. Steve Jobs", studentCount: 30 }, { name: "BSIT-3B", adviser: "Dr. Bill Gates", studentCount: 28 }] },
            { gradeLevel: "4th Year", sections: [{ name: "BSIT-4A", adviser: "Dr. Mark Z.", studentCount: 25 }, { name: "BSCS-4A", adviser: "Dr. Elon M.", studentCount: 22 }] }
        ]
    }
];

// --- MOCK DATA: Advisers (Updated for Filter Testing) ---
const adviserRegistry = [
    { id: "T-001", name: "Mr. Roberto Gomez", department: "Primary Education", assignment: "Grade 1 - Luke", years: 5 },
    { id: "T-002", name: "Ms. Sarah Lim", department: "Primary Education", assignment: "Grade 1 - John", years: 3 },
    { id: "T-003", name: "Dr. Alan Turing", department: "Higher Education", assignment: "BSIT-1A", years: 10 },
    { id: "T-004", name: "Mr. Isaac Newton", department: "Senior High School", assignment: "STEM A", years: 8 },
    { id: "T-005", name: "Ms. Elena Ramos", department: "Preschool", assignment: "Nursery - Sun", years: 2 },
    { id: "T-006", name: "Mr. Arthur King", department: "Intermediate", assignment: "Grade 4 - Michael", years: 6 },
    { id: "T-007", name: "Mr. Antonio Luna", department: "Junior High School", assignment: "Grade 7 - Rizal", years: 4 },
];

// --- SUB-COMPONENT: Selection Action Bar (Unchanged) ---
const SelectionActionBar = ({ 
    selectedSection, 
    onClearSelection, 
    activeDropdown, 
    onToggleDropdown, 
    nextSections, 
    onViewStudents 
}) => {
    const styles = {
        actionBarContainer: {
            height: '100%', width: '100%', backgroundColor: '#4268BD', color: 'white',
            padding: '0 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            fontFamily: 'geist, sans-serif'
        },
        ghostButton: {
            backgroundColor: 'rgba(255, 255, 255, 0.1)', color: 'white', padding: '8px 16px',
            borderRadius: '8px', fontSize: '13px', fontWeight: 500, border: 'none', cursor: 'pointer',
            display: 'flex', alignItems: 'center', gap: '8px', transition: 'background-color 0.2s'
        },
        primaryButton: {
            backgroundColor: 'white', color: '#4268BD', padding: '8px 16px',
            borderRadius: '8px', fontSize: '13px', fontWeight: 600, border: 'none', cursor: 'pointer',
            display: 'flex', alignItems: 'center', gap: '8px', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
        },
        dropdownMenu: {
            position: 'absolute', right: 0, marginTop: '8px', backgroundColor: 'white',
            borderRadius: '8px', boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
            overflow: 'hidden', zIndex: 50, color: '#1f2937', padding: '4px 0', minWidth: '160px'
        },
        dropdownItem: {
            width: '100%', textAlign: 'left', padding: '8px 16px', fontSize: '14px',
            backgroundColor: 'transparent', border: 'none', cursor: 'pointer', color: '#374151',
            transition: 'background-color 0.15s'
        },
        sectionLabel: {
            fontSize: '11px', fontWeight: 600, color: '#9ca3af', textTransform: 'uppercase',
            letterSpacing: '0.05em', padding: '8px 16px'
        }
    };

    return (
        <motion.div
            key="action-bar"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
            style={styles.actionBarContainer}
        >
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                <button onClick={onClearSelection} style={{ padding: '8px', borderRadius: '50%', background: 'transparent', border: 'none', cursor: 'pointer', color: 'white', display: 'flex' }}>
                    <X size={20} />
                </button>
                <span style={{ fontWeight: 500, fontSize: '14px' }}>
                    {selectedSection.level} - {selectedSection.sectionName} Selected
                </span>
            </div>

            <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                <div style={{ position: 'relative' }}>
                    <button 
                        onClick={(e) => { e.stopPropagation(); onToggleDropdown('archive'); }}
                        style={styles.ghostButton}
                        onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.2)'}
                        onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.1)'}
                    >
                        <Archive size={16} /> Archive <ChevronDown size={14} />
                    </button>
                    {activeDropdown === 'archive' && (
                        <div style={styles.dropdownMenu}>
                            <button style={styles.dropdownItem} onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f3f4f6'} onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}>
                                Graduate
                            </button>
                        </div>
                    )}
                </div>

                <div style={{ position: 'relative' }}>
                    <button 
                        onClick={(e) => { e.stopPropagation(); onToggleDropdown('advance'); }}
                        style={styles.ghostButton}
                        onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.2)'}
                        onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.1)'}
                    >
                        <TrendingUp size={16} /> Advance <ChevronDown size={14} />
                    </button>
                    {activeDropdown === 'advance' && (
                        <div style={{ ...styles.dropdownMenu, minWidth: '192px', maxHeight: '240px', overflowY: 'auto' }}>
                            <div style={styles.sectionLabel}>Move to Next Level</div>
                            {nextSections.length > 0 ? (
                                nextSections.map((sect, idx) => (
                                    <button key={idx} style={styles.dropdownItem} onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f3f4f6'} onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}>
                                        {sect.name}
                                    </button>
                                ))
                            ) : (
                                <div style={{ padding: '8px 16px', fontSize: '12px', color: '#9ca3af', fontStyle: 'italic' }}>No next level found</div>
                            )}
                        </div>
                    )}
                </div>

                <button 
                    onClick={onViewStudents}
                    style={styles.primaryButton}
                    onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f9fafb'}
                    onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'white'}
                >
                    <Eye size={16} /> View Students
                </button>
            </div>
        </motion.div>
    );
};

// --- SUB-COMPONENT: Hover Expanding Button ---
const SwitcherButton = ({ mode, currentMode, icon, label, onClick }) => {
    const [isHovered, setIsHovered] = useState(false);
    const isActive = currentMode === mode;
    const shouldExpand = isActive || isHovered;

    return (
        <button
            onClick={onClick}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            style={{
                padding: '6px 10px', borderRadius: '6px', fontSize: '12px', fontWeight: 500,
                border: 'none', cursor: 'pointer',
                backgroundColor: isActive ? 'white' : 'transparent',
                color: isActive ? '#4268BD' : '#6b7280',
                boxShadow: isActive ? '0 1px 2px 0 rgba(0, 0, 0, 0.05)' : 'none',
                transition: 'background-color 200ms ease, color 200ms ease',
                display: 'flex', alignItems: 'center', gap: '6px', height: '32px', outline: 'none'
            }}
        >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                {icon}
            </div>
            
            <motion.span
                initial={false}
                animate={{ width: shouldExpand ? 'auto' : 0, opacity: shouldExpand ? 1 : 0 }}
                transition={{ type: "spring", stiffness: 500, damping: 30 }}
                style={{ overflow: 'hidden', whiteSpace: 'nowrap', display: 'inline-block' }}
            >
                {label}
            </motion.span>
        </button>
    );
};

const StudentList = () => {
    const [viewMode, setViewMode] = useState('sections'); 
    const [activeTab, setActiveTab] = useState('all');
    const [searchTerm, setSearchTerm] = useState('');
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    
    const [selectedSection, setSelectedSection] = useState(null); 
    const [isActionBarVisible, setIsActionBarVisible] = useState(false); 
    const [activeActionDropdown, setActiveActionDropdown] = useState(null); 

    const allStudents = useMemo(() => generateData(), []);

    // --- HELPER: Flatten Levels ---
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
        // Map Tab ID to Adviser Department String
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

    // --- MAIN FILTER LOGIC (Strict Separation) ---
    const getTableData = () => {
        // 1. ADVISER VIEW - Strict Return
        if (viewMode === 'advisers') {
            return getAdviserData();
        }

        // 2. SECTION VIEW - Strict Return
        if (viewMode === 'sections') {
            return getFlattenedSections();
        }

        // 3. DRILLDOWN VIEW - Specific Filter
        if (viewMode === 'drilldown' && selectedSection) {
            return allStudents.filter(s => {
                const studentProgram = (s.program || "").toLowerCase();
                const level = (selectedSection.level || "").toLowerCase();
                const sectionName = (selectedSection.sectionName || "").toLowerCase();
                return studentProgram === level || sectionName.includes(studentProgram);
            });
        }

        // 4. STUDENT VIEW (Default Fallback) - Standard Filter
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

    // --- RENDER ROWS ---
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
        </tr>
    );

    // --- VARIABLES ---
    const isSectionView = viewMode === 'sections';
    const isDrilldown = viewMode === 'drilldown';
    const isAdviserView = viewMode === 'advisers';

    const getColumns = () => {
        if (isSectionView) return ['Level', 'Section Name', 'Adviser', 'Student Count'];
        if (isAdviserView) return ['Teacher Name', 'Department', 'Assignment'];
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
                
                // FIXED: Hide tabs ONLY in Drilldown. Advisers should see tabs now.
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