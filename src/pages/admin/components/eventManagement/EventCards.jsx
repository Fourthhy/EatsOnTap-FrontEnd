import React, { useState } from 'react';
import { X } from 'lucide-react'; // Need an icon for closing the modal
import { upcomingEventsData, recentEventsData } from './data'; 

// --- Empty State Component ---
const EmptyState = ({ message }) => (
    <div
        style={{
            textAlign: 'center',
            padding: '2rem 1rem',
            margin: '20px auto',
            borderRadius: 8,
            backgroundColor: '#f9fafb',
            border: '1px dashed #e5e7eb',
            color: '#6b7280',
            fontSize: 14,
            fontFamily: "geist",
            width: '90%',
            minHeight: '100px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexDirection: 'column'
        }}
    >
        <span>🗓️</span>
        <p style={{ marginTop: '0.5rem', fontWeight: 400 }}>{message}</p>
    </div>
);

// --- NEW: Reusable Modal for Viewing All Events ---
const EventListModal = ({ title, events, onClose, type, onViewDetails }) => {
    // Determine styles based on type (Upcoming vs Recent)
    const isUpcoming = type === 'upcoming';
    const gradient = isUpcoming 
        ? 'linear-gradient(to right, #FDEDEC, #D8ECFF)' 
        : 'linear-gradient(to right, #AECDFE, #D8ECFF)';
    
    return (
        <div style={{
            position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh',
            backgroundColor: 'rgba(0, 0, 0, 0.5)', zIndex: 1000,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            backdropFilter: 'blur(2px)'
        }}
        className="animate-in fade-in duration-200"
        >
            <div style={{
                backgroundColor: 'white', borderRadius: '12px',
                width: '600px', maxHeight: '80vh',
                display: 'flex', flexDirection: 'column',
                boxShadow: '0 10px 25px rgba(0,0,0,0.1)',
                fontFamily: "geist"
            }}>
                {/* Modal Header */}
                <div style={{ 
                    padding: '20px 24px', borderBottom: '1px solid #f3f4f6', 
                    display: 'flex', justifyContent: 'space-between', alignItems: 'center' 
                }}>
                    <h3 style={{ fontSize: 18, fontWeight: 600, margin: 0, color: '#111827' }}>
                        All {title}
                    </h3>
                    <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#6b7280' }}>
                        <X size={20} />
                    </button>
                </div>

                {/* Scrollable List Area */}
                <div style={{ padding: '24px', overflowY: 'auto' }}>
                    {events.map(event => (
                        <div key={event.id}
                            style={{
                                background: gradient,
                                borderRadius: 12, padding: '0.8rem',
                                display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                                marginBottom: 12, transition: 'transform 0.1s'
                            }}
                        >
                            {/* Event Details */}
                            <div className="flex-1">
                                <div style={{ fontWeight: 550, color: '#1f2937', fontSize: 14, fontFamily: "geist" }}>
                                    {event.name}
                                </div>
                                <div style={{ color: '#4b5563', fontSize: 12, fontFamily: "geist", fontWeight: 400 }}>
                                    {event.date}
                                </div>
                            </div>

                            {/* Conditional Columns based on Type */}
                            {isUpcoming ? (
                                // Upcoming Columns
                                <>
                                    <div style={{ fontWeight: 550, fontSize: 16, width: '5rem', textAlign: 'center' }}>
                                        {event.count}
                                    </div>
                                    <div style={{ marginLeft: '1.25rem' }}>
                                        <button
                                            onClick={() => onViewDetails && onViewDetails(event.id)}
                                            className="hover:underline"
                                            style={{ backgroundColor: 'transparent', border: 'none', fontFamily: "geist", fontWeight: 400, color: '#2563EB', fontSize: 12, cursor: 'pointer' }}
                                        >
                                            View details
                                        </button>
                                    </div>
                                </>
                            ) : (
                                // Recent Columns
                                <>
                                    <div style={{ fontWeight: 550, fontSize: 16, width: '5rem', textAlign: 'center' }}>
                                        {event.claims}
                                    </div>
                                    <div style={{ fontWeight: 550, fontSize: 16, width: '5rem', textAlign: 'center' }}>
                                        {event.unclaimed}
                                    </div>
                                    <div style={{ marginLeft: '1.25rem' }}>
                                        <button
                                            className="hover:underline"
                                            style={{ backgroundColor: 'transparent', border: 'none', fontFamily: "geist", fontWeight: 400, color: '#2563EB', fontSize: 12, cursor: 'pointer' }}
                                        >
                                            View details
                                        </button>
                                    </div>
                                </>
                            )}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};


// 2. Top Right: Upcoming Events
export const UpcomingEvents = ({ onViewDetails }) => {
    const [showModal, setShowModal] = useState(false);

    const headerLabelStyle = {
        fontSize: 13,
        paddingRight: 90,
        fontFamily: "geist",
        fontWeight: 450
    };

    const hasEvents = upcomingEventsData && upcomingEventsData.length > 0;
    
    // LIMIT DISPLAY TO 3
    const displayedEvents = hasEvents ? upcomingEventsData.slice(0, 3) : [];
    const showViewAll = upcomingEventsData.length > 3;

    return (
        <>
            <div className="bg-white p-6 rounded-md shadow-md flex flex-col items-center justify-center">
                <div className="w-[95%] h-[55px] flex justify-between items-center">
                    <h2 style={{ fontSize: 16, fontFamily: "geist", fontWeight: 450 }} className="text-xl font-bold mb-5">Upcoming Events</h2>
                    <div className="flex justify-end">
                        {hasEvents && <div style={headerLabelStyle} className="text-gray-600">Allotted Meals</div>}
                    </div>
                </div>

                <div className="w-[95%]">
                    {hasEvents ? (
                        <>
                            {displayedEvents.map(event => (
                                <div
                                    key={event.id}
                                    className="transition-transform duration-100 hover:shadow-md hover:scale-[1.01]"
                                    style={{
                                        background: 'linear-gradient(to right, #FDEDEC, #D8ECFF)',
                                        borderRadius: 12,
                                        padding: '0.7rem',
                                        display: 'flex',
                                        justifyContent: 'space-between',
                                        alignItems: 'center',
                                        marginBottom: 12,
                                    }}
                                >
                                    <div className="flex-1">
                                        <div style={{ fontWeight: 550, color: '#1f2937', fontSize: 14, fontFamily: "geist" }}>
                                            {event.name}
                                        </div>
                                        <div style={{ color: '#4b5563', fontSize: 12, fontFamily: "geist", fontWeight: 400 }}>
                                            {event.date}
                                        </div>
                                    </div>
                                    <div style={{ fontWeight: 550, fontSize: 16, width: '5rem', textAlign: 'center' }}>
                                        {event.count}
                                    </div>
                                    <div style={{ marginLeft: '1.25rem' }}>
                                        <button
                                            onClick={() => onViewDetails(event.id)}
                                            className="text-blue-600 text-xs cursor-pointer font-medium hover:underline"
                                            style={{ backgroundColor: 'transparent', border: 'none', fontFamily: "geist", fontWeight: 400 }}
                                        >
                                            View details
                                        </button>
                                    </div>
                                </div>
                            ))}
                            
                            {/* VIEW ALL BUTTON */}
                            {showViewAll && (
                                <div style={{ display: 'flex', justifyContent: 'center', marginTop: '8px' }}>
                                    <button 
                                        onClick={() => setShowModal(true)}
                                        style={{ 
                                            background: 'none', border: 'none', color: '#6b7280', 
                                            fontSize: 12, cursor: 'pointer', fontFamily: "geist", fontWeight: 500 
                                        }}
                                        className="hover:text-blue-600 hover:underline"
                                    >
                                        View all upcoming events ({upcomingEventsData.length})
                                    </button>
                                </div>
                            )}
                        </>
                    ) : (
                        <EmptyState message="No upcoming events scheduled." />
                    )}
                </div>
            </div>

            {/* MODAL */}
            {showModal && (
                <EventListModal 
                    title="Upcoming Events" 
                    events={upcomingEventsData} 
                    type="upcoming"
                    onClose={() => setShowModal(false)} 
                    onViewDetails={(id) => {
                        setShowModal(false); // Close modal before switching view
                        onViewDetails(id);
                    }}
                />
            )}
        </>
    );
};

// 3. Bottom Right: Recent Events
export const RecentEvents = () => {
    const [showModal, setShowModal] = useState(false);

    const headerLabelStyle = {
        fontSize: '0.75rem',
        color: '#4b5563',
        width: '80px',
        textAlign: 'center',
        fontFamily: "geist",
        fontWeight: 400
    };
    const countBoxStyle = {
        fontWeight: 550,
        fontSize: 16,
        width: '5rem',
        textAlign: 'center',
    };

    const hasEvents = recentEventsData && recentEventsData.length > 0;
    
    // LIMIT DISPLAY TO 3
    const displayedEvents = hasEvents ? recentEventsData.slice(0, 3) : [];
    const showViewAll = recentEventsData.length > 3;

    return (
        <>
            <div className="bg-white p-6 rounded-xl shadow-md flex flex-col justify-center items-center">
                <div className="w-[95%] h-[55px] flex justify-between items-center">
                    <h2 style={{ fontSize: 16, fontFamily: "geist", fontWeight: 450 }} className="text-xl font-bold mb-5">Recent Events</h2>
                    {hasEvents && <div className="flex justify-end mb-2 pr-20" style={{ marginRight: 100 }}>
                        <div style={headerLabelStyle}>Total claims</div>
                        <div style={headerLabelStyle}>Unclaimed</div>
                    </div>}
                </div>

                <div className="w-[95%]">
                    {hasEvents ? (
                        <>
                            {displayedEvents.map(event => (
                                <div
                                    key={event.id}
                                    className="transition-transform duration-100 hover:shadow-md hover:scale-[1.01]"
                                    style={{
                                        background: 'linear-gradient(to right, #AECDFE, #D8ECFF)',
                                        borderRadius: 12,
                                        padding: '0.7rem',
                                        display: 'flex',
                                        justifyContent: 'space-between',
                                        alignItems: 'center',
                                        marginBottom: 12,
                                    }}
                                >
                                    <div className="flex-1">
                                        <div style={{ fontWeight: 550, color: '#1f2937', fontSize: 14, fontFamily: "geist" }}>
                                            {event.name}
                                        </div>
                                        <div style={{ color: '#4b5563', fontSize: 12, fontFamily: "geist", fontWeight: 400 }}>
                                            {event.date}
                                        </div>
                                    </div>
                                    <div style={countBoxStyle}>
                                        {event.claims}
                                    </div>
                                    <div style={countBoxStyle}>
                                        {event.unclaimed}
                                    </div>
                                    <div style={{ marginLeft: '1.25rem' }}>
                                        <button
                                            className="text-blue-600 hover:underline"
                                            style={{ backgroundColor: 'transparent', border: 'none', fontSize: 12, cursor: 'pointer', fontFamily: "geist", fontWeight: 400 }}
                                        >
                                            View details
                                        </button>
                                    </div>
                                </div>
                            ))}

                            {/* VIEW ALL BUTTON */}
                            {showViewAll && (
                                <div style={{ display: 'flex', justifyContent: 'center', marginTop: '8px' }}>
                                    <button 
                                        onClick={() => setShowModal(true)}
                                        style={{ 
                                            background: 'none', border: 'none', color: '#6b7280', 
                                            fontSize: 12, cursor: 'pointer', fontFamily: "geist", fontWeight: 500 
                                        }}
                                        className="hover:text-blue-600 hover:underline"
                                    >
                                        View all recent events ({recentEventsData.length})
                                    </button>
                                </div>
                            )}
                        </>
                    ) : (
                        <EmptyState message="No recent events recorded." />
                    )}
                </div>
            </div>

            {/* MODAL */}
            {showModal && (
                <EventListModal 
                    title="Recent Events" 
                    events={recentEventsData} 
                    type="recent"
                    onClose={() => setShowModal(false)} 
                />
            )}
        </>
    );
};