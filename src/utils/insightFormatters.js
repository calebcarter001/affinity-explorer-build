// Formatting utilities for different export formats

export const formatters = {
  // Plain text format - simple and clean
  plain: (insight) => {
    if (typeof insight === 'string') return insight;
    
    if (insight.type === 'list') {
      return insight.value; // Use the full value, not items
    }
    
    return `${insight.label}: ${insight.value}`;
  },

  // Markdown format - for documentation
  markdown: (insight) => {
    if (typeof insight === 'string') return insight;
    
    if (insight.type === 'list') {
      // Split the value by comma and create bullet points
      const items = insight.value.split(',').map(item => item.trim());
      return `**${insight.label}:**\n${items.map(item => `- ${item}`).join('\n')}`;
    }
    
    return `**${insight.label}:** ${insight.value}`;
  },

  // Rich format with metadata
  detailed: (insight, context = {}) => {
    const timestamp = new Date().toLocaleString();
    const source = context.source || 'Affinity Explorer';
    
    if (typeof insight === 'string') {
      return `${insight}\n\nSource: ${source}\nCopied: ${timestamp}`;
    }
    
    let formatted = `${insight.label}: ${insight.value}`;
    
    // Add context information
    if (context.field) {
      formatted = `${context.field}: ${insight.value}`;
    }
    
    if (insight.confidence) {
      formatted += `\nConfidence: ${Math.round(insight.confidence * 100)}%`;
    }
    
    if (context.type) {
      formatted += `\nType: ${context.type}`;
    }
    
    formatted += `\n\nSource: ${source}\nCopied: ${timestamp}`;
    
    return formatted;
  },

  // JSON format for programmatic use
  json: (insight, context = {}) => {
    return JSON.stringify({
      ...insight,
      metadata: {
        source: context.source || 'Affinity Explorer',
        timestamp: new Date().toISOString(),
        context: context.type
      }
    }, null, 2);
  }
};

// Format individual insights based on their type
export const formatInsight = (insight, format = 'plain', context = {}) => {
  const formatter = formatters[format];
  if (!formatter) {
    console.warn(`Unknown format: ${format}, using plain`);
    return formatters.plain(insight);
  }
  
  return formatter(insight, context);
};

// Format multiple insights for bulk export
export const formatInsightCollection = (insights, format = 'plain', context = {}) => {
  return insights
    .map(insight => formatInsight(insight, format, context))
    .join('\n\n');
};

/**
 * Format complete theme card data for copying
 * @param {Object} theme - The theme object containing all data
 * @param {string} format - The desired format (detailed, plain, markdown, json)
 * @returns {string} Formatted theme data
 */
export const formatCompleteTheme = (theme, format = 'detailed') => {
  if (!theme) return '';

  // Extract all the data
  const themeName = theme.name || theme.theme || 'Unnamed Theme';
  const themeDescription = theme.description || theme.rationale || '';
  const confidence = theme.confidence || 0.5;
  const category = theme.category || 'experience';
  const subThemes = theme.sub_themes || theme.subThemes || [];
  const nanoThemes = theme.nano_themes || theme.nanoThemes || [];
  
  // Extract enhanced attributes
  const bestFor = theme.bestFor || (theme.contextual_info?.demographic_suitability?.join(', ')) || 'All travelers';
  const timeNeeded = theme.timeNeeded || theme.contextual_info?.time_commitment || 'Flexible';
  const intensity = theme.intensity || theme.experience_intensity?.overall_intensity || 'Moderate';
  const priceRange = theme.priceRange || theme.price_insights?.price_category || theme.price_point || 'Mid';
  
  // Handle emotions data
  const getEmotionsArray = () => {
    const emotionsData = theme.emotions || theme.emotional_profile?.primary_emotions;
    
    if (!emotionsData) return ['contemplative'];
    
    if (Array.isArray(emotionsData)) {
      return emotionsData;
    }
    
    if (typeof emotionsData === 'object') {
      return Object.keys(emotionsData);
    }
    
    if (typeof emotionsData === 'string') {
      return [emotionsData];
    }
    
    return ['contemplative'];
  };
  
  const emotions = getEmotionsArray();
  const bestSeason = theme.bestSeason || (theme.seasonality?.peak?.join(', ')) || 'Year-round';
  const culturalSensitivity = theme.culturalSensitivity || 
    (theme.cultural_sensitivity?.considerations ? theme.cultural_sensitivity.considerations.join(', ') : '');
  
  // Get intelligence badges
  const intelligenceBadges = theme.intelligenceBadges || ['nano', 'balanced', 'off beaten path', 'inspiring'];

  const timestamp = new Date().toLocaleString();

  switch (format) {
    case 'plain':
      return `${themeName}
Category: ${category}
Confidence: ${Math.round(confidence * 100)}%
Description: ${themeDescription}

Intelligence Badges: ${intelligenceBadges.join(', ')}

Sub-themes: ${subThemes.join(', ')}
Nano Themes: ${nanoThemes.join(', ')}

Key Insights:
• Best For: ${bestFor}
• Time Needed: ${timeNeeded}
• Intensity: ${intensity}
• Price Range: ${priceRange}
• Emotions: ${emotions.join(', ')}
• Best Season: ${bestSeason}${culturalSensitivity ? `\n• Cultural: ${culturalSensitivity}` : ''}

Copied: ${timestamp}`;

    case 'markdown':
      return `# ${themeName}

**Category:** ${category}  
**Confidence:** ${Math.round(confidence * 100)}%

${themeDescription}

## Intelligence Badges
${intelligenceBadges.map(badge => `- ${badge}`).join('\n')}

## Sub-themes
${subThemes.map(theme => `- ${theme}`).join('\n')}

## Nano Themes
${nanoThemes.map(theme => `- ${theme}`).join('\n')}

## Key Insights

| Attribute | Value |
|-----------|-------|
| Best For | ${bestFor} |
| Time Needed | ${timeNeeded} |
| Intensity | ${intensity} |
| Price Range | ${priceRange} |
| Emotions | ${emotions.join(', ')} |
| Best Season | ${bestSeason} |${culturalSensitivity ? `\n| Cultural | ${culturalSensitivity} |` : ''}

---
*Copied: ${timestamp}*`;

    case 'json':
      return JSON.stringify({
        theme: {
          name: themeName,
          category,
          confidence,
          description: themeDescription,
          intelligenceBadges,
          subThemes,
          nanoThemes,
          insights: {
            bestFor,
            timeNeeded,
            intensity,
            priceRange,
            emotions,
            bestSeason,
            ...(culturalSensitivity && { culturalSensitivity })
          }
        },
        metadata: {
          copiedAt: timestamp,
          source: 'Destination Theme Explorer'
        }
      }, null, 2);

    case 'detailed':
    default:
      return `═══════════════════════════════════════
🎯 DESTINATION THEME: ${themeName.toUpperCase()}
═══════════════════════════════════════

📋 OVERVIEW
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Category: ${category}
Confidence Score: ${Math.round(confidence * 100)}%
Description: ${themeDescription}

🏷️ INTELLIGENCE BADGES
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
${intelligenceBadges.map(badge => `• ${badge}`).join('\n')}

🎯 SUB-THEMES
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
${subThemes.length > 0 ? subThemes.map(theme => `• ${theme}`).join('\n') : '• No sub-themes available'}

🔬 NANO THEMES
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
${nanoThemes.length > 0 ? nanoThemes.map(theme => `• ${theme}`).join('\n') : '• No nano themes available'}

📊 KEY INSIGHTS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
👥 Best For: ${bestFor}
⏰ Time Needed: ${timeNeeded}
⚡ Intensity: ${intensity}
💰 Price Range: ${priceRange}
✨ Emotions: ${emotions.join(', ')}
🌟 Best Season: ${bestSeason}${culturalSensitivity ? `\n🏛️ Cultural: ${culturalSensitivity}` : ''}

═══════════════════════════════════════
Source: Destination Theme Explorer
Copied: ${timestamp}
═══════════════════════════════════════`;
  }
}; 