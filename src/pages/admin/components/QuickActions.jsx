import React from "react";

const actions = [
  { label: "Add Dish for Today" },
  { label: "Confirm Orders" },
  { label: "Schedule Event" },
  { label: "Register Student" },
];

export default function QuickActions() {
  return (
    <div style={{ background: "#fff", borderRadius: 8, padding: 18, marginBottom: 18 }}>
      <h4>Quick Actions</h4>
      <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
        {actions.map((a, i) => (
          <li key={a.label} style={{
            marginBottom: 8, background: "#EAF1FB",
            borderRadius: 6, padding: "10px 12px", cursor: "pointer"
          }}>{a.label}</li>
        ))}
      </ul>
    </div>
  );
}
