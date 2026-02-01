import React, { useState, useMemo, useEffect } from 'react';
import { User, Mail, Shield, AlertCircle, CheckCircle, XCircle, X, Loader2, Save, RotateCcw, UserPlus } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { GenericTable } from '../../../components/global/table/GenericTable';

// 🟢 IMPORTS: API Functions
import { getAllUsers } from '../../../functions/superAdmin/getAllUsers';
import { getAllClassAdvisers } from '../../../functions/superAdmin/getAllClassAdvisers';

import { HeaderBar } from '../../../components/global/HeaderBar';
// 🟢 IMPORT ACTION BAR
import { SelectionActionBar } from '../components/SelectionActionBar'; // Adjust path if needed

import { CreateUserModal } from "../components/CreateUserModal"

// --- CONFIGURATION ---
const ITEM_HEIGHT_ESTIMATE_PX = 30;

const cellStyle = {
    fontSize: '12px',
    color: '#4b5563',
    borderBottom: '1px solid #f3f4f6',
    height: '45px',
    verticalAlign: 'middle'
};

// --- 🟢 MODAL: EDIT USER ---
const EditUserModal = ({ isOpen, onClose, user, onSave }) => {
    const [formData, setFormData] = useState({ first_name: '', middle_name: '', last_name: '', role: '' });
    const [isSaving, setIsSaving] = useState(false);

    useEffect(() => {
        if (user) {
            setFormData({
                first_name: user.first_name || '',
                middle_name: user.middle_name || '',
                last_name: user.last_name || '',
                role: user.role || ''
            });
        }
    }, [user]);

    const handleSave = async () => {
        setIsSaving(true);
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 800));
        onSave({ ...user, ...formData });
        setIsSaving(false);
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div style={{ position: 'fixed', inset: 0, zIndex: 9600, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <div style={{ position: 'absolute', inset: 0, backgroundColor: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(4px)' }} onClick={onClose} />
            <motion.div
                initial={{ scale: 0.95, opacity: 0, y: 10 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                style={{ backgroundColor: 'white', borderRadius: '12px', padding: '24px', width: '100%', maxWidth: '400px', zIndex: 10, boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1)' }}
            >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                    <h3 style={{ fontSize: '18px', fontWeight: 700, color: '#1F2937' }}>Edit User Details</h3>
                    <button onClick={onClose} style={{ color: '#9CA3AF', background: 'none', border: 'none', cursor: 'pointer' }}><X size={20} /></button>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    <div>
                        <label style={{ display: 'block', fontSize: '12px', fontWeight: 500, color: '#374151', marginBottom: '4px' }}>First Name</label>
                        <input
                            type="text"
                            value={formData.first_name}
                            onChange={e => setFormData({ ...formData, first_name: e.target.value })}
                            style={{ width: '100%', padding: '8px 12px', borderRadius: '6px', border: '1px solid #D1D5DB', fontSize: '14px' }}
                        />
                    </div>
                    <div>
                        <label style={{ display: 'block', fontSize: '12px', fontWeight: 500, color: '#374151', marginBottom: '4px' }}>Middle Name</label>
                        <input
                            type="text"
                            value={formData.middle_name}
                            onChange={e => setFormData({ ...formData, middle_name: e.target.value })}
                            style={{ width: '100%', padding: '8px 12px', borderRadius: '6px', border: '1px solid #D1D5DB', fontSize: '14px' }}
                        />
                    </div>
                    <div>
                        <label style={{ display: 'block', fontSize: '12px', fontWeight: 500, color: '#374151', marginBottom: '4px' }}>Last Name</label>
                        <input
                            type="text"
                            value={formData.last_name}
                            onChange={e => setFormData({ ...formData, last_name: e.target.value })}
                            style={{ width: '100%', padding: '8px 12px', borderRadius: '6px', border: '1px solid #D1D5DB', fontSize: '14px' }}
                        />
                    </div>
                </div>

                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '24px' }}>
                    <button onClick={onClose} style={{ padding: '8px 16px', borderRadius: '8px', border: 'none', background: 'transparent', color: '#4B5563', cursor: 'pointer', fontSize: '14px', fontWeight: 500 }}>Cancel</button>
                    <button onClick={handleSave} disabled={isSaving} style={{ padding: '8px 16px', borderRadius: '8px', border: 'none', background: '#2563EB', color: 'white', cursor: isSaving ? 'not-allowed' : 'pointer', fontSize: '14px', fontWeight: 500, display: 'flex', alignItems: 'center', gap: '8px' }}>
                        {isSaving ? <Loader2 size={14} className="animate-spin" /> : <Save size={14} />} Save Changes
                    </button>
                </div>
            </motion.div>
        </div>
    );
};

// --- 🟢 MODAL: RESET PASSWORD ---
const ResetPasswordModal = ({ isOpen, onClose, user, onConfirm }) => {
    const [isProcessing, setIsProcessing] = useState(false);

    const handleConfirm = async () => {
        setIsProcessing(true);
        await new Promise(resolve => setTimeout(resolve, 800)); // Simulate API
        onConfirm();
        setIsProcessing(false);
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div style={{ position: 'fixed', inset: 0, zIndex: 9600, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <div style={{ position: 'absolute', inset: 0, backgroundColor: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(4px)' }} onClick={onClose} />
            <motion.div
                initial={{ scale: 0.95, opacity: 0, y: 10 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                style={{ backgroundColor: 'white', borderRadius: '12px', padding: '24px', width: '100%', maxWidth: '380px', zIndex: 10, boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1)', textAlign: 'center' }}
            >
                <div style={{ width: '48px', height: '48px', backgroundColor: '#FEF3C7', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
                    <RotateCcw size={24} color="#D97706" />
                </div>
                <h3 style={{ fontSize: '18px', fontWeight: 700, color: '#1F2937', marginBottom: '8px' }}>Reset Password?</h3>
                <p style={{ fontSize: '14px', color: '#6B7280', marginBottom: '24px', lineHeight: '1.5' }}>
                    Are you sure you want to reset the password for <strong>{user?.first_name} {user?.last_name}</strong>? This action cannot be undone.
                </p>

                <div style={{ display: 'flex', justifyContent: 'center', gap: '12px' }}>
                    <button onClick={onClose} style={{ flex: 1, padding: '10px', borderRadius: '8px', border: '1px solid #E5E7EB', background: 'white', color: '#374151', cursor: 'pointer', fontSize: '14px', fontWeight: 600 }}>Cancel</button>
                    <button onClick={handleConfirm} disabled={isProcessing} style={{ flex: 1, padding: '10px', borderRadius: '8px', border: 'none', background: '#D97706', color: 'white', cursor: isProcessing ? 'not-allowed' : 'pointer', fontSize: '14px', fontWeight: 600, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                        {isProcessing && <Loader2 size={14} className="animate-spin" />} Confirm
                    </button>
                </div>
            </motion.div>
        </div>
    );
};

// --- MAIN COMPONENT ---
const UserManagement = () => {
    // --- STATE ---
    const [users, setUsers] = useState([]);
    const [activeTab, setActiveTab] = useState('All');
    const [searchTerm, setSearchTerm] = useState('');
    const [isLoading, setIsLoading] = useState(true);

    // 🟢 Selection & Modal State
    const [selectedUser, setSelectedUser] = useState(null);
    const [isActionBarVisible, setIsActionBarVisible] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isResetModalOpen, setIsResetModalOpen] = useState(false);

    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

    // --- FETCH DATA ---
    const fetchData = async () => {
        setIsLoading(true);
        try {
            const [usersResponse, advisersResponse] = await Promise.all([
                getAllUsers(),
                getAllClassAdvisers()
            ]);

            const normalize = (res) => {
                if (Array.isArray(res)) return res;
                if (res && Array.isArray(res.data)) return res.data;
                return [];
            };

            const combinedData = [...normalize(usersResponse), ...normalize(advisersResponse)];
            setUsers(combinedData);

        } catch (error) {
            console.error("Failed to load user data", error);
            setUsers([]);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    // --- TABS & FILTERS ---
    const tabs = useMemo(() => [
        { id: 'All', label: 'All Users' },
        { id: 'CLASS-ADVISER', label: 'Class Advisers' },
        { id: 'ADMIN-ASSISTANT', label: 'Admin Assistants' },
        { id: 'FOOD-SERVER', label: 'Food Servers' },
        { id: 'CANTEEN-STAFF', label: 'Canteen Staff' },
        { id: 'ADMIN', label: 'Admins' },
        { id: 'SUPER-ADMIN', label: 'Super Admins' },
        { id: 'CHANCELLOR', label: 'Chancellor' },
    ], []);

    const filteredUsers = useMemo(() => {
        return users.filter(user => {
            const fullName = `${user.first_name || ''} ${user.middle_name || ''} ${user.last_name || ''}`.toLowerCase();
            const userID = (user.userID || '').toLowerCase();
            const email = (user.email || '').toLowerCase();
            const role = user.role || '';

            let matchesTab = activeTab === 'All' || role === activeTab;
            const matchesSearch = fullName.includes(searchTerm.toLowerCase()) || userID.includes(searchTerm.toLowerCase()) || email.includes(searchTerm.toLowerCase());

            return matchesTab && matchesSearch;
        });
    }, [users, activeTab, searchTerm]);

    // --- ROW RENDERER ---
    const renderRow = (user, index, startIndex) => {
        const isSelected = selectedUser?._id === user._id; // Check selection
        const honorific = user.honorific ? `${user.honorific} ` : '';
        const displayName = `${honorific}${user.first_name} ${user.middle_name ? user.middle_name[0] + '.' : ''} ${user.last_name}`;

        return (
            <tr
                key={user._id || index}
                // 🟢 CLICK HANDLER FOR SELECTION
                onClick={() => {
                    if (isSelected) {
                        setSelectedUser(null);
                        setIsActionBarVisible(false);
                    } else {
                        setSelectedUser(user);
                        setIsActionBarVisible(true);
                    }
                }}
                className="hover:bg-gray-50/80 transition-colors"
                style={{
                    height: ITEM_HEIGHT_ESTIMATE_PX,
                    backgroundColor: isSelected ? "#eff6ff" : "transparent", // Highlight selected
                    cursor: "pointer"
                }}
            >
                <td style={{ ...cellStyle, textAlign: 'center', width: '64px' }}></td>

                {/* Name Column */}
                <td style={{ ...cellStyle, paddingRight: '24px' }}>
                    <div className="flex items-center gap-3">
                        <div className="w-6 h-6 rounded-full bg-blue-50 flex items-center justify-center text-blue-600 border border-blue-100 flex-shrink-0">
                            <User size={12} />
                        </div>
                        <span className="font-semibold text-gray-900 truncate">
                            {displayName}
                        </span>
                    </div>
                </td>

                {/* User ID */}
                <td style={{ ...cellStyle, paddingRight: '24px' }}>
                    <span className="text-[11px] text-gray-500 font-mono bg-gray-50 px-2 py-0.5 rounded border border-gray-200">
                        {user.userID}
                    </span>
                </td>

                {/* Role */}
                <td style={{ ...cellStyle, paddingRight: '24px' }}>
                    <RoleBadge role={user.role} />
                </td>

                {/* Email */}
                <td style={{ ...cellStyle, paddingRight: '24px' }}>
                    <div className="flex items-center gap-2 text-gray-500">
                        <Mail size={12} />
                        <span className="truncate max-w-[150px]">{user.email}</span>
                    </div>
                </td>

                {/* Status */}
                <td style={{ ...cellStyle, paddingRight: '24px' }}>
                    <StatusBadge isActive={user.isActive} />
                </td>
            </tr>
        );
    };

    const columns = ['User Name', 'User ID', 'Role', 'Email Address', 'Status'];
    const metrics = [
        { label: 'Total Users', value: users.length },
        { label: 'Active', value: users.filter(u => u.isActive).length, color: '#10B981' },
        { label: 'Inactive', value: users.filter(u => !u.isActive).length, color: '#EF4444' }
    ];

    return (
        <div style={{ width: '100%', height: '100%', display: "flex", flexDirection: "column", alignItems: "center" }}>
            <div className="w-[100%]">
                <HeaderBar headerTitle={"User Management"} />
            </div>

            <CreateUserModal
                isOpen={isCreateModalOpen}
                onClose={() => setIsCreateModalOpen(false)}
                onSuccess={fetchData}
            />

            {/* 🟢 MODALS */}
            <EditUserModal
                isOpen={isEditModalOpen}
                onClose={() => setIsEditModalOpen(false)}
                user={selectedUser}
                onSave={(updatedUser) => {
                    setUsers(users.map(u => u._id === updatedUser._id ? updatedUser : u));
                    setSelectedUser(updatedUser);
                }}
            />
            <ResetPasswordModal
                isOpen={isResetModalOpen}
                onClose={() => setIsResetModalOpen(false)}
                user={selectedUser}
                onConfirm={() => {
                    // Handle actual API call for reset here
                    console.log("Password reset for:", selectedUser.userID);
                }}
            />

            <div className="w-[98%] flex justify-center">
                <GenericTable
                    title="User Management"
                    subtitle="Manage system access and roles"
                    data={filteredUsers}
                    columns={columns}
                    renderRow={renderRow}
                    metrics={metrics}
                    primaryKey="_id"
                    isLoading={isLoading}
                    emptyMessage="No users found"
                    emptyMessageIcon={<AlertCircle size={30} strokeWidth={1.5} />}
                    tabs={tabs}
                    activeTab={activeTab}
                    onTabChange={(tab) => {
                        setActiveTab(tab);
                        setSelectedUser(null);
                        setIsActionBarVisible(false);
                    }}

                    // 🟢 PRIMARY ACTION
                    primaryActionLabel="Create User"
                    primaryActionIcon={<UserPlus size={18} />}
                    onPrimaryAction={() => setIsCreateModalOpen(true)}

                    searchTerm={searchTerm}
                    onSearchChange={setSearchTerm}
                    selectable={false}
                    minItems={5}
                    maxItems={13}

                    // 🟢 ACTION BAR INTEGRATION
                    overrideHeader={
                        isActionBarVisible && selectedUser ? (
                            <SelectionActionBar
                                variant="user"
                                selectedItem={selectedUser}
                                onClearSelection={() => {
                                    setSelectedUser(null);
                                    setIsActionBarVisible(false);
                                }}
                                onEditUser={() => setIsEditModalOpen(true)}
                                onResetPassword={() => setIsResetModalOpen(true)}
                            />
                        ) : null
                    }
                />
            </div>
        </div>
    );
};

// --- HELPER COMPONENTS ---
const StatusBadge = ({ isActive }) => (
    <div className={`flex items-center gap-1.5 rounded-full w-fit border ${isActive ? 'bg-emerald-50 border-emerald-100' : 'bg-gray-50 border-gray-200'}`} style={{ padding: "2px 6px" }}>
        {isActive ? <CheckCircle size={10} className="text-emerald-600" /> : <XCircle size={10} className="text-gray-400" />}
        <span className={`text-[10px] font-semibold ${isActive ? 'text-emerald-700' : 'text-gray-500'}`}>{isActive ? 'Active' : 'Inactive'}</span>
    </div>
);

const RoleBadge = ({ role }) => {
    const getStyle = (r) => {
        switch (r) {
            case 'SUPER-ADMIN': return { bg: '#FEF2F2', text: '#991B1B', border: '#FECACA' };
            case 'ADMIN': return { bg: '#FFF7ED', text: '#9A3412', border: '#FED7AA' };
            case 'CHANCELLOR': return { bg: '#F0F9FF', text: '#075985', border: '#BAE6FD' };
            case 'CLASS-ADVISER': return { bg: '#F0FDF4', text: '#166534', border: '#BBF7D0' };
            default: return { bg: '#F3F4F6', text: '#374151', border: '#E5E7EB' };
        }
    };
    const style = getStyle(role);
    const formattedRole = role ? role.replace(/-/g, ' ').toLowerCase().replace(/\b\w/g, c => c.toUpperCase()) : 'Unknown';
    return (
        <span style={{ fontSize: '10px', fontWeight: 600, padding: '2px 8px', borderRadius: '4px', backgroundColor: style.bg, color: style.text, border: `1px solid ${style.border}`, display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
            <Shield size={10} /> {formattedRole}
        </span>
    );
};

export default UserManagement;