# Cyber Blue Grid Redesign Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Restyle the entire William Kocak Astro site into the approved dark, 2Advanced-inspired "Cyber Blue Grid" aesthetic — without changing any content, routes, or page structure.

**Architecture:** Centralize the look in `src/styles/global.css` — new color/font `@theme` tokens, a fixed page-wide HUD grid background, and a small set of reusable component classes (`.frost-text`, `.mono-eyebrow`, `.hud-chip`, `.hud-btn`, `.frost-well`, `.hud-corner`) plus keyframes and a `prefers-reduced-motion` guard. Components and pages then consume those classes, so each file stays small and the theme is DRY. Motion is "Moderate": staggered hero entrance, drifting grid, scanline sweep, pulsing status dot, gentle wordmark bloom, and one-shot scroll-reveal via a tiny inline `IntersectionObserver`.

**Tech Stack:** Astro 6 (static), Tailwind CSS v4 (`@tailwindcss/vite`, `@theme`), Vitest, Google Fonts (Chakra Petch + Inter).

**Verification note:** This is a visual redesign; correctness is verified by `npm run build` (clean, all routes generate), the existing `npm test` (unit), a leftover-token grep, and a manual dev-server pass. The one genuinely unit-testable change (the project index formatter) is done test-first in Task 2.

**Branching:** This touches ~18 files. Recommend doing it on a branch (`redesign/cyber-blue`) rather than directly on `master`. The working tree currently has one unrelated uncommitted edit (`docs/projects/InfoSysOfNC-story.md`, the "Eagles" wording) — leave it untouched; no task in this plan modifies it.

---

## File structure

| File | Responsibility after this plan |
|---|---|
| `src/styles/global.css` | Theme tokens, base body + fixed HUD background, reusable HUD classes, keyframes, reduced-motion guard |
| `src/lib/projects.ts` | Adds `padIndex(order)` formatter (existing `sortByOrder` unchanged) |
| `src/lib/projects.test.ts` | Adds `padIndex` tests |
| `src/layouts/BaseLayout.astro` | Dark shell, font links, sticky dark header, skip link, scroll-reveal script |
| `src/components/Nav.astro` | `WK//SYS` mono logo + mono uppercase links, cyan active/hover |
| `src/components/Footer.astro` | Dark mono "status line" + top cyan glow rule |
| `src/components/SocialLinks.astro` | Cyan hover links |
| `src/components/Hero.astro` | Full HUD hero: grid + scanline + corner brackets + frosted wordmark + entrance |
| `src/components/SectionHeading.astro` | Mono `//` eyebrow + frosted title + cyan rule |
| `src/components/ProjectCard.astro` | HUD Dossier card (corner brackets, `NN //` index, chips) |
| `src/components/Prose.astro` | Dark long-form typography |
| `src/components/TimelineItem.astro` | HUD timeline row (cyan node, mono period, `▸` bullets) |
| `src/pages/index.astro` | Hero + HUD "Explore" grid |
| `src/pages/projects/index.astro` | Passes `index` into cards |
| `src/pages/projects/[...slug].astro` | HUD header + frosted-well story |
| `src/pages/about.astro` | Long bio in a frosted well |
| `src/pages/career.astro` | (unchanged markup; inherits themed TimelineItem) |
| `src/pages/personal.astro` | Frosted-well intro + dark hobby cards |
| `src/pages/contact.astro` | HUD button + body text |
| `src/pages/404.astro` | On-theme "Signal Lost" page |

No changes to `astro.config.mjs`, `src/content.config.ts`, content files, or `package.json`.

---

## Phase 0 — Foundation

### Task 1: Theme tokens, base, reusable HUD classes, motion

**Files:**
- Modify (replace entire file): `src/styles/global.css`

- [ ] **Step 1: Replace `src/styles/global.css` with the full theme**

```css
@import "tailwindcss";

@theme {
  /* surfaces */
  --color-bg: #03070d;
  --color-bg-panel: #05101b;
  --color-bg-raised: #06121f;

  /* text */
  --color-fg: #eaf6ff;
  --color-body: #c7d6e4;
  --color-muted: #7f9fb6;

  /* accent (cyan) */
  --color-accent: #22d3ee;
  --color-accent-bright: #67e8f9;
  --color-accent-sky: #38bdf8;
  --color-accent-ice: #7dd3fc;

  /* lines */
  --color-border: rgba(56, 189, 248, 0.18);
  --color-border-strong: rgba(56, 189, 248, 0.40);

  --font-sans: "Inter", system-ui, -apple-system, "Segoe UI", Roboto, sans-serif;
  --font-display: "Chakra Petch", system-ui, sans-serif;
  --font-mono: ui-monospace, Menlo, Consolas, monospace;
}

html { scroll-behavior: smooth; }

body {
  background-color: var(--color-bg);
  color: var(--color-body);
  font-family: var(--font-sans);
  -webkit-font-smoothing: antialiased;
  position: relative;
}

/* fixed page-wide HUD background: faint technical grid + radial wash */
body::before {
  content: "";
  position: fixed;
  inset: 0;
  z-index: -1;
  pointer-events: none;
  background:
    repeating-linear-gradient(0deg, transparent 0 26px, rgba(56, 189, 248, 0.035) 26px 27px),
    repeating-linear-gradient(90deg, transparent 0 26px, rgba(56, 189, 248, 0.035) 26px 27px),
    radial-gradient(130% 100% at 80% -10%, #0b1f30 0%, #05101b 55%, #03070d 100%);
  animation: hud-drift 16s linear infinite;
}

::selection { background: rgba(34, 211, 238, 0.30); color: #eaf6ff; }
::-webkit-scrollbar { width: 12px; height: 12px; }
::-webkit-scrollbar-track { background: #05101b; }
::-webkit-scrollbar-thumb { background: #123243; border-radius: 6px; border: 3px solid #05101b; }
::-webkit-scrollbar-thumb:hover { background: #1c4a63; }
:focus-visible { outline: 2px solid var(--color-accent); outline-offset: 2px; border-radius: 2px; }

/* ---------------- HUD building blocks ---------------- */
.frost-text {
  background: linear-gradient(180deg, #ffffff 0%, #cfeefe 55%, #7dd3fc 100%);
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
  filter: drop-shadow(0 0 24px rgba(186, 230, 253, 0.5)) drop-shadow(0 0 50px rgba(56, 189, 248, 0.25));
}

.mono-eyebrow {
  font-family: var(--font-mono);
  font-size: 0.72rem;
  font-weight: 600;
  letter-spacing: 0.28em;
  text-transform: uppercase;
  color: var(--color-accent);
}

.hud-chip {
  display: inline-block;
  font-family: var(--font-mono);
  font-size: 0.65rem;
  font-weight: 600;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: var(--color-accent-ice);
  border: 1px solid var(--color-border-strong);
  border-radius: 3px;
  padding: 0.28rem 0.55rem;
}

.hud-btn {
  display: inline-block;
  font-family: var(--font-mono);
  font-size: 0.7rem;
  font-weight: 700;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  padding: 0.75rem 1.25rem;
  border-radius: 4px;
  transition: box-shadow 0.2s ease, background-color 0.2s ease, color 0.2s ease;
}
.hud-btn-solid { background: var(--color-accent); color: #04121a; box-shadow: 0 0 20px rgba(34, 211, 238, 0.5); }
.hud-btn-solid:hover { background: var(--color-accent-bright); box-shadow: 0 0 28px rgba(34, 211, 238, 0.7); }
.hud-btn-ghost { border: 1px solid var(--color-border-strong); color: var(--color-accent-ice); }
.hud-btn-ghost:hover { background: rgba(34, 211, 238, 0.1); }

.frost-well {
  position: relative;
  overflow: hidden;
  background: rgba(140, 190, 225, 0.08);
  backdrop-filter: blur(8px);
  border: 1px solid rgba(160, 210, 240, 0.16);
  border-radius: 12px;
  padding: 1.75rem 1.9rem;
}
.frost-well::before {
  content: "";
  position: absolute;
  top: 0; left: 0; right: 0;
  height: 1px;
  background: linear-gradient(90deg, transparent, var(--color-accent-ice), transparent);
}

/* corner brackets: add .hud-corner + position + which borders inline */
.hud-corner { position: absolute; width: 14px; height: 14px; border-color: var(--color-accent); }

/* ---------------- Motion ---------------- */
@keyframes hud-drift { to { background-position: 27px 27px, 27px 27px, 0 0; } }
@keyframes hud-sweep { 0% { top: -140px; } 100% { top: 100%; } }
@keyframes hud-pulse { 0%, 100% { opacity: 1; transform: scale(1); } 50% { opacity: 0.35; transform: scale(0.7); } }
@keyframes hud-bloom {
  0%, 100% { filter: drop-shadow(0 0 24px rgba(186, 230, 253, 0.5)) drop-shadow(0 0 50px rgba(56, 189, 248, 0.25)); }
  50%      { filter: drop-shadow(0 0 30px rgba(186, 230, 253, 0.75)) drop-shadow(0 0 66px rgba(56, 189, 248, 0.4)); }
}
@keyframes hud-rise { from { opacity: 0; transform: translateY(14px); } to { opacity: 1; transform: translateY(0); } }

.rise { opacity: 0; animation: hud-rise 0.6s ease forwards; }

.reveal { opacity: 0; transform: translateY(16px); transition: opacity 0.6s ease, transform 0.6s ease; }
.reveal.is-visible { opacity: 1; transform: none; }

@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after { animation: none !important; transition-duration: 0.001ms !important; }
  .rise { opacity: 1 !important; }
  .reveal { opacity: 1 !important; transform: none !important; }
  .frost-text { filter: drop-shadow(0 0 18px rgba(186, 230, 253, 0.4)); }
}
```

- [ ] **Step 2: Build to confirm CSS compiles**

Run: `npm run build`
Expected: Completes with no errors (pages still render with old markup colors; that's fine — later tasks update markup). If it fails, the CSS is malformed — fix before continuing.

- [ ] **Step 3: Commit**

```bash
git add src/styles/global.css
git commit -m "Add Cyber Blue Grid theme tokens and HUD utilities"
```

---

### Task 2: `padIndex` formatter (TDD)

**Files:**
- Modify: `src/lib/projects.ts`
- Modify: `src/lib/projects.test.ts`

- [ ] **Step 1: Add the failing test**

Append to `src/lib/projects.test.ts` (and add `padIndex` to the import on line 2 so it reads `import { sortByOrder, padIndex, type HasProjectMeta } from './projects';`):

```ts
describe('padIndex', () => {
  it('zero-pads single digits and leaves two-digit numbers', () => {
    expect(padIndex(8)).toBe('08');
    expect(padIndex(10)).toBe('10');
    expect(padIndex(1)).toBe('01');
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm test`
Expected: FAIL — `padIndex is not a function` (or import error).

- [ ] **Step 3: Implement `padIndex`**

Append to `src/lib/projects.ts`:

```ts
/** Two-digit, zero-padded display index, e.g. 8 -> "08". */
export function padIndex(order: number): string {
  return String(order).padStart(2, '0');
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npm test`
Expected: PASS (both `sortByOrder` and `padIndex` suites green).

- [ ] **Step 5: Commit**

```bash
git add src/lib/projects.ts src/lib/projects.test.ts
git commit -m "Add padIndex formatter for project card indices"
```

---

## Phase 1 — Layout chrome

### Task 3: BaseLayout (fonts, dark shell, skip link, reveal script)

**Files:**
- Modify (replace entire file): `src/layouts/BaseLayout.astro`

- [ ] **Step 1: Replace `src/layouts/BaseLayout.astro`**

```astro
---
import '../styles/global.css';
import { site } from '../config/site';
import Nav from '../components/Nav.astro';
import Footer from '../components/Footer.astro';

interface Props {
  title?: string;
  description?: string;
}

const { title, description } = Astro.props;
const pageTitle = title ? `${title} — ${site.name}` : site.title;
const pageDescription = description ?? site.tagline;
const canonical = new URL(Astro.url.pathname, Astro.site).href;
---

<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
    <link rel="icon" href="/favicon.ico" />
    <link rel="canonical" href={canonical} />
    <meta name="generator" content={Astro.generator} />
    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
    <link
      href="https://fonts.googleapis.com/css2?family=Chakra+Petch:wght@300;400;500&family=Inter:wght@400;500;600&display=swap"
      rel="stylesheet"
    />
    <title>{pageTitle}</title>
    <meta name="description" content={pageDescription} />
    <meta property="og:type" content="website" />
    <meta property="og:title" content={pageTitle} />
    <meta property="og:description" content={pageDescription} />
    <meta property="og:url" content={canonical} />
    <meta name="twitter:card" content="summary" />
  </head>
  <body class="min-h-screen flex flex-col">
    <a
      href="#main"
      class="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[60] focus:rounded focus:bg-[var(--color-accent)] focus:px-4 focus:py-2 focus:text-sm focus:font-semibold focus:text-[#04121a]"
      >Skip to content</a
    >
    <header class="sticky top-0 z-50 border-b border-[var(--color-border)] bg-[#03070d]/80 backdrop-blur">
      <Nav />
    </header>
    <main id="main" class="flex-1">
      <slot />
    </main>
    <Footer />
    <script is:inline>
      (() => {
        const els = document.querySelectorAll('.reveal');
        const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        if (reduce || !('IntersectionObserver' in window)) {
          els.forEach((el) => el.classList.add('is-visible'));
          return;
        }
        const io = new IntersectionObserver(
          (entries) => {
            entries.forEach((e) => {
              if (e.isIntersecting) {
                e.target.classList.add('is-visible');
                io.unobserve(e.target);
              }
            });
          },
          { rootMargin: '0px 0px -10% 0px' }
        );
        els.forEach((el) => io.observe(el));
      })();
    </script>
  </body>
</html>
```

- [ ] **Step 2: Build**

Run: `npm run build`
Expected: Clean build, 17 pages.

- [ ] **Step 3: Commit**

```bash
git add src/layouts/BaseLayout.astro
git commit -m "Theme BaseLayout: dark shell, fonts, skip link, scroll-reveal"
```

---

### Task 4: Nav

**Files:**
- Modify (replace entire file): `src/components/Nav.astro`

- [ ] **Step 1: Replace `src/components/Nav.astro`**

```astro
---
import { site } from '../config/site';

const path = Astro.url.pathname;
// Trailing-slash-insensitive match; project detail pages keep "Projects" active.
const normalize = (p: string) => (p.length > 1 ? p.replace(/\/$/, '') : p);
const current = normalize(path);
const isActive = (href: string) =>
  href === '/' ? current === '/' : current === href || current.startsWith(href + '/');
---

<nav class="mx-auto flex max-w-5xl items-center justify-between px-4 py-3">
  <a href="/" class="font-mono text-sm font-bold tracking-widest text-[var(--color-fg)]">
    <span class="text-[var(--color-accent)]">WK</span>//SYS
  </a>

  {/* sr-only (not `hidden`) keeps the checkbox in the tab order so the menu is
      keyboard-operable; the label shows a focus ring when the checkbox is focused. */}
  <input type="checkbox" id="nav-toggle" class="peer sr-only" />
  <label
    for="nav-toggle"
    class="cursor-pointer rounded font-mono text-xs uppercase tracking-widest text-[var(--color-accent)] peer-focus-visible:outline peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-[var(--color-accent)] sm:hidden"
    aria-label="Toggle navigation">Menu</label
  >

  <ul
    class="absolute left-0 right-0 top-full hidden flex-col gap-1 border-b border-[var(--color-border)] bg-[var(--color-bg-panel)] px-4 py-3 font-mono text-xs uppercase tracking-widest peer-checked:flex sm:static sm:flex sm:flex-row sm:gap-6 sm:border-0 sm:bg-transparent sm:p-0"
  >
    {
      site.nav.map((l) => (
        <li>
          <a
            class:list={[
              'block py-1 transition-colors hover:text-[var(--color-accent)]',
              isActive(l.href) ? 'text-[var(--color-accent)]' : 'text-[var(--color-muted)]',
            ]}
            aria-current={isActive(l.href) ? 'page' : undefined}
            href={l.href}
          >
            {l.label}
          </a>
        </li>
      ))
    }
  </ul>
</nav>
```

- [ ] **Step 2: Build**

Run: `npm run build`
Expected: Clean build.

- [ ] **Step 3: Commit**

```bash
git add src/components/Nav.astro
git commit -m "Theme Nav: WK//SYS mono logo and cyan links"
```

---

### Task 5: Footer + SocialLinks

**Files:**
- Modify (replace entire file): `src/components/Footer.astro`
- Modify (replace entire file): `src/components/SocialLinks.astro`

- [ ] **Step 1: Replace `src/components/SocialLinks.astro`**

```astro
---
import { site } from '../config/site';

interface Props {
  class?: string;
}
const { class: className } = Astro.props;
---

<ul class:list={['flex gap-4 text-sm', className]}>
  {
    site.socials.map((s) => (
      <li>
        <a
          class="text-[var(--color-muted)] transition-colors hover:text-[var(--color-accent)]"
          href={s.href}
          target="_blank"
          rel="noopener noreferrer"
        >
          {s.label}
        </a>
      </li>
    ))
  }
  <li>
    <a
      class="text-[var(--color-muted)] transition-colors hover:text-[var(--color-accent)]"
      href={`mailto:${site.email}`}
    >
      Email
    </a>
  </li>
</ul>
```

- [ ] **Step 2: Replace `src/components/Footer.astro`**

```astro
---
import { site } from '../config/site';
import SocialLinks from './SocialLinks.astro';

const year = new Date().getFullYear();
---

<footer class="relative mt-24 border-t border-[var(--color-border)]">
  <div class="absolute left-0 right-0 top-0 h-px bg-gradient-to-r from-transparent via-[var(--color-accent)] to-transparent"></div>
  <div class="mx-auto flex max-w-5xl flex-col items-center gap-4 px-4 py-10 font-mono text-xs uppercase tracking-widest text-[var(--color-muted)] sm:flex-row sm:justify-between">
    <p>© {year} {site.name} · <span class="text-[var(--color-accent)]">System Online</span> · Charlotte, NC</p>
    <SocialLinks />
  </div>
</footer>
```

- [ ] **Step 3: Build**

Run: `npm run build`
Expected: Clean build.

- [ ] **Step 4: Commit**

```bash
git add src/components/Footer.astro src/components/SocialLinks.astro
git commit -m "Theme Footer status line and SocialLinks"
```

---

## Phase 2 — Home

### Task 6: Hero

**Files:**
- Modify (replace entire file): `src/components/Hero.astro`

- [ ] **Step 1: Replace `src/components/Hero.astro`**

```astro
---
import { site } from '../config/site';
import SocialLinks from './SocialLinks.astro';
---

<section class="hero relative overflow-hidden">
  <div class="hero-grid" aria-hidden="true"></div>
  <div class="hero-scan" aria-hidden="true"></div>
  <span class="hud-corner" style="top:18px;left:18px;border-left-width:2px;border-top-width:2px" aria-hidden="true"></span>
  <span class="hud-corner" style="top:18px;right:18px;border-right-width:2px;border-top-width:2px" aria-hidden="true"></span>

  <div class="relative mx-auto max-w-5xl px-4 py-24 sm:py-32">
    <p class="rise font-mono text-xs tracking-[0.18em] text-[var(--color-accent-sky)]" style="animation-delay:.1s">
      <span class="status-dot" aria-hidden="true"></span>{site.kicker}
    </p>
    <h1 class="hero-name frost-text mt-5 font-display text-5xl font-light uppercase leading-none tracking-wide sm:text-7xl">
      {site.name}
    </h1>
    <p class="rise mt-6 max-w-2xl text-lg text-[var(--color-body)] sm:text-xl" style="animation-delay:.5s">
      {site.tagline}
    </p>
    <div class="rise mt-8 flex flex-wrap items-center gap-3" style="animation-delay:.65s">
      <a href="/projects" class="hud-btn hud-btn-solid">View Projects<span aria-hidden="true"> ▸</span></a>
      <a href="/contact" class="hud-btn hud-btn-ghost">Get in Touch</a>
    </div>
    <div class="rise mt-8" style="animation-delay:.8s">
      <SocialLinks />
    </div>
  </div>
</section>

<style>
  .hero { background: radial-gradient(120% 90% at 80% 0%, #0b3a5c 0%, #06121f 55%, #03070d 100%); }
  .hero-grid {
    position: absolute;
    inset: -40px;
    pointer-events: none;
    background:
      repeating-linear-gradient(0deg, transparent 0 26px, rgba(56, 189, 248, 0.09) 26px 27px),
      repeating-linear-gradient(90deg, transparent 0 26px, rgba(56, 189, 248, 0.09) 26px 27px);
    animation: hud-drift 14s linear infinite;
  }
  .hero-scan {
    position: absolute;
    top: -140px; /* start off-screen unconditionally (also keeps it hidden under reduced-motion) */
    left: 0;
    right: 0;
    height: 140px;
    pointer-events: none;
    background: linear-gradient(180deg, transparent, rgba(56, 189, 248, 0.1), transparent);
    animation: hud-sweep 6s ease-in-out infinite;
  }
  .status-dot {
    display: inline-block;
    width: 7px;
    height: 7px;
    border-radius: 50%;
    background: var(--color-accent);
    margin-right: 8px;
    box-shadow: 0 0 10px var(--color-accent);
    animation: hud-pulse 1.8s ease-in-out infinite;
  }
  .hero-name {
    opacity: 0;
    width: max-content;
    max-width: 100%;
    animation: hud-rise 0.7s ease 0.3s forwards, hud-bloom 6s ease-in-out 1.4s infinite;
  }
  @media (prefers-reduced-motion: reduce) {
    .hero-name { opacity: 1 !important; }
  }
</style>
```

- [ ] **Step 2: Build**

Run: `npm run build`
Expected: Clean build.

- [ ] **Step 3: Commit**

```bash
git add src/components/Hero.astro
git commit -m "Theme Hero: HUD grid, scanline, frosted animated wordmark"
```

---

### Task 7: SectionHeading

**Files:**
- Modify (replace entire file): `src/components/SectionHeading.astro`

- [ ] **Step 1: Replace `src/components/SectionHeading.astro`**

```astro
---
interface Props {
  id: string;
  eyebrow?: string;
  title: string;
  /** Heading tag for the title — 'h1' on standalone pages, 'h2' for sections beneath a hero. */
  tag?: 'h1' | 'h2';
}
const { id, eyebrow, title, tag = 'h2' } = Astro.props;
const headingClass = 'frost-text mt-2 font-display text-3xl font-medium tracking-tight';
---

<div class="mb-8 reveal" id={id}>
  {eyebrow && <p class="mono-eyebrow">// {eyebrow}</p>}
  {
    tag === 'h1' ? (
      <h1 class={headingClass}>{title}</h1>
    ) : (
      <h2 class={headingClass}>{title}</h2>
    )
  }
  <div class="mt-4 h-px w-24 bg-gradient-to-r from-[var(--color-accent)] to-transparent"></div>
</div>
```

- [ ] **Step 2: Build**

Run: `npm run build`
Expected: Clean build.

- [ ] **Step 3: Commit**

```bash
git add src/components/SectionHeading.astro
git commit -m "Theme SectionHeading: mono eyebrow, frosted title, cyan rule"
```

---

### Task 8: Home page (Explore grid)

**Files:**
- Modify (replace entire file): `src/pages/index.astro`

- [ ] **Step 1: Replace `src/pages/index.astro`**

```astro
---
import BaseLayout from '../layouts/BaseLayout.astro';
import Hero from '../components/Hero.astro';
import SectionHeading from '../components/SectionHeading.astro';
import { site } from '../config/site';
---

<BaseLayout>
  <Hero />

  <div class="mx-auto max-w-5xl px-4 py-20">
    <SectionHeading id="explore" eyebrow="Explore" title="Find your way around" />
    <div class="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
      {
        site.nav.map((item) => (
          <a
            href={item.href}
            class="reveal group rounded-xl border border-[var(--color-border)] bg-[rgba(5,18,30,0.55)] p-6 transition duration-200 hover:-translate-y-1 hover:border-[var(--color-accent)] hover:shadow-[0_0_24px_rgba(34,211,238,0.18)]"
          >
            <div class="flex items-center justify-between">
              <h3 class="font-display text-lg font-medium text-[var(--color-fg)]">{item.label}</h3>
              <span class="text-[var(--color-accent)] transition-transform group-hover:translate-x-1" aria-hidden="true">&rarr;</span>
            </div>
            <p class="mt-2 text-sm text-[var(--color-muted)]">{item.blurb}</p>
          </a>
        ))
      }
    </div>
  </div>
</BaseLayout>
```

- [ ] **Step 2: Build**

Run: `npm run build`
Expected: Clean build.

- [ ] **Step 3: Commit**

```bash
git add src/pages/index.astro
git commit -m "Theme home Explore grid as dark HUD tiles"
```

---

## Phase 3 — Projects

### Task 9: ProjectCard (HUD Dossier)

**Files:**
- Modify (replace entire file): `src/components/ProjectCard.astro`

- [ ] **Step 1: Replace `src/components/ProjectCard.astro`**

```astro
---
interface Props {
  href: string;
  index: string;
  title: string;
  summary: string;
  tech: string[];
  timeframe: string;
}
const { href, index, title, summary, tech, timeframe } = Astro.props;
---

<a href={href} class="hud-card reveal group relative block rounded-lg p-5">
  <span class="hud-corner" style="top:6px;left:6px;border-left-width:2px;border-top-width:2px" aria-hidden="true"></span>
  <span class="hud-corner" style="bottom:6px;right:6px;border-right-width:2px;border-bottom-width:2px" aria-hidden="true"></span>

  <div class="flex items-baseline justify-between gap-3">
    <span class="font-mono text-xs tracking-widest text-[var(--color-accent)]">{index}<span aria-hidden="true"> //</span></span>
    <span class="font-mono text-[11px] tracking-wider text-[var(--color-muted)] whitespace-nowrap">{timeframe}</span>
  </div>

  <h2 class="frost-text mt-2 font-display text-lg font-normal leading-tight">{title}</h2>
  <p class="mt-2 text-sm leading-relaxed text-[var(--color-body)]">{summary}</p>

  <ul class="mt-4 flex flex-wrap gap-2">
    {tech.map((t) => <li class="hud-chip">{t}</li>)}
  </ul>
</a>

<style>
  .hud-card {
    background: rgba(5, 18, 30, 0.6);
    border: 1px solid var(--color-border);
    transition: border-color 0.2s ease, box-shadow 0.2s ease, transform 0.2s ease;
  }
  .hud-card:hover {
    border-color: var(--color-accent);
    box-shadow: 0 0 24px rgba(34, 211, 238, 0.18);
    transform: translateY(-2px);
  }
</style>
```

- [ ] **Step 2: Build**

Run: `npm run build`
Expected: Build fails OR cards render without an index, because `src/pages/projects/index.astro` does not yet pass `index`. This is expected; Task 10 fixes it. (Astro will not error on a missing optional-looking prop, but the index will be blank — proceed to Task 10 before judging visually.)

- [ ] **Step 3: Commit**

```bash
git add src/components/ProjectCard.astro
git commit -m "Restyle ProjectCard as HUD Dossier"
```

---

### Task 10: Projects index page

**Files:**
- Modify (replace entire file): `src/pages/projects/index.astro`

- [ ] **Step 1: Replace `src/pages/projects/index.astro`**

```astro
---
import { getCollection } from 'astro:content';
import BaseLayout from '../../layouts/BaseLayout.astro';
import SectionHeading from '../../components/SectionHeading.astro';
import ProjectCard from '../../components/ProjectCard.astro';
import { sortByOrder, padIndex } from '../../lib/projects';

const projects = sortByOrder(await getCollection('projects'));
---

<BaseLayout title="Projects" description="Selected software projects and case studies.">
  <div class="mx-auto max-w-5xl px-4 py-20">
    <SectionHeading id="projects" eyebrow="Projects" title="Selected work" tag="h1" />

    {
      projects.length === 0 ? (
        <p class="text-[var(--color-muted)]">Projects coming soon.</p>
      ) : (
        <div class="grid gap-5 sm:grid-cols-2">
          {projects.map((p) => (
            <ProjectCard
              href={`/projects/${p.id}`}
              index={padIndex(p.data.order)}
              title={p.data.title}
              summary={p.data.summary}
              tech={p.data.tech}
              timeframe={p.data.timeframe}
            />
          ))}
        </div>
      )
    }
  </div>
</BaseLayout>
```

- [ ] **Step 2: Build**

Run: `npm run build`
Expected: Clean build; the projects index page generates with cards showing indices like `01 //`, `08 //`.

- [ ] **Step 3: Commit**

```bash
git add src/pages/projects/index.astro
git commit -m "Pass padded order index into HUD Dossier cards"
```

---

### Task 11: Prose (dark long-form)

**Files:**
- Modify (replace entire file): `src/components/Prose.astro`

- [ ] **Step 1: Replace `src/components/Prose.astro`**

```astro
---
// Styles rendered Markdown for the dark theme. Usage: <Prose><Content /></Prose>
---

<div
  class="max-w-none space-y-4 leading-relaxed text-[var(--color-body)]
         [&_h2]:font-display [&_h2]:text-2xl [&_h2]:font-medium [&_h2]:text-[var(--color-fg)] [&_h2]:mt-10 [&_h2]:mb-2
         [&_h3]:font-display [&_h3]:text-xl [&_h3]:font-medium [&_h3]:text-[var(--color-fg)] [&_h3]:mt-8
         [&_p]:text-[var(--color-body)]
         [&_strong]:text-[var(--color-fg)] [&_strong]:font-semibold
         [&_em]:text-[var(--color-muted)]
         [&_ul]:list-disc [&_ul]:pl-6 [&_ul]:space-y-1 [&_ul]:marker:text-[var(--color-accent)]
         [&_ol]:list-decimal [&_ol]:pl-6 [&_ol]:space-y-1 [&_ol]:marker:text-[var(--color-accent)]
         [&_a]:text-[var(--color-accent)] [&_a]:underline [&_a:hover]:text-[var(--color-accent-bright)]
         [&_blockquote]:border-l-2 [&_blockquote]:border-[var(--color-accent)] [&_blockquote]:pl-4 [&_blockquote]:text-[var(--color-muted)] [&_blockquote]:italic
         [&_hr]:my-8 [&_hr]:border-0 [&_hr]:h-px [&_hr]:bg-gradient-to-r [&_hr]:from-[var(--color-accent)] [&_hr]:to-transparent
         [&_code]:rounded [&_code]:bg-[var(--color-bg-raised)] [&_code]:px-1.5 [&_code]:py-0.5 [&_code]:text-sm [&_code]:text-[var(--color-accent-ice)] [&_code]:font-mono"
>
  <slot />
</div>
```

- [ ] **Step 2: Build**

Run: `npm run build`
Expected: Clean build.

- [ ] **Step 3: Commit**

```bash
git add src/components/Prose.astro
git commit -m "Restyle Prose for dark long-form reading"
```

---

### Task 12: Project detail page

**Files:**
- Modify (replace entire file): `src/pages/projects/[...slug].astro`

- [ ] **Step 1: Replace `src/pages/projects/[...slug].astro`**

```astro
---
import { getCollection, render } from 'astro:content';
import type { GetStaticPaths } from 'astro';
import BaseLayout from '../../layouts/BaseLayout.astro';
import Prose from '../../components/Prose.astro';

export const getStaticPaths = (async () => {
  const projects = await getCollection('projects');
  return projects.map((project) => ({
    params: { slug: project.id },
    props: { project },
  }));
}) satisfies GetStaticPaths;

const { project } = Astro.props;
const { Content } = await render(project);
const { title, summary, tech, role, timeframe, repo, demo } = project.data;
---

<BaseLayout title={title} description={summary}>
  <article class="mx-auto max-w-3xl px-4 py-20">
    <a href="/projects" class="mono-eyebrow transition-colors hover:text-[var(--color-accent-bright)]">← All Projects</a>

    <h1 class="frost-text mt-5 font-display text-4xl font-light tracking-tight">{title}</h1>
    <p class="mt-3 text-lg text-[var(--color-muted)]">{summary}</p>

    <dl class="mt-6 grid grid-cols-2 gap-4 border-y border-[var(--color-border)] py-4 font-mono text-sm sm:grid-cols-3">
      <div>
        <dt class="text-[10px] uppercase tracking-widest text-[var(--color-accent)]">Role</dt>
        <dd class="mt-1 text-[var(--color-body)]">{role}</dd>
      </div>
      <div>
        <dt class="text-[10px] uppercase tracking-widest text-[var(--color-accent)]">When</dt>
        <dd class="mt-1 text-[var(--color-body)]">{timeframe}</dd>
      </div>
      <div class="col-span-2 sm:col-span-1">
        <dt class="text-[10px] uppercase tracking-widest text-[var(--color-accent)]">Links</dt>
        <dd class="mt-1 flex gap-3 text-[var(--color-body)]">
          {repo && <a class="text-[var(--color-accent)] hover:underline" href={repo} target="_blank" rel="noopener noreferrer">Repo</a>}
          {demo && <a class="text-[var(--color-accent)] hover:underline" href={demo} target="_blank" rel="noopener noreferrer">Demo</a>}
          {!repo && !demo && <span class="text-[var(--color-muted)]">—</span>}
        </dd>
      </div>
    </dl>

    <ul class="mt-4 flex flex-wrap gap-2">
      {tech.map((t) => <li class="hud-chip">{t}</li>)}
    </ul>

    <div class="frost-well mt-10">
      <Prose><Content /></Prose>
    </div>
  </article>
</BaseLayout>
```

- [ ] **Step 2: Build**

Run: `npm run build`
Expected: Clean build; project detail pages generate.

- [ ] **Step 3: Commit**

```bash
git add "src/pages/projects/[...slug].astro"
git commit -m "Theme project detail: HUD header and frosted-well story"
```

---

## Phase 4 — Remaining pages

### Task 13: About page

**Files:**
- Modify (replace entire file): `src/pages/about.astro`

- [ ] **Step 1: Replace `src/pages/about.astro`**

```astro
---
import BaseLayout from '../layouts/BaseLayout.astro';
import SectionHeading from '../components/SectionHeading.astro';
import { site } from '../config/site';
---

<BaseLayout title="About" description="Who I am and what I do.">
  <div class="mx-auto max-w-5xl px-4 py-20">
    <SectionHeading id="about" eyebrow="About" title="Who I am" tag="h1" />
    <div class="frost-well reveal max-w-2xl space-y-4 text-lg leading-relaxed text-[var(--color-body)]">
      {site.longBio.map((p) => <p>{p}</p>)}
    </div>
  </div>
</BaseLayout>
```

- [ ] **Step 2: Build**

Run: `npm run build`
Expected: Clean build.

- [ ] **Step 3: Commit**

```bash
git add src/pages/about.astro
git commit -m "Theme About: long bio in a frosted well"
```

---

### Task 14: Career timeline (TimelineItem)

**Files:**
- Modify (replace entire file): `src/components/TimelineItem.astro`

Note: `src/pages/career.astro` markup is unchanged — it inherits the themed `SectionHeading` and `TimelineItem`. Do not modify `career.astro`.

- [ ] **Step 1: Replace `src/components/TimelineItem.astro`**

```astro
---
import type { TimelineEntry } from '../config/site';

interface Props {
  entry: TimelineEntry;
}
const { entry } = Astro.props;
---

<article class="reveal relative border-l border-[var(--color-border)] pl-6 pb-8 last:pb-0">
  <span
    class="absolute -left-[7px] top-1.5 h-3 w-3 rounded-full bg-[var(--color-accent)]"
    style="box-shadow:0 0 10px var(--color-accent)"></span>
  <p class="font-mono text-xs uppercase tracking-widest text-[var(--color-accent-sky)]">{entry.period}</p>
  <h2 class="mt-1 font-display text-lg font-medium text-[var(--color-fg)]">
    {entry.role} · <span class="text-[var(--color-accent)]">{entry.company}</span>
  </h2>
  <p class="mt-1 text-[var(--color-body)]">{entry.summary}</p>
  <ul class="mt-3 space-y-1 text-sm text-[var(--color-muted)]" role="list">
    {
      entry.highlights.map((h) => (
        <li class="relative pl-5">
          <span class="absolute left-0 text-[var(--color-accent)]" aria-hidden="true">▸</span>
          {h}
        </li>
      ))
    }
  </ul>
</article>
```

- [ ] **Step 2: Build**

Run: `npm run build`
Expected: Clean build; career page renders.

- [ ] **Step 3: Commit**

```bash
git add src/components/TimelineItem.astro
git commit -m "Theme TimelineItem as HUD dossier rows"
```

---

### Task 15: Personal page

**Files:**
- Modify (replace entire file): `src/pages/personal.astro`

- [ ] **Step 1: Replace `src/pages/personal.astro`**

```astro
---
import BaseLayout from '../layouts/BaseLayout.astro';
import SectionHeading from '../components/SectionHeading.astro';
import { site } from '../config/site';
---

<BaseLayout title="Personal" description="Beyond the keyboard.">
  <div class="mx-auto max-w-5xl px-4 py-20">
    <SectionHeading id="personal" eyebrow="Personal" title="Beyond the keyboard" tag="h1" />
    <div class="frost-well reveal max-w-2xl">
      <p class="text-lg leading-relaxed text-[var(--color-body)]">{site.family}</p>
    </div>
    <div class="mt-8 grid gap-4 sm:grid-cols-3">
      {
        site.hobbies.map((h) => (
          <div class="reveal rounded-lg border border-[var(--color-border)] bg-[rgba(5,18,30,0.6)] p-5 transition-colors hover:border-[var(--color-accent)]">
            <h2 class="font-display font-medium text-[var(--color-fg)]">{h.title}</h2>
            <p class="mt-1 text-sm text-[var(--color-muted)]">{h.blurb}</p>
          </div>
        ))
      }
    </div>
  </div>
</BaseLayout>
```

- [ ] **Step 2: Build**

Run: `npm run build`
Expected: Clean build.

- [ ] **Step 3: Commit**

```bash
git add src/pages/personal.astro
git commit -m "Theme Personal: frosted-well intro and dark hobby cards"
```

---

### Task 16: Contact page

**Files:**
- Modify (replace entire file): `src/pages/contact.astro`

- [ ] **Step 1: Replace `src/pages/contact.astro`**

```astro
---
import BaseLayout from '../layouts/BaseLayout.astro';
import SectionHeading from '../components/SectionHeading.astro';
import SocialLinks from '../components/SocialLinks.astro';
import { site } from '../config/site';
---

<BaseLayout title="Contact" description="Get in touch.">
  <div class="mx-auto max-w-5xl px-4 py-20">
    <SectionHeading id="contact" eyebrow="Contact" title="Let's talk" tag="h1" />
    <p class="max-w-2xl text-lg text-[var(--color-body)]">
      The fastest way to reach me is email. I'm open to interesting software roles and conversations.
    </p>
    <div class="mt-6 flex flex-wrap items-center gap-4">
      <a href={`mailto:${site.email}`} class="hud-btn hud-btn-solid">{site.email}</a>
      <SocialLinks />
    </div>
  </div>
</BaseLayout>
```

- [ ] **Step 2: Build**

Run: `npm run build`
Expected: Clean build.

- [ ] **Step 3: Commit**

```bash
git add src/pages/contact.astro
git commit -m "Theme Contact: HUD email button"
```

---

### Task 17: 404 page

**Files:**
- Modify (replace entire file): `src/pages/404.astro`

- [ ] **Step 1: Replace `src/pages/404.astro`**

```astro
---
import BaseLayout from '../layouts/BaseLayout.astro';
---

<BaseLayout title="Not found">
  <section class="mx-auto max-w-5xl px-4 py-32 text-center">
    <p class="mono-eyebrow">// Signal Lost</p>
    <p class="frost-text mt-4 font-display text-7xl font-light">404</p>
    <h1 class="mt-4 font-display text-2xl font-medium text-[var(--color-fg)]">This channel went dark.</h1>
    <p class="mt-2 text-[var(--color-muted)]">The link may be broken or the page moved.</p>
    <a href="/" class="hud-btn hud-btn-solid mt-8"><span aria-hidden="true">▸ </span>Return Home</a>
  </section>
</BaseLayout>
```

- [ ] **Step 2: Build**

Run: `npm run build`
Expected: Clean build.

- [ ] **Step 3: Commit**

```bash
git add src/pages/404.astro
git commit -m "Theme 404 as Signal Lost page"
```

---

## Phase 5 — Verification

### Task 18: Leftover-token sweep, build, test, manual check

**Files:** none (verification only)

- [ ] **Step 1: Grep for leftover light-theme references**

Run: `git grep -n "brand-\|bg-white\|text-white\|text-brand" -- src`
Expected: **No matches.** If any appear, open that file and replace with the cyber-blue equivalent (`text-[var(--color-accent)]`, `text-[var(--color-fg)]`, `hud-btn`, etc.), then rebuild and commit.

- [ ] **Step 2: Full build**

Run: `npm run build`
Expected: "Complete!" with 17 pages built, including `/`, `/about/`, `/career/`, `/contact/`, `/personal/`, `/projects/`, all `/projects/<slug>/`, and `/404`.

- [ ] **Step 3: Unit tests**

Run: `npm test`
Expected: PASS (`sortByOrder` + `padIndex`).

- [ ] **Step 4: Manual dev pass**

Run: `npm run dev` (then open the printed `http://localhost:4321/`).
Check each route renders on the dark theme; specifically confirm:
- Home hero animates (grid drift, scanline, pulsing dot, name entrance + bloom).
- Project cards show `NN //` indices, corner brackets, cyan chips, hover glow.
- A project story page reads comfortably inside the frosted well.
- Career timeline shows cyan nodes + `▸` bullets.
- Mobile nav (narrow the window): "Menu" toggles the dark dropdown.
- Keyboard Tab shows the cyan skip link and focus rings.
- With OS "reduce motion" enabled, looping animations stop and all content is visible (nothing stuck at opacity 0).

Stop the dev server when done.

- [ ] **Step 5: Final no-op commit guard**

If Step 1 required any fix-ups, ensure they're committed. Otherwise nothing to do — the redesign is complete across Tasks 1–17.

---

## Self-review (completed by plan author)

- **Spec coverage:** Every spec section maps to a task — tokens/fonts/background (Task 1), motion + reduced-motion (Task 1 + per-component), BaseLayout/Nav/Footer/SocialLinks (Tasks 3–5), Hero/SectionHeading/home (Tasks 6–8), ProjectCard HUD Dossier + index plumbing (Tasks 2, 9, 10), Prose + project detail frosted well (Tasks 11–12), About/Career/Personal/Contact/404 (Tasks 13–17), accessibility + verification sweep (Task 18). Multi-page constraint honored (no page merged; routes unchanged).
- **Placeholder scan:** No TBD/TODO; every code step contains full file content.
- **Type consistency:** `padIndex(order: number): string` defined in Task 2, imported and used in Task 10; `ProjectCard` `index` prop added in Task 9 and supplied in Task 10; reusable class names (`frost-text`, `mono-eyebrow`, `hud-chip`, `hud-btn`/`-solid`/`-ghost`, `frost-well`, `hud-corner`, `rise`, `reveal`) all defined in Task 1 and referenced consistently thereafter.
