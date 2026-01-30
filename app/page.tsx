"use client"

import { useState } from "react"
import { TetrisGame } from "@/components/tetris-game"
import { PlatformerGame } from "@/components/platformer-game"
import { GameSelector } from "@/components/game-selector"

type GameScreen = "menu" | "tetris" | "platformer"

export default function Home() {
  const [currentScreen, setCurrentScreen] = useState<GameScreen>("menu")

  const handleSelectGame = (game: "tetris" | "platformer") => {
    setCurrentScreen(game)
  }

  const handleBackToMenu = () => {
    setCurrentScreen("menu")
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-gb-bezel via-gb-bezel-dark to-gb-bezel 
      flex items-center justify-center p-4 sm:p-8">
      {currentScreen === "menu" && (
        <GameSelector onSelectGame={handleSelectGame} />
      )}
      {currentScreen === "tetris" && (
        <TetrisGame onBack={handleBackToMenu} />
      )}
      {currentScreen === "platformer" && (
        <PlatformerGame onBack={handleBackToMenu} />
      )}
    </main>
  )
}
