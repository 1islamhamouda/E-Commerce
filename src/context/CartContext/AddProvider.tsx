import React, { createContext, useContext } from "react";
import axios from "axios";

interface CartContextType {
  addToCart: (productId: string) => Promise<void>;
  getCart: () => Promise<{ status: string; data: { products: any[]; totalCartPrice: number } }>;
  updateCartItem: (productId: string, count: number) => Promise<void>;
  removeCartItem: (productId: string) => Promise<void>;
  clearCart: () => Promise<any>;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const getToken = () => {
    const token = localStorage.getItem("tokenn");
    if (!token) return null;
    try {
      return JSON.parse(token);
    } catch {
      return token; // Return raw token if parsing fails
    }
  };

  const addToCart = async (productId: string) => {
    try {
      const token = getToken();
      if (!token) {
        throw new Error("No authentication token found");
      }

      const response = await axios.post(
        "https://ecommerce.routemisr.com/api/v1/cart",
        { productId },
        { headers: { token } }
      );

      if (response.data.status === "success") {
        // Trigger storage event to refresh cart
        window.dispatchEvent(new Event('storage'));
        return response.data;
      } else {
        throw new Error("Failed to add item to cart");
      }
    } catch (error) {
      console.error("Error adding product:", error);
      throw error;
    }
  };

  const getCart = async () => {
    try {
      const token = getToken();
      if (!token) {
        throw new Error("No authentication token found");
      }
      const response = await axios.get("https://ecommerce.routemisr.com/api/v1/cart", {
        headers: { token },
      });
      return {
        status: response.data.status,
        data: response.data.data
      };
    } catch (error) {
      console.error("Error fetching cart items:", error);
      throw error;
    }
  };

  const updateCartItem = async (productId: string, count: number) => {
    try {
      const token = getToken();
      if (!token) {
        throw new Error("No authentication token found");
      }

      const response = await axios.put(
        `https://ecommerce.routemisr.com/api/v1/cart/${productId}`,
        { count },
        { headers: { token } }
      );

      if (response.data.status === "success") {
        window.dispatchEvent(new Event('storage'));
        return response.data;
      } else {
        throw new Error("Failed to update cart item");
      }
    } catch (error) {
      console.error("Error updating cart item:", error);
      throw error;
    }
  };

  const removeCartItem = async (productId: string) => {
    try {
      const token = getToken();
      if (!token) {
        throw new Error("No authentication token found");
      }

      const response = await axios.delete(
        `https://ecommerce.routemisr.com/api/v1/cart/${productId}`,
        { headers: { token } }
      );

      if (response.data.status === "success") {
        window.dispatchEvent(new Event('storage'));
        return response.data;
      } else {
        throw new Error("Failed to remove cart item");
      }
    } catch (error) {
      console.error("Error removing cart item:", error);
      throw error;
    }
  };

  const clearCart = async () => {
    try {
      const token = getToken();
      if (!token) {
        throw new Error("No authentication token found");
      }
      const response = await axios.delete("https://ecommerce.routemisr.com/api/v1/cart", {
        headers: { token },
      });
      return response?.data;
    } catch (error) {
      console.error("Error clearing cart:", error);
      throw error;
    }
  };
  
  return (
    <CartContext.Provider value={{ addToCart, getCart, updateCartItem, removeCartItem, clearCart }}>
      {children}
    </CartContext.Provider>
  );
};

// Custom Hook
export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) throw new Error("useCart must be used within a CartProvider");
  return context;
};
