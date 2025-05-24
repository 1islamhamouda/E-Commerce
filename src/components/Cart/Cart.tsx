import { useEffect, useState } from "react";
import { useCart } from "../../context/CartContext/AddProvider";
import toast from 'react-hot-toast';

interface CartItem {
  product: {
    id: string;
    title: string;
    imageCover: string;
    price: number;
  };
  count: number;
}

interface CartResponse {
  status: string;
  data: {
    products: CartItem[];
    totalCartPrice: number;
  };
}

const Cart = () => {
  const { getCart, updateCartItem, removeCartItem, clearCart } = useCart();
  const [cartItems, setCartItems] = useState<CartResponse['data']>({ products: [], totalCartPrice: 0 });
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  const getCartItems = async () => {
    try {
      setIsLoading(true);
      const response = await getCart();
      if (response?.status === 'success') {
        setCartItems(response.data);
      }
    } catch (error) {
      console.error("Error fetching cart items:", error);
      toast.error("Failed to load cart items");
    } finally {
      setIsLoading(false);
    }
  }

  const handleUpdateQuantity = async (productId: string, count: number) => {
    try {
      setIsLoading(true);
      await updateCartItem(productId, count);
      toast.success("Cart updated successfully");
      getCartItems();
    } catch (error) {
      console.error("Error updating cart:", error);
      toast.error("Failed to update cart");
    } finally {
      setIsLoading(false);
    }
  }

  const handleRemoveItem = async (productId: string) => {
    try {
      setIsLoading(true);
      await removeCartItem(productId);
      toast.success("Item removed from cart");
      getCartItems();
    } catch (error) {
      console.error("Error removing item:", error);
      toast.error("Failed to remove item");
    } finally {
      setIsLoading(false);
    }
  }

  const handleClearCart = async () => {
    try {
      setIsLoading(true);
      await clearCart();
      toast.success("Cart cleared successfully");
      getCartItems();
    } catch (error) {
      console.error("Error clearing cart:", error);
      toast.error("Failed to clear cart");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    getCartItems();
  }, [refreshTrigger]);

  useEffect(() => {
    const handleStorageChange = () => {
      setRefreshTrigger(prev => prev + 1);
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8 text-center">Shopping Cart</h1>
      
      {/* {!cartItems?.products || cartItems?.products?.length === 0 ? (
        <div className="text-center text-gray-500">Your cart is empty</div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {cartItems?.products?.map((item) => (
              <div key={item?.product.id} className="bg-white rounded-lg shadow-md p-6">
                <div className="aspect-w-1 aspect-h-1 w-full overflow-hidden rounded-lg">
                  <img 
                    src={item?.product?.imageCover} 
                    alt={item?.product?.title}
                    className="w-full h-48 object-cover"
                  />
                </div>
                <div className="mt-4">
                  <h2 className="text-xl font-semibold text-gray-800">{item?.product?.title}</h2>
                  <div className="mt-4 flex flex-col gap-4">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Quantity:</span>
                      <div className="flex items-center gap-2">
                        <button 
                          onClick={() => handleUpdateQuantity(item?.product?.id, item?.count - 1)}
                          className="px-2 py-1 bg-gray-200 rounded hover:bg-gray-300"
                          disabled={item?.count <= 1}
                        >
                          -
                        </button>
                        <span className="w-8 text-center">{item?.count}</span>
                        <button 
                          onClick={() => handleUpdateQuantity(item?.product?.id, item?.count + 1)}
                          className="px-2 py-1 bg-gray-200 rounded hover:bg-gray-300"
                        >
                          +
                        </button>
                      </div>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-lg font-bold text-gray-900">
                          ${((item?.product?.price || 0) * item?.count).toFixed(2)}
                      </span>
                      <button 
                        onClick={() => handleRemoveItem(item?.product?.id)}
                        className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          <div className="mt-8 p-6 bg-gray-50 rounded-lg">
            <div className="flex justify-between items-center">
              <span className="text-xl font-semibold">Total:</span>
              <span className="text-2xl font-bold text-gray-900">
                ${(cartItems.totalCartPrice || 0).toFixed(2)}
              </span>
            </div>
          </div>
        </>
      )} */}

      {/* ================================ */}
      <h3 className="text-2xl font-bold mb-8 ">Total Price: ${cartItems.totalCartPrice}</h3>

<div className="relative overflow-x-auto shadow-md sm:rounded-lg">
  <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
    <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
      <tr>
        <th scope="col" className="px-16 py-3">
          <span className="sr-only">Image</span>
        </th>
        <th scope="col" className="px-6 py-3">
          Product
        </th>
        <th scope="col" className="px-6 py-3">
          Qty
        </th>
        <th scope="col" className="px-6 py-3">
          Price
        </th>
        <th scope="col" className="px-6 py-3">
          Action
        </th>
      </tr>
    </thead>
    <tbody>
      {cartItems?.products?.map((item) => (
        <tr key={item?.product.id} className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 border-gray-200 hover:bg-gray-50 dark:hover:bg-gray-600">
          <td className="p-4">
            <img src={item?.product?.imageCover} alt={item?.product?.title} className="w-16 md:w-32 max-w-full max-h-full" />
          </td>
          <td className="px-6 py-4 font-semibold text-gray-900 dark:text-white">
            {item?.product?.title}
          </td>
          <td className="px-6 py-4">
            <div className="flex items-center">
              <button 
                onClick={() => handleUpdateQuantity(item?.product?.id, item?.count - 1)}
                className="inline-flex items-center justify-center p-1 me-3 text-sm font-medium h-6 w-6 text-gray-500 bg-white border border-gray-300 rounded-full focus:outline-none hover:bg-gray-100 focus:ring-4 focus:ring-gray-200 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:bg-gray-700 dark:hover:border-gray-600 dark:focus:ring-gray-700" 
                type="button"
                disabled={item?.count <= 1 || isLoading}
              >
                <span className="sr-only">Quantity button</span>
                <svg className="w-3 h-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 18 2">
                  <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M1 1h16" />
                </svg>
              </button>
              <div>
                <input type="number" value={item?.count} readOnly className="bg-gray-50 w-14 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block px-2.5 py-1 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" />
              </div>
              <button 
                onClick={() => handleUpdateQuantity(item?.product?.id, item?.count + 1)}
                className="inline-flex items-center justify-center h-6 w-6 p-1 ms-3 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-full focus:outline-none hover:bg-gray-100 focus:ring-4 focus:ring-gray-200 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:bg-gray-700 dark:hover:border-gray-600 dark:focus:ring-gray-700" 
                type="button"
                disabled={isLoading}
              >
                <span className="sr-only">Quantity button</span>
                <svg className="w-3 h-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 18 18">
                  <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 1v16M1 9h16" />
                </svg>
              </button>
            </div>
          </td>
          <td className="px-6 py-4 font-semibold text-gray-900 dark:text-white">
            ${((item?.product?.price || 0) * item?.count).toFixed(2)}
          </td>
          <td className="px-6 py-4">
            <button 
              onClick={() => handleRemoveItem(item?.product?.id)}
              className="font-medium text-red-600 dark:text-red-500 hover:underline"
              disabled={isLoading}
            >
              Remove
            </button>
          </td>
          
        </tr>
      ))}
      <tr>
        <td colSpan={5} className="text-right p-4">
          {cartItems?.products?.length > 0 && (
            <button 
              className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 disabled:opacity-50" 
              onClick={handleClearCart}
              disabled={isLoading}
            >
              {isLoading ? 'Clearing...' : 'Clear Cart'}
            </button>
          )}
        </td>
      </tr>
    </tbody>
  </table>
</div>


    </div>
  );
}

export default Cart
