# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

A festive Christmas-themed quiz game built with Next.js 14, React, and TypeScript. The app features an Austrian culture quiz with multiple question types, AI-powered evaluation, and a prize reveal system. Designed primarily for mobile with extensive animations and Christmas theming.

## Development Commands

```bash
# Development server (runs on port 3000, or next available)
npm run dev

# Production build
npm run build

# Start production server
npm start

# Lint code
npm lint
```

## Environment Setup

The app uses OpenAI API for AI evaluation. Create a `.env` file (gitignored) with:
```
OPENAI_API_KEY=your_actual_key_here
```

Reference `.env.example` for the required format, but never commit real API keys.

## Architecture

### Question System
The quiz uses a discriminated union type system for three question types:

- **MCQuestion**: Multiple choice with 4 options, stores `correctIndex`
- **DateQuestion**: Date selection with day/month/year dropdowns, validates against `correctISO` string
- **PinQuestion**: Interactive map clicking, validates distance from `correctPoint` with `threshold`

All questions are defined in `app/page.tsx` in the `questions` array and share a base structure with `id`, `type`, and `category`.

### Screen Flow State Machine
The app uses a string literal union type for screen navigation:
```
"start" → "quiz" → "ai-evaluation" → (branch) → "prize-unlocked" → "prize-reveal"
                                              ↘ back to "start" (retry)
```

The quiz branches at "ai-evaluation" based on whether the prize is unlocked (score >= 90%).

### Client-Side Architecture
**Everything runs client-side** (`"use client"`) in a single component (`app/page.tsx`). State management uses React hooks with these key pieces:
- `screen`: Current screen in the flow
- `currentQuestionIndex`: Tracks quiz progress
- `score`: Cumulative correct answers
- `answers`: Array of `AnswerResult` objects for AI evaluation
- `aiEvaluation`: Stores the AI-generated evaluation text
- `prizeUnlocked`: Boolean set by API response, determines branching after evaluation
- `showFeedback` + `lastAnswerCorrect`: Temporary feedback display (1.5s delay before advancing)

### API Route
`app/api/evaluate/route.ts` is a Next.js API route that:
1. Receives quiz results (score, totalQuestions)
2. Calls OpenAI ChatGPT (gpt-4o-mini) with a detailed sarcastic prompt
3. Returns AI-generated evaluation with four scores (Intelligenz, Wissen, Peinlichkeit, Schönheitspunkte)
4. Returns `prizeUnlocked` boolean (true if score >= 90%)

The evaluation follows a strict format:
- Sarcastic summary paragraph (3-5 sentences)
- Four scores (0-100 integers, Schönheitspunkte always 100)
- Final verdict with emoji (🎁 unlocked or ❌ not unlocked)

The AI response is displayed on the "ai-evaluation" screen with `whiteSpace: 'pre-line'` to preserve formatting.

### CSS Animation System
`app/globals.css` contains extensive keyframe animations:
- `snowfall`: Animates falling snowflake particles
- `float`, `twinkle`, `pulse`: Subtle UI element animations
- `slideIn`: Page transition effect
- `shimmer`, `glow`: Text and button effects

The snowfall is implemented via a `useEffect` hook in `app/page.tsx` that dynamically creates and removes DOM elements.

### Styling Strategy
- Christmas color palette: Crimson (#DC143C), Gold (#FFD700), Green (#228B22)
- Dark gradient background with overlay effects
- Glassmorphic containers with backdrop blur
- Mobile-first with `clamp()` for responsive typography
- All interactive elements have hover/active states with transforms
- Touch-optimized with `-webkit-tap-highlight-color: transparent`

## Key Technical Details

### Question Validation Logic
- **MC**: Direct index comparison
- **Date**: ISO string comparison (YYYY-MM-DD format)
- **Pin**: Euclidean distance calculation with `Math.hypot()`

### Image Click Coordinate Mapping
The pin question uses `getBoundingClientRect()` and natural dimensions to convert click coordinates:
```typescript
const scaleX = img.naturalWidth / rect.width;
const scaleY = img.naturalHeight / rect.height;
const x = (e.clientX - rect.left) * scaleX;
const y = (e.clientY - rect.top) * scaleY;
```

This ensures accuracy across different screen sizes.

### Feedback Timing
All question handlers use a 1500ms `setTimeout` to display feedback before calling `advanceQuestion()`. Double-click prevention is implemented with `if (showFeedback) return;` guards.

## Static Assets

- `/public/austria-map.png`: Map image for the pin question (960×536px)
- Natural dimensions are critical for coordinate mapping

## Deployment Notes

This is a standard Next.js app that can be deployed to Vercel, Netlify, or any platform supporting Node.js. The only runtime requirement is the `OPENAI_API_KEY` environment variable if AI evaluation is enabled.
