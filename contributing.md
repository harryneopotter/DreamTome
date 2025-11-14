## CONTRIBUTING.md

# Contributing to DreamTome
Guidelines for maintaining the enchanted parchment engine.

## Principles
- Preserve physical illusion  
- No external UI libraries  
- Don’t break the 3D flip chain  
- View layer must stay clean

## Setup
```
npm install
npm run dev
```

## Coding Standards
### TypeScript
- Explicit types  
- No `any`  
- Keep Dream types consistent

### React
- Keep components stateless where possible  
- Use hooks for shared logic  
- Avoid deep prop drilling

### CSS / Tailwind
- Minimal inline styles  
- Follow parchment gradients

## Testing Before Commit
- Flip behavior  
- Insight scroll  
- Shadows + layering  
- Modal behavior  
- LocalStorage

## Common Pitfalls
- Removing preserve-3d  
- Adding overflow to wrong layer  
- Unintended stacking contexts  
- Using modern flat UI styles

## PR Requirements
- Before/after screenshots  
- UX rationale  
- Manual tests  
- Must not break immersive design

## Final Rule
If it doesn’t feel like paper, ink, wax, or candlelight → don’t merge.