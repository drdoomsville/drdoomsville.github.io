# Personal Site — Design

**Date:** 2026-06-02
**Owner:** Sonny K.
**Status:** Approved design; first build cycle = Phases 1 + 2.

## Purpose

A personal website whose **primary audience is recruiters and hiring managers** evaluating
Sonny as a **software engineer**. The career story leads; bio, family, and hobbies appear as
secondary color that humanizes the professional picture. Success = a recruiter lands on the
site, quickly grasps "who is this engineer and is he strong," and has easy paths to deeper
proof (projects) and contact.

## Decisions (locked)

| Area | Decision |
|---|---|
| Framework | Astro 6, **static** output |
| Hosting | **Cloudflare Pages**, git-push auto-deploy |
| Structure | **Hybrid** — one rich single-page landing + dedicated deep-dive pages |
| Styling | **Tailwind CSS v4** (Astro Vite plugin) |
| Visual direction | **Bold gradient** — one saturated gradient hero, clean light content below |
| Content source | Astro **content collections** (Markdown/MDX) for `projects` + `blog`; `src/config/site.ts` as the single source of truth for personal data |
| Content readiness | Starting from scratch — ship **realistic placeholder content** + a fill-in checklist |
| First build cycle | **Phases 1 + 2** (landing + projects). Phases 3–4 are separate later cycles. |

## Architecture

Static Astro site. Personal data lives in one typed config module; long-form content
(projects, blog) lives in Markdown content collections with typed frontmatter. Pages compose
small, single-purpose components through a shared base layout.

### Routes (full vision)

| Route | Phase | Description |
|---|---|---|
| `/` | 1 | Landing: hero → about → career timeline → featured projects → personal (family + hobbies) → contact |
| `/projects` | 2 | Project index (cards linking to detail pages) |
| `/projects/[slug]` | 2 | Per-project case study: problem, what was built, stack, outcome, links |
| `/blog`, `/blog/[slug]` | 3 | Writing, Markdown posts, RSS feed |
| `/resume` | 4 | Web resume + downloadable PDF |
| `/uses`, `/now` | 4 | Personality pages |
| `/404` | 1 | Friendly not-found |

### Components & files (built for isolation)

- `src/layouts/BaseLayout.astro` — HTML shell, `<head>`/SEO/OG tags, sticky `Nav`, `Footer`.
- `src/config/site.ts` — single source of truth: name, tagline, bio, career timeline entries,
  social links, family blurb, hobbies, contact email. **The file Sonny edits most.**
- `src/content.config.ts` — schemas for `projects` (and later `blog`) collections.
- `src/components/`:
  - `Nav.astro` — sticky top nav, anchor links on landing, collapses on mobile.
  - `Footer.astro` — social links + copyright.
  - `Hero.astro` — the gradient hero block (name, tagline, primary CTAs).
  - `SectionHeading.astro` — consistent section titles/anchors.
  - `TimelineItem.astro` — one career entry.
  - `ProjectCard.astro` — project summary card (used on landing "featured" + `/projects`).
  - `SocialLinks.astro` — GitHub/LinkedIn/email icon row.
  - `Prose.astro` — Tailwind typography wrapper for rendered Markdown.

Each component has one job and a clear prop interface, so internals can change without
breaking consumers.

### Data flow

`site.ts` → imported by landing sections and layout (name/SEO).
`projects` collection → queried by `/projects` index and `[slug]` detail; the landing
"featured projects" section reads the same collection filtered to `featured: true`.

### Content model

`projects` frontmatter (typed in `content.config.ts`):
`title`, `summary`, `tech: string[]`, `role`, `timeframe`, `featured: boolean`,
`order: number`, optional `repo`, `demo`, `cover` image. Body = the case study in Markdown.

`site.ts` shape (sketch): `{ name, tagline, shortBio, longBio, email, socials[],
careerTimeline[{ company, role, period, summary, highlights[] }], hobbies[],
family }`.

### Visual system

Mobile-first responsive. One saturated gradient hero; the rest of the page is clean light
content for readability. Heavy display type for headings, comfortable body text. Sticky nav
collapses to a menu on small screens. Tailwind v4 design tokens (colors, spacing, fonts)
defined once and reused. Dark-mode toggle and OG preview images are **Phase 4 polish**.

### Error handling / edge cases

- Empty collections render graceful empty states (e.g., "Projects coming soon").
- `/404` page styled to match.
- Missing optional project fields (repo/demo/cover) degrade cleanly (no broken links/images).
- External links open safely (`rel="noopener"`).

## Phasing

1. **Phase 1 — MVP landing (deployable):** Tailwind + design tokens, `BaseLayout`, `Nav`,
   `Footer`, full landing page with all sections using `site.ts` placeholder data, `/404`,
   Cloudflare Pages deploy. A complete, real-looking site.
2. **Phase 2 — Projects:** `projects` content collection + schema, `/projects` index,
   `/projects/[slug]` detail, wire the landing "featured projects" section to the collection,
   placeholder project entries.
3. **Phase 3 — Blog (later cycle):** `blog` collection, index, posts, RSS.
4. **Phase 4 — Extras & polish (later cycle):** `/resume` (+PDF), `/uses`, `/now`, dark-mode
   toggle, OG images, contact form.

**This build cycle covers Phases 1 + 2.** Phases 3–4 get their own spec → plan → build cycles.

## Content workflow

All sections ship with realistic placeholder content so the site looks finished on first
deploy. A `CONTENT-CHECKLIST.md` at the repo root lists exactly what to replace and where
(`site.ts` fields, files to add under `src/content/projects/`).

## Testing

- `astro check` (type checking) and `astro build` pass clean.
- Manual verification: each landing section renders; nav anchors jump correctly; responsive
  at mobile/desktop widths; `/projects` lists entries; a `/projects/[slug]` page renders its
  Markdown; empty-state and `/404` render.
- Lighthouse sanity pass on the built site (performance/accessibility) before deploy.

## Out of scope (this cycle)

Blog, resume/PDF, `/uses`, `/now`, dark mode, OG images, contact form, analytics.
