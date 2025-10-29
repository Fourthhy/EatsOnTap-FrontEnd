import React from "react";

const actions = [
  { label: "Add Dish for Today" },
  { label: "Confirm Orders" },
  { label: "Schedule Event" },
  { label: "Register Student" },
];

function QuickActions() {
  return (
    <div
      style={{
        background: "#fff",
        borderRadius: 8,
        padding: 18,
        marginBottom: 18
      }}>
      <h4
        style={{ 
          fontSize: 13,
          fontFamily: 'geist',
          color: '#000000',
          fontWeight: '500',
          padding: '10px 0px 10px 0px'
        }}
        >
        Quick Actions
      </h4>
      <ul
        style={{
          listStyle: "none",
          padding: 0,
          margin: 0
        }}>
        {actions.map((a, i) => (
          <li key={a.label} style={{
            marginBottom: 8, 
            background: "#EEFCFF",
            borderRadius: 6, 
            padding: "10px 12px", 
            cursor: "pointer",
            fontFamily: "geist",
            fontSize: 13
          }}
          className="hover:bg-[#cde0e4]"
          >{a.label}</li>
        ))}
      </ul>
    </div>
  );
}

export {
  QuickActions
}