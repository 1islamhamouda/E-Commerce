import { Checkbox, Label, TextInput } from "flowbite-react";
import { Link, useNavigate } from "react-router-dom";
import { useFormik } from "formik";
import * as Yup from "yup";
import React, { useContext} from "react";
import img from '../../../assets/freshIcon.svg';
import { User } from "../../../context/UserContext";
import { authAPI } from "../../../utils/api";
import { motion } from 'framer-motion';
import { FaSpinner } from 'react-icons/fa';
import toast, { Toaster } from 'react-hot-toast';

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

const LogIn: React.FC = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = React.useState<boolean>(false);
  const [isError, setIsError] = React.useState<boolean>(false);
  const [error, setError] = React.useState<string>('');

  const userContext = useContext(User);
  if (!userContext) {
    throw new Error("UserContext is not provided");
  }
  const { setUser, setToken } = userContext;

  const handleLogin = async (values: { email: string; password: string }) => {
    setIsLoading(true);
    setIsError(false);
    setError('');

    const toastId = toast.loading('Logging in...', { position: 'top-center' });

    try {
      const response = await authAPI.login(values);
      if (response.message === 'success') {
        setToken(response.token);
        setUser(response.user);
        toast.success('Login successful! Redirecting...', { id: toastId });
        navigate("/");
      } else {
        setIsError(true);
        const errorMessage = response.message || 'An unexpected error occurred.';
        setError(errorMessage);
        toast.error(`Login failed: ${errorMessage}`, { id: toastId });
      }
    } catch (error: any) {
      console.error("Error during login:", error);
      setIsError(true);
      const errorMessage = error.response?.data?.message || 'An error occurred during login';
      setError(errorMessage);
      toast.error(`Login failed: ${errorMessage}`, { id: toastId });
    } finally {
      setIsLoading(false);
    }
  };

  const validationSchema = Yup.object({
    email: Yup.string().email("Invalid email address").required("Please enter your email"),
    password: Yup.string().required("Please enter your password"),
  });

  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
    },
    validationSchema,
    onSubmit: handleLogin,
  });

  if(isError){
    console.log('there are error',error);
    
  }
  return (
    <div className="min-h-screen  w-full flex items-center justify-center bg-gradient-to-br from-blue-950 to-black p-4 sm:p-6 lg:p-8 relative overflow-hidden">
       {/* Background Gradient Overlay Example (Optional) */}
       {/* <div className="absolute inset-0 bg-gradient-to-br from-blue-900 to-purple-900 opacity-30"></div> */}

      <Toaster position="top-center" /> {/* Add Toaster component */}

      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
        className="flex flex-col md:flex-row items-center justify-center w-full max-w-6xl bg-white dark:bg-gray-800 rounded-xl shadow-2xl overflow-hidden z-10"
      >
        {/* Left Section: Image and Welcome */}
        <div className="w-full md:w-1/3 lg:w-2/5 p-8 md:p-10 lg:p-12 bg-gray-100 dark:bg-gray-900 flex flex-col items-center justify-center text-center  md:h-[500px]">
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
            Welcome to Fresh
          </motion.h1>
          <motion.p
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="text-sm md:text-base text-gray-600 dark:text-gray-300"
          >
            Your one-stop shop for all things fresh!
          </motion.p>
        </div>

        {/* Right Section: Login Form */}
        <div className="w-full md:w-2/3 lg:w-3/5 p-8 md:p-10 lg:p-12 bg-white dark:bg-gray-800">
        
          <motion.h2
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="text-2xl md:text-3xl font-bold text-center text-gray-800 dark:text-white mb-8"
          >
            Log In to Your Account
          </motion.h2>

          <motion.form
            onSubmit={formik.handleSubmit}
            className="w-full flex flex-col gap-6"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            <motion.div variants={itemVariants}>
              <Label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Your email</Label>
              <TextInput
                id="email"
                type="email"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.email}
                className="w-full border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white"
                placeholder="name@example.com"
              />
              {formik.touched.email && formik.errors.email && (
                <div className="text-red-600 text-sm mt-1">{formik.errors.email}</div>
              )}
            </motion.div>

            <motion.div variants={itemVariants}>
              <Label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Your password</Label>
              <TextInput
                id="password"
                type="password"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.password}
                className="w-full border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white"
                placeholder="Password"
              />
              {formik.touched.password && formik.errors.password && (
                <div className="text-red-600 text-sm mt-1">{formik.errors.password}</div>
              )}
            </motion.div>

            <motion.div variants={itemVariants} className="flex items-center justify-between">
              <div className="flex items-center">
                <Checkbox id="remember" className="text-blue-600 focus:ring-blue-500 rounded dark:bg-gray-700 dark:border-gray-600" />
                <Label htmlFor="remember" className="ml-2 text-sm font-medium text-gray-700 dark:text-gray-300">Remember me</Label>
              </div>
              <Link to="/ForgetPassword" className="text-sm font-medium text-blue-600 hover:underline dark:text-blue-400 dark:hover:text-blue-300 transition-colors">
                Forget Password?
              </Link>
            </motion.div>

            <motion.button
               type="submit"
               className={`w-full py-3 px-4 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
                 isLoading ? 'opacity-50 cursor-not-allowed' : ''
               }`}
               disabled={isLoading || !formik.isValid}
               whileHover={{ scale: isLoading || !formik.isValid ? 1 : 1.02 }}
               whileTap={{ scale: isLoading || !formik.isValid ? 1 : 0.98 }}
               variants={itemVariants} // Apply item variant to button
            >
               {isLoading ? <FaSpinner className="animate-spin mr-2" /> : null}
               Log In
            </motion.button>

            <motion.div variants={itemVariants} className="text-center text-sm text-gray-600 dark:text-gray-400 mt-4">
              Don't have an account?{' '}
              <Link to="/Register" className="font-medium text-blue-600 hover:underline dark:text-blue-400 dark:hover:text-blue-300 transition-colors">
                 Register here
              </Link>
            </motion.div>
          </motion.form>
        </div>
      </motion.div>
    </div>
  );
};

export default LogIn;





