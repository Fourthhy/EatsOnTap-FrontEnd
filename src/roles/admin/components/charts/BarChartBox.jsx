import React from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend, CartesianGrid } from "recharts";

function BarChartBox({ data }) {
  const geistTickStyle = { fontFamily: 'geist', fontSize: 12, fill: '#666' };

  function CustomTooltip({ active, payload }) {
    if (active && payload && payload.length) {
      const itemData = payload[0].payload;

      return (
        <div
          style={{
            background: "#fff",
            borderRadius: "8px",
            padding: "10px 12px",
            border: "1px solid #eaebec",
            fontFamily: "geist",
            fontSize: 13,
            color: "#2d3748",
            minWidth: 160,
            boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)"
          }}
        >
          {/* Header: Displays Day and Date if available */}
          <div style={{ fontWeight: 600, fontSize: 14, color: "#111", marginBottom: 4 }}>
            {itemData.dayOfWeek} {itemData.date ? `| ${itemData.date}` : ""}
          </div>
          
          {/* Subheader: Dish Name */}
          <div style={{ fontSize: 11, color: "#718096", marginBottom: 8, fontStyle: 'italic' }}>
            {itemData.dish || "No menu data"}
          </div>

          {/* Body: Statistics */}
          {payload.map((entry) => (
            <div key={entry.dataKey} style={{ display: 'flex', alignItems: 'center', marginBottom: 4 }}>
              <div style={{
                width: 10,
                height: 10,
                background: entry.color,
                borderRadius: 2,
                marginRight: 8,
              }} />
              
              <span style={{ fontWeight: 400, marginRight: 6, color: "#252525" }}>
                {entry.name || entry.dataKey}:
              </span>
              <span style={{ fontWeight: 600, color: "#111" }}>
                {entry.value}
              </span>
            </div>
          ))}
        </div>
      );
    }
    return null;
  }

  function StyledLegend({ payload }) {
    return (
      <div style={{ display: "flex", justifyContent: "end", gap: 28, marginTop: 5, paddingBottom: 10 }}>
        <div className="flex flex-row gap-7 mr-5">
          {payload.map((entry) => (
            <div key={entry.value} style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <div style={{ width: 14, height: 14, background: entry.color, borderRadius: 3 }} />
              <span style={{ fontFamily: "geist", color: "#252525", fontSize: 12, fontWeight: 400 }}>
                {entry.value}
              </span>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="h-full w-full flex flex-col items-center">
      <ResponsiveContainer width="100%" height={280}>
        <BarChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
          <CartesianGrid stroke="#f0f0f0" vertical={false} />
          
          <XAxis
            dataKey="dayOfWeek" // 🟢 FIXED: Matches your JSON 'dayOfWeek'
            tick={geistTickStyle}
            axisLine={false}
            tickLine={false}
          />
          <YAxis
            tickCount={6}
            tick={geistTickStyle}
            axisLine={false}
            tickLine={false}
            domain={[0, 'auto']}
          />
          
          <Tooltip content={<CustomTooltip />} cursor={{ fill: '#f7fafc' }} />
          
          <Legend
            content={<StyledLegend />}
            verticalAlign="top"
          />

          {/* 🟢 FIXED: Keys match "Claimed" and "Unclaimed" in your JSON */}
          <Bar name="Claimed" dataKey="Claimed" fill="#10B981" radius={[4, 4, 0, 0]} barSize={35} />
          <Bar name="Unclaimed" dataKey="Unclaimed" fill="#EF4444" radius={[4, 4, 0, 0]} barSize={35} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

export { BarChartBox };