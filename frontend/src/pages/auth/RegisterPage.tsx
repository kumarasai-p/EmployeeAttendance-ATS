import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { motion } from 'framer-motion';
import { register, reset } from '../../redux/slices/authSlice';
// FIX: Added 'import type' to resolve the SyntaxError
import type { RootState, AppDispatch } from '../../redux/store'; 

const RegisterPage: React.FC = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        employeeId: '',
        department: '',
        password: '',
        confirmPassword: '',
        role: 'employee',
    });
    const [passwordMatchError, setPasswordMatchError] = useState('');

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
            navigate(user.role === 'manager' ? '/manager/dashboard' : '/employee/dashboard');
        }
        
        return () => {
            dispatch(reset());
        };
    }, [user, isError, message, navigate, dispatch]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setPasswordMatchError('');

        if (formData.password !== formData.confirmPassword) {
            setPasswordMatchError('Passwords do not match.');
            return;
        }

        const { confirmPassword, ...userData } = formData;
        dispatch(register(userData));
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-50 p-4">
            <motion.div 
                className="w-full max-w-lg card bg-white p-8 space-y-6 rounded-xl shadow-lg"
                initial={{ opacity: 0, y: -50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ type: "spring", stiffness: 100 }}
            >
                <h2 className="text-3xl font-bold text-center text-indigo-700">
                    Register New Account
                </h2>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <input type="text" name="name" placeholder="Full Name" onChange={handleChange} required className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none transition" />
                    <input type="email" name="email" placeholder="Email Address" onChange={handleChange} required className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none transition" />
                    <input type="text" name="employeeId" placeholder="Employee ID (e.g., EMP001)" onChange={handleChange} required className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none transition" />
                    <div className="flex space-x-4">
                        <input type="text" name="department" placeholder="Department" onChange={handleChange} required className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none transition" />
                        <select name="role" onChange={handleChange} value={formData.role} className="w-full p-3 border border-gray-300 rounded-lg appearance-none focus:ring-2 focus:ring-indigo-500 outline-none transition bg-white">
                            <option value="employee">Employee</option>
                            <option value="manager">Manager</option>
                        </select>
                    </div>

                    <input type="password" name="password" placeholder="Password" onChange={handleChange} required className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none transition" />
                    <input type="password" name="confirmPassword" placeholder="Confirm Password" onChange={handleChange} required className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none transition" />

                    {(isError || passwordMatchError) && (
                        <p className="text-red-600 text-sm text-center bg-red-100 p-2 rounded-lg">
                            {passwordMatchError || message}
                        </p>
                    )}

                    <motion.button 
                        type="submit" 
                        className="w-full btn-primary bg-indigo-600 text-white py-3 rounded-lg font-semibold hover:bg-indigo-700 transition duration-300 shadow-md"
                        disabled={isLoading}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                    >
                        {isLoading ? (
                             <div className="flex justify-center items-center">
                                <svg className="animate-spin h-5 w-5 mr-3 text-white" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                Registering...
                            </div>
                        ) : 'Register'}
                    </motion.button>
                </form>
                
                <p className="mt-4 text-center text-sm text-gray-500">
                    Already have an account? <Link to="/login" className="text-indigo-600 hover:text-indigo-800 font-medium transition duration-150">Login</Link>
                </p>
            </motion.div>
        </div>
    );
};

export default RegisterPage;