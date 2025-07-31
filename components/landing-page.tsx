"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Sword, Shield, Zap, Trophy, Star, Coins } from "lucide-react"

interface PlayerStats {
  level: number
  experience: number
  currency: number
  totalScore: number
  gamesWon: number
  gamesLost: number
}

interface LandingPageProps {
  playerStats: PlayerStats
  onStartGame: () => void
}

export default function LandingPage({ playerStats, onStartGame }: LandingPageProps) {
  const [animatedStats, setAnimatedStats] = useState(playerStats)

  useEffect(() => {
    setAnimatedStats(playerStats)
  }, [playerStats])

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 left-20 w-32 h-32 bg-blue-500/10 rounded-full animate-pulse" />
        <div className="absolute top-40 right-32 w-24 h-24 bg-purple-500/10 rounded-full animate-bounce" />
        <div className="absolute bottom-32 left-40 w-40 h-40 bg-red-500/10 rounded-full animate-pulse" />
        <div className="absolute bottom-20 right-20 w-28 h-28 bg-green-500/10 rounded-full animate-bounce" />
      </div>

      {/* Main Content */}
      <div className="relative z-10 max-w-6xl w-full">
        {/* Title Section */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-4 mb-6">
            <Sword className="w-12 h-12 text-red-500 animate-pulse" />
            <h1 className="text-6xl font-bold bg-gradient-to-r from-red-500 via-purple-500 to-blue-500 bg-clip-text text-transparent">
              ⚔️ GearFight
            </h1>
            <Shield className="w-12 h-12 text-blue-500 animate-pulse" />
          </div>
          <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
            Epic side-scrolling battles where heroes clash with villains! Spawn your army, watch them fight
            automatically, and dominate the battlefield!
          </p>

          {/* Game Features */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            <Card className="bg-black/40 border-red-500/50 backdrop-blur-sm">
              <CardContent className="p-4 text-center">
                <div className="text-3xl mb-2">👹⚔️🏹</div>
                <h3 className="font-bold text-red-400">Auto-Battle System</h3>
                <p className="text-sm text-gray-400">Heroes and villains fight automatically when they meet!</p>
              </CardContent>
            </Card>

            <Card className="bg-black/40 border-purple-500/50 backdrop-blur-sm">
              <CardContent className="p-4 text-center">
                <div className="text-3xl mb-2">⚡🎯❄️</div>
                <h3 className="font-bold text-purple-400">Epic Superpowers</h3>
                <p className="text-sm text-gray-400">Unleash devastating abilities to turn the tide!</p>
              </CardContent>
            </Card>

            <Card className="bg-black/40 border-blue-500/50 backdrop-blur-sm">
              <CardContent className="p-4 text-center">
                <div className="text-3xl mb-2">🏹🧙‍♂️⚔️</div>
                <h3 className="font-bold text-blue-400">Strategic Spawning</h3>
                <p className="text-sm text-gray-400">Choose the right heroes at the right time!</p>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Player Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <Card className="bg-black/40 border-yellow-500/50 backdrop-blur-sm">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-yellow-400">
                <Star className="w-5 h-5" />
                Player Level
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-white mb-2">{animatedStats.level}</div>
              <div className="text-sm text-gray-400">
                XP: {animatedStats.experience} / {animatedStats.level * 1000}
              </div>
              <div className="w-full bg-gray-700 rounded-full h-2 mt-2">
                <div
                  className="bg-yellow-500 h-2 rounded-full transition-all duration-1000"
                  style={{ width: `${(animatedStats.experience % 1000) / 10}%` }}
                />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-black/40 border-green-500/50 backdrop-blur-sm">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-green-400">
                <Coins className="w-5 h-5" />
                Currency
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-white mb-2">{animatedStats.currency}</div>
              <div className="text-sm text-gray-400">Coins available for gear</div>
            </CardContent>
          </Card>

          <Card className="bg-black/40 border-purple-500/50 backdrop-blur-sm">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-purple-400">
                <Trophy className="w-5 h-5" />
                Battle Record
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex justify-between items-center mb-2">
                <span className="text-green-400">Wins: {animatedStats.gamesWon}</span>
                <span className="text-red-400">Losses: {animatedStats.gamesLost}</span>
              </div>
              <div className="text-sm text-gray-400">Total Score: {animatedStats.totalScore.toLocaleString()}</div>
            </CardContent>
          </Card>
        </div>

        {/* Action Buttons */}
        <div className="text-center space-y-4">
          <Button
            onClick={onStartGame}
            size="lg"
            className="bg-gradient-to-r from-red-600 to-purple-600 hover:from-red-500 hover:to-purple-500 text-white font-bold py-4 px-8 text-xl rounded-xl shadow-2xl transform hover:scale-105 transition-all duration-200"
          >
            <Zap className="mr-2 w-6 h-6" />
            Start Epic Battle!
          </Button>

          <div className="flex flex-wrap justify-center gap-2 mt-4">
            <Badge variant="outline" className="text-red-400 border-red-400">
              Side-Scrolling Combat
            </Badge>
            <Badge variant="outline" className="text-purple-400 border-purple-400">
              Auto-Fighting
            </Badge>
            <Badge variant="outline" className="text-blue-400 border-blue-400">
              Strategic Spawning
            </Badge>
            <Badge variant="outline" className="text-green-400 border-green-400">
              Epic Superpowers
            </Badge>
          </div>
        </div>

        {/* Game Instructions */}
        <Card className="mt-8 bg-black/40 border-gray-500/50 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-center text-gray-300">🎮 How to Play</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-400">
              <div>
                <h4 className="font-bold text-white mb-2">⚔️ Battle Mechanics:</h4>
                <ul className="space-y-1">
                  <li>• Villains spawn from the LEFT and move RIGHT</li>
                  <li>• Heroes spawn from the RIGHT and move LEFT</li>
                  <li>• Units fight automatically when they meet</li>
                  <li>• Protect your base from enemy invasion!</li>
                </ul>
              </div>
              <div>
                <h4 className="font-bold text-white mb-2">🎯 Strategy Tips:</h4>
                <ul className="space-y-1">
                  <li>• Spawn different hero types for variety</li>
                  <li>• Use superpowers at the right moment</li>
                  <li>• Balance offense and defense</li>
                  <li>• Manage your currency wisely</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
