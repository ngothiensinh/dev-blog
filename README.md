# Run locally

> npm install

> npm run dev

Blog: <http://localhost:3000/dev-blog/> · Profile: <http://localhost:3000/dev-blog/profile/>

# Profile / CV

- `data/cv.json` (JSON Resume) is the single source for `/profile`, `/profile/print` and `cv.pdf`. Search it for `TODO` to find placeholders to fill in.
- `data/profile/hud.json` holds the copy for the 3D scene HUD and the section headings.
- `cv.pdf` is rendered in CI from `/profile/print` by Playwright (`scripts/render-cv.mjs`). To build it locally:

> npx playwright install chromium

> npm run build && npm run cv:pdf

In `next dev` the “Download cv.pdf” button 404s until that has been run once.

# Refs:

- [Fork from](https://tailwind-nextjs-starter-blog.vercel.app/)
- Design reference for `/profile`: `docs/refs/portfolio-homepage-prompt.md` + `docs/refs/one-architect-prototype.html`
