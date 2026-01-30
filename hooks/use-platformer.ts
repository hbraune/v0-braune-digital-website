"use client"

import { useState, useCallback, useEffect, useRef } from "react"

// Game constants - Fixed square screen size
const CANVAS_WIDTH = 280
const CANVAS_HEIGHT = 280
const GRAVITY = 0.5
const JUMP_FORCE = -9
const MOVE_SPEED = 3
const GROUND_HEIGHT = 30

// Entity types
interface Player {
  x: number
  y: number
  width: number
  height: number
  velocityX: number
  velocityY: number
  isJumping: boolean
  isOnGround: boolean
  facingRight: boolean
}

interface Platform {
  x: number
  y: number
  width: number
  height: number
  type: "ground" | "brick" | "question" | "pipe" | "goal"
}

interface Enemy {
  x: number
  y: number
  width: number
  height: number
  velocityX: number
  type: "brownie" | "felix"
  alive: boolean
  shirtColor: string
}

interface Coin {
  x: number
  y: number
  width: number
  height: number
  collected: boolean
  type: "coin" | "football"
}

interface NPC {
  x: number
  y: number
  width: number
  height: number
  type: "magda"
  hearts: { x: number; y: number; targetX: number; targetY: number; alpha: number }[]
}

interface Level {
  platforms: Platform[]
  enemies: Enemy[]
  coins: Coin[]
  npcs: NPC[]
  finishX: number
}

// Shirt color options for Brownies (from the reference image)
const SHIRT_COLORS = ["#E85D04", "#2D9CDB", "#9B51E0", "#219653", "#EB5757"]

// Level generator with football theme
const generateLevel = (levelNum: number): Level => {
  const platforms: Platform[] = [
    // Ground (stadium grass)
    { x: 0, y: CANVAS_HEIGHT - GROUND_HEIGHT, width: 500, height: GROUND_HEIGHT, type: "ground" },
    { x: 550, y: CANVAS_HEIGHT - GROUND_HEIGHT, width: 300, height: GROUND_HEIGHT, type: "ground" },
    { x: 900, y: CANVAS_HEIGHT - GROUND_HEIGHT, width: 700, height: GROUND_HEIGHT, type: "ground" },
  ]

  // Add floating platforms based on level
  const floatingPlatforms: Platform[] = [
    { x: 120, y: CANVAS_HEIGHT - 60, width: 48, height: 12, type: "brick" },
    { x: 180, y: CANVAS_HEIGHT - 60, width: 16, height: 12, type: "question" },
    { x: 250, y: CANVAS_HEIGHT - 90, width: 64, height: 12, type: "brick" },
    { x: 400, y: CANVAS_HEIGHT - 70, width: 48, height: 12, type: "brick" },
    { x: 600, y: CANVAS_HEIGHT - 80, width: 32, height: 12, type: "question" },
    { x: 700, y: CANVAS_HEIGHT - 50, width: 48, height: 12, type: "brick" },
    { x: 850, y: CANVAS_HEIGHT - 70, width: 16, height: 16, type: "question" },
    { x: 950, y: CANVAS_HEIGHT - 90, width: 64, height: 12, type: "brick" },
    { x: 1050, y: CANVAS_HEIGHT - 60, width: 48, height: 12, type: "brick" },
  ]

  // Goal posts instead of pipes
  const goals: Platform[] = [
    { x: 350, y: CANVAS_HEIGHT - GROUND_HEIGHT - 50, width: 8, height: 50, type: "goal" },
    { x: 800, y: CANVAS_HEIGHT - GROUND_HEIGHT - 60, width: 8, height: 60, type: "goal" },
    { x: 1100, y: CANVAS_HEIGHT - GROUND_HEIGHT - 50, width: 8, height: 50, type: "goal" },
  ]

  platforms.push(...floatingPlatforms, ...goals)

  // Enemy brownies with different colored shirts
  const enemies: Enemy[] = [
    { x: 200 + levelNum * 20, y: CANVAS_HEIGHT - GROUND_HEIGHT - 18, width: 16, height: 18, velocityX: -0.8, type: "brownie", alive: true, shirtColor: SHIRT_COLORS[0] },
    { x: 450, y: CANVAS_HEIGHT - GROUND_HEIGHT - 18, width: 16, height: 18, velocityX: -0.8, type: "brownie", alive: true, shirtColor: SHIRT_COLORS[1] },
    { x: 650, y: CANVAS_HEIGHT - GROUND_HEIGHT - 18, width: 16, height: 18, velocityX: 0.8, type: "brownie", alive: true, shirtColor: SHIRT_COLORS[2] },
    { x: 950, y: CANVAS_HEIGHT - GROUND_HEIGHT - 18, width: 16, height: 18, velocityX: -0.8, type: "brownie", alive: true, shirtColor: SHIRT_COLORS[3] },
  ]

  // Add more enemies based on level
  if (levelNum > 1) {
    enemies.push(
      { x: 300, y: CANVAS_HEIGHT - GROUND_HEIGHT - 18, width: 16, height: 18, velocityX: -1, type: "brownie", alive: true, shirtColor: SHIRT_COLORS[4] }
    )
  }
  if (levelNum > 2) {
    enemies.push(
      { x: 1000, y: CANVAS_HEIGHT - GROUND_HEIGHT - 18, width: 16, height: 18, velocityX: 1, type: "brownie", alive: true, shirtColor: SHIRT_COLORS[0] }
    )
  }
  
  // Felix Baltruschat - Special boss character (much bigger, appears from level 2)
  if (levelNum >= 2) {
    enemies.push({
      x: 750,
      y: CANVAS_HEIGHT - GROUND_HEIGHT - 36,
      width: 28,
      height: 36,
      velocityX: 0.5,
      type: "felix",
      alive: true,
      shirtColor: "#2D9CDB" // Teal shirt
    })
  }

  // Friendly NPCs (Magda appears in World 1)
  const npcs: NPC[] = []
  if (levelNum === 1) {
    npcs.push({
      x: 500,
      y: CANVAS_HEIGHT - GROUND_HEIGHT - 24,
      width: 20,
      height: 24,
      type: "magda",
      hearts: []
    })
  }

  // Mix of coins and footballs
  const coins: Coin[] = [
    // Footballs (worth more)
    { x: 130, y: CANVAS_HEIGHT - 80, width: 12, height: 12, collected: false, type: "football" },
    { x: 265, y: CANVAS_HEIGHT - 110, width: 12, height: 12, collected: false, type: "football" },
    { x: 600, y: CANVAS_HEIGHT - 50, width: 12, height: 12, collected: false, type: "football" },
    { x: 960, y: CANVAS_HEIGHT - 110, width: 12, height: 12, collected: false, type: "football" },
    // Regular coins
    { x: 150, y: CANVAS_HEIGHT - 80, width: 10, height: 10, collected: false, type: "coin" },
    { x: 170, y: CANVAS_HEIGHT - 80, width: 10, height: 10, collected: false, type: "coin" },
    { x: 285, y: CANVAS_HEIGHT - 110, width: 10, height: 10, collected: false, type: "coin" },
    { x: 620, y: CANVAS_HEIGHT - 50, width: 10, height: 10, collected: false, type: "coin" },
    { x: 720, y: CANVAS_HEIGHT - 70, width: 10, height: 10, collected: false, type: "coin" },
    { x: 980, y: CANVAS_HEIGHT - 110, width: 10, height: 10, collected: false, type: "coin" },
  ]

  return {
    platforms,
    enemies,
    coins,
    npcs,
    finishX: 1300,
  }
}

// Normal and powered-up player sizes
const PLAYER_NORMAL = { width: 14, height: 20 }
const PLAYER_POWERED = { width: 28, height: 36 } // Felix's size

const createPlayer = (isPoweredUp = false): Player => ({
  x: 20,
  y: CANVAS_HEIGHT - GROUND_HEIGHT - (isPoweredUp ? PLAYER_POWERED.height : PLAYER_NORMAL.height),
  width: isPoweredUp ? PLAYER_POWERED.width : PLAYER_NORMAL.width,
  height: isPoweredUp ? PLAYER_POWERED.height : PLAYER_NORMAL.height,
  velocityX: 0,
  velocityY: 0,
  isJumping: false,
  isOnGround: true,
  facingRight: true,
})

// Collision detection
const checkCollision = (
  ax: number, ay: number, aw: number, ah: number,
  bx: number, by: number, bw: number, bh: number
): boolean => {
  return ax < bx + bw && ax + aw > bx && ay < by + bh && ay + ah > by
}

export function usePlatformer() {
  const [player, setPlayer] = useState<Player>(createPlayer)
  const [level, setLevel] = useState<Level>(() => generateLevel(1))
  const [currentLevel, setCurrentLevel] = useState(1)
  const [score, setScore] = useState(0)
  const [lives, setLives] = useState(3)
  const [cameraX, setCameraX] = useState(0)
  const [gameOver, setGameOver] = useState(false)
  const [isPaused, setIsPaused] = useState(false)
  const [isPlaying, setIsPlaying] = useState(false)
  const [levelComplete, setLevelComplete] = useState(false)
  const [isPoweredUp, setIsPoweredUp] = useState(false)

  const keysRef = useRef<Set<string>>(new Set())
  const gameLoopRef = useRef<number | null>(null)

  const jump = useCallback(() => {
    if (!isPlaying || gameOver || isPaused) return
    setPlayer((prev) => {
      if (prev.isOnGround) {
        return { ...prev, velocityY: JUMP_FORCE, isJumping: true, isOnGround: false }
      }
      return prev
    })
  }, [isPlaying, gameOver, isPaused])

  const moveLeft = useCallback(() => {
    if (!isPlaying || gameOver || isPaused) return
    keysRef.current.add("left")
  }, [isPlaying, gameOver, isPaused])

  const moveRight = useCallback(() => {
    if (!isPlaying || gameOver || isPaused) return
    keysRef.current.add("right")
  }, [isPlaying, gameOver, isPaused])

  const stopMoveLeft = useCallback(() => {
    keysRef.current.delete("left")
  }, [])

  const stopMoveRight = useCallback(() => {
    keysRef.current.delete("right")
  }, [])

  const startGame = useCallback(() => {
    setPlayer(createPlayer(false))
    setLevel(generateLevel(1))
    setCurrentLevel(1)
    setScore(0)
    setLives(3)
    setCameraX(0)
    setGameOver(false)
    setIsPaused(false)
    setIsPlaying(true)
    setLevelComplete(false)
    setIsPoweredUp(false)
    keysRef.current.clear()
  }, [])

  const nextLevel = useCallback(() => {
    const newLevel = currentLevel + 1
    setCurrentLevel(newLevel)
    setLevel(generateLevel(newLevel))
    // Keep powered up status between levels
    setPlayer(createPlayer(isPoweredUp))
    setCameraX(0)
    setLevelComplete(false)
    keysRef.current.clear()
  }, [currentLevel, isPoweredUp])

  const respawnPlayer = useCallback(() => {
    // Lose power-up when respawning
    setIsPoweredUp(false)
    setPlayer(createPlayer(false))
    setCameraX(0)
    setLevel((prev) => ({
      ...prev,
      enemies: prev.enemies.map((e) => ({ ...e, alive: true })),
    }))
    keysRef.current.clear()
  }, [])

  const togglePause = useCallback(() => {
    if (gameOver || !isPlaying) return
    setIsPaused((prev) => !prev)
  }, [gameOver, isPlaying])

  // Game loop
  useEffect(() => {
    if (!isPlaying || gameOver || isPaused || levelComplete) {
      if (gameLoopRef.current) {
        cancelAnimationFrame(gameLoopRef.current)
        gameLoopRef.current = null
      }
      return
    }

    const gameLoop = () => {
      setPlayer((prev) => {
        let newPlayer = { ...prev }

        // Horizontal movement
        if (keysRef.current.has("left")) {
          newPlayer.velocityX = -MOVE_SPEED
          newPlayer.facingRight = false
        } else if (keysRef.current.has("right")) {
          newPlayer.velocityX = MOVE_SPEED
          newPlayer.facingRight = true
        } else {
          newPlayer.velocityX = 0
        }

        // Apply gravity
        newPlayer.velocityY += GRAVITY

        // Update position
        let newX = newPlayer.x + newPlayer.velocityX
        let newY = newPlayer.y + newPlayer.velocityY

        // Clamp to level bounds
        newX = Math.max(0, newX)

        // Check platform collisions
        newPlayer.isOnGround = false
        
        for (const platform of level.platforms) {
          // Skip goal posts for collision (they're just visual)
          if (platform.type === "goal") continue
          
          // Horizontal collision
          if (checkCollision(newX, prev.y, newPlayer.width, newPlayer.height, platform.x, platform.y, platform.width, platform.height)) {
            if (newPlayer.velocityX > 0) {
              newX = platform.x - newPlayer.width
            } else if (newPlayer.velocityX < 0) {
              newX = platform.x + platform.width
            }
            newPlayer.velocityX = 0
          }

          // Vertical collision
          if (checkCollision(newX, newY, newPlayer.width, newPlayer.height, platform.x, platform.y, platform.width, platform.height)) {
            if (newPlayer.velocityY > 0) {
              newY = platform.y - newPlayer.height
              newPlayer.velocityY = 0
              newPlayer.isOnGround = true
              newPlayer.isJumping = false
            } else if (newPlayer.velocityY < 0) {
              newY = platform.y + platform.height
              newPlayer.velocityY = 0
            }
          }
        }

        newPlayer.x = newX
        newPlayer.y = newY

        // Fall death
        if (newPlayer.y > CANVAS_HEIGHT) {
          setLives((prev) => {
            const newLives = prev - 1
            if (newLives <= 0) {
              setGameOver(true)
              setIsPlaying(false)
            } else {
              respawnPlayer()
            }
            return newLives
          })
          return createPlayer()
        }

        return newPlayer
      })

      // Update enemies
      setLevel((prev) => ({
        ...prev,
        enemies: prev.enemies.map((enemy) => {
          if (!enemy.alive) return enemy

          let newX = enemy.x + enemy.velocityX

          // Bounce off edges
          const onGround = prev.platforms.find(
            (p) => p.type === "ground" && enemy.x >= p.x && enemy.x <= p.x + p.width
          )
          if (onGround) {
            if (newX <= onGround.x || newX + enemy.width >= onGround.x + onGround.width) {
              return { ...enemy, velocityX: -enemy.velocityX }
            }
          }

          return { ...enemy, x: newX }
        }),
      }))

      // Check enemy collisions
      setLevel((prev) => {
        let newEnemies = [...prev.enemies]
        let playerHit = false

        for (let i = 0; i < newEnemies.length; i++) {
          const enemy = newEnemies[i]
          if (!enemy.alive) continue

          setPlayer((p) => {
            if (checkCollision(p.x, p.y, p.width, p.height, enemy.x, enemy.y, enemy.width, enemy.height)) {
              // Check if stomping (player falling onto enemy)
              if (p.velocityY > 0 && p.y + p.height - 5 < enemy.y + enemy.height / 2) {
                newEnemies[i] = { ...enemy, alive: false }
                setScore((s) => s + 100)
                return { ...p, velocityY: JUMP_FORCE / 2 }
              } else {
                playerHit = true
              }
            }
            return p
          })
        }

        if (playerHit) {
          setLives((l) => {
            const newLives = l - 1
            if (newLives <= 0) {
              setGameOver(true)
              setIsPlaying(false)
            } else {
              respawnPlayer()
            }
            return newLives
          })
        }

        return { ...prev, enemies: newEnemies }
      })

      // Check coin/football collisions
      setLevel((prev) => {
        const newCoins = prev.coins.map((coin) => {
          if (coin.collected) return coin
          
          let collected = false
          setPlayer((p) => {
            if (checkCollision(p.x, p.y, p.width, p.height, coin.x, coin.y, coin.width, coin.height)) {
              collected = true
              // Footballs worth more and power up the player!
              setScore((s) => s + (coin.type === "football" ? 100 : 50))
              
              // Power up when collecting a football
              if (coin.type === "football") {
                setIsPoweredUp((wasPowered) => {
                  if (!wasPowered) {
                    // Grow the player to Felix's size
                    setPlayer((oldP) => ({
                      ...oldP,
                      width: PLAYER_POWERED.width,
                      height: PLAYER_POWERED.height,
                      y: oldP.y - (PLAYER_POWERED.height - PLAYER_NORMAL.height), // Adjust Y so feet stay on ground
                    }))
                  }
                  return true
                })
              }
            }
            return p
          })
          
          return { ...coin, collected }
        })
        return { ...prev, coins: newCoins }
      })

      // Update NPCs (Magda sends hearts when player is nearby)
      setLevel((prev) => ({
        ...prev,
        npcs: prev.npcs.map((npc) => {
          let newHearts = [...npc.hearts]
          
          // Update existing hearts (move toward target and fade)
          newHearts = newHearts
            .map((heart) => ({
              ...heart,
              x: heart.x + (heart.targetX - heart.x) * 0.05,
              y: heart.y + (heart.targetY - heart.y) * 0.05 - 0.5,
              alpha: heart.alpha - 0.01,
            }))
            .filter((heart) => heart.alpha > 0)
          
          // Check if player is nearby and spawn new heart
          let shouldSpawnHeart = false
          setPlayer((p) => {
            const distance = Math.abs(p.x - npc.x)
            if (distance < 100 && distance > 20 && Math.random() < 0.03) {
              shouldSpawnHeart = true
            }
            return p
          })
          
          if (shouldSpawnHeart && newHearts.length < 5) {
            setPlayer((p) => {
              newHearts.push({
                x: npc.x + npc.width / 2,
                y: npc.y - 10,
                targetX: p.x + 7,
                targetY: p.y,
                alpha: 1,
              })
              return p
            })
          }
          
          return { ...npc, hearts: newHearts }
        }),
      }))

      // Check level complete
      setPlayer((p) => {
        if (p.x >= level.finishX) {
          setLevelComplete(true)
          setScore((s) => s + 500)
        }
        return p
      })

      // Update camera
      setPlayer((p) => {
        const targetCameraX = Math.max(0, p.x - CANVAS_WIDTH / 3)
        setCameraX((prev) => prev + (targetCameraX - prev) * 0.1)
        return p
      })

      gameLoopRef.current = requestAnimationFrame(gameLoop)
    }

    gameLoopRef.current = requestAnimationFrame(gameLoop)

    return () => {
      if (gameLoopRef.current) {
        cancelAnimationFrame(gameLoopRef.current)
      }
    }
  }, [isPlaying, gameOver, isPaused, levelComplete, level.platforms, level.finishX, respawnPlayer])

  // Keyboard controls
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isPlaying && !levelComplete) {
        if (e.key === "Enter" || e.key === " ") {
          startGame()
        }
        return
      }

      if (levelComplete) {
        if (e.key === "Enter" || e.key === " ") {
          nextLevel()
        }
        return
      }

      switch (e.key) {
        case "ArrowLeft":
        case "a":
          e.preventDefault()
          keysRef.current.add("left")
          break
        case "ArrowRight":
        case "d":
          e.preventDefault()
          keysRef.current.add("right")
          break
        case "ArrowUp":
        case "w":
        case " ":
          e.preventDefault()
          jump()
          break
        case "p":
        case "Escape":
          e.preventDefault()
          togglePause()
          break
      }
    }

    const handleKeyUp = (e: KeyboardEvent) => {
      switch (e.key) {
        case "ArrowLeft":
        case "a":
          keysRef.current.delete("left")
          break
        case "ArrowRight":
        case "d":
          keysRef.current.delete("right")
          break
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    window.addEventListener("keyup", handleKeyUp)
    return () => {
      window.removeEventListener("keydown", handleKeyDown)
      window.removeEventListener("keyup", handleKeyUp)
    }
  }, [isPlaying, levelComplete, jump, startGame, nextLevel, togglePause])

  return {
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
    canvasWidth: CANVAS_WIDTH,
    canvasHeight: CANVAS_HEIGHT,
    startGame,
    nextLevel,
    togglePause,
    jump,
    moveLeft,
    moveRight,
    stopMoveLeft,
    stopMoveRight,
  }
}
