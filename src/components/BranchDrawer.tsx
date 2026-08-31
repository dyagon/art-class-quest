import { AnimatePresence, motion } from 'framer-motion'
import { useState } from 'react'
import { useGame } from '../game/GameContext'
import { TIMING_OPTIONS, getChoice, getLesson, gradeLabel } from '../game/lessons'
import { passLightDetail } from '../game/selectors'

export function BranchDrawer() {
  const { state } = useGame()
  const [open, setOpen] = useState(false)
  return (
    <footer className="border-t border-[#c9b48d]/70 bg-[#efe3c8]/80">
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        className="flex w-full items-center justify-between px-4 py-2 text-xs text-ink-soft md:px-5"
      >
        <span>已探索路线 {open ? '▾' : '▴'}</span>
        <span>{passLightDetail(state)}</span>
      </button>
      <AnimatePresence initial={false}>
        {open ? (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <div className="flex gap-3 overflow-x-auto px-4 pb-3 md:px-5">
              {state.records.length === 0 ? (
                <p className="text-xs text-ink-soft">还没有留下足迹。先做第一个决定吧。</p>
              ) : (
                state.records.map((record, index) => {
                  const lesson = getLesson(record.lessonId)
                  const choice = getChoice(record.lessonId, record.choiceId)
                  const timing = TIMING_OPTIONS.find((item) => item.id === record.timing)
                  return (
                    <div key={`${record.lessonId}-${index}`} className="flex items-center gap-3">
                      {index > 0 ? <div className="h-px w-6 bg-[#b89a6d]" /> : null}
                      <div className="min-w-40 rounded-xl border border-[#d2ba90] bg-[#fff8ea] px-3 py-2">
                        <div className="text-[11px] text-ink-soft">{lesson.title}</div>
                        <div className="text-sm">{choice.text}</div>
                        <div className="mt-1 text-[11px] text-ink-soft">
                          {timing ? `${timing.label} · ` : ''}
                          {gradeLabel(record.effectiveGrade)}
                          {record.remediated ? '（已补救）' : ''}
                          {record.rescue === 'giveUp' ? ' · 放弃补救' : ''}
                        </div>
                      </div>
                    </div>
                  )
                })
              )}
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </footer>
  )
}
