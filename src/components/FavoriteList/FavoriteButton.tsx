import { useState, useEffect } from "react";
import { addToWishlist, removeFromWishlist, getWishlistFromStorage } from '../FavoriteList/wishApi';

interface FavoriteButtonProps {
  productId: string;
}

const FavoriteButton = ({ productId }: FavoriteButtonProps) => {
  const [isFavorite, setIsFavorite] = useState(false);

  useEffect(() => {
    setIsFavorite(getWishlistFromStorage().some((item: { _id: string }) => item._id === productId));
  }, [productId]);

  const handleFavoriteToggle = async () => {
    if (isFavorite) {
      await removeFromWishlist(productId);
      setIsFavorite(false);
    } else {
      await addToWishlist(productId);
      setIsFavorite(true);
    }
  };

  
  

  return (
    <button
      onClick={handleFavoriteToggle}
      style={{
        fontSize: "24px",
        border: "none",
        background: "none",
        cursor: "pointer",
        color: isFavorite ? "red" : "black",
      }}
    >
      {isFavorite ? "❤️ " : "🤍"}
    </button>
  );
};

export default FavoriteButton;
