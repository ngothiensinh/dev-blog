# Prompt: 3D scroll-driven portfolio homepage

Paste this into the coding agent working on the portfolio repo. Reference implementation: `one-architect-prototype.html` (vanilla Three.js + GSAP, single file) — port its scene graph, camera rail and timing, don't copy its structure.

---

## Goal

Build the homepage of my personal portfolio/CV site as **one continuous 3D world**, not a page of sections and cards. The visitor scrolls; the camera moves through the world. Text is a HUD layered over the scene. Below the opening scene, the page continues into conventional-but-restrained content sections (experience, certifications, work history, contact, CV download) that stay in the same visual system.

The AI-agent theme is the *opening act*, not the thesis of the site. Keep it to 3 beats, then hand off to the CV content.

## Constraints already fixed

- Static site, deployed to **GitHub Pages via GitHub Actions**.
- All content comes from **`cv.json`** (JSON Resume schema — `basics`, `work`, `education`, `certificates`, `skills`, `projects`) and `content/*.md`. No hardcoded copy in components.
- **`cv.pdf`** is rendered in the same Actions workflow from a `/cv/print` route (A4, animations off, `@media print`), via Playwright `page.pdf()`, and published as a static asset + release artifact. The "Download CV" button links to it.
- Stack: **Astro** (static output) + **React islands** for the scene; **@react-three/fiber + drei** for 3D (or vanilla Three.js in one island if that ports faster from the prototype); **GSAP ScrollTrigger** (pin + scrub) for all scroll choreography; **Shiki** at build time for any code shown in-scene. Optional: Lenis smooth scroll, XState for agent states.
- Respect `prefers-reduced-motion`: static wide shot of the scene + the same HUD text, sections still readable. Mobile (≤640px): scene still renders, HUD simplified (rail hidden, headline max 84vw, annotations shortened).

## Visual identity (do not substitute)

**Palette** (CSS custom properties)
- `--void #0b0e14` page/space · `--steel #1c2331` platform/surfaces · `--line #3a4a63` strokes, rails, frames
- `--cyan #6fd3ff` · `--violet #a08cff` · `--teal #5ee0c4` — agents, holo screens, diagram strokes (all cool)
- `--amber #ff9f5a` — **the only warm color**. Used for: the human figure, the spec, the shipped artifact, current-step markers, `<em>` in headlines, primary button.
- `--ink #e6ebf2` text · `--muted #8a95a8` secondary text
- Single dark theme, committed. Paint background explicitly; no light mode.

**Type** (Google Fonts)
- Display: **Barlow Condensed** 500, headlines `clamp(38px, 6.2vw, 84px)`, line-height .95, `text-wrap: balance`, one amber `<em>` per headline.
- Everything else: **IBM Plex Mono** 400/500. Eyebrows and labels 10–11px uppercase, `letter-spacing .12–.18em`. Body 13px/1.55, max ~30rem.
- Real fallback stacks declared.

**HUD rules**
- Fixed HUD layer over the canvas: phase rail top-left (thin 1px `--line` track, amber fill = progress), name + role top-right, headline block bottom-left (eyebrow / h1 / one-line body), controls bottom-right.
- Annotations are small mono labels with a 1px left border and a **leader line to the 3D object** they describe (project the object's world position each frame; hide when behind the camera or off-screen).
- No cards, no dividers, no background changes between beats. Depth comes from fog, lighting and the platform — not from boxes.

## The world

- Floating circular platform (r≈11) on a dark void, `FogExp2(#0b0e14, 0.038)`, faint grid, thin `--line` edge ring. Hemisphere light + one warm key light with soft shadows + faint cyan rim light. `flatShading: true` everywhere → low-poly look. ACES tone mapping.
- **Me** at the centre (0,0,0.35), seated at a desk, facing −z. Low-poly figure (target: Blender low-poly rig; prototype uses primitives): amber hoodie, darker amber trousers, dodecahedron head, glasses, dark hair. Subtle breathing/typing idle; head turns toward the review diff during the gate. Warm amber floor glow under the chair. **I never blur, never lose the warm color, never leave the platform.**
- Desk with two translucent holo screens (canvas textures: left = `spec.md`, right = PR diff), keyboard, mug.
- Six **agent drones**: emissive icosahedron core + wireframe shell + thin halo ring + additive glow sprite. Planner (cyan), Architect (violet), Builder α/β (teal), Reviewer (cyan), Ops (cyan). Hover/bob at their stations; glow brightens when active; converge into a ring around me during review.
- Stations: design board (left, dark glass, C4 diagram draws itself stroke-by-stroke), two builder terminals (right, holo screens that type code and end on green tests), launchpad (front-left, cyan ring turns amber, crate labelled `cv.pdf` rises in a light beam).
- Zone rings on the floor: violet (design), teal (build), cyan (ship). Spec travels along a dashed amber path; design beams (violet) architect→builders; return lines (teal) builders→reviewer→desk.

## Scroll choreography — opening scene (pinned, ~450vh)

Camera position and look-at are two Catmull-Rom curves through keyframes; scroll progress `t` scrubs both plus a GSAP timeline of scalar state (`specVis, specP, boardP, beamP, typeP, retP, converge, diffP, crateP`). Reuse the prototype's keys and timing as the starting point.

| Beat | Camera | What happens | Headline |
|---|---|---|---|
| 0 Wide | (0,4.6,13.5) → (0,1.6,0) | Idle world, agents hover. Rest state — everything legible before scroll. | **One architect. N agents. *Every decision still mine.*** eyebrow: "Ngo Thien Sinh · developer · architect" |
| 1 Work | swing left → board, then right → builders | Spec card leaves my desk to Planner/Architect; board draws C4; beams to builders; terminals type; tests go green. Compress the prototype's beats 1–3 into one flowing move. | **Agents draft, build and test. *I direct.*** |
| 2 Gate | (0.3,3.1,6.4) → (0,1.9,−0.2) | Agents converge into a ring; diff appears on my right screen; **Approve / Reject** buttons (Reject → agents pulse, diff redraws as rev 2). Skippable by scrolling. | **Nothing ships *without me.*** |
| 3 Ship | (3.2,3.4,12.2) → (−2,1.4,7) | Crate `cv.pdf` rises on the launchpad; **Download cv.pdf** button. | **Shipped: *cv.pdf*** — "Same cv.json renders this page and the PDF." |

Then the scene **unpins** and the page continues.

## Below the scene — content sections (same system)

The canvas stays fixed behind the content but the camera parks on a high, slightly tilted wide shot of the platform, dimmed (fog density up, exposure down) so text reads. One agent drone (Ops, cyan) drifts down the right edge as the reader scrolls, acting as a guide — subtle, no gimmicks. Content scrolls over the world; there are **no cards**. Structure is typography + 1px `--line` rules + amber markers.

1. **Experience** (`cv.work`) — vertical timeline: 1px `--line` track, amber dot on the current role, each entry = eyebrow (dates · location, mono), role in Barlow Condensed, company, 2–4 mono bullets. Tech tags as plain mono text separated by `·`, not chips.
2. **Certifications** (`cv.certificates`) — a dense mono table/grid: name, issuer, date, credential link. Amber marker for active/most recent. No badge images unless they're in the data.
3. **Work history / education** (`cv.education` + earlier `cv.work`) — compact list, same timeline treatment, smaller type.
4. **Skills / platforms** (`cv.skills`) — grouped mono lists under uppercase eyebrows (Cloud · ML · AI apps · Tooling). No proficiency bars.
5. **Contact + CV** — name, email, GitHub, LinkedIn as mono links; primary amber button **Download cv.pdf** (same asset as the scene). Footer line: "This site and cv.pdf are built from one cv.json by GitHub Actions" + link to the repo and the latest Actions run.

Each section: eyebrow (`01 · Experience` — the numbering is a real reading order), Barlow Condensed h2 with one amber `<em>`, content max-width ~44rem, left-aligned with the HUD gutter (`clamp(16px, 4vw, 56px)`). Sections fade/translate in from a *visible* resting state (never `opacity: 0` waiting on an observer).

## Performance & quality bars

- Lighthouse ≥ 90 (perf, a11y, best practices) on desktop; scene JS lazy-hydrated; textures ≤ 1024px; `setPixelRatio(min(dpr, 2))`; one shadow-casting light.
- Canvas has an `aria-label`; all HUD text is real DOM; buttons keyboard-focusable with a visible amber focus ring.
- Redraw canvas textures only when their progress value changes (integer-step throttle), not every frame.
- No layout shift when fonts load; redraw in-scene canvas textures on `document.fonts.ready`.
- `cv.pdf` ≤ 2 A4 pages, ≤ 500 KB, generated in CI on every push to `main`.

## Deliverables

1. `src/components/Scene/*` — R3F (or Three) island: world, human, agents, stations, camera rail, state → animation mapping.
2. `src/components/Hud/*` — rail, headline slides, anchored annotations with SVG leader lines, gate/ship controls.
3. `src/pages/index.astro` — pinned scene + content sections wired to `cv.json`.
4. `src/pages/cv/print.astro` — A4 print layout from the same data.
5. `.github/workflows/deploy.yml` — build → Playwright renders `cv.pdf` → deploy Pages → attach PDF to release.
6. Reduced-motion and ≤640px verified with screenshots.
