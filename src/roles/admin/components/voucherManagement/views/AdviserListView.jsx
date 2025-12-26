import React, { useState } from 'react';
import { Plus } from 'lucide-react';
import { GenericTable } from '../../../../../components/global/table/GenericTable';
import { adviserRegistry } from '../studentListConfig';

export const AdviserListView = ({ switcher }) => {
    const [activeTab, setActiveTab] = useState('all');
    const [searchTerm, setSearchTerm] = useState('');

    const filteredAdvisers = adviserRegistry.filter(adv => {
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
        const matchesTab = activeTab === 'all' || adv.department === targetDept;
        const matchesSearch = adv.name.toLowerCase().includes(searchTerm.toLowerCase());
        
        return matchesTab && matchesSearch;
    });

    // --- ROW STYLING ---
    const cellStyle = {
        fontFamily: 'geist, sans-serif', fontSize: '12px', color: '#4b5563',
        borderBottom: '1px solid #f3f4f6', height: '43.5px', verticalAlign: 'middle'
    };

    const renderRow = (adviser, index, startIndex) => (
        <tr key={adviser.id} className="hover:bg-gray-50 transition-colors">
            {/* Index Column */}
            <td style={{ ...cellStyle, textAlign: 'center', width: '48px' }}>
                {startIndex + index + 1}
            </td>
            
            {/* Name Column - Darker & Medium Weight */}
            <td style={{ ...cellStyle, fontWeight: 500, color: '#111827' }}>
                {adviser.name}
            </td>
            
            {/* Standard Columns */}
            <td style={cellStyle}>{adviser.department}</td>
            <td style={cellStyle}>{adviser.assignment}</td>
            <td style={cellStyle}>{adviser.years} Years</td>
        </tr>
    );

    return (
        <GenericTable
            title="Faculty Management"
            subtitle="Manage teacher assignments"
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
            onTabChange={setActiveTab}
            searchTerm={searchTerm}
            onSearchChange={setSearchTerm}
            customActions={switcher}
            
            columns={['Teacher Name', 'Department', 'Assignment', 'Years of Service']}
            data={filteredAdvisers}
            renderRow={renderRow}
            
            onPrimaryAction={() => console.log("Add Teacher")}
            primaryActionLabel="Add Teacher"
            primaryActionIcon={<Plus size={16} />}
            metrics={[{ label: "Total Staff", value: filteredAdvisers.length }]}
        />
    );
};