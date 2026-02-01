import React, { useState, useMemo, useEffect } from 'react';
import { User, AlertCircle, Plus } from 'lucide-react'; // 🟢 Added Plus icon
import { GenericTable } from '../../../components/global/table/GenericTable';
import { getStudentsWithProgramOnly } from '../../../functions/adminAssistant/getStudentsWithProgramOnly';

// 🟢 Import the Modal (Adjust path if necessary)
import { AddStudentModal } from '../components/AddStudentModal';

// --- CONFIGURATION ---
const ITEM_HEIGHT_ESTIMATE_PX = 44;

const cellStyle = {
    fontSize: '12px',
    color: '#4b5563',
    borderBottom: '1px solid #f3f4f6',
    height: '44px',
    verticalAlign: 'middle'
};

const StudentListView = ({switcher}) => {
    // --- STATE ---
    const [students, setStudents] = useState([]);
    const [activeTab, setActiveTab] = useState('All');
    const [searchTerm, setSearchTerm] = useState('');
    const [isLoading, setIsLoading] = useState(true);

    // 🟢 Modal State
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);

    // --- FETCH DATA ---
    const fetchData = async () => {
        setIsLoading(true);
        try {
            const response = await getStudentsWithProgramOnly();
            if (response && Array.isArray(response.data)) {
                setStudents(response.data);
            } else {
                setStudents([]);
            }
        } catch (error) {
            console.error("Failed to load students", error);
            setStudents([]);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    // --- DYNAMIC TABS GENERATOR ---
    const tabs = useMemo(() => {
        const allTabs = [{ id: 'All', label: 'All' }];
        const uniquePrograms = [...new Set(students.map(s => s.program))].filter(Boolean).sort();
        const programTabs = uniquePrograms.map(prog => ({ id: prog, label: prog }));
        return [...allTabs, ...programTabs];
    }, [students]);

    // --- FILTER LOGIC ---
    const filteredStudents = useMemo(() => {
        return students.filter(student => {
            const fullName = `${student.first_name || ''} ${student.middle_name || ''} ${student.last_name || ''}`.toLowerCase();
            const studentId = (student.studentID || '').toLowerCase();
            const program = student.program || '';

            let matchesTab = true;
            if (activeTab !== 'All') {
                matchesTab = program === activeTab;
            }

            const matchesSearch = fullName.includes(searchTerm.toLowerCase()) || studentId.includes(searchTerm.toLowerCase());

            return matchesTab && matchesSearch;
        });
    }, [students, activeTab, searchTerm]);

    // --- ROW RENDERER ---
    const renderRow = (student, index, startIndex) => {
        const displayName = `${student.first_name} ${student.middle_name ? student.middle_name[0] + '.' : ''} ${student.last_name}`;
        const status = student.temporaryClaimStatus?.[0] || 'PENDING';
        const type = student.academicStatus?.[0] || 'REGULAR';
        const programDisplay = `${student.program} - ${student.year}`;

        return (
            <tr
                key={student._id || index}
                className="hover:bg-gray-50/80 transition-colors"
                style={{ height: ITEM_HEIGHT_ESTIMATE_PX }}
            >
                <td style={{ ...cellStyle, textAlign: 'center', width: '64px' }}>
                    {startIndex + index + 1}
                </td>
                <td style={{ ...cellStyle, paddingRight: '24px', fontWeight: 500, color: '#111827' }}>
                    <div className="flex items-center gap-3">
                        <div className="font-geist text-xs w-6 h-6 rounded-full bg-gray-100 flex items-center justify-center text-gray-400">
                            <User size={12} />
                        </div>
                        {displayName}
                    </div>
                </td>
                <td style={{ ...cellStyle, paddingRight: '24px' }}>
                    <span className="font-geist text-xs">
                        {student.studentID}
                    </span>
                </td>
                <td style={{ ...cellStyle, paddingRight: '24px' }}>
                    {programDisplay}
                </td>
                <td style={{ ...cellStyle, paddingRight: '24px', textTransform: 'capitalize' }}>
                    {type.toLowerCase()}
                </td>
                <td style={{ ...cellStyle, paddingRight: '24px' }}>
                    <StatusBadge status={status} />
                </td>
            </tr>
        );
    };

    // --- CONFIG ---
    const columns = ['Student Name', 'ID', 'Program / Year', 'Type', 'Status'];

    const metrics = [
        { label: 'Total Fetched', value: students.length },
        { label: 'Shown', value: filteredStudents.length, color: '#4268BD' }
    ];

    return (
        <div style={{ width: '100%', height: '100%' }}>
            <GenericTable
                // Content
                title="Student Masterlist"
                subtitle="View and manage student records"
                data={filteredStudents}
                columns={columns}
                renderRow={renderRow}
                metrics={metrics}
                primaryKey="_id"

                customActions={switcher}

                // Loading State
                isLoading={isLoading}

                // Empty State
                emptyMessage={students.length === 0 && !isLoading ? "No data loaded" : "No students found"}
                emptyMessageIcon={<AlertCircle size={30} strokeWidth={1.5} />}

                // Navigation
                tabs={tabs}
                activeTab={activeTab}
                onTabChange={setActiveTab}

                // Search
                searchTerm={searchTerm}
                onSearchChange={setSearchTerm}

                // Config
                selectable={false}
                minItems={6}
            />

            {/* 🟢 MODAL RENDER */}
            <AddStudentModal
                isOpen={isAddModalOpen}
                onClose={() => {
                    setIsAddModalOpen(false);
                    fetchData(); // Refresh list when modal closes after success
                }}
            />
        </div>
    );
};

// --- SUB-COMPONENTS ---
const StatusBadge = ({ status }) => {
    const normalizedStatus = (status || "").toUpperCase();

    const config = {
        'ELIGIBLE': { bg: '#ECFDF5', text: '#047857', dot: '#10B981' },
        'INELIGIBLE': { bg: '#FEF2F2', text: '#B91C1C', dot: '#EF4444' },
        'PENDING': { bg: '#FFFBEB', text: '#B45309', dot: '#F59E0B' },
        'DEFAULT': { bg: '#F3F4F6', text: '#4B5563', dot: '#9CA3AF' }
    };

    const style = config[normalizedStatus] || config.DEFAULT;

    return (
        <span
            style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                padding: '4px 10px',
                borderRadius: '9999px',
                fontSize: '11px',
                fontWeight: 500,
                backgroundColor: style.bg,
                color: style.text
            }}
        >
            <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: style.dot }} />
            {status}
        </span>
    );
};

export { StudentListView };