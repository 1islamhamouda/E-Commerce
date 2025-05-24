import { Button, Checkbox, Label, TextInput } from "flowbite-react";
import { Link, useNavigate } from "react-router-dom";
import { useFormik } from "formik";
import * as Yup from "yup";
import React, { useContext } from "react";
import img from '../../../assets/freshIcon.svg';
import { User } from "../../../context/UserContext";
import { authAPI } from "../../../utils/api";

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
    try {
      const response = await authAPI.login(values);
      if (response.message === 'success') {
        setToken(response.token);
        setUser(response.user);
        navigate("/");
      }
      setIsError(false);
    } catch (error: any) {
      console.error("Error during login:", error);
      setIsError(true);
      setError(error.response?.data?.message || 'An error occurred during login');
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

  return (
    <>
      {isLoading && <div className="flex justify-center items-center w-full h-screen">Loading...</div>}
      {isError && <div className="flex justify-center items-center w-full h-screen text-red-500">Error: {error}</div>}

      <div className="flex flex-col md:flex-row items-center justify-center min-h-screen bg-gray-100 px-4">
        <div className="w-full md:w-1/4 mb-3">
          <img src={img} alt="Logo" className="mx-auto mt-10" />
          <h1 className="text-3xl font-bold text-center mt-4">Welcome to Fresh</h1>
          <p className="text-sm text-gray-500 text-center mb-4">Your one-stop shop for all things fresh!</p>
        </div>

        <div className="w-full max-w-md">
          <h2 className="text-2xl font-bold text-center mb-4">Log In</h2>
          <p className="text-sm text-gray-500 text-center mb-4">Welcome back! Please log in to your account.</p>
          
          <form onSubmit={formik.handleSubmit} className="w-full flex flex-col gap-4">
            <div className="w-full">
              <Label htmlFor="email" className="block text-md font-thin !text-black">Your email</Label>
              <TextInput
                id="email"
                type="email"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.email}
                className="w-full p-0 border rounded-md shadow-sm"
                placeholder="name@example.com"
                required
              />
              {formik.touched.email && formik.errors.email && (
                <div className="text-red-500 text-sm mt-1">{formik.errors.email}</div>
              )}
            </div>

            <div className="w-full">
              <Label htmlFor="password" className="block text-md font-thin !text-black">Your password</Label>
              <TextInput
                id="password"
                type="password"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.password}
                className="w-full p-0 border rounded-md shadow-sm"
                required
              />
              {formik.touched.password && formik.errors.password && (
                <div className="text-red-500 text-sm mt-1">{formik.errors.password}</div>
              )}
            </div>

            <Button type="submit" className="w-full py-3 bg-blue-500 text-white font-bold rounded-lg hover:bg-blue-600 transition">
              Log In
            </Button>

            <div className="flex items-center justify-between mt-4">
              <div className="flex items-center">
                <Checkbox id="remember" />
                <Label htmlFor="remember" className="ml-2 text-sm font-medium !text-black">Remember me</Label>
              </div>
              <Link to="/Register" className="text-sm font-medium text-blue-600 hover:underline">
                Don't have an account? Register
              </Link>
            </div>

            <div className="flex items-center justify-between mt-4">
              <Link to="/ForgetPassword" className="text-sm font-medium mx-auto text-blue-600 hover:underline">
                Forget Password?
              </Link>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default LogIn;





