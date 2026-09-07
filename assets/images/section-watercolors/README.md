# GOEN 京都水彩背景

2026-09-06 作成。built-in image_gen 使用（CLI不使用）。

参照: assets/images/hero-kyoto.webp（画風のみ）。地理的に正確な記録ではなく京都をモチーフにした創作です。
各PNGは生成原本。WebPは1774px版と900px版を作成済み。

## 本番反映（2026-09-06）

- ユーザーの明示的な公開指示を受け、PCの11セクション・モバイルの既存8セクションへ組み込み。
- 共通CSS: assets/css/goen-section-watercolors.css?v=20260906-watercolor-1
- TOP・動画・既存本文・リンクは変更なし。画像は遅延読み込み、装飾扱い。
- 現作業フォルダはGit管理外のため、公開リポジトリを隣接の goen-publish-watercolor-20260906 にcloneし、今回の26ファイルだけをコミット。
- 公開前コミット: 0c7b623。公開コミット: 1c18979。origin mainへpush済み。
- 本番: https://goen-enishi.vercel.app/
- ローカル検証: 1440 / 1920 / 390 / 375px、横はみ出し・コンソールエラー・画像404なし。
- 検証スクリプト: _tools/check_section_watercolors.py（引数に本番ベースURLを渡すと本番検証）。

## 共通プロンプト

Use case: illustration-story. Create one standalone wide 2:1 raster watercolor background for a Japanese corporate website GOEN. Reference image is STYLE ONLY, not a composition to copy. Match its delicate pale watercolor washes, restrained graphite-like outlines, airy white paper, extremely low contrast sage greens, warm grey, muted ochre gold. Scene details only at outer edges and bottom 20-30%; at least central and upper 70% pure nearly white open negative space for long website text. Soft irregular watercolor edges dissolve naturally into pure white without a rectangular panel or vignette. Elegant, warm, approachable hand-painted Kyoto local atmosphere. No text, lettering, logo, people, phones, UI, collage, watermark, bold orange or saturated red. No repeated pagoda/torii/Kyoto tower skyline from reference. Landscape canvas approx 2048x1024 or larger. Scene: 

## 各画像の追加プロンプト

### quality-v1.png — 嵯峨野の竹林

Slim Sagano bamboo trunks clustered at lower right, soft small fern leaves lower left. Quiet craftsmanship; no buildings.

### problem-v1.png — 石畳の路地

An empty Kyoto narrow stone alley curving out of view, small lattice facades at lower left only. No skyline or pagoda.

### system-v1.png — 鴨川の飛び石

Kamo River stepping stones in a gently connected diagonal across the bottom, delicate water ripples and tiny riverside grasses.

### service-v1.png — 宇治の茶畑

Uji tea terraces, softly curved rows following a low hill across lower right; a few tea leaves lower left. No architecture.

### works-v1.png — 京町家の軒並み

A close cropped sequence of Kyoto machiya eaves and wooden lattice windows along the lower edge, asymmetrical and architectural, no monuments.

### insight-v1.png — 円窓と青もみじ

A partial round wooden window at far right framing fresh green maple leaves, sparse brush strokes, contemplative interior detail.

### plans-v1.png — 枯山水の庭

A small dry rock garden at bottom left, three irregular stones with moss, pale raked sand arcs extending along bottom.

### flow-v1.png — 哲学の道

A canal-side stone footpath with delicate pale cherry blossom branches at lower right, receding gently along the bottom.

### faq-v1.png — 蹲と庭の緑

Kyoto garden stone water basin and slender bamboo water spout in bottom right, tiny water rings and sparse moss. No deer scarer mechanism.

### about-v1.png — 暖簾のある町家

A welcoming machiya entrance at bottom left, blank sage fabric noren and warm timber doorway, a small potted plant.

### contact-v1.png — 鴨川の橋と夕景

A low understated bridge across the Kamo River along bottom right at pale golden dusk, distant faint willow silhouettes. No city skyline.
