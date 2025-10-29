import React from "react";

function EventsPanel({ events }) {
  return (
    <div style={{ background: "#fff", borderRadius: 8, padding: 18, marginBottom: 18 }}>
      <h4>Upcoming Events</h4>
      {events.map(evt => (
        <div key={evt.title} style={{
          display: "flex", justifyContent: "space-between",
          alignItems: "center", marginBottom: 8,
          borderBottom: "1px solid #EAEAEA", paddingBottom: 8
        }}>
          <span style={{ fontWeight: "bold" }}>{evt.title}</span>
          <span style={{ color: "#2582DA", fontWeight: "500", fontSize: 13 }}>{evt.date}</span>
        </div>
      ))}
    </div>
  );
}

export {
  EventsPanel
}