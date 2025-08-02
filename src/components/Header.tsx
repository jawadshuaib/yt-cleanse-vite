import React from 'react';
import { googleLogout } from '@react-oauth/google';

interface HeaderProps {
  onLogout: () => void;
}

const Header: React.FC<HeaderProps> = ({ onLogout }) => {
  const handleLogoutClick = () => {
    googleLogout();
    onLogout();
  };

  return (
    <header className="bg-gray-800/80 backdrop-blur-sm sticky top-0 z-10 border-b border-gray-700">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <h1 className="text-2xl font-bold text-white">
              YT <span className="text-purple-400">Cleanse</span>
            </h1>
          </div>
          <div className="flex items-center">
            <button
              onClick={handleLogoutClick}
              className="bg-purple-600 hover:bg-purple-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors duration-200 text-sm"
            >
              Logout
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
