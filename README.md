# StudyFlow AI

> **Stop studying more. Start studying smarter.**

StudyFlow is an adaptive AI learning platform designed to help students understand what to study next, learn difficult concepts, practice topic-wise, analyze mistakes, and continuously improve their study plan.

## Current build

The repository currently contains a polished Next.js + Tailwind dashboard prototype with:

- Adaptive learning dashboard
- Exam readiness overview
- Topic mastery and priority cards
- AI tutor entry point
- Topic-wise practice entry point
- Adaptive "I have time to study" session planner
- Responsive mobile/desktop navigation
- Professional glassmorphism + dark-accent visual system

## Planned AI architecture

```text
Student material
      ↓
Document/OCR pipeline
      ↓
Curriculum + RAG index
      ↓
Open-weight instruction model
      ↓
AI Tutor / Solver / Question Generator
      ↓
Evaluation + mistake detection
      ↓
Student knowledge profile
      ↓
Adaptive study plan
```

The production version will use an open-weight model through a secure server-side inference layer, with RAG over the student's curriculum and a structured knowledge profile. No model API keys should ever be exposed in the browser.

## Local development

```bash
npm install
npm run dev
```

Open `http://localhost:3000`.

## Next milestones

1. AI tutor API and model integration
2. PDF/syllabus ingestion and RAG
3. Topic-wise adaptive question generator
4. Answer evaluation and mistake classification
5. Student knowledge graph and mastery scoring
6. Authentication + persistent student profiles
7. Mock tests and exam readiness engine
8. Production deployment
