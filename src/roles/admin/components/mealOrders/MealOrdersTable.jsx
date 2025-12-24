import React, { useState, useMemo, useEffect } from 'react';
import { Check, X, Trash2, Clock } from 'lucide-react';
import { GenericTable } from '../../../../components/global/table/GenericTable';

// --- MOCK DATA ---
const generateMockRequests = () => {
    const senders = ["Ms. Maria Santos", "Mr. Rudy Iba", "Ms. Sophie Sarcia", "Mr. Lorence Tagailog"];
    const sections = ["1-Luke", "1-John", "2-Peter", "3-Paul", "5-Jonas"];

    return Array.from({ length: 50 }).map((_, index) => ({
        id: index + 1,
        sectionProgram: sections[index % sections.length],
        sender: senders[index % senders.length],
        recipientCount: Math.floor(Math.random() * 40) + 30,
        waivedCount: Math.floor(Math.random() * 5),
        timeSent: "7:10 AM",
        status: index % 4 === 0 ? "Approved" : (index % 7 === 0 ? "Rejected" : "Pending"),
    }));
};

const MealOrdersTable = () => {
    // --- STATE ---
    const [activeTab, setActiveTab] = useState('All');
    const [orderType, setOrderType] = useState('Pending Orders');
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedIds, setSelectedIds] = useState([]);
    const [allRequests, setAllRequests] = useState([]);

    useEffect(() => {
        setAllRequests(generateMockRequests());
    }, []);

    // --- FILTERING ---
    const filteredData = useMemo(() => {
        let data = allRequests;
        if (orderType === 'Confirmed Orders') {
            data = data.filter(r => r.status === 'Approved' || r.status === 'Rejected');
        } else {
            data = data.filter(r => r.status === 'Pending');
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
        // Selects every ID currently visible in the filtered list
        const allIds = filteredData.map(item => item.id);
        setSelectedIds(allIds);
    };

    const handleDeselectAll = () => {
        setSelectedIds([]);
    }

    // --- PROPS PREPARATION ---

    const tabs = [
        { id: 'All', label: 'All' },
        { id: 'Preschool', label: 'Preschool' },
        { id: 'Primary', label: 'Primary' },
        { id: 'High School', label: 'High School' },
        { id: 'College', label: 'College' }
    ];

    // --- FIXED: VIEW SWITCHER (Pure Inline Styles) ---
    const viewSwitcher = (
        <div style={{
            backgroundColor: '#f3f4f6',
            padding: '4px',
            borderRadius: '8px',
            display: 'flex',
            gap: '4px'
        }}>
            {['Pending Orders', 'Confirmed Orders'].map(type => {
                const isActive = orderType === type;
                return (
                    <button
                        key={type}
                        onClick={() => { setOrderType(type); setSelectedIds([]); }}
                        style={{
                            padding: '6px 12px',
                            borderRadius: '6px',
                            fontSize: '12px',
                            fontWeight: 500,
                            border: 'none',
                            cursor: 'pointer',
                            // Active vs Inactive Logic
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

    // --- HEADER OVERRIDE (Action Bar) ---
    const actionBar = selectedIds.length > 0 ? (
        <div className="animate-in fade-in slide-in-from-top-2 duration-200"
            style={{
                height: '100%',
                width: '100%',
                backgroundColor: '#4268BD',
                color: 'white',
                padding: '0 24px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center'
            }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                    {/* Close / Deselect Button */}
                    <button onClick={handleDeselectAll} style={{ padding: '8px', borderRadius: '50%', background: 'transparent', border: 'none', cursor: 'pointer', color: 'white', display: 'flex', alignItems: 'center', zIndex: 1000 }}>
                        <X size={20} />
                    </button>

                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
                        <span style={{ fontWeight: 500, fontSize: 14 }}>{selectedIds.length} Selected</span>

                        {/* THE NEW SELECT ALL TRIGGER */}
                        {selectedIds.length < filteredData.length ? (
                            <button
                                onClick={handleSelectAllGlobal}
                                className="hover:text-blue-200 transition-colors"
                                style={{
                                    color: '#dbeafe',
                                    fontSize: '12px',
                                    background: 'none',
                                    border: 'none',
                                    padding: 0,
                                    cursor: 'pointer',
                                    textDecoration: 'underline',
                                    textAlign: 'left'
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
                    <button onClick={handleBulkApprove} style={{ backgroundColor: 'white', color: '#4268BD', padding: '8px 16px', borderRadius: '8px', fontSize: '14px', fontWeight: 600, border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', boxShadow: '0 1px 2px 0 rgba(0,0,0,0.05)' }}>
                        <Check size={16} /> Approve
                    </button>
                    <button onClick={handleBulkReject} style={{ backgroundColor: '#FF8772', color: 'white', padding: '8px 16px', borderRadius: '8px', fontSize: '14px', fontWeight: 600, border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', boxShadow: '0 1px 2px 0 rgba(0,0,0,0.05)' }}>
                        <Trash2 size={16} /> Reject
                    </button>
                </div>
            </div>
        </div>
    ) : null;

    // --- RENDER ROW ---
    const renderRow = (item, index, startIndex, selection) => {
        const cellStyle = {
            fontFamily: 'geist, sans-serif',
            fontSize: '12px',
            color: '#4b5563',
            padding: '6px 0px',
            borderBottom: '1px solid #f3f4f6'
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

        // Safety check: ensure selection object exists
        const isSelected = selection?.isSelected || false;

        return (
            <tr key={item.id}
                className="hover:bg-gray-50 transition-colors"
                style={{ backgroundColor: isSelected ? '#eff6ff' : 'transparent' }}
            >
                {/* Checkbox Column */}
                <td style={{ padding: '12px 24px', width: '48px', borderBottom: '1px solid #f3f4f6' }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <input
                            type="checkbox"
                            checked={isSelected}
                            // FIXED: Added onClick stopPropagation to prevent row clicks (if any) from interfering
                            onClick={(e) => e.stopPropagation()}
                            onChange={() => selection?.toggleSelection()}
                            style={{
                                width: '16px', height: '16px',
                                borderRadius: '4px', cursor: 'pointer',
                                accentColor: '#4268BD', zIndex: 1000
                            }}
                        />
                    </div>
                </td>
                <td style={{ ...cellStyle, fontWeight: 500, color: '#111827' }}>{item.sectionProgram}</td>
                <td style={cellStyle}>{item.sender}</td>
                <td style={cellStyle}>{item.recipientCount}</td>
                <td style={cellStyle}>{item.waivedCount}</td>
                <td style={cellStyle}>{item.timeSent}</td>
                <td style={cellStyle}>{getStatusBadge(item.status)}</td>
            </tr>
        );
    };

    return (
        <GenericTable
            title={orderType === 'Pending Orders' ? 'Pending Requests' : 'Order History'}
            subtitle="Manage your daily meal distribution"
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
    );
};

export { MealOrdersTable };