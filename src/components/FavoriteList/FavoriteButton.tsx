import { useState, useEffect } from 'react';
import { useFavorite } from '../../context/FavoriteContext/FavoriteProvider';
import toast from 'react-hot-toast';

interface FavoriteButtonProps {
  productId: string;
}

const FavoriteButton: React.FC<FavoriteButtonProps> = ({ productId }) => {
  const [isFavorite, setIsFavorite] = useState(false);
  const { addToFavorite, removeFromFavorite, getFavorites } = useFavorite();

  useEffect(() => {
    const checkFavorite = async () => {
      try {
        const favorites = await getFavorites();
        setIsFavorite(favorites.some(fav => fav._id === productId));
      } catch (error) {
        console.error('Error checking favorite status:', error);
      }
    };
    checkFavorite();
  }, [productId, getFavorites]);

  const handleFavoriteClick = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    try {
      const toastId = toast.loading(isFavorite ? 'Removing from favorites...' : 'Adding to favorites...');
      if (isFavorite) {
        await removeFromFavorite(productId);
        toast.success('Removed from favorites ❤️', {
          id: toastId,
          duration: 2000,
          position: 'top-center',
          style: {
            background: '#4CAF50',
            color: '#fff',
          },
        });
      } else {
        await addToFavorite(productId);
        toast.success('Added to favorites ❤️', {
          id: toastId,
          duration: 2000,
          position: 'top-center',
          style: {
            background: '#4CAF50',
            color: '#fff',
          },
        });
      }
      setIsFavorite(!isFavorite);
    } catch (error) {
      console.error('Error toggling favorite:', error);
      toast.error('Failed to update favorites', {
        duration: 3000,
        position: 'top-center',
        style: {
          background: '#f44336',
          color: '#fff',
        },
      });
    }
  };

  return (
    <button
      onClick={handleFavoriteClick}
      className="absolute top-2 right-2 z-10 bg-white rounded-full p-2 shadow-md hover:bg-gray-100"
    >
      <i className={`fa-solid fa-heart ${isFavorite ? 'text-red-500' : 'text-gray-400'}`}></i>
    </button>
  );
};

export default FavoriteButton;
