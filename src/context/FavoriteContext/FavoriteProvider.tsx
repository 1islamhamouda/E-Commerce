import React, { createContext, useContext } from "react";
import axios from "axios";
import toast from 'react-hot-toast';

interface FavoriteContextType {
  addToFavorite: (productId: string) => Promise<void>;
  removeFromFavorite: (productId: string) => Promise<void>;
  getFavorites: () => Promise<any[]>;
}

const FavoriteContext = createContext<FavoriteContextType | undefined>(undefined);

export const FavoriteProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const getToken = () => {
    const token = localStorage.getItem("tokenn");
    if (!token) return null;
    try {
      return JSON.parse(token);
    } catch {
      return token;
    }
  };

  const addToFavorite = async (productId: string) => {
    try {
      const token = getToken();
      if (!token) {
        throw new Error("No authentication token found");
      }

      const response = await axios.post(
        "https://ecommerce.routemisr.com/api/v1/wishlist",
        { productId },
        { headers: { token } }
      );

      if (response.data.status === "success") {
        return response.data;
      } else {
        throw new Error("Failed to add item to favorites");
      }
    } catch (error) {
      console.error("Error adding to favorites:", error);
      throw error;
    }
  };

  const removeFromFavorite = async (productId: string) => {
    try {
      const token = getToken();
      if (!token) {
        throw new Error("No authentication token found");
      }

      const response = await axios.delete(
        `https://ecommerce.routemisr.com/api/v1/wishlist/${productId}`,
        { headers: { token } }
      );

      if (response.data.status === "success") {
        return response.data;
      } else {
        throw new Error("Failed to remove item from favorites");
      }
    } catch (error) {
      console.error("Error removing from favorites:", error);
      throw error;
    }
  };

  const getFavorites = async () => {
    try {
      const token = getToken();
      if (!token) {
        throw new Error("No authentication token found");
      }

      const response = await axios.get(
        "https://ecommerce.routemisr.com/api/v1/wishlist",
        { headers: { token } }
      );

      if (response.data.status === "success") {
        return response.data.data;
      } else {
        throw new Error("Failed to fetch favorites");
      }
    } catch (error) {
      console.error("Error fetching favorites:", error);
      throw error;
    }
  };

  return (
    <FavoriteContext.Provider value={{ addToFavorite, removeFromFavorite, getFavorites }}>
      {children}
    </FavoriteContext.Provider>
  );
};

export const useFavorite = () => {
  const context = useContext(FavoriteContext);
  if (!context) throw new Error("useFavorite must be used within a FavoriteProvider");
  return context;
}; 