"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import type { Character, Gear } from "@/types/game"
import { ArrowLeft, ShoppingCart, Sword, Zap, Shield } from "lucide-react"

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
    damageBoost: 10,
    speedBoost: 0,
    healthBoost: 0,
    cost: 50,
    description: "A sturdy iron sword that increases damage",
  },
  {
    id: "speed-boots",
    name: "Speed Boots",
    type: "speed",
    damageBoost: 0,
    speedBoost: 3,
    healthBoost: 0,
    cost: 40,
    description: "Lightweight boots that boost movement speed",
  },
  {
    id: "armor-vest",
    name: "Armor Vest",
    type: "armor",
    damageBoost: 0,
    speedBoost: -1,
    healthBoost: 30,
    cost: 60,
    description: "Heavy armor that increases health but reduces speed",
  },
  {
    id: "power-gloves",
    name: "Power Gloves",
    type: "weapon",
    damageBoost: 15,
    speedBoost: 1,
    healthBoost: 0,
    cost: 80,
    description: "Enchanted gloves that boost damage and speed",
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
  const handleBuyGear = (gear: Gear) => {
    if (currency >= gear.cost && !equippedGear.find((g) => g.id === gear.id)) {
      onCurrencyChange(currency - gear.cost)
      onGearEquip([...equippedGear, gear])
    }
  }

  const handleUnequipGear = (gearId: string) => {
    onGearEquip(equippedGear.filter((g) => g.id !== gearId))
  }

  const getGearIcon = (type: string) => {
    switch (type) {
      case "weapon":
        return <Sword className="w-6 h-6" />
      case "speed":
        return <Zap className="w-6 h-6" />
      case "armor":
        return <Shield className="w-6 h-6" />
      default:
        return <ShoppingCart className="w-6 h-6" />
    }
  }

  const totalStats = character
    ? {
        health: character.baseHealth + equippedGear.reduce((sum, gear) => sum + gear.healthBoost, 0),
        speed: character.baseSpeed + equippedGear.reduce((sum, gear) => sum + gear.speedBoost, 0),
        damage: character.baseDamage + equippedGear.reduce((sum, gear) => sum + gear.damageBoost, 0),
      }
    : null

  return (
    <div className="flex flex-col h-full bg-gradient-to-b from-gray-900 to-gray-800 p-8">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center">
          <Button onClick={onBack} variant="ghost" className="mr-4">
            <ArrowLeft className="mr-2" />
            Back
          </Button>
          <h1 className="text-4xl font-bold">Gear Setup</h1>
        </div>
        <div className="text-xl">Currency: {currency}</div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 flex-1">
        {/* Character Stats */}
        <div>
          <h2 className="text-2xl font-bold mb-4">Character Stats</h2>
          {character && totalStats && (
            <Card className="bg-gray-800 border-gray-700 mb-6">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full" style={{ backgroundColor: character.color }} />
                  {character.name}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Health:</span>
                    <span className="text-red-400">{totalStats.health}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Speed:</span>
                    <span className="text-green-400">{totalStats.speed}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Damage:</span>
                    <span className="text-yellow-400">{totalStats.damage}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Equipped Gear */}
          <h3 className="text-xl font-bold mb-4">Equipped Gear</h3>
          <div className="space-y-2 mb-6">
            {equippedGear.length === 0 ? (
              <p className="text-gray-400">No gear equipped</p>
            ) : (
              equippedGear.map((gear) => (
                <Card key={gear.id} className="bg-gray-700 border-gray-600">
                  <CardContent className="flex items-center justify-between p-4">
                    <div className="flex items-center gap-2">
                      {getGearIcon(gear.type)}
                      <span>{gear.name}</span>
                    </div>
                    <Button onClick={() => handleUnequipGear(gear.id)} variant="destructive" size="sm">
                      Unequip
                    </Button>
                  </CardContent>
                </Card>
              ))
            )}
          </div>

          <Button onClick={onStartFight} className="w-full bg-red-600 hover:bg-red-700" disabled={!character}>
            Start Fight!
          </Button>
        </div>

        {/* Gear Store */}
        <div>
          <h2 className="text-2xl font-bold mb-4">Gear Store</h2>
          <div className="grid gap-4">
            {availableGear.map((gear) => {
              const isOwned = equippedGear.find((g) => g.id === gear.id)
              const canAfford = currency >= gear.cost

              return (
                <Card key={gear.id} className="bg-gray-800 border-gray-700">
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        {getGearIcon(gear.type)}
                        {gear.name}
                      </div>
                      <span className="text-yellow-400">{gear.cost} coins</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-300 mb-4">{gear.description}</p>
                    <div className="flex justify-between text-sm mb-4">
                      {gear.damageBoost > 0 && <span className="text-yellow-400">+{gear.damageBoost} DMG</span>}
                      {gear.speedBoost !== 0 && (
                        <span className={gear.speedBoost > 0 ? "text-green-400" : "text-red-400"}>
                          {gear.speedBoost > 0 ? "+" : ""}
                          {gear.speedBoost} SPD
                        </span>
                      )}
                      {gear.healthBoost > 0 && <span className="text-red-400">+{gear.healthBoost} HP</span>}
                    </div>
                    <Button onClick={() => handleBuyGear(gear)} disabled={isOwned || !canAfford} className="w-full">
                      {isOwned ? "Owned" : canAfford ? "Buy" : "Can't Afford"}
                    </Button>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}
