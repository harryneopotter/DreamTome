interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
}

export default function SearchBar({ value, onChange }: SearchBarProps) {
  return (
    <div className="mb-8">
      <div className="max-w-xl mx-auto">
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="🔍 Search your dreams..."
          className="w-full px-5 py-4 rounded-lg border-2 border-[var(--gold)] bg-[var(--parchment-light)] text-[var(--parchment-dark)] placeholder-[var(--parchment-dark)]/50 focus:outline-none focus:border-[var(--burgundy)] transition-colors text-lg shadow-lg"
        />
      </div>
    </div>
  );
}
