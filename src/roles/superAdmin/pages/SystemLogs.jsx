import React, { useState, useMemo, useEffect } from 'react';
import {
    AlertCircle, CheckCircle, XCircle,
    LogIn, LogOut, Utensils, ShoppingBag,
    FileText, CheckSquare, AlertTriangle,
    Search, User
} from 'lucide-react';
import { GenericTable } from '../../../components/global/table/GenericTable';

// 🟢 REAL API IMPORT
import { getAllSystemLogs } from '../../../functions/superAdmin/getAllSystemLogs';
import { HeaderBar } from '../../../components/global/HeaderBar';

// --- CONFIGURATION ---
const ITEM_HEIGHT_ESTIMATE_PX = 60;

const cellStyle = {
    fontSize: '12px',
    color: '#4b5563',
    borderBottom: '1px solid #f3f4f6',
    height: '60px',
    verticalAlign: 'middle'
};

const SystemLogs = () => {
    // --- STATE ---
    const [logs, setLogs] = useState([]);
    const [activeTab, setActiveTab] = useState('All');
    const [searchTerm, setSearchTerm] = useState('');
    const [isLoading, setIsLoading] = useState(true);

    // --- FETCH DATA ---
    const fetchData = async () => {
        setIsLoading(true);
        try {
            const response = await getAllSystemLogs();

            // Handle both array (direct) or object { data: [] } response structures
            if (Array.isArray(response)) {
                setLogs(response);
            } else if (response && Array.isArray(response.data)) {
                setLogs(response.data);
            } else {
                console.warn("Unexpected API response structure:", response);
                setLogs([]);
            }
        } catch (error) {
            console.error("Failed to load system logs:", error);
            setLogs([]);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    // --- TABS CONFIGURATION ---
    const tabs = useMemo(() => [
        { id: 'All', label: 'All Activity' },
        { id: 'Auth', label: 'Authentication' },
        { id: 'Transactions', label: 'Transactions' },
        { id: 'Workflow', label: 'Workflow' },
        { id: 'Errors', label: 'Errors & Warnings' }
    ], []);

    // --- FILTER LOGIC ---
    const filteredLogs = useMemo(() => {
        return logs.filter(log => {
            // 1. Category Filter
            let matchesTab = true;
            if (activeTab === 'Auth') matchesTab = ['LOGIN', 'LOGOUT'].includes(log.action);
            if (activeTab === 'Transactions') matchesTab = ['CLAIM_MEAL', 'CLAIM_ITEM'].includes(log.action);
            if (activeTab === 'Workflow') matchesTab = ['SUBMIT_LIST', 'ACCEPT_LIST'].includes(log.action);
            if (activeTab === 'Errors') matchesTab = log.status === 'FAILED' || log.status === 'WARNING' || log.action === 'ERROR';

            // 2. Search Filter (Search Actor Name, Action, or Reference IDs)
            const searchString = `${log.actor?.name || ''} ${log.action || ''} ${log.metadata?.referenceID || ''} ${log.actor?.role || ''}`.toLowerCase();
            const matchesSearch = searchString.includes(searchTerm.toLowerCase());

            return matchesTab && matchesSearch;
        });
    }, [logs, activeTab, searchTerm]);

    // --- ROW RENDERER ---
    const renderRow = (log, index, startIndex) => {
        return (
            <tr
                key={log._id || index}
                className="hover:bg-gray-50/80 transition-colors"
                style={{ height: ITEM_HEIGHT_ESTIMATE_PX }}
            >
                {/* Index */}
                <td style={{ ...cellStyle, textAlign: 'center', width: '64px' }}>
                    {startIndex + index + 1}
                </td>

                {/* Timestamp */}
                <td style={{ ...cellStyle, paddingRight: '24px', width: '180px' }}>
                    <div className="flex flex-col">
                        <span className="font-medium text-gray-900">
                            {new Date(log.createdAt).toLocaleDateString()}
                        </span>
                        <span className="text-[11px] text-gray-500 font-mono">
                            {new Date(log.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                    </div>
                </td>

                {/* Actor */}
                <td style={{ ...cellStyle, paddingRight: '24px' }}>
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-500 border border-gray-200">
                            <User size={14} />
                        </div>
                        <div>
                            <div className="font-semibold text-gray-900 text-[13px]">{log.actor?.name || 'Unknown'}</div>
                            <div className="flex items-center gap-1">
                                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wide">{log.actor?.role || 'N/A'}</span>
                            </div>
                        </div>
                    </div>
                </td>

                {/* Action */}
                <td style={{ ...cellStyle, paddingRight: '24px' }}>
                    <ActionBadge action={log.action} />
                </td>

                {/* Details (Metadata) */}
                <td style={{ ...cellStyle, paddingRight: '24px' }}>
                    <MetadataCell log={log} />
                </td>

                {/* Status */}
                <td style={{ ...cellStyle, paddingRight: '24px' }}>
                    <StatusBadge status={log.status} />
                </td>
            </tr>
        );
    };

    const columns = ['Timestamp', 'Actor', 'Action', 'Details', 'Status'];

    const metrics = [
        { label: 'Total Events', value: logs.length },
        { label: 'Errors', value: logs.filter(l => l.status === 'FAILED').length, color: '#EF4444' }
    ];

    return (
        <div style={{ width: '100%', height: '100%', display: "flex", flexDirection: "column", alignItems: "center" }}>
            <div className="w-[100%]">
                <HeaderBar headerTitle={"System Logs"} />
            </div>
            <div className="w-[98%] flex justify-center">
                <GenericTable
                    title="System Audit Logs"
                    subtitle="Track system activities, transactions, and security events"
                    data={filteredLogs}
                    columns={columns}
                    renderRow={renderRow}
                    metrics={metrics}
                    primaryKey="_id"
                    isLoading={isLoading}
                    emptyMessage="No logs found"
                    emptyMessageIcon={<Search size={30} strokeWidth={1.5} />}
                    tabs={tabs}
                    activeTab={activeTab}
                    onTabChange={setActiveTab}
                    searchTerm={searchTerm}
                    onSearchChange={setSearchTerm}
                    selectable={false}
                    minItems={5}
                    maxItems={10}
                />
            </div>
        </div>
    );
};

// --- SUB-COMPONENTS ---

// 1. Action Badge
const ActionBadge = ({ action }) => {
    const config = {
        'LOGIN': { icon: LogIn, color: '#2563EB', bg: '#EFF6FF', label: 'Login' },
        'LOGOUT': { icon: LogOut, color: '#6B7280', bg: '#F3F4F6', label: 'Logout' },
        'CLAIM_MEAL': { icon: Utensils, color: '#7C3AED', bg: '#F5F3FF', label: 'Meal Claim' },
        'CLAIM_ITEM': { icon: ShoppingBag, color: '#D97706', bg: '#FFFBEB', label: 'Item Purchase' },
        'SUBMIT_LIST': { icon: FileText, color: '#059669', bg: '#ECFDF5', label: 'List Submitted' },
        'ACCEPT_LIST': { icon: CheckSquare, color: '#0891B2', bg: '#ECFEFF', label: 'List Accepted' },
        'ERROR': { icon: AlertTriangle, color: '#DC2626', bg: '#FEF2F2', label: 'System Error' }
    };

    const style = config[action] || { icon: AlertCircle, color: '#4B5563', bg: '#F3F4F6', label: action };
    const Icon = style.icon;

    return (
        <div
            style={{
                display: 'inline-flex', alignItems: 'center', gap: '6px',
                padding: '4px 8px', borderRadius: '6px',
                backgroundColor: style.bg, color: style.color,
                fontSize: '11px', fontWeight: 600, border: `1px solid ${style.bg}`
            }}
        >
            <Icon size={12} />
            {style.label}
        </div>
    );
};

// 2. Status Badge
const StatusBadge = ({ status }) => {
    const isSuccess = status === 'SUCCESS';
    const isWarning = status === 'WARNING';

    let color = '#16A34A'; // Green
    let bg = '#F0FDF4';
    let Icon = CheckCircle;

    if (!isSuccess && status !== 'WARNING') {
        color = '#DC2626'; // Red
        bg = '#FEF2F2';
        Icon = XCircle;
    }
    if (isWarning) {
        color = '#D97706'; // Orange
        bg = '#FFFBEB';
        Icon = AlertTriangle;
    }

    return (
        <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            <Icon size={14} color={color} />
            <span style={{ fontSize: '11px', fontWeight: 600, color: color }}>
                {status}
            </span>
        </div>
    );
};

// 3. Metadata Parser
const MetadataCell = ({ log }) => {
    const { action, metadata } = log;

    if (!metadata) return <span className="text-gray-300">-</span>;

    // LOGIN / LOGOUT
    if (action === 'LOGIN' || action === 'LOGOUT') {
        return (
            <div className="flex flex-col">
                <span className="text-xs text-gray-700 font-medium">{metadata.ipAddress || 'Unknown IP'}</span>
                <span className="text-[10px] text-gray-400 truncate max-w-[150px]">{metadata.device || 'Unknown Device'}</span>
            </div>
        );
    }

    // CLAIMS
    if (action === 'CLAIM_MEAL') {
        return (
            <div className="flex flex-col">
                <span className="text-xs text-gray-700 font-medium">{metadata.mealType} Allowance</span>
                <span className="text-[10px] text-gray-400">{metadata.description}</span>
            </div>
        );
    }

    if (action === 'CLAIM_ITEM') {
        return (
            <div className="flex flex-col">
                <span className="text-xs text-gray-700 font-medium">
                    {metadata.items?.join(', ') || 'Unknown Items'}
                </span>
                <span className="text-[10px] text-gray-400">{metadata.description}</span>
            </div>
        );
    }

    // LISTS
    if (action === 'SUBMIT_LIST' || action === 'ACCEPT_LIST') {
        return (
            <div className="flex flex-col">
                <span className="text-xs text-gray-700 font-medium font-mono bg-gray-50 w-fit px-1 rounded">
                    {metadata.referenceID}
                </span>
                {metadata.affectedCount && (
                    <span className="text-[10px] text-gray-500">
                        {metadata.affectedCount} students affected
                    </span>
                )}
            </div>
        );
    }

    // Default Fallback
    return <span className="text-xs text-gray-500">{metadata.description || '-'}</span>;
};

export default SystemLogs