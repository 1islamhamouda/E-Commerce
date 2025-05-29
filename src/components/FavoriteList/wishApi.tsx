import axios from "axios";
// import toast from 'react-hot-toast';

const BASE_URL = 'https://ecommerce.routemisr.com/api/v1';

// Helper function to get token
const getToken = () => {
  const token = localStorage.getItem('tokenn');
  if (!token) {
    throw new Error('No authentication token found');
  }
  return token;
};

// Helper function to handle token expiration
const handleTokenExpiration = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('wishlist');
  window.location.href = '/login';
};

export const getWishlistFromAPI = async () => {
  try {
    const token = getToken();
    const response = await axios.get(
      `${BASE_URL}/wishlist`,
      {
        headers: {
          token,
        },
      }
    );
    if (response.data?.data) {
      saveWishlistToStorage(response.data.data);
      return response.data.data;
    }
    return [];
  } catch (error: any) {
    if (error.response?.status === 401) {
      handleTokenExpiration();
      throw new Error('Please login to view wishlist');
    }
    throw error;
  }
};

export const getWishlistFromStorage = () => {
  try {
    const wishlist = localStorage.getItem('wishlist');
    return wishlist ? JSON.parse(wishlist) : [];
  } catch (error) {
    console.error('Error getting wishlist from storage:', error);
    return [];
  }
};

export const saveWishlistToStorage = (wishlist: any[]) => {
  try {
    localStorage.setItem('wishlist', JSON.stringify(wishlist));
  } catch (error) {
    console.error('Error saving wishlist to storage:', error);
  }
};

export const addToWishlist = async (productId: string) => {
  try {
    const token = getToken();
    const response = await axios.post(
      `${BASE_URL}/wishlist`,
      { productId },
      {
        headers: {
          token,
        },
      }
    );
    if (response.data?.data) {
      const currentWishlist = getWishlistFromStorage();
      saveWishlistToStorage([...currentWishlist, response.data.data]);
      return response.data.data;
    }
    return null;
  } catch (error: any) {
    if (error.response?.status === 401) {
      handleTokenExpiration();
      throw new Error('Please login to add items to wishlist');
    }
    throw error;
  }
};

export const removeFromWishlist = async (productId: string) => {
  try {
    const token = getToken();
    const response = await axios.delete(
      `${BASE_URL}/wishlist/${productId}`,
      {
        headers: {
          token,
        },
      }
    );
    if (response.data?.status === 'success') {
      const currentWishlist = getWishlistFromStorage();
      saveWishlistToStorage(currentWishlist.filter((item: any) => item._id !== productId));
      return true;
    }
    return false;
  } catch (error: any) {
    if (error.response?.status === 401) {
      handleTokenExpiration();
      throw new Error('Please login to remove items from wishlist');
    }
    throw error;
  }
}; 