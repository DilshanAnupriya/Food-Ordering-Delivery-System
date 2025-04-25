import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import {  UtensilsCrossed, CreditCard, Truck, HelpCircle, LogOut, ShoppingCart } from 'lucide-react';

const AdminSidebar: React.FC = () => {
  const location = useLocation();
  
  const navLinkStyle = (isActive: boolean) =>
    `flex items-center gap-3 px-4 py-3 rounded-lg font-medium text-sm transition-colors ${
      isActive ? 'bg-orange-500 text-white' : 'text-gray-700 hover:bg-gray-100'
    }`;
    
  return (
    <aside className="fixed top-0 pt-32 left-0 h-screen w-64 bg-white border-r border-gray-200 flex flex-col shadow-sm z-20 overflow-y-auto">
      
      
      {/* Navigation */}
      <nav className="flex-1 px-3 py-6 space-y-2">
        
        
      <NavLink to="/restaurent" className={({ isActive }) => navLinkStyle(isActive)}>
          <UtensilsCrossed size={20} />
          Restaurant Admin
        </NavLink>
        
        <NavLink to="/orders" className={({ isActive }) => navLinkStyle(isActive)}>
          <ShoppingCart size={20} />
          Orders Admin
        </NavLink>
        
        <NavLink
          to="/delivery"
          className={({ isActive }) =>
            navLinkStyle(isActive || location.pathname.startsWith('/driver'))
          }
        >
          <Truck size={20} />
          Delivery Admin
        </NavLink>
        
        <NavLink to="/payments" className={({ isActive }) => navLinkStyle(isActive)}>
          <CreditCard size={20} />
          Payments Admin
        </NavLink>
        
        
      </nav>
      
      {/* Footer Menu Items */}
      <div className="px-3 py-4 border-t border-gray-200">
        <button className="flex items-center w-full gap-3 px-4 py-3 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors">
          <HelpCircle size={20} />
          Help
        </button>
        
        <button className="flex items-center w-full gap-3 px-4 py-3 mt-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors">
          <LogOut size={20} />
          Logout
        </button>
      </div>
    </aside>
  );
};

export default AdminSidebar;