"use client"

import { useState } from "react"
import { GameSelector } from "./game-selector"
import { TetrisGame } from "./tetris-game"
import { PlatformerGame } from "./platformer-game"

type GameType = "menu" | "tetris" | "platformer"

export function GameConsole() {
  const [currentGame, setCurrentGame] = useState<GameType>("menu")

  const handleSelectGame = (game: "tetris" | "platformer") => {
    setCurrentGame(game)
  }

  const handleBackToMenu = () => {
    setCurrentGame("menu")
  }

  return (
    <>
      {currentGame === "menu" && (
        <GameSelector onSelectGame={handleSelectGame} />
      )}
      {currentGame === "tetris" && (
        <TetrisGame onBack={handleBackToMenu} />
      )}
      {currentGame === "platformer" && (
        <PlatformerGame onBack={handleBackToMenu} />
      )}
    </>
  )
}
