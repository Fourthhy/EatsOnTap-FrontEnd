import React, { useState, useEffect } from 'react';
import { Clock, Save, Loader2 } from 'lucide-react';
import { PasswordConfirmationModal } from './PasswordConfirmationModal';
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
        disabled: '#9CA3AF', // Added for disabled state
    },
    fonts: { main: "'Geist', sans-serif" },
    radius: { md: '6px', lg: '6px', full: '9999px' },
    shadows: { sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)', md: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }
};

// --- SUB-COMPONENTS ---

const ToggleSwitch = ({ checked, onChange }) => {
    const trackStyle = {
        width: '44px', height: '24px', backgroundColor: checked ? theme.colors.primary : '#E5E7EB',
        borderRadius: theme.radius.full, position: 'relative', cursor: 'pointer',
        transition: 'background-color 0.2s', display: 'flex', alignItems: 'center',
    };
    const knobStyle = {
        width: '20px', height: '20px', backgroundColor: theme.colors.white, borderRadius: theme.radius.full,
        position: 'absolute', left: checked ? '22px' : '2px', transition: 'left 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
        boxShadow: '0 1px 3px rgba(0,0,0,0.3)',
    };
    return (
        <div style={trackStyle} onClick={() => onChange(!checked)}>
            <div style={knobStyle} />
        </div>
    );
};

const ScheduleConfigForm = ({ settingKey, label, initialData }) => {
    // --- STATE ---
    const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
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
        setIsPasswordModalOpen(true);
    };

    const handlePasswordConfirmed = async (password) => {
        setIsSaving(true);
        
        const payload = {
            settingName: settingKey, 
            startHour: parseInt(startHour, 10),
            startMinute: parseInt(startMinute, 10),
            endHour: parseInt(endHour, 10),
            endMinute: parseInt(endMinute, 10),
            isActive: isActive, 
            password: password 
        };

        console.log("Submitting Payload:", payload);

        try {
            await editSetting(payload); 
        } catch (error) {
            console.error("Update failed:", error);
        } finally {
            setIsSaving(false);
            setIsPasswordModalOpen(false);
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
        // 🟢 UPDATED BUTTON STYLE
        button: {
            backgroundColor: hasChanges ? theme.colors.primary : '#F3F4F6', // Blue if changed, Light Grey if not
            color: hasChanges ? theme.colors.textWhite : theme.colors.disabled, // White if changed, Grey text if not
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
                    disabled={isSaving || !hasChanges} // 🟢 Disable if no changes
                >
                    {isSaving ? <Loader2 className="animate-spin" size={16} /> : <Save size={16} />} Update Schedule
                </button>
            </div>

            {/* --- PASSWORD MODAL --- */}
            <PasswordConfirmationModal 
                isOpen={isPasswordModalOpen}
                onClose={() => setIsPasswordModalOpen(false)}
                onConfirm={handlePasswordConfirmed}
                actionTitle={`Update ${label}`}
            />
        </div>
    );
};

// --- MAIN COMPONENT ---

const OperationalScheduling = () => {
    // We use the Schema 'setting' field as the ID
    const [activeSettingKey, setActiveSettingKey] = useState('SUBMIT-MEAL-REQUEST'); // 🟢 Fixed Initial State 
    
    // 🟢 GET DATA FROM CONTEXT
    const { setting } = useData(); 

    const scheduleTabs = [
        { id: 'SUBMIT-MEAL-REQUEST', label: 'Meal Requests' }, 
        { id: 'ASSIGN-CREDITS', label: 'Credit Assignment' },
        { id: 'STUDENT-CLAIM', label: 'Student Claims' },
        { id: 'REMOVE-CREDITS', label: 'Credit Removal' },
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