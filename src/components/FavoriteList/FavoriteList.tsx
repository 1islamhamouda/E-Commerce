import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Alert } from "flowbite-react";
import toast from 'react-hot-toast';
import { useFavorite } from '../../context/FavoriteContext/FavoriteProvider';
import { removeFromWishlist, getWishlistFromAPI } from './wishApi';
import { motion } from 'framer-motion';
import { FaSpinner, FaHeart, FaShoppingBag } from 'react-icons/fa';


// interface Product {
//   _id: string;
//   title: string;
//   imageCover: string;
//   price: number;
//   category: {
//     name: string;
//   };
// }

const FavoriteList: React.FC = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const token = localStorage.getItem("token");
  const { wishlist = [], refreshWishlist } = useFavorite();

  useEffect(() => {
    const fetchWishlist = async () => {
      if (token) {
        try {
          setIsLoading(true);
          await getWishlistFromAPI();
          refreshWishlist();
        } catch (error) {
          console.error('Error fetching wishlist:', error);
          toast.error('Failed to load wishlist', {
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
        } finally {
          setIsLoading(false);
        }
      }
    };

    fetchWishlist();
  }, [token, refreshWishlist]);

  if (!token) {
    return (
      <div className="min-h-[calc(100vh-4rem)] flex flex-col items-center justify-center bg-gray-900">
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="text-center"
        >
          <Alert color="warning" className="w-full mb-6 bg-yellow-500/10 border-yellow-500/20">
            <span className="text-yellow-400">Please login to view your wishlist</span>
          </Alert>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors shadow-lg"
          >
            <Link to="/login">Login</Link>
          </motion.button>
        </motion.div>
      </div>
    );
  }

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
          Loading your wishlist...
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
    <div className="min-h-[calc(100vh-4rem)] bg-gray-900 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <motion.div 
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <h1 className="text-3xl sm:text-4xl font-bold mb-4 bg-gradient-to-r from-pink-400 to-red-500 bg-clip-text text-transparent">
            Your Wishlist ❤️
          </h1>
          <p className="text-gray-400 max-w-2xl mx-auto">
            Your collection of favorite products, ready for you to explore.
          </p>
        </motion.div>

        {wishlist?.length > 0 ? (
          <motion.div 
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6"
          >
            {wishlist.map((product) => (
              <motion.div
                key={product._id}
                variants={itemVariants}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="group"
              >
                <div className="bg-gray-800 rounded-xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-700 hover:border-pink-500">
                  <div className="relative">
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={async () => {
                        const toastId = toast.loading('Removing from favorites...');
                        try {
                          const success = await removeFromWishlist(product._id);
                          if (success) {
                            refreshWishlist();
                            toast.success('Removed from favorites ❤️', {
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
                          }
                        } catch (error) {
                          toast.error('Failed to remove from favorites', {
                            id: toastId,
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
                      }}
                      className="absolute top-2 right-2 z-10 bg-gray-800/80 backdrop-blur-sm rounded-full p-2 shadow-lg hover:bg-red-500/20 transition-colors"
                    >
                      <FaHeart className="w-5 h-5 text-red-500" />
                    </motion.button>
                    <Link to={`/ProductDetails/${product._id}/${product.category.name}`}>
                      <div className="relative aspect-square overflow-hidden bg-gray-700">
                        <motion.img 
                          src={product.imageCover} 
                          alt={product.title} 
                          className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500"
                          loading="lazy"
                          whileHover={{ rotate: [0, -5, 5, -5, 0] }}
                          transition={{ duration: 0.5 }}
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-gray-900/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                      </div>
                    </Link>
                  </div>

                  <div className="p-4 relative">
                    <Link to={`/ProductDetails/${product._id}/${product.category.name}`}>
                      <h3 className="text-lg font-semibold text-white mb-2 line-clamp-2">
                        {product.title}
                      </h3>
                    </Link>
                    
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-sm text-pink-400 bg-pink-900/30 px-2 py-1 rounded-full">
                        {product.category.name}
                      </span>
                      <span className="text-xl font-bold text-white">${product.price}</span>
                    </div>

                    <div className="absolute bottom-0 left-0 right-0 transform translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                      <button 
                        onClick={() => navigate(`/ProductDetails/${product._id}/${product.category.name}`)}
                        className="w-full bg-pink-600 hover:bg-pink-700 text-white py-3 px-4 rounded-lg flex items-center justify-center gap-2 transition-colors duration-300 shadow-lg"
                      >
                        <FaShoppingBag className="w-4 h-4" />
                        View Details
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        ) : (
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="text-center py-12"
          >
            <div className="bg-gray-800 rounded-2xl shadow-lg p-8 max-w-md mx-auto">
              <div className="text-pink-500 text-4xl mb-4">❤️</div>
              <p className="text-gray-300 text-lg mb-2">Your wishlist is empty</p>
              <p className="text-gray-400 mb-6">Start adding your favorite products</p>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-pink-600 hover:bg-pink-700 text-white px-6 py-3 rounded-lg transition-colors shadow-lg"
              >
                <Link to="/products">Browse Products</Link>
              </motion.button>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default FavoriteList; 