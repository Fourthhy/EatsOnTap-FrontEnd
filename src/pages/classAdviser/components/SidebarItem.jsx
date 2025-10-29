const SidebarItem = ({ icon, text, expanded, active, onClick, index }) => {
    return (
        <div
            onClick={() => onClick(index)}
            style={{
                display: "flex",
                alignItems: "center",
                gap: "0.75rem",
                padding: "0.75rem 1rem",
                margin: "0 0.75rem",
                borderRadius: "0.5rem",
                cursor: "pointer",
                transition: "all 200ms ease",
                backgroundColor: active ? "white" : "transparent",
                color: active ? "#2b1677" : "#e5e7eb",
                position: "relative",
                zIndex: 1, // Keeps text above highlight animation
            }}
            onMouseEnter={(e) => {
                if (!active) {
                    e.currentTarget.style.backgroundColor = "#52728F";
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
            {icon}
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

export {
    SidebarItem
}