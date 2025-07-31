"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft, Sword, Shield, Zap } from "lucide-react"
import type { Character } from "@/types/game"

interface CharacterSelectorProps {
  onCharacterSelect: (character: Character) => void
  onBack: () => void
}

const availableCharacters: Character[] = [
  {
    id: "warrior",
    name: "Steel Warrior",
    baseHealth: 100,
    baseSpeed: 50,
    baseDamage: 30,
    color: "#ef4444",
    description: "Balanced fighter with strong armor and reliable damage",
  },
  {
    id: "speedster",
    name: "Lightning Speedster",
    baseHealth: 70,
    baseSpeed: 90,
    baseDamage: 25,
    color: "#22c55e",
    description: "Fast and agile, strikes quickly but fragile",
  },
  {
    id: "tank",
    name: "Iron Tank",
    baseHealth: 150,
    baseSpeed: 30,
    baseDamage: 40,
    color: "#3b82f6",
    description: "Heavy armor, slow but devastating attacks",
  },
]

export default function CharacterSelector({ onCharacterSelect, onBack }: CharacterSelectorProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-blue-900 p-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center mb-8">
          <Button onClick={onBack} variant="ghost" className="text-white hover:bg-white/20">
            <ArrowLeft className="mr-2" />
            Back
          </Button>
          <h1 className="text-4xl font-bold text-white ml-8">Choose Your Hero</h1>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {availableCharacters.map((character) => (
            <Card
              key={character.id}
              className="bg-black/40 border-2 hover:border-white/50 transition-all duration-300 hover:scale-105 cursor-pointer backdrop-blur-sm"
              onClick={() => onCharacterSelect(character)}
            >
              <CardHeader className="text-center">
                <div
                  className="w-24 h-24 rounded-full mx-auto mb-4 flex items-center justify-center text-4xl"
                  style={{ backgroundColor: character.color }}
                >
                  {character.id === "warrior" && <Sword className="w-12 h-12 text-white" />}
                  {character.id === "speedster" && <Zap className="w-12 h-12 text-white" />}
                  {character.id === "tank" && <Shield className="w-12 h-12 text-white" />}
                </div>
                <CardTitle className="text-2xl text-white">{character.name}</CardTitle>
              </CardHeader>
              <CardContent className="text-center space-y-4">
                <p className="text-gray-300">{character.description}</p>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-red-400">Health:</span>
                    <span className="text-white font-bold">{character.baseHealth}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-green-400">Speed:</span>
                    <span className="text-white font-bold">{character.baseSpeed}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-yellow-400">Damage:</span>
                    <span className="text-white font-bold">{character.baseDamage}</span>
                  </div>
                </div>
                <Button className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500">
                  Select Hero
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}
