import React, { useState, useMemo } from 'react';
import {
    Check, X, CheckCircle, BarChart3, ChevronDown, Calendar,
    ArrowLeft, Users, User
} from 'lucide-react';
import { GenericTable } from '../../../../../components/global/table/GenericTable';
import { useData } from '../../../../../context/DataContext';
import { motion, AnimatePresence } from 'framer-motion';

// 🟢 Import Helpers
import { extractSchoolHierarchy } from '../../../../../functions/admin/schoolHeirarchy';

// --- 🟢 SHARED COMPONENTS (Reused from your design) ---
const SwitcherButton = ({ mode, currentMode, icon, label, onClick }) => {
    const [isHovered, setIsHovered] = useState(false);
    const isActive = currentMode === mode;
    const shouldExpand = isActive || isHovered;

    return (
        <button
            onClick={onClick}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            style={{
                padding: '6px 10px', borderRadius: '6px', fontSize: '12px', fontWeight: 500,
                border: 'none', cursor: 'pointer', outline: 'none',
                backgroundColor: isActive ? 'white' : 'transparent',
                color: isActive ? '#4268BD' : '#6b7280',
                boxShadow: isActive ? '0 1px 2px 0 rgba(0, 0, 0, 0.05)' : 'none',
                transition: 'background-color 200ms ease, color 200ms ease',
                display: 'flex', alignItems: 'center', gap: '6px', height: '32px'
            }}
        >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{icon}</div>
            <motion.span
                initial={false}
                animate={{ width: shouldExpand ? 'auto' : 0, opacity: shouldExpand ? 1 : 0 }}
                transition={{ type: "spring", stiffness: 500, damping: 30 }}
                style={{ overflow: 'hidden', whiteSpace: 'nowrap', display: 'inline-block' }}
            >
                {label}
            </motion.span>
        </button>
    );
};

const CheckIcon = () => <Check size={16} style={{ color: '#059669' }} strokeWidth={3} />;
const CrossIcon = () => <X size={16} style={{ color: '#DC2626' }} strokeWidth={3} />;
const WaivedIcon = () => <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#F59E0B' }} />;

// --- 🟢 HELPER: Extract Months ---
const extractAvailableMonths = (data = []) => {
    const monthSet = new Set();
    const months = [];
    const formatDate = (d) => d.toLocaleString('default', { month: 'long', year: 'numeric' });

    // Default to Current Month
    const current = new Date();
    const currentKey = formatDate(current);
    monthSet.add(currentKey);
    months.push({ label: currentKey, value: current.toISOString() });

    // Scan Data
    if (Array.isArray(data)) {
        data.forEach(cat => {
            if (cat.levels) {
                cat.levels.forEach(lvl => {
                    if (lvl.sections) {
                        lvl.sections.forEach(sec => {
                            if (sec.students) {
                                sec.students.forEach(student => {
                                    if (student.claimRecords) {
                                        student.claimRecords.forEach(rec => {
                                            if (rec.date) {
                                                const d = new Date(rec.date);
                                                const key = formatDate(d);
                                                if (!monthSet.has(key)) {
                                                    monthSet.add(key);
                                                    months.push({ label: key, value: new Date(d.getFullYear(), d.getMonth(), 1).toISOString() });
                                                }
                                            }
                                        });
                                    }
                                });
                            }
                        });
                    }
                });
            }
        });
    }
    return months.sort((a, b) => new Date(b.value) - new Date(a.value));
};

// --- 🟢 HELPER: Monthly Claim Map ---
const getMonthlyClaimMap = (history = [], targetMonthDate) => {
    const dayMap = {};
    if (!targetMonthDate) return dayMap;
    const targetMonth = targetMonthDate.getMonth();
    const targetYear = targetMonthDate.getFullYear();

    history.forEach(record => {
        if (!record.date) return;
        const recDate = new Date(record.date);
        if (recDate.getMonth() === targetMonth && recDate.getFullYear() === targetYear) {
            const day = recDate.getDate();
            const remarks = Array.isArray(record.remarks) ? record.remarks : [record.remarks];

            let status = 'dash';
            if (remarks.includes("CLAIMED")) status = 'check';
            else if (remarks.includes("UNCLAIMED")) status = 'cross';
            else if (remarks.includes("WAIVED")) status = 'waived';

            dayMap[day] = status;
        }
    });
    return dayMap;
};

const OverallClaimRecord = ({ switchView, currentView }) => {
    const { overallClaimRecord = [] } = useData();

    // --- STATE ---
    const [activeTab, setActiveTab] = useState('All');
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedSection, setSelectedSection] = useState(null); // 🟢 Controls Drill Down
    const [currentMatrixDate, setCurrentMatrixDate] = useState(new Date());

    // --- TABS ---
    const tabs = ['All', 'Preschool', 'Primary Education', 'Intermediate', 'Junior High School', 'Senior High School', 'Higher Education'].map(t => ({ id: t, label: t }));

    // --- CATEGORY MAP ---
    const CATEGORY_MAP = useMemo(() => ({
        'preschool': 'Preschool', 'primaryEducation': 'Primary Education', 'intermediate': 'Intermediate',
        'juniorHighSchool': 'Junior High School', 'seniorHighSchool': 'Senior High School', 'higherEducation': 'Higher Education',
        'Preschool': 'Preschool', 'Primary Education': 'Primary Education', 'Intermediate': 'Intermediate',
        'Junior High School': 'Junior High School', 'Senior High School': 'Senior High School'
    }), []);

    // --- DATA PREP: PARENT VIEW (Sections List) ---
    const sectionsList = useMemo(() => {
        const list = [];
        if (Array.isArray(overallClaimRecord)) {
            overallClaimRecord.forEach(cat => {
                const niceCategory = CATEGORY_MAP[cat.category] || cat.category;
                if (cat.levels) {
                    cat.levels.forEach(lvl => {
                        const levelName = lvl.levelName || lvl.level;
                        if (lvl.sections) {
                            lvl.sections.forEach(sec => {
                                // Apply Filters
                                const matchesTab = activeTab === 'All' || niceCategory === activeTab;
                                const matchesSearch = !searchTerm || sec.section.toLowerCase().includes(searchTerm.toLowerCase());

                                if (matchesTab && matchesSearch) {
                                    list.push({
                                        id: `${sec.section}-${levelName}`,
                                        sectionName: sec.section,
                                        program: `${sec.section} - ${levelName}`,
                                        category: niceCategory,
                                        studentCount: sec.students ? sec.students.length : 0,
                                        students: sec.students || [] // Keep raw students for drill down
                                    });
                                }
                            });
                        }
                    });
                }
            });
        }
        return list;
    }, [overallClaimRecord, activeTab, searchTerm, CATEGORY_MAP]);

    // --- DATA PREP: CHILD VIEW (Student Matrix) ---
    const processedStudents = useMemo(() => {
        if (!selectedSection) return [];

        return selectedSection.students
            .filter(s => !searchTerm || s.name.toLowerCase().includes(searchTerm.toLowerCase()))
            .map(s => ({
                id: s.id || s._id || Math.random(),
                name: s.name,
                studentId: s.studentId, // Ensure ID is displayed
                program: selectedSection.program,
                claimMap: getMonthlyClaimMap(s.claimRecords || [], currentMatrixDate)
            }));
    }, [selectedSection, searchTerm, currentMatrixDate]);

    // --- MATRIX HEADER LOGIC ---
    const availableMonths = useMemo(() => extractAvailableMonths(overallClaimRecord), [overallClaimRecord]);

    const matrixData = useMemo(() => {
        const year = currentMatrixDate.getFullYear();
        const month = currentMatrixDate.getMonth();
        const daysInMonth = new Date(year, month + 1, 0).getDate();

        const matrix = { weeks: [] };
        let currentDay = 1;
        let weekNumber = 1;
        let currentWeekDays = [];

        while (currentDay <= daysInMonth) {
            currentWeekDays.push({ date: currentDay });
            if (currentWeekDays.length === 7 || currentDay === daysInMonth) {
                matrix.weeks.push({ label: `W${weekNumber}`, days: currentWeekDays });
                currentWeekDays = [];
                weekNumber++;
            }
            currentDay++;
        }
        return matrix;
    }, [currentMatrixDate]);

    // --- VIEW 1: SECTIONS LIST RENDERER ---
    const renderSectionRow = (item) => {
        const cellStyle = { fontFamily: 'geist, sans-serif', fontSize: '12px', color: '#4b5563', borderBottom: '1px solid #f3f4f6', height: '43.5px', verticalAlign: 'middle' };

        return (
            <tr
                key={item.id}
                className="hover:bg-gray-50 transition-colors cursor-pointer"
                onClick={() => { setSearchTerm(''); setSelectedSection(item); }}
            >
                <td></td>
                <td style={{ ...cellStyle, fontWeight: 500, color: '#111827', paddingLeft: '24px' }}>
                    <div className="flex items-center gap-2">
                        <Users size={14} className="text-blue-500" />
                        {item.sectionName}
                    </div>
                </td>
                <td style={cellStyle}>{item.program}</td>
                <td style={cellStyle}>{item.category}</td>
                <td style={cellStyle}>{item.studentCount} Students</td>
            </tr>
        );
    };

    // --- VIEW 2: STUDENT MATRIX RENDERER ---
    const renderMatrixRow = (student) => {
        const cellStyle = { fontSize: '12px', fontFamily: "geist", color: "black", borderBottom: '1px solid #f3f4f6', height: '42px' };
        return (
            <tr key={student.id} className="hover:bg-gray-50 transition-colors">
                <td style={{ ...cellStyle, width: '250px', fontWeight: 500, color: '#1f2937', borderRight: '1px solid #e5e7eb' }}>
                    <div style={{ marginBottom: '0.25rem', display: 'flex', alignItems: 'center', gap: '8px', paddingLeft: "30px" }}>
                        <div style={{ width: 24, height: 24, borderRadius: '50%', backgroundColor: '#e5e7eb', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <User size={14} className="text-gray-500" />
                        </div>
                        {student.name}
                    </div>
                    <div style={{ fontSize: '0.75rem', fontWeight: 400, color: '#4b5563', paddingLeft: '32px' }}>{student.studentId}</div>
                </td>
                {matrixData.weeks.map(week => (
                    week.days.map(day => {
                        const status = student.claimMap[day.date];
                        return (
                            <td key={day.date} style={{ ...cellStyle, padding: '0.5rem 0', textAlign: 'center', width: '36px' }}>
                                <div className="flex justify-center items-center h-full">
                                    {status === 'check' ? <CheckIcon /> : status === 'cross' ? <CrossIcon /> : status === 'waived' ? <WaivedIcon /> : <span style={{ color: '#e5e7eb', fontSize: '10px' }}>•</span>}
                                </div>
                            </td>
                        );
                    })
                ))}
            </tr>
        );
    };

    const matrixHeader = (
        <thead className="bg-gray-50 sticky top-0 z-20">
            <tr style={{ height: '40px' }}>
                <th rowSpan="2" style={{ width: '250px', padding: '0', borderBottom: '1px solid #e5e7eb', backgroundColor: '#f9fafb', verticalAlign: 'middle' }}>
                    <div style={{ padding: '0 16px', display: 'flex', alignItems: 'center', height: '100%' }}>
                        <div style={{ position: 'relative', width: '100%' }}>
                            <select
                                value={currentMatrixDate.toISOString()}
                                onChange={(e) => setCurrentMatrixDate(new Date(e.target.value))}
                                style={{ appearance: 'none', backgroundColor: 'transparent', border: '1px solid #e5e7eb', borderRadius: '6px', padding: '6px 30px 6px 10px', fontSize: '13px', fontWeight: 600, color: '#374151', width: '100%', cursor: 'pointer', outline: 'none' }}
                            >
                                {availableMonths.map((m, idx) => (
                                    <option key={idx} value={m.value}>{m.label}</option>
                                ))}
                            </select>
                            <Calendar size={14} style={{ position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none', color: '#6b7280' }} />
                        </div>
                    </div>
                </th>
                {matrixData.weeks.map((week, index) => (
                    <th key={`week-${index}`} colSpan={week.days.length} style={{ padding: '8px 0', textAlign: 'center', fontWeight: 700, color: '#1f2937', fontSize: '0.75rem', borderBottom: '1px solid #e5e7eb', borderLeft: index > 0 ? '1px solid #e5e7eb' : 'none', backgroundColor: '#f9fafb' }}>
                        {week.label}
                    </th>
                ))}
            </tr>
            <tr>
                {matrixData.weeks.map(week => week.days.map(day => (
                    <th key={day.date} style={{ padding: '8px 0', textAlign: 'center', width: '36px', fontWeight: 500, color: '#1f2937', fontSize: '0.70rem', borderBottom: '1px solid #e5e7eb', backgroundColor: '#f9fafb', borderLeft: '1px solid #e5e7eb' }}>
                        {day.date}
                    </th>
                )))}
            </tr>
        </thead>
    );

    // --- MAIN RENDER ---
    const viewSwitcher = (
        <div style={{ backgroundColor: '#f3f4f6', padding: '4px', borderRadius: '8px', display: 'flex', gap: '4px', margin: "5px" }}>
            <SwitcherButton mode="eligible" currentMode={currentView} icon={<CheckCircle size={14} />} label="Eligible Sections" onClick={() => switchView('eligible')} />
            <SwitcherButton mode="overall" currentMode={currentView} icon={<BarChart3 size={14} />} label="Overall Record" onClick={() => switchView('overall')} />
        </div>
    );

    const pageTransition = {
        initial: { opacity: 0, x: 20 },
        animate: { opacity: 1, x: 0 },
        exit: { opacity: 0, x: -20 },
        transition: { duration: 0.2 }
    };

    return (
        <AnimatePresence mode="wait">
            {selectedSection ? (
                // 🟢 VIEW 2: SELECTED SECTION (MATRIX)
                <motion.div
                    key="matrix-view" // 👈 CRITICAL: Unique Key prevents glitch
                    {...pageTransition}
                    style={{ width: '100%' }}
                >
                    <GenericTable
                        title={`History: ${selectedSection.program}`}
                        subtitle={`Claim record history for ${selectedSection.studentCount} students.`}
                        data={processedStudents}
                        columns={[]}
                        customThead={matrixHeader}
                        renderRow={renderMatrixRow}

                        searchTerm={searchTerm}
                        onSearchChange={setSearchTerm}

                        metrics={[
                            { label: 'Total Students', value: processedStudents.length },
                            { label: 'Claims (Month)', value: processedStudents.reduce((acc, s) => acc + Object.values(s.claimMap).filter(v => v === 'check').length, 0), color: '#059669' }
                        ]}

                        onPrimaryAction={() => setSelectedSection(null)}
                        primaryActionLabel="Back to Sections"
                        primaryActionIcon={<ArrowLeft size={16} />}
                    />
                </motion.div>
            ) : (
                // 🟢 VIEW 1: SECTIONS LIST
                <motion.div
                    key="list-view" // 👈 CRITICAL: Unique Key prevents glitch
                    {...pageTransition}
                    style={{ width: '100%' }}
                >
                    <GenericTable
                        title="Overall Claim Records"
                        subtitle="Select a section to view detailed history."
                        data={sectionsList}
                        columns={['Section', 'Program', 'Category', 'Total Students']}
                        renderRow={renderSectionRow}

                        customActions={viewSwitcher}
                        tabs={tabs}
                        activeTab={activeTab}
                        onTabChange={setActiveTab}
                        searchTerm={searchTerm}
                        onSearchChange={setSearchTerm}

                        metrics={[
                            { label: 'Total Sections', value: sectionsList.length },
                            { label: 'Total Students', value: sectionsList.reduce((acc, s) => acc + s.studentCount, 0), color: '#3B82F6' }
                        ]}
                    />
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export { OverallClaimRecord };