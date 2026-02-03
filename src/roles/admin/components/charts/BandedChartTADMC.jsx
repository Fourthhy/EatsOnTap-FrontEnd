import React from 'react';
import {
  ComposedChart,
  Line,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

// Custom Tooltip: Shows Metric Value Only (Clean Look)
const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    const valueItem = payload.find(p => p.dataKey === 'value');
    if (!valueItem) return null;

    return (
      <div style={{
        background: "#fff",
        borderRadius: "8px",
        padding: "10px 12px",
        border: "1px solid #eaebec",
        fontFamily: "geist",
        boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
        minWidth: "150px"
      }}>
        <p style={{ fontWeight: 600, marginBottom: 4, fontSize: 13, color: "#111" }}>{label}</p>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <div style={{ width: 8, height: 8, borderRadius: '50%', backgroundColor: "#10B981" }} />
          <span style={{ fontSize: 12, color: "#4b5563" }}>Avg Spending:</span>
          <span style={{ fontSize: 12, fontWeight: 600, color: "#111" }}>₱{valueItem.value}</span>
        </div>
      </div>
    );
  }
  return null;
};

// Custom Legend: Clean & Focused
const renderLegend = () => {
  const items = [
    { value: 'Target Range (₱58-₱62)', color: '#E5E7EB', type: 'square' }, 
    { value: 'Average Student Spending', color: '#10B981', type: 'line' }
  ];

  return (
    <div style={{ display: 'flex', justifyContent: 'center', gap: '24px', width: '100%', marginBottom: '10px' }}>
      {items.map((entry, index) => (
        <div key={index} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div style={{ 
            width: '12px', height: '12px', 
            backgroundColor: entry.color, 
            borderRadius: '2px',
            border: entry.color === '#E5E7EB' ? '1px solid #D1D5DB' : 'none'
          }} />
          <span style={{ color: '#4b5563', fontWeight: 500, fontSize: '12px', fontFamily: 'geist' }}>
            {entry.value}
          </span>
        </div>
      ))}
    </div>
  );
};

export function BandedChartTADMC({ data }) {
  const geistTickStyle = { fontFamily: 'geist', fontSize: 11, fill: '#6B7280' };

  // Data Processing: Ensure the band exists for every point
  const processedData = data.map(item => ({
    ...item,
    AcceptableRange: [58, 62] 
  }));

  return (
    <div style={{ width: '100%', height: '280px', display: "flex", flexDirection: "column" }}>
      <ResponsiveContainer width="100%" height="100%">
        <ComposedChart
          data={processedData}
          margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
        >
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F3F4F6" />
          
          <XAxis 
            dataKey="name" 
            tick={geistTickStyle}
            axisLine={false}
            tickLine={false}
            interval="preserveStartEnd"
          />

          <YAxis 
            yAxisId="left"
            orientation="left"
            // Dynamic Domain: Auto-scales based on data, ensuring the target range is visible
            domain={['auto', 'auto']} 
            tick={geistTickStyle}
            axisLine={false}
            tickLine={false}
            tickFormatter={(value) => `₱${value}`}
          />

          <Tooltip content={<CustomTooltip />} cursor={{ stroke: '#E5E7EB', strokeWidth: 1 }} />
          
          <Legend 
            content={renderLegend} 
            verticalAlign='top'
            align="center"
          />
          
          {/* Target Range Band */}
          <Area 
            yAxisId="left"
            type="monotone" 
            dataKey="AcceptableRange" 
            stroke="none" 
            fill="#F3F4F6" 
            fillOpacity={1}
            activeDot={false}
            isAnimationActive={false} 
          />
          
          {/* Metric Line */}
          <Line 
            yAxisId="left"
            type="monotone" 
            dataKey="value" 
            name="Average Student Spending" 
            stroke="#10B981"
            strokeWidth={3} 
            dot={{ r: 4, fill: "#10B981", strokeWidth: 2, stroke: "#fff" }}
            activeDot={{ r: 6, strokeWidth: 0 }}
            connectNulls 
          />
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  );
}