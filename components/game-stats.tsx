"use client"

interface GameStatsProps {
  score: number
  lines: number
  level: number
}

export function GameStats({ score, lines, level }: GameStatsProps) {
  return (
    <div className="flex flex-col gap-2">
      {/* Level box */}
      <div className="bg-gradient-to-r from-purple-500 to-pink-500 px-2 py-1.5 rounded-md shadow-md">
        <div className="text-xs text-white/80 font-bold text-center">LEVEL</div>
        <div className="text-lg text-white font-bold text-center drop-shadow">
          {level.toString().padStart(2, "0")}
        </div>
      </div>
      
      {/* Score section */}
      <div className="bg-slate-800 border-2 border-slate-600 px-2 py-1.5 rounded-md">
        <div className="text-xs text-yellow-400 font-bold text-center mb-0.5">SCORE</div>
        <div className="text-sm text-white font-bold text-center font-mono">
          {score.toString().padStart(6, "0")}
        </div>
      </div>
      
      {/* Lines section */}
      <div className="bg-slate-800 border-2 border-slate-600 px-2 py-1.5 rounded-md">
        <div className="text-xs text-green-400 font-bold text-center mb-0.5">LINES</div>
        <div className="text-sm text-white font-bold text-center font-mono">
          {lines.toString().padStart(4, "0")}
        </div>
      </div>
    </div>
  )
}
