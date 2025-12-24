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
  DefaultTooltipContent,
} from 'recharts';

const renderTooltipWithoutRange = ({ payload, content, ...rest }) => {
  if (!payload) return <DefaultTooltipContent {...rest} />;
  const newPayload = payload.filter(x => x.dataKey !== 'AcceptableRange');
  return <DefaultTooltipContent payload={newPayload} {...rest} />;
};

// 1. Manually Render Legend for Gaps & Centering
const renderLegendWithoutRange = ({ payload }) => {
  const items = [
    {
       value: 'Target Range (₱90-₱100)',
       color: '#cccccc',
       type: 'square'
    },
    {
       value: 'Credit Utilization Rate',
       color: '#10B981', // Updated to consistent green. Change back to #1919b5ff if needed.
       type: 'line'
    }
  ];

  return (
    <div style={{ 
      display: 'flex', 
      justifyContent: 'center', 
      gap: '24px', // Gap between legend items
      width: '100%' 
    }}>
      {items.map((entry, index) => (
        <div key={index} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div style={{ 
            width: '12px', 
            height: '12px', 
            backgroundColor: entry.color,
            borderRadius: '2px'
          }} />
          <span style={{ color: '#374151', fontWeight: 500 }}>
            {entry.value}
          </span>
        </div>
      ))}
    </div>
  );
};

export function BandedChartCUR({ data }) {
  const geistTickStyle = { fontFamily: 'geist', fontSize: 12, fill: '#666' };

  return (
    <div style={{ padding: '10px', width: '100%', height: '300px', display: "flex", justifyContent: "center", alignItems: "end" }}>

      <ResponsiveContainer width="100%" height="98%">
        <ComposedChart
          data={data}
          // 2. INCREASED TOP MARGIN: Pushes chart down for Legend
          margin={{ top: 30, right: -20, left: 0, bottom: 0 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          
          <XAxis 
            dataKey="Day"   
            tick={geistTickStyle}
          />

          <YAxis 
            yAxisId="left"
            orientation="left"
            domain={[85, 100]}
            tick={geistTickStyle}
            label={{ 
                value: 'Cost (in ₱)', 
                angle: -90, 
                position: 'insideLeft',
                style: { fontFamily: 'geist' }
            }} 
          />

          <YAxis 
            yAxisId="right"
            orientation="right"
            domain={[85, 105]}
            tick={geistTickStyle}
            axisLine={false}
          />

          <Tooltip 
            content={renderTooltipWithoutRange}
            contentStyle={{ fontFamily: 'geist', fontSize: '12px', borderColor: "rgba(102, 102, 102, 0.5)", borderRadius: 5 }} 
            labelStyle={{ fontFamily: 'geist', fontSize: '12px' }} 
            itemStyle={{ fontFamily: 'geist', fontSize: '12px' }} 
          />
          
          <Area 
            yAxisId="left"
            type="monotone" 
            dataKey="AcceptableRange" 
            stroke="none" 
            fill="#cccccc"
            connectNulls 
            dot={false} 
            activeDot={false} 
          />
          
          <Line 
            yAxisId="left"
            type="monotone" 
            dataKey="TADMC" 
            name="Credit Utilization Rate" 
            stroke="#10B981" // Consistent Green
            strokeWidth={2} 
            connectNulls 
          />
          
          <Legend 
            content={renderLegendWithoutRange} 
            wrapperStyle={{ 
              fontFamily: 'geist', 
              fontSize: '12px',
              // 3. PADDING BELOW LEGEND
              paddingBottom: '20px', 
              width: '100%'
            }}
            verticalAlign='top'
            align="center"
          />
        </ComposedChart>
      </ResponsiveContainer>
    
    </div>
  );
}