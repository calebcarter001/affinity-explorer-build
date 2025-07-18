/**
 * Evidence-Backed Snippet Generator Service
 * Orchestrates property description generation for Expedia CRP system
 * Packages concepts, evidence, tokens, and weights for LLM processing
 */

class SnippetGeneratorService {
  constructor() {
    // API configuration - will use environment variables when available
    this.apiEndpoint = import.meta.env.VITE_LLM_ENDPOINT || 'http://localhost:5000/api/generate';
    this.openaiApiKey = import.meta.env.VITE_OPENAI_API_KEY;
    this.flaskEndpoint = import.meta.env.VITE_FLASK_ENDPOINT || 'http://localhost:5000';
    
    // Quality thresholds for content scoring
    this.qualityThresholds = {
      readability: { min: 60, max: 90 }, // Flesch-Kincaid score
      keywordDensity: { min: 1, max: 3 }, // Percentage
      evidenceCoverage: { min: 70, max: 100 }, // Evidence integration percentage
      lengthLimits: {
        'Property Detail Page': { min: 50, max: 160 },
        'Search Results Page': { min: 30, max: 120 },
        'Email Campaign': { min: 20, max: 60 },
        'Social Media': { min: 100, max: 280 }
      }
    };
    
    // Content quality controls
    this.bannedWords = ['amazing', 'incredible', 'unbelievable', 'perfect', 'ultimate'];
    this.cache = new Map(); // Simple in-memory cache for 15min TTL
    this.cacheTimeout = 15 * 60 * 1000; // 15 minutes
    
    // Token templates for property customization
    this.tokenTemplates = {
      'PROPERTY_NAME': 'The Grand Resort',
      'LOCATION': 'Miami Beach',
      'CITY': 'Miami',
      'STATE': 'Florida',
      'COUNTRY': 'United States',
      'PRICE_RANGE': '$150-250',
      'STAR_RATING': '4-star',
      'AMENITY_COUNT': '25+'
    };
  }

  /**
   * Generate evidence-backed property descriptions for Expedia CRP system
   * Packages all CRP inputs (concepts, evidence, tokens, weights) for LLM processing
   * @param {Object} params - Complete CRP generation parameters
   * @param {Array} params.concepts - Primary and related concepts with weights
   * @param {string} params.tone - Brand tone (luxury, family-friendly, business, etc.)
   * @param {string} params.surface - Content surface type
   * @param {Object} params.weights - Concept weight allocation (primary, secondary, tertiary)
   * @param {Array} params.evidence - Supporting evidence from traveler reviews
   * @param {Array} params.tokens - Replaceable tokens for property customization
   * @param {string} params.language - Target language (default: 'en-US')
   * @returns {Promise<Object>} Generated variants with quality scores, metadata, and user tips
   */
  async generateSnippets(params) {
    const { concepts, tone, surface, weights, evidence, tokens, language = 'en-US' } = params;
    
    // Generate cache key for request
    const cacheKey = this.generateCacheKey(params);
    
    // Check cache first
    const cached = this.getFromCache(cacheKey);
    if (cached) {
      return {
        ...cached,
        cache_hit: true,
        generation_id: `cached_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
      };
    }
    
    // Package all CRP inputs for LLM
    const llmPayload = this.packageCRPInputs({
      concepts,
      tone,
      surface,
      weights,
      evidence,
      tokens,
      language
    });
    
    console.log('🎯 CRP LLM Payload:', llmPayload);
    
    try {
      // Attempt to call actual LLM service if available
      let llmResponse;
      if (this.openaiApiKey || this.flaskEndpoint) {
        llmResponse = await this.callLLMService(llmPayload);
      } else {
        // Fallback to enhanced mock for development
        llmResponse = await this.generateMockLLMResponse(llmPayload);
      }
      
      // Process LLM response into CRP format
      const processedResult = this.processLLMResponse(llmResponse, params);
      
      const result = {
        success: true,
        variants: processedResult.variants,
        cache_hit: false,
        generation_id: `gen_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        metadata: {
          generated_at: new Date().toISOString(),
          primary_concept: concepts[0]?.name,
          tone,
          surface,
          language,
          total_evidence: evidence?.length || 0,
          concept_count: concepts.length,
          processing_time: processedResult.processing_time,
          llm_model: processedResult.model_used,
          quality_analysis: processedResult.quality_analysis
        },
        user_tips: processedResult.user_tips,
        processing_insights: processedResult.processing_insights
      };
      
      // Cache the result
      this.setCache(cacheKey, result);
      
      return result;
    } catch (error) {
      console.error('🚨 CRP LLM Generation Failed:', error);
      return {
        success: false,
        error: error.message,
        variants: [],
        cache_hit: false,
        generation_id: `error_${Date.now()}`,
        user_tips: [
          'Check your internet connection and try again',
          'Consider simplifying your concept selection',
          'Ensure evidence sources are properly formatted'
        ]
      };
    }
  }

  /**
   * Call actual LLM service (OpenAI or Flask endpoint)
   */
  async callLLMService(payload) {
    const startTime = Date.now();
    
    try {
      // Try Flask endpoint first if available
      if (this.flaskEndpoint) {
        const response = await fetch(`${this.flaskEndpoint}/api/generate-snippet`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(payload)
        });
        
        if (!response.ok) {
          throw new Error(`Flask service error: ${response.status}`);
        }
        
        const result = await response.json();
        result.processing_time = Date.now() - startTime;
        result.service_used = 'flask';
        return result;
      }
      
      // Fallback to direct OpenAI call if Flask unavailable
      if (this.openaiApiKey) {
        const response = await fetch('https://api.openai.com/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${this.openaiApiKey}`
          },
          body: JSON.stringify({
            model: 'gpt-4',
            messages: [
              {
                role: 'system',
                content: this.buildSystemPrompt(payload)
              },
              {
                role: 'user',
                content: this.buildUserPrompt(payload)
              }
            ],
            temperature: 0.7,
            max_tokens: 1500
          })
        });
        
        if (!response.ok) {
          throw new Error(`OpenAI API error: ${response.status}`);
        }
        
        const result = await response.json();
        const processedResult = this.parseOpenAIResponse(result);
        processedResult.processing_time = Date.now() - startTime;
        processedResult.service_used = 'openai';
        return processedResult;
      }
      
      throw new Error('No LLM service available');
    } catch (error) {
      console.error('🚨 LLM Service Call Failed:', error);
      throw error;
    }
  }
  
  /**
   * Generate enhanced mock LLM response for development
   */
  async generateMockLLMResponse(payload) {
    const startTime = Date.now();
    
    // Simulate realistic API delay
    await new Promise(resolve => setTimeout(resolve, 2000 + Math.random() * 1000));
    
    // Simulate occasional failures for realistic testing
    if (Math.random() < 0.05) {
      throw new Error('Mock LLM service temporarily unavailable');
    }
    
    const { concept_hierarchy, content_specs, evidence_sources } = payload;
    const primaryConcept = concept_hierarchy.primary.concept;
    const secondaryConcepts = concept_hierarchy.secondary;
    
    const variants = [];
    const styles = ['descriptive', 'persuasive', 'concise'];
    
    // Generate 3 variants with different approaches
    for (let i = 0; i < 3; i++) {
      const variantId = String.fromCharCode(65 + i);
      const style = styles[i];
      
      const content = this.generateVariantContent(
        primaryConcept, 
        secondaryConcepts.map(s => s.concept), 
        content_specs.tone, 
        style, 
        evidence_sources.traveler_reviews
      );
      
      const tokens = this.extractTokens(content_specs.surface_type);
      const quality = this.calculateQualityScore(content, content_specs.surface_type, evidence_sources.traveler_reviews);
      const evidenceHighlights = this.extractRelevantEvidence(evidence_sources.traveler_reviews, style);
      
      variants.push({
        id: variantId,
        snippet: content,
        quality,
        evidence: evidenceHighlights,
        tokens,
        generation_time: Date.now(),
        surface_type: content_specs.surface_type,
        style,
        language: content_specs.language
      });
    }
    
    return {
      success: true,
      variants,
      processing_time: Date.now() - startTime,
      model_used: 'mock-gpt-4',
      service_used: 'mock',
      quality_analysis: {
        overall_score: 85,
        readability_grade: 8.5,
        evidence_integration: 78,
        concept_coverage: 92
      },
      user_tips: this.generateUserTips(payload),
      processing_insights: this.generateProcessingInsights(payload)
    };
  }
  
  /**
   * Process LLM response into CRP format
   */
  processLLMResponse(llmResponse, originalParams) {
    if (!llmResponse.success) {
      throw new Error(llmResponse.error || 'LLM processing failed');
    }
    
    return {
      variants: llmResponse.variants,
      processing_time: llmResponse.processing_time,
      model_used: llmResponse.model_used || 'unknown',
      quality_analysis: llmResponse.quality_analysis,
      user_tips: llmResponse.user_tips || [],
      processing_insights: llmResponse.processing_insights || {}
    };
  }
  
  /**
   * Package all CRP inputs into structured payload for LLM processing
   * This is the core orchestration method that combines concepts, evidence, tokens, and weights
   */
  packageCRPInputs(params) {
    const { concepts, tone, surface, weights, evidence, tokens, language } = params;
    
    // Extract primary, secondary, and tertiary concepts with weights
    const primaryConcept = concepts[0];
    const secondaryConcepts = concepts.slice(1, 3); // Up to 2 secondary concepts
    const tertiaryConcepts = concepts.slice(3); // Remaining as tertiary
    
    // Structure evidence by concept relevance
    const structuredEvidence = this.structureEvidenceByRelevance(evidence, concepts);
    
    // Generate token mappings for this property
    const tokenMappings = this.generateTokenMappings(tokens);
    
    // Create comprehensive LLM payload
    const payload = {
      // Core CRP Configuration
      task: 'generate_property_description',
      system_context: {
        platform: 'expedia',
        use_case: 'property_marketing_copy',
        target_audience: 'travelers',
        brand_voice: 'trustworthy_and_informative'
      },
      
      // Concept Hierarchy with Weights
      concept_hierarchy: {
        primary: {
          concept: primaryConcept,
          weight: weights.primary,
          importance: 'highest',
          role: 'main_theme'
        },
        secondary: secondaryConcepts.map(concept => ({
          concept,
          weight: weights.secondary / secondaryConcepts.length,
          importance: 'high',
          role: 'supporting_theme'
        })),
        tertiary: tertiaryConcepts.map(concept => ({
          concept,
          weight: weights.tertiary / Math.max(tertiaryConcepts.length, 1),
          importance: 'medium',
          role: 'contextual_enhancement'
        }))
      },
      
      // Evidence Integration
      evidence_sources: {
        traveler_reviews: structuredEvidence,
        evidence_requirements: {
          minimum_coverage: 70,
          attribution_style: 'subtle_integration',
          confidence_threshold: 'medium'
        }
      },
      
      // Content Specifications
      content_specs: {
        surface_type: surface,
        tone,
        language,
        length_target: this.qualityThresholds.lengthLimits[surface],
        style_requirements: {
          readability_target: 'grade_8_9',
          keyword_density: '2-3%',
          avoid_superlatives: true,
          banned_words: this.bannedWords
        }
      },
      
      // Token System
      token_system: {
        available_tokens: Object.keys(this.tokenTemplates),
        token_mappings: tokenMappings,
        replacement_strategy: 'contextual_insertion'
      },
      
      // Output Requirements
      output_requirements: {
        variant_count: 3,
        variant_styles: ['descriptive', 'persuasive', 'concise'],
        include_metadata: true,
        quality_scoring: true,
        evidence_attribution: true,
        user_tips: true
      }
    };
    
    return payload;
  }
  
  /**
   * Structure evidence by relevance to concepts
   */
  structureEvidenceByRelevance(evidence, concepts) {
    if (!evidence || !Array.isArray(evidence)) return [];
    
    return evidence.map(item => {
      // Handle both string and object evidence formats
      const evidenceText = typeof item === 'string' ? item : 
                          item.sentence || item.description || item.text || String(item);
      
      return {
        text: evidenceText,
        source: item.source || 'traveler_review',
        confidence: item.confidence || 'medium',
        relevance_score: item.relevance_score || 0.8,
        concept_alignment: this.calculateConceptAlignment(evidenceText, concepts)
      };
    });
  }
  
  /**
   * Generate token mappings for property customization
   */
  generateTokenMappings(tokens) {
    const mappings = { ...this.tokenTemplates };
    
    // Override with any provided token values
    if (tokens && Array.isArray(tokens)) {
      tokens.forEach(token => {
        if (token.key && token.value) {
          mappings[token.key] = token.value;
        }
      });
    }
    
    return mappings;
  }
  
  /**
   * Calculate how well evidence aligns with concepts
   */
  calculateConceptAlignment(evidenceText, concepts) {
    const alignment = {};
    
    concepts.forEach(concept => {
      const conceptName = concept.name || concept;
      const conceptTerms = conceptName.toLowerCase().split(' ');
      const evidenceLower = evidenceText.toLowerCase();
      
      // Simple keyword matching for alignment score
      const matchCount = conceptTerms.filter(term => evidenceLower.includes(term)).length;
      alignment[conceptName] = matchCount / conceptTerms.length;
    });
    
    return alignment;
  }
  
  /**
   * Generate user tips based on CRP configuration
   */
  generateUserTips(payload) {
    const tips = [];
    const { concept_hierarchy, evidence_sources, content_specs } = payload;
    
    // Concept-based tips
    if (concept_hierarchy.secondary.length === 0) {
      tips.push('Consider adding secondary concepts to create richer, more comprehensive descriptions');
    }
    
    if (concept_hierarchy.primary.weight < 0.4) {
      tips.push('Primary concept weight is low - consider increasing it for stronger thematic focus');
    }
    
    // Evidence-based tips
    if (evidence_sources.traveler_reviews.length < 3) {
      tips.push('More evidence sources will improve content authenticity and trustworthiness');
    }
    
    const lowConfidenceEvidence = evidence_sources.traveler_reviews.filter(e => e.confidence === 'low').length;
    if (lowConfidenceEvidence > evidence_sources.traveler_reviews.length * 0.5) {
      tips.push('Consider filtering out low-confidence evidence for better quality results');
    }
    
    // Content specification tips
    if (content_specs.surface_type === 'Social Media' && content_specs.tone === 'Business') {
      tips.push('Business tone might be too formal for social media - consider a more casual approach');
    }
    
    // Quality tips
    tips.push('Use the Evidence tab to review which traveler insights support each concept');
    tips.push('Check the Tokens tab to customize property-specific details before publishing');
    
    return tips.slice(0, 4); // Limit to 4 most relevant tips
  }
  
  /**
   * Generate processing insights for transparency
   */
  generateProcessingInsights(payload) {
    const { concept_hierarchy, evidence_sources, content_specs } = payload;
    
    return {
      concept_processing: {
        primary_weight_applied: concept_hierarchy.primary.weight,
        secondary_concepts_count: concept_hierarchy.secondary.length,
        tertiary_concepts_count: concept_hierarchy.tertiary.length,
        total_concept_coverage: concept_hierarchy.primary.weight + 
                               concept_hierarchy.secondary.reduce((sum, c) => sum + c.weight, 0) +
                               concept_hierarchy.tertiary.reduce((sum, c) => sum + c.weight, 0)
      },
      evidence_processing: {
        total_evidence_pieces: evidence_sources.traveler_reviews.length,
        high_confidence_count: evidence_sources.traveler_reviews.filter(e => e.confidence === 'high').length,
        medium_confidence_count: evidence_sources.traveler_reviews.filter(e => e.confidence === 'medium').length,
        low_confidence_count: evidence_sources.traveler_reviews.filter(e => e.confidence === 'low').length,
        average_relevance: evidence_sources.traveler_reviews.reduce((sum, e) => sum + e.relevance_score, 0) / evidence_sources.traveler_reviews.length
      },
      content_optimization: {
        target_length: content_specs.length_target,
        tone_applied: content_specs.tone,
        surface_optimized: content_specs.surface_type,
        banned_words_filtered: content_specs.style_requirements.banned_words.length
      }
    };
  }
  
  /**
   * Build system prompt for OpenAI
   */
  buildSystemPrompt(payload) {
    return `You are an expert copywriter for Expedia, specializing in property descriptions that convert browsers into bookers.

Your task is to generate ${payload.output_requirements.variant_count} property description variants that:
1. Blend the provided concepts with appropriate weights
2. Integrate traveler review evidence naturally
3. Match the specified tone and surface type
4. Include replaceable tokens for property customization
5. Achieve optimal readability and keyword density

IMPORTANT: Return a JSON response with this exact structure:
{
  "success": true,
  "variants": [
    {
      "id": "A",
      "snippet": "Generated content here...",
      "style": "descriptive",
      "quality": {
        "readability": 85,
        "evidence_coverage": 78,
        "keyword_density": 2.1
      },
      "evidence": ["Supporting evidence snippets"],
      "tokens": [{"key": "PROPERTY_NAME", "value": "{{PROPERTY_NAME}}", "editable": true}]
    }
  ],
  "quality_analysis": {
    "overall_score": 85,
    "readability_grade": 8.5,
    "evidence_integration": 78,
    "concept_coverage": 92
  },
  "user_tips": ["Helpful tips for the user"],
  "processing_insights": {"key": "insights about processing"}
}`;
  }
  
  /**
   * Build user prompt for OpenAI
   */
  buildUserPrompt(payload) {
    const { concept_hierarchy, evidence_sources, content_specs, token_system } = payload;
    
    return `Generate property descriptions with these specifications:

CONCEPT HIERARCHY:
Primary (${concept_hierarchy.primary.weight}): ${concept_hierarchy.primary.concept.name}
Secondary: ${concept_hierarchy.secondary.map(s => `${s.concept.name} (${s.weight})`).join(', ')}
Tertiary: ${concept_hierarchy.tertiary.map(t => `${t.concept.name} (${t.weight})`).join(', ')}

EVIDENCE TO INTEGRATE:
${evidence_sources.traveler_reviews.map(e => `- "${e.text}" (${e.confidence} confidence)`).join('\n')}

CONTENT SPECIFICATIONS:
- Surface: ${content_specs.surface_type}
- Tone: ${content_specs.tone}
- Length: ${content_specs.length_target.min}-${content_specs.length_target.max} characters
- Language: ${content_specs.language}

AVAILABLE TOKENS:
${token_system.available_tokens.map(t => `{{${t}}}`).join(', ')}

Generate 3 variants (descriptive, persuasive, concise) that naturally weave these concepts and evidence together.`;
  }
  
  /**
   * Parse OpenAI response into expected format
   */
  parseOpenAIResponse(openaiResponse) {
    try {
      const content = openaiResponse.choices[0].message.content;
      const parsed = JSON.parse(content);
      
      return {
        success: true,
        variants: parsed.variants,
        quality_analysis: parsed.quality_analysis,
        user_tips: parsed.user_tips,
        processing_insights: parsed.processing_insights,
        model_used: openaiResponse.model
      };
    } catch (error) {
      console.error('Failed to parse OpenAI response:', error);
      throw new Error('Invalid LLM response format');
    }
  }
  
  /**
   * Generate variant content based on concepts, tone, and style
   */
  generateVariantContent(primary, secondary, tone, style, evidence) {
    const toneMap = {
      'Luxury': 'premium',
      'Pet-Friendly': 'welcoming',
      'Family-Friendly': 'family-oriented',
      'Business': 'professional',
      'Value': 'affordable'
    };
    
    const toneAdj = toneMap[tone] || 'exceptional';
    const primaryName = primary?.name || 'amenity';
    const secondaryNames = secondary.map(c => c.name).slice(0, 2);
    
    let content = '';
    
    switch (style) {
      case 'descriptive':
        content = `Experience the ${toneAdj} comfort of our ${primaryName.toLowerCase()}. `;
        if (secondaryNames.length > 0) {
          content += `Enjoy ${secondaryNames.join(' and ').toLowerCase()} while taking advantage of our premium facilities. `;
        }
        content += `Perfect for guests seeking ${toneAdj} accommodations with thoughtful amenities.`;
        break;
        
      case 'persuasive':
        content = `Discover why our ${primaryName.toLowerCase()} sets us apart. `;
        if (secondaryNames.length > 0) {
          content += `With ${secondaryNames.join(' and ').toLowerCase()}, we deliver ${toneAdj} experiences that exceed expectations. `;
        }
        content += `Book now for an unforgettable ${toneAdj} getaway.`;
        break;
        
      case 'concise':
        content = `${toneAdj} ${primaryName.toLowerCase()} available. `;
        if (secondaryNames.length > 0) {
          content += `Includes ${secondaryNames.join(' & ').toLowerCase()}. `;
        }
        content += `Reserve today.`;
        break;
        
      default:
        content = `Experience our ${toneAdj} ${primaryName.toLowerCase()} and premium amenities.`;
    }
    
    return content;
  }
  
  /**
   * Cache management methods
   */
  generateCacheKey(params) {
    const { concepts, tone, surface, weights, evidence } = params;
    const keyData = {
      primary: concepts[0]?.name,
      secondary: concepts.slice(1, 3).map(c => c.name).sort(),
      tone,
      surface,
      weights: `${weights?.primary || 50}-${weights?.secondary || 30}-${weights?.tertiary || 20}`,
      evidence_count: evidence?.length || 0
    };
    return btoa(JSON.stringify(keyData)).replace(/[^a-zA-Z0-9]/g, '').substring(0, 32);
  }
  
  getFromCache(key) {
    const cached = this.cache.get(key);
    if (cached && Date.now() - cached.timestamp < this.cacheTimeout) {
      return cached.data;
    }
    if (cached) {
      this.cache.delete(key); // Remove expired entry
    }
    return null;
  }
  
  setCache(key, data) {
    this.cache.set(key, {
      data,
      timestamp: Date.now()
    });
    
    // Clean up old entries periodically
    if (this.cache.size > 100) {
      const oldestKeys = Array.from(this.cache.keys()).slice(0, 20);
      oldestKeys.forEach(k => this.cache.delete(k));
    }
  }
  
  /**
   * Mock LLM generation for MVP (replace with actual OpenAI service)
   */
  async mockLLMGeneration({ concepts, tone, surface, weights, evidence }) {
    const primaryConcept = concepts[0];
    const relatedConcepts = concepts.slice(1);
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1500));

    const templates = this.getTemplatesByToneAndSurface(tone, surface);
    const variants = [];

    for (let i = 0; i < 3; i++) {
      const template = templates[i] || templates[0];
      const content = this.populateTemplate(template, {
        primaryConcept,
        relatedConcepts,
        weights,
        evidence,
        variant: String.fromCharCode(65 + i) // A, B, C
      });

      variants.push({
        id: `variant-${String.fromCharCode(65 + i).toLowerCase()}`,
        label: `Variant ${String.fromCharCode(65 + i)}`,
        content,
        tokens: this.extractTokens(content),
        confidence: 0.85 + (Math.random() * 0.1), // 85-95%
        evidenceUsed: evidence?.slice(0, 3 + i) || []
      });
    }

    return variants;
  }

  /**
   * Get content templates based on tone and surface
   */
  getTemplatesByToneAndSurface(tone, surface) {
    const templates = {
      professional: {
        'web-listing': [
          'Experience {{PRIMARY_CONCEPT}} with {{RELATED_CONCEPT_1}} and {{RELATED_CONCEPT_2}}. Our {{SURFACE_TYPE}} offers premium amenities designed for discerning guests.',
          'Discover {{PRIMARY_CONCEPT}} featuring {{RELATED_CONCEPT_1}}. Perfect for {{TARGET_AUDIENCE}} seeking luxury and comfort.',
          'Enjoy {{PRIMARY_CONCEPT}} with exclusive {{RELATED_CONCEPT_1}} access. Elevate your stay with our signature amenities.'
        ],
        'email-subject': [
          '{{PRIMARY_CONCEPT}} + {{RELATED_CONCEPT_1}} = Perfect Stay',
          'Exclusive {{PRIMARY_CONCEPT}} Experience Awaits',
          'Your {{PRIMARY_CONCEPT}} Getaway Starts Here'
        ],
        'social-media': [
          'Dive into luxury with our {{PRIMARY_CONCEPT}} featuring {{RELATED_CONCEPT_1}} and {{RELATED_CONCEPT_2}}. Book now for an unforgettable experience! #{{HASHTAG}}',
          'Experience the perfect blend of {{PRIMARY_CONCEPT}} and {{RELATED_CONCEPT_1}}. Your ideal vacation awaits! #{{HASHTAG}}',
          'Discover why our {{PRIMARY_CONCEPT}} with {{RELATED_CONCEPT_1}} is the talk of the town. Reserve your spot today! #{{HASHTAG}}'
        ]
      },
      casual: {
        'web-listing': [
          'Jump into our {{PRIMARY_CONCEPT}} and chill with {{RELATED_CONCEPT_1}}! Perfect for hanging out and making memories.',
          'Our {{PRIMARY_CONCEPT}} is where the fun happens! Plus {{RELATED_CONCEPT_1}} for extra good vibes.',
          'Ready for some {{PRIMARY_CONCEPT}} action? We\'ve got {{RELATED_CONCEPT_1}} and more to keep you happy!'
        ]
      },
      luxury: {
        'web-listing': [
          'Indulge in our exquisite {{PRIMARY_CONCEPT}} experience, complemented by {{RELATED_CONCEPT_1}} and {{RELATED_CONCEPT_2}}. Crafted for the most discerning tastes.',
          'Immerse yourself in the epitome of {{PRIMARY_CONCEPT}} luxury, featuring bespoke {{RELATED_CONCEPT_1}} amenities.',
          'Experience unparalleled {{PRIMARY_CONCEPT}} sophistication with our curated {{RELATED_CONCEPT_1}} offerings.'
        ]
      }
    };

    return templates[tone]?.[surface] || templates.professional[surface] || templates.professional['web-listing'];
  }

  /**
   * Populate template with actual concept data
   */
  populateTemplate(template, { primaryConcept, relatedConcepts, weights, evidence, variant }) {
    let content = template;
    
    // Replace primary concept
    content = content.replace(/\{\{PRIMARY_CONCEPT\}\}/g, primaryConcept.name);
    
    // Replace related concepts
    relatedConcepts.forEach((concept, index) => {
      const token = `{{RELATED_CONCEPT_${index + 1}}}`;
      content = content.replace(new RegExp(token, 'g'), concept.name);
    });
    
    // Replace other tokens
    content = content.replace(/\{\{SURFACE_TYPE\}\}/g, 'property');
    content = content.replace(/\{\{TARGET_AUDIENCE\}\}/g, 'travelers');
    content = content.replace(/\{\{HASHTAG\}\}/g, 'LuxuryTravel');
    
    return content;
  }

  /**
   * Calculate comprehensive quality score for generated content
   */
  calculateQualityScore(content, surface, evidence) {
    const evidenceCoverage = Math.min((evidence?.length || 0) / 5, 1); // Max 5 evidence pieces
    const readabilityScore = this.calculateReadabilityScore(content);
    const keywordDensity = this.calculateKeywordDensity(content);
    const lengthFit = this.calculateLengthFit(content, surface);
    const complianceScore = this.calculateComplianceScore(content);
    
    // Quality scoring heuristic: 0.4 * readability + 0.3 * evidence + 0.2 * length + 0.1 * keywords
    const overall = Math.min(95, Math.round(
      0.4 * readabilityScore + 
      0.3 * (evidenceCoverage * 100) + 
      0.2 * lengthFit + 
      0.1 * keywordDensity
    ));
    
    return {
      overall,
      readability: Math.round(readabilityScore),
      evidence_coverage: Math.round(evidenceCoverage * 100),
      keyword_density: Math.round(keywordDensity),
      length_fit: Math.round(lengthFit),
      compliance_score: Math.round(complianceScore)
    };
  }

  /**
   * Calculate Flesch-Kincaid readability score (simplified)
   */
  calculateReadabilityScore(content) {
    // Simplified Flesch-Kincaid approximation
    const words = content.split(/\s+/).length;
    const sentences = content.split(/[.!?]+/).length;
    const syllables = content.split(/[aeiouAEIOU]/).length - 1;
    
    if (words === 0 || sentences === 0) return 75;
    
    const avgWordsPerSentence = words / sentences;
    const avgSyllablesPerWord = syllables / words;
    
    // Flesch Reading Ease approximation (converted to 0-100 scale)
    const fleschScore = 206.835 - (1.015 * avgWordsPerSentence) - (84.6 * avgSyllablesPerWord);
    return Math.max(0, Math.min(100, fleschScore));
  }
  
  calculateKeywordDensity(content) {
    const words = content.toLowerCase().split(/\s+/);
    const totalWords = words.length;
    
    // Count keyword repetitions (simple approach)
    const wordCounts = {};
    words.forEach(word => {
      if (word.length > 3) { // Only count meaningful words
        wordCounts[word] = (wordCounts[word] || 0) + 1;
      }
    });
    
    const maxRepeats = Math.max(...Object.values(wordCounts));
    const density = (maxRepeats / totalWords) * 100;
    
    // Optimal density is 1-3%, penalize outside this range
    if (density >= 1 && density <= 3) return 90 + (Math.random() * 10);
    if (density < 1) return 70 + (density * 20);
    return Math.max(50, 90 - ((density - 3) * 10));
  }
  
  calculateLengthFit(content, surface) {
    const length = content.length;
    const limits = this.qualityThresholds.lengthLimits[surface];
    
    if (!limits) return 85 + (Math.random() * 10); // Default good score
    
    if (length >= limits.min && length <= limits.max) {
      return 90 + (Math.random() * 10); // Perfect fit
    }
    
    const deviation = length < limits.min ? 
      (limits.min - length) / limits.min : 
      (length - limits.max) / limits.max;
    
    return Math.max(50, 90 - (deviation * 40));
  }
  
  calculateComplianceScore(content) {
    let score = 100;
    
    // Check for banned words
    const lowerContent = content.toLowerCase();
    this.bannedWords.forEach(word => {
      if (lowerContent.includes(word.toLowerCase())) {
        score -= 15; // Penalty for each banned word
      }
    });
    
    // Check for other compliance issues (placeholder implementation)
    if (content.length < 10) score -= 20; // Too short
    if (!/[.!?]$/.test(content.trim())) score -= 10; // No proper ending
    
    return Math.max(60, score);
  }

  /**
   * Extract relevant evidence for content generation
   */
  extractRelevantEvidence(allEvidence, style) {
    if (!allEvidence || allEvidence.length === 0) return [];
    
    // Return top 3-5 most relevant evidence pieces based on style
    return allEvidence.slice(0, Math.min(5, allEvidence.length)).map((item, index) => ({
      sentence: this.generateEvidenceSentence(item, style),
      source: item.type || 'similarity_analysis',
      confidence: item.confidence || 'medium',
      highlight_start: index * 20, // Mock character positions
      highlight_end: (index * 20) + 15
    }));
  }
  
  generateEvidenceSentence(evidence, style) {
    const sentences = {
      'descriptive': [
        'premium pet-friendly accommodations',
        'seasonal winter activities available',
        'trending modern amenities included',
        'luxury pool facilities',
        'exclusive guest services'
      ],
      'persuasive': [
        'award-winning pet services',
        'exclusive winter experiences',
        'most popular amenities',
        'top-rated facilities',
        'guest-favorite features'
      ],
      'concise': [
        'pet-friendly',
        'winter season',
        'trending amenities',
        'luxury pool',
        'premium service'
      ]
    };
    
    const styleOptions = sentences[style] || sentences['descriptive'];
    return styleOptions[Math.floor(Math.random() * styleOptions.length)];
  }
  
  /**
   * Extract and generate tokens for content customization
   */
  extractTokens(surface) {
    const commonTokens = [
      { placeholder: '{{PROPERTY_NAME}}', value: 'Mountain View Resort', editable: true },
      { placeholder: '{{LOCATION}}', value: 'Colorado Springs', editable: true }
    ];
    
    const surfaceTokens = {
      'Property Detail Page': [
        { placeholder: '{{BOOKING_URL}}', value: '/book-now', editable: true },
        { placeholder: '{{PHONE}}', value: '(555) 123-4567', editable: true }
      ],
      'Search Results Page': [
        { placeholder: '{{PRICE}}', value: '$299/night', editable: true },
        { placeholder: '{{RATING}}', value: '4.8/5', editable: false }
      ],
      'Email Campaign': [
        { placeholder: '{{GUEST_NAME}}', value: 'Valued Guest', editable: false },
        { placeholder: '{{DISCOUNT}}', value: '15%', editable: true }
      ],
      'Social Media': [
        { placeholder: '{{HASHTAG}}', value: '#LuxuryTravel', editable: true },
        { placeholder: '{{HANDLE}}', value: '@resort', editable: true }
      ]
    };
    
    return [...commonTokens, ...(surfaceTokens[surface] || [])];
  }

  /**
   * Generate evidence highlights for trust signals
   */
  generateEvidenceHighlights(variant, evidence) {
    if (!evidence || evidence.length === 0) return [];
    
    const content = variant.content.toLowerCase();
    const highlights = [];
    
    evidence.forEach((item, index) => {
      if (index < 3) { // Limit to top 3 evidence items
        const keywords = item.description?.toLowerCase().split(' ') || [];
        const matchingKeywords = keywords.filter(keyword => 
          keyword.length > 3 && content.includes(keyword)
        );
        
        if (matchingKeywords.length > 0) {
          highlights.push({
            evidenceId: item.id,
            matchingText: matchingKeywords[0],
            evidenceType: item.type,
            confidence: item.confidence,
            description: item.description
          });
        }
      }
    });
    
    return highlights;
  }
}

// Export singleton instance
export const snippetGenerator = new SnippetGeneratorService();
export default snippetGenerator;
