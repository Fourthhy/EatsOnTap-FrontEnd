import React, { useState, useMemo, useEffect } from 'react';
import { Clock, Calendar, CheckCircle, Check, X, CalendarDays, AlertCircle } from 'lucide-react';
import { GenericTable } from '../../../../components/global/table/GenericTable';
import { AnimatePresence, motion } from 'framer-motion';

// 🟢 CONTEXT
import { useData } from '../../../../context/DataContext';

// 🟢 API IMPORTS
// Make sure these paths match your file structure
import { approveMealEligibilityRequest } from '../../../../functions/admin/approveMealEligibilityRequest';
// import { approveHigherEdMealEligibilityRequest } from '../../../../functions/admin/approveHigherEdMealEligibilityRequest'; // Uncomment when ready

import { SwitcherButton } from './components/SwitcherButton';
import { MealOrdersActionBar } from './components/MealOrderActionBar';

const MealOrdersTable = () => {
    // 🟢 Consume Real Data & Fetchers from Context
    const {
        basicEducationMealRequest = [],
        higherEducationMealRequest = [],
        eventMealRequest = [],
        classAdvisers = [],
        // Fetchers for refreshing data after actions
        fetchAllBasicEducationMealRequest,
        fetchAllHigherEducationMealRequest
    } = useData();

    const [activeTab, setActiveTab] = useState('All');
    const [orderType, setOrderType] = useState('Pending Meal Orders');
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedIds, setSelectedIds] = useState([]);

    // State for Action Bar Visibility
    const [showActionBar, setShowActionBar] = useState(false);

    const allRequests = useMemo(() => {
        const normalizeStatus = (status) => {
            if (!status) return 'Pending';
            return status.charAt(0).toUpperCase() + status.slice(1).toLowerCase();
        };

        const formatTime = (dateInput) => {
            if (!dateInput) return '--:--';
            return new Date(dateInput).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        };

        // 1. Transform Basic Ed
        const basic = basicEducationMealRequest.map(item => ({
            // 🟢 CRITICAL FIX: Use eligibilityID strictly as the primary key
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

        // 2. Transform Higher Ed (Assuming similar structure)
        const higher = higherEducationMealRequest.map(item => ({
            // 🟢 CRITICAL FIX: Use eligibilityID strictly
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

        // 3. Transform Events
        const events = eventMealRequest.map(item => {
            const sectionCount = item.forEligibleSection?.length || 0;
            const programCount = item.forEligibleProgramsAndYear?.length || 0;

            return {
                // 🟢 Keep eventID for events
                id: item.eventID,
                sectionProgram: item.eventName,
                sender: "Event Organizer",
                recipientCount: sectionCount + programCount,
                waivedCount: item.forTemporarilyWaived?.length || 0,
                timeSent: item.eventSpan && item.eventSpan.length > 0 ? new Date(item.eventSpan[0]).toLocaleDateString() : 'N/A',
                type: 'Event',
                category: 'Event',
                status: normalizeStatus(item.status),
                rawDate: item.eventSpan?.[0] || new Date()
            };
        });

        return [...basic, ...higher, ...events].sort((a, b) => new Date(b.rawDate) - new Date(a.rawDate));

    }, [basicEducationMealRequest, higherEducationMealRequest, eventMealRequest]);

    // Animation Delay Logic
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
            const submittedSections = new Set(basicEducationMealRequest.map(req => req.section?.trim()));

            const unsubmitted = classAdvisers
                .filter(adviser => adviser.section && !submittedSections.has(adviser.section.trim()))
                .map((adviser, index) => {
                    const nameParts = [adviser.honorific, adviser.first_name, adviser.middle_name, adviser.last_name];
                    const fullName = nameParts.filter(Boolean).join(" ");

                    return {
                        id: `unsub-${adviser.userID || index}`,
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

    const tabs = [
        { id: 'All', label: 'All' },
        { id: 'Basic Education', label: 'Basic Education' },
        { id: 'Higher Education', label: 'Higher Education' }
    ]

    // --- 🟢 ACTIONS ---

    const handleBulkApprove = async () => {

        // 1. Find the actual items in our data so we know their Category (Basic vs Higher)
        const itemsToProcess = allRequests.filter(item => selectedIds.includes(item.id));
        console.log("Processing Approval for:", itemsToProcess);

        let basicEdUpdated = false;
        let higherEdUpdated = false;

        // 2. Iterate and call the correct API
        await Promise.all(itemsToProcess.map(async (item) => {
            try {
                if (item.category === 'Basic Education') {
                    await approveMealEligibilityRequest(item.id);
                    basicEdUpdated = true;
                }
                else if (item.category === 'Higher Education') {
                    // await approveHigherEdMealEligibilityRequest(item.id); // Enable when function exists
                    console.log("Higher Ed Approval API not connected yet for:", item.id);
                    higherEdUpdated = true;
                }
            } catch (error) {
                console.error(`Failed to approve ${item.sectionProgram}:`, error);
                // Optional: Push to a 'failed' list to show a toast
            }
        }));

        // 3. Refresh Data Context
        if (basicEdUpdated) fetchAllBasicEducationMealRequest();
        if (higherEdUpdated) fetchAllHigherEducationMealRequest();

        // 4. Clear Selection
        setSelectedIds([]);
    };

    const handleBulkReject = () => {
        // Placeholder for Reject API
        console.log("Bulk Reject IDs:", selectedIds);
        setSelectedIds([]);
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
            <span style={{
                display: 'inline-flex', alignItems: 'center', gap: '6px',
                padding: '2px 10px', borderRadius: '999px',
                fontSize: '12px', fontWeight: 500,
                backgroundColor: s.bg, color: s.text
            }}>
                <Icon size={12} />
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
        const isSelectable = orderType !== 'Confirmed Meal Orders' && orderType !== 'Unsubmitted Sections';

        return (
            <tr key={item.id}
                onClick={() => isSelectable ? selection?.toggleSelection() : null}
                className={`transition-colors duration-200 ${isSelectable ? 'hover:bg-gray-50 cursor-pointer' : ''}`}
                style={{ backgroundColor: isSelected ? '#eff6ff' : 'transparent' }}
            >
                {/* Checkbox Column Removed as requested */}
                <td></td>

                <td style={{ ...cellStyle, fontWeight: 500, color: '#111827', paddingLeft: '24px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        {item.type === 'Event' && <CalendarDays size={14} className="text-purple-500" />}
                        {item.sectionProgram}
                    </div>
                </td>
                <td style={{ ...cellStyle, color: item.status === 'Missing' ? '#4b5563' : '#4b5563' }}>
                    {item.sender}
                </td>
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

    const viewSwitcher = (
        <div style={{ backgroundColor: '#f3f4f6', padding: '4px', borderRadius: '8px', display: 'flex', gap: '4px', margin: "5px" }}>
            <SwitcherButton mode="Pending Meal Orders" currentMode={orderType} icon={<Clock size={14} />} label="Pending Orders" onClick={() => { setOrderType('Pending Meal Orders'); setSelectedIds([]); }} />
            <SwitcherButton mode="Confirmed Meal Orders" currentMode={orderType} icon={<CheckCircle size={14} />} label="Confirmed Orders" onClick={() => { setOrderType('Confirmed Meal Orders'); setSelectedIds([]); }} />
            <SwitcherButton mode="Event Meal Request" currentMode={orderType} icon={<Calendar size={14} />} label="Events Meal Request" onClick={() => { setOrderType('Event Meal Request'); setSelectedIds([]); }} />
            <SwitcherButton mode="Unsubmitted Sections" currentMode={orderType} icon={<AlertCircle size={14} />} label="Unsubmitted Sections" onClick={() => { setOrderType('Unsubmitted Sections'); setSelectedIds([]); }} />
        </div>
    );

    const getTableTitle = () => {
        if (orderType === 'Pending Meal Orders') return 'Pending Requests';
        if (orderType === 'Event Meal Request') return 'Event Requests';
        if (orderType === 'Unsubmitted Sections') return 'Unsubmitted Sections';
        return 'Order History';
    };

    const getTableSubtitle = () => {
        if (orderType === 'Unsubmitted Sections') return 'List of sections that have not submitted a request today';
        if (orderType === 'Event Meal Request') return 'Manage special event meal distributions';
        return 'Manage your daily meal distribution';
    }

    const columns = orderType === "Unsubmitted Sections"
        ? ['Section/Program', 'Class Adviser', 'Status']
        : ['Section/Program', 'Class Adviser', 'Recipient Count', 'Waived', 'Time Sent', 'Status']

    return (
        <AnimatePresence>
            <GenericTable
                title={getTableTitle()}
                subtitle={getTableSubtitle()}
                data={filteredData}
                columns={columns}
                renderRow={renderRow}

                tabs={orderType === 'Unsubmitted Sections' ? [] : tabs}
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
                        <MealOrdersActionBar
                            selectedCount={selectedIds.length}
                            totalCount={filteredData.length}
                            onDeselectAll={() => setSelectedIds([])}
                            onSelectAll={() => setSelectedIds(filteredData.map(i => i.id))}
                            onApprove={handleBulkApprove}
                            onReject={handleBulkReject}
                        />
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