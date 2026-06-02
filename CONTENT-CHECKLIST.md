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
