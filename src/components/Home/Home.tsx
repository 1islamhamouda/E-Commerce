import Sliders from "../../SideDesigns/Slid/Sliders";
import CategoriesSlide from "../../SideDesigns/CategoriesSlide/CategoriesSlide";
import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { useContext, useEffect, useState } from "react";
// import { useName } from "../../context/NameProvider";
import FavoriteButton from "../FavoriteList/FavoriteButton";
import Search from "./Search";
import { User } from "../../context/UserContext";
import { productAPI } from "../../utils/api";
import { useCart } from "../../context/CartContext/AddProvider";
import toast from "react-hot-toast";
import { motion } from 'framer-motion';
import { FaSpinner, FaShoppingCart, FaStar } from 'react-icons/fa';
import { MdError } from 'react-icons/md';
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
  // const { name } = useName();
  const { addToCart } = useCart();
  
  const userContext = useContext(User);
  if (!userContext) {
    throw new Error('UserContext is not provided');
  }
  const { user, token } = userContext;

  useEffect(() => {
    if (token && user?.name) {
      toast.success(`Welcome back, ${user?.name}! 👋`, {
        duration: 3000,
        position: 'top-center',
        style: {
          background: '#4CAF50',
          color: '#fff',
          padding: '16px',
          borderRadius: '8px',
          boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
        },
      });
    }
  }, [token, user?.name]);

  const { data, error, isError, isLoading } = useQuery({
    queryKey: ['products'],
    queryFn: async () => {
      const response = await productAPI.getProducts();
      return response;
    }
  });

  console.log('token of user = ',token);

  useEffect(() => {
    if (data?.data) {
      setSearchResults(data.data as Product[]);
    }
  }, [data]);

  const handleAddToCart = async (productId: string, event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    event.stopPropagation();
    try {
      const toastId = toast.loading('Adding to cart... 🛒', {
        duration: 2000,
        position: 'top-center',
        style: {
          background: '#2196F3',
          color: '#fff',
          padding: '16px',
          borderRadius: '8px',
          boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
        },
      });
      await addToCart(productId);
      toast.success('Added to cart successfully! 🎉', {
        id: toastId,
        duration: 2000,
        position: 'top-center',
        style: {
          background: '#4CAF50',
          color: '#fff',
          padding: '16px',
          borderRadius: '8px',
          boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
        },
      });
    } catch (error) {
      console.error('Error adding to cart:', error);
      toast.error('Failed to add to cart ❌', {
        duration: 3000,
        position: 'top-center',
        style: {
          background: '#f44336',
          color: '#fff',
          padding: '16px',
          borderRadius: '8px',
          boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
        },
      });
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-[calc(100vh-4rem)] flex flex-col items-center justify-center bg-gray-900">
        <motion.div
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <FaSpinner className="w-12 h-12 text-blue-500 animate-spin mb-4" />
        </motion.div>
        <motion.p 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="text-gray-300 text-lg"
        >
          Loading products...
        </motion.p>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="min-h-[calc(100vh-4rem)]  flex flex-col items-center justify-center bg-gray-900">
        <motion.div
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <MdError className="w-16 h-16 text-red-500 mb-4" />
        </motion.div>
        <motion.h2 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="text-2xl font-bold text-gray-200 mb-2"
        >
          Oops! Something went wrong
        </motion.h2>
        <motion.p 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="text-gray-400 text-center max-w-md px-4"
        >
          {error instanceof Error ? error.message : 'Failed to load products. Please try again later.'}
        </motion.p>
      </div>
    );
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.5
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 w-full">
      <Sliders />
      <CategoriesSlide />
      
      <div className="w-full px-4 sm:px-6 lg:px-8 py-8">
        <Search products={data?.data as Product[] || []} onSearch={setSearchResults} />

        {searchResults.length > 0 ? (
          <>
            <motion.div 
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.5 }}
              className="text-center mb-12"
            >
              <h1 className="text-3xl sm:text-4xl font-bold mb-4 bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
                Featured Products
              </h1>
              <p className="text-gray-400 max-w-2xl mx-auto">
                Discover our handpicked selection of premium products, curated just for you.
              </p>
            </motion.div>

            <motion.div 
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6 w-full"
            >
              {searchResults.map((product) => (
                <motion.div
                  key={product._id}
                  variants={itemVariants}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="group w-full"
                >
                  <div className="bg-gray-800 rounded-xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-700 hover:border-blue-500 w-full">
                    <div className="relative">
                      {product.priceAfterDiscount && (
                        <div className="absolute top-2 left-2 z-10">
                          <span className="bg-red-500 text-white text-sm font-bold px-2 py-1 rounded-full">
                            {Math.round(((product.price - product.priceAfterDiscount) / product.price) * 100)}% OFF
                          </span>
                        </div>
                      )}
                      <div className="absolute top-2 right-2 z-10">
                        <FavoriteButton productId={product._id} />
                      </div>
                      <Link to={`/ProductDetails/${product._id}/${product.category.name}`} className="w-full">
                        <div className="relative aspect-square overflow-hidden bg-gray-700 w-full">
                          <motion.img 
                            src={product.imageCover} 
                            alt={product.name} 
                            className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500"
                            loading="lazy"
                            whileHover={{ rotate: [0, -5, 5, -5, 0] }}
                            transition={{ duration: 0.5 }}
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-gray-900/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                        </div>
                      </Link>
                    </div>

                    <div className="p-4 relative w-full">
                      <Link to={`/ProductDetails/${product._id}/${product.category.name}`} className="w-full">
                        <h3 className="text-lg font-semibold text-white mb-2 line-clamp-2">
                          {product.title}
                        </h3>
                      </Link>
                      
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-sm text-blue-400 bg-blue-900/30 px-2 py-1 rounded-full">
                          {product.category.name}
                        </span>
                        <div className="flex items-center text-yellow-400">
                          <FaStar className="w-4 h-4 mr-1" />
                          <span className="text-sm">{product.ratingsAverage}</span>
                        </div>
                      </div>

                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-baseline gap-2">
                          <span className="text-xl font-bold text-white">${product.price}</span>
                          {product.priceAfterDiscount && (
                            <span className="text-sm text-gray-400 line-through">
                              ${product.priceAfterDiscount}
                            </span>
                          )}
                        </div>
                        <span className="text-sm text-gray-400">
                          {product.quantity} in stock
                        </span>
                      </div>

                      <div className="absolute bottom-0 left-0 right-0 transform translate-y-full group-hover:translate-y-0 transition-transform duration-300 w-full">
                        <button 
                          onClick={(event) => handleAddToCart(product._id, event)}
                          className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 px-4 rounded-lg flex items-center justify-center gap-2 transition-colors duration-300 shadow-lg"
                        >
                          <FaShoppingCart className="w-4 h-4" />
                          Add to Cart
                        </button>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </>
        ) : (
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="text-center py-12 w-full"
          >
            <div className="bg-gray-800 rounded-2xl shadow-lg p-8 max-w-md mx-auto">
              <div className="text-gray-400 text-4xl mb-4">🔍</div>
              <p className="text-gray-300 text-lg mb-2">No matching products found</p>
              <p className="text-gray-400">Try adjusting your search criteria</p>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default Home;

