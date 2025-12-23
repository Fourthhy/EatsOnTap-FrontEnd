import React, { useState, useMemo } from 'react';
import { AddEventForm } from './AddEventForm';
import { ViewUpcomingEvent } from './ViewUpcomingEvent';
import { ViewRecentEvent } from './ViewRecentEvent';
import { ButtonGroup } from '../../../../components/global/ButtonGroup';

// IMPORT THE NEW DISPLAYER
import { EventDisplayer } from './EventDisplayer';

// --- MOCK DATA (Replace with your actual API/Data source) ---
const MOCK_ALL_EVENTS = [
    // 1. UPCOMING EVENT (Future Date)
    {
        id: 1,
        eventName: "Christmas Party 2025",
        eventDate: "2025-12-25",
        selectedColor: "#dbeafe", // Blue
        selectedDepartments: ["Preschool", "Primary Education"],
        selectedPrograms: ["Kindergarten", "Grade 1", "Grade 2"]
    },

    // 2. RECENT EVENT (Past Date)
    {
        id: 2,
        eventName: "Annual Intramurals",
        eventDate: "2023-10-01",
        selectedColor: "#fee2e2", // Red
        selectedDepartments: ["Junior High School", "Senior High School"],
        selectedPrograms: ["Grade 7", "Grade 11", "Grade 12"]
    },

    // 3. ONGOING EVENT
    {
        id: 3,
        eventName: "Foundation Day Celebration",
        // This gives you YYYY-MM-DD in your Local Timezone, guaranteed
        eventDate: new Date().toLocaleDateString('en-CA'),
        selectedColor: "#dcfce7",
        selectedDepartments: ["Higher Education", "Senior High School"],
        selectedPrograms: ["BSIT", "BSBA", "AB Psychology"]
    },

    // 4. ANOTHER UPCOMING (To help you test the Grid layout)
    {
        id: 4,
        eventName: "Parents Orientation",
        eventDate: "2025-08-15",
        selectedColor: "#fef9c3", // Yellow
        selectedDepartments: ["All"],
        selectedPrograms: ["All Levels"]
    }
];

const VIEWS = {
    DASHBOARD: 'DASHBOARD',
    VIEW_UPCOMING_EVENT: 'VIEW_UPCOMING_EVENT',
    VIEW_RECENT_EVENT: 'VIEW_RECENT_EVENT',
};

const buttonListGroup = [
    { id: "ongoing", label: "Ongoing Events" },
    { id: "upcoming", label: "Upcoming Events" },
    { id: "recent", label: "Recent Events" },
];

export function EventDashboard() {
    // State
    const [currentView, setCurrentView] = useState(VIEWS.DASHBOARD);
    const [selectedEventId, setSelectedEventId] = useState(null);
    const [activeTab, setActiveTab] = useState("ongoing");

    // --- 1. FILTERING LOGIC (The "Brain") ---
    const filteredEvents = useMemo(() => {
        // 1. Get "Today" at midnight in LOCAL time
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        return MOCK_ALL_EVENTS.filter(event => {
            // 2. PARSING FIX: 
            // Instead of new Date(string), which defaults to UTC, 
            // we split the string to manually construct a LOCAL date.
            const [year, month, day] = event.eventDate.split('-').map(Number);

            // Note: Month is 0-indexed in JS (0 = Jan, 11 = Dec)
            const eventDate = new Date(year, month - 1, day);
            eventDate.setHours(0, 0, 0, 0);

            switch (activeTab) {
                case 'ongoing':
                    return eventDate.getTime() === today.getTime();
                case 'upcoming':
                    return eventDate.getTime() > today.getTime();
                case 'recent':
                    return eventDate.getTime() < today.getTime();
                default:
                    return true;
            }
        });
    }, [activeTab]);

    // --- HANDLERS ---
    const handleViewDetails = (eventId) => {
        setSelectedEventId(eventId);
        // Determine view based on active tab
        if (activeTab === "upcoming") { setCurrentView(VIEWS.VIEW_UPCOMING_EVENT); }
        else if (activeTab === "recent") { setCurrentView(VIEWS.VIEW_RECENT_EVENT); }
        else {
            // Handle ongoing view details if needed, or default to upcoming view
            setCurrentView(VIEWS.VIEW_UPCOMING_EVENT);
        }
    };

    const handleBackToDashboard = () => {
        setCurrentView(VIEWS.DASHBOARD);
        setSelectedEventId(null);
    };

    // --- STYLES ---
    const dashboardStyle = {
        backgroundColor: '#F7F9F9',
        padding: 15,
        boxSizing: 'border-box',
        fontFamily: 'sans-serif',
        display: 'flex',
        flexDirection: 'column', // Changed to column to stack header and grid
        gap: '1rem',
        height: '100%',
        overflow: 'hidden',
    };

    // --- RENDER ---
    return (
        <div className="w-full h-full">

            {/* 1. TOP BAR (Navigation & Add Button) */}
            <div style={dashboardStyle}>
                <div
                    className="w-full flex justify-between items-center px-4 py-2 bg-white rounded-md shadow-md"
                    style={{ padding: 5 }}
                >
                    <ButtonGroup
                        buttonListGroup={buttonListGroup}
                        activeId={activeTab}
                        onSetActiveId={setActiveTab} // Simple state setter
                        activeColor="#4268BD"
                    />
                    <AddEventForm />
                </div>

                {/* 2. MAIN CONTENT AREA */}
                <div className="flex-1 overflow-y-auto">
                    {currentView === VIEWS.VIEW_UPCOMING_EVENT ? (
                        <ViewUpcomingEvent eventId={selectedEventId} onBackToDashboard={handleBackToDashboard} />
                    ) : currentView === VIEWS.VIEW_RECENT_EVENT ? (
                        <ViewRecentEvent eventId={selectedEventId} onBackToDashboard={handleBackToDashboard} />
                    ) : (
                        /* DASHBOARD VIEW
                           Here is the clean implementation. No more if/else blocks for content.
                           We just pass the filtered list to the displayer.
                        */
                        <EventDisplayer
                            events={filteredEvents}
                            onEventClick={handleViewDetails}
                        />
                    )}
                </div>
            </div>
        </div>
    );
}