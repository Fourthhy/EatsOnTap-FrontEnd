import React, { useState, useMemo, useEffect } from 'react';
import { User, Plus } from 'lucide-react';
import { AnimatePresence } from 'framer-motion';

import { GenericTable } from '../../../../../components/global/table/GenericTable';
import { SelectionActionBar } from '../SelectionActionBar';
import { AddSectionModal } from '../components/AddSectionModal';

// DATA FROM CONTEXT
import { useData } from "../../../../../context/DataContext";

export const SectionListView = ({ switcher, onNavigateToStudents }) => {
    const { programsAndSections } = useData();

    const [activeTab, setActiveTab] = useState('all');
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedSection, setSelectedSection] = useState(null);
    const [isActionBarVisible, setIsActionBarVisible] = useState(false);
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);

    // Initialize state
    const [sectionsData, setSectionsData] = useState([]);

    // Sync Data
    useEffect(() => {
        if (programsAndSections && programsAndSections.length > 0) {
            setSectionsData(programsAndSections);
        }
    }, [programsAndSections]);

    // --- 🟢 DYNAMIC COLUMN LOGIC ---
    // 1. Determine the Label for the Name Column
    const getNameLabel = () => {
        if (activeTab === 'all') return "Section / Program";
        if (activeTab === 'higherEducation') return "Program";
        return "Section"; // Default for Basic Ed
    };

    // 2. Determine if Adviser Column should appear
    // We show it for 'all' (mixed data) and basic ed tabs. We hide it ONLY for pure Higher Ed tab.
    const showAdviserColumn = activeTab !== 'higherEducation';

    // --- DATA LOGIC ---
    const flattenedSections = useMemo(() => {
        const relevantCategories = activeTab === 'all'
            ? sectionsData
            : sectionsData.filter(p => p.category === activeTab);

        const flatList = [];
        relevantCategories.forEach(cat => {
            cat.levels.forEach(level => {
                level.sections.forEach(section => {
                    const searchLower = searchTerm.toLowerCase();
                    const matchesSearch =
                        (section.name || "").toLowerCase().includes(searchLower) ||
                        (section.adviser || "").toLowerCase().includes(searchLower) ||
                        (level.gradeLevel || "").toLowerCase().includes(searchLower);

                    if (matchesSearch) {
                        flatList.push({
                            id: `${level.gradeLevel}-${section.name}`,
                            level: level.gradeLevel,
                            sectionName: section.name,
                            // If Higher Ed or Unassigned, handle display text
                            adviser: section.adviser || "Unassigned",
                            studentCount: section.studentCount || 0,
                            category: cat.category 
                        });
                    }
                });
            });
        });
        return flatList;
    }, [activeTab, searchTerm, sectionsData]);

    // --- RENDER ROW ---
    const cellStyle = {
        fontSize: '12px', color: '#4b5563', borderBottom: '1px solid #f3f4f6', height: '44px', verticalAlign: 'middle'
    };

    const renderSectionRow = (section, index, startIndex) => {
        const isSelected = selectedSection?.id === section.id;

        // Check if this specific row is Higher Ed (to conditionally hide adviser content if needed)
        // Note: In "All" tab, we might have mixed rows.
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

                {/* Adviser Column (Conditionally Rendered) */}
                {showAdviserColumn && (
                    <td style={cellStyle}>
                        {isHigherEdRow ? (
                            <span className="text-gray-300">-</span> // Show dash for Higher Ed rows in "All" view
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
                    onViewStudents={() => onNavigateToStudents(selectedSection)}
                />
            )}
        </AnimatePresence>
    );

    // --- CONSTRUCT COLUMNS ARRAY ---
    const columns = ['Level', getNameLabel()]; // Always have Level + Name
    if (showAdviserColumn) columns.push('Adviser'); // Conditionally add Adviser
    columns.push('Student Count'); // Always add Count

    return (
        <>
            <AddSectionModal
                isOpen={isAddModalOpen}
                onClose={() => setIsAddModalOpen(false)}
                // Add handler logic here
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
                
                columns={columns} // 🟢 Pass the dynamic columns
                
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