import { Link } from 'react-router-dom';
import SectionWrapper from "../../hoc/SectionWrapper.tsx";

const ManiNavbar = () => {
  return (
    <nav className="pl-1  py-4">
      <div className="max-w-7xl mx-auto flex items-center ">
        {/* Logo */}
        <Link to="/order" className="flex items-center">
          <span className="text-4xl font-bold text-orange-500">Order●</span>
        </Link>
        <div className="flex items-center justify-end  w-full">
        {/* Navigation Links */}
        <div className="hidden md:flex items-center space-x-8">
          <Link 
            to="/" 
            className="text-gray-700 bg-[#FC8A06] px-6 py-1 rounded-2xl hover:text-white transition-colors text-[14px]"
          >
            Home
          </Link>
          <Link 
            to="/browse-menu" 
            className="text-gray-700 hover:text-orange-500 transition-colors text-[14px]"
          >
            Browse Menu
          </Link>
          <Link 
            to="/restaurants"
            className="text-gray-700 hover:text-orange-500 transition-colors text-[14px]"
          >
            Restaurants
          </Link>
          <Link
              to="/contact"
              className="text-gray-700 hover:text-orange-500 transition-colors text-[14px]"
          >
            Special Offers
          </Link>
          <Link
              to="/contact"
              className="text-gray-700 hover:text-orange-500 transition-colors text-[14px]"
          >
            Contact Us
          </Link>
          <Link
              to="/contact"
              className="text-gray-700 hover:text-orange-500 transition-colors text-[14px]"
          >
            Order Tracker
          </Link>

        </div>

        {/* Auth Buttons */}
        <div className="flex items-center pl-5 ">

          <Link 
            to="/signup" 
            className="px-4 py-2 bg-[#03081F] text-white rounded-full hover:bg-orange-500 transition-colors text-[15px]"
          >
            Sign Up
          </Link>
        </div>
        </div>
      </div>
    </nav>
  );
};



const Navbar = SectionWrapper(ManiNavbar);

export default Navbar;
