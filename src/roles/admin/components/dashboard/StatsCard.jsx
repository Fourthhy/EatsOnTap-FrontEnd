import React from 'react';
// IMPORT SKELETON (Adjust path if your folder structure differs)
import { Skeleton } from "../../../../components/global/Skeleton";

function StatsCard({ 
    title, 
    value, 
    subtitle, 
    acceptanceRate, 
    expectingPostiveResult, 
    isPercentage,
    isLoading = false // NEW PROP
}) {

    const calculatedColor =
        expectingPostiveResult === true 
            ? value >= acceptanceRate 
                ? "#10B981" 
                : "#EF4444" 

            : expectingPostiveResult === false 
                ? value <= acceptanceRate 
                    ? "#10B981" 
                    : "#EF4444" 

                : "#4C4B4B"; 

    return (
        <div style={{
            background: "#fff", 
            borderRadius: 12, 
            boxShadow: "0 1px 6px #e5eaf0",
            padding: 20, 
            display: "flex", 
            flexDirection: "column", 
            width: '100%', 
            justifyContent: "center", 
            minHeight: "100px" // Ensure consistent height during loading
        }}>
            {isLoading ? (
                // --- SKELETON STATE ---
                <div className="flex flex-col w-full">
                    {/* Title Skeleton */}
                    <Skeleton className="h-3 w-3/4 rounded mb-2" />
                    
                    {/* Value Skeleton (Taller to match font size 20) */}
                    <Skeleton className="h-6 w-1/2 rounded mb-2" />
                    
                    {/* Subtitle Skeleton */}
                    <Skeleton className="h-3 w-2/3 rounded" />
                </div>
            ) : (
                // --- REAL DATA STATE ---
                <>
                    <span
                        style={{
                            fontWeight: "500",
                            fontSize: 12,
                            color: "#000000",
                            fontFamily: "geist"
                        }}
                    >
                        {title}
                    </span>
                    <span
                        style={{
                            fontSize: 20,
                            fontWeight: "500",
                            margin: "8px 0",
                            color: calculatedColor,
                            fontFamily: "geist"
                        }}
                    >
                        {value}{isPercentage ? "%" : ""}
                    </span>
                    <span
                        style={{
                            color: "#4C4B4B",
                            fontSize: 11,
                            fontFamily: "geist"
                        }}
                        >
                        {subtitle}
                    </span>
                </>
            )}
        </div >
    );
}

export {
    StatsCard
}