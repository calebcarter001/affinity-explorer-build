import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { FiX } from 'react-icons/fi';

const FilterPanel = ({ filters, onFilterChange }) => {
  const [localFilters, setLocalFilters] = useState(filters);
  
  useEffect(() => {
    setLocalFilters(filters);
  }, [filters]);
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    const updatedFilters = {
      ...localFilters,
      [name]: value
    };
    setLocalFilters(updatedFilters);
  };
  
  const handleRangeChange = (e) => {
    const { name, value } = e.target;
    const numValue = parseInt(value, 10);
    const updatedFilters = {
      ...localFilters,
      [name]: numValue
    };
    setLocalFilters(updatedFilters);
  };
  
  const handleApply = () => {
    onFilterChange(localFilters);
  };
  
  const handleReset = () => {
    const resetFilters = {
      status: '',
      category: '',
      minScore: 0,
      minCoverage: 0
    };
    setLocalFilters(resetFilters);
    onFilterChange(resetFilters);
  };
  
  return (
    <FilterContainer>
      <FilterSection>
        <FilterLabel>Status</FilterLabel>
        <FilterSelect 
          name="status" 
          value={localFilters.status} 
          onChange={handleChange}
        >
          <option value="">All Statuses</option>
          <option value="Proposed">Proposed</option>
          <option value="In Development">In Development</option>
          <option value="Validation">Validation</option>
          <option value="Validated">Validated</option>
          <option value="Deprecated">Deprecated</option>
        </FilterSelect>
      </FilterSection>
      
      <FilterSection>
        <FilterLabel>Category</FilterLabel>
        <FilterSelect 
          name="category" 
          value={localFilters.category} 
          onChange={handleChange}
        >
          <option value="">All Categories</option>
          <option value="Amenities">Amenities</option>
          <option value="Experience">Experience</option>
          <option value="Quality">Quality</option>
          <option value="Location">Location</option>
          <option value="Purpose">Purpose</option>
          <option value="Sustainability">Sustainability</option>
          <option value="Character">Character</option>
          <option value="Value">Value</option>
        </FilterSelect>
      </FilterSection>
      
      <FilterSection>
        <FilterLabel>Min Score: {localFilters.minScore}</FilterLabel>
        <RangeInput 
          type="range" 
          name="minScore" 
          min="0" 
          max="10" 
          step="0.5"
          value={localFilters.minScore} 
          onChange={handleRangeChange}
        />
      </FilterSection>
      
      <FilterSection>
        <FilterLabel>Min Coverage: {localFilters.minCoverage}%</FilterLabel>
        <RangeInput 
          type="range" 
          name="minCoverage" 
          min="0" 
          max="100" 
          step="5"
          value={localFilters.minCoverage} 
          onChange={handleRangeChange}
        />
      </FilterSection>
      
      <ButtonGroup>
        <ApplyButton onClick={handleApply}>Apply Filters</ApplyButton>
        <ResetButton onClick={handleReset}>Reset</ResetButton>
      </ButtonGroup>
    </FilterContainer>
  );
};

const FilterContainer = styled.div`
  background-color: var(--card-bg-light);
  border-radius: 8px;
  padding: 1.5rem;
  margin-bottom: 1.5rem;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1.5rem;
  
  .dark & {
    background-color: var(--card-bg-dark);
  }
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const FilterSection = styled.div``;

const FilterLabel = styled.label`
  display: block;
  font-size: 0.875rem;
  font-weight: 500;
  margin-bottom: 0.5rem;
`;

const FilterSelect = styled.select`
  width: 100%;
  padding: 0.5rem;
  border-radius: 6px;
  border: 1px solid var(--border-color);
  background-color: var(--card-bg-light);
  transition: all 0.3s ease;
  
  .dark & {
    background-color: #374151;
    border-color: #4b5563;
    color: var(--light-text);
  }
  
  &:focus {
    outline: none;
    border-color: var(--primary-color);
  }
`;

const RangeInput = styled.input`
  width: 100%;
  -webkit-appearance: none;
  height: 6px;
  border-radius: 5px;
  background: var(--border-color);
  outline: none;
  
  .dark & {
    background: #4b5563;
  }
  
  &::-webkit-slider-thumb {
    -webkit-appearance: none;
    appearance: none;
    width: 18px;
    height: 18px;
    border-radius: 50%;
    background: var(--primary-color);
    cursor: pointer;
  }
  
  &::-moz-range-thumb {
    width: 18px;
    height: 18px;
    border-radius: 50%;
    background: var(--primary-color);
    cursor: pointer;
    border: none;
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 1rem;
  
  @media (max-width: 768px) {
    grid-column: 1 / -1;
  }
`;

const ApplyButton = styled.button`
  flex: 1;
  padding: 0.5rem 1rem;
  background-color: var(--primary-color);
  color: white;
  border-radius: 6px;
  font-weight: 500;
  transition: all 0.3s ease;
  
  &:hover {
    background-color: #3451c4;
  }
`;

const ResetButton = styled.button`
  padding: 0.5rem 1rem;
  background-color: transparent;
  border: 1px solid var(--border-color);
  border-radius: 6px;
  font-weight: 500;
  transition: all 0.3s ease;
  
  .dark & {
    border-color: #4b5563;
  }
  
  &:hover {
    background-color: ${props => props.theme === 'dark' ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.05)'};
  }
`;

export default FilterPanel; 