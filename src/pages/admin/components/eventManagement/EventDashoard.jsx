import React, { useState } from 'react';
import { AddEventForm } from './AddEventForm';
import { UpcomingEvents, RecentEvents } from './EventCards'; // Assuming you keep these components in EventCards.jsx or similar
import { ViewRecentEvent } from './ViewRecentEvent';

// --- MAIN LAYOUT ---

const VIEWS = {
    DASHBOARD: 'DASHBOARD',
    VIEW_EVENT: 'VIEW_EVENT',
};

export function EventDashboard() {
    // State to manage the currently displayed view and the selected event's ID
    const [currentView, setCurrentView] = useState(VIEWS.DASHBOARD);
    const [selectedEventId, setSelectedEventId] = useState(null); // To pass data to the detail screen

    // Function passed down to UpcomingEvents to trigger the view change
    const handleViewDetails = (eventId) => {
        setSelectedEventId(eventId);
        setCurrentView(VIEWS.VIEW_EVENT);
    };

    // Function to go back to the dashboard view (can be passed to ViewUpcomingEvent)
    const handleBackToDashboard = () => {
        setCurrentView(VIEWS.DASHBOARD);
        setSelectedEventId(null);
    };

    // --- STYLES ---
    const dashboardStyle = {
        backgroundColor: '#F7F9F9',
        padding: 10,
        boxSizing: 'border-box',
        fontFamily: 'sans-serif',
        display: 'flex',
        gap: '2rem',
        margin: '0',
        overflow: 'hidden',
    };

    const columnStyle = {
        flex: '1 1 500px',
        minWidth: '500px',
        height: '100%',
    };

    const rightColumnStyle = {
        ...columnStyle,
        display: 'flex',
        flexDirection: 'column',
        gap: '2rem',
        overflowY: 'auto',
    };


    // Default RENDER: Dashboard View
    let content = (
        <>
            {/* View Event */}
            {currentView === VIEWS.VIEW_EVENT ? (
                <ViewRecentEvent eventId={selectedEventId} onBackToDashboard={handleBackToDashboard} />
            ) : (
                <>
                    <div className="h-full w-full grid grid-cols-2 gap-2">

                        {/* Right Column (Cards) */}
                        {/* <div className="flex flex-col gap-4">
                            
                            <UpcomingEvents onViewDetails={handleViewDetails} />
                            <RecentEvents />
                        </div> */}
                        
                        <div className="h-[100%]">
                            <AddEventForm />
                        </div>
                    </div>
                </>
            )}

        </>
    );

    return (
        <div style={dashboardStyle}>
            {content}
        </div>
    );
}