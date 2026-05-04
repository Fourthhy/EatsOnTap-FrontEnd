import React, { useState, useEffect, useMemo } from 'react';
import { X, ChevronLeft, ChevronRight, Users } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { EventPreviewCard } from './EventPreviewCard';
import { GenericTable } from '../../../../components/global/table/GenericTable';
import { getSchoolStructure } from '../../../../functions/admin/getSchoolStructure';

// --- HELPER: Formats camelCase to Title Case (e.g., primaryEducation -> Primary Education) ---
const formatDeptName = (name) => {
    if (!name) return "Other";
    const result = name.replace(/([A-Z])/g, " $1");
    return result.charAt(0).toUpperCase() + result.slice(1);
};

const EventDetailModal = ({ isOpen, onClose, events, initialEventId }) => {

    const [currentIndex, setCurrentIndex] = useState(0);
    const [activeTab, setActiveTab] = useState('All'); 
    const [searchTerm, setSearchTerm] = useState('');
    
    // 🟢 1. STATE FOR DYNAMIC SCHOOL STRUCTURE
    const [structureData, setStructureData] = useState([]);

    // 🟢 2. FETCH LIVE STRUCTURE ON MOUNT
    useEffect(() => {
        if (isOpen) {
            getSchoolStructure().then(data => {
                if (Array.isArray(data)) setStructureData(data);
            }).catch(err => console.error("Failed to load school structure", err));
        }
    }, [isOpen]);

    useEffect(() => {
        if (isOpen && events.length > 0) {
            const index = events.findIndex(e => e._id === initialEventId || e.id === initialEventId);
            setCurrentIndex(index >= 0 ? index : 0);
        }
    }, [isOpen, initialEventId, events]);

    useEffect(() => {
        setSearchTerm('');
        setActiveTab('All'); // Reset tab when changing events
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

    // --- 🟢 3. DYNAMIC DEPARTMENT CLASSIFICATION (BULLETPROOFED) ---
    const getDepartment = (item) => {
        if (structureData.length > 0) {
            const identifier = item.section || item.program;
            const year = item.year;

            for (const cat of structureData) {
                if (!cat || !Array.isArray(cat.levels)) continue; // Safe check

                for (const level of cat.levels) {
                    if (!level) continue; // Safe check

                    const levelIdentifier = level.levelName || level.gradeLevel;
                    if (String(levelIdentifier) === String(year)) {
                        
                        // 🟢 THE FIX: Safely extract the array, whether it's Basic Ed or Higher Ed
                        const itemsArray = Array.isArray(level.sections) 
                            ? level.sections 
                            : Array.isArray(level.programs) 
                                ? level.programs 
                                : [];

                        // Now .find() is guaranteed to run on a valid array
                        const found = itemsArray.find(s => 
                            (s.section === identifier) || (s.name === identifier) || (s === identifier)
                        );
                        
                        if (found) {
                            return formatDeptName(cat.category);
                        }
                    }
                }
            }
        }

        // Fallback safety net (while structure is loading, or for old legacy data)
        if (item.categoryType === 'PROGRAM' || item.type === 'Higher Ed') return 'Higher Education';
        const y = parseInt(item.year, 10);
        if (isNaN(y)) return 'Other';
        if (y >= 1 && y <= 6) return 'Primary Education';    
        if (y >= 7 && y <= 10) return 'Junior High School';  
        if (y >= 11 && y <= 12) return 'Senior High School'; 
        return 'Higher Education'; 
    };

    // --- DATA PREPARATION ---
    const allEligibleGroups = useMemo(() => {
        if (!currentEvent) return [];

        if (currentEvent.selectedPrograms) {
            return currentEvent.selectedPrograms.map(item => ({
                ...item,
                displayName: item.section || item.program,
                categoryType: (item.type === 'Basic Ed' || item.categoryType === 'SECTION') ? 'SECTION' : 'PROGRAM',
                totalEligibleCount: item.totalEligibleCount || 0,
                totalClaimedCount: item.totalClaimedCount || 0
            }));
        }
        
        const sections = (currentEvent.forEligibleSection || []).map(s => ({
            ...s, 
            displayName: s.section, 
            categoryType: 'SECTION' 
        }));

        const programs = (currentEvent.forEligibleProgramsAndYear || []).map(p => ({
            ...p, 
            displayName: p.program,
            categoryType: 'PROGRAM' 
        }));

        return [...sections, ...programs];
    }, [currentEvent]);

    // --- 🟢 4. DYNAMIC TABS CONFIGURATION ---
    const tabs = useMemo(() => {
        if (!currentEvent) return [];
        
        const baseTabs = [{ id: 'All', label: 'All Departments' }];
        const depts = new Set();

        allEligibleGroups.forEach(group => {
            depts.add(getDepartment(group));
        });

        Array.from(depts).sort().forEach(deptName => {
            if (deptName !== 'All') {
                baseTabs.push({ id: deptName, label: deptName });
            }
        });

        return baseTabs;
    }, [allEligibleGroups, currentEvent, structureData]);


    // --- DYNAMIC DATA PROCESSING ---
    const processedData = useMemo(() => {
        if (!currentEvent) return [];

        let filteredGroups = allEligibleGroups;

        if (activeTab !== 'All') {
            filteredGroups = allEligibleGroups.filter(g => getDepartment(g) === activeTab);
        }

        if (searchTerm) {
            filteredGroups = filteredGroups.filter(g => 
                (g.displayName || '').toLowerCase().includes(searchTerm.toLowerCase())
            );
        }

        return filteredGroups.map(g => ({
            id: g._id || Math.random(), 
            name: g.displayName, 
            year: g.year,
            totalEligible: g.totalEligibleCount,
            totalClaimed: g.totalClaimedCount,
        }));

    }, [allEligibleGroups, activeTab, searchTerm, currentEvent, structureData]);


    // --- COLUMN CONFIGURATION ---
    const columns = ['Section / Program', 'Year Level', 'Eligible Students', 'Claimed Meals'];

    // --- ROW RENDERER ---
    const renderRow = (item, index, startIndex) => {
        const cellStyle = {
            fontFamily: 'geist, sans-serif', fontSize: '12px', color: '#4b5563',
            padding: '12px 24px 12px 0px', borderBottom: '1px solid #f3f4f6'
        };

        const displayYear = String(item.year).toLowerCase() === 'pre' ? 'Pre' : item.year;

        return (
            <tr key={item.id} className="row-hover">
                <td style={{ ...cellStyle, textAlign: "center" }}>{startIndex + index + 1}</td>
                <td style={{ ...cellStyle, fontWeight: 500, color: '#111827' }}>
                    <div className="flex items-center gap-2">
                        <Users size={14} className="text-blue-500" /> {item.name}
                    </div>
                </td>
                <td style={cellStyle}>{displayYear}</td>
                <td style={cellStyle}>{item.totalEligible} Students</td>
                <td style={{...cellStyle, paddingLeft: "30px" }}>
                    <span style={{ fontWeight: 600, color: item.totalClaimed > 0 ? '#15803d' : '#6b7280' }}>
                        {item.totalClaimed}
                    </span>
                    <span className="text-xs text-gray-400 ml-1">{item.percentage}</span>
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