import React, { useState, useMemo, useEffect } from 'react';
import { Check, X, Trash2, Clock, CalendarDays, Calendar, CheckCircle } from 'lucide-react';
import { GenericTable } from '../../../../components/global/table/GenericTable';
import { motion, AnimatePresence } from 'framer-motion';

// --- MOCK DATA ---
const generateMockRequests = () => {
    const senders = ["Ms. Maria Santos", "Mr. Rudy Iba", "Ms. Sophie Sarcia", "Mr. Lorence Tagailog", "Event Organizer A", "Event Organizer B"];

    const basicEdSections = ["Kinder-Love", "Grade 1-Faith", "Grade 4-Hope", "Grade 7-Rizal", "Grade 10-Bonifacio", "Grade 11-STEM", "Grade 12-ABM"];
    const higherEdSections = ["BSIT 1-A", "BSCS 2-B", "AB Broadcasting 3-A", "BSSW 4-C", "Associate CT 1-A"];
    const eventSections = ["Sports Fest", "Seminary Night", "Teachers Conference", "Foundation Day"];

    return Array.from({ length: 50 }).map((_, index) => {
        const isEvent = Math.random() > 0.8; 

        let section = "";
        let category = "";

        if (isEvent) {
            section = eventSections[Math.floor(Math.random() * eventSections.length)];
            category = "Event";
        } else {
            const isBasic = Math.random() > 0.4;
            if (isBasic) {
                section = basicEdSections[Math.floor(Math.random() * basicEdSections.length)];
                category = "Basic Education";
            } else {
                section = higherEdSections[Math.floor(Math.random() * higherEdSections.length)];
                category = "Higher Education";
            }
        }

        return {
            id: index + 1,
            sectionProgram: section,
            sender: senders[index % senders.length],
            recipientCount: Math.floor(Math.random() * 40) + 30,
            waivedCount: Math.floor(Math.random() * 5),
            timeSent: "7:10 AM",
            type: isEvent ? 'Event' : 'Regular',
            category: category, 
            status: index % 4 === 0 ? "Approved" : (index % 7 === 0 ? "Rejected" : "Pending"),
        };
    });
};

// --- SUB-COMPONENT: Hover Expanding Button ---
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
                display: 'flex', 
                alignItems: 'center', 
                gap: '6px',
                height: '32px', // Fixed height for consistency
                outline: 'none'
            }}
        >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                {icon}
            </div>
            
            <motion.span
                initial={false}
                animate={{ 
                    width: shouldExpand ? 'auto' : 0,
                    opacity: shouldExpand ? 1 : 0
                }}
                transition={{ type: "spring", stiffness: 500, damping: 30 }}
                style={{ 
                    overflow: 'hidden', 
                    whiteSpace: 'nowrap',
                    display: 'inline-block'
                }}
            >
                {label}
            </motion.span>
        </button>
    );
};

const MealOrdersTable = () => {
    const [activeTab, setActiveTab] = useState('All');
    const [orderType, setOrderType] = useState('Pending Meal Orders');
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedIds, setSelectedIds] = useState([]);
    const [allRequests, setAllRequests] = useState([]);
    const [showActionBar, setShowActionBar] = useState(false);

    useEffect(() => {
        setAllRequests(generateMockRequests());
    }, []);

    useEffect(() => {
        if (selectedIds.length > 0) {
            setShowActionBar(true);
        } else {
            const timer = setTimeout(() => setShowActionBar(false), 300);
            return () => clearTimeout(timer);
        }
    }, [selectedIds.length]);

    // --- FILTERING ---
    const filteredData = useMemo(() => {
        let data = allRequests;

        // 1. Filter by Order Type (View)
        if (orderType === 'Confirmed Meal Orders') {
            data = data.filter(r => r.status === 'Approved' || r.status === 'Rejected');
        } else if (orderType === 'Event Meal Request') {
            data = data.filter(r => r.status === 'Pending' && r.type === 'Event');
        } else {
            data = data.filter(r => r.status === 'Pending' && r.type === 'Regular');
        }

        // 2. Filter by Tabs (Basic vs Higher Ed)
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
        { id: 'Basic Education', label: 'Basic Education' },
        { id: 'Higher Education', label: 'Higher Education' }
    ];

    // --- NEW DYNAMIC VIEW SWITCHER ---
    const viewSwitcher = (
        <div style={{ backgroundColor: '#f3f4f6', padding: '4px', borderRadius: '8px', display: 'flex', gap: '4px' }}>
            <SwitcherButton 
                mode="Pending Meal Orders" 
                currentMode={orderType} 
                icon={<Clock size={14} />} 
                label="Pending Orders" 
                onClick={() => { setOrderType('Pending Meal Orders'); setSelectedIds([]); }} 
            />
            <SwitcherButton 
                mode="Confirmed Meal Orders" 
                currentMode={orderType} 
                icon={<CheckCircle size={14} />} 
                label="Confirmed Orders" 
                onClick={() => { setOrderType('Confirmed Meal Orders'); setSelectedIds([]); }} 
            />
            <SwitcherButton 
                mode="Event Meal Request" 
                currentMode={orderType} 
                icon={<Calendar size={14} />} 
                label="Event Requests" 
                onClick={() => { setOrderType('Event Meal Request'); setSelectedIds([]); }} 
            />
        </div>
    );

    const actionBar = showActionBar ? (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
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

    const renderRow = (item, index, startIndex, selection) => {
        const cellStyle = {
            fontFamily: 'geist, sans-serif', fontSize: '12px', color: '#4b5563',
            borderBottom: '1px solid #f3f4f6', height: '43.5px', verticalAlign: 'middle'
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
                        ): <div style={{width: '16px', height: '16px'}} />}
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