import { StatsCard } from "./StatsCard"
import { useState } from "react"

export function StatsCardGroup({ title1, title2, title3, title4, title5, title6, subtitle1, subtitle2, subtitle3, subtitle4, subtitle5, subtitle6, value1, value2, value3, value4, value5, value6, acceptanceRate1, acceptanceRate2, expectingPostiveResult1, expectingPostiveResult2, isPercentage }) {
    const [viewRejectedClaims, setViewRejectedClaims] = useState(false);
    const [pendingMealRequest, setPendingMealRequest] = useState(0)

    function getTodayDate() {
        const today = new Date();

        // Get the month (0-indexed, so add 1), and pad with a leading zero if needed
        const month = String(today.getMonth() + 1).padStart(2, '0');

        // Get the day of the month, and pad with a leading zero if needed
        const day = String(today.getDate()).padStart(2, '0');

        // Get the full year (YYYY)
        const year = today.getFullYear();

        return `${month}/${day}/${year}`;
    }
    const dateToday = getTodayDate()

    const summaryResult =
        expectingPostiveResult1 === true // 1. Check for Positive expectation
            ? value1 >= acceptanceRate1  //   -> If YES, check if value >= rate
                ? true                  //   -> Success
                : false                 //   -> Failure

            : expectingPostiveResult1 === false // 2. Check for Negative expectation (Else of 1)
                ? value1 <= acceptanceRate1  //   -> If YES, check if value <= rate
                    ? true                  //   -> Success
                    : false                 //   -> Failure

                : false; // 3. Neutral case (Else of 2) - Assuming neutral is not "success"

    return (
        <>
            <div
                style={{
                    background: "#fff",
                    borderRadius: 12,
                    boxShadow: "0 2px 6px #e5eaf0",
                    padding: 20,
                }}
                className="flex flex-col justify-evenly w-full h-full">
                <div
                    style={{ paddingBottom: 5 }}
                    className="w-full h-auto flex justify-between">
                    <div
                        style={{
                            display: "flex",
                            flexDirection: "column",
                            paddingLeft: 6,

                        }}
                    >
                        <span
                            style={{
                                fontWeight: "500",
                                fontSize: 14,
                                color: "#000000",
                                fontFamily: "geist",
                                width: "fit-content",
                                height: "fit-content",
                            }}
                        >
                            Meal Eligibility List Count
                        </span>
                        <span
                            style={{
                                color: "#353535",
                                fontSize: 12,
                                fontFamily: "geist",
                                width: "fit-content",
                                height: "fit-content",
                            }}>
                            {dateToday}
                        </span>
                    </div>
                    <div className="h-full flex items-center">

                        <button
                            style={{
                                marginBottom: 2,
                                marginRight: 5,
                                borderRadius: 6,
                                padding: "10px 12px",
                                cursor: "pointer",
                                fontFamily: "geist",
                                fontSize: 12,
                                boxShadow: "0 2px 6px #e5eaf0",
                            }}
                            className="hover:cursor-pointer bg-[#FFFFFF] hover:bg-[#E2E2E2]"
                            onClick={() => { setViewRejectedClaims(!viewRejectedClaims) }}
                        >
                            {viewRejectedClaims ? "View Accepted Claims" : "View Rejected Claims"}
                        </button>

                        {pendingMealRequest != 0
                            ? <>
                                <button
                                    style={{
                                        marginBottom: 2,
                                        marginRight: 2,
                                        borderRadius: 6,
                                        padding: "10px 12px",
                                        cursor: "pointer",
                                        fontFamily: "geist",
                                        fontSize: 12,
                                        boxShadow: "0 2px 6px #e5eaf0",
                                    }}
                                    className="hover:cursor-pointer bg-[#ffe6daff] hover:bg-[#ffd5c1ff]"
                                >
                                    {`Pending Meal Requests (${pendingMealRequest})`}
                                </button>
                            </>
                            : ""}
                    </div>
                </div>
                <div className="flex flex-row justify-evenly">
                    {viewRejectedClaims
                        ? <>
                            <StatsCard title={title3} value={value3} subtitle={subtitle3} acceptanceRate={acceptanceRate2} expectingPostiveResult={expectingPostiveResult2} isPercentage={isPercentage} />
                            <StatsCard title={title4} value={value4} subtitle={subtitle4} />
                            <StatsCard title={title6} value={value6} subtitle={subtitle6} />
                        </>
                        : <>
                            <StatsCard title={title1} value={value1} subtitle={subtitle1} acceptanceRate={acceptanceRate1} expectingPostiveResult={expectingPostiveResult1} isPercentage={isPercentage} />
                            <StatsCard title={title2} value={value2} subtitle={subtitle2} />
                            <StatsCard title={title5} value={value5} subtitle={subtitle5} />
                        </>}

                </div>
                <div
                    style={{ paddingTop: 8, fontSize: 12 }}
                    className="w-full h-auto flex justify-center font-geist">
                    <p
                        style={{
                            color: "#353535",
                            fontSize: 11,
                            fontFamily: "geist",
                            width: "fit-content",
                            height: "fit-content",
                        }}>
                        {summaryResult ? "Compliance is Excellent. Review Workflow is Highly Efficient" : "Eligibility Compliance is Low. High Volume of Rejected Submissions"}
                    </p>
                </div>
            </div>
        </>
    )
}