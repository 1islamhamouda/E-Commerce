
import { Button, Checkbox, Label, TextInput } from "flowbite-react";
import  {Link, useNavigate } from "react-router-dom";
import { useFormik } from "formik";
import * as Yup from "yup";
import axios from "axios";
import React, { useContext } from "react";
import img from '../../../assets/freshIcon.svg'
import { User} from "../../../context/UserContext"; // Adjust the path as needed

// Removed unused LogInDetails interface
const LogIn:React.FC = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = React.useState<Boolean>(false);
  const [isError, setIsError] = React.useState<Boolean>(false);
  const [error, setError] = React.useState<String>('');

  const userContext = useContext(User);
   if (!userContext) {
     throw new Error("UserContext is not provided");
   }
   const {user, setUser } = userContext;
  const handleLogin = (values:any) => {
    setIsLoading(true);
    return axios.post(`https://ecommerce.routemisr.com/api/v1/auth/signin`, values)
      .then((response) => {
        if(response?.data.message === 'success')
          setUser(response?.data?.token);
        
        localStorage.setItem("user", JSON.stringify(response.data));
        localStorage.setItem("token", response?.data?.token);

        setIsLoading(false);
        setIsError(false);
      })
      .catch((error) => {
        console.error("Error during login:", error);
        setIsLoading(false);
        setIsError(true);
        setError(error);
      });
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
    onSubmit: (values) => {
      console.log("Submitting data:", values);
      handleLogin(values).then(() => {
        navigate("/");
      });
    },
  });
  
   console.log('hhhhh',user);
   
  return (
    <>
       {isLoading && <div className="flex justify-center items-center w-full h-screen">Loading...</div>}
      {isError && <div className="flex justify-center items-center w-full h-screen">Error: {error}</div>}

      
       <div className="flex flex-col md:flex-row items-center justify-center min-h-screen bg-gray-100 px-4" >
       <div className=" w-full md:w-1/4 mb-3">
  <img src={img} alt="Logo" className=" mx-auto mt-10" />
  <h1 className="text-3xl font-bold text-center mt-4">Welcome to Fresh</h1>
  <p className="text-sm text-gray-500 text-center mb-4">Your one-stop shop for all things fresh!</p>
</div>

  <div className="w-full  max-w-md bg-white p-6 rounded-lg shadow-md ">
    
    <h2 className="text-2xl font-bold text-center mb-4">Log In</h2>
    <p className="text-sm text-gray-500 text-center mb-4">Welcome back! Please log in to your account.</p>
  <form onSubmit={formik.handleSubmit} className="w-full max-w-md flex flex-col gap-4">
    <div className="w-full">
      <Label htmlFor="email" className="block text-md font-thin !text-black">Your email</Label>
      <TextInput id="email" type="email" onChange={formik.handleChange} onBlur={formik.handleBlur} className="w-full p-0 border rounded-md shadow-sm" placeholder="name@example.com" required />
    </div>

    <div className="w-full">
      <Label htmlFor="password" className="block text-md font-thin !text-black">Your password</Label>
      <TextInput id="password" onBlur={formik.handleBlur} onChange={formik.handleChange} type="password" className="w-full p-0 border rounded-md shadow-sm" required />
    </div>

    <Button type="submit"  className="w-full py-3 bg-blue-500 text-white font-bold rounded-lg hover:bg-blue-600 transition ">
      Register Account
    </Button>
    <div className="flex items-center justify-between mt-4">
      <div className="flex items-center">
        <Checkbox id="remember" />
        <Label htmlFor="remember" className="ml-2 text-sm font-medium  !text-black">Remember me</Label>
      </div>
      <Link to="/Register" className="text-sm font-medium text-blue-600 hover:underline">Don't have an account? Register</Link>
    </div>
    <div className="flex items-center justify-between mt-4">
      <Link to="/ForgetPassword" className="text-sm font-medium  mx-auto text-blue-600 hover:underline">Forget Password?</Link>
    </div>
    
  </form>
</div>
</div>

    </>
  )
}

export default LogIn





