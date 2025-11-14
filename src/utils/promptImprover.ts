/**
 * Enhances raw dream text into elegant, evocative prose.
 * Includes randomized synonym selection for more organic results.
 */
function choose(...options: string[]): string {
  return options[Math.floor(Math.random() * options.length)];
}

export function improveDreamText(
  text: string,
  tone: 'poetic' | 'mystic' | 'calm' = 'poetic'
): string {
  // Clean and split text
  const cleaned = text.trim().replace(/\s+/g, ' ');
  const sentences = cleaned.match(/[^.!?]+[.!?]+/g) || [cleaned];

  const improved = sentences
    .map((sentence, idx) => {
      let s = sentence.trim();

      // Soften plain openings
      if (idx === 0 && !s.match(/^(In|Upon|Within|Through|Amidst)/i)) {
        s = 'In this dream, ' + s.charAt(0).toLowerCase() + s.slice(1);
      }

      // Rich synonym replacements
      s = s
        .replace(/\bi saw\b/gi, choose('I witnessed', 'I beheld', 'I glimpsed'))
        .replace(/\bi walked\b/gi, choose('I wandered', 'I drifted', 'I journeyed'))
        .replace(/\bi felt\b/gi, choose('I sensed', 'I experienced', 'I perceived'))
        .replace(/\bthere was\b/gi, choose('there existed', 'there appeared', 'there stood'))
        .replace(/\bvery\b/gi, choose('profoundly', 'immensely', 'deeply'))
        .replace(/\breally\b/gi, choose('truly', 'genuinely', 'utterly'))
        .replace(/\bnice\b/gi, choose('wondrous', 'graceful', 'serene'))
        .replace(/\bscary\b/gi, choose('haunting', 'unsettling', 'shadowed'))
        .replace(/\bweird\b/gi, choose('ethereal', 'otherworldly', 'surreal'))
        .replace(/\bgreat\b/gi, choose('majestic', 'awe-striking', 'resplendent'))
        .replace(/\bsmall\b/gi, choose('delicate', 'minute', 'subtle'));

      // Tone-specific inflections
      if (tone === 'mystic') {
        s = s
          .replace(/\bdream\b/gi, choose('vision', 'reverie', 'phantasm'))
          .replace(/\bsky\b/gi, choose('celestial veil', 'astral expanse', 'heavens'))
          .replace(/\blight\b/gi, choose('radiance', 'aura', 'glow'));
      } else if (tone === 'calm') {
        s = s
          .replace(/\bhaunting\b/gi, 'softly distant')
          .replace(/\bshadowed\b/gi, 'hushed')
          .replace(/\bprofoundly\b/gi, 'gently');
      }

      return s;
    })
    .join(' ')
    // clean punctuation spacing
    .replace(/\s([,;:.!?])/g, '$1')
    .replace(/\s{2,}/g, ' ');

  return improved.endsWith('.') ? improved : improved + '.';
}

/**
 * Generates an inspiring quote based on dream content.
 * Prioritizes theme-specific responses, otherwise returns a random one.
 */
export function generateQuote(dreamContent: string): string {
  const quotes = [
    'The mind wanders where reality dares not.',
    'In dreams, we touch the infinite.',
    'Every dream is a door to another world.',
    'Sleep whispers what the heart cannot say.',
    'Dreams are the soul\'s poetry.',
    'In the realm of sleep, all things are possible.',
    'The unconscious speaks in symbols and stars.',
    'Each dream is a universe unto itself.'
  ];

  const lower = dreamContent.toLowerCase();

  if (lower.includes('fly') || lower.includes('float') || lower.includes('soar')) {
    return 'In dreams, gravity is but a suggestion, and the sky embraces all who dare to rise.';
  }
  if (lower.includes('water') || lower.includes('ocean') || lower.includes('sea')) {
    return 'The depths of dreams mirror the ocean — vast, mysterious, and teeming with unseen life.';
  }
  if (lower.includes('dark') || lower.includes('shadow') || lower.includes('night')) {
    return 'Even in the darkest dreams, the soul searches for its light.';
  }
  if (lower.includes('fear') || lower.includes('chased') || lower.includes('escape')) {
    return 'Even nightmares are teachers wearing darker robes.';
  }
  if (lower.includes('love') || lower.includes('heart')) {
    return 'Dreams weave tenderness from memory and longing alike.';
  }
  if (lower.includes('loved one') || lower.includes('friend') || lower.includes('family')) {
    return 'Dreams reunite us with those the waking world has taken away.';
  }

  // Random fallback
  return quotes[Math.floor(Math.random() * quotes.length)];
}
