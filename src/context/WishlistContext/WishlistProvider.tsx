import { createContext, useContext, useState, ReactNode } from 'react';

interface WishlistContextType {
  wishlistItems: any[];
  addToWishlist: (item: any) => void;
  removeFromWishlist: (itemId: string) => void;
}

const WishlistContext = createContext<WishlistContextType | undefined>(undefined);

export const WishlistProvider = ({ children }: { children: ReactNode }) => {
  const [wishlistItems, setWishlistItems] = useState<any[]>([]);

  const addToWishlist = (item: any) => {
    setWishlistItems(prev => [...prev, item]);
  };

  const removeFromWishlist = (itemId: string) => {
    setWishlistItems(prev => prev.filter(item => item._id !== itemId));
  };

  return (
    <WishlistContext.Provider value={{ wishlistItems, addToWishlist, removeFromWishlist }}>
      {children}
    </WishlistContext.Provider>
  );
};

export const useWishlist = () => {
  const context = useContext(WishlistContext);
  if (!context) {
    throw new Error('useWishlist must be used within a WishlistProvider');
  }
  return context;
}; 