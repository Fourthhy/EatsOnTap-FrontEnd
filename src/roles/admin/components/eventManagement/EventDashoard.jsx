import React, { useState, useMemo } from 'react';
import { AddEventForm } from './AddEventForm';
import { ButtonGroup } from '../../../../components/global/ButtonGroup';
import { EventDisplayer } from './EventDisplayer';
import { EventDetailModal } from './EventDetailModal'; // IMPORT THE NEW MODAL

// --- MOCK DATA (Ensure this is defined or imported) ---
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

const buttonListGroup = [
    { id: "ongoing", label: "Ongoing Events" },
    { id: "upcoming", label: "Upcoming Events" },
    { id: "recent", label: "Recent Events" },
];

export function EventDashboard() {
    const [activeTab, setActiveTab] = useState("ongoing");

    // --- MODAL STATE ---
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedEventId, setSelectedEventId] = useState(null);

    // --- FILTERING LOGIC ---
    const filteredEvents = useMemo(() => {
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        return MOCK_ALL_EVENTS.filter(event => {
            // FIX: Parse manual YYYY-MM-DD string to Local Date
            const [y, m, d] = event.eventDate.split('-').map(Number);
            const eventDate = new Date(y, m - 1, d);
            eventDate.setHours(0, 0, 0, 0);

            switch (activeTab) {
                case 'ongoing': return eventDate.getTime() === today.getTime();
                case 'upcoming': return eventDate.getTime() > today.getTime();
                case 'recent': return eventDate.getTime() < today.getTime();
                default: return true;
            }
        });
    }, [activeTab]);

    // --- HANDLERS ---
    const handleCardClick = (eventId) => {
        setSelectedEventId(eventId);
        setIsModalOpen(true); // Just open the modal
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setTimeout(() => setSelectedEventId(null), 300); // clear after animation
    };

    // --- STYLES ---
    const dashboardStyle = {
        backgroundColor: '#F7F9F9',
        padding: 15,
        fontFamily: 'sans-serif',
        display: 'flex',
        flexDirection: 'column',
        gap: '1rem',
        height: '100%',
        overflow: 'hidden',
    };

    return (
        <div className="w-full h-full relative">

            {/* THE MODAL */}
            <EventDetailModal
                isOpen={isModalOpen}
                onClose={handleCloseModal}
                events={filteredEvents} // Pass the FULL LIST for Next/Prev logic
                initialEventId={selectedEventId}
            />

            {/* DASHBOARD CONTENT */}
            <div style={dashboardStyle}>
                <div className="w-full flex justify-between items-center px-4 py-2 bg-white rounded-md shadow-md">
                    <ButtonGroup
                        buttonListGroup={buttonListGroup}
                        activeId={activeTab}
                        onSetActiveId={setActiveTab}
                        activeColor="#4268BD"
                    />
                    <AddEventForm />
                </div>

                <div className="flex-1 overflow-y-auto">
                    <EventDisplayer
                        events={filteredEvents}
                        onEventClick={handleCardClick} // Triggers the modal
                    />
                </div>
            </div>
        </div>
    );
}