import { Navbar, NavbarBrand, NavbarToggle, NavbarCollapse } from "flowbite-react";
import { Dropdown, DropdownItem } from "flowbite-react";
import freshIcon from '../../assets/freshIcon.svg';
import './nav.css';
import { Link, NavLink, useNavigate } from "react-router-dom";
import { motion } from 'framer-motion';
import { FaShoppingCart, FaHeart, FaUser } from 'react-icons/fa';
import { useCart } from "../../context/CartContext/AddProvider";
import { useWishlist } from "../../context/WishlistContext/WishlistProvider";
import { useContext, useEffect, useState } from 'react';
import { User } from "../../context/UserContext";

const Nav = () => {
  const navigate = useNavigate();
  const { getCart } = useCart();
  const [cartItems, setCartItems] = useState<any>({ products: [] });
  const { wishlistItems } = useWishlist();
  
  const userContext = useContext(User);
  if (!userContext) {
    throw new Error("UserContext is not provided");
  }
  const { token, removeToken } = userContext;

  useEffect(() => {
    const fetchCart = async () => {
      if (!token) return;
      try {
        const response = await getCart();
        if (response) {
          setCartItems(response);
        } else {
          setCartItems({ products: [] });
        }
      } catch (error) {
        console.error('Error fetching cart:', error);
        setCartItems({ products: [] });
      }
    };
    fetchCart();
  }, [getCart, token]);

  const handleLogout = () => {
    removeToken();
    navigate('/login');
  };

  return (
    <motion.div
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5 }}
      className="sticky top-0 z-50 bg-gray-900/95 backdrop-blur-sm border-b border-gray-800 w-full"
    >
      <Navbar fluid rounded className="p-2 sm:p-3 md:p-4 w-full">
        <NavbarBrand href="/" className="me-2 sm:me-4 md:me-7 ms-2 sm:ms-4 md:ms-0 translate-y-0 w-auto">
          <motion.img 
            whileHover={{ scale: 1.05 }}
            src={freshIcon} 
            alt="Fresh Logo" 
            className="w-24 sm:w-28 md:w-32 lg:w-36 h-7 sm:h-8 md:h-9 lg:h-10 bg-white rounded p-1 shadow-lg" 
          />
        </NavbarBrand>

        <div className="flex items-center space-x-1 sm:space-x-2 md:space-x-4 order-last">
          {token && (
            <div className="flex items-center space-x-1 sm:space-x-2 md:space-x-4">
              <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}>
                <NavLink to="/Cart" className="relative">
                  <FaShoppingCart className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 text-gray-300 hover:text-blue-400 transition-colors" />
                  {cartItems?.products?.length > 0 && (
                    <span className="absolute -top-1.5 -right-1.5 sm:-top-2 sm:-right-2 bg-blue-500 text-white text-[10px] sm:text-xs rounded-full w-3.5 h-3.5 sm:w-4 sm:h-4 md:w-5 md:h-5 flex items-center justify-center">
                      {cartItems.products.length}
                    </span>
                  )}
                </NavLink>
              </motion.div>

              <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}>
                <NavLink to="/Favorite" className="relative">
                  <FaHeart className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 text-gray-300 hover:text-red-400 transition-colors" />
                  {wishlistItems?.length > 0 && (
                    <span className="absolute -top-1.5 -right-1.5 sm:-top-2 sm:-right-2 bg-red-500 text-white text-[10px] sm:text-xs rounded-full w-3.5 h-3.5 sm:w-4 sm:h-4 md:w-5 md:h-5 flex items-center justify-center">
                      {wishlistItems.length}
                    </span>
                  )}
                </NavLink>
              </motion.div>
            </div>
          )}

          <Dropdown 
            label={<FaUser className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 text-gray-300 hover:text-blue-400 transition-colors" />} 
            dismissOnClick={true} 
            className="relative"
          >
            {token ? (
              <>
                <DropdownItem>
                  <Link to="/Profile" className="flex items-center text-xs sm:text-sm md:text-base">
                    <span>Profile</span>
                    <i className="fa-solid fa-user ms-2"></i>
                  </Link>
                </DropdownItem>
                <DropdownItem>
                  <Link to="/Orders" className="flex items-center text-xs sm:text-sm md:text-base">
                    <span>Orders</span>
                    <i className="fa-solid fa-box ms-2"></i>
                  </Link>
                </DropdownItem>
                <DropdownItem>
                  <button 
                    onClick={handleLogout}
                    className="flex items-center text-red-500 text-xs sm:text-sm md:text-base"
                  >
                    <span>Sign-out</span>
                    <i className="fa-solid fa-arrow-right-from-bracket ms-2"></i>
                  </button>
                </DropdownItem>
              </>
            ) : (
              <>
                <DropdownItem>
                  <Link to="/Register" className="flex items-center text-xs sm:text-sm md:text-base">
                    <span>Register</span>
                    <i className="fa-solid fa-id-card ms-2"></i>
                  </Link>
                </DropdownItem>
                <DropdownItem>
                  <Link to="/Login" className="flex items-center text-xs sm:text-sm md:text-base">
                    <span>Sign-in</span>
                    <i className="fa-solid fa-arrow-right-to-bracket ms-2"></i>
                  </Link>
                </DropdownItem>
              </>
            )}
          </Dropdown>
          <NavbarToggle className="text-gray-300 hover:text-blue-400 transition-colors w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6" />
        </div>

        {token && (
          <NavbarCollapse className="navCollapse md:flex-row text-center py-2 md:py-1 md:space-x-3 lg:space-x-4 xl:space-x-6">
            <motion.div whileHover={{ scale: 1.05 }} className="py-1.5 sm:py-2 md:py-0">
              <NavLink 
                to="/" 
                className={({ isActive }) => 
                  `text-gray-300 hover:text-blue-400 transition-colors text-xs sm:text-sm md:text-base ${isActive ? 'text-blue-400' : ''}`
                }
              >
                Home
              </NavLink>
            </motion.div>
            <motion.div whileHover={{ scale: 1.05 }} className="py-1.5 sm:py-2 md:py-0">
              <NavLink 
                to="Brands" 
                className={({ isActive }) => 
                  `text-gray-300 hover:text-blue-400 transition-colors text-xs sm:text-sm md:text-base ${isActive ? 'text-blue-400' : ''}`
                }
              >
                Brands
              </NavLink>
            </motion.div>
            <motion.div whileHover={{ scale: 1.05 }} className="py-1.5 sm:py-2 md:py-0">
              <NavLink 
                to="Categories" 
                className={({ isActive }) => 
                  `text-gray-300 hover:text-blue-400 transition-colors text-xs sm:text-sm md:text-base ${isActive ? 'text-blue-400' : ''}`
                }
              >
                Categories
              </NavLink>
            </motion.div>
            <motion.div whileHover={{ scale: 1.05 }} className="py-1.5 sm:py-2 md:py-0">
              <NavLink 
                to="Products" 
                className={({ isActive }) => 
                  `text-gray-300 hover:text-blue-400 transition-colors text-xs sm:text-sm md:text-base ${isActive ? 'text-blue-400' : ''}`
                }
              >
                Products
              </NavLink>
            </motion.div>
          </NavbarCollapse>
        )}
      </Navbar>
    </motion.div>
  );
};

export default Nav;


