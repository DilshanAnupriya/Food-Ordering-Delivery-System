import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../services/auth/authContext';
import SectionWrapper from "../../hoc/SectionWrapper.tsx";

const ManiNavbar = () => {
  const { isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="pl-1 py-4">
      <div className="max-w-7xl mx-auto flex items-center">
        {/* Logo */}
        <Link to="/order" className="flex items-center">
          <span className="text-4xl font-bold text-orange-500">Order●</span>
        </Link>
        <div className="flex items-center justify-end w-full">
          {/* Navigation Links */}
          <div className="hidden md:flex items-center space-x-8">
            <Link 
              to="/" 
              className="text-gray-700  px-6 py-1 rounded-2xl hover:text-[#FC8A06] transition-colors text-[14px]"
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
            {isAuthenticated && (
              <Link
                to="/track"
                className="text-gray-700 hover:text-orange-500 transition-colors text-[14px]"
              >
                Order Tracker
              </Link>
            )}
          </div>

          {/* Auth Buttons */}
          <div className="flex items-center pl-5 space-x-4">
            {isAuthenticated ? (
              <>
                <Link 
                  to="/profile" 
                  className="text-gray-700 hover:text-orange-500 transition-colors text-[14px]"
                >
                  My Profile
                </Link>
                <button
                  onClick={handleLogout}
                  className="px-4 py-2 text-gray-700 hover:text-orange-500 transition-colors text-[14px]"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link 
                  to="/login" 
                  className="text-gray-700 hover:text-orange-500 transition-colors text-[14px]"
                >
                  Login
                </Link>
                <Link 
                  to="/register" 
                  className="px-4 py-2 bg-[#03081F] text-white rounded-full hover:bg-orange-500 transition-colors text-[15px]"
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

const Navbar = SectionWrapper(ManiNavbar);

export default Navbar;
