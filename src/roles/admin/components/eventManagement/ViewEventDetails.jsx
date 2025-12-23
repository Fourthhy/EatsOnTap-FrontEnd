import React, { useState, useMemo } from 'react';
import { ArrowLeft, UserPlus, Download, CheckCircle, XCircle } from 'lucide-react';
import { GenericTable } from '../../../../components/global/table/GenericTable'; // Adjust path if needed

// --- 1. RE-USE THE MOCK DATA SOURCE (Or import it) ---
// In a real app, you might pass the full event object as a prop, or fetch it by ID.
const MOCK_EVENTS_LOOKUP = [
    {
        id: 1,
        eventName: "Christmas Party 2025",
        eventDate: "2025-12-25",
        selectedPrograms: ["Kindergarten", "Grade 1", "Grade 2"]
    },
    {
        id: 2,
        eventName: "Annual Intramurals",
        eventDate: "2023-10-01",
        selectedPrograms: ["Grade 7", "Grade 11", "Grade 12"]
    },
    {
        id: 3,
        eventName: "Foundation Day Celebration",
        eventDate: new Date().toLocaleDateString('en-CA'),
        selectedPrograms: ["BSIT", "BSBA", "AB Psychology"]
    },
    {
        id: 4,
        eventName: "Parents Orientation",
        eventDate: "2025-08-15",
        selectedPrograms: ["All Levels"]
    }
];

// --- 2. MOCK PARTICIPANT GENERATOR ---
// This creates fake students for the table based on the event
const generateMockParticipants = (eventId, programs) => {
    // Just generating some dummy data for visual testing
    const statuses = ['Registered', 'Attended', 'Absent'];
    const dummyNames = ['Alice Johnson', 'Bob Smith', 'Charlie Brown', 'Diana Prince', 'Evan Wright', 'Fiona Gallagher'];

    let data = [];
    programs.forEach(prog => {
        for (let i = 0; i < 5; i++) { // 5 students per program
            const randomStatus = statuses[Math.floor(Math.random() * statuses.length)];
            data.push({
                id: `${eventId}-${prog}-${i}`,
                name: dummyNames[i] || `Student ${i + 1}`,
                studentId: `2023-${1000 + i}`,
                program: prog,
                status: randomStatus
            });
        }
    });
    return data;
};

const ViewEventDetails = ({ eventId, onBackToDashboard }) => {

    // 1. Find the Event Data
    const eventData = useMemo(() => {
        return MOCK_EVENTS_LOOKUP.find(e => e.id === eventId) || {};
    }, [eventId]);

    // 2. Generate Data for Table
    const tableData = useMemo(() => {
        if (!eventData.selectedPrograms) return [];
        return generateMockParticipants(eventId, eventData.selectedPrograms);
    }, [eventData, eventId]);

    // 3. Table State
    const [activeTab, setActiveTab] = useState('All');
    const [searchTerm, setSearchTerm] = useState('');

    // 4. Dynamic Tabs Logic
    // We create an "All" tab, plus one tab for each Program in the event
    const tabs = useMemo(() => {
        const programTabs = (eventData.selectedPrograms || []).map(prog => ({
            id: prog,
            label: prog
        }));
        return [{ id: 'All', label: 'All Participants' }, ...programTabs];
    }, [eventData]);

    // 5. Filtering Logic (Search + Tab)
    const filteredData = useMemo(() => {
        return tableData.filter(item => {
            // Tab Filter
            const matchesTab = activeTab === 'All' ? true : item.program === activeTab;
            // Search Filter
            const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                item.studentId.includes(searchTerm);

            return matchesTab && matchesSearch;
        });
    }, [tableData, activeTab, searchTerm]);

    // 6. Metrics Calculation
    const metrics = useMemo(() => {
        return [
            { label: 'Total Invited', value: tableData.length, color: '#4268BD' },
            { label: 'Attended', value: tableData.filter(i => i.status === 'Attended').length, color: '#166534' } // Green
        ];
    }, [tableData]);

    // --- RENDER ROW FUNCTION ---
    // --- RENDER ROW FUNCTION ---
    const renderRow = (item, index, startIndex) => {

        // 1. Shared Typography Style
        const cellStyle = {
            fontFamily: 'geist',
            fontSize: 13,
            fontWeight: 450,
            color: '#4b5563', // equivalent to text-gray-600 (adjust if needed)
            padding: '12px 24px', // Standard py-3 px-6
        };

        // 2. Status Badge Logic
        const getStatusStyle = (status) => {
            switch (status) {
                case 'Attended': return { bg: '#dcfce7', text: '#166534', icon: CheckCircle };
                case 'Absent': return { bg: '#fee2e2', text: '#991b1b', icon: XCircle };
                default: return { bg: '#f3f4f6', text: '#4b5563', icon: null };
            }
        };
        const statusStyle = getStatusStyle(item.status);
        const StatusIcon = statusStyle.icon;

        return (
            <tr key={item.id} className="hover:bg-gray-50 transition-colors border-b border-gray-100 last:border-b-0">
                {/* Index Column */}
                <td style={cellStyle}>
                    {startIndex + index + 1}
                </td>

                {/* Name Column - Overriding color to be slightly darker/bold if desired, or keeping uniform */}
                <td style={{ ...cellStyle, color: '#111827', fontWeight: 500 }}>
                    {item.name}
                </td>

                {/* Student ID Column */}
                <td style={cellStyle}>
                    {item.studentId}
                </td>

                {/* Section/Program Column */}
                <td style={cellStyle}>
                    <span style={{
                        padding: '4px 8px',
                        borderRadius: '9999px',
                        backgroundColor: '#eff6ff', // blue-50
                        color: '#1d4ed8', // blue-700
                        border: '1px solid #dbeafe', // blue-100
                        fontSize: 11, // Slightly smaller for tag
                        fontWeight: 500,
                        fontFamily: 'geist'
                    }}>
                        {item.program}
                    </span>
                </td>

                {/* Status Column */}
                <td style={cellStyle}>
                    <span style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '6px',
                        padding: '4px 10px',
                        borderRadius: '9999px',
                        backgroundColor: statusStyle.bg,
                        color: statusStyle.text,
                        fontSize: 11,
                        fontWeight: 500,
                        fontFamily: 'geist'
                    }}>
                        {StatusIcon && <StatusIcon size={12} />}
                        {item.status}
                    </span>
                </td>
            </tr>
        );
    };

    if (!eventData.id) return <div>Event not found</div>;

    return (
        <div className="flex flex-col h-full gap-4">
            {/* 1. BACK BUTTON (Outside the table) */}
            <div>
                <button
                    onClick={onBackToDashboard}
                    className="flex items-center gap-2 text-gray-500 hover:text-gray-800 transition-colors text-sm font-medium font-geist"
                >
                    <ArrowLeft size={16} />
                    Back to Dashboard
                </button>
            </div>

            {/* 2. THE GENERIC TABLE */}
            <GenericTable
                // Titles
                title={eventData.eventName}
                subtitle={null} // Explicitly null as requested

                // Navigation
                tabs={tabs}
                activeTab={activeTab}
                onTabChange={setActiveTab}

                // Actions
                primaryActionLabel="Export List"
                primaryActionIcon={<Download size={16} />}
                onPrimaryAction={() => alert("Exporting logic here...")}

                // Data & Metrics
                columns={["Name", "Student ID", "Section", "Status"]}
                data={filteredData}
                totalRecords={filteredData.length}
                metrics={metrics}

                // Search
                searchTerm={searchTerm}
                onSearchChange={setSearchTerm}

                // Rendering
                renderRow={renderRow}
            />
        </div>
    );
};

export { ViewEventDetails };