"use client"

import { useEffect, useRef, useState, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import type { Character, Gear, Enemy, Projectile } from "@/types/game"
import { ArrowLeft, Pause, Play } from "lucide-react"

interface GearFightGameProps {
  character: Character
  equippedGear: Gear[]
  onFightEnd: (score: number, currency: number) => void
  onBack: () => void
}

export default function GearFightGame({ character, equippedGear, onFightEnd, onBack }: GearFightGameProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const gameLoopRef = useRef<number>()

  const [gameState, setGameState] = useState<"playing" | "paused" | "gameOver">("playing")
  const [score, setScore] = useState(0)
  const [health, setHealth] = useState(100)
  const [enemies, setEnemies] = useState<Enemy[]>([])
  const [projectiles, setProjectiles] = useState<Projectile[]>([])

  const [player, setPlayer] = useState({
    x: 100,
    y: 300,
    width: 40,
    height: 40,
    speed: 5,
    health: character.baseHealth + equippedGear.reduce((sum, gear) => sum + gear.healthBoost, 0),
    maxHealth: character.baseHealth + equippedGear.reduce((sum, gear) => sum + gear.healthBoost, 0),
    damage: character.baseDamage + equippedGear.reduce((sum, gear) => sum + gear.damageBoost, 0),
    attackCooldown: 0,
  })

  const spawnEnemy = useCallback(() => {
    const newEnemy: Enemy = {
      id: `enemy-${Date.now()}`,
      x: 800,
      y: Math.random() * 500 + 50,
      health: 50,
      maxHealth: 50,
      speed: 1 + Math.random(),
      damage: 10,
      type: "basic",
      pathIndex: 0,
      color: "#ff4444",
      size: 30,
    }
    setEnemies((prev) => [...prev, newEnemy])
  }, [])

  const gameLoop = useCallback(() => {
    if (gameState !== "playing") return

    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Clear canvas
    ctx.fillStyle = "#1a1a2e"
    ctx.fillRect(0, 0, canvas.width, canvas.height)

    // Draw player
    ctx.fillStyle = character.color
    ctx.fillRect(player.x, player.y, player.width, player.height)

    // Draw player health bar
    ctx.fillStyle = "#ff0000"
    ctx.fillRect(player.x, player.y - 10, player.width, 5)
    ctx.fillStyle = "#00ff00"
    ctx.fillRect(player.x, player.y - 10, (player.health / player.maxHealth) * player.width, 5)

    // Update and draw enemies
    setEnemies((prevEnemies) => {
      return prevEnemies.filter((enemy) => {
        enemy.x -= enemy.speed

        // Draw enemy
        ctx.fillStyle = enemy.color
        ctx.fillRect(enemy.x, enemy.y, enemy.size, enemy.size)

        // Draw enemy health bar
        ctx.fillStyle = "#ff0000"
        ctx.fillRect(enemy.x, enemy.y - 10, enemy.size, 5)
        ctx.fillStyle = "#00ff00"
        ctx.fillRect(enemy.x, enemy.y - 10, (enemy.health / enemy.maxHealth) * enemy.size, 5)

        // Check collision with player
        if (
          enemy.x < player.x + player.width &&
          enemy.x + enemy.size > player.x &&
          enemy.y < player.y + player.height &&
          enemy.y + enemy.size > player.y
        ) {
          setPlayer((prev) => ({ ...prev, health: Math.max(0, prev.health - enemy.damage) }))
          return false
        }

        return enemy.x > -enemy.size && enemy.health > 0
      })
    })

    // Update and draw projectiles
    setProjectiles((prevProjectiles) => {
      return prevProjectiles.filter((projectile) => {
        projectile.x += projectile.speed

        // Draw projectile
        ctx.fillStyle = "#ffff00"
        ctx.beginPath()
        ctx.arc(projectile.x, projectile.y, 3, 0, Math.PI * 2)
        ctx.fill()

        // Check collision with enemies
        setEnemies((prevEnemies) =>
          prevEnemies.map((enemy) => {
            if (
              projectile.x > enemy.x &&
              projectile.x < enemy.x + enemy.size &&
              projectile.y > enemy.y &&
              projectile.y < enemy.y + enemy.size
            ) {
              const newHealth = Math.max(0, enemy.health - projectile.damage)
              if (newHealth === 0) {
                setScore((prev) => prev + 10)
              }
              return { ...enemy, health: newHealth }
            }
            return enemy
          }),
        )

        return projectile.x < 800
      })
    })

    // Player attack
    if (player.attackCooldown > 0) {
      setPlayer((prev) => ({ ...prev, attackCooldown: prev.attackCooldown - 1 }))
    }

    // Auto-attack nearest enemy
    if (player.attackCooldown === 0 && enemies.length > 0) {
      const nearestEnemy = enemies.reduce((closest, enemy) => {
        const distToCurrent = Math.abs(enemy.x - player.x)
        const distToClosest = Math.abs(closest.x - player.x)
        return distToCurrent < distToClosest ? enemy : closest
      })

      if (nearestEnemy && Math.abs(nearestEnemy.x - player.x) < 300) {
        setProjectiles((prev) => [
          ...prev,
          {
            id: `proj-${Date.now()}`,
            x: player.x + player.width,
            y: player.y + player.height / 2,
            targetX: nearestEnemy.x,
            targetY: nearestEnemy.y,
            damage: player.damage,
            speed: 8,
            type: "bullet",
          },
        ])
        setPlayer((prev) => ({ ...prev, attackCooldown: 30 }))
      }
    }

    // Check game over
    if (player.health <= 0) {
      setGameState("gameOver")
      return
    }

    // Spawn enemies periodically
    if (Math.random() < 0.02) {
      spawnEnemy()
    }

    gameLoopRef.current = requestAnimationFrame(gameLoop)
  }, [gameState, player, enemies, projectiles, character, spawnEnemy])

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
    onFightEnd(score, score * 2)
  }

  return (
    <div className="flex flex-col h-screen bg-gray-900">
      {/* UI Header */}
      <div className="flex items-center justify-between p-4 bg-gray-800">
        <div className="flex items-center gap-4">
          <Button onClick={onBack} variant="ghost" className="text-white">
            <ArrowLeft className="mr-2" />
            Back
          </Button>
          <Button
            onClick={() => setGameState(gameState === "paused" ? "playing" : "paused")}
            variant="ghost"
            className="text-white"
          >
            {gameState === "paused" ? <Play /> : <Pause />}
          </Button>
        </div>

        <div className="flex gap-6 text-white">
          <div>Score: {score}</div>
          <div>Health: {player.health}</div>
        </div>
      </div>

      {/* Game Canvas */}
      <div className="flex-1 flex items-center justify-center">
        <canvas ref={canvasRef} width={800} height={600} className="border border-gray-600 bg-gray-800" />
      </div>

      {/* Game Over Modal */}
      {gameState === "gameOver" && (
        <div className="absolute inset-0 bg-black/80 flex items-center justify-center">
          <Card className="bg-gray-800 p-8">
            <CardContent className="text-center">
              <h2 className="text-3xl font-bold text-red-400 mb-4">Game Over!</h2>
              <p className="text-white mb-4">Final Score: {score}</p>
              <div className="flex gap-4">
                <Button onClick={handleEndFight} className="bg-green-600 hover:bg-green-700">
                  Collect Rewards
                </Button>
                <Button onClick={onBack} variant="outline">
                  Main Menu
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}
