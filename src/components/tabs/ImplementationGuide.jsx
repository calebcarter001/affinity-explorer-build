import React, { useState } from 'react';
import { FaCheckCircle, FaCircle, FaCode, FaBook, FaTools, FaRocket } from 'react-icons/fa';

const ImplementationGuide = () => {
  const [activeSection, setActiveSection] = useState('overview');
  const [selectedLanguage, setSelectedLanguage] = useState('javascript');
  const [implementationProgress, setImplementationProgress] = useState({
    planning: false,
    setup: false,
    integration: false,
    testing: false,
    deployment: false
  });

  const toggleProgress = (step) => {
    setImplementationProgress(prev => ({
      ...prev,
      [step]: !prev[step]
    }));
  };

  const basicSteps = [
    'Choose the appropriate affinity concept that aligns with your use case',
    'Verify the affinity has been fully validated (check the Lifecycle Tracker)',
    'Request API access through the API Gateway',
    'Implement the API call in your application',
    'Test the implementation in your staging environment',
    'Monitor performance after launch'
  ];

  const implementationSteps = [
    {
      id: 'planning',
      title: 'Planning Phase',
      description: 'Define requirements and use cases',
      tasks: [
        'Identify target properties and affinities',
        'Document business requirements',
        'Plan integration timeline'
      ]
    },
    {
      id: 'setup',
      title: 'Setup & Configuration',
      description: 'Set up development environment',
      tasks: [
        'Request API access credentials',
        'Configure development environment',
        'Review API documentation'
      ]
    },
    {
      id: 'integration',
      title: 'Integration',
      description: 'Implement API calls and handling',
      tasks: [
        'Implement API client',
        'Add error handling',
        'Set up monitoring'
      ]
    },
    {
      id: 'testing',
      title: 'Testing',
      description: 'Validate implementation',
      tasks: [
        'Unit testing',
        'Integration testing',
        'Performance testing'
      ]
    },
    {
      id: 'deployment',
      title: 'Deployment',
      description: 'Go live with implementation',
      tasks: [
        'Deploy to staging',
        'Final validation',
        'Production deployment'
      ]
    }
  ];

  const codeExamples = {
    javascript: `// Initialize the Affinity Explorer client
const client = new AffinityExplorer({
  apiKey: 'YOUR_API_KEY',
  environment: 'production'
});

// Fetch property affinities
async function getPropertyAffinities(propertyId) {
  try {
    const response = await client.getAffinities(propertyId, {
      include_details: true,
      threshold: 0.7
    });
    
    return response.affinities;
  } catch (error) {
    console.error('Error fetching affinities:', error);
    throw error;
  }
}`,
    python: `# Initialize the Affinity Explorer client
client = AffinityExplorer(
    api_key='YOUR_API_KEY',
    environment='production'
)

# Fetch property affinities
def get_property_affinities(property_id):
    try:
        response = client.get_affinities(
            property_id,
            include_details=True,
            threshold=0.7
        )
        
        return response['affinities']
    except Exception as error:
        print(f'Error fetching affinities: {error}')
        raise`,
    java: `// Initialize the Affinity Explorer client
AffinityExplorer client = new AffinityExplorer.Builder()
    .setApiKey("YOUR_API_KEY")
    .setEnvironment("production")
    .build();

// Fetch property affinities
public List<Affinity> getPropertyAffinities(String propertyId) {
    try {
        AffinityResponse response = client.getAffinities(
            propertyId,
            GetAffinitiesOptions.builder()
                .setIncludeDetails(true)
                .setThreshold(0.7)
                .build()
        );
        
        return response.getAffinities();
    } catch (AffinityException e) {
        logger.error("Error fetching affinities: " + e.getMessage());
        throw e;
    }
}`
  };

  return (
    <div className="main-content p-6">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Implementation Guide</h2>
        <p className="text-gray-600 mt-2">Follow this guide to implement Affinity Explorer in your application.</p>
      </div>

      <div className="card mb-6">
        <div className="p-6">
          <h3 className="text-lg font-semibold mb-4 text-[#00355F]">How to Implement Affinities</h3>
          <p className="text-gray-600 mb-4">Follow these steps to implement affinity scores in your product:</p>
          <div className="space-y-3">
            {basicSteps.map((step, index) => (
              <div key={index} className="flex items-start space-x-3">
                <div className="flex-shrink-0 w-6 h-6 rounded-full bg-[#00355F] text-white flex items-center justify-center text-sm">
                  {index + 1}
                </div>
                <p className="text-gray-700">{step}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="flex space-x-4 mb-6">
        <button
          onClick={() => setActiveSection('overview')}
          className={`agent-tab ${activeSection === 'overview' ? 'active' : ''}`}
        >
          <FaRocket className="inline-block mr-2" />
          Detailed Steps
        </button>
        <button
          onClick={() => setActiveSection('documentation')}
          className={`agent-tab ${activeSection === 'documentation' ? 'active' : ''}`}
        >
          <FaBook className="inline-block mr-2" />
          API Documentation
        </button>
        <button
          onClick={() => setActiveSection('examples')}
          className={`agent-tab ${activeSection === 'examples' ? 'active' : ''}`}
        >
          <FaCode className="inline-block mr-2" />
          Code Examples
        </button>
      </div>

      {activeSection === 'overview' && (
        <div className="space-y-6">
          <div className="card">
            <div className="p-6">
              <h3 className="text-lg font-semibold mb-4 text-[#00355F]">Implementation Process</h3>
              <div className="space-y-4">
                {implementationSteps.map((step) => (
                  <div
                    key={step.id}
                    className="evidence-panel bg-white p-4 rounded-lg cursor-pointer"
                    onClick={() => toggleProgress(step.id)}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center space-x-3">
                        {implementationProgress[step.id] ? (
                          <FaCheckCircle className="text-[#34a853] text-xl" />
                        ) : (
                          <FaCircle className="text-gray-300 text-xl" />
                        )}
                        <h4 className="font-medium text-[#00355F]">{step.title}</h4>
                      </div>
                      <span className="badge badge-validated">{step.description}</span>
                    </div>
                    <ul className="ml-8 list-disc text-sm text-gray-600 mt-2">
                      {step.tasks.map((task, index) => (
                        <li key={index} className="mb-1">{task}</li>
                      ))}
                    </ul>
                    <div className="confidence-indicator mt-3">
                      <div 
                        className="confidence-fill"
                        style={{ 
                          width: implementationProgress[step.id] ? '100%' : '0%',
                          transition: 'width 0.3s ease-in-out'
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {activeSection === 'documentation' && (
        <div className="card">
          <div className="p-6">
            <h3 className="text-lg font-semibold mb-4 text-[#00355F]">API Documentation</h3>
            <div className="space-y-6">
              <div className="evidence-panel">
                <h4 className="font-medium mb-2 text-[#00355F]">Endpoints</h4>
                <pre className="bg-gray-50 p-4 rounded-lg text-sm overflow-x-auto">
                  <code>{`GET /api/v1/affinities/{affinityId}/scores/{propertyId}
GET /api/v1/affinities/{property_id}
POST /api/v1/affinities/batch
GET /api/v1/affinities/types
GET /api/v1/properties/{property_id}/scores`}</code>
                </pre>
                <p className="text-sm text-gray-600 mt-2">Returns the affinity score for a specific property.</p>
              </div>

              <div className="evidence-panel">
                <h4 className="font-medium mb-2 text-[#00355F]">Authentication</h4>
                <p className="text-sm text-gray-600 mb-2">
                  All API requests require authentication using an API key in the Authorization header:
                </p>
                <pre className="bg-gray-50 p-4 rounded-lg text-sm overflow-x-auto">
                  <code>Authorization: Bearer YOUR_API_KEY</code>
                </pre>
              </div>

              <div className="evidence-panel">
                <h4 className="font-medium mb-2 text-[#00355F]">Response Format</h4>
                <pre className="bg-gray-50 p-4 rounded-lg text-sm overflow-x-auto">
                  <code>{`{
  "property_id": "PROP123",
  "timestamp": "2024-03-21T10:30:00Z",
  "affinities": [
    {
      "type": "business_traveler",
      "score": 0.85,
      "confidence": 0.92,
      "factors": [
        {
          "name": "location_score",
          "value": 0.9,
          "weight": 0.4
        },
        {
          "name": "amenities_score",
          "value": 0.8,
          "weight": 0.6
        }
      ]
    }
  ]
}`}</code>
                </pre>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeSection === 'examples' && (
        <div className="card">
          <div className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-[#00355F]">Code Examples</h3>
              <div className="flex space-x-2">
                {['javascript', 'python', 'java'].map((lang) => (
                  <button
                    key={lang}
                    onClick={() => setSelectedLanguage(lang)}
                    className={`agent-tab py-1 px-3 ${
                      selectedLanguage === lang ? 'active' : ''
                    }`}
                  >
                    {lang.charAt(0).toUpperCase() + lang.slice(1)}
                  </button>
                ))}
              </div>
            </div>
            <div className="evidence-panel">
              <pre className="bg-gray-50 p-4 rounded-lg text-sm overflow-x-auto">
                <code>{codeExamples[selectedLanguage]}</code>
              </pre>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ImplementationGuide;