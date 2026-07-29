---
version: alpha
name: Raygun Gothic
description: >
  Atomic-age optimism meets the engineer's drafting table. A personal site
  design system for Brian Kimball — Tomorrowland terminal energy drawn with
  the precision of a systems schematic. Implemented as Astro + React islands,
  Tailwind v4 (@theme in src/styles/global.css), and shadcn/ui tokens.
colors:
  # Daytime Atomic (light) — normative surface & action tokens
  background: "#F5EFE0"
  foreground: "#1B1D22"
  card: "#F8F5EC"
  card-foreground: "#1B1D22"
  popover: "#F8F5EC"
  popover-foreground: "#1B1D22"
  primary: "#18A099"
  primary-foreground: "#FAF7F0"
  secondary: "#E9E1CE"
  secondary-foreground: "#1B1D22"
  muted: "#EAE5D7"
  muted-foreground: "#545963"
  accent: "#F3513F"
  accent-foreground: "#FAF7F0"
  destructive: "#EB321E"
  destructive-foreground: "#FAFAFA"
  border: "#C7CAD1"
  input: "#C7CAD1"
  ring: "#E7AC23"
  gold: "#E6A819"
  # Atomic Dusk (dark) — paired tokens
  background-dark: "#061419"
  foreground-dark: "#F3EEE2"
  card-dark: "#102228"
  card-foreground-dark: "#F3EEE2"
  popover-dark: "#09161C"
  popover-foreground-dark: "#F3EEE2"
  primary-dark: "#25E4DB"
  primary-foreground-dark: "#061419"
  secondary-dark: "#14272E"
  secondary-foreground-dark: "#F3EEE2"
  muted-dark: "#182D35"
  muted-foreground-dark: "#C0B8A5"
  accent-dark: "#FB6656"
  accent-foreground-dark: "#061419"
  destructive-dark: "#CF2917"
  destructive-foreground-dark: "#FAFAFA"
  border-dark: "#26D9D02E"
  input-dark: "#1A2E36"
  ring-dark: "#F5BE3D"
  gold-dark: "#F5BE3D"
  # Brand reference names (marketing / AGENTS.md aliases)
  atomic-cream: "#F4ECD8"
  jet-ink: "#1B1D22"
  turquoise: "#1FB8B0"
  coral-ray: "#FF5E4D"
  chrome-gold: "#E8B84B"
  deep-space-teal: "#061419"
  warm-cream: "#F3EEE2"
  # Charts
  chart-1: "#18A099"
  chart-2: "#F3513F"
  chart-3: "#E7AC23"
  chart-4: "#297A99"
  chart-5: "#F29A3D"
  chart-1-dark: "#25E4DB"
  chart-2-dark: "#FB6656"
  chart-3-dark: "#F5BE3D"
  chart-4-dark: "#3DB8E0"
  chart-5-dark: "#C27AED"
  # Footer Googie skyline
  footer-landscape-1: "#7DB8B3"
  footer-landscape-2: "#386F85"
  footer-landscape-3: "#1C4459"
  footer-sun: "#F3513F"
  footer-landscape-1-dark: "#162F3A"
  footer-landscape-2-dark: "#0C2129"
  footer-landscape-3-dark: "#04121A"
  footer-sun-dark: "#F25544"
  # Selection
  selection: "#F3513F"
  selection-foreground: "#FAF7F0"
typography:
  display-hero:
    fontFamily: Audiowide
    fontSize: 136px
    fontWeight: 400
    lineHeight: 0.95
    letterSpacing: -0.025em
  display-lg:
    fontFamily: Audiowide
    fontSize: 96px
    fontWeight: 400
    lineHeight: 1
    letterSpacing: -0.025em
  display-md:
    fontFamily: Audiowide
    fontSize: 60px
    fontWeight: 400
    lineHeight: 1
    letterSpacing: -0.02em
  display-sm:
    fontFamily: Audiowide
    fontSize: 18px
    fontWeight: 400
    lineHeight: 1.2
    letterSpacing: -0.01em
  headline-lg:
    fontFamily: Outfit
    fontSize: 36px
    fontWeight: 700
    lineHeight: 1.15
    letterSpacing: -0.02em
  headline-md:
    fontFamily: Outfit
    fontSize: 24px
    fontWeight: 700
    lineHeight: 1.2
    letterSpacing: -0.015em
  headline-sm:
    fontFamily: Outfit
    fontSize: 20px
    fontWeight: 700
    lineHeight: 1.25
  body-lg:
    fontFamily: Inter
    fontSize: 18px
    fontWeight: 400
    lineHeight: 1.7
  body-md:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: 400
    lineHeight: 1.65
  body-sm:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: 400
    lineHeight: 1.5
  label-md:
    fontFamily: Space Mono
    fontSize: 14px
    fontWeight: 400
    lineHeight: 1.4
    letterSpacing: 0.2em
  label-sm:
    fontFamily: Space Mono
    fontSize: 12px
    fontWeight: 400
    lineHeight: 1.3
    letterSpacing: 0.04em
  label-sm-bold:
    fontFamily: Space Mono
    fontSize: 12px
    fontWeight: 700
    lineHeight: 1.3
    letterSpacing: 0.04em
  button:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: 500
    lineHeight: 1
  code:
    fontFamily: Space Mono
    fontSize: 14px
    fontWeight: 400
    lineHeight: 1.5
rounded:
  sm: 8px
  md: 10px
  lg: 12px
  xl: 16px
  "2xl": 16px
  full: 9999px
spacing:
  base: 4px
  xs: 4px
  sm: 8px
  md: 16px
  lg: 24px
  xl: 32px
  "2xl": 48px
  "3xl": 64px
  "4xl": 80px
  container-x: 32px
  container-y: 80px
  section-gap: 64px
  card-padding: 24px
  bento-gap: 16px
  header-height: 80px
  max-content: 1280px
components:
  button-primary:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.primary-foreground}"
    rounded: "{rounded.full}"
    height: 40px
    padding: 16px
    typography: "{typography.button}"
  button-primary-hover:
    backgroundColor: "#18A099E6"
  button-secondary:
    backgroundColor: "{colors.secondary}"
    textColor: "{colors.secondary-foreground}"
    rounded: "{rounded.full}"
    height: 40px
    padding: 16px
  button-outline:
    backgroundColor: "{colors.background}"
    textColor: "{colors.foreground}"
    rounded: "{rounded.full}"
    height: 40px
    padding: 16px
  button-ghost:
    backgroundColor: transparent
    textColor: "{colors.foreground}"
    rounded: "{rounded.full}"
  button-destructive:
    backgroundColor: "{colors.destructive}"
    textColor: "{colors.destructive-foreground}"
    rounded: "{rounded.full}"
  button-link:
    backgroundColor: transparent
    textColor: "{colors.primary}"
  button-sm:
    height: 36px
    padding: 12px
    rounded: "{rounded.full}"
  button-lg:
    height: 44px
    padding: 32px
    rounded: "{rounded.full}"
  button-icon:
    height: 40px
    width: 40px
    rounded: "{rounded.full}"
  bento-card:
    backgroundColor: "{colors.card}"
    textColor: "{colors.card-foreground}"
    rounded: "{rounded.2xl}"
    padding: "{spacing.card-padding}"
  bento-card-hover:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.primary-foreground}"
  chip-date:
    backgroundColor: transparent
    textColor: "{colors.foreground}"
    rounded: "{rounded.full}"
    padding: 12px
    typography: "{typography.label-sm}"
  input:
    backgroundColor: "{colors.background}"
    textColor: "{colors.foreground}"
    rounded: "{rounded.lg}"
    height: 40px
  header:
    backgroundColor: "#F5EFE0CC"
    height: "{spacing.header-height}"
  footer:
    backgroundColor: "{colors.secondary}"
  starburst:
    textColor: "{colors.gold}"
  focus-ring:
    backgroundColor: transparent
    textColor: "{colors.ring}"
---

# Raygun Gothic

## Overview

**Raygun Gothic** (also called the *Atomic Drafting Room*) is the visual identity of Brian Kimball’s personal site — systems engineer / developer, tagline **“Building from the metal up.”**

The brand sits at the collision of two moods:

1. **Atomic-age optimism** — Googie signage, sputnik starbursts, boomerang curves, chrome gold, coral rays. A 1950s vision of tomorrow: space-age brochure, Tomorrowland terminal.
2. **Engineer’s drafting table** — disciplined grid, readable type, mono metadata, schematic precision.

The product should feel **confident, colorful, and readable** — never sterile SaaS, never neon-synthwave. Spend boldness in **one** place: the **atomic starburst** is the signature mark. Everything around it stays quiet.

**Subject:** personal engineering blog and portfolio.  
**Audience:** engineers, hiring managers, peers who appreciate craft.  
**Emotional target:** optimistic competence; warm paper brochure by day, deep space-teal night sky by dusk.

**Stack contract (implementation):** Astro + React islands, Tailwind v4 (`@theme` in [`src/styles/global.css`](src/styles/global.css)), shadcn/ui. The shadcn token names (`background`, `foreground`, `primary`, `secondary`, `muted`, `accent`, `border`, `ring`, `radius`, …) are the source of truth. Reskin by editing token **values**, never by renaming tokens. Runtime colors are HSL triplets on `:root` / `.dark`, mapped to `--color-*` in `@theme`. Prefer utilities like `bg-primary`, `text-accent`, `text-gold` — never raw hex in markup.

Two themes toggle from the header:

| Mode | Name | Vibe |
| --- | --- | --- |
| Light | **Daytime Atomic** | Atomic-age print brochure on warm paper |
| Dark | **Atomic Dusk** | Deep space-teal night sky with neon atomic glow |

## Colors

The palette is a **four-note atomic chord** on a warm neutral ground: **Turquoise (primary)**, **Coral Ray (accent)**, **Chrome Gold (ornament / focus)**, and **Jet Ink / Warm Cream (ink)**.

### Daytime Atomic (light)

- **Atomic Cream (`background`):** Warm paper field. Soft, printed, never pure white.
- **Jet Ink (`foreground`):** Near-black blue-ink for body and headlines — maximum permanence on cream.
- **Turquoise (`primary`):** Action, links, brand emphasis. Deepened vs. the marketing turquoise so body-size text hits AA on cream.
- **Coral Ray (`accent`):** Secondary spark — highlights, selection, “BUILDING FROM THE METAL UP,” destructive kinship. Used sparingly so it stays hot.
- **Chrome Gold (`gold` / `ring`):** Ornament and focus only — starbursts, rules, focus rings. Not a fill for large surfaces.
- **Warm sand (`secondary` / `muted`):** Panels, footer band, quiet chips.
- **Faint ink (`border`):** Soft graphite edge, not harsh pure gray.

### Atomic Dusk (dark)

- **Deep Space Teal (`background-dark`):** Night sky, slightly teal — not pure black.
- **Warm Cream (`foreground-dark`):** Readable body on teal night.
- **Bright Turquoise (`primary-dark`):** Neon atomic glow for links and primary actions; pairs with `.atomic-glow` halos.
- **Coral neon (`accent-dark`) + Bright gold (`gold-dark`):** Same chord, lifted for dark luminance. Borders become translucent turquoise veils (`border-dark`).

### Roles

| Role | Light | Dark | Use |
| --- | --- | --- | --- |
| Surface | Atomic Cream | Deep Space Teal | Page background |
| On-surface | Jet Ink | Warm Cream | Body text |
| Primary | Turquoise | Bright Turquoise | Links, primary buttons, brand word emphasis |
| Accent | Coral Ray | Coral neon | Sparks, selection, urgency |
| Ornament | Chrome Gold | Bright gold | Starbursts, dividers, focus ring |
| Card | Lighter cream | Raised teal panel | Bento cards, content panels |

### Rules

- One loud ornament color at a time. Gold owns the starburst; coral owns selection and short emphasis strings; turquoise owns interaction.
- Do not introduce a fifth hue (purple neon, electric magenta, cold pure blue) outside chart-5 / one-off diagrams.
- Selection is coral on cream-tinted white.
- Charts map the same chord: turquoise → coral → gold → secondary teal → warm orange (light) / violet (dark chart-5 only).

## Typography

Four families, each with a job. Wire via Tailwind v4 `--font-*` (not `--font-family-*`).

| Role | Family | Utility | When |
| --- | --- | --- | --- |
| **Display** | **Audiowide** | `font-display` | Hero name, header logo, footer “Connect”, one-word page titles — short punchy marks only |
| **Headings** | **Outfit** | `font-serif` | Post titles, card titles, prose headings. Geometric and readable. *Not a serif* — alias kept for legacy markup |
| **Body** | **Inter** | `font-sans` | Long-form copy, UI chrome |
| **Mono / Data** | **Space Mono** | `font-mono` | Tags, dates, technical specs, hero kicker, code |

### Hierarchy

- **Display hero:** Audiowide, fluid ~`11vw` / locked ~`8.5rem` on large screens, `leading-[0.95]`, tight tracking. First name in ink; surname in `text-primary`.
- **Display large (footer Connect):** Audiowide `text-6xl` → `md:text-8xl`.
- **Display small (logo):** Audiowide `text-lg`, tracking-tight.
- **Headlines:** Outfit bold for H1–H3 in posts and cards. Prefer readable sizes over display shouting.
- **Body:** Inter 16px / comfortable leading. Prose headings inherit Outfit via content styles; body stays Inter.
- **Labels:** Space Mono, often wide-tracked (`tracking-[0.2em]`) and uppercase-feel for kickers (“SYSTEMS ENGINEER / DEVELOPER”). Dates and tags stay small mono chips.
- **Chrome text:** `.text-chrome` — gold→coral gradient fill for rare display accents, not body copy.

### Rules

- Long-form text (post titles, card titles, paragraphs) stays Outfit/Inter. **Never set paragraphs in Audiowide.**
- Reserve Audiowide for marks you could put on a neon sign.
- Do not reintroduce mono `FIG x.x //` technical-label systems — the page is intentionally clean.

## Layout

**Fixed-max-width fluid grid.** Content lives in `.container`: horizontal padding `2rem` (`container-x`), centered, capping at **1280px** from the `xl` breakpoint up.

- **Breakpoints:** 640 / 768 / 1024 / 1280 / 1536px (Tailwind defaults).
- **Home bento:** 1 col → 2 col (md) → 12-col (lg) with `gap-4`, `auto-rows-[minmax(240px,auto)]`. Featured post spans 6 cols + 2 rows; neighbors span 3.
- **Vertical rhythm:** section dividers use generous `py-16`; page sections often `pb-24`; footer `pt-20` with deep bottom padding for the skyline.
- **Header:** sticky, `h-20`, full-bleed blur bar over content.
- **Spacing scale:** 4px base (Tailwind). Prefer `gap-4`, `p-6` on cards, `px-8` container — not arbitrary 13px values.
- **Internal routes:** trailing slashes (`/blog/`, `/about/`). Root stays `/`. No trailing slash on external URLs, `mailto:`, assets, or `/rss.xml`.

## Elevation & Depth

Hierarchy is **flat-border + tonal layer**, not Material-style shadow stacks.

- **Primary depth cue:** `border-2 border-border` on cards and major frames; hover shifts to `border-primary` and fills `bg-primary`.
- **Tonal layers:** `background` < `card` / `secondary` < interactive primary fill.
- **Motion lift:** bento cards use a light `-translate-y-1` on hover — a brochure lift, not a floating Material card.
- **Optional hard accent:** `.brutalist-shadow` (`4px 4px 0 primary`) exists for rare punchy CTAs; do not default every card to it.
- **Dark neon:** `.atomic-glow` — soft primary halo for Atomic Dusk focal pieces.
- **Ambient layers (always behind content):**
  1. Page `bg-background`
  2. [`Backdrop.astro`](src/components/Backdrop.astro) — fixed teal boomerang sweep + gold orbital arcs at ~7–16% opacity, `-z-10`
  3. `.noise-overlay` — fixed film grain at 4% opacity, `z-index: 9999`, pointer-events none
- **Footer depth:** full-height coral sunset glow + layered Googie skyline silhouettes (far / mid monorail / near buildings) using `--footer-landscape-*` and `--footer-sun`.
- **Tracing edge:** `.atomic-border-trace` on bento hover — gold→coral comet dash along the rounded rect (respects `prefers-reduced-motion`).

No heavy multi-level shadow system. If something needs to feel “on top,” raise border contrast or use the primary fill invert — don’t stack drop shadows.

## Shapes

Two shape dialects — pick by meaning:

| Dialect | Radius | Use |
| --- | --- | --- |
| **The Grid (soft-square)** | `rounded-2xl` (16px) on cards; global `--radius: 0.75rem` (12px) for shadcn controls | Layout containers, bento cards, content panels |
| **The Human / Interactive (pill)** | `rounded-full` | Buttons, tags, date chips, avatars, icon buttons, dark-mode toggle |

- Global radius token: **12px** (`lg`), with `md` = 10px, `sm` = 8px derived from `--radius`.
- Boomerang geometry appears in **dividers and backdrop paths**, not as a corner radius on boxes.
- Starburst is radial spikes (SVG), not a rounded square logo mark.

## Components

### Buttons ([`src/components/ui/button.tsx`](src/components/ui/button.tsx))

- **Always pill** (`rounded-full`).
- Variants: `default` (primary fill), `secondary`, `outline`, `ghost`, `link`, `destructive`.
- Sizes: `default` h-10, `sm` h-9, `lg` h-11 px-8, `icon` 40×40.
- Focus: `ring-2 ring-ring` (chrome gold) with offset on the background.
- One primary filled button per obvious action cluster; prefer outline/ghost for secondary.

### Bento card ([`src/components/BentoCard.astro`](src/components/BentoCard.astro))

- Soft-square, `border-2`, `p-6`, full-height flex column.
- Hover: invert to primary fill + primary-foreground type, slight lift, gold→coral tracing border, optional dim hero image wash.
- Featured: large low-opacity gold starburst watermark, bottom-right.
- Date chip: mono, pill, hairline border.
- Title: Outfit (`font-serif`), shifts slightly on hover.

### Atomic starburst ([`src/components/Starburst.astro`](src/components/Starburst.astro))

- Signature mark: 16 thin spikes alternating long/short, small core, optional electron tip dots.
- Inherits `currentColor` — color with `text-gold` / `text-accent` / `text-primary`.
- Placements: hero (large, `text-gold/15`, `animate-spin-slow`), header logo / mobile fan trigger, footer sky accents, featured cards.
- CSS-only cousin: `.atomic-starburst` utility for square non-SVG spots.
- **Do not** replace with chunky sputnik balls or generic star emoji.

### Header ([`src/components/Header.astro`](src/components/Header.astro))

- Sticky blur bar, `border-b-2 border-primary/20`, `bg-background/80`.
- Desktop: Audiowide wordmark + text nav + dark mode toggle.
- Mobile: starburst opens a **Sputnik Fan** — nav links as rays in the down-right quadrant with drawn connector lines.
- Focus on fan trigger: `ring-gold`.

### Footer ([`src/components/Footer.astro`](src/components/Footer.astro))

- `bg-secondary`, top border primary/20, large Audiowide “Connect,” socials, copyright.
- Googie skyline SVG band (Theme-Building arch energy, Space Needle, domes, monorail, banded coral sun).
- Small ambient starbursts in the “sky.”

### Section divider ([`src/components/SectionDivider.astro`](src/components/SectionDivider.astro))

- `.boomerang-divider`: turquoise→gold→coral gradient rule with a rotated gold corner curve at center. Use between major home sections — not under every heading.

### Backdrop & noise

- Include **once** per page body: `.noise-overlay` then `<Backdrop />`, before header/main.
- Never raise backdrop opacity enough to compete with type.

### Tags / chips / dates

- Pill geometry, mono type, quiet borders. Active tag links use `text-primary` + semibold.
- Icons: `react-icons` (Fa6).

### Inputs (shadcn)

- Follow token contract: `border-input`, `ring-ring` on focus, radius from global `--radius` (soft-square, not pill — inputs are fields, not actions).

### Prose (blog)

- Foreground ink; headings bold Outfit-colored as foreground.
- Links: primary underline; hover primary/80; visited primary/60.
- Inline code: accent text on muted chip, small radius.
- Blockquote: italic, primary left rule.

## Do's and Don'ts

**Do**

- Spend ornament on the starburst, boomerang divider, gold rules, and footer skyline — then keep surrounding UI quiet.
- Use shadcn/Tailwind semantic tokens (`bg-card`, `text-muted-foreground`, `border-border`, `text-gold`).
- Keep buttons and chips fully pill; keep cards and layout frames soft-square with `border-2`.
- Prefer Outfit/Inter for anything longer than a few words; Audiowide only for signage-scale marks.
- Support both Daytime Atomic and Atomic Dusk; check coral/gold ornaments in both.
- Respect `prefers-reduced-motion` for spin and border-trace animations.
- Use trailing slashes on internal page routes.

**Don't**

- Don’t rename shadcn tokens or hard-code hex in components.
- Don’t set body copy or long titles in Audiowide.
- Don’t reintroduce mono `FIG x.x //` annotation chrome.
- Don’t default to heavy drop shadows or glassmorphism stacks — borders and tonal fills carry hierarchy.
- Don’t flood the page with coral and gold; one signature focal point per viewport.
- Don’t drift into synthwave (hot magenta/cyan neon grids) or sterile gray SaaS.
- Don’t mix sharp 0-radius blocks with pills in the same control cluster without intent.
- Don’t add trailing slashes to external URLs, `mailto:`, asset paths, or `/rss.xml`.
