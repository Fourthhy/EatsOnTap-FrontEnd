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
// UPDATED: AcceptableRange set to [0, 15]
// UPDATED: Sample TADMC values scaled down to ~2-16 to fit visually within the new range
const tadmcData = [
  { Day: 'Mon 1', AcceptableRange: [0, 15], TADMC: 5.50 },
  { Day: 'Tue 2', AcceptableRange: [0, 15], TADMC: 12.25 },
  { Day: 'Wed 3', AcceptableRange: [0, 15], TADMC: 8.80 },
  { Day: 'Thu 4', AcceptableRange: [0, 15], TADMC: 1.90 },
  { Day: 'Fri 5', AcceptableRange: [0, 15], TADMC: 16.50 },
  { Day: 'Sat 6', AcceptableRange: [0, 15], TADMC: 10.90 },
  { Day: 'Mon 8', AcceptableRange: [0, 15], TADMC: 7.00 },
];
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
      value: item.dataKey === 'TADMC' ? 'Overclaim Frequency' : item.value 
    }));
    
  if (payload.some(x => x.dataKey === 'AcceptableRange')) {
    newPayload.unshift({
      dataKey: 'AcceptableRange',
      color: '#cccccc',
      type: 'square',
      // UPDATED: Legend text to match new range
      value: 'Target Range (₱0-₱15)'
    });
  }
  return <DefaultLegendContent payload={newPayload} {...rest} />;
};

export function BandedChartOCF() {
  // Style object for the geist font
  const geistTickStyle = { fontFamily: 'geist', fontSize: 12, fill: '#666' };

  return (
    <div style={{ padding: '20px', width: '100%', height: '300px', display: "flex", justifyContent: "center", alignItems: "end" }}>

      <ResponsiveContainer width="100%" height="98%">
        <ComposedChart
          data={tadmcData}
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
            // UPDATED: Domain shifted to 0-20 to view the 0-15 range comfortably
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
            // UPDATED: Domain shifted to match left axis
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