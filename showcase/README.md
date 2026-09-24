# mdxcn showcase

mdxcn コンポーネントの使い方ショーケースです。ライブデモとコード例を GitHub Pages で公開しています。

- 公開サイト: https://watanabe3tipapa.github.io/mdxcn-pe/
- プロジェクト全体の説明は [リポジトリ直下の README](../README.md) をご覧ください。
- 起動: `pnpm install && pnpm dev`（GitHub Pages 用に `base: /mdxcn-pe/` を設定済み）
- デプロイ: `.github/workflows/deploy-showcase.yml` が `showcase/**` の変更で自動実行

## mdxcn の更新

このディレクトリにも同期スクリプトが入っています。

```bash
pnpm mdxcn:status   # 差分検知
pnpm mdxcn:update   # 上書き → ロック更新 → ビルド検証
```