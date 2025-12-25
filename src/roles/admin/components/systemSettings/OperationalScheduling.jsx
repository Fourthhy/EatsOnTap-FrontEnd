import React, { useState } from 'react';
import { Clock, Calendar } from 'lucide-react';
import { PasswordConfirmationModal } from './PasswordConfirmationModal';
import { ButtonGroup } from '../../../../components/global/ButtonGroup'; // Import your custom ButtonGroup

// --- SHARED THEME FOR THIS COMPONENT ---
const theme = {
    colors: {
        primary: '#4268BD',
        textMain: '#111827',
        textSec: '#6B7280',
        border: '#E5E7EB',
        white: '#FFFFFF',      // Used for Backgrounds
        textWhite: '#EEEEEE',  // Used for Text (Separated)
        bg: '#F9FAFB'
    },
    fonts: { main: "'Geist', sans-serif" },
    // UPDATED: Radius set to 6px
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

const ScheduleConfigForm = ({ type, data }) => {
    const [isEnabled, setIsEnabled] = useState(data.enabled);
    const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);

    // --- HANDLERS ---
    const handleUpdateClick = () => {
        setIsPasswordModalOpen(true);
    };

    const handlePasswordConfirmed = (password) => {
        console.log(`Updating ${type} Schedule. Enabled: ${isEnabled}. Password used: ${password}`);
        // Add your API save logic here
        setIsPasswordModalOpen(false);
        alert(`${type} Schedule Updated!`);
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
            backgroundColor: theme.colors.primary, 
            color: theme.colors.textWhite, // UPDATED: Using #EEEEEE
            border: 'none', borderRadius: theme.radius.md,
            padding: '10px 20px', fontSize: '14px', fontWeight: '500', cursor: 'pointer', fontFamily: theme.fonts.main
        }
    };

    return (
        <div style={{ animation: 'fadeIn 0.3s ease-out' }}>
            {/* Enable/Disable Switch */}
            <div style={styles.headerBox}>
                <div>
                    <h4 style={{ fontSize: '15px', fontWeight: '700', color: theme.colors.textMain, marginBottom: '2px', fontFamily: theme.fonts.main }}>Enable {type} Schedule</h4>
                    <p style={{ fontSize: '12px', color: theme.colors.textSec, margin: 0, fontFamily: theme.fonts.main }}>If disabled, this operation cannot be performed at any time.</p>
                </div>
                <ToggleSwitch checked={isEnabled} onChange={setIsEnabled} />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px', marginBottom: '24px' }}>
                {/* Time Settings */}
                <div>
                    <div style={styles.sectionTitle}><Clock size={16} /> Daily Time Window</div>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                        <div><label style={styles.label}>Start Hour</label><input type="number" style={styles.input} placeholder="00" /></div>
                        <div><label style={styles.label}>Start Min</label><input type="number" style={styles.input} placeholder="00" /></div>
                        <div><label style={styles.label}>End Hour</label><input type="number" style={styles.input} placeholder="23" /></div>
                        <div><label style={styles.label}>End Min</label><input type="number" style={styles.input} placeholder="59" /></div>
                    </div>
                </div>
                {/* Date Settings */}
                <div>
                    <div style={styles.sectionTitle}><Calendar size={16} /> Effective Duration</div>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                        <div><label style={styles.label}>Start Week</label><input type="number" style={styles.input} /></div>
                        <div><label style={styles.label}>Start Month</label><input type="number" style={styles.input} /></div>
                        <div><label style={styles.label}>End Week</label><input type="number" style={styles.input} /></div>
                        <div><label style={styles.label}>End Month</label><input type="number" style={styles.input} /></div>
                    </div>
                </div>
            </div>
            
            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                <button style={styles.button} onClick={handleUpdateClick}>
                    Update {type} Schedule
                </button>
            </div>

            {/* --- PASSWORD MODAL --- */}
            <PasswordConfirmationModal 
                isOpen={isPasswordModalOpen}
                onClose={() => setIsPasswordModalOpen(false)}
                onConfirm={handlePasswordConfirmed}
                actionTitle={`Update ${type} Schedule`}
            />
        </div>
    );
};

// --- MAIN COMPONENT ---

const OperationalScheduling = () => {
    const [activeScheduleTab, setActiveScheduleTab] = useState('claim'); 

    // Mapped correctly for ButtonGroup usage (id and label)
    const scheduleTabs = [
        { id: 'claim', label: 'Student Claim' },
        { id: 'meal', label: 'Submit Meal Request' },
        { id: 'assign', label: 'Assign Credits' },
        { id: 'remove', label: 'Remove Credits' },
    ];

    const cardStyle = {
        backgroundColor: theme.colors.white, borderRadius: theme.radius.lg,
        boxShadow: theme.shadows.sm, border: `1px solid ${theme.colors.border}`,
        padding: '24px', fontFamily: theme.fonts.main,
    };

    return (
        <section style={cardStyle}>
            <div style={{ marginBottom: '24px' }}>
                <h2 style={{ fontSize: '18px', fontWeight: '700', color: theme.colors.textMain, marginBottom: '4px' }}>Operational Scheduling</h2>
                <p style={{ fontSize: '14px', color: theme.colors.textSec }}>Configure time windows and effective dates for specific system operations.</p>
            </div>

            <div style={{ marginBottom: '32px' }}>
                {/* IMPLEMENTATION OF BUTTON GROUP */}
                <ButtonGroup 
                    buttonListGroup={scheduleTabs}
                    activeId={activeScheduleTab}
                    onSetActiveId={setActiveScheduleTab}
                    activeColor={theme.colors.primary}
                />
            </div>

            <div style={{ minHeight: '300px' }}>
                {/* We pass the key prop here so React re-mounts the form (and its local state) when the tab changes */}
                <ScheduleConfigForm 
                    key={activeScheduleTab} 
                    type={scheduleTabs.find(t => t.id === activeScheduleTab)?.label} 
                    data={{ enabled: true }} 
                />
            </div>
        </section>
    );
};

export { OperationalScheduling };