import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useParams } from "react-router-dom";
import { FaSpinner } from 'react-icons/fa';
import { MdError } from 'react-icons/md';
import toast from 'react-hot-toast';
import { motion } from 'framer-motion';

const BrandDetails = () => {
  const { id } = useParams();

  const getBrandDetails = async (id: string) => {
    try {
      const response = await axios.get(`https://ecommerce.routemisr.com/api/v1/brands/${id}`);
      return response.data;
    } catch (error) {
      console.error("Error fetching brand details:", error);
      throw error;
    }
  }

  const { data: brand, isLoading, isError } = useQuery({
    queryKey: ["brandDetails", id],
    queryFn: () => getBrandDetails(id as string),
  });

  if (!id) {
    return (
      <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center bg-gray-900">
        <motion.div
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="text-red-500 text-center p-4 bg-gray-800 rounded-lg shadow-lg"
        >
          Brand ID is required
        </motion.div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="min-h-[calc(100vh-4rem)] flex flex-col items-center justify-center bg-gray-900">
        <motion.div
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <FaSpinner className="w-12 h-12 text-blue-500 animate-spin mb-4" />
        </motion.div>
        <motion.p 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="text-gray-300 text-lg"
        >
          Loading brand details...
        </motion.p>
      </div>
    );
  }

  if (isError || !brand || brand?.status === "error" || brand?.status === "fail") {
    toast.error('Failed to load brand details 😕', {
      duration: 3000,
      position: 'top-center',
      style: {
        background: '#f44336',
        color: '#fff',
        padding: '16px',
        borderRadius: '8px',
        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
      },
    });
    return (
      <div className="min-h-[calc(100vh-4rem)] flex flex-col items-center justify-center bg-gray-900">
        <motion.div
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <MdError className="w-16 h-16 text-red-500 mb-4" />
        </motion.div>
        <motion.h2 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="text-2xl font-bold text-gray-200 mb-2"
        >
          Brand Not Found
        </motion.h2>
        <motion.p 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="text-gray-400 text-center max-w-md px-4"
        >
          We couldn't find the brand you're looking for. Please try again later.
        </motion.p>
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-gray-900 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <h1 className="text-3xl sm:text-4xl font-bold mb-4 bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
            Brand Details
          </h1>
        </motion.div>

        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="bg-gray-800 rounded-2xl shadow-xl overflow-hidden border border-gray-700"
        >
          <div className="relative aspect-video overflow-hidden bg-gray-700">
            <motion.img
              src={brand?.data.image}
              alt={brand?.data.name}
              className="w-full h-full object-contain p-8"
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.3 }}
            />
          </div>

          <div className="p-6 sm:p-8">
            <motion.h2
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="text-3xl sm:text-4xl font-bold text-white mb-4"
            >
              {brand?.data.name}
            </motion.h2>

            <motion.p
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="text-gray-400 text-lg mb-8"
            >
              {brand?.data.description}
            </motion.p>

            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="grid grid-cols-1 sm:grid-cols-3 gap-4 p-4 bg-gray-700/50 rounded-xl"
            >
              <div className="text-center p-4">
                <p className="text-gray-400 text-sm mb-1">Brand ID</p>
                <p className="text-white font-semibold">{brand?.data._id?.slice(0, 3)}</p>
              </div>
              <div className="text-center p-4">
                <p className="text-gray-400 text-sm mb-1">Created At</p>
                <p className="text-white font-semibold">
                  {new Date(brand?.data.createdAt).toLocaleDateString()}
                </p>
              </div>
              <div className="text-center p-4">
                <p className="text-gray-400 text-sm mb-1">Updated At</p>
                <p className="text-white font-semibold">
                  {new Date(brand?.data.updatedAt).toLocaleDateString()}
                </p>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default BrandDetails;
