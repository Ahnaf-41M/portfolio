# Portfolio — Md. Ahnaf Muttaqi Chowdhury

A one-page portfolio aimed at hiring managers and senior engineers for backend / cloud roles.
Single page, dark by default, no framework runtime. Sections: hero + stats · stack · selected work ·
projects · experience · education · competitive programming · contact. Full nav on `lg+`; a
hamburger menu below that.

Technology icons are real brand marks (Ruby, Rails, Docker, Ansible, Postgres, Prometheus, …) pulled
from the `simple-icons` package **at build time** and inlined into an SVG `<symbol>` sprite — no icon
font, no runtime request. Headings use Space Grotesk + JetBrains Mono from Google Fonts (the only
third-party request); body text stays on the system stack.

## Stack: plain HTML + Tailwind (compiled)

Picked over Jekyll and Bridgetown because:

- **It's one page.** A content pipeline (Jekyll/Bridgetown) earns its keep when you have a blog or
  many pages. Here it would be pure overhead.
- **The build is just Node** — a few seconds in CI, no Ruby toolchain to pin and babysit.
- **Fewer dependencies is the point.** `tailwindcss` and `simple-icons` are both build-time only —
  nothing ships to the browser except HTML + one CSS file. You keep full control of the markup.
- **Tailwind is compiled ahead of time** (Tailwind CLI, not the Play CDN), so there's no
  render-blocking JS and no flash of unstyled content.

If you later want this to grow a `/notes` or `/blog` section, **Bridgetown** is the right move — you
already write Ruby, and the copy and design here port over cleanly. Say the word and I'll convert it.

## Prerequisites

- Node 18+ (`.node-version` pins 20; the CI workflow reads it)
- `python3` only if you use `npm run serve` for local preview (any static server works)

## Local development

```bash
npm install
npm run build        # -> dist/
npm run serve        # http://localhost:8000  (serves dist/)
```

While editing, run the CSS watcher in a second terminal so class changes recompile:

```bash
npm run dev          # rebuilds dist/styles.css on change
```

`npm run dev` only rebuilds CSS. If you change `static/index.html`, re-run `npm run build` (or just
copy the file into `dist/` yourself).

## Build

```bash
npm run build
```

`scripts/build.mjs` wipes `dist/`, copies everything in `static/` verbatim, injects the brand-icon
`<symbol>`s into the `<!--BRAND_ICONS-->` placeholder in `index.html`, then compiles
`src/tailwind.css` into `dist/styles.css` (minified). Output directory: **`dist/`**.

To add or remove a technology icon: edit the `BRANDS` map in `scripts/build.mjs` (keys are the
`#b-<id>` used in markup, values are the `simple-icons` export suffix), then reference
`<svg viewBox="0 0 24 24" fill="currentColor"><use href="#b-<id>" /></svg>` in `index.html`.

## Deploy to GitHub Pages

`.github/workflows/deploy.yml` runs `npm ci && npm run build` and publishes `dist/` on every push to
`main`. Asset paths are relative, so it works whether the repo is served at a domain root or at
`https://<user>.github.io/<repo>/`.

1. Push the repo to GitHub (any name — `portfolio` is fine; name it `<user>.github.io` if you want it
   at the domain root instead of `/<repo>/`).
2. On GitHub: **Settings → Pages → Build and deployment → Source → “GitHub Actions”.**
3. That's it. The workflow runs on the next push (or trigger it now from the **Actions** tab →
   *Deploy to GitHub Pages* → *Run workflow*). When it finishes, the URL shows in the Actions run
   and under Settings → Pages.
4. Custom domain (optional): Settings → Pages → Custom domain. Then set the real domain in
   `static/robots.txt`, `static/sitemap.xml`, and the `canonical` / `og:url` tags in
   `static/index.html` (search for `REPLACE-WITH-DOMAIN`).

GitHub Pages can't set custom response headers, so there's no CSP / security-header layer. If you
need one, put the site behind a proxy that can (e.g. Cloudflare) or add a
`<meta http-equiv="Content-Security-Policy">` tag (weaker — no `frame-ancestors`).

## Before you ship — content TODOs

Everything below is either a guess I made from your resume or a placeholder. Search the repo for
`TODO(ahnaf)` and `REPLACE-WITH-DOMAIN` to find them in context.

1. **Positioning.** Your resume title is "Junior Software Engineer." The hero calls you "a software
   engineer who works close to the backend" and the contact section targets "backend and cloud /
   platform engineering roles." That aligns you to the roles you want, not your current title. Dial
   it back if it feels too forward.
2. **Location.** "Bangladesh" is inferred from your `+880` phone number — no city on the resume.
   WellDev has Dhaka and Chittagong offices. Set a city if you want one (contact section + `og`).
3. **Availability line** ("Open to backend and cloud / platform engineering roles") — invented. Keep,
   edit, or delete.
4. **The Selected-work cards (01–04)** describe your WellDev work; the section heading is "Things
   I've built and run in production." Confirm you're allowed to describe this work publicly at this
   level of detail (the platform is called a "production property-management platform" in the
   Experience section) — if not, generalize the card wording. There's a `TODO(ahnaf)` comment at the
   top of the section as a reminder.
5. **Selected-work depth.** Every bullet is grounded in tech named on your resume, but the specifics
   are thin. Each card has an HTML comment listing exactly what to add — CI system, deploy target,
   the real bottleneck behind the 10×, exporter/alert details, template counts.
6. **The "10× performance improvement"** is quoted from your resume verbatim. I did not tie it to a
   specific metric (render time vs query time) because you didn't specify. Say which, and add one
   concrete before/after number.
7. **Projects is now its own section** (Selected work = employer work; Projects = personal). Three
   cards:
   - **WellAcademy** — accurate; built from reading the repo (CanCanCan roles, Sidekiq + sidekiq-cron,
     ffmpeg, Kaminari, RSpec/FactoryBot, Bullet, en/bn i18n). Confirm the repo is presentable.
   - **QuizApp** / **BusMania** — I could not read these repos, so the cards are built from your
     one-line resume descriptions plus reasonable guesses at the stack (**Spring Data JPA** for
     QuizApp; **JDBC** + a routes/trips/bookings schema for BusMania). Verify or correct — see the
     `TODO(ahnaf)` comment on each card. If either repo isn't portfolio-ready, drop the card.
8. **Education** is now its own section (NSTU, B.Sc. CSTE, 2019 – 2024). Your resume says
   Dec 2018 – Mar 2024 with CGPA 3.48 / 4.00; you asked to show 2019 – 2024 and drop the CGPA.
9. **Contests are now listed in full** with links to the standings/leaderboard pages taken from your
   resume (`fbclid` tracking param stripped from the HackerRank URL). The HackerRank leaderboard link
   for Intra NSTU 2021 **may require login to view** — check it in a private window; if it's gated,
   swap the link for a screenshot. "General Secretary, Departmental Computer Club" is still omitted
   (low signal here) — add it back if you disagree.
10. **Phone formatting.** Resume has `+880-1980318196`; rendered here as `+880 1980-318196` with
    `tel:+8801980318196`. Verify the number.
11. **`static/resume.pdf`** — your PDF is included; the hero "Résumé" button opens it in a new tab
    (browsers render PDFs inline, so it displays rather than downloads). Replace the file to update it.
12. **OG image not included** (you said no stock art). Text OG tags are set. If you want a link
    preview image, add `static/og.png` (1200×630) and uncomment the `og:image` tag in `index.html`.
13. **Design vibe** — you left the reference/vibe blank, and then asked for "more eye-catching."
    Current direction: near-black canvas with a faint grid + soft teal glow behind the hero; a big
    Space Grotesk display face for the name and headings; one teal accent used boldly (filled CTA,
    pulsing "open to roles" dot, stat highlights, card hover hairline, gradient scroll bar);
    JetBrains Mono for all metadata. No hero illustration, no full-bleed gradient, no "passionate
    about clean code" copy. Re-skin the accent in one place: `tailwind.config.js` →
    `theme.extend.colors.accent`. Swap the display font in `tailwind.config.js` + the `<link>` in
    `index.html`.
14. **A "Stack" section was added** (hero → **stack** → work → …). It wasn't in your original section
    list, but it's the natural home for the technology icons you asked for. Groups: Languages /
    Frameworks & data / Platform & DevOps, drawn from your resume's Skills block. Adjust the chip
    lists in `index.html`; add/remove icons via the `BRANDS` map in `scripts/build.mjs`.
15. **Brand icons** come from `simple-icons` and render in `currentColor` (monochrome, theme-safe) —
    they pick up the accent on chip hover. I did **not** tint them their brand colors: ~5 of them
    (GitHub, OpenJDK, CodeChef, JS, Hotwire) are near-black or near-white and would vanish in one
    theme, and 20 clashing logo colors reads as noisier, not fancier. Say if you want them colored
    anyway and I'll add per-theme overrides.
16. **Animations** (all respect `prefers-reduced-motion`): hero fades up with a stagger; the "open to
    roles" dot pulses; sections/cards fade in on scroll (IntersectionObserver + 2.2 s safety net +
    no-JS fallback); scroll-progress bar; blinking monogram cursor; link underlines wipe in; chips
    and cards lift on hover; card top-edge hairline sweeps in; theme toggle spins.
17. **One third-party request:** Google Fonts (`fonts.googleapis.com` + `fonts.gstatic.com`),
    `preconnect`ed in `<head>`. To keep zero third-party requests, self-host with
    `@fontsource/space-grotesk` + `@fontsource/jetbrains-mono` (copy the `woff2` into
    `static/fonts/`, `@font-face` them in `src/tailwind.css`, drop the `<link>`).
18. **Hero copy trimmed** — per your request, the "At WellDev I help build and operate… / I also
    compete… Codeforces Specialist, CodeChef 5★" sentence is gone. That info still appears in the
    stats band, Experience, and Competitive programming.
19. **Responsive pass** — hero name scales `text-3xl → 5xl → 6xl` and wraps naturally on phones (the
    forced `Md. Ahnaf ⏎ Muttaqi Chowdhury` break only kicks in at `sm+`); the "open to roles" pill
    shrinks its tracking on mobile; the two bands go 2-up on phones, 4-up on desktop; contact cards
    go 1-up → 2-up. Full nav shows at `lg+`; below that a hamburger opens a full-width menu (closes
    on selection, on Escape, and when the viewport grows past `lg`).
20. **Two 4-cell bands.** The hero band is now your **core stack** — Ruby on Rails / PostgreSQL /
    Docker / Ansible with brand icons and role sub-labels (Framework / Database / Containers /
    Provisioning). Pick different techs by editing that `<dl>`. The **contest stats band**
    (`2000+` · `Specialist` · `5★` · `#1`) moved down into the Competitive-programming section under
    the heading. The old rating *cards* there are now compact linked chips (Profiles row) so they
    don't repeat what the band already shows. "#1" replaced the earlier "1ˢᵗ" — the superscript
    collided with Space Grotesk's flagged "1".

## Customizing

- **Accent color:** `tailwind.config.js`, `colors.accent` (`DEFAULT` for light bg, `bright` for dark).
- **Default theme:** the site is dark unless `localStorage.theme === 'light'`. To default to light,
  flip the logic in the inline `<script>` in `<head>`.
- **Fonts:** loaded from Google Fonts in `<head>`. To self-host instead, see assumption 17 above.
- **Technology icons:** `BRANDS` map in `scripts/build.mjs` + `<use href="#b-...">` in `index.html`.

## File tree

```
.
├── .gitignore
├── .node-version              # Node 20 — the CI workflow reads it
├── README.md
├── package.json
├── tailwind.config.js
├── .github/
│   └── workflows/
│       └── deploy.yml         # GitHub Pages: build + publish dist/ on push to main
├── scripts/
│   └── build.mjs              # copy static/ + inject brand icons + compile Tailwind -> dist/
├── src/
│   └── tailwind.css           # Tailwind entry + component classes (chips, cards, hero backdrop…)
└── static/                    # copied verbatim into dist/
    ├── index.html
    ├── favicon.svg
    ├── .nojekyll              # tell GitHub Pages not to run Jekyll on the output
    ├── robots.txt
    ├── sitemap.xml
    └── resume.pdf             # opened in a new tab by the hero "Résumé" button
```

`dist/` is generated — gitignored, don't commit it.
