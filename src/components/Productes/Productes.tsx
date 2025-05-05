import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { Link } from "react-router-dom";
import { useCart} from "../../context/CartContext/AddProvider";
// import { useCart} from "../../context/CartContext/AddProvider";

const Productes = () => {
 
  const getProducts = ()=>{
    return axios.get('https://ecommerce.routemisr.com/api/v1/products');
   }
   const {data :products,error,isError,isLoading} = useQuery({
     queryKey:['products'],
     queryFn: getProducts,
     
     }
     
   );
  //  const {addToCart}=useCart();
   if(isLoading) return <div className="flex justify-center items-center w-full h-screen">Loading...</div>
   if(isError){
     console.log('error')
     console.log(error)
   }
     
    // async function localData({ productId }: { productId: any; }) {
    //   try {
    //     console.log('Calling addToCart with productId:', productId);
    //     const res = await addToCart(productId);
    //     console.log('Add to cart response:', res);
       
        
    //     return res;
    //   } catch (error) {
    //     console.error('Error in localData:', error);
    //     throw error;
    //   }
    // }
   
     
  //  let token=localStorage.getItem('tokenn');

  //  if(token){
  //   console.log('okkkkkk',data?.data.data.map((product: {_id:any})=>product._id));
  //  }
  //  else{
  //   console.error('noooooooo')
  //  }


   
    return (
      <>
            <h1 className="text-3xl font-bold">Products</h1>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4 mt-3">
  {products?.data?.data.map((product:any) => (
    <div key={product._id}>
    <Link to={`/ProductDetails/${product?._id}/${product.category.name}`}  className="">
      <div className="flex flex-col items-center bg-white shadow-lg rounded-lg p-3">
        <img src={product.imageCover} alt={product.name} className="w-full" />
        <h3 className="text-lg font-semibold text-center">
          {product.title.split(' ').slice(0, 2).join(' ')}
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
  
  export default Productes



  