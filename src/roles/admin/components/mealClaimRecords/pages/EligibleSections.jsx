import React, { useState, useMemo } from 'react';
import {
    CheckCircle, BarChart3, Users, CalendarDays,
    Check, X, Clock, AlertCircle, FileText
} from 'lucide-react';
import { GenericTable } from '../../../../../components/global/table/GenericTable';
import { useData } from '../../../../../context/DataContext';
import { motion } from 'framer-motion';

// 🟢 Import your helper
import { extractSchoolHierarchy } from '../../../../../functions/admin/schoolHeirarchy'; 

// 🟢 Switcher Button (Unchanged)
const SwitcherButton = ({ mode, currentMode, icon, label, onClick }) => {
    const [isHovered, setIsHovered] = useState(false);
    const isActive = currentMode === mode;
    const shouldExpand = isActive || isHovered;

    return (
        <button
            onClick={onClick}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            style={{
                padding: '6px 10px',
                borderRadius: '6px',
                fontSize: '12px',
                fontWeight: 500,
                border: 'none',
                cursor: 'pointer',
                backgroundColor: isActive ? 'white' : 'transparent',
                color: isActive ? '#4268BD' : '#6b7280',
                boxShadow: isActive ? '0 1px 2px 0 rgba(0, 0, 0, 0.05)' : 'none',
                transition: 'background-color 200ms ease, color 200ms ease',
                display: 'flex', alignItems: 'center', gap: '6px', height: '32px', outline: 'none'
            }}
        >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{icon}</div>
            <motion.span
                initial={false}
                animate={{ width: shouldExpand ? 'auto' : 0, opacity: shouldExpand ? 1 : 0 }}
                transition={{ type: "spring", stiffness: 500, damping: 30 }}
                style={{ overflow: 'hidden', whiteSpace: 'nowrap', display: 'inline-block' }}
            >
                {label}
            </motion.span>
        </button>
    );
};

export const EligibleSections = ({ switchView, currentView }) => {
    const {
        basicEducationMealRequest = [],
        higherEducationMealRequest = [],
        eventMealRequest = [],
        todayClaimRecord = null,
        schoolData = []
    } = useData();

    const [searchTerm, setSearchTerm] = useState('');
    
    // 🟢 YOUR TABS (These act as the "Master Labels")
    const tabs = [
        'All', 
        'Preschool', 
        'Primary Education', 
        'Intermediate', 
        'Junior High School', 
        'Senior High School', 
        'Higher Education'
    ].map(t => ({ id: t, label: t }));

    const [activeTab, setActiveTab] = useState('All');

    // 🟢 HIERARCHY & MAPPING
    const { flatSections } = useMemo(() => extractSchoolHierarchy(schoolData), [schoolData]);

    // 🟢 FIX: MAP RAW IDs TO LABELS
    // This bridges the gap between "juniorHighSchool" (DB) and "Junior High School" (Tabs)
    const CATEGORY_MAP = useMemo(() => ({
        'preschool': 'Preschool',
        'primaryEducation': 'Primary Education',
        'intermediate': 'Intermediate',
        'juniorHighSchool': 'Junior High School',
        'seniorHighSchool': 'Senior High School',
        'higherEducation': 'Higher Education',
        // Fallbacks for any inconsistent casing
        'Preschool': 'Preschool',
        'Primary Education': 'Primary Education',
        'Intermediate': 'Intermediate',
        'Junior High School': 'Junior High School',
        'Senior High School': 'Senior High School'
    }), []);

    const getStatusBadge = (status) => {
        const styles = {
            'Approved': { bg: '#ECFDF5', text: '#059669', icon: Check },
            'Rejected': { bg: '#FEF2F2', text: '#DC2626', icon: X },
            'Pending': { bg: '#EFF6FF', text: '#3B82F6', icon: Clock },
            'Missing': { bg: '#FFF1F2', text: '#BE123C', icon: AlertCircle }
        };
        const s = styles[status] || styles['Pending'];
        const Icon = s.icon;
        return (
            <span style={{
                display: 'inline-flex', alignItems: 'center', gap: '6px',
                padding: '2px 10px', borderRadius: '999px',
                fontSize: '12px', fontWeight: 500,
                backgroundColor: s.bg, color: s.text
            }}>
                <Icon size={12} /> {status}
            </span>
        );
    };

    // 🟢 DATA PROCESSING
    const approvedData = useMemo(() => {
        const normalizeStatus = (status) => (!status ? 'Unknown' : status.charAt(0).toUpperCase() + status.slice(1).toLowerCase());
        const formatTime = (dateInput) => (!dateInput ? '--:--' : new Date(dateInput).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
        const isApproved = (item) => item.status === 'APPROVED' || item.status === 'Approved';

        // 1. Basic Education Mapping
        const basic = basicEducationMealRequest.filter(isApproved).map(item => {
            // Find the section in our hierarchy
            const match = flatSections.find(s => s.section === item.section);
            
            // Get the raw ID (e.g., "juniorHighSchool")
            const rawCategory = match ? match.category : 'Basic Education';
            
            // 🟢 FIX: Convert Raw ID to Nice Label using the Map
            // If not found in map, fallback to the raw value
            const niceCategory = CATEGORY_MAP[rawCategory] || rawCategory;

            return {
                id: item.eligibilityID || item._id,
                sectionProgram: item.section,
                category: niceCategory, // Now equals "Junior High School"
                recipientCount: item.forEligible?.length || 0,
                timeApproved: formatTime(item.timeStamp),
                status: normalizeStatus(item.status),
                rawDate: item.timeStamp,
                type: 'Basic'
            };
        });

        // 2. Higher Education Mapping
        const higher = higherEducationMealRequest.filter(isApproved).map(item => ({
            id: item.eligibilityID || item._id,
            sectionProgram: `${item.program} ${item.year}`,
            category: 'Higher Education',
            recipientCount: item.forEligible?.length || 0,
            timeApproved: formatTime(item.timeStamp),
            status: normalizeStatus(item.status),
            rawDate: item.timeStamp,
            type: 'Higher'
        }));

        // 3. Event Mapping
        const events = eventMealRequest.filter(isApproved).map(item => ({
            id: item.eventID || item._id,
            sectionProgram: item.eventName,
            category: 'Event',
            recipientCount: (item.forEligibleSection?.length || 0) + (item.forEligibleProgramsAndYear?.length || 0),
            timeApproved: item.eventSpan?.[0] ? new Date(item.eventSpan[0]).toLocaleDateString() : 'N/A',
            status: normalizeStatus(item.status),
            rawDate: item.eventSpan?.[0] || new Date(),
            type: 'Event'
        }));

        let combined = [...basic, ...higher, ...events].sort((a, b) => new Date(b.rawDate) - new Date(a.rawDate));

        if (searchTerm) {
            const lowerTerm = searchTerm.toLowerCase();
            combined = combined.filter(item =>
                item.sectionProgram.toLowerCase().includes(lowerTerm) ||
                item.category.toLowerCase().includes(lowerTerm)
            );
        }

        return combined;
    }, [basicEducationMealRequest, higherEducationMealRequest, eventMealRequest, searchTerm, flatSections, CATEGORY_MAP]);

    // 🟢 TAB FILTERING
    const filteredData = useMemo(() => {
        if (activeTab === 'All') return approvedData;
        
        // Exact match now works because we normalized the data above
        return approvedData.filter(item => item.category === activeTab);
    }, [approvedData, activeTab]);

    const renderRow = (item) => {
        const cellStyle = {
            fontFamily: 'geist, sans-serif', fontSize: '12px', color: '#4b5563',
            borderBottom: '1px solid #f3f4f6', height: '43.5px', verticalAlign: 'middle'
        };

        const handleViewRecord = (e) => {
            e.stopPropagation();
            let recordsArray = [];
            if (todayClaimRecord) {
                if (todayClaimRecord.claimRecords) recordsArray = todayClaimRecord.claimRecords;
                else if (Array.isArray(todayClaimRecord) && todayClaimRecord.length > 0) {
                    if (todayClaimRecord[0]?.claimRecords) recordsArray = todayClaimRecord[0].claimRecords;
                }
            }
            const sectionClaimData = recordsArray.find(r => r.section === item.sectionProgram);
            switchView('daily', {
                sectionInfo: item,
                claimData: sectionClaimData || { eligibleStudents: [], waivedStudents: [] }
            });
        };

        return (
            <tr key={item.id} className="hover:bg-gray-50 transition-colors cursor-pointer group" onClick={handleViewRecord}>
                <td></td>
                <td style={{ ...cellStyle, fontWeight: 500, color: '#111827', paddingLeft: '24px', width: 'calc(100vw/7)' }}>
                    <div className="flex items-center gap-2">
                        {item.type === 'Event' ? <CalendarDays size={14} className="text-purple-500" /> : <Users size={14} className="text-blue-500" />}
                        {item.sectionProgram}
                    </div>
                </td>
                {/* 🟢 Now this will display "Junior High School" instead of "juniorHighSchool" */}
                <td style={{ ...cellStyle, width: 'calc(100vw/6)' }}>{item.category}</td>
                <td style={{ ...cellStyle, width: 'calc(100vw/6)' }}>{item.recipientCount} Students</td>
                <td style={{ ...cellStyle, width: 'calc(100vw/6)' }}>{item.timeApproved}</td>
                <td style={{ ...cellStyle, width: 'calc(100vw/6)' }}>{getStatusBadge(item.status)}</td>
                <td style={{ ...cellStyle, textAlign: 'center', display: "flex", alignItems: "center", width: 'calc(100vw/9)' }}>
                    <button onClick={handleViewRecord} className="opacity-0 group-hover:opacity-100 transition-opacity hover:text-blue-800 hover:bg-blue-100"
                        style={{ display: 'flex', alignItems: 'center', gap: '4px', color: '#2563eb', fontWeight: 500, backgroundColor: '#eff6ff', padding: '6px 12px', borderRadius: '6px', fontSize: '11px', cursor: 'pointer', border: 'none' }}>
                        <FileText size={12} /> View Claim Record
                    </button>
                </td>
            </tr>
        );
    };

    const viewSwitcher = (
        <div style={{ backgroundColor: '#f3f4f6', padding: '4px', borderRadius: '8px', display: 'flex', gap: '4px', margin: "5px" }}>
            <SwitcherButton mode="eligible" currentMode={currentView} icon={<CheckCircle size={14} />} label="Eligible Sections" onClick={() => switchView('eligible')} />
            <SwitcherButton mode="overall" currentMode={currentView} icon={<BarChart3 size={14} />} label="Overall Record" onClick={() => switchView('overall')} />
        </div>
    );

    return (
        <GenericTable
            title="Eligible Sections"
            subtitle="List of sections approved for meal claiming today"
            data={filteredData}
            columns={['Section/Program', 'Category', 'Eligible Count', 'Time Approved', 'Status', 'Action']}
            renderRow={renderRow}
            customActions={viewSwitcher}
            searchTerm={searchTerm}
            onSearchChange={setSearchTerm}
            tabs={tabs}
            activeTab={activeTab}
            onTabChange={setActiveTab}
            metrics={[
                { label: 'Total Approved', value: approvedData.length },
                { label: 'Basic Ed', value: approvedData.filter(i => i.type === 'Basic').length, color: '#3B82F6' },
                { label: 'Higher Ed', value: approvedData.filter(i => i.type === 'Higher').length, color: '#8B5CF6' }
            ]}
        />
    );
};