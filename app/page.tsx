"use client"

import { useState } from "react"
import LandingPage from "@/components/landing-page"
import CharacterSelector from "@/components/character-selector"
import GearSetup from "@/components/gear-setup"
import DifficultySelector from "@/components/difficulty-selector"
import TowerDefenseGame from "@/components/tower-defense-game"
import type { GameState, Character, Gear } from "@/types/game"

export default function Home() {
  const [gameState, setGameState] = useState<GameState>("landing")
  const [selectedCharacter, setSelectedCharacter] = useState<Character | null>(null)
  const [equippedGear, setEquippedGear] = useState<Gear[]>([])
  const [currency, setCurrency] = useState(200)
  const [difficulty, setDifficulty] = useState<"easy" | "medium" | "hard">("easy")

  const handleCharacterSelect = (character: Character) => {
    setSelectedCharacter(character)
    setGameState("gear")
  }

  const handleGearEquip = (gear: Gear[]) => {
    setEquippedGear(gear)
  }

  const handleCurrencyChange = (newCurrency: number) => {
    setCurrency(newCurrency)
  }

  const handleDifficultySelect = (selectedDifficulty: "easy" | "medium" | "hard") => {
    setDifficulty(selectedDifficulty)
    setGameState("fighting")
  }

  const handleFightEnd = (score: number, earnedCurrency: number) => {
    setCurrency(currency + earnedCurrency)
    setGameState("landing")
  }

  const handleStartFight = () => {
    setGameState("difficulty")
  }

  return (
    <div className="min-h-screen">
      {gameState === "landing" && (
        <LandingPage
          onStartFight={() => setGameState("character")}
          onGearSetup={() => setGameState("character")}
          onViewScore={() => {}}
          currency={currency}
        />
      )}

      {gameState === "character" && (
        <CharacterSelector onCharacterSelect={handleCharacterSelect} onBack={() => setGameState("landing")} />
      )}

      {gameState === "gear" && (
        <GearSetup
          character={selectedCharacter}
          equippedGear={equippedGear}
          currency={currency}
          onGearEquip={handleGearEquip}
          onCurrencyChange={handleCurrencyChange}
          onStartFight={handleStartFight}
          onBack={() => setGameState("character")}
        />
      )}

      {gameState === "difficulty" && (
        <DifficultySelector onDifficultySelect={handleDifficultySelect} onBack={() => setGameState("gear")} />
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
