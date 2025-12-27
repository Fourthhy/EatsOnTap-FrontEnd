import React, { useState, useMemo, useEffect } from 'react';
import { Plus, User } from 'lucide-react';
import { AnimatePresence } from 'framer-motion';

// Global Components
import { GenericTable } from '../../../../../components/global/table/GenericTable';
import { SelectionActionBar } from '../SelectionActionBar';
import { AddAdviserModal } from '../components/AddAdviserModal';
import { CustomEditDropdown } from '../components/CustomEditDropdown';

// Data & Helpers
import { adviserRegistry } from '../studentListConfig';
import { DEPARTMENT_SECTIONS, DEPARTMENTS } from '../config/adviserConfig';

export const AdviserListView = ({ switcher }) => {
    // --- STATE ---
    const [activeTab, setActiveTab] = useState('all');
    const [searchTerm, setSearchTerm] = useState('');
    const [advisersData, setAdvisersData] = useState(adviserRegistry);
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);

    // Selection
    const [selectedItem, setSelectedItem] = useState(null);
    const [isActionBarVisible, setIsActionBarVisible] = useState(false);
    const [activeActionDropdown, setActiveActionDropdown] = useState(null);

    // Edit Mode
    const [isEditing, setIsEditing] = useState(false);
    const [editFormData, setEditFormData] = useState({});

    // --- EFFECT: HEADER VISIBILITY ---
    const [headerVisible, setHeaderVisible] = useState(false);
    const shouldShowActions = selectedItem !== null;

    useEffect(() => {
        if (shouldShowActions) {
            setHeaderVisible(true);
        } else {
            const timer = setTimeout(() => setHeaderVisible(false), 300);
            return () => clearTimeout(timer);
        }
    }, [shouldShowActions]);


    // --- FILTERING ---
    const filteredAdvisers = useMemo(() => {
        return advisersData.filter(adv => {
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
    }, [advisersData, activeTab, searchTerm]);


    // --- HANDLERS: CRUD ---
    const handleAddAdviser = (newAdviser) => {
        const entry = {
            id: `adv-${Date.now()}`,
            ...newAdviser,
            years: parseInt(newAdviser.years) || 0 
        };
        setAdvisersData(prev => [entry, ...prev]);
    };

    const handleRowClick = (adviser) => {
        if (isEditing) return; 

        if (selectedItem?.id === adviser.id) {
            setSelectedItem(null);
            setIsActionBarVisible(false);
        } else {
            setSelectedItem(adviser);
            setIsActionBarVisible(true);
        }
    };

    // --- HANDLERS: EDITING ---
    const handleEditClick = () => {
        setEditFormData({ ...selectedItem });
        setIsEditing(true);
    };

    const handleSaveEdit = () => {
        setAdvisersData(prev => prev.map(item => 
            item.id === selectedItem.id ? editFormData : item
        ));
        setSelectedItem(editFormData); 
        setIsEditing(false);
    };

    const handleCancelEdit = () => {
        setIsEditing(false);
        setEditFormData({});
    };

    const handleDepartmentChange = (newDept) => {
        const availableSections = DEPARTMENT_SECTIONS[newDept] || [];
        setEditFormData({
            ...editFormData,
            department: newDept,
            assignment: availableSections.length > 0 ? availableSections[0] : ''
        });
    };


    // --- RENDERERS ---
    const cellStyle = {
        fontFamily: 'geist, sans-serif', fontSize: '12px', color: '#4b5563',
        borderBottom: '1px solid #f3f4f6', height: '43.5px', verticalAlign: 'middle'
    };

    const renderRow = (adviser, index, startIndex) => {
        // 1. EDIT MODE RENDER
        if (isEditing && selectedItem?.id === adviser.id) {
            const currentDeptSections = DEPARTMENT_SECTIONS[editFormData.department] || [];
            
            return (
                <tr key={adviser.id} style={{ backgroundColor: '#eff6ff' }}>
                    <td style={cellStyle}>
                        <div className="w-1.5 h-1.5 rounded-full bg-blue-500 mx-auto"/>
                    </td>
                    
                    {/* --- UPDATED NAME INPUT WITH PADDING --- */}
                    <td style={{...cellStyle, paddingRight: "10px"}}>
                        <input 
                            className="w-full border rounded text-xs focus:ring-1 focus:ring-[#4268BD] outline-none transition-all" 
                            style={{ padding: '8px 0px' }} // Added padding here
                            value={editFormData.name} 
                            onChange={e => setEditFormData({...editFormData, name: e.target.value})} 
                            autoFocus
                        />
                    </td>
                    
                    {/* Department Dropdown */}
                    <td style={cellStyle}>
                        <CustomEditDropdown 
                            value={editFormData.department} 
                            options={DEPARTMENTS} 
                            onChange={handleDepartmentChange} 
                        />
                    </td>
                    {/* Assignment Dropdown */}
                    <td style={cellStyle}>
                        <CustomEditDropdown 
                            value={editFormData.assignment} 
                            options={currentDeptSections} 
                            onChange={v => setEditFormData({...editFormData, assignment: v})} 
                        />
                    </td>
                </tr>
            );
        }

        // 2. STANDARD MODE RENDER
        const isSelected = selectedItem?.id === adviser.id;

        return (
            <tr key={adviser.id} 
                className="hover:bg-gray-50 transition-colors cursor-pointer"
                onClick={() => handleRowClick(adviser)}
                style={{ backgroundColor: isSelected ? '#eff6ff' : 'transparent' }}
            >
                <td style={{ ...cellStyle, textAlign: 'center', width: '48px' }}>
                    {startIndex + index + 1}
                </td>
                
                <td style={{ ...cellStyle, fontWeight: 500, color: '#111827' }}>
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-gray-500">
                            <User size={16} />
                        </div>
                        {adviser.name}
                    </div>
                </td>
                
                <td style={cellStyle}>{adviser.department}</td>
                <td style={cellStyle}>{adviser.assignment}</td>
            </tr>
        );
    };

    // --- ACTION BAR ---
    const actionBar = (
        <AnimatePresence>
            {shouldShowActions && (
                <SelectionActionBar 
                    key="bar"
                    variant="student" 
                    selectedItem={selectedItem}
                    
                    onClearSelection={() => {
                        setSelectedItem(null);
                        setIsEditing(false);
                    }}

                    isEditing={isEditing}
                    onEditStudent={handleEditClick} 
                    onSaveStudent={handleSaveEdit}
                    onCancelEdit={handleCancelEdit}

                    activeDropdown={activeActionDropdown}
                    onToggleDropdown={t => setActiveActionDropdown(prev => prev === t ? null : t)}
                    onArchiveOption={(opt) => console.log("Adviser Action:", opt)}
                    
                    selectedCount={1}
                />
            )}
        </AnimatePresence>
    );

    return (
        <>
            <AddAdviserModal 
                isOpen={isAddModalOpen} 
                onClose={() => setIsAddModalOpen(false)} 
                onAdd={handleAddAdviser} 
            />

            <GenericTable
                title="Faculty Management"
                subtitle="Manage teacher assignments"
                tabs={[
                    { label: 'All', id: 'all' },
                    { label: 'Preschool', id: 'preschool' },
                    { label: 'Primary Education', id: 'primaryEducation' },
                    { label: 'Intermediate', id: 'intermediate' },
                    { label: 'Junior High School', id: 'juniorHighSchool' },
                    { label: 'Senior High School', id: 'seniorHighSchool' },
                    { label: 'Higher Education', id: 'higherEducation' }
                ]}
                activeTab={activeTab}
                onTabChange={setActiveTab}
                
                searchTerm={searchTerm}
                onSearchChange={setSearchTerm}
                
                customActions={switcher}
                overrideHeader={headerVisible ? actionBar : null}
                
                columns={['Teacher Name', 'Department', 'Assignment']} 
                data={filteredAdvisers}
                renderRow={renderRow}
                
                onPrimaryAction={() => setIsAddModalOpen(true)}
                primaryActionLabel="Add Teacher"
                primaryActionIcon={<Plus size={16} />}
                metrics={[{ label: "Total Staff", value: filteredAdvisers.length }]}
            />
        </>
    );
};