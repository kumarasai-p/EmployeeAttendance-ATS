import React from 'react';
import { motion } from 'framer-motion';

// Define the shape of the summary data
interface AttendanceSummary {
    present: number;
    absent: number;
    late: number;
    'half-day': number; // Although not always shown in the main 4 stats, it's good to have in the type
    totalHours: number;
}

interface EmployeeStatsProps {
    summary: AttendanceSummary;
    isLoading?: boolean;
}

// --- Inline SVG Icons ---
const IconCheck = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
);

const IconX = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
);

const IconClock = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-yellow-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
);

const IconTime = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
);

const EmployeeStats: React.FC<EmployeeStatsProps> = ({ summary, isLoading }) => {
    
    // Configuration for the stat cards
    const stats = [
        { 
            label: 'Present', 
            count: summary.present || 0, 
            unit: 'days',
            color: 'text-green-600', 
            bg: 'bg-green-100',
            icon: <IconCheck /> 
        },
        { 
            label: 'Absent', 
            count: summary.absent || 0, 
            unit: 'days',
            color: 'text-red-600', 
            bg: 'bg-red-100',
            icon: <IconX /> 
        },
        { 
            label: 'Late', 
            count: summary.late || 0, 
            unit: 'days',
            color: 'text-yellow-600', 
            bg: 'bg-yellow-100',
            icon: <IconClock /> 
        },
        { 
            label: 'Total Hours', 
            count: summary.totalHours ? summary.totalHours.toFixed(1) : 0, 
            unit: 'hrs',
            color: 'text-blue-600', 
            bg: 'bg-blue-100',
            icon: <IconTime /> 
        },
    ];

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: { 
            opacity: 1, 
            transition: { staggerChildren: 0.1 } 
        },
    };

    const itemVariants = {
        hidden: { y: 20, opacity: 0 },
        visible: { y: 0, opacity: 1 },
    };

    if (isLoading) {
        return (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {[...Array(4)].map((_, i) => (
                    <div key={i} className="card h-32 flex items-center justify-center animate-pulse bg-gray-100">
                        <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                    </div>
                ))}
            </div>
        );
    }

    return (
        <motion.div 
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6" 
            variants={containerVariants}
            initial="hidden"
            animate="visible"
        >
            {stats.map((stat) => (
                <motion.div 
                    key={stat.label} 
                    className="card flex items-center p-6 hover:shadow-lg transition-shadow duration-300 border border-gray-100"
                    variants={itemVariants}
                    whileHover={{ scale: 1.02 }}
                >
                    <div className={`p-4 rounded-full ${stat.bg} mr-4`}>
                        {stat.icon}
                    </div>
                    <div>
                        <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide">
                            {stat.label}
                        </h3>
                        <div className="flex items-baseline">
                            <span className={`text-2xl font-bold ${stat.color}`}>
                                {stat.count}
                            </span>
                            <span className="ml-1 text-sm text-gray-400 font-medium">
                                {stat.unit}
                            </span>
                        </div>
                    </div>
                </motion.div>
            ))}
        </motion.div>
    );
};

export default EmployeeStats;