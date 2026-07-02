# GOEN Line Production

語縁 / GOEN の本番公開用静的サイトです。

## URLs

- Web/root: https://goen-enishi.vercel.app/
- Desktop direct: https://goen-enishi.vercel.app/goen-line.html
- Mobile direct: https://goen-enishi.vercel.app/goen-line-mobile.html

スマホで `/` を開いた場合は、`vercel.json` の User-Agent redirect で `/goen-line-mobile.html` へ遷移します。

## Files Kept For Production

- `index.html`
- `goen-line.html`
- `goen-line-mobile.html`
- `assets/css/goen-line.css`
- `assets/css/goen-line-mobile.css`
- `assets/js/goen-line.js`
- `assets/js/goen-line-mobile.js`
- `assets/images/goen-logo.png`
- `assets/images/reference-style/asantech-hero-business-hands.png`
- `assets/images/case-study/case-lp-hp-design.png`
- `assets/images/case-study/case-meo-map-search.png`
- `assets/images/case-study/case-official-line-flow.png`
- `vercel.json`

## Local Preview

```powershell
python -m http.server 8000 --bind 127.0.0.1
```

Open:

```text
http://127.0.0.1:8000/
```

## Deploy

GitHub and Vercel are connected. Push to `main` to deploy.

```powershell
git push origin HEAD:main
```

Current deployment remote:

```text
origin https://github.com/TSB-system/goen-hp.git
```
