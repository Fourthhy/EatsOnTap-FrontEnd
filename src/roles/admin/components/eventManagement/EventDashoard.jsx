import React, { useState, useMemo } from 'react';
import { AddEventForm } from './AddEventForm';
import { ButtonGroup } from '../../../../components/global/ButtonGroup';
import { EventDisplayer } from './EventDisplayer';
import { EventDetailModal } from './EventDetailModal';

// --- MOCK DATA ---
// explicitly defined classification as requested
const MOCK_ALL_EVENTS = [
    {
        id: 1,
        eventName: "Christmas Party 2025",
        eventDate: "2025-12-25",
        classification: "upcoming", // Explicit Definition
        selectedColor: "#dbeafe",
        selectedDepartments: ["Preschool", "Primary Education"],
        selectedPrograms: ["Kindergarten", "Grade 1", "Grade 2"]
    },
    {
        id: 2,
        eventName: "Annual Intramurals",
        eventDate: "2023-10-01",
        classification: "recent", // Explicit Definition
        selectedColor: "#fee2e2",
        selectedDepartments: ["Junior High School", "Senior High School"],
        selectedPrograms: ["Grade 7", "Grade 11", "Grade 12"]
    },
    {
        id: 3,
        eventName: "Foundation Day Celebration",
        eventDate: new Date().toLocaleDateString('en-CA'),
        classification: "ongoing", // Explicit Definition
        selectedColor: "#dcfce7",
        selectedDepartments: ["Higher Education", "Senior High School"],
        selectedPrograms: ["BSIT", "BSBA", "AB Psychology"]
    },
    {
        id: 4,
        eventName: "Parents Orientation",
        eventDate: "2025-08-15",
        classification: "upcoming", // Explicit Definition
        selectedColor: "#fef9c3", 
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
    // Now simply checks the explicit classification
    const filteredEvents = useMemo(() => {
        return MOCK_ALL_EVENTS.filter(event => event.classification === activeTab);
    }, [activeTab]);

    // --- HANDLERS ---
    const handleCardClick = (eventId) => {
        setSelectedEventId(eventId);
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setTimeout(() => setSelectedEventId(null), 300);
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
            {/* We pass the FULL list (MOCK_ALL_EVENTS) if you want next/prev to work across categories, 
                OR filteredEvents if you only want to scroll within the current category. 
                Based on previous logic, usually better to pass filtered if context matters, 
                but here let's pass filteredEvents so user stays in "Ongoing" when clicking next. 
            */}
            <EventDetailModal
                isOpen={isModalOpen}
                onClose={handleCloseModal}
                events={filteredEvents} 
                initialEventId={selectedEventId}
            />

            {/* DASHBOARD CONTENT */}
            <div style={dashboardStyle}>
                <div className="w-full flex justify-between items-center px-4 py-2 bg-white rounded-md shadow-md" style={{ padding: 5}}>
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
                        onEventClick={handleCardClick}
                    />
                </div>
            </div>
        </div>
    );
}