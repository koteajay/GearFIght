"use client"

import { useState } from "react"
import LandingPage from "@/components/landing-page"
import CharacterSelector from "@/components/character-selector"
import GearSetup from "@/components/gear-setup"
import TowerDefenseGame from "@/components/tower-defense-game"
import DifficultySelector from "@/components/difficulty-selector"
import type { GameState, Character, Gear } from "@/types/game"

export default function Home() {
  const [gameState, setGameState] = useState<GameState>("landing")
  const [selectedCharacter, setSelectedCharacter] = useState<Character | null>(null)
  const [equippedGear, setEquippedGear] = useState<Gear[]>([])
  const [currency, setCurrency] = useState(100)
  const [score, setScore] = useState(0)
  const [difficulty, setDifficulty] = useState<"easy" | "medium" | "hard">("easy")

  const handleStartFight = () => {
    if (selectedCharacter) {
      setGameState("difficulty")
    }
  }

  const handleFightEnd = (earnedScore: number, earnedCurrency: number) => {
    setScore((prev) => prev + earnedScore)
    setCurrency((prev) => prev + earnedCurrency)
    setGameState("landing")
  }

  return (
    <div className="w-full h-screen bg-gray-900 text-white overflow-hidden">
      {gameState === "landing" && (
        <LandingPage
          onStartFight={() => (selectedCharacter ? setGameState("difficulty") : setGameState("character"))}
          onGearSetup={() => setGameState("gear")}
          onCharacterSelect={() => setGameState("character")}
          score={score}
          currency={currency}
        />
      )}

      {gameState === "character" && (
        <CharacterSelector
          onCharacterSelect={(character) => {
            setSelectedCharacter(character)
            setGameState("gear")
          }}
          onBack={() => setGameState("landing")}
        />
      )}

      {gameState === "gear" && (
        <GearSetup
          character={selectedCharacter}
          equippedGear={equippedGear}
          currency={currency}
          onGearEquip={setEquippedGear}
          onCurrencyChange={setCurrency}
          onStartFight={handleStartFight}
          onBack={() => setGameState("landing")}
        />
      )}

      {gameState === "difficulty" && (
        <DifficultySelector
          onDifficultySelect={(diff) => {
            setDifficulty(diff)
            setGameState("fighting")
          }}
          onBack={() => setGameState("landing")}
        />
      )}

      {gameState === "fighting" && selectedCharacter && (
        <TowerDefenseGame
          character={selectedCharacter}
          equippedGear={equippedGear}
          difficulty={difficulty}
          onFightEnd={handleFightEnd}
          onBack={() => setGameState("landing")}
        />
      )}
    </div>
  )
}
