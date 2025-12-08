function MealAllowanceCard() {
    return (
        <div style={{
            background: "#fff", borderRadius: 12, boxShadow: "0 1px 6px #e5eaf0",
            padding: 20, display: "flex", flexDirection: "column", width: 'auto', justifyContent: "center"
        }}
            className="w-full h-auto flex flex-col items-center"
        >
            <span
                style={{
                    fontWeight: "bold",
                    fontSize: 13,
                    fontFamily: 'geist',
                    paddingBottom: "20px"
                }}
                className="w-full h-auto flex items-center"
            >
                Default Meal Allowance
            </span>
            <div
                style={{
                    background: "#E6FBF9",
                    padding: 10
                }}
                className="w-full h-auto flex justify-center rounded-lg"
            >
                <span style={{ color: "#000", fontSize: 20, fontFamily: "geist" }}>PHP {60}</span>
            </div>
        </div>
    )
}

export {
    MealAllowanceCard
}