import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { FiX, FiCheck, FiSliders } from 'react-icons/fi';
import { getAffinities, getProperties } from '../../services/apiService';
import EmptyStateStyled from '../common/EmptyStateStyled';
import SkeletonLoader from '../common/SkeletonLoader';
import AffinitySelector from './AffinityCombinationParts/AffinitySelector';
import MatchingPropertiesGrid from './AffinityCombinationParts/MatchingPropertiesGrid';

const MAX_AFFINITIES = 4;

const AffinityCombination = () => {
  const [availableAffinities, setAvailableAffinities] = useState([]);
  const [selectedAffinities, setSelectedAffinities] = useState([]);
  const [properties, setProperties] = useState([]);
  const [affinitiesLoading, setAffinitiesLoading] = useState(true);
  const [propertiesLoading, setPropertiesLoading] = useState(false);
  const [error, setError] = useState(null);
  
  // New state for thresholds
  const [thresholds, setThresholds] = useState({});
  const [showThresholds, setShowThresholds] = useState(false);

  // Initialize thresholds when affinities are selected
  useEffect(() => {
    const newThresholds = {};
    selectedAffinities.forEach(affinity => {
      if (!thresholds[affinity.id]) {
        newThresholds[affinity.id] = 0.6; // Default threshold
      } else {
        newThresholds[affinity.id] = thresholds[affinity.id];
      }
    });
    setThresholds(newThresholds);
  }, [selectedAffinities]);

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

  // Updated matchingProperties logic with thresholds and blended scoring
  const matchingProperties = useMemo(() => {
    if (selectedAffinities.length < 2 || !Array.isArray(properties)) {
      return { properties: [], metrics: { total: 0, matching: 0, averageBlendedScore: 0 } };
    }

    try {
      // Filter properties that meet all thresholds
      const filtered = properties.filter(property => {
        if (!Array.isArray(property.affinityScores)) return false;

        const scores = property.affinityScores.filter(score => {
          const matchesAffinity = selectedAffinities.some(aff => aff.id === score.affinityId);
          const meetsThreshold = score.score >= (thresholds[score.affinityId] || 0);
          return matchesAffinity && meetsThreshold;
        });

        return scores.length === selectedAffinities.length;
      });
      
      // Calculate blended scores with weighted importance
      const processedProperties = filtered.map(property => {
        const relevantScores = property.affinityScores.filter(score => 
          selectedAffinities.some(aff => aff.id === score.affinityId)
        );

        // Calculate blended score with exponential weighting
        const blendedScore = relevantScores.reduce((total, score) => {
          const weight = Math.pow(score.score, 2); // Exponential weighting
          return total + (score.score * weight);
        }, 0) / relevantScores.reduce((total, score) => total + Math.pow(score.score, 2), 0);

        return { 
          ...property, 
          blendedScore,
          relevantScores
        };
      }).sort((a, b) => b.blendedScore - a.blendedScore);

      // Calculate metrics
      const metrics = {
        total: properties.length,
        matching: processedProperties.length,
        averageBlendedScore: processedProperties.length > 0
          ? processedProperties.reduce((sum, p) => sum + p.blendedScore, 0) / processedProperties.length
          : 0
      };

      return { properties: processedProperties, metrics };
    } catch (err) {
      return { properties: [], metrics: { total: 0, matching: 0, averageBlendedScore: 0 } };
    }
  }, [properties, selectedAffinities, thresholds]);

  const addToCombination = useCallback((affinity) => {
    if (!affinity?.id) {
      console.warn('Invalid affinity object:', affinity);
      return;
    }
    if (selectedAffinities.length >= MAX_AFFINITIES) {
      setError(`Maximum of ${MAX_AFFINITIES} affinities can be selected`);
      return;
    }
    setSelectedAffinities(prev => [...prev, affinity]);
    setError(null);
  }, [selectedAffinities.length]);

  const removeFromCombination = useCallback((affinity) => {
    if (!affinity?.id) {
      console.warn('Invalid affinity object:', affinity);
      return;
    }
    setSelectedAffinities(prev => prev.filter(a => a.id !== affinity.id));
    setError(null);
  }, []);

  const clearCombination = useCallback(() => {
    setSelectedAffinities([]);
    setError(null);
  }, []);

  const getScoreClass = useCallback((score) => {
    if (typeof score !== 'number') return 'text-gray-600';
    if (score >= 0.8) return 'text-green-600';
    if (score >= 0.6) return 'text-yellow-600';
    return 'text-red-600';
  }, []);

  const handleThresholdChange = useCallback((affinityId, value) => {
    setThresholds(prev => ({
      ...prev,
      [affinityId]: value
    }));
  }, []);

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-6">Affinity Combination Tool</h2>
      
      {/* Combination Builder */}
      <div className="bg-white p-6 rounded-lg shadow mb-6">
        <div className="flex justify-between items-center mb-4">
          <div>
            <h3 className="text-lg font-semibold">Build Your Affinity Combination</h3>
            <p className="text-sm text-gray-500">Select up to {MAX_AFFINITIES} affinities to combine</p>
          </div>
          {selectedAffinities.length >= 2 && (
            <button
              onClick={() => setShowThresholds(!showThresholds)}
              className="flex items-center gap-2 text-sm text-indigo-600 hover:text-indigo-800"
            >
              <FiSliders className="w-4 h-4" />
              {showThresholds ? 'Hide Thresholds' : 'Show Thresholds'}
            </button>
          )}
        </div>
        
        {affinitiesLoading && (
          <div className="py-8">
            <SkeletonLoader type="card" count={3} />
          </div>
        )}
        
        {error && (
          <div className="mb-4">
          <EmptyStateStyled
            type="ERROR"
            message={error}
              actionButton={error.includes('Maximum') ? null : {
              label: 'Try Again',
              onClick: () => window.location.reload()
            }}
          />
          </div>
        )}
        
        {!affinitiesLoading && (
          <>
            <AffinitySelector
              availableAffinities={availableAffinities}
              selectedAffinities={selectedAffinities}
              onAdd={addToCombination}
              onRemove={removeFromCombination}
              onClear={clearCombination}
              maxAffinities={MAX_AFFINITIES}
            />

            {showThresholds && selectedAffinities.length >= 2 && (
              <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                <h4 className="text-sm font-medium text-gray-700 mb-3">Minimum Score Thresholds</h4>
                <div className="space-y-3">
                  {selectedAffinities.map(affinity => (
                    <div key={affinity.id} className="flex items-center gap-4">
                      <span className="text-sm text-gray-600 w-32">{affinity.name}</span>
                      <input
                        type="range"
                        min="0"
                        max="1"
                        step="0.05"
                        value={thresholds[affinity.id] || 0.6}
                        onChange={(e) => handleThresholdChange(affinity.id, parseFloat(e.target.value))}
                        className="flex-1"
                      />
                      <span className="text-sm font-medium w-16">
                        {(thresholds[affinity.id] || 0.6).toFixed(2)}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {selectedAffinities.length >= 2 && (
              <div className="mt-6 p-4 bg-indigo-50 rounded-lg">
                <h4 className="text-sm font-medium text-indigo-900 mb-2">Combination Metrics</h4>
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <div className="text-2xl font-bold text-indigo-700">
                      {matchingProperties.metrics.matching}
                    </div>
                    <div className="text-sm text-indigo-600">Matching Properties</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-indigo-700">
                      {matchingProperties.metrics.averageBlendedScore.toFixed(2)}
                    </div>
                    <div className="text-sm text-indigo-600">Avg Blended Score</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-indigo-700">
                      {((matchingProperties.metrics.matching / matchingProperties.metrics.total) * 100).toFixed(1)}%
                    </div>
                    <div className="text-sm text-indigo-600">Match Rate</div>
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </div>
      
      {/* Matching Properties */}
      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-lg font-semibold mb-4">Matching Properties</h3>
        
        {propertiesLoading ? (
          <SkeletonLoader type="card" count={6} />
        ) : (
          selectedAffinities.length >= 2 ? (
            matchingProperties.properties.length > 0 ? (
          <MatchingPropertiesGrid
                matchingProperties={matchingProperties.properties}
            selectedAffinities={selectedAffinities}
            getScoreClass={getScoreClass}
          />
            ) : (
              <EmptyStateStyled
                type="NO_DATA"
                message="No properties match the selected combination with current thresholds."
              />
            )
          ) : (
            <EmptyStateStyled
              type="INFO"
              message="Select at least two affinities to see matching properties."
            />
          )
        )}
      </div>
    </div>
  );
};

export default AffinityCombination;