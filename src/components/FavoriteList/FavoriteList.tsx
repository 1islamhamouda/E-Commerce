import { useEffect, useState } from "react";
import axios from "axios";

interface WishlistItem {
  _id: string;
  image: string;
  name: string;
  price: number;
}


const FavoriteList = () => {
  const [wishlist, setWishlist] = useState<WishlistItem[]>(JSON.parse(localStorage.getItem("wishlist") || "[]"));
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchWishlist = async () => {
      try {
        const response = await axios.get("https://ecommerce.routemisr.com/api/v1/wishlist", {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });

        setWishlist(response.data);
        localStorage.setItem("wishlist", JSON.stringify(response.data)); // Save to localStorage
      } catch (error) {
        console.error("Error fetching wishlist:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchWishlist();
  }, []);

  if (loading) return <p>Loading wishlist...</p>;

  return (
    <div>
      <h1>Your Wishlist ❤️</h1>
      {wishlist.length > 0 ? (
        wishlist.map((product: WishlistItem) => (
          <div key={product._id}>
            <img src={product.image} alt={product.name} />
            <h2>{product.name}</h2>
            <p>{product.price} EGP</p>
          </div>
        ))
      ) : (
        <p>No items in your wishlist.</p>
      )}
    </div>
  );
};

export default FavoriteList;
