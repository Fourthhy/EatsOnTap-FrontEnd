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

// 🟢 THE FIX: We rename the incoming prop to 'rawEvents' 
function EventsPanel({ events: rawEvents, isHyerlink = true, canViewAll = true, isLoading = false}) {
  
  // 🟢 THE FIX: We force it to be an array, and call it 'events'. 
  // Now every single 'events.map' below is 100% guaranteed to be safe!
  const events = Array.isArray(rawEvents) ? rawEvents : [];

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
        {/* HEADER SKELETON */}
        {isLoading ? (
          <Skeleton className="h-4 w-32 rounded" />
        ) : (
          <motion.h2
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            style={{ fontFamily: "geist", fontWeight: "500", fontSize: 12, color: "#000" }}
          >
            Upcoming Events
          </motion.h2>
        )}

        {/* HIDE 'View All' LINK WHILE LOADING OR IF NO EVENTS */}
        {!isLoading && canViewAll && events.length > 0 && (
          <motion.a
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            href="#"
            style={{
              fontSize: 12,
              color: "#254280",
              fontFamily: "geist",
              fontWeight: 500,
              paddingRight: 5
            }}
            className="hover:underline"
          >
            View All
          </motion.a>
        )}
      </div>

      <div className="flex flex-col">
        {isLoading ? (
          // --- SKELETON LOADING STATE ---
          [1, 2, 3].map((i) => (
            <div
              key={i}
              style={{
                padding: "15px 15px",
                marginBottom: 8,
                background: "#f9fafb" 
              }}
              className="rounded-lg flex justify-between items-center border border-transparent"
            >
              <div style={{ padding: "5px 0px 5px 0px", width: "100%" }}>
                <Skeleton className="h-4 w-2/3 mb-2 rounded" />
                <Skeleton className="h-3 w-1/3 rounded" />
              </div>
            </div>
          ))
        ) : events.length === 0 ? (
          // 🟢 EMPTY STATE (Centered Text)
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            style={{ 
              display: 'flex', 
              justifyContent: 'center', 
              alignItems: 'center', 
              height: '50px', 
              color: '#9CA3AF', 
              fontFamily: 'geist',
              fontSize: '13px',
              fontWeight: 500,
              fontStyle: 'italic'
            }}
          >
            No upcoming events
          </motion.div>
        ) : (
          // --- REAL DATA STATE (Animated) ---
          events.map((event, idx) => (
            <motion.div
              key={event._id || idx} 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: idx * 0.1 }} 
              style={{
                padding: "15px 15px",
                marginBottom: 8,
                background: event.eventColor || "#f3f4f6" 
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
                      fontWeight: "550"
                    }}
                    className="font-semibold text-gray-800 text-base"
                  >
                    {event.eventName} 
                  </h3>
                  {/* Scope Badge */}
                  <span style={{ fontSize: 9, padding: '2px 6px', borderRadius: 4, backgroundColor: 'rgba(255,255,255,0.6)', color: '#4b5563', fontFamily: 'geist' }}>
                    {event.eventScope}
                  </span>
                </div>
                <p
                  style={{
                    fontFamily: "geist",
                    fontSize: 10,
                    color: "#667085",
                    fontWeight: "400",
                    marginTop: 4
                  }}
                  className="text-xs text-gray-700 mt-1"
                >
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

export { EventsPanel };