"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import type { Character } from "@/types/game"
import { ArrowLeft } from "lucide-react"

interface CharacterSelectorProps {
  onCharacterSelect: (character: Character) => void
  onBack: () => void
}

const characters: Character[] = [
  {
    id: "warrior",
    name: "Warrior",
    baseHealth: 100,
    baseSpeed: 5,
    baseDamage: 15,
    color: "#ff4444",
    description: "Balanced fighter with good damage and health",
  },
  {
    id: "speedster",
    name: "Speedster",
    baseHealth: 80,
    baseSpeed: 8,
    baseDamage: 12,
    color: "#44ff44",
    description: "Fast and agile, but lower health",
  },
  {
    id: "tank",
    name: "Tank",
    baseHealth: 150,
    baseSpeed: 3,
    baseDamage: 10,
    color: "#4444ff",
    description: "High health but slow movement",
  },
]

export default function CharacterSelector({ onCharacterSelect, onBack }: CharacterSelectorProps) {
  return (
    <div className="flex flex-col h-full bg-gradient-to-b from-gray-900 to-gray-800 p-8">
      <div className="flex items-center mb-8">
        <Button onClick={onBack} variant="ghost" className="mr-4">
          <ArrowLeft className="mr-2" />
          Back
        </Button>
        <h1 className="text-4xl font-bold">Choose Your Fighter</h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto">
        {characters.map((character) => (
          <Card
            key={character.id}
            className="bg-gray-800 border-gray-700 hover:bg-gray-750 transition-colors cursor-pointer"
            onClick={() => onCharacterSelect(character)}
          >
            <CardHeader>
              <CardTitle className="text-center">{character.name}</CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <div className="w-24 h-24 rounded-full mx-auto mb-4" style={{ backgroundColor: character.color }} />
              <p className="text-gray-300 mb-4">{character.description}</p>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>Health:</span>
                  <span className="text-red-400">{character.baseHealth}</span>
                </div>
                <div className="flex justify-between">
                  <span>Speed:</span>
                  <span className="text-green-400">{character.baseSpeed}</span>
                </div>
                <div className="flex justify-between">
                  <span>Damage:</span>
                  <span className="text-yellow-400">{character.baseDamage}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
