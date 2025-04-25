/**
 * Utility functions for formatting data
 */

/**
 * Format a date string
 * @param {string} dateString - ISO date string
 * @param {object} options - Intl.DateTimeFormat options
 * @returns {string} Formatted date string
 */
export const formatDate = (dateString, options = {}) => {
  if (!dateString) return '';
  
  const defaultOptions = {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  };
  
  const mergedOptions = { ...defaultOptions, ...options };
  
  return new Date(dateString).toLocaleDateString(undefined, mergedOptions);
};

/**
 * Format a number with commas for thousands
 * @param {number} number - Number to format
 * @param {number} decimals - Number of decimal places
 * @returns {string} Formatted number
 */
export const formatNumber = (number, decimals = 0) => {
  if (number === null || number === undefined) return '';
  
  return Number(number).toLocaleString(undefined, {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals
  });
};

/**
 * Truncate a string with ellipsis
 * @param {string} text - Text to truncate
 * @param {number} length - Maximum length
 * @returns {string} Truncated text
 */
export const truncateText = (text, length = 100) => {
  if (!text) return '';
  
  if (text.length <= length) return text;
  
  return text.slice(0, length) + '...';
};

/**
 * Convert kebab-case or snake_case to Title Case
 * @param {string} text - Text to convert
 * @returns {string} Title cased text
 */
export const toTitleCase = (text) => {
  if (!text) return '';
  
  return text
    .replace(/[-_]/g, ' ')
    .replace(/\w\S*/g, (word) => {
      return word.charAt(0).toUpperCase() + word.substr(1).toLowerCase();
    });
};

/**
 * Format a score as a percentage
 * @param {number} score - Score value
 * @param {number} maxScore - Maximum possible score
 * @returns {string} Formatted percentage
 */
export const scoreToPercentage = (score, maxScore = 10) => {
  if (score === null || score === undefined) return '';
  
  const percentage = (score / maxScore) * 100;
  return `${Math.round(percentage)}%`;
}; 