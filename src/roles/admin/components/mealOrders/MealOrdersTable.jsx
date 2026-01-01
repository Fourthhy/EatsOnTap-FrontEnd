import React, { useState, useMemo, useEffect } from 'react';
import { Clock, Calendar, CheckCircle, Check, X, CalendarDays } from 'lucide-react';
import { GenericTable } from '../../../../components/global/table/GenericTable';
import { AnimatePresence } from 'framer-motion';

// 🟢 CONTEXT
import { useData } from '../../../../context/DataContext';

import { SwitcherButton } from './components/SwitcherButton';
import { MealOrdersActionBar } from './components/MealOrderActionBar';

const MealOrdersTable = () => {
    // 🟢 Consume Real Data from Context
    const { 
        basicEducationMealRequest = [], 
        higherEducationMealRequest = [], 
        eventMealRequest = [] 
    } = useData();

    const [activeTab, setActiveTab] = useState('All');
    const [orderType, setOrderType] = useState('Pending Meal Orders');
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedIds, setSelectedIds] = useState([]);
    const [showActionBar, setShowActionBar] = useState(false);

    // --- 🟢 DATA NORMALIZATION ---
    const allRequests = useMemo(() => {
        // Helper: Convert "PENDING" -> "Pending"
        const normalizeStatus = (status) => {
            if (!status) return 'Pending';
            return status.charAt(0).toUpperCase() + status.slice(1).toLowerCase();
        };

        const formatTime = (dateInput) => {
            if (!dateInput) return '--:--';
            return new Date(dateInput).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        };

        // 1. Transform Basic Ed (Matches eligibilityBasicEdSchema)
        const basic = basicEducationMealRequest.map(item => ({
            id: item._id || item.eligibilityID,
            sectionProgram: item.section, 
            sender: item.requester,
            recipientCount: item.forEligible?.length || 0,
            waivedCount: item.forTemporarilyWaived?.length || 0, // ✅ Correct field
            timeSent: formatTime(item.timeStamp),
            type: 'Regular',
            category: 'Basic Education',
            status: normalizeStatus(item.status),
            rawDate: item.timeStamp
        }));

        // 2. Transform Higher Ed (Matches eligibilityHigherEdSchema)
        const higher = higherEducationMealRequest.map(item => ({
            id: item._id || item.eligibilityID,
            sectionProgram: `${item.program} ${item.year}`, 
            sender: item.requester,
            recipientCount: item.forEligible?.length || 0,
            waivedCount: item.forWaived?.length || 0, // ✅ Correct field (different from Basic)
            timeSent: formatTime(item.timeStamp),
            type: 'Regular',
            category: 'Higher Education',
            status: normalizeStatus(item.status),
            rawDate: item.timeStamp
        }));

        // 3. Transform Events (Matches Event Schema)
        const events = eventMealRequest.map(item => {
            // ✅ Calculate total recipients from both section list and program list
            const sectionCount = item.forEligibleSection?.length || 0;
            const programCount = item.forEligibleProgramsAndYear?.length || 0;

            return {
                id: item._id || item.eventID,
                sectionProgram: item.eventName,
                sender: "Event Organizer", // ✅ Schema has no 'requester', defaulting to static string
                recipientCount: sectionCount + programCount,
                waivedCount: item.forTemporarilyWaived?.length || 0,
                // ✅ Use first date of eventSpan
                timeSent: item.eventSpan && item.eventSpan.length > 0 ? new Date(item.eventSpan[0]).toLocaleDateString() : 'N/A', 
                type: 'Event',
                category: 'Event',
                status: normalizeStatus(item.status),
                rawDate: item.eventSpan?.[0] || new Date()
            };
        });

        // Combine and Sort by Newest First
        return [...basic, ...higher, ...events].sort((a, b) => new Date(b.rawDate) - new Date(a.rawDate));

    }, [basicEducationMealRequest, higherEducationMealRequest, eventMealRequest]);

    // Helper to delay action bar exit animation
    useEffect(() => {
        if (selectedIds.length > 0) {
            setShowActionBar(true);
        } else {
            const timer = setTimeout(() => setShowActionBar(false), 300);
            return () => clearTimeout(timer);
        }
    }, [selectedIds.length]);

    // --- FILTERING LOGIC ---
    const filteredData = useMemo(() => {
        let data = allRequests;

        // 1. Filter by Order Type
        if (orderType === 'Confirmed Meal Orders') {
            data = data.filter(r => r.status === 'Approved' || r.status === 'Rejected');
        } else if (orderType === 'Event Meal Request') {
            data = data.filter(r => r.status === 'Pending' && r.type === 'Event');
        } else {
            // Pending Meal Orders (Regular)
            data = data.filter(r => r.status === 'Pending' && r.type === 'Regular');
        }

        // 2. Filter by Tabs (Tabs only apply to Regular orders usually, but we can filter events too if needed)
        if (activeTab === 'Basic Education') {
            data = data.filter(r => r.category === 'Basic Education');
        } else if (activeTab === 'Higher Education') {
            data = data.filter(r => r.category === 'Higher Education');
        }

        // 3. Search
        if (searchTerm) {
            const lowerTerm = searchTerm.toLowerCase();
            data = data.filter(r =>
                r.sectionProgram.toLowerCase().includes(lowerTerm) ||
                r.sender.toLowerCase().includes(lowerTerm)
            );
        }
        return data;
    }, [allRequests, orderType, searchTerm, activeTab]);

    const tabs = [
        { id: 'All', label: 'All' },
        { id: 'Basic Education', label: 'Basic Education' },
        { id: 'Higher Education', label: 'Higher Education' }
    ]

    // --- HANDLERS ---
    const handleBulkApprove = () => {
        console.log("Bulk Approve IDs:", selectedIds);
        setSelectedIds([]);
    };

    const handleBulkReject = () => {
        console.log("Bulk Reject IDs:", selectedIds);
        setSelectedIds([]);
    };

    // --- RENDERERS ---
    const getStatusBadge = (status) => {
        const styles = {
            'Approved': { bg: '#ECFDF5', text: '#059669', icon: Check },
            'Rejected': { bg: '#FEF2F2', text: '#DC2626', icon: X },
            'Pending': { bg: '#EFF6FF', text: '#3B82F6', icon: Clock }
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
                {status === 'Pending' ? <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#3B82F6' }} /> : <Icon size={12} />}
                {status}
            </span>
        );
    };

    const renderRow = (item, index, startIndex, selection) => {
        const cellStyle = {
            fontFamily: 'geist, sans-serif', fontSize: '12px', color: '#4b5563',
            borderBottom: '1px solid #f3f4f6', height: '43.5px', verticalAlign: 'middle'
        };

        const isSelected = selection?.isSelected || false;
        const showCheckbox = orderType !== 'Confirmed Meal Orders';

        return (
            <tr key={item.id}
                className="hover:bg-gray-50 transition-colors duration-200"
                style={{ backgroundColor: isSelected ? '#eff6ff' : 'transparent' }}
            >
                <td style={{ padding: '12px 24px', width: '48px', borderBottom: '1px solid #f3f4f6' }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        {showCheckbox ? (
                            <input
                                type={'checkbox'}
                                checked={isSelected}
                                onClick={(e) => e.stopPropagation()}
                                onChange={() => selection?.toggleSelection()}
                                style={{
                                    width: '16px', height: '16px', borderRadius: '4px', cursor: 'pointer',
                                    accentColor: '#4268BD', zIndex: 1000
                                }}
                            />
                        ) : <div style={{ width: '16px', height: '16px' }} />}
                    </div>
                </td>
                <td style={{ ...cellStyle, fontWeight: 500, color: '#111827' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        {item.type === 'Event' && <CalendarDays size={14} className="text-purple-500" />}
                        {item.sectionProgram}
                    </div>
                </td>
                <td style={cellStyle}>{item.sender}</td>
                <td style={cellStyle}>{item.recipientCount}</td>
                <td style={cellStyle}>{item.waivedCount}</td>
                <td style={cellStyle}>{item.timeSent}</td>
                <td style={cellStyle}>{getStatusBadge(item.status)}</td>
            </tr>
        );
    };

    // --- UI ELEMENTS ---
    const viewSwitcher = (
        <div style={{ backgroundColor: '#f3f4f6', padding: '4px', borderRadius: '8px', display: 'flex', gap: '4px' }}>
            <SwitcherButton mode="Pending Meal Orders" currentMode={orderType} icon={<Clock size={14} />} label="Pending Orders" onClick={() => { setOrderType('Pending Meal Orders'); setSelectedIds([]); }} />
            <SwitcherButton mode="Confirmed Meal Orders" currentMode={orderType} icon={<CheckCircle size={14} />} label="Confirmed Orders" onClick={() => { setOrderType('Confirmed Meal Orders'); setSelectedIds([]); }} />
            <SwitcherButton mode="Event Meal Request" currentMode={orderType} icon={<Calendar size={14} />} label="Event Requests" onClick={() => { setOrderType('Event Meal Request'); setSelectedIds([]); }} />
        </div>
    );

    const getTableTitle = () => {
        if (orderType === 'Pending Meal Orders') return 'Pending Requests';
        if (orderType === 'Event Meal Request') return 'Event Requests';
        return 'Order History';
    };

    return (
        <AnimatePresence>
            <GenericTable
                title={getTableTitle()}
                subtitle={orderType === 'Event Meal Request' ? "Manage special event meal distributions" : "Manage your daily meal distribution"}
                data={filteredData}
                columns={['Section/Program', 'Sender', 'Recipient Count', 'Waived', 'Time Sent', 'Status']}
                renderRow={renderRow}

                tabs={tabs}
                activeTab={activeTab}
                onTabChange={(id) => { setActiveTab(id); setSelectedIds([]); }}

                customActions={viewSwitcher}
                
                overrideHeader={showActionBar ? (
                    <MealOrdersActionBar
                        selectedCount={selectedIds.length}
                        totalCount={filteredData.length}
                        onDeselectAll={() => setSelectedIds([])}
                        onSelectAll={() => setSelectedIds(filteredData.map(i => i.id))}
                        onApprove={handleBulkApprove}
                        onReject={handleBulkReject}
                    />
                ) : null}

                searchTerm={searchTerm}
                onSearchChange={setSearchTerm}

                selectedIds={selectedIds}
                onSelectionChange={setSelectedIds}
                primaryKey="id"

                metrics={[
                    { label: 'Total', value: filteredData.length },
                    { label: 'Approved', value: allRequests.filter(r => r.status === 'Approved').length, color: '#059669' },
                    { label: 'Rejected', value: allRequests.filter(r => r.status === 'Rejected').length, color: '#DC2626' }
                ]}
            />
        </AnimatePresence>
    );
};

export { MealOrdersTable };