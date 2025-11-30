import React from 'react';
import { motion } from 'framer-motion';
import { useDispatch, useSelector } from 'react-redux';
// FIX: Use 'import type' to resolve the SyntaxError
import type { AppDispatch, RootState } from '../../redux/store';
import { checkIn, checkOut } from '../../redux/slices/attendanceSlice';

// Inline SVG Icons for Check In (Clock In) and Check Out (Clock Out)
const IconClockIn = (props: any) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
    </svg>
);

const IconClockOut = (props: any) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/><path d="M15 3h6v6"/>
    </svg>
);

interface QuickActionButtonProps {
    status: 'Checked In' | 'Checked Out' | 'Not Checked In';
    onActionSuccess: (action: 'checkIn' | 'checkOut') => void;
}

const QuickActionButton: React.FC<QuickActionButtonProps> = ({ status, onActionSuccess }) => {
    const dispatch: AppDispatch = useDispatch();
    
    // Check loading state from both auth (for token) and attendance (for the action itself)
    const { isLoading: isAuthLoading } = useSelector((state: RootState) => state.auth);
    const { isLoading: isAttLoading } = useSelector((state: RootState) => state.attendance);

    // Determine state
    const isCheckedIn = status === 'Checked In';
    const isLoading = isAuthLoading || isAttLoading;

    // Determine Button Appearance
    const actionText = isCheckedIn ? 'Check Out' : 'Check In';
    const actionColor = isCheckedIn ? 'bg-red-600 hover:bg-red-700' : 'bg-green-600 hover:bg-green-700';
    const ActionIcon = isCheckedIn ? IconClockOut : IconClockIn;
    const actionType = isCheckedIn ? 'checkOut' : 'checkIn';

    const handleAction = async () => {
        if (isLoading) return;

        // Select the appropriate thunk based on current status
        const actionThunk = isCheckedIn ? checkOut : checkIn;
        
        // Dispatch action
        const result = await dispatch(actionThunk());
        
        // Check if the action was successful (fulfilled)
        if (checkIn.fulfilled.match(result) || checkOut.fulfilled.match(result)) {
            onActionSuccess(actionType);
        }
    };

    return (
        <motion.button
            onClick={handleAction}
            className={`flex items-center justify-center px-6 py-4 text-white font-bold text-lg rounded-xl shadow-lg transition-all duration-300 ${actionColor} ${isLoading ? 'opacity-70 cursor-not-allowed' : ''}`}
            whileHover={{ scale: 1.05, boxShadow: isCheckedIn ? "0 10px 25px -5px rgba(220, 38, 38, 0.5)" : "0 10px 25px -5px rgba(5, 150, 105, 0.5)" }}
            whileTap={{ scale: 0.95 }}
            disabled={isLoading}
        >
            {isLoading ? (
                // Loading Spinner
                <svg className="animate-spin h-6 w-6 mr-3 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
            ) : (
                <ActionIcon className="w-6 h-6 mr-2" />
            )}
            {isLoading ? 'Processing...' : actionText}
        </motion.button>
    );
};

export default QuickActionButton;