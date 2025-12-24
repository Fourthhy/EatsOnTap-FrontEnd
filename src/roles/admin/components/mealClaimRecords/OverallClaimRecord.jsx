import React, { useState, useMemo } from 'react';
import { Check, X, List } from 'lucide-react'; // Added List icon
import { GenericTable } from '../../../../components/global/table/GenericTable'; 
import { generateData } from './mockData'; 

// --- ICONS ---
const CheckIcon = () => <Check size={18} style={{ color: '#047857' }} />;
const CrossIcon = () => <X size={18} style={{ color: '#b91c1c' }} />;

// --- MOCK DATA HELPERS ---
const generateClaimHistory = (students) => {
    return students.map(student => {
        const history = [];
        for (let i = 0; i < 31; i++) { 
            const random = Math.random();
            let status = 'check';
            if (random < 0.2) status = 'cross';
            else if (random < 0.3) status = 'dash';
            history.push(status);
        }
        return { ...student, claimHistory: history };
    });
};

const OverallClaimRecord = ({ switchView }) => {
    // --- STATE ---
    const [activeTab, setActiveTab] = useState('All');
    const [searchTerm, setSearchTerm] = useState('');

    // --- MATRIX GENERATION LOGIC ---
    const matrixData = useMemo(() => {
        const today = new Date();
        const year = today.getFullYear();
        const month = today.getMonth();
        const firstDayOfMonth = new Date(year, month, 1);

        const dayOfWeek = firstDayOfMonth.getDay() === 0 ? 7 : firstDayOfMonth.getDay();
        const offsetToMonday = (dayOfWeek === 1) ? 0 : (dayOfWeek - 1);
        const startMatrixDate = new Date(firstDayOfMonth);
        startMatrixDate.setDate(firstDayOfMonth.getDate() - offsetToMonday);

        const monthLabel = firstDayOfMonth.toLocaleString('default', { month: 'long', year: 'numeric' });
        const matrix = { monthLabel, weeks: [] };

        let currentWeekDays = [];
        let currentDateIterator = new Date(startMatrixDate);
        let weekNumber = 1;

        while (matrix.weeks.length < 5) {
            currentWeekDays.push({
                date: currentDateIterator.getDate(),
                isCurrentMonth: currentDateIterator.getMonth() === month,
            });

            if (currentWeekDays.length === 6) { 
                matrix.weeks.push({ label: `Week ${weekNumber}`, days: currentWeekDays });
                currentWeekDays = [];
                weekNumber++;
            }
            currentDateIterator.setDate(currentDateIterator.getDate() + 1);
        }
        return matrix;
    }, []);

    const totalDayColumns = matrixData.weeks.reduce((sum, week) => sum + week.days.length, 0);

    // --- DATA PREP ---
    const baseStudents = useMemo(() => generateData(), []);
    const studentsWithHistory = useMemo(() => generateClaimHistory(baseStudents), [baseStudents]);

    const filteredStudents = useMemo(() => {
        return studentsWithHistory.filter(student =>
            student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            student.program.toLowerCase().includes(searchTerm.toLowerCase())
        );
    }, [studentsWithHistory, searchTerm]);

    // --- CONFIGURATION ---
    const tabs = ['All', 'Preschool', 'Primary Education', 'Intermediate', 'Junior High School', 'Senior High School', 'Higher Education'].map(t => ({ id: t, label: t }));

    // --- CUSTOM HEADER (The Matrix) ---
    const matrixHeader = (
        <thead className="bg-gray-50 sticky top-0 z-20">
            <tr style={{ height: '40px' }}>
                <th rowSpan="2" style={{ width: '250px', padding: '12px 24px', fontWeight: 600, color: '#1f2937', fontSize: '0.875rem', borderBottom: '1px solid #e5e7eb', backgroundColor: '#f9fafb', textAlign: 'left' }}>
                    {matrixData.monthLabel}
                </th>
                {matrixData.weeks.map((week, index) => (
                    <th key={`week-${index}`} colSpan={week.days.length} style={{ padding: '8px 0', textAlign: 'center', fontWeight: 700, color: '#1f2937', fontSize: '0.75rem', borderBottom: '1px solid #e5e7eb', borderLeft: index > 0 ? '1px solid #e5e7eb' : 'none', backgroundColor: '#f9fafb' }}>
                        {week.label}
                    </th>
                ))}
            </tr>
            <tr>
                {matrixData.weeks.map(week => (
                    week.days.map((day, dayIndex) => (
                        <th key={`${week.label}-${dayIndex}`} style={{ padding: '12px 0px', textAlign: 'center', width: '40px', fontWeight: 500, color: day.isCurrentMonth ? '#1f2937' : '#9ca3af', fontSize: '0.75rem', borderBottom: '1px solid #e5e7eb', backgroundColor: '#f9fafb' }}>
                            {day.date.toString().padStart(2, '0')}
                        </th>
                    ))
                ))}
            </tr>
        </thead>
    );

    // --- RENDER ROW ---
    const renderRow = (student, index, startIndex) => {
        const cellStyle = { fontSize: '12px', fontFamily: "geist", color: "black", borderBottom: '1px solid #f3f4f6' };

        return (
            <tr key={student.id} className="hover:bg-gray-50 transition-colors">
                <td style={{
                    ...cellStyle,
                    padding: '1rem 1.5rem',
                    width: '250px',
                    fontWeight: 500,
                    color: '#1f2937',
                    borderRight: '1px solid #e5e7eb'
                }}>
                    <div style={{ marginBottom: '0.25rem' }}>{student.name}</div>
                    <div style={{ fontSize: '0.75rem', fontWeight: 400, color: '#4b5563' }}>{student.program}</div>
                </td>

                {student.claimHistory.slice(0, totalDayColumns).map((status, dayIndex) => (
                    <td key={dayIndex} style={{ ...cellStyle, padding: '0.5rem 0', textAlign: 'center', width: '40px' }}>
                        <div className="flex justify-center">
                            {status === 'check' ? <CheckIcon /> :
                                status === 'cross' ? <CrossIcon /> :
                                    <span style={{ color: '#9ca3af' }}>-</span>}
                        </div>
                    </td>
                ))}
            </tr>
        );
    };

    return (
        <GenericTable
            // Content
            title="All Students' History"
            subtitle="This table is where you can see the students' history of meal claiming."
            data={filteredStudents}

            // Custom Matrix Header
            columns={[]}
            customThead={matrixHeader}
            renderRow={renderRow}

            // Navigation
            tabs={tabs}
            activeTab={activeTab}
            onTabChange={setActiveTab}

            // --- PRIMARY ACTION (Go Back to Daily View) ---
            onPrimaryAction={switchView}
            primaryActionLabel="View Daily Records"
            primaryActionIcon={<List size={16} />} 

            // Search
            searchTerm={searchTerm}
            onSearchChange={setSearchTerm}

            // Metrics
            metrics={[
                { label: 'Total Students', value: filteredStudents.length },
                { label: 'Claimed', value: filteredStudents.filter(s => s.claimHistory.includes('check')).length, color: '#047857' },
                { label: 'Missed', value: filteredStudents.filter(s => s.claimHistory.includes('cross')).length, color: '#b91c1c' }
            ]}

            // Config
            minItems={4}
            maxItems={13}
        />
    );
};

export { OverallClaimRecord };