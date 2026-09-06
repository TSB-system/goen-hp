# AGENTS.md - GOEN Line Production

## Project

This repository is the production static site for 語縁 / GOEN Line.

- Production URL: https://goen-enishi.vercel.app/
- Desktop direct URL: https://goen-enishi.vercel.app/goen-line.html
- Mobile direct URL: https://goen-enishi.vercel.app/goen-line-mobile.html
- Deployment remote: `origin https://github.com/TSB-system/goen-hp.git`
- Deploy target: `origin main`

## Site Type

Static HTML/CSS/JS only.

- No framework.
- No package install.
- No build step.

Preview locally:

```powershell
python -m http.server 8000 --bind 127.0.0.1
```

## Production Pages

- `index.html`: root page and desktop page. It also includes a mobile User-Agent redirect fallback script.
- `goen-line.html`: desktop direct page.
- `goen-line-mobile.html`: mobile direct page.

`vercel.json` also redirects mobile User-Agents from `/` to `/goen-line-mobile.html`.

## Production Assets

CSS:

- `assets/css/goen-line.css` (desktop)
- `assets/css/goen-line-mobile.css` (mobile)
- `assets/css/goen-fv.css` (FV phone-video carousel, shared by desktop and mobile)
- `assets/css/goen-hero-kyoto.css` (HERO background: Kyoto watercolor scenery, shared)

JS:

- `assets/js/goen-line.js` (desktop)
- `assets/js/goen-line-mobile.js` (mobile)
- `assets/js/goen-enishi-thread-mobile.js` (mobile: left trunk line + sticky bar)
- `assets/js/goen-fv-carousel.js` (FV carousel, shared)

HERO background (`.hero__scape`) is a watercolor raster image:
`assets/images/hero-kyoto.{webp,jpg}` + `hero-kyoto-900.webp` (mobile).
It is laid over the hero with `mix-blend-mode: multiply` so the white paper
dissolves into the background. **The `<picture>` must sit directly under
`.hero` / `.gm-hero`** — inside `.hero__field` the blend is cut off by its
stacking context. To swap the artwork, replace the images and re-run
`_tools/apply_scape.py`, then regenerate `goen-line.html`.

Images:

- `assets/images/goen-logo.png`
- `assets/images/line-app-icon.png`
- `assets/images/og.jpg` (OGP 1200x630)
- `assets/images/photo/representative-cutout*.png|webp` (代表・法被・透過。FV / About)
- `assets/images/photo/representative-portrait.*`, `representative-square.*`, `representative-laptop.*` (代表・PC 作業カット。Insight)
- `favicon.ico`, `favicon.png`, `apple-touch-icon.png`

Video (FV carousel):

- `assets/video/fv-01.mp4` ... `fv-08.mp4` (720x1280, 12s, muted, ~1.5-3.3MB each)
- `assets/video/fv-NN-poster.jpg|webp`
- Source `.mov` / `.HEIC` files live in `動画/` and `images/` and are git/vercel-ignored. Re-encode with ffmpeg (see `docs/requirements-design-quality.md` §6.2).

Unused legacy (safe to delete once confirmed):

- `assets/images/reference-style/asantech-hero-business-hands.png`
- `assets/images/reference-style/goen-hero-representative.png` (copied to `assets/images/photo/representative-laptop.*`)
- `assets/images/case-study/*.png`

## Editing Rules

- Keep desktop and mobile as separate files unless the user explicitly asks to unify them.
- Desktop changes usually affect `index.html`, `goen-line.html`, and `assets/css/goen-line.css`.
- Mobile changes usually affect `goen-line-mobile.html` and `assets/css/goen-line-mobile.css`.
- If changing CSS/JS, update the `?v=` query string in the related HTML file to avoid stale cache.
- `goen-line.html` must stay identical to `index.html` except for the mobile-redirect `<script>` in `<head>`. Edit `index.html`, then regenerate `goen-line.html` by removing that script block.
- Design requirements and rationale: `docs/requirements-design-quality.md`.
- Do not restore old mock images, old design variants, or deleted legacy pages unless the user explicitly asks.

## Deploy

Check status:

```powershell
git status --short
```

Deploy:

```powershell
git push origin HEAD:main
```

Verify after deployment:

```powershell
Invoke-WebRequest -Uri 'https://goen-enishi.vercel.app/' -Headers @{ 'Cache-Control'='no-cache' } -UseBasicParsing
Invoke-WebRequest -Uri 'https://goen-enishi.vercel.app/goen-line.html' -Headers @{ 'Cache-Control'='no-cache' } -UseBasicParsing
Invoke-WebRequest -Uri 'https://goen-enishi.vercel.app/goen-line-mobile.html' -Headers @{ 'Cache-Control'='no-cache' } -UseBasicParsing
```
