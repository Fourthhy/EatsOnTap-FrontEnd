import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Save, Loader2, UserPlus, ChevronDown, Check, AlertTriangle } from 'lucide-react';
import { createNewUser } from '../../../functions/superAdmin/createNewUser'; 
import { createNewClassAdviser } from '../../../functions/superAdmin/createNewClassAdviser';

// --- CUSTOM DROPDOWN COMPONENT ---
const CustomDropdown = ({ label, value, options, onChange }) => {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div style={{ position: 'relative', width: '100%' }}>
            <label style={{ display: 'block', fontSize: '12px', fontWeight: '500', color: '#374151', marginBottom: '4px' }}>
                {label}
            </label>
            <button
                type="button"
                onClick={() => setIsOpen(!isOpen)}
                style={{
                    width: '100%', padding: '8px 12px', fontSize: '14px', textAlign: 'left',
                    backgroundColor: 'white', border: '1px solid #d1d5db', borderRadius: '6px',
                    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                    cursor: 'pointer', color: value ? '#1f2937' : '#9ca3af',
                    boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
                    fontFamily: 'geist, sans-serif'
                }}
            >
                <span>{value || "Select..."}</span>
                <ChevronDown 
                    size={16} 
                    style={{ 
                        color: '#9CA3AF', 
                        transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)',
                        transition: 'transform 0.2s ease'
                    }} 
                />
            </button>

            <AnimatePresence>
                {isOpen && (
                    <>
                        <div
                            style={{ position: 'fixed', inset: 0, zIndex: 9000 }}
                            onClick={() => setIsOpen(false)}
                        />
                        <motion.div
                            initial={{ opacity: 0, y: -5 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -5 }}
                            transition={{ duration: 0.15 }}
                            style={{
                                position: 'absolute', top: '100%', left: 0, right: 0, marginTop: '4px',
                                backgroundColor: 'white', borderRadius: '6px',
                                boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1), 0 4px 6px -2px rgba(0,0,0,0.05)',
                                border: '1px solid #f3f4f6', zIndex: 9001, maxHeight: '200px', overflowY: 'auto'
                            }}
                        >
                            {options.map((opt) => (
                                <button
                                    key={opt}
                                    type="button"
                                    onClick={() => { onChange(opt); setIsOpen(false); }}
                                    style={{
                                        width: '100%', padding: '10px 12px', fontSize: '14px', textAlign: 'left',
                                        backgroundColor: 'transparent', border: 'none', cursor: 'pointer',
                                        display: 'flex', alignItems: 'center', gap: '8px', color: '#374151',
                                        borderBottom: '1px solid #f9fafb',
                                        fontFamily: 'geist, sans-serif'
                                    }}
                                    onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f9fafb'}
                                    onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                                >
                                    {value === opt && <Check size={14} color="#2563EB" />}
                                    <span style={{ marginLeft: value === opt ? 0 : '22px' }}>{opt}</span>
                                </button>
                            ))}
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </div>
    );
};

// --- MAIN MODAL COMPONENT ---
const CreateUserModal = ({ isOpen, onClose, onSuccess }) => {
    // --- STATE ---
    const [role, setRole] = useState('ADMIN-ASSISTANT'); // Default
    const [isLoading, setIsLoading] = useState(false);
    
    // 🟢 NEW: State for Google Auth & Warning Modal
    const [isGoogleAuth, setIsGoogleAuth] = useState(false);
    const [showWarningModal, setShowWarningModal] = useState(false);
    
    // Form State
    const [formData, setFormData] = useState({
        userID: '',
        first_name: '',
        middle_name: '',
        last_name: '',
        email: '',
        password: '',
        honorific: 'Mr.',
        section: ''
    });

    // Reset form when modal opens/closes
    useEffect(() => {
        if (isOpen) {
            setFormData({
                userID: '', first_name: '', middle_name: '', last_name: '',
                email: '', password: '', honorific: 'Mr.', section: ''
            });
            setRole('ADMIN-ASSISTANT');
            setIsGoogleAuth(false); // 🟢 NEW: Reset Google Auth toggle
            setShowWarningModal(false); // 🟢 NEW: Reset warning modal
        }
    }, [isOpen]);

    // --- HANDLERS ---
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    // 🟢 NEW: Intercept the form submission to show warning if Google Auth is checked
    const handlePreSubmit = (e) => {
        e.preventDefault();
        if (isGoogleAuth) {
            setShowWarningModal(true); // Pause and ask for confirmation
        } else {
            executeSubmit(); // Proceed normally if standard login
        }
    };

    // 🟢 UPDATED: The actual API call logic moved here
    const executeSubmit = async () => {
        setIsLoading(true);
        setShowWarningModal(false); // Close warning if it was open

        try {
            let response;
            
            if (role === 'CLASS-ADVISER') {
                const adviserData = {
                    userID: formData.userID,
                    first_name: formData.first_name,
                    middle_name: formData.middle_name,
                    last_name: formData.last_name,
                    email: formData.email,
                    password: formData.password, // Might be empty if GoogleAuth, backend handles it
                    role: 'CLASS-ADVISER',
                    honorific: formData.honorific,
                    section: formData.section,
                    isGoogleAuth: isGoogleAuth // 🟢 NEW: Pass this to backend
                };
                response = await createNewClassAdviser(adviserData);
            } else {
                const userData = {
                    userID: formData.userID,
                    first_name: formData.first_name,
                    middle_name: formData.middle_name,
                    last_name: formData.last_name,
                    email: formData.email,
                    password: formData.password,
                    role: role,
                    isGoogleAuth: isGoogleAuth // 🟢 NEW: Pass this to backend
                };
                response = await createNewUser(userData);
            }

            if (response) {
                onSuccess();
                onClose();
            }
        } catch (error) {
            console.error("Creation failed:", error);
            alert("Failed to create user. Please check the console.");
        } finally {
            setIsLoading(false);
        }
    };

    // --- OPTIONS ---
    const roles = [
        'ADMIN-ASSISTANT', 'ADMIN', 'FOOD-SERVER', 'CANTEEN-STAFF', 
        'SUPER-ADMIN', 'CHANCELLOR', 'CLASS-ADVISER'
    ];

    const honorifics = ['Mr.', 'Ms.'];

    // --- STYLES ---
    const labelStyle = { display: 'block', fontSize: '12px', fontWeight: 500, color: '#374151', marginBottom: '4px' };
    const inputStyle = { width: '100%', padding: '8px 12px', borderRadius: '6px', border: '1px solid #D1D5DB', fontSize: '14px', fontFamily: 'geist, sans-serif' };

    if (!isOpen) return null;

    return (
        <AnimatePresence>
            <div style={{ position: 'fixed', inset: 0, zIndex: 9600, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <div style={{ position: 'absolute', inset: 0, backgroundColor: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(4px)' }} onClick={onClose} />
                
                {/* 🟢 NEW: THE WARNING MODAL OVERLAY */}
                {showWarningModal && (
                    <motion.div 
                        initial={{ scale: 0.9, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0.9, opacity: 0 }}
                        style={{ position: 'absolute', zIndex: 9700, backgroundColor: 'white', borderRadius: '12px', padding: '24px', width: '90%', maxWidth: '400px', boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)' }}
                    >
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px', color: '#B45309' }}>
                            <AlertTriangle size={24} />
                            <h3 style={{ fontSize: '18px', fontWeight: 700, margin: 0 }}>Verify Email Match</h3>
                        </div>
                        <p style={{ fontSize: '14px', color: '#4B5563', lineHeight: 1.6, marginBottom: '16px' }}>
                            You selected <strong>Google Authentication</strong> for this user. 
                            The email address must <strong>exactly match</strong> the Google account they will use to log in.
                        </p>
                        <div style={{ backgroundColor: '#FEF3C7', padding: '12px', borderRadius: '8px', marginBottom: '24px', border: '1px solid #FDE68A' }}>
                            <p style={{ fontSize: '13px', color: '#92400E', margin: 0, fontWeight: 500 }}>
                                Registered Email: <br/>
                                <span style={{ fontSize: '15px', fontWeight: 700, display: 'block', marginTop: '4px' }}>{formData.email}</span>
                            </p>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
                            <button onClick={() => setShowWarningModal(false)} style={{ padding: '8px 16px', borderRadius: '6px', border: '1px solid #D1D5DB', background: 'white', color: '#374151', cursor: 'pointer', fontSize: '14px', fontWeight: 500 }}>
                                Let me double-check
                            </button>
                            <button onClick={executeSubmit} style={{ padding: '8px 16px', borderRadius: '6px', border: 'none', background: '#F59E0B', color: 'white', cursor: 'pointer', fontSize: '14px', fontWeight: 600 }}>
                                It is exactly correct
                            </button>
                        </div>
                    </motion.div>
                )}

                <motion.div 
                    initial={{ scale: 0.95, opacity: 0, y: 10 }}
                    animate={{ scale: 1, opacity: 1, y: 0 }}
                    exit={{ scale: 0.95, opacity: 0, y: 10 }}
                    style={{ backgroundColor: 'white', borderRadius: '12px', padding: '24px', width: '100%', maxWidth: '500px', zIndex: 10, boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1)', maxHeight: '90vh', overflowY: 'auto', filter: showWarningModal ? 'blur(2px)' : 'none', pointerEvents: showWarningModal ? 'none' : 'auto' }}
                >
                    {/* Header */}
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                            <div style={{ backgroundColor: '#DBEAFE', padding: '8px', borderRadius: '8px', color: '#1E40AF' }}>
                                <UserPlus size={20} />
                            </div>
                            <h3 style={{ fontSize: '18px', fontWeight: 700, color: '#1F2937', fontFamily: 'geist, sans-serif' }}>Create New Account</h3>
                        </div>
                        <button onClick={onClose} style={{ color: '#9CA3AF', background: 'none', border: 'none', cursor: 'pointer' }}><X size={20} /></button>
                    </div>

                    {/* 🟢 UPDATED: Switched to handlePreSubmit */}
                    <form onSubmit={handlePreSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                        
                        {/* 1. ROLE SELECTION */}
                        <CustomDropdown 
                            label="Select Role" 
                            value={role} 
                            options={roles} 
                            onChange={(val) => setRole(val)} 
                        />

                        <hr style={{ border: 'none', borderTop: '1px solid #F3F4F6' }} />

                        {/* 2. CREDENTIALS */}
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                            <div>
                                <label style={labelStyle}>User ID <span style={{color:'red'}}>*</span></label>
                                <input required name="userID" value={formData.userID} onChange={handleChange} style={inputStyle} placeholder="e.g. 26-00123ABC" />
                            </div>
                            <div>
                                <label style={labelStyle}>Email (@laverdad.edu.ph) <span style={{color:'red'}}>*</span></label>
                                <input required type="email" name="email" value={formData.email} onChange={handleChange} style={inputStyle} placeholder="user@laverdad..." />
                            </div>
                        </div>

                        {/* 🟢 NEW: GOOGLE AUTH TOGGLE */}
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '12px', backgroundColor: isGoogleAuth ? '#EFF6FF' : '#F9FAFB', borderRadius: '8px', border: `1px solid ${isGoogleAuth ? '#BFDBFE' : '#E5E7EB'}`, transition: 'all 0.2s ease' }}>
                            <input 
                                type="checkbox" 
                                id="googleAuth" 
                                checked={isGoogleAuth} 
                                onChange={(e) => setIsGoogleAuth(e.target.checked)} 
                                style={{ width: '16px', height: '16px', cursor: 'pointer', accentColor: '#2563EB' }}
                            />
                            <label htmlFor="googleAuth" style={{ fontSize: '13px', fontWeight: 500, color: '#374151', cursor: 'pointer', margin: 0 }}>
                                This user will authenticate using Google Workspace
                            </label>
                        </div>

                        {/* 🟢 UPDATED: Hide password field if Google Auth is selected */}
                        {!isGoogleAuth && (
                            <div>
                                <label style={labelStyle}>Initial Password <span style={{color:'red'}}>*</span></label>
                                <input required={!isGoogleAuth} type="password" name="password" value={formData.password} onChange={handleChange} style={inputStyle} placeholder="••••••••" />
                            </div>
                        )}

                        {/* 3. PERSONAL INFO */}
                        <div style={{ display: 'grid', gridTemplateColumns: role === 'CLASS-ADVISER' ? '0.5fr 1fr 1fr' : '1fr 1fr', gap: '12px' }}>
                            
                            {/* Conditional Honorific (Custom Dropdown) */}
                            {role === 'CLASS-ADVISER' && (
                                <CustomDropdown 
                                    label="Title" 
                                    value={formData.honorific} 
                                    options={honorifics} 
                                    onChange={(val) => setFormData(prev => ({...prev, honorific: val}))} 
                                />
                            )}

                            <div>
                                <label style={labelStyle}>First Name <span style={{color:'red'}}>*</span></label>
                                <input required name="first_name" value={formData.first_name} onChange={handleChange} style={inputStyle} />
                            </div>
                            
                            {role !== 'CLASS-ADVISER' && (
                                <div>
                                    <label style={labelStyle}>Middle Name</label>
                                    <input name="middle_name" value={formData.middle_name} onChange={handleChange} style={inputStyle} />
                                </div>
                            )}
                        </div>

                        {/* Middle Name row for Adviser */}
                        {role === 'CLASS-ADVISER' && (
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                                <div>
                                    <label style={labelStyle}>Middle Name</label>
                                    <input name="middle_name" value={formData.middle_name} onChange={handleChange} style={inputStyle} />
                                </div>
                                <div>
                                    <label style={labelStyle}>Last Name <span style={{color:'red'}}>*</span></label>
                                    <input required name="last_name" value={formData.last_name} onChange={handleChange} style={inputStyle} />
                                </div>
                            </div>
                        )}

                        {role !== 'CLASS-ADVISER' && (
                            <div>
                                <label style={labelStyle}>Last Name <span style={{color:'red'}}>*</span></label>
                                <input required name="last_name" value={formData.last_name} onChange={handleChange} style={inputStyle} />
                            </div>
                        )}

                        {/* 4. ADVISER SPECIFICS */}
                        {role === 'CLASS-ADVISER' && (
                            <div style={{ backgroundColor: '#F9FAFB', padding: '12px', borderRadius: '8px', border: '1px dashed #E5E7EB' }}>
                                <label style={{ ...labelStyle, color: '#4B5563' }}>Advisory Section</label>
                                <input name="section" value={formData.section} onChange={handleChange} style={inputStyle} placeholder="e.g. BSIS-1A" />
                            </div>
                        )}

                        {/* FOOTER */}
                        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '12px' }}>
                            <button type="button" onClick={onClose} style={{ padding: '10px 20px', borderRadius: '8px', border: 'none', background: 'transparent', color: '#4B5563', cursor: 'pointer', fontSize: '14px', fontWeight: 600 }}>
                                Cancel
                            </button>
                            <button type="submit" disabled={isLoading} style={{ padding: '10px 24px', borderRadius: '8px', border: 'none', background: '#10B981', color: 'white', cursor: isLoading ? 'not-allowed' : 'pointer', fontSize: '14px', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '8px', boxShadow: '0 4px 6px -1px rgba(16, 185, 129, 0.2)' }}>
                                {isLoading ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />} 
                                Create Account
                            </button>
                        </div>
                    </form>
                </motion.div>
            </div>
        </AnimatePresence>
    );
};

export { CreateUserModal };