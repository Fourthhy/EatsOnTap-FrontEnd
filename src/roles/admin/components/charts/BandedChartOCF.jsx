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

// MODIFIED: Manual Legend Rendering for Gap and Centering
const renderLegendWithoutRange = ({ payload }) => {
  const items = [
    {
       value: 'Target Range (₱0-₱15)',
       color: '#cccccc',
       type: 'square'
    },
    {
       value: 'Overclaim Frequency',
       color: '#10B981', // Matches the requested Line color
       type: 'line'
    }
  ];

  return (
    <div style={{ 
      display: 'flex', 
      justifyContent: 'center', 
      gap: '24px', // Controls the gap between items
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

export function BandedChartOCF({ data }) {
  const geistTickStyle = { fontFamily: 'geist', fontSize: 12, fill: '#666' };

  return (
    <div style={{ padding: '10px', width: '100%', height: '300px', display: "flex", justifyContent: "center", alignItems: "end" }}>

      <ResponsiveContainer width="100%" height="98%">
        <ComposedChart
          data={data}
          // Added top margin for Legend spacing
          margin={{ top: 10, right: -20, left: 0, bottom: 0 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          
          <XAxis 
            dataKey="Day"   
            tick={geistTickStyle}
          />

          <YAxis 
            yAxisId="left"
            orientation="left"
            domain={[0, 20]}
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
            domain={[0, 20]}
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
            name="Overclaim Frequency" 
            stroke="#10B981" // UPDATED COLOR
            strokeWidth={2} 
            connectNulls 
          />
          
          <Legend 
            content={renderLegendWithoutRange} 
            wrapperStyle={{ 
              fontFamily: 'geist', 
              fontSize: '12px',
              paddingBottom: '20px', // ADDED PADDING
              width: '100%'
            }}
            verticalAlign='top'
            align="center" // CENTERED
          />
        </ComposedChart>
      </ResponsiveContainer>
    
    </div>
  );
}