import React from 'react';
import PropTypes from 'prop-types';

/**
 * Reusable Tooltip component
 * Usage:
 * <Tooltip content="Tooltip text here" placement="top|bottom|left|right">
 *   <button>Hover me</button>
 * </Tooltip>
 */
const getPlacementClasses = (placement) => {
  switch (placement) {
    case 'bottom':
      return 'top-full left-1/2 -translate-x-1/2 mt-2';
    case 'left':
      return 'right-full top-1/2 -translate-y-1/2 mr-2';
    case 'right':
      return 'left-full top-1/2 -translate-y-1/2 ml-2';
    case 'top':
    default:
      return 'bottom-full left-1/2 -translate-x-1/2 mb-2';
  }
};

const Tooltip = ({ content, children, placement = 'top', className = '' }) => (
  <span className={`relative group inline-block ${className}`}
        tabIndex={0} // for keyboard accessibility
        aria-describedby="tooltip-content"
  >
    {children}
    <span
      id="tooltip-content"
      role="tooltip"
      className={`pointer-events-none absolute z-20 px-2 py-1 text-xs text-white bg-black rounded shadow transition-opacity duration-200 opacity-0 group-hover:opacity-100 group-focus:opacity-100 ${getPlacementClasses(placement)}`}
      style={{ whiteSpace: 'nowrap' }}
    >
      {content}
    </span>
  </span>
);

Tooltip.propTypes = {
  content: PropTypes.node.isRequired,
  children: PropTypes.node.isRequired,
  placement: PropTypes.oneOf(['top', 'bottom', 'left', 'right']),
  className: PropTypes.string,
};

export default Tooltip; 