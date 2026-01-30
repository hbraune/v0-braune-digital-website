"use client"

interface DPadControlsProps {
  onLeft: () => void
  onRight: () => void
  onDown: () => void
  onRotate: () => void
}

export function DPadControls({ onLeft, onRight, onDown, onRotate }: DPadControlsProps) {
  return (
    <div className="relative w-28 h-28 sm:w-36 sm:h-36">
      {/* D-Pad outer shadow */}
      <div className="absolute inset-0 translate-y-1">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-10 h-12 sm:w-12 sm:h-14 bg-gb-button-teal-dark rounded-t-md" />
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-10 h-12 sm:w-12 sm:h-14 bg-gb-button-teal-dark rounded-b-md" />
        <div className="absolute left-0 top-1/2 -translate-y-1/2 w-12 h-10 sm:w-14 sm:h-12 bg-gb-button-teal-dark rounded-l-md" />
        <div className="absolute right-0 top-1/2 -translate-y-1/2 w-12 h-10 sm:w-14 sm:h-12 bg-gb-button-teal-dark rounded-r-md" />
      </div>
      
      {/* D-Pad main body - Cross shape */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-10 h-12 sm:w-12 sm:h-14 bg-gb-button-teal rounded-t-md
        shadow-[inset_0_2px_4px_rgba(255,255,255,0.1)]" />
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-10 h-12 sm:w-12 sm:h-14 bg-gb-button-teal rounded-b-md
        shadow-[inset_0_-2px_4px_rgba(0,0,0,0.2)]" />
      <div className="absolute left-0 top-1/2 -translate-y-1/2 w-12 h-10 sm:w-14 sm:h-12 bg-gb-button-teal rounded-l-md
        shadow-[inset_-2px_0_4px_rgba(0,0,0,0.2)]" />
      <div className="absolute right-0 top-1/2 -translate-y-1/2 w-12 h-10 sm:w-14 sm:h-12 bg-gb-button-teal rounded-r-md
        shadow-[inset_2px_0_4px_rgba(255,255,255,0.1)]" />
      
      {/* Center square */}
      <div className="absolute inset-1/3 bg-gb-button-teal z-10" />
      
      {/* Up button */}
      <button
        onClick={onRotate}
        className="absolute top-1 left-1/2 -translate-x-1/2 w-8 h-10 sm:w-10 sm:h-12 z-20
          active:translate-y-0.5 transition-transform
          flex items-center justify-center"
        aria-label="Rotate"
      >
        <svg className="w-5 h-5 text-gb-button-teal-dark" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12 6l-6 6h12z" />
        </svg>
      </button>
      
      {/* Down button */}
      <button
        onClick={onDown}
        className="absolute bottom-1 left-1/2 -translate-x-1/2 w-8 h-10 sm:w-10 sm:h-12 z-20
          active:translate-y-0.5 transition-transform
          flex items-center justify-center"
        aria-label="Move down"
      >
        <svg className="w-5 h-5 text-gb-button-teal-dark" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12 18l6-6H6z" />
        </svg>
      </button>
      
      {/* Left button */}
      <button
        onClick={onLeft}
        className="absolute left-1 top-1/2 -translate-y-1/2 w-10 h-8 sm:w-12 sm:h-10 z-20
          active:-translate-x-0.5 transition-transform
          flex items-center justify-center"
        aria-label="Move left"
      >
        <svg className="w-5 h-5 text-gb-button-teal-dark" fill="currentColor" viewBox="0 0 24 24">
          <path d="M6 12l6-6v12z" />
        </svg>
      </button>
      
      {/* Right button */}
      <button
        onClick={onRight}
        className="absolute right-1 top-1/2 -translate-y-1/2 w-10 h-8 sm:w-12 sm:h-10 z-20
          active:translate-x-0.5 transition-transform
          flex items-center justify-center"
        aria-label="Move right"
      >
        <svg className="w-5 h-5 text-gb-button-teal-dark" fill="currentColor" viewBox="0 0 24 24">
          <path d="M18 12l-6 6V6z" />
        </svg>
      </button>
    </div>
  )
}
