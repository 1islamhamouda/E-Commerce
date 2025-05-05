import axios from "axios";

export const getWishlistFromStorage = () => JSON.parse(localStorage.getItem("wishlist") || "[]");

const saveWishlistToStorage = (wishlist: any[]) => localStorage.setItem("wishlist", JSON.stringify(wishlist));


export const addToWishlist = async (productId: string) => {
  try {
    const response = await axios.post(
      "https://ecommerce.routemisr.com/api/v1/wishlist",
      { productId },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("tokenn")}`,
        },
      }
    );

    const updatedWishlist = [...getWishlistFromStorage(), response.data];
    saveWishlistToStorage(updatedWishlist); // Save to localStorage
    return response.data;
  } catch (error) {
    console.error("Error adding product to wishlist:", error);
  }
};

export const removeFromWishlist = async (productId: string) => {
  try {
    await axios.delete(`https://ecommerce.routemisr.com/api/v1/wishlist/${productId}`, {
      headers: { Authorization: `Bearer ${localStorage.getItem("tokenn")}` },
    });

    const updatedWishlist = getWishlistFromStorage().filter((item: { _id: string }) => item._id !== productId);
    saveWishlistToStorage(updatedWishlist); // Save to localStorage
  } catch (error) {
    console.error("Error removing product from wishlist:", error);
  }
};
