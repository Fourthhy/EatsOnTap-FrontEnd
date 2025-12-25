import React, { useState } from 'react';
import { Save } from 'lucide-react';
import { PasswordConfirmationModal } from './PasswordConfirmationModal'; // Import the modal

const VirtualCreditConfiguration = () => {
    // --- STATE ---
    const [creditValue, setCreditValue] = useState(50);
    const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);

    // --- HANDLERS ---
    const handleSaveClick = () => {
        setIsPasswordModalOpen(true);
    };

    const handlePasswordConfirmed = (password) => {
        // Here you would make an API call to verify password and save settings
        console.log(`Saving Credit Value: ${creditValue} with password: ${password}`);
        
        // Simulating success
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
        },
        fonts: { main: "'Geist', sans-serif" },
        // UPDATED: Changed all radius values to 6px
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
        button: {
            backgroundColor: theme.colors.primary, color: theme.colors.whiteText, border: 'none',
            borderRadius: theme.radius.md, padding: '10px 20px', fontSize: '14px',
            fontWeight: '500', cursor: 'pointer', fontFamily: theme.fonts.main
        },
        // UPDATED: Changed borderRadius to 6px
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
                        onChange={(e) => setCreditValue(e.target.value)}
                    />
                </div>
                <button style={styles.button} onClick={handleSaveClick}>
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