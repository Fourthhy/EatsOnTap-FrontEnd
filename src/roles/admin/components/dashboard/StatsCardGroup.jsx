import { StatsCard } from "./StatsCard";
import { useState } from "react";
// Import Skeleton for the header/footer areas
import { Skeleton } from "../../../../components/global/Skeleton";

export function StatsCardGroup({
    cardGroupTitle, 
    isDualPager, 
    dualPageTitles, 

    primaryData = [], 
    secondaryData = [], 

    urgentNotification, 
    notificationTitle, 

    successMessage, 
    failureMessage, 
    footnote, 
    displayDate,
    isLoading = false // NEW PROP
}) {
    const [viewFirstPage, setViewFirstPage] = useState(false);

    function getTodayDate() {
        const today = new Date();
        const month = String(today.getMonth() + 1).padStart(2, '0');
        const day = String(today.getDate()).padStart(2, '0');
        const year = today.getFullYear();
        return `${month}/${day}/${year}`;
    }

    const dateToday = getTodayDate();

    // Determine dataset
    const currentData = viewFirstPage
        ? [...secondaryData].reverse()
        : [...primaryData].reverse();

    // Logic for "Good/Bad" message
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

    const globalButtonBgColor = "cursor-pointer bg-[#4268BD] hover:bg-[#33549F] transition-colors duration-300";

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
            {/* --- HEADER SECTION --- */}
            <div style={{ paddingBottom: 5 }} className="w-full h-auto flex justify-between">
                <div style={{ display: "flex", flexDirection: "column", paddingLeft: 6, width: "100%" }}>
                    
                    {/* Title Skeleton */}
                    {isLoading ? (
                        <Skeleton className="h-4 w-32 rounded mb-1" />
                    ) : (
                        <span style={{ fontWeight: 500, fontSize: 12, color: "#000000", fontFamily: "geist", width: "fit-content", height: "fit-content" }}>
                            {cardGroupTitle}
                        </span>
                    )}

                    {/* Date Skeleton */}
                    {isLoading ? (
                         displayDate && <Skeleton className="h-3 w-20 rounded mt-1" />
                    ) : (
                        displayDate && (
                            <span style={{ color: "#353535", fontSize: 12, fontFamily: "geist", width: "fit-content", height: "fit-content" }}>
                                {dateToday}
                            </span>
                        )
                    )}
                </div>

                {/* Buttons (Hidden during loading) */}
                {!isLoading && (
                    <div className="h-full w-full flex items-center justify-end">
                        {isDualPager && (
                            <button
                                style={{
                                    marginBottom: 2, marginRight: 5, borderRadius: 6, padding: "10px 12px",
                                    fontFamily: "geist", fontSize: 12, color: "#eeeeee",
                                    boxShadow: "0 2px 6px #e5eaf0ac", border: "1px solid #ddddddaf",
                                }}
                                className={globalButtonBgColor}
                                onClick={() => { setViewFirstPage(!viewFirstPage) }}
                            >
                                {viewFirstPage ? dualPageTitles[0] : dualPageTitles[1]}
                            </button>
                        )}
                        {urgentNotification !== 0 && (
                            <button
                                style={{ marginBottom: 2, marginRight: 2, borderRadius: 6, padding: "10px 12px", cursor: "pointer", fontFamily: "geist", fontSize: 12, boxShadow: "0 2px 6px #e5eaf0" }}
                                className="hover:cursor-pointer bg-[#ffe6daff] hover:bg-[#ffd5c1ff]"
                            >
                                {notificationTitle + "(" + urgentNotification + ")"}
                            </button>
                        )}
                    </div>
                )}
            </div>

            {/* --- CARDS LOOP --- */}
            <div className="flex flex-row justify-evenly gap-4"> 
                {/* If LOADING: Render dummy cards (e.g. 2 of them) so layout holds shape.
                   If LOADED: Render real data.
                */}
                {isLoading ? (
                    <>
                        <StatsCard isLoading={true} />
                        <StatsCard isLoading={true} />
                    </>
                ) : (
                    currentData.map((item, index) => (
                        <StatsCard
                            key={index}
                            title={item.title}
                            value={item.value}
                            subtitle={item.subtitle}
                            acceptanceRate={item.acceptanceRate}
                            expectingPostiveResult={item.expectingPositiveResult}
                            isPercentage={item.isPercentage}
                            isLoading={false} // Explicitly false
                        />
                    ))
                )}
            </div>

            {/* --- SUMMARY FOOTER --- */}
            <div style={{ paddingTop: 8, fontSize: 12 }} className="w-full h-auto flex justify-center font-geist">
                {isLoading ? (
                    <Skeleton className="h-3 w-48 rounded" />
                ) : (
                    <>
                        <p style={{ color: "#353535", fontSize: 11, fontFamily: "geist", width: "fit-content", height: "fit-content" }}>
                            {summaryResult ? successMessage : failureMessage}
                        </p>
                        <p style={{ color: "#353535", fontSize: 11, fontFamily: "geist", width: "fit-content", height: "fit-content" }}>
                            {footnote}
                        </p>
                    </>
                )}
            </div>
        </div>
    );
}