import React, { createContext, useContext } from "react";
import axios from "axios";

interface ProductInCart {
  count: number;
  _id: string;
  product: { // Assuming product details are nested
    _id: string;
    title: string;
    imageCover: string;
    price: number;
  };
  price: number; // Price of one unit of this product in the cart
}

interface CartDetails {
  _id: string; // Add cart ID here
  products: ProductInCart[];
  totalCartPrice: number;
  // Add other cart details if necessary
}

interface CartContextType {
  addToCart: (productId: string) => Promise<any>; // Return response data
  getCart: () => Promise<CartDetails | null>; // Return CartDetails or null
  updateCartItem: (productId: string, count: number) => Promise<any>; // Return response data
  removeCartItem: (productId: string) => Promise<any>; // Return response data
  clearCart: () => Promise<any>; // Return response data
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const getToken = () => {
    const token = localStorage.getItem("tokenn");
    if (!token) return null;
    // API seems to expect raw token string
    return token;
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
        // Trigger storage event to refresh cart in other components
        window.dispatchEvent(new Event('storage'));
        return response.data;
      } else {
        throw new Error(response.data.message || "Failed to add item to cart");
      }
    } catch (error: any) {
      console.error("Error adding product:", error);
      throw error.response?.data?.message || error;
    }
  };

  const getCart = async (): Promise<CartDetails | null> => {
    try {
      const token = getToken();
      if (!token) {
        console.warn("No authentication token found. Cannot fetch cart.");
        return null; // Return null if no token
      }
      const response = await axios.get("https://ecommerce.routemisr.com/api/v1/cart", {
        headers: { token },
      });

      // Assuming the API response structure includes a 'data' object
      // and the cart details (including _id, products, totalCartPrice) are directly within data
      if (response.data && response.data.data) {
           return response.data.data as CartDetails; // Cast to CartDetails
      }

      // If response structure is unexpected
      console.error("Unexpected API response structure for getCart:", response);
      return null; 

    } catch (error: any) {
      // Handle specific error codes if needed, e.g., 404 for empty cart
      if (axios.isAxiosError(error) && error.response?.status === 404) {
           console.log("Cart is empty or not found for this user.");
           // API returns a specific structure for empty/not found cart
           return { _id: 'empty', products: [], totalCartPrice: 0 }; // Indicate empty cart with a placeholder ID
      }
      console.error("Error fetching cart items:", error);
      throw error.response?.data?.message || error; // Re-throw other errors
    }
  };

  const updateCartItem = async (productId: string, count: number): Promise<any> => {
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
        throw new Error(response.data.message || "Failed to update cart item");
      }
    } catch (error: any) {
      console.error("Error updating cart item:", error);
      throw error.response?.data?.message || error;
    }
  };

  const removeCartItem = async (productId: string): Promise<any> => {
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
        throw new Error(response.data.message || "Failed to remove cart item");
      }
    } catch (error: any) {
      console.error("Error removing cart item:", error);
      throw error.response?.data?.message || error;
    }
  };

  const clearCart = async (): Promise<any> => {
    try {
      const token = getToken();
      if (!token) {
        throw new Error("No authentication token found");
      }
      const response = await axios.delete("https://ecommerce.routemisr.com/api/v1/cart", {
        headers: { token },
      });
      if (response.data.message === "success") {
         window.dispatchEvent(new Event('storage'));
      }
      return response?.data;
    } catch (error: any) {
      console.error("Error clearing cart:", error);
       throw error.response?.data?.message || error;
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
