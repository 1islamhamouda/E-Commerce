import { Link } from 'react-router-dom';
import { FaFacebook, FaTwitter, FaInstagram, FaLinkedin, FaYoutube } from 'react-icons/fa';
import { MdEmail, MdPhone, MdLocationOn } from 'react-icons/md';
import visa from '../../assets/visa.jpg';
import express from '../../assets/express.jpg';
import Mastercard from '../../assets/Mastercard.jpg';
import payPal from '../../assets/payPal.jpg';

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-gray-300">
      {/* Main Footer */}
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="space-y-4">
            <h3 className="text-white text-xl font-bold mb-4">E-Commerce</h3>
            <p className="text-sm leading-relaxed">
              Your one-stop destination for all your shopping needs. We provide quality products with the best customer service.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="hover:text-white transition-colors">
                <FaFacebook className="text-xl" />
              </a>
              <a href="#" className="hover:text-white transition-colors">
                <FaTwitter className="text-xl" />
              </a>
              <a href="#" className="hover:text-white transition-colors">
                <FaInstagram className="text-xl" />
              </a>
              <a href="#" className="hover:text-white transition-colors">
                <FaLinkedin className="text-xl" />
              </a>
              <a href="#" className="hover:text-white transition-colors">
                <FaYoutube className="text-xl" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="hover:text-white transition-colors">Home</Link>
              </li>
              <li>
                <Link to="/products" className="hover:text-white transition-colors">Products</Link>
              </li>
              <li>
                <Link to="/categories" className="hover:text-white transition-colors">Categories</Link>
              </li>
              <li>
                <Link to="/about" className="hover:text-white transition-colors">About Us</Link>
              </li>
              <li>
                <Link to="/contact" className="hover:text-white transition-colors">Contact</Link>
              </li>
            </ul>
          </div>

          {/* Customer Service */}
          <div>
            <h3 className="text-white text-lg font-semibold mb-4">Customer Service</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/faq" className="hover:text-white transition-colors">FAQ</Link>
              </li>
              <li>
                <Link to="/shipping" className="hover:text-white transition-colors">Shipping Policy</Link>
              </li>
              <li>
                <Link to="/returns" className="hover:text-white transition-colors">Returns & Refunds</Link>
              </li>
              <li>
                <Link to="/terms" className="hover:text-white transition-colors">Terms & Conditions</Link>
              </li>
              <li>
                <Link to="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-white text-lg font-semibold mb-4">Contact Us</h3>
            <ul className="space-y-3">
              <li className="flex items-start space-x-3">
                <MdLocationOn className="text-xl mt-1" />
                <span>123 Shopping Street, E-Commerce City, 12345</span>
              </li>
              <li className="flex items-center space-x-3">
                <MdPhone className="text-xl" />
                <span>+1 234 567 8900</span>
              </li>
              <li className="flex items-center space-x-3">
                <MdEmail className="text-xl" />
                <span>support@ecommerce.com</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Newsletter Section */}
      <div className="bg-gray-800 py-8">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="mb-4 md:mb-0">
              <h4 className="text-white text-lg font-semibold">Subscribe to our newsletter</h4>
              <p className="text-sm text-gray-400">Get the latest updates and offers</p>
            </div>
            <div className="flex w-full md:w-auto">
              <input
                type="email"
                placeholder="Enter your email"
                className="px-4 py-2 w-full md:w-64 rounded-l-lg focus:outline-none text-gray-900"
              />
              <button className="bg-blue-600 text-white px-6 py-2 rounded-r-lg hover:bg-blue-700 transition-colors">
                Subscribe
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="bg-gray-950 py-4">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-sm text-gray-400">
              © {new Date().getFullYear()} E-Commerce. All rights reserved.
            </p>
            <div className="flex space-x-4 mt-4 md:mt-0">
              <img src={visa} alt="Visa" className="h-6 rounded-md" />
              <img src={Mastercard} alt="Mastercard" className="h-6" />
              <img src={payPal} alt="PayPal" className="h-6 rounded-md" />
              <img src={express} alt="American Express" className="h-6 rounded-sm" />
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;