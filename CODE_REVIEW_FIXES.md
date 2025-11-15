# DreamTome Code Review - Issues & Implementation Plan

**Date:** 2025-11-15
**Reviewer:** Code Review Agent
**Priority Legend:** 🔴 Critical | 🟡 Medium | 🟢 Low

---

## 🔴 Critical Priority Issues

### 1. Splash Screen Router Navigation Conflict

**File:** `src/App.tsx:10-23`, `src/components/SplashScreen.tsx:63`

**Issue:**
The splash screen renders inside the Router and calls both `navigate('/tome')` AND `onComplete()`, creating a redundant navigation flow. The splash should only handle state transition, not routing.

**Impact:**
- Confusing navigation flow
- Race conditions between state update and routing
- Potential flash of content

**Implementation Steps:**
1. Remove the `navigate` import from `SplashScreen.tsx`
2. Remove the `navigate('/tome')` call on line 63
3. Keep only the `onComplete()` call
4. The state change in App.tsx will naturally hide the splash and show the routes

**Code Change:**
```typescript
// src/components/SplashScreen.tsx
// REMOVE: import { useNavigate } from 'react-router-dom';
// REMOVE: const navigate = useNavigate();

// In proceedToTome function, line 61-65:
exitTimeout.current = window.setTimeout(() => {
  stop('ambientCandle');
  // REMOVE: navigate('/tome');
  onComplete(); // Keep only this
}, TRANSITION_DURATION);
```

---

### 2. LocalStorage Validation Missing Category Field

**File:** `src/hooks/useDreams.ts:157-175`

**Issue:**
The `isDreamArray` validator only checks `id`, `title`, `content`, and `date`. It doesn't validate the required `category` field. If corrupted data lacks a category, the app will crash when trying to access `categoryConfig[dream.category]`.

**Impact:**
- App crashes on corrupted localStorage data
- No recovery mechanism for invalid categories

**Implementation Steps:**
1. Add category validation to `isDreamArray` function
2. Add type guard for valid category values
3. Optionally, add a migration function to assign default categories to old data

**Code Change:**
```typescript
// src/hooks/useDreams.ts, lines 157-175
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
```

---

### 3. Export Function Error Handling Broken

**File:** `src/utils/exportDream.ts:36-54`

**Issue:**
The `toBlob()` callback is asynchronous, but errors thrown inside it won't be caught by the surrounding try-catch. The function also doesn't properly await the blob creation.

**Impact:**
- Silent failures when export fails
- Promise never resolves/rejects properly
- Error handling in DreamModal.tsx doesn't work

**Implementation Steps:**
1. Wrap `toBlob()` in a Promise
2. Properly reject on errors
3. Ensure cleanup happens in all cases

**Code Change:**
```typescript
// src/utils/exportDream.ts:19-59
export async function exportDreamAsPNG(dreamTitle: string): Promise<void> {
  const element = document.getElementById('dream-export-card');

  if (!element) {
    throw new Error('Export card element not found');
  }

  try {
    // Use html2canvas to render the card
    const canvas = await html2canvas(element, {
      backgroundColor: null,
      scale: 2,
      logging: false,
      useCORS: true,
    });

    // Convert to blob and download - wrapped in Promise
    await new Promise<void>((resolve, reject) => {
      canvas.toBlob((blob) => {
        if (!blob) {
          reject(new Error('Failed to create image blob'));
          return;
        }

        try {
          // Create download link
          const url = URL.createObjectURL(blob);
          const link = document.createElement('a');
          link.href = url;
          link.download = `dreamtome-${slugify(dreamTitle)}.png`;

          // Trigger download
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);

          // Cleanup
          URL.revokeObjectURL(url);
          resolve();
        } catch (error) {
          reject(error);
        }
      }, 'image/png');
    });
  } catch (error) {
    console.error('Error exporting dream:', error);
    throw error;
  }
}
```

---

### 4. Missing React Error Boundaries

**File:** `src/main.tsx`, `src/App.tsx`

**Issue:**
No error boundaries exist in the app. Any unhandled error in components will crash the entire app with a white screen.

**Impact:**
- Poor user experience on errors
- No graceful degradation
- No error reporting mechanism

**Implementation Steps:**
1. Create an ErrorBoundary component
2. Wrap the app in the error boundary
3. Display a themed error message
4. Provide a reset button

**Code Change:**
```typescript
// NEW FILE: src/components/ErrorBoundary.tsx
import { Component, ReactNode } from 'react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Error caught by boundary:', error, errorInfo);
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null });
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-amber-50 to-yellow-50">
          <div className="parchment-panel max-w-md p-8 text-center">
            <div className="text-6xl mb-4">📜</div>
            <h1 className="text-2xl font-bold text-[var(--burgundy)] mb-4" style={{ fontFamily: "'Cormorant Unicase', serif" }}>
              The Tome Has Encountered an Error
            </h1>
            <p className="text-sm opacity-70 mb-6" style={{ fontFamily: 'Spectral, serif' }}>
              {this.state.error?.message || 'An unexpected error occurred'}
            </p>
            <button
              onClick={this.handleReset}
              className="px-6 py-3 bg-[var(--gold)] text-[var(--parchment-dark)] rounded-lg font-semibold hover:opacity-90 transition-opacity"
            >
              Return to Safety
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
```

```typescript
// src/main.tsx - UPDATE
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.tsx';
import { ErrorBoundary } from './components/ErrorBoundary';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  </StrictMode>,
);
```

---

### 5. Date/Timezone Bug in Streak Calculator

**File:** `src/utils/streakCalculator.ts:37-44`

**Issue:**
The `today` variable uses local time (`new Date()`) while all other dates use UTC. This causes incorrect streak calculations across timezones.

**Impact:**
- Streaks break at midnight for users in different timezones
- Inconsistent date calculations

**Implementation Steps:**
1. Convert `today` to UTC before calculations
2. Ensure all date comparisons use UTC consistently

**Code Change:**
```typescript
// src/utils/streakCalculator.ts:37-44
export function calculateStreaks(dateStrings: string[]): StreakData {
  if (dateStrings.length === 0) {
    return { currentStreak: 0, longestStreak: 0, totalDays: 0 };
  }

  // Sort dates chronologically
  const sortedDates = [...new Set(dateStrings)].sort();
  const totalDays = sortedDates.length;

  // Convert to Date objects for easier comparison
  const dates = sortedDates.map(d => new Date(d + 'T00:00:00Z'));

  // Calculate current streak (working backwards from today)
  const today = new Date();
  const todayUTC = new Date(getUTCDateString(today) + 'T00:00:00Z'); // FIX: Use UTC
  let currentStreak = 0;

  // Check if there's an entry today or yesterday (to keep streak alive)
  const lastEntryDate = sortedDates[sortedDates.length - 1];
  const lastEntry = new Date(lastEntryDate + 'T00:00:00Z');
  const daysSinceLastEntry = Math.floor((todayUTC.getTime() - lastEntry.getTime()) / (1000 * 60 * 60 * 24)); // FIX: Use todayUTC

  // ... rest of function
}
```

---

## 🟡 Medium Priority Issues

### 6. Replace Browser Dialogs with Themed Components

**Files:**
- `src/components/DreamModal.tsx:35` - `confirm()`
- `src/components/DreamModal.tsx:47` - `alert()`

**Issue:**
Browser native dialogs break the immersive medieval theme and can't be styled or given sound effects.

**Impact:**
- Inconsistent UX
- No audio feedback
- Blocking dialogs prevent animations

**Implementation Steps:**
1. Use existing `ConfirmDialog` for delete confirmation
2. Use existing `Toast` for error messages
3. Add proper state management

**Code Change:**
```typescript
// src/components/DreamModal.tsx - UPDATE
export default function DreamModal({ dream, onClose }: DreamModalProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editedContent, setEditedContent] = useState(dream.content);
  const [isExporting, setIsExporting] = useState(false);
  const [showSuccessToast, setShowSuccessToast] = useState(false);
  const [showErrorToast, setShowErrorToast] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false); // ADD
  const { updateDream, deleteDream } = useDreams();
  const { play } = useSound();

  const handleDelete = () => {
    setShowDeleteDialog(true); // CHANGE: Don't use confirm()
    play('hoverGlow');
  };

  const confirmDelete = () => {
    deleteDream(dream.id);
    setShowDeleteDialog(false);
    play('sealPop');
    onClose();
  };

  const cancelDelete = () => {
    setShowDeleteDialog(false);
    play('flipBack');
  };

  const handleExport = async () => {
    setIsExporting(true);
    try {
      await exportDreamAsPNG(dream.title);
      setShowSuccessToast(true);
    } catch (error) {
      setShowErrorToast(true); // CHANGE: Use toast instead of alert
      console.error('Export error:', error);
    } finally {
      setIsExporting(false);
    }
  };

  // ... rest of component

  return (
    <>
      {/* ... existing modal content ... */}

      {/* ADD: Delete confirmation dialog */}
      <ConfirmDialog
        open={showDeleteDialog}
        title="Delete Dream?"
        description="This dream will be permanently removed from your Tome. This action cannot be undone."
        confirmLabel="Yes, delete it"
        cancelLabel="Keep it"
        onConfirm={confirmDelete}
        onCancel={cancelDelete}
      />

      {/* Success toast */}
      {showSuccessToast && (
        <Toast
          message="Dream exported as PNG!"
          onClose={() => setShowSuccessToast(false)}
        />
      )}

      {/* ADD: Error toast */}
      {showErrorToast && (
        <Toast
          message="Failed to export dream. Please try again."
          onClose={() => setShowErrorToast(false)}
        />
      )}
    </>
  );
}
```

---

### 7. Performance: Memoize Expensive Computations

**Files:**
- `src/pages/DreamLibrary.tsx:23-29` - Filter on every render
- `src/pages/Reflections.tsx:19-29` - Count on every render

**Issue:**
Filtering and counting operations run on every render, even when dreams/search haven't changed.

**Impact:**
- Laggy UI with many dreams
- Unnecessary re-renders
- Battery drain on mobile

**Implementation Steps:**
1. Wrap filtered dreams in `useMemo`
2. Wrap category/tag counts in `useMemo`
3. Add proper dependencies

**Code Change:**
```typescript
// src/pages/DreamLibrary.tsx:23-29
import { useState, useMemo } from 'react'; // ADD useMemo

export default function DreamLibrary() {
  const { dreams, addTestDreams, clearTestDreams } = useDreams();
  const [selectedDream, setSelectedDream] = useState<Dream | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const hasTestDreams = dreams.some((dream) => dream.isTest);

  const filteredDreams = useMemo(() =>
    dreams.filter((dream) => {
      const query = searchQuery.toLowerCase();
      return (
        dream.title.toLowerCase().includes(query) ||
        dream.content.toLowerCase().includes(query)
      );
    }),
    [dreams, searchQuery] // Only recalculate when these change
  );

  // ... rest of component
}
```

```typescript
// src/pages/Reflections.tsx:19-29
export default function Reflections() {
  const { dreams, clearAllDreams, getDreamDays } = useDreams();
  // ... state declarations

  const categoryCount = useMemo(() =>
    dreams.reduce((acc, dream) => {
      acc[dream.category] = (acc[dream.category] || 0) + 1;
      return acc;
    }, {} as Record<string, number>),
    [dreams]
  );

  const tagCount = useMemo(() =>
    dreams.reduce((acc, dream) => {
      dream.tags?.forEach((tag) => {
        acc[tag] = (acc[tag] || 0) + 1;
      });
      return acc;
    }, {} as Record<string, number>),
    [dreams]
  );

  // ... rest of component
}
```

---

### 8. Implement Dreams Context Provider

**File:** NEW - `src/contexts/DreamsContext.tsx`

**Issue:**
Every component calls `useDreams()` independently, reading from localStorage separately. Updates don't propagate to other components until re-mount.

**Impact:**
- Stale data across components
- Multiple localStorage reads
- Components don't react to changes from other components

**Implementation Steps:**
1. Create a DreamsContext
2. Move useDreams logic to context provider
3. Wrap app in provider
4. Update hook to use context

**Code Change:**
```typescript
// NEW FILE: src/contexts/DreamsContext.tsx
import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Dream, DreamInput } from '../types';
import { categorizeDream } from '../utils/dreamCategorizer';
import { getUTCDateString } from '../utils/streakCalculator';

interface DreamsContextType {
  dreams: Dream[];
  addDream: (input: DreamInput) => void;
  addTestDreams: (count?: number) => void;
  clearTestDreams: () => void;
  updateDream: (id: string, updates: Partial<Dream>) => void;
  deleteDream: (id: string) => void;
  clearAllDreams: () => void;
  getDreamDays: () => string[];
}

const DreamsContext = createContext<DreamsContextType | null>(null);

const STORAGE_KEY = 'dreamtome_dreams';
const DREAM_DAYS_KEY = 'dreamtome_dream_days';

export function DreamsProvider({ children }: { children: ReactNode }) {
  const [dreams, setDreams] = useState<Dream[]>([]);

  useEffect(() => {
    // Load dreams from localStorage on mount
    const storedDreams = safeParseStored(STORAGE_KEY, [], isDreamArray);
    setDreams(storedDreams);
  }, []);

  const saveDreams = (newDreams: Dream[]) => {
    setDreams(newDreams);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newDreams));
  };

  // ... rest of useDreams logic moved here ...

  const value: DreamsContextType = {
    dreams,
    addDream,
    addTestDreams,
    clearTestDreams,
    updateDream,
    deleteDream,
    clearAllDreams,
    getDreamDays,
  };

  return <DreamsContext.Provider value={value}>{children}</DreamsContext.Provider>;
}

export function useDreams() {
  const context = useContext(DreamsContext);
  if (!context) {
    throw new Error('useDreams must be used within DreamsProvider');
  }
  return context;
}

// Helper functions remain the same...
```

```typescript
// src/App.tsx - UPDATE
import { DreamsProvider } from './contexts/DreamsContext';

function App() {
  // ... state declarations

  return (
    <DreamsProvider>
      <Router>
        {showSplash && <SplashScreen onComplete={handleSplashComplete} />}
        <Routes>
          {/* ... routes ... */}
        </Routes>
      </Router>
    </DreamsProvider>
  );
}
```

---

### 9. Enable TypeScript Strict Checks

**File:** `tsconfig.app.json:18-20`

**Issue:**
Critical TypeScript strict mode checks are disabled, defeating the purpose of using TypeScript.

**Impact:**
- Unused variables go undetected
- Implicit `any` types reduce type safety
- Code quality degrades

**Implementation Steps:**
1. Enable all strict checks
2. Fix resulting errors
3. Add ESLint rules for consistency

**Code Change:**
```json
// tsconfig.app.json:17-23
{
  "compilerOptions": {
    // ... other options ...
    "strict": true,
    "noUnusedLocals": true,          // CHANGE: was false
    "noImplicitAny": true,            // CHANGE: was false (or add this if missing)
    "noUnusedParameters": true,       // CHANGE: was false
    "noFallthroughCasesInSwitch": true,
    // ... rest ...
  }
}
```

**Follow-up:** Run `npm run build` and fix all TypeScript errors that appear.

---

### 10. Establish Z-Index Scale

**Files:**
- `src/components/DreamModal.tsx:60` - `zIndex: 1000000`
- `src/components/FlippableDreamCard.tsx:113` - `zIndex: 50000`

**Issue:**
Arbitrary large z-index values indicate lack of layering strategy.

**Impact:**
- Unpredictable stacking
- Hard to reason about layers
- Maintenance nightmare

**Implementation Steps:**
1. Create a z-index constants file
2. Define semantic layers
3. Replace all hardcoded values

**Code Change:**
```typescript
// NEW FILE: src/constants/zIndex.ts
export const Z_INDEX = {
  BASE: 1,
  NAVIGATION: 100,
  DROPDOWN: 200,
  STICKY: 300,
  CARD_FLIPPED: 400,
  MODAL_BACKDROP: 900,
  MODAL: 1000,
  TOAST: 1100,
  TOOLTIP: 1200,
} as const;
```

```typescript
// src/components/DreamModal.tsx:60
import { Z_INDEX } from '../constants/zIndex';

// In the component:
<div
  className="fixed inset-0 bg-black/70 flex items-center justify-center p-4 fade-in"
  style={{ zIndex: Z_INDEX.MODAL }} // CHANGE: was 1000000
  onClick={onClose}
>
```

```typescript
// src/components/FlippableDreamCard.tsx:113
import { Z_INDEX } from '../constants/zIndex';

// In the component:
<div
  ref={cardRef}
  className="relative flippable-card"
  style={{
    perspective: '1500px',
    transformStyle: 'preserve-3d',
    zIndex: Z_INDEX.CARD_FLIPPED, // CHANGE: was 50000
  }}
>
```

---

## 🟢 Low Priority Issues

### 11. Improve Accessibility

**Files:** Multiple

**Issues:**
- No keyboard support for card flipping beyond initial click
- No focus management in modals
- Missing ARIA labels on interactive elements

**Implementation Steps:**
1. Add keyboard event handlers for Escape, Enter, Space
2. Implement focus trapping in modals
3. Add ARIA labels to all interactive elements
4. Test with screen readers

**Code Example:**
```typescript
// src/components/DreamModal.tsx - ADD
import { useEffect, useRef } from 'react';

export default function DreamModal({ dream, onClose }: DreamModalProps) {
  const modalRef = useRef<HTMLDivElement>(null);
  const previousActiveElement = useRef<HTMLElement | null>(null);

  useEffect(() => {
    // Store currently focused element
    previousActiveElement.current = document.activeElement as HTMLElement;

    // Focus modal
    modalRef.current?.focus();

    // Prevent background scrolling
    document.body.style.overflow = 'hidden';

    return () => {
      // Restore focus
      previousActiveElement.current?.focus();
      document.body.style.overflow = '';
    };
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  return (
    <div
      ref={modalRef}
      role="dialog"
      aria-modal="true"
      aria-labelledby="dream-modal-title"
      tabIndex={-1}
      // ... rest of component
    >
      <h2 id="dream-modal-title">
        {dream.title}
      </h2>
      {/* ... rest ... */}
    </div>
  );
}
```

---

### 12. Add Input Validation

**File:** `src/pages/Tome.tsx:154-175`

**Issue:**
No max length or sanitization on title/content inputs.

**Impact:**
- Could overflow UI
- Could exceed localStorage limits
- Potential security issues if ever rendered as HTML

**Implementation Steps:**
1. Add maxLength attributes
2. Add validation feedback
3. Trim whitespace on save

**Code Change:**
```typescript
// src/pages/Tome.tsx
const MAX_TITLE_LENGTH = 100;
const MAX_CONTENT_LENGTH = 5000;

// In component:
<input
  type="text"
  value={title}
  onChange={(e) => setTitle(e.target.value.slice(0, MAX_TITLE_LENGTH))}
  placeholder="The Floating Garden..."
  maxLength={MAX_TITLE_LENGTH}
  aria-label="Dream title"
  className="w-full px-3 py-2 rounded-md border border-[var(--parchment-dark)]/30 bg-white/70 text-[var(--parchment-dark)] focus:outline-none focus:border-[var(--gold)] transition-colors text-sm"
  style={{ fontFamily: 'Spectral, serif' }}
/>
<div className="text-xs opacity-50 mt-1">
  {title.length}/{MAX_TITLE_LENGTH} characters
</div>

<textarea
  value={content}
  onChange={(e) => setContent(e.target.value.slice(0, MAX_CONTENT_LENGTH))}
  placeholder="I found myself walking through a garden suspended in the clouds..."
  maxLength={MAX_CONTENT_LENGTH}
  aria-label="Dream description"
  className="w-full flex-1 px-3 py-2 rounded-md border border-[var(--parchment-dark)]/30 bg-white/70 text-[var(--parchment-dark)] focus:outline-none focus:border-[var(--gold)] transition-colors resize-none text-sm"
  style={{ fontFamily: 'Spectral, serif', minHeight: '120px' }}
  rows={5}
/>
<div className="text-xs opacity-50 mt-1">
  {content.length}/{MAX_CONTENT_LENGTH} characters
</div>
```

---

### 13. Cleanup Audio Context on App Unmount

**File:** `src/hooks/useSound.ts:60-62`

**Issue:**
Module-level globals for audio context don't cleanup on app unmount.

**Impact:**
- Memory leaks in long-running sessions
- Audio might play after app unmounts

**Implementation Steps:**
1. Add cleanup function for global context
2. Call it from App unmount effect
3. Or convert to React Context pattern

**Code Change:**
```typescript
// src/hooks/useSound.ts - ADD
export function cleanupAudioContext() {
  // Stop all looping sources
  loopingSources.forEach((handle) => {
    try {
      handle.source.stop();
      handle.source.disconnect();
      handle.gain.disconnect();
    } catch (error) {
      console.warn('[useSound] Error stopping source during cleanup', error);
    }
  });
  loopingSources.clear();

  // Close audio context
  if (sharedContext) {
    sharedContext.close();
    sharedContext = null;
  }

  // Clear buffer cache
  bufferCache.clear();
}
```

```typescript
// src/App.tsx - ADD
import { cleanupAudioContext } from './hooks/useSound';

function App() {
  // ... existing code

  useEffect(() => {
    return () => {
      cleanupAudioContext();
    };
  }, []);

  // ... rest of component
}
```

---

### 14. Remove Unused Parameters and Clean Code

**File:** Multiple files

**Issue:**
After enabling strict TypeScript, there will be unused variables/parameters.

**Implementation Steps:**
1. Enable strict checks (issue #9)
2. Run build and collect errors
3. Fix each error:
   - Remove unused imports
   - Prefix unused params with `_`
   - Remove dead code

**Common patterns:**
```typescript
// BEFORE
const filteredDreams = dreams.filter((dream, index) => {
  // index is unused
});

// AFTER
const filteredDreams = dreams.filter((dream) => {
  // Removed index parameter
});
```

---

## Testing Checklist

After implementing fixes, test:

- [ ] Splash screen → Tome navigation works smoothly
- [ ] Corrupted localStorage gracefully recovers
- [ ] Export function properly handles errors
- [ ] Error boundary catches and displays errors
- [ ] Streak calculations work across timezones
- [ ] Delete dream shows themed confirmation
- [ ] Export error shows themed toast
- [ ] Filtered dreams update instantly
- [ ] Category counts update when dreams change
- [ ] Dreams update across all components
- [ ] TypeScript build succeeds with strict mode
- [ ] Z-index layering is predictable
- [ ] Keyboard navigation works in modals
- [ ] Input validation prevents overflow
- [ ] Audio stops when app unmounts
- [ ] No console warnings/errors

---

## Implementation Order

**Phase 1 - Critical Fixes (Do First):**
1. Issue #2 - LocalStorage validation
2. Issue #4 - Error boundaries
3. Issue #5 - Date/timezone bug
4. Issue #3 - Export error handling
5. Issue #1 - Splash navigation

**Phase 2 - UX Improvements:**
6. Issue #6 - Replace browser dialogs
7. Issue #7 - Performance memoization
8. Issue #10 - Z-index scale

**Phase 3 - Architecture:**
9. Issue #8 - Context provider
10. Issue #9 - TypeScript strict mode

**Phase 4 - Polish:**
11. Issue #11 - Accessibility
12. Issue #12 - Input validation
13. Issue #13 - Audio cleanup
14. Issue #14 - Code cleanup

---

## Estimated Time

- **Phase 1 (Critical):** 2-3 hours
- **Phase 2 (UX):** 1-2 hours
- **Phase 3 (Architecture):** 2-3 hours
- **Phase 4 (Polish):** 2-3 hours

**Total:** 7-11 hours for complete implementation

---

## Additional Recommendations

1. **Add ESLint:** Configure with React, TypeScript, and accessibility rules
2. **Add Testing:** Jest + React Testing Library for critical paths
3. **Add CI/CD:** GitHub Actions to run linting and type checking
4. **Add Changelog:** Document breaking changes for users
5. **Add Backup/Export:** Let users export all dreams as JSON
6. **Add PWA Support:** Make it installable and work offline
7. **Performance Monitoring:** Add React DevTools Profiler checks
8. **Bundle Analysis:** Check for large dependencies (html2canvas is 800kb)

---

**Generated:** 2025-11-15
**Review Completed**
