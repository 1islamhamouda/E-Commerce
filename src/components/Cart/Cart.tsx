import { useEffect, useState } from "react";
import { useCart } from "../../context/CartContext/AddProvider";
import toast, { Toaster } from 'react-hot-toast';
import { FaTrash, FaShoppingCart } from 'react-icons/fa';
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { motion } from 'framer-motion';
import { FaSpinner, FaShoppingBag } from 'react-icons/fa';
import { MdError } from 'react-icons/md';

interface Product {
  _id: string;
  title: string;
  imageCover: string;
  price: number;
}

interface CartItem {
  count: number;
  _id: string;
  product: Product;
  price: number;
}

interface CartData {
  _id: string; // Cart ID
  products: CartItem[];
  totalCartPrice: number;
}

const Cart = () => {
  const { getCart, updateCartItem, removeCartItem, clearCart } = useCart();
  const [cartData, setCartData] = useState<CartData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const fetchCartData = async () => {
    if (!token) {
      setError('Please login to view your cart');
      setIsLoading(false);
      toast.error('Please login to view your cart');
      navigate('/login');
      return;
    }

    try {
      setIsLoading(true);
      // Use the getCart function from the context
      const response = await getCart(); // response is now CartDetails | null
      
      if (response && response.products.length > 0) {
        setCartData(response);
      } else if (response?._id) { // Handle empty cart case with a valid cart ID
        setCartData({ _id: response._id, products: [], totalCartPrice: 0 });
      } else { // Handle case where getCart returned null (no token or other issue)
         setCartData(null); // Explicitly set to null
         // Error is already handled by getCart context function if API failed
      }
      // Clear any previous error state if data is fetched successfully
      setError(null);

    } catch (err: any) {
      console.error("Error fetching cart items:", err);
      // Errors from getCart are already thrown and handled by react-hot-toast
      // We can set local error state if needed, but toast is primary feedback
      setError('Failed to load cart. Please try again.'); // Set a generic error message
      setCartData(null); // Clear cart data on fetch error
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdateQuantity = async (productId: string, count: number) => {
    if (count < 1) return; // Prevent setting quantity below 1

    const toastId = toast.loading('Updating quantity...', {
        style: {
            background: '#333',
            color: '#fff',
            borderRadius: '10px',
        },
    });

    try {
      // Use the updateCartItem function from the context
      await updateCartItem(productId, count);
      toast.success('Quantity updated', {
          id: toastId,
          style: {
              background: '#333',
              color: '#fff',
              borderRadius: '10px',
          },
      });
      fetchCartData(); // Re-fetch cart data to update display
    } catch (err: any) {
      console.error("Error updating cart:", err);
      toast.error(err.response?.data?.message || 'Failed to update quantity', {
          id: toastId,
          style: {
              background: '#333',
              color: '#fff',
              borderRadius: '10px',
          },
      });
    }
  };

  const handleRemoveItem = async (productId: string) => {
    const toastId = toast.loading('Removing item...', {
        style: {
            background: '#333',
            color: '#fff',
            borderRadius: '10px',
        },
    });

    try {
      // Use the removeCartItem function from the context
      await removeCartItem(productId);
      toast.success('Item removed from cart', {
          id: toastId,
          style: {
              background: '#333',
              color: '#fff',
              borderRadius: '10px',
          },
      });
      fetchCartData(); // Re-fetch cart data to update display
    } catch (err: any) {
      console.error("Error removing item:", err);
      toast.error(err.response?.data?.message || 'Failed to remove item', {
          id: toastId,
          style: {
              background: '#333',
              color: '#fff',
              borderRadius: '10px',
          },
      });
    }
  };

  const handleClearCart = async () => {
    const toastId = toast.loading('Clearing cart...', {
        style: {
            background: '#333',
            color: '#fff',
            borderRadius: '10px',
        },
    });

    try {
      // Use the clearCart function from the context
      await clearCart();
      toast.success('Cart cleared successfully', {
          id: toastId,
          style: {
              background: '#333',
              color: '#fff',
              borderRadius: '10px',
          },
      });
      // Set cart to empty after clearing locally for faster UI update
      setCartData({ _id: cartData?._id || 'empty', products: [], totalCartPrice: 0 });
    } catch (err: any) {
      console.error("Error clearing cart:", err);
      toast.error(err.response?.data?.message || 'Failed to clear cart', {
          id: toastId,
          style: {
              background: '#333',
              color: '#fff',
              borderRadius: '10px',
          },
      });
    }
  };

  // Add state and handlers for shipping address
  const [shippingAddress, setShippingAddress] = useState({
      details: '',
      phone: '',
      city: '',
  });

  const handleShippingChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      setShippingAddress({ ...shippingAddress, [e.target.name]: e.target.value });
  };

  const handleCheckout = async () => {
      if (!cartData?._id || cartData?.products.length === 0) {
          toast.error('Your cart is empty!', {
              style: {
                  background: '#f44336',
                  color: '#fff',
                  borderRadius: '10px',
              },
          });
          return;
      }

      if (!shippingAddress.details || !shippingAddress.phone || !shippingAddress.city) {
          toast.error('Please provide shipping address details!', {
              style: {
                  background: '#f44336',
                  color: '#fff',
                  borderRadius: '10px',
              },
          });
          return;
      }

      const toastId = toast.loading('Initiating checkout...', {
          style: {
              background: '#333',
              color: '#fff',
              borderRadius: '10px',
          },
      });

      try {
          const response = await axios.post(
              `https://ecommerce.routemisr.com/api/v1/orders/checkout-session/${cartData._id}?url=http://localhost:3000`,
              { shippingAddress },
              {
                  headers: { token },
              }
          );

          if (response?.data?.status === 'success') {
              toast.success('Checkout session created!', {
                  id: toastId,
                  style: {
                      background: '#4CAF50',
                      color: '#fff',
                      borderRadius: '10px',
                  },
              });
              // Redirect user to payment page
              if (response.data.session?.url) {
                window.location.href = response.data.session.url;
              }
          } else {
               toast.error(response?.data?.message || 'Failed to create checkout session', {
                  id: toastId,
                  style: {
                      background: '#f44336',
                      color: '#fff',
                      borderRadius: '10px',
                  },
              });
          }

      } catch (err: any) {
          console.error('Error initiating checkout:', err);
          toast.error(err.response?.data?.message || 'Failed to initiate checkout', {
              id: toastId,
              style: {
                  background: '#f44336',
                  color: '#fff',
                  borderRadius: '10px',
              },
          });
      }
  };

  useEffect(() => {
    fetchCartData();
  }, [token, navigate, getCart]); // Add getCart to dependencies

  // Consider adding a storage event listener if cart changes in other tabs
  useEffect(() => {
    const handleStorageChange = () => {
       fetchCartData(); // Re-fetch cart data when storage changes
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []); // Empty dependency array to add listener once


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
          Loading your cart...
        </motion.p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-[calc(100vh-4rem)] flex flex-col items-center justify-center bg-gray-900 text-red-500">
        <MdError className="w-12 h-12 mb-4" />
        <p className="text-xl font-semibold mb-2">Error loading cart</p>
        <p className="text-gray-400 text-center">{error}</p>
      </div>
    );
  }

  if (!cartData?.products || cartData?.products.length === 0) {
    return (
      <div className="min-h-[calc(100vh-4rem)] flex flex-col items-center justify-center p-4 bg-gray-900">
        <FaShoppingCart className="text-5xl sm:text-6xl text-gray-600 mb-4" />
        <h2 className="text-xl sm:text-2xl font-bold text-gray-200 mb-2 text-center">Your cart is empty</h2>
        <p className="text-sm sm:text-base text-gray-400 text-center max-w-md px-4">Looks like you haven't added any items to your cart yet.</p>
        <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate('/products')}
            className="mt-6 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg transition-colors shadow-lg"
          >
            Browse Products
          </motion.button>
      </div>
    );
  }

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
            Your Shopping Cart
          </h1>
        </motion.div>

        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="space-y-6"
        >
          {/* Cart Items List */}
          {cartData?.products?.map((item) => (
            <div key={item._id} className="bg-gray-800 rounded-xl p-6 shadow-lg">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <img 
                    src={item.product.imageCover} 
                    alt={item.product.title} 
                    className="w-20 h-20 object-cover rounded-lg"
                  />
                  <div>
                    <h3 className="text-lg font-semibold text-white">{item.product.title}</h3>
                    {/* Display item price */} {/* item.price is the price of ONE unit */}
                    <p className="text-gray-400">Price: ${item.price.toFixed(2)}</p>
                    {/* Display total price for this item */} {/* item.price * item.count */}
                    <p className="text-gray-400">Total: ${(item.price * item.count).toFixed(2)}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => handleUpdateQuantity(item.product._id, item.count - 1)}
                      disabled={item.count <= 1}
                      className="px-3 py-1 bg-gray-700 text-white rounded-lg hover:bg-gray-600 disabled:opacity-50"
                    >
                      -
                    </button>
                    <span className="text-white">{item.count}</span>
                    <button
                      onClick={() => handleUpdateQuantity(item.product._id, item.count + 1)}
                      className="px-3 py-1 bg-gray-700 text-white rounded-lg hover:bg-gray-600"
                    >
                      +
                    </button>
                  </div>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => handleRemoveItem(item.product._id)}
                    className="p-2 text-red-500 hover:bg-red-500/10 rounded-lg transition-colors"
                  >
                    <FaTrash />
                  </motion.button>
                </div>
              </div>
            </div>
          ))}

          {/* Shipping Address Form */}
          <div className="bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-700 mt-8">
              <h2 className="text-xl font-semibold text-white mb-4">Shipping Address</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                      <label className="block text-gray-300 text-sm mb-2" htmlFor="details">Details</label>
                      <input 
                          type="text" 
                          id="details" 
                          name="details"
                          value={shippingAddress.details}
                          onChange={handleShippingChange}
                          className="w-full px-3 py-2 bg-gray-700 text-white rounded-lg border border-gray-600 focus:outline-none focus:border-blue-500"
                          required
                      />
                  </div>
                  <div>
                      <label className="block text-gray-300 text-sm mb-2" htmlFor="phone">Phone</label>
                      <input 
                          type="tel" 
                          id="phone" 
                          name="phone"
                          value={shippingAddress.phone}
                          onChange={handleShippingChange}
                          className="w-full px-3 py-2 bg-gray-700 text-white rounded-lg border border-gray-600 focus:outline-none focus:border-blue-500"
                          required
                      />
                  </div>
                  <div>
                      <label className="block text-gray-300 text-sm mb-2" htmlFor="city">City</label>
                      <input 
                          type="text" 
                          id="city" 
                          name="city"
                          value={shippingAddress.city}
                          onChange={handleShippingChange}
                          className="w-full px-3 py-2 bg-gray-700 text-white rounded-lg border border-gray-600 focus:outline-none focus:border-blue-500"
                          required
                      />
                  </div>
              </div>
          </div>

          {/* Cart Summary and Checkout Button */}
          <div className="flex flex-col md:flex-row justify-between items-center mt-8 p-6 bg-gray-800 rounded-xl shadow-lg border border-gray-700">
              <div className="text-xl font-bold text-white mb-4 md:mb-0">
                Total: <span className="text-green-400">${cartData?.totalCartPrice?.toFixed(2) || '0.00'}</span>
              </div>
              <div className="flex flex-col md:flex-row gap-4">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleClearCart}
                  className="px-6 py-3 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors w-full md:w-auto"
                >
                  Clear Cart
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleCheckout}
                  className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors flex items-center justify-center space-x-2 w-full md:w-auto"
                >
                  <FaShoppingBag />
                  <span>Proceed to Payment</span>
                </motion.button>
              </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Cart;
