const SidebarItem = ({ icon, text, expanded, active, onClick, index }) => {
    const indicatorMargin = expanded ? '0.75rem' : '0.25rem';
    const indicatorWidth = expanded ? "280px" : "72px";
    
    return (
        <div
            onClick={() => onClick(index)}
            style={{
                display: "flex",
                alignItems: "center",
                justifyContent: expanded ? "start" : "center",
                gap: "0.75rem",
                padding: "0.75rem 1rem",

                // 1. DYNAMIC MARGIN: This ensures the hover box stays 
                // within the same bounds as your white indicator.
                margin: expanded ? "0 0.75rem" : "0 0.25rem",

                // 2. THE FIX: Forces the div to take up all available horizontal space
                // within the flex nav, minus the margins set above.
                width: `calc(${indicatorWidth} - (${indicatorMargin} * 2))`,
                flex: 1,
                
                borderRadius: "0.5rem",
                cursor: "pointer",
                transition: "all 200ms ease",
                backgroundColor: active ? "white" : "transparent",
                color: active ? "#2b1677" : "#e5e7eb",
                position: "relative",
                zIndex: 1,
            }}
            onMouseEnter={(e) => {
                if (!active) {
                    e.currentTarget.style.backgroundColor = "#1434633f";
                    e.currentTarget.style.color = "white";
                }
            }}
            onMouseLeave={(e) => {
                if (!active) {
                    e.currentTarget.style.backgroundColor = "transparent";
                    e.currentTarget.style.color = "#e5e7eb";
                }
            }}
        >
            {/* Fixed width for icon keeps text aligned even when sidebar expands */}
            <div style={{ display: "flex", justifyContent: "center", minWidth: "1.5rem" }}>
                {icon}
            </div>

            {expanded && (
                <span
                    style={{
                        fontSize: "0.875rem",
                        fontWeight: "500",
                        ...(active
                            ? {
                                background: "linear-gradient(to right, #263C70, #4973D6)",
                                WebkitBackgroundClip: "text",
                                color: "transparent",
                            }
                            : {}),
                    }}
                >
                    {text}
                </span>
            )}
        </div>
    );
};

export { SidebarItem }