import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
// FIX: Use 'import type' to resolve the SyntaxError
import type { RootState } from './redux/store';
import LoginPage from './pages/Auth/LoginPage';
import RegisterPage from './pages/Auth/RegisterPage';
import EmployeeDashboardPage from './pages/Employee/EmployeeDashboardPage';
import MyHistoryPage from './pages/Employee/MyHistoryPage';
import ManagerDashboardPage from './pages/Manager/ManagerDashboardPage';
import AllAttendancePage from './pages/Manager/AllAttendancePage';
import Sidebar from './components/common/Sidebar';
import { AnimatePresence, motion } from 'framer-motion';

// --- Protected Route Component ---
// This wrapper checks if the user is logged in and has the correct role
const ProtectedRoute: React.FC<{ children: JSX.Element; allowedRoles: string[] }> = ({ children, allowedRoles }) => {
    const { user } = useSelector((state: RootState) => state.auth);

    if (!user) {
        // Redirect to login if no user is found
        return <Navigate to="/login" replace />;
    }
    
    if (user && !allowedRoles.includes(user.role)) {
        // Redirect to the appropriate dashboard if the role doesn't match
        const targetPath = user.role === 'employee' ? "/employee/dashboard" : "/manager/dashboard";
        return <Navigate to={targetPath} replace />;
    }
    
    // If authorized, render the Sidebar layout and the page content
    return (
        <div className="flex min-h-screen bg-gray-50">
            <Sidebar />
            <motion.main className="flex-1 p-6 md:p-10 transition-all duration-300 overflow-y-auto">
                {children}
            </motion.main>
        </div>
    );
};

const App: React.FC = () => {
    // We use window.location to help AnimatePresence detect route changes
    const location = window.location;

    return (
        <Router>
            <AnimatePresence mode="wait">
                <Routes location={location} key={location.pathname}>
                    {/* --- Public Routes --- */}
                    <Route path="/login" element={<LoginPage />} />
                    <Route path="/register" element={<RegisterPage />} />
                    <Route path="/" element={<Navigate to="/login" replace />} />

                    {/* --- Employee Routes --- */}
                    <Route path="/employee/dashboard" element={
                        <ProtectedRoute allowedRoles={['employee']}>
                            <EmployeeDashboardPage />
                        </ProtectedRoute>
                    } />
                    <Route path="/employee/history" element={
                        <ProtectedRoute allowedRoles={['employee']}>
                            <MyHistoryPage />
                        </ProtectedRoute>
                    } />
                    
                    {/* --- Manager Routes --- */}
                    <Route path="/manager/dashboard" element={
                        <ProtectedRoute allowedRoles={['manager']}>
                            <ManagerDashboardPage />
                        </ProtectedRoute>
                    } />
                    <Route path="/manager/all" element={
                        <ProtectedRoute allowedRoles={['manager']}>
                            <AllAttendancePage />
                        </ProtectedRoute>
                    } />
                    
                    {/* Fallback for unknown routes */}
                    <Route path="*" element={<Navigate to="/login" replace />} />
                </Routes>
            </AnimatePresence>
        </Router>
    );
};

export default App;