
import Sliders from "../../SideDesigns/Slid/Sliders";
import CategoriesSlide from "../../SideDesigns/CategoriesSlide/CategoriesSlide";
import axios from "axios";
import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { useContext, useEffect } from "react";
import { useName } from "../../context/NameProvider";
import { Alert } from "flowbite-react";
import FavoriteButton from "../FavoriteList/FavoriteButton";
import { UserToken } from "../../context/UserContext";


const Home:React.FC = () => {

const getProducts = ()=>{
 return axios.get('https://ecommerce.routemisr.com/api/v1/products');
}
const {data,error,isError,isFetched,isLoading} = useQuery({
  queryKey:['products'],
  queryFn: getProducts,
  
  }
  
);
let {name}=useName();
const {user}= UserToken();

useEffect(()=>{
 if(name){
   <Alert color="success" className="w-full">
  <span>Welcome {name}</span>
</Alert>
 }
 
},[name]);

if(isLoading) return <div className="flex justify-center items-center w-full h-screen">Loading...</div>
if(isError){
  console.log('error')
  console.log(error)
}
  

  if(isFetched){
    console.log('Fetched')
  }
  console.log(data?.data?.data);
  
  console.log(localStorage.getItem('token'));
  
  console.log(user);
  

  return (
    <>
     
     <Sliders/>
     <CategoriesSlide/>
    
     
       {name && <Alert color="success" className="w-full">
  <span>Welcome {name}</span>
</Alert>}
       <h1 className="text-3xl font-bold">Products</h1>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4 mt-3">
  {data?.data?.data?.map((product:any) => (
    <div key={product._id}>
        <div className="p-2">
        <FavoriteButton productId={product._id}/>
        </div>
       <Link to={`ProductDetails/${product._id}/${product.category.name}`}  className="">
    <div  className="flex flex-col items-center bg-white shadow-lg rounded-lg p-3">
      <img src={product.imageCover} alt={product.name} className="w-full" />
      <h3 className="text-lg font-semibold text-center">
        {product.title.split(' ').slice(0,2).join(' ')}
      </h3>
      <p className="text-green-500"> {product.category.name}</p>
      <div className="flex justify-between items-center w-full px-4 pt-2">
        <p className="text-xl font-bold">${product.price}</p>
        <p>{product.ratingsAverage} <i className="fa-solid fa-star text-yellow-300"></i></p>
      </div>
    </div>
    </Link>
    </div>
  ))}
</div>
        




    </>
  )
}

export default Home
