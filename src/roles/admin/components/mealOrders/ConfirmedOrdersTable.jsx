// ConfirmedOrdersTable.jsx

import React from 'react';
import { Check, X } from 'lucide-react';

const ITEM_HEIGHT_ESTIMATE_PX = 40;

export const ConfirmedOrdersTable = ({ currentData, itemsPerPage }) => {
    return (
        <table style={{ width: '100%', textAlign: 'left', borderCollapse: 'collapse' }}>
            {/* FIX: Remove whitespace/line breaks inside <thead> */}
            <thead style={{ backgroundColor: '#f9fafb', position: 'sticky', top: 0, zIndex: 10 }}><tr>
                <th style={{ padding: '12px 24px', fontFamily: "geist", fontWeight: 450, color: '#667085', fontSize: '0.875rem' }}>Section/Program</th>
                <th style={{ padding: '12px 24px', fontFamily: "geist", fontWeight: 450, color: '#667085', fontSize: '0.875rem' }}>Sender</th>
                <th style={{ padding: '12px 24px', fontFamily: "geist", fontWeight: 450, color: '#667085', fontSize: '0.875rem' }}>Recipient Count</th>
                <th style={{ padding: '12px 24px', fontFamily: "geist", fontWeight: 450, color: '#667085', fontSize: '0.875rem' }}>Waived Count</th>
                <th style={{ padding: '12px 24px', fontFamily: "geist", fontWeight: 450, color: '#667085', fontSize: '0.875rem' }}>Time Sent</th>
                <th style={{ padding: '12px 24px', fontFamily: "geist", fontWeight: 450, color: '#667085', fontSize: '0.875rem' }}>Status</th>
            </tr></thead>
            <tbody style={{ borderSpacing: 0, borderTop: '1px solid #f3f4f6' }}>
                {currentData.map((request, index) => {
                    const isApproved = request.status === 'Approved';
                    const statusColor = isApproved ? '#047857' : '#b91c1c';
                    const statusBg = isApproved ? '#d1fae5' : '#fee2e2';
                    const dotColor = isApproved ? '#10b981' : '#ef4444';
                    
                    return (
                        <tr key={request.id} className="hover:bg-gray-50 transition-colors" style={{ height: ITEM_HEIGHT_ESTIMATE_PX, borderBottom: '1px solid #f3f4f6' }}>
                            <td style={{ padding: '15px 24px', fontSize: '0.875rem', fontWeight: 500, color: '#1f2937' }}>{request.sectionProgram}</td>
                            <td style={{ padding: '15px 24px', fontSize: '0.875rem', color: '#4b5563' }}>{request.sender}</td>
                            <td style={{ padding: '15px 24px', fontSize: '0.875rem', color: '#4b5563' }}>{request.recipientCount}</td>
                            <td style={{ padding: '15px 24px', fontSize: '0.875rem', color: '#4b5563' }}>{request.waivedCount}</td>
                            <td style={{ padding: '15px 24px', fontSize: '0.875rem', color: '#4b5563' }}>{request.timeSent}</td>
                            <td style={{ padding: '15px 24px' }}>
                                <span style={{ 
                                    display: 'inline-flex', alignItems: 'center', gap: '0.375rem', padding: '0.375rem 0.75rem', 
                                    borderRadius: '9999px', fontSize: '0.75rem', fontWeight: 500,
                                    backgroundColor: statusBg, color: statusColor
                                }}>
                                    <span style={{ width: '0.375rem', height: '0.375rem', borderRadius: '9999px', backgroundColor: dotColor }}></span>
                                    {isApproved ? 'Approved' : 'Rejected'}
                                </span>
                            </td>
                        </tr>
                    );
                })}
                {/* Padding Rows */}
                {currentData.length < itemsPerPage && Array(itemsPerPage - currentData.length).fill(0).map((_, i) => (
                    <tr key={`pad-${i}`} style={{ height: ITEM_HEIGHT_ESTIMATE_PX, borderBottom: '1px solid #f3f4f6' }}>
                        <td colSpan="6"></td>
                    </tr>
                ))}
            </tbody>
        </table>
    );
};