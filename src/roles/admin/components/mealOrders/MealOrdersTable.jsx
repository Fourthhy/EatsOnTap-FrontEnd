import React, { useState, useMemo, useEffect } from 'react';
import { Check, X, Trash2, Clock, CalendarDays } from 'lucide-react'; 
import { GenericTable } from '../../../../components/global/table/GenericTable';
import { motion, AnimatePresence } from 'framer-motion';

// --- MOCK DATA ---
const generateMockRequests = () => {
    const senders = ["Ms. Maria Santos", "Mr. Rudy Iba", "Ms. Sophie Sarcia", "Mr. Lorence Tagailog", "Event Organizer A", "Event Organizer B"];
    const sections = ["1-Luke", "1-John", "2-Peter", "3-Paul", "5-Jonas", "Sports Fest", "Seminary Night"];

    return Array.from({ length: 50 }).map((_, index) => {
        const isEvent = Math.random() > 0.7;
        return {
            id: index + 1,
            sectionProgram: isEvent ? sections[Math.floor(Math.random() * 2) + 5] : sections[index % 5],
            sender: senders[index % senders.length],
            recipientCount: Math.floor(Math.random() * 40) + 30,
            waivedCount: Math.floor(Math.random() * 5),
            timeSent: "7:10 AM",
            type: isEvent ? 'Event' : 'Regular',
            status: index % 4 === 0 ? "Approved" : (index % 7 === 0 ? "Rejected" : "Pending"),
        };
    });
};

const MealOrdersTable = () => {
    const [activeTab, setActiveTab] = useState('All');
    const [orderType, setOrderType] = useState('Pending Meal Orders');
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedIds, setSelectedIds] = useState([]);
    const [allRequests, setAllRequests] = useState([]);
    
    // --- NEW: State to delay the unmounting of the Action Bar ---
    const [showActionBar, setShowActionBar] = useState(false);

    useEffect(() => {
        setAllRequests(generateMockRequests());
    }, []);

    // --- NEW: Handle Action Bar Visibility with Delay ---
    useEffect(() => {
        if (selectedIds.length > 0) {
            setShowActionBar(true);
        } else {
            // Wait for exit animation (300ms) before removing the element entirely
            // This ensures the Default Header comes back only after the blue bar leaves
            const timer = setTimeout(() => setShowActionBar(false), 300);
            return () => clearTimeout(timer);
        }
    }, [selectedIds.length]);


    // --- FILTERING ---
    const filteredData = useMemo(() => {
        let data = allRequests;

        if (orderType === 'Confirmed Meal Orders') {
            data = data.filter(r => r.status === 'Approved' || r.status === 'Rejected');
        } else if (orderType === 'Event Meal Request') {
            data = data.filter(r => r.status === 'Pending' && r.type === 'Event');
        } else {
            data = data.filter(r => r.status === 'Pending' && r.type === 'Regular');
        }

        if (activeTab !== 'All') {
             // Add logic here if needed
        }

        if (searchTerm) {
            const lowerTerm = searchTerm.toLowerCase();
            data = data.filter(r =>
                r.sectionProgram.toLowerCase().includes(lowerTerm) ||
                r.sender.toLowerCase().includes(lowerTerm)
            );
        }
        return data;
    }, [allRequests, orderType, searchTerm, activeTab]);

    // --- ACTIONS ---
    const handleBulkApprove = () => {
        setAllRequests(prev => prev.map(item =>
            selectedIds.includes(item.id) ? { ...item, status: 'Approved' } : item
        ));
        setSelectedIds([]);
    };

    const handleBulkReject = () => {
        setAllRequests(prev => prev.map(item =>
            selectedIds.includes(item.id) ? { ...item, status: 'Rejected' } : item
        ));
        setSelectedIds([]);
    };

    const handleSelectAllGlobal = () => {
        const allIds = filteredData.map(item => item.id);
        setSelectedIds(allIds);
    };

    const handleDeselectAll = () => {
        setSelectedIds([]);
    }

    const tabs = [
        { id: 'All', label: 'All' },
        { id: 'Preschool', label: 'Preschool' },
        { id: 'Primary', label: 'Primary' },
        { id: 'High School', label: 'High School' },
        { id: 'College', label: 'College' }
    ];

    const viewSwitcher = (
        <div style={{ backgroundColor: '#f3f4f6', padding: '4px', borderRadius: '8px', display: 'flex', gap: '4px' }}>
            {['Pending Meal Orders', 'Confirmed Meal Orders', 'Event Meal Request'].map(type => {
                const isActive = orderType === type;
                return (
                    <button
                        key={type}
                        onClick={() => { setOrderType(type); setSelectedIds([]); }}
                        style={{
                            padding: '6px 12px', borderRadius: '6px', fontSize: '12px', fontWeight: 500,
                            border: 'none', cursor: 'pointer',
                            backgroundColor: isActive ? 'white' : 'transparent',
                            color: isActive ? '#4268BD' : '#6b7280',
                            boxShadow: isActive ? '0 1px 2px 0 rgba(0, 0, 0, 0.05)' : 'none',
                            transition: 'all 200ms ease'
                        }}
                    >
                        {type}
                    </button>
                );
            })}
        </div>
    );

    // --- ACTION BAR (Using showActionBar state) ---
    // We render this if showActionBar is true.
    // Inside, we toggle `animate` props based on `selectedIds.length` to trigger the slide up/down.
    const actionBar = showActionBar ? (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            // If we have selections, stay visible (y:0). If 0, animate out (y:20).
            animate={selectedIds.length > 0 ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
            style={{
                height: '100%', width: '100%', backgroundColor: '#4268BD', color: 'white',
                padding: '0 24px', display: 'flex', flexDirection: 'column', justifyContent: 'center'
            }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                    <button onClick={handleDeselectAll} style={{ padding: '8px', borderRadius: '50%', background: 'transparent', border: 'none', cursor: 'pointer', color: 'white', display: 'flex', alignItems: 'center', zIndex: 1000 }}>
                        <X size={20} />
                    </button>

                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
                        <span style={{ fontWeight: 500, fontSize: 14 }}>{selectedIds.length} Selected</span>
                        {selectedIds.length < filteredData.length ? (
                            <button
                                onClick={handleSelectAllGlobal}
                                className="hover:text-blue-200 transition-colors"
                                style={{
                                    color: '#dbeafe', fontSize: '12px', background: 'none', border: 'none',
                                    padding: 0, cursor: 'pointer', textDecoration: 'underline', textAlign: 'left'
                                }}
                            >
                                Select all {filteredData.length} items
                            </button>
                        ) : (
                            <span style={{ color: '#dbeafe', fontSize: '12px' }}>All items selected</span>
                        )}
                    </div>
                </div>

                <div style={{ display: 'flex', gap: '12px' }}>
                    <button onClick={handleBulkApprove} style={{ backgroundColor: '#10B981', color: '#white', padding: '8px 16px', borderRadius: '8px', fontSize: '14px', fontWeight: 600, border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', boxShadow: '0 1px 2px 0 rgba(0,0,0,0.05)' }}>
                        <Check size={16} /> Approve
                    </button>
                    <button onClick={handleBulkReject} style={{ backgroundColor: 'white', color: '#EF4444', padding: '8px 16px', borderRadius: '8px', fontSize: '14px', fontWeight: 600, border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', boxShadow: '0 1px 2px 0 rgba(0,0,0,0.05)' }}>
                        <Trash2 size={16} /> Reject
                    </button>
                </div>
            </div>
        </motion.div>
    ) : null;

    // --- RENDER ROW ---
    const renderRow = (item, index, startIndex, selection) => {
        const cellStyle = {
            fontFamily: 'geist, sans-serif', fontSize: '12px', color: '#4b5563',
            padding: '6px 0px', borderBottom: '1px solid #f3f4f6'
        };

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

        const isSelected = selection?.isSelected || false;
        const showCheckbox = orderType !== 'Confirmed Meal Orders';

        return (
            <tr key={item.id}
                className="hover:bg-gray-50 transition-colors"
                style={{ backgroundColor: isSelected ? '#eff6ff' : 'transparent' }}
            >
                <td style={{ padding: '12px 24px', width: '48px', borderBottom: '1px solid #f3f4f6' }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <input
                            type={showCheckbox ? 'checkbox' : 'hidden'}
                            checked={isSelected}
                            onClick={(e) => e.stopPropagation()}
                            onChange={() => selection?.toggleSelection()}
                            style={{
                                width: '16px', height: '16px', borderRadius: '4px', cursor: 'pointer',
                                accentColor: '#4268BD', zIndex: 1000
                            }}
                        />
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

    const getTableTitle = () => {
        if (orderType === 'Pending Meal Orders') return 'Pending Requests';
        if (orderType === 'Event Meal Request') return 'Event Requests';
        return 'Order History';
    }

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
                overrideHeader={actionBar}

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