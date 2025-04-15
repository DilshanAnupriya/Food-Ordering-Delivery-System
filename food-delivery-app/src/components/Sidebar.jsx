import React from 'react';
import { NavLink } from 'react-router-dom';
import { AiOutlineHome, AiOutlineUser, AiOutlinePhone } from 'react-icons/ai';
import { BiHelpCircle } from 'react-icons/bi';
import { FiLogOut } from 'react-icons/fi';

const Sidebar = () => {
  return (
    <div className="fixed top-0 left-0 h-screen w-64 bg-white border-r border-gray-200 flex flex-col">
      {/* Logo Section */}
      <div className="px-6 py-4">
        <h2 className="text-2xl font-bold text-gray-800">Your Logo</h2>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 px-3">
        <NavLink 
          to="/" 
          className={({ isActive }) => 
            `flex items-center px-4 py-3 text-gray-700 rounded-lg transition-colors ${
              isActive ? 'bg-orange-500 text-white' : 'hover:bg-gray-100'
            }`
          }
        >
          <AiOutlineHome className="text-xl mr-3" />
          <span>Home</span>
        </NavLink>

        <NavLink 
          to="/profile" 
          className={({ isActive }) => 
            `flex items-center px-4 py-3 mt-2 text-gray-700 rounded-lg transition-colors ${
              isActive ? 'bg-orange-500 text-white' : 'hover:bg-gray-100'
            }`
          }
        >
          <AiOutlineUser className="text-xl mr-3" />
          <span>Profile</span>
        </NavLink>

        <NavLink 
          to="/contact" 
          className={({ isActive }) => 
            `flex items-center px-4 py-3 mt-2 text-gray-700 rounded-lg transition-colors ${
              isActive ? 'bg-orange-500 text-white' : 'hover:bg-gray-100'
            }`
          }
        >
          <AiOutlinePhone className="text-xl mr-3" />
          <span>Contact Us</span>
        </NavLink>
      </nav>

      {/* Bottom Section */}
      <div className="px-3 py-4 border-t border-gray-200">
        <button className="flex items-center w-full px-4 py-3 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors">
          <BiHelpCircle className="text-xl mr-3" />
          <span>Help</span>
        </button>

        <button className="flex items-center w-full px-4 py-3 mt-2 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors">
          <FiLogOut className="text-xl mr-3" />
          <span>Logout</span>
        </button>
      </div>
    </div>
  );
};

export default Sidebar;