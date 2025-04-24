import { Link } from 'react-router-dom';
import SectionWrapper from "../../hoc/SectionWrapper.tsx";

const Banner = () => {
  return (
    <div className="bg-gradient-to-r from-gray-900 to-gray-800 relative overflow-hidden rounded-2xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-20">
        <div className="grid md:grid-cols-2 gap-8 items-center ">
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
          <div className="absolute ml-[700px]  mt-[70px] bg-[url('src/assets/Image1.png')] w-[600px] h-[400px]"></div>
          {/*<div className="absolute w-70 h-80 ml-[620px]  mt-[130px] bg-[url('src/assets/image2.png')] bg-cover"></div>*/}
          <div className="absolute w-100 h-80 ml-[500px]  mt-[89px] bg-[url('src/assets/image3.png')] bg-cover"></div>
          <div className="absolute w-60 h-25 ml-[820px]  mt-[220px] bg-[url('src/assets/Group2.png')] bg-cover"></div>
          <div className="absolute w-60 h-25 ml-[830px]  mt-[-220px] bg-[url('src/assets/Group3.png')] bg-cover">
            <h3 className="absolute mt-16 ml-5 text-[9px] font-bold">We’ve Received your order!</h3>
            <h3 className="absolute mt-19 ml-5 text-[9px] ">Awaiting Restaurant acceptance</h3>
          </div>
          <div className="absolute w-60 h-25 ml-[860px]  mt-[10px] bg-[url('src/assets/Group4.png')] bg-cover">
            <h3 className="absolute mt-17 ml-5 text-[9px] font-bold">Order Accepted! </h3>
            <h3 className="absolute mt-20 ml-5 text-[9px] ">Your order will be delivered shortly</h3>
          </div>
        </div>

      </div>
      
      {/* Background Overlay */}
      <div className=""></div>
    </div>
  );
};


const BannerWrapper = SectionWrapper(Banner);

export default BannerWrapper;

