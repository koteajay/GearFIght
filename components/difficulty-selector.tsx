"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft, Zap, Shield, Skull } from "lucide-react"

interface DifficultySelectorProps {
  onDifficultySelect: (difficulty: "easy" | "medium" | "hard") => void
  onBack: () => void
}

const difficulties = [
  {
    id: "easy" as const,
    name: "Easy",
    waves: 3,
    icon: <Shield className="w-8 h-8 text-green-400" />,
    description: "Perfect for beginners",
    color: "bg-green-600 hover:bg-green-700",
    reward: "50 coins per wave",
  },
  {
    id: "medium" as const,
    name: "Medium",
    waves: 6,
    icon: <Zap className="w-8 h-8 text-yellow-400" />,
    description: "Balanced challenge",
    color: "bg-yellow-600 hover:bg-yellow-700",
    reward: "75 coins per wave",
  },
  {
    id: "hard" as const,
    name: "Hard",
    waves: 12,
    icon: <Skull className="w-8 h-8 text-red-400" />,
    description: "For experienced fighters",
    color: "bg-red-600 hover:bg-red-700",
    reward: "100 coins per wave",
  },
]

export default function DifficultySelector({ onDifficultySelect, onBack }: DifficultySelectorProps) {
  return (
    <div className="flex flex-col h-full bg-gradient-to-b from-gray-900 to-gray-800 p-8">
      <div className="flex items-center mb-8">
        <Button onClick={onBack} variant="ghost" className="mr-4">
          <ArrowLeft className="mr-2" />
          Back
        </Button>
        <h1 className="text-4xl font-bold">Choose Difficulty</h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto">
        {difficulties.map((diff) => (
          <Card
            key={diff.id}
            className="bg-gray-800 border-gray-700 hover:bg-gray-750 transition-colors cursor-pointer"
            onClick={() => onDifficultySelect(diff.id)}
          >
            <CardHeader className="text-center">
              <div className="flex justify-center mb-4">{diff.icon}</div>
              <CardTitle className="text-2xl">{diff.name}</CardTitle>
            </CardHeader>
            <CardContent className="text-center space-y-4">
              <p className="text-gray-300">{diff.description}</p>
              <div className="space-y-2">
                <div className="text-lg font-semibold">{diff.waves} Waves</div>
                <div className="text-sm text-gray-400">{diff.waves >= 6 && "Boss every 6 waves"}</div>
                <div className="text-yellow-400">{diff.reward}</div>
              </div>
              <Button className={`w-full ${diff.color}`}>Select {diff.name}</Button>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="mt-8 text-center text-gray-400">
        <p>💡 Tip: Boss monsters appear every 6 waves in Medium and Hard modes!</p>
      </div>
    </div>
  )
}
