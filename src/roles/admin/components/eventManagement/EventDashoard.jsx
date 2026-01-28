import React, { useState, useMemo } from 'react';
import { AddEventForm } from './AddEventForm';
import { ButtonGroup } from '../../../../components/global/ButtonGroup';
import { EventDisplayer } from './EventDisplayer';
import { EventDetailModal } from './EventDetailModal';
import { useData } from '../../../../context/DataContext';
import { motion } from 'framer-motion';

const buttonListGroup = [
    { id: "ongoing", label: "Ongoing Events" },
    { id: "upcoming", label: "Upcoming Events" },
    { id: "recent", label: "Recent Events" },
];

export function EventDashboard() {
    // 🟢 1. Consume Real Data
    const { eventMealRequest = [] } = useData(); 

    const [activeTab, setActiveTab] = useState("ongoing");

    // --- MODAL STATE ---
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedEventId, setSelectedEventId] = useState(null);

    // --- 🟢 2. DATA PROCESSING & CLASSIFICATION ---
    const processedEvents = useMemo(() => {
        if (!eventMealRequest) return [];

        const today = new Date();
        today.setHours(0, 0, 0, 0); // Normalize today to midnight

        return eventMealRequest.map(event => {
            // Parse Date from Backend (eventSpan is an array of dates)
            const eventDateObj = new Date(event.eventSpan?.[0] || new Date());
            const compareDate = new Date(eventDateObj);
            compareDate.setHours(0, 0, 0, 0);

            // Determine Classification
            let classification = 'recent';
            if (compareDate.getTime() === today.getTime()) {
                classification = 'ongoing';
            } else if (compareDate > today) {
                classification = 'upcoming';
            }

            // Map Backend Model to UI Props
            return {
                id: event.eventID,
                eventName: event.eventName,
                eventDate: eventDateObj.toLocaleDateString('en-CA'), // Format YYYY-MM-DD
                classification: classification,
                
                // Use the color saved in DB, or fallback
                selectedColor: event.eventColor || "#dbeafe",
                
                // Map DB 'forEligibleSection' to UI 'selectedPrograms'
                selectedPrograms: event.forEligibleSection || [],
                
                // Map DB 'eventScope' to UI 'selectedDepartments'
                // You might want to refine this logic based on your actual data needs
                selectedDepartments: event.eventScope === 'School-Wide' ? ['All'] : ['Departmental']
            };
        });
    }, [eventMealRequest]);

    // --- 🟢 3. FILTERING LOGIC ---
    const filteredEvents = useMemo(() => {
        return processedEvents.filter(event => event.classification === activeTab);
    }, [activeTab, processedEvents]);

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
            <EventDetailModal
                isOpen={isModalOpen}
                onClose={handleCloseModal}
                events={filteredEvents} // Or pass processedEvents if you want to navigate outside current category
                initialEventId={selectedEventId}
            />

            {/* DASHBOARD CONTENT */}
            <div style={dashboardStyle}>
                <motion.div
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ type: "spring", delay: 0.1 }}
                    className="w-full flex justify-between items-center px-4 py-2 bg-white rounded-md shadow-md" style={{ padding: 5 }}>
                    <ButtonGroup
                        buttonListGroup={buttonListGroup}
                        activeId={activeTab}
                        onSetActiveId={setActiveTab}
                        activeColor="#4268BD"
                    />
                    <AddEventForm />
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ type: "spring", delay: 0.1 }}
                    className="flex-1 overflow-y-auto">
                    
                    {/* Render Real Data */}
                    <EventDisplayer
                        events={filteredEvents}
                        onEventClick={handleCardClick}
                    />
                </motion.div>
            </div>
        </div >
    );
}