"use client"

import { useEffect, useRef } from "react"
import type { Player, Level } from "@/hooks/use-platformer"

interface PlatformerCanvasProps {
  player: Player
  level: Level
  currentLevel: number
  score: number
  lives: number
  cameraX: number
  gameOver: boolean
  isPaused: boolean
  isPlaying: boolean
  levelComplete: boolean
  isPoweredUp: boolean
  canvasWidth: number
  canvasHeight: number
  startGame: () => void
  nextLevel: () => void
  onBack: () => void
}

// Color palette matching Braune Digital style
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
  footballWhite: "#FFFFFF",
  footballBlack: "#1A1A1A",
  coin: "#FFD700",
  coinShine: "#FFEC8B",
  flag: "#EB5757",
  flagPole: "#808080",
  text: "#FFFFFF",
  textShadow: "#1E3A5F",
}

// Draw a Brownie character
function drawBrownie(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  width: number,
  height: number,
  facingRight: boolean,
  shirtColor: string,
  isPlayer: boolean = false
) {
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
  if (facingRight) {
    ctx.beginPath()
    ctx.arc(x + width / 2 + 2, y + headHeight / 2 - 1, 1.5, 0, Math.PI * 2)
    ctx.fill()
  } else {
    ctx.beginPath()
    ctx.arc(x + width / 2 - 2, y + headHeight / 2 - 1, 1.5, 0, Math.PI * 2)
    ctx.fill()
  }
  
  ctx.strokeStyle = COLORS.outline
  ctx.lineWidth = 1
  ctx.beginPath()
  if (facingRight) {
    ctx.arc(x + width / 2 + 1, y + headHeight / 2 + 2, 2, 0.2, Math.PI - 0.2)
  } else {
    ctx.arc(x + width / 2 - 1, y + headHeight / 2 + 2, 2, 0.2, Math.PI - 0.2)
  }
  ctx.stroke()
  
  ctx.strokeStyle = COLORS.skinYellow
  ctx.lineWidth = 2
  ctx.beginPath()
  ctx.moveTo(x, y + headHeight + 2)
  ctx.lineTo(x - 2, y + headHeight + 8)
  ctx.moveTo(x + width, y + headHeight + 2)
  ctx.lineTo(x + width + 2, y + headHeight + 8)
  ctx.stroke()
  ctx.strokeStyle = COLORS.outline
  ctx.lineWidth = 0.5
  ctx.beginPath()
  ctx.moveTo(x, y + headHeight + 2)
  ctx.lineTo(x - 2, y + headHeight + 8)
  ctx.moveTo(x + width, y + headHeight + 2)
  ctx.lineTo(x + width + 2, y + headHeight + 8)
  ctx.stroke()
}

// Draw Felix Baltruschat
function drawFelix(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  width: number,
  height: number,
  facingRight: boolean
) {
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
  ctx.fillStyle = "#4FB0E5"
  ctx.beginPath()
  ctx.arc(laptopX + 9, laptopY + 4, 1.5, 0, Math.PI * 2)
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
  ctx.strokeStyle = COLORS.outline
  ctx.lineWidth = 1.5
  ctx.beginPath()
  ctx.arc(x + width / 2, y - 2, 6, 0, Math.PI * 2)
  ctx.stroke()
  
  ctx.strokeStyle = "#FFFFFF"
  ctx.lineWidth = 2
  const eyeY = y + headHeight / 2 - 2
  if (facingRight) {
    ctx.beginPath()
    ctx.rect(x + width / 2 - 2, eyeY - 3, 10, 7)
    ctx.stroke()
    ctx.beginPath()
    ctx.moveTo(x + width / 2 - 2, eyeY)
    ctx.lineTo(x + width / 2 - 5, eyeY)
    ctx.stroke()
    ctx.strokeStyle = COLORS.outline
    ctx.lineWidth = 1.5
    ctx.beginPath()
    ctx.moveTo(x + width - 4, eyeY + 2)
    ctx.lineTo(x + width + 2, eyeY + 4)
    ctx.lineTo(x + width - 2, eyeY + 6)
    ctx.stroke()
  } else {
    ctx.beginPath()
    ctx.rect(x + width / 2 - 10, eyeY - 3, 10, 7)
    ctx.stroke()
    ctx.beginPath()
    ctx.moveTo(x + width / 2, eyeY)
    ctx.lineTo(x + width / 2 + 3, eyeY)
    ctx.stroke()
    ctx.strokeStyle = COLORS.outline
    ctx.lineWidth = 1.5
    ctx.beginPath()
    ctx.moveTo(x + 4, eyeY + 2)
    ctx.lineTo(x - 2, eyeY + 4)
    ctx.lineTo(x + 2, eyeY + 6)
    ctx.stroke()
  }
  
  ctx.fillStyle = COLORS.outline
  if (facingRight) {
    ctx.beginPath()
    ctx.arc(x + width / 2 + 3, eyeY + 1, 2, 0, Math.PI * 2)
    ctx.fill()
  } else {
    ctx.beginPath()
    ctx.arc(x + width / 2 - 5, eyeY + 1, 2, 0, Math.PI * 2)
    ctx.fill()
  }
  
  ctx.strokeStyle = COLORS.outline
  ctx.lineWidth = 1
  const chinY = y + headHeight - 2
  const chinX = x + width / 2
  for (let i = -3; i <= 3; i++) {
    ctx.beginPath()
    ctx.moveTo(chinX + i * 2, chinY)
    ctx.lineTo(chinX + i * 2, chinY + 3)
    ctx.stroke()
  }
  ctx.beginPath()
  ctx.moveTo(x + 4, chinY - 4)
  ctx.lineTo(x + 2, chinY - 2)
  ctx.stroke()
  ctx.beginPath()
  ctx.moveTo(x + width - 4, chinY - 4)
  ctx.lineTo(x + width - 2, chinY - 2)
  ctx.stroke()
  
  ctx.strokeStyle = COLORS.outline
  ctx.lineWidth = 1.5
  ctx.beginPath()
  if (facingRight) {
    ctx.arc(chinX + 3, chinY - 5, 4, 0.3, Math.PI - 0.3)
  } else {
    ctx.arc(chinX - 3, chinY - 5, 4, 0.3, Math.PI - 0.3)
  }
  ctx.stroke()
  
  ctx.strokeStyle = COLORS.skinYellow
  ctx.lineWidth = 4
  if (facingRight) {
    ctx.beginPath()
    ctx.moveTo(x + 2, y + headHeight)
    ctx.lineTo(x - 4, y + headHeight + 14)
    ctx.stroke()
    ctx.beginPath()
    ctx.moveTo(x + width - 2, y + headHeight)
    ctx.lineTo(laptopX + 4, laptopY + 10)
    ctx.stroke()
  } else {
    ctx.beginPath()
    ctx.moveTo(x + width - 2, y + headHeight)
    ctx.lineTo(x + width + 4, y + headHeight + 14)
    ctx.stroke()
    ctx.beginPath()
    ctx.moveTo(x + 2, y + headHeight)
    ctx.lineTo(laptopX + 12, laptopY + 10)
    ctx.stroke()
  }
  ctx.strokeStyle = COLORS.outline
  ctx.lineWidth = 1
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

// Draw Magda
function drawMagda(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  width: number,
  height: number
) {
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
  
  ctx.fillStyle = "#FFFFFF"
  ctx.font = "bold 4px Arial"
  ctx.textAlign = "center"
  ctx.fillText("familo", x + width / 2, y + headHeight + 8)
  ctx.textAlign = "left"
  
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
  ctx.beginPath()
  ctx.arc(x + width / 2 - 3, y + 4, 3, 0, Math.PI * 2)
  ctx.fill()
  ctx.beginPath()
  ctx.arc(x + width / 2 + 3, y + 5, 2.5, 0, Math.PI * 2)
  ctx.fill()
  ctx.strokeStyle = COLORS.outline
  ctx.lineWidth = 1
  ctx.beginPath()
  ctx.ellipse(x + width / 2, y + 2, width / 2 + 2, 6, 0, Math.PI, Math.PI * 2)
  ctx.stroke()
  
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
  
  ctx.strokeStyle = COLORS.skinYellow
  ctx.lineWidth = 3
  ctx.beginPath()
  ctx.moveTo(x, y + headHeight)
  ctx.quadraticCurveTo(x - 6, y + headHeight + 6, x + 2, y + height - 4)
  ctx.stroke()
  ctx.beginPath()
  ctx.moveTo(x + width, y + headHeight)
  ctx.quadraticCurveTo(x + width + 6, y + headHeight + 6, x + width - 2, y + height - 4)
  ctx.stroke()
  ctx.strokeStyle = COLORS.outline
  ctx.lineWidth = 1
  ctx.beginPath()
  ctx.moveTo(x, y + headHeight)
  ctx.quadraticCurveTo(x - 6, y + headHeight + 6, x + 2, y + height - 4)
  ctx.stroke()
  ctx.beginPath()
  ctx.moveTo(x + width, y + headHeight)
  ctx.quadraticCurveTo(x + width + 6, y + headHeight + 6, x + width - 2, y + height - 4)
  ctx.stroke()
}

// Draw a heart
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
  ctx.strokeStyle = "#AD1457"
  ctx.lineWidth = 1
  ctx.stroke()
  ctx.fillStyle = "rgba(255,255,255,0.4)"
  ctx.beginPath()
  ctx.arc(x - size * 0.2, y + size * 0.3, size * 0.15, 0, Math.PI * 2)
  ctx.fill()
  ctx.restore()
}

// Draw floating heart
function drawFloatingHeart(ctx: CanvasRenderingContext2D, x: number, y: number, time: number) {
  const bobY = y + Math.sin(time * 0.1) * 3
  drawHeart(ctx, x, bobY, 10, 1)
}

// Draw a football
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

export function PlatformerCanvas({
  player,
  level,
  currentLevel,
  score,
  lives,
  cameraX,
  gameOver,
  isPaused,
  isPlaying,
  levelComplete,
  isPoweredUp,
  canvasWidth,
  canvasHeight,
  startGame,
  nextLevel,
  onBack,
}: PlatformerCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  // Render game
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Draw sky gradient
    const skyGradient = ctx.createLinearGradient(0, 0, 0, canvasHeight)
    skyGradient.addColorStop(0, COLORS.sky)
    skyGradient.addColorStop(1, COLORS.skyGradient)
    ctx.fillStyle = skyGradient
    ctx.fillRect(0, 0, canvasWidth, canvasHeight)

    // Draw clouds
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

    // Draw platforms
    for (const platform of level.platforms) {
      if (platform.type === "ground") {
        for (let stripe = 0; stripe < Math.ceil(platform.width / 20); stripe++) {
          const stripeX = platform.x + stripe * 20
          ctx.fillStyle = stripe % 2 === 0 ? COLORS.grass : COLORS.grassLight
          ctx.fillRect(stripeX, platform.y, 20, 8)
        }
        ctx.fillStyle = COLORS.grassDark
        ctx.fillRect(platform.x, platform.y, platform.width, 2)
        ctx.fillStyle = COLORS.ground
        ctx.fillRect(platform.x, platform.y + 8, platform.width, platform.height - 8)
        ctx.fillStyle = COLORS.groundDark
        for (let tx = platform.x; tx < platform.x + platform.width; tx += 16) {
          for (let ty = platform.y + 12; ty < platform.y + platform.height; ty += 12) {
            ctx.fillRect(tx + (ty % 24 === 12 ? 0 : 8), ty, 5, 5)
          }
        }
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
        ctx.beginPath()
        ctx.moveTo(platform.x, platform.y + platform.height / 2)
        ctx.lineTo(platform.x + platform.width, platform.y + platform.height / 2)
        ctx.stroke()
        ctx.fillStyle = COLORS.brickLine
        ctx.fillRect(platform.x, platform.y, platform.width, 2)
        ctx.strokeStyle = COLORS.outline
        ctx.lineWidth = 1
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
        ctx.fillStyle = "rgba(255,255,255,0.5)"
        ctx.fillRect(platform.x + 2, platform.y + 2, 3, 3)
      } else if (platform.type === "goal") {
        const postWidth = 4
        const crossbarHeight = 4
        ctx.fillStyle = COLORS.goalWhite
        ctx.fillRect(platform.x, platform.y, postWidth, platform.height)
        ctx.fillRect(platform.x - 15, platform.y, 34, crossbarHeight)
        ctx.fillRect(platform.x + 15, platform.y, postWidth, platform.height)
        ctx.strokeStyle = COLORS.goalNet
        ctx.lineWidth = 0.5
        for (let netX = platform.x - 12; netX < platform.x + 18; netX += 4) {
          ctx.beginPath()
          ctx.moveTo(netX, platform.y + crossbarHeight)
          ctx.lineTo(netX, platform.y + platform.height)
          ctx.stroke()
        }
        ctx.strokeStyle = COLORS.outline
        ctx.lineWidth = 1
        ctx.strokeRect(platform.x, platform.y, postWidth, platform.height)
        ctx.strokeRect(platform.x + 15, platform.y, postWidth, platform.height)
      }
    }

    // Draw coins and footballs
    for (const coin of level.coins) {
      if (!coin.collected) {
        if (coin.type === "football") {
          drawFootball(ctx, coin.x, coin.y, coin.width)
        } else {
          ctx.fillStyle = "rgba(255, 215, 0, 0.3)"
          ctx.beginPath()
          ctx.arc(coin.x + coin.width / 2, coin.y + coin.height / 2, coin.width, 0, Math.PI * 2)
          ctx.fill()
          ctx.fillStyle = COLORS.coin
          ctx.beginPath()
          ctx.arc(coin.x + coin.width / 2, coin.y + coin.height / 2, coin.width / 2, 0, Math.PI * 2)
          ctx.fill()
          ctx.fillStyle = COLORS.coinShine
          ctx.beginPath()
          ctx.arc(coin.x + coin.width / 3, coin.y + coin.height / 3, coin.width / 4, 0, Math.PI * 2)
          ctx.fill()
          ctx.strokeStyle = COLORS.outline
          ctx.lineWidth = 0.5
          ctx.beginPath()
          ctx.arc(coin.x + coin.width / 2, coin.y + coin.height / 2, coin.width / 2, 0, Math.PI * 2)
          ctx.stroke()
        }
      }
    }

    // Draw NPCs
    const time = Date.now()
    for (const npc of level.npcs) {
      if (npc.type === "magda") {
        drawMagda(ctx, npc.x, npc.y, npc.width, npc.height)
        drawFloatingHeart(ctx, npc.x + npc.width / 2, npc.y - 18, time)
        for (const heart of npc.hearts) {
          drawHeart(ctx, heart.x, heart.y, 8, heart.alpha)
        }
      }
    }

    // Draw enemies
    for (const enemy of level.enemies) {
      if (enemy.alive) {
        if (enemy.type === "felix") {
          drawFelix(ctx, enemy.x, enemy.y, enemy.width, enemy.height, enemy.velocityX > 0)
        } else {
          drawBrownie(ctx, enemy.x, enemy.y, enemy.width, enemy.height, enemy.velocityX > 0, enemy.shirtColor, false)
        }
      }
    }

    // Draw player
    if (isPoweredUp) {
      drawFelix(ctx, player.x, player.y, player.width, player.height, player.facingRight)
    } else {
      drawBrownie(ctx, player.x, player.y, player.width, player.height, player.facingRight, COLORS.shirtTeal, true)
    }

    // Draw finish
    ctx.fillStyle = COLORS.flagPole
    ctx.fillRect(level.finishX, canvasHeight - 100, 4, 80)
    ctx.fillStyle = COLORS.flag
    ctx.beginPath()
    ctx.moveTo(level.finishX + 4, canvasHeight - 100)
    ctx.lineTo(level.finishX + 28, canvasHeight - 88)
    ctx.lineTo(level.finishX + 4, canvasHeight - 76)
    ctx.closePath()
    ctx.fill()
    ctx.strokeStyle = COLORS.outline
    ctx.lineWidth = 1
    ctx.stroke()
    ctx.fillStyle = COLORS.coin
    ctx.beginPath()
    ctx.arc(level.finishX + 16, canvasHeight - 88, 4, 0, Math.PI * 2)
    ctx.fill()
    ctx.fillStyle = COLORS.grass
    ctx.fillRect(level.finishX - 6, canvasHeight - 20, 16, 10)
    drawFootball(ctx, level.finishX - 2, canvasHeight - 35, 14)

    ctx.restore()

    // Draw HUD
    ctx.font = "bold 10px Arial"
    ctx.fillStyle = COLORS.textShadow
    ctx.fillText("SCORE:", 5, 13)
    ctx.fillStyle = COLORS.text
    ctx.fillText("SCORE:", 4, 12)
    ctx.fillStyle = COLORS.coin
    ctx.fillText(`${score}`, 50, 12)
    
    ctx.fillStyle = COLORS.textShadow
    ctx.fillText("x", 5, 26)
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
    
    ctx.fillStyle = COLORS.textShadow
    ctx.textAlign = "right"
    ctx.fillText(`WORLD ${currentLevel}`, canvasWidth - 3, 13)
    ctx.fillStyle = COLORS.text
    ctx.fillText(`WORLD ${currentLevel}`, canvasWidth - 4, 12)
    ctx.textAlign = "left"

  }, [player, level, cameraX, score, lives, currentLevel, canvasWidth, canvasHeight, isPoweredUp])

  return (
    <div className="relative rounded w-full h-full flex items-center justify-center overflow-hidden">
      <canvas
        ref={canvasRef}
        width={280}
        height={280}
        className="w-[280px] h-[280px] sm:w-[320px] sm:h-[320px]"
        style={{ imageRendering: "pixelated" }}
      />
      
      {gameOver && (
        <div className="absolute inset-0 bg-gradient-to-b from-slate-900/95 to-slate-800/95 flex flex-col items-center justify-center gap-3 z-10 rounded">
          <div className="text-red-400 text-lg font-bold animate-pulse">
            GAME OVER
          </div>
          <div className="text-yellow-400 text-sm font-bold">
            Score: {score}
          </div>
          <div className="flex gap-2 mt-2">
            <button
              onClick={startGame}
              className="px-4 py-2 bg-gradient-to-b from-orange-500 to-orange-600 text-white text-sm font-bold rounded
                hover:from-orange-400 hover:to-orange-500 transition-all
                shadow-[0_4px_0_#c2410c] active:shadow-[0_2px_0_#c2410c] active:translate-y-0.5
                border border-orange-400"
            >
              RETRY
            </button>
            <button
              onClick={onBack}
              className="px-4 py-2 bg-gradient-to-b from-sky-500 to-sky-600 text-white text-sm font-bold rounded
                hover:from-sky-400 hover:to-sky-500 transition-all
                shadow-[0_4px_0_#0369a1] active:shadow-[0_2px_0_#0369a1] active:translate-y-0.5
                border border-sky-400"
            >
              MENU
            </button>
          </div>
        </div>
      )}
      
      {levelComplete && !gameOver && (
        <div className="absolute inset-0 bg-gradient-to-b from-emerald-900/95 to-emerald-800/95 flex flex-col items-center justify-center gap-3 z-10 rounded">
          <div className="text-yellow-400 text-lg font-bold animate-bounce">
            GOAL!
          </div>
          <div className="text-white text-sm font-bold">
            World {currentLevel} Complete!
          </div>
          <div className="text-emerald-300 text-xs">
            Score: {score}
          </div>
          <button
            onClick={nextLevel}
            className="mt-2 px-6 py-2 bg-gradient-to-b from-green-500 to-green-600 text-white text-sm font-bold rounded
              hover:from-green-400 hover:to-green-500 transition-all
              shadow-[0_4px_0_#166534] active:shadow-[0_2px_0_#166534] active:translate-y-0.5
              border border-green-400"
          >
            NEXT WORLD
          </button>
        </div>
      )}
      
      {isPaused && !gameOver && !levelComplete && (
        <div className="absolute inset-0 bg-slate-900/80 flex items-center justify-center z-10 rounded">
          <div className="text-white text-xl font-bold animate-pulse">
            PAUSED
          </div>
        </div>
      )}
      
      {!isPlaying && !gameOver && (
        <div className="absolute inset-0 bg-gradient-to-b from-sky-500 to-emerald-500 flex flex-col items-center justify-center gap-4 z-10 rounded">
          <div className="text-white text-xl font-bold tracking-wide text-center drop-shadow-lg">
            JUMPING<br/>BROWNIES
          </div>
          <div className="text-yellow-300 text-xs font-bold drop-shadow">
            A Football Adventure
          </div>
          <div className="flex gap-2 my-2">
            <div className="w-6 h-6 rounded-full bg-white flex items-center justify-center">
              <div className="w-2 h-2 rounded-sm bg-slate-800" />
            </div>
            <div className="w-6 h-6 rounded-full bg-white flex items-center justify-center">
              <div className="w-2 h-2 rounded-sm bg-slate-800" />
            </div>
          </div>
          <button
            onClick={startGame}
            className="px-8 py-3 bg-gradient-to-b from-orange-500 to-orange-600 text-white text-lg font-bold rounded-lg
              hover:from-orange-400 hover:to-orange-500 transition-all
              shadow-[0_6px_0_#c2410c] active:shadow-[0_2px_0_#c2410c] active:translate-y-1
              border-2 border-orange-400"
          >
            KICK OFF
          </button>
        </div>
      )}
    </div>
  )
}
