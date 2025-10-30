import React from "react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";

function CustomTooltip({ active, payload, label }) {
  if (active && payload && payload.length) {
    return (
      <div
        style={{
          background: "#fff",
          borderRadius: "8px",
          boxShadow: "0 2px 8px #eee",
          padding: "8px 12px",
          border: "1px solid #eaebec",
          fontFamily: "geist",
          fontSize: 13,
          color: "#2d3748",
          minWidth: 140
        }}
        className="custom-tooltip"
      >
        {/* Header/label (e.g., month) */}
        <div style={{ fontWeight: 700, fontSize: 14, color: "#222", marginBottom: 6 }}>
          {label}
        </div>
        {/* Iterate each dataKey for this label */}
        {payload.map((entry) => (
          <div key={entry.dataKey} style={{ display: 'flex', alignItems: 'center', marginBottom: 4 }}>
            <div style={{
              width: 12,
              height: 12,
              background: entry.color,
              borderRadius: 2,
              display: 'inline-block',
              marginRight: 8,
            }} />
            <span style={{ color: "#242424", fontWeight: 600, marginRight: 6 }}>
              {entry.name || entry.dataKey}:
            </span>
            <span style={{ color: "#475569", fontWeight: 500 }}>
              {entry.value}
            </span>
          </div>
        ))}
      </div>
    );
  }
  return null;
}


function CustomLegend({ payload }) {
  return (
    <div style={{ display: "flex", gap: 20, alignItems: "center", justifyContent: "center" }}>
      {payload.map((entry) => (
        <div key={entry.value} style={{ width: "full", display: "flex", alignItems: "center", flexDirection: "row", justifyContent: "center", gap: 6 }}>
          {/* Colored square/box */}
          <div style={{
            width: 12,
            height: 12,
            background: entry.color,
            borderRadius: 2,   // use full 0 for hard square
            marginRight: 4
          }} />
          <span style={{
            fontFamily: "geist",
            color: "#4C4B4B",
            fontSize: 13,
            fontWeight: 500
          }}>
            {entry.value}
          </span>
        </div>
      ))}
    </div>
  );
}


function LineChartBox({ data }) {
  return (
    <div style={{ background: "#fff", borderRadius: 12, boxShadow: "0 2px 8px #eee", padding: 20 }}>
      <div
        style={{ padding: "5px 0px 5px 10px" }}
        className="w-full h-auto">
        <h3 style={{ fontFamily: "geist", color: "#4C4B4B", fontSize: 15, fontWeight: '500' }}>Student Meal Claim Trends</h3>
        <p style={{ fontFamily: "geist", fontSize: 12, fontWeight: '400', color: "#475569" }}>January 2025 - June 2025</p>
      </div>
      <ResponsiveContainer width="100%" height={230}>
        <LineChart data={data}>
          <XAxis
            dataKey="month"
            tick={{
              fontFamily: "geist",      // Your custom font
              fontSize: 13,             // Increase or decrease for readability
              fontWeight: 500,          // Bold or medium
              color: "#6C778B"
            }}
            tickLine={false}            // Hide tick lines for cleaner look
          />

          <YAxis />
          <Tooltip content={<CustomTooltip />} />
          <CartesianGrid stroke="#e6e6e6" />
          <Line type="monotone" dot={false} dataKey="Pre-packed Food" stroke="#1C6E81" strokeWidth={2} />
          <Line type="monotone" dot={false} dataKey="Customized Order" stroke="#6C43A7" strokeWidth={2} />
          <Line type="monotone" dot={false} dataKey="Unused vouchers" stroke="#D13B3B" strokeWidth={2} />
          <Legend content={<CustomLegend />} alignItems={"center"} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

export {
  LineChartBox
}