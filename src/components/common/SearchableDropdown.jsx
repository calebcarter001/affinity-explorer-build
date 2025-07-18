import React from 'react';
import Select from 'react-select';

const SearchableDropdown = ({ 
  options, 
  value, 
  onChange, 
  placeholder = "Select an option...", 
  className = "",
  isDisabled = false,
  isLoading = false,
  noOptionsMessage = "No options available",
  formatOptionLabel = null,
  getOptionLabel = null,
  getOptionValue = null,
  ...props 
}) => {
  const customStyles = {
    control: (provided, state) => ({
      ...provided,
      minHeight: '36px',
      maxWidth: '200px',
      minWidth: '150px',
      border: state.isFocused ? '2px solid #3B82F6' : '1px solid #D1D5DB',
      borderRadius: '0.375rem',
      boxShadow: state.isFocused ? '0 0 0 1px #3B82F6' : 'none',
      '&:hover': {
        borderColor: state.isFocused ? '#3B82F6' : '#9CA3AF',
      },
      backgroundColor: 'white',
      cursor: 'pointer',
      fontSize: '0.875rem',
      transition: 'all 0.2s ease',
    }),
    
    placeholder: (provided) => ({
      ...provided,
      color: '#9CA3AF',
      fontSize: '0.875rem',
    }),
    
    singleValue: (provided) => ({
      ...provided,
      color: '#374151',
      fontSize: '0.875rem',
    }),
    
    input: (provided) => ({
      ...provided,
      color: '#374151',
      fontSize: '0.875rem',
    }),
    
    menu: (provided) => ({
      ...provided,
      borderRadius: '0.5rem',
      boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
      border: '1px solid #E5E7EB',
      zIndex: 1000,
      marginTop: '4px',
    }),
    
    menuList: (provided) => ({
      ...provided,
      padding: '4px',
      maxHeight: '200px',
    }),
    
    option: (provided, state) => ({
      ...provided,
      backgroundColor: state.isSelected 
        ? '#3B82F6' 
        : state.isFocused 
        ? '#EBF4FF' 
        : 'white',
      color: state.isSelected 
        ? 'white' 
        : state.isFocused 
        ? '#1E40AF' 
        : '#374151',
      cursor: 'pointer',
      padding: '8px 12px',
      borderRadius: '0.375rem',
      margin: '2px 0',
      fontSize: '0.875rem',
      fontWeight: state.isSelected ? '500' : '400',
      transition: 'all 0.15s ease',
      '&:hover': {
        backgroundColor: state.isSelected ? '#3B82F6' : '#EBF4FF',
        color: state.isSelected ? 'white' : '#1E40AF',
      },
    }),
    
    indicatorSeparator: (provided) => ({
      ...provided,
      backgroundColor: '#E5E7EB',
    }),
    
    dropdownIndicator: (provided, state) => ({
      ...provided,
      color: state.isFocused ? '#3B82F6' : '#9CA3AF',
      padding: '8px',
      '&:hover': {
        color: '#3B82F6',
      },
      transition: 'all 0.15s ease',
    }),
    
    clearIndicator: (provided) => ({
      ...provided,
      color: '#9CA3AF',
      padding: '8px',
      '&:hover': {
        color: '#EF4444',
      },
      transition: 'all 0.15s ease',
    }),
    
    loadingIndicator: (provided) => ({
      ...provided,
      color: '#3B82F6',
    }),
    
    noOptionsMessage: (provided) => ({
      ...provided,
      color: '#9CA3AF',
      fontSize: '0.875rem',
      padding: '12px 16px',
      fontStyle: 'italic',
    }),
  };

  // Build props object conditionally
  const selectProps = {
    options,
    value,
    onChange,
    placeholder,
    styles: customStyles,
    isDisabled,
    isLoading,
    isClearable: false,
    isSearchable: true,
    noOptionsMessage: () => noOptionsMessage,
    className,
    classNamePrefix: "react-select",
    ...props
  };

  // Only add these props if they are functions
  if (typeof formatOptionLabel === 'function') {
    selectProps.formatOptionLabel = formatOptionLabel;
  }
  if (typeof getOptionLabel === 'function') {
    selectProps.getOptionLabel = getOptionLabel;
  }
  if (typeof getOptionValue === 'function') {
    selectProps.getOptionValue = getOptionValue;
  }

  return <Select {...selectProps} />;
};

export default SearchableDropdown; 