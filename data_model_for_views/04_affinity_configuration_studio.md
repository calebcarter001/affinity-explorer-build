# Affinity Configuration Studio - Data Model & UI Specification

## Overview
The Affinity Configuration Studio is a comprehensive visual configuration tool for designing, editing, and managing affinity definitions within the Affinity Explorer application. It provides an intuitive interface for creating complex affinity scoring rules with visual feedback, validation, and support for both **17 JSON-defined affinities** and **user-created configurations**.

## Navigation
- **Location**: Position 4 in main sidebar (after Sentiment Insights)
- **Route**: `/affinity-configuration-studio`
- **Icon**: FiTool (wrench/configuration icon)
- **Permissions**: Requires 'read' permission

## Core Features

### 1. Template Gallery & Affinity Selection
- **17 Template Affinities**: Complete library of pre-configured affinity definitions
- **Search/Typeahead**: Real-time search across available affinities
- **Category Organization**: Templates organized by Lifestyle, Quality, Location, Property Type, etc.
- **User Definitions**: Management of custom affinity configurations
- **Template Previews**: Icon-based visual representation with descriptions

### 2. Multi-Tab Configuration Interface
- **Basic Info**: Core affinity metadata, URN, entity type, brand settings
- **SubScores**: Visual weight distribution with real-time pie chart
- **Rules & Conditions**: Dynamic rules display with actual definition loading
- **JSON Preview**: Live-generated JSON with comprehensive validation

### 3. Dynamic Rules Engine
- **Real Definition Loading**: Integration with `affinityDefinitionService.js`
- **Rule Type Classification**: MUST_HAVE, OPTIONAL, conditional logic
- **Weight Visualization**: Dynamic weight distribution across sub-scores
- **Condition Management**: Detailed condition editing with penalties and weights

### 4. Comprehensive Validation System
- **Schema Validation**: Real-time JSON schema compliance
- **Weight Distribution**: Automatic validation of weight totals
- **URN Format**: Validation of URN structure and uniqueness
- **Test Results**: Performance metrics on sample property data

## Data Structure

### Template Library Schema (17 Affinities)
```javascript
const affinityTemplates = [
  {
    id: 'family-friendly',
    label: 'Family Friendly',
    urn: 'urn:expe:taxo:insights:family-friendly',
    description: 'Properties suitable for families with children',
    icon: '👨‍👩‍👧‍👦',
    category: 'Lifestyle'
  },
  {
    id: 'pet-friendly',
    label: 'Pet Friendly',
    urn: 'urn:expe:taxo:insights:pet-friendly',
    description: 'Properties that welcome pets',
    icon: '🐕',
    category: 'Lifestyle'
  },
  {
    id: 'wellness',
    label: 'Wellness',
    urn: 'urn:expe:taxo:insights:wellness-and-beauty:wellness',
    description: 'Health and wellness focused properties',
    icon: '🧘',
    category: 'Lifestyle'
  },
  {
    id: 'luxury',
    label: 'Luxury',
    urn: 'urn:expe:taxo:insights:luxury',
    description: 'High-end luxury accommodations',
    icon: '💎',
    category: 'Quality'
  },
  {
    id: 'beachfront',
    label: 'Beachfront',
    urn: 'urn:expe:taxo:insights:beachfront',
    description: 'Properties directly on the beach',
    icon: '🏖️',
    category: 'Location'
  },
  // ... 12 additional templates (total 17)
  {
    id: 'wine-country',
    label: 'Wine Country',
    urn: 'urn:expe:taxo:insights:wine-country',
    description: 'Properties in wine regions',
    icon: '🍷',
    category: 'Location'
  }
];
```

### Affinity Configuration Object
```javascript
const affinityConfiguration = {
  // Core Identity
  label: string,                  // Display name (e.g., "Family Friendly")
  urn: string,                   // Unique resource name
  status: string,                // "Draft", "Staged", "Active"
  
  // Context Configuration
  context: {
    entityType: string,          // "Property", "Destination", "Experience"
    brand: string,               // "Expedia", "VRBO", "Hotels.com", "All Brands"
    lodgingType: string,         // "Any", "Hotel", "Vacation Rental"
    version: string              // Version number
  },
  
  // Configuration Summary
  subScores: number,             // Number of sub-scoring components
  totalRules: number,            // Total number of rules across all sub-scores
  conditions: number,            // Total number of conditions
  
  // Weight Distribution
  weightDistribution: {
    "Review Sentiments": number, // Percentage weight
    "Attributes": number,        // Percentage weight
    "Images": number,            // Percentage weight
    "Geo Location": number       // Percentage weight
  },
  
  // Full Definition Structure
  definitions: [{
    context: {
      entityType: string,
      brand: string,
      lodgingType: string,
      version: string
    },
    subScores: [{
      urn: string,               // Sub-score URN
      weight: number,            // Weight as decimal (0.0-1.0)
      rules: [{
        type: string,            // "MUST_HAVE" | "OPTIONAL"
        description: string,     // Rule description
        logicalOperator: string, // "OR" | "AND"
        conditions: [{
          lhs: {
            urn: string,         // Condition URN
            source: string,      // "review-sentiments" | "attribute" | etc.
            label: string        // Human-readable label
          },
          operator: string,      // "EXISTS" | "EQUALS" | etc.
          rhs: any,             // Right-hand side value (can be null)
          weight: number,        // Condition weight
          penalty: number,       // Penalty value
          metadata: object       // Additional metadata
        }]
      }],
      formula: {
        type: string,            // "VariableMethod"
        name: string             // "WEIGHTED_AVERAGE_SCORE"
      }
    }]
  }],
  
  // Validation Results
  validation: {
    schemaValid: boolean,
    weightDistributionValid: boolean,
    urnFormatValid: boolean,
    highPenaltyWarning: boolean,
    errors: string[],            // Validation error messages
    warnings: string[]           // Validation warning messages
  },
  
  // Test Results
  testResults: {
    samplePropertiesTested: number,
    averageScore: number,
    propertiesMatching: number,
    confidenceScore: number
  },
  
  // Version Control
  versionControl: {
    version: string,
    createdAt: string,           // ISO 8601
    lastModified: string,        // ISO 8601
    revisionHistory: [{
      version: string,
      authorId: string,
      changesSummary: string,
      timestamp: string          // ISO 8601
    }]
  }
}
```

### User Definition Management
```javascript
const userDefinitions = [{
  id: string,                    // Unique identifier
  label: string,                 // User-defined label
  baseTemplate: string,          // Template ID this was based on
  urn: string,                   // URN (inherited or custom)
  status: string,                // "Draft" | "Staged" | "Active"
  lastModified: string,          // Date string
  version: string,               // Version number
  customizations: object         // User modifications
}]
```

## UI Components

### 1. Landing View (No Affinity Selected)
#### Header Section
- **Title**: "Affinity Configuration Studio"
- **Subtitle**: "Select an affinity to configure or choose from available templates"
- **Back Button**: Available when in template gallery

#### User's Existing Definitions
- **Grid Layout**: Cards showing user's custom configurations
- **Status Indicators**: Color-coded status badges (Draft/Staged/Active)
- **Metadata Display**: Last modified, version, base template
- **Click to Edit**: Direct editing access

#### Create New Configuration
- **Call-to-Action**: Prominent "Choose Template" button
- **Template Gallery Access**: One-click access to template library

### 2. Template Gallery
#### Gallery Grid
- **4-Column Layout**: Responsive grid (adjusts to 2/1 columns on smaller screens)
- **Template Cards**: Icon, name, description, category badge
- **Hover Effects**: Visual feedback on hover
- **Category Colors**: Color-coded category badges

#### Template Categories
- **Lifestyle**: Family Friendly, Pet Friendly, Wellness
- **Quality**: Luxury
- **Location**: Beachfront, Near The Beach, Mountains, Lake, National Parks, Wine Country
- **Property Type**: Cabins, Homes
- **Amenities**: Pools, Spa
- **Activities**: Ski
- **Seasonal**: Snow Season
- **Popular**: Trending

### 3. Configuration Interface

#### Left Sidebar - Affinity Overview
- **Current Selection**: Template icon, name, URN display
- **Configuration Summary**: 
  - SubScores count
  - Total Rules count
  - Conditions count
  - Version number
- **Status Badge**: Current configuration status

#### Main Content - Tabbed Interface

##### Basic Info Tab
**View Mode:**
- **Read-only Display**: Affinity label, URN, entity type, brand, status, version
- **Edit Button**: Switch to edit mode

**Edit Mode:**
- **Affinity Label**: Editable text input
- **URN Field**: Read-only (inherited from template)
- **Context Configuration**: 
  - Entity Type dropdown (Property/Destination/Experience)
  - Brand dropdown (Expedia/VRBO/Hotels.com/All Brands)
  - Lodging Type dropdown (Any/Hotel/Vacation Rental)
- **Status Display**: Always shows "Draft" during editing

##### SubScores Tab
**View Mode:**
- **Weight Distribution Chart**: Interactive donut chart with percentages
- **Component Details**: Expandable cards for each sub-score
- **Concept Lists**: Associated concepts per component

**Edit Mode:**
- **Sub-Score Configuration Cards**: Editable weight inputs, formula selection
- **Rule Management**: Add/remove rules with visual rule builder
- **Weight Validation**: Real-time validation of weight distribution

##### Rules & Conditions Tab
**Dynamic Rules Display:**
- **Real Definition Loading**: Loads actual rules from `affinityDefinitionService.js`
- **Sub-Score Sections**: Color-coded sections per sub-score
- **Rule Type Indicators**: MUST_HAVE (red), OPTIONAL (green)
- **Condition Details**: URN, source, label, weight, penalty display
- **Logical Operators**: OR/AND logic indicators
- **Fallback Display**: Static rules when dynamic loading fails

**Edit Mode:**
- **Editable Rule Inputs**: Text inputs for rule descriptions
- **Condition Management**: Add/remove conditions
- **Weight Sliders**: Adjustable weight and penalty values
- **Operator Selection**: OR/AND dropdown selection

##### JSON Preview Tab
- **Syntax-Highlighted JSON**: Pretty-printed JSON output
- **Validation Panel**: 
  - Schema validation status
  - Weight distribution validation
  - URN format validation
  - Warning indicators
- **Test Results Panel**: Performance metrics display
- **Export Options**: Copy/download functionality

#### Bottom Action Bar (Edit Mode Only)
- **Fixed Position**: Remains visible during scrolling
- **Action Buttons**:
  - **Cancel**: Exit edit mode without saving
  - **Save Draft**: Save as draft status
  - **Stage**: Move to staged status
- **Responsive Layout**: Adapts to screen size

## Technical Implementation

### Data Integration
```javascript
// Template loading from affinityDefinitionService
const loadTemplate = async (templateId) => {
  try {
    const definition = await affinityDefinitionService.getDefinition(templateId);
    const summary = affinityDefinitionService.getDefinitionSummary(definition);
    
    return {
      label: definition.label,
      urn: definition.urn,
      definitions: definition.definitions,
      subScores: summary.subScores,
      totalRules: summary.totalRules,
      conditions: summary.totalConditions,
      weightDistribution: summary.weightDistribution
    };
  } catch (error) {
    // Fallback to mock data
    return createFallbackDefinition(templateId);
  }
};
```

### State Management
```javascript
const AffinityConfigurationStudio = () => {
  const [selectedAffinity, setSelectedAffinity] = useState(null);
  const [activeTab, setActiveTab] = useState('Basic Info');
  const [isEditMode, setIsEditMode] = useState(false);
  const [affinityData, setAffinityData] = useState(null);
  const [userDefinitions, setUserDefinitions] = useState([]);
  const [showTemplateGallery, setShowTemplateGallery] = useState(false);
  const [loading, setLoading] = useState(false);
  const [saveMessage, setSaveMessage] = useState(null);
  
  // Dynamic rule loading and processing
  // Template selection and data enrichment
  // Validation and testing integration
};
```

### Validation System
```javascript
const validateConfiguration = (affinityData) => {
  const validation = {
    schemaValid: true,
    weightDistributionValid: true,
    urnFormatValid: true,
    highPenaltyWarning: false,
    errors: [],
    warnings: []
  };
  
  // Schema validation
  if (!isValidSchema(affinityData)) {
    validation.schemaValid = false;
    validation.errors.push("Configuration does not match required schema");
  }
  
  // Weight distribution validation
  const totalWeight = Object.values(affinityData.weightDistribution || {})
    .reduce((sum, weight) => sum + weight, 0);
  if (Math.abs(totalWeight - 100) > 0.1) {
    validation.weightDistributionValid = false;
    validation.errors.push("Weight distribution must sum to 100%");
  }
  
  // URN format validation
  if (!isValidURN(affinityData.urn)) {
    validation.urnFormatValid = false;
    validation.errors.push("URN format is invalid");
  }
  
  // High penalty warning
  if (hasHighPenalties(affinityData)) {
    validation.highPenaltyWarning = true;
    validation.warnings.push("High penalty values detected in conditions");
  }
  
  return validation;
};
```

## API Integration

### Required Endpoints
```
GET /api/affinity-configuration/templates
Response: AffinityTemplate[]

GET /api/affinity-configuration/definitions/{template_id}
Response: AffinityDefinition

POST /api/affinity-configuration/save-draft
Body: AffinityConfiguration
Response: { success: boolean, id: string }

POST /api/affinity-configuration/stage
Body: AffinityConfiguration
Response: { success: boolean, workflowId: string }

GET /api/affinity-configuration/user-definitions
Response: UserDefinition[]

POST /api/affinity-configuration/validate
Body: AffinityConfiguration
Response: ValidationResult

POST /api/affinity-configuration/test
Body: AffinityConfiguration
Response: TestResults
```

### Performance Considerations
- **Lazy Template Loading**: Templates loaded on-demand
- **Definition Caching**: Cached loaded definitions for quick switching
- **Auto-save Drafts**: Periodic auto-save during editing
- **Optimistic Updates**: UI updates immediately, sync with server async

## Workflow Integration

### Draft → Staged → Active Pipeline
1. **Draft Creation**: User creates/modifies configuration
2. **Validation**: Real-time validation during editing
3. **Save Draft**: Configuration saved in draft state
4. **Stage**: Configuration moved to staging environment
5. **Testing**: Performance validation on staging data
6. **Approval**: Manual approval process for production deployment
7. **Activation**: Configuration deployed to production

### Version Control
- **Revision History**: Track all changes with timestamps
- **Rollback Capability**: Ability to revert to previous versions
- **Change Comparison**: Side-by-side diff of configuration changes
- **Approval Trail**: Record of who approved each stage transition

## Future Enhancements

### Advanced Features
1. **Visual Rule Builder**: Drag-and-drop interface for rule creation
2. **A/B Testing Integration**: Built-in A/B test configuration
3. **Performance Analytics**: Real-time performance monitoring
4. **Collaboration Tools**: Multi-user editing with conflict resolution
5. **Template Marketplace**: Community-shared affinity templates

### Integration Expansions
- **Machine Learning Pipeline**: Integration with ML model training
- **Data Quality Monitoring**: Automated data quality checks
- **Performance Alerting**: Threshold-based performance alerts
- **Bulk Operations**: Multi-affinity configuration management

This comprehensive specification enables powerful affinity configuration management with visual tools, comprehensive validation, and seamless integration with the broader Affinity Explorer ecosystem.
