import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useDispatch, useSelector } from 'react-redux';
import type { AppDispatch, RootState } from '../../redux/store';
import { getAllAttendance } from '../../redux/slices/attendanceSlice';
import moment from 'moment'; 

// Note: Ensure you have run 'npm install moment' in the frontend directory for date formatting

const AllAttendancePage: React.FC = () => {
    const dispatch: AppDispatch = useDispatch();
    const { allRecords, isLoading, message } = useSelector((state: RootState) => state.attendance);
    
    // Initialize filters to today's date and empty employee/status
    const [filter, setFilter] = useState({ 
        date: moment().format('YYYY-MM-DD'), 
        employeeId: '', 
        status: '' 
    });

    // Helper function to dispatch the thunk with current filters
    const handleApplyFilters = () => {
        // Updated to pass the filter state to the Redux action
        dispatch(getAllAttendance(filter));
    };

    // Initial load and whenever the component is viewed
    useEffect(() => {
        handleApplyFilters();
    }, [dispatch]);

    // Determines the Tailwind classes for status display
    const getStatusColor = (status: string) => {
        switch (status) {
            case 'present': return 'bg-green-100 text-green-800 border-green-500';
            case 'late': return 'bg-yellow-100 text-yellow-800 border-yellow-500';
            case 'absent': return 'bg-red-100 text-red-800 border-red-500';
            case 'half-day': return 'bg-orange-100 text-orange-800 border-orange-500';
            default: return 'bg-gray-100 text-gray-800 border-gray-400';
        }
    };

    // Placeholder for CSV export logic
    const handleExportCSV = () => {
        // This would trigger an API call to GET /api/attendance/export, 
        // passing current filters, and the backend would return a CSV file stream.
        alert("CSV Export feature triggered. (Backend endpoint /api/attendance/export needs to be finalized)");
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
                Team Attendance & Reports
            </h1>

            {/* Filter and Export Controls */}
            <div className="card flex flex-wrap gap-4 items-center justify-between mb-6">
                <div className="flex flex-wrap gap-4 items-center">
                    <h2 className="text-lg font-semibold text-gray-700">Filters:</h2>
                    {/* Date Filter */}
                    <input
                        type="date"
                        value={filter.date}
                        onChange={(e) => setFilter({...filter, date: e.target.value})}
                        className="p-2 border border-gray-300 rounded-lg transition"
                    />
                    {/* Employee Filter */}
                    <input
                        type="text"
                        placeholder="Employee ID"
                        value={filter.employeeId}
                        onChange={(e) => setFilter({...filter, employeeId: e.target.value})}
                        className="p-2 border border-gray-300 rounded-lg transition"
                    />
                    {/* Status Filter */}
                    <select
                        value={filter.status}
                        onChange={(e) => setFilter({...filter, status: e.target.value})}
                        className="p-2 border border-gray-300 rounded-lg transition"
                    >
                        <option value="">All Statuses</option>
                        <option value="present">Present</option>
                        <option value="late">Late</option>
                        <option value="absent">Absent</option>
                        <option value="half-day">Half-Day</option>
                    </select>

                    <motion.button
                        onClick={handleApplyFilters}
                        className="btn-primary px-6"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                    >
                        Apply Filters
                    </motion.button>
                </div>
                
                <motion.button
                    onClick={handleExportCSV}
                    className="bg-indigo-500 text-white py-2 px-4 rounded-lg font-semibold hover:bg-indigo-600 transition duration-150"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                >
                    Export CSV
                </motion.button>
            </div>
            
            {/* Attendance Table */}
            <div className="card overflow-x-auto">
                {isLoading ? (
                    <div className="flex justify-center items-center h-40">
                        {/* Simple CSS Loader */}
                        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-indigo-700"></div>
                    </div>
                ) : allRecords.length === 0 ? (
                    <p className="text-center text-gray-500 p-4">No team attendance records found for the selected filters.</p>
                ) : (
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name/ID</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Department</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Check In</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Hours</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                            </tr>
                        </thead>
                        <motion.tbody 
                            className="bg-white divide-y divide-gray-200"
                            initial="hidden"
                            animate="visible"
                            variants={containerVariants}
                        >
                            {allRecords.map((record: any) => (
                                <motion.tr 
                                    key={record._id} 
                                    className="hover:bg-indigo-50 transition-colors duration-100"
                                    variants={containerVariants}
                                >
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                        {record.userId?.name || 'N/A'} ({record.userId?.employeeId || 'N/A'})
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        {record.userId?.department || 'N/A'}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        {moment(record.date).format('MMM Do, YYYY')}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        {record.checkInTime ? moment(record.checkInTime).format('h:mm A') : '-'}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        {record.totalHours.toFixed(2)}
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
            {message && <p className="text-red-500 mt-4">{message}</p>}
        </motion.div>
    );
};

export default AllAttendancePage;