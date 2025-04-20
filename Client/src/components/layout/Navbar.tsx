import { Link } from 'react-router-dom';

const Navbar = () => {
  return (
    <nav className="bg-white shadow-md px-6 py-4">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center">
          <span className="text-2xl font-bold text-orange-500">Order●</span>
        </Link>

        {/* Navigation Links */}
        <div className="hidden md:flex items-center space-x-8">
          <Link 
            to="/" 
            className="text-gray-700 hover:text-orange-500 transition-colors"
          >
            Home
          </Link>
          <Link 
            to="/browse-menu" 
            className="text-gray-700 hover:text-orange-500 transition-colors"
          >
            Browse Menu
          </Link>
          <Link 
            to="/contact" 
            className="text-gray-700 hover:text-orange-500 transition-colors"
          >
            Contact Us
          </Link>
        </div>

        {/* Auth Buttons */}
        <div className="flex items-center space-x-4">
          <Link 
            to="/login" 
            className="px-4 py-2 text-gray-700 hover:text-orange-500 transition-colors"
          >
            Login
          </Link>
          <Link 
            to="/signup" 
            className="px-4 py-2 bg-orange-500 text-white rounded-full hover:bg-orange-600 transition-colors"
          >
            Sign Up
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;