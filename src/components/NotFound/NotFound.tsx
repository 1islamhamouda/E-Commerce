import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

const NotFound = () => {
  return (
    <div className="min-h-[calc(100vh-4rem)] flex flex-col items-center justify-center bg-gray-900 text-white p-4">
      <motion.div
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center"
      >
        <h1 className="text-9xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-pink-500 mb-4">
          404
        </h1>
        <h2 className="text-3xl sm:text-4xl font-bold mb-4">Page Not Found</h2>
        <p className="text-lg text-gray-400 mb-8">
          Oops! The page you are looking for does not exist.
        </p>
        <Link to="/">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg shadow-lg hover:bg-blue-700 transition duration-300"
          >
            Go to Homepage
          </motion.button>
        </Link>
      </motion.div>

      {/* Optional: Add an illustration or animation here */}
      {/* <motion.img
        src="/path/to/your/404-illustration.svg"
        alt="Page not found illustration"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6, delay: 0.3 }}
        className="mt-12 max-w-md mx-auto"
      /> */}
    </div>
  );
};

export default NotFound; 