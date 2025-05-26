import React, { createContext, useContext, useState, useEffect } from 'react';
import { getWishlistFromStorage } from '../../components/FavoriteList/wishApi';
import toast from 'react-hot-toast';

interface FavoriteContextType {
  wishlist: any[];
  setWishlist: React.Dispatch<React.SetStateAction<any[]>>;
  isInWishlist: (productId: string) => boolean;
  refreshWishlist: () => void;
}

const FavoriteContext = createContext<FavoriteContextType | undefined>(undefined);

export const FavoriteProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [wishlist, setWishlist] = useState<any[]>([]);

  const refreshWishlist = React.useCallback(() => {
    try {
      const storedWishlist = getWishlistFromStorage();
      setWishlist(prevWishlist => {
        // Only update if the wishlist has actually changed
        if (JSON.stringify(prevWishlist) !== JSON.stringify(storedWishlist)) {
          return storedWishlist;
        }
        return prevWishlist;
      });
    } catch (error) {
      console.error('Error refreshing wishlist:', error);
      toast.error('Failed to refresh wishlist', {
        duration: 3000,
        position: 'top-center',
        style: {
          background: '#f44336',
          color: '#000',
        },
      });
    }
  }, []); // Empty dependency array since getWishlistFromStorage is stable

  const isInWishlist = React.useCallback((productId: string) => {
    return wishlist.some(item => item._id === productId);
  }, [wishlist]);

  useEffect(() => {
    refreshWishlist();
  }, []); // Only run once on mount

  return (
    <FavoriteContext.Provider value={{ wishlist, setWishlist, isInWishlist, refreshWishlist }}>
      {children}
    </FavoriteContext.Provider>
  );
};

export const useFavorite = () => {
  const context = useContext(FavoriteContext);
  if (context === undefined) {
    throw new Error('useFavorite must be used within a FavoriteProvider');
  }
  return context;
}; 