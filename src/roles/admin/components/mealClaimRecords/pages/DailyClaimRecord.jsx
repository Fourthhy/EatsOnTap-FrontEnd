import React, { useState, useMemo } from 'react';
import { User, ArrowLeft, Coins, CreditCard } from 'lucide-react';
import { GenericTable } from '../../../../../components/global/table/GenericTable';
import { useData } from '../../../../../context/DataContext';

// --- 🟢 1. UNIFORM STATUS BADGE ---
const ClaimStatusBadge = ({ type }) => {
    const styles = {
        'ELIGIBLE': { bg: '#d1fae5', text: '#065f46', dot: '#059669', label: 'Eligible' },
        'CLAIMED': { bg: '#dbeafe', text: '#1e40af', dot: '#2563eb', label: 'Claimed' },
        'WAIVED': { bg: '#f3f4f6', text: '#4b5563', dot: '#9ca3af', label: 'Waived' }
    };

    const s = styles[type] || styles['ELIGIBLE'];

    return (
        <span style={{
            display: 'inline-flex', alignItems: 'center', gap: '6px',
            padding: '2px 10px', borderRadius: '999px',
            fontSize: '12px', fontWeight: 500,
            backgroundColor: s.bg, color: s.text,
            height: '24px', // 🟢 Fixed height for perfect alignment
            whiteSpace: 'nowrap'
        }}>
            <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: s.dot }} />
            {s.label}
        </span>
    );
};

// --- 🟢 2. UNIFORM FINANCE BADGE (Matches Status Badge Exactly) ---
const FinanceBadge = ({ amount, type }) => {
    const isCredit = type === 'credit';

    // Style Config
    const config = isCredit
        ? { bg: '#fff7ed', text: '#c2410c', icon: CreditCard } // Orange for Credit
        : { bg: '#eff6ff', text: '#2563eb', icon: Coins };     // Blue for Cash

    const Icon = config.icon;

    return (
        <span style={{
            display: 'inline-flex', alignItems: 'center', gap: '6px',
            padding: '2px 10px', borderRadius: '999px',
            fontSize: '12px', fontWeight: 500,
            backgroundColor: config.bg, color: config.text,
            height: '24px', // 🟢 Fixed height for perfect alignment
            whiteSpace: 'nowrap'
        }}>
            <Icon size={12} strokeWidth={2.5} />
            ₱{amount.toFixed(2)}
        </span>
    );
};

const Avatar = () => (
    <div style={{
        width: 32, height: 32, borderRadius: 9999,
        backgroundColor: '#e5e7eb', color: '#6b7280',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        overflow: 'hidden', marginRight: 12
    }}>
        <User size={16} />
    </div>
);

const DailyClaimRecord = ({ switchView, sectionData }) => {
    const { schoolData = [] } = useData();
    const [searchTerm, setSearchTerm] = useState('');

    // --- DATA PROCESSING ---
    const processedStudents = useMemo(() => {
        if (!sectionData || !sectionData.claimData || !sectionData.claimData.eligibleStudents) {
            return [];
        }

        const { eligibleStudents } = sectionData.claimData;
        const studentList = [];

        const findStudentInfo = (targetId) => {
            for (const category of schoolData) {
                if (category.levels) {
                    for (const level of category.levels) {
                        if (level.sections) {
                            for (const section of level.sections) {
                                if (section.students) {
                                    const found = section.students.find(s => s.studentId === targetId);
                                    if (found) return found;
                                }
                            }
                        }
                    }
                }
            }
            return null;
        };

        eligibleStudents.forEach(claimRecord => {
            const studentInfo = findStudentInfo(claimRecord.studentID);

            studentList.push({
                id: claimRecord.studentID,
                studentId: claimRecord.studentID,
                name: studentInfo ? studentInfo.name : 'Unknown Student',
                claimType: claimRecord.claimType,
                creditBalance: claimRecord.creditBalance || 0,
                onHandCash: claimRecord.onHandCash || 0,
                section: sectionData.sectionInfo.sectionProgram
            });
        });

        return studentList;
    }, [sectionData, schoolData]);

    const filteredStudents = useMemo(() => {
        if (!searchTerm) return processedStudents;
        const lowerSearch = searchTerm.toLowerCase();

        return processedStudents.filter(s =>
            s.name.toLowerCase().includes(lowerSearch) ||
            s.studentId.toLowerCase().includes(lowerSearch)
        );
    }, [processedStudents, searchTerm]);


    // --- ACTIONS ---
    const handleBack = () => {
        switchView('eligible');
    };

    // --- RENDER ROW ---
    const renderRow = (student, index) => {
        const cellStyle = {
            fontFamily: 'geist, sans-serif', fontSize: '12px', color: '#4b5563',
            borderBottom: '1px solid #f3f4f6', height: '43.5px', verticalAlign: 'middle'
        };

        return (
            <tr key={student.id} className="hover:bg-gray-50 transition-colors">
                <td></td>
                <td style={{ ...cellStyle, fontWeight: 500, color: '#111827', paddingLeft: '24px' }}>
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                        <Avatar />
                        <span>{student.name}</span>
                    </div>
                </td>

                <td style={cellStyle}>{student.studentId}</td>

                <td style={cellStyle}>
                    <ClaimStatusBadge type={student.claimType} />
                </td>

                {/* 🟢 Using Uniform Finance Badges */}
                <td style={cellStyle}>
                    <FinanceBadge amount={student.creditBalance} type="credit" />
                </td>

                <td style={cellStyle}>
                    <FinanceBadge amount={student.onHandCash} type="cash" />
                </td>
            </tr>
        );
    };

    if (!sectionData) return null;

    return (
        <GenericTable
            title={`Claim Records: ${sectionData.sectionInfo.sectionProgram}`}
            subtitle={`Daily breakdown for ${new Date().toLocaleDateString()}`}
            data={filteredStudents}
            columns={['Student Name', 'Student ID', 'Status', 'Credit Balance', 'On Hand Cash']}
            renderRow={renderRow}

            searchTerm={searchTerm}
            onSearchChange={setSearchTerm}

            metrics={[
                { label: 'Total Students', value: processedStudents.length },
                { label: 'Eligible', value: processedStudents.filter(s => s.claimType === 'ELIGIBLE').length, color: '#059669' },
                { label: 'Claimed', value: processedStudents.filter(s => s.claimType === 'CLAIMED').length, color: '#2563eb' }
            ]}

            onPrimaryAction={handleBack}
            primaryActionLabel={"Back to Sections"}
            primaryActionIcon={<ArrowLeft size={16} />}
        />
    );
};

export { DailyClaimRecord };