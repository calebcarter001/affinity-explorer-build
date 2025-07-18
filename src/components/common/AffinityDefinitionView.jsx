import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faInfoCircle, 
  faCog,
  faChartPie,
  faList 
} from '@fortawesome/free-solid-svg-icons';
import affinityDefinitionService from '../../services/affinityDefinitionService';

const AffinityDefinitionView = ({ affinity }) => {
  const [activeTab, setActiveTab] = useState('overview');
  const [enrichedAffinity, setEnrichedAffinity] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadAffinityData = async () => {
      if (!affinity) return;
      
      setLoading(true);
      try {
        const enriched = await affinityDefinitionService.enrichAffinityData(affinity);
        setEnrichedAffinity(enriched);
      } catch (error) {
        console.error('Failed to load affinity definition:', error);
        setEnrichedAffinity(affinity);
      } finally {
        setLoading(false);
      }
    };

    loadAffinityData();
  }, [affinity]);

  // Get the definition data from the enriched affinity
  const definition = enrichedAffinity?.definitions?.[0];
  const subScores = definition?.subScores || [];

  // Calculate weight distribution from actual sub-scores
  const weightDistribution = subScores.reduce((acc, subScore) => {
    const label = getSubScoreLabel(subScore.urn);
    acc[label] = Math.round(subScore.weight * 100);
    return acc;
  }, {});

  // Get summary statistics
  const summary = enrichedAffinity ? 
    affinityDefinitionService.getDefinitionSummary(enrichedAffinity) : 
    { subScores: 0, totalRules: 0, totalConditions: 0 };

  function getSubScoreLabel(urn) {
    if (!urn) return 'Unknown';
    
    if (urn.includes('review-sentiments')) return 'Review Sentiments';
    if (urn.includes('attribute')) return 'Attributes';
    if (urn.includes('geo')) return 'Geo Location';
    if (urn.includes('images')) return 'Images';
    return 'Unknown';
  }

  const WeightDistributionChart = ({ data }) => {
    const colors = ['#3B82F6', '#10B981', '#F59E0B', '#8B5CF6'];
    const total = Object.values(data).reduce((sum, value) => sum + value, 0);
    
    if (total === 0) {
      return (
        <div className="w-48 h-48 mx-auto flex items-center justify-center bg-gray-100 rounded-full">
          <span className="text-gray-500">No weight data</span>
        </div>
      );
    }
    
    return (
      <div className="relative w-48 h-48 mx-auto">
        <svg viewBox="0 0 200 200" className="w-full h-full">
          <circle
            cx="100"
            cy="100"
            r="80"
            fill="none"
            stroke="#E5E7EB"
            strokeWidth="20"
          />
          {Object.entries(data).map(([key, value], index) => {
            const percentage = (value / total) * 100;
            const strokeDasharray = `${(percentage / 100) * 502.65} 502.65`;
            const strokeDashoffset = -Object.values(data)
              .slice(0, index)
              .reduce((sum, val) => sum + (val / total) * 502.65, 0);
            
            return (
              <circle
                key={key}
                cx="100"
                cy="100"
                r="80"
                fill="none"
                stroke={colors[index]}
                strokeWidth="20"
                strokeDasharray={strokeDasharray}
                strokeDashoffset={strokeDashoffset}
                transform="rotate(-90 100 100)"
              />
            );
          })}
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center">
            <div className="text-2xl font-bold text-gray-800">{total}%</div>
            <div className="text-sm text-gray-600">Total</div>
          </div>
        </div>
      </div>
    );
  };

  const RuleDisplay = ({ rule, subScoreColor }) => {
    const getRuleTypeColor = (type) => {
      switch (type) {
        case 'MUST_HAVE': return 'bg-red-100 border-red-400 text-red-800';
        case 'OPTIONAL': return 'bg-green-100 border-green-400 text-green-800';
        default: return 'bg-gray-100 border-gray-400 text-gray-800';
      }
    };

    return (
      <div className={`border-l-4 p-4 rounded-lg mb-4 ${subScoreColor}`}>
        <div className="flex justify-between items-center mb-3">
          <div className="flex items-center space-x-2">
            <span className={`px-3 py-1 rounded-full text-sm font-medium ${getRuleTypeColor(rule.type)}`}>
              {rule.type}
            </span>
            <span className="text-sm font-medium">{rule.description}</span>
          </div>
          <span className={`px-3 py-1 rounded-full text-sm font-medium ${getRuleTypeColor(rule.logicalOperator)}`}>
            {rule.logicalOperator} Logic
          </span>
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          {rule.conditions?.map((condition, index) => (
            <div key={index} className="bg-white p-3 rounded border">
              <div className="flex justify-between items-start mb-2">
                <span className="text-sm font-medium text-gray-800">
                  {condition.lhs?.label || 'Unknown'}
                </span>
                <div className="text-right">
                  <div className="text-xs text-gray-600">Weight: {condition.weight}</div>
                  {condition.penalty > 0 && (
                    <div className="text-xs text-red-600">Penalty: {condition.penalty}</div>
                  )}
                </div>
              </div>
              <div className="text-xs text-gray-500">
                <div>URN: {condition.lhs?.urn}</div>
                <div>Source: {condition.lhs?.source}</div>
                <div>Operator: {condition.operator}</div>
                {condition.rhs && (
                  <div>Value: {condition.rhs.value} {condition.rhs.type}</div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex justify-center items-center h-32">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
        </div>
      </div>
    );
  }

  if (!enrichedAffinity) {
    return (
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="text-center text-gray-500">
          No affinity data available
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm mb-6">
      <div className="border-b border-gray-200">
        <nav className="flex space-x-8 px-6">
          {[
            { id: 'overview', label: 'Affinity Overview', icon: faInfoCircle },
            { id: 'weights', label: 'SubScores Weight Distribution', icon: faChartPie },
            { id: 'rules', label: 'Rules Summary', icon: faList }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === tab.id
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <FontAwesomeIcon icon={tab.icon} className="mr-2" />
              {tab.label}
            </button>
          ))}
        </nav>
      </div>

      <div className="p-6">
        {activeTab === 'overview' && (
          <div className="space-y-6">
            {/* Affinity Overview */}
            <div className="bg-blue-50 p-6 rounded-lg">
              <div className="flex items-center space-x-2 mb-4">
                <FontAwesomeIcon icon={faInfoCircle} className="text-blue-500" />
                <h4 className="text-lg font-medium text-gray-800">Affinity Overview</h4>
              </div>
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Affinity URN</label>
                  <div className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50 text-gray-800">
                    {enrichedAffinity.urn || 'Not specified'}
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Display Label</label>
                  <div className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50 text-gray-800">
                    {enrichedAffinity.label || enrichedAffinity.name || 'Not specified'}
                  </div>
                </div>
              </div>
            </div>

            {/* Context Configuration */}
            <div className="bg-gray-50 p-6 rounded-lg">
              <div className="flex items-center space-x-2 mb-4">
                <FontAwesomeIcon icon={faCog} className="text-gray-500" />
                <h4 className="text-lg font-medium text-gray-800">Context Configuration</h4>
              </div>
              <div className="grid grid-cols-4 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Entity Type</label>
                  <div className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50 text-gray-800">
                    {definition?.context?.entityType || 'Property'}
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Brand</label>
                  <div className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50 text-gray-800">
                    {definition?.context?.brand || 'All'}
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Lodging Type</label>
                  <div className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50 text-gray-800">
                    {definition?.context?.lodgingType || 'Any'}
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                  <div className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50 text-gray-800">
                    {definition?.status || 'Active'}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'weights' && (
          <div>
            <h4 className="text-lg font-medium text-gray-800 mb-4">Weight Distribution</h4>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <WeightDistributionChart data={weightDistribution} />
              <div className="space-y-4">
                {Object.entries(weightDistribution).map(([key, value], index) => {
                  const colors = ['#3B82F6', '#10B981', '#F59E0B', '#8B5CF6'];
                  const subScore = subScores.find(s => getSubScoreLabel(s.urn) === key);
                  
                  return (
                    <div key={key} className="bg-gray-50 p-4 rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center space-x-2">
                          <div 
                            className="w-4 h-4 rounded"
                            style={{ backgroundColor: colors[index] }}
                          ></div>
                          <span className="font-medium text-gray-800">{key}</span>
                        </div>
                        <span className="text-lg font-bold text-gray-800">{value}%</span>
                      </div>
                      <div className="text-sm text-gray-600">
                        <div>URN: {subScore?.urn || 'Not specified'}</div>
                        <div>Formula: {subScore?.formula?.name || 'WEIGHTED_AVERAGE_SCORE'}</div>
                        <div>Rules: {subScore?.rules?.length || 0}</div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'rules' && (
          <div className="space-y-6">
            <div className="grid grid-cols-4 gap-4 mb-6">
              <div className="bg-blue-50 p-4 rounded-lg text-center">
                <div className="text-2xl font-bold text-blue-600">{summary.subScores}</div>
                <div className="text-sm text-gray-600">SubScores</div>
              </div>
              <div className="bg-green-50 p-4 rounded-lg text-center">
                <div className="text-2xl font-bold text-green-600">{summary.totalRules}</div>
                <div className="text-sm text-gray-600">Total Rules</div>
              </div>
              <div className="bg-yellow-50 p-4 rounded-lg text-center">
                <div className="text-2xl font-bold text-yellow-600">{summary.totalConditions}</div>
                <div className="text-sm text-gray-600">Conditions</div>
              </div>
              <div className="bg-purple-50 p-4 rounded-lg text-center">
                <div className="text-2xl font-bold text-purple-600">{summary.mustHaveRules}</div>
                <div className="text-sm text-gray-600">Must Have Rules</div>
              </div>
            </div>

            {/* Rules by SubScore */}
            {subScores.map((subScore, index) => {
              const colors = ['bg-blue-50 border-blue-400', 'bg-green-50 border-green-400', 'bg-yellow-50 border-yellow-400', 'bg-purple-50 border-purple-400'];
              const label = getSubScoreLabel(subScore.urn);
              
              return (
                <div key={subScore.urn} className={`border-l-4 p-6 rounded-lg ${colors[index]}`}>
                  <div className="flex justify-between items-center mb-4">
                    <h5 className="text-lg font-semibold text-gray-800">{label} ({Math.round(subScore.weight * 100)}% weight)</h5>
                    <div className="text-sm text-gray-600">
                      {subScore.rules?.length || 0} rules, URN: {subScore.urn}
                    </div>
                  </div>
                  
                  {subScore.rules?.map((rule, ruleIndex) => (
                    <RuleDisplay 
                      key={ruleIndex} 
                      rule={rule} 
                      subScoreColor={colors[index]}
                    />
                  ))}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

AffinityDefinitionView.propTypes = {
  affinity: PropTypes.object.isRequired
};

export default AffinityDefinitionView; 