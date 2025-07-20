import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  HomeIcon, 
  UsersIcon, 
  ShoppingBagIcon, 
  ChartBarIcon,
  Cog6ToothIcon,
  ArrowRightStartOnRectangleIcon,
  PhotoIcon
} from '@heroicons/react/24/outline';
import { useState } from 'react';

const Sidebar: React.FC = () => {
  const location = useLocation();
  const [open, setOpen] = useState(false);

  const menuItems = [
    { name: 'Dashboard', icon: HomeIcon, path: '/admin' },
    { name: 'Products', icon: PhotoIcon, path: '/admin/products' },
    { name: 'Users', icon: UsersIcon, path: '/admin/users' },
  
    { name: 'Analytics', icon: ChartBarIcon, path: '/admin/analytics' },
  ];

  // Tambahkan Order Control section
  const orderControlItems = [
    { name: 'InPlace - Controller', icon: ShoppingBagIcon, path: '/admin/inplace-orders' },
    { name: 'Delivery - Controller', icon: ShoppingBagIcon, path: '/admin/delivery-orders' },
    { name: 'Pickup - Controller', icon: ShoppingBagIcon, path: '/admin/pickup-orders' },
  ];

  const handleLogout = () => {
    localStorage.removeItem('token');
    window.location.href = '/';
  };

  // Sidebar content as a function for reuse
  const sidebarContent = (
    
    <div className="flex flex-col h-full">
      <div className="mb-8">
        <h1 className="text-2xl font-bold">Coffee Shop Admin</h1>
      </div>
      <nav className="space-y-2">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;
          return (
            <Link
              key={item.name}
              to={item.path}
              className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                isActive 
                  ? 'bg-blue-600 text-white' 
                  : 'text-gray-300 hover:bg-gray-800 hover:text-white'
              }`}
              onClick={() => setOpen(false)}
            >
              <Icon className="w-5 h-5" />
              <span>{item.name}</span>
            </Link>
          );
        })}
        {/* Order Control Section */}
        <div className="mt-6 mb-2 px-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Order Control</div>
        <div className="space-y-1 pl-4">
          {orderControlItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.name}
                to={item.path}
                className={`flex items-center space-x-3 px-4 py-2 rounded-lg transition-colors ${
                  isActive 
                    ? 'bg-blue-600 text-white' 
                    : 'text-gray-300 hover:bg-gray-800 hover:text-white'
                }`}
                onClick={() => setOpen(false)}
              >
                <Icon className="w-4 h-4" />
                <span>{item.name}</span>
              </Link>
            );
          })}
        </div>
      </nav>
      <div className="mt-auto pt-8">
        <button
          onClick={handleLogout}
          className="flex items-center space-x-3 px-4 py-3 text-gray-300 hover:bg-gray-800 hover:text-white rounded-lg transition-colors w-full"
        >
          <ArrowRightStartOnRectangleIcon className="w-5 h-5" />
          <span>Logout</span>
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Hamburger button for mobile */}
      <button
        className="md:hidden fixed top-4 left-4 z-50 bg-gray-900 text-white p-2 rounded-lg shadow-lg focus:outline-none"
        onClick={() => setOpen(true)}
        aria-label="Open sidebar"
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      </button>
      {/* Sidebar overlay for mobile */}
      <div
        className={`fixed inset-0 z-40 bg-black bg-opacity-40 transition-opacity md:hidden ${open ? 'block' : 'hidden'}`}
        onClick={() => setOpen(false)}
      />
      {/* Sidebar drawer */}
      <aside
        className={`fixed top-0 left-0 z-50 h-full w-64 bg-gray-900 text-white p-4 transform transition-transform duration-200 ease-in-out overflow-y-auto
          ${open ? 'translate-x-0' : '-translate-x-full'}
          md:translate-x-0 md:static md:block`}
        style={{ boxShadow: '2px 0 8px rgba(0,0,0,0.08)', maxHeight: '100vh' }}
      >
        {/* Close button for mobile */}
        <div className="flex md:hidden justify-end mb-4">
          <button
            className="text-gray-300 hover:text-white p-2"
            onClick={() => setOpen(false)}
            aria-label="Close sidebar"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        {sidebarContent}
      </aside>
    </>
  );
};

export default Sidebar;