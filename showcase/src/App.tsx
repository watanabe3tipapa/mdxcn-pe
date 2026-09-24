import { GraphBars } from "@/components/graph-bars"
import { GraphTable } from "@/components/graph-table"
import { GraphTimeline } from "@/components/graph-timeline"
import type { ReactNode } from "react"

const barsCode = `import { GraphBars } from "@/components/graph-bars"

<GraphBars
  title="四半期売上"
  from={{ label: "前年", values: [80, 95, 70, 60] }}
  to={{ label: "今年", values: [120, 85, 130, 60] }}
  processor="DB"
/>`

const tableCode = `import { GraphTable } from "@/components/graph-table"

<GraphTable
  title="予算対実績"
  headers={["項目", "予算", "実績"]}
  rows={[
    ["広告費", "500", "480"],
    ["サーバー", "120", "135"],
    ["人件費", "800", "800"],
    ["その他", "200", "175"],
  ]}
  footer={["合計", "1,620", "1,590"]}
/>`

const timelineCode = `import { GraphTimeline } from "@/components/graph-timeline"

<GraphTimeline
  title="開発工程"
  events={[
    { date: "Sep 01", label: "要件定義", state: "done" },
    { date: "Sep 15", label: "設計・実装", state: "now" },
    { date: "Oct 03", label: "テスト", state: "next" },
    { date: "Oct 20", label: "リリース", state: "next" },
  ]}
/>`

const installCode = `pnpm dlx shadcn@latest init          # Tailwind v4 + shadcn/ui (Nova) を用意してから

pnpm dlx shadcn@latest add https://mdxcn.dev/r/graph-frame.json
pnpm dlx shadcn@latest add https://mdxcn.dev/r/graph-bars.json
pnpm dlx shadcn@latest add https://mdxcn.dev/r/graph-table.json
pnpm dlx shadcn@latest add https://mdxcn.dev/r/graph-timeline.json`

const updateCode = `pnpm mdxcn:status   # レジストリの更新を検知 (差分あれば exit 1)
pnpm mdxcn:update   # shadcn add で上書き → ロック更新 → ビルド検証`

function Code({ text }: { text: string }) {
  return (
    <pre className="overflow-x-auto rounded-lg border border-slate-800 bg-black/60 p-4 font-mono text-[13px] leading-relaxed text-slate-200">
      <code>{text}</code>
    </pre>
  )
}

function Section({
  id,
  index,
  title,
  lead,
  demo,
  code,
}: {
  id: string
  index: string
  title: string
  lead: string
  demo?: ReactNode
  code: string
}) {
  return (
    <section id={id} className="mx-auto w-full max-w-3xl scroll-mt-24 py-10">
      <p className="font-mono text-sm tracking-wider text-slate-500">{index}</p>
      <h2 className="mt-1 mb-2 font-mono text-2xl font-bold tracking-tight sm:text-3xl">
        <span className="text-slate-500">[ </span>
        {title}
        <span className="text-slate-500"> ]</span>
      </h2>
      <p className="mb-6 text-slate-400">{lead}</p>
      {demo ? (
        <div className="mb-6 rounded-2xl border border-slate-800 bg-slate-950/60 p-5 sm:p-8">
          {demo}
        </div>
      ) : null}
      <Code text={code} />
    </section>
  )
}

function App() {
  return (
    <div className="dark min-h-screen bg-background text-foreground">
      <header className="sticky top-0 z-20 border-b border-slate-800 bg-background/80 backdrop-blur">
        <nav className="mx-auto flex w-full max-w-5xl items-center justify-between gap-4 px-4 py-3 font-mono text-sm">
          <a href="#top" className="font-bold tracking-tight">
            mdxcn<span className="text-amber-400">/</span>showcase
          </a>
          <div className="flex flex-wrap gap-x-5 text-slate-400">
            <a href="#install" className="hover:text-amber-400">install</a>
            <a href="#graph-bars" className="hover:text-amber-400">bars</a>
            <a href="#graph-table" className="hover:text-amber-400">table</a>
            <a href="#graph-timeline" className="hover:text-amber-400">timeline</a>
            <a href="#update" className="hover:text-amber-400">update</a>
          </div>
        </nav>
      </header>

      <main id="top" className="px-4 pb-16">
        <section className="mx-auto w-full max-w-3xl pt-14 pb-10">
          <p className="font-mono text-sm tracking-wider text-amber-400">mdxcn components — usage &amp; showcase</p>
          <h1 className="mt-3 font-mono text-4xl font-bold tracking-tight sm:text-6xl">
            [ mdxcn <span className="text-amber-400">showcase</span> ]
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-relaxed text-slate-400">
            mdxcn は shadcn/ui にコピーして使う ASCII フレームの React 図表セットです。
            このページでは実際に動くコンポーネントとコード例を紹介します。
            本番ダッシュボードは
            <a
              className="mx-1 font-mono text-amber-400 underline-offset-4 hover:underline"
              href="https://mdxcn-dashboard.vercel.app"
              target="_blank"
              rel="noreferrer"
            >
              mdxcn-dashboard.vercel.app
            </a>
            で公開中です。
          </p>

          <div className="mt-8 flex flex-wrap gap-3 font-mono text-sm">
            <a
              className="rounded-md border border-slate-700 px-3 py-1.5 text-slate-300 hover:border-amber-400 hover:text-amber-400"
              href="https://mdxcn.dev"
              target="_blank"
              rel="noreferrer"
            >
              mdxcn.dev ↗
            </a>
            <a
              className="rounded-md border border-slate-700 px-3 py-1.5 text-slate-300 hover:border-amber-400 hover:text-amber-400"
              href="https://github.com/watanabe3tipapa/mdxcn-pe"
              target="_blank"
              rel="noreferrer"
            >
              github.com/watanabe3tipapa/mdxcn-pe ↗
            </a>
          </div>
        </section>

        <Section
          id="install"
          index="01 / install"
          title="インストール"
          lead="Vite + React に Tailwind v4 と shadcn/ui を用意してから、レジストリからコンポーネントを追加します。ソースをプロジェクトへコピーする方式なので npm パッケージは不要です。"
          code={installCode}
        />

        <Section
          id="graph-bars"
          index="02 / graph-bars"
          title="Bars 四半期比較"
          lead="前後 2 つの小さなヒストグラムを並べ、中央に処理名を置く比較図です。"
          demo={
            <GraphBars
              title="四半期売上"
              from={{ label: "前年", values: [80, 95, 70, 60] }}
              to={{ label: "今年", values: [120, 85, 130, 60] }}
              processor="DB"
            />
          }
          code={barsCode}
        />

        <Section
          id="graph-table"
          index="03 / graph-table"
          title="Table 予算対実績"
          lead="枠付きデータテーブルで、フッターに合計行を置けます。ヘッダー付きの表（スプレッドシート的な数値）に最適です。"
          code={tableCode}
          demo={
            <GraphTable
              title="予算対実績"
              headers={["項目", "予算", "実績"]}
              rows={[
                ["広告費", "500", "480"],
                ["サーバー", "120", "135"],
                ["人件費", "800", "800"],
                ["その他", "200", "175"],
              ]}
              footer={["合計", "1,620", "1,590"]}
            />
          }
        />

        <Section
          id="graph-timeline"
          index="04 / graph-timeline"
          title="Timeline 開発工程"
          lead="日付付きのリストで、現在の行（now）を強調します。done / now / next の 3 状態を表現できます。"
          code={timelineCode}
          demo={
            <GraphTimeline
              title="開発工程"
              events={[
                { date: "Sep 01", label: "要件定義", state: "done" },
                { date: "Sep 15", label: "設計・実装", state: "now" },
                { date: "Oct 03", label: "テスト", state: "next" },
                { date: "Oct 20", label: "リリース", state: "next" },
              ]}
            />
          }
        />

        <Section
          id="update"
          index="05 / update"
          title="更新を追いかける"
          lead="コンポーネントはコピーしたソースなので、レジストリ側の更新は `pnpm mdxcn:update` で引き込めます。差分検知用に .mdxcn-lock.json でハッシュを管理しています。"
          code={updateCode}
        />
      </main>

      <footer className="border-t border-slate-800 py-8 text-center font-mono text-sm text-slate-500">
        <p>mdxcn showcase — GitHub Pages + GitHub Actions</p>
      </footer>
    </div>
  )
}

export default App