# mdxcn-pe

**図表は、インストールするものではなく、コピーして育てるもの。**

mdxcn-pe は、shadcn/ui レジストリ方式の ASCII フレーム図表セット mdxcn をプロジェクトに取り込み、1 つのリポジトリから 2 系統の公開物を生成するプロジェクトです。クリエイティブなダッシュボード（Vercel）と、実際に動く使い方ショーケース（GitHub Pages）を常に更新し続けます。

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)
[![Version](https://img.shields.io/badge/version-v0.1.0-blue.svg)](https://github.com/watanabe3tipapa/mdxcn-pe/releases)
[![GitHub Pages](https://img.shields.io/badge/GitHub%20Pages-live-blue.svg)](https://watanabe3tipapa.github.io/mdxcn-pe/)
[![Vercel](https://img.shields.io/badge/Vercel-live-orange.svg)](https://mdxcn-dashboard.vercel.app/)
[![GitHub](https://img.shields.io/github/issues/watanabe3tipapa/mdxcn-pe.svg)](https://github.com/watanabe3tipapa/mdxcn-pe/issues)

[日本語](README.md) | [English](README_en.md)

---

## 概要

mdxcn は「shadcn/add で自分のプロジェクトへコピーする」方式の React 図表セットで、搬入したソースはすべて手元のコードベースに取り込まれます。mdxcn-pe はその実践例として、`graph-bars` / `graph-table` / `graph-timeline` / `graph-frame` を導入し、

1. 本編ダッシュボード（リポジトリルート、Vercel で公開）
2. 使い方ショーケース（`showcase/`、GitHub Actions で GitHub Pages に公開）

の二系統を自動デプロイしています。

## コンセプト（なぜ「コピー」か）

npm パッケージのようにブロックで固定するのではなく、図表のソースを自分のコードベースに**植え、育てる**というのが mdxcn の考え方です。育てたソースは編集も改良も自由ですが、その代わりレジストリ側の更新を忘れると古くなります。本プロジェクトではハッシュベースの同期機構（`.mdxcn-lock.json`）で差分を検知し、`pnpm mdxcn:update` 一つで更新を引き込んで鮮度を保ちます。

主な対応:

- `pnpm dlx shadcn@latest add https://mdxcn.dev/r/<slug>.json` でコンポーネントを導入
- 導入済み: graph-frame / graph-bars / graph-table / graph-timeline
- ダーク / ライト両対応の ASCII フレーム（Geist Mono、`[ TITLE ]`、`+` コーナー）
- ハッシュ管理（`.mdxcn-lock.json`）+ 差分検知スクリプト（`scripts/sync-mdxcn.mjs`）
- Vercel Git 連携 + GitHub Actions による二系統の自動デプロイ

---

## 主な特徴

- Vite 8 / React 19 / TypeScript 6 / Tailwind CSS v4 + shadcn/ui（Nova preset）ベース
- エコシステムへの依存は `motion` とフォントのみで軽量
- `palette`（mono / duo / multi）や `<Series>` 子要素スタイルなど、コンポーネントの使い方をライブデモで紹介
- レジストリ更新を `pnpm mdxcn:status` / `pnpm mdxcn:update` で追跡・適用
- `git push` だけで Vercel（本編）と GitHub Pages（ショーケース）が自動で更新

同期スクリプトの検査例:

- ステータス: 各ファイルのハッシュ照合（`ok` / `changed` / `not found` / `new`）
- 適用: `shadcn add` で上書き → ロック更新 → ビルド成功までを一続きで検証
- 保護: ローカル編集（MODIFIED）を検知したら適用を拒否（`--force` で上書き）

---

## 前提条件

| ツール | 必要バージョン | 確認コマンド |
|---|---:|---|
| Node.js | >= 20 | `node --version` |
| pnpm | >= 10 | `pnpm --version` |
| Git | 任意 (デプロイ・貢献時) | `git --version` |

macOS では `brew install node` で導入し、`npm i -g pnpm` で pnpm を用意できます。CI（GitHub Actions / Vercel）は Node 22 + pnpm 10 を使用しています。

---

## 開始手順（確認できる事実のみ）

1. 依存をインストール（リポジトリルート = 本編ダッシュボード）:

```bash
pnpm install
pnpm dev
```

2. ショーケースを別プロセスで起動:

```bash
cd showcase && pnpm install && pnpm dev
```

3. ビルドとリントで検証:

```bash
pnpm build   # tsc -b && vite build
pnpm lint    # oxlint
```

4. mdxcn レジストリの更新を確認・適用:

```bash
pnpm mdxcn:status   # 差分があれば exit 1 で検知
pnpm mdxcn:update   # 上書き → ロック更新 → ビルド検証
```

5. デプロイは `git push` で発火:

- Vercel（本編ダッシュボード）: Git 連携で自動 Production デプロイ
- GitHub Pages（ショーケース）: `.github/workflows/deploy-showcase.yml` が `showcase/**` の変更で実行

---

## オンライン編集（Quarto Editor PE）

ローカルに開発環境を組み立てなくても、ブラウザからリポジトリ内の Markdown / Quarto 文書を編集・コミットできます。[Quarto Editor PE](https://quarto-editor-pe.vercel.app/editor) は GitHub OAuth でリポジトリへ直接アクセスするため、エディタでの保存がそのまま GitHub へのコミットになり、GitHub Actions と Vercel Git 連携が後続のデプロイを引き継ぎます。

1. [Quarto Editor PE](https://quarto-editor-pe.vercel.app/editor) を開く
2. デプロイ（`デプロイ`）→ 接続設定（`接続設定`）で GitHub を選び、OAuth（PKCE）または Personal Access Token（`repo` スコープ）で接続
3. リポジトリ `watanabe3tipapa/mdxcn-pe` を開き、`README.md` などのファイルを編集
4. 保存（コミット）すると `main` に反映され、GitHub Actions と Vercel が自動で更新

深層リンクで編集を即座に開始できます:

```text
https://quarto-editor-pe.vercel.app/editor?repo=watanabe3tipapa%2Fmdxcn-pe&file=README.md&ref=main
```

注意点:

- GitHub Pages のワークフローは `showcase/**` の変更でのみ発火します。ルート配下のドキュメント（README など）の変更は、Vercel の自動デプロイのみが走ります。
- エディタは研究・検証用途の実験的ツールです。接続トークンは端末内（IndexedDB）に暗号化保存されますが、重要な変更はコミット前にレビューしてください。

---

## リポジトリ構成（主なファイル・ディレクトリ）

- src/ — 本編ダッシュボード（Vite + React アプリ）
- showcase/ — 使い方ショーケース（独立した Vite アプリ、`base: /mdxcn-pe/`）
- scripts/ — mdxcn 同期スクリプト（`scripts/sync-mdxcn.mjs`）
- .github/workflows/ — GitHub Pages デプロイのワークフロー
- components.json, vercel.json, .mdxcn-lock.json, .oxlintrc.json

---

## コントリビューション

コントリビューションは歓迎します。大きな変更は事前に issue を立ててください。

基本的なワークフロー:

1. リポジトリをフォーク
2. 機能ブランチを作成 (`git checkout -b feature/your-feature`)
3. 変更をコミット (`git commit -m 'Add your change'`)
4. ブランチをプッシュし、Pull Request を作成

詳細はリポジトリの Issue ページを参照してください。

---

## 連絡先 / 公開サイト

- GitHub: https://github.com/watanabe3tipapa/mdxcn-pe
- 本編ダッシュボード (Vercel): https://mdxcn-dashboard.vercel.app/
- ショーケース (GitHub Pages): https://watanabe3tipapa.github.io/mdxcn-pe/
- mdxcn 公式サイト: https://mdxcn.dev/

---

## ライセンス

MIT ライセンス — 詳細は LICENSE ファイルを参照してください。

---

## 開発・保守状態

- リポジトリはアーカイブされていません。
- 最終更新: 2026-09-25 (リポジトリ情報に基づく)