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
- **Fewer dependencies is the point.** `@tailwindcss/cli` (Tailwind v4), `tailwindcss` and
  `simple-icons` are all build-time only — nothing ships to the browser except HTML + one CSS file.
  You keep full control of the markup.
- **Tailwind is compiled ahead of time** (Tailwind CLI, not the Play CDN), so there's no
  render-blocking JS and no flash of unstyled content. The v4 entry lives in `src/tailwind.css`
  (`@import "tailwindcss"` + `@config` still points at `tailwind.config.js`).

If you later want this to grow a `/notes` or `/blog` section, **Bridgetown** is the right move — you
already write Ruby, and the copy and design here port over cleanly. Say the word and I'll convert it.

## Prerequisites

- Node 20+ (Tailwind v4 needs it; `.node-version` / `.nvmrc` pin 24, the CI workflow reads it)
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

## Customizing

- **Accent color:** `tailwind.config.js`, `colors.accent` (`DEFAULT` for light bg, `bright` for dark).
- **Default theme:** the site is dark unless `localStorage.theme === 'light'`. To default to light,
  flip the logic in the inline `<script>` in `<head>`.
- **Fonts:** loaded from Google Fonts in `<head>` (the only third-party request). To self-host
  instead, add `@fontsource/space-grotesk` + `@fontsource/jetbrains-mono`, copy their `woff2` into
  `static/fonts/`, `@font-face` them in `src/tailwind.css`, and drop the `<link>`.
- **Technology icons:** `BRANDS` map in `scripts/build.mjs` + `<use href="#b-...">` in `index.html`.

## File tree

```
.
├── .gitignore
├── .node-version              # Node 24 — the CI workflow reads it (.nvmrc matches)
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
