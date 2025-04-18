import React, { useState, useEffect } from 'react';
import { FiX, FiCheck } from 'react-icons/fi';
import { getAffinities, getProperties } from '../../services/apiService';

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
        const affinities = await getAffinities();
        setAvailableAffinities(affinities);
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
    if (score >= 8) return 'text-green-600';
    if (score >= 6) return 'text-yellow-600';
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
        
        {loading && <div className="text-center py-8 text-gray-500">Loading affinities...</div>}
        {error && <div className="text-center py-8 text-red-500">{error}</div>}
        
        {!loading && !error && (
          <>
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">Available affinities:</label>
              <div className="flex flex-wrap gap-2">
                {availableAffinities
                  .filter(affinity => !selectedAffinities.some(selected => selected.id === affinity.id))
                  .map(affinity => (
                    <div
                      key={affinity.id}
                      onClick={() => addToCombination(affinity)}
                      className="affinity-tag cursor-pointer hover:bg-blue-50"
                    >
                      {affinity.name}
                    </div>
                  ))}
              </div>
            </div>
            
            <div className="p-4 bg-gray-50 rounded-lg mb-4">
              <div className="flex justify-between items-center mb-2">
                <label className="text-sm font-medium text-gray-700">Your combination:</label>
                {selectedAffinities.length > 0 && (
                  <button 
                    onClick={clearCombination}
                    className="text-sm text-red-600 hover:text-red-800"
                  >
                    Clear All
                  </button>
                )}
              </div>
              <div className="flex flex-wrap gap-2">
                {selectedAffinities.length === 0 ? (
                  <div className="text-gray-500 italic text-sm">
                    No affinities selected yet. Click on affinities above to add them to your combination.
                  </div>
                ) : (
                  selectedAffinities.map(affinity => (
                    <div
                      key={affinity.id}
                      className="affinity-tag selected flex items-center"
                    >
                      {affinity.name}
                      <button
                        onClick={() => removeFromCombination(affinity)}
                        className="ml-2 text-gray-500 hover:text-gray-700"
                      >
                        <FiX />
                      </button>
                    </div>
                  ))
                )}
              </div>
            </div>
          </>
        )}
      </div>
      
      {/* Combination Analysis */}
      {selectedAffinities.length >= 2 ? (
        <div className="bg-white p-6 rounded-lg shadow mb-6">
          <h3 className="text-lg font-semibold mb-4">Combination Analysis</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-semibold mb-3">Compatibility Score</h4>
              <div className="bg-blue-50 p-4 rounded-md mb-4">
                <div className="flex items-center justify-between">
                  <span className="text-gray-700">Overall Compatibility:</span>
                  <span className="font-bold text-lg">{getCompatibilityScore()}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                  <div 
                    className="h-2 rounded-full bg-blue-500"
                    style={{ width: `${getCompatibilityScore()}%` }}
                  />
                </div>
                <p className="text-sm text-gray-600 mt-2">
                  These affinities work well together and are frequently found in the same properties.
                </p>
              </div>
            </div>
            
            <div>
              <h4 className="font-semibold mb-3">Top Matching Properties</h4>
              <div className="bg-gray-50 p-4 rounded-md">
                {matchingProperties.length === 0 ? (
                  <p className="text-sm text-gray-500">No properties found matching all selected affinities.</p>
                ) : (
                  <div className="space-y-2">
                    {matchingProperties.slice(0, 5).map(property => (
                      <div 
                        key={property.id}
                        className="flex justify-between items-center py-1 cursor-pointer hover:bg-gray-100 rounded px-2"
                      >
                        <span className="text-sm">{property.name}</span>
                        <span className={`text-xs font-medium px-2 py-1 rounded-full ${getScoreClass(property.avgScore)}`}>
                          {property.avgScore.toFixed(1)}/10
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-white p-6 rounded-lg shadow mb-6">
          <div className="text-center py-8 text-gray-500">
            <i className="fas fa-layer-group text-gray-300 text-4xl mb-3"></i>
            <p>Select two or more affinities to see their combination analysis</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default AffinityCombination;