"use client"

import type { ReactNode } from "react"

interface GameBoyShellProps {
  children: ReactNode
  onStart: () => void
  onSelect: () => void
  onLeft: () => void
  onRight: () => void
  onDown: () => void
  onRotate: () => void
  onDrop: () => void
  onLeftDown?: () => void
  onLeftUp?: () => void
  onRightDown?: () => void
  onRightUp?: () => void
  isPlaying: boolean
  isPaused: boolean
  brandText?: string
}

export function GameBoyShell({ 
  children, 
  onStart, 
  onSelect, 
  onLeft,
  onRight,
  onDown,
  onRotate,
  onDrop,
  onLeftDown,
  onLeftUp,
  onRightDown,
  onRightUp,
  isPlaying, 
  isPaused,
  brandText = "TETRIS GAME"
}: GameBoyShellProps) {
  // Render colorful brand text
  const renderBrandText = () => {
    const colors = ["text-purple-600", "text-cyan-500", "text-green-500", "text-yellow-500", "text-red-500", "text-pink-500", "text-cyan-400", "text-green-400", "text-yellow-400", "text-pink-400", "text-purple-400", "text-red-400", "text-cyan-300", "text-green-300"]
    return brandText.split("").map((char, i) => (
      <span key={i} className={colors[i % colors.length]}>
        {char}
      </span>
    ))
  }

  return (
    <div className="relative">
      {/* Outer shell shadow */}
      <div className="absolute inset-0 bg-gb-shell-dark rounded-3xl translate-y-2 translate-x-1" />
      
      {/* Main shell body */}
      <div className="relative bg-gradient-to-b from-gb-shell-light via-gb-shell to-gb-shell-dark rounded-3xl p-4 sm:p-6 md:p-8
        border-4 border-gb-shell-dark
        shadow-[inset_0_2px_8px_rgba(255,255,255,0.4),inset_0_-4px_8px_rgba(0,0,0,0.15)]">
        
        {/* Top decorative ridge */}
        <div className="absolute top-3 left-8 right-8 h-1 bg-gb-shell-light rounded-full opacity-60" />
        
        {/* Screen bezel area */}
        <div className="bg-gb-bezel rounded-xl p-4 sm:p-5 mb-4 sm:mb-6
          shadow-[inset_0_4px_12px_rgba(0,0,0,0.5),0_2px_4px_rgba(0,0,0,0.2)]
          border-2 border-gb-bezel-dark">
          
          {/* Power LED */}
          <div className="flex items-center gap-3 mb-3">
            <div className={`w-2.5 h-2.5 rounded-full transition-colors ${isPlaying && !isPaused ? 'bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.8)]' : 'bg-red-900'}`} />
            <span className="text-xs text-gb-bezel-dark font-mono tracking-wider opacity-60">BATTERY</span>
          </div>
          
          {/* Main game content with inner screen border - FIXED SQUARE SIZE */}
          <div className="bg-gb-bezel-dark rounded-lg p-2">
            <div className="w-[280px] h-[280px] sm:w-[320px] sm:h-[320px] overflow-hidden flex items-center justify-center">
              {children}
            </div>
          </div>
        </div>
        
        {/* Brand label - Rainbow style */}
        <div className="text-center mb-4 sm:mb-6">
          <span className="text-lg sm:text-xl font-bold tracking-tight">
            {renderBrandText()}
          </span>
        </div>

        {/* Badge label */}
        <div className="flex justify-center mb-6 sm:mb-8">
          <div className="px-6 py-1.5 bg-gb-shell-light rounded-full border-2 border-gb-shell-dark/30
            shadow-[inset_0_1px_2px_rgba(255,255,255,0.5)]">
            <span className="text-xs text-gb-shell-dark/60 font-mono tracking-widest">CLASSIC</span>
          </div>
        </div>
        
        {/* Controls area - D-pad and A/B buttons */}
        <div className="flex items-start justify-between px-2 sm:px-4 mb-6 sm:mb-8">
          {/* D-Pad */}
          <div className="relative w-24 h-24 sm:w-32 sm:h-32">
            {/* D-Pad outer shadow */}
            <div className="absolute inset-0 translate-y-1">
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-8 h-10 sm:w-10 sm:h-12 bg-gb-button-teal-dark rounded-t-sm" />
              <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-8 h-10 sm:w-10 sm:h-12 bg-gb-button-teal-dark rounded-b-sm" />
              <div className="absolute left-0 top-1/2 -translate-y-1/2 w-10 h-8 sm:w-12 sm:h-10 bg-gb-button-teal-dark rounded-l-sm" />
              <div className="absolute right-0 top-1/2 -translate-y-1/2 w-10 h-8 sm:w-12 sm:h-10 bg-gb-button-teal-dark rounded-r-sm" />
            </div>
            
            {/* D-Pad main body - Cross shape */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-8 h-10 sm:w-10 sm:h-12 bg-gb-button-teal rounded-t-sm
              shadow-[inset_0_2px_4px_rgba(255,255,255,0.1)]" />
            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-8 h-10 sm:w-10 sm:h-12 bg-gb-button-teal rounded-b-sm
              shadow-[inset_0_-2px_4px_rgba(0,0,0,0.2)]" />
            <div className="absolute left-0 top-1/2 -translate-y-1/2 w-10 h-8 sm:w-12 sm:h-10 bg-gb-button-teal rounded-l-sm
              shadow-[inset_-2px_0_4px_rgba(0,0,0,0.2)]" />
            <div className="absolute right-0 top-1/2 -translate-y-1/2 w-10 h-8 sm:w-12 sm:h-10 bg-gb-button-teal rounded-r-sm
              shadow-[inset_2px_0_4px_rgba(255,255,255,0.1)]" />
            
            {/* Center square */}
            <div className="absolute inset-1/3 bg-gb-button-teal z-10" />
            
            {/* Up button */}
            <button
              onClick={onRotate}
              className="absolute top-0.5 left-1/2 -translate-x-1/2 w-7 h-9 sm:w-9 sm:h-11 z-20
                active:translate-y-0.5 transition-transform
                flex items-center justify-center"
              aria-label="Up / Rotate"
            >
              <svg className="w-4 h-4 sm:w-5 sm:h-5 text-gb-button-teal-dark" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 6l-6 6h12z" />
              </svg>
            </button>
            
            {/* Down button */}
            <button
              onClick={onDown}
              className="absolute bottom-0.5 left-1/2 -translate-x-1/2 w-7 h-9 sm:w-9 sm:h-11 z-20
                active:translate-y-0.5 transition-transform
                flex items-center justify-center"
              aria-label="Move down"
            >
              <svg className="w-4 h-4 sm:w-5 sm:h-5 text-gb-button-teal-dark" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 18l6-6H6z" />
              </svg>
            </button>
            
            {/* Left button */}
            <button
              onClick={onLeft}
              onMouseDown={onLeftDown}
              onMouseUp={onLeftUp}
              onMouseLeave={onLeftUp}
              onTouchStart={onLeftDown}
              onTouchEnd={onLeftUp}
              className="absolute left-0.5 top-1/2 -translate-y-1/2 w-9 h-7 sm:w-11 sm:h-9 z-20
                active:-translate-x-0.5 transition-transform
                flex items-center justify-center"
              aria-label="Move left"
            >
              <svg className="w-4 h-4 sm:w-5 sm:h-5 text-gb-button-teal-dark" fill="currentColor" viewBox="0 0 24 24">
                <path d="M6 12l6-6v12z" />
              </svg>
            </button>
            
            {/* Right button */}
            <button
              onClick={onRight}
              onMouseDown={onRightDown}
              onMouseUp={onRightUp}
              onMouseLeave={onRightUp}
              onTouchStart={onRightDown}
              onTouchEnd={onRightUp}
              className="absolute right-0.5 top-1/2 -translate-y-1/2 w-9 h-7 sm:w-11 sm:h-9 z-20
                active:translate-x-0.5 transition-transform
                flex items-center justify-center"
              aria-label="Move right"
            >
              <svg className="w-4 h-4 sm:w-5 sm:h-5 text-gb-button-teal-dark" fill="currentColor" viewBox="0 0 24 24">
                <path d="M18 12l-6 6V6z" />
              </svg>
            </button>
          </div>
          
          {/* A/B Buttons - Diagonal layout */}
          <div className="flex gap-3 sm:gap-4 items-start">
            {/* A Button - Lower position */}
            <div className="flex flex-col items-center gap-1 mt-8 sm:mt-10">
              <div className="relative">
                <div className="absolute inset-0 bg-gb-button-teal-dark rounded-full translate-y-1" />
                <button
                  onClick={onDrop}
                  className="relative w-11 h-11 sm:w-14 sm:h-14 rounded-full bg-gb-button-teal 
                    shadow-[inset_0_2px_4px_rgba(255,255,255,0.2),inset_0_-2px_4px_rgba(0,0,0,0.3)]
                    active:translate-y-0.5 active:shadow-[inset_0_2px_6px_rgba(0,0,0,0.4)] transition-all
                    border-2 border-gb-button-teal-dark
                    flex items-center justify-center"
                  aria-label="A Button"
                >
                  <span className="text-sm sm:text-base font-bold text-gb-button-teal-dark">A</span>
                </button>
              </div>
            </div>
            
            {/* B Button - Higher position */}
            <div className="flex flex-col items-center gap-1">
              <div className="relative">
                <div className="absolute inset-0 bg-gb-button-teal-dark rounded-full translate-y-1" />
                <button
                  onClick={onRotate}
                  className="relative w-11 h-11 sm:w-14 sm:h-14 rounded-full bg-gb-button-teal 
                    shadow-[inset_0_2px_4px_rgba(255,255,255,0.2),inset_0_-2px_4px_rgba(0,0,0,0.3)]
                    active:translate-y-0.5 active:shadow-[inset_0_2px_6px_rgba(0,0,0,0.4)] transition-all
                    border-2 border-gb-button-teal-dark
                    flex items-center justify-center"
                  aria-label="B Button"
                >
                  <span className="text-sm sm:text-base font-bold text-gb-button-teal-dark">B</span>
                </button>
              </div>
            </div>
          </div>
        </div>
        
        {/* Start/Select buttons */}
        <div className="flex justify-center gap-8 sm:gap-12 mb-4 sm:mb-6">
          <div className="flex flex-col items-center gap-1">
            <button
              onClick={onSelect}
              className="w-12 sm:w-16 h-3 sm:h-4 bg-gb-button-teal rounded-full 
                shadow-[inset_0_2px_4px_rgba(0,0,0,0.4),0_1px_2px_rgba(0,0,0,0.2)]
                active:shadow-[inset_0_2px_6px_rgba(0,0,0,0.6)] transition-all
                border border-gb-button-teal-dark rotate-[-25deg]"
              aria-label="Select"
            />
            <span className="text-xs text-gb-shell-dark/70 font-mono mt-1">
              SELECT
            </span>
          </div>
          <div className="flex flex-col items-center gap-1">
            <button
              onClick={onStart}
              className="w-12 sm:w-16 h-3 sm:h-4 bg-gb-button-teal rounded-full 
                shadow-[inset_0_2px_4px_rgba(0,0,0,0.4),0_1px_2px_rgba(0,0,0,0.2)]
                active:shadow-[inset_0_2px_6px_rgba(0,0,0,0.6)] transition-all
                border border-gb-button-teal-dark rotate-[-25deg]"
              aria-label="Start"
            />
            <span className="text-xs text-gb-shell-dark/70 font-mono mt-1">
              START
            </span>
          </div>
        </div>
        
        {/* Speaker grille */}
        <div className="absolute bottom-6 sm:bottom-8 right-4 sm:right-8 grid grid-cols-6 gap-1 rotate-[-20deg]">
          {Array.from({ length: 24 }).map((_, i) => (
            <div key={i} className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-gb-speaker shadow-[inset_0_1px_2px_rgba(0,0,0,0.3)]" />
          ))}
        </div>
      </div>
    </div>
  )
}
