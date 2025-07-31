"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Sword, Settings, Trophy, Coins, Play, Zap, Shield } from "lucide-react"

interface LandingPageProps {
  onStartFight: () => void
  onGearSetup: () => void
  onCharacterSelect: () => void
  score: number
  currency: number
}

export default function LandingPage({
  onStartFight,
  onGearSetup,
  onCharacterSelect,
  score,
  currency,
}: LandingPageProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-10 w-32 h-32 bg-yellow-400 rounded-full opacity-10 animate-pulse"></div>
        <div className="absolute top-40 right-20 w-24 h-24 bg-red-400 rounded-full opacity-10 animate-bounce"></div>
        <div className="absolute bottom-20 left-1/4 w-40 h-40 bg-green-400 rounded-full opacity-10 animate-pulse"></div>
        <div className="absolute bottom-40 right-1/3 w-28 h-28 bg-blue-400 rounded-full opacity-10 animate-bounce"></div>
      </div>

      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen p-8">
        {/* Game Title */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center mb-6">
            <div className="w-20 h-20 bg-gradient-to-r from-yellow-400 to-red-500 rounded-full flex items-center justify-center mr-4 animate-spin-slow">
              <Zap className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-7xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 via-red-500 to-purple-500 animate-pulse">
              GearFight
            </h1>
            <div className="w-20 h-20 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full flex items-center justify-center ml-4 animate-spin-slow">
              <Shield className="w-10 h-10 text-white" />
            </div>
          </div>
          <p className="text-2xl text-gray-300 font-semibold">Strategic Tower Defense Arena</p>
          <p className="text-lg text-gray-400 mt-2">Place your gears, defend your base, conquer the waves!</p>
        </div>

        {/* Stats Display */}
        <div className="flex gap-6 mb-12">
          <Card className="bg-black/30 border-yellow-500/50 backdrop-blur-sm">
            <CardContent className="flex items-center gap-3 p-6">
              <Trophy className="text-yellow-400 w-8 h-8" />
              <div>
                <p className="text-yellow-400 font-bold text-xl">{score}</p>
                <p className="text-gray-300 text-sm">Best Score</p>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-black/30 border-green-500/50 backdrop-blur-sm">
            <CardContent className="flex items-center gap-3 p-6">
              <Coins className="text-green-400 w-8 h-8" />
              <div>
                <p className="text-green-400 font-bold text-xl">{currency}</p>
                <p className="text-gray-300 text-sm">Coins</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Action Buttons */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl w-full">
          <Card className="bg-black/40 border-red-500/50 hover:border-red-400 transition-all duration-300 hover:scale-105 backdrop-blur-sm group cursor-pointer">
            <CardHeader className="text-center pb-4">
              <div className="w-16 h-16 bg-gradient-to-r from-red-500 to-red-600 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:animate-pulse">
                <Play className="text-white w-8 h-8" />
              </div>
              <CardTitle className="text-2xl text-red-400 group-hover:text-red-300">Battle Arena</CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <p className="text-gray-300 mb-6 text-lg">Jump into intense tower defense battles!</p>
              <Button
                onClick={onStartFight}
                className="w-full bg-gradient-to-r from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 text-white font-bold py-3 text-lg shadow-lg hover:shadow-red-500/25"
              >
                START FIGHT!
              </Button>
            </CardContent>
          </Card>

          <Card className="bg-black/40 border-blue-500/50 hover:border-blue-400 transition-all duration-300 hover:scale-105 backdrop-blur-sm group cursor-pointer">
            <CardHeader className="text-center pb-4">
              <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:animate-pulse">
                <Settings className="text-white w-8 h-8" />
              </div>
              <CardTitle className="text-2xl text-blue-400 group-hover:text-blue-300">Characters</CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <p className="text-gray-300 mb-6 text-lg">Choose your fighter and customize your loadout.</p>
              <Button
                onClick={onCharacterSelect}
                className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-500 hover:to-blue-600 text-white font-bold py-3 text-lg shadow-lg hover:shadow-blue-500/25"
              >
                SELECT HERO
              </Button>
            </CardContent>
          </Card>

          <Card className="bg-black/40 border-green-500/50 hover:border-green-400 transition-all duration-300 hover:scale-105 backdrop-blur-sm group cursor-pointer">
            <CardHeader className="text-center pb-4">
              <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-green-600 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:animate-pulse">
                <Sword className="text-white w-8 h-8" />
              </div>
              <CardTitle className="text-2xl text-green-400 group-hover:text-green-300">Gear Store</CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <p className="text-gray-300 mb-6 text-lg">Upgrade your equipment and unlock new abilities.</p>
              <Button
                onClick={onGearSetup}
                className="w-full bg-gradient-to-r from-green-600 to-green-700 hover:from-green-500 hover:to-green-600 text-white font-bold py-3 text-lg shadow-lg hover:shadow-green-500/25"
              >
                GEAR UP
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Game Features */}
        <div className="mt-16 text-center">
          <h3 className="text-3xl font-bold text-white mb-8">Game Features</h3>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 max-w-4xl">
            <div className="text-center">
              <div className="w-12 h-12 bg-purple-600 rounded-full flex items-center justify-center mx-auto mb-3">
                <span className="text-2xl">⚔️</span>
              </div>
              <p className="text-gray-300 font-semibold">Strategic Combat</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-purple-600 rounded-full flex items-center justify-center mx-auto mb-3">
                <span className="text-2xl">🎯</span>
              </div>
              <p className="text-gray-300 font-semibold">Tower Defense</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-purple-600 rounded-full flex items-center justify-center mx-auto mb-3">
                <span className="text-2xl">⚡</span>
              </div>
              <p className="text-gray-300 font-semibold">Superpowers</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-purple-600 rounded-full flex items-center justify-center mx-auto mb-3">
                <span className="text-2xl">🏆</span>
              </div>
              <p className="text-gray-300 font-semibold">Epic Rewards</p>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes spin-slow {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }
        .animate-spin-slow {
          animation: spin-slow 3s linear infinite;
        }
      `}</style>
    </div>
  )
}
