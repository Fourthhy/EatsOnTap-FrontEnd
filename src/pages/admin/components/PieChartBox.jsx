import React from "react";
import { PieChart, Pie, Cell } from "recharts";

const RADIAN = Math.PI / 180;
const COLORS = ["#076560", "#CF7171", "#9291A5"];

const renderCustomizedLabel = ({
  cx, cy, midAngle, innerRadius, outerRadius, percent
}) => {
  // Guard for undefined values to prevent errors
  cx = cx || 0;
  cy = cy || 0;
  midAngle = midAngle || 0;
  innerRadius = innerRadius || 0;
  outerRadius = outerRadius || 0;
  percent = percent || 0;

  const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);

  return (
    <text
      x={x}
      y={y}
      fill="white"
      textAnchor={x > cx ? 'start' : 'end'}
      dominantBaseline="central"
      fontSize={13}
      fontWeight='400'
      fontFamily="geist"
    >
      {`${(percent * 100).toFixed(0)}%`}
    </text>
  );
};

// Accepts an array of objects with {property, value}
export function PieChartBox({ data }) {
  // Guard for missing/undefined data array
  if (!data || !Array.isArray(data)) return null;

  function sumClaimedAndUnclaimed(data) {
    if (!Array.isArray(data)) return 0;
    return data.reduce((total, item) => {
      if (item.property === "Claimed" || item.property === "Unclaimed") {
        return total + (Number(item.value) || 0);
      }
      return total;
    }, 0);
  }

  return (
    <div className="flex flex-col justify-center items-center w-full max-w-md mx-auto">
      <PieChart width="auto" height="auto">
        <Pie
          data={data}
          cx="50%"
          cy="50%"
          labelLine={false}
          label={renderCustomizedLabel}
          outerRadius={120}
          // fill="black"
          dataKey="value"
          isAnimationActive={true}
        >
          {data.map((entry, index) => (
            <Cell key={`cell-${entry.property}-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
      </PieChart>
      <div
        style={{
          paddingBottom: "20px",
          fontSize: 12,
          color: "#000000"
        }}
        className="font-geist"
      >
        Total Allotted Meals: <span style={{ fontWeight: '500' }}>{sumClaimedAndUnclaimed(data)}</span>
      </div>
    </div>
  );
}
