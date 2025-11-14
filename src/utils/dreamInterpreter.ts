/**
 * Dream interpretation utilities for the artifact system
 */

export interface DreamInsight {
  emotion: string;
  keywords: string[];
  interpretation: string;
}

/**
 * Extract key symbols and themes from dream content
 */
export function extractKeywords(dreamText: string): string[] {
  const text = dreamText.toLowerCase();
  
  // Common dream symbols and themes
  const symbolPatterns: Record<string, RegExp[]> = {
    'Water': [/ocean|sea|river|lake|rain|flood|wave|swimming|drowning/],
    'Flying': [/fly|flying|float|soar|airborne|wings/],
    'Falling': [/fall|falling|drop|plunge|descend/],
    'Chase': [/chase|chased|running|escape|pursued|hunt/],
    'Death': [/death|dying|dead|grave|funeral|corpse/],
    'Animals': [/dog|cat|bird|snake|spider|wolf|bear|dragon|creature/],
    'Nature': [/tree|forest|mountain|garden|flower|plant|wilderness/],
    'Light': [/light|sun|moon|star|glow|bright|radiance|illuminate/],
    'Darkness': [/dark|shadow|night|black|abyss|void/],
    'People': [/person|people|friend|stranger|family|crowd|face/],
    'Buildings': [/house|building|castle|tower|city|room|door|window/],
    'Journey': [/journey|travel|path|road|adventure|quest|destination/],
    'Magic': [/magic|spell|wizard|witch|enchant|mystical|supernatural/],
    'Love': [/love|heart|romance|kiss|embrace|passion/],
    'Fear': [/fear|scared|terror|anxiety|dread|panic/],
    'Power': [/power|strength|control|force|energy|ability/],
    'Lost': [/lost|confused|searching|missing|nowhere/],
    'Time': [/clock|time|hour|past|future|ancient|modern/],
  };

  const foundKeywords: string[] = [];
  
  for (const [keyword, patterns] of Object.entries(symbolPatterns)) {
    for (const pattern of patterns) {
      if (pattern.test(text)) {
        foundKeywords.push(keyword);
        break;
      }
    }
  }
  
  return foundKeywords.slice(0, 6); // Max 6 keywords
}

/**
 * Detect the primary emotion in the dream
 */
export function detectEmotion(dreamText: string): string {
  const text = dreamText.toLowerCase();
  
  const emotionPatterns: Record<string, { patterns: RegExp[]; weight: number }> = {
    'Peaceful': {
      patterns: [/peace|calm|serene|tranquil|gentle|soft|quiet|relax/],
      weight: 1,
    },
    'Joyful': {
      patterns: [/joy|happy|delight|wonderful|beautiful|love|warm|bliss/],
      weight: 1,
    },
    'Anxious': {
      patterns: [/anxious|worry|nervous|stress|tense|uneasy|concern/],
      weight: 1,
    },
    'Fearful': {
      patterns: [/fear|scared|terror|afraid|dread|panic|frightened/],
      weight: 2,
    },
    'Melancholic': {
      patterns: [/sad|lonely|empty|loss|mourn|sorrow|distant/],
      weight: 1,
    },
    'Curious': {
      patterns: [/wonder|curious|explore|discover|mystery|unknown|strange/],
      weight: 1,
    },
    'Powerful': {
      patterns: [/power|strong|mighty|control|victory|triumph|confident/],
      weight: 1,
    },
    'Confused': {
      patterns: [/confus|lost|uncertain|unclear|strange|weird|bizarre/],
      weight: 1,
    },
  };

  let maxScore = 0;
  let dominantEmotion = 'Mysterious';

  for (const [emotion, { patterns, weight }] of Object.entries(emotionPatterns)) {
    let score = 0;
    for (const pattern of patterns) {
      const matches = text.match(pattern);
      if (matches) {
        score += matches.length * weight;
      }
    }
    
    if (score > maxScore) {
      maxScore = score;
      dominantEmotion = emotion;
    }
  }

  return dominantEmotion;
}

/**
 * Generate an interpretation based on detected patterns
 */
export function generateInterpretation(dreamText: string): string {
  const keywords = extractKeywords(dreamText);
  const emotion = detectEmotion(dreamText);
  
  // Build interpretation based on detected elements
  const interpretations: Record<string, string[]> = {
    'Water': [
      'Water often symbolizes the unconscious mind and emotional depths.',
      'Flowing water may represent the passage of time or emotional release.',
      'Still waters might reflect inner peace or hidden emotions beneath the surface.',
    ],
    'Flying': [
      'Flight in dreams typically represents freedom, ambition, or transcendence.',
      'Soaring may indicate rising above challenges or gaining new perspective.',
      'The desire to fly often reflects aspirations and breaking free from limitations.',
    ],
    'Falling': [
      'Falling can symbolize loss of control, fear of failure, or vulnerability.',
      'This dream may reflect anxiety about a situation in waking life.',
      'Consider what you\'re holding onto too tightly—sometimes letting go is necessary.',
    ],
    'Chase': [
      'Being chased often represents avoidance of confronting something in your life.',
      'This dream suggests there may be unresolved issues seeking your attention.',
      'Face what pursues you—it may be less fearsome than it appears.',
    ],
    'Light': [
      'Light symbolizes clarity, truth, hope, or spiritual awakening.',
      'Illumination in dreams often precedes understanding or revelation.',
      'You may be on the threshold of an important realization.',
    ],
    'Darkness': [
      'Darkness represents the unknown, hidden aspects of self, or unexplored territory.',
      'This dream invites you to explore what lies beneath conscious awareness.',
      'Within darkness, seeds of transformation quietly grow.',
    ],
    'Journey': [
      'Journeys symbolize life\'s path, personal growth, or spiritual quest.',
      'The nature of your travels reflects your current life progression.',
      'Pay attention to companions, obstacles, and destinations along the way.',
    ],
    'Magic': [
      'Magical elements represent untapped potential, transformation, or possibility.',
      'This dream suggests you possess powers yet to be fully realized.',
      'Trust in your ability to manifest change through intention and will.',
    ],
  };

  // Select interpretation based on primary keyword
  let mainInterpretation = 'Dreams are the soul\'s language, speaking in symbols beyond ordinary words. Each image holds meaning unique to your journey.';
  
  if (keywords.length > 0) {
    const primaryKeyword = keywords[0];
    const options = interpretations[primaryKeyword];
    if (options) {
      mainInterpretation = options[Math.floor(Math.random() * options.length)];
    }
  }

  // Add emotion-based insight
  const emotionInsights: Record<string, string> = {
    'Peaceful': 'The serene quality of this dream suggests inner harmony and alignment with your true self.',
    'Joyful': 'The joy present here may be calling you to embrace more lightness in your waking life.',
    'Anxious': 'Anxiety in dreams often amplifies concerns that need gentle attention and resolution.',
    'Fearful': 'Fear in dreams can be a protective messenger, highlighting what requires courage to face.',
    'Melancholic': 'Sadness in dreams may signal a need for closure, healing, or honoring what has passed.',
    'Curious': 'Your curiosity is a guiding light—follow it toward discovery and growth.',
    'Powerful': 'This dream reflects your innate strength and capacity to shape your reality.',
    'Confused': 'Confusion often precedes clarity. Trust that understanding will emerge in time.',
    'Mysterious': 'Some dreams resist interpretation, preferring to work their magic quietly within.',
  };

  const emotionInsight = emotionInsights[emotion] || emotionInsights['Mysterious'];

  return `${mainInterpretation} ${emotionInsight}`;
}

/**
 * Generate complete dream insight
 */
export function getDreamInsight(dreamText: string): DreamInsight {
  return {
    emotion: detectEmotion(dreamText),
    keywords: extractKeywords(dreamText),
    interpretation: generateInterpretation(dreamText),
  };
}
