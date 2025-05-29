import './Home.css'
import { useState } from "react";
import toast from "react-hot-toast";

interface Product {
  _id: string;
  name: string;
  title: string;
  category: {
    name: string;
  };
  price: number;
  imageCover: string;
  ratingsAverage: number;
  images: string[];
  description: string;
  quantity: number;
  sold: number;
  priceAfterDiscount: number;
}

type SearchProps = {
  products: Product[];
  onSearch: React.Dispatch<React.SetStateAction<Product[]>>;
};

export let filteredProducts: Product[] = [];

const Search: React.FC<SearchProps> = ({ products, onSearch }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [isFocused, setIsFocused] = useState(false);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setSearchQuery(query);
    
    filteredProducts = products.filter((product) =>
      product.title.toLowerCase().includes(query.toLowerCase())
    );
    
    onSearch(filteredProducts);

    // Show toast for search results
    if (query && filteredProducts.length === 0) {
      toast.error('No products found 😕', {
        duration: 2000,
        position: 'top-center',
        style: {
          background: '#f44336',
          color: '#fff',
          padding: '16px',
          fontSize: '16px',
          borderRadius: '8px',
          boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
          maxWidth: '400px',
          width: '100%',
        },
        icon: '🔍',
      });
    }
  };

  // Clear search with animation
  const handleClear = () => {
    setSearchQuery("");
    onSearch(products);
  };
      
  return (
    <div className="w-full max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 mb-8">
      <form 
        className={`relative transition-all duration-300 ${isFocused ? 'scale-105' : 'scale-100'}`}
        onSubmit={(e: React.FormEvent) => e.preventDefault()}
      >   
        <div className="relative">
          <div className="absolute inset-y-0 start-0 flex items-center ps-4 pointer-events-none">
            <svg 
              className={`w-5 h-5 transition-colors duration-300 ${isFocused ? 'text-blue-600' : 'text-gray-500'}`} 
              aria-hidden="true" 
              xmlns="http://www.w3.org/2000/svg" 
              fill="none" 
              viewBox="0 0 20 20"
            >
              <path 
                stroke="currentColor" 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z" 
              />
            </svg>
          </div>
          <input 
            type="search" 
            value={searchQuery} 
            onChange={handleSearch}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            id="default-search" 
            className="block w-full p-4 ps-12 text-base text-gray-900 border-2 border-gray-300 rounded-2xl bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300 shadow-sm hover:shadow-md focus:shadow-lg dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" 
            placeholder="Search for products..." 
            required 
          />
          {searchQuery && (
            <button 
              type="button"
              onClick={handleClear}
              className="absolute inset-y-0 end-24 flex items-center pe-3 text-gray-500 hover:text-gray-700 transition-colors duration-300"
            >
              <svg 
                className="w-5 h-5" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d="M6 18L18 6M6 6l12 12" 
                />
              </svg>
            </button>
          )}
          <button 
            type="submit"  
            className="absolute right-2 top-1/2 -translate-y-1/2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-xl px-6 py-2.5 transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 shadow-sm hover:shadow-md"
          >
            Search
          </button>
        </div>
        {searchQuery && (
          <div className="mt-2 text-sm text-gray-500">
            Found {filteredProducts.length} {filteredProducts.length === 1 ? 'product' : 'products'}
          </div>
        )}
      </form>
    </div>
  );
};

export default Search;





