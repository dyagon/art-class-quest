import { motion } from 'framer-motion'
import { useGame } from '../game/GameContext'

export function TitleScreen() {
  const { start } = useGame()

  return (
    <button
      type="button"
      onClick={start}
      className="fixed inset-0 z-10 flex cursor-pointer flex-col items-center justify-center px-6 text-center"
    >
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-3xl bg-black/35 px-8 py-8 text-white shadow-2xl backdrop-blur-sm md:px-12"
      >
        <p className="text-sm tracking-[0.3em] text-white/80">ART CLASS QUEST</p>
        <h1 className="mt-2 font-display text-4xl md:text-5xl">美术课通关指南</h1>
        <p className="mt-4 text-sm text-white/85">四节课，一次通关练习</p>
        <p className="mt-8 text-base text-white">点击进入第一课</p>
      </motion.div>
    </button>
  )
}
