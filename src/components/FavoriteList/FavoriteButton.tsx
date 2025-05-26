import React, { useState, useEffect } from 'react';
import { FaHeart, FaSpinner } from 'react-icons/fa';
import { useFavorite } from '../../context/FavoriteContext/FavoriteProvider';
import toast from 'react-hot-toast';
import { addToWishlist, removeFromWishlist } from './wishApi';

interface FavoriteButtonProps {
  productId: string;
}

const FavoriteButton: React.FC<FavoriteButtonProps> = ({ productId }) => {
  const { isInWishlist, refreshWishlist } = useFavorite();
  const [isLoading, setIsLoading] = useState(false);


  // Check initial state on mount
  useEffect(() => {
    // isInWishlist checks the current state in context
    // We don't need separate local state for `isFavorited` if context is the source of truth
  }, [productId]);

  const handleFavoriteClick = async (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    event.stopPropagation();
    
    // Prevent toggling if loading
    if (isLoading) return;

    setIsLoading(true);
    const isCurrentlyFavorited = isInWishlist(productId);
    let actionType = isCurrentlyFavorited ? 'Removing from' : 'Adding to';

    const toastId = toast.loading(`${actionType} favorites...`, {
      position: 'top-center',
      style: {
        background: '#2196F3', // Blue background for loading
        color: '#fff',
        padding: '16px',
        borderRadius: '8px',
        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
      },
    });

    try {
      let success = false;
      if (isCurrentlyFavorited) {
        // Call removeFromWishlist from wishApi
        success = await removeFromWishlist(productId);
      } else {
        // Call addToWishlist from wishApi
        success = await addToWishlist(productId);
        
      }

      if (success) {
        // Refresh the wishlist in the context after successful operation
        refreshWishlist();
        toast.success(`${actionType === 'Adding to' ? 'Added to' : 'Removed from'} favorites!`, {
          id: toastId,
          duration: 2000,
          position: 'top-center',
          style: {
            background: actionType === 'Adding to' ? '#4CAF50' : '#f44336', // Green for added, Red for removed
            color: '#fff',
            padding: '16px',
            borderRadius: '8px',
            boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
          },
        });
      } else {
         // Handle cases where the API call was successful but the internal 'success' flag is false
         throw new Error('Operation failed.');
      }

    } catch (error: any) {
      console.error('Error toggling favorite:', error);
      toast.error(error.response?.data?.message || `Failed to ${actionType.toLowerCase()} favorites.`, {
        id: toastId,
        duration: 3000,
        position: 'top-center',
        style: {
          background: '#f44336', // Red for error
          color: '#fff',
          padding: '16px',
          borderRadius: '8px',
          boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
        },
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Determine if the product is currently in the wishlist based on context state
  const favorited = isInWishlist(productId);

  return (
    <button
      onClick={handleFavoriteClick}
      className={`p-2 rounded-full shadow-md transition-colors duration-300 ${
        favorited ? 'text-red-500 bg-white' : 'text-gray-400 bg-gray-800 hover:text-red-500 hover:bg-white'
      } ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
      disabled={isLoading} // Disable button while loading
      aria-label={favorited ? 'Remove from favorites' : 'Add to favorites'}
    >
      {isLoading ? (
        <FaSpinner className="animate-spin w-5 h-5" />
      ) : (
        <FaHeart className="w-5 h-5" />
      )}
    </button>
  );
};

export default FavoriteButton; 