# Wire Story Drafts Into the Site — Design

**Date:** 2026-06-04
**Status:** Approved (design); pending spec review

## Goal

The long-form career-story drafts in `docs/projects/` are authoring source that
never surfaces on the live Astro site. Wire the relevant ones in so visitors can
read them, without disturbing the existing concise project pages.

## Background

- The `projects` content collection (`src/content/projects/*.md`, schema in
  `src/content.config.ts`) holds **10 concise** entries (Problem / What I built /
  Outcome), rendered as cards on `/projects` and detail pages at
  `/projects/<slug>` via `src/pages/projects/[...slug].astro`.
- `docs/projects/*.md` holds **10 long-form narrative drafts**. They split into
  three groups (below). The concise project entries are summaries of these
  drafts; the drafts are the richer first-person versions.
- `/about` renders `site.longBio[]`; `/career` renders `site.careerTimeline[]`.

## The three groups & decisions

| Group | Drafts | Decision |
|---|---|---|
| **A** — richer versions of existing project pages | `InfoSysOfNC-story`, `Microsoft_VB4_Story`, `rabar-market-research-story`, `pegasystems-story` | Keep the short page; add a **linked full-story page** per project |
| **B** — projects not yet on the site | `bcf-insurance-quoting-story`, `bofa-defeasance-story`, `us-census-bureau-story` | Create **new standalone projects** (short page + full story each) |
| **C** — career-level narratives | `career-journey-story` ("The Long Game") | Wire **only "The Long Game"** onto `/about` (as a linked sub-page) |

**Out of scope:** `career-journey-caveman` and `career-timeline` drafts (not
wired); the 6 existing project entries that have no draft
(`commercial-banking-automation`, `digital-fda-drug-filings`,
`enterprise-rpa-coe`, `intelligent-payment-automation`,
`merck-ai-agentic-framework`, `responsible-ai-function`) get no story link;
no component/style redesign (reuse `Prose`, `frost-well`, HUD header,
`ProjectCard`); deleting the `docs/projects/` drafts is deferred.

## Architecture (chosen: separate `stories` collection)

Considered: (1) separate `stories` collection + `/stories/<slug>` route
**[chosen]**; (2) nested `/projects/<slug>/story` (nicer URL, but reworks the
existing rest-route — more fragile); (3) append narrative to the same project
page (page balloons, not a separate page). #1 is lowest-risk and leaves the
existing project route untouched.

### 1. New `stories` content collection
- Location: `src/content/stories/<project-slug>.md` — filename equals the
  paired project slug, so a story↔project link is by shared id (no extra
  frontmatter reference needed).
- Schema (add to `src/content.config.ts`):
  ```ts
  const stories = defineCollection({
    loader: glob({ pattern: '**/*.md', base: './src/content/stories' }),
    schema: z.object({
      title: z.string(),       // evocative story title, e.g. "The Year of 70-Hour Weeks"
      tagline: z.string().optional(),
    }),
  });
  export const collections = { projects, stories };
  ```
- Body = the full narrative (curated copy of the draft; see Source handling).

### 2. New route `src/pages/stories/[...slug].astro`
- `getStaticPaths` over the `stories` collection; `slug = story.id`.
- Renders: HUD-style header with the story `title`, a `← Back to {project title}`
  link to `/projects/<slug>` (looked up by matching project id), and the
  narrative in `Prose` inside a `frost-well` — visually consistent with the
  project detail page.

### 3. Project detail page (`src/pages/projects/[...slug].astro`)
- After the body `frost-well`, conditionally render a **"Read the full story →"**
  link to `/stories/<slug>`, shown **only when** a story with the same id exists.
- Detection: `getCollection('stories')` once, check membership by id. Existing
  project pages without a matching story are unchanged.

### 4. Group A — 4 story files
Create from the drafts, paired to existing project slugs:

| Story file (`src/content/stories/`) | Story title | Paired project |
|---|---|---|
| `infosystem-nc-pos.md` | The Year of 70-Hour Weeks | `infosystem-nc-pos` |
| `microsoft-vb4-testing.md` | The Classroom That Never Slept | `microsoft-vb4-testing` |
| `rabar-market-research.md` | Trading at the Speed of Thought | `rabar-market-research` |
| `pega-case-robotics.md` | The Situational Layer Cake | `pega-case-robotics` |

### 5. Group B — 3 new projects (+ 3 story files)
New `src/content/projects/*.md` entries (concise summary + Problem/Built/Outcome
body written from each draft) **and** matching `src/content/stories/*.md`
(full narrative). Proposed frontmatter:

| Slug | title | role | timeframe | order | tech (proposed) |
|---|---|---|---|---|---|
| `us-census-bureau` | 2020 Census Technology Platform | Senior Pega Architect | `2016 – 2018` | 8 | Pega, Google Maps API, Mobile (GPS/Tablet), Multi-Channel Survey, Geospatial |
| `bofa-defeasance` | Commercial Loan Defeasance Engine | Software Engineer (Contract) | **CONFIRM (≈ mid-2000s)** | 9 | Recursive Optimization, MVC Architecture, U.S. Treasury Securities, Financial Algorithms |
| `bcf-insurance-quoting` | Real-Time Comparative Insurance Quoting | Software Engineer | **CONFIRM (≈ mid-2000s)** | 10 | ACORD XML, REST/XML Web Services, Screen Scraping, Carrier Integrations |

Paired story files: `us-census-bureau.md` ("Washington, DC: Counting America"),
`bofa-defeasance.md` ("The Rocket Scientist and the Programmer"),
`bcf-insurance-quoting.md` ("Before Progressive Thought of It").

**Ordering:** insert the three new entries chronologically (lower `order` =
more recent). Census (2016–18) sits just after Pega (order 7); BofA/BCF
(~mid-2000s) sit between Pega and Rabar. To keep the decorative card indices
clean integers, bump the three oldest existing entries:

| Entry | order: was → new |
|---|---|
| `rabar-market-research` | 8 → 11 |
| `infosystem-nc-pos` | 9 → 12 |
| `microsoft-vb4-testing` | 10 → 13 |

(Entries with order 1–7 are unchanged.)

### 6. Group C — "The Long Game"
- Source: `src/longform/the-long-game.md` (plain markdown outside any
  collection), imported directly.
- New page `src/pages/about/the-long-game.astro` (coexists with `about.astro`
  → URL `/about/the-long-game`): imports the markdown `Content`, renders it in
  `BaseLayout` + `Prose` + `frost-well`, with a `← Back to About` link.
- `/about` (`src/pages/about.astro`): add a **"Read the full career story →"**
  link to `/about/the-long-game` below the bio well. The essay stays on its own
  page so `/about` remains short.
- Drop the draft's "Merck chapter pending" framing only if it reads oddly
  out of context; otherwise keep verbatim.

### 7. Source handling
- Story/longform content under `src/content/` and `src/longform/` are curated
  copies derived from `docs/projects/` drafts — add frontmatter, and drop the
  BofA draft's trailing `*[Note: ... to be refined ...]*` line.
- `docs/projects/` drafts remain as authoring source. Risk: future drift
  between draft and published copy. Mitigation deferred (optional later
  deletion of the duplicated drafts).

## Verification
- `npm run build` — Astro validates story/project frontmatter against the
  schema and builds all new routes; build failure = schema/route error.
- `npm run test` — existing vitest suite stays green.
- Manual (dev server + headless screenshot, per the project's run pattern):
  - `/projects` shows 13 cards in correct order with clean integer indices.
  - A Group A project page shows the "Read the full story →" link; the linked
    `/stories/<slug>` renders with the back-link.
  - The 3 new project cards/pages render; their story pages render.
  - `/about` shows the "full career story" link; `/about/the-long-game` renders.

## Open items for your confirmation
1. **BCF timeframe** — exact years (draft gives none; ordering assumes
   ~mid-2000s, after Rabar, before Pega).
2. **BofA timeframe** — same.
3. **BofA tech stack language** — draft says "clean MVC architecture" but names
   no language; confirm C#/.NET (era-typical) or leave language out.
4. Proposed titles/summaries for the 3 new projects — adjust wording if desired.

## File change summary
- **Edit:** `src/content.config.ts` (add `stories` collection);
  `src/pages/projects/[...slug].astro` (full-story link);
  `src/pages/about.astro` (full-career-story link);
  `src/content/projects/{rabar-market-research,infosystem-nc-pos,microsoft-vb4-testing}.md` (order bump).
- **New:** `src/pages/stories/[...slug].astro`;
  `src/pages/about/the-long-game.astro`;
  `src/longform/the-long-game.md`;
  `src/content/projects/{us-census-bureau,bofa-defeasance,bcf-insurance-quoting}.md`;
  `src/content/stories/{infosystem-nc-pos,microsoft-vb4-testing,rabar-market-research,pega-case-robotics,us-census-bureau,bofa-defeasance,bcf-insurance-quoting}.md`.
