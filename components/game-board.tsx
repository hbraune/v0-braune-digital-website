"use client"

// Color palette for tetromino pieces (Game Boy Color style)
const PIECE_COLORS: Record<number, { bg: string; border: string }> = {
  0: { bg: "#e8f4f8", border: "#d0e8ef" }, // Empty - light
  1: { bg: "#00d4ff", border: "#00a8cc" }, // I - Cyan
  2: { bg: "#ffdd00", border: "#ccb100" }, // O - Yellow
  3: { bg: "#aa44ff", border: "#8833cc" }, // T - Purple
  4: { bg: "#44ff44", border: "#33cc33" }, // S - Green
  5: { bg: "#ff4444", border: "#cc3333" }, // Z - Red
  6: { bg: "#4488ff", border: "#3366cc" }, // J - Blue
  7: { bg: "#ff8844", border: "#cc6633" }, // L - Orange
}

interface GameBoardProps {
  board: number[][]
}

export function GameBoard({ board }: GameBoardProps) {
  return (
    <div className="relative">
      {/* LCD Screen bezel */}
      <div className="absolute -inset-2 bg-gb-screen-dark rounded-sm" />
      
      {/* Screen border */}
      <div className="relative border-2 border-gb-screen-dark bg-gb-screen-light p-1">
        <div className="grid gap-px bg-gb-screen-mid/30" style={{ gridTemplateColumns: `repeat(10, 1fr)` }}>
          {board.map((row, y) =>
            row.map((cell, x) => {
              const colors = PIECE_COLORS[cell] || PIECE_COLORS[0]
              return (
                <div
                  key={`${y}-${x}`}
                  className="aspect-square w-3 sm:w-3.5 transition-colors duration-75"
                  style={{
                    backgroundColor: colors.bg,
                    boxShadow: cell > 0 
                      ? `inset 2px 2px 0 rgba(255,255,255,0.4), inset -2px -2px 0 ${colors.border}` 
                      : "inset 1px 1px 0 rgba(255,255,255,0.3)",
                    border: cell > 0 ? `1px solid ${colors.border}` : "none",
                  }}
                />
              )
            })
          )}
        </div>
      </div>
    </div>
  )
}
