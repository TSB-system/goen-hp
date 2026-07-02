# AGENTS.md — 語縁 GOEN ランディングページ 引き継ぎ書

> このファイルは Codex / Claude Code などのコーディングエージェント向けの作業指示書です。
> 人間が読んでも構いません。作業前に必ず通読してください。

> **⚠️ 最新の状況は末尾の「§10 現在の本番構成（2026-07-02 更新）」を最優先で読むこと。**
> §1・§4・§5・§9 は歴史的経緯を含み、一部は現状と異なる（トップページのデザインが変更済みなど）。矛盾する場合は §10 を正とする。

## 1. プロジェクト概要

- **目的**: 「語縁 GOEN」（地域店舗・個人事業主向け LP・HP制作 × Web集客導線設計）のブランドサイト。
- **種類**: ビルド不要の**静的サイト**（プレーン HTML/CSS/JS）。フレームワーク・パッケージマネージャ・ビルド工程は一切なし。`npm install` 不要。
- **本番URL**: https://goen-enishi.vercel.app/
- **GitHub（Public）**: https://github.com/TSB-system/goen-hp　※これが唯一の本番リポジトリ（詳細は §10）
- **ホスティング**: Vercel（静的配信、Output Directory = リポジトリ直下 `.`）

## 2. ディレクトリ / ファイル構成

### 公開ページ（HTML）
| パス | 内容 |
|---|---|
| `index.html` | **トップページ（`/`）。現在は GOEN Line デザインを反映済み**（§10参照）。 |
| `goen-top.html` | 旧トップの固定URL（GOEN Living Orbit v4、履歴的経緯は §9）。 |
| `語縁 ENISHI.html` | 旧トップの編集元。※ファイル名に空白と日本語あり。シェルでは必ずクォートする。 |
| `quality.html` `system.html` `service.html` `flow.html` `about.html` `contact.html` `privacy.html` | ENISHI modular 版の下層ページ。 |
| `shinen.html` | 別案「深縁 SHINEN」。 |
| `goen-homepage.html` / `-v2.html` / `-v3.html` | 別案「GOEN Homepage」v1（React/Babel CDN）/ v2 / v3。 |
| `versions.html` | 全バージョンへのハブ（一覧）ページ。`/versions.html`。 |
| `goen-line.html` | **現行トップの実体（PC向け）**。「静かな高級感デザイン」。詳細は §10。 |
| `goen-line-mobile.html` | **現行トップのモバイル版**。`vercel.json` のUA判定でルート `/` から自動的にこちらへリダイレクトされる。 |

### 共有アセット
- CSS: `goen.css` `goen-v2.css` `goen-v3.css` `goen-shinen.css` `goen-enishi.css` `goen-enishi-v2.css` `goen-hp.css` `goen-living-orbit.css`（旧トップ系）／ `goen-line.css` `goen-line-mobile.css`（現行トップ、`assets/css/` 配下）
- JS: `goen-scenes.js` `goen-nodes.js` `goen-scroll.js` `goen-lux.js` `goen-hero.js` `goen-thread.js` `goen-v2.js` `goen-v3.js`（旧トップ系）／ `goen-line.js` `goen-line-mobile.js`（現行トップ、`assets/js/` 配下）
- JSX（GOEN Homepage v1 のみが使用・Babelでブラウザ変換）: `goen-tweaks.jsx` `tweaks-panel.jsx`
- 画像: `assets/images/goen-logo.png` 他、`assets/images/` 配下に集約済み。
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

GitHub と Vercel は連携済み。**main へ push すると Vercel が自動デプロイ**する（Git連携の確立時期に関する注意は §10.2 参照）。

- Vercel プロジェクト: `hp`（`tsb-system's projects` team、**Hobbyプラン**）
- 本番ドメイン: `goen-enishi.vercel.app`
- Build設定: Framework=Other、Build Command=なし、Output Directory=`.`

### デプロイ時の落とし穴（必読）
1. **Vercel は `.gitignore` ではなく `.vercelignore` を見る。** 巨大ファイル（zip・`extracted/`）は `.vercelignore` で除外済み。これらをアップロードに含めると **100MB/ファイル制限**でデプロイが失敗する（`extracted/` 内には25MB級のstandaloneがある）。除外設定を消さないこと。
2. GitHub の **100MB/ファイル制限**にも注意（standalone原本はpushしない方針）。
3. **Hobbyプランのため、Vercel team へのメンバー追加が制限されている可能性が高い。** デプロイ権限が必要な場合は、Vercel側の招待ではなく GitHub 連携（push→自動デプロイ）を優先すること。

## 5. 現在のトップページの性質（重要・更新済み）

**トップページ（`/`）は GOEN Line デザインに置き換わっている。** 旧デザイン（GOEN Living Orbit v4）の説明は §9 に歴史的記録として残すが、**現状には適用されない**。

- PC: `index.html`（＝`goen-line.html` と同内容）を直接配信。
- スマホ: `vercel.json` の `redirects` ルールで、User-Agent が `iPhone|iPod|Android.*Mobile|Windows Phone|BlackBerry|IEMobile|Opera Mini` にマッチする場合、`/` へのアクセスを `/goen-line-mobile.html` へ307リダイレクトする。
- デザインコンセプト：「静かな高級感」「見つかる、信頼される、相談される。その流れを一本の線で整える。」。生成り／墨黒／深緑／控えめなゴールドを基調とし、カード型UI・白い四角ボックスを使わない。詳細は §10.3。
- 旧トップ（`goen-top.html` / `語縁 ENISHI.html`）は `versions.html` から引き続き参照可能（アーカイブとして残置）。

## 6. よくある変更タスクの手順

### A. 現行トップ（GOEN Line）を編集したい
- PC: `goen-line.html` ＋ `assets/css/goen-line.css` ＋ `assets/js/goen-line.js`
- モバイル: `goen-line-mobile.html` ＋ `assets/css/goen-line-mobile.css` ＋ `assets/js/goen-line-mobile.js`
- **PC版とモバイル版は別ファイル・別CSS/JSの独立実装**。どちらかを直すとき、もう片方への反映漏れに注意。
- `index.html` は `goen-line.html` と同内容にしておくこと（ルートで配信されるのは `index.html`）。

### B. 旧デザイン資産を参照したい
- `語縁 ENISHI.html` / `goen-living-orbit.css` など、§9 に記載の旧トップ実装は削除せず残っている。過去バージョンとの比較や巻き戻しの参考に。

### C. 別バージョンを新規公開したい
1. `extracted/` から対象HTMLと、その参照アセットをコピー（参照確認: 各HTMLの `href/src`）。
2. 公開用にASCIIの分かりやすいファイル名へ。
3. `versions.html` にカードを追加。
4. ローカル確認 → ブランチ作成 → PR → マージ（§10.2 参照、直接pushしない）。

### D. 公開URLの確認
```
for p in / /goen-line.html /goen-line-mobile.html /versions.html /shinen.html; do
  curl -s -o /dev/null -w "%{http_code} $p\n" "https://goen-enishi.vercel.app$p"; done
```

## 7. 規約・注意

- **改行コード**: 既存ファイルは LF。Windows の git 設定で push 時に CRLF 警告が出るが無害。新規ファイルも LF を維持。
- **日本語ファイル名**: `語縁 ENISHI.html` は空白＋日本語。シェルでは必ずダブルクォート、git では `-c core.quotepath=false` を付けると表示が読みやすい。
- **コミット粒度**: 機能単位で。日本語コミットメッセージで運用中。
- **デプロイ前確認**: `git status` と、`.vercelignore` が巨大ファイルを除外したままか確認。

## 8. 元データの出所

- 配布zip: `ラグジュアリーUIリデザイン (1).zip`（ローカルのみ）。展開物が `extracted/`。
- 各バージョンには modular 版（外部参照・編集容易）と standalone 版（自己完結・梱包）が存在する。
- GOEN Line 以前の公開トップは modular 版。standalone 原本は比較・再取り込み用途として `extracted/` に残す。

## 9. 【歴史的記録・現状には非適用】旧トップ実装引き継ぎ（2026-06-14）

> ⚠️ 以下は GOEN Living Orbit v4 がトップページだった時代の記録。**2026-07-02 時点でトップは GOEN Line に置き換わっており、本セクションの内容は現状と異なる。** 過去の経緯を知りたい場合のみ参照。

### 9.1 実装済みだった内容（当時）

- 左側: 対象顧客、メインコピー、成果説明、補助コピー、2つのCTA、安心材料。
- 右側: 中央ブランドプレート、3層リング、6サービスカード、相談カード強調、光の導線、成果導線コピー。
- カード表記: `HP制作` `LP制作` `MEO対策` `公式LINE` `SNS運用代行` `ご相談`。
- PC: 左右2カラム。スマホ: 中央プレート＋6カードの2列グリッド。
- 黒背景、ネオン、粒子、星座風の線、回転し続けるカードは使用していない。

### 9.2 編集箇所（当時）

- TOP構造: `語縁 ENISHI.html` の `section#hero`。
- TOP専用デザイン・レスポンシブ・演出: `goen-living-orbit.css`。
- 公開用コピー: `index.html` と `goen-top.html`（当時は3ファイル同一内容）。

### 9.3 当時のGitHub / Vercel情報（別リポジトリでの記録）

- 当時の実装は `tyako915/goen-enishi-hp`（別リポジトリ、現在は本プロジェクトの運用対象外。§10.4参照）で行われていた。
- 本リポジトリ（`TSB-system/goen-hp`）の `main` は、そのリポジトリの `c61ebc6`（コミットメッセージ「revised版に合わせ6セクションを刷新」）までを共通の起点として持つ。

## 10. 現在の本番構成（2026-07-02 更新）

> このセクションが現在の状態の正。矛盾する記述があれば、ここを優先する。

### 10.1 リポジトリ運用方針（重要）

- **`TSB-system/goen-hp` が唯一の本番リポジトリである。** ユーザーの明示的な指示により、以前並行して運用されていた `tyako915/goen-enishi-hp`（Private）は**運用対象外**となった。
- 今後のエージェントは `tyako915/goen-enishi-hp` への同期・参照を試みる必要はない。GitHub CLI認証も本リポジトリの組織アカウント（`TSB-system`）で行うことを想定する。
- **`main` への直接pushは安全機構でブロックされる。** 変更は必ず フィーチャーブランチ → Pull Request → （人間によるレビュー・マージ）の流れを取ること。自動化されたエージェントによる自己PRの自己マージも同様にブロックされるため、マージは人間に依頼すること。

### 10.2 GOEN Line 化の経緯

1. `feat/goen-line-web-mobile` ブランチで PR [#1](https://github.com/TSB-system/goen-hp/pull/1) を作成し、`goen-line.html`（PC）・`goen-line-mobile.html`（モバイル）と専用CSS/JS/画像/モック画像一式を追加してマージ（マージコミット `f429472`）。
2. マージ時点では `hp` プロジェクトのVercel Git連携が未設定（手動アップロードのみ）だったため自動デプロイされず、`chore/trigger-vercel-deploy` ブランチのPR [#2](https://github.com/TSB-system/goen-hp/pull/2) をトリガーに初回デプロイを実行。
3. その後、別の担当者により `index.html` 等がGOEN Lineの内容に置き換えられ（コミット `b5f75f3` 他）、`vercel.json` にUser-Agent判定のモバイルリダイレクトが追加された（コミット `c661781`）。加えて、SCROLL線位置・ロゴ色・CONTACTボタンサイズ等の細部調整が複数コミットで行われている。
4. 現在、`/` へのアクセスは PC で GOEN Line（PC版）を直接表示、モバイルUAでは `/goen-line-mobile.html` へ307リダイレクトする構成で安定稼働している。

### 10.3 GOEN Line デザインの要点

- コンセプト：「静かな高級感」「見つかる、信頼される、相談される。その流れを一本の線で整える。」
- 配色：生成り（アイボリー）・墨黒・深いグリーン・控えめなゴールド。原色グリーンや黒ベタは使わない。
- レイアウト方針：カード型UI・白い四角ボックスの連続を禁止。番号・細い罫線・余白・導線モチーフ（線が伸びる演出等）で情報を整理する。
- タイポグラフィ：英字見出しをビジュアル要素として大きく扱い、日本語見出しは明朝体とゴシック体を使い分ける。
- 詳細な要件定義は `docs2/goen-line-mobile-redesign-proposal.md` を参照（モバイル版のCVR改善観点を中心にまとめたもの）。

### 10.4 次の担当者への注意

- PC版とモバイル版は完全に独立したHTML/CSS/JSファイル。一方を修正したら、もう一方にも同様の修正が必要か必ず確認する。
- `index.html` は `goen-line.html` と内容を同期させる運用になっている（`index.html` がルートで配信される実体）。`goen-line.html` を編集したら `index.html` にも反映すること。
- `vercel.json` の User-Agent 正規表現を変更する際は、既存の主要モバイルブラウザ（iPhone/Android/Windows Phone等）を漏らさないこと。
- Vercelプロジェクトは Hobbyプランのため、チームメンバー追加ではなく GitHub 連携（push→自動デプロイ）を通じたデプロイを基本とする。
- 旧リポジトリ `tyako915/goen-enishi-hp` は参照・同期の対象外（§10.1）。過去の実装経緯を知りたい場合のみ §9 を参照する。
