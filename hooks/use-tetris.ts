"use client"

import { useState, useCallback, useEffect, useRef } from "react"

// Tetris constants
const BOARD_WIDTH = 10
const BOARD_HEIGHT = 20
const EMPTY_CELL = 0

// Tetromino shapes (I, O, T, S, Z, J, L)
const TETROMINOES = {
  I: {
    shape: [
      [0, 0, 0, 0],
      [1, 1, 1, 1],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
    ],
    color: 1,
  },
  O: {
    shape: [
      [1, 1],
      [1, 1],
    ],
    color: 2,
  },
  T: {
    shape: [
      [0, 1, 0],
      [1, 1, 1],
      [0, 0, 0],
    ],
    color: 3,
  },
  S: {
    shape: [
      [0, 1, 1],
      [1, 1, 0],
      [0, 0, 0],
    ],
    color: 4,
  },
  Z: {
    shape: [
      [1, 1, 0],
      [0, 1, 1],
      [0, 0, 0],
    ],
    color: 5,
  },
  J: {
    shape: [
      [1, 0, 0],
      [1, 1, 1],
      [0, 0, 0],
    ],
    color: 6,
  },
  L: {
    shape: [
      [0, 0, 1],
      [1, 1, 1],
      [0, 0, 0],
    ],
    color: 7,
  },
}

type TetrominoKey = keyof typeof TETROMINOES

interface Piece {
  shape: number[][]
  color: number
  x: number
  y: number
}

type Board = number[][]

const createEmptyBoard = (): Board =>
  Array.from({ length: BOARD_HEIGHT }, () => Array(BOARD_WIDTH).fill(EMPTY_CELL))

const getRandomTetromino = (): Piece => {
  const keys = Object.keys(TETROMINOES) as TetrominoKey[]
  const randomKey = keys[Math.floor(Math.random() * keys.length)]
  const tetromino = TETROMINOES[randomKey]
  return {
    shape: tetromino.shape.map((row) => [...row]),
    color: tetromino.color,
    x: Math.floor(BOARD_WIDTH / 2) - Math.floor(tetromino.shape[0].length / 2),
    y: 0,
  }
}

const rotate = (matrix: number[][]): number[][] => {
  const N = matrix.length
  const rotated = matrix.map((row, i) => row.map((_, j) => matrix[N - 1 - j][i]))
  return rotated
}

export function useTetris() {
  const [board, setBoard] = useState<Board>(createEmptyBoard)
  const [currentPiece, setCurrentPiece] = useState<Piece | null>(null)
  const [nextPiece, setNextPiece] = useState<Piece | null>(null)
  const [score, setScore] = useState(0)
  const [lines, setLines] = useState(0)
  const [level, setLevel] = useState(1)
  const [gameOver, setGameOver] = useState(false)
  const [isPaused, setIsPaused] = useState(false)
  const [isPlaying, setIsPlaying] = useState(false)
  const gameLoopRef = useRef<NodeJS.Timeout | null>(null)

  const isValidMove = useCallback(
    (piece: Piece, newX: number, newY: number, newShape?: number[][]): boolean => {
      const shape = newShape || piece.shape
      for (let y = 0; y < shape.length; y++) {
        for (let x = 0; x < shape[y].length; x++) {
          if (shape[y][x]) {
            const boardX = newX + x
            const boardY = newY + y
            if (boardX < 0 || boardX >= BOARD_WIDTH || boardY >= BOARD_HEIGHT) {
              return false
            }
            if (boardY >= 0 && board[boardY][boardX] !== EMPTY_CELL) {
              return false
            }
          }
        }
      }
      return true
    },
    [board]
  )

  const mergePieceToBoard = useCallback((piece: Piece, currentBoard: Board): Board => {
    const newBoard = currentBoard.map((row) => [...row])
    for (let y = 0; y < piece.shape.length; y++) {
      for (let x = 0; x < piece.shape[y].length; x++) {
        if (piece.shape[y][x]) {
          const boardY = piece.y + y
          const boardX = piece.x + x
          if (boardY >= 0 && boardY < BOARD_HEIGHT && boardX >= 0 && boardX < BOARD_WIDTH) {
            newBoard[boardY][boardX] = piece.color
          }
        }
      }
    }
    return newBoard
  }, [])

  const clearLines = useCallback((currentBoard: Board): { newBoard: Board; linesCleared: number } => {
    const newBoard = currentBoard.filter((row) => row.some((cell) => cell === EMPTY_CELL))
    const linesCleared = BOARD_HEIGHT - newBoard.length
    while (newBoard.length < BOARD_HEIGHT) {
      newBoard.unshift(Array(BOARD_WIDTH).fill(EMPTY_CELL))
    }
    return { newBoard, linesCleared }
  }, [])

  const lockPiece = useCallback(() => {
    if (!currentPiece) return

    let newBoard = mergePieceToBoard(currentPiece, board)
    const { newBoard: clearedBoard, linesCleared } = clearLines(newBoard)
    
    if (linesCleared > 0) {
      const linePoints = [0, 100, 300, 500, 800]
      setScore((prev) => prev + linePoints[linesCleared] * level)
      setLines((prev) => {
        const newLines = prev + linesCleared
        const newLevel = Math.floor(newLines / 10) + 1
        if (newLevel > level) setLevel(newLevel)
        return newLines
      })
    }

    setBoard(clearedBoard)

    // Spawn next piece
    const newPiece = nextPiece || getRandomTetromino()
    if (!isValidMove(newPiece, newPiece.x, newPiece.y)) {
      setGameOver(true)
      setIsPlaying(false)
      return
    }
    
    setCurrentPiece(newPiece)
    setNextPiece(getRandomTetromino())
  }, [currentPiece, board, nextPiece, level, mergePieceToBoard, clearLines, isValidMove])

  const moveDown = useCallback(() => {
    if (!currentPiece || gameOver || isPaused) return

    if (isValidMove(currentPiece, currentPiece.x, currentPiece.y + 1)) {
      setCurrentPiece((prev) => (prev ? { ...prev, y: prev.y + 1 } : null))
    } else {
      lockPiece()
    }
  }, [currentPiece, gameOver, isPaused, isValidMove, lockPiece])

  const moveLeft = useCallback(() => {
    if (!currentPiece || gameOver || isPaused) return
    if (isValidMove(currentPiece, currentPiece.x - 1, currentPiece.y)) {
      setCurrentPiece((prev) => (prev ? { ...prev, x: prev.x - 1 } : null))
    }
  }, [currentPiece, gameOver, isPaused, isValidMove])

  const moveRight = useCallback(() => {
    if (!currentPiece || gameOver || isPaused) return
    if (isValidMove(currentPiece, currentPiece.x + 1, currentPiece.y)) {
      setCurrentPiece((prev) => (prev ? { ...prev, x: prev.x + 1 } : null))
    }
  }, [currentPiece, gameOver, isPaused, isValidMove])

  const rotatePiece = useCallback(() => {
    if (!currentPiece || gameOver || isPaused) return
    const rotatedShape = rotate(currentPiece.shape)
    if (isValidMove(currentPiece, currentPiece.x, currentPiece.y, rotatedShape)) {
      setCurrentPiece((prev) => (prev ? { ...prev, shape: rotatedShape } : null))
    }
  }, [currentPiece, gameOver, isPaused, isValidMove])

  const hardDrop = useCallback(() => {
    if (!currentPiece || gameOver || isPaused) return
    let newY = currentPiece.y
    while (isValidMove(currentPiece, currentPiece.x, newY + 1)) {
      newY++
    }
    setCurrentPiece((prev) => (prev ? { ...prev, y: newY } : null))
    setTimeout(lockPiece, 0)
  }, [currentPiece, gameOver, isPaused, isValidMove, lockPiece])

  const startGame = useCallback(() => {
    setBoard(createEmptyBoard())
    setScore(0)
    setLines(0)
    setLevel(1)
    setGameOver(false)
    setIsPaused(false)
    setIsPlaying(true)
    setCurrentPiece(getRandomTetromino())
    setNextPiece(getRandomTetromino())
  }, [])

  const togglePause = useCallback(() => {
    if (gameOver || !isPlaying) return
    setIsPaused((prev) => !prev)
  }, [gameOver, isPlaying])

  // Game loop
  useEffect(() => {
    if (!isPlaying || gameOver || isPaused) {
      if (gameLoopRef.current) {
        clearInterval(gameLoopRef.current)
        gameLoopRef.current = null
      }
      return
    }

    const speed = Math.max(100, 1000 - (level - 1) * 100)
    gameLoopRef.current = setInterval(moveDown, speed)

    return () => {
      if (gameLoopRef.current) {
        clearInterval(gameLoopRef.current)
      }
    }
  }, [isPlaying, gameOver, isPaused, level, moveDown])

  // Keyboard controls
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isPlaying) {
        if (e.key === "Enter" || e.key === " ") {
          startGame()
        }
        return
      }

      switch (e.key) {
        case "ArrowLeft":
        case "a":
          e.preventDefault()
          moveLeft()
          break
        case "ArrowRight":
        case "d":
          e.preventDefault()
          moveRight()
          break
        case "ArrowDown":
        case "s":
          e.preventDefault()
          moveDown()
          break
        case "ArrowUp":
        case "w":
          e.preventDefault()
          rotatePiece()
          break
        case " ":
          e.preventDefault()
          hardDrop()
          break
        case "p":
        case "Escape":
          e.preventDefault()
          togglePause()
          break
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [isPlaying, moveLeft, moveRight, moveDown, rotatePiece, hardDrop, togglePause, startGame])

  // Get display board with current piece
  const getDisplayBoard = useCallback((): Board => {
    if (!currentPiece) return board
    return mergePieceToBoard(currentPiece, board)
  }, [board, currentPiece, mergePieceToBoard])

  return {
    board: getDisplayBoard(),
    currentPiece,
    nextPiece,
    score,
    lines,
    level,
    gameOver,
    isPaused,
    isPlaying,
    startGame,
    togglePause,
    moveLeft,
    moveRight,
    moveDown,
    rotatePiece,
    hardDrop,
  }
}
