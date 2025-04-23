import React, { useState } from 'react';
import { FiChevronDown, FiChevronRight } from 'react-icons/fi';

const ComparisonGridGroup = ({ 
  title, 
  children, 
  defaultOpen = true,
  collapsedSummary,
  className = ''
}) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <div className={`border-b border-gray-200 ${className}`}>
      <div
        className="flex items-center px-4 py-2 bg-gray-50 cursor-pointer hover:bg-gray-100 transition-colors"
        onClick={() => setIsOpen(!isOpen)}
      >
        {isOpen ? (
          <FiChevronDown className="w-5 h-5 text-gray-500" />
        ) : (
          <FiChevronRight className="w-5 h-5 text-gray-500" />
        )}
        <h3 className="text-sm font-medium text-gray-700 ml-2">{title}</h3>
        {!isOpen && collapsedSummary && (
          <span className="ml-4 text-sm text-gray-500">{collapsedSummary}</span>
        )}
      </div>
      {isOpen && (
        <div className="px-4 py-2 bg-white">
          {children}
        </div>
      )}
    </div>
  );
};

export default ComparisonGridGroup; 