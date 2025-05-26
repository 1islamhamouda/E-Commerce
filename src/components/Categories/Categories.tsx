import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { FaSpinner, FaList } from 'react-icons/fa';
import { MdError } from 'react-icons/md';
import toast from 'react-hot-toast';
import { motion } from 'framer-motion';

const Categories = () => {
  const getCategories = () => {
    return axios.get('https://ecommerce.routemisr.com/api/v1/categories');
  }

  const { data, error, isError, isLoading } = useQuery({
    queryKey: ['categories'],
    queryFn: getCategories,
  })

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
          Loading categories...
        </motion.p>
      </div>
    )
  }

  if (isError) {
    toast.error('Failed to load categories 😕', {
      duration: 3000,
      position: 'top-center',
      style: {
        background: '#f44336',
        color: '#fff',
        padding: '16px',
        borderRadius: '8px',
        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
      },
    })
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
          Oops! Something went wrong
        </motion.h2>
        <motion.p 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="text-gray-400 text-center max-w-md px-4"
        >
          We couldn't load the categories. Please try again later.
        </motion.p>
      </div>
    )
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  }

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.5
      }
    }
  }

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-gray-900 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <motion.div 
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <div className="flex items-center justify-center gap-3 mb-4">
            <FaList className="w-8 h-8 text-amber-400" />
            <h1 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-amber-400 to-orange-500 bg-clip-text text-transparent">
              Categories
            </h1>
          </div>
          <p className="text-gray-400 max-w-2xl mx-auto">
            Explore our diverse range of categories, each offering unique products to enhance your shopping experience.
          </p>
        </motion.div>

        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6"
        >
          {data?.data?.data?.map((category: any) => (
            <motion.div
              key={category._id}
              variants={itemVariants}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="group"
            >
              <div className="bg-gray-800 rounded-xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-700 hover:border-amber-500">
                <div className="relative aspect-square overflow-hidden bg-gray-700">
                  <motion.img 
                    src={category.image} 
                    alt={category.name} 
                    className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500"
                    loading="lazy"
                    whileHover={{ rotate: [0, -5, 5, -5, 0] }}
                    transition={{ duration: 0.5 }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-gray-900/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </div>
                <div className="p-4 text-center">
                  <h3 className="text-lg font-semibold text-amber-400 group-hover:text-amber-300 transition-colors duration-300">
                    {category.name}
                  </h3>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </div>
  )
}

export default Categories
