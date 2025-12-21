import React, { useState } from 'react';

// The Component
export function CustomStatsCard({ 
    title, 
    value, 
    subtitle, 
    isPercentage, 
    isPeso, 
    acceptableRate, 
    isHasAcceptableRange, 
    hoverText,      // Existing prop for the icon
    hoverValueText  // New prop for the value
}) {
    const [isHovered, setIsHovered] = useState(false);       // State for Icon hover
    const [isValueHovered, setIsValueHovered] = useState(false); // State for Value hover

    const acceptableIndicator = isHasAcceptableRange 
        ? (value >= acceptableRate[0] && value <= acceptableRate[1] ? "#0e7973ff" : "#CF7171") 
        : "#4C4B4B";

    // Reusing your styling for consistency
    const tooltipStyle = {
        position: 'absolute',
        backgroundColor: '#eeeeeeff',
        color: '#000000',
        padding: '5px 12px',
        borderRadius: '6px',
        fontSize: '11px',
        fontFamily: 'geist',
        fontWeight: '450',
        width: 'max-content',
        maxWidth: '200px',
        zIndex: 50,
        pointerEvents: 'none',
        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
    };

    return (
        <>
            <div style={{
                background: "#fff", 
                borderRadius: 12, 
                boxShadow: "0 1px 10px #e5eaf0",
                padding: 20, 
                display: "grid", 
                gridColumn: 1, 
                gridRow: 3, 
                flexDirection: "column", 
                width: '100%', 
                height: "100%",
                position: "relative" 
            }}>
                
                {/* --- HOVER ICON (Top Right) --- */}
                {hoverText && (
                    <div 
                        style={{ position: 'absolute', top: 20, right: 12, cursor: 'help' }}
                        onMouseEnter={() => setIsHovered(true)}
                        onMouseLeave={() => setIsHovered(false)}
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#9CA3AF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <circle cx="12" cy="12" r="10"></circle>
                            <line x1="12" y1="16" x2="12" y2="12"></line>
                            <line x1="12" y1="8" x2 ="12.01" y2="8"></line>
                        </svg>

                        {isHovered && (
                            <div style={{
                                ...tooltipStyle,
                                top: '20px',
                                right: '0px',
                            }}>
                                {hoverText}
                            </div>
                        )}
                    </div>
                )}

                {/* --- TITLE --- */}
                <div className="w-full h-full flex justify-center">
                    <span
                        style={{
                            fontWeight: "500",
                            fontSize: 13,
                            color: "#000000",
                            fontFamily: "geist",
                            width: "fit-content",
                            height: "fit-content",
                        }}
                        className="text-center"
                    >
                        {title}
                    </span>
                </div>

                {/* --- VALUE (With New Hover Logic) --- */}
                <div className="w-full h-full flex justify-center items-center">
                    {/* Wrapped in relative div to anchor the tooltip to the text */}
                    <div style={{ position: 'relative', display: 'flex', justifyContent: 'center' }}>
                        <span
                            onMouseEnter={() => setIsValueHovered(true)}
                            onMouseLeave={() => setIsValueHovered(false)}
                            style={{
                                fontSize: 25,
                                fontWeight: "500",
                                margin: "8px 0",
                                color: isHasAcceptableRange ? acceptableIndicator : "#4C4B4B",
                                fontFamily: "geist",
                                cursor: hoverValueText ? "help" : "default" // Change cursor if prop exists
                            }}
                        >
                            {isPeso ? "₱" : ""}{value}{isPercentage ? "%" : ""}
                        </span>

                        {/* Value Tooltip */}
                        {hoverValueText && isValueHovered && (
                            <div style={{
                                ...tooltipStyle,
                                bottom: '100%', // Display ABOVE the number
                                left: '50%',    // Center horizontally relative to number
                                transform: 'translateX(-50%)', 
                                marginBottom: '5px' // Small gap between text and tooltip
                            }}>
                                {hoverValueText}
                            </div>
                        )}
                    </div>
                </div>

                {/* --- SUBTITLE --- */}
                <div className="w-full h-full flex justify-center items-end">
                    <span
                        style={{
                            color: "#4C4B4B",
                            fontSize: 11,
                            fontFamily: "geist"
                        }}
                        className="text-center"
                    >
                        {subtitle}
                    </span>
                </div>
            </div >
        </>
    )
}

// Main App Component to render the Preview
export default function App() {
    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100 p-10">
            <div className="w-64 h-48">
                <CustomStatsCard 
                    title="Total Revenue" 
                    value={5240} 
                    subtitle="Vs last month" 
                    isPeso={true}
                    isHasAcceptableRange={true}
                    acceptableRate={[5000, 10000]}
                    hoverText="Total accumulated revenue before tax deductions."
                    hoverValueText="Raw Data: 5240.00"
                />
            </div>
        </div>
    );
}