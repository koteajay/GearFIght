"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, ShoppingCart, Coins, Plus, Minus } from "lucide-react"
import type { Character, Gear } from "@/types/game"

interface GearSetupProps {
  character: Character
  availableGear: Gear[]
  playerCurrency: number
  onGearSetupComplete: (equippedGear: Gear[]) => void
  onBack: () => void
}

export default function GearSetup({
  character,
  availableGear,
  playerCurrency,
  onGearSetupComplete,
  onBack,
}: GearSetupProps) {
  const [equippedGear, setEquippedGear] = useState<Gear[]>([])
  const [remainingCurrency, setRemainingCurrency] = useState(playerCurrency)

  const addGear = (gear: Gear) => {
    if (remainingCurrency >= gear.cost) {
      setEquippedGear((prev) => [...prev, gear])
      setRemainingCurrency((prev) => prev - gear.cost)
    }
  }

  const removeGear = (gearId: string) => {
    const gearToRemove = equippedGear.find((g) => g.id === gearId)
    if (gearToRemove) {
      setEquippedGear((prev) => {
        const index = prev.findIndex((g) => g.id === gearId)
        return prev.filter((_, i) => i !== index)
      })
      setRemainingCurrency((prev) => prev + gearToRemove.cost)
    }
  }

  const calculateTotalStats = () => {
    const totalDamage = character.baseDamage + equippedGear.reduce((sum, gear) => sum + gear.damageBoost, 0)
    const totalHealth = character.baseHealth + equippedGear.reduce((sum, gear) => sum + gear.healthBoost, 0)
    const totalSpeed = character.baseSpeed + equippedGear.reduce((sum, gear) => sum + gear.speedBoost, 0)

    return { totalDamage, totalHealth, totalSpeed }
  }

  const { totalDamage, totalHealth, totalSpeed } = calculateTotalStats()

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <div className="max-w-7xl w-full">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <Button onClick={onBack} variant="ghost" className="text-white hover:bg-white/20">
            <ArrowLeft className="mr-2" />
            Back
          </Button>
          <h1 className="text-4xl font-bold text-center bg-gradient-to-r from-yellow-500 to-orange-500 bg-clip-text text-transparent">
            Gear Setup
          </h1>
          <div className="flex items-center gap-2 text-yellow-400">
            <Coins className="w-5 h-5" />
            <span className="font-bold">{remainingCurrency}</span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Character Stats */}
          <Card className="bg-black/40 border-purple-500/50 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2" style={{ color: character.color }}>
                <div className="text-3xl">
                  {character.id === "warrior" && "⚔️"}
                  {character.id === "archer" && "🏹"}
                  {character.id === "mage" && "🧙‍♂️"}
                  {character.id === "rogue" && "🗡️"}
                </div>
                {character.name}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-gray-300">Health:</span>
                  <div className="flex items-center gap-2">
                    <span className="text-gray-400">{character.baseHealth}</span>
                    {totalHealth !== character.baseHealth && (
                      <>
                        <span className="text-green-400">→ {totalHealth}</span>
                        <Badge variant="outline" className="text-green-400 border-green-400">
                          +{totalHealth - character.baseHealth}
                        </Badge>
                      </>
                    )}
                  </div>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-gray-300">Damage:</span>
                  <div className="flex items-center gap-2">
                    <span className="text-gray-400">{character.baseDamage}</span>
                    {totalDamage !== character.baseDamage && (
                      <>
                        <span className="text-red-400">→ {totalDamage}</span>
                        <Badge variant="outline" className="text-red-400 border-red-400">
                          +{totalDamage - character.baseDamage}
                        </Badge>
                      </>
                    )}
                  </div>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-gray-300">Speed:</span>
                  <div className="flex items-center gap-2">
                    <span className="text-gray-400">{character.baseSpeed}</span>
                    {totalSpeed !== character.baseSpeed && (
                      <>
                        <span className="text-blue-400">→ {totalSpeed.toFixed(1)}</span>
                        <Badge
                          variant="outline"
                          className={`${totalSpeed > character.baseSpeed ? "text-blue-400 border-blue-400" : "text-orange-400 border-orange-400"}`}
                        >
                          {totalSpeed > character.baseSpeed ? "+" : ""}
                          {(totalSpeed - character.baseSpeed).toFixed(1)}
                        </Badge>
                      </>
                    )}
                  </div>
                </div>
              </div>

              {/* Equipped Gear */}
              <div className="mt-6">
                <h3 className="text-lg font-bold text-white mb-3">Equipped Gear</h3>
                {equippedGear.length === 0 ? (
                  <p className="text-gray-400 text-sm">No gear equipped</p>
                ) : (
                  <div className="space-y-2">
                    {equippedGear.map((gear, index) => (
                      <div
                        key={`${gear.id}-${index}`}
                        className="flex items-center justify-between bg-gray-800/50 p-2 rounded"
                      >
                        <div>
                          <span className="text-white font-medium">{gear.name}</span>
                          <div className="text-xs text-gray-400">
                            {gear.damageBoost > 0 && `+${gear.damageBoost} DMG `}
                            {gear.healthBoost > 0 && `+${gear.healthBoost} HP `}
                            {gear.speedBoost > 0 && `+${gear.speedBoost} SPD `}
                            {gear.speedBoost < 0 && `${gear.speedBoost} SPD `}
                          </div>
                        </div>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => removeGear(gear.id)}
                          className="text-red-400 border-red-400 hover:bg-red-400/20"
                        >
                          <Minus className="w-4 h-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <Button
                onClick={() => onGearSetupComplete(equippedGear)}
                className="w-full bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-500 hover:to-blue-500 mt-6"
              >
                Continue to Battle
              </Button>
            </CardContent>
          </Card>

          {/* Available Gear */}
          <div className="lg:col-span-2">
            <Card className="bg-black/40 border-yellow-500/50 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-yellow-400">
                  <ShoppingCart className="w-5 h-5" />
                  Gear Shop
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {availableGear.map((gear) => (
                    <Card key={gear.id} className="bg-gray-800/50 border-gray-600">
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between mb-3">
                          <div>
                            <h3 className="font-bold text-white">{gear.name}</h3>
                            <Badge variant="outline" className="text-xs mt-1">
                              {gear.type}
                            </Badge>
                          </div>
                          <div className="text-right">
                            <div className="flex items-center gap-1 text-yellow-400">
                              <Coins className="w-4 h-4" />
                              <span className="font-bold">{gear.cost}</span>
                            </div>
                          </div>
                        </div>

                        <p className="text-sm text-gray-400 mb-3">{gear.description}</p>

                        <div className="space-y-1 mb-3">
                          {gear.damageBoost > 0 && (
                            <div className="flex justify-between text-sm">
                              <span className="text-gray-300">Damage:</span>
                              <span className="text-red-400">+{gear.damageBoost}</span>
                            </div>
                          )}
                          {gear.healthBoost > 0 && (
                            <div className="flex justify-between text-sm">
                              <span className="text-gray-300">Health:</span>
                              <span className="text-green-400">+{gear.healthBoost}</span>
                            </div>
                          )}
                          {gear.speedBoost !== 0 && (
                            <div className="flex justify-between text-sm">
                              <span className="text-gray-300">Speed:</span>
                              <span className={gear.speedBoost > 0 ? "text-blue-400" : "text-orange-400"}>
                                {gear.speedBoost > 0 ? "+" : ""}
                                {gear.speedBoost}
                              </span>
                            </div>
                          )}
                        </div>

                        <Button
                          onClick={() => addGear(gear)}
                          disabled={remainingCurrency < gear.cost}
                          className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 disabled:from-gray-600 disabled:to-gray-700"
                        >
                          <Plus className="w-4 h-4 mr-2" />
                          Buy Gear
                        </Button>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Instructions */}
        <div className="mt-8 text-center">
          <p className="text-gray-400">
            Equip gear to enhance your champion's abilities. Each piece of gear provides different bonuses to help you
            in battle.
          </p>
        </div>
      </div>
    </div>
  )
}
