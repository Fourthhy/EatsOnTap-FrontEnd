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
    <div style={{ display: "flex", gap: 20, alignItems: "center", justifyContent: "end", marginTop: 10, paddingBottom: 10 }}>
      {payload.map((entry) => (
        <div key={entry.value} style={{ display: "flex", alignItems: "center", flexDirection: "row", gap: 6 }}>
          {/* Colored square/box */}
          <div style={{
            width: 12,
            height: 12,
            background: entry.color,
            borderRadius: 2,
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
  const geistTickStyle = { fontFamily: 'geist', fontSize: 12, fill: '#666' };


  return (
    <div style={{ width: "100%", height: 230, marginRight: 10 }}>
      {/* FIX: Changed width="full" to width="100%" */}
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data}>
          <CartesianGrid stroke="#e6e6e6" vertical={false} />
          <XAxis
            dataKey="dataSpan"
            tick={geistTickStyle}
            tickLine={false}
            axisLine={false}
            dy={10} // Adds padding between chart and labels
          />
          <YAxis
            hide={false} // Ensure YAxis is visible, or set to true to hide lines but keep scale
            tickLine={false}
            axisLine={false}
            tick={geistTickStyle}
          />
          <Tooltip content={<CustomTooltip />} cursor={{ stroke: '#eaebec', strokeWidth: 2 }} />

          <Line type="linear" dataKey="Pre-packed Food" stroke="#21198cff" strokeWidth={2} dot={false} activeDot={{ r: 5 }} />
          <Line type="linear" dataKey="Customized Order" stroke="#3836b2ff" strokeWidth={2} dot={false} activeDot={{ r: 5 }} />
          <Line type="linear" dataKey="Unused vouchers" stroke="#D13B3B" strokeWidth={2} dot={false} activeDot={{ r: 5 }} />

          <Legend
            content={<CustomLegend />} 
            verticalAlign="top"
            align="end"
            />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

export { LineChartBox };