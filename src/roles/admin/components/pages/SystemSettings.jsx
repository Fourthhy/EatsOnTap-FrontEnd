import React, { useState } from 'react';
import { VirtualCreditConfiguration } from '../systemSettings/VirtualCreditConfiguration';
import { OperationalScheduling } from '../systemSettings/OperationalScheduling';
import { SystemActivationControl } from '../systemSettings/SystemActivationControl';

const SystemSettings = () => {
    const [systemStatus, setSystemStatus] = useState('active'); // 'active' or 'inactive'

    const pageContainerStyle = {
        maxWidth: '896px', // 4xl
        margin: '0 auto',
        padding: '24px',
        paddingBottom: '80px',
        display: 'flex',
        flexDirection: 'column',
        gap: '32px',
    };

    return (
        <div style={pageContainerStyle}>
            {/* 1. VIRTUAL CREDIT SETTINGS */}
            <VirtualCreditConfiguration />

            {/* 2. OPERATIONAL SCHEDULING */}
            <OperationalScheduling />

            {/* 3. SYSTEM ACTIVATION */}
            <SystemActivationControl 
                systemStatus={systemStatus} 
                setSystemStatus={setSystemStatus} 
            />
        </div>
    );
};

export {SystemSettings};