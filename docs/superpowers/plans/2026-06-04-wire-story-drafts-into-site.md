# Wire Story Drafts Into the Site — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Surface the long-form career-story drafts in `docs/projects/` on the live Astro site — as linked "full story" pages for existing projects, three new standalone projects, and "The Long Game" career essay off `/about`.

**Architecture:** Add a new `stories` Astro content collection (`src/content/stories/`) whose entry ids mirror project ids. A `/stories/<slug>` route renders each story; the project detail page links to it when a matching story exists. Three new `projects` entries (with paired stories) are added and the three oldest entries' `order` is bumped to keep clean integer card indices. "The Long Game" is a plain markdown file rendered by a dedicated `/about/the-long-game` page, linked from `/about`.

**Tech Stack:** Astro 6 content collections (`glob` loader + zod schema), TypeScript `.astro` components, Tailwind v4, vitest.

**Testing approach:** This is content + templating, not new business logic. The verification gate is `npm run build` — Astro validates every collection entry against its zod schema and fails the build on missing/extra fields or a broken `getStaticPaths`/import. The existing vitest suite (`npm run test`) must stay green. No new non-trivial pure logic is introduced, so no new unit tests are warranted (YAGNI). Final visual verification uses the dev server + a headless screenshot.

> **Windows/PowerShell note:** the shell is PowerShell. Run `git`/`npm` as shown. When committing multi-line messages, prefer a single `-m` line or this repo's established pattern. All paths are repo-root-relative; the repo root is `C:\Users\sonny\Projects\personal-site`.

> **Open confirmation items (from the spec):** BCF and BofA exact years are unknown — both use the render-safe placeholder `timeframe: "Mid-2000s"`, to be confirmed by the user later. BofA tech omits a language (draft names none).

---

## File Structure

**Create:**
- `src/content/stories/infosystem-nc-pos.md` — full story (Group A)
- `src/content/stories/microsoft-vb4-testing.md` — full story (Group A)
- `src/content/stories/rabar-market-research.md` — full story (Group A)
- `src/content/stories/pega-case-robotics.md` — full story (Group A)
- `src/content/stories/us-census-bureau.md` — full story (Group B)
- `src/content/stories/bofa-defeasance.md` — full story (Group B)
- `src/content/stories/bcf-insurance-quoting.md` — full story (Group B)
- `src/content/projects/us-census-bureau.md` — new project summary (Group B)
- `src/content/projects/bofa-defeasance.md` — new project summary (Group B)
- `src/content/projects/bcf-insurance-quoting.md` — new project summary (Group B)
- `src/pages/stories/[...slug].astro` — story route
- `src/longform/the-long-game.md` — career essay source (Group C)
- `src/pages/about/the-long-game.astro` — essay page (Group C)

**Modify:**
- `src/content.config.ts` — register `stories` collection
- `src/pages/projects/[...slug].astro` — "Read the full story →" link
- `src/pages/about.astro` — "Read the full career story →" link
- `src/content/projects/rabar-market-research.md` — `order: 8 → 11`
- `src/content/projects/infosystem-nc-pos.md` — `order: 9 → 12`
- `src/content/projects/microsoft-vb4-testing.md` — `order: 10 → 13`

---

## Task 1: Register the `stories` collection + Group A story files

**Files:**
- Modify: `src/content.config.ts`
- Create: `src/content/stories/{infosystem-nc-pos,microsoft-vb4-testing,rabar-market-research,pega-case-robotics}.md`

- [ ] **Step 1: Add the `stories` collection to the config**

Replace the contents of `src/content.config.ts` with:

```ts
import { defineCollection } from 'astro:content';
import { z } from 'astro:schema';
import { glob } from 'astro/loaders';

const projects = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/projects' }),
  schema: z.object({
    title: z.string(),
    summary: z.string(),
    tech: z.array(z.string()),
    role: z.string(),
    timeframe: z.string(),
    order: z.number().default(99),
    repo: z.string().url().optional(),
    demo: z.string().url().optional(),
  }),
});

const stories = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/stories' }),
  schema: z.object({
    title: z.string(),
  }),
});

export const collections = { projects, stories };
```

- [ ] **Step 2: Create the 4 Group A story files**

Each file = the frontmatter block shown, a blank line, then the **full verbatim contents** of the listed draft (the draft already begins with the matching `# ...` H1 — keep it; the page renders it). Make no edits to the draft prose.

`src/content/stories/infosystem-nc-pos.md` — frontmatter, then verbatim `docs/projects/InfoSysOfNC-story.md`:
```md
---
title: "The Year of 70-Hour Weeks"
---
```

`src/content/stories/microsoft-vb4-testing.md` — frontmatter, then verbatim `docs/projects/Microsoft_VB4_Story.md`:
```md
---
title: "The Classroom That Never Slept"
---
```

`src/content/stories/rabar-market-research.md` — frontmatter, then verbatim `docs/projects/rabar-market-research-story.md`:
```md
---
title: "Trading at the Speed of Thought"
---
```

`src/content/stories/pega-case-robotics.md` — frontmatter, then verbatim `docs/projects/pegasystems-story.md`:
```md
---
title: "The Situational Layer Cake"
---
```

- [ ] **Step 3: Verify the build validates the new collection**

Run: `npm run build`
Expected: build succeeds; output shows the `stories` content synced. No zod/schema errors.

- [ ] **Step 4: Verify existing unit tests still pass**

Run: `npm run test`
Expected: PASS (sortByOrder, padIndex unchanged).

- [ ] **Step 5: Commit**

```
git add src/content.config.ts src/content/stories/
git commit -m "feat: add stories collection with existing-project narratives"
```

---

## Task 2: Add the `/stories/<slug>` route

**Files:**
- Create: `src/pages/stories/[...slug].astro`

- [ ] **Step 1: Create the story route**

`src/pages/stories/[...slug].astro`:
```astro
---
import { getCollection, render } from 'astro:content';
import type { GetStaticPaths } from 'astro';
import BaseLayout from '../../layouts/BaseLayout.astro';
import Prose from '../../components/Prose.astro';

export const getStaticPaths = (async () => {
  const stories = await getCollection('stories');
  const projects = await getCollection('projects');
  return stories.map((story) => {
    const project = projects.find((p) => p.id === story.id);
    return { params: { slug: story.id }, props: { story, project } };
  });
}) satisfies GetStaticPaths;

const { story, project } = Astro.props;
const { Content } = await render(story);
---

<BaseLayout title={story.data.title} description={story.data.title}>
  <article class="mx-auto max-w-3xl px-4 py-20">
    {
      project ? (
        <a href={`/projects/${project.id}`} class="mono-eyebrow transition-colors hover:text-[var(--color-accent-bright)]">← Back to {project.data.title}</a>
      ) : (
        <a href="/projects" class="mono-eyebrow transition-colors hover:text-[var(--color-accent-bright)]">← All Projects</a>
      )
    }

    <div class="frost-well mt-10">
      <Prose><Content /></Prose>
    </div>
  </article>
</BaseLayout>
```

- [ ] **Step 2: Verify the build generates the story pages**

Run: `npm run build`
Expected: build succeeds; output lists generated pages including `/stories/infosystem-nc-pos/`, `/stories/microsoft-vb4-testing/`, `/stories/rabar-market-research/`, `/stories/pega-case-robotics/`.

- [ ] **Step 3: Commit**

```
git add src/pages/stories/
git commit -m "feat: render story pages at /stories/<slug>"
```

---

## Task 3: Link project pages to their story

**Files:**
- Modify: `src/pages/projects/[...slug].astro`

- [ ] **Step 1: Compute whether a story exists**

In `src/pages/projects/[...slug].astro`, after the line `const { project } = Astro.props;` (currently line 15), add:
```astro
const hasStory = (await getCollection('stories')).some((s) => s.id === project.id);
```
(`getCollection` is already imported at the top of this file.)

- [ ] **Step 2: Add the link after the story body**

In the same file, locate the closing of the body well:
```astro
    <div class="frost-well mt-10">
      <Prose><Content /></Prose>
    </div>
```
Immediately after that `</div>` (and before `</article>`), add:
```astro
    {
      hasStory && (
        <a href={`/stories/${project.id}`} class="hud-btn hud-btn-ghost mt-8 inline-flex">
          Read the full story<span aria-hidden="true"> →</span>
        </a>
      )
    }
```

- [ ] **Step 3: Verify the build**

Run: `npm run build`
Expected: build succeeds.

- [ ] **Step 4: Visually confirm the link renders (and only where a story exists)**

Run the dev server and screenshot a project that HAS a story and one that does NOT:
```
npm run dev
```
(dev server starts on http://localhost:4321). In a second shell, capture with an isolated Chrome profile (avoids locking your interactive browser):
```
$chrome = "C:\Program Files\Google\Chrome\Application\chrome.exe"
$prof = Join-Path $env:TEMP ("cshot" + ([guid]::NewGuid().ToString() -replace '-',''))
& $chrome --headless=new --no-first-run --disable-gpu --hide-scrollbars --user-data-dir="$prof" --window-size=1200,1400 --screenshot="$env:TEMP\proj-with-story.png" "http://localhost:4321/projects/infosystem-nc-pos/"
& $chrome --headless=new --no-first-run --disable-gpu --hide-scrollbars --user-data-dir="$prof" --window-size=1200,1400 --screenshot="$env:TEMP\proj-no-story.png" "http://localhost:4321/projects/merck-ai-agentic-framework/"
```
Expected: `proj-with-story.png` shows a "Read the full story →" button; `proj-no-story.png` does not. (Stop the dev server when done.)

- [ ] **Step 5: Commit**

```
git add src/pages/projects/[...slug].astro
git commit -m "feat: link project pages to their full story when one exists"
```

---

## Task 4: Renumber the three oldest projects

**Files:**
- Modify: `src/content/projects/rabar-market-research.md`, `src/content/projects/infosystem-nc-pos.md`, `src/content/projects/microsoft-vb4-testing.md`

- [ ] **Step 1: Bump the order values**

- In `src/content/projects/rabar-market-research.md`, change `order: 8` to `order: 11`.
- In `src/content/projects/infosystem-nc-pos.md`, change `order: 9` to `order: 12`.
- In `src/content/projects/microsoft-vb4-testing.md`, change `order: 10` to `order: 13`.

(This frees orders 8–10 for the new Group B projects and keeps card indices as clean two-digit integers via `padIndex`.)

- [ ] **Step 2: Verify build + tests**

Run: `npm run build`
Expected: build succeeds.
Run: `npm run test`
Expected: PASS.

- [ ] **Step 3: Commit**

```
git add src/content/projects/rabar-market-research.md src/content/projects/infosystem-nc-pos.md src/content/projects/microsoft-vb4-testing.md
git commit -m "chore: renumber three oldest projects to free orders 8-10"
```

---

## Task 5: Add the three new standalone projects (Group B)

**Files:**
- Create: `src/content/projects/{us-census-bureau,bofa-defeasance,bcf-insurance-quoting}.md`

- [ ] **Step 1: Create `src/content/projects/us-census-bureau.md`**

```md
---
title: 2020 Census Technology Platform
summary: Senior Pega architect on the technology stack behind the 2020 U.S. Census — Google Maps property-change detection, multi-channel (online/mail/IVR) survey delivery, and a manager-plus-canvasser mobile platform with GPS, address mapping, and multilingual interviews — cutting the field workforce from 500–600K to under 300K.
tech: ["Pega", "Google Maps API", "Mobile (GPS / Tablet)", "Multi-Channel Survey", "Geospatial"]
role: Senior Pega Architect
timeframe: "2016 – 2018"
order: 8
---

## Problem

The 2020 census had to locate every U.S. property where people might live and
then reach every household — a logistics problem at national scale. Historically
it took an army of 500,000–600,000 contractors going door to door, and roughly
10–20% of properties change over a decade (new construction, demolitions,
rezoning), so the address list itself had to be re-verified first.

## What I built

Starting in 2016 in Washington, DC, I worked as a Pega architect on the platform
that powered the count. The system used Google Maps comparison against the 2010
data to flag which properties were new, changed, or unchanged — cutting manual
review before a canvasser hit the street. Outreach went digital-first: mailers
with survey links, email invitations, and an automated phone option, with
response tracked by address, neighborhood, and region. For non-responders, a
manager desktop app divided regions and assigned work while a field mobile app
combined GPS, address mapping, and a structured, multilingual interview workflow.

## Outcome

The field workforce dropped from 500,000–600,000 to under 300,000 — a more than
50% reduction — and the platform was built to be extensible enough to carry into
future censuses instead of being rebuilt each decade.
```

- [ ] **Step 2: Create `src/content/projects/bofa-defeasance.md`**

```md
---
title: Commercial Loan Defeasance Engine
summary: Two-person build (with a former NASA / Skunk Works engineer) of a recursive bond-optimization engine that swaps commercial-loan collateral for a precisely structured portfolio of T-bills, notes, and bonds — holding payment coverage inside a narrow threshold across a $236B loan portfolio.
tech: ["Recursive Optimization", "MVC Architecture", "U.S. Treasury Securities", "Financial Algorithms"]
role: Software Engineer (Contract)
timeframe: "Mid-2000s"
order: 9
---

## Problem

When a bank holds a large commercial loan, it sometimes wants to free the capital
backing it without paying it off — by swapping the collateral for a stream of
guaranteed government income (T-bills, notes, bonds) structured so the interest
covers each monthly payment *exactly*. Too little coverage means penalties; too
much triggers tax and admin cost. And it isn't static: principal amortizes,
interest accrues daily, and the security mix must be rebalanced for the life of
the loan.

## What I built

The team was two people. George Russell — a former Lockheed Skunk Works engineer
— owned the financial model and optimization logic; I built the lean MVC codebase
and the recursive optimizer at its core, which explored security combinations
200–300 levels deep to find the mix that covered a loan's schedule within
threshold. It ran against a $236B commercial-loan portfolio. At contract end I
did a full knowledge transfer of the code, architecture, and algorithm.

## Outcome

A clean handoff with the Bank of America team fully equipped to run it — proof
that a small team with complementary skills and a clear problem can move
nine-figure complexity without layers of process in between.
```

- [ ] **Step 3: Create `src/content/projects/bcf-insurance-quoting.md`**

```md
---
title: Real-Time Comparative Insurance Quoting
summary: Engineer at a 35-person startup (10 developers) building real-time multi-carrier insurance comparison years before Progressive popularized it — one customer entry, simultaneous quotes from many carriers via ACORD-standard XML integrations and resilient screen-scraping connectors for carriers without APIs.
tech: ["ACORD XML", "REST / XML Web Services", "Screen Scraping", "Carrier Integrations"]
role: Software Engineer
timeframe: "Mid-2000s"
order: 10
---

## Problem

To compare insurance quotes, brokers re-entered a customer's full profile into
each carrier's system, one at a time — the same data, by hand, for every carrier,
just to produce a comparison.

## What I built

At BCF — 35 people, 10 of them developers — I built connectors that took the
customer's information once and pulled real-time quotes from many carriers at
once. Where carriers were cooperative, integrations spoke the insurance
industry's ACORD XML standard over REST/XML web services for clean, structured
quotes. Where they weren't, the only option was screen scraping — programmatically
driving the carrier's site and extracting quotes from the returned HTML — which
broke whenever a carrier changed their front end and demanded constant vigilance
to keep alive.

## Outcome

A 35-person team shipped real-time comparative quoting before it was a mainstream
idea — compelling enough that a larger player (believed to be Vertafore) acquired
it. A few years later, Progressive made the same idea famous.
```

- [ ] **Step 4: Verify build**

Run: `npm run build`
Expected: build succeeds; output lists `/projects/us-census-bureau/`, `/projects/bofa-defeasance/`, `/projects/bcf-insurance-quoting/`.

- [ ] **Step 5: Visually confirm the projects grid ordering**

Start the dev server (`npm run dev`) and screenshot the listing:
```
$chrome = "C:\Program Files\Google\Chrome\Application\chrome.exe"
$prof = Join-Path $env:TEMP ("cshot" + ([guid]::NewGuid().ToString() -replace '-',''))
& $chrome --headless=new --no-first-run --disable-gpu --hide-scrollbars --user-data-dir="$prof" --window-size=1200,2000 --screenshot="$env:TEMP\projects-grid.png" "http://localhost:4321/projects/"
```
Expected: 13 cards; the three newest-era new cards appear after Pega (index 07): Census (08), then BofA (09), then BCF (10), then Rabar (11), InfoSystem (12), Microsoft VB4 (13). (Stop dev server when done.)

- [ ] **Step 6: Commit**

```
git add src/content/projects/us-census-bureau.md src/content/projects/bofa-defeasance.md src/content/projects/bcf-insurance-quoting.md
git commit -m "feat: add BCF, BofA defeasance, and 2020 Census projects"
```

---

## Task 6: Add the three new projects' story files (Group B)

**Files:**
- Create: `src/content/stories/{us-census-bureau,bofa-defeasance,bcf-insurance-quoting}.md`

- [ ] **Step 1: Create the three story files**

Each = the frontmatter block, a blank line, then the **full verbatim contents** of the listed draft, with the one exception noted for BofA.

`src/content/stories/us-census-bureau.md` — frontmatter, then verbatim `docs/projects/us-census-bureau-story.md`:
```md
---
title: "Washington, DC: Counting America"
---
```

`src/content/stories/bofa-defeasance.md` — frontmatter, then `docs/projects/bofa-defeasance-story.md` **with its final line removed** (drop the trailing `*[Note: The technical details of the defeasance algorithm are to be refined ...]*` paragraph and the `---` immediately above it):
```md
---
title: "The Rocket Scientist and the Programmer"
---
```

`src/content/stories/bcf-insurance-quoting.md` — frontmatter, then verbatim `docs/projects/bcf-insurance-quoting-story.md`:
```md
---
title: "Before Progressive Thought of It"
---
```

- [ ] **Step 2: Verify build generates the new story pages and links**

Run: `npm run build`
Expected: build succeeds; output lists `/stories/us-census-bureau/`, `/stories/bofa-defeasance/`, `/stories/bcf-insurance-quoting/`.

- [ ] **Step 3: Visually confirm a new project links to its story**

Start the dev server and screenshot a new project page + its story:
```
$chrome = "C:\Program Files\Google\Chrome\Application\chrome.exe"
$prof = Join-Path $env:TEMP ("cshot" + ([guid]::NewGuid().ToString() -replace '-',''))
& $chrome --headless=new --no-first-run --disable-gpu --hide-scrollbars --user-data-dir="$prof" --window-size=1200,1600 --screenshot="$env:TEMP\bofa-project.png" "http://localhost:4321/projects/bofa-defeasance/"
& $chrome --headless=new --no-first-run --disable-gpu --hide-scrollbars --user-data-dir="$prof" --window-size=1200,2000 --screenshot="$env:TEMP\bofa-story.png" "http://localhost:4321/stories/bofa-defeasance/"
```
Expected: project page shows "Read the full story →"; story page renders the narrative with a "← Back to Commercial Loan Defeasance Engine" link and no stray `[Note: ...]` line. (Stop dev server when done.)

- [ ] **Step 4: Commit**

```
git add src/content/stories/us-census-bureau.md src/content/stories/bofa-defeasance.md src/content/stories/bcf-insurance-quoting.md
git commit -m "feat: add full stories for BCF, BofA, and Census projects"
```

---

## Task 7: Wire "The Long Game" off /about (Group C)

**Files:**
- Create: `src/longform/the-long-game.md`, `src/pages/about/the-long-game.astro`
- Modify: `src/pages/about.astro`

- [ ] **Step 1: Create the essay source**

Create `src/longform/the-long-game.md` as the **full verbatim contents** of `docs/projects/career-journey-story.md` (no frontmatter needed; no edits). It begins with `# The Long Game`.

- [ ] **Step 2: Create the essay page**

`src/pages/about/the-long-game.astro`:
```astro
---
import BaseLayout from '../../layouts/BaseLayout.astro';
import Prose from '../../components/Prose.astro';
import { Content } from '../../longform/the-long-game.md';
---

<BaseLayout title="The Long Game" description="A career in software — executive summary.">
  <article class="mx-auto max-w-3xl px-4 py-20">
    <a href="/about" class="mono-eyebrow transition-colors hover:text-[var(--color-accent-bright)]">← Back to About</a>

    <div class="frost-well mt-10">
      <Prose><Content /></Prose>
    </div>
  </article>
</BaseLayout>
```

- [ ] **Step 3: Add the link on /about**

In `src/pages/about.astro`, locate the bio well:
```astro
    <div class="frost-well reveal max-w-2xl space-y-4 text-lg leading-relaxed text-[var(--color-body)]">
      {site.longBio.map((p) => <p>{p}</p>)}
    </div>
```
Immediately after that `</div>` (still inside the outer container `<div class="mx-auto max-w-5xl px-4 py-20">`), add:
```astro
    <a href="/about/the-long-game" class="hud-btn hud-btn-ghost mt-8 inline-flex">
      Read the full career story<span aria-hidden="true"> →</span>
    </a>
```

- [ ] **Step 4: Verify build**

Run: `npm run build`
Expected: build succeeds; output lists `/about/the-long-game/`.

If `npm run build` reports a type error on the `.md` import, run `npx astro check` to confirm; the markdown import is supported by Astro's built-in markdown handling, so a green `npm run build` is sufficient.

- [ ] **Step 5: Visually confirm the link + page**

Start the dev server and screenshot:
```
$chrome = "C:\Program Files\Google\Chrome\Application\chrome.exe"
$prof = Join-Path $env:TEMP ("cshot" + ([guid]::NewGuid().ToString() -replace '-',''))
& $chrome --headless=new --no-first-run --disable-gpu --hide-scrollbars --user-data-dir="$prof" --window-size=1200,1200 --screenshot="$env:TEMP\about.png" "http://localhost:4321/about/"
& $chrome --headless=new --no-first-run --disable-gpu --hide-scrollbars --user-data-dir="$prof" --window-size=1200,3000 --screenshot="$env:TEMP\long-game.png" "http://localhost:4321/about/the-long-game/"
```
Expected: `/about` shows "Read the full career story →"; `/about/the-long-game` renders the full essay with a "← Back to About" link. (Stop dev server when done.)

- [ ] **Step 6: Commit**

```
git add src/longform/the-long-game.md src/pages/about/the-long-game.astro src/pages/about.astro
git commit -m "feat: add The Long Game career essay linked from /about"
```

---

## Task 8: Final full verification

- [ ] **Step 1: Clean build**

Run: `npm run build`
Expected: build succeeds with no warnings about missing/invalid content; generated routes include all 7 `/stories/*`, all 13 `/projects/*`, and `/about/the-long-game/`.

- [ ] **Step 2: Type check**

Run: `npx astro check`
Expected: 0 errors. (Warnings about unrelated pre-existing files are acceptable; note them but don't fix out of scope.)

- [ ] **Step 3: Unit tests**

Run: `npm run test`
Expected: PASS.

- [ ] **Step 4: Report**

Summarize what was built and surface the open confirmation items (BCF/BofA years, BofA tech language) so the user can fill them in. Do not push — leave that to the user.

---

## Self-Review (completed by plan author)

- **Spec coverage:** Group A → Tasks 1–3; Group B projects → Tasks 4–5; Group B stories → Task 6; Group C → Task 7; verification → Task 8. Ordering/renumber → Task 4. `stories` collection + route → Tasks 1–2. ✔ All spec sections mapped.
- **Placeholder scan:** `timeframe: "Mid-2000s"` for BCF/BofA is an intentional, render-safe placeholder per the spec's explicit "Open items" (user approved proceeding). All code steps contain complete file contents or an exact source-file reference for verbatim copies. ✔
- **Type/name consistency:** schema field `title` (stories) used consistently in `[...slug].astro` (`story.data.title`); `hasStory`/`story.id`/`project.id` consistent across Tasks 2–3; order values 8/9/10 (new) vs 11/12/13 (bumped) are collision-free against existing orders 1–7. ✔
