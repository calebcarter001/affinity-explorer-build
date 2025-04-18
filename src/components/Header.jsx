import React from 'react';

const Header = () => (
  <div className="header px-6 flex items-center justify-between">
    <div className="flex items-center">
      <div className="relative w-64 mr-4">
        <input 
          type="text" 
          placeholder="Search affinities, properties..." 
          className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg w-full focus:outline-none focus:border-blue-500"
        />
        <div className="absolute left-3 top-2.5 text-gray-400">
          <i className="fas fa-search"></i>
        </div>
      </div>
    </div>
    <div className="flex items-center">
      <div className="relative mr-4">
        <i className="fas fa-bell text-gray-600"></i>
        <span className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full w-4 h-4 flex items-center justify-center text-xs">3</span>
      </div>
      <div className="relative mr-4">
        <i className="fas fa-question-circle text-gray-600"></i>
      </div>
      <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white">
        PM
      </div>
    </div>
  </div>
);

export default Header;