import React, { useState, useMemo, useEffect } from 'react';
import { StudentListView } from '../views/StudentListView';
import { ProgramListView } from '../views/ProgramListView';
import { School, Users } from 'lucide-react';
import { SwitcherButton } from '../../../roles/admin/components/voucherManagement/SwitcherButton'

const StudentList = () => {
    // --- NAVIGATION STATE ---
    const [viewMode, setViewMode] = useState('students');

    const handleNavigateToStudents = () => {
        setViewMode('students');
    }
    const handleNavigateToPrograms = () => {
        setViewMode('programs');
    }

    const viewSwitcher = (
        <div style={{ backgroundColor: '#f3f4f6', padding: '4px', borderRadius: '8px', display: 'flex', gap: '4px' }}>
            <SwitcherButton
                mode="students" currentMode={viewMode} icon={<Users size={14} />} label="View Students"
                onClick={() => { setViewMode('students'); setDrilldownContext(null); }}
            />
            <SwitcherButton
                mode="programs" currentMode={viewMode} icon={<School size={14} />} label="View Programs"
                onClick={() => { setViewMode('programs'); }}
            />
        </div>
    );

    return (
        <>
            <div>
                {viewMode === 'students' && (
                    <StudentListView switcher={viewSwitcher} />
                )}
                {viewMode === 'programs' && (
                    <ProgramListView switcher={viewSwitcher} />
                )}
            </div>
        </>
    )
}



export { StudentList };