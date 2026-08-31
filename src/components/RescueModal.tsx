import { AnimatePresence, motion } from 'framer-motion'
import { useGame } from '../game/GameContext'
import { RESCUE_OPTIONS } from '../game/lessons'
import { SceneBackdrop } from './SceneBackdrop'

export function RescueModal() {
  const { state, selectRescue, dismissRescue } = useGame()
  const open = state.phase.type === 'rescue'

  return (
    <AnimatePresence>
      {open ? (
        <motion.div
          className="absolute inset-0 z-20 flex items-center justify-center bg-[#2b1f18]/35 p-4 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={dismissRescue}
        >
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-labelledby="rescue-title"
            initial={{ scale: 0.92, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.96, opacity: 0 }}
            onClick={(event) => event.stopPropagation()}
            className="relative max-h-full w-full max-w-xl overflow-auto rounded-2xl border border-[#d8c4a0] bg-[#f7eedc] shadow-2xl"
          >
            <SceneBackdrop sceneId="rescue" className="h-24" />
            <button
              type="button"
              onClick={dismissRescue}
              className="absolute top-3 right-3 z-10 rounded-full border border-white/40 bg-black/35 px-2.5 py-1 text-xs text-white/95 backdrop-blur-sm transition hover:bg-black/50"
            >
              关闭
            </button>
            <div className="px-5 py-4">
              <div className="mb-1 text-2xl">💡</div>
              <h2 id="rescue-title" className="font-display text-2xl">
                拯救画作
              </h2>
              <p className="mt-2 text-sm leading-6 text-ink-soft">
                当前作品评级为 A-，尚未达到全 A 通关标准！请选择你的补救策略：
              </p>
              <div className="mt-4 grid gap-2">
                {RESCUE_OPTIONS.map((option) => (
                  <motion.button
                    key={option.id}
                    type="button"
                    whileTap={{ scale: 0.98 }}
                    onClick={() => selectRescue(option.id)}
                    className="rounded-xl border border-[#d2ba90] bg-[#fff9ee] px-3 py-2.5 text-left transition hover:-translate-y-0.5 hover:bg-[#fffdf7]"
                  >
                    <div className="font-display text-base">
                      {option.emoji} {option.title}
                    </div>
                    <div className="text-xs text-ink-soft">{option.desc}</div>
                  </motion.button>
                ))}
              </div>
              <button
                type="button"
                onClick={dismissRescue}
                className="mt-4 w-full rounded-full border border-[#c4a574] px-3 py-2 text-sm text-ink-soft transition hover:bg-[#fff8ea]"
              >
                先不补救，返回重选
              </button>
            </div>
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  )
}
