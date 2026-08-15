# StudyFlow AI

> **Know what to study. Know why it matters.**

StudyFlow is an adaptive learning platform for Classes 1–12, with advanced preparation paths for JEE and NEET. It combines curriculum-aware tutoring, problem solving, topic-wise practice, mistake analysis and adaptive planning.

## What is implemented

- Professional responsive dashboard with a restrained navy/blue visual system
- Class selector for Classes 1–12
- Subject and chapter-oriented practice flow
- AI Tutor UI with a server-side model endpoint
- Adaptive study-session planner
- Tests, progress, mastery and priority-topic views
- JEE / NEET practice mode entry points
- Official NCERT portal configuration
- No client-side exposure of model tokens

## AI model

StudyFlow uses an open-weight instruction model through Hugging Face Inference by default:

`Qwen/Qwen2.5-7B-Instruct`

This is intentionally **not described as a free GPT API**. OpenAI's API does not currently provide a general free API tier; StudyFlow therefore uses an open model for the low-cost/free-development path. The model can be replaced later with another provider without changing the UI.

### Environment variables

Create `.env.local` locally or add these to Vercel Project Settings → Environment Variables:

```text
HF_TOKEN=your_huggingface_token
HF_MODEL=Qwen/Qwen2.5-7B-Instruct
```

Never put the token in `NEXT_PUBLIC_*` variables and never commit it to GitHub.

## NCERT data strategy

StudyFlow references the official NCERT textbook portals rather than copying an entire textbook corpus into the public repository. NCERT provides textbook PDFs for Classes I–XII and chapter links on its official portal. The app can use these official resources as the curriculum source of truth, then index permitted/user-provided material for retrieval.

Official sources:
- https://ncert.nic.in/textbook.php
- https://ncertbooks.ncert.gov.in/

## JEE / NEET

The competitive mode is designed to generate **original** practice at JEE/NEET difficulty. It should not reproduce copyrighted coaching material or claim to predict exact exam questions. Difficulty, topic and student mastery are used to adapt the generated set.

## Architecture

```text
Class + Subject + Chapter + Student history
                    ↓
          Curriculum / RAG layer
                    ↓
        Open-weight instruction model
                    ↓
      ┌─────────────┼─────────────┐
      ↓             ↓             ↓
   Tutor         Solver       Practice AI
      └─────────────┼─────────────┘
                    ↓
          Answer / mistake analysis
                    ↓
            Mastery profile
                    ↓
          Adaptive study plan
```

## Run locally

```bash
npm install
npm run dev
```

Open `http://localhost:3000`.

## Deployment

Import the repository into Vercel, then add `HF_TOKEN` and optionally `HF_MODEL` as server-side environment variables. Redeploy after adding them.

## Important next engineering milestones

1. Ingest and normalize chapter metadata for every supported NCERT class/subject.
2. Add PDF/image upload + OCR and RAG over user-provided material.
3. Make practice generation return validated structured JSON and render full quizzes.
4. Add answer evaluation and misconception classification.
5. Persist student profiles and mastery history.
6. Add authentication and secure rate limiting.
7. Add a full mock-test engine for school/JEE/NEET paths.
8. Add automated build/type checks before every deployment.
