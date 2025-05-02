import { Navbar, NavbarBrand, NavbarToggle ,NavbarCollapse} from "flowbite-react";
import { Dropdown, DropdownItem } from "flowbite-react";
import freshIcon from '../../assets/freshIcon.svg'
import './nav.css'
import { Link, NavLink} from "react-router-dom";

const Nav = () => {
  
  return (
    <>

<Navbar fluid rounded className=" p-0 md:p-4  dark:bg-gray-900">
  <NavbarBrand href="/" className="me-7 ms-3 md:ms-0  translate-y-5 md:translate-y-0  w-full md:w-auto ">
    <img src={freshIcon} alt="Fresh Logo" className="w-36 h-10 bg-white rounded p-1" />
  </NavbarBrand>
  <div className=" items-end translate-x-[14em] -translate-y-5 md:-translate-y-0  md:order-last flex md:translate-x-[-1em] Dropdown outline-none border-none">
    <Dropdown label="Account" dismissOnClick={true} className="relative">
      <DropdownItem><Link to={`/Register`}>Register <i className="fa-solid fa-id-card ms-2"></i></Link> </DropdownItem>
      <DropdownItem><Link to={`/LogIn`}>Sign-in <i className="fa-solid fa-arrow-right-to-bracket ms-2"></i></Link> </DropdownItem>
      <DropdownItem> Sign-out <i className="fa-solid fa-arrow-right-from-bracket ms-2"></i></DropdownItem>
    </Dropdown>
    <NavbarToggle />
  </div>
  <NavbarCollapse className=" navCollapse  -translate-y-4 md:-translate-y-0 md:flex-row text-center py-1 md:space-x-6 text-white">
    <NavLink to="/">Home</NavLink>
    <NavLink to="Cart">Cart</NavLink>
    <NavLink to="Brands">Brands</NavLink>
    <NavLink to="Categories">Categories</NavLink>
    <NavLink to="Products">Products</NavLink>
    <NavLink to="Favorite">Favorite</NavLink>
  </NavbarCollapse>
</Navbar>
 
    </>
  )
}

export default Nav


