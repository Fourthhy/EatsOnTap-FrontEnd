import React, { useState, useMemo } from 'react';
import { User, CheckCircle, List, BarChart3 } from 'lucide-react';
import { GenericTable } from '../../../../../components/global/table/GenericTable'; 
import { generateData } from '../mockData'; 
import { motion } from 'framer-motion'; // 🟢 Import Motion

// 🟢 Switcher Button
const SwitcherButton = ({ mode, currentMode, icon, label, onClick }) => {
    const [isHovered, setIsHovered] = useState(false);
    const isActive = currentMode === mode;
    const shouldExpand = isActive || isHovered;

    return (
        <button
            onClick={onClick}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            style={{
                padding: '6px 10px',
                borderRadius: '6px',
                fontSize: '12px',
                fontWeight: 500,
                border: 'none',
                cursor: 'pointer',
                backgroundColor: isActive ? 'white' : 'transparent',
                color: isActive ? '#4268BD' : '#6b7280',
                boxShadow: isActive ? '0 1px 2px 0 rgba(0, 0, 0, 0.05)' : 'none',
                transition: 'background-color 200ms ease, color 200ms ease',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                height: '32px',
                outline: 'none'
            }}
        >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                {icon}
            </div>

            <motion.span
                initial={false}
                animate={{
                    width: shouldExpand ? 'auto' : 0,
                    opacity: shouldExpand ? 1 : 0
                }}
                transition={{ type: "spring", stiffness: 500, damping: 30 }}
                style={{
                    overflow: 'hidden',
                    whiteSpace: 'nowrap',
                    display: 'inline-block'
                }}
            >
                {label}
            </motion.span>
        </button>
    );
};

// --- REUSABLE SUB-COMPONENTS ---
const ClaimStatusBadge = ({ isClaimed }) => {
    const status = isClaimed ? 'Claimed' : 'Unclaimed';
    const styles = {
        Claimed: { backgroundColor: '#d1fae5', color: '#047857', dotColor: '#10b981', text: 'Claimed' },
        Unclaimed: { backgroundColor: '#fee2e2', color: '#b91c1c', dotColor: '#ef4444', text: 'Unclaimed' }
    };
    const currentStyle = styles[status];
    return (
        <span
            className="text-xs font-medium" 
            style={{
                padding: '4px 12px', borderRadius: 12, display: 'flex', alignItems: 'center',
                gap: '6px', backgroundColor: currentStyle.backgroundColor, color: currentStyle.color,
                width: 'fit-content'
            }}
        >
            <span style={{ width: '6px', height: '6px', borderRadius: 12, backgroundColor: currentStyle.dotColor }}></span>
            <span>{currentStyle.text}</span>
        </span>
    );
};

const Avatar = () => (
    <div style={{ 
        width: 32, height: 32, borderRadius: 9999, 
        backgroundColor: '#e5e7eb', 
        color: '#6b7280', 
        display: 'flex', alignItems: 'center', justifyContent: 'center', 
        overflow: 'hidden', marginRight: 12 
    }}>
        <User size={16} />
    </div>
);

const DailyClaimRecord = ({ switchView, currentView }) => { 
    // --- STATE ---
    const [activeTab, setActiveTab] = useState('All');
    const [searchTerm, setSearchTerm] = useState('');
    
    // --- DATA PREP ---
    const baseStudents = useMemo(() => generateData(), []);

    const allStudents = useMemo(() => {
        return baseStudents.map((student, index) => ({
            ...student,
            isClaimed: index % 3 === 0,
            claimTime: (index % 4) === 0 ? '11:00 AM' : '12:30 PM',
            mealTypeClaim: (index % 2) === 0 ? 'Customized Order' : 'Pre-Packed Food',
            valueClaimed: 'P60'
        }));
    }, [baseStudents]);

    // --- FILTERING LOGIC ---
    const filteredStudents = useMemo(() => {
        const lowerCaseSearch = searchTerm.toLowerCase();

        return allStudents.filter(student => {
            // 1. Tab Logic
            let matchesTab = true;
            const program = student.program || ""; 

            if (activeTab !== 'All') {
                switch (activeTab) {
                    case 'Preschool': matchesTab = program.includes('Kinder'); break;
                    case 'Primary Education':
                    case 'Intermediate': 
                    case 'Junior High School': 
                    case 'Senior High School': 
                    case 'Higher Education': matchesTab = (student.type === 'Regular' || student.type === 'Irregular'); break;
                    default: matchesTab = false;
                }
            }

            // 2. Multi-field Search
            const searchFields = [
                student.name, 
                student.studentId, 
                student.program, 
                student.claimTime, 
                student.isClaimed ? 'claimed' : 'unclaimed',
                student.mealTypeClaim, 
                student.valueClaimed
            ];

            const matchesSearch = searchFields.some(field => 
                field && field.toLowerCase().includes(lowerCaseSearch)
            );

            return matchesTab && matchesSearch;
        });
    }, [allStudents, searchTerm, activeTab]);

    // --- CONFIGURATION ---

    const tabs = [
        'All', 'Preschool', 'Primary Education', 'Intermediate',
        'Junior High School', 'Senior High School', 'Higher Education'
    ].map(t => ({ id: t, label: t }));

    // --- RENDER ROW ---
    const renderRow = (student, index, startIndex) => {
        const cellStyle = {
            fontFamily: 'geist, sans-serif',
            fontSize: '12px',
            color: '#4b5563',
            padding: '6px 0px',
            borderBottom: '1px solid #f3f4f6'
        };
        
        return (
            <tr key={student.id} className="hover:bg-gray-50/80 transition-colors group">
                <td style={{ ...cellStyle, textAlign: 'center', width: '48px' }}>
                    {startIndex + index + 1}
                </td>
                
                <td style={{ ...cellStyle, fontWeight: 500, color: '#111827' }}>
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                        <Avatar />
                        <span>{student.name}</span>
                    </div>
                </td>
                
                <td style={cellStyle}>{student.studentId}</td>
                <td style={cellStyle}>{student.program}</td>
                <td style={cellStyle}>{student.claimTime}</td>
                <td style={cellStyle}>
                    <ClaimStatusBadge isClaimed={student.isClaimed} />
                </td>
                <td style={cellStyle}>{student.mealTypeClaim}</td>
                <td style={cellStyle}>{student.valueClaimed}</td>
            </tr>
        );
    };

    const viewSwitcher = (
        <div style={{ backgroundColor: '#f3f4f6', padding: '4px', borderRadius: '8px', display: 'flex', gap: '4px', margin: "5px" }}>
            <SwitcherButton 
                mode="eligible" 
                currentMode={currentView} 
                icon={<CheckCircle size={14} />} 
                label="Eligible Sections" 
                onClick={() => switchView('eligible')} 
            />
            <SwitcherButton 
                mode="daily" 
                currentMode={currentView} 
                icon={<List size={14} />} 
                label="Daily Record" 
                onClick={() => switchView('daily')} 
            />
            <SwitcherButton 
                mode="overall" 
                currentMode={currentView} 
                icon={<BarChart3 size={14} />} 
                label="Overall Record" 
                onClick={() => switchView('overall')} 
            />
        </div>
    );

    return (
        <GenericTable
            title="All Meal Claim Records"
            subtitle="This table is about students' history of meal claiming."
            data={filteredStudents}
            columns={['Student Name', 'Student ID', 'Program/Section', 'Claim Time', 'Status', 'Meal Type', 'Value']}
            renderRow={renderRow}

            tabs={tabs}
            activeTab={activeTab}
            onTabChange={setActiveTab}
            
            // 🟢 Pass the Switcher here
            customActions={viewSwitcher}

            searchTerm={searchTerm}
            onSearchChange={setSearchTerm}

            metrics={[
                { label: 'Eligible', value: baseStudents.filter(s => s.status === 'Eligible').length, color: '#037847' },
                { label: 'Ineligible', value: baseStudents.filter(s => s.status === 'Ineligible').length, color: '#8B0000' },
                { label: 'Total Claims', value: allStudents.length }
            ]}

            minItems={4}
            maxItems={13}
        />
    );
};

export { DailyClaimRecord };