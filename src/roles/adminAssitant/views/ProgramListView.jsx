import React, { useState, useMemo, useEffect } from 'react';
import { AlertCircle, Hash } from 'lucide-react';
import { GenericTable } from '../../../components/global/table/GenericTable';
import { fetchAllProgramSchedule } from "../../../functions/adminAssistant/fetchAllProgramSchedule";

// --- CONFIGURATION ---
const ITEM_HEIGHT_ESTIMATE_PX = 50;

const cellStyle = {
    fontSize: '12px',
    color: '#4b5563',
    borderBottom: '1px solid #f3f4f6',
    height: '50px',
    verticalAlign: 'middle'
};

const ProgramListView = ({ switcher }) => {
    // --- STATE ---
    const [schedules, setSchedules] = useState([]);
    const [activeTab, setActiveTab] = useState('All');
    const [searchTerm, setSearchTerm] = useState('');
    const [isHovered, setIsHovered] = useState(false);

    // 🟢 1. Local Loading State
    const [isLoading, setIsLoading] = useState(true);

    // 🟢 2. Updated Fetch Logic (Using your pattern)
    const fetchData = async () => {
        setIsLoading(true);
        try {
            const response = await fetchAllProgramSchedule();

            // Handle both array (direct) or object { data: [] } response structures
            if (Array.isArray(response)) {
                setSchedules(response);
            } else if (response && Array.isArray(response.data)) {
                setSchedules(response.data);
            } else {
                setSchedules([]);
            }
        } catch (error) {
            console.error("Failed to load program schedules", error);
            setSchedules([]);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    // --- DYNAMIC TABS ---
    const tabs = useMemo(() => {
        const allTabs = [{ id: 'All', label: 'All Levels' }];
        const uniqueYears = [...new Set(schedules.map(s => s.year))].sort();

        const yearTabs = uniqueYears.map(year => ({
            id: year,
            label: `${year}${getOrdinalSuffix(year)} Year`
        }));

        return [...allTabs, ...yearTabs];
    }, [schedules]);

    // --- FILTER LOGIC ---
    const filteredSchedules = useMemo(() => {
        return schedules.filter(item => {
            const programName = (item.programName || '').toUpperCase();
            const year = item.year || '';

            let matchesTab = true;
            if (activeTab !== 'All') {
                matchesTab = year === activeTab;
            }

            const matchesSearch = programName.includes(searchTerm.toUpperCase());

            return matchesTab && matchesSearch;
        });
    }, [schedules, activeTab, searchTerm]);

    // --- ROW RENDERER ---
    const renderRow = (item, index, startIndex) => {


        return (
            <tr
                key={item._id || index}
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
                style={{
                    height: ITEM_HEIGHT_ESTIMATE_PX,
                    backgroundColor: isHovered ? "rgba(249, 250, 251, 0.8)" : "transparent", // gray-50/80
                    transition: "background-color 0.2s ease",
                }}
            >
                {/* Index */}
                <td
                    style={{
                        ...cellStyle,
                        textAlign: "center",
                        width: "64px",
                    }}
                >
                    {startIndex + index + 1}
                </td>

                {/* Program Name */}
                <td
                    style={{
                        ...cellStyle,
                        paddingLeft: "24px",
                        paddingRight: "24px",
                        fontWeight: 600,
                        color: "#111827", // gray-900
                    }}
                >
                    <div
                        style={{
                            display: "flex",
                            alignItems: "start",
                            justifyContent: "start",
                            gap: "12px", // gap-3
                        }}
                    >
                        {item.programName}
                    </div>
                </td>

                {/* Year */}
                <td
                    style={{
                        ...cellStyle,
                        paddingLeft: "24px",
                        paddingRight: "24px",
                    }}
                >
                    <span
                        style={{
                            fontFamily: "monospace", // font-mono
                            fontSize: "11px", // text-[11px]
                            backgroundColor: "#F3F4F6", // gray-100
                            padding: "4px 8px", // px-2 py-1
                            borderRadius: "4px",
                            color: "#4B5563", // gray-600
                            border: "1px solid #E5E7EB", // gray-200
                            display: "inline-block",
                        }}
                    >
                        {getOrdinal(item.year)} Year
                    </span>
                </td>

                {/* Days */}
                <td
                    style={{
                        ...cellStyle,
                        paddingLeft: "24px",
                        paddingRight: "24px",
                    }}
                >
                    <div
                        style={{
                            display: "flex",
                            flexWrap: "wrap",
                            gap: "4px", // gap-1
                        }}
                    >
                        {item.dayOfWeek && item.dayOfWeek.length > 0 ? (
                            item.dayOfWeek.map((day, idx) => (
                                <DayBadge key={idx} day={day} />
                            ))
                        ) : (
                            <span
                                style={{
                                    color: "#9CA3AF", // gray-400
                                    fontStyle: "italic",
                                    fontSize: "11px",
                                }}
                            >
                                No schedule
                            </span>
                        )}
                    </div>
                </td>
            </tr>
        );
    };

    const getOrdinal = (num) => {
        if (num % 100 >= 11 && num % 100 <= 13) {
            return `${num}th`;
        }

        switch (num % 10) {
            case 1:
                return `${num}st`;
            case 2:
                return `${num}nd`;
            case 3:
                return `${num}rd`;
            default:
                return `${num}th`;
        }
    };


    const columns = ['Program Name', 'Year Level', 'Scheduled Days'];

    const metrics = [
        { label: 'Total Programs', value: schedules.length },
        { label: 'Visible', value: filteredSchedules.length, color: '#4268BD' }
    ];

    return (
        <div style={{ width: '100%', height: '100%' }}>
            <GenericTable
                title="Program Schedules"
                subtitle="Manage meal eligibility days per program"
                data={filteredSchedules}
                columns={columns}
                renderRow={renderRow}
                metrics={metrics}
                primaryKey="_id"

                // 🟢 3. Pass Local Loading State
                isLoading={isLoading}

                emptyMessage="No schedules found"
                emptyMessageIcon={<AlertCircle size={30} strokeWidth={1.5} />}

                tabs={tabs}
                activeTab={activeTab}
                onTabChange={setActiveTab}

                searchTerm={searchTerm}
                onSearchChange={setSearchTerm}

                customActions={switcher}

                selectable={false}
                minItems={6}
            />
        </div>
    );
};

// --- HELPER COMPONENTS ---
const DayBadge = ({ day }) => {
    const dayMap = {
        'MONDAY': 'Mon', 'TUESDAY': 'Tue', 'WEDNESDAY': 'Wed',
        'THURSDAY': 'Thu', 'FRIDAY': 'Fri', 'SATURDAY': 'Sat', 'SUNDAY': 'Sun'
    };

    const shortDay = dayMap[day.toUpperCase()] || day;

    return (
        <span
            style={{
                fontSize: '10px',
                fontWeight: 600,
                padding: '2px 8px',
                borderRadius: '4px',
                backgroundColor: '#EFF6FF',
                color: '#2563EB',
                border: '1px solid #DBEAFE',
                textTransform: 'uppercase'
            }}
        >
            {shortDay}
        </span>
    );
};

function getOrdinalSuffix(i) {
    const j = i % 10, k = i % 100;
    if (j === 1 && k !== 11) return "st";
    if (j === 2 && k !== 12) return "nd";
    if (j === 3 && k !== 13) return "rd";
    return "th";
}

export { ProgramListView };