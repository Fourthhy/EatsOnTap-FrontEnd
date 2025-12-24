// StudentList.jsx

import React, { useState, useMemo, useEffect, useRef } from 'react';


import { Search, Calendar, Filter, ChevronLeft, ChevronRight, Plus, User } from 'lucide-react';
import { generateData } from './mockData';
import { AddStudentModal } from './AddStudentModal';
import { LinkStatusBadge } from './LinkStatusBadge';
import { GenericTable } from '../../../../components/global/table/GenericTable';

const StudentList = () => {
    const [activeTab, setActiveTab] = useState('all');
    const [searchTerm, setSearchTerm] = useState('');
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);

    const allStudents = useMemo(() => generateData(), []);

    // Configuration for interchanging headers
    const getProgramHeaderLabel = () => {
        if (activeTab === 'all') return 'Program / Section';
        if (activeTab === 'Higher Education') return 'Programs';
        return 'Section';
    };

    const tabList = [
        { label: 'All', id: 'all' },
        { label: 'Preschool', id: 'preschool' },
        { label: 'Primary Education', id: 'primaryEducation' },
        { label: 'Intermediate', id: 'intermediate' },
        { label: 'Junior High School', id: 'juniorHighSchool' },
        { label: 'Senior High School', id: 'seniorHighSchool' },
        { label: 'Higher Education', id: 'higherEducation' },
    ];

    const metrics = [
        { label: "Total", value: 50 }
    ]

    const handleTabChange = (tab) => {
        setActiveTab(tab);
        setTimeout(() => {
            console.log('changed tab to:', activeTab);
        }, 500);
    };

    // -- FILERING FUNCTIONS ---

    const isGradeLevel = (levelString, min, max) => {
        // 1. Ensure the string actually contains "grade"
        if (!levelString.includes("grade")) return false;

        // 2. Extract the number safely
        const match = levelString.match(/\d+/);
        if (!match) return false;

        const gradeNum = parseInt(match[0]);
        return gradeNum >= min && gradeNum <= max;
    };

    const isHigherEducation = (levelString) => {
        // Checks if it's a college program (starts with BS, AB, etc.)
        // We use .toLowerCase() because the 'level' variable is already lowercased
        const lower = levelString.toLowerCase();
        return lower.startsWith('bs') || lower.startsWith('bab') || lower.startsWith('ab');
    };

    const filteredStudents = allStudents.filter(student => {
        let matchesTab = true;

        // Standardize to lowercase: "Grade 10" -> "grade 10"
        const level = (student.program || student.section || "").toLowerCase();

        if (activeTab !== 'all') {
            switch (activeTab) {
                case 'preschool':
                    // Check specifically for these K-12 keywords
                    matchesTab = level.includes('kinder') || level.includes('preschool');
                    break;

                case 'primaryEducation':
                    // isGradeLevel now requires the word "grade" + number 1-3
                    matchesTab = isGradeLevel(level, 1, 3);
                    break;

                case 'intermediate':
                    matchesTab = isGradeLevel(level, 4, 6);
                    break;

                case 'juniorHighSchool':
                    matchesTab = isGradeLevel(level, 7, 10);
                    break;

                case 'seniorHighSchool':
                    // This will catch "Grade 11" and "Grade 12"
                    matchesTab = isGradeLevel(level, 11, 12);
                    break;

                case 'higherEducation':
                    // This looks for "bs...", "ab...", etc.
                    matchesTab = isHigherEducation(level);
                    break;

                default:
                    matchesTab = false;
            }
        }

        return matchesTab;
    });

    const cellStyle = {
        fontFamily: 'geist, sans-serif',
        fontSize: '12px',
        color: '#4b5563',
        padding: '6px 0px',
        borderBottom: '1px solid #f3f4f6'
    };

    const renderRow = (student, index, startIndex) => (
        <tr key={student.id} className="hover:bg-gray-50 transition-colors">
            {/* Index Column */}
            <td style={{ ...cellStyle, textAlign: 'center', width: '48px' }}>
                {startIndex + index + 1}
            </td>

            {/* Name Column (Darker Text, Medium Weight) */}
            <td style={{ ...cellStyle, fontWeight: 500, color: '#111827' }}>
                <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden text-gray-500">
                        <User size={16} />
                    </div>
                    <span>{student.name}</span>
                </div>
            </td>

            {/* Student ID */}
            <td style={cellStyle}>
                {student.studentId}
            </td>

            {/* Type */}
            <td style={cellStyle}>
                {student.type}
            </td>

            {/* Program */}
            <td style={cellStyle}>
                {student.program}
            </td>

            {/* Link Status Badge */}
            <td style={cellStyle}>
                <LinkStatusBadge isLinked={student.isLinked} student={student} />
            </td>
        </tr>
    )

    return (
        <>
            <AddStudentModal isOpen={isAddModalOpen} onClose={() => setIsAddModalOpen(false)} />

            <GenericTable
                title="All Students List"
                subtitle="Manage students' eligibility"
                tabs={tabList}
                activeTab={activeTab}
                onTabChange={handleTabChange}
                searchTerm={searchTerm}
                onSearchChange={setSearchTerm}

                totalRecords={filteredStudents.length}
                metrics={metrics}

                onPrimaryAction={() => setIsAddModalOpen(true)}
                primaryActionLabel="Add Student"
                primaryActionIcon={<Plus size={16} />}
                
                columns={['Student Name', 'Student ID', 'Regular/Irregular', 'DYNAMIC', 'RFID Link']}
                dynamicHeaderLabel={getProgramHeaderLabel()}
                data={filteredStudents}
                renderRow={renderRow}
            />
        </>
    );
};

export { StudentList };