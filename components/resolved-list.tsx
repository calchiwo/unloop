"use client"

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { CheckCircle2, Calendar, X, Clock } from "lucide-react"
import type { ResolvedThought } from "@/app/page"

interface ResolvedListProps {
  thoughts: ResolvedThought[]
}

export function ResolvedList({ thoughts }: ResolvedListProps) {
  const formatTime = (date: Date) => {
    return new Intl.DateTimeFormat("en-US", {
      hour: "numeric",
      minute: "numeric",
      hour12: true,
    }).format(date)
  }

  const getIcon = (resolution: "do" | "schedule" | "ignore") => {
    switch (resolution) {
      case "do":
        return <CheckCircle2 className="w-4 h-4 text-primary" />
      case "schedule":
        return <Calendar className="w-4 h-4 text-yellow-500" />
      case "ignore":
        return <X className="w-4 h-4 text-muted-foreground" />
    }
  }

  const getLabel = (resolution: "do" | "schedule" | "ignore") => {
    switch (resolution) {
      case "do":
        return "Action"
      case "schedule":
        return "Scheduled"
      case "ignore":
        return "Discarded"
    }
  }

  if (thoughts.length === 0) {
    return (
      <Card className="bg-card border-border">
        <CardContent className="py-16 text-center">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-secondary flex items-center justify-center">
            <CheckCircle2 className="w-8 h-8 text-muted-foreground" />
          </div>
          <h3 className="text-lg font-medium mb-2">No resolved thoughts yet</h3>
          <p className="text-muted-foreground text-sm max-w-sm mx-auto">
            Use the Brain Dump, Decision Engine, Timer, or Importance Filter to process your thoughts. They'll show up here once resolved.
          </p>
        </CardContent>
      </Card>
    )
  }

  const stats = {
    actions: thoughts.filter((t) => t.resolution === "do").length,
    scheduled: thoughts.filter((t) => t.resolution === "schedule").length,
    discarded: thoughts.filter((t) => t.resolution === "ignore").length,
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-3 gap-4">
        <Card className="bg-card border-border">
          <CardContent className="py-4 text-center">
            <div className="text-2xl font-bold text-primary">{stats.actions}</div>
            <p className="text-xs text-muted-foreground mt-1">Actions taken</p>
          </CardContent>
        </Card>
        <Card className="bg-card border-border">
          <CardContent className="py-4 text-center">
            <div className="text-2xl font-bold text-yellow-500">{stats.scheduled}</div>
            <p className="text-xs text-muted-foreground mt-1">Scheduled</p>
          </CardContent>
        </Card>
        <Card className="bg-card border-border">
          <CardContent className="py-4 text-center">
            <div className="text-2xl font-bold text-muted-foreground">{stats.discarded}</div>
            <p className="text-xs text-muted-foreground mt-1">Discarded</p>
          </CardContent>
        </Card>
      </div>

      <Card className="bg-card border-border">
        <CardHeader>
          <CardTitle>Resolved Thoughts</CardTitle>
          <CardDescription>
            Every thought here has been processed. No loose ends.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          {thoughts.map((thought) => (
            <div
              key={thought.id}
              className={`p-4 rounded-lg border ${
                thought.resolution === "ignore"
                  ? "bg-secondary/50 border-border"
                  : thought.resolution === "do"
                  ? "bg-primary/5 border-primary/20"
                  : "bg-yellow-500/5 border-yellow-500/20"
              }`}
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <p className={`text-sm ${thought.resolution === "ignore" ? "text-muted-foreground line-through" : ""}`}>
                    {thought.thought}
                  </p>
                  {thought.action && thought.resolution !== "ignore" && (
                    <p className="text-sm mt-2 font-medium">
                      → {thought.action}
                    </p>
                  )}
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <span className={`text-xs px-2 py-1 rounded-full flex items-center gap-1 ${
                    thought.resolution === "do"
                      ? "bg-primary/10 text-primary"
                      : thought.resolution === "schedule"
                      ? "bg-yellow-500/10 text-yellow-500"
                      : "bg-secondary text-muted-foreground"
                  }`}>
                    {getIcon(thought.resolution)}
                    {getLabel(thought.resolution)}
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-1 mt-3 text-xs text-muted-foreground">
                <Clock className="w-3 h-3" />
                {formatTime(thought.timestamp)}
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  )
}
