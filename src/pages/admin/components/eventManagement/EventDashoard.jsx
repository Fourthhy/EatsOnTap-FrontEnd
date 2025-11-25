import React from 'react';
import { AddEventForm } from './AddEventForm';
import { UpcomingEvents, RecentEvents } from './EventCards';

// --- MAIN LAYOUT ---

export function EventDashboard() {
    // Layout styles remain here, as this component handles the overall structure and sizing.
    const dashboardStyle = {
        backgroundColor: '#F7F9F9', // bg-gray-200
        height: '100%', 
        padding: '1.25rem', 
        boxSizing: 'border-box', 
        fontFamily: 'sans-serif', 
        display: 'flex',
        gap: '2rem', 
        margin: '0', 
        overflow: 'hidden', 
    };

    const columnStyle = {
        flex: '1 1 500px', // flex-1 min-w-[500px]
        height: '100%', 
        minWidth: '500px', 
    };

    const rightColumnStyle = {
        ...columnStyle,
        display: 'flex',
        flexDirection: 'column',
        gap: '2rem', 
        overflowY: 'auto', 
    };
    
    return (
        <div style={dashboardStyle}>
            {/* Left Column (Add Event Form) */}
            <div style={columnStyle}>
                <AddEventForm /> 
            </div>

            {/* Right Column (Cards) */}
            <div style={rightColumnStyle}>
                {/* <UpcomingEvents />
                <RecentEvents /> */}
            </div>
        </div>
    );
}