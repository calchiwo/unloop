# Unloop

A cognitive constraint system that breaks mental loops. Every thought must resolve as **action**, **decision**, or **discard** and nothing stays open-ended.

![Image](https://github.com/user-attachments/assets/a44ed5fd-60c4-4d49-ae96-454581284a41)

## What It Does

Overthinking is a loop. Unloop forces an exit.

The app provides four distinct modes, each designed to break a different kind of mental loop:

**Brain Dump**: A guided 4-step funnel (dump, define, options, resolve) that takes a messy, spiraling thought and forces it through progressive narrowing until you arrive at a concrete outcome. You dump everything, extract the real decision, limit yourself to 2 options and 1 priority factor, then commit.

**Decision Engine**: A structured comparison tool. Two options, two factors, slider-based scoring. It calculates a weighted recommendation and gives you a confidence signal (strong, slight, or coin-flip). Designed for when you keep going back and forth between choices.

**5-Minute Rule**: A countdown timer that gives you exactly 5 minutes to think about something, then forces a decision when time runs out. Addresses the pattern of endless deliberation by imposing a hard deadline.

**Importance Filter**: A 3-question test: will this matter in 1 week, 1 month, 1 year? Based on your answers, it classifies the thought as noise, minor, moderate, or important and recommends what to do with it. Most things we stress about are noise.

All resolved thoughts flow into a **Resolved** tab that tracks your history with stats (actions taken, scheduled, discarded).

## Project structure

## Project structure

```
app/
├── page.tsx          # App shell, state management, navigation
├── layout.tsx        # Root layout, metadata, font config
└── globals.css       # Design tokens (dark theme, green accent)

components/
├── brain-dump.tsx    # 4-step guided resolution flow
├── decision-engine.tsx # Weighted comparison with scoring
├── timer-mode.tsx    # 5-minute countdown with forced decision
├── importance-filter.tsx # Time-horizon importance test
├── resolved-list.tsx # History view with stats
└── ui/               # Primitives (button, card, input, textarea, slider)

lib/
└── utils.ts          # cn() class name utility
```

## Tech Stack

- **Next.js 16** with App Router
- **React 19**
- **TypeScript**
- **Tailwind CSS 3** with a custom dark-only design token system
- **shadcn/ui** primitives (button, card, input, textarea, slider)
- **Lucide** icons
- **Radix UI** (slider, slot)

## Getting Started

```bash
git clone https://github.com/calchiwo/unloop.git
cd unloop
pnpm install
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000).

## Design

Dark theme only. Near-black background (`hsl(0 0% 4%)`), green accent (`hsl(142 76% 46%)`). The visual language reinforces the core idea: stop decorating your thoughts, resolve them.

## License

MIT

## Author

[Caleb Wodi](https://x.com/calchiwo)
