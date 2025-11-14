import { NavLink } from 'react-router-dom';
import { BookOpen, Moon, Sparkles } from './Icons';

export default function Navigation() {
  const linkClass = ({ isActive }: { isActive: boolean }) =>
    `flex flex-col items-center gap-1 transition-all duration-300 ${
      isActive
        ? 'text-[var(--gold)] scale-110'
        : 'text-[var(--parchment-light)] opacity-70 hover:opacity-100'
    }`;

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-[var(--parchment-dark)] border-t-2 border-[var(--gold)] shadow-lg z-50">
      <div className="max-w-md mx-auto px-6 py-4 flex justify-around items-center">
        <NavLink to="/" className={linkClass} end>
          <Moon />
          <span className="text-xs font-medium">Tome</span>
        </NavLink>
        
        <NavLink to="/dreams" className={linkClass}>
          <BookOpen />
          <span className="text-xs font-medium">Dreams</span>
        </NavLink>
        
        <NavLink to="/reflections" className={linkClass}>
          <Sparkles />
          <span className="text-xs font-medium">Reflections</span>
        </NavLink>
      </div>
    </nav>
  );
}
