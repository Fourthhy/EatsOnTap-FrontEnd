export function CustomStatsCard({ title, value, subtitle, isPercentage, isPeso }) {
    return (
        <>
            <div style={{
                background: "#fff", borderRadius: 12, boxShadow: "0 1px 6px #e5eaf0",
                padding: 20, display: "grid", gridColumn: 1, gridRow: 3, flexDirection: "column", width: 'auto', height: "100%"
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
                            color: "#4C4B4B",
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