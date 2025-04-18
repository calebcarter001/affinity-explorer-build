import React from 'react';

const ImplementationGuide = () => (
  <div id="implementation-tab" className="tab-content">
    <h2 className="text-2xl font-bold mb-6">Implementation Guide</h2>
    
    <div className="bg-white p-6 rounded-lg shadow mb-6">
      <h3 className="text-lg font-semibold mb-4">How to Implement Affinities</h3>
      
      <div className="mb-6">
        <p className="mb-4">Follow these steps to implement affinity scores in your product:</p>
        
        <ol className="list-decimal list-inside space-y-3 ml-4">
          <li>Choose the appropriate affinity concept that aligns with your use case</li>
          <li>Verify the affinity has been fully validated (check the Lifecycle Tracker)</li>
          <li>Request API access through the API Gateway</li>
          <li>Implement the API call in your application</li>
          <li>Test the implementation in your staging environment</li>
          <li>Monitor performance after launch</li>
        </ol>
      </div>

      <div className="mt-8">
        <h4 className="text-lg font-semibold mb-4">API Documentation</h4>
        <div className="bg-gray-50 p-4 rounded-lg">
          <pre className="text-sm overflow-x-auto">
            <code>
              {`GET /api/v1/affinities/{property_id}
              
Parameters:
  - property_id: string (required)
  - include_details: boolean (optional)
  - threshold: float (optional)

Response:
{
  "property_id": "PROP123",
  "affinities": [
    {
      "type": "business_traveler",
      "score": 0.85,
      "confidence": 0.92
    }
  ]
}`}
            </code>
          </pre>
        </div>
      </div>

      <div className="mt-8">
        <h4 className="text-lg font-semibold mb-4">Implementation Examples</h4>
        <div className="space-y-4">
          <div className="bg-gray-50 p-4 rounded-lg">
            <h5 className="font-medium mb-2">JavaScript/Node.js</h5>
            <pre className="text-sm overflow-x-auto">
              <code>
                {`const response = await fetch(
  'https://api.example.com/v1/affinities/PROP123',
  {
    headers: {
      'Authorization': 'Bearer YOUR_API_KEY'
    }
  }
);
const data = await response.json();`}
              </code>
            </pre>
          </div>

          <div className="bg-gray-50 p-4 rounded-lg">
            <h5 className="font-medium mb-2">Python</h5>
            <pre className="text-sm overflow-x-auto">
              <code>
                {`import requests

response = requests.get(
    'https://api.example.com/v1/affinities/PROP123',
    headers={'Authorization': 'Bearer YOUR_API_KEY'}
)
data = response.json()`}
              </code>
            </pre>
          </div>
        </div>
      </div>
    </div>
  </div>
);

export default ImplementationGuide;