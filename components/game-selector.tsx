"use client"

import { useState, useEffect, useCallback } from "react"
import { GameBoyShell } from "./gameboy-shell"

interface GameSelectorProps {
  onSelectGame: (game: "tetris" | "platformer") => void
}

const games = [
  { 
    id: "tetris" as const, 
    title: "TETRIS", 
    subtitle: "Puzzle Game",
    colors: { bg: "from-cyan-500 to-blue-600", icon: "#00d4ff", accent: "#4488ff" }
  },
  { 
    id: "platformer" as const, 
    title: "JUMPING", 
    subtitle: "BROWNIES",
    colors: { bg: "from-orange-500 to-red-600", icon: "#ff8844", accent: "#ff4444" }
  },
]

// Brownie avatar SVG component
function BrownieIcon({ shirtColor = "#2D9CDB" }: { shirtColor?: string }) {
  return (
    <svg className="w-8 h-8 sm:w-10 sm:h-10" viewBox="0 0 32 32">
      {/* Head - yellow oval */}
      <ellipse cx="16" cy="10" rx="8" ry="7" fill="#F5C542" stroke="#1E3A5F" strokeWidth="1.5" />
      {/* Hair tuft */}
      <path d="M14 4 L16 1 L18 4" fill="#1E3A5F" />
      {/* Eye */}
      <circle cx="18" cy="9" r="1.5" fill="#1E3A5F" />
      {/* Smile */}
      <path d="M15 12 Q17 14 19 12" fill="none" stroke="#1E3A5F" strokeWidth="1" strokeLinecap="round" />
      {/* Body/Shirt */}
      <rect x="10" y="16" width="12" height="10" fill={shirtColor} stroke="#1E3A5F" strokeWidth="1.5" rx="1" />
      {/* Legs */}
      <rect x="11" y="26" width="4" height="4" fill="#1E3A5F" rx="0.5" />
      <rect x="17" y="26" width="4" height="4" fill="#1E3A5F" rx="0.5" />
      {/* Arms */}
      <line x1="10" y1="18" x2="7" y2="22" stroke="#F5C542" strokeWidth="2" />
      <line x1="22" y1="18" x2="25" y2="22" stroke="#F5C542" strokeWidth="2" />
    </svg>
  )
}

// Football icon
function FootballIcon() {
  return (
    <svg className="w-5 h-5" viewBox="0 0 24 24">
      <circle cx="12" cy="12" r="10" fill="white" stroke="#1E3A5F" strokeWidth="1.5" />
      {/* Pentagon pattern */}
      <path d="M12 6 L16 9.5 L14.5 14.5 L9.5 14.5 L8 9.5 Z" fill="#1E3A5F" />
    </svg>
  )
}

export function GameSelector({ onSelectGame }: GameSelectorProps) {
  const [selectedIndex, setSelectedIndex] = useState(0)

  const moveUp = useCallback(() => {
    setSelectedIndex((prev) => (prev > 0 ? prev - 1 : games.length - 1))
  }, [])

  const moveDown = useCallback(() => {
    setSelectedIndex((prev) => (prev < games.length - 1 ? prev + 1 : 0))
  }, [])

  const selectGame = useCallback(() => {
    onSelectGame(games[selectedIndex].id)
  }, [selectedIndex, onSelectGame])

  // Keyboard controls
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.key) {
        case "ArrowUp":
        case "w":
          e.preventDefault()
          moveUp()
          break
        case "ArrowDown":
        case "s":
          e.preventDefault()
          moveDown()
          break
        case "Enter":
        case " ":
          e.preventDefault()
          selectGame()
          break
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [moveUp, moveDown, selectGame])

  return (
    <div className="flex flex-col items-center gap-6">
      <GameBoyShell
        onStart={selectGame}
        onSelect={() => {}}
        onLeft={() => {}}
        onRight={() => {}}
        onDown={moveDown}
        onRotate={moveUp}
        onDrop={selectGame}
        isPlaying={false}
        isPaused={false}
        brandText="BRAUNE DIGITAL"
      >
        <div className="bg-gradient-to-b from-sky-500 via-sky-400 to-emerald-400 p-4 sm:p-5 w-full h-full rounded flex flex-col justify-between">
          {/* Title with Brownie branding */}
          <div className="text-center pt-1">
            <div className="flex items-center justify-center gap-2 mb-1">
              <BrownieIcon shirtColor="#E85D04" />
              <div>
                <div className="text-white text-sm sm:text-base font-bold tracking-wide drop-shadow-lg">
                  SELECT GAME
                </div>
                <div className="text-xs text-white/80">Braune Digital</div>
              </div>
              <BrownieIcon shirtColor="#9B51E0" />
            </div>
            <div className="flex items-center justify-center gap-2">
              <div className="w-6 h-0.5 bg-gradient-to-r from-transparent via-yellow-400 to-transparent" />
              <FootballIcon />
              <div className="w-6 h-0.5 bg-gradient-to-r from-transparent via-yellow-400 to-transparent" />
            </div>
          </div>
          
          {/* Game list */}
          <div className="space-y-3 flex-1 flex flex-col justify-center py-2">
            {games.map((game, index) => (
              <button
                key={game.id}
                onClick={() => {
                  setSelectedIndex(index)
                  onSelectGame(game.id)
                }}
                className={`w-full flex items-center gap-3 p-3 rounded-lg transition-all duration-200 transform
                  ${selectedIndex === index 
                    ? `bg-gradient-to-r ${game.colors.bg} scale-105 shadow-lg shadow-black/30 border-2 border-white/50` 
                    : "bg-white/20 hover:bg-white/30 scale-100 border-2 border-transparent"
                  }`}
              >
                {/* Selection arrow */}
                <span className={`text-yellow-400 text-lg transition-all duration-200 drop-shadow ${selectedIndex === index ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-2"}`}>
                  {"▶"}
                </span>
                
                {/* Game info */}
                <div className="flex-1 text-left">
                  <div className={`text-sm sm:text-base font-bold ${selectedIndex === index ? "text-white" : "text-slate-800"}`}>
                    {game.title}
                  </div>
                  <div className={`text-xs ${selectedIndex === index ? "text-white/90" : "text-slate-600"}`}>
                    {game.subtitle}
                  </div>
                </div>
                
                {/* Game icon */}
                <div className={`w-10 h-10 sm:w-12 sm:h-12 rounded-lg flex items-center justify-center transition-all
                  ${selectedIndex === index ? "bg-white/30" : "bg-white/40"}`}
                >
                  {game.id === "tetris" ? (
                    // Colorful Tetris blocks icon
                    <svg className="w-6 h-6 sm:w-8 sm:h-8" viewBox="0 0 24 24">
                      <rect x="4" y="4" width="5" height="5" fill="#00d4ff" stroke="#1E3A5F" strokeWidth="0.5" />
                      <rect x="9" y="4" width="5" height="5" fill="#aa44ff" stroke="#1E3A5F" strokeWidth="0.5" />
                      <rect x="9" y="9" width="5" height="5" fill="#ffdd00" stroke="#1E3A5F" strokeWidth="0.5" />
                      <rect x="9" y="14" width="5" height="5" fill="#ff4444" stroke="#1E3A5F" strokeWidth="0.5" />
                      <rect x="14" y="14" width="5" height="5" fill="#44ff44" stroke="#1E3A5F" strokeWidth="0.5" />
                    </svg>
                  ) : (
                    // Brownie character with football
                    <div className="relative">
                      <svg className="w-6 h-6 sm:w-8 sm:h-8" viewBox="0 0 28 28">
                        {/* Mini brownie */}
                        <ellipse cx="14" cy="9" rx="6" ry="5" fill="#F5C542" stroke="#1E3A5F" strokeWidth="1" />
                        <circle cx="16" cy="8" r="1" fill="#1E3A5F" />
                        <path d="M12 3 L14 1 L16 3" fill="#1E3A5F" />
                        <rect x="9" y="13" width="10" height="8" fill="#2D9CDB" stroke="#1E3A5F" strokeWidth="1" rx="1" />
                        <rect x="10" y="21" width="3" height="3" fill="#1E3A5F" />
                        <rect x="15" y="21" width="3" height="3" fill="#1E3A5F" />
                        {/* Football */}
                        <circle cx="22" cy="20" r="4" fill="white" stroke="#1E3A5F" strokeWidth="0.8" />
                        <path d="M22 17.5 L24 19 L23 21.5 L21 21.5 L20 19 Z" fill="#1E3A5F" />
                      </svg>
                    </div>
                  )}
                </div>
              </button>
            ))}
          </div>
          
          {/* Instructions */}
          <div className="text-center pb-1">
            <div className="text-slate-700 text-xs font-bold bg-white/30 rounded-full py-1 px-3 inline-block">
              <span className="hidden sm:inline">D-PAD SELECT | START TO PLAY</span>
              <span className="sm:hidden">D-PAD | START</span>
            </div>
          </div>
        </div>
      </GameBoyShell>
      
      {/* Footer instructions */}
      <div className="text-center text-xs text-gb-shell/80 font-mono px-4">
        <p className="hidden sm:block">
          Use <span className="text-yellow-400">UP/DOWN</span> to select |
          <span className="text-yellow-400"> ENTER</span> to start
        </p>
        <p className="sm:hidden text-gb-shell/60">
          D-PAD to navigate | A/START to select
        </p>
      </div>
    </div>
  )
}
