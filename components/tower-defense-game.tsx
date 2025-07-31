"use client"

import { useEffect, useRef, useState, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import type { Character, Gear } from "@/types/game"
import { ArrowLeft, Pause, Play, Zap, Target, Snowflake, Heart } from "lucide-react"

interface TowerDefenseGameProps {
  character: Character
  equippedGear: Gear[]
  difficulty: "easy" | "medium" | "hard"
  onFightEnd: (score: number, currency: number) => void
  onBack: () => void
}

const CANVAS_WIDTH = 1000
const CANVAS_HEIGHT = 600
const GROUND_Y = 500

interface Unit {
  id: string
  x: number
  y: number
  hp: number
  maxHp: number
  damage: number
  speed: number
  type: "hero" | "villain"
  unitType: string
  emoji: string
  color: string
  size: number
  attackCooldown: number
  isAttacking: boolean
  target?: Unit
}

interface Projectile {
  id: string
  x: number
  y: number
  targetX: number
  targetY: number
  damage: number
  speed: number
  color: string
}

interface Superpower {
  id: string
  name: string
  type: "rocket" | "lightning" | "freeze" | "heal"
  damage: number
  cost: number
  cooldown: number
  description: string
}

// Hero types that can be spawned (come from LEFT)
const heroTypes = [
  {
    id: "knight",
    name: "Knight",
    emoji: "🤴",
    hp: 100,
    damage: 25,
    speed: 1.5,
    cost: 50,
    color: "#ef4444",
    size: 40,
  },
  {
    id: "archer",
    name: "Archer",
    emoji: "🧝‍♂️",
    hp: 60,
    damage: 35,
    speed: 2.0,
    cost: 40,
    color: "#22c55e",
    size: 38,
  },
  {
    id: "mage",
    name: "Mage",
    emoji: "🧙‍♂️",
    hp: 50,
    damage: 45,
    speed: 1.8,
    cost: 60,
    color: "#3b82f6",
    size: 40,
  },
  {
    id: "warrior",
    name: "Warrior",
    emoji: "🥷",
    hp: 80,
    damage: 30,
    speed: 2.2,
    cost: 45,
    color: "#8b5cf6",
    size: 38,
  },
  {
    id: "tank",
    name: "Guardian",
    emoji: "🛡️",
    hp: 200,
    damage: 15,
    speed: 1.0,
    cost: 80,
    color: "#f59e0b",
    size: 45,
  },
]

// Villain types that spawn from RIGHT
const villainTypes = [
  {
    id: "goblin",
    name: "Goblin",
    emoji: "👹",
    hp: 40,
    damage: 15,
    speed: 2.0,
    color: "#dc2626",
    size: 35,
  },
  {
    id: "orc",
    name: "Orc",
    emoji: "🧌",
    hp: 80,
    damage: 25,
    speed: 1.5,
    color: "#16a34a",
    size: 40,
  },
  {
    id: "troll",
    name: "Troll",
    emoji: "🧟",
    hp: 150,
    damage: 35,
    speed: 1.2,
    color: "#0891b2",
    size: 45,
  },
  {
    id: "dragon",
    name: "Dragon",
    emoji: "🐉",
    hp: 300,
    damage: 50,
    speed: 0.8,
    color: "#7f1d1d",
    size: 60,
  },
]

const superpowers: Superpower[] = [
  {
    id: "rocket",
    name: "Rocket Strike",
    type: "rocket",
    damage: 150,
    cost: 100,
    cooldown: 15000,
    description: "Massive area damage to enemies",
  },
  {
    id: "lightning",
    name: "Lightning Chain",
    type: "lightning",
    damage: 80,
    cost: 80,
    cooldown: 12000,
    description: "Chain lightning through enemies",
  },
  {
    id: "freeze",
    name: "Ice Storm",
    type: "freeze",
    damage: 30,
    cost: 60,
    cooldown: 18000,
    description: "Slows and damages all enemies",
  },
  {
    id: "heal",
    name: "Battle Heal",
    type: "heal",
    damage: 0,
    cost: 70,
    cooldown: 20000,
    description: "Heals all heroes",
  },
]

export default function TowerDefenseGame({
  character,
  equippedGear,
  difficulty,
  onFightEnd,
  onBack,
}: TowerDefenseGameProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const gameLoopRef = useRef<number>()

  const [gameState, setGameState] = useState<"playing" | "paused" | "gameOver" | "victory" | "waveComplete">("playing")
  const [wave, setWave] = useState(1)
  const [score, setScore] = useState(0)
  const [baseHp, setBaseHp] = useState(100)
  const [currency, setCurrency] = useState(200)
  const [units, setUnits] = useState<Unit[]>([])
  const [projectiles, setProjectiles] = useState<Projectile[]>([])
  const [superpowerCooldowns, setSuperpowerCooldowns] = useState<Record<string, number>>({})
  const [waveVillains, setWaveVillains] = useState<number>(0) // Track villains spawned this wave
  const [waveStarted, setWaveStarted] = useState<boolean>(false)

  const maxWaves = difficulty === "easy" ? 5 : difficulty === "medium" ? 10 : 15

  // Calculate villains per wave (like original GearFight)
  const getVillainsForWave = (waveNum: number) => {
    return Math.min(3 + waveNum, 8) // Wave 1: 4, Wave 2: 5, etc., max 8
  }

  const spawnWaveVillains = useCallback(() => {
    const villainsToSpawn = getVillainsForWave(wave)
    const newVillains: Unit[] = []

    for (let i = 0; i < villainsToSpawn; i++) {
      const villainType = villainTypes[Math.floor(Math.random() * villainTypes.length)]
      const newVillain: Unit = {
        id: `villain-${wave}-${i}`,
        x: CANVAS_WIDTH + 50 + i * 60, // Spawn with spacing
        y: GROUND_Y - villainType.size,
        hp: villainType.hp + wave * 15,
        maxHp: villainType.hp + wave * 15,
        damage: villainType.damage + wave * 3,
        speed: villainType.speed + wave * 0.05,
        type: "villain",
        unitType: villainType.id,
        emoji: villainType.emoji,
        color: villainType.color,
        size: villainType.size,
        attackCooldown: 0,
        isAttacking: false,
      }
      newVillains.push(newVillain)
    }

    setUnits((prev) => [...prev, ...newVillains])
    setWaveVillains(villainsToSpawn)
    setWaveStarted(true)
  }, [wave])

  const spawnHero = (heroType: any) => {
    if (currency < heroType.cost) return

    const newHero: Unit = {
      id: `hero-${Date.now()}-${Math.random()}`,
      x: -50,
      y: GROUND_Y - heroType.size,
      hp: heroType.hp,
      maxHp: heroType.hp,
      damage: heroType.damage,
      speed: heroType.speed,
      type: "hero",
      unitType: heroType.id,
      emoji: heroType.emoji,
      color: heroType.color,
      size: heroType.size,
      attackCooldown: 0,
      isAttacking: false,
    }

    setUnits((prev) => [...prev, newHero])
    setCurrency((prev) => prev - heroType.cost)
  }

  const useSuperpower = (superpower: Superpower) => {
    if (currency < superpower.cost || superpowerCooldowns[superpower.id] > 0) return

    setCurrency((prev) => prev - superpower.cost)
    setSuperpowerCooldowns((prev) => ({
      ...prev,
      [superpower.id]: superpower.cooldown,
    }))

    switch (superpower.type) {
      case "rocket":
        const villains = units.filter((u) => u.type === "villain")
        if (villains.length > 0) {
          const centerX = villains.reduce((sum, v) => sum + v.x, 0) / villains.length
          setUnits((prev) =>
            prev.map((unit) => {
              if (unit.type === "villain" && Math.abs(unit.x - centerX) < 150) {
                return { ...unit, hp: Math.max(0, unit.hp - superpower.damage) }
              }
              return unit
            }),
          )
        }
        break

      case "lightning":
        setUnits((prev) =>
          prev.map((unit) => {
            if (unit.type === "villain") {
              return { ...unit, hp: Math.max(0, unit.hp - superpower.damage) }
            }
            return unit
          }),
        )
        break

      case "freeze":
        setUnits((prev) =>
          prev.map((unit) => {
            if (unit.type === "villain") {
              return {
                ...unit,
                speed: unit.speed * 0.3,
                hp: Math.max(0, unit.hp - superpower.damage),
              }
            }
            return unit
          }),
        )
        setTimeout(() => {
          setUnits((prev) =>
            prev.map((unit) => {
              if (unit.type === "villain") {
                return { ...unit, speed: unit.speed / 0.3 }
              }
              return unit
            }),
          )
        }, 5000)
        break

      case "heal":
        setUnits((prev) =>
          prev.map((unit) => {
            if (unit.type === "hero") {
              return { ...unit, hp: Math.min(unit.maxHp, unit.hp + 100) }
            }
            return unit
          }),
        )
        break
    }
  }

  const startNextWave = () => {
    setWave((prev) => prev + 1)
    setGameState("playing")
    setCurrency((prev) => prev + 50)
    setWaveStarted(false)
    setWaveVillains(0)
  }

  const gameLoop = useCallback(() => {
    if (gameState !== "playing") return

    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Clear canvas with battlefield background
    const gradient = ctx.createLinearGradient(0, 0, canvas.width, 0)
    gradient.addColorStop(0, "#1e3a8a") // Blue (hero side - LEFT)
    gradient.addColorStop(0.5, "#374151") // Gray (battlefield)
    gradient.addColorStop(1, "#7f1d1d") // Red (villain side - RIGHT)
    ctx.fillStyle = gradient
    ctx.fillRect(0, 0, canvas.width, canvas.height)

    // Draw ground
    ctx.fillStyle = "#22c55e"
    ctx.fillRect(0, GROUND_Y, canvas.width, canvas.height - GROUND_Y)

    // Draw battlefield line
    ctx.strokeStyle = "#ffffff"
    ctx.lineWidth = 3
    ctx.setLineDash([10, 10])
    ctx.beginPath()
    ctx.moveTo(canvas.width / 2, 0)
    ctx.lineTo(canvas.width / 2, canvas.height)
    ctx.stroke()
    ctx.setLineDash([])

    // Spawn wave villains if not started
    if (!waveStarted) {
      spawnWaveVillains()
    }

    // Update units
    setUnits((prevUnits) => {
      return prevUnits.filter((unit) => {
        // Find nearest enemy to fight
        const enemies = prevUnits.filter((u) => u.type !== unit.type && u.hp > 0)
        const nearestEnemy = enemies
          .filter((enemy) => Math.abs(enemy.x - unit.x) < 80)
          .sort((a, b) => Math.abs(a.x - unit.x) - Math.abs(b.x - unit.x))[0]

        unit.target = nearestEnemy

        // Move only if no target nearby
        if (!unit.target) {
          unit.isAttacking = false
          if (unit.type === "hero") {
            unit.x += unit.speed // Heroes move RIGHT
            // Check if hero reached the right side (enemy base)
            if (unit.x > CANVAS_WIDTH) {
              setScore((prev) => prev + 50)
              setCurrency((prev) => prev + 20)
              return false
            }
          } else {
            unit.x -= unit.speed // Villains move LEFT
            // Check if villain reached the left side (player base)
            if (unit.x < 0) {
              setBaseHp((prev) => Math.max(0, prev - unit.damage))
              return false
            }
          }
        } else {
          // Combat logic
          unit.isAttacking = true
          if (unit.attackCooldown <= 0) {
            // Ranged attack for archers and mages
            if (unit.unitType === "archer" || unit.unitType === "mage") {
              setProjectiles((prev) => [
                ...prev,
                {
                  id: `proj-${Date.now()}-${Math.random()}`,
                  x: unit.x,
                  y: unit.y + unit.size / 2,
                  targetX: unit.target.x,
                  targetY: unit.target.y + unit.target.size / 2,
                  damage: unit.damage,
                  speed: 8,
                  color: unit.color,
                },
              ])
            } else {
              // Melee attack
              unit.target.hp -= unit.damage
              if (unit.target.hp <= 0) {
                if (unit.type === "hero") {
                  setScore((prev) => prev + 25)
                  setCurrency((prev) => prev + 10)
                }
              }
            }
            unit.attackCooldown = 60 // 1 second at 60fps
          }
        }

        if (unit.attackCooldown > 0) {
          unit.attackCooldown--
        }

        return unit.hp > 0
      })
    })

    // Update projectiles
    setProjectiles((prevProjectiles) => {
      return prevProjectiles.filter((projectile) => {
        const dx = projectile.targetX - projectile.x
        const dy = projectile.targetY - projectile.y
        const distance = Math.sqrt(dx * dx + dy * dy)

        if (distance < projectile.speed) {
          // Hit target
          setUnits((prev) =>
            prev.map((unit) => {
              const hitDistance = Math.sqrt((unit.x - projectile.targetX) ** 2 + (unit.y - projectile.targetY) ** 2)
              if (hitDistance < 30) {
                const newHp = Math.max(0, unit.hp - projectile.damage)
                if (newHp === 0 && unit.hp > 0 && unit.type === "villain") {
                  setScore((prev) => prev + 25)
                  setCurrency((prev) => prev + 10)
                }
                return { ...unit, hp: newHp }
              }
              return unit
            }),
          )
          return false
        }

        projectile.x += (dx / distance) * projectile.speed
        projectile.y += (dy / distance) * projectile.speed
        return true
      })
    })

    // Draw units
    units.forEach((unit) => {
      // Unit body
      ctx.fillStyle = unit.color
      ctx.globalAlpha = unit.isAttacking ? 1.0 : 0.8
      ctx.beginPath()
      ctx.arc(unit.x, unit.y + unit.size / 2, unit.size / 2, 0, Math.PI * 2)
      ctx.fill()
      ctx.globalAlpha = 1

      // Unit emoji
      ctx.font = `${unit.size}px Arial`
      ctx.textAlign = "center"
      ctx.textBaseline = "middle"
      ctx.fillStyle = "#ffffff"
      ctx.fillText(unit.emoji, unit.x, unit.y + unit.size / 2)

      // Health bar
      const barWidth = unit.size + 10
      const barHeight = 6
      ctx.fillStyle = "#7f1d1d"
      ctx.fillRect(unit.x - barWidth / 2, unit.y - 10, barWidth, barHeight)
      ctx.fillStyle = unit.type === "hero" ? "#22c55e" : "#dc2626"
      ctx.fillRect(unit.x - barWidth / 2, unit.y - 10, (unit.hp / unit.maxHp) * barWidth, barHeight)

      // Attack indicator
      if (unit.isAttacking) {
        ctx.strokeStyle = "#fbbf24"
        ctx.lineWidth = 3
        ctx.globalAlpha = 0.7
        ctx.beginPath()
        ctx.arc(unit.x, unit.y + unit.size / 2, unit.size / 2 + 10, 0, Math.PI * 2)
        ctx.stroke()
        ctx.globalAlpha = 1
      }

      // Movement indicator (only when not fighting)
      if (!unit.target) {
        ctx.strokeStyle = unit.type === "hero" ? "#22c55e" : "#dc2626"
        ctx.lineWidth = 2
        ctx.globalAlpha = 0.5
        ctx.beginPath()
        if (unit.type === "hero") {
          // Arrow pointing right for heroes
          ctx.moveTo(unit.x + unit.size / 2 + 5, unit.y + unit.size / 2)
          ctx.lineTo(unit.x + unit.size / 2 + 15, unit.y + unit.size / 2 - 5)
          ctx.moveTo(unit.x + unit.size / 2 + 5, unit.y + unit.size / 2)
          ctx.lineTo(unit.x + unit.size / 2 + 15, unit.y + unit.size / 2 + 5)
        } else {
          // Arrow pointing left for villains
          ctx.moveTo(unit.x - unit.size / 2 - 5, unit.y + unit.size / 2)
          ctx.lineTo(unit.x - unit.size / 2 - 15, unit.y + unit.size / 2 - 5)
          ctx.moveTo(unit.x - unit.size / 2 - 5, unit.y + unit.size / 2)
          ctx.lineTo(unit.x - unit.size / 2 - 15, unit.y + unit.size / 2 + 5)
        }
        ctx.stroke()
        ctx.globalAlpha = 1
      }
    })

    // Draw projectiles
    projectiles.forEach((projectile) => {
      ctx.fillStyle = projectile.color
      ctx.shadowColor = projectile.color
      ctx.shadowBlur = 10
      ctx.beginPath()
      ctx.arc(projectile.x, projectile.y, 4, 0, Math.PI * 2)
      ctx.fill()
      ctx.shadowBlur = 0
    })

    // Check wave completion - all villains must be dead
    const aliveVillains = units.filter((u) => u.type === "villain" && u.hp > 0)
    if (waveStarted && aliveVillains.length === 0) {
      if (wave >= maxWaves) {
        setGameState("victory")
        return
      } else {
        setGameState("waveComplete")
        return
      }
    }

    // Check game over
    if (baseHp <= 0) {
      setGameState("gameOver")
      return
    }

    gameLoopRef.current = requestAnimationFrame(gameLoop)
  }, [gameState, units, projectiles, wave, maxWaves, baseHp, waveStarted, spawnWaveVillains])

  const canUseSuperpower = (superpower: Superpower) => {
    const cooldownRemaining = superpowerCooldowns[superpower.id] || 0
    return currency >= superpower.cost && cooldownRemaining === 0
  }

  const handleSuperpowerClick = (power: Superpower) => {
    useSuperpower(power)
  }

  const handleEndFight = () => {
    const earnedCurrency = score + wave * 50
    onFightEnd(score, earnedCurrency)
  }

  const decrementCooldowns = useCallback(() => {
    setSuperpowerCooldowns((prev) => {
      const updated = { ...prev }
      Object.keys(updated).forEach((key) => {
        updated[key] = Math.max(0, updated[key] - 100)
      })
      return updated
    })
  }, [])

  useEffect(() => {
    const interval = setInterval(() => {
      decrementCooldowns()
    }, 100)

    return () => clearInterval(interval)
  }, [decrementCooldowns])

  useEffect(() => {
    if (gameState === "playing") {
      gameLoopRef.current = requestAnimationFrame(gameLoop)
    } else if (gameLoopRef.current) {
      cancelAnimationFrame(gameLoopRef.current)
    }

    return () => {
      if (gameLoopRef.current) {
        cancelAnimationFrame(gameLoopRef.current)
      }
    }
  }, [gameLoop, gameState])

  return (
    <div className="flex flex-col h-screen bg-gradient-to-br from-gray-900 to-gray-800 overflow-hidden">
      {/* UI Header */}
      <div className="flex items-center justify-between p-4 bg-black/50 backdrop-blur-sm">
        <div className="flex items-center gap-4">
          <Button onClick={onBack} variant="ghost" className="text-white hover:bg-white/20">
            <ArrowLeft className="mr-2" />
            Back
          </Button>
          <Button
            onClick={() => setGameState(gameState === "paused" ? "playing" : "paused")}
            variant="ghost"
            className="text-white hover:bg-white/20"
          >
            {gameState === "paused" ? <Play /> : <Pause />}
          </Button>
        </div>

        <div className="flex gap-6 text-white">
          <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-4 py-2 rounded-lg font-bold">
            Wave {wave}/{maxWaves}
          </div>
          <div className="flex items-center gap-2 bg-gradient-to-r from-yellow-600 to-yellow-700 px-4 py-2 rounded-lg font-bold">
            <span>🪙</span>
            {currency}
          </div>
          <div className="bg-gradient-to-r from-purple-600 to-purple-700 px-4 py-2 rounded-lg font-bold">
            Score: {score}
          </div>
          <div className="bg-gradient-to-r from-red-600 to-red-700 px-4 py-2 rounded-lg font-bold">❤️ {baseHp}</div>
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* Game Canvas */}
        <div className="flex-1 flex items-center justify-center p-4">
          <canvas
            ref={canvasRef}
            width={CANVAS_WIDTH}
            height={CANVAS_HEIGHT}
            className="border-2 border-gray-600 rounded-lg shadow-2xl max-w-full max-h-full"
          />
        </div>

        {/* Side Panel */}
        <div className="w-96 bg-black/50 backdrop-blur-sm p-6 space-y-6">
          {/* Wave Info */}
          <Card className="bg-black/40 border-yellow-500/50">
            <CardContent className="p-4">
              <h3 className="text-xl font-bold mb-4 text-yellow-400">🌊 Wave Info</h3>
              <div className="space-y-2 text-white">
                <div className="flex justify-between">
                  <span>Villains This Wave:</span>
                  <span className="text-red-400">{getVillainsForWave(wave)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Remaining:</span>
                  <span className="text-red-400">{units.filter((u) => u.type === "villain").length}</span>
                </div>
                <div className="flex justify-between">
                  <span>Heroes Active:</span>
                  <span className="text-blue-400">{units.filter((u) => u.type === "hero").length}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Hero Spawner */}
          <Card className="bg-black/40 border-blue-500/50">
            <CardContent className="p-4">
              <h3 className="text-xl font-bold mb-4 text-blue-400">🏹 Spawn Heroes</h3>
              <div className="space-y-3">
                {heroTypes.map((hero) => (
                  <Button
                    key={hero.id}
                    onClick={() => spawnHero(hero)}
                    className="w-full justify-between p-4 h-auto bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-500 hover:to-blue-600"
                    disabled={currency < hero.cost}
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{hero.emoji}</span>
                      <div className="text-left">
                        <div className="font-bold">{hero.name}</div>
                        <div className="text-xs text-gray-300">
                          HP: {hero.hp} | DMG: {hero.damage} | SPD: {hero.speed}
                        </div>
                      </div>
                    </div>
                    <span className="text-yellow-400 font-bold">{hero.cost}🪙</span>
                  </Button>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Battle Stats */}
          <Card className="bg-black/40 border-green-500/50">
            <CardContent className="p-4">
              <h3 className="text-xl font-bold mb-4 text-green-400">⚔️ Battle Stats</h3>
              <div className="space-y-2 text-white">
                <div className="flex justify-between">
                  <span>Heroes:</span>
                  <span className="text-blue-400">{units.filter((u) => u.type === "hero").length}</span>
                </div>
                <div className="flex justify-between">
                  <span>Villains:</span>
                  <span className="text-red-400">{units.filter((u) => u.type === "villain").length}</span>
                </div>
                <div className="flex justify-between">
                  <span>Projectiles:</span>
                  <span className="text-yellow-400">{projectiles.length}</span>
                </div>
                <div className="flex justify-between">
                  <span>Fighting:</span>
                  <span className="text-orange-400">{units.filter((u) => u.isAttacking).length}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Superpowers */}
          <Card className="bg-black/40 border-purple-500/50">
            <CardContent className="p-4">
              <h3 className="text-xl font-bold mb-4 text-purple-400">⚡ Superpowers</h3>
              <div className="space-y-3">
                {superpowers.map((power) => (
                  <Button
                    key={power.id}
                    onClick={() => handleSuperpowerClick(power)}
                    disabled={!canUseSuperpower(power)}
                    className="w-full justify-between p-3 h-auto bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-500 hover:to-purple-600 disabled:from-gray-600 disabled:to-gray-700"
                  >
                    <div className="flex items-center gap-2">
                      {power.type === "rocket" && <Target className="w-5 h-5" />}
                      {power.type === "lightning" && <Zap className="w-5 h-5" />}
                      {power.type === "freeze" && <Snowflake className="w-5 h-5" />}
                      {power.type === "heal" && <Heart className="w-5 h-5" />}
                      <span className="font-bold text-sm">{power.name}</span>
                    </div>
                    <div className="text-right">
                      <div className="text-yellow-400 font-bold text-sm">{power.cost}🪙</div>
                      {superpowerCooldowns[power.id] > 0 && (
                        <div className="text-red-400 text-xs">{Math.ceil(superpowerCooldowns[power.id] / 1000)}s</div>
                      )}
                    </div>
                  </Button>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Instructions */}
      <div className="p-3 bg-black/50 text-center text-white">
        <div className="flex justify-center gap-8">
          <span>🤴 Heroes spawn from LEFT and move RIGHT</span>
          <span>👹 Villains spawn from RIGHT and move LEFT</span>
          <span>⚔️ Fixed {getVillainsForWave(wave)} villains per wave!</span>
        </div>
      </div>

      {/* Wave Complete Modal */}
      {gameState === "waveComplete" && (
        <div className="absolute inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center">
          <div className="bg-gradient-to-br from-gray-800 to-gray-900 p-8 rounded-2xl text-center border border-gray-600 shadow-2xl">
            <h2 className="text-4xl font-bold mb-6 text-green-400">🎉 Wave {wave} Complete!</h2>
            <div className="space-y-3 mb-8 text-lg">
              <p className="text-white">
                Current Score: <span className="text-yellow-400 font-bold">{score}</span>
              </p>
              <p className="text-white">
                Next Wave:{" "}
                <span className="text-blue-400 font-bold">
                  {wave + 1}/{maxWaves}
                </span>
              </p>
              <p className="text-white">
                Next Wave Villains: <span className="text-red-400 font-bold">{getVillainsForWave(wave + 1)}</span>
              </p>
              <p className="text-green-400">Bonus: +50 coins for next wave!</p>
            </div>
            <div className="flex gap-4">
              <Button
                onClick={startNextWave}
                className="bg-gradient-to-r from-green-600 to-green-700 hover:from-green-500 hover:to-green-600 px-6 py-3 text-lg font-bold"
              >
                Start Wave {wave + 1}
              </Button>
              <Button onClick={onBack} variant="outline" className="px-6 py-3 text-lg font-bold bg-transparent">
                End Battle
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Game Over Modal */}
      {(gameState === "gameOver" || gameState === "victory") && (
        <div className="absolute inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center">
          <div className="bg-gradient-to-br from-gray-800 to-gray-900 p-8 rounded-2xl text-center border border-gray-600 shadow-2xl">
            <h2 className={`text-4xl font-bold mb-6 ${gameState === "victory" ? "text-green-400" : "text-red-400"}`}>
              {gameState === "victory" ? "🏆 Victory!" : "💀 Defeat!"}
            </h2>
            <div className="space-y-3 mb-8 text-lg">
              <p className="text-white">
                Final Score: <span className="text-yellow-400 font-bold">{score}</span>
              </p>
              <p className="text-white">
                Waves Completed:{" "}
                <span className="text-blue-400 font-bold">
                  {wave - 1}/{maxWaves}
                </span>
              </p>
              <p className="text-yellow-400 font-bold">Currency Earned: {score + wave * 50}🪙</p>
            </div>
            <div className="flex gap-4">
              <Button
                onClick={handleEndFight}
                className="bg-gradient-to-r from-green-600 to-green-700 hover:from-green-500 hover:to-green-600 px-6 py-3 text-lg font-bold"
              >
                Collect Rewards
              </Button>
              <Button onClick={onBack} variant="outline" className="px-6 py-3 text-lg font-bold bg-transparent">
                Main Menu
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Pause Modal */}
      {gameState === "paused" && (
        <div className="absolute inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center">
          <div className="bg-gradient-to-br from-gray-800 to-gray-900 p-8 rounded-2xl text-center border border-gray-600 shadow-2xl">
            <h2 className="text-4xl font-bold mb-6 text-white">⏸️ Paused</h2>
            <div className="flex gap-4">
              <Button
                onClick={() => setGameState("playing")}
                className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-500 hover:to-blue-600 px-6 py-3 text-lg font-bold"
              >
                Resume Battle
              </Button>
              <Button onClick={onBack} variant="outline" className="px-6 py-3 text-lg font-bold bg-transparent">
                Main Menu
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
