import React, { useEffect, useState } from 'react';
import { Bars3Icon, BellIcon } from '@heroicons/react/24/outline';

interface User {
  name: string;
  email: string;
  picture?: string;
}

const Header: React.FC<{ onMenuClick: () => void }> = ({ onMenuClick }) => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const fetchUser = async () => {
      const token = localStorage.getItem('token');
      if (!token) return;
      const response = await fetch('http://localhost:5000/auth/me', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (response.ok) {
        const data = await response.json();
        setUser(data);
      }
    };
    fetchUser();
  }, []);

  return (
    <header className="bg-white shadow-sm border-b border-gray-200 border-solida">
      <div className="flex items-center justify-between h-16 px-6">
        {/* Mobile menu button */}
        <button
          onClick={onMenuClick}
          className="lg:hidden p-2 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-100"
        >
          <Bars3Icon className="w-6 h-6" />
        </button>

        {/* Search bar */}
        <div className="flex-1 max-w-lg mx-4 lg:mx-8">
          <div className="relative">
            <input
              type="text"
              placeholder="Search..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
          </div>
        </div>

        {/* Right side */}
        <div className="flex items-center space-x-4">
          {/* Notifications */}
          <button className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg">
            <BellIcon className="w-6 h-6" />
          </button>

          {/* User menu */}
          <div className="flex items-center space-x-3">
            <img
              className="w-8 h-8 rounded-full"
              src={
                user?.picture ||
                `https://ui-avatars.com/api/?name=${encodeURIComponent(user?.name || 'A')}`
              }
              alt={user?.name || 'User'}
            />
            <div className="hidden md:block">
              <p className="text-sm font-medium text-gray-900">{user?.name || 'Admin User'}</p>
              <p className="text-xs text-gray-500">{user?.email || 'admin@email.com'}</p>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;