# 🪄 AI Prompt Generator

> **Transform vague ideas into precise, token-efficient AI prompts — powered by GitHub Copilot.**

[![Live Demo](https://img.shields.io/badge/Live%20Demo-arulvinind.github.io-4f46e5?style=for-the-badge&logo=github)](https://arulvinind.github.io/Prompt-Generator/)
[![Deploy](https://img.shields.io/github/actions/workflow/status/arulvinind/Prompt-Generator/deploy.yml?style=for-the-badge&label=Deploy&logo=githubactions)](https://github.com/arulvinind/Prompt-Generator/actions)
[![PWA](https://img.shields.io/badge/PWA-Installable-5A0FC8?style=for-the-badge&logo=pwa)](https://arulvinind.github.io/Prompt-Generator/)

---

## What It Does

Most users write vague or over-worded prompts when talking to AI — which wastes tokens and produces poor results. This app takes your rough prompt and instantly rewrites it into a clear, structured, and effective version. It also shows you **what changed and why**, so you get better at prompting over time.

---

## Features

### ✨ Prompt Optimization
- Rewrites your rough prompt into a precise, token-efficient version
- Supports **6 prompt types**: General, Writing, Coding, Data Analysis, Image, Research
- Supports **5 tone styles**: Auto, Professional, Casual, Technical, Creative
- Powered by **GitHub Copilot** (`gpt-4o-mini` by default, with model selector)

### 📊 Token & Clarity Stats
- Shows original vs. optimized token count
- Clarity score with a visual indicator
- Highlights how much token reduction was achieved

### 💡 Improvement Breakdown
- Explains every change made to your prompt
- Helps you learn better prompting habits over time

### 🌍 AI Translator
- Translate your optimized prompt into **19 languages**
- Grouped by region: South Indian (Tamil, Telugu, Kannada, Malayalam), Indian (Hindi), European, East Asian, Middle Eastern
- Set a **default language** — remembered across sessions
- One-click copy of translated output

### 📁 Template Library
- 12+ ready-to-use prompt templates across categories: Writing, Coding, Data, Analysis, Image
- Search templates by name
- Filter by category
- Click any template to instantly pre-fill the form

### 🕘 Prompt History
- Saves your last 20 optimized prompts locally (no account needed)
- Reload any past prompt with one click
- Delete individual entries or clear all

### 🎨 Themes & Backgrounds
- **Light / Dark / System** theme modes
- **4 background animations**: Floating Orbs, Particles, Grid Pulse, None
- Smooth transitions throughout

### 📲 Progressive Web App (PWA)
- Install to your home screen on any device
- Works offline for the UI (API calls require internet)
- Auto-updates in the background

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | React 18 + TypeScript 5 |
| Build Tool | Vite 5 |
| Styling | Tailwind CSS 3 |
| AI API | GitHub Copilot (`api.githubcopilot.com`) |
| PWA | `vite-plugin-pwa` + Workbox |
| Deployment | GitHub Pages via GitHub Actions |
| Storage | `localStorage` / `sessionStorage` (no backend) |

---

## Getting Started

### Prerequisites
- Node.js 18+
- A GitHub account with an active **GitHub Copilot subscription**
- A GitHub Personal Access Token (PAT) with `copilot` scope

### 1. Clone the repo

```bash
git clone https://github.com/arulvinind/Prompt-Generator.git
cd Prompt-Generator
```

### 2. Install dependencies

```bash
npm install
```

### 3. Configure your API token

```bash
cp .env.example .env
```

Edit `.env`:

```env
VITE_COPILOT_API_TOKEN=ghp_your_token_here
```

> **How to get a token:** Go to [github.com/settings/tokens/new](https://github.com/settings/tokens/new) → Token (classic) → enable `copilot` scope → Generate token.

### 4. Start the dev server

```bash
npm run dev
```

Open `http://localhost:5173` in your browser.

---

## Deployment to GitHub Pages

The project includes a ready-to-use GitHub Actions workflow.

### 1. Enable GitHub Pages

Go to your repo → **Settings** → **Pages** → Source → **GitHub Actions**

### 2. Add your token as a secret

Go to **Settings** → **Secrets and variables** → **Actions** → **New repository secret**

| Name | Value |
|---|---|
| `VITE_COPILOT_API_TOKEN` | `ghp_your_token_here` |

### 3. Push to `main`

```bash
git push origin main
```

The workflow will automatically build and deploy. Your app will be live at:

```
https://<your-username>.github.io/<repo-name>/
```

You can also trigger a manual deploy from the **GitHub Actions** panel in VS Code or on github.com.

---

## Project Structure

```
src/
├── components/
│   ├── BackgroundScene.tsx     # CSS-only animated backgrounds
│   ├── BgAnimationPicker.tsx   # Background style selector
│   ├── HistoryDrawer.tsx       # Slide-out history panel
│   ├── ImprovementsPanel.tsx   # Shows what changed in the prompt
│   ├── PromptInput.tsx         # Main form (type, tone, model, input)
│   ├── PromptOutput.tsx        # Displays optimized prompt + copy
│   ├── PWAInstallBanner.tsx    # Install to home screen banner
│   ├── TemplateModal.tsx       # Searchable template browser
│   ├── ThemeToggle.tsx         # Light/Dark/System switcher
│   ├── TokenStats.tsx          # Token count + clarity score
│   └── TranslatorPanel.tsx     # Collapsible AI translation panel
├── constants/
│   ├── languages.ts            # 19 languages in grouped format
│   ├── systemPrompt.ts         # AI system instruction
│   └── templates.ts            # Prompt template definitions
├── hooks/
│   ├── usePWAInstall.ts        # beforeinstallprompt handler
│   ├── usePromptHistory.ts     # localStorage history management
│   ├── usePromptOptimizer.ts   # API call + state management
│   └── useTheme.ts             # Theme with system preference sync
├── utils/
│   ├── copilot.ts              # GitHub Copilot API client
│   ├── parseResponse.ts        # JSON response parser
│   └── tokenEstimator.ts       # Token count estimator
└── App.tsx                     # Root component, all state
```

---

## Environment Variables

| Variable | Required | Description |
|---|---|---|
| `VITE_COPILOT_API_TOKEN` | Yes | GitHub PAT with `copilot` scope |

---

## License

MIT — free to use, fork, and modify.

---

<p align="center">Built with ❤️ using React, Tailwind CSS, and GitHub Copilot</p>
