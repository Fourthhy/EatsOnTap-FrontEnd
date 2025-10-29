import React from "react";
import { PieChart, Pie, Cell, Legend } from "recharts";

const COLORS = ["#16B67A", "#F88B51", "#B8B8B8"];
function PieChartBox({ data }) {
  return (
    <PieChart width={180} height={180}>
      <Pie
        data={data}
        cx={90}
        cy={90}
        innerRadius={50}
        outerRadius={80}
        dataKey="value"
        startAngle={90}
        endAngle={450}
        label
      >
        {data.map((entry, idx) => <Cell key={entry.name} fill={COLORS[idx % COLORS.length]} />)}
      </Pie>
      <Legend verticalAlign="bottom" height={36}/>
    </PieChart>
  );
}

export {
    PieChartBox 
}