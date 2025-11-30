import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { motion } from 'framer-motion';
import { login, reset } from '../../redux/slices/authSlice';
// FIX: Use 'import type' here to resolve the export error
import type { RootState, AppDispatch } from '../../redux/store'; 

const LoginPage: React.FC = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    
    const navigate = useNavigate();
    const dispatch: AppDispatch = useDispatch();

    const { user, isLoading, isError, message } = useSelector(
        (state: RootState) => state.auth
    );

    useEffect(() => {
        if (isError) {
            console.error(message);
        }

        if (user) {
            if (user.role === 'manager') {
                navigate('/manager/dashboard');
            } else {
                navigate('/employee/dashboard');
            }
        }
        
        return () => {
            dispatch(reset());
        };
    }, [user, isError, message, navigate, dispatch]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const userData = { email, password };
        dispatch(login(userData));
    };

    const containerVariants = {
        hidden: { opacity: 0, scale: 0.95 },
        visible: { 
            opacity: 1, 
            scale: 1, 
            transition: { duration: 0.5, ease: "easeOut" } 
        },
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-50">
            <motion.div 
                className="w-full max-w-md card bg-white p-8 space-y-6 rounded-xl shadow-lg"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
            >
                <h2 className="text-4xl font-extrabold text-center text-indigo-700">
                    Sign In
                </h2>
                <p className="text-center text-gray-500">
                    Access the Employee Attendance System
                </p>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <input
                            type="email"
                            placeholder="Employee Email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none transition"
                            required
                        />
                    </div>
                    <div>
                        <input
                            type="password"
                            placeholder="Password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none transition"
                            required
                        />
                    </div>
                    
                    {isError && (
                        <motion.p 
                            className="text-red-600 text-sm text-center bg-red-100 p-2 rounded-lg"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                        >
                            {message}
                        </motion.p>
                    )}

                    <motion.button 
                        type="submit" 
                        className="w-full btn-primary flex justify-center items-center bg-indigo-600 text-white py-3 rounded-lg font-semibold hover:bg-indigo-700 transition duration-300 shadow-md"
                        disabled={isLoading}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                    >
                        {isLoading ? (
                            <div className="flex justify-center items-center">
                                <svg className="animate-spin h-5 w-5 text-white mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                Logging in...
                            </div>
                        ) : (
                            'Login'
                        )}
                    </motion.button>
                </form>
                
                <p className="mt-4 text-center text-sm text-gray-500">
                    Don't have an account? <Link to="/register" className="text-indigo-600 hover:text-indigo-800 font-medium transition duration-150">Register Now</Link>
                </p>
            </motion.div>
        </div>
    );
};

export default LoginPage;