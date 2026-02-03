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

        const currentYear = new Date().getFullYear();

        return eventMealRequest.map(event => {
            // 🛠️ FIX 1: Construct Date Object from new fields
            // The backend gives us "February", "15". We need to make that a date.
            const dateString = `${event.startMonth} ${event.startDay}, ${currentYear}`;
            const eventDateObj = new Date(dateString);
            
            // Handle End Date for Display (e.g., "Feb 15 - Feb 17")
            const endDateString = `${event.endMonth} ${event.endDay}, ${currentYear}`;
            const formattedDate = event.startDay === event.endDay 
                ? eventDateObj.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
                : `${eventDateObj.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} - ${new Date(endDateString).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}`;

            // 🛠️ FIX 2: Use Backend Status
            // Your backend calculates "ONGOING", "UPCOMING", "RECENT". We just convert to lowercase to match tabs.
            // Fallback to 'recent' if undefined.
            const classification = event.scheduleStatus ? event.scheduleStatus.toLowerCase() : 'recent';

            // 🛠️ FIX 3: Merge Basic Ed and Higher Ed arrays for display
            // The UI expects a single list of "selectedPrograms"
            const mergedEligible = [
                ...(event.forEligibleSection || []).map(item => ({
                    ...item,
                    display: `${item.year} - ${item.section}`, // Standardization for UI
                    type: 'Basic Ed'
                })),
                ...(event.forEligibleProgramsAndYear || []).map(item => ({
                    ...item,
                    display: `${item.year} - ${item.program}`, // Standardization for UI
                    type: 'Higher Ed'
                }))
            ];

            return {
                id: event.eventID,
                mongoId: event._id, // Keep reference to real ID if needed
                eventName: event.eventName,
                eventDate: formattedDate, 
                classification: classification,
                
                // Use the color saved in DB, or fallback
                selectedColor: event.eventColor || "#dbeafe",
                
                // Map merged list to UI
                selectedPrograms: mergedEligible,
                
                // Map DB 'eventScope' to UI 'selectedDepartments'
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
                events={processedEvents} // Pass all events so modal can find by ID even if tab changes
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