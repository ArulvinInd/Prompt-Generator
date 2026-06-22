# AI Prompt Generator — Product Specification

**Version:** 1.0  
**Last Updated:** June 2026  
**Status:** Ready for Development

---

## 1. Overview

### Problem Statement

Most users write vague, incomplete, or over-worded prompts when interacting with AI models. This causes:
- Multiple back-and-forth rounds to clarify intent
- Unnecessary token usage
- Poor or off-target AI responses
- Frustration for non-technical users

### Solution

A web application that takes a rough user prompt and rewrites it into a clear, structured, and token-efficient version using Google's free AI APIs (Gemini). The app also explains what was improved so users build better prompting habits over time.

### Target Users

- Developers learning to use AI APIs
- Content creators using AI writing tools
- Students and researchers using AI assistants
- Non-technical users who want better AI results

---

## 2. Tech Stack

### Frontend
- **Framework:** React (Vite)
- **Styling:** Tailwind CSS
- **Language:** TypeScript
- **Routing:** React Router v6

### Backend / API
- **AI Engine:** Google Gemini API (free tier)
  - Model: `gemini-1.5-flash` (free, high rate limit)
  - Fallback: `gemini-1.0-pro`
- **API Key Storage:** `.env` file (`VITE_GEMINI_API_KEY`)
- **HTTP Client:** Native `fetch` (no extra dependencies needed)

### Storage
- **Prompt History:** `localStorage` (browser, no backend needed)
- **User Preferences:** `localStorage`

### Hosting (optional, free)
- Vercel or Netlify (free tier)

---

## 3. Google Gemini API Setup

### Get a Free API Key
1. Go to [https://aistudio.google.com/app/apikey](https://aistudio.google.com/app/apikey)
2. Sign in with a Google account
3. Click **Create API Key**
4. Copy the key and add it to `.env`:

```env
VITE_GEMINI_API_KEY=your_key_here
```

### Free Tier Limits (as of 2026)
- `gemini-1.5-flash`: 15 requests/minute, 1 million tokens/day — sufficient for this app
- No credit card required

### API Call Structure

```typescript
const GEMINI_URL =
  `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${API_KEY}`;

const response = await fetch(GEMINI_URL, {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    contents: [
      {
        parts: [{ text: fullPrompt }]
      }
    ],
    generationConfig: {
      temperature: 0.4,
      maxOutputTokens: 1024
    }
  })
});

const data = await response.json();
const text = data.candidates[0].content.parts[0].text;
```

---

## 4. Features

### 4.1 Core Features (MVP)

#### Prompt Optimizer
- User inputs a rough/unclear prompt in a textarea
- User selects **prompt type** (writing, coding, analysis, image generation, data, general)
- User selects **tone** (auto-detect, professional, casual, technical)
- App calls Gemini API with a system instruction to rewrite the prompt
- App displays the optimized prompt in a copyable output box

#### Improvements Panel
- After optimization, display 2–4 bullet points explaining what was improved
- Examples: "Added target audience", "Specified output format", "Removed ambiguous phrasing"

#### Token Estimator
- Estimate token count of original prompt vs optimized prompt
- Formula: `Math.round(wordCount * 1.3)` (simple approximation)
- Display: "Before: ~42 tokens → After: ~38 tokens"

#### Copy Button
- One-click copy of the optimized prompt to clipboard
- Visual confirmation ("Copied ✓") for 2 seconds

#### Clarity Score
- A score from 0–100 rating the improvement quality
- Returned by Gemini as part of the JSON response
- Display as a metric card (e.g., "87 / 100")

---

### 4.2 Secondary Features (Post-MVP)

#### Prompt History
- Store the last 20 optimized prompts in `localStorage`
- Display as a collapsible sidebar or drawer
- Allow re-loading a past prompt into the input
- Allow deleting individual history items or clearing all

#### Prompt Templates
- A set of built-in template prompts the user can click to pre-fill the input
- Categories: Blog post, Code review, Email, Data analysis, Image, Summary

#### Character / Word Counter
- Live character and word count shown below the textarea
- Warning if input exceeds 2000 characters (Gemini limit awareness)

---

## 5. UI Screens

### 5.1 Main Screen (Single Page App)

```
┌─────────────────────────────────────────────┐
│  🪄 Prompt Generator          [History]      │
├─────────────────────────────────────────────┤
│                                             │
│  Your rough prompt                          │
│  ┌─────────────────────────────────────┐    │
│  │ write something about dogs for      │    │
│  │ my blog                             │    │
│  └─────────────────────────────────────┘    │
│                                             │
│  [Prompt type ▼]  [Tone ▼]  [Generate ↗]  │
│                                             │
├─────────────────────────────────────────────┤
│  TOKEN ESTIMATE                             │
│  Before: ~12    After: ~38    Score: 91/100 │
├─────────────────────────────────────────────┤
│  ✨ Optimized prompt              [Copy]    │
│  ┌─────────────────────────────────────┐    │
│  │ Write a 500-word engaging blog post │    │
│  │ about the top benefits of owning a  │    │
│  │ dog. Use a friendly, conversational │    │
│  │ tone with subheadings...            │    │
│  └─────────────────────────────────────┘    │
│                                             │
│  What was improved                          │
│  ✓ Added target word count (500 words)      │
│  ✓ Specified tone (friendly, conversational)│
│  ✓ Added content structure (subheadings)    │
│  ✓ Clarified topic focus                    │
└─────────────────────────────────────────────┘
```

### 5.2 History Drawer (Secondary)

```
┌──────────────────────┐
│  Prompt History  [✕] │
├──────────────────────┤
│  Jun 18 – Blog post  │
│  "Write a 500-word…" │
│  [Load]  [Delete]    │
├──────────────────────┤
│  Jun 17 – Coding     │
│  "Write a Python…"   │
│  [Load]  [Delete]    │
└──────────────────────┘
```

---

## 6. Gemini Prompt Engineering (System Instruction)

This is the internal prompt sent to Gemini with every request. **This is the core logic of the app.**

```
You are an expert prompt engineer. Your job is to take a rough, unclear, or vague user prompt and rewrite it into a precise, token-efficient, and effective prompt.

Rules:
1. Add missing context, constraints, and output format instructions.
2. Specify tone, length, and structure where relevant.
3. Remove redundancy, filler words, and vague language.
4. Keep it concise but complete — no unnecessary verbosity.
5. Add role framing only if it meaningfully helps (e.g. "Act as a senior developer...").
6. For image prompts: add style, lighting, composition, and mood details.
7. For coding prompts: specify the language, version, expected behavior, and edge cases.
8. For prompt type "{promptType}" and tone "{tone}".

Respond ONLY with valid JSON (no markdown, no backticks, no preamble):
{
  "optimizedPrompt": "...",
  "improvements": ["improvement 1", "improvement 2", "improvement 3"],
  "clarityScore": 87
}

- clarityScore: integer 0–100 rating how much clearer the optimized prompt is.
- improvements: 2–4 short, specific strings describing what you fixed or added.
```

The full message sent to Gemini:

```typescript
const fullPrompt = `
${SYSTEM_INSTRUCTION}

Prompt type: ${promptType}
Tone: ${tone}

Original prompt:
${userPrompt}
`;
```

---

## 7. Data Models

### PromptResult

```typescript
interface PromptResult {
  optimizedPrompt: string;
  improvements: string[];
  clarityScore: number;
  originalTokens: number;
  optimizedTokens: number;
  timestamp: string; // ISO date
  promptType: PromptType;
  tone: ToneType;
}
```

### PromptType

```typescript
type PromptType =
  | "general"
  | "writing"
  | "coding"
  | "analysis"
  | "image"
  | "data";
```

### ToneType

```typescript
type ToneType = "auto" | "professional" | "casual" | "technical";
```

### HistoryItem

```typescript
interface HistoryItem {
  id: string;            // uuid or timestamp
  originalPrompt: string;
  result: PromptResult;
  createdAt: string;     // ISO date
}
```

---

## 8. File Structure

```
prompt-generator/
├── public/
│   └── favicon.ico
├── src/
│   ├── components/
│   │   ├── PromptInput.tsx         # Textarea + type/tone selectors
│   │   ├── PromptOutput.tsx        # Optimized prompt display + copy button
│   │   ├── ImprovementsPanel.tsx   # "What was improved" bullet list
│   │   ├── TokenStats.tsx          # Before/after token cards + clarity score
│   │   ├── HistoryDrawer.tsx       # Sidebar with past prompts
│   │   └── TemplateGrid.tsx        # Optional: pre-built prompt templates
│   ├── hooks/
│   │   ├── usePromptOptimizer.ts   # Gemini API call + state management
│   │   └── usePromptHistory.ts     # localStorage read/write for history
│   ├── utils/
│   │   ├── gemini.ts               # Gemini API client (fetch wrapper)
│   │   ├── tokenEstimator.ts       # Word count → token estimate
│   │   └── parseGeminiResponse.ts  # JSON parsing + validation
│   ├── types/
│   │   └── index.ts                # All TypeScript interfaces
│   ├── constants/
│   │   └── systemPrompt.ts         # The Gemini system instruction string
│   ├── App.tsx
│   └── main.tsx
├── .env                            # VITE_GEMINI_API_KEY=...
├── .env.example                    # Template (committed to git)
├── .gitignore
├── index.html
├── package.json
├── tailwind.config.ts
├── tsconfig.json
└── vite.config.ts
```

---

## 9. Key Implementation Details

### 9.1 Gemini API Client (`src/utils/gemini.ts`)

```typescript
const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;
const BASE_URL =
  "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent";

export async function callGemini(prompt: string): Promise<string> {
  const res = await fetch(`${BASE_URL}?key=${API_KEY}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      contents: [{ parts: [{ text: prompt }] }],
      generationConfig: { temperature: 0.4, maxOutputTokens: 1024 }
    })
  });

  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.error?.message || "Gemini API error");
  }

  const data = await res.json();
  return data.candidates[0].content.parts[0].text;
}
```

### 9.2 Response Parser (`src/utils/parseGeminiResponse.ts`)

```typescript
export function parseGeminiResponse(raw: string): PromptResult {
  const clean = raw.replace(/```json|```/g, "").trim();
  const parsed = JSON.parse(clean);
  return {
    optimizedPrompt: parsed.optimizedPrompt,
    improvements: parsed.improvements ?? [],
    clarityScore: Math.round(parsed.clarityScore ?? 0),
    originalTokens: 0,   // set by caller
    optimizedTokens: 0,  // set by caller
    timestamp: new Date().toISOString(),
    promptType: "general",
    tone: "auto"
  };
}
```

### 9.3 Token Estimator (`src/utils/tokenEstimator.ts`)

```typescript
export function estimateTokens(text: string): number {
  const words = text.trim().split(/\s+/).length;
  return Math.round(words * 1.3);
}
```

### 9.4 History Hook (`src/hooks/usePromptHistory.ts`)

```typescript
const STORAGE_KEY = "prompt_history";
const MAX_ITEMS = 20;

export function usePromptHistory() {
  const [history, setHistory] = useState<HistoryItem[]>(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  });

  const addItem = (item: HistoryItem) => {
    const updated = [item, ...history].slice(0, MAX_ITEMS);
    setHistory(updated);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  };

  const deleteItem = (id: string) => {
    const updated = history.filter(h => h.id !== id);
    setHistory(updated);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  };

  const clearAll = () => {
    setHistory([]);
    localStorage.removeItem(STORAGE_KEY);
  };

  return { history, addItem, deleteItem, clearAll };
}
```

---

## 10. Error Handling

| Error Scenario | User-Facing Message |
|---|---|
| Empty input submitted | "Please enter a prompt to optimize." |
| API key missing | "API key not configured. Check your .env file." |
| Gemini rate limit hit (429) | "Too many requests. Please wait a moment and try again." |
| Gemini returns invalid JSON | "Something went wrong parsing the response. Try again." |
| Network error | "Connection failed. Check your internet and try again." |
| Response too long | "Your prompt is too long. Please shorten it to under 2000 characters." |

All errors display inline below the generate button (no alert dialogs).

---

## 11. Environment Variables

```env
# .env (never commit this)
VITE_GEMINI_API_KEY=your_gemini_api_key_here

# .env.example (commit this)
VITE_GEMINI_API_KEY=your_gemini_api_key_here
```

Add `.env` to `.gitignore`:
```
.env
.env.local
```

---

## 12. Setup & Run Instructions

```bash
# 1. Clone or create project
npm create vite@latest prompt-generator -- --template react-ts
cd prompt-generator

# 2. Install dependencies
npm install
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p

# 3. Add API key
cp .env.example .env
# Edit .env and paste your Gemini key

# 4. Run in development
npm run dev

# 5. Build for production
npm run build
```

---

## 13. MVP Acceptance Criteria

The app is considered feature-complete (MVP) when:

- [ ] User can type a rough prompt and click Generate
- [ ] Gemini API is called and returns a valid optimized prompt
- [ ] Optimized prompt is displayed with a copy button that works
- [ ] Improvements list shows 2–4 specific changes made
- [ ] Token estimate (before and after) is shown
- [ ] Clarity score is shown
- [ ] All error states are handled gracefully with clear messages
- [ ] Prompt type and tone selectors influence the output
- [ ] The app works on mobile screen sizes (responsive)
- [ ] No API key is exposed in the built output or git history

---

## 14. Future Roadmap

| Phase | Feature | Notes |
|---|---|---|
| v1.1 | Prompt history | localStorage, last 20 items |
| v1.1 | Template library | 10+ pre-built prompt starters |
| v1.2 | Side-by-side comparison | Run original + optimized and compare AI output |
| v1.2 | Dark mode | Tailwind dark class support |
| v1.3 | Export history | Download as JSON or CSV |
| v2.0 | User accounts | Save prompts to cloud (Supabase free tier) |
| v2.0 | Team mode | Share prompt templates across an org |
| v2.0 | API endpoint | Let other apps call this optimizer as a service |

---

## 15. Useful References

- Gemini API docs: [https://ai.google.dev/gemini-api/docs](https://ai.google.dev/gemini-api/docs)
- Get free API key: [https://aistudio.google.com/app/apikey](https://aistudio.google.com/app/apikey)
- Gemini model list: [https://ai.google.dev/gemini-api/docs/models](https://ai.google.dev/gemini-api/docs/models)
- Vite docs: [https://vitejs.dev](https://vitejs.dev)
- Tailwind CSS: [https://tailwindcss.com/docs](https://tailwindcss.com/docs)