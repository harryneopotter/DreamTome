export type DreamTag = 'Serene' | 'Strange' | 'Nightmare' | 'Epic' | 'Lucid' | 'Recurring' | 'Prophetic';

export interface Dream {
  id: string;
  title: string;
  content: string;
  originalContent?: string;
  date: string;
  category: 'Serene' | 'Strange' | 'Nightmare' | 'Epic';
  tags?: DreamTag[];
  isTest?: boolean;
}

export interface DreamInput {
  title: string;
  content: string;
  originalContent?: string;
  tags?: DreamTag[];
}
