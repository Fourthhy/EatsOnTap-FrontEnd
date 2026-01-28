import React, { useState } from 'react';
// IMPORT SKELETON (Adjust path as needed)
import { Skeleton } from '../../../../components/global/Skeleton';

export function CustomStatsCard({ 
    title, 
    value, 
    subtitle, 
    isPercentage, 
    isPeso, 
    acceptableRate, 
    isHasAcceptableRange, 
    hoverText,      
    hoverValueText,
    isLoading = false // NEW PROP
}) {
    const [isHovered, setIsHovered] = useState(false);      
    const [isValueHovered, setIsValueHovered] = useState(false); 

    const acceptableIndicator = isHasAcceptableRange 
        ? (value >= acceptableRate[0] && value <= acceptableRate[1] ? "#10B981" : "#EF4444") 
        : "#4C4B4B";

    const tooltipStyle = {
        position: 'absolute',
        backgroundColor: '#eeeeeeff',
        color: '#111827',
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
        <div style={{
            background: "#fff", 
            borderRadius: 12, 
            boxShadow: "0 1px 10px #e5eaf0",
            padding: 20, 
            display: "flex", // Changed to Flex for easier centering
            flexDirection: "column", 
            justifyContent: "space-between",
            width: '100%', 
            height: "100%",
            position: "relative",
            minHeight: "130px" // Ensure height during loading
        }}>
            
            {/* --- LOADING STATE --- */}
            {isLoading ? (
                <div className="flex flex-col items-center justify-center w-full h-full gap-4">
                    {/* Title Skeleton */}
                    <Skeleton className="h-4 w-3/4 rounded" />
                    
                    {/* Value Skeleton (Big Block) */}
                    <Skeleton className="h-8 w-1/2 rounded" />
                    
                    {/* Subtitle Skeleton */}
                    <Skeleton className="h-3 w-1/2 rounded" />
                </div>
            ) : (
                /* --- REAL CONTENT --- */
                <>
                    {/* --- HOVER ICON --- */}
                    {hoverText && (
                        <div 
                            style={{ position: 'absolute', top: 8, right: 8, cursor: 'help' }}
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
                    <div className="w-full flex justify-center mt-2">
                        <span style={{
                            fontWeight: "500", fontSize: 13, color: "#111827", fontFamily: "geist",
                            textAlign: "center"
                        }}>
                            {title}
                        </span>
                    </div>

                    {/* --- VALUE --- */}
                    <div className="w-full flex justify-center items-center flex-1">
                        <div style={{ position: 'relative', display: 'flex', justifyContent: 'center' }}>
                            <span
                                onMouseEnter={() => setIsValueHovered(true)}
                                onMouseLeave={() => setIsValueHovered(false)}
                                style={{
                                    fontSize: 30,
                                    fontWeight: "500",
                                    margin: "8px 0",
                                    color: isHasAcceptableRange ? acceptableIndicator : "#111827",
                                    fontFamily: "geist",
                                    cursor: hoverValueText ? "help" : "default"
                                }}
                            >
                                {isPeso ? "₱" : ""}{value}{isPercentage ? "%" : ""}
                            </span>

                            {hoverValueText && isValueHovered && (
                                <div style={{
                                    ...tooltipStyle,
                                    bottom: '100%', left: '50%', transform: 'translateX(-50%)', marginBottom: '5px'
                                }}>
                                    {hoverValueText}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* --- SUBTITLE --- */}
                    <div className="w-full flex justify-center items-end mb-1">
                        <span style={{ color: "#4C4B4B", fontSize: 11, fontFamily: "geist", textAlign: "center" }}>
                            {subtitle}
                        </span>
                    </div>
                </>
            )}
        </div >
    );
}