import React from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend, CartesianGrid } from "recharts";

function BarChartBox({ data }) {
  const geistTickStyle = { fontFamily: 'geist', fontSize: 12, fill: '#666' };

function CustomTooltip({ active, payload, label }) {
  if (active && payload && payload.length) {
    // Access the data object for the current hover item
    const data = payload[0].payload;

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
          minWidth: 140,
          boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)" // Optional: Added slight shadow for depth
        }}
      >
        {/* Header: Dish Names */}
        <div style={{ fontWeight: 600, fontSize: 14, color: "#111", marginBottom: 8 }}>
          {data.dayOfWeek} {data.date !== "" ? "" : "/"} {data.date} 
        </div>

        {/* Body: Statistics */}
        {payload.map((entry) => (
          <div key={entry.dataKey} style={{ display: 'flex', alignItems: 'center', marginBottom: 4 }}>
            {/* Solid Color Box */}
            <div style={{
              width: 14,
              height: 14,
              background: entry.color,
              borderRadius: 3,
              marginRight: 8,
              display: 'block'
            }} />
            
            <span style={{ fontWeight: 400, marginRight: 6, color: "#252525" }}>
              {entry.name || entry.dataKey}:
            </span>
            <span style={{ fontWeight: 400, color: "#475569" }}>
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
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "end",
          alignItems: "center",
          gap: 28,
          marginTop: 5,
          paddingBottom: 10 
        }}
        className="my-2"
      >
        {/* <div
          style={{ padding: "0px 0px 15px 10px" }}
          className="w-full h-auto"
        >
          <h3 style={{
            fontFamily: "geist",
            color: "#4C4B4B",
            fontSize: 15,
            fontWeight: '500'
          }}>
            Week Count
          </h3>
          <p style={{
            fontFamily: "geist",
            fontSize: 12,
            fontWeight: '400',
            color: "#475569"
          }}>
            August 18 - August 22, 2025
          </p>
        </div> */}
        <div
          style={{
            marginRight: "20px"
          }}
          className="w-full h-full flex flex-row justify-end gap-7">
          {payload.map((entry) => (
            <div key={entry.value}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 8,
              }}
            >
              {/* Solid color box */}
              <div style={{
                  width: 18,
                  height: 18,
                  background: entry.color,
                  borderRadius: 4,
                }} />

              <span style={{
                fontFamily: "geist",
                color: "#252525",
                fontSize: 13,
                fontWeight: 400,
                letterSpacing: ".01em"
              }}>
                {entry.value}
              </span>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="h-full w-full mx-auto flex flex-col items-center overflow-visible">

        <ResponsiveContainer width="100%" height={280}>
          <BarChart data={data}>
            <CartesianGrid stroke="#ccc" strokeDashoffset="3" vertical={false} />
            {/* Removed <defs> as gradients are no longer used */}
            
            <XAxis
              dataKey="dish1"
              tick={geistTickStyle}
            />
            <YAxis
              tickCount={7}
              fontSize={12}
              tick={geistTickStyle}
              domain={[0, 'dataMax']}
              interval={0}
              tickFormatter={v => Math.round(v)}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend
              content={<StyledLegend />}
              verticalAlign="top"
              align="center"
            />
            {/* UPDATED: Claimed set to #0e7973ff */}
            <Bar dataKey="Claimed" fill="#10B981" radius={[5, 5, 5, 5]} />
            
            {/* UPDATED: Unclaimed set to #CF7171 */}
            <Bar dataKey="Unclaimed" fill="#EF4444" radius={[5, 5, 5, 5]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </>
  );
}

export {
  BarChartBox
}