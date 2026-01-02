import React, { useState, useMemo, useEffect } from 'react';
import { 
    Clock, Calendar, CheckCircle, Check, X, 
    CalendarDays, AlertCircle, User, ArrowLeft, Plus 
} from 'lucide-react';
import { GenericTable } from '../../../../components/global/table/GenericTable';
import { AnimatePresence, motion } from 'framer-motion';

// 🟢 CONTEXT
import { useData } from '../../../../context/DataContext';

// 🟢 API IMPORTS
import { approveMealEligibilityRequest } from '../../../../functions/admin/approveMealEligibilityRequest';
import { generateEligibilityList } from "../../../../functions/admin/generateEligibilityList";

import { SwitcherButton } from './components/SwitcherButton';
import { MealOrdersActionBar } from './components/MealOrderActionBar';

const MealOrdersTable = () => {
    // 🟢 Consume Real Data
    const { 
        basicEducationMealRequest = [], 
        higherEducationMealRequest = [], 
        eventMealRequest = [],
        classAdvisers = [],
        schoolData = [], 
        fetchAllBasicEducationMealRequest,
        fetchAllHigherEducationMealRequest
    } = useData();

    // --- MAIN TABLE STATE ---
    const [activeTab, setActiveTab] = useState('All');
    const [orderType, setOrderType] = useState('Pending Meal Orders');
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedIds, setSelectedIds] = useState([]);
    const [showActionBar, setShowActionBar] = useState(false);

    // --- STUDENT LIST VIEW STATE ---
    const [viewingSection, setViewingSection] = useState(null); 
    const [selectedStudentIds, setSelectedStudentIds] = useState([]);

    // --- DATA NORMALIZATION ---
    const allRequests = useMemo(() => {
        const normalizeStatus = (status) => {
            if (!status) return 'Pending';
            return status.charAt(0).toUpperCase() + status.slice(1).toLowerCase();
        };
        const formatTime = (dateInput) => {
            if (!dateInput) return '--:--';
            return new Date(dateInput).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        };

        const basic = basicEducationMealRequest.map(item => ({
            id: item.eligibilityID,
            sectionProgram: item.section, 
            sender: item.requester,
            recipientCount: item.forEligible?.length || 0,
            waivedCount: item.forTemporarilyWaived?.length || 0,
            timeSent: formatTime(item.timeStamp),
            type: 'Regular',
            category: 'Basic Education',
            status: normalizeStatus(item.status),
            rawDate: item.timeStamp
        }));

        const higher = higherEducationMealRequest.map(item => ({
            id: item.eligibilityID,
            sectionProgram: `${item.program} ${item.year}`, 
            sender: item.requester,
            recipientCount: item.forEligible?.length || 0,
            waivedCount: item.forWaived?.length || 0,
            timeSent: formatTime(item.timeStamp),
            type: 'Regular',
            category: 'Higher Education',
            status: normalizeStatus(item.status),
            rawDate: item.timeStamp
        }));

        const events = eventMealRequest.map(item => ({
            id: item.eventID, 
            sectionProgram: item.eventName,
            sender: "Event Organizer",
            recipientCount: (item.forEligibleSection?.length || 0) + (item.forEligibleProgramsAndYear?.length || 0),
            waivedCount: item.forTemporarilyWaived?.length || 0,
            timeSent: item.eventSpan?.[0] ? new Date(item.eventSpan[0]).toLocaleDateString() : 'N/A', 
            type: 'Event',
            category: 'Event',
            status: normalizeStatus(item.status),
            rawDate: item.eventSpan?.[0] || new Date()
        }));

        return [...basic, ...higher, ...events].sort((a, b) => new Date(b.rawDate) - new Date(a.rawDate));
    }, [basicEducationMealRequest, higherEducationMealRequest, eventMealRequest]);

    // Animation Logic
    useEffect(() => {
        if (selectedIds.length > 0) {
            setShowActionBar(true);
        } else {
            const timer = setTimeout(() => setShowActionBar(false), 200);
            return () => clearTimeout(timer);
        }
    }, [selectedIds.length]);

    // --- FILTERING LOGIC ---
    const filteredData = useMemo(() => {
        if (orderType === 'Unsubmitted Sections') {
            const todayStr = new Date().toLocaleDateString();

            const submittedSections = new Set(
                basicEducationMealRequest
                    .filter(req => {
                        if (!req.timeStamp) return false;
                        const reqDate = new Date(req.timeStamp).toLocaleDateString();
                        return reqDate === todayStr; 
                    })
                    .map(req => req.section?.trim())
            );
            
            const unsubmitted = classAdvisers
                .filter(adviser => adviser.section && !submittedSections.has(adviser.section.trim()))
                .map((adviser, index) => {
                    const nameParts = [adviser.honorific, adviser.first_name, adviser.middle_name, adviser.last_name];
                    const fullName = nameParts.filter(Boolean).join(" ");

                    return {
                        id: `unsub-${adviser.userID || index}`, 
                        sectionRaw: adviser.section,
                        sectionProgram: adviser.section,
                        sender: fullName || "No Adviser Assigned",
                        recipientCount: "N/A",
                        waivedCount: "N/A",
                        timeSent: "Not Submitted",
                        type: 'Regular',
                        category: 'Basic Education',
                        status: 'Missing',
                        rawDate: new Date()
                    };
                });

            if (searchTerm) {
                const lowerTerm = searchTerm.toLowerCase();
                return unsubmitted.filter(r =>
                    r.sectionProgram.toLowerCase().includes(lowerTerm) ||
                    r.sender.toLowerCase().includes(lowerTerm)
                );
            }
            return unsubmitted;
        }

        let data = allRequests;
        if (orderType === 'Confirmed Meal Orders') {
            data = data.filter(r => r.status === 'Approved' || r.status === 'Rejected');
        } else if (orderType === 'Event Meal Request') {
            data = data.filter(r => r.status === 'Pending' && r.type === 'Event');
        } else {
            data = data.filter(r => r.status === 'Pending' && r.type === 'Regular');
        }

        if (activeTab === 'Basic Education') data = data.filter(r => r.category === 'Basic Education');
        else if (activeTab === 'Higher Education') data = data.filter(r => r.category === 'Higher Education');

        if (searchTerm) {
            const lowerTerm = searchTerm.toLowerCase();
            data = data.filter(r =>
                r.sectionProgram.toLowerCase().includes(lowerTerm) ||
                r.sender.toLowerCase().includes(lowerTerm)
            );
        }
        return data;
    }, [allRequests, orderType, searchTerm, activeTab, classAdvisers, basicEducationMealRequest]);

    // --- 🟢 STUDENT LIST DATA PREP ---
    const sectionStudents = useMemo(() => {
        if (!viewingSection || !schoolData) return [];
        
        const targetSectionName = viewingSection.sectionRaw;
        let foundStudents = [];

        for (const category of schoolData) {
            if (category.levels) {
                for (const level of category.levels) {
                    if (level.sections) {
                        const matchedSection = level.sections.find(
                            s => s.section === targetSectionName
                        );
                        
                        if (matchedSection && matchedSection.students) {
                            foundStudents = matchedSection.students;
                            break; 
                        }
                    }
                }
            }
            if (foundStudents.length > 0) break; 
        }

        // Map to table format
        return foundStudents.map(student => ({
            // 🟢 FIX 1: Ensure we have distinct IDs
            id: student.id || student._id, // This is the MongoDB ID (used for React Keys)
            name: student.name,
            studentId: student.studentId, // This is the School ID (used for Selection)
            status: 'Eligible' 
        }));

    }, [viewingSection, schoolData]);

    // Auto-select all students when entering the view
    useEffect(() => {
        if (viewingSection && sectionStudents.length > 0) {
            // This selects the SCHOOL IDs
            setSelectedStudentIds(sectionStudents.map(s => s.studentId));
        }
    }, [viewingSection, sectionStudents]);


    // --- HANDLERS ---
    const handleBulkApprove = async () => {
        const itemsToProcess = allRequests.filter(item => selectedIds.includes(item.id));
        let basicEdUpdated = false;
        
        await Promise.all(itemsToProcess.map(async (item) => {
            try {
                if (item.category === 'Basic Education') {
                    await approveMealEligibilityRequest(item.id);
                    basicEdUpdated = true;
                } 
            } catch (error) { console.error(error); }
        }));

        if (basicEdUpdated) fetchAllBasicEducationMealRequest();
        setSelectedIds([]);
    };

    const handleBulkReject = () => { setSelectedIds([]); };

    const handleAddToEligibility = () => {
        const sectionToView = filteredData.find(item => item.id === selectedIds[0]);
        if (sectionToView) {
            setViewingSection(sectionToView);
            setSelectedIds([]); 
        }
    };

    const handleSubmitEligibilityList = async () => {
        console.log("Submitting Eligibility for:", viewingSection.sectionProgram);
        console.log("Selected Students:", selectedStudentIds);
        try {
            await generateEligibilityList(viewingSection.sectionProgram, selectedStudentIds)
            // Refresh main data to remove section from unsubmitted list
            await fetchAllBasicEducationMealRequest();
        } catch (error) {
            throw new Error("Error submitting generate list", error)
        }
        setTimeout(() => {
            setViewingSection(null);
        }, 500)
    };

    // --- RENDERERS ---
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
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '2px 10px', borderRadius: '999px', fontSize: '12px', fontWeight: 500, backgroundColor: s.bg, color: s.text }}>
                <Icon size={12} /> {status}
            </span>
        );
    };

    const renderRow = (item, index, startIndex, selection) => {
        const cellStyle = { fontFamily: 'geist, sans-serif', fontSize: '12px', color: '#4b5563', borderBottom: '1px solid #f3f4f6', height: '43.5px', verticalAlign: 'middle' };
        const isSelected = selection?.isSelected || false;
        const isSelectable = orderType !== 'Confirmed Meal Orders';

        const handleRowClick = () => {
            if (!isSelectable) return;
            if (orderType === 'Unsubmitted Sections') {
                if (isSelected) {
                    setSelectedIds([]);
                } else {
                    setSelectedIds([item.id]); 
                }
            } else {
                selection?.toggleSelection();
            }
        };

        return (
            <tr key={item.id}
                onClick={handleRowClick}
                className={`transition-colors duration-200 ${isSelectable ? 'hover:bg-gray-50 cursor-pointer' : ''}`}
                style={{ backgroundColor: isSelected ? '#eff6ff' : 'transparent' }}
            >
                <td></td> 
                <td style={{ ...cellStyle, fontWeight: 500, color: '#111827', paddingLeft: '24px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        {item.type === 'Event' && <CalendarDays size={14} className="text-purple-500" />}
                        {item.sectionProgram}
                    </div>
                </td>
                <td style={{ ...cellStyle, color: item.status === 'Missing' ? '#4b5563' : '#4b5563' }}>{item.sender}</td>
                {orderType === "Unsubmitted Sections" ? "" : (
                    <>
                        <td style={cellStyle}>{item.recipientCount}</td>
                        <td style={cellStyle}>{item.waivedCount}</td>
                        <td style={cellStyle}>{item.timeSent}</td>
                    </>
                )}
                <td style={cellStyle}>{getStatusBadge(item.status)}</td>
            </tr>
        );
    };

    const renderStudentRow = (student, index, startIndex, selection) => {
        const cellStyle = { fontFamily: 'geist, sans-serif', fontSize: '12px', color: '#4b5563', borderBottom: '1px solid #f3f4f6', height: '43.5px', verticalAlign: 'middle' };
        const isSelected = selection?.isSelected || false;
        
        return (
            <tr key={student.id}
                onClick={() => selection?.toggleSelection()}
                className="hover:bg-gray-50 cursor-pointer transition-colors duration-200"
                style={{ backgroundColor: isSelected ? '#eff6ff' : 'transparent' }}
            >
                <td style={{ padding: '12px 24px', width: '48px', borderBottom: '1px solid #f3f4f6' }}>
                    <div className="flex items-center justify-center">
                        <input
                            type="checkbox"
                            checked={isSelected}
                            readOnly
                            style={{ width: '16px', height: '16px', borderRadius: '4px', cursor: 'pointer', accentColor: '#4268BD' }}
                        />
                    </div>
                </td>
                <td style={{ ...cellStyle, fontWeight: 500, color: '#111827' }}>
                    <div className="flex items-center gap-3">
                        <div className="w-6 h-6 rounded-full bg-gray-200 flex items-center justify-center text-gray-500">
                            <User size={12} />
                        </div>
                        {student.name}
                    </div>
                </td>
                <td style={cellStyle}>{student.studentId}</td>
                <td style={cellStyle}>
                    <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-blue-50 text-blue-700">
                        {student.status}
                    </span>
                </td>
            </tr>
        );
    };

    // VIEW 1: STUDENT LIST TABLE
    if (viewingSection) {
        return (
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                <GenericTable
                    title={`Students in ${viewingSection.sectionProgram}`}
                    subtitle="Select students eligible for meals today."
                    data={sectionStudents}
                    columns={['Student Name', 'Student ID', 'Meal Status']}
                    renderRow={renderStudentRow}
                    
                    selectable={true}
                    selectedIds={selectedStudentIds}
                    onSelectionChange={setSelectedStudentIds}
                    
                    // 🟢 FIX 2: Explicitly tell table to use 'studentId' for selection tracking
                    primaryKey="studentId" 

                    onPrimaryAction={handleSubmitEligibilityList}
                    primaryActionLabel="Submit List"
                    primaryActionIcon={<Check size={16} />}
                    
                    onSecondaryAction={() => setViewingSection(null)}
                    secondaryActionLabel="Go Back"
                    secondaryActionIcon={<ArrowLeft size={16} />}

                    metrics={[
                        { label: 'Total Students', value: sectionStudents.length },
                        { label: 'Selected', value: selectedStudentIds.length, color: '#4268BD' }
                    ]}
                />
            </motion.div>
        );
    }

    // VIEW 2: MAIN MEAL ORDERS TABLE
    const viewSwitcher = (
        <div style={{ backgroundColor: '#f3f4f6', padding: '4px', borderRadius: '8px', display: 'flex', gap: '4px', margin: "5px" }}>
            <SwitcherButton mode="Pending Meal Orders" currentMode={orderType} icon={<Clock size={14} />} label="Pending" onClick={() => { setOrderType('Pending Meal Orders'); setSelectedIds([]); }} />
            <SwitcherButton mode="Confirmed Meal Orders" currentMode={orderType} icon={<CheckCircle size={14} />} label="History" onClick={() => { setOrderType('Confirmed Meal Orders'); setSelectedIds([]); }} />
            <SwitcherButton mode="Event Meal Request" currentMode={orderType} icon={<Calendar size={14} />} label="Events" onClick={() => { setOrderType('Event Meal Request'); setSelectedIds([]); }} />
            <SwitcherButton mode="Unsubmitted Sections" currentMode={orderType} icon={<AlertCircle size={14} />} label="Unsubmitted" onClick={() => { setOrderType('Unsubmitted Sections'); setSelectedIds([]); }} />
        </div>
    );

    const columns = orderType === "Unsubmitted Sections" 
        ? ['Section/Program', 'Class Adviser', 'Status'] 
        : ['Section/Program', 'Class Adviser', 'Recipient Count', 'Waived', 'Time Sent', 'Status'];

    return (
        <AnimatePresence mode="wait">
            <GenericTable
                title={orderType === 'Unsubmitted Sections' ? 'Unsubmitted Sections' : 'Order History'}
                subtitle={orderType === 'Unsubmitted Sections' ? 'List of sections that have not submitted a request today' : 'Manage your daily meal distribution'}
                data={filteredData}
                columns={columns}
                renderRow={renderRow}

                tabs={orderType === 'Unsubmitted Sections' ? [] : [{ id: 'All', label: 'All' }, { id: 'Basic Education', label: 'Basic Education' }, { id: 'Higher Education', label: 'Higher Education' }]}
                activeTab={activeTab}
                onTabChange={(id) => { setActiveTab(id); setSelectedIds([]); }}

                customActions={viewSwitcher}
                
                overrideHeader={showActionBar ? (
                    <motion.div
                        initial={{ y: -10, opacity: 0 }}
                        animate={selectedIds.length > 0 ? { y: 0, opacity: 1 } : { y: 10, opacity: 0 }}
                        transition={{ duration: 0.2, ease: "easeInOut" }}
                        style={{ width: '100%' }}
                    >
                        {orderType === 'Unsubmitted Sections' ? (
                            <div style={{
                                width: '100%',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'space-between',
                                backgroundColor: '#eff6ff',
                                border: '1px solid #dbeafe',
                                padding: '8px',
                                borderRadius: '6px',
                                boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)'
                            }}>
                                <span style={{
                                    fontSize: '14px',
                                    fontWeight: 500,
                                    color: '#1d4ed8',
                                    paddingLeft: '8px',
                                    paddingRight: '8px'
                                }}>
                                    {selectedIds.length} Section Selected
                                </span>
                                <button 
                                    onClick={handleAddToEligibility}
                                    style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '8px',
                                        backgroundColor: '#2563eb',
                                        color: 'white',
                                        padding: '6px 16px',
                                        borderRadius: '6px',
                                        fontSize: '14px',
                                        fontWeight: 500,
                                        border: 'none',
                                        cursor: 'pointer'
                                    }}
                                >
                                    <Plus size={14} /> Add to Eligibility List
                                </button>
                            </div>
                        ) : (
                            <MealOrdersActionBar
                                selectedCount={selectedIds.length}
                                totalCount={filteredData.length}
                                onDeselectAll={() => setSelectedIds([])}
                                onSelectAll={() => setSelectedIds(filteredData.map(i => i.id))}
                                onApprove={handleBulkApprove}
                                onReject={handleBulkReject}
                            />
                        )}
                    </motion.div>
                ) : null}

                searchTerm={searchTerm}
                onSearchChange={setSearchTerm}
                selectedIds={selectedIds}
                onSelectionChange={setSelectedIds}
                primaryKey="id"

                metrics={[
                    { label: 'Total', value: filteredData.length },
                    orderType === 'Unsubmitted Sections'
                        ? { label: 'Missing', value: filteredData.length, color: '#DC2626' }
                        : { label: 'Approved', value: allRequests.filter(r => r.status === 'Approved').length, color: '#059669' }
                ]}
            />
        </AnimatePresence>
    );
};

export { MealOrdersTable };