import { BranchDrawer } from './components/BranchDrawer'
import { EndingScreen } from './components/EndingScreen'
import { GradeDebugDrawer } from './components/GradeDebugDrawer'
import { Hud } from './components/Hud'
import { InstallPrompt } from './components/InstallPrompt'
import { PageBackground } from './components/PageBackground'
import { RescueModal } from './components/RescueModal'
import { ScenarioCard } from './components/ScenarioCard'
import { TitleScreen } from './components/TitleScreen'
import { TopBar } from './components/TopBar'
import { GameProvider, useGame } from './game/GameContext'

function GameShell() {
  const { state } = useGame()
  const isIntro = state.phase.type === 'intro'

  return (
    <div className="flex min-h-dvh items-center justify-center p-2 md:p-6">
      <PageBackground state={state} />
      <InstallPrompt />
      {isIntro ? (
        <TitleScreen />
      ) : (
        <div
          className={`paper-card relative flex w-full max-w-6xl flex-col overflow-hidden md:aspect-video ${
            state.flashDiscipline ? 'ring-4 ring-[#b23a2f]/70' : ''
          }`}
          style={{ minHeight: 'min(100dvh - 1rem, 42rem)' }}
        >
          <TopBar />
          <Hud />
          <ScenarioCard />
          <EndingScreen />
          <BranchDrawer />
          <RescueModal />
          <GradeDebugDrawer />
        </div>
      )}
    </div>
  )
}

export default function App() {
  return (
    <GameProvider>
      <GameShell />
    </GameProvider>
  )
}
