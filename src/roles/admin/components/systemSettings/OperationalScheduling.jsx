import React, { useState, useEffect } from 'react';
import { Clock, Save, Loader2, AlertCircle } from 'lucide-react';
import { ButtonGroup } from '../../../../components/global/ButtonGroup';
import { useData } from '../../../../context/DataContext';

// 🟢 IMPORT API FUNCTION
import { editSetting } from '../../../../functions/admin/editSetting'; 

// --- SHARED THEME ---
const theme = {
    colors: {
        primary: '#4268BD',
        textMain: '#111827',
        textSec: '#6B7280',
        border: '#E5E7EB',
        white: '#FFFFFF',
        textWhite: '#EEEEEE',
        bg: '#F9FAFB',
        disabled: '#9CA3AF', 
    },
    fonts: { main: "'Geist', sans-serif" },
    radius: { md: '6px', lg: '6px', full: '9999px' },
    shadows: { sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)', md: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }
};

// --- SUB-COMPONENTS ---

// 🟢 NEW: Clean Confirmation Modal
const ConfirmationModal = ({ isOpen, onClose, onConfirm, title, isSaving }) => {
    if (!isOpen) return null;
    return (
        <div style={{
            position: 'fixed', inset: 0, zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center',
            backgroundColor: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(4px)'
        }}>
            <div style={{
                backgroundColor: theme.colors.white, borderRadius: '12px', padding: '24px', width: '100%', 
                maxWidth: '360px', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.25)', textAlign: 'center', fontFamily: theme.fonts.main
            }}>
                <div style={{ backgroundColor: '#EFF6FF', padding: '12px', borderRadius: '50%', marginBottom: '16px', color: theme.colors.primary, display: 'inline-flex' }}>
                    <AlertCircle size={24} />
                </div>
                <h3 style={{ fontSize: '18px', fontWeight: 700, color: theme.colors.textMain, marginBottom: '8px' }}>{title}</h3>
                <p style={{ fontSize: '14px', color: theme.colors.textSec, marginBottom: '24px', lineHeight: '1.5' }}>
                    Are you sure you want to apply these schedule changes? This will affect system operations immediately.
                </p>
                <div style={{ display: 'flex', gap: '12px' }}>
                    <button 
                        onClick={onClose} 
                        disabled={isSaving}
                        style={{ flex: 1, padding: '10px', borderRadius: '8px', border: `1px solid ${theme.colors.border}`, backgroundColor: 'white', color: theme.colors.textMain, cursor: isSaving ? 'not-allowed' : 'pointer', fontWeight: 500 }}
                    >
                        Cancel
                    </button>
                    <button 
                        onClick={onConfirm} 
                        disabled={isSaving}
                        style={{ flex: 1, padding: '10px', borderRadius: '8px', border: 'none', backgroundColor: theme.colors.primary, color: 'white', cursor: isSaving ? 'not-allowed' : 'pointer', fontWeight: 500, display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px' }}
                    >
                        {isSaving ? <Loader2 size={16} className="animate-spin" /> : "Confirm"}
                    </button>
                </div>
            </div>
        </div>
    );
};

const ScheduleConfigForm = ({ settingKey, label, initialData }) => {
    // --- STATE ---
    const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false); // 🟢 Replaced Password State
    const [isSaving, setIsSaving] = useState(false);

    // Schema Fields
    const [isActive, setIsActive] = useState(false);
    const [startHour, setStartHour] = useState(0);
    const [startMinute, setStartMinute] = useState(0);
    const [endHour, setEndHour] = useState(0);
    const [endMinute, setEndMinute] = useState(0);

    // 🟢 SYNC STATE: Update local state when prop data changes
    useEffect(() => {
        if (initialData) {
            setIsActive(initialData.isActive ?? false);
            setStartHour(initialData.startHour ?? 0);
            setStartMinute(initialData.startMinute ?? 0);
            setEndHour(initialData.endHour ?? 0);
            setEndMinute(initialData.endMinute ?? 0);
        } else {
            setIsActive(false);
            setStartHour(0);
            setStartMinute(0);
            setEndHour(0);
            setEndMinute(0);
        }
    }, [initialData]);

    // 🟢 CHECK FOR CHANGES
    const hasChanges = initialData && (
        isActive !== (initialData.isActive ?? false) ||
        parseInt(startHour, 10) !== (initialData.startHour ?? 0) ||
        parseInt(startMinute, 10) !== (initialData.startMinute ?? 0) ||
        parseInt(endHour, 10) !== (initialData.endHour ?? 0) ||
        parseInt(endMinute, 10) !== (initialData.endMinute ?? 0)
    );

    // --- HANDLERS ---
    const handleUpdateClick = () => {
        if (!hasChanges) return;
        setIsConfirmModalOpen(true);
    };

    // 🟢 No longer expects a password argument
    const handleConfirmUpdate = async () => {
        setIsSaving(true);
        
        const payload = {
            settingName: settingKey, 
            startHour: parseInt(startHour, 10),
            startMinute: parseInt(startMinute, 10),
            endHour: parseInt(endHour, 10),
            endMinute: parseInt(endMinute, 10),
            isActive: isActive, 
            // 🟢 Password removed from payload
        };

        console.log("Submitting Payload:", payload);

        try {
            await editSetting(payload); 
            setIsConfirmModalOpen(false);
            // Optionally add a success toast/alert here
        } catch (error) {
            console.error("Update failed:", error);
            alert(error.message || "Failed to update schedule.");
        } finally {
            setIsSaving(false);
        }
    };

    const styles = {
        headerBox: {
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            backgroundColor: '#F9FAFB', padding: '16px', borderRadius: theme.radius.md,
            border: `1px solid ${theme.colors.border}`, marginBottom: '24px',
        },
        sectionTitle: {
            display: 'flex', alignItems: 'center', gap: '8px', fontSize: '14px',
            fontWeight: '600', color: '#374151', marginBottom: '12px', fontFamily: theme.fonts.main
        },
        label: { display: 'block', fontSize: '12px', fontWeight: '500', color: theme.colors.textSec, marginBottom: '4px', fontFamily: theme.fonts.main },
        input: {
            width: '100%', padding: '10px', backgroundColor: '#F9FAFB', border: `1px solid ${theme.colors.border}`,
            borderRadius: theme.radius.md, fontSize: '14px', color: theme.colors.textMain, outline: 'none', fontFamily: theme.fonts.main
        },
        button: {
            backgroundColor: hasChanges ? theme.colors.primary : '#F3F4F6', 
            color: hasChanges ? theme.colors.textWhite : theme.colors.disabled, 
            border: hasChanges ? 'none' : `1px solid ${theme.colors.border}`,
            borderRadius: theme.radius.md,
            padding: '10px 20px', fontSize: '14px', fontWeight: '500', 
            cursor: hasChanges ? 'pointer' : 'not-allowed', 
            fontFamily: theme.fonts.main,
            display: 'flex', alignItems: 'center', gap: '8px',
            transition: 'all 0.2s ease',
            opacity: hasChanges ? 1 : 0.7
        }
    };

    if (!initialData) {
        return <div style={{ height: '300px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#6B7280' }}><Loader2 className="animate-spin" /> Loading configuration...</div>;
    }

    return (
        <div style={{ animation: 'fadeIn 0.3s ease-out' }}>
            {/* Time Settings */}
            <div style={{ marginBottom: '24px' }}>
                <div style={styles.sectionTitle}><Clock size={16} /> Daily Time Window (24-Hour Format)</div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
                    
                    {/* START TIME */}
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                        <div>
                            <label style={styles.label}>Start Hour (0-23)</label>
                            <input 
                                type="number" min="0" max="23" style={styles.input} placeholder="08" 
                                value={startHour} onChange={(e) => setStartHour(e.target.value)}
                            />
                        </div>
                        <div>
                            <label style={styles.label}>Start Minute (0-59)</label>
                            <input 
                                type="number" min="0" max="59" style={styles.input} placeholder="00" 
                                value={startMinute} onChange={(e) => setStartMinute(e.target.value)}
                            />
                        </div>
                    </div>

                    {/* END TIME */}
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                        <div>
                            <label style={styles.label}>End Hour (0-23)</label>
                            <input 
                                type="number" min="0" max="23" style={styles.input} placeholder="17" 
                                value={endHour} onChange={(e) => setEndHour(e.target.value)}
                            />
                        </div>
                        <div>
                            <label style={styles.label}>End Minute (0-59)</label>
                            <input 
                                type="number" min="0" max="59" style={styles.input} placeholder="00" 
                                value={endMinute} onChange={(e) => setEndMinute(e.target.value)}
                            />
                        </div>
                    </div>
                </div>
            </div>
            
            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                <button 
                    style={styles.button} 
                    onClick={handleUpdateClick} 
                    disabled={isSaving || !hasChanges} 
                >
                    {isSaving ? <Loader2 className="animate-spin" size={16} /> : <Save size={16} />} Update Schedule
                </button>
            </div>

            {/* 🟢 NEW CONFIRMATION MODAL */}
            <ConfirmationModal 
                isOpen={isConfirmModalOpen}
                onClose={() => setIsConfirmModalOpen(false)}
                onConfirm={handleConfirmUpdate}
                title={`Update ${label}`}
                isSaving={isSaving}
            />
        </div>
    );
};

// --- MAIN COMPONENT ---

const OperationalScheduling = () => {
    // We use the Schema 'setting' field as the ID
    const [activeSettingKey, setActiveSettingKey] = useState('SUBMIT-MEAL-REQUEST'); 
    
    // 🟢 GET DATA FROM CONTEXT
    const { setting } = useData(); 

    const scheduleTabs = [
        { id: 'SUBMIT-MEAL-REQUEST', label: 'Meal Requests' }, 
        { id: 'ASSIGN-CREDITS', label: 'Credit Assignment' },
        { id: 'STUDENT-CLAIM', label: 'Student Claims' },
        { id: 'END-OF-DAY-SWEEP', label: 'Credit Removal' },
    ];

    const cardStyle = {
        backgroundColor: theme.colors.white, borderRadius: theme.radius.lg,
        boxShadow: theme.shadows.sm, border: `1px solid ${theme.colors.border}`,
        padding: '24px', fontFamily: theme.fonts.main,
    };

    // 🟢 CHECK IF SETTING ARRAY IS LOADED
    if (!setting && !Array.isArray(setting)) {
        return (
            <section style={cardStyle}>
                <div style={{ height: '300px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#6B7280' }}>
                    <Loader2 className="animate-spin" size={24} /> 
                    <span style={{ marginLeft: 10 }}>Loading Settings...</span>
                </div>
            </section>
        );
    }

    // 🟢 FIND ACTIVE SETTING
    const activeSettingData = Array.isArray(setting) 
        ? setting.find(s => s.setting === activeSettingKey) 
        : null;

    return (
        <section style={cardStyle}>
            <div style={{ marginBottom: '24px' }}>
                <h2 style={{ fontSize: '18px', fontWeight: '700', color: theme.colors.textMain, marginBottom: '4px' }}>Operational Scheduling</h2>
                <p style={{ fontSize: '14px', color: theme.colors.textSec }}>Configure active hours for specific system operations.</p>
            </div>

            <div style={{ marginBottom: '32px' }}>
                <ButtonGroup 
                    buttonListGroup={scheduleTabs}
                    activeId={activeSettingKey}
                    onSetActiveId={setActiveSettingKey}
                    activeColor={theme.colors.primary}
                />
            </div>

            <div style={{ minHeight: '200px' }}>
                <ScheduleConfigForm 
                    key={activeSettingKey} 
                    settingKey={activeSettingKey}
                    label={scheduleTabs.find(t => t.id === activeSettingKey)?.label} 
                    initialData={activeSettingData}
                />
            </div>
        </section>
    );
};

export { OperationalScheduling };