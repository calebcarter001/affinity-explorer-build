import React, { useState } from 'react';
import { FiCopy, FiCheck } from 'react-icons/fi';
import { useCopyToClipboard } from '../../hooks/useCopyToClipboard';
import { formatInsight, formatCompleteTheme } from '../../utils/insightFormatters';
import { useToastManager } from '../../hooks/useToastManager';
import CopyToast from './CopyToast';

const CopyInsightButton = ({ 
  insight, 
  format = 'plain', 
  context = {},
  size = 'sm',
  showLabel = false,
  className = '',
  variant = 'default' // 'default', 'minimal', 'outlined'
}) => {
  const { copyToClipboard, isSuccess, isCopying } = useCopyToClipboard();
  const [showTooltip, setShowTooltip] = useState(false);
  const { toasts, showSuccess, showError, removeToast, addToast } = useToastManager();

  const handleCopy = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    try {
      let textToCopy = '';
      
      // Check if this is a complete theme copy (theme object in insight)
      if (insight?.theme && typeof insight.theme === 'object') {
        textToCopy = formatCompleteTheme(insight.theme, format);
      } else {
        // Regular insight copying using the main formatInsight function
        textToCopy = formatInsight(insight, format, context);
      }

      const success = await copyToClipboard(textToCopy);
      
      if (success) {
        // Determine the content type for the toast
        const contentType = insight?.theme ? 'Complete Theme' : (insight?.label || context?.field || 'Content');
        
        addToast(`${contentType} copied successfully!`, 'success', 2000);
      } else {
        addToast('Failed to copy to clipboard', 'error', 3000);
      }
    } catch (err) {
      console.error('Copy failed:', err);
      addToast('Copy operation failed', 'error', 3000);
    }
  };

  const getButtonClasses = () => {
    const baseClasses = 'inline-flex items-center gap-1 transition-all duration-200 relative';
    const sizeClasses = {
      xs: 'px-1 py-0.5 text-xs',
      sm: 'px-2 py-1 text-xs',
      md: 'px-3 py-1.5 text-sm',
      lg: 'px-4 py-2 text-base'
    };
    
    const variantClasses = {
      default: 'bg-gray-100 hover:bg-gray-200 text-gray-600 hover:text-gray-800 rounded',
      minimal: 'bg-transparent hover:bg-gray-100 text-gray-500 hover:text-gray-700 rounded',
      outlined: 'bg-transparent border border-gray-300 hover:border-gray-400 text-gray-600 hover:text-gray-800 rounded'
    };

    return `${baseClasses} ${sizeClasses[size]} ${variantClasses[variant]} ${className}`;
  };

  const getIcon = () => {
    const iconSize = size === 'xs' ? 10 : size === 'sm' ? 12 : size === 'md' ? 14 : 16;
    
    if (isSuccess) {
      return <FiCheck size={iconSize} className="text-green-600" />;
    }
    
    return <FiCopy size={iconSize} />;
  };

  return (
    <>
      <div 
        className="relative inline-block"
        onMouseEnter={() => setShowTooltip(true)}
        onMouseLeave={() => setShowTooltip(false)}
      >
        <button
          onClick={handleCopy}
          className={getButtonClasses()}
          disabled={isCopying}
          title={`Copy ${context.field || 'insight'}`}
        >
          {getIcon()}
          {showLabel && (
            <span>
              {isCopying ? 'Copying...' : isSuccess ? 'Copied!' : 'Copy'}
            </span>
          )}
        </button>
        
        {/* Tooltip */}
        {showTooltip && !showLabel && (
          <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-1 px-2 py-1 bg-gray-800 text-white text-xs rounded whitespace-nowrap z-10">
            {isCopying ? 'Copying...' : isSuccess ? 'Copied!' : `Copy ${context.field || 'insight'}`}
            <div className="absolute top-full left-1/2 transform -translate-x-1/2 border-2 border-transparent border-t-gray-800"></div>
          </div>
        )}
      </div>
      
      {/* Toast notifications */}
      {toasts.map(toast => (
        <CopyToast
          key={toast.id}
          message={toast.message}
          type={toast.type}
          duration={toast.duration}
          onClose={() => removeToast(toast.id)}
        />
      ))}
    </>
  );
};

export default CopyInsightButton; 