"use client"

import { useTetris } from "../hooks/use-tetris"
import { GameBoard } from "./game-board"
import { NextPiece } from "./next-piece"
import { GameStats } from "./game-stats"
import { GameBoyShell } from "./gameboy-shell"

interface TetrisGameProps {
  onBack: () => void
}

export function TetrisGame({ onBack }: TetrisGameProps) {
  const {
    board,
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
  } = useTetris()

  return (
    <div className="flex flex-col items-center gap-6">
      <GameBoyShell
        onStart={isPlaying ? togglePause : startGame}
        onSelect={onBack}
        onLeft={moveLeft}
        onRight={moveRight}
        onDown={moveDown}
        onRotate={rotatePiece}
        onDrop={hardDrop}
        isPlaying={isPlaying}
        isPaused={isPaused}
        brandText="TETRIS GAME"
      >
        <div className="flex gap-3 sm:gap-4 w-full h-full items-center justify-center bg-gradient-to-b from-slate-800 to-slate-900 rounded">
          {/* Main game board */}
          <div className="relative">
            <GameBoard board={board} />
            
            {/* Game Over overlay */}
            {gameOver && (
              <div className="absolute inset-0 bg-black/85 flex flex-col items-center justify-center gap-3 z-10 rounded">
                <div className="text-red-500 text-sm sm:text-base font-bold animate-pulse">
                  GAME OVER
                </div>
                <div className="text-yellow-400 text-sm font-bold">
                  Score: {score}
                </div>
                <div className="flex gap-2 mt-2">
                  <button
                    onClick={startGame}
                    className="px-4 py-2 bg-cyan-500 text-white text-sm font-bold rounded
                      hover:bg-cyan-600 transition-colors
                      shadow-[0_4px_0_#0891b2] active:shadow-[0_2px_0_#0891b2] active:translate-y-0.5"
                  >
                    RETRY
                  </button>
                  <button
                    onClick={onBack}
                    className="px-4 py-2 bg-purple-500 text-white text-sm font-bold rounded
                      hover:bg-purple-600 transition-colors
                      shadow-[0_4px_0_#7c3aed] active:shadow-[0_2px_0_#7c3aed] active:translate-y-0.5"
                  >
                    MENU
                  </button>
                </div>
              </div>
            )}
            
            {/* Pause overlay */}
            {isPaused && !gameOver && (
              <div className="absolute inset-0 bg-black/75 flex items-center justify-center z-10 rounded">
                <div className="text-white text-lg font-bold animate-pulse">
                  PAUSED
                </div>
              </div>
            )}
            
            {/* Start screen overlay */}
            {!isPlaying && !gameOver && (
              <div className="absolute inset-0 bg-gradient-to-b from-indigo-900 to-purple-900 flex flex-col items-center justify-center gap-4 z-10 rounded">
                <div className="text-white text-xl sm:text-2xl font-bold tracking-wider drop-shadow-lg">
                  TETRIS
                </div>
                <div className="flex gap-1">
                  <div className="w-4 h-4 bg-cyan-400 rounded-sm" />
                  <div className="w-4 h-4 bg-yellow-400 rounded-sm" />
                  <div className="w-4 h-4 bg-purple-400 rounded-sm" />
                  <div className="w-4 h-4 bg-red-400 rounded-sm" />
                </div>
                <button
                  onClick={startGame}
                  className="px-8 py-3 bg-cyan-500 text-white text-lg font-bold rounded-lg
                    hover:bg-cyan-600 transition-all
                    shadow-[0_6px_0_#0891b2] active:shadow-[0_2px_0_#0891b2] active:translate-y-1"
                >
                  START
                </button>
              </div>
            )}
          </div>
          
          {/* Side panel */}
          <div className="flex flex-col gap-2 sm:gap-3">
            <NextPiece piece={nextPiece} />
            <GameStats score={score} lines={lines} level={level} />
          </div>
        </div>
      </GameBoyShell>
      
      {/* Instructions */}
      <div className="text-center text-xs text-gb-shell/80 font-mono space-y-1 px-4">
        <p className="hidden sm:block">
          <span className="text-cyan-400">ARROWS</span> Move |
          <span className="text-cyan-400"> UP</span> Rotate |
          <span className="text-cyan-400"> SPACE</span> Drop |
          <span className="text-cyan-400"> SELECT</span> Menu
        </p>
        <p className="sm:hidden text-gb-shell/60">
          D-PAD to move | A/B buttons | SELECT for menu
        </p>
      </div>
    </div>
  )
}
