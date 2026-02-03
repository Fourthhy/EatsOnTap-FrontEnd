import React, { useState, useEffect, useMemo } from 'react';
import { X, ChevronLeft, ChevronRight, Users } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { EventPreviewCard } from './EventPreviewCard';
import { GenericTable } from '../../../../components/global/table/GenericTable';

const EventDetailModal = ({ isOpen, onClose, events, initialEventId }) => {

    const [currentIndex, setCurrentIndex] = useState(0);
    const [activeTab, setActiveTab] = useState('All'); 
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        if (isOpen && events.length > 0) {
            // Support finding by mongo _id OR custom eventID
            const index = events.findIndex(e => e._id === initialEventId || e.id === initialEventId);
            setCurrentIndex(index >= 0 ? index : 0);
        }
    }, [isOpen, initialEventId, events]);

    useEffect(() => {
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

    // --- DEPARTMENT CLASSIFICATION ---
    const getDepartment = (item) => {
        // If explicitly tagged as Higher Ed / Program
        if (item.categoryType === 'PROGRAM' || item.type === 'Higher Ed') return 'Higher Education';

        const y = parseInt(item.year, 10);
        if (isNaN(y)) return 'Other';

        if (y >= 1 && y <= 6) return 'Primary Education';    
        if (y >= 7 && y <= 10) return 'Junior High School';  
        if (y >= 11 && y <= 12) return 'Senior High School'; 
        
        return 'Higher Education'; 
    };

    // --- 🟢 DATA PREPARATION (FIXED) ---
    const allEligibleGroups = useMemo(() => {
        if (!currentEvent) return [];

        // CASE 1: Data comes from processed Dashboard (Standardized)
        if (currentEvent.selectedPrograms) {
            return currentEvent.selectedPrograms.map(item => ({
                ...item,
                displayName: item.display || `${item.year} - ${item.section || item.program}`,
                categoryType: (item.type === 'Basic Ed' || item.categoryType === 'SECTION') ? 'SECTION' : 'PROGRAM',
                totalEligibleCount: item.totalEligibleCount || 0,
                totalClaimedCount: item.totalClaimedCount || 0
            }));
        }
        
        // CASE 2: Fallback (If raw backend data is passed)
        const sections = (currentEvent.forEligibleSection || []).map(s => ({
            ...s, 
            displayName: `${s.year} - ${s.section}`, 
            categoryType: 'SECTION' 
        }));

        const programs = (currentEvent.forEligibleProgramsAndYear || []).map(p => ({
            ...p, 
            displayName: `${p.year} - ${p.program}`,
            categoryType: 'PROGRAM' 
        }));

        return [...sections, ...programs];
    }, [currentEvent]);

    // --- TABS CONFIGURATION ---
    const tabs = useMemo(() => {
        if (!currentEvent) return [];
        
        const baseTabs = [{ id: 'All', label: 'All Departments' }];
        const depts = new Set();

        allEligibleGroups.forEach(group => {
            depts.add(getDepartment(group));
        });

        if (depts.has('Primary Education')) baseTabs.push({ id: 'Primary Education', label: 'Primary Education' });
        if (depts.has('Junior High School')) baseTabs.push({ id: 'Junior High School', label: 'Junior High School' });
        if (depts.has('Senior High School')) baseTabs.push({ id: 'Senior High School', label: 'Senior High School' });
        if (depts.has('Higher Education')) baseTabs.push({ id: 'Higher Education', label: 'Higher Education' });

        return baseTabs;
    }, [allEligibleGroups, currentEvent]);


    // --- DYNAMIC DATA PROCESSING ---
    const processedData = useMemo(() => {
        if (!currentEvent) return [];

        let filteredGroups = allEligibleGroups;

        // 1. Filter by Department
        if (activeTab !== 'All') {
            filteredGroups = allEligibleGroups.filter(g => getDepartment(g) === activeTab);
        }

        // 2. Search Logic
        if (searchTerm) {
            filteredGroups = filteredGroups.filter(g => 
                (g.displayName || '').toLowerCase().includes(searchTerm.toLowerCase())
            );
        }

        // 3. Format for Table
        return filteredGroups.map(g => ({
            id: g._id || Math.random(), // Fallback ID
            name: g.displayName, 
            year: g.year,
            totalEligible: g.totalEligibleCount,
            totalClaimed: g.totalClaimedCount,
            percentage: g.totalEligibleCount > 0 
                ? Math.round((g.totalClaimedCount / g.totalEligibleCount) * 100) 
                : 0
        }));

    }, [allEligibleGroups, activeTab, searchTerm, currentEvent]);


    // --- COLUMN CONFIGURATION ---
    const columns = ['Section / Program', 'Year Level', 'Eligible Students', 'Claimed Meals', 'Status'];

    // --- ROW RENDERER ---
    const renderRow = (item, index, startIndex) => {
        const cellStyle = {
            fontFamily: 'geist, sans-serif', fontSize: '12px', color: '#4b5563',
            padding: '12px 24px 12px 0px', borderBottom: '1px solid #f3f4f6'
        };

        return (
            <tr key={item.id} className="row-hover">
                <td style={{ ...cellStyle, textAlign: "center" }}>{startIndex + index + 1}</td>
                <td style={{ ...cellStyle, fontWeight: 500, color: '#111827' }}>
                    <div className="flex items-center gap-2">
                        <Users size={14} className="text-blue-500" /> {item.name}
                    </div>
                </td>
                <td style={cellStyle}>Year {item.year}</td>
                <td style={cellStyle}>{item.totalEligible} Students</td>
                <td style={cellStyle}>
                    <span style={{ fontWeight: 600, color: item.totalClaimed > 0 ? '#15803d' : '#6b7280' }}>
                        {item.totalClaimed}
                    </span>
                    <span className="text-xs text-gray-400 ml-1">({item.percentage}%)</span>
                </td>
                <td style={cellStyle}>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium border ${
                        item.percentage === 100 ? 'bg-green-50 text-green-700 border-green-100' 
                        : item.percentage > 0 ? 'bg-blue-50 text-blue-700 border-blue-100'
                        : 'bg-gray-50 text-gray-500 border-gray-100'
                    }`}>
                        {item.percentage === 100 ? 'Completed' : item.percentage > 0 ? 'In Progress' : 'No Claims'}
                    </span>
                </td>
            </tr>
        );
    };

    // --- STYLES ---
    const s = {
        backdrop: {
            position: 'fixed', inset: 0, zIndex: 9500,
            backgroundColor: 'rgba(0, 0, 0, 0.4)', backdropFilter: 'blur(4px)',
            display: 'flex', alignItems: 'center', justifyContent: 'center', paddingRight: '16px'
        },
        container: {
            position: 'relative', display: 'flex', flexDirection: 'row', gap: '24px',
            width: 'auto', maxWidth: '1200px', height: '90vh', maxHeight: '90vh'
        },
        tablePanel: {
            width: '70vw', height: '100%', backgroundColor: 'white', borderRadius: '12px',
            boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
            overflow: 'hidden', position: 'relative', display: 'flex', flexDirection: 'column', alignItems: 'center'
        },
        tableWrapper: { width: '90%', height: '100%', padding: '8px' },
        cardPanel: { flex: 1, minWidth: '320px', maxWidth: '380px', display: 'flex', alignItems: 'center', justifyContent: 'center' },
        navBtn: {
            position: 'absolute', top: '50%', transform: 'translateY(-50%)', width: '40px', height: '40px',
            borderRadius: '50%', backgroundColor: 'white', border: '1px solid #e5e7eb',
            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)', display: 'flex', alignItems: 'center',
            justifyContent: 'center', cursor: 'pointer', color: '#374151', zIndex: 20, transition: 'all 0.2s'
        },
        closeBtn: {
            position: 'absolute', top: '12px', right: '12px', zIndex: 50, background: 'white',
            border: '1px solid #f3f4f6', borderRadius: '50%', padding: '6px', cursor: 'pointer',
            color: '#9ca3af', display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: '0 1px 2px 0 rgba(0,0,0,0.05)'
        }
    };

    return (
        <AnimatePresence>
            {isOpen && currentEvent && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    style={s.backdrop}
                    onClick={onClose}
                >
                    <style>{`
                        .nav-btn:hover:not(:disabled) { transform: translateY(-50%) scale(1.1) !important; color: #2563eb !important; }
                        .nav-btn:disabled { opacity: 0.3; cursor: not-allowed; }
                        .close-btn:hover { background-color: #f3f4f6 !important; color: #1f2937 !important; }
                        .row-hover:hover { background-color: #f9fafb; }
                    `}</style>

                    <motion.div
                        initial={{ scale: 0.95, opacity: 0, y: 20 }}
                        animate={{ scale: 1, opacity: 1, y: 0 }}
                        exit={{ scale: 0.95, opacity: 0, y: 20 }}
                        transition={{ type: "spring", stiffness: 300, damping: 30 }}
                        style={s.container}
                        onClick={e => e.stopPropagation()}
                    >
                        {/* NAV BUTTONS */}
                        {events.length > 1 && (
                            <>
                                <button onClick={handlePrev} disabled={currentIndex === 0} style={{ ...s.navBtn, left: '-56px' }} className="nav-btn">
                                    <ChevronLeft size={20} />
                                </button>
                                <button onClick={handleNext} disabled={currentIndex === events.length - 1} style={{ ...s.navBtn, right: '-56px' }} className="nav-btn">
                                    <ChevronRight size={20} />
                                </button>
                            </>
                        )}

                        {/* LEFT: CARD PREVIEW */}
                        <div style={s.cardPanel}>
                            <div style={{ width: '100%', transition: 'transform 0.3s' }}
                                onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.02)'}
                                onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
                            >
                                <EventPreviewCard
                                    eventName={currentEvent.eventName}
                                    eventDate={currentEvent.eventDate || `${currentEvent.startMonth} ${currentEvent.startDay}`} 
                                    selectedColor={currentEvent.selectedColor || currentEvent.eventColor}
                                    selectedDepartments={
                                        currentEvent.selectedDepartments 
                                        || (currentEvent.eventScope === 'School-Wide' ? ['All'] : ['Departmental'])
                                    }
                                    selectedPrograms={allEligibleGroups.map(g => g.displayName)}
                                />
                            </div>
                        </div>

                        {/* RIGHT: TABLE */}
                        <div style={s.tablePanel}>
                            <button onClick={onClose} style={s.closeBtn} className="close-btn">
                                <X size={18} />
                            </button>

                            <div style={s.tableWrapper}>
                                <GenericTable
                                    title={currentEvent.eventName}
                                    subtitle="Participation Overview"
                                    tabs={tabs}
                                    activeTab={activeTab}
                                    onTabChange={setActiveTab}
                                    searchTerm={searchTerm}
                                    onSearchChange={setSearchTerm}
                                    columns={columns}
                                    data={processedData}
                                    renderRow={renderRow}
                                    metrics={[
                                        { label: 'Total Groups', value: processedData.length },
                                        { label: 'Eligible', value: processedData.reduce((acc, curr) => acc + curr.totalEligible, 0) },
                                        { 
                                            label: 'Claimed', 
                                            value: processedData.reduce((acc, curr) => acc + curr.totalClaimed, 0),
                                            color: '#166534'
                                        }
                                    ]}
                                    maxItems={7}
                                />
                            </div>
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export { EventDetailModal };