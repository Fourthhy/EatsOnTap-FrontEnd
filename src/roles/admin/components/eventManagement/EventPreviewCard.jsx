import React from 'react';
import { Calendar, Tag } from 'lucide-react';

// You might want to move this to your data.js or constants file if shared
const EVENT_COLORS = [
    { name: 'Blue',   value: '#dbeafe', text: '#1e40af' },
    { name: 'Red',    value: '#fee2e2', text: '#991b1b' },
    { name: 'Green',  value: '#dcfce7', text: '#166534' },
    { name: 'Yellow', value: '#fef9c3', text: '#854d0e' },
    { name: 'Orange', value: '#ffedd5', text: '#9a3412' },
    { name: 'Violet', value: '#f3e8ff', text: '#6b21a8' },
];

const EventPreviewCard = ({ 
    selectedColor, 
    eventDate, 
    eventName, 
    selectedPrograms = [], 
    selectedDepartments = [] 
}) => {
    
    // Logic to determine text color based on background
    const currentColorObj = EVENT_COLORS.find(c => c.value === selectedColor) || EVENT_COLORS[0];

    return (
        <div style={{
            width: '280px', // Fixed width for preview
            height: '380px',
            backgroundColor: selectedColor || EVENT_COLORS[0].value,
            borderRadius: '16px',
            padding: '24px',
            display: 'flex',
            flexDirection: 'column',
            boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
            transition: 'background-color 0.3s ease',
            position: 'relative'
        }}>
            {/* Date Badge */}
            <div style={{ 
                backgroundColor: 'rgba(255,255,255,0.6)', 
                padding: '4px 10px', 
                borderRadius: '8px', 
                alignSelf: 'flex-start',
                marginBottom: '20px',
                fontSize: 12,
                fontWeight: 600,
                fontFamily: 'geist',
                color: currentColorObj.text,
                display: 'flex',
                alignItems: 'center',
                gap: 6
            }}>
                <Calendar size={12} />
                {eventDate ? new Date(eventDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) : 'Date'}
            </div>

            {/* Event Title & Subtitle */}
            <div style={{ flex: 1 }}>
                <h3 style={{ 
                    fontFamily: 'geist', 
                    fontSize: 24, 
                    fontWeight: 600, 
                    color: currentColorObj.text,
                    lineHeight: 1.2,
                    wordBreak: 'break-word'
                }}>
                    {eventName || "Event Title Goes Here"}
                </h3>
                
                <div style={{ marginTop: 8, fontSize: 13, color: currentColorObj.text, opacity: 0.8, fontFamily: 'geist' }}>
                    {selectedPrograms.length > 0 
                        ? `${selectedPrograms.length} section${selectedPrograms.length !== 1 ? 's' : ''} selected`
                        : "No sections selected"}
                </div>
            </div>

            {/* Departments Footer */}
            <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginTop: 'auto' }}>
                {selectedDepartments.length > 0 ? (
                    selectedDepartments.slice(0, 3).map((dept, i) => (
                        <span key={i} style={{ 
                            fontSize: 10, 
                            backgroundColor: 'white', 
                            padding: '4px 8px', 
                            borderRadius: 20, 
                            fontFamily: 'geist',
                            color: currentColorObj.text,
                            fontWeight: 500
                        }}>
                            {dept}
                        </span>
                    ))
                ) : (
                    <div style={{ display: 'flex', alignItems: 'center', gap: 4, opacity: 0.5 }}>
                        <Tag size={14} color={currentColorObj.text} />
                        <span style={{ fontSize: 12, fontFamily: 'geist', color: currentColorObj.text }}>Departments</span>
                    </div>
                )}
                
                {selectedDepartments.length > 3 && (
                    <span style={{ fontSize: 10, backgroundColor: 'white', padding: '4px 8px', borderRadius: 20, fontFamily: 'geist', color: currentColorObj.text }}>
                        +{selectedDepartments.length - 3}
                    </span>
                )}
            </div>
        </div>
    );
};

export {EventPreviewCard};