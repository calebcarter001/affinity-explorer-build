import React, { useState, useEffect } from 'react';
import { FiSearch, FiCheck, FiClock, FiAlertCircle } from 'react-icons/fi';
import { getAffinities } from '../../services/apiService';

const AffinityLibrary = () => {
  const [affinities, setAffinities] = useState([]);
  const [filteredAffinities, setFilteredAffinities] = useState([]);
  const [selectedAffinity, setSelectedAffinity] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Load affinities when component mounts
  useEffect(() => {
    const loadAffinities = async () => {
      setLoading(true);
      try {
        const data = await getAffinities();
        setAffinities(data);
        setFilteredAffinities(data);
      } catch (err) {
        setError('Failed to load affinities');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    loadAffinities();
  }, []);

  // Filter affinities when search term, category, or status changes
  useEffect(() => {
    let filtered = [...affinities];

    // Apply search filter
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(affinity => 
        affinity.name.toLowerCase().includes(term) || 
        affinity.definition.toLowerCase().includes(term)
      );
    }

    // Apply category filter
    if (categoryFilter !== 'all') {
      filtered = filtered.filter(affinity => affinity.category === categoryFilter);
    }

    // Apply status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter(affinity => affinity.status === statusFilter);
    }

    setFilteredAffinities(filtered);
  }, [affinities, searchTerm, categoryFilter, statusFilter]);

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleCategoryChange = (e) => {
    setCategoryFilter(e.target.value);
  };

  const handleStatusChange = (e) => {
    setStatusFilter(e.target.value);
  };

  const handleAffinityClick = (affinity) => {
    setSelectedAffinity(affinity);
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Validated':
        return <span className="badge badge-validated flex items-center gap-1"><FiCheck /> Active</span>;
      case 'In Enrichment':
        return <span className="badge badge-enrichment flex items-center gap-1"><FiClock /> In Enrichment</span>;
      case 'Scoring':
        return <span className="badge badge-scoring flex items-center gap-1"><FiAlertCircle /> Scoring</span>;
      case 'Discovery':
        return <span className="badge badge-discovery flex items-center gap-1"><FiAlertCircle /> Discovery</span>;
      default:
        return <span className="badge">{status}</span>;
    }
  };

  const getScoreClass = (score) => {
    if (score >= 8) return 'text-green-600';
    if (score >= 6) return 'text-yellow-600';
    return 'text-red-600';
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-6">Affinity Library</h2>
      
      {/* Filters & Search */}
      <div className="bg-white p-4 rounded-lg shadow mb-6">
        <div className="flex flex-wrap items-center justify-between">
          <div className="w-full md:w-auto mb-4 md:mb-0">
            <div className="relative">
              <input 
                type="text" 
                placeholder="Search affinity concepts..." 
                value={searchTerm}
                onChange={handleSearch}
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg w-full md:w-64 focus:outline-none focus:border-blue-500"
              />
              <div className="absolute left-3 top-2.5 text-gray-400">
                <FiSearch />
              </div>
            </div>
          </div>
          
          <div className="flex flex-wrap gap-3">
            <select 
              value={categoryFilter}
              onChange={handleCategoryChange}
              className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:border-blue-500"
            >
              <option value="all">All Categories</option>
              <option value="Family">Family</option>
              <option value="Adults">Adults</option>
              <option value="Premium">Premium</option>
              <option value="Outdoors">Outdoors</option>
              <option value="Location">Location</option>
              <option value="Cultural">Cultural</option>
            </select>
            
            <select 
              value={statusFilter}
              onChange={handleStatusChange}
              className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:border-blue-500"
            >
              <option value="all">All Status</option>
              <option value="Validated">Active</option>
              <option value="In Enrichment">In Enrichment</option>
              <option value="Scoring">Scoring</option>
              <option value="Discovery">Discovery</option>
            </select>
          </div>
        </div>
      </div>
      
      {loading && <div className="text-center py-8 text-gray-500">Loading affinities...</div>}
      {error && <div className="text-center py-8 text-red-500">{error}</div>}
      
      {!loading && !error && filteredAffinities.length === 0 && (
        <div className="text-center py-8 text-gray-500">No affinities found matching your criteria.</div>
      )}
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Affinity Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-1 gap-4 max-h-[600px] overflow-y-auto pr-2">
          {filteredAffinities.map(affinity => (
            <div 
              key={affinity.id}
              onClick={() => handleAffinityClick(affinity)}
              className={`card p-4 ${selectedAffinity?.id === affinity.id ? 'selected' : ''}`}
            >
              <div className="flex justify-between items-start mb-2">
                <h3 className="text-lg font-semibold">{affinity.name}</h3>
                {getStatusBadge(affinity.status)}
              </div>
              
              <p className="text-gray-600 text-sm mb-3">{affinity.definition}</p>
              
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div>
                  <span className="font-medium">Category:</span>
                  <span className="ml-1">{affinity.category}</span>
                </div>
                <div>
                  <span className="font-medium">Type:</span>
                  <span className="ml-1">{affinity.type}</span>
                </div>
                <div>
                  <span className="font-medium">Coverage:</span>
                  <span className="ml-1">{affinity.coverage}%</span>
                </div>
                {affinity.scoreAvailable && (
                  <div>
                    <span className="font-medium">Avg Score:</span>
                    <span className={`ml-1 ${getScoreClass(affinity.avgScore)}`}>
                      {affinity.avgScore.toFixed(1)}/10
                    </span>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
        
        {/* Selected Affinity Details */}
        {selectedAffinity && (
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-xl font-bold">{selectedAffinity.name}</h3>
                <p className="text-gray-600">{selectedAffinity.definition}</p>
              </div>
              {getStatusBadge(selectedAffinity.status)}
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
              <div>
                <h4 className="font-semibold mb-2">Metadata</h4>
                <div className="bg-gray-50 p-4 rounded-md">
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div className="font-medium">Category:</div>
                    <div>{selectedAffinity.category}</div>
                    
                    <div className="font-medium">Type:</div>
                    <div>{selectedAffinity.type}</div>
                    
                    <div className="font-medium">Applicable Entities:</div>
                    <div>{selectedAffinity.applicableEntities.join(', ')}</div>
                    
                    {selectedAffinity.scoreAvailable && (
                      <>
                        <div className="font-medium">Average Score:</div>
                        <div className={getScoreClass(selectedAffinity.avgScore)}>
                          {selectedAffinity.avgScore.toFixed(1)}/10
                        </div>
                      </>
                    )}
                    
                    <div className="font-medium">Coverage:</div>
                    <div>{selectedAffinity.coverage}%</div>
                  </div>
                </div>
              </div>
              
              <div>
                <h4 className="font-semibold mb-2">Usage Guidelines</h4>
                <div className="bg-gray-50 p-4 rounded-md">
                  <p className="text-sm">
                    This affinity can be used to score {selectedAffinity.applicableEntities.join(', ')} entities. 
                    {selectedAffinity.scoreAvailable 
                      ? ' Scores are available and can be used for ranking and filtering.' 
                      : ' Scores are not yet available for this affinity.'}
                  </p>
                </div>
                
                <h4 className="font-semibold mb-2 mt-4">Implementation</h4>
                <div className="bg-gray-50 p-4 rounded-md">
                  <p className="text-sm">
                    To implement this affinity in your application, use the API endpoint:
                  </p>
                  <code className="block bg-gray-100 p-2 rounded mt-2 text-sm font-mono">
                    /api/affinities/{selectedAffinity.id}/score
                  </code>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AffinityLibrary;