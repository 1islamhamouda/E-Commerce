import { useEffect, useState } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import { FaSpinner, FaMapMarkerAlt, FaPhoneAlt } from 'react-icons/fa';
import { MdError } from 'react-icons/md';
import toast, { Toaster } from 'react-hot-toast';

interface Product {
  _id: string; // Added _id based on API response
  imageCover: string;
  title: string;
  price: number; // Base price of the product
}

interface CartItem {
  count: number;
  _id: string; // Added _id based on API response
  product: Product; // Nested product object
  price: number; // Price per unit in this specific order item
}

interface ShippingAddress {
  details: string;
  phone: string;
  city: string;
}

interface Order {
  _id: string;
  totalOrderPrice: number;
  shippingAddress: ShippingAddress;
  cartItems?: CartItem[]; // Made optional as it might be missing or empty
  createdAt: string;
  // Add other fields from API response if needed, e.g., paymentMethodType, isPaid, isDelivered
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { 
    opacity: 1, 
    transition: { 
      staggerChildren: 0.1 // Stagger animation for children
    }
  }
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: { y: 0, opacity: 1 }
};

const Orders = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  // const userContext = useContext(User);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          throw new Error('Please log in to view your orders.');
        }

        const { data } = await axios.get<Order[]>(
          'https://ecommerce.routemisr.com/api/v1/orders/user/me',
          { headers: { token } }
        );
        
        setOrders(data);
        setError(null);
      } catch (err: any) {
        const errorMessage = err.response?.data?.message || err.message || 'Failed to fetch orders';
        setError(errorMessage);
        toast.error(errorMessage);
        setOrders([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchOrders();
  }, []);

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
          Loading orders...
        </motion.p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-[calc(100vh-4rem)] flex flex-col items-center justify-center bg-gray-900 text-red-500">
        <MdError className="w-12 h-12 mb-4" />
        <p className="text-xl font-semibold mb-2">Error loading orders</p>
        <p className="text-gray-400 text-center">{error}</p>
      </div>
    );
  }

  if (!orders.length) {
    return (
      <div className="min-h-[calc(100vh-4rem)] flex flex-col items-center justify-center bg-gray-900 text-gray-300">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <p className="text-2xl font-bold mb-4">No Orders Found</p>
        </motion.div>
        <motion.p 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="text-gray-400 text-lg"
        >
          You haven't placed any orders yet.
        </motion.p>
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-gray-900 py-8 px-4 sm:px-6 lg:px-8">
      <Toaster position="top-center" />
      <div className="max-w-7xl mx-auto">
        <motion.h1 
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="text-3xl sm:text-4xl font-bold text-center mb-12 bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent"
        >
          Your Orders
        </motion.h1>

        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="space-y-8"
        >
          {orders.map(order => (
            <motion.div
              key={order._id}
              variants={itemVariants} // Apply item animation variants
              className="bg-gray-800 rounded-xl p-8 shadow-xl border border-gray-700"
            >
              {/* Order Header: ID and Total */}
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center pb-4 border-b border-gray-700 mb-6">
                <div className="mb-4 md:mb-0">
                  <h2 className="text-lg font-semibold text-gray-300">Order ID: <span className="text-blue-400 break-all font-normal text-base md:text-lg">{order._id}</span></h2>
                  <p className="text-gray-400 text-sm">Order Date: {new Date(order.createdAt).toLocaleDateString()}</p>
                </div>
                <div className="text-left md:text-right">
                  <p className="text-2xl font-bold text-green-400">Total: ${order.totalOrderPrice.toFixed(2)}</p>
                   {/* Optional: Display payment method or status */}
                   {/* <p className="text-gray-400 text-sm">Payment: {order.paymentMethodType}</p> */}
                   {/* <p className={`text-sm font-semibold ${order.isDelivered ? 'text-green-500' : 'text-yellow-500'}`}>Status: {order.isDelivered ? 'Delivered' : 'Pending'}</p> */}
                </div>
              </div>

              {/* Shipping Address */}
              <div className="pb-4 border-b border-gray-700 mb-6">
                <h3 className="text-lg font-semibold text-gray-300 mb-3">Shipping Address:</h3>
                <div className="space-y-2 text-gray-400 text-sm p-4 bg-gray-700 rounded-lg">
                  <p className="flex items-center"><FaMapMarkerAlt className="mr-2 text-blue-400" />{order.shippingAddress?.details}, {order.shippingAddress?.city}</p>
                  <p className="flex items-center"><FaPhoneAlt className="mr-2 text-blue-400" />{order.shippingAddress?.phone}</p>
                </div>
              </div>

              {/* Order Items */}
              <div className="pt-4">
                <h3 className="text-lg font-semibold text-gray-300 mb-4">Items:</h3>
                 {/* Check if cartItems is an array before mapping */}
                {order.cartItems && Array.isArray(order.cartItems) && order.cartItems.length > 0 ? ( 
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 p-4 bg-gray-700 rounded-lg">
                  {order.cartItems.map(item => (
                    <motion.div 
                      key={item._id} 
                      variants={itemVariants} // Apply item animation variants
                      className="flex items-center space-x-4 bg-gray-600 rounded-lg p-4 shadow border border-gray-500"
                      whileHover={{ scale: 1.03, backgroundColor: '#4b5563' }} // Subtle hover effect
                      transition={{ duration: 0.2 }}
                    >
                      <img 
                        src={item.product?.imageCover} 
                        alt={item.product?.title} 
                        className="w-16 h-16 object-cover rounded-md flex-shrink-0 border border-gray-500"
                      />
                      <div className="flex-grow">
                        <p className="text-white font-semibold text-sm line-clamp-2">{item.product?.title}</p>
                        <p className="text-gray-300 text-xs mt-1">Quantity: {item.count}</p>
                         {/* Display item total price */}
                        <p className="text-blue-300 font-bold text-sm mt-1">${(item.price * item.count).toFixed(2)}</p>
                      </div>
                    </motion.div>
                  ))}
                </div>
                ) : (
                    <p className="text-gray-400 text-sm">No items in this order.</p>
                )}
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </div>
  );
};

export default Orders; 