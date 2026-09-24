# mdxcn-pe

**Charts are not installed — they are copied, then cultivated.**

mdxcn-pe is a project that pulls in mdxcn, an ASCII-framed chart set distributed via the shadcn/ui registry format, and publishes two artifacts from a single repository: a creative dashboard (Vercel) and a working usage showcase (GitHub Pages), keeping both continuously up to date.

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)
[![Version](https://img.shields.io/badge/version-v0.1.0-blue.svg)](https://github.com/watanabe3tipapa/mdxcn-pe/releases)
[![GitHub Pages](https://img.shields.io/badge/GitHub%20Pages-live-blue.svg)](https://watanabe3tipapa.github.io/mdxcn-pe/)
[![Vercel](https://img.shields.io/badge/Vercel-live-orange.svg)](https://mdxcn-dashboard.vercel.app/)
[![GitHub](https://img.shields.io/github/issues/watanabe3tipapa/mdxcn-pe.svg)](https://github.com/watanabe3tipapa/mdxcn-pe/issues)

[Japanese](README.md) | [English](README_en.md)

---

## Overview

mdxcn is a React chart set that is "copied into your project via `shadcn/add`" — every fetched source becomes part of your own codebase. mdxcn-pe is a working example that installs `graph-bars` / `graph-table` / `graph-timeline` / `graph-frame` and auto-deploys:

1. The main dashboard (repository root, published on Vercel)
2. The usage showcase (`showcase/`, published on GitHub Pages via GitHub Actions)

## Concept (why "copy")

Instead of locking charts into an npm package, mdxcn treats chart source as something you **plant and cultivate** in your codebase. Cultivated source is fully editable and improvable, but you risk it becoming stale when the registry moves on. This project tracks that drift with a hash-based sync mechanism (`.mdxcn-lock.json`), detects differences, and pulls in updates with `pnpm mdxcn:update`.

Highlights:

- Install components with `pnpm dlx shadcn@latest add https://mdxcn.dev/r/<slug>.json`
- Included components: graph-frame / graph-bars / graph-table / graph-timeline
- Dark/light ASCII frames (Geist Mono, centered `[ TITLE ]`, `+` corners)
- Hash tracking (`.mdxcn-lock.json`) + diff-detection script (`scripts/sync-mdxcn.mjs`)
- Dual auto-deploy via Vercel Git integration and GitHub Actions

---

## Features

- Built on Vite 8 / React 19 / TypeScript 6 / Tailwind CSS v4 + shadcn/ui (Nova preset)
- Light runtime: only `motion` and a font are needed on top of the copied source
- Live demos cover `palette` (mono / duo / multi) and the `<Series>` children style
- Registry updates are tracked and applied with `pnpm mdxcn:status` / `pnpm mdxcn:update`
- A single `git push` refreshes Vercel (dashboard) and GitHub Pages (showcase)

What the sync script checks:

- Status: hash comparison per file (`ok` / `changed` / `not found` / `new`)
- Apply: `shadcn add` overwrite → lock update → successful build, verified end to end
- Guard: local edits (MODIFIED) block applying until `--force` is passed

---

## Prerequisites

| Tool | Minimum | Check |
|---|---:|---|
| Node.js | >= 20 | `node --version` |
| pnpm | >= 10 | `pnpm --version` |
| Git | any (deploy / contribution) | `git --version` |

On macOS, install Node with `brew install node` and enable pnpm with `npm i -g pnpm`. The CI (GitHub Actions / Vercel) uses Node 22 and pnpm 10.

---

## Getting started (facts you can verify)

1. Install dependencies (repository root = the main dashboard):

```bash
pnpm install
pnpm dev
```

2. Run the showcase in a second process:

```bash
cd showcase && pnpm install && pnpm dev
```

3. Verify with a build and lint:

```bash
pnpm build   # tsc -b && vite build
pnpm lint    # oxlint
```

4. Check for and apply mdxcn registry updates:

```bash
pnpm mdxcn:status   # exits with 1 when a diff is detected
pnpm mdxcn:update   # overwrite → lock update → build verification
```

5. Deploy by pushing:

- Vercel (main dashboard): automatic Production deploy via Git integration
- GitHub Pages (showcase): `.github/workflows/deploy-showcase.yml` runs on `showcase/**` changes

---

## Online editing (Quarto Editor PE)

Edit and commit Markdown / Quarto documents in the repository from the browser, without setting up a local environment. [Quarto Editor PE](https://quarto-editor-pe.vercel.app/editor) accesses the repository directly via GitHub OAuth, so saving in the editor is a commit to GitHub — the GitHub Actions workflow and the Vercel Git integration then take over deployment.

1. Open [Quarto Editor PE](https://quarto-editor-pe.vercel.app/editor)
2. In the deploy menu (`デプロイ`), open connection settings (`接続設定`), pick GitHub, and connect with OAuth (PKCE) or a Personal Access Token (`repo` scope)
3. Open the repository `watanabe3tipapa/mdxcn-pe` and edit files such as `README.md`
4. Save (commit) to push to `main`; GitHub Actions and Vercel update the sites automatically

Deep-link to start editing immediately:

```text
https://quarto-editor-pe.vercel.app/editor?repo=watanabe3tipapa%2Fmdxcn-pe&file=README.md&ref=main
```

Notes:

- The GitHub Pages workflow only fires on changes under `showcase/`. Changes to root-level documents (such as README) only trigger the automatic Vercel deploy.
- The editor is an experimental tool meant for research and evaluation. Connection tokens are stored encrypted in the browser (IndexedDB), but review important changes before pushing.

---

## Repository layout (main files and directories)

- src/ — the main dashboard (Vite + React app)
- showcase/ — the usage showcase (standalone Vite app, `base: /mdxcn-pe/`)
- scripts/ — mdxcn sync script (`scripts/sync-mdxcn.mjs`)
- .github/workflows/ — GitHub Pages deployment workflow
- components.json, vercel.json, .mdxcn-lock.json, .oxlintrc.json

---

## Contributing

Contributions are welcome. For significant changes, please open an issue first.

Basic workflow:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/your-feature`)
3. Commit your changes (`git commit -m 'Add your change'`)
4. Push the branch and open a Pull Request

See the repository's Issues page for details.

---

## Links / public sites

- GitHub: https://github.com/watanabe3tipapa/mdxcn-pe
- Main dashboard (Vercel): https://mdxcn-dashboard.vercel.app/
- Showcase (GitHub Pages): https://watanabe3tipapa.github.io/mdxcn-pe/
- mdxcn official site: https://mdxcn.dev/

---

## License

MIT License — see the LICENSE file for details.

---

## Maintenance status

- The repository is not archived.
- Last updated: 2026-09-25 (based on repository information)