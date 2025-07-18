# 15. Concept Relationship Panel (CRP) Data Model

## 1. Overview

The Concept Relationship Panel (CRP) is a sidebar component designed for content writers within the Content Studio. It surfaces semantically related concepts for a selected primary concept, allowing writers to explore adjacencies, adjust relevance weights, and insert pre-defined, evidence-backed snippets into their content.

This model supports the MVP, which will use a hard-coded example (`PrimaryConcept: "Swimming Pool"`) to validate the core functionality of the adjacency engine and UI components.

## 2. Data Flow

1.  **Primary Concept Selection**: A user selects a primary concept (e.g., "Swimming Pool") from the affinity library.
2.  **Adjacency Engine Query**: The CRP queries the `AdjacencyEngineService` with the primary concept ID.
3.  **Data Fetching**: The service retrieves a ranked list of secondary and tertiary concepts, along with their default weights, evidence metrics, and associated snippet templates.
4.  **UI Render**: The CRP displays the concept hierarchy, weight allocation sliders, and snippet templates.
5.  **Real-time Updates**: User interactions (e.g., adjusting a weight slider) update the component's state in real-time.

## 3. TypeScript Interface Schema

```typescript
// src/types/concept-relationship-panel.ts

/**
 * Represents a single content snippet template associated with a related concept.
 * Each snippet is designed for quick insertion into content and is backed by evidence.
 */
export interface SnippetTemplate {
  id: string; // Unique identifier (e.g., "snp-pool-safety-01")
  title: string; // Short, descriptive title (e.g., "Pool Safety Fence")
  content: string; // The full text of the snippet
  usage_guideline: string; // Brief on when to use this snippet (e.g., "For family-friendly properties")
  evidence_level: 'high' | 'medium' | 'low'; // Confidence in the evidence backing this snippet
}

/**
 * Represents a related concept (secondary or tertiary) to the primary concept.
 * Includes relevance weight, evidence metrics, and associated snippet templates.
 */
export interface RelatedConcept {
  id: string; // Unique identifier from the affinity library (e.g., "pool-bar")
  name: string; // Display name (e.g., "Pool Bar")
  relationship_type: 'secondary' | 'tertiary'; // Thematic proximity to the primary concept
  relevance_weight: number; // Default relevance score (0-100), adjustable by user
  evidence_score: number; // Aggregated score from the evidence service (0-100)
  snippet_templates: SnippetTemplate[]; // A list of quick-insert content snippets
}

/**
 * The main data structure for the Concept Relationship Panel.
 * Contains the primary concept and a structured list of all its related concepts.
 */
export interface ConceptRelationshipPanelData {
  primary_concept: {
    id: string; // e.g., "swimming-pool"
    name: string; // e.g., "Swimming Pool"
  };
  related_concepts: RelatedConcept[]; // A flat list of all related concepts for easy rendering
  metadata: {
    engine_version: string; // Version of the adjacency engine used
    last_updated: string; // ISO 8601 timestamp
    data_source: string; // e.g., "Affinity Ontology v2.1"
  };
}

```

## 4. API Endpoint(s)

For the MVP, this data will be hard-coded. The future API will look like this:

-   **Endpoint**: `GET /api/concept-relationships/{conceptId}`
-   **Description**: Retrieves the full `ConceptRelationshipPanelData` for a given primary concept ID.
-   **Response**: `ConceptRelationshipPanelData` object.

## 5. Hard-coded MVP Example Data

This data will be used to build and test the initial `ConceptRelationshipPanel.jsx` component.

```javascript
// src/components/crp/mock-crp-data.js

export const mockCrpData = {
  primary_concept: {
    id: "swimming-pool",
    name: "Swimming Pool",
  },
  related_concepts: [
    {
      id: "pool-bar",
      name: "Pool Bar",
      relationship_type: 'secondary',
      relevance_weight: 85,
      evidence_score: 92,
      snippet_templates: [
        {
          id: "snp-pool-bar-01",
          title: "Swim-Up Bar Access",
          content: "Enjoy refreshing cocktails without leaving the water at our elegant swim-up bar.",
          usage_guideline: "Highlighting luxury and convenience.",
          evidence_level: 'high',
        },
      ],
    },
    {
      id: "infinity-pool",
      name: "Infinity Pool",
      relationship_type: 'secondary',
      relevance_weight: 95,
      evidence_score: 98,
      snippet_templates: [
        {
          id: "snp-infinity-pool-01",
          title: "Stunning Ocean Views",
          content: "Our stunning infinity pool offers breathtaking, panoramic views of the ocean.",
          usage_guideline: "For properties with premium views.",
          evidence_level: 'high',
        },
      ],
    },
    {
      id: "pool-heating",
      name: "Heated Pool",
      relationship_type: 'tertiary',
      relevance_weight: 70,
      evidence_score: 88,
      snippet_templates: [
        {
          id: "snp-pool-heating-01",
          title: "Year-Round Comfort",
          content: "The pool is heated year-round, ensuring a comfortable swim in any season.",
          usage_guideline: "For destinations with variable climates.",
          evidence_level: 'medium',
        },
      ],
    },
  ],
  metadata: {
    engine_version: "1.0.0-mvp",
    last_updated: new Date().toISOString(),
    data_source: "Hard-coded MVP Example",
  },
};
```

## 6. UI/UX Requirements

-   The panel must be a collapsible sidebar.
-   Display the primary concept at the top.
-   List secondary and tertiary concepts in distinct sections.
-   Each related concept card should show its name, weight, and evidence score.
-   Include a slider (`0-100`) to adjust the `relevance_weight` for each related concept.
-   Provide a button to view/copy snippet templates for each concept.
-   Maintain a clean, modern aesthetic consistent with the existing application design.
