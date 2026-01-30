"use client"

import { useState, useEffect, useCallback, useRef } from "react"
import { useTetris } from "@/hooks/use-tetris"
import { usePlatformer } from "@/hooks/use-platformer"
import { GameBoard } from "./game-board"
import { NextPiece } from "./next-piece"
import { GameStats } from "./game-stats"
import { GameBoyShell } from "./gameboy-shell"

type GameScreen = "menu" | "tetris" | "platformer"

const games = [
  { 
    id: "tetris" as const, 
    title: "TETRIS", 
    subtitle: "Puzzle Game",
    colors: { bg: "from-cyan-500 to-blue-600" }
  },
  { 
    id: "platformer" as const, 
    title: "JUMPING", 
    subtitle: "BROWNIES",
    colors: { bg: "from-orange-500 to-red-600" }
  },
]

// Color palette for platformer
const COLORS = {
  sky: "#4FB0E5",
  skyGradient: "#87CEEB",
  cloud: "#FFFFFF",
  grass: "#2D8A2D",
  grassLight: "#3DA63D",
  grassDark: "#1E6B1E",
  ground: "#8B5A2B",
  groundDark: "#6B4423",
  brick: "#E85D04",
  brickDark: "#C44D00",
  brickLine: "#FF7F2A",
  question: "#FFD700",
  goalWhite: "#FFFFFF",
  goalNet: "rgba(255,255,255,0.3)",
  skinYellow: "#F5C542",
  outline: "#1E3A5F",
  shirtTeal: "#2D9CDB",
  shirtOrange: "#E85D04",
  shirtPurple: "#9B51E0",
  shirtGreen: "#219653",
  shirtRed: "#EB5757",
  footballWhite: "#FFFFFF",
  footballBlack: "#1A1A1A",
  coin: "#FFD700",
  coinShine: "#FFEC8B",
  flag: "#EB5757",
  flagPole: "#808080",
  text: "#FFFFFF",
  textShadow: "#1E3A5F",
}

// Drawing functions for platformer
function drawBrownie(ctx: CanvasRenderingContext2D, x: number, y: number, width: number, height: number, facingRight: boolean, shirtColor: string, isPlayer = false) {
  const headHeight = height * 0.45
  const bodyHeight = height * 0.55
  ctx.fillStyle = "rgba(0,0,0,0.15)"
  ctx.beginPath()
  ctx.ellipse(x + width / 2, y + height, width / 2, 3, 0, 0, Math.PI * 2)
  ctx.fill()
  ctx.fillStyle = shirtColor
  ctx.fillRect(x + 1, y + headHeight - 2, width - 2, bodyHeight + 2)
  ctx.strokeStyle = COLORS.outline
  ctx.lineWidth = 1.5
  ctx.strokeRect(x + 1, y + headHeight - 2, width - 2, bodyHeight + 2)
  ctx.fillStyle = COLORS.outline
  ctx.fillRect(x + 2, y + height - 6, 4, 6)
  ctx.fillRect(x + width - 6, y + height - 6, 4, 6)
  ctx.fillStyle = COLORS.skinYellow
  ctx.beginPath()
  ctx.ellipse(x + width / 2, y + headHeight / 2, width / 2 - 1, headHeight / 2, 0, 0, Math.PI * 2)
  ctx.fill()
  ctx.strokeStyle = COLORS.outline
  ctx.lineWidth = 1.5
  ctx.beginPath()
  ctx.ellipse(x + width / 2, y + headHeight / 2, width / 2 - 1, headHeight / 2, 0, 0, Math.PI * 2)
  ctx.stroke()
  if (isPlayer) {
    ctx.fillStyle = COLORS.outline
    ctx.beginPath()
    ctx.moveTo(x + width / 2 - 2, y + 2)
    ctx.lineTo(x + width / 2, y - 2)
    ctx.lineTo(x + width / 2 + 2, y + 2)
    ctx.fill()
  }
  ctx.fillStyle = COLORS.outline
  ctx.beginPath()
  ctx.arc(x + width / 2 + (facingRight ? 2 : -2), y + headHeight / 2 - 1, 1.5, 0, Math.PI * 2)
  ctx.fill()
  ctx.strokeStyle = COLORS.outline
  ctx.lineWidth = 1
  ctx.beginPath()
  ctx.arc(x + width / 2 + (facingRight ? 1 : -1), y + headHeight / 2 + 2, 2, 0.2, Math.PI - 0.2)
  ctx.stroke()
  ctx.strokeStyle = COLORS.skinYellow
  ctx.lineWidth = 2
  ctx.beginPath()
  ctx.moveTo(x, y + headHeight + 2)
  ctx.lineTo(x - 2, y + headHeight + 8)
  ctx.moveTo(x + width, y + headHeight + 2)
  ctx.lineTo(x + width + 2, y + headHeight + 8)
  ctx.stroke()
}

function drawFelix(ctx: CanvasRenderingContext2D, x: number, y: number, width: number, height: number, facingRight: boolean) {
  const headHeight = height * 0.45
  const bodyHeight = height * 0.55
  ctx.fillStyle = "rgba(0,0,0,0.2)"
  ctx.beginPath()
  ctx.ellipse(x + width / 2, y + height + 2, width / 2 + 4, 4, 0, 0, Math.PI * 2)
  ctx.fill()
  ctx.fillStyle = COLORS.shirtTeal
  ctx.fillRect(x + 2, y + headHeight - 4, width - 4, bodyHeight + 4)
  ctx.strokeStyle = COLORS.outline
  ctx.lineWidth = 2
  ctx.strokeRect(x + 2, y + headHeight - 4, width - 4, bodyHeight + 4)
  ctx.fillStyle = COLORS.outline
  ctx.fillRect(x + 4, y + height - 10, 7, 10)
  ctx.fillRect(x + width - 11, y + height - 10, 7, 10)
  const laptopX = facingRight ? x + width - 4 : x - 12
  const laptopY = y + headHeight + 8
  ctx.fillStyle = "#4FB0E5"
  ctx.fillRect(laptopX, laptopY, 16, 12)
  ctx.strokeStyle = COLORS.outline
  ctx.lineWidth = 1.5
  ctx.strokeRect(laptopX, laptopY, 16, 12)
  ctx.fillStyle = "#FFFFFF"
  ctx.beginPath()
  ctx.arc(laptopX + 8, laptopY + 6, 3, 0, Math.PI * 2)
  ctx.fill()
  ctx.fillStyle = COLORS.skinYellow
  ctx.beginPath()
  ctx.ellipse(x + width / 2, y + headHeight / 2, width / 2 - 2, headHeight / 2 + 2, 0, 0, Math.PI * 2)
  ctx.fill()
  ctx.strokeStyle = COLORS.outline
  ctx.lineWidth = 2
  ctx.beginPath()
  ctx.ellipse(x + width / 2, y + headHeight / 2, width / 2 - 2, headHeight / 2 + 2, 0, 0, Math.PI * 2)
  ctx.stroke()
  ctx.fillStyle = "#E85D04"
  ctx.beginPath()
  ctx.arc(x + width / 2, y - 2, 6, 0, Math.PI * 2)
  ctx.fill()
  ctx.beginPath()
  ctx.arc(x + width / 2 - 3, y + 2, 4, 0, Math.PI * 2)
  ctx.fill()
  ctx.strokeStyle = "#FFFFFF"
  ctx.lineWidth = 2
  const eyeY = y + headHeight / 2 - 2
  ctx.beginPath()
  ctx.rect(x + width / 2 + (facingRight ? -2 : -10), eyeY - 3, 10, 7)
  ctx.stroke()
  ctx.fillStyle = COLORS.outline
  ctx.beginPath()
  ctx.arc(x + width / 2 + (facingRight ? 3 : -5), eyeY + 1, 2, 0, Math.PI * 2)
  ctx.fill()
  const chinY = y + headHeight - 2
  const chinX = x + width / 2
  ctx.strokeStyle = COLORS.outline
  ctx.lineWidth = 1
  for (let i = -3; i <= 3; i++) {
    ctx.beginPath()
    ctx.moveTo(chinX + i * 2, chinY)
    ctx.lineTo(chinX + i * 2, chinY + 3)
    ctx.stroke()
  }
  ctx.strokeStyle = COLORS.skinYellow
  ctx.lineWidth = 4
  if (facingRight) {
    ctx.beginPath()
    ctx.moveTo(x + 2, y + headHeight)
    ctx.lineTo(x - 4, y + headHeight + 14)
    ctx.stroke()
  } else {
    ctx.beginPath()
    ctx.moveTo(x + width - 2, y + headHeight)
    ctx.lineTo(x + width + 4, y + headHeight + 14)
    ctx.stroke()
  }
}

function drawMagda(ctx: CanvasRenderingContext2D, x: number, y: number, width: number, height: number) {
  const headHeight = height * 0.5
  const bodyHeight = height * 0.5
  ctx.fillStyle = "rgba(0,0,0,0.15)"
  ctx.beginPath()
  ctx.ellipse(x + width / 2, y + height + 2, width / 2 + 2, 3, 0, 0, Math.PI * 2)
  ctx.fill()
  ctx.fillStyle = "#5BC0EB"
  ctx.fillRect(x + 2, y + headHeight - 3, width - 4, bodyHeight + 3)
  ctx.strokeStyle = COLORS.outline
  ctx.lineWidth = 1.5
  ctx.strokeRect(x + 2, y + headHeight - 3, width - 4, bodyHeight + 3)
  ctx.fillStyle = "#2D8A6E"
  ctx.fillRect(x + 3, y + height - 7, 6, 7)
  ctx.fillRect(x + width - 9, y + height - 7, 6, 7)
  ctx.fillStyle = COLORS.skinYellow
  ctx.beginPath()
  ctx.ellipse(x + width / 2, y + headHeight / 2, width / 2, headHeight / 2, 0, 0, Math.PI * 2)
  ctx.fill()
  ctx.strokeStyle = COLORS.outline
  ctx.lineWidth = 1.5
  ctx.beginPath()
  ctx.ellipse(x + width / 2, y + headHeight / 2, width / 2, headHeight / 2, 0, 0, Math.PI * 2)
  ctx.stroke()
  ctx.fillStyle = "#E85D04"
  ctx.beginPath()
  ctx.ellipse(x + width / 2, y + 2, width / 2 + 2, 6, 0, Math.PI, Math.PI * 2)
  ctx.fill()
  ctx.beginPath()
  ctx.arc(x - 1, y + 6, 4, 0, Math.PI * 2)
  ctx.fill()
  ctx.beginPath()
  ctx.arc(x + width + 1, y + 6, 4, 0, Math.PI * 2)
  ctx.fill()
  ctx.strokeStyle = COLORS.outline
  ctx.lineWidth = 1.5
  ctx.beginPath()
  ctx.arc(x + width / 2 - 4, y + headHeight / 2 - 1, 2, Math.PI, Math.PI * 2)
  ctx.stroke()
  ctx.beginPath()
  ctx.arc(x + width / 2 + 4, y + headHeight / 2 - 1, 2, Math.PI, Math.PI * 2)
  ctx.stroke()
  ctx.fillStyle = "#FFFFFF"
  ctx.beginPath()
  ctx.arc(x + width / 2, y + headHeight / 2 + 4, 5, 0, Math.PI)
  ctx.fill()
  ctx.strokeStyle = COLORS.outline
  ctx.lineWidth = 1
  ctx.beginPath()
  ctx.arc(x + width / 2, y + headHeight / 2 + 4, 5, 0, Math.PI)
  ctx.stroke()
}

function drawHeart(ctx: CanvasRenderingContext2D, x: number, y: number, size: number, alpha: number) {
  ctx.save()
  ctx.globalAlpha = alpha
  ctx.fillStyle = "#E91E63"
  ctx.beginPath()
  const topCurveHeight = size * 0.3
  ctx.moveTo(x, y + topCurveHeight)
  ctx.bezierCurveTo(x, y, x - size / 2, y, x - size / 2, y + topCurveHeight)
  ctx.bezierCurveTo(x - size / 2, y + size * 0.6, x, y + size * 0.8, x, y + size)
  ctx.bezierCurveTo(x, y + size * 0.8, x + size / 2, y + size * 0.6, x + size / 2, y + topCurveHeight)
  ctx.bezierCurveTo(x + size / 2, y, x, y, x, y + topCurveHeight)
  ctx.fill()
  ctx.restore()
}

function drawFootball(ctx: CanvasRenderingContext2D, x: number, y: number, size: number) {
  const cx = x + size / 2
  const cy = y + size / 2
  const radius = size / 2
  ctx.fillStyle = COLORS.footballWhite
  ctx.beginPath()
  ctx.arc(cx, cy, radius, 0, Math.PI * 2)
  ctx.fill()
  ctx.fillStyle = COLORS.footballBlack
  ctx.beginPath()
  for (let i = 0; i < 5; i++) {
    const angle = (i * 72 - 90) * Math.PI / 180
    const px = cx + Math.cos(angle) * radius * 0.4
    const py = cy + Math.sin(angle) * radius * 0.4
    if (i === 0) ctx.moveTo(px, py)
    else ctx.lineTo(px, py)
  }
  ctx.closePath()
  ctx.fill()
  ctx.strokeStyle = COLORS.outline
  ctx.lineWidth = 1
  ctx.beginPath()
  ctx.arc(cx, cy, radius, 0, Math.PI * 2)
  ctx.stroke()
}

// Main unified game component
export function GameBoyGames() {
  const [currentScreen, setCurrentScreen] = useState<GameScreen>("menu")
  const [menuIndex, setMenuIndex] = useState(0)
  
  // Tetris hook
  const tetris = useTetris()
  
  // Platformer hook
  const platformer = usePlatformer()
  
  const canvasRef = useRef<HTMLCanvasElement>(null)

  // Menu navigation
  const menuMoveUp = useCallback(() => {
    if (currentScreen === "menu") {
      setMenuIndex((prev) => (prev > 0 ? prev - 1 : games.length - 1))
    }
  }, [currentScreen])

  const menuMoveDown = useCallback(() => {
    if (currentScreen === "menu") {
      setMenuIndex((prev) => (prev < games.length - 1 ? prev + 1 : 0))
    }
  }, [currentScreen])

  const selectGame = useCallback(() => {
    if (currentScreen === "menu") {
      setCurrentScreen(games[menuIndex].id)
    }
  }, [currentScreen, menuIndex])

  const backToMenu = useCallback(() => {
    setCurrentScreen("menu")
  }, [])

  // Keyboard controls for menu
  useEffect(() => {
    if (currentScreen !== "menu") return
    
    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.key) {
        case "ArrowUp":
        case "w":
          e.preventDefault()
          menuMoveUp()
          break
        case "ArrowDown":
        case "s":
          e.preventDefault()
          menuMoveDown()
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
  }, [currentScreen, menuMoveUp, menuMoveDown, selectGame])

  // Platformer rendering
  useEffect(() => {
    if (currentScreen !== "platformer") return
    
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    const { player, level, cameraX, score, lives, currentLevel, canvasWidth, canvasHeight, isPoweredUp } = platformer

    // Sky gradient
    const skyGradient = ctx.createLinearGradient(0, 0, 0, canvasHeight)
    skyGradient.addColorStop(0, COLORS.sky)
    skyGradient.addColorStop(1, COLORS.skyGradient)
    ctx.fillStyle = skyGradient
    ctx.fillRect(0, 0, canvasWidth, canvasHeight)

    // Clouds
    ctx.fillStyle = COLORS.cloud
    const cloudOffset = cameraX * 0.3
    for (let i = 0; i < 5; i++) {
      const cloudX = ((i * 120 - cloudOffset) % (canvasWidth + 100)) - 50
      const cloudY = 30 + (i % 3) * 20
      ctx.beginPath()
      ctx.arc(cloudX, cloudY, 12, 0, Math.PI * 2)
      ctx.arc(cloudX + 16, cloudY - 4, 16, 0, Math.PI * 2)
      ctx.arc(cloudX + 32, cloudY, 12, 0, Math.PI * 2)
      ctx.fill()
    }

    ctx.save()
    ctx.translate(-cameraX, 0)

    // Platforms
    for (const platform of level.platforms) {
      if (platform.type === "ground") {
        for (let stripe = 0; stripe < Math.ceil(platform.width / 20); stripe++) {
          ctx.fillStyle = stripe % 2 === 0 ? COLORS.grass : COLORS.grassLight
          ctx.fillRect(platform.x + stripe * 20, platform.y, 20, 8)
        }
        ctx.fillStyle = COLORS.grassDark
        ctx.fillRect(platform.x, platform.y, platform.width, 2)
        ctx.fillStyle = COLORS.ground
        ctx.fillRect(platform.x, platform.y + 8, platform.width, platform.height - 8)
      } else if (platform.type === "brick") {
        ctx.fillStyle = COLORS.brick
        ctx.fillRect(platform.x, platform.y, platform.width, platform.height)
        ctx.strokeStyle = COLORS.brickDark
        ctx.lineWidth = 1
        for (let bx = platform.x; bx < platform.x + platform.width; bx += 10) {
          ctx.beginPath()
          ctx.moveTo(bx, platform.y)
          ctx.lineTo(bx, platform.y + platform.height)
          ctx.stroke()
        }
        ctx.strokeStyle = COLORS.outline
        ctx.strokeRect(platform.x, platform.y, platform.width, platform.height)
      } else if (platform.type === "question") {
        ctx.fillStyle = COLORS.question
        ctx.fillRect(platform.x, platform.y, platform.width, platform.height)
        ctx.strokeStyle = COLORS.outline
        ctx.lineWidth = 1.5
        ctx.strokeRect(platform.x, platform.y, platform.width, platform.height)
        ctx.fillStyle = COLORS.outline
        ctx.font = "bold 9px Arial"
        ctx.textAlign = "center"
        ctx.fillText("?", platform.x + platform.width / 2, platform.y + platform.height - 2)
        ctx.textAlign = "left"
      } else if (platform.type === "goal") {
        ctx.fillStyle = COLORS.goalWhite
        ctx.fillRect(platform.x, platform.y, 4, platform.height)
        ctx.fillRect(platform.x - 15, platform.y, 34, 4)
        ctx.fillRect(platform.x + 15, platform.y, 4, platform.height)
      }
    }

    // Coins and footballs
    for (const coin of level.coins) {
      if (!coin.collected) {
        if (coin.type === "football") {
          drawFootball(ctx, coin.x, coin.y, coin.width)
        } else {
          ctx.fillStyle = COLORS.coin
          ctx.beginPath()
          ctx.arc(coin.x + coin.width / 2, coin.y + coin.height / 2, coin.width / 2, 0, Math.PI * 2)
          ctx.fill()
          ctx.fillStyle = COLORS.coinShine
          ctx.beginPath()
          ctx.arc(coin.x + coin.width / 3, coin.y + coin.height / 3, coin.width / 4, 0, Math.PI * 2)
          ctx.fill()
        }
      }
    }

    // NPCs (Magda)
    const time = Date.now()
    for (const npc of level.npcs) {
      if (npc.type === "magda") {
        drawMagda(ctx, npc.x, npc.y, npc.width, npc.height)
        const bobY = npc.y - 18 + Math.sin(time * 0.01) * 3
        drawHeart(ctx, npc.x + npc.width / 2, bobY, 10, 1)
        for (const heart of npc.hearts) {
          drawHeart(ctx, heart.x, heart.y, 8, heart.alpha)
        }
      }
    }

    // Enemies
    for (const enemy of level.enemies) {
      if (enemy.alive) {
        if (enemy.type === "felix") {
          drawFelix(ctx, enemy.x, enemy.y, enemy.width, enemy.height, enemy.velocityX > 0)
        } else {
          drawBrownie(ctx, enemy.x, enemy.y, enemy.width, enemy.height, enemy.velocityX > 0, enemy.shirtColor, false)
        }
      }
    }

    // Player
    if (isPoweredUp) {
      drawFelix(ctx, player.x, player.y, player.width, player.height, player.facingRight)
    } else {
      drawBrownie(ctx, player.x, player.y, player.width, player.height, player.facingRight, COLORS.shirtTeal, true)
    }

    // Finish flag
    ctx.fillStyle = COLORS.flagPole
    ctx.fillRect(level.finishX, canvasHeight - 100, 4, 80)
    ctx.fillStyle = COLORS.flag
    ctx.beginPath()
    ctx.moveTo(level.finishX + 4, canvasHeight - 100)
    ctx.lineTo(level.finishX + 28, canvasHeight - 88)
    ctx.lineTo(level.finishX + 4, canvasHeight - 76)
    ctx.closePath()
    ctx.fill()
    drawFootball(ctx, level.finishX - 2, canvasHeight - 35, 14)

    ctx.restore()

    // HUD
    ctx.font = "bold 10px Arial"
    ctx.fillStyle = COLORS.text
    ctx.fillText(`SCORE: ${score}`, 4, 12)
    ctx.fillStyle = COLORS.text
    ctx.fillText("x", 4, 25)
    for (let i = 0; i < lives; i++) {
      ctx.fillStyle = COLORS.skinYellow
      ctx.beginPath()
      ctx.arc(20 + i * 14, 22, 5, 0, Math.PI * 2)
      ctx.fill()
      ctx.strokeStyle = COLORS.outline
      ctx.lineWidth = 1
      ctx.stroke()
    }
    ctx.textAlign = "right"
    ctx.fillStyle = COLORS.text
    ctx.fillText(`WORLD ${currentLevel}`, canvasWidth - 4, 12)
    ctx.textAlign = "left"

  }, [currentScreen, platformer])

  // Get current brand text and handlers based on screen
  const getBrandText = () => {
    switch (currentScreen) {
      case "tetris": return "TETRIS GAME"
      case "platformer": return "JUMPING BROWNIES"
      default: return "BRAUNE DIGITAL"
    }
  }

  const getStartHandler = () => {
    switch (currentScreen) {
      case "menu": return selectGame
      case "tetris": return tetris.isPlaying ? tetris.togglePause : tetris.startGame
      case "platformer": return platformer.levelComplete ? platformer.nextLevel : (platformer.isPlaying ? platformer.togglePause : platformer.startGame)
    }
  }

  const getSelectHandler = () => {
    if (currentScreen === "menu") return () => {}
    return backToMenu
  }

  const getLeftHandler = () => {
    switch (currentScreen) {
      case "menu": return () => {}
      case "tetris": return tetris.moveLeft
      case "platformer": return platformer.moveLeft
    }
  }

  const getRightHandler = () => {
    switch (currentScreen) {
      case "menu": return () => {}
      case "tetris": return tetris.moveRight
      case "platformer": return platformer.moveRight
    }
  }

  const getDownHandler = () => {
    switch (currentScreen) {
      case "menu": return menuMoveDown
      case "tetris": return tetris.moveDown
      case "platformer": return () => {}
    }
  }

  const getRotateHandler = () => {
    switch (currentScreen) {
      case "menu": return menuMoveUp
      case "tetris": return tetris.rotatePiece
      case "platformer": return platformer.jump
    }
  }

  const getDropHandler = () => {
    switch (currentScreen) {
      case "menu": return selectGame
      case "tetris": return tetris.hardDrop
      case "platformer": return platformer.jump
    }
  }

  const getIsPlaying = () => {
    switch (currentScreen) {
      case "menu": return false
      case "tetris": return tetris.isPlaying
      case "platformer": return platformer.isPlaying
    }
  }

  const getIsPaused = () => {
    switch (currentScreen) {
      case "menu": return false
      case "tetris": return tetris.isPaused
      case "platformer": return platformer.isPaused
    }
  }

  // Render menu screen
  const renderMenu = () => (
    <div className="bg-gradient-to-b from-sky-500 via-sky-400 to-emerald-400 p-4 sm:p-5 w-full h-full rounded flex flex-col justify-between">
      <div className="text-center pt-1">
        <div className="text-white text-sm sm:text-base font-bold tracking-wide drop-shadow-lg">
          SELECT GAME
        </div>
        <div className="text-xs text-white/80">Braune Digital</div>
      </div>
      
      <div className="space-y-3 flex-1 flex flex-col justify-center py-2">
        {games.map((game, index) => (
          <button
            key={game.id}
            onClick={() => {
              setMenuIndex(index)
              setCurrentScreen(game.id)
            }}
            className={`w-full flex items-center gap-3 p-3 rounded-lg transition-all duration-200 transform
              ${menuIndex === index 
                ? `bg-gradient-to-r ${game.colors.bg} scale-105 shadow-lg shadow-black/30 border-2 border-white/50` 
                : "bg-white/20 hover:bg-white/30 scale-100 border-2 border-transparent"
              }`}
          >
            <span className={`text-yellow-400 text-lg transition-all duration-200 drop-shadow ${menuIndex === index ? "opacity-100" : "opacity-0"}`}>
              {"▶"}
            </span>
            <div className="flex-1 text-left">
              <div className={`text-sm sm:text-base font-bold ${menuIndex === index ? "text-white" : "text-slate-800"}`}>
                {game.title}
              </div>
              <div className={`text-xs ${menuIndex === index ? "text-white/90" : "text-slate-600"}`}>
                {game.subtitle}
              </div>
            </div>
            <div className={`w-10 h-10 sm:w-12 sm:h-12 rounded-lg flex items-center justify-center ${menuIndex === index ? "bg-white/30" : "bg-white/40"}`}>
              {game.id === "tetris" ? (
                <svg className="w-6 h-6 sm:w-8 sm:h-8" viewBox="0 0 24 24">
                  <rect x="4" y="4" width="5" height="5" fill="#00d4ff" stroke="#1E3A5F" strokeWidth="0.5" />
                  <rect x="9" y="4" width="5" height="5" fill="#aa44ff" stroke="#1E3A5F" strokeWidth="0.5" />
                  <rect x="9" y="9" width="5" height="5" fill="#ffdd00" stroke="#1E3A5F" strokeWidth="0.5" />
                  <rect x="9" y="14" width="5" height="5" fill="#ff4444" stroke="#1E3A5F" strokeWidth="0.5" />
                </svg>
              ) : (
                <svg className="w-6 h-6 sm:w-8 sm:h-8" viewBox="0 0 28 28">
                  <ellipse cx="14" cy="9" rx="6" ry="5" fill="#F5C542" stroke="#1E3A5F" strokeWidth="1" />
                  <circle cx="16" cy="8" r="1" fill="#1E3A5F" />
                  <rect x="9" y="13" width="10" height="8" fill="#2D9CDB" stroke="#1E3A5F" strokeWidth="1" rx="1" />
                  <circle cx="22" cy="20" r="4" fill="white" stroke="#1E3A5F" strokeWidth="0.8" />
                </svg>
              )}
            </div>
          </button>
        ))}
      </div>
      
      <div className="text-center pb-1">
        <div className="text-slate-700 text-xs font-bold bg-white/30 rounded-full py-1 px-3 inline-block">
          D-PAD SELECT | START TO PLAY
        </div>
      </div>
    </div>
  )

  // Render tetris screen
  const renderTetris = () => (
    <div className="flex gap-3 sm:gap-4 w-full h-full items-center justify-center bg-gradient-to-b from-slate-800 to-slate-900 rounded relative">
      <div className="relative">
        <GameBoard board={tetris.board} />
        
        {tetris.gameOver && (
          <div className="absolute inset-0 bg-black/85 flex flex-col items-center justify-center gap-3 z-10 rounded">
            <div className="text-red-500 text-sm sm:text-base font-bold animate-pulse">GAME OVER</div>
            <div className="text-yellow-400 text-sm font-bold">Score: {tetris.score}</div>
            <div className="flex gap-2 mt-2">
              <button onClick={tetris.startGame} className="px-4 py-2 bg-cyan-500 text-white text-sm font-bold rounded shadow-[0_4px_0_#0891b2] active:translate-y-0.5">RETRY</button>
              <button onClick={backToMenu} className="px-4 py-2 bg-purple-500 text-white text-sm font-bold rounded shadow-[0_4px_0_#7c3aed] active:translate-y-0.5">MENU</button>
            </div>
          </div>
        )}
        
        {tetris.isPaused && !tetris.gameOver && (
          <div className="absolute inset-0 bg-black/75 flex items-center justify-center z-10 rounded">
            <div className="text-white text-lg font-bold animate-pulse">PAUSED</div>
          </div>
        )}
        
        {!tetris.isPlaying && !tetris.gameOver && (
          <div className="absolute inset-0 bg-gradient-to-b from-indigo-900 to-purple-900 flex flex-col items-center justify-center gap-4 z-10 rounded">
            <div className="text-white text-xl sm:text-2xl font-bold tracking-wider drop-shadow-lg">TETRIS</div>
            <div className="flex gap-1">
              <div className="w-4 h-4 bg-cyan-400 rounded-sm" />
              <div className="w-4 h-4 bg-yellow-400 rounded-sm" />
              <div className="w-4 h-4 bg-purple-400 rounded-sm" />
              <div className="w-4 h-4 bg-red-400 rounded-sm" />
            </div>
            <button onClick={tetris.startGame} className="px-8 py-3 bg-cyan-500 text-white text-lg font-bold rounded-lg shadow-[0_6px_0_#0891b2] active:translate-y-1">START</button>
          </div>
        )}
      </div>
      
      <div className="flex flex-col gap-2 sm:gap-3">
        <NextPiece piece={tetris.nextPiece} />
        <GameStats score={tetris.score} lines={tetris.lines} level={tetris.level} />
      </div>
    </div>
  )

  // Render platformer screen
  const renderPlatformer = () => (
    <div className="relative rounded w-full h-full flex items-center justify-center overflow-hidden">
      <canvas
        ref={canvasRef}
        width={280}
        height={280}
        className="w-[280px] h-[280px] sm:w-[320px] sm:h-[320px]"
        style={{ imageRendering: "pixelated" }}
      />
      
      {platformer.gameOver && (
        <div className="absolute inset-0 bg-gradient-to-b from-slate-900/95 to-slate-800/95 flex flex-col items-center justify-center gap-3 z-10 rounded">
          <div className="text-red-400 text-lg font-bold animate-pulse">GAME OVER</div>
          <div className="text-yellow-400 text-sm font-bold">Score: {platformer.score}</div>
          <div className="flex gap-2 mt-2">
            <button onClick={platformer.startGame} className="px-4 py-2 bg-gradient-to-b from-orange-500 to-orange-600 text-white text-sm font-bold rounded shadow-[0_4px_0_#c2410c] active:translate-y-0.5">RETRY</button>
            <button onClick={backToMenu} className="px-4 py-2 bg-gradient-to-b from-sky-500 to-sky-600 text-white text-sm font-bold rounded shadow-[0_4px_0_#0369a1] active:translate-y-0.5">MENU</button>
          </div>
        </div>
      )}
      
      {platformer.levelComplete && !platformer.gameOver && (
        <div className="absolute inset-0 bg-gradient-to-b from-emerald-900/95 to-emerald-800/95 flex flex-col items-center justify-center gap-3 z-10 rounded">
          <div className="text-yellow-400 text-lg font-bold animate-bounce">GOAL!</div>
          <div className="text-white text-sm font-bold">World {platformer.currentLevel} Complete!</div>
          <button onClick={platformer.nextLevel} className="mt-2 px-6 py-2 bg-gradient-to-b from-green-500 to-green-600 text-white text-sm font-bold rounded shadow-[0_4px_0_#166534] active:translate-y-0.5">NEXT WORLD</button>
        </div>
      )}
      
      {platformer.isPaused && !platformer.gameOver && !platformer.levelComplete && (
        <div className="absolute inset-0 bg-slate-900/80 flex items-center justify-center z-10 rounded">
          <div className="text-white text-xl font-bold animate-pulse">PAUSED</div>
        </div>
      )}
      
      {!platformer.isPlaying && !platformer.gameOver && (
        <div className="absolute inset-0 bg-gradient-to-b from-sky-500 to-emerald-500 flex flex-col items-center justify-center gap-4 z-10 rounded">
          <div className="text-white text-xl font-bold tracking-wide text-center drop-shadow-lg">JUMPING<br/>BROWNIES</div>
          <div className="text-yellow-300 text-xs font-bold drop-shadow">A Football Adventure</div>
          <button onClick={platformer.startGame} className="px-8 py-3 bg-gradient-to-b from-orange-500 to-orange-600 text-white text-lg font-bold rounded-lg shadow-[0_6px_0_#c2410c] active:translate-y-1">KICK OFF</button>
        </div>
      )}
    </div>
  )

  return (
    <div className="flex flex-col items-center gap-6">
      <GameBoyShell
        onStart={getStartHandler()}
        onSelect={getSelectHandler()}
        onLeft={getLeftHandler()}
        onRight={getRightHandler()}
        onDown={getDownHandler()}
        onRotate={getRotateHandler()}
        onDrop={getDropHandler()}
        onLeftDown={currentScreen === "platformer" ? platformer.moveLeft : undefined}
        onLeftUp={currentScreen === "platformer" ? platformer.stopMoveLeft : undefined}
        onRightDown={currentScreen === "platformer" ? platformer.moveRight : undefined}
        onRightUp={currentScreen === "platformer" ? platformer.stopMoveRight : undefined}
        isPlaying={getIsPlaying()}
        isPaused={getIsPaused()}
        brandText={getBrandText()}
      >
        {currentScreen === "menu" && renderMenu()}
        {currentScreen === "tetris" && renderTetris()}
        {currentScreen === "platformer" && renderPlatformer()}
      </GameBoyShell>
      
      <div className="text-center text-xs text-gb-shell/80 font-mono px-4">
        {currentScreen === "menu" ? (
          <p>Use <span className="text-yellow-400">UP/DOWN</span> to select | <span className="text-yellow-400">ENTER</span> to start</p>
        ) : currentScreen === "tetris" ? (
          <p><span className="text-cyan-400">ARROWS</span> Move | <span className="text-cyan-400">UP</span> Rotate | <span className="text-cyan-400">SPACE</span> Drop | <span className="text-cyan-400">SELECT</span> Menu</p>
        ) : (
          <p><span className="text-yellow-400">ARROWS</span> Move | <span className="text-yellow-400">UP/SPACE</span> Jump | <span className="text-yellow-400">SELECT</span> Menu</p>
        )}
      </div>
    </div>
  )
}
