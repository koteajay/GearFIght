"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft, Skull, Shield, Zap } from "lucide-react"

interface DifficultySelectorProps {
  onDifficultySelect: (difficulty: "easy" | "medium" | "hard") => void
  onBack: () => void
}

const difficulties = [
  {
    id: "easy" as const,
    name: "Easy",
    icon: Shield,
    color: "from-green-600 to-green-700",
    borderColor: "border-green-500/50",
    waves: 3,
    description: "Perfect for beginners. Fewer enemies, more time to strategize.",
    features: ["3 Waves", "Weak Enemies", "Bonus Currency"],
  },
  {
    id: "medium" as const,
    name: "Medium",
    icon: Zap,
    color: "from-yellow-600 to-orange-600",
    borderColor: "border-yellow-500/50",
    waves: 6,
    description: "Balanced challenge. Boss appears at wave 6.",
    features: ["6 Waves", "Mixed Enemies", "Boss at Wave 6"],
  },
  {
    id: "hard" as const,
    name: "Hard",
    icon: Skull,
    color: "from-red-600 to-red-700",
    borderColor: "border-red-500/50",
    waves: 12,
    description: "Ultimate challenge! Multiple bosses and relentless waves.",
    features: ["12 Waves", "Strong Enemies", "Boss Every 6 Waves"],
  },
]

export default function DifficultySelector({ onDifficultySelect, onBack }: DifficultySelectorProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-blue-900 p-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center mb-8">
          <Button onClick={onBack} variant="ghost" className="text-white hover:bg-white/20">
            <ArrowLeft className="mr-2" />
            Back
          </Button>
          <h1 className="text-4xl font-bold text-white ml-8">Choose Difficulty</h1>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {difficulties.map((difficulty) => {
            const Icon = difficulty.icon
            return (
              <Card
                key={difficulty.id}
                className={`bg-black/40 ${difficulty.borderColor} border-2 hover:border-white/50 transition-all duration-300 hover:scale-105 cursor-pointer backdrop-blur-sm`}
                onClick={() => onDifficultySelect(difficulty.id)}
              >
                <CardHeader className="text-center">
                  <div
                    className={`w-20 h-20 rounded-full mx-auto mb-4 flex items-center justify-center bg-gradient-to-r ${difficulty.color}`}
                  >
                    <Icon className="w-10 h-10 text-white" />
                  </div>
                  <CardTitle className="text-3xl text-white">{difficulty.name}</CardTitle>
                </CardHeader>
                <CardContent className="text-center space-y-4">
                  <p className="text-gray-300 text-lg">{difficulty.description}</p>
                  <div className="space-y-2">
                    {difficulty.features.map((feature, index) => (
                      <div key={index} className="flex items-center justify-center gap-2">
                        <div className="w-2 h-2 bg-white rounded-full"></div>
                        <span className="text-white">{feature}</span>
                      </div>
                    ))}
                  </div>
                  <Button
                    className={`w-full bg-gradient-to-r ${difficulty.color} hover:opacity-90 text-white font-bold py-3 text-lg`}
                  >
                    Select {difficulty.name}
                  </Button>
                </CardContent>
              </Card>
            )
          })}
        </div>

        <div className="mt-12 text-center">
          <Card className="bg-black/40 border-purple-500/50 max-w-2xl mx-auto">
            <CardContent className="p-6">
              <h3 className="text-2xl font-bold text-purple-400 mb-4">💡 Pro Tips</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-left">
                <div>
                  <h4 className="text-white font-semibold mb-2">🎯 Strategy</h4>
                  <p className="text-gray-300 text-sm">Place characters near enemy paths for maximum damage</p>
                </div>
                <div>
                  <h4 className="text-white font-semibold mb-2">⚡ Superpowers</h4>
                  <p className="text-gray-300 text-sm">Save superpowers for boss waves and emergencies</p>
                </div>
                <div>
                  <h4 className="text-white font-semibold mb-2">💰 Economy</h4>
                  <p className="text-gray-300 text-sm">Balance spending on characters vs superpowers</p>
                </div>
                <div>
                  <h4 className="text-white font-semibold mb-2">🛡️ Defense</h4>
                  <p className="text-gray-300 text-sm">Don't let enemies reach your base!</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
