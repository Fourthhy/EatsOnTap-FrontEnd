import React from 'react';
import { motion } from "framer-motion"; 
import { Skeleton } from "../../../../components/global/Skeleton";

// Helper function to format the backend date fields into a clean string
const formatEventDate = (startMonth, startDay, endMonth, endDay) => {
  if (!startMonth || !startDay) return "TBA";
  
  if (startMonth === endMonth && startDay === endDay) {
    return `${startMonth} ${startDay}`;
  } else if (startMonth === endMonth) {
    return `${startMonth} ${startDay} - ${endDay}`;
  } else {
    return `${startMonth} ${startDay} - ${endMonth} ${endDay}`;
  }
};

function OngoingEvents({ events = [], isHyerlink = true, isLoading = false }) {
  // 🟢 THE FIX: Guarantee safeEvents is ALWAYS an array to prevent crashes
  const safeEvents = Array.isArray(events) ? events : [];

  return (
    <div
      style={{
        padding: 20,
        borderRadius: 12,
        boxShadow: "0 2px 6px #e5eaf0",
        background: "white"
      }}
      className="h-auto w-full"
    >
      <div
        style={{ paddingBottom: 10 }}
        className="flex justify-between items-center"
      >
        {/* TITLE WITH SKELETON */}
        {isLoading ? (
          <Skeleton className="h-4 w-32 rounded" />
        ) : (
          <motion.h2
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            style={{ fontFamily: "geist", fontWeight: "500", fontSize: 12, color: "#000" }}
          >
            {safeEvents.length > 1 ? "Ongoing Events" : "Ongoing Event"}
          </motion.h2>
        )}
      </div>

      <div className="flex flex-col">
        {isLoading ? (
          // --- SKELETON LOADING STATE ---
          [1, 2].map((i) => (
            <div
              key={i}
              style={{
                padding: "15px 15px",
                marginBottom: 8,
                background: "#f9fafb" 
              }}
              className="rounded-lg flex justify-between items-center"
            >
              <div style={{ padding: "5px 0px 5px 0px", width: "100%" }}>
                <Skeleton className="h-4 w-3/4 mb-2 rounded" />
                <Skeleton className="h-3 w-1/2 rounded" />
              </div>
            </div>
          ))
        ) : safeEvents.length === 0 ? (
          // --- EMPTY STATE (Centered Text) ---
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            style={{ 
              display: 'flex', 
              justifyContent: 'center', 
              alignItems: 'center', 
              height: '100px',
              color: '#9CA3AF', 
              fontFamily: 'geist',
              fontSize: '13px',
              fontWeight: 500,
              fontStyle: 'italic'
            }}
          >
            No ongoing events
          </motion.div>
        ) : (
          // --- REAL DATA STATE (Animated) ---
          safeEvents.map((event, idx) => (
            <motion.div
              key={event._id || idx} // Mapped to backend _id
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: idx * 0.1 }} 
              style={{
                padding: "15px 15px",
                marginBottom: 8,
                background: event.eventColor || "#f3f4f6" // Mapped to backend eventColor
              }}
              className="rounded-lg flex justify-between items-center"
            >
              <div style={{ padding: "5px 0px 5px 0px" }}>
                <div className="flex items-center gap-2">
                  <h3
                    style={{
                      fontFamily: "geist",
                      fontSize: 13,
                      color: "#000",
                      fontWeight: "600"
                    }}
                    className="text-gray-800"
                  >
                    {event.eventName} {/* Mapped to backend eventName */}
                  </h3>
                  {/* Optional: Add a tiny badge for the scope */}
                  <span style={{ fontSize: 9, padding: '2px 6px', borderRadius: 4, backgroundColor: 'rgba(255,255,255,0.6)', color: '#4b5563', fontFamily: 'geist' }}>
                    {event.eventScope}
                  </span>
                </div>
                
                <p
                  style={{
                    fontFamily: "geist",
                    fontSize: 11,
                    color: "#667085",
                    fontWeight: "500",
                    marginTop: 4
                  }}
                >
                  {/* Uses the formatter helper we built above */}
                  {formatEventDate(event.startMonth, event.startDay, event.endMonth, event.endDay)}
                </p>
              </div>
            </motion.div>
          ))
        )}
      </div>
    </div>
  );
}

export { OngoingEvents };