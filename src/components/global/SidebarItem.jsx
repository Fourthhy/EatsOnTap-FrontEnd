import React from "react";
import { motion, AnimatePresence } from "framer-motion";

const SidebarItem = ({ index, icon, text, expanded, active, onClick }) => {
  return (
    <motion.div
      onClick={onClick}
      // 1. CONTAINER ANIMATION (Width & Padding only, NO background color)
      initial={false}
      animate={{
        width: expanded ? "280px" : "72px",
        // We remove backgroundColor here to prevent blinking.
        // We still animate text color.
        color: active ? "#2b1677" : "#e5e7eb",
        justifyContent: expanded ? "flex-start" : "center",
        paddingLeft: expanded ? "1rem" : "0",
        paddingRight: expanded ? "1rem" : "0",
      }}
      // 2. Hover for INACTIVE items only
      whileHover={{
        backgroundColor: active ? "transparent" : "rgba(20, 52, 99, 0.25)",
        color: active ? "#2b1677" : "white",
      }}
      style={{
        display: "flex",
        alignItems: "center",
        height: "50px",
        padding: "0.5rem",
        borderRadius: "0.5rem",
        cursor: "pointer",
        position: "relative",
        overflow: "hidden",
        zIndex: 1,
        // Remove direct background color from style
      }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
    >
      
      {/* 3. THE SLIDING INDICATOR (Absolute Positioned Background) */}
      {active && (
        <motion.div
          layoutId="sidebar-active-indicator" // This ID must be unique in the list but shared across items
          style={{
            position: "absolute",
            inset: 0, // Covers the whole parent
            backgroundColor: "white",
            borderRadius: "0.5rem",
            zIndex: -1, // Puts it behind the text/icon
            boxShadow: "0 1px 2px 0 rgba(0, 0, 0, 0.05)"
          }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
        />
      )}

      {/* Icon Container */}
      <motion.div
        layout
        initial={{ opacity: 0, scale: 0.5 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: index * 0.1 }}
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minWidth: "2rem",
          zIndex: 1, // Ensure on top of slider
        }}
      >
        {icon}
      </motion.div>

      {/* Text Label */}
      <AnimatePresence mode="wait">
        {expanded && (
          <motion.span
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -10 }}
            transition={{ duration: 0.2, delay: 0.1 }}
            style={{
              fontSize: "0.875rem",
              fontWeight: "500",
              whiteSpace: "nowrap",
              marginLeft: "10px", // Added margin manually since we removed gap from flex
              zIndex: 1, // Ensure on top of slider
              // Apply gradient only if active
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
          </motion.span>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export { SidebarItem };