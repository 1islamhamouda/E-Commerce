import Sliders from "../../SideDesigns/Slid/Sliders";
import CategoriesSlide from "../../SideDesigns/CategoriesSlide/CategoriesSlide";
import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { useContext, useEffect, useState } from "react";
import { useName } from "../../context/NameProvider";
import { Alert } from "flowbite-react";
import FavoriteButton from "../FavoriteList/FavoriteButton";
import Search from "./Search";
import { User } from "../../context/UserContext";
import { productAPI } from "../../utils/api";
import { useCart } from "../../context/CartContext/AddProvider";
import toast from 'react-hot-toast';
import './Home.css';

interface Product {
  _id: string;
  name: string;
  title: string;
  category: {
    name: string;
  };
  price: number;
  imageCover: string;
  ratingsAverage: number;
  images: string[];
  description: string;
  quantity: number;
  sold: number;
  priceAfterDiscount: number;
}

const Home: React.FC = () => {
  const [searchResults, setSearchResults] = useState<Product[]>([]);
  const { name } = useName();
  const { addToCart } = useCart();
  
  const userContext = useContext(User);
  if (!userContext) {
    throw new Error('UserContext is not provided');
  }
  const { user, token } = userContext;
  console.log('user',user, 'token',token);

  const { data, error, isError, isLoading } = useQuery({
    queryKey: ['products'],
    queryFn: async () => {
      const response = await productAPI.getProducts();
      return response;
    }
  });

  useEffect(() => {
    if (data?.data) {
      setSearchResults(data.data as Product[]);
    }
  }, [data]);

  const handleAddToCart = async (productId: string, event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    event.stopPropagation(); // Prevent the Link click event
    try {
      const toastId = toast.loading('Adding to cart...');
      await addToCart(productId);
      toast.success('Product added to cart successfully! 🛒', {
        id: toastId,
        duration: 2000,
        position: 'top-center',
        style: {
          background: '#4CAF50',
          color: '#fff',
        },
      });
    } catch (error) {
      console.error('Error adding to cart:', error);
      toast.error('Failed to add product to cart. Please try again.', {
        duration: 3000,
        position: 'top-center',
        style: {
          background: '#f44336',
          color: '#fff',
        },
      });
    }
  };

  if (isLoading) {
    return <div className="flex justify-center items-center w-full h-screen">Loading...</div>;
  }

  if (isError) {
    return (
      <div className="flex justify-center items-center w-full h-screen text-red-500">
        Error loading products: {error instanceof Error ? error.message : 'Unknown error'}
      </div>
    );
  }

  return (
    <>
      <Sliders />
      <CategoriesSlide />
      
      {name && (
        <Alert color="success" className="w-full">
          <span>Welcome {name}</span>
        </Alert>
      )}

      <Search products={data?.data as Product[] || []} onSearch={setSearchResults} />

      {searchResults.length > 0 ? (
        <>
          <div className="flex justify-between py-8">
            <h1 className="text-3xl font-bold ms-2">Products</h1>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4 mt-3">
            {searchResults.map((product) => (
              <div 
                key={product._id} 
                className="cursor-pointer hover:scale-105 transition-transform"
              >
                <div className="p-2">
                  <FavoriteButton productId={product._id} />
                </div>
                <Link to={`ProductDetails/${product._id}/${product.category.name}`}>
                  <div className="flex flex-col items-center bg-white shadow-lg rounded-lg p-3">
                    <img 
                      src={product.imageCover} 
                      alt={product.name} 
                      className="w-full h-48 object-cover"
                    />
                    <h3 className="text-lg font-semibold text-center mt-2">
                      {product.title.split(' ').slice(0, 2).join(' ')}
                    </h3>
                    <p className="text-green-500">{product.category.name}</p>
                    <div className="flex justify-between items-center w-full px-4 pt-2">
                      <p className="text-xl font-bold text-gray-500">${product.price}</p>
                      <p className="flex items-center">
                        {product.ratingsAverage} 
                        <i className="fa-solid fa-star text-yellow-300 ml-1"></i>
                      </p>
                    </div>
                  </div>
                  <button 
                    className="w-full bg-blue-500 text-white py-2 text-center hover:bg-blue-600 transition-colors"
                    onClick={(event) => handleAddToCart(product._id, event)}
                  >
                    Add to Cart
                  </button>
                </Link>
              </div>
            ))}
          </div>
        </>
      ) : (
        <p className="text-center text-gray-500 mt-4">No matching products found.</p>
      )}
    </>
  );
};

export default Home;

