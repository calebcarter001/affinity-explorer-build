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
      type: 'secondary',
      relationship: 'amenity',
      relevance_percentage: 85,
      similarity_scores: {
        semantic: { score: 0.78, confidence: 'high', evidence: ['pool', 'bar', 'amenity'] },
        taxonomic: { score: 0.82, confidence: 'high', evidence: ['amenity category'] },
        attribute: { score: 0.71, confidence: 'medium', evidence: ['outdoor seating', 'water access'] },
        behavioral: { score: 0.84, confidence: 'high', evidence: ['18% co-view rate'] },
        content: { score: 0.73, confidence: 'medium', evidence: ['bar imagery'] },
        external: { score: 0.79, confidence: 'high', evidence: ['24% query overlap'] },
        temporal: { score: 0.68, confidence: 'medium', evidence: ['evening correlation'] },
        statistical: { score: 0.77, confidence: 'high', evidence: ['amenity cluster'] },
        business: { score: 0.82, confidence: 'high', evidence: ['4.2 bps GP lift'] }
      },
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
      type: 'secondary',
      relationship: 'feature',
      relevance_percentage: 95,
      similarity_scores: {
        semantic: { score: 0.92, confidence: 'high', evidence: ['infinity', 'pool', 'luxury'] },
        taxonomic: { score: 0.89, confidence: 'high', evidence: ['pool type category'] },
        attribute: { score: 0.94, confidence: 'high', evidence: ['edge design', 'view enhancement'] },
        behavioral: { score: 0.91, confidence: 'high', evidence: ['22% co-view rate'] },
        content: { score: 0.88, confidence: 'high', evidence: ['luxury pool imagery'] },
        external: { score: 0.85, confidence: 'high', evidence: ['infinity pool queries'] },
        temporal: { score: 0.76, confidence: 'medium', evidence: ['sunset correlation'] },
        statistical: { score: 0.87, confidence: 'high', evidence: ['luxury cluster'] },
        business: { score: 0.93, confidence: 'high', evidence: ['6.8 bps GP lift'] }
      },
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
      type: 'tertiary',
      relationship: 'feature',
      relevance_percentage: 70,
      similarity_scores: {
        semantic: { score: 0.85, confidence: 'high', evidence: ['heated', 'pool', 'comfort'] },
        taxonomic: { score: 0.79, confidence: 'high', evidence: ['pool feature category'] },
        attribute: { score: 0.88, confidence: 'high', evidence: ['heating system', 'temperature control'] },
        behavioral: { score: 0.72, confidence: 'medium', evidence: ['14% co-view rate'] },
        content: { score: 0.69, confidence: 'medium', evidence: ['comfort imagery'] },
        external: { score: 0.76, confidence: 'high', evidence: ['heated pool queries'] },
        temporal: { score: 0.91, confidence: 'high', evidence: ['winter correlation'] },
        statistical: { score: 0.74, confidence: 'high', evidence: ['comfort cluster'] },
        business: { score: 0.78, confidence: 'medium', evidence: ['2.8 bps GP lift'] }
      },
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
