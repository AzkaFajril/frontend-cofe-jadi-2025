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

const Sidebar: React.FC = () => {
  const location = useLocation();

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

  return (
    <div className="bg-gray-900 text-white w-64 h-screen fixed top-0 left-0 p-4 flex flex-col">
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
};

export default Sidebar;