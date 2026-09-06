# 連続水彩背景の実装

2026-09-06。背景案確認後、ユーザーの「本番に反映してください」を受けて実装。

- TOPは対象外。QUALITYからCONTACTを `.watercolor-content` で包む。
- wrapperのclip-pathにより固定背景を対象範囲内だけに表示する。
- `.continuous-scape` はpicture 1つ・img 1つ。PC/モバイルで同じ風景の構図違いを選択。
- 画像をcontainで表示し、縦横比と画像全体を維持。セクション単位の画像切替・反復・並置なし。
- 既存のセクション別装飾picture、試作の2枚並置 `.page-art` を置き換え。旧画像ファイルは削除しない。
- 本文領域の白い薄膜とINSIGHTの濃色文字を維持。TOP・文章・リンクは公開コミット ff8d7de と照合。
- 素材: assets/images/continuous-watercolor/kyoto-desktop-v1.webp（1586×992）、kyoto-mobile-v1.webp（941×1672）。
- 原画/生成プロンプト: design-proposals/continuous-watercolor-v1/（作業フォルダに保存）。
- CSS: assets/css/goen-section-watercolors.css?v=20260906-watercolor-continuous
- 検証: _tools/check_continuous_production.py。1440/1920/2560/390/375幅、全セクション冒頭/中央/末尾、単一画像、contain、PC同期、本文・リンク不変、横はみ出し、画像404、コンソールエラー、FAQ・モバイルメニュー。
- 実機iOS Safari/Android Chromeでの確認は未実施。デスクトップChromeの各画面幅で検証。
- 公開作業コピー: C:/Users/shirai kohei/Desktop/goen-publish-watercolor-20260906（origin: TSB-system/goen-hp）。
