import React, { useEffect, useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { useDispatch, useSelector } from 'react-redux';
import type { AppDispatch, RootState } from '../../redux/store';
import { getMySummary } from '../../redux/slices/attendanceSlice';
import QuickActionButton from '../../components/common/QuickActionButton';

// Utility to get initial status from local storage
const getInitialStatus = (): 'Checked In' | 'Checked Out' | 'Not Checked In' => {
    const savedStatus = localStorage.getItem('todayStatus');
    const savedDate = localStorage.getItem('todayStatusDate');
    const today = new Date().toDateString();

    if (savedStatus && savedDate === today) {
        return savedStatus as 'Checked In' | 'Checked Out';
    }
    return 'Not Checked In'; 
}

const EmployeeDashboardPage: React.FC = () => {
    const dispatch: AppDispatch = useDispatch();
    const { user } = useSelector((state: RootState) => state.auth);
    const { summary, isLoading, message } = useSelector((state: RootState) => state.attendance);
    
    const [todayStatus, setTodayStatus] = useState<'Checked In' | 'Checked Out' | 'Not Checked In'>(getInitialStatus());

    const fetchDashboardData = useCallback(() => {
        dispatch(getMySummary());
    }, [dispatch]);

    useEffect(() => {
        fetchDashboardData();
    }, [fetchDashboardData]);

    useEffect(() => {
        if (summary && (summary as any).todayStatus) {
            const backendStatus = (summary as any).todayStatus;
            setTodayStatus(backendStatus);
            localStorage.setItem('todayStatus', backendStatus);
            localStorage.setItem('todayStatusDate', new Date().toDateString());
        }
    }, [summary]);

    const handleActionSuccess = (action: 'checkIn' | 'checkOut') => {
        const newStatus = action === 'checkIn' ? 'Checked In' : 'Checked Out';
        setTodayStatus(newStatus);
        localStorage.setItem('todayStatus', newStatus);
        localStorage.setItem('todayStatusDate', new Date().toDateString());
        setTimeout(() => fetchDashboardData(), 1000);
    };

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
    };
    
    const statItemVariants = {
        hidden: { y: 20, opacity: 0 },
        visible: { y: 0, opacity: 1 },
    };

    const stats = [
        { label: 'Present (On Time)', count: summary?.present ?? 0, color: 'text-green-600', icon: '✅' },
        { label: 'Absent', count: summary?.absent ?? 0, color: 'text-red-600', icon: '❌' },
        { label: 'Late', count: summary?.late ?? 0, color: 'text-yellow-600', icon: '⚠️' },
        { label: 'Total Hours', count: summary?.totalHours ? Number(summary.totalHours).toFixed(1) : '0.0', color: 'text-blue-600', icon: '⏱️' },
    ];

    return (
        <motion.div 
            variants={containerVariants}
            initial="hidden"
            animate="visible"
        >
            <h1 className="text-3xl font-extrabold text-gray-900 mb-6">
                Hello, {user?.name || 'Employee'}!
            </h1>

            {/* Quick Action & Today's Status */}
            <motion.div 
                className="card flex flex-col md:flex-row items-center justify-between bg-indigo-50 border-l-4 border-indigo-500 p-6 mb-8"
                variants={statItemVariants}
            >
                <div className="space-y-1 mb-4 md:mb-0">
                    <p className="text-xl font-semibold text-gray-700">Today's Attendance Status:</p>
                    <p className={`text-4xl font-extrabold ${todayStatus === 'Checked In' ? 'text-green-700' : 'text-red-700'}`}>
                        {todayStatus}
                    </p>
                </div>
                <QuickActionButton 
                    status={todayStatus} 
                    onActionSuccess={handleActionSuccess} 
                />
            </motion.div>

            {/* Monthly Summary Stats */}
            <h2 className="text-2xl font-bold text-gray-800 mb-4">This Month's Summary</h2>
            <motion.div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8" variants={containerVariants}>
                {isLoading && !summary ? (
                    <div className="col-span-full flex justify-center py-4">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
                    </div>
                ) : (
                    stats.map((stat) => (
                        <motion.div 
                            key={stat.label} 
                            className="card flex items-center space-x-4 hover:bg-gray-50 transition-colors"
                            variants={statItemVariants}
                        >
                            <div className="text-3xl p-3 bg-gray-100 rounded-full">{stat.icon}</div>
                            <div>
                                <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wide">{stat.label}</h3>
                                <p className={`text-2xl font-bold ${stat.color}`}>
                                    {stat.count} {stat.label === 'Total Hours' ? 'hrs' : 'days'}
                                </p>
                            </div>
                        </motion.div>
                    ))
                )}
            </motion.div>

            {/* NEW: Attendance Rules Information Section */}
            <motion.div 
                className="bg-blue-50 border border-blue-200 rounded-xl p-4 flex items-start space-x-3"
                variants={statItemVariants}
            >
                <div className="text-blue-500 mt-1">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                </div>
                <div>
                    <h3 className="font-bold text-blue-800 mb-1">Attendance Policy & Definitions</h3>
                    <ul className="text-sm text-blue-700 space-y-1 list-disc list-inside">
                        <li>
                            <span className="font-semibold">Present (On Time):</span> Check-in before <span className="font-bold">9:00 AM</span>.
                        </li>
                        <li>
                            <span className="font-semibold">Late:</span> Check-in after <span className="font-bold">9:00 AM</span>. (Note: "Late" days are counted separately from "Present" days).
                        </li>
                        <li>
                            <span className="font-semibold">Half-Day:</span> Working less than 4 hours in a day.
                        </li>
                    </ul>
                </div>
            </motion.div>
            
            {message && <p className="text-red-500 mt-4 text-center bg-red-50 p-2 rounded">{message}</p>}
        </motion.div>
    );
};

export default EmployeeDashboardPage;