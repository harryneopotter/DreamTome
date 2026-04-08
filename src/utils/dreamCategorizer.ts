// Nightmare indicators
const NIGHTMARE_KEYWORDS = [
  'fear', 'scared', 'terror', 'nightmare', 'dark', 'chase', 'run',
  'escape', 'death', 'blood', 'scream', 'monster', 'danger', 'trap',
  'haunting', 'panic', 'dread'
];

// Serene indicators
const SERENE_KEYWORDS = [
  'peace', 'calm', 'gentle', 'soft', 'beautiful', 'garden', 'flower',
  'meadow', 'sunshine', 'love', 'warm', 'comfort', 'safe', 'tranquil',
  'serene', 'quiet', 'relaxed', 'happy'
];

// Epic indicators
const EPIC_KEYWORDS = [
  'battle', 'adventure', 'quest', 'journey', 'hero', 'fight', 'victory',
  'magic', 'power', 'kingdom', 'warrior', 'legend', 'sword', 'dragon',
  'epic', 'grand', 'destiny'
];

/**
 * Automatically categorizes dreams based on content analysis
 */
export function categorizeDream(content: string): 'Serene' | 'Strange' | 'Nightmare' | 'Epic' {
  const lowerContent = content.toLowerCase();
  
  let nightmareScore = 0;
  for (const kw of NIGHTMARE_KEYWORDS) {
    if (lowerContent.includes(kw)) {
      nightmareScore++;
    }
  }

  let sereneScore = 0;
  for (const kw of SERENE_KEYWORDS) {
    if (lowerContent.includes(kw)) {
      sereneScore++;
    }
  }

  let epicScore = 0;
  for (const kw of EPIC_KEYWORDS) {
    if (lowerContent.includes(kw)) {
      epicScore++;
    }
  }
  
  // Determine category
  if (nightmareScore > sereneScore && nightmareScore > epicScore) {
    return 'Nightmare';
  }
  if (epicScore > sereneScore && epicScore > nightmareScore) {
    return 'Epic';
  }
  if (sereneScore > 0) {
    return 'Serene';
  }
  
  // Default to Strange if no clear category
  return 'Strange';
}
