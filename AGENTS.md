# AGENTS.md

## Design System: "Renaissance Technical"

This document outlines the design philosophy, themes, and conventions for the `my-blog` project. All future agents should adhere to these standards.

### 1. Philosophy: "Da Vinci's Notebook"

The design aesthetic blends classical humanism with mechanical precision. It is **not** purely Brutalist. It sits at the intersection of the organic and the engineered.

- **The Conflict:** Rigid architectural grids (Layouts, Lines) vs. Perfect organic circles (Buttons, Avatars, Tags).
- **The Vibe:** Sketchbook, Technical Schematic, Biological Specimen, "From the Metal Up."

### 2. Themes

The website supports two distinct modes, switching automatically or via the header toggle.

#### **Dark Mode: "Night Draft"**

- **Vibe:** Deep Jungle, Bioluminescence, Sonar, Retro-Futurism.
- **Palette:**
  - **Background:** Void Green (`--background: 171 80% 4%`)
  - **Primary:** Acid Lime (`--primary: 72 100% 50%`)
  - **Secondary:** Canopy Green (`--secondary: 171 55% 13%`)
  - **Foreground:** Bone White (`--foreground: 220 13% 91%`)
- **Footer SVG:** Technical schematic wireframes in faint lime.

#### **Light Mode: "Day Parchment"**

- **Vibe:** Architectural Blueprint, High-Quality Paper, Ink, Red Wax Seal.
- **Palette:**
  - **Background:** Alabaster Paper (`--background: 40 20% 98%`)
  - **Primary:** Deep Editorial Red (`--primary: 0 72% 38%`)
  - **Secondary:** Pale Sand/Manila (`--secondary: 35 15% 90%`)
  - **Foreground:** Warm Deep Ink (`--foreground: 20 10% 10%`)
- **Footer SVG:** Technical blueprint lines in faint ink.

### 3. Typography

- **Headings:** `Tenor Sans` (Google Font). Elegant, high-stroke contrast. "The Title Block."
  - _Usage:_ Hero titles, Article headers, Section dividers.
  - _Class:_ `font-serif`
- **Body:** `Inter` (Google Font). Clean, neutral sans-serif. "The Notes."
  - _Usage:_ Article text, UI elements.
  - _Class:_ `font-sans`
- **Code/UI:** `Geist Mono` (or System Mono). Technical, crisp. "The Measurements."
  - _Usage:_ Nav links, Tags, Dates, Technical Specs (`FIG 1.0 // IDENTITY`).
  - _Class:_ `font-mono`

### 4. Shape Language (The "Circle vs. Square" Rule)

- **The Grid (Square/Hard):**
  - Layout containers.
  - Bento Cards (`rounded-none` or `0.5rem`).
  - Images (unless Author).
  - Section Dividers.
- **The Human/Interactive (Circular/Soft):**
  - **Buttons:** Always `rounded-full` (Pill shape).
  - **Tags:** Always `rounded-full` (Pill shape).
  - **Avatars:** Always `rounded-full` (Medallion style).
  - **Global Radius:** `0.5rem` (Softened mechanical edge).

### 5. Key Components

#### **Hero Section**

- Massive centered typography ("Brian Kimball").
- **Technical Annotation:** `FIG 1.0 // IDENTITY` (Top Left).
- **Description:** Mono-spaced role definition ("SYSTEMS ENGINEER / DEVELOPER").

#### **Footer**

- **Background:** "The Drafting Table" - Schematic SVG with compass arcs and grid lines.
- **Content:** Massive "Connect" link.

#### **Section Divider**

- **Style:** "Technical Divider".
- **Elements:**
  - Left-aligned label: `DIV 1.0 // SEPARATOR`.
  - Solid horizontal line.

#### **The "FIG" System (Technical Annotations)**

Technical labels positioned at the **Top Left** of the main container (usually `-top-8`).

- **Home:** `FIG 1.0 // IDENTITY`
- **Blog Index:** `FIG 2.0 // ARCHIVE`
- **Blog Post:** `FIG 2.1 // ENTRY`
- **About:** `FIG 3.0 // PROFILE`
- **Tags:** `FIG 4.0 // INDEX`

### 6. Code Conventions

- **Tailwind v4:** Use the new `@theme` block in `src/styles/global.css`.
- **Containers:** Use `.container` utility (`px-8`, `py-20`).
- **Icons:** `react-icons` (Fa6).
- **Links:** Never use trailing slashes.
