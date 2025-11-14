import { DreamTag } from '../types';

interface TagSelectorProps {
  selectedTags: DreamTag[];
  onTagsChange: (tags: DreamTag[]) => void;
}

const TAG_CONFIG: Record<DreamTag, { emoji: string; color: string }> = {
  Serene: { emoji: '🕊️', color: '#C8E6E6' },
  Strange: { emoji: '🌪️', color: '#CFA1E8' },
  Nightmare: { emoji: '🌑', color: '#D37C7C' },
  Epic: { emoji: '⚔️', color: '#F9C784' },
  Lucid: { emoji: '🌙', color: '#A6E3A1' },
  Recurring: { emoji: '🔁', color: '#BFBFBF' },
  Prophetic: { emoji: '🔮', color: '#E7D6A7' },
};

export default function TagSelector({ selectedTags, onTagsChange }: TagSelectorProps) {
  const toggleTag = (tag: DreamTag) => {
    if (selectedTags.includes(tag)) {
      onTagsChange(selectedTags.filter((t) => t !== tag));
    } else {
      onTagsChange([...selectedTags, tag]);
    }
  };

  return (
    <div>
      <label className="block text-sm font-medium mb-3 opacity-80">
        Dream Tags (optional)
      </label>
      <div className="flex flex-wrap gap-2">
        {(Object.keys(TAG_CONFIG) as DreamTag[]).map((tag) => {
          const config = TAG_CONFIG[tag];
          const isSelected = selectedTags.includes(tag);

          return (
            <button
              key={tag}
              type="button"
              onClick={() => toggleTag(tag)}
              className="px-4 py-2 rounded-full text-sm font-medium transition-all transform hover:scale-105"
              style={{
                backgroundColor: isSelected ? config.color : 'rgba(42, 27, 15, 0.1)',
                color: isSelected ? '#2A1B0F' : '#2A1B0F',
                border: isSelected ? '2px solid #2A1B0F' : '2px solid rgba(42, 27, 15, 0.2)',
                opacity: isSelected ? 1 : 0.6,
              }}
            >
              {config.emoji} {tag}
            </button>
          );
        })}
      </div>
    </div>
  );
}
