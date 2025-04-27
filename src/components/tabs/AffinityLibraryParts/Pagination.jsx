import React from 'react';
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi';

const Pagination = ({ currentPage, totalPages, onPageChange }) => (
  <div className="flex justify-center items-center mt-4">
    <button
      onClick={() => onPageChange(currentPage - 1)}
      disabled={currentPage === 1}
      className={`p-2 rounded-md ${
        currentPage === 1
          ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
          : 'bg-white text-gray-700 hover:bg-gray-50'
      }`}
    >
      <FiChevronLeft className="w-5 h-5" />
    </button>
    {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
      <button
        key={page}
        onClick={() => onPageChange(page)}
        className={`px-3 py-1 rounded-md ${
          currentPage === page
            ? 'bg-blue-500 text-white'
            : 'bg-white text-gray-700 hover:bg-gray-50'
        }`}
      >
        {page}
      </button>
    ))}
    <button
      onClick={() => onPageChange(currentPage + 1)}
      disabled={currentPage === totalPages}
      className={`p-2 rounded-md ${
        currentPage === totalPages
          ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
          : 'bg-white text-gray-700 hover:bg-gray-50'
      }`}
    >
      <FiChevronRight className="w-5 h-5" />
    </button>
  </div>
);

export default Pagination; 