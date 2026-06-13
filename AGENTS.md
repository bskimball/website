# AGENTS.md

## Design System: "Atomic Drafting Room"

This document defines the design philosophy, tokens, and conventions for `my-blog`. All future agents should adhere to these standards.

Stack: **Astro + React islands**, **Tailwind v4** (`@theme` in `src/styles/global.css`), **shadcn/ui** components. The shadcn token contract (`--background`, `--foreground`, `--primary`, `--secondary`, `--muted`, `--accent`, `--border`, `--ring`, `--radius`, …) is the source of truth — reskin by editing token **values**, never by renaming tokens, or shadcn components break.

### 1. Philosophy: "Raygun Gothic"

Atomic-age optimism meets the engineer's drafting table. The page should feel like a 1950s vision of tomorrow — Googie signage, sputnik starbursts, boomerang curves — drawn with the precision of a systems schematic.

- **The Subject:** Brian Kimball, Systems Engineer / Developer. "Building from the metal up."
- **The Conflict:** Atomic, optimistic, _colorful_ ornament (starbursts, boomerangs, chrome) vs. the disciplined grid and mono annotations of a technical document.
- **The Vibe:** Tomorrowland terminal, space-age brochure, confident and readable — never sterile, never neon-synthwave.

Spend boldness in **one** place: the sputnik starburst is the signature. Everything around it stays quiet.

### 2. Themes

Two modes, toggled in the header.

#### Light Mode: "Daytime Atomic"

- **Vibe:** Atomic-age print brochure on warm paper.
- **Palette:** Atomic Cream `#F4ECD8` (bg) · Jet Ink (fg) · Turquoise `#1FB8B0` (primary, deepened to `hsl(177 74% 36%)` for contrast) · Coral Ray `#FF5E4D` (accent) · Chrome Gold `#E8B84B` (ring/ornament).

#### Dark Mode: "Atomic Dusk"

- **Vibe:** Deep space-teal night sky with neon atomic glow.
- **Palette:** Deep Space Teal `hsl(196 62% 6%)` (bg) · Warm Cream (fg) · Bright Turquoise `hsl(177 78% 52%)` (primary) · Coral `hsl(6 95% 66%)` (accent) · Gold `hsl(42 90% 60%)`.

Tokens are HSL triplets in `:root` / `.dark`, mapped to `--color-*` in `@theme`. Use `bg-primary`, `text-accent`, `text-gold`, `border-border`, etc. — never raw hex in markup.

### 3. Typography

Wire fonts via the Tailwind v4 `--font-*` namespace (NOT `--font-family-*`, which is inert).

- **Display:** `Audiowide` — the retro voice. Class `font-display`. Used **sparingly**: hero name, header logo, footer "Connect", one-word page titles.
- **Headings:** `Outfit` (geometric, readable). Class `font-serif` (alias kept for legacy markup — it is _not_ a serif). Post titles, card titles, prose headings.
- **Body:** `Inter`. Class `font-sans`.
- **Mono / Data:** `Space Mono`. Class `font-mono`. FIG labels, tags, dates, technical specs.

Rule of thumb: long-form text (post titles, card titles, body) stays in readable Outfit/Inter. Reserve Audiowide for short, punchy marks.

### 4. Shape Language

- **The Grid (soft-square):** Layout containers, Bento cards → `rounded-2xl`, `border-2 border-border`.
- **The Human/Interactive (pill):** Buttons, Tags, date chips, Avatars → `rounded-full`.
- **Global radius:** `--radius: 0.75rem`.

### 5. Signature Elements

- **Atomic Starburst** (`src/components/Starburst.astro`): the core mark — a mid-century "sparkle" of thin spikes tapering to sharp points, alternating long/short rays (modeled on the `me_website_2026` illustration, not a chunky sputnik). Inherits `currentColor` — color it with `text-gold` / `text-accent` / `text-primary`. Pass `dots` for "electron" balls on the long-ray tips. Used at the hero (large + `animate-spin-slow` ambient), header logo, footer, and on featured cards.
- **Atomic Backdrop** (`src/components/Backdrop.astro`): a global, fixed, very-low-opacity swirl — a teal boomerang sweep + a long gold orbital arc — sitting at `-z-10` behind all content. Include once per page body (after `.noise-overlay`).
- **Boomerang Divider** (`.boomerang-divider`): a turquoise→gold→coral gradient line with an atomic curve at center. See `SectionDivider.astro`.
- **Googie Skyline** (Footer): a space-age city silhouette at dusk (Theme-Building arch, Space Needle, domes, monorail) anchored as a bottom band, with a coral banded sun and a full-height sunset glow rising behind the content.
- **Helpers:** `.atomic-glow` (neon halo for dark mode), `.text-chrome` (gold→coral gradient text), `.animate-spin-slow`, `.atomic-starburst` (pure-CSS background variant).

### 6. Annotations

The page is intentionally clean — there is **no** "FIG" technical-label system (it was removed for a less-technical, more colorful feel). Don't reintroduce mono `FIG x.x //` markers.

### 7. Code Conventions

- **Tailwind v4:** all theme config lives in the `@theme` block in `src/styles/global.css`.
- **Containers:** `.container` utility (`px-8`, `py-20`).
- **Icons:** `react-icons` (Fa6).
- **Links:** never use trailing slashes.
