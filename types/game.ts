export type GameState = "landing" | "character" | "gear" | "difficulty" | "fighting"

export interface Character {
  id: string
  name: string
  baseHealth: number
  baseSpeed: number
  baseDamage: number
  color: string
  description: string
}

export interface Gear {
  id: string
  name: string
  type: "weapon" | "armor" | "speed"
  damageBoost: number
  speedBoost: number
  healthBoost: number
  cost: number
  description: string
}

export interface GridPosition {
  x: number
  y: number
  occupied: boolean
  gear?: PlacedGear
}

export interface PlacedGear {
  id: string
  type: string
  character: Character
  level: number
  rotation: number
  attackCooldown: number
  range: number
}

export interface Enemy {
  id: string
  x: number
  y: number
  health: number
  maxHealth: number
  speed: number
  damage: number
  type: "basic" | "fast" | "tank" | "boss"
  pathIndex: number
  color: string
  size: number
}

export interface Projectile {
  id: string
  x: number
  y: number
  targetX: number
  targetY: number
  damage: number
  speed: number
  type: "bullet" | "rocket" | "laser"
}

export interface Superpower {
  id: string
  name: string
  type: "rocket" | "lightning" | "freeze" | "heal"
  damage: number
  cost: number
  cooldown: number
  description: string
}
