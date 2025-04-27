import React from 'react';
import { FiSearch } from 'react-icons/fi';

const SearchBar = ({ value, onChange, placeholder = 'Search affinities...' }) => (
  <div className="relative flex-grow">
    <input
      type="text"
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
    />
    <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
  </div>
);

export default SearchBar; 