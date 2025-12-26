import React from "react";
import { motion, AnimatePresence } from "framer-motion";

const SidebarItem = ({ index, icon, text, expanded, active, onClick }) => {
  return (
    <motion.div
      onClick={onClick}
      // 1. CONTAINER ANIMATION
      // We animate width, but we KEEP padding-left constant so the icon never moves.
      initial={false}
      animate={{
        width: expanded ? "280px" : "72px", 
        // 72px width + margin auto in parent = centered in 80px sidebar
        // Icon is approx 24px wide. 
        // 72px - 24px = 48px remaining space. 24px padding on each side centers it.
        paddingLeft: "24px", 
        paddingRight: expanded ? "12px" : "24px",
      }}
      whileHover={{
        backgroundColor: active ? "rgba(0,0,0,0)" : "rgba(20, 52, 99, 0.25)",
      }}
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "flex-start", // ALWAYS align left, rely on padding to center the icon
        height: "50px",
        borderRadius: "0.5rem",
        cursor: "pointer",
        position: "relative",
        overflow: "hidden", 
        zIndex: 1,
        // Active Text Color (Not background)
        color: active ? "#2b1677" : "#e5e7eb",
        // Force hardware acceleration to prevent jitter
        transform: "translateZ(0)", 
      }}
      transition={{ type: "spring", stiffness: 400, damping: 30 }}
    >
      
      {/* 2. SLIDING ACTIVE BACKGROUND INDICATOR */}
      {active && (
        <motion.div
          layoutId="sidebar-active-indicator"
          style={{
            position: "absolute",
            inset: 0,
            backgroundColor: "white",
            borderRadius: "0.5rem",
            zIndex: 0, // Behind everything
            boxShadow: "0 1px 2px 0 rgba(0, 0, 0, 0.05)"
          }}
          transition={{ type: "spring", stiffness: 400, damping: 30 }}
        />
      )}

      {/* 3. ICON CONTAINER - STATIONARY */}
      {/* Z-Index 10 ensures it stays above the sliding text */}
      <div style={{ position: 'relative', zIndex: 10, display: 'flex', alignItems: 'center', minWidth: '24px' }}>
        {icon}
      </div>

      {/* 4. TEXT LABEL - SLIDING ANIMATION */}
      {/* Z-Index 5 puts it logically "under" the icon layer if they overlapped, 
          but visually next to it. */}
      <AnimatePresence>
        {expanded && (
          <motion.span
            initial={{ opacity: 0, x: -20 }} // Start slightly "behind" the icon
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}    // Slide back "behind" on close
            style={{
              fontSize: "0.875rem",
              fontWeight: "500",
              whiteSpace: "nowrap",
              marginLeft: "12px",
              zIndex: 5, 
              ...(active
                ? {
                    background: "linear-gradient(to right, #263C70, #4973D6)",
                    WebkitBackgroundClip: "text",
                    color: "transparent",
                  }
                : {}),
            }}
            transition={{ duration: 0.2, ease: "easeOut" }} // Fast slide
          >
            {text}
          </motion.span>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export { SidebarItem };