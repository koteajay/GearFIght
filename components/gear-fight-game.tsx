"use client"

import { useState } from "react"
import LandingPage from "./landing-page"
import CharacterSelector from "./character-selector"
import GearSetup from "./gear-setup"
import DifficultySelector from "./difficulty-selector"
import TowerDefenseGame from "./tower-defense-game"
import type { GameState, Character, Gear } from "@/types/game"

const characters: Character[] = [
  {
    id: "warrior",
    name: "Warrior",
    baseHealth: 120,
    baseSpeed: 1.2,
    baseDamage: 30,
    color: "#ef4444",
    description: "Strong melee fighter with high health and damage",
  },
  {
    id: "archer",
    name: "Archer",
    baseHealth: 80,
    baseSpeed: 1.8,
    baseDamage: 25,
    color: "#22c55e",
    description: "Ranged fighter with good speed and accuracy",
  },
  {
    id: "mage",
    name: "Mage",
    baseHealth: 60,
    baseSpeed: 1.5,
    baseDamage: 40,
    color: "#3b82f6",
    description: "Magic user with high damage but low health",
  },
  {
    id: "rogue",
    name: "Rogue",
    baseHealth: 70,
    baseSpeed: 2.2,
    baseDamage: 35,
    color: "#8b5cf6",
    description: "Fast assassin with high speed and critical hits",
  },
]

const availableGear: Gear[] = [
  {
    id: "sword",
    name: "Iron Sword",
    type: "weapon",
    damageBoost: 15,
    speedBoost: 0,
    healthBoost: 0,
    cost: 50,
    description: "A sturdy iron sword that increases damage",
  },
  {
    id: "bow",
    name: "Elven Bow",
    type: "weapon",
    damageBoost: 12,
    speedBoost: 5,
    healthBoost: 0,
    cost: 60,
    description: "A lightweight bow that increases damage and speed",
  },
  {
    id: "staff",
    name: "Magic Staff",
    type: "weapon",
    damageBoost: 20,
    speedBoost: 0,
    healthBoost: 0,
    cost: 70,
    description: "A powerful staff that greatly increases magic damage",
  },
  {
    id: "armor",
    name: "Chain Mail",
    type: "armor",
    damageBoost: 0,
    speedBoost: 0,
    healthBoost: 40,
    cost: 45,
    description: "Protective armor that increases health",
  },
  {
    id: "boots",
    name: "Swift Boots",
    type: "speed",
    damageBoost: 0,
    speedBoost: 8,
    healthBoost: 0,
    cost: 35,
    description: "Magical boots that increase movement speed",
  },
  {
    id: "shield",
    name: "Tower Shield",
    type: "armor",
    damageBoost: 0,
    speedBoost: -2,
    healthBoost: 60,
    cost: 55,
    description: "Heavy shield that greatly increases health but reduces speed",
  },
]

export default function GearFightGame() {
  const [gameState, setGameState] = useState<GameState>("landing")
  const [selectedCharacter, setSelectedCharacter] = useState<Character | null>(null)
  const [equippedGear, setEquippedGear] = useState<Gear[]>([])
  const [difficulty, setDifficulty] = useState<"easy" | "medium" | "hard">("medium")
  const [playerStats, setPlayerStats] = useState({
    level: 1,
    experience: 0,
    currency: 100,
    totalScore: 0,
    gamesWon: 0,
    gamesLost: 0,
  })

  const handleCharacterSelect = (character: Character) => {
    setSelectedCharacter(character)
    setGameState("gear")
  }

  const handleGearSetupComplete = (gear: Gear[]) => {
    setEquippedGear(gear)
    setGameState("difficulty")
  }

  const handleDifficultySelect = (selectedDifficulty: "easy" | "medium" | "hard") => {
    setDifficulty(selectedDifficulty)
    setGameState("fighting")
  }

  const handleFightEnd = (score: number, currency: number) => {
    const won = score > 0
    setPlayerStats((prev) => ({
      ...prev,
      currency: prev.currency + currency,
      totalScore: prev.totalScore + score,
      experience: prev.experience + score,
      gamesWon: won ? prev.gamesWon + 1 : prev.gamesWon,
      gamesLost: won ? prev.gamesLost : prev.gamesLost + 1,
      level: Math.floor((prev.experience + score) / 1000) + 1,
    }))
    setGameState("landing")
  }

  const handleBackToMenu = () => {
    setGameState("landing")
  }

  const renderCurrentScreen = () => {
    switch (gameState) {
      case "landing":
        return <LandingPage playerStats={playerStats} onStartGame={() => setGameState("character")} />
      case "character":
        return (
          <CharacterSelector
            characters={characters}
            onCharacterSelect={handleCharacterSelect}
            onBack={handleBackToMenu}
          />
        )
      case "gear":
        return (
          <GearSetup
            character={selectedCharacter!}
            availableGear={availableGear}
            playerCurrency={playerStats.currency}
            onGearSetupComplete={handleGearSetupComplete}
            onBack={() => setGameState("character")}
          />
        )
      case "difficulty":
        return <DifficultySelector onDifficultySelect={handleDifficultySelect} onBack={() => setGameState("gear")} />
      case "fighting":
        return (
          <TowerDefenseGame
            character={selectedCharacter!}
            equippedGear={equippedGear}
            difficulty={difficulty}
            onFightEnd={handleFightEnd}
            onBack={handleBackToMenu}
          />
        )
      default:
        return <LandingPage playerStats={playerStats} onStartGame={() => setGameState("character")} />
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {renderCurrentScreen()}
    </div>
  )
}
