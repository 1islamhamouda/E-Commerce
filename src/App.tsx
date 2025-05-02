
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



export const router = createBrowserRouter([{
  path: '/',
 element: <Layout />,
  children: [
    {
      path: '/',
      element:<Home /> ,
    },
    {
      path: 'Cart',
      element:<Cart/> ,
    },
    {
      path: 'Brands',
      element:<Brands/> ,
    },
    {
      path: 'Categories',
      element: <Categories/>,
    },
    {
      path: 'Products',
      element:<Productes/> ,
    },
    {
      path:'Favorite',
      element:<FavoriteList/> ,
    },
    {
      path: 'ProductDetails/:id/:category',
      element:<ProductDetails/> ,
    },
    
    {
      path: '/BrandDetails/:id',
      element:<BrandDetails/> ,
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
      path: '*',
      element: <h1>404</h1>
    }

  ]
}]);
const App = () => {
  return (
    <>
    <UserContext>
      <NameProvider>

      <RouterProvider router={router} />
      
      </NameProvider>
    </UserContext>
   
      
    </>
  )
}

export default App
