"use client"

import { useState } from "react"
import { BrainDump } from "@/components/brain-dump"
import { DecisionEngine } from "@/components/decision-engine"
import { TimerMode } from "@/components/timer-mode"
import { ImportanceFilter } from "@/components/importance-filter"
import { ResolvedList } from "@/components/resolved-list"
import { Brain, Zap, Timer, Filter, CheckCircle2 } from "lucide-react"

export type ResolvedThought = {
  id: string
  thought: string
  resolution: "do" | "schedule" | "ignore"
  action?: string
  timestamp: Date
}

export type AppMode = "dump" | "decision" | "timer" | "importance" | "resolved"

export default function Home() {
  const [mode, setMode] = useState<AppMode>("dump")
  const [resolvedThoughts, setResolvedThoughts] = useState<ResolvedThought[]>([])

  const addResolvedThought = (thought: ResolvedThought) => {
    setResolvedThoughts((prev) => [thought, ...prev])
  }

  const modes = [
    { id: "dump" as const, label: "Brain Dump", icon: Brain },
    { id: "decision" as const, label: "Decision Engine", icon: Zap },
    { id: "timer" as const, label: "5-Min Rule", icon: Timer },
    { id: "importance" as const, label: "Importance Filter", icon: Filter },
    { id: "resolved" as const, label: "Resolved", icon: CheckCircle2, count: resolvedThoughts.length },
  ]

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border">
        <div className="max-w-5xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold tracking-tight">Unloop</h1>
              <p className="text-muted-foreground text-sm mt-1">
                End thoughts. Don't store them.
              </p>
            </div>
            <div className="text-right">
              <p className="text-xs text-muted-foreground">Thoughts must end as</p>
              <p className="text-sm font-medium text-primary">Action · Decision · Discard</p>
            </div>
          </div>
        </div>
      </header>

      <nav className="border-b border-border bg-card/50">
        <div className="max-w-5xl mx-auto px-4">
          <div className="flex gap-1 overflow-x-auto py-2">
            {modes.map((m) => (
              <button
                key={m.id}
                onClick={() => setMode(m.id)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-all whitespace-nowrap ${
                  mode === m.id
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:text-foreground hover:bg-secondary"
                }`}
              >
                <m.icon className="w-4 h-4" />
                {m.label}
                {m.count !== undefined && m.count > 0 && (
                  <span className={`ml-1 px-1.5 py-0.5 text-xs rounded-full ${
                    mode === m.id ? "bg-primary-foreground/20 text-primary-foreground" : "bg-secondary text-muted-foreground"
                  }`}>
                    {m.count}
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>
      </nav>

      <main className="max-w-5xl mx-auto px-4 py-8">
        {mode === "dump" && <BrainDump onResolve={addResolvedThought} />}
        {mode === "decision" && <DecisionEngine onResolve={addResolvedThought} />}
        {mode === "timer" && <TimerMode onResolve={addResolvedThought} />}
        {mode === "importance" && <ImportanceFilter onResolve={addResolvedThought} />}
        {mode === "resolved" && <ResolvedList thoughts={resolvedThoughts} />}
      </main>

      <footer className="border-t border-border py-6">
        <div className="max-w-5xl mx-auto px-4 text-center">
          <p className="text-sm text-muted-foreground">
            Built by{" "}
            <a
              href="https://github.com/calchiwo"
              target="_blank"
              rel="noopener noreferrer"
              className="text-foreground underline underline-offset-4 hover:text-primary transition-colors"
            >
              Caleb Wodi
            </a>
          </p>
        </div>
      </footer>
    </div>
  )
}
