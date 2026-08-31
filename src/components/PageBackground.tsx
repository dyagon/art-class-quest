import { AnimatePresence, motion } from 'framer-motion'
import { getActivePainting } from '../game/paintings'
import type { GameState } from '../game/types'

export function PageBackground({ state }: { state: GameState }) {
  const painting = getActivePainting(state.currentLesson, state.phase.type)

  return (
    <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden bg-[#2b241c]">
      <AnimatePresence initial={false}>
        <motion.img
          key={painting.src}
          src={painting.src}
          alt={`${painting.artist}《${painting.title}》`}
          initial={{ opacity: 0, scale: 1.04 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.7, ease: 'easeOut' }}
          className="absolute inset-0 h-full w-full object-cover"
        />
      </AnimatePresence>
      <div className="page-veil absolute inset-0" />
      <p className="absolute right-3 bottom-3 rounded-full bg-black/40 px-3 py-1 text-[11px] text-white/90 backdrop-blur-sm">
        {painting.artist}《{painting.title}》 · {painting.year}
      </p>
    </div>
  )
}
