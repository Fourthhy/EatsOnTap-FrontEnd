import React from 'react';
import { upcomingEventsData, recentEventsData } from './data';

// 2. Top Right: Upcoming Events
export const UpcomingEvents = () => {
    const headerLabelStyle = {
        fontSize: '0.75rem', 
        color: '#4b5563', 
        marginBottom: '0.5rem', 
        paddingRight: '90px', 
    };

    return (
        <div className="bg-white p-6 rounded-xl shadow-md">
            <h2 className="text-xl font-bold mb-5">Upcoming Events</h2>
            
            <div className="flex justify-end">
                <div style={headerLabelStyle}>Allotted Meals</div>
            </div>

            <div>
                {upcomingEventsData.map(event => (
                    <div 
                        key={event.id} 
                        className="bg-red-50 rounded-lg p-4 flex justify-between items-center mb-3 transition-transform duration-100 hover:shadow-md hover:scale-[1.01]"
                    >
                        {/* Event Details */}
                        <div className="flex-1">
                            <div className="font-semibold text-gray-800">{event.name}</div>
                            <div className="text-sm text-gray-600 mt-1">{event.date}</div>
                        </div>
                        {/* Count */}
                        <div className="font-bold text-lg w-20 text-center">
                            {event.count}
                        </div>
                        {/* Action Button */}
                        <div className="ml-5">
                            <button className="bg-transparent border-none text-blue-600 text-xs cursor-pointer font-medium hover:underline">
                                View details
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

// 3. Bottom Right: Recent Events
export const RecentEvents = () => {
    const headerLabelStyle = {
        fontSize: '0.75rem', 
        color: '#4b5563', 
        width: '80px', 
        textAlign: 'center', 
    };
    const countBoxStyle = {
        fontWeight: 'bold', 
        width: '80px', 
        textAlign: 'center', 
    };

    return (
        <div className="bg-white p-6 rounded-xl shadow-md">
            <h2 className="text-xl font-bold mb-5">Recent Events</h2>
            
            <div className="flex justify-end mb-2 pr-20">
                <div style={headerLabelStyle}>Total claims</div>
                <div style={headerLabelStyle}>Unclaimed</div>
            </div>

            <div>
                {recentEventsData.map(event => (
                    <div 
                        key={event.id} 
                        className="bg-blue-200 rounded-lg p-4 flex justify-between items-center mb-3 transition-transform duration-100 hover:shadow-md hover:scale-[1.01]"
                    >
                        {/* Event Details */}
                        <div className="flex-1">
                            <div className="font-semibold text-gray-800">{event.name}</div>
                            <div className="text-sm text-gray-600 mt-1">{event.date}</div>
                        </div>
                        {/* Claim Count */}
                        <div style={countBoxStyle}>
                            {event.claims}
                        </div>
                        {/* Unclaimed Count */}
                        <div style={countBoxStyle}>
                            {event.unclaimed}
                        </div>
                        {/* Action Button */}
                        <div className="ml-5">
                            <button className="bg-transparent border-none text-blue-600 text-xs cursor-pointer font-medium hover:underline">
                                View details
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};