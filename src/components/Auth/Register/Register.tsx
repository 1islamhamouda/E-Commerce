import { Button, Checkbox, Label, TextInput } from "flowbite-react";
import { Link, useNavigate } from "react-router-dom";
import { useFormik } from "formik";
import * as Yup from "yup";
import axios from "axios";
import React, { useContext, useState } from "react";
import { useName } from "../../../context/NameProvider";
import img from '../../../assets/freshIcon.svg';
import { User } from "../../../context/UserContext";
import { motion, AnimatePresence } from 'framer-motion';
import { FaSpinner, FaUser, FaEnvelope, FaLock, FaPhone, FaCheck } from 'react-icons/fa';
import toast, { Toaster } from 'react-hot-toast';


interface RegisterDetails {
  name: string;
  email: string;
  password: string;
  repassword: string;
  phone: string;
}

// Variants for staggered animation
const containerVariants = {
  hidden: { opacity: 0 },
  visible: { 
    opacity: 1, 
    transition: { 
      staggerChildren: 0.08 // Adjust stagger timing
    }
  }
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: { y: 0, opacity: 1 }
};

const Register = () => {
  const navigate = useNavigate();
  const { setName } = useName();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isError, setIsError] = useState<boolean>(false);
  const [error, setError] = useState<string>('');

  const userContext = useContext(User);
  if (!userContext) {
    throw new Error("User context is not provided");
  }
  const { setUser } = userContext;

  const handleRegister = async (values: RegisterDetails) => {
    setIsLoading(true);
    setIsError(false);
    setError('');

    const toastId = toast.loading('Registering...', { position: 'top-center' });

    try {
      const { data } = await axios.post(
        `https://ecommerce.routemisr.com/api/v1/auth/signup`,
        values
      );

      if (data.message === 'success') {
        toast.success('Registration successful! Redirecting to Login...', { id: toastId });
        setName(values.name);
        setTimeout(() => {
          navigate("/login");
        }, 1000);
      } else {
        setIsError(true);
        const errorMessage = data.message || 'An unexpected error occurred during registration.';
        setError(errorMessage);
        toast.error(`Registration failed: ${errorMessage}`, { id: toastId });
      }
    } catch (error: any) {
      console.error("Error during registration:", error);
      setIsError(true);
      const errorMessage = error.response?.data?.message || 'An error occurred during registration';
      setError(errorMessage);
      toast.error(`Registration failed: ${errorMessage}`, { id: toastId });
    } finally {
      setIsLoading(false);
    }
  };

  const validationSchema = Yup.object({
    name: Yup.string().min(3, "Name must be more than 3 characters").required("Please enter your name"),
    email: Yup.string().email("Invalid email address").required("Please enter your email"),
    password: Yup.string().required("Please enter your password"),
    repassword: Yup.string().oneOf([Yup.ref("password")], "Passwords must match").required("Please enter your rePassword"),
    phone: Yup.string().matches(/^\+?\d{10,14}$/, "Invalid phone number format").required("Please enter your phone"),
  });

  const formik = useFormik({
    initialValues: {
      name: "",
      email: "",
      password: "",
      repassword: "",
      phone: "",
    },
    validationSchema,
    onSubmit: handleRegister,
  });

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-950 via-blue-950 to-black p-4 sm:p-6 lg:p-8 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-2 bg-white rounded-full"
            initial={{
              x: Math.random() * window.innerWidth,
              y: Math.random() * window.innerHeight,
              scale: Math.random() * 2,
            }}
            animate={{
              y: [null, Math.random() * window.innerHeight],
              opacity: [0.2, 0.8, 0.2],
            }}
            transition={{
              duration: Math.random() * 10 + 10,
              repeat: Infinity,
              ease: "linear",
            }}
          />
        ))}
      </div>

      <Toaster 
        position="top-center"
        toastOptions={{
          style: {
            background: '#333',
            color: '#fff',
            padding: '16px',
            borderRadius: '8px',
          },
        }}
      />

      <motion.div
        initial={{ opacity: 0, y: 50, rotateZ: 5 }}
        animate={{ opacity: 1, y: 0, rotateZ: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="flex flex-col md:flex-row-reverse items-center justify-center w-full max-w-6xl bg-white/95 dark:bg-gray-800/95 backdrop-blur-lg rounded-3xl shadow-2xl overflow-hidden z-10 border border-gray-200 dark:border-gray-700"
      >
        {/* Right Section (Image and Welcome) */}
        <motion.div 
          className="w-full md:w-1/3 lg:w-2/5 p-8 md:p-10 lg:p-12 bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex flex-col items-center justify-end text-center relative overflow-hidden group transition-all duration-300 ease-in-out rounded-r-3xl"
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.7, delay: 0.2 }}
          whileHover={{ backgroundColor: 'rgba(243, 244, 246, 0.9)' }}
        >
          <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 via-indigo-500/10 to-purple-500/10 dark:from-blue-500/5 dark:via-indigo-500/5 dark:to-purple-500/5"></div>
          
          <motion.div 
            className="absolute inset-0 bg-black opacity-0 group-hover:opacity-10 transition-opacity duration-300"
            initial={{ opacity: 0 }}
            whileHover={{ opacity: 0.1 }}
          />

          <motion.img
            initial={{ scale: 0.8, opacity: 0, y: 20 }}
            animate={{
              scale: 1, opacity: 1, y: 0,
              transition: { 
                duration: 4, 
                delay: 0.5, 
                ease: "easeInOut", 
                y: { 
                  repeat: Infinity, 
                  repeatType: "mirror", 
                  duration: 6, 
                  ease: "easeInOut" 
                }
              }
            }}
            src={img}
            alt="Logo"
            className="w-auto h-[28rem] md:h-[32rem] lg:h-[36rem] mb-0 rounded-full shadow-lg absolute bottom-0 left-1/2 transform -translate-x-1/2 object-contain transition-transform duration-500 group-hover:scale-105 group-hover:-rotate-3 z-10 filter drop-shadow-2xl bg-white/80 backdrop-blur-sm p-8"
          />

          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.8 }}
            className="relative z-10"
          >
            <h1 className="text-3xl md:text-4xl font-bold text-gray-800 dark:text-white mb-4 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600">
              Welcome to Fresh
            </h1>
            <p className="text-base md:text-lg text-gray-500 dark:text-gray-400 mb-8 leading-relaxed relative z-20">
              Your one-stop shop for all things fresh! Join us today and discover amazing products.
            </p>
          </motion.div>
        </motion.div>

        {/* Left Section (Form) */}
        <div className="w-full md:w-2/3 lg:w-3/5 p-8 md:p-10 lg:p-12 bg-white dark:bg-gray-800 relative rounded-l-3xl"
          style={{ 
            background: 'radial-gradient(circle at top left, rgba(59,130,246,0.1), transparent), radial-gradient(circle at bottom right, rgba(139,92,246,0.1), transparent), #ffffff'
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-br from-blue-50/50 via-indigo-50/50 to-purple-50/50 dark:from-gray-900/50 dark:via-gray-800/50 dark:to-gray-900/50 rounded-l-3xl"></div>
          
          <motion.h2
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="text-3xl md:text-4xl font-bold text-center text-gray-800 dark:text-white mb-8 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 relative z-10"
          >
            Create Your Account
          </motion.h2>

          <motion.form
            onSubmit={formik.handleSubmit}
            className="w-full flex flex-col gap-6 relative z-10"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {/* Name Input */}
            <motion.div variants={itemVariants} className="relative group">
              <Label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                <FaUser className="inline-block mr-2" /> Your Name
              </Label>
              <TextInput
                id="name" name="name" type="text"
                onChange={formik.handleChange} onBlur={formik.handleBlur} value={formik.values.name}
                className="w-full border-gray-300 dark:border-gray-600 rounded-xl shadow-sm focus:border-blue-500 focus:ring-blue-500 focus:ring-opacity-50 bg-gray-50/50 dark:bg-gray-700/50 text-gray-900 dark:text-white transition-all duration-200 ease-in-out pl-10 group-hover:bg-gray-50 dark:group-hover:bg-gray-700 backdrop-blur-sm"
                placeholder="Enter your name"
              />
              <FaUser className="absolute left-3 top-9 text-gray-400 group-hover:text-blue-500 transition-colors" />
              {formik.touched.name && formik.errors.name && (
                <motion.div 
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-red-600 text-sm mt-1 flex items-center"
                >
                  <FaCheck className="mr-1" /> {formik.errors.name}
                </motion.div>
              )}
            </motion.div>

            {/* Email Input */}
            <motion.div variants={itemVariants} className="relative group">
              <Label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                <FaEnvelope className="inline-block mr-2" /> Your Email
              </Label>
              <TextInput
                id="email" name="email" type="email"
                onChange={formik.handleChange} onBlur={formik.handleBlur} value={formik.values.email}
                className="w-full border-gray-300 dark:border-gray-600 rounded-xl shadow-sm focus:border-blue-500 focus:ring-blue-500 focus:ring-opacity-50 bg-gray-50/50 dark:bg-gray-700/50 text-gray-900 dark:text-white transition-all duration-200 ease-in-out pl-10 group-hover:bg-gray-50 dark:group-hover:bg-gray-700 backdrop-blur-sm"
                placeholder="Enter your email"
              />
              <FaEnvelope className="absolute left-3 top-9 text-gray-400 group-hover:text-blue-500 transition-colors" />
              {formik.touched.email && formik.errors.email && (
                <motion.div 
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-red-600 text-sm mt-1 flex items-center"
                >
                  <FaCheck className="mr-1" /> {formik.errors.email}
                </motion.div>
              )}
            </motion.div>

            {/* Password Input */}
            <motion.div variants={itemVariants} className="relative group">
              <Label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                <FaLock className="inline-block mr-2" /> Your Password
              </Label>
              <TextInput
                id="password" name="password" type="password"
                onChange={formik.handleChange} onBlur={formik.handleBlur} value={formik.values.password}
                className="w-full border-gray-300 dark:border-gray-600 rounded-xl shadow-sm focus:border-blue-500 focus:ring-blue-500 focus:ring-opacity-50 bg-gray-50/50 dark:bg-gray-700/50 text-gray-900 dark:text-white transition-all duration-200 ease-in-out pl-10 group-hover:bg-gray-50 dark:group-hover:bg-gray-700 backdrop-blur-sm"
                placeholder="Enter your password"
              />
              <FaLock className="absolute left-3 top-9 text-gray-400 group-hover:text-blue-500 transition-colors" />
              {formik.touched.password && formik.errors.password && (
                <motion.div 
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-red-600 text-sm mt-1 flex items-center"
                >
                  <FaCheck className="mr-1" /> {formik.errors.password}
                </motion.div>
              )}
            </motion.div>

            {/* Re-password Input */}
            <motion.div variants={itemVariants} className="relative group">
              <Label htmlFor="repassword" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                <FaLock className="inline-block mr-2" /> Confirm Password
              </Label>
              <TextInput
                id="repassword" name="repassword" type="password"
                onChange={formik.handleChange} onBlur={formik.handleBlur} value={formik.values.repassword}
                className="w-full border-gray-300 dark:border-gray-600 rounded-xl shadow-sm focus:border-blue-500 focus:ring-blue-500 focus:ring-opacity-50 bg-gray-50/50 dark:bg-gray-700/50 text-gray-900 dark:text-white transition-all duration-200 ease-in-out pl-10 group-hover:bg-gray-50 dark:group-hover:bg-gray-700 backdrop-blur-sm"
                placeholder="Confirm your password"
              />
              <FaLock className="absolute left-3 top-9 text-gray-400 group-hover:text-blue-500 transition-colors" />
              {formik.touched.repassword && formik.errors.repassword && (
                <motion.div 
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-red-600 text-sm mt-1 flex items-center"
                >
                  <FaCheck className="mr-1" /> {formik.errors.repassword}
                </motion.div>
              )}
            </motion.div>

            {/* Phone Input */}
            <motion.div variants={itemVariants} className="relative group">
              <Label htmlFor="phone" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                <FaPhone className="inline-block mr-2" /> Your Phone
              </Label>
              <TextInput
                id="phone" name="phone" type="tel"
                onChange={formik.handleChange} onBlur={formik.handleBlur} value={formik.values.phone}
                className="w-full border-gray-300 dark:border-gray-600 rounded-xl shadow-sm focus:border-blue-500 focus:ring-blue-500 focus:ring-opacity-50 bg-gray-50/50 dark:bg-gray-700/50 text-gray-900 dark:text-white transition-all duration-200 ease-in-out pl-10 group-hover:bg-gray-50 dark:group-hover:bg-gray-700 backdrop-blur-sm"
                placeholder="e.g., +1234567890"
              />
              <FaPhone className="absolute left-3 top-9 text-gray-400 group-hover:text-blue-500 transition-colors" />
              {formik.touched.phone && formik.errors.phone && (
                <motion.div 
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-red-600 text-sm mt-1 flex items-center"
                >
                  <FaCheck className="mr-1" /> {formik.errors.phone}
                </motion.div>
              )}
            </motion.div>

            {/* Remember me checkbox */}
            <motion.div variants={itemVariants} className="flex items-center justify-between text-sm">
              <div className="flex items-center group">
                <Checkbox 
                  id="remember" 
                  className="text-blue-600 focus:ring-blue-500 rounded dark:bg-gray-700 dark:border-gray-600 group-hover:border-blue-500 transition-colors"
                />
                <Label htmlFor="remember" className="ml-2 text-sm font-medium text-gray-700 dark:text-gray-300 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                  Remember me
                </Label>
              </div>
            </motion.div>
            
            {/* Register Button */}
            <motion.button
              type="submit"
              className={`w-full py-3 px-4 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white font-semibold rounded-xl shadow-lg hover:from-blue-700 hover:via-indigo-700 hover:to-purple-700 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
                isLoading ? 'opacity-50 cursor-not-allowed' : ''
              }`}
              disabled={isLoading || !formik.isValid}
              whileHover={{ scale: isLoading || !formik.isValid ? 1 : 1.02 }}
              whileTap={{ scale: isLoading || !formik.isValid ? 1 : 0.98 }}
              variants={itemVariants}
            >
              {isLoading ? (
                <div className="flex items-center justify-center">
                  <FaSpinner className="animate-spin mr-2" />
                  <span>Registering...</span>
                </div>
              ) : (
                <span>Create Account</span>
              )}
            </motion.button>

            {/* Login Link */}
            <motion.div 
              variants={itemVariants} 
              className="text-center text-sm !text-white dark:text-gray-400 mt-4"
            >
              Already have an account?{' '}
              <Link 
                to="/login" 
                className="font-medium text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 transition-colors underline-offset-4 hover:underline"
              >
                Login here
              </Link>
            </motion.div>
          </motion.form>
        </div>
      </motion.div>
    </div>
  );
};

export default Register;
