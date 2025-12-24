import React, { useState, useEffect, useMemo } from 'react';
import { X, ChevronLeft, ChevronRight, CheckCircle, XCircle, Clock, BookOpen } from 'lucide-react';
import { EventPreviewCard } from './EventPreviewCard';
import { GenericTable } from '../../../../components/global/table/GenericTable';

// --- MOCK DATA GENERATOR ---
const generateMockParticipants = (eventId, programs = []) => {
    if (!programs || programs.length === 0) return [];
    const statuses = ['Registered', 'Attended', 'Absent'];
    const dummyNames = ['Alice Johnson', 'Bob Smith', 'Charlie Brown', 'Diana Prince', 'Evan Wright', 'Fiona Gallagher'];

    let data = [];
    programs.forEach(prog => {
        for (let i = 0; i < 12; i++) { 
            const randomStatus = statuses[Math.floor(Math.random() * statuses.length)];
            data.push({
                id: `${eventId}-${prog}-${i}`,
                name: dummyNames[i % dummyNames.length] || `Student ${i + 1}`,
                studentId: `2023-${1000 + (i * 5) + Math.floor(Math.random() * 100)}`,
                program: prog,
                status: randomStatus,
                // Mocking Credit Value for students
                creditValue: '3.0 Units' 
            });
        }
    });
    return data;
};

const EventDetailModal = ({ isOpen, onClose, events, initialEventId }) => {

    const [currentIndex, setCurrentIndex] = useState(0);
    const [isAnimating, setIsAnimating] = useState(false);
    const [activeTab, setActiveTab] = useState('Sections/Programs');
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        if (isOpen && events.length > 0) {
            const index = events.findIndex(e => e.id === initialEventId);
            setCurrentIndex(index >= 0 ? index : 0);
            requestAnimationFrame(() => setIsAnimating(true));
        } else {
            setIsAnimating(false);
        }
    }, [isOpen, initialEventId, events]);

    useEffect(() => {
        setActiveTab('Sections/Programs');
        setSearchTerm('');
    }, [currentIndex]);

    const handleNext = (e) => {
        e.stopPropagation();
        if (currentIndex < events.length - 1) setCurrentIndex(prev => prev + 1);
    };

    const handlePrev = (e) => {
        e.stopPropagation();
        if (currentIndex > 0) setCurrentIndex(prev => prev - 1);
    };

    const currentEvent = events[currentIndex];
    
    // Helper boolean for cleaner logic
    const isNotUpcoming = currentEvent && currentEvent.classification !== 'upcoming';

    // --- DATA MEMOIZATION ---
    const rawTableData = useMemo(() => {
        return currentEvent ? generateMockParticipants(currentEvent.id, currentEvent.selectedPrograms) : [];
    }, [currentEvent]);

    // --- TABS CONFIGURATION ---
    const tabs = useMemo(() => {
        if (!currentEvent) return [];
        
        const defaultTabs = [{ id: 'Sections/Programs', label: 'Sections/Programs' }];

        // RULE: If Upcoming, ONLY show Sections/Programs. 
        // If Ongoing/Recent, show All + Individual Programs.
        if (isNotUpcoming) {
            return [
                ...defaultTabs,
                { id: 'All', label: 'All Students' },
                ...(currentEvent.selectedPrograms || []).map(p => ({ id: p, label: p }))
            ];
        }

        return defaultTabs;
    }, [currentEvent, isNotUpcoming]);

    // --- DYNAMIC DATA PROCESSING ---
    const processedData = useMemo(() => {
        if (!currentEvent) return [];

        // CASE A: SECTIONS/PROGRAMS VIEW
        if (activeTab === 'Sections/Programs') {
            const summary = (currentEvent.selectedPrograms || []).map(prog => {
                const count = rawTableData.filter(d => d.program === prog).length;
                return {
                    id: `summary-${prog}`,
                    programName: prog,
                    studentCount: count,
                    sectionStatus: count > 10 ? 'Full' : 'Open', 
                    creditValue: '3.0 Units'
                };
            });
            
            if (searchTerm) {
                return summary.filter(s => s.programName.toLowerCase().includes(searchTerm.toLowerCase()));
            }
            return summary;
        }

        // CASE B: STUDENT LISTS VIEW
        let data = rawTableData;
        if (activeTab !== 'All') {
            data = data.filter(item => item.program === activeTab);
        }
        if (searchTerm) {
            const lowerTerm = searchTerm.toLowerCase();
            data = data.filter(item => 
                item.name.toLowerCase().includes(lowerTerm) || 
                item.studentId.toLowerCase().includes(lowerTerm)
            );
        }
        return data;

    }, [rawTableData, activeTab, searchTerm, currentEvent]);


    // --- DYNAMIC COLUMN CONFIGURATION ---
    const columns = useMemo(() => {
        if (activeTab === 'Sections/Programs') {
            const cols = ['Section/Program Name', 'Number of Students'];
            // If NOT upcoming, add Status and Credit
            if (isNotUpcoming) cols.push('Status', 'Credit Value');
            return cols;
        }
        
        // Student Lists
        const cols = ['Name', 'ID', 'Section'];
        // RULE: If NOT upcoming, apply columns to ALL TABS
        if (isNotUpcoming) cols.push('Status', 'Credit Value');
        
        return cols;
    }, [activeTab, isNotUpcoming]);


    // --- ROW RENDERER ---
    const renderRow = (item, index, startIndex) => {
        const cellStyle = {
            fontFamily: 'geist, sans-serif',
            fontSize: '12px',
            color: '#4b5563',
            padding: '12px 24px 12px 0px',
            borderBottom: '1px solid #f3f4f6'
        };

        // RENDERER A: SECTIONS/PROGRAMS
        if (activeTab === 'Sections/Programs') {
             return (
                <tr key={item.id} className="row-hover">
                    <td style={{...cellStyle, textAlign: "center"}}>{startIndex + index + 1}</td>
                    <td style={{ ...cellStyle, fontWeight: 500, color: '#111827' }}>
                        <div className="flex items-center gap-2">
                             <BookOpen size={14} className="text-blue-500"/> {item.programName}
                        </div>
                    </td>
                    <td style={cellStyle}>{item.studentCount} Students</td>
                    
                    {/* Render Extra Columns if NOT upcoming */}
                    {isNotUpcoming && (
                        <>
                            <td style={cellStyle}>
                                <span className="bg-blue-50 text-blue-700 px-2 py-1 rounded-full text-xs font-medium border border-blue-100">
                                    {item.sectionStatus}
                                </span>
                            </td>
                            <td style={cellStyle}>{item.creditValue}</td>
                        </>
                    )}
                </tr>
             );
        }

        // RENDERER B: STUDENT LISTS
        const getStatusStyle = (s) => {
            switch (s) {
                case 'Attended': return { bg: '#dcfce7', text: '#166534', icon: CheckCircle };
                case 'Absent': return { bg: '#fee2e2', text: '#991b1b', icon: XCircle };
                default: return { bg: '#f3f4f6', text: '#4b5563', icon: Clock };
            }
        };
        const style = getStatusStyle(item.status);
        const Icon = style.icon;

        return (
            <tr key={item.id} className="row-hover">
                <td style={{...cellStyle, textAlign: "center"}}>{startIndex + index + 1}</td>
                <td style={{ ...cellStyle, color: '#111827', fontWeight: 500 }}>{item.name}</td>
                <td style={cellStyle}>{item.studentId}</td>
                <td style={cellStyle}>{item.program}</td>

                {/* Render Extra Columns if NOT upcoming */}
                {isNotUpcoming && (
                    <>
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
                        <td style={cellStyle}>{item.creditValue}</td>
                    </>
                )}
            </tr>
        );
    };

    if (!isOpen || !currentEvent) return null;

    // --- STYLES (Unchanged) ---
    const s = {
        backdrop: { position: 'fixed', inset: 0, zIndex: 3000, backgroundColor: 'rgba(0, 0, 0, 0.4)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', paddingRight: '16px', transition: 'opacity 300ms ease-out', opacity: isAnimating ? 1 : 0 },
        container: { position: 'relative', display: 'flex', flexDirection: 'row', gap: '24px', width: 'auto', maxWidth: '1200px', height: '90vh', maxHeight: '90vh', transition: 'transform 400ms cubic-bezier(0.16, 1, 0.3, 1)', transform: isAnimating ? 'translateY(0) scale(1)' : 'translateY(20px) scale(0.98)' },
        tablePanel: { width: '70vw', height: '100%', backgroundColor: 'white', borderRadius: '12px', boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)', overflow: 'hidden', position: 'relative', display: 'flex', flexDirection: 'column', alignItems: 'center' },
        tableWrapper: { width: '90%', height: '100%', padding: '8px' },
        cardPanel: { flex: 1, minWidth: '320px', maxWidth: '380px', display: 'flex', alignItems: 'center', justifyContent: 'center' },
        navBtn: { position: 'absolute', top: '50%', transform: 'translateY(-50%)', width: '40px', height: '40px', borderRadius: '50%', backgroundColor: 'white', border: '1px solid #e5e7eb', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: '#374151', zIndex: 20, transition: 'all 0.2s' },
        closeBtn: { position: 'absolute', top: '12px', right: '12px', zIndex: 50, background: 'white', border: '1px solid #f3f4f6', borderRadius: '50%', padding: '6px', cursor: 'pointer', color: '#9ca3af', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 1px 2px 0 rgba(0,0,0,0.05)' }
    };

    return (
        <div style={s.backdrop} onClick={onClose}>
            <style>{`
                .nav-btn:hover:not(:disabled) { transform: translateY(-50%) scale(1.1) !important; color: #2563eb !important; }
                .nav-btn:disabled { opacity: 0.3; cursor: not-allowed; }
                .close-btn:hover { background-color: #f3f4f6 !important; color: #1f2937 !important; }
                .row-hover:hover { background-color: #f9fafb; }
            `}</style>

            <div style={s.container} onClick={e => e.stopPropagation()}>
                {events.length > 1 && (
                    <button onClick={handlePrev} disabled={currentIndex === 0} style={{ ...s.navBtn, left: '-56px' }} className="nav-btn">
                        <ChevronLeft size={20} />
                    </button>
                )}
                {events.length > 1 && (
                    <button onClick={handleNext} disabled={currentIndex === events.length - 1} style={{ ...s.navBtn, right: '-56px' }} className="nav-btn">
                        <ChevronRight size={20} />
                    </button>
                )}

                <div style={s.cardPanel}>
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

                <div style={s.tablePanel}>
                    <button onClick={onClose} style={s.closeBtn} className="close-btn">
                        <X size={18} />
                    </button>

                    <div style={s.tableWrapper}>
                        <GenericTable
                            title={currentEvent.eventName}
                            subtitle={activeTab === 'Sections/Programs' ? 'Program Overview' : 'Participant List'}
                            tabs={tabs}
                            activeTab={activeTab}
                            onTabChange={setActiveTab}
                            searchTerm={searchTerm}
                            onSearchChange={setSearchTerm}
                            columns={columns}
                            data={processedData}
                            renderRow={renderRow}
                            metrics={[
                                { label: 'Total Students', value: rawTableData.length },
                                ...(isNotUpcoming ? [{ 
                                    label: 'Present', 
                                    value: rawTableData.filter(x => x.status === 'Attended').length, 
                                    color: '#166534' 
                                }] : [])
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