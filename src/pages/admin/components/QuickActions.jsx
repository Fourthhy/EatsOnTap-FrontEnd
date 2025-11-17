import React from "react";
import {
  Utensils,
  FileCheck2,
  UserPlus,
  CalendarDays
} from "lucide-react"
import { MdOutlineCalendarMonth } from "react-icons/md";


const actions = [
  { label: "Add Dish for Today", icon: <Utensils size={20} /> },
  { label: "Confirm Orders", icon: <FileCheck2 size={20} /> },
  { label: "Schedule Event", icon: <CalendarDays size={20} /> },
  { label: "Register Student", icon: <UserPlus size={20} /> },
];

function QuickActions() {
  return (
    <div
      style={{
        background: "#fff", borderRadius: 12, boxShadow: "0 2px 6px #e5eaf0",
        padding: 18, display: "flex", flexDirection: "column", width: 'auto', justifyContent: "center"
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
          >
            <span className="h-full flex items-center gap-3">
              {a.icon}
              {a.label}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}

export {
  QuickActions
}