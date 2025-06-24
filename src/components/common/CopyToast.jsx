import React, { useEffect, useState } from 'react';
import { FiCheck, FiX } from 'react-icons/fi';

const CopyToast = ({ message, type = 'success', duration = 2000, onClose }) => {
  const [isVisible, setIsVisible] = useState(true);
  const [isExiting, setIsExiting] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsExiting(true);
      setTimeout(() => {
        setIsVisible(false);
        onClose?.();
      }, 300); // Animation duration
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, onClose]);

  if (!isVisible) return null;

  const getToastStyles = () => {
    const baseStyles = 'fixed top-4 right-4 z-50 flex items-center gap-2 px-4 py-3 rounded-lg shadow-lg border transition-all duration-300 min-w-48';
    
    const typeStyles = {
      success: 'bg-green-50 border-green-200 text-green-800',
      error: 'bg-red-50 border-red-200 text-red-800',
      info: 'bg-blue-50 border-blue-200 text-blue-800'
    };

    const animationStyles = isExiting 
      ? 'opacity-0 translate-x-full scale-95' 
      : 'opacity-100 translate-x-0 scale-100';

    return `${baseStyles} ${typeStyles[type]} ${animationStyles}`;
  };

  const getIcon = () => {
    switch (type) {
      case 'success':
        return <FiCheck size={16} className="text-green-600 flex-shrink-0" />;
      case 'error':
        return <FiX size={16} className="text-red-600 flex-shrink-0" />;
      default:
        return <FiCheck size={16} className="text-blue-600 flex-shrink-0" />;
    }
  };

  return (
    <div className={getToastStyles()}>
      {getIcon()}
      <span className="text-sm font-medium">{message}</span>
    </div>
  );
};

export default CopyToast; 