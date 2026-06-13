# AGENTS.md — 語縁 GOEN ランディングページ 引き継ぎ書

> このファイルは Codex / Claude Code などのコーディングエージェント向けの作業指示書です。
> 人間が読んでも構いません。作業前に必ず通読してください。

## 1. プロジェクト概要

- **目的**: 「語縁 GOEN」（地域店舗・個人事業主向け LP・HP制作 × Web集客導線設計）のブランドサイト。
- **種類**: ビルド不要の**静的サイト**（プレーン HTML/CSS/JS）。フレームワーク・パッケージマネージャ・ビルド工程は一切なし。`npm install` 不要。
- **本番URL**: https://goen-enishi-hp.vercel.app/
- **GitHub（Private）**: https://github.com/tyako915/goen-enishi-hp
- **ホスティング**: Vercel（静的配信、Output Directory = リポジトリ直下 `.`）

## 2. ディレクトリ / ファイル構成

### 公開ページ（HTML）
| パス | 内容 |
|---|---|
| `index.html` | **トップページ（`/`）。現在は「語縁 GOEN TOP」自己完結版**（後述§5）。 |
| `goen-top.html` | `index.html` と同一内容（GOEN TOP 自己完結版の固定URL）。 |
| `語縁 ENISHI.html` | ENISHI デザインの **modular 版**（外部CSS/JSを参照する複数ファイル構成のトップ）。※ファイル名に空白と日本語あり。シェルでは必ずクォートする。 |
| `quality.html` `system.html` `service.html` `flow.html` `about.html` `contact.html` `privacy.html` | ENISHI modular 版の下層ページ。 |
| `shinen.html` | 別案「深縁 SHINEN」。 |
| `goen-homepage.html` / `-v2.html` / `-v3.html` | 別案「GOEN Homepage」v1（React/Babel CDN）/ v2 / v3。 |
| `versions.html` | 全バージョンへのハブ（一覧）ページ。`/versions.html`。 |

### 共有アセット
- CSS（7）: `goen.css` `goen-v2.css` `goen-v3.css` `goen-shinen.css` `goen-enishi.css` `goen-enishi-v2.css` `goen-hp.css`
- JS（8）: `goen-scenes.js` `goen-nodes.js` `goen-scroll.js` `goen-lux.js` `goen-hero.js` `goen-thread.js` `goen-v2.js` `goen-v3.js`
- JSX（GOEN Homepage v1 のみが使用・Babelでブラウザ変換）: `goen-tweaks.jsx` `tweaks-panel.jsx`
- 画像: `goen-logo.png`
- 外部CDN: Google Fonts。GOEN Homepage v1 のみ unpkg の React/ReactDOM/Babel。

### Git管理外（ローカルのみ・`.gitignore`で除外）
- `ラグジュアリーUIリデザイン (1).zip` … 元デザイン一式の配布アーカイブ（約108MB）。**元データの出所**。
- `extracted/` … 上記zipの展開物（約146MB）。各バージョンの **modular版／standalone版の原本**が全て入っている。新しいバージョンを公開したいときの取り込み元。
- `.vercel/` … Vercelリンク情報（プロジェクトID等）。`vercel link` で再生成される。

## 3. ローカルプレビュー

ビルド不要。直下で静的サーバを立てるだけ：

```
python -m http.server 8000 --bind 127.0.0.1
# → http://127.0.0.1:8000/
```

`index.html` をブラウザで直接開いても概ね動くが、相対パス解決の都合上サーバ経由を推奨。

## 4. デプロイ（重要）

GitHub と Vercel は連携済み。**main へ push すると Vercel が自動デプロイ**する。
CLI から手動で本番反映する場合（scope 指定が必須）：

```
vercel deploy --prod --yes --scope tyako915s-projects
```

- Vercel プロジェクト: `tyako915s-projects/goen-enishi-hp`
  - projectId: `prj_kzCXGj6HPCEyPQctfQ0hGvgzjJtr`
  - orgId(team): `team_TYI1lMVBxuDhSFiasctXzZZl`
- 新しい環境で未リンクなら先に: `vercel link --yes --scope tyako915s-projects --project goen-enishi-hp`

### デプロイ時の落とし穴（必読）
1. **Vercel は `.gitignore` ではなく `.vercelignore` を見る。** 巨大ファイル（zip・`extracted/`）は `.vercelignore` で除外済み。これらをアップロードに含めると **100MB/ファイル制限**でデプロイが失敗する（`extracted/` 内には25MB級のstandaloneがある）。除外設定を消さないこと。
2. **プロジェクト名に日本語/大文字/空白は不可。** ディレクトリ名「語縁HP」は使えないため `goen-enishi-hp` を明示指定している。
3. GitHub の **100MB/ファイル制限**にも注意（standalone原本はpushしない方針）。

## 5. 現在のトップページの性質（注意）

`index.html` / `goen-top.html` は **バンドラー型の単一HTML**（Anthropic design の "Standalone" 形式）。ENISHIサイト一式を1ファイルに内包し、**ブラウザのJavaScriptが起動時に展開してレンダリング**する（`__bundler_loading` の "Unpacking..." 表示が一瞬出る）。

- 外部ローカル参照は持たない（`data:` とフォントCDNのみ）。**この1ファイルだけで完結**する。
- **JS必須**。JS無効時は `<noscript>` のメッセージのみ。
- ページ内リンクは展開後にアプリ内で処理されるため、サーバ側の追加ファイルは不要。
- **編集はしにくい**（内容が梱包・最小化されている）。テキストや構造を細かく直したい場合は、§7の通り modular 版（`語縁 ENISHI.html` ＋下層ページ＋`goen-*.css/js`）を編集する方が容易。

## 6. よくある変更タスクの手順

### A. トップを modular 版に戻したい（サーバ配信型・編集しやすい）
```
cp "語縁 ENISHI.html" index.html
# 必要なら versions.html の主要カード文言も戻す
```
その後 commit → push（または `vercel deploy --prod ...`）。

### B. 文言・デザインを直したい
- modular 版を編集する: `語縁 ENISHI.html`（トップ本体）／ 各下層 `*.html`／ 共有 `goen-*.css`・`goen-*.js`。
- standalone（`index.html`）を直接編集するのは非推奨（梱包済みのため）。直したい場合は新しい standalone を書き出して差し替える運用にする。

### C. 別バージョンを新規公開したい
1. `extracted/` から対象HTMLと、その参照アセットをコピー（参照確認: 各HTMLの `href/src`）。
2. 公開用にASCIIの分かりやすいファイル名へ（例 `extracted/深縁 SHINEN.html` → `shinen.html`）。
3. `versions.html` にカードを追加。
4. ローカル確認 → commit → push。

### D. 公開URLの確認
```
for p in / /versions.html /shinen.html /goen-homepage.html /goen-top.html; do
  curl -s -o /dev/null -w "%{http_code} $p\n" "https://goen-enishi-hp.vercel.app$p"; done
```

## 7. 規約・注意

- **改行コード**: 既存ファイルは LF。Windows の git 設定で push 時に CRLF 警告が出るが無害。新規ファイルも LF を維持。
- **日本語ファイル名**: `語縁 ENISHI.html` は空白＋日本語。シェルでは必ずダブルクォート、git では `-c core.quotepath=false` を付けると表示が読みやすい。
- **コミット粒度**: 機能単位で。日本語コミットメッセージで運用中。
- **デプロイ前確認**: `git status` と、`.vercelignore` が巨大ファイルを除外したままか確認。

## 8. 元データの出所

- 配布zip: `ラグジュアリーUIリデザイン (1).zip`（ローカルのみ）。展開物が `extracted/`。
- 各バージョンには modular 版（外部参照・編集容易）と standalone 版（自己完結・梱包）が存在する。公開中サイトはこの2形式を使い分けている。
