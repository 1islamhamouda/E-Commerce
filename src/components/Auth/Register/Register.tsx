import { Button, Label, TextInput } from "flowbite-react";
import  {Link, useNavigate } from "react-router-dom";
import { useFormik } from "formik";
import * as Yup from "yup";
import axios from "axios";
import Alert from '@mui/material/Alert';
import React, { useContext } from "react";
import { useName } from "../../../context/NameProvider";
import {  Spinner } from "flowbite-react";
import img from '../../../assets/freshIcon.svg'
import { User} from "../../../context/UserContext"; // Adjust the path as needed


interface RegisterDetails {
  name: string;
  email: string;
  password: string;
  repassword: string;
  phone: string;
}
const Register = () => {
  const navigate = useNavigate();
  // const {setUser}=UserToken();
 
 
  const userContext = useContext(User);
  if (!userContext) {
    throw new Error("User context is not provided");
  }
  const { user, setUser } = userContext;
 let {setName}= useName();
  const [error,setError]=React.useState<String>('');
  const [isLoading, setIsLoading] = React.useState<Boolean>(false);
  const [isError, setIsError] = React.useState<Boolean>(false);


  const handleSignIn = (values: RegisterDetails) => {
    setIsLoading(true);
    
    
    return axios.post(`https://ecommerce.routemisr.com/api/v1/auth/signup`, values)
    .then((response) => {
      console.log(response.data);
      setIsLoading(false);
      localStorage.setItem("user", JSON.stringify(response.data));
      localStorage.setItem("token", response?.data?.token);
      if(response?.data.message=='success'){
        console.log(response?.data?.token,'okay');
      setUser(response?.data.token);
    }
      navigate("/login");
      setName(values.name);
    })
    .catch((error) => {
      setIsLoading(false);
      console.error("Error during login:", error);
     
      
    });
      
  };
  

  const validationSchema = Yup.object({
    name: Yup.string().min(3, "Name must be more than 3 characters").required("Please enter your name"),
    email: Yup.string().email("Invalid email address").required("Please enter your email"),
    password: Yup.string().required("Please enter your password"),
    repassword: Yup.string().oneOf([Yup.ref("password"), ""], "Passwords must match").required("Please enter your rePassword"),
    phone: Yup.string().required("Please enter your phone"),
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
    onSubmit: (values) => {
      console.log("Submitting data:", values);
      handleSignIn(values).then(() => {
        navigate("/login");
        
      }).catch((error) => {
        setError(error.response.data.message);
        setIsError(true);
        console.error("Error during registration:", error);
      });
    },
  });

 console.log('okokokokk',user);
 
  

  return (
    <>
        
        {/* {isLoading ? <div className="flex justify-center items-center w-full h-screen">Loading...</div>:(
          <>
          <div className="flex items-center justify-center min-h-screen bg-gray-100 p-4  md:p-20">
            <div className="w-full max-w-md p-6 bg-white rounded-lg shadow-lg mt-4">

    <h1 className="text-center absolute top-10 text-3xl font-bold">Register Now</h1>
     <form onSubmit={formik.handleSubmit} className="w-full  flex flex-col gap-4">
     <div className="w-full">
       <Label htmlFor="name" className="block text-lg font-thin !text-black">Your Name</Label>
       <TextInput id="name" type="text" onChange={formik.handleChange} onBlur={formik.handleBlur} className="w-full p-0 border rounded-md shadow-sm" placeholder=""></TextInput>
     </div>
     {formik.touched.name && formik.errors?.name ? (
       <div className="text-red-500 text-sm">{formik.errors?.name}</div>
     ) : null}

     <div className="w-full">
       <Label htmlFor="email" className="block text-lg font-thin !text-black">Your email</Label>
       <TextInput id="email" type="email" onChange={formik.handleChange} onBlur={formik.handleBlur} className="w-full p-0 border rounded-md shadow-sm" placeholder=""></TextInput>
     </div>
     {formik.touched.email && formik.errors.email ? (
       <div className="text-red-500 text-sm">{formik.errors.email}</div>
     ) : null}

     <div className="w-full">
       <Label htmlFor="password" className="block text-lg font-thin !text-black">Your password</Label>
       <TextInput id="password" type="password" onChange={formik.handleChange} onBlur={formik.handleBlur} className="w-full p-0 border rounded-md shadow-sm" placeholder=""></TextInput>
     </div>
     {formik.touched.password && formik.errors.password ? (
       <div className="text-red-500 text-sm">{formik.errors.password}</div>
     ) : null}

     <div className="w-full">
       <Label htmlFor="repassword" className="block text-lg font-thin !text-black">Your rePassword</Label>
       <TextInput id="repassword" type="password" onChange={formik.handleChange} onBlur={formik.handleBlur} className="w-full p-0 border rounded-md shadow-sm" placeholder=""></TextInput>
     </div>
     {formik.touched.repassword && formik.errors.repassword ? (
       <div className="text-red-500 text-sm">{formik.errors.repassword}</div>
     ) : null}


     <div className="w-full">
       <Label htmlFor="phone" className="block text-lg font-thin !text-black">Your phone</Label>
       <TextInput id="phone" type="tel" onChange={formik.handleChange} onBlur={formik.handleBlur} className="w-full p-0 border rounded-md shadow-sm" placeholder=""></TextInput>
     </div>
     {formik.touched.phone && formik.errors.phone ? (
       <div className="text-red-500 text-sm">{formik.errors.phone}</div>
     ) : null}

     <Button type="submit" className="w-full py-3 bg-blue-500 text-white font-bold rounded-lg hover:bg-blue-600 transition">
       {isLoading ? "Loading..." : "Register Account"}
     </Button>
     <div className="flex items-center justify-between mt-4">
       <Checkbox id="remember" />
       <Label htmlFor="remember" className="text-sm font-thin !text-black">Remember me</Label>
     </div>
     <p className="text-sm text-black-500 text-center mt-4">
       Already have an account?{" "}
       <Link to="/LogIn" className="text-blue-500 hover:underline">Login</Link>
     </p>
   </form>
            </div>
          </div>
         
          </>
        )} */}

        

        {isLoading && <div className="flex justify-center items-center w-full h-screen">Loading...</div>}
       <div className="flex flex-col md:flex-row pb-11 items-center justify-center min-h-screen bg-gray-100 p-4  md:p-20">
       <div className=" w-full md:w-1/4 mb-3 md:me-7 ">
  <img src={img} alt="Logo" className=" mx-auto mt-10" />
  <h1 className="text-3xl font-bold text-center mt-4">Welcome to Fresh</h1>
  <p className="text-sm text-gray-500 text-center mb-4">Your one-stop shop for all things fresh!</p>
</div>
  <div className="w-full max-w-md p-6 bg-white rounded-lg shadow-lg mt-4">
    <h1 className="text-center text-3xl font-bold text-gray-800 mb-6">Register Now</h1>

    <form onSubmit={formik.handleSubmit} className="flex flex-col gap-4">
    
      <div className="w-full">
        <Label htmlFor="name" className="text-lg font-thin !text-black">Your Name</Label>
        <TextInput id="name" name="name" type="text" onChange={formik.handleChange} onBlur={formik.handleBlur} className="w-full p-0 border rounded-md shadow-md" placeholder="Enter your name" required />
        {formik.touched.name && formik.errors.name && <div className="text-red-500 text-sm">{formik.errors.name}</div>}
      </div>

     
      <div className="w-full">
        <Label htmlFor="email" className="text-lg font-thin !text-black">Your Email</Label>
        <TextInput id="email" name="email" type="email" onChange={formik.handleChange} onBlur={formik.handleBlur} className="w-full p-0 border rounded-md shadow-sm" placeholder="Enter your email" required />
        {formik.touched.email && formik.errors.email && <div className="text-red-500 text-sm">{formik.errors.email}</div>}
      </div>

     
      <div className="w-full">
        <Label htmlFor="password" className="text-lg font-thin !text-black">Your Password</Label>
        <TextInput id="password" name="password" type="password" placeholder="Passowrd" onChange={formik.handleChange} onBlur={formik.handleBlur} className="w-full p-0 border rounded-md shadow-sm" required />
        {formik.touched.password && formik.errors.password && <div className="text-red-500 text-sm">{formik.errors.password}</div>}
      </div>

     
      <div className="w-full">
       <Label htmlFor="repassword" className="block text-lg font-thin !text-black">Your rePassword</Label>
       <TextInput id="repassword" type="password" onChange={formik.handleChange} onBlur={formik.handleBlur} className="w-full p-0 border rounded-md shadow-sm" placeholder="RePassowrd"></TextInput>
     {formik.touched.repassword && formik.errors.repassword ? (
       <div className="text-red-500 text-sm">{formik.errors.repassword}</div>
     ) : null}
     </div>

     
      <div className="w-full">
        <Label htmlFor="phone" className="text-lg font-thin !text-black">Your Phone</Label>
        <TextInput id="phone" name="phone" type="tel" onChange={formik.handleChange} onBlur={formik.handleBlur} placeholder="01***" className="w-full p-0 border rounded-md shadow-sm" required />
        {formik.touched.phone && formik.errors.phone && <div className="text-red-500 text-sm">{formik.errors.phone}</div>}
      </div>

      <Button type="submit" className="w-full py-3 bg-blue-500 text-white font-bold rounded-lg hover:bg-blue-600 transition">
        {isLoading ? <Button color="alternative">
        <Spinner size="sm" aria-label="Info spinner example" className="me-3 w-full" light />
        Loading...
      </Button> : "Register Account"}
      </Button>

      
      <div className="flex items-center justify-between mt-4">
        <label className="flex items-center">
          <input type="checkbox" name="remember" className="mr-2" />
          <span className="text-sm font-thin text-gray-800">Remember me</span>
        </label>
        <p className="text-sm text-gray-600 text-center mt-4">
          Already have an account? <Link to="/login" className="text-blue-500 hover:underline">Login</Link>
        </p>
      </div>
    </form>
  </div>
</div>


{isError && (
  <div className="absolute top-0 w-full flex justify-center mt-2">
    <Alert severity="error" className="w-1/2 rounded-lg shadow-md">{error}</Alert>
  </div>
)}


    </>
  )
}

export default Register
