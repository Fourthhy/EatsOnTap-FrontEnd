import React, { useState } from 'react';
import { VirtualCreditConfiguration } from '../systemSettings/VirtualCreditConfiguration';
import { OperationalScheduling } from '../systemSettings/OperationalScheduling';
import { SystemActivationControl } from '../systemSettings/SystemActivationControl';
import { motion } from 'framer-motion';

const SystemSettings = () => {
    const [systemStatus, setSystemStatus] = useState('active'); // 'active' or 'inactive'

    const pageContainerStyle = {
        maxWidth: '896px', // 4xl
        margin: '0 auto',
        padding: '24px 12px',
        paddingBottom: '80px',
        display: 'flex',
        flexDirection: 'column',
        gap: '20px',
    };

    return (
        <div style={pageContainerStyle}>
            {/* 1. VIRTUAL CREDIT SETTINGS */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ type: "spring", delay: 0.2 }}>
                <VirtualCreditConfiguration />
            </motion.div>

            {/* 2. OPERATIONAL SCHEDULING */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ type: "spring", delay: 0.4 }}>
                <OperationalScheduling />
            </motion.div>

            {/* 3. SYSTEM ACTIVATION */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ type: "spring", delay: 0.8 }}>
                <SystemActivationControl
                    systemStatus={systemStatus}
                    setSystemStatus={setSystemStatus}
                />
            </motion.div>
        </div>
    );
};

export default SystemSettings;