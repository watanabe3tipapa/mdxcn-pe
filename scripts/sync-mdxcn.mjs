#!/usr/bin/env node
/**
 * mdxcn コンポーネントの更新検知・即時適用
 *
 * mdxcn のコンポーネントは「ソースをプロジェクトへコピーする」方式なので、
 * レジストリ側の更新は手動で shadcn add を再実行しないと反映されません。
 * このスクリプトはインストール済みバージョン（.mdxcn-lock.json）と
 * レジストリの最新版を比較し、更新の検知と適用を自動化します。
 *
 *   node scripts/sync-mdxcn.mjs [status|apply]
 *
 *   status  レジストリ最新版とローカル状態を比較して表を表示。
 *           更新がある場合は終了コード 1（CI で利用可能）。
 *   apply   レジストリの最新版を shadcn CLI で上書きインストールし、
 *           ロックを更新してビルド確認まで実行。
 */

import { spawnSync } from "node:child_process"
import { createHash } from "node:crypto"
import { existsSync, readFileSync, writeFileSync } from "node:fs"
import { resolve, dirname, extname } from "node:path"
import { fileURLToPath } from "node:url"

const __dirname = dirname(fileURLToPath(import.meta.url))
const ROOT = resolve(__dirname, "..")
const LOCK_FILE = resolve(ROOT, ".mdxcn-lock.json")

const REGISTRY = "https://mdxcn.dev/r"

/** 追跡する mdxcn コンポーネント（レジストリスラッグ） */
const COMPONENTS = [
  "graph-frame",
  "graph-bars",
  "graph-table",
  "graph-timeline",
]

/** レジストリパス → ローカルパス（shadcn CLI が実際に書き出す場所に合わせる） */
function toLocalPath(registryPath) {
  const rel = registryPath.replace(/^registry\/default\//, "")
  const segments = rel.split("/")
  const name = segments[segments.length - 1]
  const pkg = segments.length > 1 ? segments[0] : null

  const src = resolve(ROOT, "src")
  if (pkg === "graph-frame") {
    if (extname(name) === ".ts") {
      return resolve(src, "lib", name)
    }
    return resolve(src, "components", "ui", name)
  }
  return resolve(src, "components", name)
}

/**
 * 比較用の正規化。shadcn CLI はインストール時に以下を行うため、レジストリ内容と
 * ローカルファイルを同じ基準で扱う:
 *  - "use client" バナーを除去
 *  - 内部 import を "@/registry/default/..." → "@/components" / "@/components/ui" /
 *    "@/lib" に書き換え
 *  - 末尾の空白を無視
 */
let normalize = (content) =>
  String(content)
    .replace(/^\uFEFF?("use client"|"use server");?\s*\n+/u, "")
    .replace(/\s+$/u, "")

/** レジストリファイル一覧から import specifier の変換マップを構築する */
function specMap(registryFiles) {
  const map = new Map()
  for (const regPath of registryFiles.keys()) {
    const key = regPath.replace(/\.(tsx|ts)$/u, "")
    const local = toLocalPath(regPath)
    const spec = local
      .replace(resolve(ROOT, "src") + "/", "@/")
      .replace(/\.(tsx|ts)$/u, "")
    map.set(key, spec)
  }
  return map
}

function setNormalizer(registryFiles) {
  const specs = specMap(registryFiles)
  normalize = (content) =>
    String(content)
      .replace(/^\uFEFF?("use client"|"use server");?\s*\n+/u, "")
      .replace(/("@\/([^"]+)")/g, (match, full, key) => {
        const spec = specs.get(key)
        return spec ? `"${spec}"` : match
      })
      .replace(/\s+$/u, "")
}

/** 正規化後の sha256 */
function hashOf(content) {
  return createHash("sha256").update(normalize(content)).digest("hex")
}

function fileHash(path) {
  if (!existsSync(path)) return null
  return hashOf(readFileSync(path, "utf8"))
}

function readLock() {
  if (!existsSync(LOCK_FILE)) return null
  try {
    return JSON.parse(readFileSync(LOCK_FILE, "utf8"))
  } catch {
    return null
  }
}

function writeLock(files) {
  const lock = {
    schema: 1,
    updatedAt: new Date().toISOString(),
    files,
  }
  writeFileSync(LOCK_FILE, JSON.stringify(lock, null, 2) + "\n")
}

function pad(text, width) {
  return String(text).padEnd(width)
}

function fetchJson(url) {
  return fetch(url).then(async (res) => {
    if (!res.ok) throw new Error(`GET ${url} -> ${res.status}`)
    return res.json()
  })
}

/** 追跡中コンポーネントすべてのレジストリ情報を取得し、ファイル一覧を返す */
async function fetchRegistryFiles() {
  const out = new Map()
  for (const slug of COMPONENTS) {
    const json = await fetchJson(`${REGISTRY}/${slug}.json`)
    for (const file of json.files ?? []) {
      out.set(file.path, file.content)
    }
  }
  return out
}

/** registryPath の集合からローカルに存在しない依存パスを警告用に返す */
function localMap(registryFiles) {
  const map = new Map()
  for (const [regPath, content] of registryFiles) {
    map.set(toLocalPath(regPath), { regPath, content })
  }
  return map
}

async function runStatus() {
  console.log("Fetching mdxcn registry...")
  let registryFiles
  try {
    registryFiles = await fetchRegistryFiles()
  } catch (err) {
    console.error(`Failed to reach ${REGISTRY}: ${err.message}`)
    process.exit(2)
  }
  setNormalizer(registryFiles)

  const lock = readLock()
  let baseline = false
  if (!lock) {
    const files = {}
    for (const [local] of localMap(registryFiles)) {
      const hash = fileHash(local)
      if (hash !== null) files[resolve(local)] = hash
    }
    writeLock(files)
    baseline = true
  }
  const entries = [...localMap(registryFiles).entries()].sort((a, b) =>
    a[0].localeCompare(b[0])
  )

  let pending = 0
  console.log("")
  console.log("  FILE                               STATUS")
  console.log("  " + "-".repeat(56))

  for (const [local, { content }] of entries) {
    const display = local.replace(resolve(ROOT) + "/", "")
    const localHash = fileHash(local)
    const regHash = hashOf(content)
    const lockHash = readLock()?.files?.[resolve(local)] ?? null

    let status
    if (localHash === null) {
      status = "NEW"
      pending++
    } else if (lockHash === null) {
      status = "TRACKING" // 初回ロック作成のため記録のみ
    } else if (regHash !== lockHash && localHash === lockHash) {
      status = "UPDATE" // レジストリに更新あり
      pending++
    } else if (regHash === localHash) {
      status = "ok"
    } else {
      status = "MODIFIED" // ローカルに独自変更
    }
    console.log(`  ${pad(display, 38)} ${status}`)
  }

  // CSS 変数の最低限の健全性チェック
  const css = readFileSync(resolve(ROOT, "src/index.css"), "utf8")
  const hasGraphVars = css.includes("--graph-accent:") && css.includes("graph-rule")
  if (!hasGraphVars) {
    console.log("\n  ! src/index.css に mdxcn の CSS 変数 / @utility が見つかりません。apply を実行してください。")
    pending++
  }

  console.log("")
  if (baseline) {
    console.log(`Lock created (baseline): ${LOCK_FILE}`)
  }
  if (pending > 0) {
    console.log(`Result: ${pending} update(s) pending. Run: pnpm mdxcn:update`)
    process.exit(1)
  }
  console.log("Result: up to date.")
}

/** ローカルがロックと異なる（独自変更が入っている）ファイル一覧 */
function findModified(registryFiles) {
  const lock = readLock()
  if (!lock) return []
  const mods = []
  for (const regPath of registryFiles.keys()) {
    const local = toLocalPath(regPath)
    const localHash = fileHash(local)
    const lockHash = lock?.files?.[resolve(local)] ?? null
    if (localHash !== null && lockHash !== null && localHash !== lockHash) {
      mods.push(local.replace(resolve(ROOT) + "/", ""))
    }
  }
  return mods
}

async function runApply() {
  let registryFiles
  try {
    registryFiles = await fetchRegistryFiles()
  } catch (err) {
    console.error(`Failed to reach ${REGISTRY}: ${err.message}`)
    process.exit(2)
  }
  setNormalizer(registryFiles)

  const mods = findModified(registryFiles)
  if (mods.length > 0 && !force) {
    console.error("Local modifications detected. apply はこれらのファイルを上書きします:")
    for (const file of mods) console.error(`  - ${file}`)
    console.error("変更をコミット/退避するか、`apply --force` で上書きしてください。")
    process.exit(1)
  }

  const urls = COMPONENTS.map((slug) => `${REGISTRY}/${slug}.json`)
  console.log(`Installing: ${urls.join(" ")}`)
  const result = spawnSync("pnpm", ["dlx", "shadcn@latest", "add", ...urls, "--overwrite", "--yes"], {
    cwd: ROOT,
    stdio: "inherit",
  })
  if (result.status !== 0) {
    console.error("shadcn add failed.")
    process.exit(result.status ?? 1)
  }

  // ロックをレジストリ最新版（= 適用後）で更新
  const files = {}
  for (const [local] of localMap(registryFiles)) {
    const hash = fileHash(local)
    if (hash) files[resolve(local)] = hash
  }
  writeLock(files)
  console.log(`Lock updated: ${LOCK_FILE}`)

  console.log("Building to verify...")
  const build = spawnSync("pnpm", ["build"], { cwd: ROOT, stdio: "inherit" })
  if (build.status !== 0) {
    console.error("Build failed after update.")
    process.exit(build.status ?? 1)
  }
  console.log("mdxcn components updated and verified.")
}

const command = process.argv[2] ?? "status"
const force = process.argv.includes("--force")
if (command === "status") {
  await runStatus()
} else if (command === "apply") {
  await runApply()
} else {
  console.error(`Unknown command: ${command} (expected status|apply)`)
  process.exit(1)
}