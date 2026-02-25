"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Filter, Calendar, CalendarDays, CalendarRange, CheckCircle2, X } from "lucide-react"
import type { ResolvedThought } from "@/app/page"

interface ImportanceFilterProps {
  onResolve: (thought: ResolvedThought) => void
}

type TimeHorizon = "week" | "month" | "year"

export function ImportanceFilter({ onResolve }: ImportanceFilterProps) {
  const [thought, setThought] = useState("")
  const [answers, setAnswers] = useState<Record<TimeHorizon, boolean | null>>({
    week: null,
    month: null,
    year: null,
  })
  const [phase, setPhase] = useState<"input" | "filter" | "result">("input")

  const questions = [
    { key: "week" as const, label: "1 week", icon: Calendar },
    { key: "month" as const, label: "1 month", icon: CalendarDays },
    { key: "year" as const, label: "1 year", icon: CalendarRange },
  ]

  const startFilter = () => {
    if (thought.trim()) {
      setPhase("filter")
    }
  }

  const handleAnswer = (horizon: TimeHorizon, value: boolean) => {
    const newAnswers = { ...answers, [horizon]: value }
    setAnswers(newAnswers)

    if (Object.values(newAnswers).every((v) => v !== null)) {
      setPhase("result")
    }
  }

  const getVerdict = () => {
    const yesCount = Object.values(answers).filter((v) => v === true).length
    if (yesCount === 0) return "noise"
    if (yesCount === 1) return "minor"
    if (yesCount === 2) return "moderate"
    return "important"
  }

  const handleResolve = (resolution: "do" | "schedule" | "ignore") => {
    onResolve({
      id: Date.now().toString(),
      thought,
      resolution,
      action: resolution === "ignore" ? "Marked as noise" : thought,
      timestamp: new Date(),
    })
    reset()
  }

  const reset = () => {
    setThought("")
    setAnswers({ week: null, month: null, year: null })
    setPhase("input")
  }

  const verdict = getVerdict()

  return (
    <div className="space-y-6">
      {phase === "input" && (
        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Filter className="w-5 h-5 text-primary" />
              Is this even important?
            </CardTitle>
            <CardDescription>
              Filter out the noise. Some thoughts don't deserve your energy.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Textarea
              placeholder="What's the thought taking up space in your head?"
              value={thought}
              onChange={(e) => setThought(e.target.value)}
              className="min-h-[120px] bg-secondary border-border resize-none"
            />
            <div className="flex justify-end">
              <Button onClick={startFilter} disabled={!thought.trim()}>
                Run importance filter
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {phase === "filter" && (
        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle>Will this matter in...</CardTitle>
            <CardDescription>
              Answer honestly. Most things we stress about don't matter.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="p-4 bg-secondary rounded-lg border border-border">
              <p className="text-sm text-muted-foreground mb-1">Your thought:</p>
              <p>{thought}</p>
            </div>

            <div className="grid gap-4">
              {questions.map(({ key, label, icon: Icon }) => (
                <div
                  key={key}
                  className="flex items-center justify-between p-4 bg-secondary rounded-lg border border-border"
                >
                  <div className="flex items-center gap-3">
                    <Icon className="w-5 h-5 text-muted-foreground" />
                    <span className="font-medium">Will this matter in {label}?</span>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant={answers[key] === true ? "default" : "outline"}
                      onClick={() => handleAnswer(key, true)}
                      className={answers[key] === true ? "" : "bg-transparent"}
                    >
                      <CheckCircle2 className="w-4 h-4 mr-1" />
                      Yes
                    </Button>
                    <Button
                      size="sm"
                      variant={answers[key] === false ? "destructive" : "outline"}
                      onClick={() => handleAnswer(key, false)}
                      className={answers[key] === false ? "" : "bg-transparent"}
                    >
                      <X className="w-4 h-4 mr-1" />
                      No
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {phase === "result" && (
        <Card
          className={`bg-card ${
            verdict === "noise"
              ? "border-destructive"
              : verdict === "important"
              ? "border-primary"
              : "border-border"
          }`}
        >
          <CardHeader>
            <CardTitle
              className={
                verdict === "noise"
                  ? "text-destructive"
                  : verdict === "important"
                  ? "text-primary"
                  : ""
              }
            >
              {verdict === "noise" && "This is noise."}
              {verdict === "minor" && "Low priority."}
              {verdict === "moderate" && "Worth considering."}
              {verdict === "important" && "This actually matters."}
            </CardTitle>
            <CardDescription>
              {verdict === "noise" &&
                "Won't matter in a week, month, or year. Let it go."}
              {verdict === "minor" &&
                "Only matters short-term. Handle it quickly or let it fade."}
              {verdict === "moderate" &&
                "Has some staying power. Might be worth addressing."}
              {verdict === "important" &&
                "This will matter over time. Give it proper attention."}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="p-4 bg-secondary rounded-lg border border-border">
              <p className="text-sm text-muted-foreground mb-1">Your thought:</p>
              <p>{thought}</p>
            </div>

            <div className="flex gap-2">
              {["noise", "minor", "moderate", "important"].map((level, i) => (
                <div
                  key={level}
                  className={`flex-1 h-2 rounded-full ${
                    ["noise", "minor", "moderate", "important"].indexOf(verdict) >= i
                      ? verdict === "noise"
                        ? "bg-destructive"
                        : verdict === "important"
                        ? "bg-primary"
                        : "bg-muted-foreground"
                      : "bg-secondary"
                  }`}
                />
              ))}
            </div>

            <div className="flex gap-2 pt-4 border-t border-border">
              {verdict === "noise" ? (
                <Button
                  className="flex-1"
                  variant="destructive"
                  onClick={() => handleResolve("ignore")}
                >
                  Discard this thought
                </Button>
              ) : (
                <>
                  <Button className="flex-1" onClick={() => handleResolve("do")}>
                    Take action
                  </Button>
                  <Button
                    variant="secondary"
                    className="flex-1"
                    onClick={() => handleResolve("schedule")}
                  >
                    Schedule
                  </Button>
                  <Button
                    variant="ghost"
                    onClick={() => handleResolve("ignore")}
                  >
                    Discard
                  </Button>
                </>
              )}
            </div>

            <Button variant="outline" onClick={reset} className="w-full bg-transparent">
              Filter another thought
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
