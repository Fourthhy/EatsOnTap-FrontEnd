import React from 'react';
import { upcomingEventsData, recentEventsData } from './data';

// 2. Top Right: Upcoming Events
export const UpcomingEvents = () => {
    const headerLabelStyle = {
        fontSize: 13,
        paddingRight: 90,
        fontFamily: "geist",
        fontWeight: 450
    };

    return (
        <div className="bg-white p-6 rounded-md shadow-md flex flex-col items-center justify-center">

            <div className="w-[95%] h-[60px] flex justify-between items-center">
                <h2 style={{ fontSize: 16, fontFamily: "geist", fontWeight: 450 }} className="text-xl font-bold mb-5">Upcoming Events</h2>

                <div className="flex justify-end">
                    <div style={headerLabelStyle} className="text-gray-600">Allotted Meals</div>
                </div>
            </div>


            <div className="w-[95%]">
                {upcomingEventsData.map(event => (
                    <div
                        key={event.id}
                        className="transition-transform duration-100 hover:shadow-md hover:scale-[1.01]"
                        style={{
                            background: 'linear-gradient(to right, #FDEDEC, #D8ECFF)',
                            borderRadius: 12,
                            padding: '0.8rem',
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            marginBottom: 12,
                        }}
                    >
                        {/* Event Details */}
                        <div className="flex-1">
                            <div
                                style={{
                                    fontWeight: 550,
                                    color: '#1f2937',
                                    fontSize: 14,
                                    fontFamily: "geist"
                                }}
                            >
                                {event.name}
                            </div>
                            <div
                                style={{
                                    color: '#4b5563',
                                    fontSize: 12,
                                    fontFamily: "geist",
                                    fontWeight: 400
                                }}
                            >
                                {event.date}
                            </div>
                        </div>

                        {/* Count */}
                        <div
                            style={{
                                fontWeight: 550,
                                fontSize: 16,
                                width: '5rem',
                                textAlign: 'center',
                            }}
                        >
                            {event.count}
                        </div>

                        {/* Action Button */}
                        <div
                            style={{
                                marginLeft: '1.25rem'
                            }}
                        >
                            <button
                                className="text-blue-600 text-xs cursor-pointer font-medium hover:underline"
                                style={{
                                    backgroundColor: 'transparent',
                                    border: 'none',
                                    fontFamily: "geist",
                                    fontWeight: 400
                                }}
                            >
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
        fontFamily: "geist",
        fontWeight: 400
    };
    const countBoxStyle = {
        fontWeight: 'bold',
        width: '80px',
        textAlign: 'center',
    };

    return (
        <div className="bg-white p-6 rounded-xl shadow-md flex flex-col justify-center items-center" style={{ marginBottom: 20 }}>

            <div className="w-[95%] h-[60px] flex justify-between items-center">
                <h2 style={{ fontSize: 16, fontFamily: "geist", fontWeight: 450 }} className="text-xl font-bold mb-5">Recent Events</h2>

                <div className="flex justify-end mb-2 pr-20" style={{ marginRight: 100 }}>
                    <div style={headerLabelStyle}>Total claims</div>
                    <div style={headerLabelStyle}>Unclaimed</div>
                </div>
            </div>



            <div className="w-[95%]">
                {recentEventsData.map(event => (
                    <div
                        key={event.id}
                        className="transition-transform duration-100 hover:shadow-md hover:scale-[1.01]" // Dynamic classes kept
                        style={{
                            // --- Outer Container Styles ---
                            // Gradient based on your requirement for the Recent Event card
                            background: 'linear-gradient(to right, #AECDFE, #D8ECFF)',
                            borderRadius: 12,           // Matches upcoming card (from rounded-lg)
                            padding: '0.8rem',          // Matches upcoming card (from p-4)
                            display: 'flex',            // flex
                            justifyContent: 'space-between', // justify-between
                            alignItems: 'center',       // items-center
                            marginBottom: 12,           // Matches upcoming card (from mb-3)
                        }}
                    >
                        {/* Event Details */}
                        <div className="flex-1">
                            <div
                                style={{
                                    fontWeight: 550,     // Matches upcoming card (from font-semibold)
                                    color: '#1f2937',    // text-gray-800
                                    fontSize: 14,        // Matches upcoming card
                                    fontFamily: "geist"
                                }}
                            >
                                {event.name}
                            </div>
                            <div
                                style={{
                                    color: '#4b5563',    // text-gray-600
                                    fontSize: 12,        // Matches upcoming card (from text-sm)
                                    fontFamily: "geist",
                                    fontWeight: 400      // Matches upcoming card
                                }}
                            >
                                {event.date}
                            </div>
                        </div>

                        {/* Claim Count */}
                        <div
                            style={{
                                fontWeight: 550,       // Matches upcoming card
                                fontSize: 16,          // Matches upcoming card (from text-lg)
                                width: '5rem',         // w-20 (80px)
                                textAlign: 'center',   // text-center
                            }}
                        >
                            {event.claims}
                        </div>

                        {/* Unclaimed Count */}
                        <div
                            style={{
                                fontWeight: 550,       // Matches upcoming card
                                fontSize: 16,          // Matches upcoming card
                                width: '5rem',         // w-20 (80px)
                                textAlign: 'center',   // text-center
                            }}
                        >
                            {event.unclaimed}
                        </div>

                        {/* Action Button */}
                        <div
                            style={{
                                marginLeft: '1.25rem' // ml-5
                            }}
                        >
                            <button
                                className="text-blue-600 hover:underline" // Reduced classes to minimal dynamic/color
                                style={{
                                    backgroundColor: 'transparent', // bg-transparent
                                    border: 'none',                 // border-none
                                    fontSize: 12,                   // text-xs (12px)
                                    cursor: 'pointer',              // cursor-pointer
                                    fontFamily: "geist",
                                    fontWeight: 400,                // Matches upcoming card
                                }}
                            >
                                View details
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};