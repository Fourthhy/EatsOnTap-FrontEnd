import React from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend, CartesianGrid } from "recharts";

function BarChartBox({ data }) {

  function DishTick({ x, y, payload }) {
    const { dish1, dish2, dayOfWeek } = data[payload.index];
    return (
      <>
        <g transform={`translate(${x},${y})`}>
          <text x={0} y={8} dy={0} textAnchor="middle" fill="#000" fontSize={12} fontFamily="geist">
            {dish1} {dish2 && "/"}
          </text>
          {dish2 && (
            <text x={0} y={8} dy={14} textAnchor="middle" fill="#000" fontSize={12} fontFamily="geist">
              {dish2} <br />
              <span>
                {dayOfWeek}
              </span>
            </text>
          )}
          {/* {dayOfWeek && (
            <text x={0} y={0} dy={14} textAnchor="middle" fill="#6C778B" fontSize={10} fontFamily="geist">
              {dayOfWeek}
            </text>
          )} */}
        </g>
      </>
    );
  }

  function CustomTooltip({ active, payload }) {
    if (active && payload && payload.length) {
      // The first item in payload contains the current data object
      const currentData = payload[0].payload;

      return (
        <div
          style={{
            padding: "7px 2px 7px 4px",
          }}
          className="bg-white rounded shadow-lg px-3 py-2 border border-gray-200 text-sm font-geist">
          <div>
            <p
              style={{
                fontFamily: "geist",
                fontSize: 14,
                color: "#000",
                fontWeight: "600"
              }}
            >
              {currentData.dayOfWeek}
            </p>
          </div>
          <div style={{ marginTop: '6px' }}>
            <span
              style={{
                color: "#076560",
                fontWeight: "550",
                fontSize: 13,
                fontFamily: "geist"
              }}>
              Claimed:
            </span>
            <span
              style={{
                color: "#000",
                fontWeight: "600",
                fontSize: 13,
                fontFamily: "geist"
              }}
            >
              &nbsp; {currentData.Claimed}
            </span>
          </div>
          <div>
            <span
              style={{
                color: "#CF7171",
                fontWeight: "550",
                fontSize: 13,
                fontFamily: "geist"
              }}>
              Unclaimed:
            </span>
            <span
              style={{
                color: "#000",
                fontWeight: "600",
                fontSize: 13,
                fontFamily: "geist"
              }}>
              &nbsp; {currentData.Unclaimed}
            </span>
          </div>
        </div>
      );
    }
    return null;
  }


  return (
    <>
      <div className="h-full w-full mx-auto flex flex-col items-center">
        <div
          style={{ padding: "10px 0px 10px 10px" }}
          className="w-full h-auto">
          <h3 style={{ fontFamily: "geist", color: "#4C4B4B", fontSize: 15, fontWeight: '500' }}>Week Count</h3>
          <p style={{ fontFamily: "geist", fontSize: 12, fontWeight: '400', color: "#475569" }}>  August 18 - August 22, 2025</p>
        </div>
        <ResponsiveContainer width="100%" height={260}>
          <BarChart data={data}>
            <CartesianGrid stroke="#ccc" strokeDashoffset="3" vertical={false} />
            <defs>
              <linearGradient id="unclaimedGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#1F3463" />
                <stop offset="100%" stopColor="#3F6AC9" />
              </linearGradient>
            </defs>
            <XAxis
              dataKey="dish1"
              tick={<DishTick />}
            />
            <YAxis
              tickCount={10}               // More ticks, smoother increment
              fontSize={12}                // Larger font
              tick={{ fontFamily: "geist", fill: "#000", fontWeight: '500' }} // Custom style
              domain={[0, 'dataMax']}      // Ensures axis goes to max value in your data
              interval={0}                 // Shows all ticks if space allows
              tickFormatter={v => Math.round(v)} // Rounds tick labels for clarity
            />
            <Tooltip content={<CustomTooltip />} />
            {/* <Legend /> */}
            <Bar dataKey="Claimed" fill="#5594E2" radius={[5, 5, 5, 5]} />
            <Bar dataKey="Unclaimed" fill="url(#unclaimedGradient)" radius={[5, 5, 5, 5]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </>
  );
}

export {
  BarChartBox
}