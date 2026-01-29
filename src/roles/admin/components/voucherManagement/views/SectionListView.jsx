import React, { useState, useMemo, useEffect } from 'react';
import { User, Plus, Loader2 } from 'lucide-react';
import { AnimatePresence } from 'framer-motion';

import { GenericTable } from '../../../../../components/global/table/GenericTable';
import { SelectionActionBar } from '../SelectionActionBar';
import { AddSectionModal } from '../components/AddSectionModal';

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

    const [isLoading, setIsLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('all');
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedSection, setSelectedSection] = useState(null);
    const [isActionBarVisible, setIsActionBarVisible] = useState(false);
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);

    // 🟢 TRIGGER 1-SECOND DELAY ON DATA CHANGE
    useEffect(() => {
        setIsLoading(true);
        const timer = setTimeout(() => {
            setIsLoading(false);
        }, 500); 
        return () => clearTimeout(timer);
    }, [sectionProgram, schoolData]); 

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

        // 🟢 3. SORT LOGIC
        // Sort by Level (Numeric-aware) then by Section Name
        return combinedList.sort((a, b) => {
            // Compare Levels (e.g., "1" vs "10" vs "2")
            const levelCompare = a.level.toString().localeCompare(b.level.toString(), undefined, { numeric: true });
            
            // If levels are the same, sort by Section Name
            if (levelCompare === 0) {
                return a.sectionName.localeCompare(b.sectionName);
            }
            return levelCompare;
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
                <td style={cellStyle}>
                    {section.studentCount === 0 ? <span className="text-gray-400 italic">Empty</span> : section.studentCount}
                </td>
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
    if (showAdviserColumn) columns.push('Adviser'); 
    columns.push('Student Count'); 

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
            <AddSectionModal
                isOpen={isAddModalOpen}
                onClose={() => setIsAddModalOpen(false)}
                onRefresh={() => {
                    setIsLoading(true);
                    fetchSectionPrograms();
                }} 
            />
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
                customActions={switcher}
                overrideHeader={isActionBarVisible ? actionBar : null}
                columns={columns}
                data={flattenedSections}
                renderRow={renderSectionRow}
                onPrimaryAction={() => setIsAddModalOpen(true)}
                primaryActionLabel={activeTab === 'higherEducation' ? "Add Program" : "Add Section"}
                primaryActionIcon={<Plus size={16} />}
                metrics={[{ label: "Total", value: flattenedSections.length }]}
            />
        </>
    );
};