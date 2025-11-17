import React from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend, CartesianGrid } from "recharts";

function BarChartBox({ data }) {

  function DishTick({ x, y, payload }) {
    const { dish1, dish2, dayOfWeek } = data[payload.index];
    return (
      <>
        <g transform={`translate(${x},${y})`}>
          <text x={0} y={8} dy={0} textAnchor="middle" fill="#000" fontSize={11} fontFamily="geist">
            {dish1} {dish2 && "/"}
          </text>
          {dish2 && (
            <text x={0} y={8} dy={14} textAnchor="middle" fill="#000" fontSize={11} fontFamily="geist">
              {dish2}
            </text>
          )}
          {/* {dayOfWeek && (
            <text x={0} y={0} dy={28} textAnchor="middle" fill="#6C778B" fontSize={10} fontFamily="geist">
              {dayOfWeek}
            </text>
          )} */}
        </g>
      </>
    );
  }

  function CustomTooltip({ active, payload, label }) {
    if (active && payload && payload.length) {
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
            minWidth: 140
          }}
        >
          {/* Example: show dayOfWeek, you can adjust as needed */}
          {payload[0].payload && payload[0].payload.dayOfWeek && (
            <div style={{ fontWeight: 700, fontSize: 14, color: "#222", marginBottom: 5 }}>
              {payload[0].payload.dayOfWeek}
            </div>
          )}
          {payload.map((entry) => (
            <div key={entry.dataKey} style={{ display: 'flex', alignItems: 'center', marginBottom: 4 }}>
              {/* Icon: solid color box or gradient */}
              {entry.color && entry.color.startsWith("url") ? (
                // Use a unique gradient id for tooltip legend if needed
                <svg width={14} height={14} style={{ borderRadius: 3, marginRight: 8, display: 'block' }}>
                  <defs>
                    <linearGradient id="unclaimedGradientTooltip" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#1F3463" />
                      <stop offset="100%" stopColor="#3F6AC9" />
                    </linearGradient>
                  </defs>
                  {/* Use fill that matches the Bar's gradient */}
                  <rect x={0} y={0} width={14} height={14} rx={3} fill="url(#unclaimedGradientTooltip)" />
                </svg>
              ) : (
                <div style={{
                  width: 14,
                  height: 14,
                  background: entry.color,
                  borderRadius: 3,
                  marginRight: 8,
                  display: 'block'
                }} />
              )}
              {/* Key/Label bold, value regular */}
              <span style={{ fontWeight: 700, marginRight: 6, color: "#252525" }}>
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
          justifyContent: "center",
          alignItems: "center",
          gap: 28,
          marginTop: 5,
        }}
        className="my-2"
      >
        <div
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
        </div>
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
              {entry.color.startsWith('#')
                ? <div style={{
                  width: 18,
                  height: 18,
                  background: entry.color,
                  borderRadius: 4,
                }} />
                : (
                  // Gradient box: SVG rect referencing same gradient as chart
                  <svg width={18} height={18} style={{
                    borderRadius: 4,
                    display: 'block'
                  }}>
                    <defs>
                      <linearGradient id="unclaimedGradientLegend" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#1F3463" />
                        <stop offset="100%" stopColor="#3F6AC9" />
                      </linearGradient>
                    </defs>
                    <rect x={0} y={0} width={18} height={18} rx={4} fill="url(#unclaimedGradientLegend)" />
                  </svg>
                )
              }
              <span style={{
                fontFamily: "geist",
                color: "#252525",
                fontSize: 13,
                fontWeight: 600,
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

        <ResponsiveContainer width="98%" height={290}>
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
              tickCount={7}               // More ticks, smoother increment
              fontSize={12}                // Larger font
              tick={{ fontFamily: "geist", fill: "#000", fontWeight: '500' }} // Custom style
              domain={[0, 'dataMax']}      // Ensures axis goes to max value in your data
              interval={0}                 // Shows all ticks if space allows
              tickFormatter={v => Math.round(v)} // Rounds tick labels for clarity
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend
              content={<StyledLegend />}
              verticalAlign="top"      // or 'bottom'
              align="center"
            />
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