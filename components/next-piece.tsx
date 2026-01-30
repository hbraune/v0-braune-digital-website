"use client"

// Color palette for tetromino pieces
const PIECE_COLORS: Record<number, { bg: string; border: string }> = {
  0: { bg: "#1e293b", border: "#334155" }, // Empty - dark slate
  1: { bg: "#00d4ff", border: "#00a8cc" }, // I - Cyan
  2: { bg: "#ffdd00", border: "#ccb100" }, // O - Yellow
  3: { bg: "#aa44ff", border: "#8833cc" }, // T - Purple
  4: { bg: "#44ff44", border: "#33cc33" }, // S - Green
  5: { bg: "#ff4444", border: "#cc3333" }, // Z - Red
  6: { bg: "#4488ff", border: "#3366cc" }, // J - Blue
  7: { bg: "#ff8844", border: "#cc6633" }, // L - Orange
}

interface NextPieceProps {
  piece: {
    shape: number[][]
    color: number
  } | null
}

export function NextPiece({ piece }: NextPieceProps) {
  const displayGrid = Array.from({ length: 4 }, () => Array(4).fill(0))
  
  if (piece) {
    const offsetY = Math.floor((4 - piece.shape.length) / 2)
    const offsetX = Math.floor((4 - piece.shape[0].length) / 2)
    
    for (let y = 0; y < piece.shape.length; y++) {
      for (let x = 0; x < piece.shape[y].length; x++) {
        if (piece.shape[y][x]) {
          displayGrid[y + offsetY][x + offsetX] = piece.color
        }
      }
    }
  }

  return (
    <div>
      {/* Title box */}
      <div className="bg-gradient-to-r from-cyan-500 to-blue-500 px-3 py-1.5 rounded-md mb-2 shadow-md">
        <div className="text-xs text-white text-center font-bold tracking-tight">NEXT</div>
      </div>
      
      {/* Next piece preview */}
      <div className="bg-slate-800 border-2 border-slate-600 p-2 rounded-md shadow-inner">
        <div className="grid grid-cols-4 gap-px bg-slate-700">
          {displayGrid.map((row, y) =>
            row.map((cell, x) => {
              const colors = PIECE_COLORS[cell] || PIECE_COLORS[0]
              return (
                <div
                  key={`${y}-${x}`}
                  className="aspect-square w-4 sm:w-5"
                  style={{
                    backgroundColor: colors.bg,
                    boxShadow: cell > 0 
                      ? `inset 2px 2px 0 rgba(255,255,255,0.3), inset -2px -2px 0 ${colors.border}` 
                      : "none",
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
