import { useState, useEffect } from 'react';
import { Dream, DreamInput, DreamTag } from '../types';
import { categorizeDream } from '../utils/dreamCategorizer';
import { getUTCDateString } from '../utils/streakCalculator';

const STORAGE_KEY = 'dreamtome_dreams';
const DREAM_DAYS_KEY = 'dreamtome_dream_days';

const MOCK_TITLES = [
  'The Clockwork Orchard',
  'Lanterns Beneath the Lake',
  'Feathered Mountains',
  'The Library Without Doors',
  'Chromatic Rainfall',
  'A Chorus of Whispers',
];

const MOCK_BODIES = [
  'I followed a fox made of starlight through a valley carved into night. Every footstep rang like chimes and the horizon kept folding inward like paper.',
  'An elevator of roots carried me through layers of glowing soil. Each level was a different memory that belonged to someone I had never met.',
  'I wrote a letter with invisible ink and the parchment answered back, offering riddles for every question I dared to ask.',
  'My shadow detached and became a guide, leading me to a city suspended by kites. To move forward I had to surrender each doubt I carried.',
  'A tide of blossoms swept through an empty cathedral. When the petals brushed my hands I could hear lullabies sung in reverse.',
];

const MOCK_TAGS: DreamTag[] = ['Serene', 'Strange', 'Nightmare', 'Epic', 'Lucid', 'Recurring', 'Prophetic'];
const MOCK_CATEGORIES: Dream['category'][] = ['Serene', 'Strange', 'Nightmare', 'Epic'];

export function useDreams() {
  const [dreams, setDreams] = useState<Dream[]>([]);

  useEffect(() => {
    const storedDreams = safeParseStored(STORAGE_KEY, [], isDreamArray);
    setDreams(storedDreams);
  }, []);

  const saveDreams = (newDreams: Dream[]) => {
    setDreams(newDreams);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newDreams));
  };

  const recordDreamDay = (date: Date) => {
    const utcDate = getUTCDateString(date);
    const dreamDays = safeParseStored(DREAM_DAYS_KEY, [], isStringArray);

    if (!dreamDays.includes(utcDate)) {
      dreamDays.push(utcDate);
      localStorage.setItem(DREAM_DAYS_KEY, JSON.stringify(dreamDays));
    }
  };

  const addDream = (input: DreamInput) => {
    const now = new Date();
    const newDream: Dream = {
      id: Date.now().toString(),
      title: input.title,
      content: input.content,
      originalContent: input.originalContent,
      date: now.toISOString(),
      category: categorizeDream(input.content),
      tags: input.tags || [],
    };

    // Record the day for streak tracking
    recordDreamDay(now);

    saveDreams([...dreams, newDream]);
  };

  const addTestDreams = (count = 5) => {
    const generated: Dream[] = Array.from({ length: count }, (_, index) => {
      const title = pickRandom(MOCK_TITLES);
      const body = pickRandom(MOCK_BODIES);
      const category = pickRandom(MOCK_CATEGORIES);
      const tagPool = shuffleArray(MOCK_TAGS).slice(0, Math.floor(Math.random() * 3));

      return {
        id: `${Date.now()}-${index}`,
        title,
        content: body,
        originalContent: body,
        date: new Date(Date.now() - Math.random() * 1000 * 60 * 60 * 24 * 10).toISOString(),
        category,
        tags: tagPool,
        isTest: true,
      };
    });

    saveDreams([...dreams, ...generated]);
  };

  const clearTestDreams = () => {
    if (!dreams.some((dream) => dream.isTest)) return;
    saveDreams(dreams.filter((dream) => !dream.isTest));
  };

  const updateDream = (id: string, updates: Partial<Dream>) => {
    saveDreams(dreams.map((d) => (d.id === id ? { ...d, ...updates } : d)));
  };

  const deleteDream = (id: string) => {
    saveDreams(dreams.filter((d) => d.id !== id));
  };

  const clearAllDreams = () => {
    saveDreams([]);
    // Also clear dream days tracking
    localStorage.removeItem(DREAM_DAYS_KEY);
  };

  const getDreamDays = (): string[] => safeParseStored(DREAM_DAYS_KEY, [], isStringArray);

  return {
    dreams,
    addDream,
    addTestDreams,
    clearTestDreams,
    updateDream,
    deleteDream,
    clearAllDreams,
    getDreamDays,
  };
}

function pickRandom<T>(array: T[]): T {
  return array[Math.floor(Math.random() * array.length)];
}

function shuffleArray<T>(array: T[]): T[] {
  const clone = [...array];
  for (let i = clone.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [clone[i], clone[j]] = [clone[j], clone[i]];
  }
  return clone;
}

function safeParseStored<T>(key: string, fallback: T, validate?: (value: unknown) => value is T): T {
  const stored = localStorage.getItem(key);
  if (!stored) {
    return fallback;
  }

  try {
    const parsed = JSON.parse(stored);
    if (validate && !validate(parsed)) {
      throw new Error('Validation failed');
    }
    return parsed as T;
  } catch (error) {
    console.warn(`[useDreams] Failed to parse persisted value for "${key}", resetting.`, error);
    localStorage.removeItem(key);
    return fallback;
  }
}

function isDreamArray(value: unknown): value is Dream[] {
  if (!Array.isArray(value)) {
    return false;
  }

  const validCategories = ['Serene', 'Strange', 'Nightmare', 'Epic'];

  return value.every((item) => {
    if (!item || typeof item !== 'object') {
      return false;
    }

    const candidate = item as Record<string, unknown>;
    return (
      typeof candidate.id === 'string' &&
      typeof candidate.title === 'string' &&
      typeof candidate.content === 'string' &&
      typeof candidate.date === 'string' &&
      typeof candidate.category === 'string' &&
      validCategories.includes(candidate.category)
    );
  });
}

function isStringArray(value: unknown): value is string[] {
  return Array.isArray(value) && value.every((item) => typeof item === 'string');
}
