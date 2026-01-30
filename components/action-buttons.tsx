"use client"

interface ActionButtonsProps {
  onRotate: () => void
  onDrop: () => void
}

export function ActionButtons({ onRotate, onDrop }: ActionButtonsProps) {
  return (
    <div className="flex gap-4 sm:gap-6 items-start">
      {/* A Button - Lower position */}
      <div className="flex flex-col items-center gap-1.5 mt-8">
        <div className="relative">
          {/* Button shadow/base */}
          <div className="absolute inset-0 bg-gb-button-teal-dark rounded-full translate-y-1" />
          <button
            onClick={onDrop}
            className="relative w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-gb-button-teal 
              shadow-[inset_0_2px_4px_rgba(255,255,255,0.2),inset_0_-2px_4px_rgba(0,0,0,0.3)]
              active:translate-y-0.5 active:shadow-[inset_0_2px_6px_rgba(0,0,0,0.4)] transition-all
              border-2 border-gb-button-teal-dark
              flex items-center justify-center"
            aria-label="Hard Drop (A)"
          >
            <span className="text-sm font-bold text-gb-button-teal-dark">A</span>
          </button>
        </div>
        <span className="text-xs text-gb-shell-dark/70 font-mono">DROP</span>
      </div>
      
      {/* B Button - Higher position */}
      <div className="flex flex-col items-center gap-1.5">
        <div className="relative">
          {/* Button shadow/base */}
          <div className="absolute inset-0 bg-gb-button-teal-dark rounded-full translate-y-1" />
          <button
            onClick={onRotate}
            className="relative w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-gb-button-teal 
              shadow-[inset_0_2px_4px_rgba(255,255,255,0.2),inset_0_-2px_4px_rgba(0,0,0,0.3)]
              active:translate-y-0.5 active:shadow-[inset_0_2px_6px_rgba(0,0,0,0.4)] transition-all
              border-2 border-gb-button-teal-dark
              flex items-center justify-center"
            aria-label="Rotate (B)"
          >
            <span className="text-sm font-bold text-gb-button-teal-dark">B</span>
          </button>
        </div>
        <span className="text-xs text-gb-shell-dark/70 font-mono">TURN</span>
      </div>
    </div>
  )
}
