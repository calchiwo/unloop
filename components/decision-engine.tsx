"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Slider } from "@/components/ui/slider"
import { Zap, ArrowRight, RotateCcw } from "lucide-react"
import type { ResolvedThought } from "@/app/page"

interface DecisionEngineProps {
  onResolve: (thought: ResolvedThought) => void
}

export function DecisionEngine({ onResolve }: DecisionEngineProps) {
  const [question, setQuestion] = useState("")
  const [options, setOptions] = useState(["", ""])
  const [factors, setFactors] = useState(["", ""])
  const [scores, setScores] = useState<number[][]>([
    [50, 50],
    [50, 50],
  ])
  const [showResult, setShowResult] = useState(false)

  const calculateResult = () => {
    const optionAScore = scores.reduce((sum, factorScores) => sum + factorScores[0], 0)
    const optionBScore = scores.reduce((sum, factorScores) => sum + factorScores[1], 0)
    return { optionAScore, optionBScore }
  }

  const result = calculateResult()
  const winner = result.optionAScore > result.optionBScore ? 0 : 1
  const confidence = Math.abs(result.optionAScore - result.optionBScore)

  const handleAnalyze = () => {
    setShowResult(true)
  }

  const handleResolve = (resolution: "do" | "schedule" | "ignore") => {
    const action = resolution === "do" ? options[winner] : question
    onResolve({
      id: Date.now().toString(),
      thought: question,
      resolution,
      action,
      timestamp: new Date(),
    })
    reset()
  }

  const reset = () => {
    setQuestion("")
    setOptions(["", ""])
    setFactors(["", ""])
    setScores([
      [50, 50],
      [50, 50],
    ])
    setShowResult(false)
  }

  const isReady =
    question.trim() &&
    options[0].trim() &&
    options[1].trim() &&
    factors[0].trim() &&
    factors[1].trim()

  return (
    <div className="space-y-6">
      <Card className="bg-card border-border">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Zap className="w-5 h-5 text-primary" />
            Forced Decision Engine
          </CardTitle>
          <CardDescription>
            Limited analysis. 2 options. 2 factors. No spirals.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <label className="text-sm font-medium mb-2 block">What are you deciding?</label>
            <Input
              placeholder="e.g., Should I take the new job offer or stay?"
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              className="bg-secondary border-border"
            />
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium mb-2 block">Option A</label>
              <Input
                placeholder="e.g., Take the new job"
                value={options[0]}
                onChange={(e) => setOptions([e.target.value, options[1]])}
                className="bg-secondary border-border"
              />
            </div>
            <div>
              <label className="text-sm font-medium mb-2 block">Option B</label>
              <Input
                placeholder="e.g., Stay at current job"
                value={options[1]}
                onChange={(e) => setOptions([options[0], e.target.value])}
                className="bg-secondary border-border"
              />
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium mb-2 block">Factor 1 (what matters)</label>
              <Input
                placeholder="e.g., Salary & growth"
                value={factors[0]}
                onChange={(e) => setFactors([e.target.value, factors[1]])}
                className="bg-secondary border-border"
              />
            </div>
            <div>
              <label className="text-sm font-medium mb-2 block">Factor 2 (what matters)</label>
              <Input
                placeholder="e.g., Work-life balance"
                value={factors[1]}
                onChange={(e) => setFactors([factors[0], e.target.value])}
                className="bg-secondary border-border"
              />
            </div>
          </div>

          {isReady && (
            <div className="space-y-6 pt-4 border-t border-border">
              <p className="text-sm text-muted-foreground">
                Rate each option on each factor (slide toward the better option):
              </p>
              {factors.map(
                (factor, factorIndex) =>
                  factor && (
                    <div key={factorIndex} className="space-y-3">
                      <p className="text-sm font-medium">{factor}</p>
                      <div className="flex items-center gap-4">
                        <span className="text-xs text-muted-foreground w-24 truncate">
                          {options[0]}
                        </span>
                        <Slider
                          value={[scores[factorIndex][0]]}
                          onValueChange={([value]) => {
                            const newScores = [...scores]
                            newScores[factorIndex] = [value, 100 - value]
                            setScores(newScores)
                          }}
                          max={100}
                          step={5}
                          className="flex-1"
                        />
                        <span className="text-xs text-muted-foreground w-24 truncate text-right">
                          {options[1]}
                        </span>
                      </div>
                    </div>
                  )
              )}
            </div>
          )}

          <div className="flex justify-between pt-4">
            <Button variant="outline" onClick={reset} className="bg-transparent">
              <RotateCcw className="w-4 h-4 mr-2" />
              Reset
            </Button>
            <Button onClick={handleAnalyze} disabled={!isReady}>
              Calculate
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </div>
        </CardContent>
      </Card>

      {showResult && isReady && (
        <Card className="bg-card border-primary">
          <CardHeader>
            <CardTitle className="text-primary">Recommendation</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="text-center py-4">
              <p className="text-2xl font-bold">{options[winner]}</p>
              <p className="text-sm text-muted-foreground mt-2">
                {confidence > 30
                  ? "Strong signal"
                  : confidence > 10
                  ? "Slight preference"
                  : "Too close to call - pick either one"}
              </p>
            </div>
            <div className="grid grid-cols-2 gap-4 text-center py-2">
              <div className={`p-3 rounded-lg ${winner === 0 ? "bg-primary/10" : "bg-secondary"}`}>
                <p className="text-sm font-medium">{options[0]}</p>
                <p className="text-2xl font-bold">{result.optionAScore}</p>
              </div>
              <div className={`p-3 rounded-lg ${winner === 1 ? "bg-primary/10" : "bg-secondary"}`}>
                <p className="text-sm font-medium">{options[1]}</p>
                <p className="text-2xl font-bold">{result.optionBScore}</p>
              </div>
            </div>
            <div className="flex gap-2 pt-4 border-t border-border">
              <Button className="flex-1" onClick={() => handleResolve("do")}>
                Do it
              </Button>
              <Button variant="secondary" className="flex-1" onClick={() => handleResolve("schedule")}>
                Schedule
              </Button>
              <Button variant="ghost" onClick={() => handleResolve("ignore")}>
                Discard
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
