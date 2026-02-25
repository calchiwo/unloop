"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { ArrowRight, Target, ListChecks, Sparkles } from "lucide-react"
import type { ResolvedThought } from "@/app/page"

type Step = "dump" | "breakdown" | "options" | "resolve"

interface BrainDumpProps {
  onResolve: (thought: ResolvedThought) => void
}

export function BrainDump({ onResolve }: BrainDumpProps) {
  const [step, setStep] = useState<Step>("dump")
  const [rawThought, setRawThought] = useState("")
  const [decision, setDecision] = useState("")
  const [options, setOptions] = useState(["", ""])
  const [priority, setPriority] = useState("")

  const handleBreakdown = () => {
    if (rawThought.trim()) {
      setStep("breakdown")
    }
  }

  const handleOptions = () => {
    if (decision.trim()) {
      setStep("options")
    }
  }

  const handleResolve = (resolution: "do" | "schedule" | "ignore", action?: string) => {
    onResolve({
      id: Date.now().toString(),
      thought: rawThought,
      resolution,
      action: action || decision,
      timestamp: new Date(),
    })
    setStep("dump")
    setRawThought("")
    setDecision("")
    setOptions(["", ""])
    setPriority("")
  }

  const reset = () => {
    setStep("dump")
    setRawThought("")
    setDecision("")
    setOptions(["", ""])
    setPriority("")
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2 text-sm">
        {["Dump", "Define", "Options", "Resolve"].map((label, i) => {
          const steps: Step[] = ["dump", "breakdown", "options", "resolve"]
          const isActive = steps.indexOf(step) >= i
          return (
            <div key={label} className="flex items-center gap-2">
              <div
                className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-medium ${
                  isActive ? "bg-primary text-primary-foreground" : "bg-secondary text-muted-foreground"
                }`}
              >
                {i + 1}
              </div>
              <span className={isActive ? "text-foreground" : "text-muted-foreground"}>{label}</span>
              {i < 3 && <ArrowRight className="w-4 h-4 text-muted-foreground" />}
            </div>
          )
        })}
      </div>

      {step === "dump" && (
        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-primary" />
              Brain Dump
            </CardTitle>
            <CardDescription>
              Type out your messy thought. Don't filter. Just dump it all.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Textarea
              placeholder="I don't know if I should work on project A or B, both matter, I'm stuck and keep going back and forth..."
              value={rawThought}
              onChange={(e) => setRawThought(e.target.value)}
              className="min-h-[150px] bg-secondary border-border resize-none"
            />
            <div className="flex justify-between items-center">
              <p className="text-xs text-muted-foreground">
                No infinite thinking allowed.
              </p>
              <Button onClick={handleBreakdown} disabled={!rawThought.trim()}>
                Break it down
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {step === "breakdown" && (
        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="w-5 h-5 text-primary" />
              What is the actual decision?
            </CardTitle>
            <CardDescription>
              Strip away the noise. What are you really trying to decide?
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="p-3 bg-secondary rounded-lg border border-border">
              <p className="text-sm text-muted-foreground mb-1">Your thought:</p>
              <p className="text-sm">{rawThought}</p>
            </div>
            <Input
              placeholder="e.g., Which project should I prioritize this week?"
              value={decision}
              onChange={(e) => setDecision(e.target.value)}
              className="bg-secondary border-border"
            />
            <div className="flex justify-between">
              <Button variant="outline" onClick={reset} className="bg-transparent">
                Start over
              </Button>
              <Button onClick={handleOptions} disabled={!decision.trim()}>
                Define options
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {step === "options" && (
        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ListChecks className="w-5 h-5 text-primary" />
              Your top 2 options
            </CardTitle>
            <CardDescription>
              No 20-variable spirals. Just 2 options. That's the constraint.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="p-3 bg-secondary rounded-lg border border-border">
              <p className="text-sm text-muted-foreground mb-1">Decision:</p>
              <p className="text-sm font-medium">{decision}</p>
            </div>
            <div className="grid gap-3">
              <div>
                <label className="text-sm text-muted-foreground mb-1 block">Option A</label>
                <Input
                  placeholder="e.g., Focus on Project A"
                  value={options[0]}
                  onChange={(e) => setOptions([e.target.value, options[1]])}
                  className="bg-secondary border-border"
                />
              </div>
              <div>
                <label className="text-sm text-muted-foreground mb-1 block">Option B</label>
                <Input
                  placeholder="e.g., Focus on Project B"
                  value={options[1]}
                  onChange={(e) => setOptions([options[0], e.target.value])}
                  className="bg-secondary border-border"
                />
              </div>
              <div>
                <label className="text-sm text-muted-foreground mb-1 block">What matters most? (1 factor only)</label>
                <Input
                  placeholder="e.g., Deadline urgency"
                  value={priority}
                  onChange={(e) => setPriority(e.target.value)}
                  className="bg-secondary border-border"
                />
              </div>
            </div>
            <div className="flex justify-between">
              <Button variant="outline" onClick={() => setStep("breakdown")} className="bg-transparent">
                Back
              </Button>
              <Button
                onClick={() => setStep("resolve")}
                disabled={!options[0].trim() || !options[1].trim() || !priority.trim()}
              >
                Make a decision
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {step === "resolve" && (
        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle>Time to decide</CardTitle>
            <CardDescription>
              Based on "{priority}" being what matters most:
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-3">
              <Button
                variant="outline"
                className="justify-start h-auto py-4 px-4 bg-transparent hover:bg-primary hover:text-primary-foreground"
                onClick={() => handleResolve("do", options[0])}
              >
                <div className="text-left">
                  <p className="font-medium">{options[0]}</p>
                  <p className="text-xs text-muted-foreground mt-1">Do this now</p>
                </div>
              </Button>
              <Button
                variant="outline"
                className="justify-start h-auto py-4 px-4 bg-transparent hover:bg-primary hover:text-primary-foreground"
                onClick={() => handleResolve("do", options[1])}
              >
                <div className="text-left">
                  <p className="font-medium">{options[1]}</p>
                  <p className="text-xs text-muted-foreground mt-1">Do this now</p>
                </div>
              </Button>
            </div>
            <div className="border-t border-border pt-4 flex gap-2">
              <Button
                variant="secondary"
                className="flex-1"
                onClick={() => handleResolve("schedule", decision)}
              >
                Schedule for later
              </Button>
              <Button
                variant="ghost"
                className="flex-1 text-muted-foreground hover:text-destructive"
                onClick={() => handleResolve("ignore")}
              >
                Discard thought
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
