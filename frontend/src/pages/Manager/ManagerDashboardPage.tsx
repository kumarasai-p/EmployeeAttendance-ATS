import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import axios from 'axios';
import { useSelector } from 'react-redux';
import type { RootState } from '../../redux/store';
// Import the chart component
import TeamSummaryChart from '../../components/Manager/TeamSummaryChart'; 

const ManagerDashboardPage: React.FC = () => {
  const { user } = useSelector((state: RootState) => state.auth);
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        // Ensure token is passed for authentication
        const config = { headers: { Authorization: `Bearer ${user?.token}` } };
        const res = await axios.get('http://localhost:5000/api/dashboard/manager', config);
        setStats(res.data);
      } catch (err) {
        console.error("Failed to fetch dashboard stats", err);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, [user]);

  if (loading) {
      return (
        <div className="flex justify-center items-center h-screen bg-gray-50">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
        </div>
      );
  }

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="p-8 bg-gray-50 min-h-screen">
      <h1 className="text-4xl font-extrabold text-gray-900 mb-6">Manager Overview Dashboard</h1>
      
      <p className="text-gray-600 mb-8">Here is the daily overview of your team's attendance.</p>

      {/* 1. Key Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard label="Total Employees" value={stats?.totalEmployees} color="blue" iconPath="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
        <StatCard label="Present Today" value={stats?.present} color="green" iconPath="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        <StatCard label="Late Arrivals" value={stats?.late} color="yellow" iconPath="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        <StatCard label="Absent" value={stats?.absent} color="red" iconPath="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
      </div>

      {/* 2. Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        {/* Weekly Trend Chart */}
        <div className="card bg-white p-6 rounded-xl shadow-sm border border-gray-100 h-96 flex flex-col">
            <h3 className="text-lg font-bold text-gray-800 mb-4">Weekly Attendance Trend</h3>
            <div className="flex-1 min-h-0">
                {/* FIX: Render the actual chart component with data */}
                <TeamSummaryChart type="weekly" data={stats?.weeklyTrend || []} />
            </div>
        </div>

        {/* Department Breakdown Chart */}
        <div className="card bg-white p-6 rounded-xl shadow-sm border border-gray-100 h-96 flex flex-col">
            <h3 className="text-lg font-bold text-gray-800 mb-4">Department-wise Breakdown</h3>
            <div className="flex-1 min-h-0">
                {/* FIX: Render the actual chart component with data */}
                <TeamSummaryChart type="department" data={stats?.departmentData || []} />
            </div>
        </div>
      </div>
    </motion.div>
  );
};

// Reusable Stat Card Component
const StatCard = ({ label, value, color, iconPath }: any) => {
    // Dynamic Tailwind classes need full strings to work reliably with purge, 
    // so we map them explicitly here.
    const colorClasses: Record<string, { border: string, text: string, bg: string }> = {
        blue: { border: 'border-blue-500', text: 'text-blue-600', bg: 'bg-blue-100' },
        green: { border: 'border-green-500', text: 'text-green-600', bg: 'bg-green-100' },
        yellow: { border: 'border-yellow-500', text: 'text-yellow-600', bg: 'bg-yellow-100' },
        red: { border: 'border-red-500', text: 'text-red-600', bg: 'bg-red-100' },
    };

    const style = colorClasses[color] || colorClasses.blue;

    return (
        <motion.div 
            className={`card p-6 bg-white border-l-4 ${style.border} shadow-sm rounded-r-xl`} 
            initial={{ y: 20, opacity: 0 }} 
            animate={{ y: 0, opacity: 1 }}
        >
            <div className="flex justify-between items-center">
                <div>
                    <h2 className="text-xs font-bold text-gray-500 uppercase tracking-wider">{label}</h2>
                    <p className={`text-3xl font-extrabold ${style.text} mt-2`}>{value}</p>
                </div>
                <div className={`p-3 rounded-full ${style.bg} ${style.text}`}>
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={iconPath}></path>
                    </svg>
                </div>
            </div>
        </motion.div>
    );
}

export default ManagerDashboardPage;