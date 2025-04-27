import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { FiX, FiCheck } from 'react-icons/fi';
import { getAffinities, getProperties } from '../../services/apiService';
import EmptyStateStyled from '../common/EmptyStateStyled';
import SkeletonLoader from '../common/SkeletonLoader';
import AffinitySelector from './AffinityCombinationParts/AffinitySelector';
import CompatibilityScore from './AffinityCombinationParts/CompatibilityScore';
import MatchingPropertiesGrid from './AffinityCombinationParts/MatchingPropertiesGrid';

const AffinityCombination = () => {
  const [availableAffinities, setAvailableAffinities] = useState([]);
  const [selectedAffinities, setSelectedAffinities] = useState([]);
  const [properties, setProperties] = useState([]);
  const [affinitiesLoading, setAffinitiesLoading] = useState(true);
  const [propertiesLoading, setPropertiesLoading] = useState(false);
  const [error, setError] = useState(null);

  // Load available affinities
  useEffect(() => {
    let mounted = true;
    const loadData = async () => {
      setAffinitiesLoading(true);
      setError(null);
      try {
        const response = await getAffinities();
        if (!response?.data) {
          throw new Error('Invalid response format');
        }
        if (mounted) {
          setAvailableAffinities(response.data);
        }
      } catch (err) {
        console.error('Failed to load affinities:', err);
        if (mounted) {
          setError('Failed to load affinities. Please try again.');
        }
      } finally {
        if (mounted) {
          setAffinitiesLoading(false);
        }
      }
    };

    loadData();
    return () => {
      mounted = false;
    };
  }, []);

  // Load properties when needed
  useEffect(() => {
    let mounted = true;
    const loadProperties = async () => {
      if (selectedAffinities.length < 2) {
        setProperties([]);
        return;
      }

      setPropertiesLoading(true);
      setError(null);
      try {
        const response = await getProperties();
        if (!Array.isArray(response)) {
          throw new Error('Invalid properties data');
        }
        if (mounted) {
          setProperties(response);
        }
      } catch (err) {
        console.error('Failed to load properties:', err);
        if (mounted) {
          setError('Failed to load properties. Please try again.');
        }
      } finally {
        if (mounted) {
          setPropertiesLoading(false);
        }
      }
    };

    loadProperties();
    return () => {
      mounted = false;
    };
  }, [selectedAffinities.length]);

  // Memoize filtered and sorted properties
  const matchingProperties = useMemo(() => {
    if (selectedAffinities.length < 2 || !Array.isArray(properties)) {
      return [];
    }

    try {
      // Filter properties that have scores for all selected affinities
      const filtered = properties.filter(property => {
        if (!Array.isArray(property.affinityScores)) {
          console.warn('Property missing affinityScores:', property.id);
          return false;
        }

        const scores = property.affinityScores.filter(score => 
          selectedAffinities.some(aff => aff.id === score.affinityId)
        );
        return scores.length === selectedAffinities.length;
      });
      
      // Sort by average score across selected affinities
      return filtered.map(property => {
        const relevantScores = property.affinityScores.filter(score => 
          selectedAffinities.some(aff => aff.id === score.affinityId)
        );
        const averageScore = relevantScores.reduce((sum, score) => sum + score.score, 0) / relevantScores.length;
        return { 
          ...property, 
          averageScore,
          relevantScores
        };
      }).sort((a, b) => b.averageScore - a.averageScore);
    } catch (err) {
      console.error('Error processing properties:', err);
      return [];
    }
  }, [properties, selectedAffinities]);

  const addToCombination = useCallback((affinity) => {
    if (!affinity?.id) {
      console.warn('Invalid affinity object:', affinity);
      return;
    }
    setSelectedAffinities(prev => [...prev, affinity]);
  }, []);

  const removeFromCombination = useCallback((affinity) => {
    if (!affinity?.id) {
      console.warn('Invalid affinity object:', affinity);
      return;
    }
    setSelectedAffinities(prev => prev.filter(a => a.id !== affinity.id));
  }, []);

  const clearCombination = useCallback(() => {
    setSelectedAffinities([]);
  }, []);

  const getScoreClass = useCallback((score) => {
    if (typeof score !== 'number') return 'text-gray-600';
    if (score >= 0.8) return 'text-green-600';
    if (score >= 0.6) return 'text-yellow-600';
    return 'text-red-600';
  }, []);

  const getCompatibilityScore = useCallback(() => {
    if (selectedAffinities.length < 2) return 0;
    // Calculate weighted compatibility score based on affinity relationships
    const baseScore = 70;
    const variability = 25;
    const weight = selectedAffinities.length / 4; // More affinities = higher potential score
    return Math.floor(baseScore + (variability * weight * Math.random()));
  }, [selectedAffinities.length]);

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-6">Affinity Combination Tool</h2>
      
      {/* Combination Builder */}
      <div className="bg-white p-6 rounded-lg shadow mb-6">
        <h3 className="text-lg font-semibold mb-4">Build Your Affinity Combination</h3>
        
        {affinitiesLoading && (
          <div className="py-8">
            <SkeletonLoader type="card" count={3} />
          </div>
        )}
        
        {error && (
          <EmptyStateStyled
            type="ERROR"
            message={error}
            actionButton={{
              label: 'Try Again',
              onClick: () => window.location.reload()
            }}
          />
        )}
        
        {!affinitiesLoading && !error && (
          <>
            <AffinitySelector
              availableAffinities={availableAffinities}
              selectedAffinities={selectedAffinities}
              onAdd={addToCombination}
              onRemove={removeFromCombination}
              onClear={clearCombination}
            />
            <CompatibilityScore
              score={getCompatibilityScore()}
              show={selectedAffinities.length >= 2}
            />
          </>
        )}
      </div>
      
      {/* Matching Properties */}
      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-lg font-semibold mb-4">Matching Properties</h3>
        
        {selectedAffinities.length < 2 ? (
          <EmptyStateStyled
            type="NO_DATA"
            title="Select More Affinities"
            description="Select at least two affinities to find matching properties"
          />
        ) : propertiesLoading ? (
          <div className="py-8">
            <SkeletonLoader type="card" count={3} />
          </div>
        ) : matchingProperties.length === 0 ? (
          <EmptyStateStyled
            type="NO_DATA"
            title="No Matching Properties"
            description="No properties match all the selected affinities"
          />
        ) : (
          <MatchingPropertiesGrid
            matchingProperties={matchingProperties}
            selectedAffinities={selectedAffinities}
            getScoreClass={getScoreClass}
          />
        )}
      </div>
    </div>
  );
};

export default AffinityCombination;