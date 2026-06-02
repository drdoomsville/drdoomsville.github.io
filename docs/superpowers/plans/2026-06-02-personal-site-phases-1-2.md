# Personal Site — Phases 1 & 2 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Ship a deployable, recruiter-facing single-page landing for a software engineer (Phase 1) plus a Markdown-driven projects section with index and detail pages (Phase 2).

**Architecture:** Static Astro 6 site styled with Tailwind CSS v4 (CSS-first `@theme` tokens via the `@tailwindcss/vite` plugin). Personal data lives in one typed module `src/config/site.ts`; project case studies live in an Astro Content Layer collection of Markdown files. Small single-purpose `.astro` components compose through a shared `BaseLayout`. Pure helper logic lives in `src/lib/` and is unit-tested with Vitest; `.astro` components are verified via `astro check` + `astro build`.

**Tech Stack:** Astro 6.4.3, Tailwind CSS v4, TypeScript, Vitest, `@astrojs/sitemap`. Deploy target: Cloudflare Pages (static `dist/`, no adapter needed).

---

## File Structure

**Created in this plan:**

| File | Responsibility |
|---|---|
| `src/styles/global.css` | Tailwind import + `@theme` design tokens + base element styles |
| `src/config/site.ts` | Single source of truth for all personal data (typed) |
| `src/lib/projects.ts` | Pure helpers: sort by order, filter featured |
| `src/lib/projects.test.ts` | Unit tests for the helpers |
| `src/layouts/BaseLayout.astro` | HTML shell, `<head>`/SEO, imports global CSS, Nav + Footer + slot |
| `src/components/Nav.astro` | Sticky top nav, anchor links, mobile menu |
| `src/components/Footer.astro` | Social links + copyright |
| `src/components/SocialLinks.astro` | Reusable row of social links |
| `src/components/Hero.astro` | Gradient hero block |
| `src/components/SectionHeading.astro` | Consistent section title + anchor id |
| `src/components/TimelineItem.astro` | One career timeline entry |
| `src/components/ProjectCard.astro` | Project summary card (landing + index) |
| `src/components/Prose.astro` | Typography wrapper for rendered Markdown |
| `src/content.config.ts` | `projects` collection schema (Content Layer) |
| `src/content/projects/*.md` | Placeholder project case studies |
| `src/pages/index.astro` | The landing page (replaces boilerplate) |
| `src/pages/404.astro` | Friendly not-found |
| `src/pages/projects/index.astro` | Projects listing |
| `src/pages/projects/[...slug].astro` | Project detail page |
| `vitest.config.ts` | Vitest config |
| `CONTENT-CHECKLIST.md` | What to fill in and where |

**Modified:**

| File | Change |
|---|---|
| `astro.config.mjs` | Add Tailwind Vite plugin, `site` URL, sitemap integration |
| `package.json` | Add deps + `test` script (done via npm, not hand-edited) |

---

## Phase 1 — MVP Landing

### Task 1: Tailwind v4 + design tokens

**Files:**
- Modify: `astro.config.mjs`
- Create: `src/styles/global.css`

- [ ] **Step 1: Install Tailwind v4**

Run:
```bash
npm install tailwindcss @tailwindcss/vite
```
Expected: packages added to `package.json` dependencies, no errors.

- [ ] **Step 2: Wire the Vite plugin and site URL into `astro.config.mjs`**

Replace the entire file contents with:
```js
// @ts-check
import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';

// https://astro.build/config
export default defineConfig({
  // TODO(content): replace with your real domain before deploy
  site: 'https://example.com',
  vite: {
    plugins: [tailwindcss()],
  },
});
```

- [ ] **Step 3: Create the global stylesheet with theme tokens**

Create `src/styles/global.css`:
```css
@import "tailwindcss";

@theme {
  --color-bg: #ffffff;
  --color-fg: #14161a;
  --color-muted: #5b616e;
  --color-border: #e6e8ec;

  --color-brand-50: #eef2ff;
  --color-brand-100: #e0e7ff;
  --color-brand-200: #c7d2fe;
  --color-brand-400: #818cf8;
  --color-brand-500: #6366f1;
  --color-brand-600: #4f46e5;
  --color-brand-700: #4338ca;
  --color-brand-900: #1e1b4b;

  --font-sans: system-ui, -apple-system, "Segoe UI", Roboto, sans-serif;
  --font-display: system-ui, -apple-system, "Segoe UI", Roboto, sans-serif;
}

html {
  scroll-behavior: smooth;
}

body {
  background-color: var(--color-bg);
  color: var(--color-fg);
  font-family: var(--font-sans);
  -webkit-font-smoothing: antialiased;
}
```

- [ ] **Step 4: Verify the build picks up Tailwind**

Run:
```bash
npm run build
```
Expected: `astro build` completes with "Complete!" and no Tailwind/Vite errors. (The page is still boilerplate; we only verify the toolchain compiles.)

- [ ] **Step 5: Commit**

```bash
git add astro.config.mjs src/styles/global.css package.json package-lock.json
git commit -m "Set up Tailwind v4 and design tokens"
```

---

### Task 2: Site config (single source of truth)

**Files:**
- Create: `src/config/site.ts`

- [ ] **Step 1: Create `src/config/site.ts` with typed placeholder data**

```ts
export interface SocialLink {
  label: string;
  href: string;
}

export interface TimelineEntry {
  company: string;
  role: string;
  period: string;
  summary: string;
  highlights: string[];
}

export interface Hobby {
  title: string;
  blurb: string;
}

export interface SiteConfig {
  name: string;
  /** Browser tab / SEO title suffix */
  title: string;
  tagline: string;
  /** One-paragraph hero/about intro */
  shortBio: string;
  /** Longer about-section paragraphs */
  longBio: string[];
  email: string;
  socials: SocialLink[];
  careerTimeline: TimelineEntry[];
  family: string;
  hobbies: Hobby[];
}

// TODO(content): replace every placeholder below with your real details.
// This file is the main thing you edit. See CONTENT-CHECKLIST.md.
export const site: SiteConfig = {
  name: 'Sonny K.',
  title: 'Sonny K. — Software Engineer',
  tagline: 'Software engineer building reliable backend systems and clean developer tools.',
  shortBio:
    'I build dependable services and the tooling that makes teams faster. I care about clear interfaces, good tests, and shipping things people actually use.',
  longBio: [
    "I'm a software engineer focused on backend systems, APIs, and developer experience. I like turning fuzzy problems into well-bounded, well-tested components.",
    "Recently I've worked on distributed services, internal platforms, and the kind of tooling that quietly saves everyone an hour a day.",
  ],
  email: 'you@example.com',
  socials: [
    { label: 'GitHub', href: 'https://github.com/your-handle' },
    { label: 'LinkedIn', href: 'https://www.linkedin.com/in/your-handle' },
  ],
  careerTimeline: [
    {
      company: 'Acme Corp',
      role: 'Senior Software Engineer',
      period: '2023 — Present',
      summary: 'Lead backend work on the payments platform.',
      highlights: [
        'Cut p99 checkout latency by 40% by redesigning the settlement pipeline.',
        'Mentored three engineers and owned the on-call playbook.',
      ],
    },
    {
      company: 'Startup Inc',
      role: 'Software Engineer',
      period: '2020 — 2023',
      summary: 'Built core services from zero to production.',
      highlights: [
        'Shipped the first public API, growing integrations to 50+ partners.',
        'Introduced CI and test coverage from scratch.',
      ],
    },
  ],
  family:
    'Outside of work I am a husband and dad. Family is the thing that keeps the rest in perspective.',
  hobbies: [
    { title: 'Trail running', blurb: 'Slowly working toward a first ultra.' },
    { title: 'Home lab', blurb: 'A rack of Raspberry Pis that mostly behave.' },
    { title: 'Cooking', blurb: 'Weekend ramen experiments, varying results.' },
  ],
};
```

- [ ] **Step 2: Type-check**

Run:
```bash
npx astro check
```
Expected: 0 errors (warnings about unused exports are fine).

- [ ] **Step 3: Commit**

```bash
git add src/config/site.ts
git commit -m "Add site config with placeholder content"
```

---

### Task 3: BaseLayout

**Files:**
- Create: `src/layouts/BaseLayout.astro`

(Depends on `Nav` and `Footer`, created in Task 4. To keep this task self-contained and buildable, create temporary inline placeholders here, then Task 4 swaps them for real components.)

- [ ] **Step 1: Create `src/layouts/BaseLayout.astro`**

```astro
---
import '../styles/global.css';
import { site } from '../config/site';

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
    <title>{pageTitle}</title>
    <meta name="description" content={pageDescription} />
    <meta property="og:type" content="website" />
    <meta property="og:title" content={pageTitle} />
    <meta property="og:description" content={pageDescription} />
    <meta property="og:url" content={canonical} />
    <meta name="twitter:card" content="summary" />
  </head>
  <body class="min-h-screen flex flex-col">
    <header class="sticky top-0 z-50 border-b border-[var(--color-border)] bg-white/80 backdrop-blur">
      <nav class="mx-auto max-w-5xl px-4 py-3 text-sm font-medium">{site.name}</nav>
    </header>
    <main class="flex-1">
      <slot />
    </main>
    <footer class="border-t border-[var(--color-border)] py-8 text-center text-sm text-[var(--color-muted)]">
      © {new Date().getFullYear()} {site.name}
    </footer>
  </body>
</html>
```

- [ ] **Step 2: Build to verify the layout compiles**

Run:
```bash
npm run build
```
Expected: build completes, no errors.

- [ ] **Step 3: Commit**

```bash
git add src/layouts/BaseLayout.astro
git commit -m "Add BaseLayout with SEO head and shell"
```

---

### Task 4: Nav, SocialLinks, and Footer components

**Files:**
- Create: `src/components/SocialLinks.astro`
- Create: `src/components/Nav.astro`
- Create: `src/components/Footer.astro`
- Modify: `src/layouts/BaseLayout.astro`

- [ ] **Step 1: Create `src/components/SocialLinks.astro`**

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
          class="text-[var(--color-muted)] hover:text-[var(--color-fg)] transition-colors"
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
      class="text-[var(--color-muted)] hover:text-[var(--color-fg)] transition-colors"
      href={`mailto:${site.email}`}
    >
      Email
    </a>
  </li>
</ul>
```

- [ ] **Step 2: Create `src/components/Nav.astro`**

```astro
---
import { site } from '../config/site';

const links = [
  { label: 'About', href: '/#about' },
  { label: 'Career', href: '/#career' },
  { label: 'Projects', href: '/projects' },
  { label: 'Personal', href: '/#personal' },
  { label: 'Contact', href: '/#contact' },
];
---

<nav class="mx-auto flex max-w-5xl items-center justify-between px-4 py-3">
  <a href="/" class="font-display text-base font-bold tracking-tight">{site.name}</a>

  <input type="checkbox" id="nav-toggle" class="peer hidden" />
  <label
    for="nav-toggle"
    class="cursor-pointer text-sm sm:hidden"
    aria-label="Toggle navigation">Menu</label
  >

  <ul
    class="absolute left-0 right-0 top-full hidden flex-col gap-1 border-b border-[var(--color-border)] bg-white px-4 py-3 text-sm font-medium peer-checked:flex sm:static sm:flex sm:flex-row sm:gap-6 sm:border-0 sm:bg-transparent sm:p-0"
  >
    {
      links.map((l) => (
        <li>
          <a class="block py-1 text-[var(--color-muted)] hover:text-[var(--color-fg)] transition-colors" href={l.href}>
            {l.label}
          </a>
        </li>
      ))
    }
  </ul>
</nav>
```

- [ ] **Step 3: Create `src/components/Footer.astro`**

```astro
---
import { site } from '../config/site';
import SocialLinks from './SocialLinks.astro';
---

<footer class="border-t border-[var(--color-border)] mt-24">
  <div class="mx-auto flex max-w-5xl flex-col items-center gap-4 px-4 py-10 text-sm text-[var(--color-muted)] sm:flex-row sm:justify-between">
    <p>© {new Date().getFullYear()} {site.name}</p>
    <SocialLinks />
  </div>
</footer>
```

- [ ] **Step 4: Swap the inline header/footer in `BaseLayout.astro` for the components**

In `src/layouts/BaseLayout.astro`, add to the frontmatter imports (below the existing `site` import):
```astro
import Nav from '../components/Nav.astro';
import Footer from '../components/Footer.astro';
```

Replace this block:
```astro
    <header class="sticky top-0 z-50 border-b border-[var(--color-border)] bg-white/80 backdrop-blur">
      <nav class="mx-auto max-w-5xl px-4 py-3 text-sm font-medium">{site.name}</nav>
    </header>
    <main class="flex-1">
      <slot />
    </main>
    <footer class="border-t border-[var(--color-border)] py-8 text-center text-sm text-[var(--color-muted)]">
      © {new Date().getFullYear()} {site.name}
    </footer>
```
with:
```astro
    <header class="sticky top-0 z-50 border-b border-[var(--color-border)] bg-white/80 backdrop-blur">
      <Nav />
    </header>
    <main class="flex-1">
      <slot />
    </main>
    <Footer />
```

- [ ] **Step 5: Build to verify**

Run:
```bash
npm run build
```
Expected: build completes, no errors.

- [ ] **Step 6: Commit**

```bash
git add src/components/Nav.astro src/components/Footer.astro src/components/SocialLinks.astro src/layouts/BaseLayout.astro
git commit -m "Add Nav, Footer, and SocialLinks components"
```

---

### Task 5: Hero and SectionHeading components

**Files:**
- Create: `src/components/Hero.astro`
- Create: `src/components/SectionHeading.astro`

- [ ] **Step 1: Create `src/components/Hero.astro`**

```astro
---
import { site } from '../config/site';
import SocialLinks from './SocialLinks.astro';
---

<section class="bg-gradient-to-br from-brand-900 via-brand-700 to-brand-500 text-white">
  <div class="mx-auto max-w-5xl px-4 py-24 sm:py-32">
    <p class="text-xs font-semibold uppercase tracking-[0.2em] text-brand-200">
      Software Engineer
    </p>
    <h1 class="mt-4 font-display text-4xl font-extrabold tracking-tight sm:text-6xl">
      {site.name}
    </h1>
    <p class="mt-5 max-w-2xl text-lg text-brand-100 sm:text-xl">
      {site.tagline}
    </p>
    <div class="mt-8 flex flex-wrap items-center gap-3">
      <a
        href="/projects"
        class="rounded-md bg-white px-5 py-2.5 text-sm font-semibold text-brand-700 hover:bg-brand-50 transition-colors"
      >
        View projects
      </a>
      <a
        href="#contact"
        class="rounded-md border border-white/30 px-5 py-2.5 text-sm font-semibold text-white hover:bg-white/10 transition-colors"
      >
        Get in touch
      </a>
    </div>
    <SocialLinks class="mt-8 [&_a]:text-brand-100 [&_a:hover]:text-white" />
  </div>
</section>
```

- [ ] **Step 2: Create `src/components/SectionHeading.astro`**

```astro
---
interface Props {
  id: string;
  eyebrow?: string;
  title: string;
}
const { id, eyebrow, title } = Astro.props;
---

<div class="mb-8" id={id}>
  {eyebrow && (
    <p class="text-xs font-semibold uppercase tracking-[0.2em] text-brand-600">{eyebrow}</p>
  )}
  <h2 class="mt-1 font-display text-3xl font-bold tracking-tight">{title}</h2>
</div>
```

- [ ] **Step 3: Build to verify (gradient utilities resolve from theme tokens)**

Run:
```bash
npm run build
```
Expected: build completes, no errors. (`from-brand-900` etc. resolve from the `--color-brand-*` tokens defined in Task 1.)

- [ ] **Step 4: Commit**

```bash
git add src/components/Hero.astro src/components/SectionHeading.astro
git commit -m "Add Hero and SectionHeading components"
```

---

### Task 6: TimelineItem component

**Files:**
- Create: `src/components/TimelineItem.astro`

- [ ] **Step 1: Create `src/components/TimelineItem.astro`**

```astro
---
import type { TimelineEntry } from '../config/site';

interface Props {
  entry: TimelineEntry;
}
const { entry } = Astro.props;
---

<article class="relative border-l border-[var(--color-border)] pl-6 pb-8 last:pb-0">
  <span class="absolute -left-1.5 top-1.5 h-3 w-3 rounded-full bg-brand-500"></span>
  <p class="text-sm text-[var(--color-muted)]">{entry.period}</p>
  <h3 class="mt-1 font-display text-lg font-semibold">
    {entry.role} · <span class="text-brand-700">{entry.company}</span>
  </h3>
  <p class="mt-1 text-[var(--color-fg)]">{entry.summary}</p>
  <ul class="mt-3 list-disc space-y-1 pl-5 text-sm text-[var(--color-muted)]">
    {entry.highlights.map((h) => <li>{h}</li>)}
  </ul>
</article>
```

- [ ] **Step 2: Build to verify**

Run:
```bash
npm run build
```
Expected: build completes, no errors.

- [ ] **Step 3: Commit**

```bash
git add src/components/TimelineItem.astro
git commit -m "Add TimelineItem component"
```

---

### Task 7: Assemble the landing page

**Files:**
- Modify (replace contents): `src/pages/index.astro`

- [ ] **Step 1: Replace `src/pages/index.astro` entirely**

```astro
---
import BaseLayout from '../layouts/BaseLayout.astro';
import Hero from '../components/Hero.astro';
import SectionHeading from '../components/SectionHeading.astro';
import TimelineItem from '../components/TimelineItem.astro';
import SocialLinks from '../components/SocialLinks.astro';
import { site } from '../config/site';
---

<BaseLayout>
  <Hero />

  <div class="mx-auto max-w-5xl px-4">
    <!-- About -->
    <section class="py-20">
      <SectionHeading id="about" eyebrow="About" title="Who I am" />
      <div class="max-w-2xl space-y-4 text-lg leading-relaxed text-[var(--color-fg)]">
        {site.longBio.map((p) => <p>{p}</p>)}
      </div>
    </section>

    <!-- Career -->
    <section class="py-20 border-t border-[var(--color-border)]">
      <SectionHeading id="career" eyebrow="Career" title="Where I've worked" />
      <div class="max-w-2xl">
        {site.careerTimeline.map((entry) => <TimelineItem entry={entry} />)}
      </div>
    </section>

    <!-- Personal -->
    <section class="py-20 border-t border-[var(--color-border)]">
      <SectionHeading id="personal" eyebrow="Personal" title="Beyond the keyboard" />
      <p class="max-w-2xl text-lg leading-relaxed text-[var(--color-fg)]">{site.family}</p>
      <div class="mt-8 grid gap-4 sm:grid-cols-3">
        {
          site.hobbies.map((h) => (
            <div class="rounded-lg border border-[var(--color-border)] p-5">
              <h3 class="font-display font-semibold">{h.title}</h3>
              <p class="mt-1 text-sm text-[var(--color-muted)]">{h.blurb}</p>
            </div>
          ))
        }
      </div>
    </section>

    <!-- Contact -->
    <section class="py-20 border-t border-[var(--color-border)]">
      <SectionHeading id="contact" eyebrow="Contact" title="Let's talk" />
      <p class="max-w-2xl text-lg text-[var(--color-fg)]">
        The fastest way to reach me is email. I'm open to interesting software roles and conversations.
      </p>
      <div class="mt-6 flex flex-wrap items-center gap-4">
        <a
          href={`mailto:${site.email}`}
          class="rounded-md bg-brand-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-brand-700 transition-colors"
        >
          {site.email}
        </a>
        <SocialLinks />
      </div>
    </section>
  </div>
</BaseLayout>
```

- [ ] **Step 2: Build and type-check**

Run:
```bash
npm run build && npx astro check
```
Expected: build completes; `astro check` reports 0 errors.

- [ ] **Step 3: Visual smoke test in the dev server**

Run:
```bash
npm run dev
```
Open http://localhost:4321 and confirm: gradient hero renders; About/Career/Personal/Contact sections appear in order; nav anchor links jump to sections; page is readable at a narrow (mobile) window width and the nav "Menu" toggle reveals links. Stop the server (Ctrl+C) when done.

- [ ] **Step 4: Commit**

```bash
git add src/pages/index.astro
git commit -m "Build the landing page from site config"
```

---

### Task 8: 404 page

**Files:**
- Create: `src/pages/404.astro`

- [ ] **Step 1: Create `src/pages/404.astro`**

```astro
---
import BaseLayout from '../layouts/BaseLayout.astro';
---

<BaseLayout title="Not found">
  <section class="mx-auto max-w-5xl px-4 py-32 text-center">
    <p class="font-display text-6xl font-extrabold text-brand-600">404</p>
    <h1 class="mt-4 font-display text-2xl font-bold">This page wandered off.</h1>
    <p class="mt-2 text-[var(--color-muted)]">The link may be broken or the page moved.</p>
    <a
      href="/"
      class="mt-8 inline-block rounded-md bg-brand-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-brand-700 transition-colors"
    >
      Back home
    </a>
  </section>
</BaseLayout>
```

- [ ] **Step 2: Build to verify**

Run:
```bash
npm run build
```
Expected: build completes; `dist/404.html` exists.

- [ ] **Step 3: Commit**

```bash
git add src/pages/404.astro
git commit -m "Add 404 page"
```

---

### Task 9: Sitemap + deploy config + CONTENT-CHECKLIST

**Files:**
- Modify: `astro.config.mjs`
- Create: `CONTENT-CHECKLIST.md`

- [ ] **Step 1: Install the sitemap integration**

Run:
```bash
npm install @astrojs/sitemap
```
Expected: package added, no errors.

- [ ] **Step 2: Register sitemap in `astro.config.mjs`**

Add the import below the existing imports:
```js
import sitemap from '@astrojs/sitemap';
```
Add `integrations: [sitemap()],` to the config object so it reads:
```js
export default defineConfig({
  // TODO(content): replace with your real domain before deploy
  site: 'https://example.com',
  integrations: [sitemap()],
  vite: {
    plugins: [tailwindcss()],
  },
});
```

- [ ] **Step 3: Create `CONTENT-CHECKLIST.md` at the repo root**

```markdown
# Content checklist

Fill these in to replace the placeholder content. Search the repo for `TODO(content)`
to find every spot that needs your real details.

## 1. Site config — `src/config/site.ts`
- [ ] `name`, `title`, `tagline`
- [ ] `shortBio`, `longBio` (about paragraphs)
- [ ] `email`
- [ ] `socials` (GitHub, LinkedIn URLs)
- [ ] `careerTimeline` (one entry per role: company, role, period, summary, highlights)
- [ ] `family` blurb
- [ ] `hobbies`

## 2. Domain — `astro.config.mjs`
- [ ] Set `site:` to your real domain (used for canonical URLs + sitemap)

## 3. Projects — `src/content/projects/`
- [ ] Replace the placeholder `.md` files with real case studies
- [ ] Set `featured: true` on the 2–3 you want on the landing page
- [ ] Adjust `order` to control sorting (lower = first)

## 4. Favicon — `public/`
- [ ] Replace `favicon.svg` / `favicon.ico` with your own

## Deploy to Cloudflare Pages
1. Push the repo to GitHub.
2. Cloudflare dashboard → Workers & Pages → Create → Pages → connect the repo.
3. Build command: `npm run build` · Output directory: `dist` · Framework preset: Astro.
4. After the first deploy, add your custom domain in the Pages project settings,
   then update `site:` in `astro.config.mjs` to match and redeploy.
```

- [ ] **Step 4: Build to verify sitemap generates**

Run:
```bash
npm run build
```
Expected: build completes; `dist/sitemap-index.xml` exists.

- [ ] **Step 5: Commit**

```bash
git add astro.config.mjs CONTENT-CHECKLIST.md package.json package-lock.json
git commit -m "Add sitemap, deploy config, and content checklist"
```

---

## Phase 2 — Projects

### Task 10: Vitest + project helpers (TDD)

**Files:**
- Create: `vitest.config.ts`
- Create: `src/lib/projects.ts`
- Create: `src/lib/projects.test.ts`

- [ ] **Step 1: Install Vitest**

Run:
```bash
npm install -D vitest
```
Expected: `vitest` added to devDependencies.

- [ ] **Step 2: Create `vitest.config.ts`**

```ts
import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    include: ['src/**/*.test.ts'],
  },
});
```

- [ ] **Step 3: Add a `test` script to `package.json`**

Run:
```bash
npm pkg set scripts.test="vitest run"
```
Expected: `package.json` now has `"test": "vitest run"`.

- [ ] **Step 4: Write the failing test** — create `src/lib/projects.test.ts`

```ts
import { describe, it, expect } from 'vitest';
import { sortByOrder, onlyFeatured, type HasProjectMeta } from './projects';

const make = (order: number, featured: boolean): HasProjectMeta => ({
  data: { order, featured },
});

describe('sortByOrder', () => {
  it('sorts ascending by order without mutating the input', () => {
    const input = [make(3, false), make(1, true), make(2, false)];
    const result = sortByOrder(input);
    expect(result.map((p) => p.data.order)).toEqual([1, 2, 3]);
    // original untouched
    expect(input.map((p) => p.data.order)).toEqual([3, 1, 2]);
  });
});

describe('onlyFeatured', () => {
  it('keeps only featured entries', () => {
    const input = [make(1, true), make(2, false), make(3, true)];
    const result = onlyFeatured(input);
    expect(result).toHaveLength(2);
    expect(result.every((p) => p.data.featured)).toBe(true);
  });
});
```

- [ ] **Step 5: Run the test to confirm it fails**

Run:
```bash
npm test
```
Expected: FAIL — `Cannot find module './projects'` (or "sortByOrder is not exported").

- [ ] **Step 6: Implement `src/lib/projects.ts`**

```ts
export interface ProjectMeta {
  order: number;
  featured: boolean;
}

export interface HasProjectMeta {
  data: ProjectMeta;
}

/** Returns a new array sorted ascending by `data.order` (lower first). */
export function sortByOrder<T extends HasProjectMeta>(items: T[]): T[] {
  return [...items].sort((a, b) => a.data.order - b.data.order);
}

/** Returns only the entries flagged `data.featured`. */
export function onlyFeatured<T extends HasProjectMeta>(items: T[]): T[] {
  return items.filter((i) => i.data.featured);
}
```

- [ ] **Step 7: Run the test to confirm it passes**

Run:
```bash
npm test
```
Expected: PASS — 2 passing tests.

- [ ] **Step 8: Commit**

```bash
git add vitest.config.ts src/lib/projects.ts src/lib/projects.test.ts package.json package-lock.json
git commit -m "Add project sort/filter helpers with tests"
```

---

### Task 11: Projects collection schema + placeholder content

**Files:**
- Create: `src/content.config.ts`
- Create: `src/content/projects/realtime-sync.md`
- Create: `src/content/projects/cli-toolkit.md`
- Create: `src/content/projects/payments-api.md`

- [ ] **Step 1: Create `src/content.config.ts`**

```ts
import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const projects = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/projects' }),
  schema: z.object({
    title: z.string(),
    summary: z.string(),
    tech: z.array(z.string()),
    role: z.string(),
    timeframe: z.string(),
    featured: z.boolean().default(false),
    order: z.number().default(99),
    repo: z.string().url().optional(),
    demo: z.string().url().optional(),
  }),
});

export const collections = { projects };
```

- [ ] **Step 2: Create `src/content/projects/realtime-sync.md`**

```markdown
---
title: Realtime Sync Engine
summary: A conflict-free sync layer that keeps clients consistent offline and online.
tech: ["TypeScript", "WebSockets", "CRDTs", "PostgreSQL"]
role: Lead engineer
timeframe: 2024
featured: true
order: 1
repo: https://github.com/your-handle/realtime-sync
---

## Problem

<!-- TODO(content): describe the real problem this solved. -->
Teams needed edits to merge cleanly across devices without a central lock.

## What I built

A CRDT-based sync engine with a thin WebSocket transport and a Postgres-backed
durable log. Clients apply changes optimistically and reconcile on reconnect.

## Outcome

Reduced sync conflicts to near zero and cut median sync latency to under 80ms.
```

- [ ] **Step 3: Create `src/content/projects/cli-toolkit.md`**

```markdown
---
title: Developer CLI Toolkit
summary: An internal CLI that automates project scaffolding, releases, and on-call tasks.
tech: ["Go", "Cobra", "GitHub Actions"]
role: Creator and maintainer
timeframe: 2023
featured: true
order: 2
repo: https://github.com/your-handle/cli-toolkit
---

## Problem

<!-- TODO(content): describe the real problem this solved. -->
Common engineering tasks were tribal knowledge spread across wikis and shell aliases.

## What I built

A single CLI with composable commands, shipped via Homebrew and CI, with built-in
docs and shell completions.

## Outcome

Cut new-project setup from a day to minutes and standardized releases across teams.
```

- [ ] **Step 4: Create `src/content/projects/payments-api.md`**

```markdown
---
title: Payments API
summary: A resilient payments service handling settlement, retries, and reconciliation.
tech: ["Java", "Kafka", "PostgreSQL"]
role: Backend engineer
timeframe: 2022
featured: false
order: 3
---

## Problem

<!-- TODO(content): describe the real problem this solved. -->
Payment settlement was slow and occasionally double-charged on retries.

## What I built

An idempotent settlement pipeline with an event log, exactly-once processing
guarantees, and automated reconciliation reports.

## Outcome

Eliminated double-charges and cut p99 settlement time by 40%.
```

- [ ] **Step 5: Sync content types and build**

Run:
```bash
npx astro sync && npm run build
```
Expected: `astro sync` generates collection types; build completes with no schema errors.

- [ ] **Step 6: Commit**

```bash
git add src/content.config.ts src/content/projects
git commit -m "Add projects collection schema and placeholder case studies"
```

---

### Task 12: ProjectCard component

**Files:**
- Create: `src/components/ProjectCard.astro`

- [ ] **Step 1: Create `src/components/ProjectCard.astro`**

```astro
---
interface Props {
  href: string;
  title: string;
  summary: string;
  tech: string[];
  timeframe: string;
}
const { href, title, summary, tech, timeframe } = Astro.props;
---

<a
  href={href}
  class="group block rounded-lg border border-[var(--color-border)] p-6 transition-colors hover:border-brand-400"
>
  <div class="flex items-baseline justify-between gap-4">
    <h3 class="font-display text-lg font-semibold group-hover:text-brand-700">{title}</h3>
    <span class="shrink-0 text-sm text-[var(--color-muted)]">{timeframe}</span>
  </div>
  <p class="mt-2 text-[var(--color-muted)]">{summary}</p>
  <ul class="mt-4 flex flex-wrap gap-2">
    {
      tech.map((t) => (
        <li class="rounded-full bg-brand-50 px-3 py-1 text-xs font-medium text-brand-700">{t}</li>
      ))
    }
  </ul>
</a>
```

- [ ] **Step 2: Build to verify**

Run:
```bash
npm run build
```
Expected: build completes, no errors.

- [ ] **Step 3: Commit**

```bash
git add src/components/ProjectCard.astro
git commit -m "Add ProjectCard component"
```

---

### Task 13: Projects index page

**Files:**
- Create: `src/pages/projects/index.astro`

- [ ] **Step 1: Create `src/pages/projects/index.astro`**

```astro
---
import { getCollection } from 'astro:content';
import BaseLayout from '../../layouts/BaseLayout.astro';
import SectionHeading from '../../components/SectionHeading.astro';
import ProjectCard from '../../components/ProjectCard.astro';
import { sortByOrder } from '../../lib/projects';

const projects = sortByOrder(await getCollection('projects'));
---

<BaseLayout title="Projects" description="Selected software projects and case studies.">
  <div class="mx-auto max-w-5xl px-4 py-20">
    <SectionHeading id="projects" eyebrow="Projects" title="Selected work" />

    {
      projects.length === 0 ? (
        <p class="text-[var(--color-muted)]">Projects coming soon.</p>
      ) : (
        <div class="grid gap-5 sm:grid-cols-2">
          {projects.map((p) => (
            <ProjectCard
              href={`/projects/${p.id}`}
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

- [ ] **Step 2: Build and verify the route**

Run:
```bash
npm run build
```
Expected: build completes; `dist/projects/index.html` exists and lists three cards.

- [ ] **Step 3: Commit**

```bash
git add src/pages/projects/index.astro
git commit -m "Add projects index page"
```

---

### Task 14: Prose component + project detail page

**Files:**
- Create: `src/components/Prose.astro`
- Create: `src/pages/projects/[...slug].astro`

- [ ] **Step 1: Create `src/components/Prose.astro`** (Markdown typography via plain utility classes — no plugin needed)

```astro
---
// Styles rendered Markdown. Usage: <Prose><Content /></Prose>
---

<div
  class="max-w-none space-y-4 leading-relaxed
         [&_h2]:font-display [&_h2]:text-2xl [&_h2]:font-bold [&_h2]:mt-10 [&_h2]:mb-2
         [&_h3]:font-display [&_h3]:text-xl [&_h3]:font-semibold [&_h3]:mt-8
         [&_p]:text-[var(--color-fg)]
         [&_ul]:list-disc [&_ul]:pl-6 [&_ul]:space-y-1
         [&_a]:text-brand-700 [&_a]:underline [&_a:hover]:text-brand-600
         [&_code]:rounded [&_code]:bg-brand-50 [&_code]:px-1.5 [&_code]:py-0.5 [&_code]:text-sm"
>
  <slot />
</div>
```

- [ ] **Step 2: Create `src/pages/projects/[...slug].astro`**

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
    <a href="/projects" class="text-sm text-brand-700 hover:underline">← All projects</a>

    <h1 class="mt-4 font-display text-4xl font-extrabold tracking-tight">{title}</h1>
    <p class="mt-3 text-lg text-[var(--color-muted)]">{summary}</p>

    <dl class="mt-6 grid grid-cols-2 gap-4 border-y border-[var(--color-border)] py-4 text-sm sm:grid-cols-3">
      <div>
        <dt class="text-[var(--color-muted)]">Role</dt>
        <dd class="font-medium">{role}</dd>
      </div>
      <div>
        <dt class="text-[var(--color-muted)]">When</dt>
        <dd class="font-medium">{timeframe}</dd>
      </div>
      <div class="col-span-2 sm:col-span-1">
        <dt class="text-[var(--color-muted)]">Links</dt>
        <dd class="flex gap-3 font-medium">
          {repo && <a class="text-brand-700 hover:underline" href={repo} target="_blank" rel="noopener noreferrer">Repo</a>}
          {demo && <a class="text-brand-700 hover:underline" href={demo} target="_blank" rel="noopener noreferrer">Demo</a>}
          {!repo && !demo && <span class="text-[var(--color-muted)]">—</span>}
        </dd>
      </div>
    </dl>

    <ul class="mt-4 flex flex-wrap gap-2">
      {tech.map((t) => (
        <li class="rounded-full bg-brand-50 px-3 py-1 text-xs font-medium text-brand-700">{t}</li>
      ))}
    </ul>

    <div class="mt-10">
      <Prose><Content /></Prose>
    </div>
  </article>
</BaseLayout>
```

- [ ] **Step 3: Build and type-check**

Run:
```bash
npm run build && npx astro check
```
Expected: build completes; `astro check` reports 0 errors; `dist/projects/realtime-sync/index.html` and the other two detail pages exist.

- [ ] **Step 4: Visual smoke test**

Run:
```bash
npm run dev
```
Open http://localhost:4321/projects — confirm three cards render and link correctly; click one and confirm the detail page shows the metadata bar, tech tags, and the Markdown body styled by `Prose`. Stop the server when done.

- [ ] **Step 5: Commit**

```bash
git add src/components/Prose.astro "src/pages/projects/[...slug].astro"
git commit -m "Add project detail pages with Prose styling"
```

---

### Task 15: Wire featured projects into the landing page

**Files:**
- Modify: `src/pages/index.astro`

- [ ] **Step 1: Add imports to the frontmatter of `src/pages/index.astro`**

Below the existing imports, add:
```astro
import { getCollection } from 'astro:content';
import ProjectCard from '../components/ProjectCard.astro';
import { sortByOrder, onlyFeatured } from '../lib/projects';
```

At the end of the frontmatter (after the `site` import line), add:
```astro
const featured = sortByOrder(onlyFeatured(await getCollection('projects')));
```

- [ ] **Step 2: Insert a Featured Projects section between Career and Personal**

In the page body, immediately after the closing `</section>` of the Career block and before the Personal `<section>`, insert:
```astro
    <!-- Featured projects -->
    <section class="py-20 border-t border-[var(--color-border)]">
      <div class="flex items-end justify-between">
        <SectionHeading id="featured" eyebrow="Projects" title="Featured work" />
        <a href="/projects" class="mb-8 shrink-0 text-sm font-medium text-brand-700 hover:underline">
          All projects →
        </a>
      </div>
      {
        featured.length === 0 ? (
          <p class="text-[var(--color-muted)]">Projects coming soon.</p>
        ) : (
          <div class="grid gap-5 sm:grid-cols-2">
            {featured.map((p) => (
              <ProjectCard
                href={`/projects/${p.id}`}
                title={p.data.title}
                summary={p.data.summary}
                tech={p.data.tech}
                timeframe={p.data.timeframe}
              />
            ))}
          </div>
        )
      }
    </section>
```

- [ ] **Step 3: Update the Projects nav link target (optional anchor)**

No change required — the nav "Projects" link already points to `/projects`. Leave as is.

- [ ] **Step 4: Build, type-check, and smoke test**

Run:
```bash
npm run build && npx astro check
```
Expected: build completes; `astro check` reports 0 errors. Then `npm run dev`, open http://localhost:4321, and confirm the landing page shows a "Featured work" section with the two `featured: true` projects (Realtime Sync, CLI Toolkit) but not Payments API, and "All projects →" links to `/projects`. Stop the server when done.

- [ ] **Step 5: Commit**

```bash
git add src/pages/index.astro
git commit -m "Show featured projects on the landing page"
```

---

## Final verification

- [ ] **Full build is clean**

Run:
```bash
npm run build && npx astro check && npm test
```
Expected: build completes; `astro check` 0 errors; Vitest 2 passing.

- [ ] **Production preview spot-check**

Run:
```bash
npm run preview
```
Open the served URL and walk the full site: landing (all sections + featured projects), `/projects`, each project detail, a made-up URL → `/404`. Confirm responsive layout at mobile width. Stop the server when done.

- [ ] **Confirm deploy artifacts**

Verify these exist under `dist/`: `index.html`, `404.html`, `projects/index.html`, `projects/realtime-sync/index.html`, `sitemap-index.xml`.

- [ ] **Lighthouse sanity pass (pre-deploy)**

With `npm run preview` running, open Chrome DevTools → Lighthouse → run a report on the landing page. Expected: Performance and Accessibility both ≥ 90 (a static Astro page typically scores ~100). Note any flagged accessibility issues (contrast, missing labels) and fix before deploy.
