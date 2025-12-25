function StatsCard({ title, value, subtitle, acceptanceRate, expectingPostiveResult, isPercentage }) {

    const calculatedColor =
        expectingPostiveResult === true // Is the expectation explicitly POSITIVE?
            ? value >= acceptanceRate // -> If YES, check for success (>=)
                ? "#10B981" // Success (Green)
                : "#EF4444" // Failure (Red)

            : expectingPostiveResult === false // -> If NO, is the expectation explicitly NEGATIVE?
                ? value <= acceptanceRate // -> If YES, check for success (<=)
                    ? "#10B981" // Success (Green)
                    : "#EF4444" // Failure (Red)

                : "#4C4B4B"; // -> If neither true nor false (neutral/undefined), use Neutral Gray

    return (
        <div style={{
            background: "#fff", borderRadius: 12, boxShadow: "0 1px 6px #e5eaf0",
            padding: 20, display: "flex", flexDirection: "column", width: '100%', justifyContent: "center", margin: 5
        }}>
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
        </div >
    );
}

export {
    StatsCard
}

//