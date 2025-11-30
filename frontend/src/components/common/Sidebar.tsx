import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { NavLink, useNavigate } from 'react-router-dom';
// FIX: Use 'import type' to resolve the SyntaxError
import type { RootState, AppDispatch } from '../../redux/store';
import { logout } from '../../redux/slices/authSlice';
import { motion } from 'framer-motion';

// --- Inline SVG Icons ---
const IconHome = (props: any) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
);
const IconCalendar = (props: any) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="18" height="18" x="3" y="4" rx="2" ry="2"/><line x1="16" x2="16" y1="2" y2="6"/><line x1="8" x2="8" y1="2" y2="6"/><line x1="3" x2="21" y1="10" y2="10"/></svg>
);
const IconUsers = (props: any) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
);
const IconLogOut = (props: any) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" x2="9" y1="12" y2="12"/></svg>
);

const Sidebar: React.FC = () => {
    const { user } = useSelector((state: RootState) => state.auth);
    const dispatch: AppDispatch = useDispatch();
    const navigate = useNavigate();

    const isManager = user?.role === 'manager';

    const handleLogout = () => {
        dispatch(logout());
        navigate('/login');
    };

    const navLinks = isManager
        ? [
            { path: '/manager/dashboard', icon: IconHome, label: 'Dashboard' },
            { path: '/manager/all', icon: IconUsers, label: 'Team Attendance' },
          ]
        : [
            { path: '/employee/dashboard', icon: IconHome, label: 'Dashboard' },
            { path: '/employee/history', icon: IconCalendar, label: 'My History' },
          ];

    const LinkItem = ({ path, icon: Icon, label }: typeof navLinks[0]) => (
        <motion.li 
            className="w-full"
            whileHover={{ scale: 1.05, x: 5 }}
            whileTap={{ scale: 0.98 }}
        >
            <NavLink
                to={path}
                className={({ isActive }) =>
                    `flex items-center p-3 rounded-xl transition-colors duration-200 mb-2 ${
                        isActive
                            ? 'bg-indigo-700 text-white shadow-lg'
                            : 'text-indigo-200 hover:bg-indigo-700 hover:text-white'
                    }`
                }
            >
                <Icon className="w-5 h-5 mr-3" />
                <span className="font-medium">{label}</span>
            </NavLink>
        </motion.li>
    );

    return (
        <motion.nav 
            className="w-64 bg-indigo-900 text-white flex flex-col p-4 shadow-2xl h-screen sticky top-0"
            initial={{ x: -250 }}
            animate={{ x: 0 }}
            transition={{ type: "spring", stiffness: 120, damping: 20 }}
        >
            <div className="text-2xl font-extrabold mb-8 text-center py-4 border-b border-indigo-700 tracking-wider">
                ATS Pro
            </div>

            <ul className="flex-grow space-y-2">
                {navLinks.map((link) => (
                    <LinkItem key={link.path} {...link} />
                ))}
            </ul>

            <div className="mt-auto pt-6 border-t border-indigo-700">
                <div className="mb-4 px-2">
                    <p className="text-sm font-semibold text-white truncate">
                        {user?.name || 'Guest'}
                    </p>
                    <p className="text-xs text-indigo-300 capitalize">
                        {user?.role || 'Visitor'}
                    </p>
                </div>
                <motion.button 
                    onClick={handleLogout}
                    className="flex items-center w-full p-3 rounded-xl text-indigo-300 hover:bg-red-600 hover:text-white transition-colors duration-200 bg-indigo-800 bg-opacity-50"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.98 }}
                >
                    <IconLogOut className="w-5 h-5 mr-3" />
                    <span className="font-medium">Logout</span>
                </motion.button>
            </div>
        </motion.nav>
    );
};

export default Sidebar;