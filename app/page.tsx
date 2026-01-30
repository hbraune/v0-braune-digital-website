import { GameConsole } from "@/components/game-console"

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-gb-bezel via-gb-bezel-dark to-gb-bezel 
      flex items-center justify-center p-4 sm:p-8">
      <GameConsole />
    </main>
  )
}
