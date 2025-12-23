import React from "react";

const SidebarItem = ({ icon, text, expanded, active, onClick }) => {
  const indicatorMargin = expanded ? "0.75rem" : "0.25rem";
  const indicatorWidth = expanded ? "280px" : "72px";

  return (
    <div
      onClick={onClick}
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: expanded ? "start" : "center",
        gap: "0.75rem",
        padding: "0.75rem 1rem",
        margin: expanded ? "0 0.75rem" : "0 0.25rem",
        width: `calc(${indicatorWidth} - (${indicatorMargin} * 2))`,
        flex: "none", // Changed to none to maintain fixed height in a list
        
        borderRadius: "0.5rem",
        cursor: "pointer",
        
        // Transitions for smooth background and color changes
        transition: "all 300ms ease-in-out", 
        
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
      {/* Icon Container */}
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          minWidth: "1.5rem",
        }}
      >
        {icon}
      </div>

      {/* Text Label */}
      {expanded && (
        <span
          className="animate-in fade-in slide-in-from-left-2 duration-200"
          style={{
            fontSize: "0.875rem",
            fontWeight: "500",
            whiteSpace: "nowrap",
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

export { SidebarItem };