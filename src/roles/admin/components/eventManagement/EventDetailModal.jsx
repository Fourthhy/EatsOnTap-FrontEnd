import React, { useState, useEffect } from 'react';
import { X, ChevronLeft, ChevronRight, CheckCircle, XCircle } from 'lucide-react';
import { EventPreviewCard } from './EventPreviewCard';
import { GenericTable } from '../../../../components/global/table/GenericTable';

// --- MOCK DATA GENERATOR ---
const generateMockParticipants = (eventId, programs = []) => {
    if (!programs || programs.length === 0) return [];

    const statuses = ['Registered', 'Attended', 'Absent'];
    const dummyNames = ['Alice Johnson', 'Bob Smith', 'Charlie Brown', 'Diana Prince', 'Evan Wright', 'Fiona Gallagher'];

    let data = [];
    programs.forEach(prog => {
        for (let i = 0; i < 8; i++) { // Generated a few more to test scrolling
            const randomStatus = statuses[Math.floor(Math.random() * statuses.length)];
            data.push({
                id: `${eventId}-${prog}-${i}`,
                name: dummyNames[i % dummyNames.length] || `Student ${i + 1}`,
                studentId: `2023-${1000 + i}`,
                program: prog,
                status: randomStatus
            });
        }
    });
    return data;
};

const EventDetailModal = ({ isOpen, onClose, events, initialEventId }) => {

    // --- STATE ---
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isAnimating, setIsAnimating] = useState(false);

    // --- EFFECT: SYNC & ANIMATE ---
    useEffect(() => {
        if (isOpen && events.length > 0) {
            const index = events.findIndex(e => e.id === initialEventId);
            setCurrentIndex(index >= 0 ? index : 0);

            // Small timeout to allow render before transitioning opacity
            requestAnimationFrame(() => setIsAnimating(true));
        } else {
            setIsAnimating(false);
        }
    }, [isOpen, initialEventId, events]);

    // --- HANDLERS ---
    const handleNext = (e) => {
        e.stopPropagation();
        if (currentIndex < events.length - 1) setCurrentIndex(prev => prev + 1);
    };

    const handlePrev = (e) => {
        e.stopPropagation();
        if (currentIndex > 0) setCurrentIndex(prev => prev - 1);
    };

    // --- DATA PREP ---
    const currentEvent = events[currentIndex];
    // Generate data only if event exists
    const tableData = currentEvent ? generateMockParticipants(currentEvent.id, currentEvent.selectedPrograms) : [];

    const tabs = currentEvent ? [
        { id: 'All', label: 'All' },
        ...(currentEvent.selectedPrograms || []).map(p => ({ id: p, label: p }))
    ] : [];

    // --- RENDERERS ---
    const renderRow = (item, index, startIndex) => {
        const cellStyle = {
            fontFamily: 'geist, sans-serif',
            fontSize: '12px',
            fontWeight: 450,
            color: '#4b5563',
            padding: '12px 24px',
            borderBottom: '1px solid #f3f4f6'
        };

        const getStatusStyle = (s) => {
            switch (s) {
                case 'Attended': return { bg: '#dcfce7', text: '#166534', icon: CheckCircle };
                case 'Absent': return { bg: '#fee2e2', text: '#991b1b', icon: XCircle };
                default: return { bg: '#f3f4f6', text: '#4b5563', icon: null }; // Registered
            }
        };
        const style = getStatusStyle(item.status);
        const Icon = style.icon;

        return (
            <tr key={item.id} className="row-hover">
                <td style={cellStyle}>{startIndex + index + 1}</td>
                <td style={{ ...cellStyle, color: '#111827', fontWeight: 500 }}>{item.name}</td>
                <td style={cellStyle}>{item.studentId}</td>
                <td style={cellStyle}>{item.program}</td>
                <td style={cellStyle}>
                    <span style={{
                        display: 'inline-flex', alignItems: 'center', gap: '6px',
                        padding: '4px 8px', borderRadius: '999px',
                        backgroundColor: style.bg, color: style.text,
                        fontSize: '11px', fontWeight: 500
                    }}>
                        {Icon && <Icon size={12} />} {item.status}
                    </span>
                </td>
            </tr>
        );
    };

    if (!isOpen || !currentEvent) return null;

    // --- STYLES ---
    const s = {
        backdrop: {
            position: 'fixed',
            inset: 0,
            zIndex: 3000,
            backgroundColor: 'rgba(0, 0, 0, 0.4)',
            backdropFilter: 'blur(4px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            // CRITICAL: Offset the center by the sidebar width
            paddingRight: '16px', // Standard padding
            transition: 'opacity 300ms ease-out',
            opacity: isAnimating ? 1 : 0,
        },
        container: {
            position: 'relative',
            display: 'flex',
            flexDirection: 'row',
            gap: '24px',
            width: 'auto', // Changed from 100% to auto to let children define width
            maxWidth: '1200px',
            height: '90vh', // Changed from 680px to a percentage of viewport height
            maxHeight: '900px', // Prevents it from getting too tall on giant screens
            maxHeight: '90vh',
            transition: 'transform 400ms cubic-bezier(0.16, 1, 0.3, 1)',
            transform: isAnimating ? 'translateY(0) scale(1)' : 'translateY(20px) scale(0.98)',
        },
        // LEFT SIDE: TABLE (Takes more space)
        tablePanel: {
            width: '70vw',
            height: '100%',
            backgroundColor: 'white',
            borderRadius: '12px',
            boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
            overflow: 'hidden',
            position: 'relative',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
        },
        tableWrapper: {
            width: '90%',
            height: '100%',
            padding: '8px',

        },
        // RIGHT SIDE: CARD (Takes less space)
        cardPanel: {
            flex: 1,
            minWidth: '320px',
            maxWidth: '380px',
            display: 'flex',
            alignItems: 'center', // Center card vertically
            justifyContent: 'center',
        },
        // Navigation Buttons
        navBtn: {
            position: 'absolute',
            top: '50%',
            transform: 'translateY(-50%)',
            width: '40px',
            height: '40px',
            borderRadius: '50%',
            backgroundColor: 'white',
            border: '1px solid #e5e7eb',
            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            color: '#374151',
            zIndex: 20,
            transition: 'all 0.2s',
        },
        closeBtn: {
            position: 'absolute',
            top: '12px',
            right: '12px',
            zIndex: 50,
            background: 'white',
            border: '1px solid #f3f4f6',
            borderRadius: '50%',
            padding: '6px',
            cursor: 'pointer',
            color: '#9ca3af',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 1px 2px 0 rgba(0,0,0,0.05)'
        }
    };

    return (
        <div style={s.backdrop} onClick={onClose}>

            {/* INJECTED STYLES FOR HOVER STATES */}
            <style>{`
                .nav-btn:hover:not(:disabled) { transform: translateY(-50%) scale(1.1) !important; color: #2563eb !important; }
                .nav-btn:disabled { opacity: 0.3; cursor: not-allowed; }
                .close-btn:hover { background-color: #f3f4f6 !important; color: #1f2937 !important; }
                .row-hover:hover { background-color: #f9fafb; }
            `}</style>

            <div style={s.container} onClick={e => e.stopPropagation()}>

                {/* --- NAVIGATION: PREV (Outside Left) --- */}
                {events.length > 1 && (
                    <button
                        onClick={handlePrev}
                        disabled={currentIndex === 0}
                        style={{ ...s.navBtn, left: '-56px' }}
                        className="nav-btn"
                    >
                        <ChevronLeft size={20} />
                    </button>
                )}

                {/* --- NAVIGATION: NEXT (Outside Right) --- */}
                {events.length > 1 && (
                    <button
                        onClick={handleNext}
                        disabled={currentIndex === events.length - 1}
                        style={{ ...s.navBtn, right: '-56px' }}
                        className="nav-btn"
                    >
                        <ChevronRight size={20} />
                    </button>
                )}

                {/* --- RIGHT SECTION: CARD --- */}
                <div style={s.cardPanel}>
                    {/* Applying a slight scale animation on hover for the card wrapper */}
                    <div style={{ width: '100%', transition: 'transform 0.3s' }}
                        onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.02)'}
                        onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
                    >
                        <EventPreviewCard
                            eventName={currentEvent.eventName}
                            eventDate={currentEvent.eventDate}
                            selectedColor={currentEvent.selectedColor}
                            selectedDepartments={currentEvent.selectedDepartments}
                            selectedPrograms={currentEvent.selectedPrograms}
                        />
                    </div>
                </div>

                {/* --- LEFT SECTION: TABLE --- */}
                <div style={s.tablePanel}>
                    <button onClick={onClose} style={s.closeBtn} className="close-btn">
                        <X size={18} />
                    </button>

                    <div style={s.tableWrapper}>
                        <GenericTable
                            title={currentEvent.eventName}
                            subtitle="Participant Management"
                            tabs={tabs}
                            activeTab="All"
                            onTabChange={() => { }}
                            searchTerm=""
                            onSearchChange={() => { }}
                            columns={['Name', 'ID', 'Section', 'Status']}
                            data={tableData}
                            renderRow={renderRow}
                            metrics={[
                                { label: 'Total', value: tableData.length },
                                { label: 'Present', value: tableData.filter(x => x.status === 'Attended').length, color: '#166534' }
                            ]}
                            maxItems={5}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

export { EventDetailModal };