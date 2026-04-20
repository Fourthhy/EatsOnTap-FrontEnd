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
    // 🟢 1. Consume Real Data (Multi-dimensional array from the controller)
    // Default to an empty array so destructuring doesn't fail if context is loading
    const { eventMealRequest = [] } = useData();

    const [activeTab, setActiveTab] = useState("ongoing");

    // --- MODAL STATE ---
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedEventId, setSelectedEventId] = useState(null);

    // --- 🟢 2. DATA PROCESSING & UNPACKING ---
    const processedData = useMemo(() => {
        if (!Array.isArray(eventMealRequest) || eventMealRequest.length === 0) {
            return { ongoing: [], upcoming: [], recent: [], all: [] };
        }

        // 1. FLATTEN the arrays to ignore the backend's timezone-flawed grouping
        const flatRawEvents = eventMealRequest.flat();

        const currentYear = new Date().getFullYear();
        const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

        // 2. Get exact local boundaries using the user's browser timezone
        const now = new Date();
        const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());

        const ongoing = [];
        const upcoming = [];
        const recent = [];
        const all = [];

        flatRawEvents.forEach((event) => {
            if (!event) return;

            const startMonthIdx = months.indexOf(event.startMonth);
            const endMonthIdx = months.indexOf(event.endMonth);

            const startDate = new Date(currentYear, startMonthIdx, event.startDay);
            const endDate = new Date(currentYear, endMonthIdx, event.endDay, 23, 59, 59, 999);

            // 🟢 3. The true source of truth: Browser Local Time Categorization
            let computedStatus = "recent";
            if (now >= startDate && now <= endDate) {
                computedStatus = "ongoing";
            } else if (startOfToday < startDate) {
                computedStatus = "upcoming";
            }

            const isSameDayAndMonth = event.startDay === event.endDay && event.startMonth === event.endMonth;
            const formattedDate = isSameDayAndMonth
                ? startDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
                : `${startDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} - ${endDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}`;

            const mergedEligible = [
                ...(event.forEligibleSection || []).map(item => ({ ...item, display: `${item.year} - ${item.section}`, type: 'Basic Ed' })),
                ...(event.forEligibleProgramsAndYear || []).map(item => ({ ...item, display: `${item.year} - ${item.program}`, type: 'Higher Ed' }))
            ];

            const formattedEvent = {
                id: event.eventID,
                mongoId: event._id,
                eventName: event.eventName,
                eventDate: formattedDate,
                classification: computedStatus, // Override with the correct frontend status
                selectedColor: event.eventColor || "#dbeafe",
                selectedPrograms: mergedEligible,
                selectedDepartments: event.eventScope === 'School-Wide' ? ['All'] : ['Departmental']
            };

            all.push(formattedEvent);
            if (computedStatus === "ongoing") ongoing.push(formattedEvent);
            else if (computedStatus === "upcoming") upcoming.push(formattedEvent);
            else recent.push(formattedEvent);
        });

        return { ongoing, upcoming, recent, all };

    }, [eventMealRequest]);

    // --- 🟢 3. FILTERING LOGIC ---
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