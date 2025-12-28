import React from 'react';
// IMPORT SKELETON
import { Skeleton } from "../../../../components/global/Skeleton";

function EventsPanel({ events, isHyerlink = true, canViewAll = true, isLoading = false }) {
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
            <h2 style={{ fontFamily: "geist", fontWeight: "500", fontSize: 12, color: "#000" }}>
            Upcoming Events
            </h2>
        )}

        {/* HIDE 'View All' LINK WHILE LOADING */}
        {!isLoading && canViewAll && (
          <a
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
          </a>
        )}
      </div>

      <div className="flex flex-col">
        {isLoading ? (
            // --- SKELETON LOADING STATE ---
            // Render 3 dummy rows
            [1, 2, 3].map((i) => (
                <div
                    key={i}
                    style={{
                        padding: "15px 15px",
                        marginBottom: 8,
                        background: "#f9fafb" // Neutral gray
                    }}
                    className="rounded-lg flex justify-between items-center"
                >
                    <div style={{ padding: "5px 0px 5px 0px", width: "100%" }}>
                        <Skeleton className="h-4 w-2/3 mb-2 rounded" />
                        <Skeleton className="h-3 w-1/3 rounded" />
                    </div>
                </div>
            ))
        ) : (
            // --- REAL DATA STATE ---
            events.map((event, idx) => (
            <div
                key={event.title || idx}
                style={{
                padding: "15px 15px",
                marginBottom: 8,
                background: event.color
                }}
                className="rounded-lg flex justify-between items-center"
            >
                <div style={{ padding: "5px 0px 5px 0px" }}>
                <h3
                    style={{
                    fontFamily: "geist",
                    fontSize: 13,
                    color: "#000",
                    fontWeight: "550"
                    }}
                    className="font-semibold text-gray-800 text-base"
                >
                    {event.title}
                </h3>
                <p
                    style={{
                    fontFamily: "geist",
                    fontSize: 10,
                    color: "#667085",
                    fontWeight: "400"
                    }}
                    className="text-xs text-gray-700 mt-1"
                >
                    {event.date}
                </p>
                </div>
                {isHyerlink ? (
                <>
                    <a
                    href={event.link}
                    style={{
                        fontSize: 11,
                        color: "#254280",
                        fontFamily: "geist",
                        fontWeight: 500,
                        paddingRight: "20px"
                    }}
                    className="hover:underline transition text-center"
                    >
                    View Details
                    </a>
                </>
                ) : (
                ""
                )}
            </div>
            ))
        )}
      </div>
    </div>
  );
}

export { EventsPanel };