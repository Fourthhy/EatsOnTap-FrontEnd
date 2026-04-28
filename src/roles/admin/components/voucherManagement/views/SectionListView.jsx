import React, { useState, useMemo, useEffect } from 'react';
import { User, Plus, Loader2 } from 'lucide-react';
import { AnimatePresence } from 'framer-motion';

import { GenericTable } from '../../../../../components/global/table/GenericTable';
import { SelectionActionBar } from '../SelectionActionBar';
import { TableActionsMenu } from './StudentListView'; // Adjust path if needed

import { AddSectionModal } from '../components/AddSectionModal';
import { AddStudentModal } from '../AddStudentModal';
import { UpdateRecordsModal } from '../components/UpdateRecordsModal';

import { useData } from "../../../../../context/DataContext";

// HELPER: Map DB Department Strings to Frontend Tab IDs
const mapDepartmentToTabId = (deptString) => {
    if (!deptString) return 'unknown';
    const map = {
        'Preschool': 'preschool',
        'Basic Education': 'primaryEducation',
        'Primary Education': 'primaryEducation',
        'Intermediate': 'intermediate',
        'Junior High School': 'juniorHighSchool',
        'Senior High School': 'seniorHighSchool',
        'Higher Education': 'higherEducation'
    };
    return map[deptString] || 'unknown';
};

export const SectionListView = ({ switcher, onNavigateToStudents }) => {
    const { schoolData, sectionProgram, fetchSectionPrograms } = useData();

    const [isLoading, setIsLoading] = useState(false);
    const [activeTab, setActiveTab] = useState('all');
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedSection, setSelectedSection] = useState(null);
    const [isActionBarVisible, setIsActionBarVisible] = useState(false);

    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
    const [isAddSectionOpen, setIsAddSectionOpen] = useState(false);

    const getNameLabel = () => {
        if (activeTab === 'all') return "Section / Program";
        if (activeTab === 'higherEducation') return "Program";
        return "Section";
    };

    const showAdviserColumn = activeTab !== 'higherEducation';

    // --- MERGED & SORTED LOGIC ---
    const flattenedSections = useMemo(() => {
        const combinedList = [];
        const searchLower = searchTerm.toLowerCase();

        // 1. PROCESS 'schoolData'
        if (schoolData && schoolData.length > 0) {
            const relevantCategories = activeTab === 'all'
                ? schoolData
                : schoolData.filter(cat => cat.category === activeTab);

            relevantCategories.forEach(cat => {
                if (cat.levels) {
                    cat.levels.forEach(level => {
                        if (level.sections) {
                            level.sections.forEach(section => {
                                const currentLevelName = level.levelName || level.gradeLevel || "N/A";
                                const currentSectionName = section.section || section.name || "Unnamed";
                                const currentAdviser = section.adviser || "Unassigned";

                                const matchesSearch =
                                    (currentSectionName).toLowerCase().includes(searchLower) ||
                                    (currentAdviser).toLowerCase().includes(searchLower) ||
                                    (currentLevelName).toLowerCase().includes(searchLower);

                                if (matchesSearch) {
                                    combinedList.push({
                                        id: section.id || `${cat.category}-${currentLevelName}-${currentSectionName}`,
                                        level: currentLevelName,
                                        sectionName: currentSectionName,
                                        adviser: currentAdviser,
                                        studentCount: section.studentCount || 0,
                                        category: cat.category,
                                        students: section.students || []
                                    });
                                }
                            });
                        }
                    });
                }
            });
        }

        // 2. PROCESS 'sectionProgram' (Empty Sections)
        const rawPrograms = Array.isArray(sectionProgram)
            ? sectionProgram
            : (sectionProgram?.data || []);

        if (rawPrograms.length > 0) {
            const emptySections = rawPrograms.filter(item => item.studentCount === 0);

            emptySections.forEach(item => {
                const categoryId = mapDepartmentToTabId(item.department);

                if (activeTab !== 'all' && categoryId !== activeTab) return;

                const currentLevelName = item.year || "N/A";
                const currentSectionName = item.program || item.section || "Unnamed";
                const currentAdviser = item.handleAdviser || "Unassigned";

                const matchesSearch =
                    (currentSectionName).toLowerCase().includes(searchLower) ||
                    (currentAdviser).toLowerCase().includes(searchLower) ||
                    (currentLevelName).toLowerCase().includes(searchLower);

                if (matchesSearch) {
                    combinedList.push({
                        id: item._id,
                        level: currentLevelName,
                        sectionName: currentSectionName,
                        adviser: currentAdviser,
                        studentCount: 0,
                        category: categoryId,
                        students: []
                    });
                }
            });
        }

        // 🟢 3. FIXED SORT LOGIC (Sections First -> Programs Second -> Level -> Name)
        return combinedList.sort((a, b) => {
            // Step A: Separate Sections (Basic Ed) from Programs (Higher Ed)
            // If category is 'higherEducation', give it a weight of 1 (push to bottom). Else 0 (keep at top).
            const isProgramA = a.category === 'higherEducation' ? 1 : 0;
            const isProgramB = b.category === 'higherEducation' ? 1 : 0;

            if (isProgramA !== isProgramB) {
                return isProgramA - isProgramB;
            }

            // Step B: If both are sections (or both are programs), sort by Level (Numeric-aware)
            const levelCompare = a.level.toString().localeCompare(b.level.toString(), undefined, { numeric: true });
            if (levelCompare !== 0) {
                return levelCompare;
            }

            // Step C: If levels are the exact same, sort alphabetically by Section/Program Name
            return a.sectionName.localeCompare(b.sectionName);
        });

    }, [activeTab, searchTerm, schoolData, sectionProgram]);

    const cellStyle = { fontSize: '12px', color: '#4b5563', borderBottom: '1px solid #f3f4f6', height: '44px', verticalAlign: 'middle' };

    const renderSectionRow = (section, index, startIndex) => {
        const isSelected = selectedSection?.id === section.id;
        const isHigherEdRow = section.category === 'higherEducation';

        return (
            <tr
                key={section.id}
                onClick={() => {
                    if (!isSelected) { setSelectedSection(section); setIsActionBarVisible(true); }
                    else { setSelectedSection(null); setIsActionBarVisible(false); }
                }}
                className="transition-colors cursor-pointer"
                style={{ backgroundColor: isSelected ? '#eff6ff' : 'transparent' }}
            >
                <td style={{ ...cellStyle, textAlign: 'center', width: '48px' }}>{startIndex + index + 1}</td>
                <td style={{ ...cellStyle, fontWeight: 500, color: '#111827' }}>{section.level}</td>
                <td style={cellStyle}>{section.sectionName}</td>
                <td style={cellStyle}>
                    {section.studentCount === 0 ? <span className="text-gray-400 italic">Empty</span> : section.studentCount}
                </td>
                {showAdviserColumn && (
                    <td style={cellStyle}>
                        {isHigherEdRow ? <span className="text-gray-300">-</span> : (
                            <div className="flex items-center gap-2">
                                <div className="w-6 h-6 rounded-full bg-blue-50 flex items-center justify-center text-blue-600"><User size={12} /></div>
                                {section.adviser}
                            </div>
                        )}
                    </td>
                )}
            </tr>
        );
    };

    const actionBar = (
        <AnimatePresence onExitComplete={() => setIsActionBarVisible(false)}>
            {isActionBarVisible && selectedSection && (
                <SelectionActionBar
                    variant="section"
                    selectedItem={selectedSection}
                    onClearSelection={() => { setSelectedSection(null); setIsActionBarVisible(false); }}
                    onViewStudents={() => onNavigateToStudents(selectedSection)}
                />
            )}
        </AnimatePresence>
    );

    const columns = ['Level', getNameLabel()];
    columns.push('Student Count');
    if (showAdviserColumn) columns.push('Adviser');

    if (isLoading) {
        return (
            <div className="w-full h-full flex flex-col items-center justify-center bg-white rounded-md shadow-sm border border-gray-100" style={{ minHeight: '400px' }}>
                <Loader2 className="h-8 w-8 text-blue-600 animate-spin mb-4" />
                <p className="text-sm text-gray-500 font-geist">Syncing section data...</p>
            </div>
        );
    }

    return (
        <>
            <AddSectionModal isOpen={isAddSectionOpen} onClose={() => setIsAddSectionOpen(false)}
                onRefresh={() => {
                    setIsLoading(true);
                    fetchSectionPrograms();
                }}
            />
            <AddStudentModal isOpen={isAddModalOpen} onClose={() => {setIsAddModalOpen(false)}} />
            <UpdateRecordsModal isOpen={isUpdateModalOpen} onClose={() => {setIsUpdateModalOpen(false)}}/>

            <GenericTable
                title={activeTab === 'higherEducation' ? "Program Overview" : "Section Overview"}
                subtitle={activeTab === 'higherEducation' ? "Manage academic programs" : "Manage academic sections and advisers"}
                tabs={[
                    { label: 'All', id: 'all' },
                    { label: 'Preschool', id: 'preschool' },
                    { label: 'Primary Education', id: 'primaryEducation' },
                    { label: 'Intermediate', id: 'intermediate' },
                    { label: 'Junior Highschool', id: 'juniorHighSchool' },
                    { label: 'Senior Highschool', id: 'seniorHighSchool' },
                    { label: 'Higher Education', id: 'higherEducation' }
                ]}
                activeTab={activeTab}
                onTabChange={(t) => { setActiveTab(t); setSelectedSection(null); }}
                searchTerm={searchTerm}
                onSearchChange={setSearchTerm}

                // 🟢 Inject the 3-dot menu alongside the switcher
                customActions={
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        {switcher}
                        <TableActionsMenu
                            onAdd={() => setIsAddModalOpen(true)}
                            onUpdate={() => setIsUpdateModalOpen(true)}
                            onAddSection={() => setIsAddSectionOpen(true)}
                        />
                    </div>
                }

                overrideHeader={isActionBarVisible ? actionBar : null}
                columns={columns}
                data={flattenedSections}
                renderRow={renderSectionRow}
                metrics={[{ label: "Total", value: flattenedSections.length }]}
            />
        </>
    );
};