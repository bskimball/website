# AGENTS.md

## Design System: "Engineered Portfolio"

This document outlines the design philosophy, themes, and conventions for the `my-blog` project. All future agents should adhere to these standards.

### 1. Themes

The website supports two distinct modes, switching automatically or via the header toggle.

#### **Dark Mode: "Botanical Brutalist"**

- **Vibe:** Engineered, Cyber-organic, Deep Jungle, High Contrast.
- **Palette:**
  - **Background:** Void Green (`--background: 171 80% 4%`)
  - **Primary:** Acid Lime (`--primary: 72 100% 50%`)
  - **Secondary:** Canopy Green (`--secondary: 171 55% 13%`)
  - **Foreground:** Bone White (`--foreground: 220 13% 91%`)
- **Footer SVG:** Deep abstract fluid layers in emerald greens.

#### **Light Mode: "Editorial Paper"**

- **Vibe:** Clean, Paper-like, Intelligent, Sophisticated.
- **Palette:**
  - **Background:** Alabaster Paper (`--background: 40 20% 98%`)
  - **Primary:** Deep Editorial Red (`--primary: 0 72% 38%`)
  - **Secondary:** Pale Sand/Manila (`--secondary: 35 15% 90%`)
  - **Foreground:** Warm Deep Ink (`--foreground: 20 10% 10%`)
- **Footer SVG:** Subtle topography in shades of sand and taupe.

### 2. Typography

- **Headings:** `Tenor Sans` (Google Font). elegant, high-stroke contrast.
  - _Usage:_ Hero titles, Article headers, Section dividers.
  - _Class:_ `font-serif`
- **Body:** `Inter` (Google Font). Clean, neutral sans-serif.
  - _Usage:_ Article text, UI elements.
  - _Class:_ `font-sans`
- **Code/UI:** `Geist Mono` (or System Mono). Technical, crisp.
  - _Usage:_ Nav links, Tags, Dates, Specs (`[SYSTEM: ONLINE]`).
  - _Class:_ `font-mono`

**Typography Rules:**

- **Casing:** Use **Title Case** or **Sentence Case**. Avoid aggressively uppercase text unless specifically for small "data" tags (e.g., `[SYSTEM]`).
- **Tracking:** Use `tracking-widest` for mono UI elements. `tracking-tighter` for massive display headings.

### 3. Key Components

#### **Hero Section (`src/pages/index.astro`)**

- Massive centered typography ("Brian Kimball").
- `mix-blend-difference` used on the title for interaction with background elements.
- Minimal, no distractions.

#### **Bento Grid (`src/components/BentoCard.astro`)**

- Used for Blog Index and Home Page.
- **Layout:** Responsive CSS Grid (`grid-cols-12`).
  - Featured Post: Spans 6 cols (desktop).
  - Standard Post: Spans 3-4 cols.
- **Style:**
  - Square corners (`rounded-none`).
  - Heavy borders (`border-2`).
  - **Hover:** Inverts colors (Background becomes Primary, Text becomes Background).
  - **No Glitch:** Clean hover transitions only.

#### **Footer**

- **Content:** "Connect" (massive link), Social Grid, Legal.
- **Background:** Interactive-looking but static SVG.
  - _Dark:_ Abstract green fluid layers + Lime sun.
  - _Light:_ Abstract sand layers + Red sun.
  - _Implementation:_ CSS Variables `hsl(var(--footer-landscape-N))` defined in `global.css`.

#### **Images (`BlockAuthor`, `BlogPost`)**

- **Default:** Grayscale (`grayscale`), Square (`rounded-none`), Bordered.
- **Hover:** Full color (`grayscale-0`), smooth transition.

### 4. Code Conventions

- **Tailwind v4:** Use the new `@theme` block in `src/styles/global.css` for variables.
- **Containers:** Use `.container` utility. Standard padding is `px-8` or `py-20`.
- **Icons:** `react-icons` (Fa6).
- **Links:**
  - **Trailing Slashes:** `never`. Ensure links do _not_ end in `/` (e.g., `/blog/my-post`, not `/blog/my-post/`).
- **UI Elements:**
  - **Radius:** `0rem` (Hard corners) everywhere.
  - **Shadows:** `.brutalist-shadow` (Hard offset shadow) if needed.

### 5. Future Tasks

- When adding new pages, ensure they use the `BentoCard` pattern for lists or the `prose` layout for content.
- Maintain the strict separation of Light/Dark palettes in `global.css`.
