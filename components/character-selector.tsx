"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Heart, Zap, Sword } from "lucide-react"
import type { Character } from "@/types/game"

interface CharacterSelectorProps {
  characters: Character[]
  onCharacterSelect: (character: Character) => void
  onBack: () => void
}

export default function CharacterSelector({ characters, onCharacterSelect, onBack }: CharacterSelectorProps) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <div className="max-w-6xl w-full">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <Button onClick={onBack} variant="ghost" className="text-white hover:bg-white/20">
            <ArrowLeft className="mr-2" />
            Back
          </Button>
          <h1 className="text-4xl font-bold text-center bg-gradient-to-r from-blue-500 to-purple-500 bg-clip-text text-transparent">
            Choose Your Champion
          </h1>
          <div className="w-20" /> {/* Spacer */}
        </div>

        {/* Character Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {characters.map((character) => (
            <Card
              key={character.id}
              className="bg-black/40 border-2 border-gray-600 hover:border-purple-500 transition-all duration-300 cursor-pointer transform hover:scale-105 backdrop-blur-sm"
              onClick={() => onCharacterSelect(character)}
            >
              <CardHeader className="text-center pb-4">
                <div className="text-6xl mb-4">
                  {character.id === "warrior" && "⚔️"}
                  {character.id === "archer" && "🏹"}
                  {character.id === "mage" && "🧙‍♂️"}
                  {character.id === "rogue" && "🗡️"}
                </div>
                <CardTitle className="text-2xl" style={{ color: character.color }}>
                  {character.name}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Stats */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Heart className="w-4 h-4 text-red-500" />
                      <span className="text-sm text-gray-300">Health</span>
                    </div>
                    <Badge variant="outline" className="text-red-400 border-red-400">
                      {character.baseHealth}
                    </Badge>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Sword className="w-4 h-4 text-orange-500" />
                      <span className="text-sm text-gray-300">Damage</span>
                    </div>
                    <Badge variant="outline" className="text-orange-400 border-orange-400">
                      {character.baseDamage}
                    </Badge>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Zap className="w-4 h-4 text-blue-500" />
                      <span className="text-sm text-gray-300">Speed</span>
                    </div>
                    <Badge variant="outline" className="text-blue-400 border-blue-400">
                      {character.baseSpeed}
                    </Badge>
                  </div>
                </div>

                {/* Description */}
                <p className="text-sm text-gray-400 text-center">{character.description}</p>

                {/* Select Button */}
                <Button
                  className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500"
                  onClick={(e) => {
                    e.stopPropagation()
                    onCharacterSelect(character)
                  }}
                >
                  Select Champion
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Instructions */}
        <div className="mt-8 text-center">
          <p className="text-gray-400">
            Choose your champion wisely! Each character has unique strengths that will affect your battle strategy.
          </p>
        </div>
      </div>
    </div>
  )
}
