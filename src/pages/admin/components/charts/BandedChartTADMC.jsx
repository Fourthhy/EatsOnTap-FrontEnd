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

const renderTooltipWithoutRange = ({ payload, content, ...rest }) => {
  if (!payload) return <DefaultTooltipContent {...rest} />;
  const newPayload = payload.filter(x => x.dataKey !== 'AcceptableRange');
  
  // Note: The styles passed to the <Tooltip> component are found in `rest` 
  // and passed down to DefaultTooltipContent here.
  return <DefaultTooltipContent payload={newPayload} {...rest} />;
};

const renderLegendWithoutRange = ({ payload, content, ref, ...rest }) => {
  if (!payload) return <DefaultLegendContent {...rest} />;

  const newPayload = payload
    .filter(x => x.dataKey !== 'AcceptableRange')
    .map(item => ({
      ...item,
      value: item.dataKey === 'TADMC' ? 'Average Student Spending' : item.value 
    }));
    
  if (payload.some(x => x.dataKey === 'AcceptableRange')) {
    newPayload.unshift({
      dataKey: 'AcceptableRange',
      color: '#ccccccff',
      type: 'square',
      value: 'Target Range (₱58-₱62)'
    });
  }
  return <DefaultLegendContent payload={newPayload} {...rest} />;
};

export function BandedChartTADMC({data}) {
  // Style object for the geist font
  const geistTickStyle = { fontFamily: 'geist', fontSize: 12, fill: '#666' };

  return (
    <div style={{ padding: '10px', width: '100%', height: '300px', display: "flex", justifyContent: "center", alignItems: "end" }}>

      <ResponsiveContainer width="100%" height="100%">
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
            domain={[55, 65]}
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
            domain={[55, 65]}
            tick={geistTickStyle}
            axisLine={false}
          />

          {/* MODIFIED TOOLTIP */}
          <Tooltip 
            content={renderTooltipWithoutRange}
            contentStyle={{ fontFamily: 'geist', fontSize: '12px', borderColor: "rgba(102, 102, 102, 0.5)", borderRadius: 5 }} // Styles the box
            labelStyle={{ fontFamily: 'geist', fontSize: '12px' }}   // Styles the header (Day)
            itemStyle={{ fontFamily: 'geist', fontSize: '12px' }}    // Styles the value list
          />
          
          <Area 
            yAxisId="left"
            type="monotone" 
            dataKey="AcceptableRange" 
            stroke="none" 
            fill="#ccccccff"
            connectNulls 
            dot={false} 
            activeDot={false} 
          />
          
          <Line 
            yAxisId="left"
            type="monotone" 
            dataKey="TADMC" 
            name="Average Student Spending" 
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
            align="end"
          />
        </ComposedChart>
      </ResponsiveContainer>
    
    </div>
  );
}