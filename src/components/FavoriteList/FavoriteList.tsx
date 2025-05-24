import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { getWishlistFromStorage, removeFromWishlist } from './wishApi';

interface WishlistItem {
  _id: string;
  imageCover: string;
  title: string;
  price: number;
  category: {
    name: string;
  };
}

const FavoriteList: React.FC = () => {
  const [wishlist, setWishlist] = useState<WishlistItem[]>([]);
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem("tokenn");

  // Fetch wishlist from localStorage initially, then update from API
  const fetchWishlist = async () => {
    if (!token) {
      setLoading(false);
      return;
    }

    try {
      // Fetch data from API
      const response = await axios.get("https://ecommerce.routemisr.com/api/v1/wishlist", {
        headers: { 
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      const apiWishlist = response.data.data;
      setWishlist(apiWishlist);
      // Update localStorage with the latest data from API
      localStorage.setItem("wishlist", JSON.stringify(apiWishlist));
    } catch (error) {
      console.error("Error fetching wishlist:", error);
      if (axios.isAxiosError(error) && error.response?.status === 401) {
        // Token is invalid or expired
        localStorage.removeItem('tokenn');
        window.location.href = '/login';
      } else {
         // If API fetch fails, try loading from localStorage
        try {
          const localStorageWishlist = getWishlistFromStorage();
          setWishlist(localStorageWishlist);
        } catch (localError) {
          console.error("Error loading wishlist from localStorage:", localError);
        }
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Load from localStorage first for quicker display
    setWishlist(getWishlistFromStorage());
    // Then fetch from API to get latest data
    fetchWishlist();
  }, [token]);

  const handleRemoveFromWishlist = async (productId: string) => {
    try {
      await removeFromWishlist(productId);
      // Refresh the wishlist from API after removal to ensure sync
      await fetchWishlist();
    } catch (error) {
      console.error("Error removing from wishlist:", error);
       if (axios.isAxiosError(error) && error.response?.status === 401) {
        // Token is invalid or expired
        localStorage.removeItem('tokenn');
        window.location.href = '/login';
      }
    }
  };

  if (!token) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Please login to view your wishlist</h2>
          <Link to="/login" className="text-blue-500 hover:underline">Go to Login</Link>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Your Wishlist ❤️</h1>
      {wishlist.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {wishlist.map((product) => (
            <div key={product._id} className="bg-white rounded-lg shadow-lg overflow-hidden">
              <div className="relative">
                <button
                  onClick={() => handleRemoveFromWishlist(product._id)}
                  className="absolute top-2 right-2 z-10 bg-white rounded-full p-2 shadow-md hover:bg-red-50"
                >
                  <i className="fa-solid fa-heart text-red-500"></i>
                </button>
                <Link to={`/ProductDetails/${product._id}/${product.category.name}`}>
                  <div className="relative aspect-square">
                    <img 
                      src={product.imageCover} 
                      alt={product.title} 
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="p-4">
                    <h3 className="text-lg font-semibold text-gray-800 mb-2 line-clamp-2">
                      {product.title}
                    </h3>
                    <p className="text-green-600 font-medium mb-2">{product.category.name}</p>
                    <p className="text-xl font-bold text-gray-900">${product.price}</p>
                  </div>
                </Link>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center text-gray-500">
          <p className="text-xl mb-4">No items in your wishlist yet.</p>
          <Link to="/products" className="text-blue-500 hover:underline">
            Browse Products
          </Link>
        </div>
      )}
    </div>
  );
};

export default FavoriteList;
