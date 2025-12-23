import React from 'react';
import { EventPreviewCard } from './EventPreviewCard'; // Ensure this path is correct

export const EventDisplayer = ({ events, onEventClick }) => {
    
    // Grid Layout Style
    const gridStyle = {
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', // Responsive grid
        gap: '1.5rem',
        padding: '1rem',
        width: '100%'
    };

    if (!events || events.length === 0) {
        return (
            <div className="w-full h-64 flex items-center justify-center text-gray-400 border-2 border-dashed border-gray-200 rounded-xl bg-gray-50">
                <p>No events found for this category.</p>
            </div>
        );
    }

    return (
        <div style={gridStyle}>
            {events.map((event) => (
                <div 
                    key={event.id} 
                    onClick={() => onEventClick(event.id)}
                    className="cursor-pointer hover:-translate-y-1 transition-transform duration-200"
                >
                    {/* Mapping the data object to the props expected by EventPreviewCard.
                        Ensure your DB data keys match these or map them here. 
                    */}
                    <EventPreviewCard 
                        eventName={event.eventName}
                        eventDate={event.eventDate}
                        selectedColor={event.selectedColor}
                        selectedDepartments={event.selectedDepartments}
                        selectedPrograms={event.selectedPrograms}
                    />
                </div>
            ))}
        </div>
    );
};