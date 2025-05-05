import { useEffect, useState } from "react";
import axios from "axios";
import { useQuery } from "@tanstack/react-query";

interface WishlistItem {
  _id: string;
  image: string;
  name: string;
  price: number;
}


const FavoriteList:React.FC = () => {
  const [wishlist, setWishlist] = useState<WishlistItem[]>(JSON.parse(localStorage.getItem("wishlist") || "[]"));
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchWishlist = async () => {
      try {
        const response = await axios.get("https://ecommerce.routemisr.com/api/v1/wishlist", {
          headers: { Authorization: `Bearer ${localStorage.getItem("tokenn")}` },
        });
       console.log(response?.data,'dataaaaa');
       
        setWishlist(response?.data);
        localStorage.setItem("wishlist", JSON.stringify(response?.data)); // Save to localStorage
      } catch (error) {
        console.error("Error fetching wishlist:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchWishlist();

  }, []);

// const getFavoriteList = async (): Promise<WishlistItem[]> => {
//   return axios.get(`https://ecommerce.routemisr.com/api/v1/wishlist`,
//   {
//     headers:{
//       Authorization: `Bearer ${localStorage.getItem("tokenn")}`
//     }
//   }
//  ).then((res) => {
//   localStorage.setItem('wishlist', JSON.stringify(res?.data));
//   return res?.data; // Explicitly return the data
//  }).catch((err) => {
//   console.log(err);
//   throw err; // Re-throw the error to handle it in the query
//  });
// }

// const { data: whishList = [], isError, error, isLoading } = useQuery<WishlistItem[]>({
//   queryKey: ['whishList'],
//   queryFn: getFavoriteList,
// });


// let storedWishlist = JSON.parse(localStorage.getItem("wishlist") || "[]");
//  useEffect(()=>{
//   if(storedWishlist)
//     storedWishlist
//  },[whishList])
 


// if(isError) return <p>eroooor, {error instanceof Error ? error.message : String(error)}</p>

  if (loading) return <p>Loading wishlist...</p>;

  console.log('token',localStorage.getItem('tokenn'));
  console.log('wish', wishlist);
  
  

  return (
    <div>
      <h1>Your Wishlist ❤️</h1>
      {wishlist?.length > 0 ? (
        wishlist?.map((product: WishlistItem) => (
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
