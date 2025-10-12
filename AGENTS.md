# AGENTS.md

This file contains information about the website project to help AI agents work with the codebase.

## Project Overview

Personal website/blog built with Astro, React, and Tailwind CSS.
- **Site URL**: https://brian-kimball.com
- **Framework**: Astro 5.13.5
- **UI Library**: React 19
- **Styling**: Tailwind CSS 4.1.12 with @tailwindcss/typography
- **Content**: MDX-based blog posts

## Tech Stack

- **Astro** with integrations: MDX, Sitemap, React
- **React 19** with TypeScript
- **Tailwind CSS 4** (Vite plugin)
- **shadcn/ui** components (Radix UI)
- **ESLint 8** (linting with Astro, React, TypeScript plugins)
- **Prettier** (code formatting, configured for Astro)

## Project Structure

```
/home/bskimball/apps/website/
├── src/
│   ├── components/    # React and Astro components
│   ├── content/       # Content collections (blog, tags)
│   ├── layouts/       # Astro layouts
│   ├── lib/           # Utility functions
│   ├── pages/         # Astro pages (file-based routing)
│   ├── styles/        # Global styles
│   └── consts.ts      # Constants
├── public/            # Static assets
└── dist/              # Build output
```

## Frequently Used Commands

### Development
```bash
npm run dev        # Start dev server
npm run start      # Alias for dev
```

### Build & Preview
```bash
npm run build      # Type check + build (runs astro check && astro build)
npm run preview    # Preview production build
```

### Linting & Formatting
```bash
npm run lint       # Check for linting errors
npm run lint:fix   # Auto-fix linting errors
npm run format     # Format code with Prettier
```

### Type Checking
The build command includes `astro check` for type checking. Always run this before deploying.

## Code Style & Conventions

### Formatting
- **Prettier** configured with:
  - No semicolons (`semi: false`)
  - Single quotes (`singleQuote: true`)
  - Astro plugin enabled

### TypeScript
- Path alias: `@/*` maps to `./src/*`
- Strict null checks enabled
- React JSX mode with React 19

### Component Style
- React components use TypeScript
- shadcn/ui components configured via `components.json`
- Tailwind for styling with CVA (class-variance-authority)

## Content Management

- **Blog posts**: `/src/content/blog/` (MDX format)
- **Tags**: `/src/content/tags/`
- Content schema defined in `/src/content/config.ts`

## Build Configuration

- Site URL: `https://brian-kimball.com`
- Trailing slashes: Never
- Prefetch: All pages
- Vite plugin: Tailwind CSS

## Notes for Agents

1. When adding new components, follow existing patterns in `/src/components/`
2. Use the `@/` path alias for imports from `src/`
3. Always run `npm run build` to verify type checking before committing
4. Blog posts go in `/src/content/blog/` as MDX files
5. Use Prettier formatting rules (no semicolons, single quotes)
6. React components should use TypeScript with proper typing
7. Tailwind classes should be used for styling (v4 syntax)
