"use client"

import { useState, useEffect, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Timer, Play, Pause, RotateCcw, AlertCircle } from "lucide-react"
import type { ResolvedThought } from "@/app/page"

interface TimerModeProps {
  onResolve: (thought: ResolvedThought) => void
}

export function TimerMode({ onResolve }: TimerModeProps) {
  const [thought, setThought] = useState("")
  const [timeLeft, setTimeLeft] = useState(5 * 60)
  const [isRunning, setIsRunning] = useState(false)
  const [isExpired, setIsExpired] = useState(false)
  const [decision, setDecision] = useState("")
  const [phase, setPhase] = useState<"setup" | "thinking" | "decide">("setup")

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, "0")}`
  }

  const handleResolve = useCallback(
    (resolution: "do" | "schedule" | "ignore", action?: string) => {
      onResolve({
        id: Date.now().toString(),
        thought,
        resolution,
        action: action || decision,
        timestamp: new Date(),
      })
      reset()
    },
    [thought, decision, onResolve]
  )

  useEffect(() => {
    let interval: NodeJS.Timeout
    if (isRunning && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prev) => prev - 1)
      }, 1000)
    } else if (timeLeft === 0 && !isExpired) {
      setIsExpired(true)
      setIsRunning(false)
      setPhase("decide")
    }
    return () => clearInterval(interval)
  }, [isRunning, timeLeft, isExpired])

  const reset = () => {
    setThought("")
    setTimeLeft(5 * 60)
    setIsRunning(false)
    setIsExpired(false)
    setDecision("")
    setPhase("setup")
  }

  const startTimer = () => {
    if (thought.trim()) {
      setPhase("thinking")
      setIsRunning(true)
    }
  }

  const progress = ((5 * 60 - timeLeft) / (5 * 60)) * 100

  return (
    <div className="space-y-6">
      {phase === "setup" && (
        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Timer className="w-5 h-5 text-primary" />
              5-Minute Rule Mode
            </CardTitle>
            <CardDescription>
              You have 5 minutes to think. When time ends, you must decide.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Textarea
              placeholder="What are you overthinking about?"
              value={thought}
              onChange={(e) => setThought(e.target.value)}
              className="min-h-[120px] bg-secondary border-border resize-none"
            />
            <div className="flex justify-between items-center">
              <p className="text-sm text-muted-foreground">
                No mental looping allowed.
              </p>
              <Button onClick={startTimer} disabled={!thought.trim()}>
                <Play className="w-4 h-4 mr-2" />
                Start 5 min timer
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {phase === "thinking" && (
        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Timer className="w-5 h-5 text-primary" />
              Think. But not forever.
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="text-center py-8">
              <div className="text-6xl font-mono font-bold tracking-tight">
                {formatTime(timeLeft)}
              </div>
              <p className="text-muted-foreground mt-2">remaining</p>
            </div>

            <div className="w-full h-2 bg-secondary rounded-full overflow-hidden">
              <div
                className="h-full bg-primary transition-all duration-1000"
                style={{ width: `${progress}%` }}
              />
            </div>

            <div className="p-4 bg-secondary rounded-lg border border-border">
              <p className="text-sm text-muted-foreground mb-1">Thinking about:</p>
              <p>{thought}</p>
            </div>

            <div className="flex justify-center gap-4">
              <Button
                variant="outline"
                onClick={() => setIsRunning(!isRunning)}
                className="bg-transparent"
              >
                {isRunning ? (
                  <>
                    <Pause className="w-4 h-4 mr-2" />
                    Pause
                  </>
                ) : (
                  <>
                    <Play className="w-4 h-4 mr-2" />
                    Resume
                  </>
                )}
              </Button>
              <Button
                variant="secondary"
                onClick={() => {
                  setPhase("decide")
                  setIsRunning(false)
                }}
              >
                I'm ready to decide
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {phase === "decide" && (
        <Card className={`bg-card ${isExpired ? "border-destructive" : "border-primary"}`}>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              {isExpired && <AlertCircle className="w-5 h-5 text-destructive" />}
              {isExpired ? "Time's up. Decide now." : "Make your decision"}
            </CardTitle>
            <CardDescription>
              {isExpired
                ? "No more thinking. Pick an option or define your next action."
                : "You've decided to stop thinking. What's the outcome?"}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="p-4 bg-secondary rounded-lg border border-border">
              <p className="text-sm text-muted-foreground mb-1">Your thought:</p>
              <p>{thought}</p>
            </div>

            <div>
              <label className="text-sm font-medium mb-2 block">
                What's the decision or next action?
              </label>
              <Input
                placeholder="e.g., I'll go with option A because..."
                value={decision}
                onChange={(e) => setDecision(e.target.value)}
                className="bg-secondary border-border"
                autoFocus
              />
            </div>

            <div className="grid grid-cols-3 gap-3 pt-4">
              <Button onClick={() => handleResolve("do", decision)} disabled={!decision.trim()}>
                Do this
              </Button>
              <Button
                variant="secondary"
                onClick={() => handleResolve("schedule", decision)}
                disabled={!decision.trim()}
              >
                Schedule
              </Button>
              <Button
                variant="ghost"
                className="text-muted-foreground hover:text-destructive"
                onClick={() => handleResolve("ignore")}
              >
                Discard
              </Button>
            </div>

            <div className="pt-4 border-t border-border">
              <Button variant="outline" onClick={reset} className="w-full bg-transparent">
                <RotateCcw className="w-4 h-4 mr-2" />
                Start over
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
