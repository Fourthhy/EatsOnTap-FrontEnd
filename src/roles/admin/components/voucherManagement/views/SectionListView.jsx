import React, { useState, useMemo, useEffect } from 'react';
import { User, Plus } from 'lucide-react';
import { AnimatePresence } from 'framer-motion';

import { GenericTable } from '../../../../../components/global/table/GenericTable';
import { SelectionActionBar } from '../SelectionActionBar';
import { AddSectionModal } from '../components/AddSectionModal';

// DATA FROM CONTEXT
import { useData } from "../../../../../context/DataContext";

export const SectionListView = ({ switcher, onNavigateToStudents }) => {
    // 🟢 1. USE UNIFIED DATA STORE
    const { schoolData } = useData(); 

    const [activeTab, setActiveTab] = useState('all');
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedSection, setSelectedSection] = useState(null);
    const [isActionBarVisible, setIsActionBarVisible] = useState(false);
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);

    // Initialize state (Optional: you can use schoolData directly, but local state is fine too)
    const [sectionsData, setSectionsData] = useState([]);

    // Sync Data
    useEffect(() => {
        if (schoolData && schoolData.length > 0) {
            setSectionsData(schoolData);
        }
    }, [schoolData]);

    // --- DYNAMIC COLUMN LOGIC ---
    const getNameLabel = () => {
        if (activeTab === 'all') return "Section / Program";
        if (activeTab === 'higherEducation') return "Program";
        return "Section"; 
    };

    const showAdviserColumn = activeTab !== 'higherEducation';

    // --- 🟢 UPDATED FLATTENING LOGIC ---
    const flattenedSections = useMemo(() => {
        // Safety Check
        if (!sectionsData || sectionsData.length === 0) return [];

        const relevantCategories = activeTab === 'all'
            ? sectionsData
            : sectionsData.filter(p => p.category === activeTab);

        const flatList = [];
        
        relevantCategories.forEach(cat => {
            if (cat.levels) {
                cat.levels.forEach(level => {
                    if (level.sections) {
                        level.sections.forEach(section => {
                            // 🟢 KEY MAPPING: Backend uses 'levelName' and 'section'
                            const currentLevelName = level.levelName || level.gradeLevel; 
                            const currentSectionName = section.section || section.name;

                            const searchLower = searchTerm.toLowerCase();
                            const matchesSearch =
                                (currentSectionName || "").toLowerCase().includes(searchLower) ||
                                (section.adviser || "").toLowerCase().includes(searchLower) ||
                                (currentLevelName || "").toLowerCase().includes(searchLower);

                            if (matchesSearch) {
                                flatList.push({
                                    id: `${currentLevelName}-${currentSectionName}`,
                                    
                                    // Display Fields
                                    level: currentLevelName,
                                    sectionName: currentSectionName,
                                    adviser: section.adviser || "Unassigned",
                                    studentCount: section.studentCount || 0,
                                    category: cat.category,

                                    // 🟢 CRITICAL: Attach the students array for the next view
                                    students: section.students || [] 
                                });
                            }
                        });
                    }
                });
            }
        });
        return flatList;
    }, [activeTab, searchTerm, sectionsData]);

    // --- RENDER ROW ---
    const cellStyle = {
        fontSize: '12px', color: '#4b5563', borderBottom: '1px solid #f3f4f6', height: '44px', verticalAlign: 'middle'
    };

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
                <td style={{ ...cellStyle, textAlign: 'center', width: '48px' }}>
                    {startIndex + index + 1}
                </td>
                <td style={{ ...cellStyle, fontWeight: 500, color: '#111827' }}>
                    {section.level}
                </td>
                <td style={cellStyle}>
                    {section.sectionName}
                </td>

                {showAdviserColumn && (
                    <td style={cellStyle}>
                        {isHigherEdRow ? (
                            <span className="text-gray-300">-</span>
                        ) : (
                            <div className="flex items-center gap-2">
                                <div className="w-6 h-6 rounded-full bg-blue-50 flex items-center justify-center text-blue-600">
                                    <User size={12} />
                                </div>
                                {section.adviser}
                            </div>
                        )}
                    </td>
                )}

                <td style={cellStyle}>
                    {section.studentCount}
                </td>
            </tr>
        );
    };

    // --- ACTION BAR ---
    const actionBar = (
        <AnimatePresence onExitComplete={() => setIsActionBarVisible(false)}>
            {isActionBarVisible && selectedSection && (
                <SelectionActionBar
                    variant="section"
                    selectedItem={selectedSection}
                    onClearSelection={() => { setSelectedSection(null); setIsActionBarVisible(false); }}
                    
                    // 🟢 PASS THE WHOLE OBJECT (includes .students)
                    onViewStudents={() => onNavigateToStudents(selectedSection)}
                />
            )}
        </AnimatePresence>
    );

    const columns = ['Level', getNameLabel()]; 
    if (showAdviserColumn) columns.push('Adviser'); 
    columns.push('Student Count'); 

    return (
        <>
            <AddSectionModal
                isOpen={isAddModalOpen}
                onClose={() => setIsAddModalOpen(false)}
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