import { GraphBars } from "@/components/graph-bars"
import { GraphTable } from "@/components/graph-table"
import { GraphTimeline } from "@/components/graph-timeline"

function App() {
  return (
    <div className="dark min-h-screen bg-background p-6 text-foreground sm:p-8">
      <header className="mb-8 flex flex-wrap items-baseline justify-between gap-4">
        <h1 className="font-mono text-2xl font-bold tracking-tight sm:text-3xl">
          [ mdxcn Dashboard ]
        </h1>
      </header>

      <main className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <GraphBars
          title="四半期売上"
          from={{ label: "前年", values: [80, 95, 70, 60] }}
          to={{ label: "今年", values: [120, 85, 130, 60] }}
          processor="DB"
        />

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

        <GraphTimeline
          className="md:col-span-2"
          title="開発工程"
          events={[
            { date: "Sep 01", label: "要件定義", state: "done" },
            { date: "Sep 15", label: "設計・実装", state: "now" },
            { date: "Oct 03", label: "テスト", state: "next" },
            { date: "Oct 20", label: "リリース", state: "next" },
          ]}
        />
      </main>
    </div>
  )
}

export default App