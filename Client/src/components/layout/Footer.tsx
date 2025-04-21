import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-white shadow-md mt-auto">
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
          {/* Company Logo */}
          <div className="text-center md:text-left">
            <Link to="/" className="text-2xl font-bold text-orange-500">
              Order●
            </Link>
          </div>

          {/* Payment Info */}
          <div className="text-center flex flex-col items-center">
            <div className="flex items-center space-x-2">
              <svg
                className="h-6 w-6"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <rect width="24" height="24" rx="4" fill="#635BFF" />
                <path
                  d="M12.5 5.5v13M8.5 5.5v13M16.5 5.5v13"
                  stroke="white"
                  strokeWidth="2"
                />
              </svg>
              <span className="text-gray-600">Payments Powered by Stripe</span>
            </div>
          </div>

          {/* Contact Link */}
          <div className="text-center md:text-right">
            <Link
              to="/contact"
              className="text-gray-700 hover:text-orange-500 transition-colors"
            >
              Contact Us
            </Link>
          </div>
        </div>

        {/* Copyright */}
        <div className="border-t border-gray-100 mt-4 pt-4 text-center text-gray-600">
          <p>© {new Date().getFullYear()} Order●. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;