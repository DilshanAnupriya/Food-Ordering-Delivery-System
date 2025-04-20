import { Link } from 'react-router-dom';

const Banner = () => {
  return (
    <div className="bg-gradient-to-r from-gray-900 to-gray-800 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-20">
        <div className="grid md:grid-cols-2 gap-8 items-center">
          {/* Left Content */}
          <div className="text-white space-y-6 z-10">
            <h1 className="text-4xl md:text-5xl font-bold leading-tight">
              Feast Your Senses,
              <span className="block text-orange-500">Fast and Fresh</span>
            </h1>
            <p className="text-gray-300 text-lg">
              Order restaurant food instantly with seamless delivery
            </p>
            
            {/* Search Bar */}
            <div className="flex flex-col sm:flex-row gap-4 max-w-md">
              <input
                type="text"
                placeholder="Enter your delivery address"
                className="flex-1 px-4 py-3 rounded-lg bg-white text-gray-800 focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
              <Link
                to="/browse-menu"
                className="px-6 py-3 bg-orange-500 text-white rounded-lg font-medium hover:bg-orange-600 transition-colors text-center"
              >
                Order Now
              </Link>
            </div>
          </div>

          {/* Right Content - Order Cards */}
          <div className="relative">
            <div className="absolute top-0 right-0 transform translate-x-1/4 -translate-y-1/4">
              <div className="bg-white p-4 rounded-lg shadow-lg w-64">
                <h3 className="font-medium text-gray-800">Order</h3>
                <p className="text-sm text-gray-600">Your order is being prepared</p>
              </div>
            </div>
            
            <div className="bg-white p-4 rounded-lg shadow-lg w-64 ml-auto mb-4">
              <h3 className="font-medium text-gray-800">Order</h3>
              <p className="text-sm text-gray-600">Delivery in progress</p>
            </div>
            
            <div className="absolute bottom-0 right-0 transform translate-x-1/3 translate-y-1/4">
              <div className="bg-white p-4 rounded-lg shadow-lg w-64">
                <h3 className="font-medium text-gray-800">Order</h3>
                <p className="text-sm text-gray-600">Ready for pickup</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Background Overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-gray-900 to-transparent opacity-90"></div>
    </div>
  );
};

export default Banner;