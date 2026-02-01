import React, { useState, useEffect } from 'react';
import { Lock, X, Eye, EyeOff } from 'lucide-react';

const PasswordConfirmationModal = ({ isOpen, onClose, onConfirm, actionTitle = "Save Changes" }) => {
    // --- STATE ---
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [isRendered, setIsRendered] = useState(false);
    const [isVisible, setIsVisible] = useState(false);

    // --- ANIMATION LOGIC ---
    useEffect(() => {
        if (isOpen) {
            setIsRendered(true);
            const timer = setTimeout(() => setIsVisible(true), 10);
            return () => clearTimeout(timer);
        } else {
            setIsVisible(false);
            const timer = setTimeout(() => setIsRendered(false), 200);
            return () => clearTimeout(timer);
        }
    }, [isOpen]);

    // Reset password when opening
    useEffect(() => {
        if (isOpen) setPassword('');
    }, [isOpen]);

    if (!isRendered) return null;

    // --- STYLES ---
    const theme = {
        fonts: { main: "'Geist', sans-serif" },
        colors: { primary: '#4268BD', textMain: '#111827', textSec: '#6B7280', border: '#E5E7EB' }
    };

    const overlayStyle = {
        position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.4)',
        backdropFilter: 'blur(4px)',
        zIndex: 9500,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        opacity: isVisible ? 1 : 0,
        transition: 'opacity 0.2s ease-in-out'
    };

    const modalStyle = {
        backgroundColor: 'white',
        width: '400px',
        borderRadius: '12px',
        boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)',
        padding: '24px',
        position: 'relative',
        transform: isVisible ? 'scale(1) translateY(0)' : 'scale(0.95) translateY(10px)',
        opacity: isVisible ? 1 : 0,
        transition: 'transform 0.2s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.2s ease',
        fontFamily: theme.fonts.main
    };

    const handleConfirmClick = (e) => {
        e.preventDefault();
        onConfirm(password);
    };

    return (
        <div style={overlayStyle} onClick={onClose}>
            <div style={modalStyle} onClick={e => e.stopPropagation()}>
                
                {/* Header */}
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px', marginBottom: '20px' }}>
                    <div style={{ padding: '10px', backgroundColor: '#EFF6FF', borderRadius: '50%', color: theme.colors.primary }}>
                        <Lock size={20} />
                    </div>
                    <div>
                        <h3 style={{ margin: 0, fontSize: '16px', fontWeight: '600', color: theme.colors.textMain }}>Security Verification</h3>
                        <p style={{ margin: '4px 0 0 0', fontSize: '13px', color: theme.colors.textSec }}>
                            Please enter your password to confirm <strong>{actionTitle}</strong>.
                        </p>
                    </div>
                    <button onClick={onClose} style={{ border: 'none', background: 'transparent', cursor: 'pointer', color: '#9CA3AF', marginLeft: 'auto' }}>
                        <X size={20} />
                    </button>
                </div>

                {/* Input Form */}
                <form onSubmit={handleConfirmClick}>
                    <div style={{ position: 'relative', marginBottom: '24px' }}>
                        <input 
                            type={showPassword ? "text" : "password"} 
                            placeholder="Enter Administrator Password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            autoFocus
                            style={{
                                width: '100%', padding: '10px 40px 10px 12px',
                                border: `1px solid ${theme.colors.border}`, borderRadius: '8px',
                                fontSize: '14px', outline: 'none', color: theme.colors.textMain,
                                fontFamily: theme.fonts.main
                            }}
                        />
                        <button 
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            style={{
                                position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)',
                                border: 'none', background: 'transparent', cursor: 'pointer', color: '#9CA3AF'
                            }}
                        >
                            {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                        </button>
                    </div>

                    {/* Actions */}
                    <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
                        <button 
                            type="button"
                            onClick={onClose}
                            style={{
                                padding: '8px 16px', borderRadius: '6px', border: `1px solid ${theme.colors.border}`,
                                backgroundColor: 'white', color: '#374151', fontSize: '13px', fontWeight: '500', cursor: 'pointer',
                                fontFamily: theme.fonts.main
                            }}
                        >
                            Cancel
                        </button>
                        <button 
                            type="submit"
                            disabled={!password}
                            style={{
                                padding: '8px 16px', borderRadius: '6px', border: 'none',
                                backgroundColor: password ? theme.colors.primary : '#9CA3AF', 
                                color: 'white', fontSize: '13px', fontWeight: '500', cursor: password ? 'pointer' : 'not-allowed',
                                fontFamily: theme.fonts.main, transition: 'background-color 0.2s'
                            }}
                        >
                            Confirm
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export { PasswordConfirmationModal };