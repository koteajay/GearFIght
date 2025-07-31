"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Sword, Shield, Coins, Trophy, Settings, Play } from "lucide-react"

interface LandingPageProps {
  onStartFight: () => void
  onGearSetup: () => void
  onViewScore: () => void
  currency: number
}

export default function LandingPage({ onStartFight, onGearSetup, onViewScore, currency }: LandingPageProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-blue-900 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-20 w-32 h-32 bg-purple-500/20 rounded-full blur-xl animate-pulse"></div>
        <div className="absolute top-40 right-32 w-24 h-24 bg-blue-500/20 rounded-full blur-lg animate-bounce"></div>
        <div className="absolute bottom-32 left-1/3 w-40 h-40 bg-red-500/10 rounded-full blur-2xl animate-pulse"></div>
        <div className="absolute bottom-20 right-20 w-28 h-28 bg-yellow-500/20 rounded-full blur-xl animate-bounce"></div>
      </div>

      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen p-8">
        {/* Game Title */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-4 mb-6">
            <div className="relative">
              <Sword className="w-16 h-16 text-red-400 animate-pulse" />
              <div className="absolute inset-0 w-16 h-16 text-red-400 animate-spin opacity-30">
                <Settings className="w-16 h-16" />
              </div>
            </div>
            <h1 className="text-7xl font-bold bg-gradient-to-r from-red-400 via-purple-400 to-blue-400 bg-clip-text text-transparent">
              GEARFIGHT
            </h1>
            <div className="relative">
              <Shield className="w-16 h-16 text-blue-400 animate-pulse" />
              <div className="absolute inset-0 w-16 h-16 text-blue-400 animate-spin opacity-30">
                <Settings className="w-16 h-16" />
              </div>
            </div>
          </div>
          <p className="text-2xl text-gray-300 font-semibold">
            Strategic Tower Defense • Epic Battles • Legendary Gear
          </p>
        </div>

        {/* Currency Display */}
        <div className="mb-8">
          <Card className="bg-black/40 border-yellow-500/50 backdrop-blur-sm">
            <CardContent className="flex items-center gap-3 p-4">
              <Coins className="w-8 h-8 text-yellow-400" />
              <span className="text-2xl font-bold text-white">{currency}</span>
              <span className="text-yellow-400">Coins</span>
            </CardContent>
          </Card>
        </div>

        {/* Main Menu Buttons */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          <Card className="bg-black/40 border-red-500/50 hover:border-red-400 transition-all duration-300 hover:scale-105 cursor-pointer backdrop-blur-sm group">
            <CardHeader className="text-center">
              <div className="w-20 h-20 mx-auto mb-4 bg-gradient-to-r from-red-600 to-red-700 rounded-full flex items-center justify-center group-hover:from-red-500 group-hover:to-red-600 transition-all">
                <Play className="w-10 h-10 text-white" />
              </div>
              <CardTitle className="text-2xl text-white">Start Battle</CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <p className="text-gray-300 mb-4">Jump into epic tower defense battles!</p>
              <Button
                onClick={onStartFight}
                className="w-full bg-gradient-to-r from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 text-white font-bold py-3"
              >
                FIGHT NOW!
              </Button>
            </CardContent>
          </Card>

          <Card className="bg-black/40 border-purple-500/50 hover:border-purple-400 transition-all duration-300 hover:scale-105 cursor-pointer backdrop-blur-sm group">
            <CardHeader className="text-center">
              <div className="w-20 h-20 mx-auto mb-4 bg-gradient-to-r from-purple-600 to-purple-700 rounded-full flex items-center justify-center group-hover:from-purple-500 group-hover:to-purple-600 transition-all">
                <Settings className="w-10 h-10 text-white" />
              </div>
              <CardTitle className="text-2xl text-white">Gear Setup</CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <p className="text-gray-300 mb-4">Choose heroes and upgrade your gear!</p>
              <Button
                onClick={onGearSetup}
                className="w-full bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-500 hover:to-purple-600 text-white font-bold py-3"
              >
                CUSTOMIZE
              </Button>
            </CardContent>
          </Card>

          <Card className="bg-black/40 border-blue-500/50 hover:border-blue-400 transition-all duration-300 hover:scale-105 cursor-pointer backdrop-blur-sm group">
            <CardHeader className="text-center">
              <div className="w-20 h-20 mx-auto mb-4 bg-gradient-to-r from-blue-600 to-blue-700 rounded-full flex items-center justify-center group-hover:from-blue-500 group-hover:to-blue-600 transition-all">
                <Trophy className="w-10 h-10 text-white" />
              </div>
              <CardTitle className="text-2xl text-white">Achievements</CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <p className="text-gray-300 mb-4">View your scores and achievements!</p>
              <Button
                onClick={onViewScore}
                className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-500 hover:to-blue-600 text-white font-bold py-3"
              >
                VIEW STATS
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Game Features */}
        <div className="max-w-4xl mx-auto">
          <Card className="bg-black/30 border-gray-500/50 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-3xl text-center text-white mb-6">🎮 Game Features</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="text-center">
                  <div className="text-4xl mb-2">⚔️</div>
                  <h3 className="text-white font-bold mb-2">Epic Heroes</h3>
                  <p className="text-gray-300 text-sm">Choose from powerful warriors, mages, and archers</p>
                </div>
                <div className="text-center">
                  <div className="text-4xl mb-2">👹</div>
                  <h3 className="text-white font-bold mb-2">Villain Hordes</h3>
                  <p className="text-gray-300 text-sm">Battle goblins, orcs, trolls, and mighty dragons</p>
                </div>
                <div className="text-center">
                  <div className="text-4xl mb-2">🛡️</div>
                  <h3 className="text-white font-bold mb-2">Strategic Gear</h3>
                  <p className="text-gray-300 text-sm">Upgrade weapons, armor, and abilities</p>
                </div>
                <div className="text-center">
                  <div className="text-4xl mb-2">⚡</div>
                  <h3 className="text-white font-bold mb-2">Superpowers</h3>
                  <p className="text-gray-300 text-sm">Unleash devastating rockets, lightning, and more</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
