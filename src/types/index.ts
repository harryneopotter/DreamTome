export type DreamTag = 'Serene' | 'Strange' | 'Nightmare' | 'Epic' | 'Lucid' | 'Recurring' | 'Prophetic';

export interface Dream {
  id: string;
  title: string;
  content: string;
  originalContent?: string;
  date: string;
  category: 'Serene' | 'Strange' | 'Nightmare' | 'Epic';
  tags?: string[];
  isTest?: boolean;
  prose?: string;
  interpretation?: string;
  mood?: string;
}

export interface DreamInput {
  title: string;
  content: string;
  originalContent?: string;
  tags?: string[];
}
