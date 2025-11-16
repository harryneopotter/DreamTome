# 🧩 DreamTome Backend Integration — Product Requirements Document (PRD)

## 📜 Overview
This PRD defines the architecture, tech stack, security model, and implementation roadmap for the **DreamTome backend**. The goal is to support persistent dream storage, analytics, and user-specific data while preserving the whimsical, parchment-inspired aesthetic and enabling secure multi-user experiences.

---

## 🧱 Tech Stack & Architecture

### 🎯 Primary Goals
- Support structured dream journaling per user
- Enable deep analytics (moods, symbols, cycles, etc.)
- Support email/password and Gmail OAuth login
- Future-proof for dream sharing, tagging, search
- Prioritize performance and security without losing theme

### 🧰 Stack Selection

| Layer | Tech | Rationale |
|-------|------|-----------|
| Backend Runtime | **Node.js (Express)** | Simple, performant, easy auth/session middleware |
| ORM & DB | **Prisma + PostgreSQL** | Strong relational model, Prisma DX, tag relations |
| Hosting | **Railway** | Free tier, easy Postgres plugin, scalable later |
| Auth (Future) | **Lucia Auth OR Supabase Auth** | Gmail + Email/Pass ready, theme control |
| Insight API | **Gemini API (Free Tier)** | AI interpretation, generous free usage |


---

## 🔐 Security Architecture

### Authentication
- Planned: **Email/password + Gmail OAuth**
- Final provider TBD (Lucia Auth or Supabase Auth)
- JWT-based session tokens (short expiry + refresh logic)

### Authorization
- Per-user access to dreams, tags, insights
- Server routes protected via JWT middleware

### Input Validation
- All dream content passed through HTML sanitizer
- Title length, symbol count, tag constraints validated

### Database Security
- Prisma client only used server-side
- PostgreSQL roles limited to one user per app
- Data encryption at rest (via managed PG)

### Rate Limiting (Later Phase)
- Per-IP + per-user rate limiting on analytics endpoints
- Abuse detection for AI-powered endpoints

---

## 🧠 Phase 2.5 — Feature Scope (Post-backend foundation)

### 1. 🔥 Dream Heatmap Calendar (per user)
- Route: `GET /api/analytics/heatmap`
- Returns dream count per date for past 12 months
- Backend groups dreams by date

### 2. ☁️ Dream Tag Cloud
- Route: `GET /api/analytics/tags`
- Returns tag frequency map and category association
- Used for sizing and coloring tag cloud

### 3. 🔮 Category Pattern Recognition
- Route: `GET /api/analytics/patterns`
- Returns insights like:
  - Nightmares on Mondays
  - Epic dreams during full moons
  - Category flow sequences
- Pattern generation via backend logic (categoryAnalyzer.ts)

### 4. 🌊 Mood Journey Timeline
- Route: `GET /api/analytics/mood-timeline`
- Returns mood score per day for a user
- Curve smoothed and mood velocity calculated

### 5. 🌙 Dream Cycle Insights
- Route: `GET /api/analytics/cycle`
- Groups dreams in 28-day cycles
- Finds highest frequency phases, category mix

### 6. 📬 AI-Powered Dream Insight
- Route: `POST /api/insight`
- Input: dream content
- Output: symbols, emotion analysis, interpretation
- Powered by **Gemini API** (free tier)


---

## 🧬 Data Model (Prisma Schema Overview)

```prisma
model User {
  id       String   @id @default(cuid())
  email    String   @unique
  password String   // hashed (or null if OAuth-only)
  name     String?
  dreams   Dream[]
  createdAt DateTime @default(now())
}

model Dream {
  id        String   @id @default(cuid())
  userId    String
  user      User     @relation(fields: [userId], references: [id])
  title     String
  content   String
  date      DateTime
  category  String
  mood      String
  symbols   String[]
  tags      Tag[]    @relation("DreamTags")
  createdAt DateTime @default(now())
}

model Tag {
  id      String   @id @default(cuid())
  name    String   @unique
  dreams  Dream[]  @relation("DreamTags")
}
```

---

## 🚦 Roadmap

### Phase 1 — Backend Foundation (Now)
- [ ] Setup Express + Prisma + Railway PG
- [ ] Define Dream, Tag, User schema
- [ ] Implement `/api/dreams`, `/api/insight`
- [ ] Store Gemini insights with dream entry

### Phase 2 — Analytics Routes
- [ ] Heatmap, Tag Cloud, Mood Timeline, Cycle
- [ ] Pattern Analyzer (day of week, clustering)

### Phase 3 — Auth Integration
- [ ] Choose Lucia or Supabase
- [ ] Add Gmail login + secure sessions

### Phase 4 — UI Integration
- [ ] Fetch per-user dreams securely
- [ ] Lock backend routes behind auth
- [ ] Support dream syncing + editing

---

## 🔮 Closing Note
This architecture is future-proof, secure, thematically aligned, and easy to expand. All analytics features from your Phase 2.5 plan will slot into `/api/analytics/*`, with performant Prisma queries and clean endpoint separation.

When ready, I can generate:
- Full backend scaffold
- Prisma schema
- Gemini call logic
- Sample queries and dummy seed data

