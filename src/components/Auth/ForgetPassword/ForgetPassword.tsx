import { Button, Label, TextInput } from "flowbite-react";
import { Link, useNavigate } from "react-router-dom";
import { useFormik } from "formik";
import * as Yup from "yup";
import axios from "axios";
import React, { useState } from "react";
import { motion } from 'framer-motion';
import { FaSpinner, FaEnvelope, FaArrowLeft } from 'react-icons/fa';
import toast, { Toaster } from 'react-hot-toast';
import img from '../../../assets/freshIcon.svg';

const ForgetPassword = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleForgotPassword = async (email: string) => {
    setIsLoading(true);
    const toastId = toast.loading('Sending reset instructions...', { position: 'top-center' });

    try {
      const { data } = await axios.post(
        'https://ecommerce.routemisr.com/api/v1/auth/forgotPasswords',
        { email }
      );

      if (data.message === 'success') {
        toast.success('Reset instructions sent to your email!', { id: toastId });
        setTimeout(() => {
          navigate('/login');
        }, 2000);
      } else {
        toast.error('Failed to send reset instructions', { id: toastId });
      }
    } catch (error: any) {
      console.error("Error during password reset:", error);
      const errorMessage = error.response?.data?.message || 'Failed to send reset instructions';
      toast.error(errorMessage, { id: toastId });
    } finally {
      setIsLoading(false);
    }
  };

  const validationSchema = Yup.object({
    email: Yup.string().email("Invalid email address").required("Please enter your email"),
  });

  const formik = useFormik({
    initialValues: {
      email: "",
    },
    validationSchema,
    onSubmit: (values) => handleForgotPassword(values.email),
  });

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-gradient-to-br from-blue-950 to-black p-4 sm:p-6 lg:p-8 relative overflow-hidden">
      <Toaster position="top-center" />

      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
        className="flex flex-col md:flex-row items-center justify-center w-full max-w-6xl bg-white dark:bg-gray-800 rounded-xl shadow-2xl overflow-hidden z-10"
      >
        {/* Left Section: Image and Welcome */}
        <div className="w-full md:w-1/3 lg:w-2/5 p-8 md:p-10 lg:p-12 bg-gray-100 dark:bg-gray-900 flex flex-col items-center justify-center text-center md:h-[500px]">
          <motion.img
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.7, delay: 0.3 }}
            src={img}
            alt="Logo"
            className="mx-auto w-28 md:w-36 lg:w-40 mb-6 rounded-full shadow-lg bg-white p-4"
          />
          <motion.h1
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="text-2xl md:text-3xl font-bold text-gray-800 dark:text-white mb-2"
          >
            Reset Your Password
          </motion.h1>
          <motion.p
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="text-sm md:text-base text-gray-600 dark:text-gray-300"
          >
            Enter your email address and we'll send you instructions to reset your password.
          </motion.p>
        </div>

        {/* Right Section: Reset Form */}
        <div className="w-full md:w-2/3 lg:w-3/5 p-8 md:p-10 lg:p-12 bg-white dark:bg-gray-800">
          <motion.h2
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="text-2xl md:text-3xl font-bold text-center text-gray-800 dark:text-white mb-8"
          >
            Forgot Password
          </motion.h2>

          <motion.form
            onSubmit={formik.handleSubmit}
            className="w-full flex flex-col gap-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.7 }}
          >
            <div className="relative group">
              <Label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                <FaEnvelope className="inline-block mr-2" /> Your Email
              </Label>
              <TextInput
                id="email"
                type="email"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.email}
                className="w-full border-gray-300 dark:border-gray-600 rounded-xl shadow-sm focus:border-blue-500 focus:ring-blue-500 focus:ring-opacity-50 bg-gray-50/50 dark:bg-gray-700/50 text-gray-900 dark:text-white transition-all duration-200 ease-in-out pl-10 group-hover:bg-gray-50 dark:group-hover:bg-gray-700 backdrop-blur-sm"
                placeholder="Enter your email"
              />
              <FaEnvelope className="absolute left-3 top-9 text-gray-400 group-hover:text-blue-500 transition-colors" />
              {formik.touched.email && formik.errors.email && (
                <div className="text-red-600 text-sm mt-1">{formik.errors.email}</div>
              )}
            </div>

            <motion.button
              type="submit"
              className={`w-full py-3 px-4 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white font-semibold rounded-xl shadow-lg hover:from-blue-700 hover:via-indigo-700 hover:to-purple-700 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
                isLoading ? 'opacity-50 cursor-not-allowed' : ''
              }`}
              disabled={isLoading || !formik.isValid}
              whileHover={{ scale: isLoading || !formik.isValid ? 1 : 1.02 }}
              whileTap={{ scale: isLoading || !formik.isValid ? 1 : 0.98 }}
            >
              {isLoading ? (
                <div className="flex items-center justify-center">
                  <FaSpinner className="animate-spin mr-2" />
                  <span>Sending...</span>
                </div>
              ) : (
                'Send Reset Link'
              )}
            </motion.button>

            <motion.div 
              className="text-center text-sm text-gray-600 dark:text-gray-400 mt-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.8 }}
            >
              <Link 
                to="/login" 
                className="inline-flex items-center text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 transition-colors"
              >
                <FaArrowLeft className="mr-2" />
                Back to Login
              </Link>
            </motion.div>
          </motion.form>
        </div>
      </motion.div>
    </div>
  );
};

export default ForgetPassword; 