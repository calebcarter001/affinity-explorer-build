import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faSearch, 
  faPlus, 
  faSave, 
  faEye, 
  faDownload,
  faCheckCircle,
  faExclamationTriangle,
  faCog,
  faChartPie,
  faCode,
  faList,
  faInfoCircle,
  faTrash,
  faEdit
} from '@fortawesome/free-solid-svg-icons';
import affinityDefinitionService from '../../services/affinityDefinitionService';
import SearchableDropdown from '../common/SearchableDropdown';

const AffinityConfigurationStudio = () => {
  const [selectedAffinity, setSelectedAffinity] = useState(null);
  const [activeTab, setActiveTab] = useState('Basic Info');
  const [loading, setLoading] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [showTemplateGallery, setShowTemplateGallery] = useState(false);
  const [saveMessage, setSaveMessage] = useState(null);
  const [affinityData, setAffinityData] = useState(null);
  const [availableAffinities, setAvailableAffinities] = useState([]);

  // Updated affinity templates with all 17 definitions
  const mockAffinityTemplates = [
    { id: 'family-friendly', label: 'Family Friendly', urn: 'urn:expe:taxo:insights:family-friendly', description: 'Properties suitable for families with children', icon: '👨‍👩‍👧‍👦', category: 'Lifestyle' },
    { id: 'pet-friendly', label: 'Pet Friendly', urn: 'urn:expe:taxo:insights:pet-friendly', description: 'Properties that welcome pets', icon: '🐕', category: 'Lifestyle' },
    { id: 'wellness', label: 'Wellness', urn: 'urn:expe:taxo:insights:wellness-and-beauty:wellness', description: 'Health and wellness focused properties', icon: '🧘', category: 'Lifestyle' },
    { id: 'luxury', label: 'Luxury', urn: 'urn:expe:taxo:insights:luxury', description: 'High-end luxury accommodations', icon: '💎', category: 'Quality' },
    { id: 'beachfront', label: 'Beachfront', urn: 'urn:expe:taxo:insights:beachfront', description: 'Properties directly on the beach', icon: '🏖️', category: 'Location' },
    { id: 'near-the-beach', label: 'Near The Beach', urn: 'urn:expe:taxo:insights:near-the-beach', description: 'Properties close to beach access', icon: '🌊', category: 'Location' },
    { id: 'cabins', label: 'Cabins', urn: 'urn:expe:taxo:insights:cabins', description: 'Rustic cabin-style accommodations', icon: '🏕️', category: 'Property Type' },
    { id: 'homes', label: 'Homes', urn: 'urn:expe:taxo:insights:homes', description: 'Residential home properties', icon: '🏠', category: 'Property Type' },
    { id: 'mountains', label: 'Mountains', urn: 'urn:expe:taxo:insights:mountains', description: 'Mountain location properties', icon: '⛰️', category: 'Location' },
    { id: 'lake', label: 'Lake', urn: 'urn:expe:taxo:insights:lake', description: 'Properties near or on lakes', icon: '🏞️', category: 'Location' },
    { id: 'national-parks', label: 'National Parks', urn: 'urn:expe:taxo:insights:national-parks', description: 'Properties near national parks', icon: '🌲', category: 'Location' },
    { id: 'pools', label: 'Pools', urn: 'urn:expe:taxo:insights:pools', description: 'Properties with pool amenities', icon: '🏊', category: 'Amenities' },
    { id: 'ski', label: 'Ski', urn: 'urn:expe:taxo:insights:ski', description: 'Ski resort and winter sports properties', icon: '⛷️', category: 'Activities' },
    { id: 'snow-season', label: 'Snow Season', urn: 'urn:expe:taxo:insights:snow-season', description: 'Winter season properties', icon: '❄️', category: 'Seasonal' },
    { id: 'spa', label: 'Spa', urn: 'urn:expe:taxo:insights:spa', description: 'Properties with spa services', icon: '💆', category: 'Amenities' },
    { id: 'trending', label: 'Trending', urn: 'urn:expe:taxo:insights:trending', description: 'Currently popular properties', icon: '📈', category: 'Popular' },
    { id: 'wine-country', label: 'Wine Country', urn: 'urn:expe:taxo:insights:wine-country', description: 'Properties in wine regions', icon: '🍷', category: 'Location' }
  ];

  // State for user's existing affinity definitions
  const [userDefinitions, setUserDefinitions] = useState([
    {
      id: 'my-family-friendly',
      label: 'My Family Friendly Configuration',
      baseTemplate: 'family-friendly',
      urn: 'urn:expe:taxo:insights:family-friendly',
      status: 'Draft',
      lastModified: '2024-01-15',
      version: '1.2'
    }
  ]);

  // Load available affinities on component mount
  useEffect(() => {
    const loadAvailableAffinities = async () => {
      try {
        const affinities = await affinityDefinitionService.getAvailableAffinities();
        setAvailableAffinities(affinities);
        console.log('Available affinities:', affinities);
        
        // Test loading a specific definition
        if (affinities.length > 0) {
          const testDefinition = await affinityDefinitionService.getDefinition('family-friendly');
          console.log('Test definition loaded for family-friendly:', testDefinition);
        }
      } catch (error) {
        console.error('Failed to load available affinities:', error);
      }
    };

    loadAvailableAffinities();
  }, []);

  // Clear save message after 3 seconds
  useEffect(() => {
    if (saveMessage) {
      const timer = setTimeout(() => {
        setSaveMessage(null);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [saveMessage]);

  const handleTemplateSelect = async (template) => {
    setSelectedAffinity(template.id);
    setLoading(true);
    
    console.log('Loading template:', template.id);
    
    try {
      // Get the actual definition from the service
      const definition = await affinityDefinitionService.getDefinition(template.id);
      
      console.log('Loaded definition:', definition);
      
      if (definition && definition.definitions && definition.definitions.length > 0) {
        // Use the actual definition data
        const summary = affinityDefinitionService.getDefinitionSummary(definition);
        
        console.log('Definition summary:', summary);
        
        const enrichedAffinityData = {
          label: definition.label,
          urn: definition.urn,
          status: 'Draft',
          entityType: definition.definitions[0]?.context?.entityType || 'Property',
          brand: definition.definitions[0]?.context?.brand || 'All Brands',
          lodgingType: definition.definitions[0]?.context?.lodgingType || 'All Types',
          version: definition.definitions[0]?.context?.version || '1.0',
          subScores: summary.subScores,
          totalRules: summary.totalRules,
          conditions: summary.totalConditions,
          weightDistribution: summary.weightDistribution,
          definitions: definition.definitions, // Include full definition data
          testResults: {
            samplePropertiesTested: 150,
            averageScore: 0.78,
            propertiesMatching: 42,
            confidenceScore: 0.85
          }
        };
        
        console.log('Setting enriched affinity data:', enrichedAffinityData);
        setAffinityData(enrichedAffinityData);
      } else {
        console.log('No definition found, using template fallback with mock definition');
        
        // Create mock definition structure for family-friendly as fallback
        const mockDefinition = {
          context: {
            entityType: 'property',
            brand: 'all',
            lodgingType: 'Any',
            version: '1'
          },
          subScores: [
            {
              urn: 'urn:expe:taxo:insights:affinity-score:review-sentiments',
              weight: 0.35,
              rules: [
                {
                  type: 'OPTIONAL',
                  description: 'Must have one of these concepts',
                  logicalOperator: 'OR',
                  conditions: [
                    { lhs: { urn: 'urn:expe:taxo:review-sentiments:outdoor-space', source: 'review-sentiments', label: 'Outdoor space' }, operator: 'EXISTS', rhs: null, weight: 0.3, penalty: 0.1, metadata: {} },
                    { lhs: { urn: 'urn:expe:taxo:review-sentiments:game-room-sentiment', source: 'review-sentiments', label: 'Game room' }, operator: 'EXISTS', rhs: null, weight: 0.8, penalty: 0.1, metadata: {} }
                  ]
                }
              ]
            },
            {
              urn: 'urn:expe:taxo:insights:affinity-score:attribute',
              weight: 0.30,
              rules: [
                {
                  type: 'MUST_HAVE',
                  description: 'Must have one of these concepts',
                  logicalOperator: 'OR',
                  conditions: [
                    { lhs: { urn: 'urn:expediagroup:taxonomies:acs:#bc3c31e7-efd5-4404-becc-d8197c00914b', source: 'attribute', label: 'Bedroom' }, operator: 'EXISTS', rhs: null, weight: 0.8, penalty: 0.1, metadata: {} },
                    { lhs: { urn: 'urn:expediagroup:taxonomies:acs:#8da07f4b-0682-4d6d-bd8c-9e5a5d68fdb5', source: 'attribute', label: 'Kitchen' }, operator: 'EXISTS', rhs: null, weight: 0.9, penalty: 0.1, metadata: {} }
                  ]
                }
              ]
            }
          ]
        };
        
        // Fallback to template data with mock definition
        const templateAffinityData = {
          label: template.label,
          urn: template.urn,
          status: 'Draft',
          entityType: 'Property',
          brand: 'All Brands',
          lodgingType: 'All Types',
          version: '1.0',
          subScores: 2,
          totalRules: 2,
          conditions: 4,
          weightDistribution: {
            'Review Sentiments': 35,
            'Attributes': 30,
            'Images': 20,
            'Geo Location': 15
          },
          definitions: [mockDefinition], // Include mock definition
          testResults: {
            samplePropertiesTested: 150,
            averageScore: 0.78,
            propertiesMatching: 42,
            confidenceScore: 0.85
          }
        };
        setAffinityData(templateAffinityData);
      }
    } catch (error) {
      console.error('Failed to load template definition:', error);
      
      // Create more comprehensive mock definition for error case
      const mockDefinition = {
        context: {
          entityType: 'property',
          brand: 'all',
          lodgingType: 'Any',
          version: '1'
        },
        subScores: [
          {
            urn: 'urn:expe:taxo:insights:affinity-score:review-sentiments',
            weight: 0.35,
            rules: [
              {
                type: 'OPTIONAL',
                description: 'Sample rule - data loading failed',
                logicalOperator: 'OR',
                conditions: [
                  { lhs: { urn: 'urn:sample:condition', source: 'review-sentiments', label: 'Sample condition' }, operator: 'EXISTS', rhs: null, weight: 0.5, penalty: 0.1, metadata: {} }
                ]
              }
            ]
          }
        ]
      };
      
      // Use fallback data with mock definition
      const fallbackData = {
        label: template.label,
        urn: template.urn,
        status: 'Draft',
        entityType: 'Property',
        brand: 'All Brands',
        lodgingType: 'All Types',
        version: '1.0',
        subScores: 1,
        totalRules: 1,
        conditions: 1,
        weightDistribution: {
          'Review Sentiments': 100
        },
        definitions: [mockDefinition], // Include mock definition even in error case
        testResults: {
          samplePropertiesTested: 0,
          averageScore: 0,
          propertiesMatching: 0,
          confidenceScore: 0
        }
      };
      setAffinityData(fallbackData);
    } finally {
      setLoading(false);
      setIsEditMode(true);
      setShowTemplateGallery(false);
    }
  };

  const handleUserDefinitionSelect = (definition) => {
    setSelectedAffinity(definition.baseTemplate);
    
    // Load the user's existing definition data
    const userAffinityData = {
      label: definition.label,
      urn: definition.urn,
      status: 'Draft', // Always set to Draft when editing starts
      entityType: 'Property',
      brand: 'All Brands',
      lodgingType: 'All Types',
      version: definition.version,
      subScores: 4,
      totalRules: 8,
      conditions: 12,
      weightDistribution: {
        'Review Sentiments': 35,
        'Attributes': 30,
        'Images': 20,
        'Geo Location': 15
      },
      testResults: {
        samplePropertiesTested: 150,
        averageScore: 0.78,
        propertiesMatching: 42,
        confidenceScore: 0.85
      }
    };
    
    setAffinityData(userAffinityData);
    setIsEditMode(true);
  };

  const handleSaveDraft = () => {
    if (affinityData) {
      // Update the status to 'Draft' when Save Draft is clicked
      const updatedAffinityData = {
        ...affinityData,
        status: 'Draft',
        lastModified: new Date().toISOString().split('T')[0]
      };
      setAffinityData(updatedAffinityData);
      
      // Create a new user definition or update existing one
      const newDefinition = {
        id: `${selectedAffinity}-${Date.now()}`,
        label: updatedAffinityData.label,
        baseTemplate: selectedAffinity,
        urn: updatedAffinityData.urn,
        status: updatedAffinityData.status,
        lastModified: updatedAffinityData.lastModified,
        version: updatedAffinityData.version
      };
      
      // Check if this is an update to an existing definition
      const existingIndex = userDefinitions.findIndex(def => 
        def.baseTemplate === selectedAffinity && def.urn === updatedAffinityData.urn
      );
      
      if (existingIndex !== -1) {
        // Update existing definition
        const updatedDefinitions = [...userDefinitions];
        updatedDefinitions[existingIndex] = { ...updatedDefinitions[existingIndex], ...newDefinition };
        setUserDefinitions(updatedDefinitions);
      } else {
        // Add new definition
        setUserDefinitions(prev => [...prev, newDefinition]);
      }
      
      // Exit edit mode and show success feedback
      setIsEditMode(false);
      setSaveMessage({ type: 'success', text: 'Configuration saved as draft successfully!' });
      
      console.log('Affinity saved as draft:', updatedAffinityData);
    }
  };

  const handleStage = () => {
    if (affinityData) {
      // Update the status to 'Staged' when Stage is clicked
      const updatedAffinityData = {
        ...affinityData,
        status: 'Staged',
        lastModified: new Date().toISOString().split('T')[0]
      };
      setAffinityData(updatedAffinityData);
      
      // Create a new user definition or update existing one
      const newDefinition = {
        id: `${selectedAffinity}-${Date.now()}`,
        label: updatedAffinityData.label,
        baseTemplate: selectedAffinity,
        urn: updatedAffinityData.urn,
        status: updatedAffinityData.status,
        lastModified: updatedAffinityData.lastModified,
        version: updatedAffinityData.version
      };
      
      // Check if this is an update to an existing definition
      const existingIndex = userDefinitions.findIndex(def => 
        def.baseTemplate === selectedAffinity && def.urn === updatedAffinityData.urn
      );
      
      if (existingIndex !== -1) {
        // Update existing definition
        const updatedDefinitions = [...userDefinitions];
        updatedDefinitions[existingIndex] = { ...updatedDefinitions[existingIndex], ...newDefinition };
        setUserDefinitions(updatedDefinitions);
      } else {
        // Add new definition
        setUserDefinitions(prev => [...prev, newDefinition]);
      }
      
      // Exit edit mode and show success feedback
      setIsEditMode(false);
      setSaveMessage({ type: 'success', text: 'Configuration staged successfully!' });
      
      console.log('Affinity staged:', updatedAffinityData);
    }
  };

  const handleCreateNew = () => {
    setShowTemplateGallery(true);
  };

  const tabs = ['Basic Info', 'SubScores', 'Rules & Conditions', 'JSON Preview'];

  // Helper function to get sub-score label
  const getSubScoreLabel = (urn) => {
    if (!urn) return 'Unknown';
    
    if (urn.includes('review-sentiments')) return 'Review Sentiments';
    if (urn.includes('attribute')) return 'Attributes';
    if (urn.includes('geo')) return 'Geo Location';
    if (urn.includes('images')) return 'Images';
    return 'Unknown';
  };

  // Dynamic Rules Display Component
  const DynamicRulesDisplay = ({ affinityData }) => {
    const definition = affinityData?.definitions?.[0];
    const subScores = definition?.subScores || [];

    // Debug logging
    console.log('DynamicRulesDisplay - affinityData:', affinityData);
    console.log('DynamicRulesDisplay - definition:', definition);
    console.log('DynamicRulesDisplay - subScores:', subScores);

    // If no dynamic data available, show static rules for family-friendly
    if (subScores.length === 0) {
      return (
        <div className="space-y-6">
          <div>
            <h4 className="text-lg font-medium text-gray-800 mb-4">Define the logic and requirements for scoring</h4>
            
            {/* Static fallback rules */}
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 mb-4">
              <div className="text-center py-8">
                <div className="text-gray-600 mb-4">
                  <strong>Loading Rules...</strong>
                </div>
                <p className="text-gray-500">
                  Rules are being loaded from the definition files. If this persists, showing static rules for reference.
                </p>
              </div>
            </div>

            {/* Review Sentiments Rules - Static Fallback */}
            <div className="bg-green-50 border-l-4 border-green-400 p-6 rounded-lg mb-6">
              <div className="flex justify-between items-center mb-4">
                <h5 className="text-lg font-semibold text-gray-800">Review Sentiments ({affinityData?.weightDistribution?.['Review Sentiments'] || 35}% weight)</h5>
              </div>
              
              <div className="bg-green-100 p-4 rounded-lg mb-4">
                <div className="flex justify-between items-center mb-3">
                  <span className="bg-green-200 text-green-800 px-3 py-1 rounded-full text-sm font-medium">OPTIONAL Rule</span>
                  <span className="bg-green-200 text-green-800 px-3 py-1 rounded-full text-sm font-medium">OR Logic</span>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-700">Outdoor space</span>
                      <span className="text-sm font-medium text-green-600">Weight: 0.3</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-700">Game room</span>
                      <span className="text-sm font-medium text-green-600">Weight: 0.8</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-700">Parks nearby</span>
                      <span className="text-sm font-medium text-green-600">Weight: 0.8</span>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-700">Safe location</span>
                      <span className="text-sm font-medium text-green-600">Weight: 0.3</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-700">Children's pool</span>
                      <span className="text-sm font-medium text-green-600">Weight: 0.8</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-700">Clean room</span>
                      <span className="text-sm font-medium text-green-600">Weight: 0.05</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Attributes Rules - Static Fallback */}
            <div className="bg-blue-50 border-l-4 border-blue-400 p-6 rounded-lg mb-6">
              <div className="flex justify-between items-center mb-4">
                <h5 className="text-lg font-semibold text-gray-800">Attributes ({affinityData?.weightDistribution?.['Attributes'] || 30}% weight)</h5>
              </div>
              
              <div className="bg-red-100 p-4 rounded-lg mb-4">
                <div className="flex justify-between items-center mb-3">
                  <span className="bg-red-200 text-red-800 px-3 py-1 rounded-full text-sm font-medium">MUST_HAVE Rule</span>
                  <span className="bg-red-200 text-red-800 px-3 py-1 rounded-full text-sm font-medium">OR Logic</span>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-700">Bedroom</span>
                      <span className="text-sm font-medium text-red-600">Weight: 0.8</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-700">Kitchen</span>
                      <span className="text-sm font-medium text-red-600">Weight: 0.9</span>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-700">Games</span>
                      <span className="text-sm font-medium text-red-600">Weight: 0.7</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-700">Laundry</span>
                      <span className="text-sm font-medium text-red-600">Weight: 0.8</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      );
    }

    const getRuleTypeColor = (type) => {
      switch (type) {
        case 'MUST_HAVE': return 'bg-red-100 border-red-400 text-red-800';
        case 'OPTIONAL': return 'bg-green-100 border-green-400 text-green-800';
        default: return 'bg-gray-100 border-gray-400 text-gray-800';
      }
    };

    const getSubScoreColor = (index) => {
      const colors = ['bg-blue-50 border-blue-400', 'bg-green-50 border-green-400', 'bg-yellow-50 border-yellow-400', 'bg-purple-50 border-purple-400'];
      return colors[index % colors.length];
    };

    return (
      <div className="space-y-6">
        <h4 className="text-lg font-medium text-gray-800 mb-4">Define the logic and requirements for scoring</h4>
        
        {subScores.map((subScore, subScoreIndex) => {
          const label = getSubScoreLabel(subScore.urn);
          const weight = Math.round(subScore.weight * 100);
          const colorClass = getSubScoreColor(subScoreIndex);

          return (
            <div key={subScore.urn || subScoreIndex} className={`border-l-4 p-6 rounded-lg ${colorClass}`}>
              <div className="flex justify-between items-center mb-4">
                <h5 className="text-lg font-semibold text-gray-800">{label} ({weight}% weight)</h5>
                <div className="text-sm text-gray-600">
                  {subScore.rules?.length || 0} rules • URN: {subScore.urn}
                </div>
              </div>
              
              {subScore.rules?.map((rule, ruleIndex) => (
                <div key={ruleIndex} className="mb-4">
                  <div className={`border-l-4 p-4 rounded-lg ${getRuleTypeColor(rule.type)}`}>
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
                      {rule.conditions?.map((condition, conditionIndex) => (
                        <div key={conditionIndex} className="bg-white p-3 rounded border">
                          <div className="flex justify-between items-start mb-2">
                            <span className="text-sm font-medium text-gray-800">
                              {condition.lhs?.label || 'Unknown Condition'}
                            </span>
                            <div className="text-right">
                              <div className="text-xs text-gray-600">Weight: {condition.weight}</div>
                              {condition.penalty > 0 && (
                                <div className="text-xs text-red-600">Penalty: {condition.penalty}</div>
                              )}
                            </div>
                          </div>
                          <div className="text-xs text-gray-500">
                            <div className="truncate" title={condition.lhs?.urn}>URN: {condition.lhs?.urn}</div>
                            <div>Source: {condition.lhs?.source}</div>
                            <div>Operator: {condition.operator}</div>
                            {condition.rhs && (
                              <div>Value: {condition.rhs.value} {condition.rhs.type}</div>
                            )}
                          </div>
                        </div>
                      )) || <div className="text-gray-500 text-sm">No conditions defined</div>}
                    </div>
                  </div>
                </div>
              )) || <div className="text-gray-500 text-sm">No rules defined for this subscore</div>}
            </div>
          );
        })}
      </div>
    );
  };

  const WeightDistributionChart = ({ data }) => {
    const colors = ['#3B82F6', '#10B981', '#F59E0B', '#8B5CF6'];
    const total = Object.values(data).reduce((sum, value) => sum + value, 0);
    
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
            <div className="text-2xl font-bold text-gray-800">100%</div>
            <div className="text-sm text-gray-600">Total</div>
          </div>
        </div>
      </div>
    );
  };

  const ValidationItem = ({ icon, text, status }) => (
    <div className="flex items-center space-x-2">
      <FontAwesomeIcon 
        icon={status === 'valid' ? faCheckCircle : faExclamationTriangle} 
        className={status === 'valid' ? 'text-green-500' : 'text-yellow-500'} 
      />
      <span className="text-sm text-gray-700">{text}</span>
    </div>
  );

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  // Show template selection if no affinity is selected
  if (!selectedAffinity || showTemplateGallery) {
    return (
      <div className="p-6 bg-gray-50 min-h-screen">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="flex justify-between items-center mb-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-800">Affinity Configuration Studio</h1>
              <p className="text-gray-600">Select an affinity to configure or choose from available templates</p>
            </div>
            {showTemplateGallery && (
              <button 
                onClick={() => setShowTemplateGallery(false)}
                className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
              >
                Back
              </button>
            )}
          </div>
        </div>

        {showTemplateGallery ? (
          /* Template Gallery */
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center space-x-2 mb-6">
              <FontAwesomeIcon icon={faList} className="text-blue-500" />
              <h2 className="text-xl font-semibold text-gray-800">Template Library</h2>
            </div>
            <p className="text-gray-600 mb-6">Choose an affinity template to configure. Each template provides a foundation that you can customize with your own weights, formulas, and rules.</p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {mockAffinityTemplates.map((template) => (
                <div 
                  key={template.id}
                  onClick={() => handleTemplateSelect(template)}
                  className="bg-gray-50 border-2 border-dashed border-gray-300 rounded-lg p-6 text-center cursor-pointer hover:border-blue-500 hover:bg-blue-50 transition-colors"
                >
                  <div className="text-4xl mb-3">{template.icon}</div>
                  <h3 className="font-semibold text-gray-800 mb-2">{template.label}</h3>
                  <p className="text-sm text-gray-600 mb-3">{template.description}</p>
                  <span className="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">{template.category}</span>
                </div>
              ))}
            </div>
          </div>
        ) : (
          /* User Definitions and Template Selection */
          <div className="space-y-6">
            {/* User's Existing Definitions */}
            {userDefinitions.length > 0 && (
              <div className="bg-white rounded-lg shadow-sm p-6">
                <div className="flex justify-between items-center mb-4">
                  <div>
                    <h2 className="text-xl font-semibold text-gray-800">Your Affinity Configurations</h2>
                    <p className="text-gray-600">Continue working on your existing affinity definitions</p>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {userDefinitions.map((definition) => (
                    <div 
                      key={definition.id}
                      onClick={() => handleUserDefinitionSelect(definition)}
                      className="border border-gray-200 rounded-lg p-4 cursor-pointer hover:border-blue-500 hover:shadow-md transition-all"
                    >
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="font-medium text-gray-800">{definition.label}</h3>
                        <span className={`text-xs px-2 py-1 rounded ${
                          definition.status === 'Draft' ? 'bg-yellow-100 text-yellow-800' :
                          definition.status === 'Staged' ? 'bg-blue-100 text-blue-800' :
                          definition.status === 'Active' ? 'bg-green-100 text-green-800' :
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {definition.status}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 mb-2">Based on: {mockAffinityTemplates.find(t => t.id === definition.baseTemplate)?.label}</p>
                      <div className="flex justify-between text-xs text-gray-500">
                        <span>Modified: {definition.lastModified}</span>
                        <span>v{definition.version}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Create New Configuration */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="text-center">
                <div className="mb-4">
                  <FontAwesomeIcon icon={faPlus} className="text-4xl text-gray-400 mb-3" />
                  <h2 className="text-xl font-semibold text-gray-800 mb-2">Create New Affinity Configuration</h2>
                  <p className="text-gray-600 mb-6">Start with a template and customize it to your needs</p>
                </div>
                <button 
                  onClick={handleCreateNew}
                  className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors flex items-center space-x-2 mx-auto"
                >
                  <FontAwesomeIcon icon={faPlus} />
                  <span>Choose Template</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Success Message */}
      {saveMessage && (
        <div className={`fixed top-4 right-4 z-50 px-4 py-3 rounded-lg shadow-lg ${
          saveMessage.type === 'success' 
            ? 'bg-green-100 border border-green-400 text-green-700' 
            : 'bg-red-100 border border-red-400 text-red-700'
        } transition-all duration-300`}>
          <div className="flex items-center space-x-2">
            <FontAwesomeIcon 
              icon={saveMessage.type === 'success' ? faCheckCircle : faExclamationTriangle} 
              className={saveMessage.type === 'success' ? 'text-green-500' : 'text-red-500'}
            />
            <span className="font-medium">{saveMessage.text}</span>
          </div>
        </div>
      )}
      
      {/* Header */}
      <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
        <div className="flex justify-between items-center mb-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Affinity Configuration Studio</h1>
            <p className="text-gray-600">Design and manage affinity definitions with visual configuration tools</p>
          </div>
        </div>

        {/* Current Affinity Display */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Currently Configuring
          </label>
          <div className="flex space-x-3">
            <div className="flex-1 bg-blue-50 border border-blue-200 rounded-lg p-3">
              <div className="flex items-center space-x-2">
                <span className="text-2xl">{mockAffinityTemplates.find(t => t.id === selectedAffinity)?.icon || '⚙️'}</span>
                <div>
                  <h3 className="font-medium text-gray-800">{affinityData?.label || 'Loading...'}</h3>
                  <p className="text-sm text-gray-600">{affinityData?.urn || 'Loading URN...'}</p>
                </div>
              </div>
            </div>
            <button 
              onClick={() => {
                setSelectedAffinity(null);
                setIsEditMode(false);
              }}
              className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors flex items-center space-x-2"
            >
              <FontAwesomeIcon icon={faList} />
              <span>Change Affinity</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Affinity Overview */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Affinity Overview</h3>
            
            {/* Current Selection */}
            <div className="bg-orange-50 border-l-4 border-orange-400 p-4 mb-4">
              <div className="flex justify-between items-start">
                <div>
                  <h4 className="font-medium text-gray-800">{affinityData?.label || 'Loading...'}</h4>
                  <p className="text-sm text-gray-600 mb-2">URN: {affinityData?.urn || 'Loading...'}</p>
                  <span className="inline-flex items-center px-2 py-1 rounded text-xs bg-green-100 text-green-800">
                    <FontAwesomeIcon icon={faCheckCircle} className="mr-1" />
                    {affinityData?.status || 'Loading...'}
                  </span>
                </div>
              </div>
            </div>

            {/* Configuration Summary */}
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">SubScores:</span>
                <span className="text-sm font-medium text-gray-800">{affinityData?.subScores || 0}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Total Rules:</span>
                <span className="text-sm font-medium text-gray-800">{affinityData?.totalRules || 0}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Conditions:</span>
                <span className="text-sm font-medium text-gray-800">{affinityData?.conditions || 0}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Version:</span>
                <span className="text-sm font-medium text-gray-800">{affinityData?.version || 'Loading...'}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column - Configuration Details */}
        <div className="lg:col-span-2">
          {/* Tab Navigation */}
          <div className="bg-white rounded-lg shadow-sm mb-6">
            <div className="border-b border-gray-200">
              <nav className="flex justify-between items-center px-6">
                <div className="flex space-x-8">
                  {tabs.map((tab) => (
                    <button
                      key={tab}
                      onClick={() => setActiveTab(tab)}
                      className={`py-4 px-1 border-b-2 font-medium text-sm ${
                        activeTab === tab
                          ? 'border-blue-500 text-blue-600'
                          : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                      }`}
                    >
                      <FontAwesomeIcon 
                        icon={
                          tab === 'Basic Info' ? faInfoCircle :
                          tab === 'SubScores' ? faChartPie :
                          tab === 'Rules & Conditions' ? faList :
                          faCode
                        } 
                        className="mr-2" 
                      />
                      {tab}
                    </button>
                  ))}
                </div>
                
                {/* Edit Mode Button */}
                {!isEditMode && (
                  <button
                    onClick={() => setIsEditMode(true)}
                    className="py-2 px-4 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors flex items-center space-x-2 my-2"
                  >
                    <FontAwesomeIcon icon={faEdit} />
                    <span>Edit</span>
                  </button>
                )}
              </nav>
            </div>

            {/* Tab Content */}
            <div className="p-6">
              {activeTab === 'Basic Info' && (
                <div className="space-y-6">
                  {isEditMode ? (
                    <>
                      {/* Affinity Overview */}
                      <div className="bg-blue-50 p-6 rounded-lg">
                        <div className="flex items-center space-x-2 mb-4">
                          <FontAwesomeIcon icon={faInfoCircle} className="text-blue-500" />
                          <h4 className="text-lg font-medium text-gray-800">Affinity Overview</h4>
                        </div>
                        <div className="grid grid-cols-2 gap-6">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Affinity URN</label>
                            <SearchableDropdown
                              options={[{ value: affinityData?.urn || '', label: affinityData?.urn || 'Loading...' }]}
                              value={{ value: affinityData?.urn || '', label: affinityData?.urn || 'Loading...' }}
                              onChange={() => {}}
                              placeholder="URN"
                              className="w-48"
                              isDisabled={true}
                              noOptionsMessage="No URN available"
                            />
                            <p className="text-xs text-gray-500 mt-1">URN is inherited from template and cannot be modified</p>
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Display Label</label>
                            <input
                              type="text"
                              defaultValue={affinityData?.label || ''}
                              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                            />
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
                            <SearchableDropdown
                              options={[
                                { value: 'Property', label: 'Property' },
                                { value: 'Destination', label: 'Destination' },
                                { value: 'Experience', label: 'Experience' }
                              ]}
                              value={{ value: 'Property', label: 'Property' }}
                              onChange={(option) => {}}
                              placeholder="Select entity type..."
                              className="w-48"
                              noOptionsMessage="No entity types found"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Brand</label>
                            <SearchableDropdown
                              options={[
                                { value: 'Expedia', label: 'Expedia' },
                                { value: 'VRBO', label: 'VRBO' },
                                { value: 'Hotels.com', label: 'Hotels.com' }
                              ]}
                              value={{ value: 'Expedia', label: 'Expedia' }}
                              onChange={(option) => {}}
                              placeholder="Select brand..."
                              className="w-48"
                              noOptionsMessage="No brands found"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Lodging Type</label>
                            <SearchableDropdown
                              options={[
                                { value: 'Any', label: 'Any' },
                                { value: 'Hotel', label: 'Hotel' },
                                { value: 'Vacation Rental', label: 'Vacation Rental' }
                              ]}
                              value={{ value: 'Any', label: 'Any' }}
                              onChange={(option) => {}}
                              placeholder="Select lodging type..."
                              className="w-48"
                              noOptionsMessage="No lodging types found"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                            <SearchableDropdown
                              options={[{ value: 'Draft', label: 'Draft' }]}
                              value={{ value: 'Draft', label: 'Draft' }}
                              onChange={() => {}}
                              placeholder="Status"
                              className="w-48"
                              isDisabled={true}
                              noOptionsMessage="No statuses available"
                            />
                            <p className="text-xs text-gray-500 mt-1">Status will be updated when you save or stage</p>
                          </div>
                        </div>
                      </div>
                    </>
                  ) : (
                    <div className="space-y-6">
                      {/* View Mode - Simple Display */}
                      <div className="bg-gray-50 p-6 rounded-lg">
                        <h4 className="text-lg font-medium text-gray-800 mb-4">Affinity Information</h4>
                        <div className="grid grid-cols-2 gap-6">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Affinity Label</label>
                            <p className="text-gray-900">{affinityData?.label || 'Loading...'}</p>
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">URN</label>
                            <p className="text-gray-900 text-sm">{affinityData?.urn || 'Loading...'}</p>
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Entity Type</label>
                            <p className="text-gray-900">{affinityData?.entityType || 'Loading...'}</p>
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Brand</label>
                            <p className="text-gray-900">{affinityData?.brand || 'Loading...'}</p>
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                            <span className="inline-flex items-center px-2 py-1 rounded text-xs bg-green-100 text-green-800">
                              <FontAwesomeIcon icon={faCheckCircle} className="mr-1" />
                              {affinityData?.status || 'Loading...'}
                            </span>
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Version</label>
                            <p className="text-gray-900">{affinityData?.version || 'Loading...'}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {activeTab === 'SubScores' && (
                <div className="space-y-6">
                  {isEditMode ? (
                    <>
                      {/* SubScores Configuration Header */}
                      <div className="flex justify-between items-center">
                        <div className="flex items-center space-x-2">
                          <FontAwesomeIcon icon={faChartPie} className="text-blue-500" />
                          <h4 className="text-lg font-medium text-gray-800">SubScores Configuration</h4>
                        </div>
                        <button className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors flex items-center space-x-2">
                          <FontAwesomeIcon icon={faPlus} />
                          <span>Add SubScore</span>
                        </button>
                      </div>

                      {/* Review Sentiments SubScore */}
                      <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                        <div className="flex items-center justify-between mb-4">
                          <div className="flex items-center space-x-3">
                            <FontAwesomeIcon icon={faList} className="text-blue-500" />
                            <h5 className="text-lg font-semibold text-gray-800">Review Sentiments</h5>
                            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                            <span className="text-sm text-gray-600">Weight: 0.35</span>
                          </div>
                          <div className="flex space-x-2">
                            <button className="text-blue-500 hover:text-blue-700">
                              <FontAwesomeIcon icon={faEdit} />
                            </button>
                          </div>
                        </div>
                        
                        <div className="grid grid-cols-3 gap-4 mb-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Weight</label>
                            <input type="text" defaultValue="0.35" className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm" />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Formula</label>
                            <select className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm">
                              <option>WEIGHTED_AVERAGE_SCORE</option>
                              <option>BINARY_OPERATION</option>
                            </select>
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">URN</label>
                            <select disabled className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm bg-gray-100 text-gray-600 cursor-not-allowed">
                              <option>urn:expetaxo:insights:affinity-score:review-sentiments</option>
                            </select>
                          </div>
                        </div>

                        <div className="mb-4">
                          <div className="flex justify-between items-center mb-3">
                            <h6 className="font-medium text-gray-800">Rules</h6>
                            <button className="px-3 py-1 bg-blue-500 text-white rounded text-sm hover:bg-blue-600 flex items-center space-x-1">
                              <FontAwesomeIcon icon={faPlus} />
                              <span>Add Rule</span>
                            </button>
                          </div>
                          
                          <div className="bg-green-100 border-l-4 border-green-400 p-4 rounded">
                            <div className="flex justify-between items-center mb-3">
                              <div className="flex items-center space-x-2">
                                <span className="bg-green-200 text-green-800 px-2 py-1 rounded text-xs font-medium">OPTIONAL</span>
                                <span className="text-sm font-medium">Outdoor space concepts</span>
                              </div>
                              <button className="text-red-500 hover:text-red-700">
                                <FontAwesomeIcon icon={faTrash} />
                              </button>
                            </div>
                            
                            <div className="space-y-2">
                              <div className="flex items-center justify-between bg-white p-2 rounded border">
                                <span className="text-sm">Outdoor space</span>
                                <div className="flex items-center space-x-2">
                                  <span className="text-xs text-gray-600">Weight: 0.3 Penalty: 0.1</span>
                                  <button className="text-gray-400 hover:text-gray-600">
                                    <FontAwesomeIcon icon={faCog} />
                                  </button>
                                </div>
                              </div>
                              <div className="flex items-center justify-between bg-white p-2 rounded border">
                                <span className="text-sm">Game room</span>
                                <div className="flex items-center space-x-2">
                                  <span className="text-xs text-gray-600">Weight: 0.8 Penalty: 0.1</span>
                                  <button className="text-gray-400 hover:text-gray-600">
                                    <FontAwesomeIcon icon={faCog} />
                                  </button>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Attributes SubScore */}
                      <div className="bg-green-50 border border-green-200 rounded-lg p-6">
                        <div className="flex items-center justify-between mb-4">
                          <div className="flex items-center space-x-3">
                            <FontAwesomeIcon icon={faList} className="text-green-500" />
                            <h5 className="text-lg font-semibold text-gray-800">Attributes</h5>
                            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                            <span className="text-sm text-gray-600">Weight: 0.30</span>
                          </div>
                          <div className="flex space-x-2">
                            <button className="text-blue-500 hover:text-blue-700">
                              <FontAwesomeIcon icon={faEdit} />
                            </button>
                          </div>
                        </div>
                        
                        <div className="grid grid-cols-3 gap-4 mb-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Weight</label>
                            <input type="text" defaultValue="0.30" className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm" />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Formula</label>
                            <select className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm">
                              <option>WEIGHTED_AVERAGE_SCORE</option>
                              <option>BINARY_OPERATION</option>
                            </select>
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">URN</label>
                            <select disabled className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm bg-gray-100 text-gray-600 cursor-not-allowed">
                              <option>urn:expetaxo:insights:affinity-score:attributes</option>
                            </select>
                          </div>
                        </div>

                        <div className="mb-4">
                          <div className="flex justify-between items-center mb-3">
                            <h6 className="font-medium text-gray-800">Rules</h6>
                            <button className="px-3 py-1 bg-green-500 text-white rounded text-sm hover:bg-green-600 flex items-center space-x-1">
                              <FontAwesomeIcon icon={faPlus} />
                              <span>Add Rule</span>
                            </button>
                          </div>
                          
                          <div className="bg-red-100 border-l-4 border-red-400 p-4 rounded mb-3">
                            <div className="flex justify-between items-center mb-3">
                              <div className="flex items-center space-x-2">
                                <span className="bg-red-200 text-red-800 px-2 py-1 rounded text-xs font-medium">MUST_HAVE</span>
                                <span className="text-sm font-medium">Essential family amenities</span>
                              </div>
                              <button className="text-red-500 hover:text-red-700">
                                <FontAwesomeIcon icon={faTrash} />
                              </button>
                            </div>
                            
                            <div className="space-y-2">
                              <div className="flex items-center justify-between bg-white p-2 rounded border">
                                <span className="text-sm">Kitchen</span>
                                <div className="flex items-center space-x-2">
                                  <span className="text-xs text-gray-600">Weight: 0.9 Penalty: 0.1</span>
                                  <button className="text-gray-400 hover:text-gray-600">
                                    <FontAwesomeIcon icon={faCog} />
                                  </button>
                                </div>
                              </div>
                              <div className="flex items-center justify-between bg-white p-2 rounded border">
                                <span className="text-sm">Bedroom</span>
                                <div className="flex items-center space-x-2">
                                  <span className="text-xs text-gray-600">Weight: 0.8 Penalty: 0.1</span>
                                  <button className="text-gray-400 hover:text-gray-600">
                                    <FontAwesomeIcon icon={faCog} />
                                  </button>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Geo Location SubScore */}
                      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
                        <div className="flex items-center justify-between mb-4">
                          <div className="flex items-center space-x-3">
                            <FontAwesomeIcon icon={faList} className="text-yellow-500" />
                            <h5 className="text-lg font-semibold text-gray-800">Geo Location</h5>
                            <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                            <span className="text-sm text-gray-600">Weight: 0.20</span>
                          </div>
                          <div className="flex space-x-2">
                            <button className="text-blue-500 hover:text-blue-700">
                              <FontAwesomeIcon icon={faEdit} />
                            </button>
                          </div>
                        </div>
                        
                        <div className="grid grid-cols-3 gap-4 mb-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Weight</label>
                            <input type="text" defaultValue="0.20" className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm" />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Formula</label>
                            <select className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm">
                              <option>WEIGHTED_AVERAGE_DISTANCE_SCORE</option>
                              <option>BINARY_OPERATION</option>
                            </select>
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">URN</label>
                            <select disabled className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm bg-gray-100 text-gray-600 cursor-not-allowed">
                              <option>urn:expetaxo:insights:affinity-score:geo</option>
                            </select>
                          </div>
                        </div>

                        <div className="mb-4">
                          <div className="flex justify-between items-center mb-3">
                            <h6 className="font-medium text-gray-800">Rules</h6>
                            <button className="px-3 py-1 bg-yellow-500 text-white rounded text-sm hover:bg-yellow-600 flex items-center space-x-1">
                              <FontAwesomeIcon icon={faPlus} />
                              <span>Add Rule</span>
                            </button>
                          </div>
                          
                          <div className="bg-red-100 border-l-4 border-red-400 p-4 rounded">
                            <div className="flex justify-between items-center mb-3">
                              <div className="flex items-center space-x-2">
                                <span className="bg-red-200 text-red-800 px-2 py-1 rounded text-xs font-medium">MUST_HAVE</span>
                                <span className="text-sm font-medium">Nearby family attractions</span>
                              </div>
                              <button className="text-red-500 hover:text-red-700">
                                <FontAwesomeIcon icon={faTrash} />
                              </button>
                            </div>
                            
                            <div className="space-y-2">
                              <div className="flex items-center justify-between bg-white p-2 rounded border">
                                <span className="text-sm">Theme Park</span>
                                <div className="flex items-center space-x-2">
                                  <span className="text-xs text-gray-600">&lt; 5km Weight: 0.8</span>
                                  <button className="text-gray-400 hover:text-gray-600">
                                    <FontAwesomeIcon icon={faCog} />
                                  </button>
                                </div>
                              </div>
                              <div className="flex items-center justify-between bg-white p-2 rounded border">
                                <span className="text-sm">Restaurant</span>
                                <div className="flex items-center space-x-2">
                                  <span className="text-xs text-gray-600">&lt; 0.5km Weight: 0.8</span>
                                  <button className="text-gray-400 hover:text-gray-600">
                                    <FontAwesomeIcon icon={faCog} />
                                  </button>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Images SubScore */}
                      <div className="bg-orange-50 border border-orange-200 rounded-lg p-6">
                        <div className="flex items-center justify-between mb-4">
                          <div className="flex items-center space-x-3">
                            <FontAwesomeIcon icon={faList} className="text-orange-500" />
                            <h5 className="text-lg font-semibold text-gray-800">Images</h5>
                            <div className="w-3 h-3 bg-orange-500 rounded-full"></div>
                            <span className="text-sm text-gray-600">Weight: 0.15</span>
                          </div>
                          <div className="flex space-x-2">
                            <button className="text-blue-500 hover:text-blue-700">
                              <FontAwesomeIcon icon={faEdit} />
                            </button>
                          </div>
                        </div>
                        
                        <div className="grid grid-cols-3 gap-4 mb-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Weight</label>
                            <input type="text" defaultValue="0.15" className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm" />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Formula</label>
                            <select className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm">
                              <option>BINARY_OPERATION</option>
                              <option>WEIGHTED_AVERAGE_SCORE</option>
                            </select>
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">URN</label>
                            <select disabled className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm bg-gray-100 text-gray-600 cursor-not-allowed">
                              <option>urn:expetaxo:insights:affinity-score:images</option>
                            </select>
                          </div>
                        </div>

                        <div className="mb-4">
                          <div className="flex justify-between items-center mb-3">
                            <h6 className="font-medium text-gray-800">Rules</h6>
                            <button className="px-3 py-1 bg-orange-500 text-white rounded text-sm hover:bg-orange-600 flex items-center space-x-1">
                              <FontAwesomeIcon icon={faPlus} />
                              <span>Add Rule</span>
                            </button>
                          </div>
                          
                          <div className="bg-green-100 border-l-4 border-green-400 p-4 rounded">
                            <div className="flex justify-between items-center mb-3">
                              <div className="flex items-center space-x-2">
                                <span className="bg-green-200 text-green-800 px-2 py-1 rounded text-xs font-medium">OPTIONAL</span>
                                <span className="text-sm font-medium">Family-friendly imagery</span>
                              </div>
                              <button className="text-red-500 hover:text-red-700">
                                <FontAwesomeIcon icon={faTrash} />
                              </button>
                            </div>
                            
                            <div className="space-y-2">
                              <div className="flex items-center justify-between bg-white p-2 rounded border">
                                <span className="text-sm">Children's area</span>
                                <div className="flex items-center space-x-2">
                                  <span className="text-xs text-gray-600">Weight: 0.8 Penalty: 0.1</span>
                                  <button className="text-gray-400 hover:text-gray-600">
                                    <FontAwesomeIcon icon={faCog} />
                                  </button>
                                </div>
                              </div>
                              <div className="flex items-center justify-between bg-white p-2 rounded border">
                                <span className="text-sm">Pool</span>
                                <div className="flex items-center space-x-2">
                                  <span className="text-xs text-gray-600">Weight: 0.6 Penalty: 0.1</span>
                                  <button className="text-gray-400 hover:text-gray-600">
                                    <FontAwesomeIcon icon={faCog} />
                                  </button>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </>
                  ) : (
                    <>
                      {/* View Mode - Weight Distribution */}
                      <div>
                        <h4 className="text-lg font-medium text-gray-800 mb-4">Weight Distribution</h4>
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                          <WeightDistributionChart data={affinityData?.weightDistribution || {}} />
                          <div className="space-y-4">
                            {Object.entries(affinityData?.weightDistribution || {}).map(([key, value], index) => {
                              const colors = ['#3B82F6', '#10B981', '#F59E0B', '#8B5CF6'];
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
                                    {key === 'Review Sentiments' && affinityData?.reviewSentiments?.join(', ')}
                                    {key === 'Attributes' && affinityData?.attributes?.join(', ')}
                                    {key === 'Images' && affinityData?.images?.join(', ')}
                                    {key === 'Geo Location' && affinityData?.geoLocation?.join(', ')}
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      </div>
                    </>
                  )}
                </div>
              )}

              {activeTab === 'Rules & Conditions' && (
                <div className="space-y-6">
                  {isEditMode ? (
                    <>
                      {/* Edit Mode - Editable Rules */}
                      <div className="flex justify-between items-center">
                        <div className="flex items-center space-x-2">
                          <FontAwesomeIcon icon={faList} className="text-blue-500" />
                          <h4 className="text-lg font-medium text-gray-800">Edit Rules & Conditions</h4>
                        </div>
                        <button className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors flex items-center space-x-2">
                          <FontAwesomeIcon icon={faPlus} />
                          <span>Add Rule Set</span>
                        </button>
                      </div>

                      <div className="bg-blue-50 p-4 rounded-lg">
                        <p className="text-sm text-blue-800 mb-2">
                          <FontAwesomeIcon icon={faInfoCircle} className="mr-2" />
                          You can modify rule weights, add new conditions, or change logical operators. Changes will reflect in the weight distribution shown in the SubScores tab.
                        </p>
                      </div>

                      {/* Review Sentiments Rules - Editable */}
                      <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                        <div className="flex items-center justify-between mb-4">
                          <div className="flex items-center space-x-3">
                            <FontAwesomeIcon icon={faList} className="text-blue-500" />
                            <h5 className="text-lg font-semibold text-gray-800">Review Sentiments Rules</h5>
                            <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                            <span className="text-sm text-gray-600">Weight: {affinityData?.weightDistribution?.['Review Sentiments'] || 35}%</span>
                          </div>
                          <button className="px-3 py-1 bg-blue-500 text-white rounded text-sm hover:bg-blue-600 flex items-center space-x-1">
                            <FontAwesomeIcon icon={faPlus} />
                            <span>Add Rule</span>
                          </button>
                        </div>
                        
                        <div className="bg-green-100 border-l-4 border-green-400 p-4 rounded mb-4">
                          <div className="flex justify-between items-center mb-3">
                            <div className="flex items-center space-x-2">
                              <span className="bg-green-200 text-green-800 px-2 py-1 rounded text-xs font-medium">OPTIONAL</span>
                              <input 
                                type="text" 
                                defaultValue="Outdoor space concepts" 
                                className="text-sm font-medium bg-transparent border-b border-green-300 focus:border-green-500 outline-none"
                              />
                            </div>
                            <div className="flex items-center space-x-2">
                              <select className="text-xs bg-green-200 text-green-800 px-2 py-1 rounded border-0">
                                <option>OR</option>
                                <option>AND</option>
                              </select>
                              <button className="text-red-500 hover:text-red-700">
                                <FontAwesomeIcon icon={faTrash} />
                              </button>
                            </div>
                          </div>
                          
                          <div className="space-y-2">
                            <div className="flex items-center justify-between bg-white p-3 rounded border">
                              <input 
                                type="text" 
                                defaultValue="Outdoor space" 
                                className="text-sm flex-1 bg-transparent border-0 outline-none"
                              />
                              <div className="flex items-center space-x-2">
                                <input 
                                  type="number" 
                                  defaultValue="0.3" 
                                  step="0.1" 
                                  className="w-16 text-xs px-2 py-1 border rounded"
                                />
                                <span className="text-xs text-gray-500">Weight</span>
                                <input 
                                  type="number" 
                                  defaultValue="0.1" 
                                  step="0.1" 
                                  className="w-16 text-xs px-2 py-1 border rounded"
                                />
                                <span className="text-xs text-gray-500">Penalty</span>
                                <button className="text-red-400 hover:text-red-600">
                                  <FontAwesomeIcon icon={faTrash} />
                                </button>
                              </div>
                            </div>
                            <div className="flex items-center justify-between bg-white p-3 rounded border">
                              <input 
                                type="text" 
                                defaultValue="Game room" 
                                className="text-sm flex-1 bg-transparent border-0 outline-none"
                              />
                              <div className="flex items-center space-x-2">
                                <input 
                                  type="number" 
                                  defaultValue="0.8" 
                                  step="0.1" 
                                  className="w-16 text-xs px-2 py-1 border rounded"
                                />
                                <span className="text-xs text-gray-500">Weight</span>
                                <input 
                                  type="number" 
                                  defaultValue="0.1" 
                                  step="0.1" 
                                  className="w-16 text-xs px-2 py-1 border rounded"
                                />
                                <span className="text-xs text-gray-500">Penalty</span>
                                <button className="text-red-400 hover:text-red-600">
                                  <FontAwesomeIcon icon={faTrash} />
                                </button>
                              </div>
                            </div>
                            <button className="w-full py-2 border-2 border-dashed border-green-300 rounded text-green-600 hover:border-green-400 hover:text-green-700 flex items-center justify-center space-x-2">
                              <FontAwesomeIcon icon={faPlus} />
                              <span>Add Condition</span>
                            </button>
                          </div>
                        </div>
                      </div>

                      {/* Attributes Rules - Editable */}
                      <div className="bg-green-50 border border-green-200 rounded-lg p-6">
                        <div className="flex items-center justify-between mb-4">
                          <div className="flex items-center space-x-3">
                            <FontAwesomeIcon icon={faList} className="text-green-500" />
                            <h5 className="text-lg font-semibold text-gray-800">Attributes Rules</h5>
                            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                            <span className="text-sm text-gray-600">Weight: {affinityData?.weightDistribution?.['Attributes'] || 30}%</span>
                          </div>
                          <button className="px-3 py-1 bg-green-500 text-white rounded text-sm hover:bg-green-600 flex items-center space-x-1">
                            <FontAwesomeIcon icon={faPlus} />
                            <span>Add Rule</span>
                          </button>
                        </div>
                        
                        <div className="bg-red-100 border-l-4 border-red-400 p-4 rounded mb-4">
                          <div className="flex justify-between items-center mb-3">
                            <div className="flex items-center space-x-2">
                              <span className="bg-red-200 text-red-800 px-2 py-1 rounded text-xs font-medium">MUST_HAVE</span>
                              <input 
                                type="text" 
                                defaultValue="Essential family amenities" 
                                className="text-sm font-medium bg-transparent border-b border-red-300 focus:border-red-500 outline-none"
                              />
                            </div>
                            <div className="flex items-center space-x-2">
                              <select className="text-xs bg-red-200 text-red-800 px-2 py-1 rounded border-0">
                                <option>OR</option>
                                <option>AND</option>
                              </select>
                              <button className="text-red-500 hover:text-red-700">
                                <FontAwesomeIcon icon={faTrash} />
                              </button>
                            </div>
                          </div>
                          
                          <div className="space-y-2">
                            <div className="flex items-center justify-between bg-white p-3 rounded border">
                              <input 
                                type="text" 
                                defaultValue="Kitchen" 
                                className="text-sm flex-1 bg-transparent border-0 outline-none"
                              />
                              <div className="flex items-center space-x-2">
                                <input 
                                  type="number" 
                                  defaultValue="0.9" 
                                  step="0.1" 
                                  className="w-16 text-xs px-2 py-1 border rounded"
                                />
                                <span className="text-xs text-gray-500">Weight</span>
                                <input 
                                  type="number" 
                                  defaultValue="0.1" 
                                  step="0.1" 
                                  className="w-16 text-xs px-2 py-1 border rounded"
                                />
                                <span className="text-xs text-gray-500">Penalty</span>
                                <button className="text-red-400 hover:text-red-600">
                                  <FontAwesomeIcon icon={faTrash} />
                                </button>
                              </div>
                            </div>
                            <div className="flex items-center justify-between bg-white p-3 rounded border">
                              <input 
                                type="text" 
                                defaultValue="Bedroom" 
                                className="text-sm flex-1 bg-transparent border-0 outline-none"
                              />
                              <div className="flex items-center space-x-2">
                                <input 
                                  type="number" 
                                  defaultValue="0.8" 
                                  step="0.1" 
                                  className="w-16 text-xs px-2 py-1 border rounded"
                                />
                                <span className="text-xs text-gray-500">Weight</span>
                                <input 
                                  type="number" 
                                  defaultValue="0.1" 
                                  step="0.1" 
                                  className="w-16 text-xs px-2 py-1 border rounded"
                                />
                                <span className="text-xs text-gray-500">Penalty</span>
                                <button className="text-red-400 hover:text-red-600">
                                  <FontAwesomeIcon icon={faTrash} />
                                </button>
                              </div>
                            </div>
                            <button className="w-full py-2 border-2 border-dashed border-green-300 rounded text-green-600 hover:border-green-400 hover:text-green-700 flex items-center justify-center space-x-2">
                              <FontAwesomeIcon icon={faPlus} />
                              <span>Add Condition</span>
                            </button>
                          </div>
                        </div>
                      </div>

                      {/* Geo Location Rules - Editable */}
                      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
                        <div className="flex items-center justify-between mb-4">
                          <div className="flex items-center space-x-3">
                            <FontAwesomeIcon icon={faList} className="text-yellow-600" />
                            <h5 className="text-lg font-semibold text-gray-800">Geo Location Rules</h5>
                            <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                            <span className="text-sm text-gray-600">Weight: {affinityData?.weightDistribution?.['Geo Location'] || 20}%</span>
                          </div>
                          <button className="px-3 py-1 bg-yellow-500 text-white rounded text-sm hover:bg-yellow-600 flex items-center space-x-1">
                            <FontAwesomeIcon icon={faPlus} />
                            <span>Add Rule</span>
                          </button>
                        </div>
                        
                        <div className="bg-red-100 border-l-4 border-red-400 p-4 rounded mb-4">
                          <div className="flex justify-between items-center mb-3">
                            <div className="flex items-center space-x-2">
                              <span className="bg-red-200 text-red-800 px-2 py-1 rounded text-xs font-medium">MUST_HAVE</span>
                              <input 
                                type="text" 
                                defaultValue="Nearby family attractions" 
                                className="text-sm font-medium bg-transparent border-b border-red-300 focus:border-red-500 outline-none"
                              />
                            </div>
                            <div className="flex items-center space-x-2">
                              <select className="text-xs bg-red-200 text-red-800 px-2 py-1 rounded border-0">
                                <option>OR</option>
                                <option>AND</option>
                              </select>
                              <button className="text-red-500 hover:text-red-700">
                                <FontAwesomeIcon icon={faTrash} />
                              </button>
                            </div>
                          </div>
                          
                          <div className="space-y-2">
                            <div className="flex items-center justify-between bg-white p-3 rounded border">
                              <input 
                                type="text" 
                                defaultValue="Theme Park" 
                                className="text-sm flex-1 bg-transparent border-0 outline-none"
                              />
                              <div className="flex items-center space-x-2">
                                <input 
                                  type="text" 
                                  defaultValue="< 5km" 
                                  className="w-20 text-xs px-2 py-1 border rounded"
                                />
                                <span className="text-xs text-gray-500">Distance</span>
                                <input 
                                  type="number" 
                                  defaultValue="0.8" 
                                  step="0.1" 
                                  className="w-16 text-xs px-2 py-1 border rounded"
                                />
                                <span className="text-xs text-gray-500">Weight</span>
                                <button className="text-red-400 hover:text-red-600">
                                  <FontAwesomeIcon icon={faTrash} />
                                </button>
                              </div>
                            </div>
                            <div className="flex items-center justify-between bg-white p-3 rounded border">
                              <input 
                                type="text" 
                                defaultValue="Restaurant" 
                                className="text-sm flex-1 bg-transparent border-0 outline-none"
                              />
                              <div className="flex items-center space-x-2">
                                <input 
                                  type="text" 
                                  defaultValue="< 0.5km" 
                                  className="w-20 text-xs px-2 py-1 border rounded"
                                />
                                <span className="text-xs text-gray-500">Distance</span>
                                <input 
                                  type="number" 
                                  defaultValue="0.8" 
                                  step="0.1" 
                                  className="w-16 text-xs px-2 py-1 border rounded"
                                />
                                <span className="text-xs text-gray-500">Weight</span>
                                <button className="text-red-400 hover:text-red-600">
                                  <FontAwesomeIcon icon={faTrash} />
                                </button>
                              </div>
                            </div>
                            <button className="w-full py-2 border-2 border-dashed border-yellow-300 rounded text-yellow-600 hover:border-yellow-400 hover:text-yellow-700 flex items-center justify-center space-x-2">
                              <FontAwesomeIcon icon={faPlus} />
                              <span>Add Condition</span>
                            </button>
                          </div>
                        </div>
                      </div>

                      {/* Images Rules - Editable */}
                      <div className="bg-orange-50 border border-orange-200 rounded-lg p-6">
                        <div className="flex items-center justify-between mb-4">
                          <div className="flex items-center space-x-3">
                            <FontAwesomeIcon icon={faList} className="text-orange-500" />
                            <h5 className="text-lg font-semibold text-gray-800">Images Rules</h5>
                            <div className="w-3 h-3 bg-orange-500 rounded-full"></div>
                            <span className="text-sm text-gray-600">Weight: {affinityData?.weightDistribution?.['Images'] || 15}%</span>
                          </div>
                          <button className="px-3 py-1 bg-orange-500 text-white rounded text-sm hover:bg-orange-600 flex items-center space-x-1">
                            <FontAwesomeIcon icon={faPlus} />
                            <span>Add Rule</span>
                          </button>
                        </div>
                        
                        <div className="bg-green-100 border-l-4 border-green-400 p-4 rounded mb-4">
                          <div className="flex justify-between items-center mb-3">
                            <div className="flex items-center space-x-2">
                              <span className="bg-green-200 text-green-800 px-2 py-1 rounded text-xs font-medium">OPTIONAL</span>
                              <input 
                                type="text" 
                                defaultValue="Family-friendly imagery" 
                                className="text-sm font-medium bg-transparent border-b border-green-300 focus:border-green-500 outline-none"
                              />
                            </div>
                            <div className="flex items-center space-x-2">
                              <select className="text-xs bg-green-200 text-green-800 px-2 py-1 rounded border-0">
                                <option>OR</option>
                                <option>AND</option>
                              </select>
                              <button className="text-red-500 hover:text-red-700">
                                <FontAwesomeIcon icon={faTrash} />
                              </button>
                            </div>
                          </div>
                          
                          <div className="space-y-2">
                            <div className="flex items-center justify-between bg-white p-3 rounded border">
                              <input 
                                type="text" 
                                defaultValue="Children's area" 
                                className="text-sm flex-1 bg-transparent border-0 outline-none"
                              />
                              <div className="flex items-center space-x-2">
                                <input 
                                  type="number" 
                                  defaultValue="0.8" 
                                  step="0.1" 
                                  className="w-16 text-xs px-2 py-1 border rounded"
                                />
                                <span className="text-xs text-gray-500">Weight</span>
                                <input 
                                  type="number" 
                                  defaultValue="0.1" 
                                  step="0.1" 
                                  className="w-16 text-xs px-2 py-1 border rounded"
                                />
                                <span className="text-xs text-gray-500">Penalty</span>
                                <button className="text-red-400 hover:text-red-600">
                                  <FontAwesomeIcon icon={faTrash} />
                                </button>
                              </div>
                            </div>
                            <div className="flex items-center justify-between bg-white p-3 rounded border">
                              <input 
                                type="text" 
                                defaultValue="Pool" 
                                className="text-sm flex-1 bg-transparent border-0 outline-none"
                              />
                              <div className="flex items-center space-x-2">
                                <input 
                                  type="number" 
                                  defaultValue="0.6" 
                                  step="0.1" 
                                  className="w-16 text-xs px-2 py-1 border rounded"
                                />
                                <span className="text-xs text-gray-500">Weight</span>
                                <input 
                                  type="number" 
                                  defaultValue="0.1" 
                                  step="0.1" 
                                  className="w-16 text-xs px-2 py-1 border rounded"
                                />
                                <span className="text-xs text-gray-500">Penalty</span>
                                <button className="text-red-400 hover:text-red-600">
                                  <FontAwesomeIcon icon={faTrash} />
                                </button>
                              </div>
                            </div>
                            <button className="w-full py-2 border-2 border-dashed border-orange-300 rounded text-orange-600 hover:border-orange-400 hover:text-orange-700 flex items-center justify-center space-x-2">
                              <FontAwesomeIcon icon={faPlus} />
                              <span>Add Condition</span>
                            </button>
                          </div>
                        </div>
                      </div>
                    </>
                  ) : (
                    <>
                      {/* View Mode - Read-only rules display */}
                      <DynamicRulesDisplay affinityData={affinityData} />
                    </>
                  )}
                </div>
              )}

              {activeTab === 'JSON Preview' && (
                <div className="space-y-6">
                  <div>
                    <h4 className="text-lg font-medium text-gray-800 mb-4">Generated JSON configuration for this affinity</h4>
                    <div className="bg-gray-900 text-green-400 p-4 rounded-lg font-mono text-sm overflow-x-auto">
                      <pre>{`{
  "urn": "${affinityData?.urn || 'loading'}",
  "sublet": "${affinityData?.label?.toLowerCase() || 'loading'}",
  "definition": {
    "context": {
      "entityType": "${affinityData?.entityType?.toLowerCase() || 'loading'}",
      "brand": "${affinityData?.brand || 'loading'}",
      "lodgingType": "${affinityData?.lodgingType || 'loading'}",
      "version": "${affinityData?.version || 'loading'}"
    },
    "subScores": [
      {
        "formula": {
          "type": "VariableMethod",
          "name": "WEIGHTED_AVERAGE_SCORE"
        },
        "urn": "urn:expetaxo:insights:affinity-score:review-sentiments",
        "weight": 0.35,
        "rules": [
          {
            "type": "OPTIONAL",
            "description": "Must have one of these concepts",
            "logicalOperator": "OR",
            "conditions": [
              {
                "in": {
                  "urn": "urn:expetaxo:review-sentiments:outdoor-space",
                  "source": "review-sentiments",
                  "label": "Outdoor space"
                },
                "operator": "EXISTS",
                "rhs": null,
                "weight": 0.3,
                "penalty": 0.1,
                "metadata": {}
              }
            ]
          }
        ],
        "formula": {
          "type": "VariableMethod",
          "name": "WEIGHTED_AVERAGE_SCORE"
        },
        "status": "STAGED"
      }
    ]
  }
}`}</pre>
                    </div>
                  </div>

                  {/* Validation & Testing */}
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <h5 className="font-medium text-gray-800 mb-3">Schema Validation</h5>
                      <div className="space-y-2">
                        <ValidationItem text="JSON Schema Valid" status="valid" />
                        <ValidationItem text="Weight Distribution Valid" status="valid" />
                        <ValidationItem text="URN Format Valid" status="valid" />
                        <ValidationItem text="Warning: High penalty values detected" status="warning" />
                      </div>
                    </div>

                    <div className="bg-gray-50 p-4 rounded-lg">
                      <h5 className="font-medium text-gray-800 mb-3">Test Results</h5>
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-600">Sample Properties Tested:</span>
                          <span className="text-sm font-medium">{affinityData?.testResults?.samplePropertiesTested || 0}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-600">Average Score:</span>
                          <span className="text-sm font-medium">{affinityData?.testResults?.averageScore || 0}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-600">Properties Matching:</span>
                          <span className="text-sm font-medium">{affinityData?.testResults?.propertiesMatching || 0}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-600">Confidence Score:</span>
                          <span className="text-sm font-medium">{affinityData?.testResults?.confidenceScore || 0}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Action Bar - Only show when in edit mode */}
      {isEditMode && (
        <div className="fixed bottom-0 left-64 right-0 bg-white border-t border-gray-200 p-4">
          <div className="flex justify-end items-center">
            <div className="flex space-x-3">
              <button 
                onClick={handleSaveDraft}
                className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors flex items-center space-x-2"
              >
                <FontAwesomeIcon icon={faSave} />
                <span>Save Draft</span>
              </button>
              <button 
                onClick={handleStage}
                className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors flex items-center space-x-2"
              >
                <FontAwesomeIcon icon={faCheckCircle} />
                <span>Stage</span>
              </button>
              <button 
                onClick={() => setIsEditMode(false)}
                className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AffinityConfigurationStudio;
