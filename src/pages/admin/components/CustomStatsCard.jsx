export function CustomStatsCard({ title, value, subtitle, isPercentage, isPeso, acceptableRate, isHasAcceptableRange }) {

    const acceptableIndicator = 
        isHasAcceptableRange ? (value >= acceptableRate[0] && value <= acceptableRate[1] ? "#0e7973ff" : "#CF7171") : "#4C4B4B";

    return (
        <>
            <div style={{
                background: "#fff", borderRadius: 12, boxShadow: "0 1px 10px #e5eaf0",
                padding: 20, display: "grid", gridColumn: 1, gridRow: 3, flexDirection: "column", width: '100%', height: "100%"
            }}
            >
                <div className="w-full h-full flex justify-center">
                    <span
                        style={{
                            fontWeight: "500",
                            fontSize: 12,
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
                <div className="w-full h-full flex justify-center items-center">
                    <span
                        style={{
                            fontSize: 25,
                            fontWeight: "500",
                            margin: "8px 0",
                            color: isHasAcceptableRange ? acceptableIndicator : "#4C4B4B",
                            fontFamily: "geist"
                        }}

                    >
                        {isPeso ? "₱" : ""}{value}{isPercentage ? "%" : ""}
                    </span>
                </div>
                <div className="w-full h-full flex justify-center items-end">
                    <span
                        style={{
                            color: "#4C4B4B",
                            fontSize: 11,
                            fontFamily: "geist"
                        }}

                    >
                        {subtitle}
                    </span>
                </div>
            </div >
        </>
    )
}