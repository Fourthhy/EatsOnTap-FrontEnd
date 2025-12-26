import React, { useState, useMemo } from 'react';
import { User, Eye, Plus } from 'lucide-react';
import { AnimatePresence } from 'framer-motion';

import { GenericTable } from '../../../../../components/global/table/GenericTable';
import { SelectionActionBar } from '../SelectionActionBar';
import { programsAndSections } from '../studentListConfig';

export const SectionListView = ({ switcher, onNavigateToStudents }) => {
    const [activeTab, setActiveTab] = useState('all');
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedSection, setSelectedSection] = useState(null);
    const [isActionBarVisible, setIsActionBarVisible] = useState(false);

    // --- DATA LOGIC ---
    const flattenedSections = useMemo(() => {
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
    }, [activeTab, searchTerm]);

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
        <GenericTable
            title="Section Overview"
            subtitle="Manage academic sections and advisers"
            tabs={[
                { label: 'All', id: 'all' }, 
                { label: 'Preschool', id: 'preschool' }, 
                { label: 'Primary', id: 'primaryEducation' }, 
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
            onPrimaryAction={() => console.log("Add Section")}
            primaryActionLabel="Add Section"
            primaryActionIcon={<Plus size={16} />} // Using Eye temporarily or Plus
            metrics={[{ label: "Total Sections", value: flattenedSections.length }]}
        />
    );
};