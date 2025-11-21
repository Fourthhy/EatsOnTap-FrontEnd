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
  DefaultLegendContent,
  DefaultTooltipContent,
} from 'recharts';

// #region Sample data for KPI-003 (TADMC)
// UPDATED: AcceptableRange set to [90, 100]
// UPDATED: Sample TADMC values increased to ~95 to fit visually within the new range

// #endregion

const renderTooltipWithoutRange = ({ payload, content, ...rest }) => {
  if (!payload) return <DefaultTooltipContent {...rest} />;
  const newPayload = payload.filter(x => x.dataKey !== 'AcceptableRange');
  
  return <DefaultTooltipContent payload={newPayload} {...rest} />;
};

const renderLegendWithoutRange = ({ payload, content, ref, ...rest }) => {
  if (!payload) return <DefaultLegendContent {...rest} />;

  const newPayload = payload
    .filter(x => x.dataKey !== 'AcceptableRange')
    .map(item => ({
      ...item,
      value: item.dataKey === 'TADMC' ? 'Credit Utilization Rate' : item.value 
    }));
    
  if (payload.some(x => x.dataKey === 'AcceptableRange')) {
    newPayload.unshift({
      dataKey: 'AcceptableRange',
      color: '#cccccc',
      type: 'square',
      // UPDATED: Legend text to match new range
      value: 'Target Range (₱90-₱100)'
    });
  }
  return <DefaultLegendContent payload={newPayload} {...rest} />;
};

export function BandedChartCUR({data}) {
  // Style object for the geist font
  const geistTickStyle = { fontFamily: 'geist', fontSize: 12, fill: '#666' };

  return (
    <div style={{ padding: '20px', width: '100%', height: '300px', display: "flex", justifyContent: "center", alignItems: "end" }}>

      <ResponsiveContainer width="100%" height="98%">
        <ComposedChart
          data={data}
          margin={{ top: 0, right: -20, left: 0, bottom: 0 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          
          <XAxis 
            dataKey="Day"   
            tick={geistTickStyle}
          />

          <YAxis 
            yAxisId="left"
            orientation="left"
            // UPDATED: Domain shifted to 85-105 to view the 90-100 range comfortably
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
            // UPDATED: Domain shifted to 85-105 to match left axis
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
            stroke="#1919b5ff"
            strokeWidth={2} 
            connectNulls 
          />
          
          <Legend 
            content={renderLegendWithoutRange} 
            wrapperStyle={{ 
              fontFamily: 'geist', 
              fontSize: '12px' ,
              display: 'flex',
              flexDirection: 'row',
              justifyContent: 'end',
            }}
            verticalAlign='top'
            
          />
        </ComposedChart>
      </ResponsiveContainer>
    
    </div>
  );
}