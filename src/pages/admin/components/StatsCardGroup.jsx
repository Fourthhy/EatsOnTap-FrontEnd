import { StatsCard } from "./StatsCard";
import { useState } from "react";

export function StatsCardGroup({ 
    primaryData = [], 
    secondaryData = [], 
    pendingMealRequest = 0,
    // 1. NEW PROPS with default fallback text
    successMessage = "Compliance is Excellent. Review Workflow is Highly Efficient",
    failureMessage = "Eligibility Compliance is Low. High Volume of Rejected Submissions"
}) {
    const [viewRejectedClaims, setViewRejectedClaims] = useState(false);

    function getTodayDate() {
        const today = new Date();
        const month = String(today.getMonth() + 1).padStart(2, '0');
        const day = String(today.getDate()).padStart(2, '0');
        const year = today.getFullYear();
        return `${month}/${day}/${year}`;
    }

    const dateToday = getTodayDate();

    // Determine the dataset to display based on toggle
    // Reversing to match your original Right-to-Left layout preference
    const currentData = viewRejectedClaims 
        ? [...secondaryData].reverse() 
        : [...primaryData].reverse();

    // Logic to check if the stats are "Good" or "Bad"
    // Based on the first item of the primary data
    const mainMetric = primaryData[0] || {}; 
    const { 
        value: val1, 
        acceptanceRate: rate1, 
        expectingPositiveResult: expectPos1 
    } = mainMetric;

    const summaryResult =
        expectPos1 === true
            ? val1 >= rate1
            : expectPos1 === false
                ? val1 <= rate1
                : false;

    return (
        <div
            style={{
                background: "#fff",
                borderRadius: 12,
                boxShadow: "0 2px 6px #e5eaf0",
                padding: 20,
            }}
            className="flex flex-col justify-evenly w-full h-full"
        >
            {/* ... Header and Buttons (Unchanged) ... */}
            <div style={{ paddingBottom: 5 }} className="w-full h-auto flex justify-between">
                <div style={{ display: "flex", flexDirection: "column", paddingLeft: 6 }}>
                    <span style={{ fontWeight: "500", fontSize: 14, color: "#000000", fontFamily: "geist", width: "fit-content", height: "fit-content" }}>
                        Meal Eligibility List Count
                    </span>
                    <span style={{ color: "#353535", fontSize: 12, fontFamily: "geist", width: "fit-content", height: "fit-content" }}>
                        {dateToday}
                    </span>
                </div>
                <div className="h-full flex items-center">
                    <button
                        style={{ marginBottom: 2, marginRight: 5, borderRadius: 6, padding: "10px 12px", cursor: "pointer", fontFamily: "geist", fontSize: 12, boxShadow: "0 2px 6px #e5eaf0" }}
                        className="hover:cursor-pointer bg-[#FFFFFF] hover:bg-[#E2E2E2]"
                        onClick={() => { setViewRejectedClaims(!viewRejectedClaims) }}
                    >
                        {viewRejectedClaims ? "View Accepted Claims" : "View Rejected Claims"}
                    </button>

                    {pendingMealRequest !== 0 && (
                        <button
                            style={{ marginBottom: 2, marginRight: 2, borderRadius: 6, padding: "10px 12px", cursor: "pointer", fontFamily: "geist", fontSize: 12, boxShadow: "0 2px 6px #e5eaf0" }}
                            className="hover:cursor-pointer bg-[#ffe6daff] hover:bg-[#ffd5c1ff]"
                        >
                            {`Pending Meal Requests (${pendingMealRequest})`}
                        </button>
                    )}
                </div>
            </div>

            {/* Cards Loop */}
            <div className="flex flex-row justify-evenly">
                {currentData.map((item, index) => (
                    <StatsCard
                        key={index}
                        title={item.title}
                        value={item.value}
                        subtitle={item.subtitle}
                        acceptanceRate={item.acceptanceRate}
                        expectingPostiveResult={item.expectingPositiveResult}
                        isPercentage={item.isPercentage}
                    />
                ))}
            </div>

            {/* 2. UPDATED SUMMARY SECTION */}
            <div style={{ paddingTop: 8, fontSize: 12 }} className="w-full h-auto flex justify-center font-geist">
                <p style={{ color: "#353535", fontSize: 11, fontFamily: "geist", width: "fit-content", height: "fit-content" }}>
                    {/* 3. Uses the new props based on the calculated result */}
                    {summaryResult ? successMessage : failureMessage}
                </p>
            </div>
        </div>
    );
}