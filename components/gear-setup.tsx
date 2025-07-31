"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft, Sword, Shield, Zap, Coins } from "lucide-react"
import type { Character, Gear } from "@/types/game"

interface GearSetupProps {
  character: Character | null
  equippedGear: Gear[]
  currency: number
  onGearEquip: (gear: Gear[]) => void
  onCurrencyChange: (currency: number) => void
  onStartFight: () => void
  onBack: () => void
}

const availableGear: Gear[] = [
  {
    id: "iron-sword",
    name: "Iron Sword",
    type: "weapon",
    damageBoost: 15,
    speedBoost: 0,
    healthBoost: 0,
    cost: 50,
    description: "Sharp blade that increases attack damage",
  },
  {
    id: "steel-armor",
    name: "Steel Armor",
    type: "armor",
    damageBoost: 0,
    speedBoost: -5,
    healthBoost: 30,
    cost: 60,
    description: "Heavy protection that boosts health",
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
  {
    id: "power-gloves",
    name: "Power Gloves",
    type: "weapon",
    damageBoost: 25,
    speedBoost: 5,
    healthBoost: 0,
    cost: 80,
    description: "Magical gloves that enhance combat abilities",
  },
]

export default function GearSetup({
  character,
  equippedGear,
  currency,
  onGearEquip,
  onCurrencyChange,
  onStartFight,
  onBack,
}: GearSetupProps) {
  const buyGear = (gear: Gear) => {
    if (currency >= gear.cost && !equippedGear.find((g) => g.id === gear.id)) {
      onGearEquip([...equippedGear, gear])
      onCurrencyChange(currency - gear.cost)
    }
  }

  const sellGear = (gear: Gear) => {
    onGearEquip(equippedGear.filter((g) => g.id !== gear.id))
    onCurrencyChange(currency + Math.floor(gear.cost * 0.7))
  }

  const totalStats = equippedGear.reduce(
    (total, gear) => ({
      damage: total.damage + gear.damageBoost,
      speed: total.speed + gear.speedBoost,
      health: total.health + gear.healthBoost,
    }),
    { damage: 0, speed: 0, health: 0 },
  )

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-blue-900 p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center">
            <Button onClick={onBack} variant="ghost" className="text-white hover:bg-white/20">
              <ArrowLeft className="mr-2" />
              Back
            </Button>
            <h1 className="text-4xl font-bold text-white ml-8">Gear Setup</h1>
          </div>
          <div className="flex items-center gap-2 bg-black/40 px-4 py-2 rounded-lg">
            <Coins className="text-yellow-400" />
            <span className="text-white font-bold text-xl">{currency}</span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Character Stats */}
          <div className="space-y-6">
            <Card className="bg-black/40 border-blue-500/50">
              <CardHeader>
                <CardTitle className="text-blue-400">Character Stats</CardTitle>
              </CardHeader>
              <CardContent>
                {character ? (
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-300">Base Health:</span>
                      <span className="text-white font-bold">{character.baseHealth}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-300">Base Speed:</span>
                      <span className="text-white font-bold">{character.baseSpeed}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-300">Base Damage:</span>
                      <span className="text-white font-bold">{character.baseDamage}</span>
                    </div>
                    <hr className="border-gray-600" />
                    <div className="flex justify-between">
                      <span className="text-green-400">Total Health:</span>
                      <span className="text-green-400 font-bold">{character.baseHealth + totalStats.health}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-green-400">Total Speed:</span>
                      <span className="text-green-400 font-bold">{character.baseSpeed + totalStats.speed}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-green-400">Total Damage:</span>
                      <span className="text-green-400 font-bold">{character.baseDamage + totalStats.damage}</span>
                    </div>
                  </div>
                ) : (
                  <p className="text-gray-400">No character selected</p>
                )}
              </CardContent>
            </Card>

            <Card className="bg-black/40 border-green-500/50">
              <CardHeader>
                <CardTitle className="text-green-400">Equipped Gear</CardTitle>
              </CardHeader>
              <CardContent>
                {equippedGear.length > 0 ? (
                  <div className="space-y-3">
                    {equippedGear.map((gear) => (
                      <div key={gear.id} className="flex justify-between items-center p-2 bg-gray-700 rounded">
                        <span className="text-white">{gear.name}</span>
                        <Button
                          onClick={() => sellGear(gear)}
                          size="sm"
                          variant="outline"
                          className="text-red-400 border-red-400 hover:bg-red-400 hover:text-white"
                        >
                          Sell
                        </Button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-400">No gear equipped</p>
                )}
              </CardContent>
            </Card>

            <Button
              onClick={onStartFight}
              disabled={!character}
              className="w-full bg-gradient-to-r from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 text-white font-bold py-4 text-lg"
            >
              START BATTLE!
            </Button>
          </div>

          {/* Available Gear */}
          <div className="lg:col-span-2">
            <Card className="bg-black/40 border-purple-500/50">
              <CardHeader>
                <CardTitle className="text-purple-400">Gear Store</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {availableGear.map((gear) => {
                    const isOwned = equippedGear.find((g) => g.id === gear.id)
                    const canAfford = currency >= gear.cost

                    return (
                      <Card
                        key={gear.id}
                        className={`${
                          isOwned
                            ? "bg-green-900/50 border-green-500"
                            : canAfford
                              ? "bg-gray-700 border-gray-500 hover:border-white"
                              : "bg-gray-800 border-gray-600 opacity-50"
                        } transition-all duration-200`}
                      >
                        <CardContent className="p-4">
                          <div className="flex items-center gap-3 mb-3">
                            {gear.type === "weapon" && <Sword className="text-red-400" />}
                            {gear.type === "armor" && <Shield className="text-blue-400" />}
                            {gear.type === "speed" && <Zap className="text-yellow-400" />}
                            <h3 className="font-bold text-white">{gear.name}</h3>
                          </div>
                          <p className="text-gray-300 text-sm mb-3">{gear.description}</p>
                          <div className="space-y-1 text-xs mb-3">
                            {gear.damageBoost > 0 && <div className="text-red-400">+{gear.damageBoost} Damage</div>}
                            {gear.speedBoost !== 0 && (
                              <div className={gear.speedBoost > 0 ? "text-green-400" : "text-red-400"}>
                                {gear.speedBoost > 0 ? "+" : ""}
                                {gear.speedBoost} Speed
                              </div>
                            )}
                            {gear.healthBoost > 0 && <div className="text-blue-400">+{gear.healthBoost} Health</div>}
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-yellow-400 font-bold">{gear.cost} 🪙</span>
                            <Button
                              onClick={() => buyGear(gear)}
                              disabled={isOwned || !canAfford}
                              size="sm"
                              className={isOwned ? "bg-green-600" : "bg-purple-600 hover:bg-purple-700"}
                            >
                              {isOwned ? "Owned" : "Buy"}
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    )
                  })}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
