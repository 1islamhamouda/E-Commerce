
import { useQuery } from "@tanstack/react-query";
import { useParams } from "react-router-dom";
import axios from "axios";
import { Button } from "flowbite-react";
import { Link } from "react-router-dom";

export default function ProductDetails() {
    const { id } = useParams();

    // Fetch the main product details
    const getProductDetails = async (id: string) => {
        const response = await axios.get(`https://ecommerce.routemisr.com/api/v1/products/${id}`);
        return response.data.data;
    };

    const { data: productDetails, isLoading, isError } = useQuery({
        queryKey: ["productDetails", id ],
        queryFn: () => getProductDetails(id as string),
    });

    // Fetch related products based on category
    const getRelatedProducts = async (categoryName: string) => {
        const response = await axios.get(`https://ecommerce.routemisr.com/api/v1/products`);
        return response.data.data.filter((product: any) => product.category.name === categoryName);
    };

    const { data: relatedProducts } = useQuery({
        queryKey: ["relatedProducts", productDetails?.category.name as string],
        queryFn: () => getRelatedProducts(productDetails?.category.name as string),
        enabled: !!productDetails, // Only fetch when product details are available
    });
    
    

    if (isLoading) {
        return <div className="flex justify-center items-center w-full h-screen">Loading...</div>;
    }

    if (isError) {
        return <div className="text-red-500 text-center">Error fetching product details</div>;
    }

    return (
        <>
           

<h2 className="text-center text-3xl font-serif mt-8">Specific Product</h2>

<div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full min-h-screen px-4">
  {/* Product Image Section */}
  <div className="flex justify-center items-center">
    <img src={productDetails.imageCover} alt={productDetails.name} className="w-full max-w-md rounded-lg shadow-lg" />
  </div>

  {/* Product Details Section */}
  <div className="flex flex-col justify-center items-center gap-4 text-center md:text-left">
    <h3 className="text-4xl font-bold font-serif">{productDetails.category.name}</h3>
    <p className="font-serif text-gray-700">{productDetails.description}</p>
    <div className="flex justify-between items-center w-full px-4 py-2">
      <p className="text-lg">{productDetails.ratingsAverage} <i className="fa-solid fa-star text-yellow-300"></i></p>
      <p className="text-2xl font-bold">{productDetails.price} EGP</p>
    </div>
    <Button className="bg-gradient-to-r from-lime-200 via-lime-400 to-lime-500 text-gray-900 hover:bg-gradient-to-br focus:ring-lime-300 dark:focus:ring-lime-800 w-full font-serif rounded-lg text-lg px-5 py-2.5 text-center dark:bg-lime-600 dark:hover:bg-lime-700 dark:focus:ring-lime-800">
      Pay Now
    </Button>
  </div>
</div>

{/* Divider with Shadow Effect */}
<div className="w-1/2 mx-auto my-6">
  <hr className="border-t border-gray-300 shadow-md" />
</div>

  


            {/* Related Products Section */}
            <div className="mt-8 w-full px-8">
                <h2 className="text-3xl font-serif mb-4">Related Products</h2>
<div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
  {relatedProducts?.map((product: any) => (
    <Link key={product._id} to={`/ProductDetails/${product._id}/${product.category.name}`}>
      <div className="flex flex-col items-center bg-white shadow-lg rounded-lg  cursor-pointer hover:scale-105 transition-transform">
        <img src={product.imageCover} alt={product.name} className="w-full " />
        <h3 className="text-lg font-semibold text-center">{product.name}</h3>
        <div className="flex justify-between items-center w-full py-3 px-4 ">
          <p>{product.ratingsAverage} <i className="fa-solid fa-star text-yellow-300"></i></p>
          <p className="text-xl font-bold">{product.price} EGP</p>
        </div>
      </div>
    </Link>
  ))}
</div>

            </div>
        </>
    );
}
