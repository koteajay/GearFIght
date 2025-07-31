"use client"

import { useEffect, useRef, useState, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import type { Character, Gear, GridPosition, PlacedGear, Enemy, Projectile, Superpower } from "@/types/game"
import { ArrowLeft, Pause, Play, Zap, Target, Snowflake, Heart } from "lucide-react"

interface TowerDefenseGameProps {
  character: Character
  equippedGear: Gear[]
  difficulty: "easy" | "medium" | "hard"
  onFightEnd: (score: number, currency: number) => void
  onBack: () => void
}

const GRID_ROWS = 4
const GRID_COLS = 6
const CELL_SIZE = 80
const CANVAS_WIDTH = 900
const CANVAS_HEIGHT = 600

// Available characters to place on grid
const availableCharacters = [
  {
    id: "archer",
    name: "Archer",
    emoji: "🏹",
    damage: 25,
    range: 120,
    speed: 40,
    cost: 30,
    color: "#22c55e",
  },
  {
    id: "mage",
    name: "Mage",
    emoji: "🧙‍♂️",
    damage: 40,
    range: 100,
    speed: 60,
    cost: 50,
    color: "#3b82f6",
  },
  {
    id: "knight",
    name: "Knight",
    emoji: "⚔️",
    damage: 35,
    range: 80,
    speed: 30,
    cost: 40,
    color: "#ef4444",
  },
  {
    id: "cannon",
    name: "Cannon",
    emoji: "💣",
    damage: 80,
    range: 150,
    speed: 90,
    cost: 80,
    color: "#f59e0b",
  },
]

const superpowers: Superpower[] = [
  {
    id: "rocket",
    name: "Rocket Strike",
    type: "rocket",
    damage: 150,
    cost: 60,
    cooldown: 12000,
    description: "Massive area damage",
  },
  {
    id: "lightning",
    name: "Lightning Bolt",
    type: "lightning",
    damage: 100,
    cost: 50,
    cooldown: 10000,
    description: "Chain lightning attack",
  },
  {
    id: "freeze",
    name: "Ice Storm",
    type: "freeze",
    damage: 40,
    cost: 40,
    cooldown: 15000,
    description: "Slows all enemies",
  },
  {
    id: "heal",
    name: "Repair Gears",
    type: "heal",
    damage: 0,
    cost: 35,
    cooldown: 18000,
    description: "Heals all placed gears",
  },
]

// Add villain types
const villainTypes = [
  {
    type: "goblin" as const,
    emoji: "👹",
    health: 40,
    speed: 2.0,
    damage: 2,
    color: "#dc2626",
    size: 22,
    reward: 10,
  },
  {
    type: "orc" as const,
    emoji: "🧌",
    health: 80,
    speed: 1.2,
    damage: 4,
    color: "#16a34a",
    size: 28,
    reward: 15,
  },
  {
    type: "troll" as const,
    emoji: "🧟",
    health: 120,
    speed: 0.8,
    damage: 6,
    color: "#0891b2",
    size: 35,
    reward: 25,
  },
  {
    type: "dragon" as const,
    emoji: "🐉",
    health: 800,
    speed: 0.6,
    damage: 10,
    color: "#7f1d1d",
    size: 60,
    reward: 100,
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

  const [gameState, setGameState] = useState<"playing" | "paused" | "gameOver" | "victory">("playing")
  const [wave, setWave] = useState(1)
  const [score, setScore] = useState(0)
  const [health, setHealth] = useState(25)
  const [currency, setCurrency] = useState(150)

  const maxWaves = difficulty === "easy" ? 3 : difficulty === "medium" ? 6 : 12

  // Initialize grid in center of canvas
  const [grid, setGrid] = useState<GridPosition[][]>(() => {
    const newGrid: GridPosition[][] = []
    const startX = (CANVAS_WIDTH - GRID_COLS * CELL_SIZE) / 2
    const startY = (CANVAS_HEIGHT - GRID_ROWS * CELL_SIZE) / 2

    for (let row = 0; row < GRID_ROWS; row++) {
      newGrid[row] = []
      for (let col = 0; col < GRID_COLS; col++) {
        newGrid[row][col] = {
          x: startX + col * CELL_SIZE + CELL_SIZE / 2,
          y: startY + row * CELL_SIZE + CELL_SIZE / 2,
          occupied: false,
        }
      }
    }
    return newGrid
  })

  const [enemies, setEnemies] = useState<Enemy[]>([])
  const [projectiles, setProjectiles] = useState<Projectile[]>([])
  const [placedGears, setPlacedGears] = useState<PlacedGear[]>([])
  const [selectedCharacter, setSelectedCharacter] = useState<any>(null)
  const [superpowerCooldowns, setSuperpowerCooldowns] = useState<Record<string, number>>({})

  // Enemy path (right to left, avoiding the grid area)
  const enemyPath = [
    { x: CANVAS_WIDTH + 50, y: 150 },
    { x: CANVAS_WIDTH - 100, y: 150 },
    { x: 700, y: 150 },
    { x: 600, y: 200 },
    { x: 500, y: 250 },
    { x: 400, y: 300 },
    { x: 300, y: 350 },
    { x: 200, y: 400 },
    { x: 100, y: 450 },
    { x: -50, y: 450 },
  ]

  const spawnWave = useCallback(() => {
    const isBossWave = wave % 6 === 0 && wave >= 6
    const enemyCount = isBossWave ? 1 : Math.min(4 + wave, 12)
    const newEnemies: Enemy[] = []

    for (let i = 0; i < enemyCount; i++) {
      let enemy: Enemy

      if (isBossWave) {
        const dragon = villainTypes.find((v) => v.type === "dragon")!
        enemy = {
          id: `boss-${wave}-${i}`,
          x: CANVAS_WIDTH + 100,
          y: 150,
          health: dragon.health + wave * 150,
          maxHealth: dragon.health + wave * 150,
          speed: dragon.speed,
          damage: dragon.damage,
          type: "boss",
          pathIndex: 0,
          color: dragon.color,
          size: dragon.size,
        }
      } else {
        const villain = villainTypes[Math.floor(Math.random() * 3)] // Exclude dragon
        enemy = {
          id: `enemy-${wave}-${i}`,
          x: CANVAS_WIDTH + i * 40,
          y: 150,
          health: villain.health + wave * 10,
          maxHealth: villain.health + wave * 10,
          speed: villain.speed + wave * 0.1,
          damage: villain.damage,
          type: villain.type as any,
          pathIndex: 0,
          color: villain.color,
          size: villain.size,
        }
      }
      newEnemies.push(enemy)
    }

    setEnemies(newEnemies)
  }, [wave])

  const placeCharacter = (row: number, col: number) => {
    if (!selectedCharacter || grid[row][col].occupied || currency < selectedCharacter.cost) return

    const newGear: PlacedGear = {
      id: `gear-${Date.now()}`,
      type: selectedCharacter.id,
      character: selectedCharacter,
      level: 1,
      rotation: 0,
      attackCooldown: 0,
      range: selectedCharacter.range,
    }

    setGrid((prev) => {
      const newGrid = [...prev]
      newGrid[row][col] = { ...newGrid[row][col], occupied: true, gear: newGear }
      return newGrid
    })

    setPlacedGears((prev) => [...prev, newGear])
    setCurrency((prev) => prev - selectedCharacter.cost)
    setSelectedCharacter(null)
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
        const centerX = enemies.length > 0 ? enemies.reduce((sum, e) => sum + e.x, 0) / enemies.length : 500
        const centerY = enemies.length > 0 ? enemies.reduce((sum, e) => sum + e.y, 0) / enemies.length : 300

        setEnemies((prev) =>
          prev.map((enemy) => {
            const distance = Math.sqrt((enemy.x - centerX) ** 2 + (enemy.y - centerY) ** 2)
            if (distance < 200) {
              return { ...enemy, health: Math.max(0, enemy.health - superpower.damage) }
            }
            return enemy
          }),
        )
        break

      case "lightning":
        setEnemies((prev) =>
          prev.map((enemy, index) => {
            if (index < 6) {
              return { ...enemy, health: Math.max(0, enemy.health - superpower.damage) }
            }
            return enemy
          }),
        )
        break

      case "freeze":
        setEnemies((prev) =>
          prev.map((enemy) => ({
            ...enemy,
            speed: enemy.speed * 0.4,
            health: Math.max(0, enemy.health - superpower.damage),
          })),
        )
        setTimeout(() => {
          setEnemies((prev) =>
            prev.map((enemy) => ({
              ...enemy,
              speed: enemy.speed / 0.4,
            })),
          )
        }, 6000)
        break
    }
  }

  const gameLoop = useCallback(() => {
    if (gameState !== "playing") return

    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Clear canvas with gradient background
    const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height)
    gradient.addColorStop(0, "#1e293b")
    gradient.addColorStop(1, "#0f172a")
    ctx.fillStyle = gradient
    ctx.fillRect(0, 0, canvas.width, canvas.height)

    // Draw decorative background pattern
    ctx.fillStyle = "#334155"
    ctx.globalAlpha = 0.1
    for (let i = 0; i < canvas.width; i += 60) {
      for (let j = 0; j < canvas.height; j += 60) {
        if ((i + j) % 120 === 0) {
          ctx.fillRect(i, j, 30, 30)
        }
      }
    }
    ctx.globalAlpha = 1

    // Draw enemy path
    ctx.strokeStyle = "#475569"
    ctx.lineWidth = 4
    ctx.setLineDash([10, 5])
    ctx.beginPath()
    enemyPath.forEach((point, index) => {
      if (index === 0) {
        ctx.moveTo(point.x, point.y)
      } else {
        ctx.lineTo(point.x, point.y)
      }
    })
    ctx.stroke()
    ctx.setLineDash([])

    // Draw grid with better styling
    grid.forEach((row, rowIndex) => {
      row.forEach((cell, colIndex) => {
        // Grid cell background
        ctx.fillStyle = cell.occupied ? "#065f46" : "#374151"
        ctx.fillRect(cell.x - CELL_SIZE / 2, cell.y - CELL_SIZE / 2, CELL_SIZE, CELL_SIZE)

        // Grid cell border
        ctx.strokeStyle = cell.occupied ? "#10b981" : "#6b7280"
        ctx.lineWidth = 2
        ctx.strokeRect(cell.x - CELL_SIZE / 2, cell.y - CELL_SIZE / 2, CELL_SIZE, CELL_SIZE)

        // Draw placed character
        if (cell.occupied && cell.gear) {
          const char = cell.gear.character

          // Character background circle
          ctx.fillStyle = char.color
          ctx.globalAlpha = 0.8
          ctx.beginPath()
          ctx.arc(cell.x, cell.y, 25, 0, Math.PI * 2)
          ctx.fill()
          ctx.globalAlpha = 1

          // Character emoji/icon
          ctx.font = "32px Arial"
          ctx.textAlign = "center"
          ctx.textBaseline = "middle"
          ctx.fillStyle = "#ffffff"
          ctx.fillText(char.emoji, cell.x, cell.y)

          // Rotating gear effect around character
          ctx.save()
          ctx.translate(cell.x, cell.y)
          ctx.rotate(cell.gear.rotation)
          ctx.strokeStyle = char.color
          ctx.lineWidth = 3
          ctx.globalAlpha = 0.6
          for (let i = 0; i < 8; i++) {
            const angle = (i * Math.PI) / 4
            ctx.beginPath()
            ctx.moveTo(0, 0)
            ctx.lineTo(Math.cos(angle) * 35, Math.sin(angle) * 35)
            ctx.stroke()
          }
          ctx.restore()
          ctx.globalAlpha = 1

          // Update rotation
          setGrid((prev) => {
            const newGrid = [...prev]
            if (newGrid[rowIndex][colIndex].gear) {
              newGrid[rowIndex][colIndex].gear!.rotation += 0.05
            }
            return newGrid
          })

          // Draw range indicator for selected character
          if (selectedCharacter && selectedCharacter.id === char.id) {
            ctx.strokeStyle = char.color
            ctx.lineWidth = 2
            ctx.globalAlpha = 0.3
            ctx.beginPath()
            ctx.arc(cell.x, cell.y, cell.gear.range, 0, Math.PI * 2)
            ctx.stroke()
            ctx.globalAlpha = 1
          }
        }
      })
    })

    // Update and draw enemies
    setEnemies((prevEnemies) => {
      return prevEnemies.filter((enemy) => {
        // Move along path
        if (enemy.pathIndex < enemyPath.length - 1) {
          const currentPoint = enemyPath[enemy.pathIndex]
          const nextPoint = enemyPath[enemy.pathIndex + 1]
          const dx = nextPoint.x - currentPoint.x
          const dy = nextPoint.y - currentPoint.y
          const distance = Math.sqrt(dx * dx + dy * dy)

          if (distance > 0) {
            enemy.x += (dx / distance) * enemy.speed
            enemy.y += (dy / distance) * enemy.speed

            const distToNext = Math.sqrt((enemy.x - nextPoint.x) ** 2 + (enemy.y - nextPoint.y) ** 2)
            if (distToNext < 15) {
              enemy.pathIndex++
            }
          }
        } else {
          setHealth((prev) => Math.max(0, prev - enemy.damage))
          return false
        }

        // Draw enemy
        ctx.fillStyle = enemy.color
        if (enemy.type === "boss") {
          // Draw boss with spikes
          ctx.save()
          ctx.translate(enemy.x, enemy.y)
          ctx.beginPath()
          for (let i = 0; i < 16; i++) {
            const angle = (i * Math.PI) / 8
            const radius = i % 2 === 0 ? enemy.size : enemy.size * 0.6
            const x = Math.cos(angle) * radius
            const y = Math.sin(angle) * radius
            if (i === 0) ctx.moveTo(x, y)
            else ctx.lineTo(x, y)
          }
          ctx.closePath()
          ctx.fill()
          ctx.restore()

          // Boss glow effect
          ctx.shadowColor = enemy.color
          ctx.shadowBlur = 20
          ctx.beginPath()
          ctx.arc(enemy.x, enemy.y, enemy.size * 0.8, 0, Math.PI * 2)
          ctx.fill()
          ctx.shadowBlur = 0
        } else {
          ctx.beginPath()
          ctx.arc(enemy.x, enemy.y, enemy.size / 2, 0, Math.PI * 2)
          ctx.fill()

          // Enemy type indicator
          ctx.fillStyle = "#ffffff"
          ctx.font = "12px Arial"
          ctx.textAlign = "center"
          ctx.fillText(enemy.type[0].toUpperCase(), enemy.x, enemy.y + 3)
        }

        // Draw villain emoji
        const villain = villainTypes.find((v) => v.type === enemy.type) || villainTypes.find((v) => v.type === "dragon")
        if (villain) {
          ctx.font = `${enemy.size}px Arial`
          ctx.textAlign = "center"
          ctx.textBaseline = "middle"
          ctx.fillStyle = "#ffffff"
          ctx.fillText(villain.emoji, enemy.x, enemy.y)
        }

        // Health bar
        const barWidth = enemy.size + 10
        const barHeight = 6
        ctx.fillStyle = "#7f1d1d"
        ctx.fillRect(enemy.x - barWidth / 2, enemy.y - enemy.size / 2 - 15, barWidth, barHeight)
        ctx.fillStyle = "#dc2626"
        ctx.fillRect(
          enemy.x - barWidth / 2,
          enemy.y - enemy.size / 2 - 15,
          (enemy.health / enemy.maxHealth) * barWidth,
          barHeight,
        )

        return enemy.health > 0
      })
    })

    // Update placed gears and create projectiles
    placedGears.forEach((gear) => {
      const gearCell = grid.flat().find((cell) => cell.gear?.id === gear.id)
      if (!gearCell) return

      if (gear.attackCooldown > 0) {
        gear.attackCooldown--
        return
      }

      const nearestEnemy = enemies.find((enemy) => {
        const distance = Math.sqrt((enemy.x - gearCell.x) ** 2 + (enemy.y - gearCell.y) ** 2)
        return distance <= gear.range && enemy.health > 0
      })

      if (nearestEnemy) {
        setProjectiles((prev) => [
          ...prev,
          {
            id: `proj-${Date.now()}`,
            x: gearCell.x,
            y: gearCell.y,
            targetX: nearestEnemy.x,
            targetY: nearestEnemy.y,
            damage: gear.character.damage,
            speed: 8,
            type: "bullet",
          },
        ])

        gear.attackCooldown = gear.character.speed
      }
    })

    // Update and draw projectiles
    setProjectiles((prevProjectiles) => {
      return prevProjectiles.filter((projectile) => {
        const dx = projectile.targetX - projectile.x
        const dy = projectile.targetY - projectile.y
        const distance = Math.sqrt(dx * dx + dy * dy)

        if (distance < projectile.speed) {
          setEnemies((prev) =>
            prev.map((enemy) => {
              const hitDistance = Math.sqrt((enemy.x - projectile.targetX) ** 2 + (enemy.y - projectile.targetY) ** 2)
              if (hitDistance < 40) {
                const newHealth = Math.max(0, enemy.health - projectile.damage)
                if (newHealth === 0 && enemy.health > 0) {
                  setScore((prevScore) => prevScore + (enemy.type === "boss" ? 200 : 25))
                  setCurrency((prevCurrency) => prevCurrency + (enemy.type === "boss" ? 30 : 8))
                }
                return { ...enemy, health: newHealth }
              }
              return enemy
            }),
          )
          return false
        }

        projectile.x += (dx / distance) * projectile.speed
        projectile.y += (dy / distance) * projectile.speed

        // Draw projectile with glow
        ctx.shadowColor = "#fbbf24"
        ctx.shadowBlur = 10
        ctx.fillStyle = "#fbbf24"
        ctx.beginPath()
        ctx.arc(projectile.x, projectile.y, 4, 0, Math.PI * 2)
        ctx.fill()
        ctx.shadowBlur = 0

        return true
      })
    })

    // Check wave completion
    const aliveEnemies = enemies.filter((e) => e.health > 0)
    if (aliveEnemies.length === 0 && enemies.length > 0) {
      if (wave >= maxWaves) {
        setGameState("victory")
        return
      } else {
        setTimeout(() => {
          setWave((prev) => prev + 1)
        }, 3000)
      }
    }

    if (health <= 0) {
      setGameState("gameOver")
      return
    }

    gameLoopRef.current = requestAnimationFrame(gameLoop)
  }, [gameState, enemies, projectiles, placedGears, grid, wave, maxWaves, health])

  const canUseSuperpower = (superpower: Superpower) => {
    const cooldownRemaining = superpowerCooldowns[superpower.id] || 0
    return currency >= superpower.cost && cooldownRemaining === 0
  }

  const handleSuperpowerClick = (power: Superpower) => {
    if (canUseSuperpower(power)) {
      useSuperpower(power)
    }
  }

  useEffect(() => {
    if (enemies.length === 0) {
      spawnWave()
    }
  }, [spawnWave, enemies.length])

  useEffect(() => {
    if (wave > 1) {
      spawnWave()
    }
  }, [wave, spawnWave])

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

  useEffect(() => {
    const interval = setInterval(() => {
      setSuperpowerCooldowns((prev) => {
        const updated = { ...prev }
        Object.keys(updated).forEach((key) => {
          updated[key] = Math.max(0, updated[key] - 100)
        })
        return updated
      })
    }, 100)

    return () => clearInterval(interval)
  }, [])

  const handleEndFight = () => {
    const earnedCurrency = score + wave * 25
    onFightEnd(score, earnedCurrency)
  }

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
            onClick={(e) => {
              if (!selectedCharacter) return

              const rect = canvasRef.current?.getBoundingClientRect()
              if (!rect) return

              const x = e.clientX - rect.left
              const y = e.clientY - rect.top

              for (let row = 0; row < GRID_ROWS; row++) {
                for (let col = 0; col < GRID_COLS; col++) {
                  const cell = grid[row][col]
                  if (
                    x >= cell.x - CELL_SIZE / 2 &&
                    x <= cell.x + CELL_SIZE / 2 &&
                    y >= cell.y - CELL_SIZE / 2 &&
                    y <= cell.y + CELL_SIZE / 2
                  ) {
                    placeCharacter(row, col)
                    return
                  }
                }
              }
            }}
          />
        </div>

        {/* Side Panel */}
        <div className="w-96 bg-black/50 backdrop-blur-sm p-6 space-y-6">
          {/* Health */}
          <Card className="bg-black/40 border-red-500/50">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <span className="text-red-400 font-bold text-lg">❤️ Base Health</span>
                <span className="text-2xl font-bold text-white">{health}</span>
              </div>
            </CardContent>
          </Card>

          {/* Character Store */}
          <Card className="bg-black/40 border-green-500/50">
            <CardContent className="p-4">
              <h3 className="text-xl font-bold mb-4 text-green-400">Character Store</h3>
              <div className="space-y-3">
                {availableCharacters.map((char) => (
                  <Button
                    key={char.id}
                    onClick={() => setSelectedCharacter(selectedCharacter?.id === char.id ? null : char)}
                    className={`w-full justify-between p-4 h-auto ${
                      selectedCharacter?.id === char.id
                        ? "bg-gradient-to-r from-blue-600 to-blue-700 border-blue-400"
                        : "bg-gray-700 hover:bg-gray-600"
                    }`}
                    disabled={currency < char.cost}
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{char.emoji}</span>
                      <div className="text-left">
                        <div className="font-bold">{char.name}</div>
                        <div className="text-xs text-gray-300">
                          DMG: {char.damage} | RNG: {char.range}
                        </div>
                      </div>
                    </div>
                    <span className="text-yellow-400 font-bold">{char.cost}🪙</span>
                  </Button>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Superpowers */}
          <Card className="bg-black/40 border-purple-500/50">
            <CardContent className="p-4">
              <h3 className="text-xl font-bold mb-4 text-purple-400">Superpowers</h3>
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
                      <span className="font-bold">{power.name}</span>
                    </div>
                    <div className="text-right">
                      <div className="text-yellow-400 font-bold">{power.cost}🪙</div>
                      {superpowerCooldowns[power.id] > 0 && (
                        <div className="text-red-400 text-sm">{Math.ceil(superpowerCooldowns[power.id] / 1000)}s</div>
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
        {selectedCharacter
          ? `🎯 Click on the grid to place ${selectedCharacter.name} (${selectedCharacter.cost} coins)`
          : "💡 Select a character from the store, then click on the grid to place them!"}
      </div>

      {/* Game Over Modal */}
      {(gameState === "gameOver" || gameState === "victory") && (
        <div className="absolute inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center">
          <div className="bg-gradient-to-br from-gray-800 to-gray-900 p-8 rounded-2xl text-center border border-gray-600 shadow-2xl">
            <h2 className={`text-4xl font-bold mb-6 ${gameState === "victory" ? "text-green-400" : "text-red-400"}`}>
              {gameState === "victory" ? "🏆 Victory!" : "💀 Game Over!"}
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
              <p className="text-yellow-400 font-bold">Currency Earned: {score + wave * 25}🪙</p>
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
                Resume
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
