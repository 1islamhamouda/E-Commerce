
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useParams } from "react-router-dom";

const BrandDetails = () => {
  const { id } = useParams(); // Get the brand ID from URL


const getBrabdDetails =  (id: string) => {
    return axios.get(`https://ecommerce.routemisr.com/api/v1/brands/${id}`).then
(res => res.data).catch(error => {
    console.error("Error fetching brand details:", error);
    throw error;
  }
);
  }
    const { data: brand, isLoading } = useQuery({
        queryKey: ["brandDetails", id],
        queryFn: () => getBrabdDetails(id as string),
    });
    

    if (!id) {
        return <div className="text-red-500 text-center">Brand ID is required</div>;
    }
    if (!brand || brand?.status === "error" || brand?.status === "fail") {
        console.error("Error fetching brand details:", brand?.message);
        return <div className="text-red-500 text-center">Brand not found</div>;
    }

  if (isLoading) return <p>Loading...</p>;

  return (
    <div>
        <h2 className="text-center text-3xl font-serif mt-8">Brand Details</h2>
        <div className="flex flex-col items-center justify-center mt-4">
            <img src={brand?.data.image} alt={brand?.data.name} className="w-1/2 h-auto rounded-lg shadow-lg" />
            <h3 className="text-4xl font-bold font-serif mt-4">{brand?.data.name}</h3>
            <p className="font-serif text-gray-700 mt-2">{brand?.data.description}</p>
            <div className="flex justify-between items-center w-full px-4 py-2 mt-4">
                <p className="text-xl font-bold">Brand ID: {brand?.data._id}</p>
                <p className="text-xl font-bold">Created At: {new Date(brand?.data.createdAt).toLocaleDateString()}</p>
                <p className="text-xl font-bold">Updated At: {new Date(brand?.data.updatedAt).toLocaleDateString()}</p>
        </div>
      </div>
    </div>
  );
};

export default BrandDetails;
