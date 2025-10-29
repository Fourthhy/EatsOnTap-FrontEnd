import React from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend } from "recharts";

function BarChartBox({ data }) {
  return (
    <div style={{ background: "#fff", borderRadius: 12, boxShadow: "0 2px 8px #eee", padding: 20, marginTop: 24 }}>
      <h3 style={{ marginBottom: 12 }}>Week Count</h3>
      <ResponsiveContainer width="100%" height={220}>
        <BarChart data={data}>
          <XAxis dataKey="dish" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="Claimed" fill="#2582DA" />
          <Bar dataKey="Unclaimed" fill="#97C0F7" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

export {
  BarChartBox
}