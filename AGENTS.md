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

- `assets/css/goen-line.css`
- `assets/css/goen-line-mobile.css`

JS:

- `assets/js/goen-line.js`
- `assets/js/goen-line-mobile.js`

Images:

- `assets/images/goen-logo.png`
- `assets/images/reference-style/asantech-hero-business-hands.png`
- `assets/images/case-study/case-lp-hp-design.png`
- `assets/images/case-study/case-meo-map-search.png`
- `assets/images/case-study/case-official-line-flow.png`

## Editing Rules

- Keep desktop and mobile as separate files unless the user explicitly asks to unify them.
- Desktop changes usually affect `index.html`, `goen-line.html`, and `assets/css/goen-line.css`.
- Mobile changes usually affect `goen-line-mobile.html` and `assets/css/goen-line-mobile.css`.
- If changing CSS, update the query string in the related HTML file to avoid stale cache.
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
