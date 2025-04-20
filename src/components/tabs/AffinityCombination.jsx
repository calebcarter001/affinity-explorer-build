import React, { useState, useEffect } from 'react';
import { FiX, FiCheck } from 'react-icons/fi';
import { getAffinities, getProperties } from '../../services/apiService';
import EmptyStateStyled from '../common/EmptyStateStyled';
import SkeletonLoader from '../common/SkeletonLoader';

const AffinityCombination = () => {
  const [availableAffinities, setAvailableAffinities] = useState([]);
  const [selectedAffinities, setSelectedAffinities] = useState([]);
  const [matchingProperties, setMatchingProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        const response = await getAffinities();
        setAvailableAffinities(response.data);
      } catch (err) {
        setError('Failed to load affinities');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  useEffect(() => {
    const analyzeCombo = async () => {
      if (selectedAffinities.length >= 2) {
        try {
          const properties = await getProperties();
          const filtered = properties.filter(property => {
            const scores = property.affinityScores.filter(score => 
              selectedAffinities.some(aff => aff.name === score.name)
            );
            return scores.length === selectedAffinities.length;
          });
          
          // Sort by average score across selected affinities
          const sorted = filtered.map(property => {
            const relevantScores = property.affinityScores.filter(score => 
              selectedAffinities.some(aff => aff.name === score.name)
            );
            const avgScore = relevantScores.reduce((sum, score) => sum + score.score, 0) / relevantScores.length;
            return { ...property, avgScore };
          }).sort((a, b) => b.avgScore - a.avgScore);

          setMatchingProperties(sorted);
        } catch (err) {
          console.error('Failed to analyze combination:', err);
        }
      } else {
        setMatchingProperties([]);
      }
    };

    analyzeCombo();
  }, [selectedAffinities]);

  const addToCombination = (affinity) => {
    setSelectedAffinities(prev => [...prev, affinity]);
  };

  const removeFromCombination = (affinity) => {
    setSelectedAffinities(prev => prev.filter(a => a.id !== affinity.id));
  };

  const clearCombination = () => {
    setSelectedAffinities([]);
  };

  const getScoreClass = (score) => {
    if (score >= 0.8) return 'text-green-600';
    if (score >= 0.6) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getCompatibilityScore = () => {
    if (selectedAffinities.length < 2) return 0;
    // Calculate mock compatibility score between 70-95
    return Math.floor(70 + Math.random() * 25);
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-6">Affinity Combination Tool</h2>
      
      {/* Combination Builder */}
      <div className="bg-white p-6 rounded-lg shadow mb-6">
        <h3 className="text-lg font-semibold mb-4">Build Your Affinity Combination</h3>
        
        {loading && (
          <div className="py-8">
            <SkeletonLoader type="card" count={3} />
          </div>
        )}
        
        {error && (
          <EmptyStateStyled
            type="ERROR"
            actionButton={{
              label: 'Try Again',
              onClick: () => window.location.reload()
            }}
          />
        )}
        
        {!loading && !error && (
          <>
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">Available affinities:</label>
              <div className="flex flex-wrap gap-2">
                {availableAffinities.map(affinity => (
                  <button
                    key={affinity.id}
                    onClick={() => addToCombination(affinity)}
                    disabled={selectedAffinities.some(a => a.id === affinity.id)}
                    className={`px-3 py-1 rounded-full text-sm font-medium ${
                      selectedAffinities.some(a => a.id === affinity.id)
                        ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                        : 'bg-blue-100 text-blue-800 hover:bg-blue-200'
                    }`}
                  >
                    {affinity.name}
                  </button>
                ))}
              </div>
            </div>
            
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">Selected affinities:</label>
              {selectedAffinities.length === 0 ? (
                <EmptyStateStyled
                  type="NO_DATA"
                  title="No Affinities Selected"
                  description="Select at least two affinities to find matching properties"
                />
              ) : (
                <div className="flex flex-wrap gap-2">
                  {selectedAffinities.map(affinity => (
                    <div
                      key={affinity.id}
                      className="flex items-center gap-1 px-3 py-1 rounded-full bg-blue-600 text-white text-sm font-medium"
                    >
                      {affinity.name}
                      <button
                        onClick={() => removeFromCombination(affinity)}
                        className="ml-1 text-white hover:text-gray-200"
                      >
                        <FiX size={14} />
                      </button>
                    </div>
                  ))}
                  {selectedAffinities.length > 0 && (
                    <button
                      onClick={clearCombination}
                      className="px-3 py-1 rounded-full bg-gray-200 text-gray-700 text-sm font-medium hover:bg-gray-300"
                    >
                      Clear All
                    </button>
                  )}
                </div>
              )}
            </div>
            
            {selectedAffinities.length >= 2 && (
              <div className="mb-6">
                <div className="flex items-center justify-between">
                  <h4 className="font-medium">Compatibility Score</h4>
                  <span className="text-lg font-bold text-green-600">{getCompatibilityScore()}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2.5 mt-2">
                  <div
                    className="bg-green-600 h-2.5 rounded-full"
                    style={{ width: `${getCompatibilityScore()}%` }}
                  ></div>
                </div>
                <p className="text-sm text-gray-500 mt-2">
                  This score indicates how well these affinities work together for property matching.
                </p>
              </div>
            )}
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
        ) : matchingProperties.length === 0 ? (
          <EmptyStateStyled
            type="NO_DATA"
            title="No Matching Properties"
            description="No properties match all the selected affinities"
          />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {matchingProperties.map(property => (
              <div key={property.id} className="border rounded-lg p-4">
                <h4 className="font-medium text-gray-900">{property.name}</h4>
                <p className="text-sm text-gray-500 mb-3">{property.address}</p>
                <div className="space-y-2">
                  {property.affinityScores
                    .filter(score => selectedAffinities.some(aff => aff.name === score.name))
                    .map(score => (
                      <div key={score.name} className="flex justify-between items-center">
                        <span className="text-sm">{score.name}</span>
                        <span className={`text-sm font-medium ${getScoreClass(score.score)}`}>
                          {score.score.toFixed(1)}/10
                        </span>
                      </div>
                    ))}
                </div>
                <div className="mt-3 pt-3 border-t">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">Average Score:</span>
                    <span className={`text-sm font-bold ${getScoreClass(property.avgScore)}`}>
                      {property.avgScore.toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AffinityCombination;