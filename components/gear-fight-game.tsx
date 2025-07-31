"use client"

import { useEffect, useRef, useState, useCallback } from "react"
import { Button } from "@/components/ui/button"
import type { Character, Gear } from "@/types/game"
import { ArrowLeft, Pause, Play } from "lucide-react"

interface GearFightGameProps {
  character: Character
  equippedGear: Gear[]
  onFightEnd: (score: number, currency: number) => void
  onBack: () => void
}

interface Player {
  x: number
  y: number
  width: number
  height: number
  health: number
  maxHealth: number
  speed: number
  damage: number
  color: string
  facingRight: boolean
  attackCooldown: number
}

interface Enemy {
  x: number
  y: number
  width: number
  height: number
  health: number
  maxHealth: number
  speed: number
  damage: number
  color: string
  attackCooldown: number
  type: string
}

interface Projectile {
  x: number
  y: number
  width: number
  height: number
  velocityX: number
  velocityY: number
  damage: number
  isPlayerProjectile: boolean
}

export default function GearFightGame({ character, equippedGear, onFightEnd, onBack }: GearFightGameProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const gameLoopRef = useRef<number>()
  const keysRef = useRef<Set<string>>(new Set())

  const [gameState, setGameState] = useState<"playing" | "paused" | "gameOver">("playing")
  const [wave, setWave] = useState(1)
  const [score, setScore] = useState(0)
  const [enemiesKilled, setEnemiesKilled] = useState(0)

  // Calculate player stats with gear bonuses
  const playerStats = {
    health: character.baseHealth + equippedGear.reduce((sum, gear) => sum + gear.healthBoost, 0),
    speed: character.baseSpeed + equippedGear.reduce((sum, gear) => sum + gear.speedBoost, 0),
    damage: character.baseDamage + equippedGear.reduce((sum, gear) => sum + gear.damageBoost, 0),
  }

  const [player, setPlayer] = useState<Player>({
    x: 100,
    y: 300,
    width: 30,
    height: 30,
    health: playerStats.health,
    maxHealth: playerStats.health,
    speed: playerStats.speed,
    damage: playerStats.damage,
    color: character.color,
    facingRight: true,
    attackCooldown: 0,
  })

  const [enemies, setEnemies] = useState<Enemy[]>([])
  const [projectiles, setProjectiles] = useState<Projectile[]>([])

  const spawnEnemies = useCallback((waveNumber: number) => {
    const enemyCount = Math.min(2 + waveNumber, 8)
    const newEnemies: Enemy[] = []

    for (let i = 0; i < enemyCount; i++) {
      const enemyTypes = ["basic", "fast", "tank"]
      const type = enemyTypes[Math.floor(Math.random() * enemyTypes.length)]

      let enemy: Enemy
      switch (type) {
        case "fast":
          enemy = {
            x: 700 + i * 50,
            y: 300,
            width: 25,
            height: 25,
            health: 30 + waveNumber * 5,
            maxHealth: 30 + waveNumber * 5,
            speed: 3 + waveNumber * 0.2,
            damage: 8 + waveNumber * 2,
            color: "#ff6b6b",
            attackCooldown: 0,
            type: "fast",
          }
          break
        case "tank":
          enemy = {
            x: 700 + i * 50,
            y: 300,
            width: 40,
            height: 40,
            health: 80 + waveNumber * 15,
            maxHealth: 80 + waveNumber * 15,
            speed: 1 + waveNumber * 0.1,
            damage: 15 + waveNumber * 3,
            color: "#4ecdc4",
            attackCooldown: 0,
            type: "tank",
          }
          break
        default:
          enemy = {
            x: 700 + i * 50,
            y: 300,
            width: 30,
            height: 30,
            health: 50 + waveNumber * 10,
            maxHealth: 50 + waveNumber * 10,
            speed: 2 + waveNumber * 0.15,
            damage: 10 + waveNumber * 2,
            color: "#95e1d3",
            attackCooldown: 0,
            type: "basic",
          }
      }
      newEnemies.push(enemy)
    }

    setEnemies(newEnemies)
  }, [])

  const checkCollision = (rect1: any, rect2: any) => {
    return (
      rect1.x < rect2.x + rect2.width &&
      rect1.x + rect1.width > rect2.x &&
      rect1.y < rect2.y + rect2.height &&
      rect1.y + rect1.height > rect2.y
    )
  }

  const gameLoop = useCallback(() => {
    if (gameState !== "playing") return

    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Clear canvas
    ctx.fillStyle = "#1a1a2e"
    ctx.fillRect(0, 0, canvas.width, canvas.height)

    // Update player
    setPlayer((prevPlayer) => {
      const newPlayer = { ...prevPlayer }

      // Handle input
      if (keysRef.current.has("ArrowLeft") || keysRef.current.has("a")) {
        newPlayer.x = Math.max(0, newPlayer.x - newPlayer.speed)
        newPlayer.facingRight = false
      }
      if (keysRef.current.has("ArrowRight") || keysRef.current.has("d")) {
        newPlayer.x = Math.min(canvas.width - newPlayer.width, newPlayer.x + newPlayer.speed)
        newPlayer.facingRight = true
      }
      if (keysRef.current.has("ArrowUp") || keysRef.current.has("w")) {
        newPlayer.y = Math.max(0, newPlayer.y - newPlayer.speed)
      }
      if (keysRef.current.has("ArrowDown") || keysRef.current.has("s")) {
        newPlayer.y = Math.min(canvas.height - newPlayer.height, newPlayer.y + newPlayer.speed)
      }

      // Attack
      if ((keysRef.current.has(" ") || keysRef.current.has("Enter")) && newPlayer.attackCooldown <= 0) {
        setProjectiles((prev) => [
          ...prev,
          {
            x: newPlayer.facingRight ? newPlayer.x + newPlayer.width : newPlayer.x,
            y: newPlayer.y + newPlayer.height / 2,
            width: 8,
            height: 4,
            velocityX: newPlayer.facingRight ? 8 : -8,
            velocityY: 0,
            damage: newPlayer.damage,
            isPlayerProjectile: true,
          },
        ])
        newPlayer.attackCooldown = 30
      }

      if (newPlayer.attackCooldown > 0) {
        newPlayer.attackCooldown--
      }

      return newPlayer
    })

    // Update enemies
    setEnemies((prevEnemies) => {
      return prevEnemies.map((enemy) => {
        const newEnemy = { ...enemy }

        // Move towards player
        const dx = player.x - enemy.x
        const dy = player.y - enemy.y
        const distance = Math.sqrt(dx * dx + dy * dy)

        if (distance > 0) {
          newEnemy.x += (dx / distance) * enemy.speed
          newEnemy.y += (dy / distance) * enemy.speed
        }

        // Attack player if close
        if (distance < 50 && newEnemy.attackCooldown <= 0) {
          setPlayer((prevPlayer) => ({
            ...prevPlayer,
            health: Math.max(0, prevPlayer.health - enemy.damage),
          }))
          newEnemy.attackCooldown = 60
        }

        if (newEnemy.attackCooldown > 0) {
          newEnemy.attackCooldown--
        }

        return newEnemy
      })
    })

    // Update projectiles
    setProjectiles((prevProjectiles) => {
      return prevProjectiles.filter((projectile) => {
        projectile.x += projectile.velocityX
        projectile.y += projectile.velocityY

        // Remove if off screen
        if (projectile.x < 0 || projectile.x > canvas.width || projectile.y < 0 || projectile.y > canvas.height) {
          return false
        }

        // Check collisions with enemies (player projectiles)
        if (projectile.isPlayerProjectile) {
          for (let i = 0; i < enemies.length; i++) {
            if (checkCollision(projectile, enemies[i])) {
              setEnemies((prev) => {
                const newEnemies = [...prev]
                newEnemies[i] = { ...newEnemies[i], health: newEnemies[i].health - projectile.damage }
                return newEnemies
              })
              return false
            }
          }
        }

        return true
      })
    })

    // Remove dead enemies and update score
    setEnemies((prevEnemies) => {
      const aliveEnemies = prevEnemies.filter((enemy) => {
        if (enemy.health <= 0) {
          setScore((prev) => prev + 10 * wave)
          setEnemiesKilled((prev) => prev + 1)
          return false
        }
        return true
      })

      // Spawn new wave if all enemies dead
      if (aliveEnemies.length === 0 && prevEnemies.length > 0) {
        setTimeout(() => {
          setWave((prev) => prev + 1)
          spawnEnemies(wave + 1)
        }, 1000)
      }

      return aliveEnemies
    })

    // Check game over
    if (player.health <= 0) {
      setGameState("gameOver")
      return
    }

    // Draw everything
    // Draw player
    ctx.fillStyle = player.color
    ctx.fillRect(player.x, player.y, player.width, player.height)

    // Draw player health bar
    ctx.fillStyle = "#ff0000"
    ctx.fillRect(player.x, player.y - 10, player.width, 4)
    ctx.fillStyle = "#00ff00"
    ctx.fillRect(player.x, player.y - 10, (player.health / player.maxHealth) * player.width, 4)

    // Draw enemies
    enemies.forEach((enemy) => {
      ctx.fillStyle = enemy.color
      ctx.fillRect(enemy.x, enemy.y, enemy.width, enemy.height)

      // Enemy health bar
      ctx.fillStyle = "#ff0000"
      ctx.fillRect(enemy.x, enemy.y - 10, enemy.width, 4)
      ctx.fillStyle = "#00ff00"
      ctx.fillRect(enemy.x, enemy.y - 10, (enemy.health / enemy.maxHealth) * enemy.width, 4)
    })

    // Draw projectiles
    projectiles.forEach((projectile) => {
      ctx.fillStyle = projectile.isPlayerProjectile ? "#ffff00" : "#ff0000"
      ctx.fillRect(projectile.x, projectile.y, projectile.width, projectile.height)
    })

    gameLoopRef.current = requestAnimationFrame(gameLoop)
  }, [gameState, player, enemies, projectiles, wave, spawnEnemies])

  useEffect(() => {
    spawnEnemies(1)
  }, [spawnEnemies])

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      keysRef.current.add(e.key.toLowerCase())
      if (e.key === " ") e.preventDefault()
    }

    const handleKeyUp = (e: KeyboardEvent) => {
      keysRef.current.delete(e.key.toLowerCase())
    }

    window.addEventListener("keydown", handleKeyDown)
    window.addEventListener("keyup", handleKeyUp)

    return () => {
      window.removeEventListener("keydown", handleKeyDown)
      window.removeEventListener("keyup", handleKeyUp)
    }
  }, [])

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

  const handleEndFight = () => {
    const earnedCurrency = enemiesKilled * 5 + wave * 10
    onFightEnd(score, earnedCurrency)
  }

  return (
    <div className="flex flex-col h-full bg-gray-900">
      {/* UI Header */}
      <div className="flex items-center justify-between p-4 bg-gray-800">
        <div className="flex items-center gap-4">
          <Button onClick={onBack} variant="ghost">
            <ArrowLeft className="mr-2" />
            Back
          </Button>
          <Button onClick={() => setGameState(gameState === "paused" ? "playing" : "paused")} variant="ghost">
            {gameState === "paused" ? <Play /> : <Pause />}
          </Button>
        </div>

        <div className="flex gap-6 text-white">
          <div>
            Health: {player.health}/{player.maxHealth}
          </div>
          <div>Wave: {wave}</div>
          <div>Score: {score}</div>
          <div>Enemies: {enemies.length}</div>
        </div>
      </div>

      {/* Game Canvas */}
      <div className="flex-1 flex items-center justify-center bg-gray-900">
        <canvas ref={canvasRef} width={800} height={600} className="border border-gray-700 bg-gray-800" />
      </div>

      {/* Controls */}
      <div className="p-4 bg-gray-800 text-center text-white">
        <p>Use WASD or Arrow Keys to move • Space or Enter to attack</p>
      </div>

      {/* Game Over Modal */}
      {gameState === "gameOver" && (
        <div className="absolute inset-0 bg-black bg-opacity-75 flex items-center justify-center">
          <div className="bg-gray-800 p-8 rounded-lg text-center">
            <h2 className="text-3xl font-bold mb-4 text-red-400">Game Over!</h2>
            <div className="space-y-2 mb-6">
              <p>Final Score: {score}</p>
              <p>Waves Survived: {wave}</p>
              <p>Enemies Defeated: {enemiesKilled}</p>
              <p className="text-yellow-400">Currency Earned: {enemiesKilled * 5 + wave * 10}</p>
            </div>
            <div className="flex gap-4">
              <Button onClick={handleEndFight} className="bg-green-600 hover:bg-green-700">
                Collect Rewards
              </Button>
              <Button onClick={onBack} variant="outline">
                Main Menu
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Pause Modal */}
      {gameState === "paused" && (
        <div className="absolute inset-0 bg-black bg-opacity-75 flex items-center justify-center">
          <div className="bg-gray-800 p-8 rounded-lg text-center">
            <h2 className="text-3xl font-bold mb-4">Paused</h2>
            <div className="flex gap-4">
              <Button onClick={() => setGameState("playing")} className="bg-blue-600 hover:bg-blue-700">
                Resume
              </Button>
              <Button onClick={onBack} variant="outline">
                Main Menu
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
