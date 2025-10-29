function StatsCard({ title, value, subtitle }) {
    return (
        <div style={{
            background: "#fff", borderRadius: 12, boxShadow: "0 2px 6px #e5eaf0",
            padding: 20, display: "flex", flexDirection: "column", width: 'auto', justifyContent: "center"
        }}>
            <span
                style={{
                    fontWeight: "500",
                    fontSize: 12,
                    color: "#4C4B4B",
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
                    color: "#000000",
                    fontFamily: "geist"
                }}
            >
                {value}
            </span>
            <span
                style={{
                    color: "#4C4B4B",
                    fontSize: 11,
                    fontFamily: "geist"
                }}>
                {subtitle}
            </span>
        </div>
    );
}

export {
    StatsCard
}