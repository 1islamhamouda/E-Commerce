import { useQuery } from "@tanstack/react-query";
import { useParams } from "react-router-dom";
import axios from "axios";
// import { Button } from "flowbite-react";
import { Link } from "react-router-dom";
import { motion } from 'framer-motion';
import { FaSpinner, FaStar, FaShoppingCart, FaHeart } from 'react-icons/fa';
import { MdError } from 'react-icons/md';
import toast, { Toaster } from 'react-hot-toast';

export default function ProductDetails() {
    const { id } = useParams();

    // Fetch the main product details
    const getProductDetails = async (id: string) => {
        try {
            const response = await axios.get(`https://ecommerce.routemisr.com/api/v1/products/${id}`);
            return response.data.data;
        } catch (error) {
            toast.error('Failed to load product details', {
                style: {
                    background: '#333',
                    color: '#fff',
                    borderRadius: '10px',
                },
            });
            throw error;
        }
    };

    const { data: productDetails, isLoading, isError } = useQuery({
        queryKey: ["productDetails", id],
        queryFn: () => getProductDetails(id as string),
    });

    // Fetch related products based on category
    const getRelatedProducts = async (categoryName: string) => {
        try {
            const response = await axios.get(`https://ecommerce.routemisr.com/api/v1/products`);
            return response.data.data.filter((product: any) => product.category.name === categoryName);
        } catch (error) {
            toast.error('Failed to load related products', {
                style: {
                    background: '#333',
                    color: '#fff',
                    borderRadius: '10px',
                },
            });
            throw error;
        }
    };

    const { data: relatedProducts } = useQuery({
        queryKey: ["relatedProducts", productDetails?.category.name as string],
        queryFn: () => getRelatedProducts(productDetails?.category.name as string),
        enabled: !!productDetails,
    });

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
                    Loading product details...
                </motion.p>
            </div>
        );
    }

    if (isError) {
        return (
            <div className="min-h-[calc(100vh-4rem)] flex flex-col items-center justify-center bg-gray-900">
                <motion.div
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="text-center"
                >
                    <MdError className="w-16 h-16 text-red-500 mx-auto mb-4" />
                    <h2 className="text-2xl font-bold text-red-500 mb-2">Error Loading Product</h2>
                    <p className="text-gray-400 mb-4">Failed to load product details. Please try again later.</p>
                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors shadow-lg"
                        onClick={() => {
                            toast.loading('Reloading...', {
                                style: {
                                    background: '#333',
                                    color: '#fff',
                                    borderRadius: '10px',
                                },
                            });
                            window.location.reload();
                        }}
                    >
                        Retry
                    </motion.button>
                </motion.div>
            </div>
        );
    }

    const handleAddToCart = () => {
        const toastId = toast.loading('Adding to cart...', {
            style: {
                background: '#333',
                color: '#fff',
                borderRadius: '10px',
            },
        });

        // Simulate API call
        setTimeout(() => {
            toast.success('Added to cart successfully!', {
                id: toastId,
                icon: '🛒',
                style: {
                    background: '#333',
                    color: '#fff',
                    borderRadius: '10px',
                },
            });
        }, 1000);
    };

    const handleAddToFavorites = () => {
        const toastId = toast.loading('Adding to favorites...', {
            style: {
                background: '#333',
                color: '#fff',
                borderRadius: '10px',
            },
        });

        // Simulate API call
        setTimeout(() => {
            toast.success('Added to favorites!', {
                id: toastId,
                icon: '❤️',
                style: {
                    background: '#333',
                    color: '#fff',
                    borderRadius: '10px',
                },
            });
        }, 1000);
    };

    return (
        <div className="min-h-[calc(100vh-4rem)] bg-gray-900 py-8 px-4 sm:px-6 lg:px-8">
            <Toaster position="top-center" />
            <div className="max-w-7xl mx-auto">
                <motion.div 
                    initial={{ y: -20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ duration: 0.5 }}
                    className="text-center mb-12"
                >
                    <h1 className="text-3xl sm:text-4xl font-bold mb-4 bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
                        Product Details
                    </h1>
                </motion.div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
                    {/* Product Image Section */}
                    <motion.div 
                        initial={{ x: -50, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        transition={{ duration: 0.5 }}
                        className="relative group"
                    >
                        <div className="max-w-[400px] max-h-[450px] mx-auto rounded-2xl overflow-hidden bg-gray-800 shadow-xl">
                            <motion.img 
                                src={productDetails.imageCover} 
                                alt={productDetails.name} 
                                className="w-full h-full object-contain transform group-hover:scale-110 transition-transform duration-500"
                                whileHover={{ rotate: [0, -5, 5, -5, 0] }}
                                transition={{ duration: 0.5 }}
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-gray-900/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                        </div>
                    </motion.div>

                    {/* Product Details Section */}
                    <motion.div 
                        initial={{ x: 50, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        transition={{ duration: 0.5 }}
                        className="flex flex-col justify-center space-y-6"
                    >
                        <div>
                            <h2 className="text-2xl font-bold text-white mb-2">{productDetails.name}</h2>
                            <span className="inline-block px-3 py-1 bg-blue-500/20 text-blue-400 rounded-full text-sm">
                                {productDetails.category.name}
                            </span>
                        </div>

                        <p className="text-gray-400 leading-relaxed">
                            {productDetails.description}
                        </p>

                        <div className="flex items-center space-x-4">
                            <div className="flex items-center">
                                <FaStar className="text-yellow-400 w-5 h-5" />
                                <span className="ml-2 text-white font-semibold">
                                    {productDetails.ratingsAverage}
                                </span>
                            </div>
                            <div className="text-2xl font-bold text-white">
                                ${productDetails.price}
                            </div>
                        </div>

                        <div className="flex space-x-4">
                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                className="flex-1 bg-gradient-to-r from-blue-500 to-purple-500 text-white py-3 px-6 rounded-lg font-semibold hover:from-blue-600 hover:to-purple-600 transition-all duration-300 shadow-lg"
                                onClick={handleAddToCart}
                            >
                                <FaShoppingCart className="inline-block mr-2" />
                                Add to Cart
                            </motion.button>
                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                className="bg-gray-800 text-white p-3 rounded-lg hover:bg-gray-700 transition-colors shadow-lg"
                                onClick={handleAddToFavorites}
                            >
                                <FaHeart className="w-5 h-5 text-red-500" />
                            </motion.button>
                        </div>
                    </motion.div>
                </div>

                {/* Related Products Section */}
                <motion.div 
                    initial={{ y: 50, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                    className="mt-16"
                >
                    <h2 className="text-2xl font-bold text-white mb-8">Related Products</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                        {relatedProducts?.map((product: any) => (
                            <motion.div
                                key={product._id}
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                className="group"
                            >
                                <Link to={`/ProductDetails/${product._id}/${product.category.name}`}>
                                    <div className="bg-gray-800 rounded-xl shadow-lg overflow-hidden border border-gray-700 hover:border-blue-500 transition-all duration-300">
                                        <div className="relative aspect-square overflow-hidden">
                                            <motion.img 
                                                src={product.imageCover} 
                                                alt={product.name} 
                                                className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500"
                                                loading="lazy"
                                            />
                                            <div className="absolute inset-0 bg-gradient-to-t from-gray-900/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                                        </div>
                                        <div className="p-4">
                                            <h3 className="text-lg font-semibold text-white mb-2 line-clamp-2">
                                                {product.name}
                                            </h3>
                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center">
                                                    <FaStar className="text-yellow-400 w-4 h-4" />
                                                    <span className="ml-1 text-gray-400">
                                                        {product.ratingsAverage}
                                                    </span>
                                                </div>
                                                <span className="text-lg font-bold text-white">
                                                    ${product.price}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </Link>
                            </motion.div>
                        ))}
                    </div>
                </motion.div>
            </div>
        </div>
    );
}
