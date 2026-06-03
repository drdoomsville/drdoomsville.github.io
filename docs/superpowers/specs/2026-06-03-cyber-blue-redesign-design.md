# Cyber Blue Grid — Full-Site UI Redesign

**Date:** 2026-06-03
**Status:** Approved design (pending spec review)
**Scope:** Visual redesign only. No content, route, or architecture changes.

## Goal

Transform the William Kocak portfolio from its current light/indigo professional
theme into an aggressive dark, futuristic aesthetic inspired by 2Advanced Studios —
near-black backgrounds, electric-cyan accents, a technical HUD grid, monospace
labeling, and frosted glowing typography. It must stay credible for a senior AI
engineering leader: immersive but readable, performant, and accessible.

## Hard constraints (non-goals)

- **Multi-page, not a one-pager.** The site keeps its existing separate pages and
  routes (Home, About, Career, Projects index, Project detail, Personal, Contact,
  404). We are NOT merging sections into a single long scrolling page.
- **No copy changes.** Same text/content throughout. Visual treatment only.
- **No nav restructure.** Same nav items and information architecture.
- **Keep it building.** Astro static build, the `projects` content collection, and
  the existing vitest (`sortByOrder`) must all keep passing.
- Favicon redesign is out of scope (optional follow-up).

## Locked design decisions (validated interactively via visual companion)

| Decision | Choice |
|---|---|
| Aesthetic direction | **Cyber Blue Grid** — near-black + electric cyan, technical grid, HUD corner brackets, mono labels |
| Wordmark / display type | **Frosted Tech** — Chakra Petch Light, icy white→cyan gradient fill, soft diffuse bloom |
| Project cards | **HUD Dossier** — bordered dark panels, corner brackets, `NN //` index, mono timeframe, outlined cyan tech chips |
| Motion | **Moderate** — staggered entrance, drifting grid, scanline sweep, pulsing status dot, gentle wordmark bloom |
| Interior long-form reading | **Frosted Glass Well** — prose floats in a translucent blurred panel with a soft cyan glow line |

## Visual language

### Color tokens

Replace the indigo `brand-*` palette in `src/styles/global.css` (`@theme`) with a
cyber-blue system. All components currently using `brand-*` utilities get rewritten.

```
/* surfaces */
--color-bg:        #03070d;   /* page base (near-black) */
--color-bg-panel:  #05101b;   /* solid dark panel */
--color-bg-raised: #06121f;   /* raised/hover panel */

/* text */
--color-fg:        #eaf6ff;   /* primary headings text */
--color-body:      #c7d6e4;   /* long-form body copy (AA on bg-panel) */
--color-muted:     #7f9fb6;   /* secondary / meta */

/* accent (cyan) */
--color-accent:        #22d3ee;   /* primary cyan */
--color-accent-bright: #67e8f9;
--color-accent-sky:    #38bdf8;   /* deeper sky-blue for eyebrows */
--color-accent-ice:    #7dd3fc;   /* frost highlight */

/* lines */
--color-border:      rgba(56,189,248,0.18);
--color-border-strong: rgba(56,189,248,0.40);
```

Frost gradient (wordmark + display headings):
`linear-gradient(180deg,#ffffff 0%,#cfeefe 55%,#7dd3fc 100%)` clipped to text, with
`drop-shadow` bloom `0 0 24px rgba(186,230,253,.5), 0 0 50px rgba(56,189,248,.25)`.

### Typography

- **Display / headings / wordmark:** `Chakra Petch` (300 for the wordmark & large
  display; 400/500 for section headings).
- **Body / long-form:** `Inter` (400/500) — chosen over `system-ui` for consistent,
  comfortable reading at 15px/1.7.
- **Mono labels / eyebrows / meta / buttons:** system `ui-monospace` stack
  (Menlo, Consolas) — zero network cost, deliberately technical.
- Load Chakra Petch + Inter via a single Google Fonts `<link>` with `preconnect` and
  `display=swap`. Define `--font-display`, `--font-sans`, `--font-mono` tokens.
- Eyebrows are mono, uppercase, cyan, wide-tracked, `//`-prefixed (e.g. `// ABOUT`).

### Background & HUD chrome

- **Global background** (in `BaseLayout`): a fixed, behind-content layer combining a
  radial dark gradient with a faint 26px technical grid. Grid is more visible on the
  home hero (animated drift); dimmed near-zero on interior pages so frosted wells read
  cleanly.
- **Reusable HUD building blocks** (utility classes / small partials):
  - corner brackets (hero, cards),
  - scanline sweep (hero),
  - pulsing "online" status dot (header/hero),
  - frosted-glass well (interior prose container),
  - outlined cyan chip (tech tags).

### Motion — "Moderate" level + accessibility

- **Entrance:** staggered rise/fade for hero elements on load; scroll-reveal
  (one-shot `IntersectionObserver`) fading + rising sections and cards into view.
- **Looping:** grid drift (~14s), hero scanline sweep (~5.5s), status-dot pulse,
  gentle wordmark bloom. Animate only `transform`/`opacity`/`filter`/`background-position`.
- **Hover:** cards brighten border + glow; buttons glow; links go cyan with an
  underline glow.
- **`prefers-reduced-motion: reduce`:** globally disable all looping animations and
  entrance transforms — render the final state immediately. Implemented as a single
  `@media` guard in `global.css`.
- **Performance:** no heavy JS; one tiny inline `IntersectionObserver` for reveals.
  Two web-font families max, preconnected.

### Accessibility

- Body text colors meet WCAG AA on their panels (verify `--color-body` on
  `--color-bg-panel`).
- `:focus-visible` cyan ring on all interactive elements.
- Skip-to-content link in `BaseLayout`.
- Themed selection + scrollbar colors.
- All decorative HUD elements `aria-hidden` / non-focusable.

## Component-by-component treatment

- **`BaseLayout.astro`** — dark `<body>`; font `<link>`s + preconnect; fixed
  background grid + radial gradient layer; sticky header (dark translucent, blur,
  bottom cyan border-glow); skip link; focus-visible, selection, scrollbar theming;
  reduced-motion guard.
- **`Nav.astro`** — logo as `WK//SYS` (mono) + name; nav links mono uppercase,
  muted → cyan on hover, active link cyan with glow underline + `aria-current`; mobile
  menu as a dark panel.
- **`Hero.astro`** — full HUD per approved mockup: corner brackets, topbar status line
  with pulsing dot, mono `//` kicker, frosted Chakra Petch wordmark, tagline, two HUD
  buttons (solid cyan glow + ghost), social links; drifting grid + scanline + staggered
  entrance.
- **`SectionHeading.astro`** — mono cyan `//` eyebrow, frosted display title, thin cyan
  rule.
- **`ProjectCard.astro` → HUD Dossier** — bordered dark panel + corner brackets;
  `NN //` index (2-digit, from the project's `order`) + mono timeframe; frosted title;
  slate summary; outlined cyan tech chips; hover glow. *Requires passing `order` into
  the card from the projects index (currently not passed).*
- **`pages/projects/index.astro`** — section heading + intro line + responsive grid of
  HUD Dossier cards.
- **`pages/projects/[...slug].astro`** — header block (eyebrow, frosted title, meta row
  `role · timeframe`, tech chips, back link) above a **Frosted Glass Well** holding the
  story `<Prose>`.
- **`Prose.astro`** — restyle typographic defaults for dark (light body, cyan headings
  & links, blockquote with cyan rail, `hr` as cyan gradient, inline/code styling) and
  wrap long-form content in the frosted-glass well.
- **`pages/about.astro`, `personal.astro`, `contact.astro`** — dark; prose in frosted
  wells; section headings themed; contact links/buttons as HUD elements.
- **`pages/career.astro` + `TimelineItem.astro`** — timeline restyled as HUD dossier
  rows: cyan node markers, mono periods, frosted company/role, highlights as `▸` cyan
  bullets.
- **`Footer.astro`** — dark mono "status line" (e.g.
  `© 2026 WILLIAM KOCAK · SYSTEM ONLINE · CHARLOTTE, NC`), social links, top cyan
  border-glow.
- **`SocialLinks.astro`** — cyan labels/icons with hover glow.
- **`pages/404.astro`** — on-theme `SIGNAL LOST` HUD page.

## Files touched

`src/styles/global.css`; `src/layouts/BaseLayout.astro`; components `Nav`, `Footer`,
`Hero`, `SectionHeading`, `ProjectCard`, `Prose`, `TimelineItem`, `SocialLinks`; pages
`index`, `projects/index`, `projects/[...slug]`, `about`, `career`, `personal`,
`contact`, `404`. New (likely): `BackgroundGrid.astro` (or inline in layout) + a small
reveal script/util. No changes to `astro.config.mjs`, `content.config.ts`, or content.

## Verification

- `npm run build` clean; all routes generate.
- `npm test` (vitest `sortByOrder`) passes.
- Manual on dev server: every page renders; body copy legible (AA); reduced-motion
  honored; mobile nav works; keyboard focus visible; no layout breakage at sm/md/lg.

## Risks & mitigations

- **Readability on dark** → use AA-verified text colors; frosted wells for long-form.
- **Web-font perf** → preconnect + `swap`; cap at two families; system mono for labels.
- **Motion overload / vestibular** → Moderate level + global reduced-motion guard.
- **Tailwind v4 token migration** → remove/replace every `brand-*` utility reference as
  each component is rewritten; verify with a repo grep before completion.
