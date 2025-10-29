import React from "react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";

export default function LineChartBox({ data }) {
  return (
    <div style={{ background: "#fff", borderRadius: 12, boxShadow: "0 2px 8px #eee", padding: 20, marginTop: 18 }}>
      <h3 style={{ marginBottom: 12 }}>Student Meal Claim Trends</h3>
      <ResponsiveContainer width="100%" height={180}>
        <LineChart data={data}>
          <XAxis dataKey="month" />
          <YAxis />
          <Tooltip />
          <Legend />
          <CartesianGrid stroke="#e6e6e6"/>
          <Line type="monotone" dataKey="Pre-packed Food" stroke="#2582DA" strokeWidth={3}/>
          <Line type="monotone" dataKey="Customized Order" stroke="#16B67A" strokeWidth={3}/>
          <Line type="monotone" dataKey="Unused vouchers" stroke="#F88B51" strokeWidth={3}/>
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
