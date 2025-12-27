import React, { useState, useMemo } from 'react';
import { User, Eye, Plus } from 'lucide-react';
import { AnimatePresence } from 'framer-motion';

import { GenericTable } from '../../../../../components/global/table/GenericTable';
import { SelectionActionBar } from '../SelectionActionBar';
import { programsAndSections } from '../studentListConfig';
import { AddSectionModal } from '../components/AddSectionModal';

export const SectionListView = ({ switcher, onNavigateToStudents }) => {
    const [activeTab, setActiveTab] = useState('all');
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedSection, setSelectedSection] = useState(null);
    const [isActionBarVisible, setIsActionBarVisible] = useState(false);
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);

    // Initialize state with config data so we can append to it locally
    const [sectionsData, setSectionsData] = useState(programsAndSections);

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
                        section.name.toLowerCase().includes(searchLower) || 
                        section.adviser.toLowerCase().includes(searchLower) ||
                        level.gradeLevel.toLowerCase().includes(searchLower);

                    if (matchesSearch) {
                        flatList.push({
                            id: `${level.gradeLevel}-${section.name}`,
                            level: level.gradeLevel,
                            sectionName: section.name,
                            adviser: section.adviser,
                            studentCount: section.studentCount || 0,
                            category: cat.category // Keep ref for internal logic if needed
                        });
                    }
                });
            });
        });
        return flatList;
    }, [activeTab, searchTerm, sectionsData]);

    // --- HANDLER: Add New Section ---
    const handleAddSection = (newSection) => {
        // Mocking the update: We need to find the right category and level in our state
        // For simplicity in this mock, we will just force update the state by finding the right nested array
        // In a real app, this would be an API call.
        
        setSectionsData(prev => {
            const newData = JSON.parse(JSON.stringify(prev)); // Deep copy for immutability
            
            // 1. Find the category that contains this grade level
            // We loop through to find where this level belongs
            let targetCategory = newData.find(cat => cat.levels.some(l => l.gradeLevel === newSection.level));
            
            if (targetCategory) {
                let targetLevel = targetCategory.levels.find(l => l.gradeLevel === newSection.level);
                if (targetLevel) {
                    targetLevel.sections.push({
                        name: newSection.sectionName,
                        adviser: newSection.adviser,
                        studentCount: 0
                    });
                }
            }
            return newData;
        });
    };

    // --- RENDER ROW ---
    const renderSectionRow = (section, index, startIndex) => {
        const isSelected = selectedSection?.id === section.id;
        return (
            <tr 
                key={section.id} 
                onClick={() => {
                    if (!isSelected) { setSelectedSection(section); setIsActionBarVisible(true); } 
                    else { setSelectedSection(null); setIsActionBarVisible(false); }
                }}
                className="transition-colors cursor-pointer"
                style={{ backgroundColor: isSelected ? '#eff6ff' : 'transparent', borderBottom: '1px solid #f3f4f6' }}
            >
                <td style={{ padding: '12px', textAlign: 'center', width: '48px', fontSize: '12px', color: '#6b7280' }}>{startIndex + index + 1}</td>
                <td style={{ padding: '12px', fontSize: '12px', fontWeight: 500, color: '#111827' }}>{section.level}</td>
                <td style={{ padding: '12px', fontSize: '12px', color: '#4b5563' }}>{section.sectionName}</td>
                <td style={{ padding: '12px', fontSize: '12px', color: '#4b5563' }}>
                    <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded-full bg-blue-50 flex items-center justify-center text-blue-600"><User size={12} /></div>
                        {section.adviser}
                    </div>
                </td>
                <td style={{ padding: '12px', fontSize: '12px', color: '#4b5563' }}>{section.studentCount}</td>
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

    return (
        <>
            <AddSectionModal 
                isOpen={isAddModalOpen} 
                onClose={() => setIsAddModalOpen(false)} 
                onAdd={handleAddSection} 
            />

            <GenericTable
                title="Section Overview"
                subtitle="Manage academic sections and advisers"
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
                columns={['Level', 'Section Name', 'Adviser', 'Student Count']}
                data={flattenedSections}
                renderRow={renderSectionRow}
                onPrimaryAction={() => setIsAddModalOpen(true)}
                primaryActionLabel="Add Section"
                primaryActionIcon={<Plus size={16} />}
                metrics={[{ label: "Total Sections", value: flattenedSections.length }]}
            />
        </>
    );
};