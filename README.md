# DreamTome  
A storybook-styled dream journaling app built with React + TypeScript + Tailwind + custom parchment CSS. DreamTome presents dreams as physical objects: floating parchment cards, a candle-lit desk, and a flippable insight panel.

## Project Overview
DreamTome is not a standard CRUD app. It's a handcrafted, animated, immersive UI where every element behaves like an artifact in a magical study room.

### Core Characteristics
- Skeuomorphic UI: parchment, candles, wax seals, desk artifacts  
- Dream cards appear as layered scrolls in a dream library  
- Each card flips in 3D to reveal an AI-generated interpretation panel  
- Page-turn sound for flips  
- Offline local storage model  
- No external UI frameworks beyond Tailwind + custom CSS

## Project Structure
```
src/
  components/
  hooks/
  utils/
  styles/
  types/
  App.tsx
  main.tsx
```

## Key Components
### FlippableDreamCard
- Handles 3D flip
- Insight panel logic
- Scroll + clipping isolation
- Audio + interaction layering

### DreamCardArtifacts
- Floating clickable artifacts
- Flip / expand triggers

### dreamInterpreter.ts
- Emotion detection
- Symbol extraction
- Interpretation synthesis

### useDreams.ts
- LocalStorage CRUD

## Technical Constraints
- No UI libraries  
- Preserve parchment + gold aesthetic  
- Maintain 3D flip integrity: perspective → preserve-3d → faces → backface hidden

## Running Locally
```
npm install
npm run dev
```

## Testing Checklist
- Flip animations
- Insight scroll
- Modal interactions
- Artifact layering
- LocalStorage persistence

## Roadmap
- Dream Tome book UI
- PDF export
- Dream tagging
- AI summaries
- Symbol dictionary
- Night-mode parchment
- Streak calendar