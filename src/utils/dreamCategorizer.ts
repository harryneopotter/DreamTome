/**
 * Automatically categorizes dreams based on content analysis
 */
export function categorizeDream(content: string): 'Serene' | 'Strange' | 'Nightmare' | 'Epic' {
  const lowerContent = content.toLowerCase();
  
  // Nightmare indicators
  const nightmareKeywords = [
    'fear', 'scared', 'terror', 'nightmare', 'dark', 'chase', 'run',
    'escape', 'death', 'blood', 'scream', 'monster', 'danger', 'trap',
    'haunting', 'panic', 'dread'
  ];
  
  // Serene indicators
  const sereneKeywords = [
    'peace', 'calm', 'gentle', 'soft', 'beautiful', 'garden', 'flower',
    'meadow', 'sunshine', 'love', 'warm', 'comfort', 'safe', 'tranquil',
    'serene', 'quiet', 'relaxed', 'happy'
  ];
  
  // Epic indicators
  const epicKeywords = [
    'battle', 'adventure', 'quest', 'journey', 'hero', 'fight', 'victory',
    'magic', 'power', 'kingdom', 'warrior', 'legend', 'sword', 'dragon',
    'epic', 'grand', 'destiny'
  ];
  
  // Count matches
  const nightmareScore = nightmareKeywords.filter(kw => lowerContent.includes(kw)).length;
  const sereneScore = sereneKeywords.filter(kw => lowerContent.includes(kw)).length;
  const epicScore = epicKeywords.filter(kw => lowerContent.includes(kw)).length;
  
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
