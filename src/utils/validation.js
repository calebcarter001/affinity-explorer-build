/**
 * Form validation utility
 * Provides common validation functions for form inputs
 */

// Email validation
export const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// Password validation (at least 8 characters, 1 uppercase, 1 lowercase, 1 number)
export const isValidPassword = (password) => {
  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/;
  return passwordRegex.test(password);
};

// Required field validation
export const isRequired = (value) => {
  if (typeof value === 'string') {
    return value.trim().length > 0;
  }
  return value !== null && value !== undefined;
};

// Minimum length validation
export const hasMinLength = (value, minLength) => {
  if (typeof value === 'string') {
    return value.length >= minLength;
  }
  return false;
};

// Maximum length validation
export const hasMaxLength = (value, maxLength) => {
  if (typeof value === 'string') {
    return value.length <= maxLength;
  }
  return false;
};

// Number range validation
export const isInRange = (value, min, max) => {
  const num = Number(value);
  return !isNaN(num) && num >= min && num <= max;
};

// URL validation
export const isValidUrl = (url) => {
  try {
    new URL(url);
    return true;
  } catch (error) {
    return false;
  }
};

// Phone number validation (simple)
export const isValidPhone = (phone) => {
  const phoneRegex = /^\+?[\d\s-()]{10,}$/;
  return phoneRegex.test(phone);
};

// Date validation
export const isValidDate = (date) => {
  const d = new Date(date);
  return d instanceof Date && !isNaN(d);
};

// Custom validation function
export const validateField = (value, rules) => {
  const errors = [];
  
  for (const rule of rules) {
    const { validator, message } = rule;
    
    if (typeof validator === 'function') {
      if (!validator(value)) {
        errors.push(message);
      }
    } else if (typeof validator === 'string') {
      switch (validator) {
        case 'required':
          if (!isRequired(value)) errors.push(message || 'This field is required');
          break;
        case 'email':
          if (!isValidEmail(value)) errors.push(message || 'Please enter a valid email');
          break;
        case 'password':
          if (!isValidPassword(value)) errors.push(message || 'Password must be at least 8 characters with 1 uppercase, 1 lowercase, and 1 number');
          break;
        case 'url':
          if (!isValidUrl(value)) errors.push(message || 'Please enter a valid URL');
          break;
        case 'phone':
          if (!isValidPhone(value)) errors.push(message || 'Please enter a valid phone number');
          break;
        case 'date':
          if (!isValidDate(value)) errors.push(message || 'Please enter a valid date');
          break;
        default:
          console.warn(`Unknown validation rule: ${validator}`);
      }
    }
  }
  
  return errors;
};

// Form validation helper
export const validateForm = (formData, validationRules) => {
  const errors = {};
  let isValid = true;
  
  for (const field in validationRules) {
    const fieldErrors = validateField(formData[field], validationRules[field]);
    
    if (fieldErrors.length > 0) {
      errors[field] = fieldErrors;
      isValid = false;
    }
  }
  
  return { isValid, errors };
}; 