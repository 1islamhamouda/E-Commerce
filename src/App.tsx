import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import Layout from './components/Layout/Layout';
import Home from './components/Home/Home';
import Cart from './components/Cart/Cart';
import Brands from './components/Brands/Brands';
import Categories from './components/Categories/Categories';
import Productes from './components/Productes/Productes';
import LogIn from './components/Auth/Log/LogIn';
import  Register  from './components/Auth/Register/Register'
import ProductDetails from './components/ProductDetails/ProductDetails';
import { NameProvider } from './context/NameProvider';
import BrandDetails from './components/BrandDetails/BrandDetails';
import UserContext from './context/UserContext';
import FavoriteList from './components/FavoriteList/FavoriteList';
import  { CartProvider } from './context/CartContext/AddProvider';
import ProtectedElement from './components/ProtucteElement';  
import { FavoriteProvider } from './context/FavoriteContext/FavoriteProvider';
import { WishlistProvider } from './context/WishlistContext/WishlistProvider';
import Orders from './components/Orders/Orders';
import NotFound from './components/NotFound/NotFound';
import ForgetPassword from './components/Auth/ForgetPassword/ForgetPassword';

export const router = createBrowserRouter([{
  path: '/',
 element: <Layout />,
  children: [
    {
      path: '/',
      element:<ProtectedElement><Home /></ProtectedElement> ,
    },
    {
      path: 'Cart',
      element:<CartProvider><Cart/></CartProvider> ,
    },
    {
      path: 'Brands',
      element:<ProtectedElement><Brands/></ProtectedElement> ,
    },
    {
      path: 'Categories',
      element: <ProtectedElement><Categories/></ProtectedElement> ,
    },
    {
      path: 'Products',
      element: <ProtectedElement><Productes/></ProtectedElement>,
    },
    {
      path:'Favorite',
      element:<ProtectedElement><FavoriteList/></ProtectedElement> ,
    },
    {
      path: 'ProductDetails/:id/:category',
      element:<ProtectedElement><ProductDetails/></ProtectedElement> ,
    },
    
    {
      path: '/BrandDetails/:id',
      element:<ProtectedElement><BrandDetails/></ProtectedElement> ,
    },
    {
      path: 'Login',
      element: <LogIn/>
    },
    {
      path:'Register',
      element: <Register/>
    },
    {
      path: 'ForgetPassword',
      element: <ForgetPassword/>
    },
    {
      path: 'Orders',
      element: <ProtectedElement><Orders/></ProtectedElement>
    },
    {
      path: '*',
      element: <NotFound />
    }

  ]
}]);
const App = () => {
  return (
    <WishlistProvider>
      <UserContext>
        <NameProvider>
        <FavoriteProvider>
          <CartProvider>
            <RouterProvider router={router} />
          </CartProvider>
        </FavoriteProvider>
        </NameProvider>
      </UserContext>
    </WishlistProvider>
  )
}

export default App
