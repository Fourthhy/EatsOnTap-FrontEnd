import React from 'react';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  Legend 
} from 'recharts';

const DailyExpensesChart = ({ data }) => {
  const geistTickStyle = { fontFamily: 'geist', fontSize: 12, fill: '#666' };

  // Custom Tooltip to show Currency and Total Allotted
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      // Calculate Total Allotted (Sum of Claimed + Unclaimed)
      const claimed = payload.find(p => p.dataKey === 'claimed')?.value || 0;
      const unclaimed = payload.find(p => p.dataKey === 'unclaimed')?.value || 0;
      const totalAllotted = claimed + unclaimed;

      return (
        <div style={{
          background: "#fff",
          borderRadius: "8px",
          padding: "12px",
          border: "1px solid #eaebec",
          fontFamily: "geist",
          boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
          minWidth: "180px",
        }}>
          <p style={{ fontWeight: 600, marginBottom: 8, fontSize: 13, color: "#111" }}>
            {label}
          </p>
          
          <div style={{ marginBottom: 8, paddingBottom: 8, borderBottom: "1px solid #f0f0f0" }}>
             <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, marginBottom: 4 }}>
              <span style={{ color: "#10B981", fontWeight: 500 }}>● Claimed:</span>
              <span style={{ fontWeight: 600 }}>₱{claimed.toLocaleString()}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12 }}>
              <span style={{ color: "#EF4444", fontWeight: 500 }}>● Unclaimed:</span>
              <span style={{ fontWeight: 600 }}>₱{unclaimed.toLocaleString()}</span>
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, fontWeight: 600, color: "#374151" }}>
            <span>Total Allotted:</span>
            <span>₱{totalAllotted.toLocaleString()}</span>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div style={{ width: '100%', height: '300px' }}>
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart
          data={data}
          margin={{ top: 20, right: 20, left: 0, bottom: 0 }}
        >
          <defs>
            <linearGradient id="colorClaimed" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#10B981" stopOpacity={0.8}/>
              <stop offset="95%" stopColor="#10B981" stopOpacity={0}/>
            </linearGradient>
            <linearGradient id="colorUnclaimed" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#EF4444" stopOpacity={0.8}/>
              <stop offset="95%" stopColor="#EF4444" stopOpacity={0}/>
            </linearGradient>
          </defs>

          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F3F4F6" />
          
          <XAxis 
            dataKey="name" 
            tick={geistTickStyle} 
            axisLine={false}
            tickLine={false}
          />
          
          <YAxis 
            tick={geistTickStyle} 
            axisLine={false}
            tickLine={false}
            tickFormatter={(value) => `₱${value / 1000}k`} // Formats 20000 as ₱20k
          />
          
          <Tooltip content={<CustomTooltip />} cursor={{ stroke: '#9CA3AF', strokeWidth: 1, strokeDasharray: '4 4' }} />
          
          <Legend 
            verticalAlign="top" 
            height={36} 
            iconType="circle"
            wrapperStyle={{ fontFamily: 'geist', fontSize: '12px' }}
          />

          {/* STACKING LOGIC:
             Both Areas share `stackId="1"`. 
             They stack on top of each other. 
             The total height = Claimed + Unclaimed = Total Allotted.
          */}

          <Area 
            type="monotone" 
            dataKey="claimed" 
            name="Total Claimed"
            stackId="1" 
            stroke="#10B981" 
            fill="url(#colorClaimed)" 
            strokeWidth={2}
          />
          
          <Area 
            type="monotone" 
            dataKey="unclaimed" 
            name="Total Unclaimed"
            stackId="1" 
            stroke="#EF4444" 
            fill="url(#colorUnclaimed)" 
            strokeWidth={2}
          />
          
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};

export default DailyExpensesChart;