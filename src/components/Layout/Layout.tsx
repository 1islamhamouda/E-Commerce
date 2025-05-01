import { Outlet } from 'react-router-dom'
import Footer from '../Footer/Footer'
import Nav from '../Navbar/Nav'

const Layout = () => {
  return (
    <>
    <Nav/>
    <div className='container'>
      <Outlet/>
      </div>
   <Footer/>
    </>
  )
}

export default Layout