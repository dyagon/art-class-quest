import { createContext, useContext, useEffect, useMemo, useReducer, useState, type ReactNode } from 'react'
import { getMergedGradeConfig, resetGradeConfig, saveGradeConfig } from './gradeConfig'
import { canUndo, createInitialAppState, gameReducer } from './reducer'
import type { GradeConfigMap, RescueId, SubmitTiming } from './types'
import type { GameState } from './types'

type GameContextValue = {
  state: GameState
  canUndo: boolean
  config: GradeConfigMap
  debugOpen: boolean
  setDebugOpen: (open: boolean) => void
  start: () => void
  markParticipate: () => void
  selectChoice: (choiceId: string) => void
  selectTiming: (timing: SubmitTiming) => void
  selectRescue: (rescue: RescueId) => void
  dismissRescue: () => void
  undo: () => void
  reset: () => void
  updateConfig: (config: GradeConfigMap) => void
  restoreConfig: () => void
}

const GameContext = createContext<GameContextValue | null>(null)

export function GameProvider({ children }: { children: ReactNode }) {
  const [app, dispatch] = useReducer(gameReducer, undefined, createInitialAppState)
  const [config, setConfig] = useState<GradeConfigMap>(getMergedGradeConfig)
  const [debugOpen, setDebugOpen] = useState(false)

  useEffect(() => {
    if (!app.present.flashDiscipline) return
    const timer = window.setTimeout(() => dispatch({ type: 'CLEAR_FLASH' }), 350)
    return () => window.clearTimeout(timer)
  }, [app.present.flashDiscipline])

  const value = useMemo<GameContextValue>(
    () => ({
      state: app.present,
      canUndo: canUndo(app.present),
      config,
      debugOpen,
      setDebugOpen,
      start: () => dispatch({ type: 'START' }),
      markParticipate: () => dispatch({ type: 'MARK_PARTICIPATE' }),
      selectChoice: (choiceId) => dispatch({ type: 'SELECT_CHOICE', choiceId, config }),
      selectTiming: (timing) => dispatch({ type: 'SELECT_TIMING', timing, config }),
      selectRescue: (rescue) => dispatch({ type: 'SELECT_RESCUE', rescue }),
      dismissRescue: () => dispatch({ type: 'DISMISS_RESCUE' }),
      undo: () => dispatch({ type: 'UNDO' }),
      reset: () => dispatch({ type: 'RESET' }),
      updateConfig: (next) => {
        setConfig(next)
        saveGradeConfig(next)
      },
      restoreConfig: () => {
        resetGradeConfig()
        setConfig(getMergedGradeConfig())
      },
    }),
    [app, config, debugOpen],
  )

  return <GameContext.Provider value={value}>{children}</GameContext.Provider>
}

export function useGame() {
  const value = useContext(GameContext)
  if (!value) throw new Error('useGame 必须在 GameProvider 内使用')
  return value
}
