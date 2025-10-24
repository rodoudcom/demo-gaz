import React from 'react';
import { Search, Bell, Filter } from 'lucide-react';

export const Header = ({ title, subtitle, showFilters }) => {
  return (
    <header className="bg-white border-b border-gray-100">
      <div className="px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Title - Smaller, more elegant */}
          <div>
            <h1 className="text-xl font-bold text-gray-900 font-nunito">
              {title}
            </h1>
            {subtitle && (
              <p className="text-xs text-gray-500 mt-0.5 font-roboto">{subtitle}</p>
            )}
          </div>

          {/* Right side actions */}
          <div className="flex items-center space-x-3">
            {/* Search - Smaller */}
            <div className="relative hidden md:block">
              <input
                type="text"
                placeholder="Search..."
                className="pl-9 pr-4 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-red-600 focus:border-red-600 font-roboto text-gray-700 bg-gray-50 w-64"
              />
              <Search className="w-4 h-4 text-gray-400 absolute left-3 top-2.5" />
            </div>

            {/* Notifications */}
            <button className="relative p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors">
              <Bell className="w-5 h-5" />
              <span className="absolute top-1 right-1 block h-2 w-2 bg-red-600 rounded-full"></span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
