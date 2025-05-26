import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { motion } from 'framer-motion';
import { FaSpinner } from 'react-icons/fa';
import toast, { Toaster } from 'react-hot-toast';

export default function Auth() {
    const navigate = useNavigate();
    const [isLogin, setIsLogin] = useState(true);
    const [isLoading, setIsLoading] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        rePassword: '',
        phone: ''
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            if (!isLogin && formData.password !== formData.rePassword) {
                toast.error('Passwords do not match!', {
                    style: {
                        background: '#333',
                        color: '#fff',
                        borderRadius: '10px',
                    },
                });
                return;
            }

            const endpoint = isLogin ? 'signin' : 'signup';
            const response = await axios.post(`https://ecommerce.routemisr.com/api/v1/auth/${endpoint}`, formData);
            
            if (isLogin) {
                localStorage.setItem('token', response.data.token);
                toast.success('Welcome back! 👋', {
                    style: {
                        background: '#333',
                        color: '#fff',
                        borderRadius: '10px',
                    },
                });
                navigate('/');
            } else {
                toast.success('Account created successfully! 🎉', {
                    style: {
                        background: '#333',
                        color: '#fff',
                        borderRadius: '10px',
                    },
                });
                setIsLogin(true);
            }
        } catch (error: any) {
            toast.error(error.response?.data?.message || 'Something went wrong!', {
                style: {
                    background: '#333',
                    color: '#fff',
                    borderRadius: '10px',
                },
            });
        } finally {
            setIsLoading(false);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    return (
        <div className="min-h-[calc(100vh-4rem)] bg-gray-900 py-8 px-4 sm:px-6 lg:px-8">
            <Toaster position="top-center" />
            <div className="max-w-md mx-auto">
                <motion.div
                    initial={{ y: -20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ duration: 0.5 }}
                    className="text-center mb-8"
                >
                    <h1 className="text-3xl font-bold mb-4 bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
                        {isLogin ? 'Welcome Back!' : 'Create Account'}
                    </h1>
                    <p className="text-gray-400">
                        {isLogin ? 'Sign in to your account' : 'Join us today'}
                    </p>
                </motion.div>

                <motion.form
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                    onSubmit={handleSubmit}
                    className="bg-gray-800 rounded-xl shadow-xl p-8"
                >
                    {!isLogin && (
                        <div className="mb-4">
                            <label className="block text-gray-300 mb-2">Name</label>
                            <input
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                className="w-full px-4 py-2 rounded-lg bg-gray-700 text-white border border-gray-600 focus:border-blue-500 focus:outline-none"
                                required
                            />
                        </div>
                    )}

                    <div className="mb-4">
                        <label className="block text-gray-300 mb-2">Email</label>
                        <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            className="w-full px-4 py-2 rounded-lg bg-gray-700 text-white border border-gray-600 focus:border-blue-500 focus:outline-none"
                            required
                        />
                    </div>

                    {!isLogin && (
                        <div className="mb-4">
                            <label className="block text-gray-300 mb-2">Phone</label>
                            <input
                                type="tel"
                                name="phone"
                                value={formData.phone}
                                onChange={handleChange}
                                className="w-full px-4 py-2 rounded-lg bg-gray-700 text-white border border-gray-600 focus:border-blue-500 focus:outline-none"
                                required
                            />
                        </div>
                    )}

                    <div className="mb-4">
                        <label className="block text-gray-300 mb-2">Password</label>
                        <input
                            type="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            className="w-full px-4 py-2 rounded-lg bg-gray-700 text-white border border-gray-600 focus:border-blue-500 focus:outline-none"
                            required
                        />
                    </div>

                    {!isLogin && (
                        <div className="mb-6">
                            <label className="block text-gray-300 mb-2">Confirm Password</label>
                            <input
                                type="password"
                                name="rePassword"
                                value={formData.rePassword}
                                onChange={handleChange}
                                className="w-full px-4 py-2 rounded-lg bg-gray-700 text-white border border-gray-600 focus:border-blue-500 focus:outline-none"
                                required
                            />
                        </div>
                    )}

                    <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        type="submit"
                        disabled={isLoading}
                        className="w-full bg-gradient-to-r from-blue-500 to-purple-500 text-white py-3 rounded-lg font-semibold hover:from-blue-600 hover:to-purple-600 transition-all duration-300 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {isLoading ? (
                            <FaSpinner className="w-5 h-5 animate-spin mx-auto" />
                        ) : (
                            isLogin ? 'Sign In' : 'Create Account'
                        )}
                    </motion.button>

                    <p className="mt-4 text-center text-gray-400">
                        {isLogin ? "Don't have an account? " : "Already have an account? "}
                        <button
                            type="button"
                            onClick={() => {
                                setIsLogin(!isLogin);
                                setFormData({
                                    name: '',
                                    email: '',
                                    password: '',
                                    rePassword: '',
                                    phone: ''
                                });
                            }}
                            className="text-blue-400 hover:text-blue-300 transition-colors"
                        >
                            {isLogin ? 'Sign Up' : 'Sign In'}
                        </button>
                    </p>
                </motion.form>
            </div>
        </div>
    );
} 