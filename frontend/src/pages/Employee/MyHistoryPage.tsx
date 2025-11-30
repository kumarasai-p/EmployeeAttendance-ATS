import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useDispatch, useSelector } from 'react-redux';
// FIX: Use 'import type' to resolve the SyntaxError
import type { AppDispatch, RootState } from '../../redux/store';
import { getMyHistory } from '../../redux/slices/attendanceSlice';
import moment from 'moment';
import { TailSpin } from 'react-loader-spinner';

const MyHistoryPage: React.FC = () => {
    const dispatch: AppDispatch = useDispatch();
    const { history, isLoading, message } = useSelector((state: RootState) => state.attendance);
    
    // Default to current month (YYYY-MM format for input type="month")
    const [selectedMonth, setSelectedMonth] = useState(moment().format('YYYY-MM'));

    useEffect(() => {
        // Fetch history whenever the selected month changes
        dispatch(getMyHistory(selectedMonth));
    }, [dispatch, selectedMonth]);

    // Helper to determine badge styling
    const getStatusColor = (status: string) => {
        switch (status) {
            case 'present': return 'bg-green-100 text-green-800 border-green-500';
            case 'late': return 'bg-yellow-100 text-yellow-800 border-yellow-500';
            case 'absent': return 'bg-red-100 text-red-800 border-red-500';
            case 'half-day': return 'bg-orange-100 text-orange-800 border-orange-500';
            default: return 'bg-gray-100 text-gray-800 border-gray-400';
        }
    };

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: { opacity: 1 },
    };

    return (
        <motion.div 
            variants={containerVariants}
            initial="hidden"
            animate="visible"
        >
            <h1 className="text-3xl font-extrabold text-gray-900 mb-6">
                My Attendance History
            </h1>

            {/* Filter Section */}
            <div className="card mb-6 flex items-center space-x-4 bg-white p-4 rounded-xl shadow-sm">
                <label className="text-gray-700 font-semibold">Filter by Month:</label>
                <input
                    type="month"
                    value={selectedMonth}
                    onChange={(e) => setSelectedMonth(e.target.value)}
                    className="p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none transition duration-150"
                />
            </div>
            
            {/* Table Section */}
            <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-100">
                <div className="overflow-x-auto">
                    {isLoading ? (
                        <div className="flex flex-col justify-center items-center h-48">
                            <TailSpin height="40" width="40" color="#4F46E5" ariaLabel="tail-spin-loading" radius="1" wrapperStyle={{}} wrapperClass="" visible={true} />
                            <p className="text-gray-500 mt-3">Loading history...</p>
                        </div>
                    ) : history.length === 0 ? (
                        <div className="text-center text-gray-500 p-8">
                            <p className="text-lg">No attendance records found for {moment(selectedMonth).format('MMMM YYYY')}.</p>
                        </div>
                    ) : (
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Date</th>
                                    <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Check In</th>
                                    <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Check Out</th>
                                    <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Hours</th>
                                    <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Status</th>
                                </tr>
                            </thead>
                            <motion.tbody 
                                className="bg-white divide-y divide-gray-200"
                                initial="hidden"
                                animate="visible"
                                variants={containerVariants}
                            >
                                {history.map((record) => (
                                    <motion.tr 
                                        key={record._id} 
                                        className="hover:bg-indigo-50 transition-colors duration-150"
                                        variants={containerVariants}
                                    >
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                            {moment(record.date).format('ddd, MMM Do YYYY')}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 font-mono">
                                            {record.checkInTime ? moment(record.checkInTime).format('h:mm A') : '-'}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 font-mono">
                                            {record.checkOutTime ? moment(record.checkOutTime).format('h:mm A') : '-'}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 font-mono">
                                            {record.totalHours ? record.totalHours.toFixed(2) : '0.00'}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full capitalize border ${getStatusColor(record.status)}`}>
                                                {record.status}
                                            </span>
                                        </td>
                                    </motion.tr>
                                ))}
                            </motion.tbody>
                        </table>
                    )}
                </div>
            </div>
            {message && <p className="text-red-500 mt-4 text-center">{message}</p>}
        </motion.div>
    );
};

export default MyHistoryPage;