import React, { useState, useEffect } from 'react';
import { Save } from 'lucide-react';
import { PasswordConfirmationModal } from './PasswordConfirmationModal'; 
import { useData } from '../../../../context/DataContext';

const VirtualCreditConfiguration = () => {
    // --- STATE ---
    const { mealValue } = useData();
    
    // Initialize with empty string to prevent "uncontrolled input" warning
    const [creditValue, setCreditValue] = useState(mealValue || ''); 
    const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);

    // 🟢 SYNC: Update local state when context data loads
    useEffect(() => {
        if (mealValue !== undefined && mealValue !== null) {
            setCreditValue(mealValue);
        }
    }, [mealValue]);

    // 🟢 CHECK: Has the value changed?
    // Convert both to string to ensure safe comparison (input is string, data might be number)
    const hasChanges = creditValue !== '' && String(creditValue) !== String(mealValue);

    // --- HANDLERS ---
    const handleSaveClick = () => {
        if (!hasChanges) return; // Double check
        setIsPasswordModalOpen(true);
    };

    const handlePasswordConfirmed = (password) => {
        console.log(`Saving Credit Value: ${creditValue} with password: ${password}`);
        setIsPasswordModalOpen(false);
        alert("Settings Saved Successfully!");
    };

    // --- THEME & STYLES ---
    const theme = {
        colors: {
            primary: '#4268BD',
            whiteText: '#EEEEEE',
            white: '#FFFFFF',
            textMain: '#111827',
            textSec: '#6B7280',
            border: '#E5E7EB',
            inputBg: '#F9FAFB',
            disabled: '#9CA3AF', // Grey for disabled state
        },
        fonts: { main: "'Geist', sans-serif" },
        radius: { md: '6px', lg: '6px' },
        shadows: { sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)' }
    };

    const styles = {
        card: {
            backgroundColor: theme.colors.white,
            borderRadius: theme.radius.lg,
            boxShadow: theme.shadows.sm,
            border: `1px solid ${theme.colors.border}`,
            padding: '24px',
            fontFamily: theme.fonts.main,
        },
        headerText: { fontSize: '18px', fontWeight: '700', color: theme.colors.textMain, marginBottom: '4px' },
        subText: { fontSize: '14px', color: theme.colors.textSec },
        label: { display: 'block', fontSize: '12px', fontWeight: '500', color: theme.colors.textSec, marginBottom: '4px', fontFamily: theme.fonts.main },
        input: {
            width: '100%', padding: '10px', backgroundColor: theme.colors.inputBg,
            border: `1px solid ${theme.colors.border}`, borderRadius: theme.radius.md,
            fontSize: '14px', color: theme.colors.textMain, outline: 'none', fontFamily: theme.fonts.main
        },
        // 🟢 UPDATED BUTTON STYLE
        button: {
            backgroundColor: hasChanges ? theme.colors.primary : theme.colors.inputBg, // Blue if active, Light Grey if disabled
            color: hasChanges ? theme.colors.whiteText : theme.colors.disabled,        // White if active, Grey text if disabled
            border: hasChanges ? 'none' : `1px solid ${theme.colors.border}`,
            borderRadius: theme.radius.md, 
            padding: '10px 20px', 
            fontSize: '14px',
            fontWeight: '500', 
            cursor: hasChanges ? 'pointer' : 'not-allowed', 
            fontFamily: theme.fonts.main,
            transition: 'all 0.2s ease',
            opacity: hasChanges ? 1 : 0.8
        },
        iconBox: { padding: '8px', backgroundColor: '#EFF6FF', color: theme.colors.primary, borderRadius: '6px' }
    };

    return (
        <section style={styles.card}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '24px' }}>
                <div>
                    <h2 style={styles.headerText}>Virtual Credit Configuration</h2>
                    <p style={styles.subText}>Set the default credit value for transactions.</p>
                </div>
                <div style={styles.iconBox}>
                    <Save size={20} />
                </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'flex-end', gap: '16px' }}>
                <div style={{ flex: 1, maxWidth: '320px' }}>
                    <label style={styles.label}>Current Credit Value (₱)</label>
                    <input 
                        type="number" 
                        style={styles.input} 
                        value={creditValue}
                        placeholder={mealValue ? `Current: ${mealValue}` : "Loading..."}
                        onChange={(e) => setCreditValue(e.target.value)}
                    />
                </div>
                <button 
                    style={styles.button} 
                    onClick={handleSaveClick}
                    disabled={!hasChanges} // 🟢 Disable button logic
                >
                    Save Changes
                </button>
            </div>

            {/* --- PASSWORD CONFIRMATION MODAL --- */}
            <PasswordConfirmationModal 
                isOpen={isPasswordModalOpen}
                onClose={() => setIsPasswordModalOpen(false)}
                onConfirm={handlePasswordConfirmed}
                actionTitle="Virtual Credit Update"
            />
        </section>
    );
};

export { VirtualCreditConfiguration };