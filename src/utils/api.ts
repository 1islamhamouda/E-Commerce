import axios from 'axios';

const api = axios.create({
  baseURL: 'https://ecommerce.routemisr.com/api/v1',
});

// Request interceptor
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Clear local storage and redirect to login
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export const authAPI = {
  login: async (credentials: { email: string; password: string }) => {
    const response = await api.post('/auth/signin', credentials);
    return response.data;
  },

  register: async (userData: { name: string; email: string; password: string; phone: string }) => {
    const response = await api.post('/auth/signup', userData);
    return response.data;
  },

  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = '/login';
  }
};

export const productAPI = {
  getProducts: async () => {
    const response = await api.get('/products');
    return response.data;
  },

  getProduct: async (id: string) => {
    const response = await api.get(`/products/${id}`);
    return response.data;
  }
};

export const cartAPI = {
  addToCart: async (productId: string) => {
    const response = await api.post('/cart', { productId });
    return response.data;
  },

  getCart: async () => {
    const response = await api.get('/cart');
    return response.data;
  },

  removeFromCart: async (productId: string) => {
    const response = await api.delete(`/cart/${productId}`);
    return response.data;
  }
};

export const wishlistAPI = {
  addToWishlist: async (productId: string) => {
    const response = await api.post('/wishlist', { productId });
    return response.data;
  },

  getWishlist: async () => {
    const response = await api.get('/wishlist');
    return response.data;
  },

  removeFromWishlist: async (productId: string) => {
    const response = await api.delete(`/wishlist/${productId}`);
    return response.data;
  }
};

export default api; 