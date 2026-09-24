import { useEffect, useState } from "react"
import type { ReactNode } from "react"

import { GraphBars, Series } from "@/components/graph-bars"
import { Foot, GraphTable, Head, Row } from "@/components/graph-table"
import { GraphTimeline } from "@/components/graph-timeline"
import { Graph, GraphBody, GraphProse } from "@/components/ui/graph-frame"

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

const seriesCode = `import { GraphBars, Series } from "@/components/graph-bars"

// from / to の代わりに <Series> 子要素で書ける
<GraphBars title="トラフィック" processor="CDN">
  <Series label="before" size="lg">2 4 3 5 2</Series>
  <Series label="after" size="lg">7 5 6 8 4</Series>
</GraphBars>`

const paletteCode = `// GraphPalette: "mono" (デフォルト) | "duo" | "multi"
import { GraphBars } from "@/components/graph-bars"

<GraphBars
  title="Palette duo"
  palette="duo"
  from={{ label: "Q1", values: [40, 62, 50] }}
  to={{ label: "Q2", values: [72, 54, 80] }}
  processor="duo"
/>`

const frameCode = `import { Graph, GraphBody, GraphProse } from "@/components/ui/graph-frame"
import { GraphTable, Head, Row, Foot } from "@/components/graph-table"

// フレーム + 本文(GraphProse)だけの素の図
<Graph title="Graph プリミティブ">
  <GraphBody>
    <GraphProse>
      <p>タイトルと破線フレームを描く最小単位です。</p>
    </GraphProse>
  </GraphBody>
</Graph>

// Table は Head / Row / Foot 子要素でもデータを渡せる
<GraphTable title="マトリックス">
  <Head>項目 | 予算 | 実績</Head>
  <Row>広告費 | 500 | 480</Row>
  <Foot>合計 | 1,620 | 1,590</Foot>
</GraphTable>`

const installCode = `pnpm dlx shadcn@latest init          # Tailwind v4 + shadcn/ui (Nova) を用意してから

pnpm dlx shadcn@latest add https://mdxcn.dev/r/graph-frame.json
pnpm dlx shadcn@latest add https://mdxcn.dev/r/graph-bars.json
pnpm dlx shadcn@latest add https://mdxcn.dev/r/graph-table.json
pnpm dlx shadcn@latest add https://mdxcn.dev/r/graph-timeline.json`

const updateCode = `pnpm mdxcn:status   # レジストリの更新を検知 (差分あれば exit 1)
pnpm mdxcn:update   # shadcn add で上書き → ロック更新 → ビルド検証`

function Code({ text }: { text: string }) {
  return (
    <pre className="overflow-x-auto rounded-lg border border-border bg-slate-950/80 p-4 font-mono text-[13px] leading-relaxed text-slate-200">
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
      <p className="font-mono text-sm tracking-wider text-graph-muted">{index}</p>
      <h2 className="mt-1 mb-2 font-mono text-2xl font-bold tracking-tight sm:text-3xl">
        <span className="text-graph-muted">[ </span>
        {title}
        <span className="text-graph-muted"> ]</span>
      </h2>
      <p className="mb-6 text-muted-foreground">{lead}</p>
      {demo ? (
        <div className="mb-6 rounded-2xl border border-border bg-card p-5 sm:p-8">
          {demo}
        </div>
      ) : null}
      <Code text={code} />
    </section>
  )
}

function useTheme() {
  const [theme, setTheme] = useState<"dark" | "light">(() => {
    if (typeof window === "undefined") {
      return "dark"
    }
    const saved = localStorage.getItem("mdxcn-showcase-theme")
    return saved === "light" ? "light" : "dark"
  })

  useEffect(() => {
    document.documentElement.classList.toggle("dark", theme === "dark")
    localStorage.setItem("mdxcn-showcase-theme", theme)
  }, [theme])

  return {
    theme,
    toggle: () => setTheme((value) => (value === "dark" ? "light" : "dark")),
  }
}

function App() {
  const { theme, toggle } = useTheme()

  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="sticky top-0 z-20 border-b border-border bg-background/80 backdrop-blur">
        <nav className="mx-auto flex w-full max-w-5xl items-center justify-between gap-4 px-4 py-3 font-mono text-sm">
          <a href="#top" className="font-bold tracking-tight whitespace-nowrap">
            mdxcn<span className="text-graph-accent">/</span>showcase
          </a>
          <div className="flex flex-wrap justify-center gap-x-4 text-muted-foreground">
            <a href="#install" className="hover:text-graph-accent">install</a>
            <a href="#graph-bars" className="hover:text-graph-accent">bars</a>
            <a href="#graph-table" className="hover:text-graph-accent">table</a>
            <a href="#graph-timeline" className="hover:text-graph-accent">timeline</a>
            <a href="#series" className="hover:text-graph-accent">series</a>
            <a href="#palette" className="hover:text-graph-accent">palette</a>
            <a href="#frame" className="hover:text-graph-accent">frame</a>
            <a href="#update" className="hover:text-graph-accent">update</a>
          </div>
          <button
            type="button"
            onClick={toggle}
            aria-label="テーマ切り替え"
            className="rounded-md border border-border px-3 py-1.5 whitespace-nowrap text-muted-foreground hover:border-graph-accent hover:text-graph-accent"
          >
            {theme === "dark" ? "[ light ]" : "[ dark ]"}
          </button>
        </nav>
      </header>

      <main id="top" className="px-4 pb-16">
        <section className="mx-auto w-full max-w-3xl pt-14 pb-10">
          <p className="font-mono text-sm tracking-wider text-graph-accent">
            mdxcn components — usage &amp; showcase
          </p>
          <h1 className="mt-3 font-mono text-4xl font-bold tracking-tight sm:text-6xl">
            [ mdxcn <span className="text-graph-accent">showcase</span> ]
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-relaxed text-muted-foreground">
            mdxcn は shadcn/ui にコピーして使う ASCII フレームの React 図表セットです。
            このページでは実際に動くコンポーネントとコード例を紹介します。
            本番ダッシュボードは
            <a
              className="mx-1 font-mono text-graph-accent underline-offset-4 hover:underline"
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
              className="rounded-md border border-border px-3 py-1.5 text-foreground hover:border-graph-accent hover:text-graph-accent"
              href="https://mdxcn.dev"
              target="_blank"
              rel="noreferrer"
            >
              mdxcn.dev ↗
            </a>
            <a
              className="rounded-md border border-border px-3 py-1.5 text-foreground hover:border-graph-accent hover:text-graph-accent"
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
          id="series"
          index="05 / series"
          title="Series 子要素スタイル"
          lead="GraphBars は from / to の配列の代わりに <Series> 子要素で書けます。値はスペース区切りの文字列でも渡せます。"
          demo={
            <GraphBars title="トラフィック" processor="CDN">
              <Series label="before" size="lg">
                2 4 3 5 2
              </Series>
              <Series label="after" size="lg">
                7 5 6 8 4
              </Series>
            </GraphBars>
          }
          code={seriesCode}
        />

        <Section
          id="palette"
          index="06 / palette"
          title="Palette 配色"
          lead="palette プロパティで 3 色構成を切り替えられます。mono（デフォルト）は単色、duo は 2 色、multi は 3 色で CSS 変数 (--graph-accent-2 / -3) に紐づきます。"
          demo={
            <div className="grid gap-8 sm:grid-cols-2">
              <GraphBars
                title="duo"
                palette="duo"
                from={{ label: "Q1", values: [40, 62, 50] }}
                to={{ label: "Q2", values: [72, 54, 80] }}
                processor="2c"
              />
              <GraphBars
                title="multi"
                palette="multi"
                from={{ label: "Q1", values: [40, 62, 50] }}
                to={{ label: "Q2", values: [72, 54, 80] }}
                processor="3c"
              />
            </div>
          }
          code={paletteCode}
        />

        <Section
          id="frame"
          index="07 / frame"
          title="Frame プリミティブ"
          lead="全てのグラフの土台になる graph-frame（Graph / GraphBody / GraphProse）と、データ子要素（Head / Row / Foot）を紹介します。"
          demo={
            <div className="flex flex-col gap-8">
              <Graph title="Graph プリミティブ">
                <GraphBody>
                  <GraphProse>
                    <p>
                      タイトルと破線フレームを描く最小単位です。ここに Markdown の{" "}
                      <code>p</code> / <code>ul</code> / <strong>strong</strong>{" "}
                      をそのまま置いて整形できます。
                    </p>
                  </GraphProse>
                </GraphBody>
              </Graph>
              <GraphTable title="マトリックス">
                <Head>項目 | 予算 | 実績</Head>
                <Row>広告費 | 500 | 480</Row>
                <Row>サーバー | 120 | 135</Row>
                <Row>人件費 | 800 | 800</Row>
                <Foot>合計 | 1,620 | 1,590</Foot>
              </GraphTable>
            </div>
          }
          code={frameCode}
        />

        <Section
          id="update"
          index="08 / update"
          title="更新を追いかける"
          lead="コンポーネントはコピーしたソースなので、レジストリ側の更新は `pnpm mdxcn:update` で引き込めます。差分検知用に .mdxcn-lock.json でハッシュを管理しています。"
          code={updateCode}
        />
      </main>

      <footer className="border-t border-border py-8 text-center font-mono text-sm text-muted-foreground">
        <p>mdxcn showcase — GitHub Pages + GitHub Actions</p>
      </footer>
    </div>
  )
}

export default App