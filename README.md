# 語縁 GOEN — ランディングページ

地域店舗・個人事業主向け「LP・HP制作 × Web集客導線設計」ブランド **語縁 GOEN** の静的サイト。

- 本番: https://goen-enishi-hp.vercel.app/
- バージョン一覧: https://goen-enishi-hp.vercel.app/versions.html

## 構成

ビルド不要の静的サイト（プレーン HTML/CSS/JS）。

- `index.html` / `goen-top.html` … トップ（GOEN TOP 自己完結版）
- `語縁 ENISHI.html` ＋ `quality/system/service/flow/about/contact/privacy.html` … ENISHI modular 版（編集しやすい複数ファイル構成）
- `shinen.html`, `goen-homepage*.html` … 別デザイン案
- `versions.html` … 全バージョンへのハブ
- `goen-*.css` / `goen-*.js` / `*.jsx` / `goen-logo.png` … 共有アセット

## ローカルプレビュー

```sh
python -m http.server 8000 --bind 127.0.0.1   # → http://127.0.0.1:8000/
```

## デプロイ

main へ push すると Vercel が自動デプロイ。手動の場合:

```sh
vercel deploy --prod --yes --scope tyako915s-projects
```

> ⚠ Vercel は `.vercelignore` を参照します。巨大アーカイブ（`*.zip` / `extracted/`）は除外済みのまま維持してください（100MB/ファイル制限）。

## エージェント向け

詳細な作業指示・注意点・タスク手順は **[AGENTS.md](./AGENTS.md)** を参照。
