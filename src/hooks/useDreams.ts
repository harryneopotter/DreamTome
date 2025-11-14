import { useState, useEffect } from 'react';
import { Dream, DreamInput } from '../types';
import { categorizeDream } from '../utils/dreamCategorizer';
import { getUTCDateString } from '../utils/streakCalculator';

const STORAGE_KEY = 'dreamtome_dreams';
const DREAM_DAYS_KEY = 'dreamtome_dream_days';

export function useDreams() {
  const [dreams, setDreams] = useState<Dream[]>([]);

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      setDreams(JSON.parse(stored));
    }
  }, []);

  const saveDreams = (newDreams: Dream[]) => {
    setDreams(newDreams);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newDreams));
  };

  const recordDreamDay = (date: Date) => {
    const utcDate = getUTCDateString(date);
    const stored = localStorage.getItem(DREAM_DAYS_KEY);
    const dreamDays: string[] = stored ? JSON.parse(stored) : [];
    
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

  const getDreamDays = (): string[] => {
    const stored = localStorage.getItem(DREAM_DAYS_KEY);
    return stored ? JSON.parse(stored) : [];
  };

  return {
    dreams,
    addDream,
    updateDream,
    deleteDream,
    clearAllDreams,
    getDreamDays,
  };
}
