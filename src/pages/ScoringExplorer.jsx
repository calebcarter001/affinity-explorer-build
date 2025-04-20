import React, { useState, useEffect, useRef } from 'react';
import styled from 'styled-components';
import { FiSearch, FiMapPin, FiDownload } from 'react-icons/fi';
import { searchProperties } from '../services/apiService';
import Chart from 'chart.js/auto';

const ScoringExplorer = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [selectedProperty, setSelectedProperty] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const chartRef = useRef(null);
  const chartInstance = useRef(null);
  
  const handleSearch = async () => {
    if (!searchTerm.trim()) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const results = await searchProperties(searchTerm);
      setSearchResults(results);
      setSelectedProperty(null);
    } catch (err) {
      setError('Failed to search properties');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };
  
  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };
  
  const selectProperty = (property) => {
    setSelectedProperty(property);
  };

  useEffect(() => {
    if (selectedProperty && chartRef.current) {
      // Destroy existing chart if it exists
      if (chartInstance.current) {
        chartInstance.current.destroy();
      }

      const ctx = chartRef.current.getContext('2d');
      
      // Create new chart
      chartInstance.current = new Chart(ctx, {
        type: 'radar',
        data: {
          labels: selectedProperty.affinityScores.map(score => score.name),
          datasets: [{
            label: 'Affinity Scores',
            data: selectedProperty.affinityScores.map(score => score.score),
            backgroundColor: 'rgba(74, 108, 247, 0.2)',
            borderColor: 'rgba(74, 108, 247, 1)',
            pointBackgroundColor: 'rgba(74, 108, 247, 1)',
            pointBorderColor: '#fff',
            pointHoverBackgroundColor: '#fff',
            pointHoverBorderColor: 'rgba(74, 108, 247, 1)'
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          scales: {
            r: {
              beginAtZero: true,
              max: 10,
              ticks: {
                stepSize: 2
              }
            }
          }
        }
      });
    }

    return () => {
      if (chartInstance.current) {
        chartInstance.current.destroy();
      }
    };
  }, [selectedProperty]);
  
  return (
    <ExplorerContainer>
      <ExplorerHeader>
        <h1>Scoring Explorer</h1>
        <p>Search for properties and explore their affinity scores</p>
      </ExplorerHeader>
      
      <SearchSection>
        <h2>Find a Property or Destination</h2>
        <SearchContainer>
          <SearchInput 
            type="text" 
            placeholder="Enter property ID, name, or location..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onKeyPress={handleKeyPress}
          />
          <SearchButton onClick={handleSearch} disabled={loading || !searchTerm.trim()}>
            <FiSearch /> Search
          </SearchButton>
        </SearchContainer>
        
        {loading && <LoadingMessage>Searching properties...</LoadingMessage>}
        {error && <ErrorMessage>{error}</ErrorMessage>}
        
        {searchResults.length === 0 && searchTerm && !loading && (
          <NoResults>No property found with that ID or name.</NoResults>
        )}
      </SearchSection>
      
      <ExplorerGrid>
        <SearchResults>
          <h2>Browse Properties</h2>
          <PropertyGrid>
            {searchResults.map(property => (
              <PropertyCard 
                key={property.id} 
                onClick={() => selectProperty(property)}
                selected={selectedProperty?.id === property.id}
              >
                <PropertyName>{property.name}</PropertyName>
                <PropertyLocation><FiMapPin /> {property.location}</PropertyLocation>
                <PropertyId>ID: {property.id}</PropertyId>
                {selectedProperty?.id === property.id && (
                  <ViewButton>View Scores</ViewButton>
                )}
              </PropertyCard>
            ))}
          </PropertyGrid>
        </SearchResults>
        
        {selectedProperty && (
          <PropertyDetail>
            <PropertyHeader>
              <div>
                <h2>{selectedProperty.name}</h2>
                <PropertyLocation><FiMapPin /> {selectedProperty.location}</PropertyLocation>
              </div>
              <PropertyType>{selectedProperty.type}</PropertyType>
            </PropertyHeader>
            
            <ChartContainer>
              <canvas ref={chartRef}></canvas>
            </ChartContainer>
            
            <ScoresSection>
              <h3>Affinity Scores</h3>
              <ScoresList>
                {selectedProperty.affinityScores.map(score => (
                  <ScoreCard key={score.affinityId}>
                    <ScoreName>{score.name}</ScoreName>
                    <ScoreBar>
                      <ScoreFill 
                        style={{ 
                          width: `${score.score * 10}%`,
                          backgroundColor: score.score >= 8 ? '#34a853' : 
                                         score.score >= 6 ? '#fbbc04' : '#ea4335'
                        }} 
                      />
                    </ScoreBar>
                    <ScoreValue className={`${
                      score.score >= 8 ? 'text-green-600' : 
                      score.score >= 6 ? 'text-yellow-600' : 'text-red-600'
                    }`}>
                      {score.score.toFixed(1)}/10
                    </ScoreValue>
                  </ScoreCard>
                ))}
              </ScoresList>
            </ScoresSection>
            
            <AmenitiesSection>
              <h3>Amenities</h3>
              <AmenitiesList>
                {selectedProperty.amenities.map((amenity, index) => (
                  <AmenityTag key={index}>{amenity}</AmenityTag>
                ))}
              </AmenitiesList>
            </AmenitiesSection>

            <ExportSection>
              <ExportButton>
                <FiDownload /> Export Report
              </ExportButton>
            </ExportSection>
          </PropertyDetail>
        )}
      </ExplorerGrid>
    </ExplorerContainer>
  );
};

const ExplorerContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
`;

const ExplorerHeader = styled.div`
  margin-bottom: 2rem;
  
  h1 {
    font-size: 2rem;
    font-weight: 700;
    margin-bottom: 0.5rem;
  }
  
  p {
    color: var(--secondary-color);
  }
`;

const ExplorerGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 2fr;
  gap: 2rem;
  
  @media (max-width: 1024px) {
    grid-template-columns: 1fr;
  }
`;

const SearchSection = styled.section`
  margin-bottom: 2.5rem;
  
  h2 {
    font-size: 1.25rem;
    font-weight: 600;
    margin-bottom: 1rem;
  }
`;

const SearchContainer = styled.div`
  display: flex;
  gap: 0.5rem;
  margin-bottom: 1rem;
  
  @media (max-width: 768px) {
    flex-direction: column;
  }
`;

const SearchInput = styled.input`
  flex: 1;
  padding: 0.75rem 1rem;
  border-radius: 6px;
  border: 1px solid var(--border-color);
  background-color: var(--card-bg-light);
  transition: all 0.3s ease;
  
  .dark & {
    background-color: var(--card-bg-dark);
    border-color: #374151;
    color: var(--light-text);
  }
  
  &:focus {
    outline: none;
    border-color: var(--primary-color);
    box-shadow: 0 0 0 2px rgba(74, 108, 247, 0.1);
  }
`;

const SearchButton = styled.button`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0 1.5rem;
  background-color: var(--primary-color);
  color: white;
  border-radius: 6px;
  font-weight: 500;
  transition: all 0.3s ease;
  
  &:hover:not(:disabled) {
    background-color: #3451c4;
  }
  
  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

const SearchResults = styled.div`
  h2 {
    font-size: 1.25rem;
    font-weight: 600;
    margin-bottom: 1rem;
  }
`;

const PropertyGrid = styled.div`
  display: grid;
  gap: 1rem;
  max-height: 600px;
  overflow-y: auto;
  padding-right: 1rem;
  
  &::-webkit-scrollbar {
    width: 6px;
  }
  
  &::-webkit-scrollbar-track {
    background: var(--card-bg-light);
    border-radius: 3px;
  }
  
  &::-webkit-scrollbar-thumb {
    background: var(--border-color);
    border-radius: 3px;
  }
  
  .dark &::-webkit-scrollbar-track {
    background: var(--card-bg-dark);
  }
`;

const PropertyCard = styled.div`
  background-color: ${props => props.selected ? 'rgba(74, 108, 247, 0.1)' : 'var(--card-bg-light)'};
  border: 1px solid ${props => props.selected ? 'var(--primary-color)' : 'var(--border-color)'};
  border-radius: 8px;
  padding: 1.5rem;
  cursor: pointer;
  transition: all 0.3s ease;
  
  .dark & {
    background-color: ${props => props.selected ? 'rgba(74, 108, 247, 0.1)' : 'var(--card-bg-dark)'};
    border-color: ${props => props.selected ? 'var(--primary-color)' : '#374151'};
  }
  
  &:hover {
    transform: translateY(-3px);
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  }
`;

const PropertyName = styled.h3`
  font-size: 1.1rem;
  font-weight: 600;
  margin-bottom: 0.5rem;
`;

const PropertyLocation = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: var(--secondary-color);
  font-size: 0.9rem;
  margin-bottom: 0.5rem;
`;

const PropertyId = styled.div`
  font-size: 0.8rem;
  color: var(--secondary-color);
`;

const ViewButton = styled.button`
  margin-top: 1rem;
  padding: 0.5rem 1rem;
  background-color: var(--primary-color);
  color: white;
  border-radius: 4px;
  font-size: 0.9rem;
  transition: all 0.3s ease;
  
  &:hover {
    background-color: #3451c4;
  }
`;

const PropertyDetail = styled.div`
  background-color: var(--card-bg-light);
  border-radius: 8px;
  padding: 2rem;
  
  .dark & {
    background-color: var(--card-bg-dark);
  }
`;

const PropertyHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 2rem;
  
  h2 {
    font-size: 1.5rem;
    font-weight: 600;
    margin-bottom: 0.5rem;
  }
`;

const PropertyType = styled.div`
  padding: 0.5rem 1rem;
  background-color: rgba(74, 108, 247, 0.1);
  color: var(--primary-color);
  border-radius: 4px;
  font-size: 0.9rem;
  font-weight: 500;
`;

const ChartContainer = styled.div`
  height: 300px;
  margin-bottom: 2rem;
`;

const ScoresSection = styled.section`
  margin-bottom: 2rem;
  
  h3 {
    font-size: 1.25rem;
    font-weight: 600;
    margin-bottom: 1rem;
  }
`;

const ScoresList = styled.div`
  display: grid;
  gap: 1rem;
`;

const ScoreCard = styled.div`
  background-color: var(--card-bg-light);
  border: 1px solid var(--border-color);
  border-radius: 6px;
  padding: 1rem;
  
  .dark & {
    background-color: var(--card-bg-dark);
    border-color: #374151;
  }
`;

const ScoreName = styled.div`
  font-weight: 500;
  margin-bottom: 0.5rem;
`;

const ScoreBar = styled.div`
  height: 8px;
  background-color: var(--border-color);
  border-radius: 4px;
  overflow: hidden;
  margin-bottom: 0.5rem;
  width: 100%;
`;

const ScoreFill = styled.div`
  height: 100%;
  transition: width 0.3s ease;
  border-radius: 4px;
`;

const ScoreValue = styled.div`
  font-size: 0.9rem;
  font-weight: 500;
  color: var(--secondary-color);
`;

const AmenitiesSection = styled.section`
  margin-bottom: 2rem;
  
  h3 {
    font-size: 1.25rem;
    font-weight: 600;
    margin-bottom: 1rem;
  }
`;

const AmenitiesList = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
`;

const AmenityTag = styled.div`
  padding: 0.5rem 1rem;
  background-color: rgba(74, 108, 247, 0.1);
  color: var(--primary-color);
  border-radius: 4px;
  font-size: 0.9rem;
`;

const ExportSection = styled.div`
  display: flex;
  justify-content: flex-end;
  margin-top: 2rem;
`;

const ExportButton = styled.button`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.5rem;
  background-color: var(--primary-color);
  color: white;
  border-radius: 6px;
  font-weight: 500;
  transition: all 0.3s ease;
  
  &:hover {
    background-color: #3451c4;
  }
`;

const LoadingMessage = styled.div`
  color: var(--secondary-color);
  margin-top: 1rem;
`;

const ErrorMessage = styled.div`
  color: var(--danger-color);
  margin-top: 1rem;
`;

const NoResults = styled.div`
  color: var(--secondary-color);
  margin-top: 1rem;
  text-align: center;
  padding: 2rem;
`;

export default ScoringExplorer; 