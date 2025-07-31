"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Skull, Shield, Sword } from "lucide-react"

interface DifficultySelectorProps {
  onDifficultySelect: (difficulty: "easy" | "medium" | "hard") => void
  onBack: () => void
}

const difficulties = [
  {
    id: "easy" as const,
    name: "Recruit",
    icon: Shield,
    color: "text-green-400",
    borderColor: "border-green-500/50",
    description: "Perfect for beginners",
    waves: 5,
    enemyStrength: "Weak",
    rewards: "Standard",
    features: ["Slower enemy spawn rate", "Weaker enemy units", "More starting currency", "5 waves total"],
  },
  {
    id: "medium" as const,
    name: "Veteran",
    icon: Sword,
    color: "text-yellow-400",
    borderColor: "border-yellow-500/50",
    description: "Balanced challenge",
    waves: 10,
    enemyStrength: "Normal",
    rewards: "Increased",
    features: ["Moderate enemy spawn rate", "Standard enemy units", "Normal starting currency", "10 waves total"],
  },
  {
    id: "hard" as const,
    name: "Champion",
    icon: Skull,
    color: "text-red-400",
    borderColor: "border-red-500/50",
    description: "For experienced warriors",
    waves: 15,
    enemyStrength: "Strong",
    rewards: "Maximum",
    features: ["Fast enemy spawn rate", "Powerful enemy units", "Limited starting currency", "15 waves total"],
  },
]

export default function DifficultySelector({ onDifficultySelect, onBack }: DifficultySelectorProps) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <div className="max-w-6xl w-full">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <Button onClick={onBack} variant="ghost" className="text-white hover:bg-white/20">
            <ArrowLeft className="mr-2" />
            Back
          </Button>
          <h1 className="text-4xl font-bold text-center bg-gradient-to-r from-red-500 to-orange-500 bg-clip-text text-transparent">
            Choose Your Challenge
          </h1>
          <div className="w-20" /> {/* Spacer */}
        </div>

        {/* Difficulty Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {difficulties.map((difficulty) => {
            const IconComponent = difficulty.icon
            return (
              <Card
                key={difficulty.id}
                className={`bg-black/40 border-2 ${difficulty.borderColor} hover:border-opacity-100 transition-all duration-300 cursor-pointer transform hover:scale-105 backdrop-blur-sm`}
                onClick={() => onDifficultySelect(difficulty.id)}
              >
                <CardHeader className="text-center pb-4">
                  <div className="flex justify-center mb-4">
                    <IconComponent className={`w-16 h-16 ${difficulty.color}`} />
                  </div>
                  <CardTitle className={`text-2xl ${difficulty.color}`}>{difficulty.name}</CardTitle>
                  <p className="text-gray-400 text-sm">{difficulty.description}</p>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Quick Stats */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-white">{difficulty.waves}</div>
                      <div className="text-xs text-gray-400">Waves</div>
                    </div>
                    <div className="text-center">
                      <div className={`text-sm font-bold ${difficulty.color}`}>{difficulty.enemyStrength}</div>
                      <div className="text-xs text-gray-400">Enemies</div>
                    </div>
                  </div>

                  {/* Features */}
                  <div className="space-y-2">
                    {difficulty.features.map((feature, index) => (
                      <div key={index} className="flex items-center gap-2">
                        <div className={`w-2 h-2 rounded-full ${difficulty.color.replace("text-", "bg-")}`} />
                        <span className="text-sm text-gray-300">{feature}</span>
                      </div>
                    ))}
                  </div>

                  {/* Rewards Badge */}
                  <div className="text-center">
                    <Badge variant="outline" className={`${difficulty.color} ${difficulty.borderColor}`}>
                      {difficulty.rewards} Rewards
                    </Badge>
                  </div>

                  {/* Select Button */}
                  <Button
                    className={`w-full bg-gradient-to-r ${
                      difficulty.id === "easy"
                        ? "from-green-600 to-green-700 hover:from-green-500 hover:to-green-600"
                        : difficulty.id === "medium"
                          ? "from-yellow-600 to-orange-600 hover:from-yellow-500 hover:to-orange-500"
                          : "from-red-600 to-red-700 hover:from-red-500 hover:to-red-600"
                    }`}
                    onClick={(e) => {
                      e.stopPropagation()
                      onDifficultySelect(difficulty.id)
                    }}
                  >
                    Select {difficulty.name}
                  </Button>
                </CardContent>
              </Card>
            )
          })}
        </div>

        {/* Instructions */}
        <div className="mt-8 text-center">
          <p className="text-gray-400 mb-4">
            Choose your difficulty level carefully! Higher difficulties offer greater rewards but pose more challenging
            battles.
          </p>
          <div className="flex flex-wrap justify-center gap-2">
            <Badge variant="outline" className="text-green-400 border-green-400">
              Easy: Great for Learning
            </Badge>
            <Badge variant="outline" className="text-yellow-400 border-yellow-400">
              Medium: Balanced Experience
            </Badge>
            <Badge variant="outline" className="text-red-400 border-red-400">
              Hard: Maximum Challenge
            </Badge>
          </div>
        </div>
      </div>
    </div>
  )
}
