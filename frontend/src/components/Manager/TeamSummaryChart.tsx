import React from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from 'recharts';

interface TeamSummaryChartProps {
  type: 'weekly' | 'department';
  data: any[]; // Changed to accept dynamic data
}

const COLORS = ['#4F46E5', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6'];

const TeamSummaryChart: React.FC<TeamSummaryChartProps> = ({ type, data }) => {
  // Graceful handling for empty or loading data
  if (!data || data.length === 0) {
      return (
          <div className="flex items-center justify-center h-full text-gray-400 text-sm">
              No data available to display.
          </div>
      );
  }

  if (type === 'weekly') {
    return (
      <div className="w-full h-72">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={data} // Use dynamic data prop
            margin={{ top: 20, right: 30, left: 0, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
            <XAxis 
                dataKey="name" 
                axisLine={false} 
                tickLine={false} 
                tick={{ fill: '#6B7280', fontSize: 12 }} 
                dy={10}
            />
            <YAxis 
                axisLine={false} 
                tickLine={false} 
                tick={{ fill: '#6B7280', fontSize: 12 }} 
            />
            <Tooltip 
                cursor={{ fill: '#F3F4F6' }}
                contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}
            />
            <Legend wrapperStyle={{ paddingTop: '20px' }} />
            <Bar dataKey="present" fill="#10B981" name="Present" radius={[4, 4, 0, 0]} barSize={20} />
            <Bar dataKey="late" fill="#F59E0B" name="Late" radius={[4, 4, 0, 0]} barSize={20} />
            {/* You can re-enable Absent if your backend provides it accurately */}
            {/* <Bar dataKey="absent" fill="#EF4444" name="Absent" radius={[4, 4, 0, 0]} barSize={20} /> */}
          </BarChart>
        </ResponsiveContainer>
      </div>
    );
  }

  // Department Pie Chart
  return (
    <div className="w-full h-72">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data} // Use dynamic data prop
            cx="50%"
            cy="50%"
            innerRadius={60}
            outerRadius={100}
            fill="#8884d8"
            paddingAngle={5}
            dataKey="value"
            label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
            labelLine={false}
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip 
            contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }} 
          />
          <Legend verticalAlign="bottom" height={36}/>
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};

export default TeamSummaryChart;