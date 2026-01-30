"use client"

import { useEffect, useRef } from "react"
import { usePlatformer } from "../hooks/use-platformer"
import { GameBoyShell } from "./gameboy-shell"

interface PlatformerGameProps {
  onBack: () => void
}

// Color palette matching Braune Digital style
const COLORS = {
  // Sky/Background
  sky: "#4FB0E5",
  skyGradient: "#87CEEB",
  cloud: "#FFFFFF",
  
  // Stadium grass
  grass: "#2D8A2D",
  grassLight: "#3DA63D",
  grassDark: "#1E6B1E",
  ground: "#8B5A2B",
  groundDark: "#6B4423",
  
  // Platforms
  brick: "#E85D04",
  brickDark: "#C44D00",
  brickLine: "#FF7F2A",
  question: "#FFD700",
  questionDark: "#DAA520",
  
  // Goal post
  goalWhite: "#FFFFFF",
  goalPost: "#DDDDDD",
  goalNet: "rgba(255,255,255,0.3)",
  
  // Brownie character colors (from reference)
  skinYellow: "#F5C542",
  skinYellowDark: "#D4A73A",
  outline: "#1E3A5F",
  
  // Shirt colors from reference
  shirtTeal: "#2D9CDB",
  shirtOrange: "#E85D04",
  shirtPurple: "#9B51E0",
  shirtGreen: "#219653",
  shirtRed: "#EB5757",
  
  // Football
  footballWhite: "#FFFFFF",
  footballBlack: "#1A1A1A",
  
  // Coin
  coin: "#FFD700",
  coinShine: "#FFEC8B",
  
  // Flag/finish
  flag: "#EB5757",
  flagPole: "#808080",
  
  // UI
  text: "#FFFFFF",
  textShadow: "#1E3A5F",
}

// Draw a Brownie character (Braune Digital style)
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
  
  // Shadow
  ctx.fillStyle = "rgba(0,0,0,0.15)"
  ctx.beginPath()
  ctx.ellipse(x + width / 2, y + height, width / 2, 3, 0, 0, Math.PI * 2)
  ctx.fill()
  
  // Body (shirt)
  ctx.fillStyle = shirtColor
  ctx.fillRect(x + 1, y + headHeight - 2, width - 2, bodyHeight + 2)
  
  // Dark blue outline for body
  ctx.strokeStyle = COLORS.outline
  ctx.lineWidth = 1.5
  ctx.strokeRect(x + 1, y + headHeight - 2, width - 2, bodyHeight + 2)
  
  // Legs (dark blue pants - typical Braune style)
  ctx.fillStyle = COLORS.outline
  ctx.fillRect(x + 2, y + height - 6, 4, 6)
  ctx.fillRect(x + width - 6, y + height - 6, 4, 6)
  
  // Head (yellow oval - Braune style)
  ctx.fillStyle = COLORS.skinYellow
  ctx.beginPath()
  ctx.ellipse(x + width / 2, y + headHeight / 2, width / 2 - 1, headHeight / 2, 0, 0, Math.PI * 2)
  ctx.fill()
  
  // Head outline
  ctx.strokeStyle = COLORS.outline
  ctx.lineWidth = 1.5
  ctx.beginPath()
  ctx.ellipse(x + width / 2, y + headHeight / 2, width / 2 - 1, headHeight / 2, 0, 0, Math.PI * 2)
  ctx.stroke()
  
  // Hair (simple tuft on top - varies by character)
  if (isPlayer) {
    // Player has a small hair tuft
    ctx.fillStyle = COLORS.outline
    ctx.beginPath()
    ctx.moveTo(x + width / 2 - 2, y + 2)
    ctx.lineTo(x + width / 2, y - 2)
    ctx.lineTo(x + width / 2 + 2, y + 2)
    ctx.fill()
  }
  
  // Eyes (simple dots - Braune style)
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
  
  // Smile (simple curved line)
  ctx.strokeStyle = COLORS.outline
  ctx.lineWidth = 1
  ctx.beginPath()
  if (facingRight) {
    ctx.arc(x + width / 2 + 1, y + headHeight / 2 + 2, 2, 0.2, Math.PI - 0.2)
  } else {
    ctx.arc(x + width / 2 - 1, y + headHeight / 2 + 2, 2, 0.2, Math.PI - 0.2)
  }
  ctx.stroke()
  
  // Arms (simple lines)
  ctx.strokeStyle = COLORS.skinYellow
  ctx.lineWidth = 2
  ctx.beginPath()
  ctx.moveTo(x, y + headHeight + 2)
  ctx.lineTo(x - 2, y + headHeight + 8)
  ctx.moveTo(x + width, y + headHeight + 2)
  ctx.lineTo(x + width + 2, y + headHeight + 8)
  ctx.stroke()
  
  // Arm outlines
  ctx.strokeStyle = COLORS.outline
  ctx.lineWidth = 0.5
  ctx.beginPath()
  ctx.moveTo(x, y + headHeight + 2)
  ctx.lineTo(x - 2, y + headHeight + 8)
  ctx.moveTo(x + width, y + headHeight + 2)
  ctx.lineTo(x + width + 2, y + headHeight + 8)
  ctx.stroke()
}

// Draw Felix Baltruschat (special big boss character)
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
  
  // Shadow
  ctx.fillStyle = "rgba(0,0,0,0.2)"
  ctx.beginPath()
  ctx.ellipse(x + width / 2, y + height + 2, width / 2 + 4, 4, 0, 0, Math.PI * 2)
  ctx.fill()
  
  // Body (teal shirt - Felix's signature)
  ctx.fillStyle = COLORS.shirtTeal
  ctx.fillRect(x + 2, y + headHeight - 4, width - 4, bodyHeight + 4)
  
  // Shirt outline
  ctx.strokeStyle = COLORS.outline
  ctx.lineWidth = 2
  ctx.strokeRect(x + 2, y + headHeight - 4, width - 4, bodyHeight + 4)
  
  // Legs (dark blue pants)
  ctx.fillStyle = COLORS.outline
  ctx.fillRect(x + 4, y + height - 10, 7, 10)
  ctx.fillRect(x + width - 11, y + height - 10, 7, 10)
  
  // MacBook under arm (cyan/blue laptop)
  const laptopX = facingRight ? x + width - 4 : x - 12
  const laptopY = y + headHeight + 8
  ctx.fillStyle = "#4FB0E5"
  ctx.fillRect(laptopX, laptopY, 16, 12)
  ctx.strokeStyle = COLORS.outline
  ctx.lineWidth = 1.5
  ctx.strokeRect(laptopX, laptopY, 16, 12)
  // Apple logo (simplified)
  ctx.fillStyle = "#FFFFFF"
  ctx.beginPath()
  ctx.arc(laptopX + 8, laptopY + 6, 3, 0, Math.PI * 2)
  ctx.fill()
  ctx.fillStyle = "#4FB0E5"
  ctx.beginPath()
  ctx.arc(laptopX + 9, laptopY + 4, 1.5, 0, Math.PI * 2)
  ctx.fill()
  
  // Head (yellow oval - bigger, more elongated like Felix)
  ctx.fillStyle = COLORS.skinYellow
  ctx.beginPath()
  ctx.ellipse(x + width / 2, y + headHeight / 2, width / 2 - 2, headHeight / 2 + 2, 0, 0, Math.PI * 2)
  ctx.fill()
  
  // Head outline
  ctx.strokeStyle = COLORS.outline
  ctx.lineWidth = 2
  ctx.beginPath()
  ctx.ellipse(x + width / 2, y + headHeight / 2, width / 2 - 2, headHeight / 2 + 2, 0, 0, Math.PI * 2)
  ctx.stroke()
  
  // Red/orange man bun hair
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
  
  // Glasses (white frames)
  ctx.strokeStyle = "#FFFFFF"
  ctx.lineWidth = 2
  const eyeY = y + headHeight / 2 - 2
  if (facingRight) {
    // Right facing - glasses on right side
    ctx.beginPath()
    ctx.rect(x + width / 2 - 2, eyeY - 3, 10, 7)
    ctx.stroke()
    // Nose bridge
    ctx.beginPath()
    ctx.moveTo(x + width / 2 - 2, eyeY)
    ctx.lineTo(x + width / 2 - 5, eyeY)
    ctx.stroke()
    // Pointed nose
    ctx.strokeStyle = COLORS.outline
    ctx.lineWidth = 1.5
    ctx.beginPath()
    ctx.moveTo(x + width - 4, eyeY + 2)
    ctx.lineTo(x + width + 2, eyeY + 4)
    ctx.lineTo(x + width - 2, eyeY + 6)
    ctx.stroke()
  } else {
    // Left facing
    ctx.beginPath()
    ctx.rect(x + width / 2 - 10, eyeY - 3, 10, 7)
    ctx.stroke()
    // Nose bridge
    ctx.beginPath()
    ctx.moveTo(x + width / 2, eyeY)
    ctx.lineTo(x + width / 2 + 3, eyeY)
    ctx.stroke()
    // Pointed nose
    ctx.strokeStyle = COLORS.outline
    ctx.lineWidth = 1.5
    ctx.beginPath()
    ctx.moveTo(x + 4, eyeY + 2)
    ctx.lineTo(x - 2, eyeY + 4)
    ctx.lineTo(x + 2, eyeY + 6)
    ctx.stroke()
  }
  
  // Eye inside glasses (dot)
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
  
  // Beard/stubble (short lines around chin like in reference)
  ctx.strokeStyle = COLORS.outline
  ctx.lineWidth = 1
  const chinY = y + headHeight - 2
  const chinX = x + width / 2
  // Stubble lines
  for (let i = -3; i <= 3; i++) {
    ctx.beginPath()
    ctx.moveTo(chinX + i * 2, chinY)
    ctx.lineTo(chinX + i * 2, chinY + 3)
    ctx.stroke()
  }
  // Side stubble
  ctx.beginPath()
  ctx.moveTo(x + 4, chinY - 4)
  ctx.lineTo(x + 2, chinY - 2)
  ctx.stroke()
  ctx.beginPath()
  ctx.moveTo(x + width - 4, chinY - 4)
  ctx.lineTo(x + width - 2, chinY - 2)
  ctx.stroke()
  
  // Smile
  ctx.strokeStyle = COLORS.outline
  ctx.lineWidth = 1.5
  ctx.beginPath()
  if (facingRight) {
    ctx.arc(chinX + 3, chinY - 5, 4, 0.3, Math.PI - 0.3)
  } else {
    ctx.arc(chinX - 3, chinY - 5, 4, 0.3, Math.PI - 0.3)
  }
  ctx.stroke()
  
  // Arms (yellow, one holding laptop)
  ctx.strokeStyle = COLORS.skinYellow
  ctx.lineWidth = 4
  if (facingRight) {
    // Left arm normal
    ctx.beginPath()
    ctx.moveTo(x + 2, y + headHeight)
    ctx.lineTo(x - 4, y + headHeight + 14)
    ctx.stroke()
    // Right arm holding laptop
    ctx.beginPath()
    ctx.moveTo(x + width - 2, y + headHeight)
    ctx.lineTo(laptopX + 4, laptopY + 10)
    ctx.stroke()
  } else {
    // Right arm normal
    ctx.beginPath()
    ctx.moveTo(x + width - 2, y + headHeight)
    ctx.lineTo(x + width + 4, y + headHeight + 14)
    ctx.stroke()
    // Left arm holding laptop
    ctx.beginPath()
    ctx.moveTo(x + 2, y + headHeight)
    ctx.lineTo(laptopX + 12, laptopY + 10)
    ctx.stroke()
  }
  
  // Arm outlines
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

// Draw Magda (friendly NPC with orange wavy hair, light blue familo shirt, big smile)
function drawMagda(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  width: number,
  height: number
) {
  const headHeight = height * 0.5
  const bodyHeight = height * 0.5
  
  // Shadow
  ctx.fillStyle = "rgba(0,0,0,0.15)"
  ctx.beginPath()
  ctx.ellipse(x + width / 2, y + height + 2, width / 2 + 2, 3, 0, 0, Math.PI * 2)
  ctx.fill()
  
  // Body (light blue familo shirt)
  ctx.fillStyle = "#5BC0EB"
  ctx.fillRect(x + 2, y + headHeight - 3, width - 4, bodyHeight + 3)
  
  // Shirt outline
  ctx.strokeStyle = COLORS.outline
  ctx.lineWidth = 1.5
  ctx.strokeRect(x + 2, y + headHeight - 3, width - 4, bodyHeight + 3)
  
  // "familo" text on shirt (simplified)
  ctx.fillStyle = "#FFFFFF"
  ctx.font = "bold 4px Arial"
  ctx.textAlign = "center"
  ctx.fillText("familo", x + width / 2, y + headHeight + 8)
  ctx.textAlign = "left"
  
  // Teal/green pants
  ctx.fillStyle = "#2D8A6E"
  ctx.fillRect(x + 3, y + height - 7, 6, 7)
  ctx.fillRect(x + width - 9, y + height - 7, 6, 7)
  
  // Head (yellow oval)
  ctx.fillStyle = COLORS.skinYellow
  ctx.beginPath()
  ctx.ellipse(x + width / 2, y + headHeight / 2, width / 2, headHeight / 2, 0, 0, Math.PI * 2)
  ctx.fill()
  
  // Head outline
  ctx.strokeStyle = COLORS.outline
  ctx.lineWidth = 1.5
  ctx.beginPath()
  ctx.ellipse(x + width / 2, y + headHeight / 2, width / 2, headHeight / 2, 0, 0, Math.PI * 2)
  ctx.stroke()
  
  // Orange wavy hair
  ctx.fillStyle = "#E85D04"
  // Main hair mass
  ctx.beginPath()
  ctx.ellipse(x + width / 2, y + 2, width / 2 + 2, 6, 0, Math.PI, Math.PI * 2)
  ctx.fill()
  // Side waves
  ctx.beginPath()
  ctx.arc(x - 1, y + 6, 4, 0, Math.PI * 2)
  ctx.fill()
  ctx.beginPath()
  ctx.arc(x + width + 1, y + 6, 4, 0, Math.PI * 2)
  ctx.fill()
  // Hair wave on forehead
  ctx.beginPath()
  ctx.arc(x + width / 2 - 3, y + 4, 3, 0, Math.PI * 2)
  ctx.fill()
  ctx.beginPath()
  ctx.arc(x + width / 2 + 3, y + 5, 2.5, 0, Math.PI * 2)
  ctx.fill()
  // Hair outline
  ctx.strokeStyle = COLORS.outline
  ctx.lineWidth = 1
  ctx.beginPath()
  ctx.ellipse(x + width / 2, y + 2, width / 2 + 2, 6, 0, Math.PI, Math.PI * 2)
  ctx.stroke()
  
  // Eyes (happy curved lines - like closed happy eyes)
  ctx.strokeStyle = COLORS.outline
  ctx.lineWidth = 1.5
  // Left eye
  ctx.beginPath()
  ctx.arc(x + width / 2 - 4, y + headHeight / 2 - 1, 2, Math.PI, Math.PI * 2)
  ctx.stroke()
  // Right eye
  ctx.beginPath()
  ctx.arc(x + width / 2 + 4, y + headHeight / 2 - 1, 2, Math.PI, Math.PI * 2)
  ctx.stroke()
  
  // Big warm smile (showing teeth like in reference)
  ctx.fillStyle = "#FFFFFF"
  ctx.beginPath()
  ctx.arc(x + width / 2, y + headHeight / 2 + 4, 5, 0, Math.PI)
  ctx.fill()
  ctx.strokeStyle = COLORS.outline
  ctx.lineWidth = 1
  ctx.beginPath()
  ctx.arc(x + width / 2, y + headHeight / 2 + 4, 5, 0, Math.PI)
  ctx.stroke()
  
  // Arms on hips (like in reference pose)
  ctx.strokeStyle = COLORS.skinYellow
  ctx.lineWidth = 3
  // Left arm on hip
  ctx.beginPath()
  ctx.moveTo(x, y + headHeight)
  ctx.quadraticCurveTo(x - 6, y + headHeight + 6, x + 2, y + height - 4)
  ctx.stroke()
  // Right arm on hip
  ctx.beginPath()
  ctx.moveTo(x + width, y + headHeight)
  ctx.quadraticCurveTo(x + width + 6, y + headHeight + 6, x + width - 2, y + height - 4)
  ctx.stroke()
  // Arm outlines
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
  // Left curve
  ctx.bezierCurveTo(x, y, x - size / 2, y, x - size / 2, y + topCurveHeight)
  ctx.bezierCurveTo(x - size / 2, y + size * 0.6, x, y + size * 0.8, x, y + size)
  // Right curve
  ctx.bezierCurveTo(x, y + size * 0.8, x + size / 2, y + size * 0.6, x + size / 2, y + topCurveHeight)
  ctx.bezierCurveTo(x + size / 2, y, x, y, x, y + topCurveHeight)
  ctx.fill()
  // Outline
  ctx.strokeStyle = "#AD1457"
  ctx.lineWidth = 1
  ctx.stroke()
  // Shine
  ctx.fillStyle = "rgba(255,255,255,0.4)"
  ctx.beginPath()
  ctx.arc(x - size * 0.2, y + size * 0.3, size * 0.15, 0, Math.PI * 2)
  ctx.fill()
  ctx.restore()
}

// Draw floating heart above Magda
function drawFloatingHeart(ctx: CanvasRenderingContext2D, x: number, y: number, time: number) {
  const bobY = y + Math.sin(time * 0.1) * 3
  drawHeart(ctx, x, bobY, 10, 1)
}

// Draw a football (soccer ball)
function drawFootball(ctx: CanvasRenderingContext2D, x: number, y: number, size: number) {
  const cx = x + size / 2
  const cy = y + size / 2
  const radius = size / 2
  
  // White base
  ctx.fillStyle = COLORS.footballWhite
  ctx.beginPath()
  ctx.arc(cx, cy, radius, 0, Math.PI * 2)
  ctx.fill()
  
  // Black pentagon pattern
  ctx.fillStyle = COLORS.footballBlack
  // Center pentagon
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
  
  // Outline
  ctx.strokeStyle = COLORS.outline
  ctx.lineWidth = 1
  ctx.beginPath()
  ctx.arc(cx, cy, radius, 0, Math.PI * 2)
  ctx.stroke()
}

export function PlatformerGame({ onBack }: PlatformerGameProps) {
  const {
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
    togglePause,
    jump,
    moveLeft,
    moveRight,
    stopMoveLeft,
    stopMoveRight,
  } = usePlatformer()

  const canvasRef = useRef<HTMLCanvasElement>(null)

  // Render game
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Draw sky gradient (stadium sky)
    const skyGradient = ctx.createLinearGradient(0, 0, 0, canvasHeight)
    skyGradient.addColorStop(0, COLORS.sky)
    skyGradient.addColorStop(1, COLORS.skyGradient)
    ctx.fillStyle = skyGradient
    ctx.fillRect(0, 0, canvasWidth, canvasHeight)

    // Draw clouds (parallax)
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
        // Stadium grass stripes
        for (let stripe = 0; stripe < Math.ceil(platform.width / 20); stripe++) {
          const stripeX = platform.x + stripe * 20
          ctx.fillStyle = stripe % 2 === 0 ? COLORS.grass : COLORS.grassLight
          ctx.fillRect(stripeX, platform.y, 20, 8)
        }
        // Grass top line
        ctx.fillStyle = COLORS.grassDark
        ctx.fillRect(platform.x, platform.y, platform.width, 2)
        // Dirt below grass
        ctx.fillStyle = COLORS.ground
        ctx.fillRect(platform.x, platform.y + 8, platform.width, platform.height - 8)
        // Dirt texture
        ctx.fillStyle = COLORS.groundDark
        for (let tx = platform.x; tx < platform.x + platform.width; tx += 16) {
          for (let ty = platform.y + 12; ty < platform.y + platform.height; ty += 12) {
            ctx.fillRect(tx + (ty % 24 === 12 ? 0 : 8), ty, 5, 5)
          }
        }
      } else if (platform.type === "brick") {
        // Orange brick (Braune Digital orange)
        ctx.fillStyle = COLORS.brick
        ctx.fillRect(platform.x, platform.y, platform.width, platform.height)
        // Brick pattern
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
        // Highlight
        ctx.fillStyle = COLORS.brickLine
        ctx.fillRect(platform.x, platform.y, platform.width, 2)
        // Outline
        ctx.strokeStyle = COLORS.outline
        ctx.lineWidth = 1
        ctx.strokeRect(platform.x, platform.y, platform.width, platform.height)
      } else if (platform.type === "question") {
        // Question block
        ctx.fillStyle = COLORS.question
        ctx.fillRect(platform.x, platform.y, platform.width, platform.height)
        ctx.strokeStyle = COLORS.outline
        ctx.lineWidth = 1.5
        ctx.strokeRect(platform.x, platform.y, platform.width, platform.height)
        // Question mark
        ctx.fillStyle = COLORS.outline
        ctx.font = "bold 9px Arial"
        ctx.textAlign = "center"
        ctx.fillText("?", platform.x + platform.width / 2, platform.y + platform.height - 2)
        // Shine
        ctx.fillStyle = "rgba(255,255,255,0.5)"
        ctx.fillRect(platform.x + 2, platform.y + 2, 3, 3)
      } else if (platform.type === "goal") {
        // Football goal post
        const postWidth = 4
        const crossbarHeight = 4
        // Main post
        ctx.fillStyle = COLORS.goalWhite
        ctx.fillRect(platform.x, platform.y, postWidth, platform.height)
        // Crossbar extending both sides
        ctx.fillRect(platform.x - 15, platform.y, 34, crossbarHeight)
        // Second post
        ctx.fillRect(platform.x + 15, platform.y, postWidth, platform.height)
        // Net effect
        ctx.strokeStyle = COLORS.goalNet
        ctx.lineWidth = 0.5
        for (let netX = platform.x - 12; netX < platform.x + 18; netX += 4) {
          ctx.beginPath()
          ctx.moveTo(netX, platform.y + crossbarHeight)
          ctx.lineTo(netX, platform.y + platform.height)
          ctx.stroke()
        }
        // Outlines
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
          // Regular coin
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

    // Draw NPCs (Magda with hearts)
    const time = Date.now()
    for (const npc of level.npcs) {
      if (npc.type === "magda") {
        // Draw Magda
        drawMagda(ctx, npc.x, npc.y, npc.width, npc.height)
        
        // Draw floating heart above her head
        drawFloatingHeart(ctx, npc.x + npc.width / 2, npc.y - 18, time)
        
        // Draw hearts she's sending to player
        for (const heart of npc.hearts) {
          drawHeart(ctx, heart.x, heart.y, 8, heart.alpha)
        }
      }
    }

    // Draw enemies (Brownie characters and Felix)
    for (const enemy of level.enemies) {
      if (enemy.alive) {
        if (enemy.type === "felix") {
          // Draw Felix Baltruschat (special boss)
          drawFelix(
            ctx,
            enemy.x,
            enemy.y,
            enemy.width,
            enemy.height,
            enemy.velocityX > 0
          )
        } else {
          // Draw regular Brownie
          drawBrownie(
            ctx,
            enemy.x,
            enemy.y,
            enemy.width,
            enemy.height,
            enemy.velocityX > 0,
            enemy.shirtColor,
            false
          )
        }
      }
    }

    // Draw player (Brownie character with teal shirt - hero)
    // When powered up (collected football), draw as Felix (big size!)
    if (isPoweredUp) {
      drawFelix(
        ctx,
        player.x,
        player.y,
        player.width,
        player.height,
        player.facingRight
      )
    } else {
      drawBrownie(
        ctx,
        player.x,
        player.y,
        player.width,
        player.height,
        player.facingRight,
        COLORS.shirtTeal,
        true
      )
    }

    // Draw finish (trophy/goal area)
    // Flag pole
    ctx.fillStyle = COLORS.flagPole
    ctx.fillRect(level.finishX, canvasHeight - 100, 4, 80)
    // Flag
    ctx.fillStyle = COLORS.flag
    ctx.beginPath()
    ctx.moveTo(level.finishX + 4, canvasHeight - 100)
    ctx.lineTo(level.finishX + 28, canvasHeight - 88)
    ctx.lineTo(level.finishX + 4, canvasHeight - 76)
    ctx.closePath()
    ctx.fill()
    // Flag outline
    ctx.strokeStyle = COLORS.outline
    ctx.lineWidth = 1
    ctx.stroke()
    // Star on flag
    ctx.fillStyle = COLORS.coin
    ctx.beginPath()
    ctx.arc(level.finishX + 16, canvasHeight - 88, 4, 0, Math.PI * 2)
    ctx.fill()
    // Base with football
    ctx.fillStyle = COLORS.grass
    ctx.fillRect(level.finishX - 6, canvasHeight - 20, 16, 10)
    drawFootball(ctx, level.finishX - 2, canvasHeight - 35, 14)

    ctx.restore()

    // Draw HUD
    ctx.font = "bold 10px Arial"
    // Score with football icon
    ctx.fillStyle = COLORS.textShadow
    ctx.fillText("SCORE:", 5, 13)
    ctx.fillStyle = COLORS.text
    ctx.fillText("SCORE:", 4, 12)
    ctx.fillStyle = COLORS.coin
    ctx.fillText(`${score}`, 50, 12)
    
    // Lives (brownie heads)
    ctx.fillStyle = COLORS.textShadow
    ctx.fillText("x", 5, 26)
    ctx.fillStyle = COLORS.text
    ctx.fillText("x", 4, 25)
    for (let i = 0; i < lives; i++) {
      // Mini brownie head
      ctx.fillStyle = COLORS.skinYellow
      ctx.beginPath()
      ctx.arc(20 + i * 14, 22, 5, 0, Math.PI * 2)
      ctx.fill()
      ctx.strokeStyle = COLORS.outline
      ctx.lineWidth = 1
      ctx.stroke()
    }
    
    // Level/World
    ctx.fillStyle = COLORS.textShadow
    ctx.textAlign = "right"
    ctx.fillText(`WORLD ${currentLevel}`, canvasWidth - 3, 13)
    ctx.fillStyle = COLORS.text
    ctx.fillText(`WORLD ${currentLevel}`, canvasWidth - 4, 12)
    ctx.textAlign = "left"

  }, [player, level, cameraX, score, lives, currentLevel, canvasWidth, canvasHeight, isPoweredUp])

  // Touch handlers for mobile
  const handleLeftDown = () => moveLeft()
  const handleLeftUp = () => stopMoveLeft()
  const handleRightDown = () => moveRight()
  const handleRightUp = () => stopMoveRight()

  return (
    <div className="flex flex-col items-center gap-6">
      <GameBoyShell
        onStart={levelComplete ? nextLevel : (isPlaying ? togglePause : startGame)}
        onSelect={onBack}
        onLeft={moveLeft}
        onRight={moveRight}
        onDown={() => {}}
        onRotate={jump}
        onDrop={jump}
        onLeftDown={handleLeftDown}
        onLeftUp={handleLeftUp}
        onRightDown={handleRightDown}
        onRightUp={handleRightUp}
        isPlaying={isPlaying}
        isPaused={isPaused}
        brandText="JUMPING BROWNIES"
      >
        <div className="relative rounded w-full h-full flex items-center justify-center overflow-hidden">
          <canvas
            ref={canvasRef}
            width={280}
            height={280}
            className="w-[280px] h-[280px] sm:w-[320px] sm:h-[320px]"
            style={{ imageRendering: "pixelated" }}
          />
          
          {/* Game Over overlay */}
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
          
          {/* Level Complete overlay */}
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
          
          {/* Pause overlay */}
          {isPaused && !gameOver && !levelComplete && (
            <div className="absolute inset-0 bg-slate-900/80 flex items-center justify-center z-10 rounded">
              <div className="text-white text-xl font-bold animate-pulse">
                PAUSED
              </div>
            </div>
          )}
          
          {/* Start screen overlay */}
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
      </GameBoyShell>
      
      {/* Instructions */}
      <div className="text-center text-xs text-gb-shell/80 font-mono space-y-1 px-4">
        <p className="hidden sm:block">
          <span className="text-yellow-400">ARROWS</span> Move |
          <span className="text-yellow-400"> UP/SPACE</span> Jump |
          <span className="text-yellow-400"> P</span> Pause |
          <span className="text-yellow-400"> SELECT</span> Menu
        </p>
        <p className="sm:hidden text-gb-shell/60">
          D-PAD to move | A/B to jump | SELECT for menu
        </p>
      </div>
    </div>
  )
}
