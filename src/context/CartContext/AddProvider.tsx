import React, { createContext, useContext } from "react";
import axios from "axios";

interface CartContextType {
  addToCart: (productId: string) => Promise<void>;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const addToCart = async (productId: string) => {
    try {
      const token = localStorage.getItem("tokenn") ? JSON.parse(localStorage.getItem("tokenn")!) : null;
      if (!token) {throw new Error("No authentication token found");}else{console.log('tokenn',token);
      }

      await axios.post("https://ecommerce.routemisr.com/api/v1/cart", { productId }, {
        headers: { token},
      });

      console.log("Product added to cart");
    } catch (error) {
      console.error("Error adding product:", error);
    }
  };

  return(<CartContext.Provider value={{ addToCart }}>
    {children}
    </CartContext.Provider>) 
};

// Custom Hook
export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) throw new Error("useCart must be used within a CartProvider");
  return context;
};
