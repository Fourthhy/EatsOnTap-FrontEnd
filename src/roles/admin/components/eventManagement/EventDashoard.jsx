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
    // 🟢 1. Consume Real Data (Now a multi-dimensional array from the new controller!)
    const { eventMealRequest = [] } = useData(); 

    const [activeTab, setActiveTab] = useState("ongoing");

    // --- MODAL STATE ---
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedEventId, setSelectedEventId] = useState(null);

    // --- 🟢 2. DATA PROCESSING & UNPACKING ---
    const processedData = useMemo(() => {
        // Safe check to guarantee we are dealing with our [ongoing, upcoming, recent] format
        const isMultiDimensional = Array.isArray(eventMealRequest) && Array.isArray(eventMealRequest[0]);
        
        // If data isn't loaded yet, return empty arrays to prevent crashes
        if (!isMultiDimensional) return { ongoing: [], upcoming: [], recent: [], all: [] };

        const currentYear = new Date().getFullYear();

        // Helper function to transform a raw backend event into the format the UI expects
        const formatEventForUI = (event) => {
            const dateString = `${event.startMonth} ${event.startDay}, ${currentYear}`;
            const eventDateObj = new Date(dateString);
            
            const endDateString = `${event.endMonth} ${event.endDay}, ${currentYear}`;
            const formattedDate = event.startDay === event.endDay 
                ? eventDateObj.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
                : `${eventDateObj.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} - ${new Date(endDateString).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}`;

            const mergedEligible = [
                ...(event.forEligibleSection || []).map(item => ({
                    ...item,
                    display: `${item.year} - ${item.section}`,
                    type: 'Basic Ed'
                })),
                ...(event.forEligibleProgramsAndYear || []).map(item => ({
                    ...item,
                    display: `${item.year} - ${item.program}`,
                    type: 'Higher Ed'
                }))
            ];

            return {
                id: event.eventID,
                mongoId: event._id,
                eventName: event.eventName,
                eventDate: formattedDate, 
                classification: event.scheduleStatus ? event.scheduleStatus.toLowerCase() : 'recent',
                selectedColor: event.eventColor || "#dbeafe",
                selectedPrograms: mergedEligible,
                selectedDepartments: event.eventScope === 'School-Wide' ? ['All'] : ['Departmental']
            };
        };

        // 🟢 UNPACK THE MULTI-DIMENSIONAL ARRAY
        const ongoing = (eventMealRequest[0] || []).map(formatEventForUI);
        const upcoming = (eventMealRequest[1] || []).map(formatEventForUI);
        const recent = (eventMealRequest[2] || []).map(formatEventForUI);

        return {
            ongoing,
            upcoming,
            recent,
            // We combine them all into one flat array just for the Modal, 
            // so it can find an event by ID no matter which tab is active!
            all: [...ongoing, ...upcoming, ...recent] 
        };

    }, [eventMealRequest]);

    // --- 🟢 3. FILTERING LOGIC (Massively Simplified) ---
    // Because the backend already sorted them, we just grab the array matching the active tab!
    const eventsToDisplay = processedData[activeTab] || [];

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
                events={processedData.all} // 🟢 Pass the flat array here!
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
                        events={eventsToDisplay} // 🟢 Pass the pre-sorted array directly!
                        onEventClick={handleCardClick}
                    />
                </motion.div>
            </div>
        </div >
    );
}