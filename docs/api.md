# API Documentation

## Data Structures

### Affinity Object

The affinity object represents a property affinity with its associated metadata and metrics.

```typescript
{
  id: string;                    // Unique identifier for the affinity
  name: string;                  // Name of the affinity
  definition: string;            // Description or definition of the affinity
  type: string;                  // Type of affinity
  category: string;              // Category classification
  status: string;               // Current status of the affinity
  applicableEntities: string[]; // List of entities this affinity applies to
  scoreAvailable: boolean;      // Whether scoring is available
  averageScore: number;         // Average score across properties
  highestScore: number;         // Highest score achieved
  lowestScore: number;          // Lowest score achieved
  coverage: number;             // Coverage percentage
  propertiesTagged: number;     // Total number of properties tagged (formerly totalProperties)
  propertiesWithScore: number;  // Number of properties with scores (formerly activeProperties)
  dateCreated: string;          // ISO 8601 timestamp of creation
  lastUpdatedDate: string;      // ISO 8601 timestamp of last update
}
```

### Performance Data

The performance data structure contains metrics and performance indicators for an affinity.

```typescript
{
  id: string;                   // Unique identifier for the performance record
  affinityId: string;          // Reference to the associated affinity
  year: number;                // Year of the performance data
  clicks: number;              // Number of clicks
  impressions: number;         // Number of impressions
  transactions: number;        // Number of transactions
  gpNet: number;              // Gross profit (net)
  dateCreated: string;        // ISO 8601 timestamp of creation
  lastUpdatedDate: string;    // ISO 8601 timestamp of last update
}
```

## Recent Changes

### Field Renames
- `totalProperties` → `propertiesTagged`
- `activeProperties` → `propertiesWithScore`
- Removed `inactiveProperties` field

### New Fields
- Added `dateCreated` - ISO 8601 timestamp
- Added `lastUpdatedDate` - ISO 8601 timestamp

### Performance Metrics
- Added dedicated performance data structure
- Each performance record is linked to an affinity via `affinityId`
- Performance data includes key metrics: clicks, impressions, transactions, and gpNet 