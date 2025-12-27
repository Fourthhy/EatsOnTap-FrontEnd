import React, { useState } from 'react';
import { School, Users } from 'lucide-react';
import { FaChalkboardTeacher } from "react-icons/fa";

// --- SUB-VIEWS ---
import { SectionListView } from './views/SectionListView';
import { StudentListView } from './views/StudentListView';
import { AdviserListView } from './views/AdviserListView';

// --- SHARED COMPONENTS ---
import { SwitcherButton } from './SwitcherButton';

const StudentList = () => {
    // --- NAVIGATION STATE ---
    const [viewMode, setViewMode] = useState('sections'); 
    
    // Holds the section object when clicking "View Students"
    const [drilldownContext, setDrilldownContext] = useState(null); 

    const handleNavigateToStudents = (sectionData) => {
        setDrilldownContext(sectionData);
        setViewMode('students');
    };

    const handleGoBackToSections = () => {
        setDrilldownContext(null);
        setViewMode('sections');
    };

    // --- VIEW SWITCHER ---
    const viewSwitcher = (
        <div style={{ backgroundColor: '#f3f4f6', padding: '4px', borderRadius: '8px', display: 'flex', gap: '4px' }}>
            <SwitcherButton 
                mode="sections" currentMode={viewMode} icon={<School size={14} />} label="View Sections" 
                onClick={() => { setViewMode('sections'); setDrilldownContext(null); }} 
            />
            <SwitcherButton 
                mode="students" currentMode={viewMode} icon={<Users size={14} />} label="View Students" 
                onClick={() => { setViewMode('students'); setDrilldownContext(null); }} 
            />
            <SwitcherButton 
                mode="advisers" currentMode={viewMode} icon={<FaChalkboardTeacher size={14} />} label="View Advisers" 
                onClick={() => { setViewMode('advisers'); setDrilldownContext(null); }} 
            />
        </div>
    );

    return (
        <div>
            {viewMode === 'sections' && (
                <SectionListView 
                    switcher={viewSwitcher} 
                    onNavigateToStudents={handleNavigateToStudents} 
                />
            )}

            {viewMode === 'students' && (
                <StudentListView 
                    switcher={viewSwitcher} 
                    drilldownContext={drilldownContext}
                    onGoBack={handleGoBackToSections}
                />
            )}

            {viewMode === 'advisers' && (
                <AdviserListView 
                    switcher={viewSwitcher} 
                />
            )}
        </div>
    );
};

export { StudentList };