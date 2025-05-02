
import Sliders from "../../SideDesigns/Slid/Sliders";
import CategoriesSlide from "../../SideDesigns/CategoriesSlide/CategoriesSlide";
import axios from "axios";
import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import {  JSXElementConstructor, Key, ReactElement, ReactNode, ReactPortal, useContext, useEffect, useState } from "react";
import { useName } from "../../context/NameProvider";
import { Alert } from "flowbite-react";
import FavoriteButton from "../FavoriteList/FavoriteButton";
import Search from "./Search";
import { User} from "../../context/UserContext"; // Adjust the path as needed
import './Home.css'


// Ensure filteredProducts is typed as an array
type Product = {
  ratingsAverage: ReactNode;
  name: string | undefined;
  _id: string;
  category: { name: string };
  price: number;
  imageCover: string; // Added imageCover property
  title: string; // Added title property
};


const Home:React.FC = () => {
const [searchResulte, setSearchResulte] = useState<Product[]>([]);
const getProducts = () => {
  return axios.get<{ data: Product[] }>('https://ecommerce.routemisr.com/api/v1/products');
};
const {data,error,isError,isFetched,isLoading} = useQuery({
  queryKey:['products'],
  queryFn: getProducts,
  
  }
  
);

let {name}=useName();
// const {user}= UserToken();
 const userContext = useContext(User);
 if(!userContext){
  throw new Error('UserContext is not provided');
 }
 const {user}=userContext;
//  const user = userContext ? userContext.user : null;
useEffect(()=>{
 if(name){
   <Alert color="success" className="w-full">
  <span>Welcome {name}</span>
</Alert>
 }
 
},[name]);

useEffect(() => {
  setSearchResulte(data?.data?.data || []);
}, [data]);


if(isLoading) return <div className="flex justify-center items-center w-full h-screen">Loading...</div>
if(isError){
  console.log('error')
  console.log(error)
}
  

  if(isFetched){
    console.log('Fetched')
  }

  console.log('ok',searchResulte);
  
  
  
  
  
  return (
    <>
     
     <Sliders/>
     <CategoriesSlide/>
    
     
       {name && <Alert color="success" className="w-full">
  <span>Welcome {name}</span>
</Alert>}


  
       

       
{searchResulte.length > 0 ? (<>
<div className="flex  justify-between  py-8">
       <h1 className="text-3xl font-bold ms-2">Products</h1>
       </div>
  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4 mt-3  ">
  {searchResulte.map((product: {
    ratingsAverage: ReactNode;
    title: any;
    name: string | undefined;
    imageCover: string | undefined; _id: Key | null | undefined; category: { name: string | number | boolean | ReactElement<any, string | JSXElementConstructor<any>> | Iterable<ReactNode> | ReactPortal | null | undefined; }; price: string | number | boolean | ReactElement<any, string | JSXElementConstructor<any>> | Iterable<ReactNode> | ReactPortal | null | undefined; 
})=>(
    <>

    <div key={product._id} className="cursor-pointer hover:scale-105 transition-transform">
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
        <p className="text-xl font-bold text-gray-500">${product.price}</p>
        <p>{product.ratingsAverage} <i className="fa-solid fa-star text-yellow-300"></i></p>
      </div>
    </div>
    </Link>
    </div>
    </>
))
}
</div>
</>): <p>No matching products found.</p>}
       
        




    </>
  )
}

export default Home
