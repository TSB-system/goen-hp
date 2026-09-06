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
- `assets/css/goen-line.css` / `goen-line-mobile.css` / `goen-fv.css` / `goen-hero-kyoto.css`
- `assets/js/goen-line.js` / `goen-line-mobile.js` / `goen-enishi-thread-mobile.js` / `goen-fv-carousel.js`
- `assets/images/goen-logo.png`, `line-app-icon.png`, `og.jpg`
- `assets/images/hero-kyoto.{webp,jpg}` / `hero-kyoto-900.webp` （FV背景の水彩画）
- `assets/images/photo/` （代表写真）
- `assets/video/` （FV スマホ縦動画 8 本 + ポスター）
- `favicon.ico` / `favicon.png` / `apple-touch-icon.png`
- `vercel.json`

元素材（`動画/*.mov`, `images/*.HEIC`）と作業用フォルダ（`_tools/`, `_shots/`）は Git / Vercel の対象外です。
設計方針・要件は `docs/requirements-design-quality.md` を参照。

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
