import { useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import SectionWrapper from "../../hoc/SectionWrapper.tsx";
import image3 from "../../../public/assets/image3.png"

const Banner = () => {
  const [address, setAddress] = useState('');

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        when: "beforeChildren",
        staggerChildren: 0.2,
        duration: 0.5
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { duration: 0.5 } }
  };

  const imageVariants = {
    hidden: { scale: 0.8, opacity: 0 },
    visible: {
      scale: 1,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100,
        delay: 0.3,
        duration: 0.6
      }
    }
  };

  const floatingAnimation = {
    y: [0, -10, 0],
    transition: {
      duration: 3,
      repeat: Infinity,
      repeatType: "reverse" as const,
      ease: "easeInOut"
    }
  };

  return (
      <div className="bg-gradient-to-r from-gray-900 to-gray-800 relative overflow-hidden rounded-2xl shadow-2xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-20">
          <motion.div
              className="grid md:grid-cols-2 gap-8 items-center"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
          >
            {/* Left Content */}
            <div className="text-white space-y-6 z-10">
              <motion.h1
                  className="text-4xl md:text-5xl font-bold leading-tight"
                  variants={itemVariants}
              >
                Feast Your Senses,
                <span className="block text-orange-500">Fast and Fresh</span>
              </motion.h1>

              <motion.p
                  className="text-gray-300 text-lg"
                  variants={itemVariants}
              >
                Order restaurant food instantly with seamless delivery
              </motion.p>

              {/* Search Bar */}
              <motion.div
                  className="flex flex-col sm:flex-row gap-4 max-w-md"
                  variants={itemVariants}
              >
                <input
                    type="text"
                    placeholder="Enter your delivery address"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    className="flex-1 px-4 py-3 rounded-lg bg-white text-gray-800 focus:outline-none focus:ring-2 focus:ring-orange-500 transition-all duration-300"
                />
                <Link
                    to="/browse-menu"
                    className="px-6 py-3 bg-orange-500 text-white rounded-lg font-medium hover:bg-orange-600 transition-colors text-center transform hover:scale-105 transition-transform duration-300"
                >
                  Order Now
                </Link>
              </motion.div>
            </div>

            {/* Right Content - Order Cards with Responsive Positioning */}
            <div className="relative h-64 md:h-80 w-full">
              <motion.div
                  className="absolute top-0 right-0  md:right-0 w-full md:w-4/5 h-full  mr-12 "
                  variants={imageVariants}
              >
                <img
                    src={image3}
                    alt="Food display"
                    className="object-cover rounded-lg shadow-lg "
                />
              </motion.div>

              <motion.div
                  className="absolute top-1/4 left-0 md:left-4 w-36 md:w-48 bg-white p-3 rounded-lg shadow-lg"
                  variants={imageVariants}
                  animate={floatingAnimation}
              >
                <h3 className="text-xs font-bold">We've Received your order!</h3>
                <p className="text-xs mt-1">Awaiting Restaurant acceptance</p>
              </motion.div>

              <motion.div
                  className="absolute bottom-0 right-0 md:right-12 w-36 md:w-48 bg-white p-3 rounded-lg shadow-lg"
                  variants={imageVariants}
                  animate={{
                    y: [0, -8, 0],
                    transition: {
                      duration: 3.5,
                      repeat: Infinity,
                      repeatType: "reverse",
                      ease: "easeInOut",
                      delay: 0.5
                    }
                  }}
              >
                <h3 className="text-xs font-bold">Order Accepted!</h3>
                <p className="text-xs mt-1">Your order will be delivered shortly</p>
              </motion.div>
            </div>
          </motion.div>
        </div>

        {/* Background Elements */}
        <motion.div
            className="absolute -bottom-10 -left-10 w-40 h-40 bg-orange-500 rounded-full opacity-10"
            animate={{
              scale: [1, 1.2, 1],
              transition: { duration: 8, repeat: Infinity }
            }}
        />
        <motion.div
            className="absolute -top-20 right-20 w-60 h-60 bg-orange-400 rounded-full opacity-10"
            animate={{
              scale: [1, 1.1, 1],
              transition: { duration: 6, repeat: Infinity }
            }}
        />
      </div>
  );
};

const BannerWrapper = SectionWrapper(Banner);

export default BannerWrapper;