"use client"
import GearFightGame from "@/components/gear-fight-game"
import type { Character, Gear } from "@/types/game"

const defaultCharacters: Character[] = [
  {
    id: "warrior",
    name: "Warrior",
    baseHealth: 100,
    baseSpeed: 50,
    baseDamage: 25,
    color: "#ef4444",
    description: "Strong melee fighter with high damage",
  },
  {
    id: "speedster",
    name: "Speedster",
    baseHealth: 70,
    baseSpeed: 80,
    baseDamage: 20,
    color: "#22c55e",
    description: "Fast attacker with quick movements",
  },
  {
    id: "tank",
    name: "Tank",
    baseHealth: 150,
    baseSpeed: 30,
    baseDamage: 30,
    color: "#3b82f6",
    description: "Heavy defender with massive health",
  },
]

const availableGear: Gear[] = [
  {
    id: "iron-sword",
    name: "Iron Sword",
    type: "weapon",
    damageBoost: 15,
    speedBoost: 0,
    healthBoost: 0,
    cost: 50,
    description: "Sharp blade that increases attack power",
  },
  {
    id: "power-gloves",
    name: "Power Gloves",
    type: "weapon",
    damageBoost: 25,
    speedBoost: 5,
    healthBoost: 0,
    cost: 80,
    description: "Magical gloves that boost strength and speed",
  },
  {
    id: "armor-vest",
    name: "Armor Vest",
    type: "armor",
    damageBoost: 0,
    speedBoost: -10,
    healthBoost: 50,
    cost: 60,
    description: "Heavy protection that increases health",
  },
  {
    id: "speed-boots",
    name: "Speed Boots",
    type: "speed",
    damageBoost: 0,
    speedBoost: 20,
    healthBoost: 0,
    cost: 40,
    description: "Lightweight boots for faster movement",
  },
]

export default function Home() {
  return <GearFightGame />
}
