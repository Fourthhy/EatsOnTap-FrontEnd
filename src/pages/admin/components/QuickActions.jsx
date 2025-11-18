import React from "react";
import {
  Utensils,
  FileCheck2,
  UserPlus,
  CalendarDays
} from "lucide-react"
import { useState } from "react";


const actions = [
  { action: "addDish", label: "Add Dish for Today", label2: "View Dish for Today", icon: <Utensils size={20} /> },
  { action: "ScheduleEvent", label: "Schedule Event", icon: <CalendarDays size={20} /> },
  { action: "registerStudent", label: "Register Student", icon: <UserPlus size={20} /> },
];

function QuickActions() {
  const [addedTodaysDish, setAddedTodaysDish] = useState(false);

  // const handelClickAction = (action) => {
  //   switch(action) {

  //   }
  // }

  return (
    <div
      style={{
        background: "#fff", borderRadius: 12, boxShadow: "0 2px 6px #e5eaf0",
        padding: 18, display: "flex", flexDirection: "column", width: 'auto', justifyContent: "center", height: "100%"
      }}>
      <h4
        style={{
          fontWeight: "500",
          fontSize: 12,
          color: "#000000",
          fontFamily: "geist",
          width: "fit-content",
          height: "fit-content",
          paddingBottom: 20
        }}
      >
        Quick Actions
      </h4>
      <div className="w-full">
        <button
          style={{
            marginBottom: 8,
            borderRadius: 6,
            padding: "10px 12px",
            cursor: "pointer",
            fontFamily: "geist",
            fontSize: 13,
            width: '100%',
          }}
          className={addedTodaysDish === false ? "bg-[#ffe6daff] hover:bg-[#ffd5c1ff]" : "bg-[#EEFCFF] hover:bg-[#c7eaf280]"}
          onClick={() => { setAddedTodaysDish(!addedTodaysDish) }}
        >
          <span className="w-[100%] gap-2 flex justify-start">
            <Utensils size={20} />
            {addedTodaysDish ? "View Dish for Today" : "Add Dish for Today"}
          </span>
        </button>
      </div>
      <div className="w-full">
        <button
          style={{
            marginBottom: 8,
            borderRadius: 6,
            padding: "10px 12px",
            cursor: "pointer",
            fontFamily: "geist",
            fontSize: 13,
            width: '100%',
          }}
          className="bg-[#EEFCFF] hover:bg-[#c7eaf280]"
        >
          <span className="w-[100%] gap-2 flex justify-start">
            <CalendarDays size={20} />
            Schedule Event
          </span>
        </button>
      </div>
      <div className="w-full">
        <button
          style={{
            marginBottom: 8,
            borderRadius: 6,
            padding: "10px 12px",
            cursor: "pointer",
            fontFamily: "geist",
            fontSize: 13,
            width: '100%',
          }}
          className="bg-[#EEFCFF] hover:bg-[#c7eaf280]"
        >
          <span className="w-[100%] gap-2 flex justify-start">
            <UserPlus size={20} />
            Register Student
          </span>
        </button>
      </div>
    </div>
  );
}

export {
  QuickActions
}