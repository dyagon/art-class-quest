import { motion } from 'framer-motion'
import { useGame } from '../game/GameContext'
import { LESSONS, gradeLabel } from '../game/lessons'
import { aMinusCount, activeBonusCount, countedA, getPassLight, passLightCopy } from '../game/selectors'
import type { LessonId } from '../game/types'

const lightClass = {
  green: 'bg-[#3f6b4e]',
  yellow: 'bg-[#d4a84b]',
  red: 'bg-[#b23a2f]',
}

export function Hud() {
  const { state } = useGame()
  const light = getPassLight(state)
  const aCount = countedA(state)
  const bonus = activeBonusCount(state)
  const minus = aMinusCount(state)

  return (
    <section className="flex flex-wrap items-center gap-3 border-b border-[#c9b48d]/70 px-4 py-3 md:gap-4 md:px-5">
      <div className="flex flex-1 items-center gap-2">
        {LESSONS.map((lesson) => {
          const record = state.records.find((item) => item.lessonId === lesson.id)
          const pending = state.pendingRecord?.lessonId === lesson.id ? state.pendingRecord : null
          const shown = record ?? pending
          return (
            <ArtworkSlot
              key={lesson.id}
              lessonId={lesson.id}
              grade={shown?.effectiveGrade}
              rawGrade={shown?.rawGrade}
              active={state.phase.type !== 'ending' && state.currentLesson === lesson.id}
            />
          )
        })}
      </div>

      <motion.div
        animate={state.flashDiscipline ? { rotate: [0, -10, 8, -6, 0], x: [0, -3, 3, -2, 0] } : { rotate: 0 }}
        className={`min-w-28 rounded-xl border px-3 py-1.5 text-center text-xs ${
          state.disciplineHit
            ? 'border-[#8a2d2d] bg-[#f3d4d0] text-[#7a1f1f]'
            : 'border-[#6f9a78] bg-[#e5f0e4] text-[#2f5a3a]'
        }`}
      >
        <div className="font-display text-sm">{state.disciplineHit ? '纪律 -1' : '纪律良好'}</div>
        <div className="text-[10px] opacity-80">
          {state.disciplineHit ? '已扣除通关资格' : '课堂秩序稳定'}
        </div>
      </motion.div>

      <div className="rounded-xl border border-[#7d9bb8] bg-[#eef4ff] px-3 py-1.5 text-center text-xs text-[#2f4a6b]">
        <div className="font-display text-sm">积极加分项 {bonus}</div>
        <div className="text-[10px] opacity-80">可弥补 {bonus} 个 A-（现有 {minus} 个）</div>
      </div>

      <div className="flex items-center gap-2 rounded-xl border border-[#c9b48d] bg-[#fff8ea] px-3 py-1.5">
        <span className={`h-2.5 w-2.5 rounded-full ${lightClass[light]}`} />
        <div className="text-xs leading-tight">
          <div>{passLightCopy(light)}</div>
          <div className="text-[10px] text-ink-soft">
            A/A+ {aCount}/4 · 加分 {bonus} / A- {minus}
          </div>
        </div>
      </div>
    </section>
  )
}

function ArtworkSlot({
  lessonId,
  grade,
  rawGrade,
  active,
}: {
  lessonId: LessonId
  grade?: string
  rawGrade?: string
  active: boolean
}) {
  const filled = Boolean(grade)
  const glow = rawGrade === 'A+'

  return (
    <div
      className={`relative flex h-14 w-14 items-center justify-center rounded-md border-2 md:h-16 md:w-16 ${
        filled
          ? 'border-[#8a6a3d] bg-[#efe0c0]'
          : 'border-dashed border-[#b7a07a] bg-[#f7f0de]/70'
      } ${active ? 'ring-2 ring-[#d4a84b]/70' : ''} ${glow ? 'shadow-[0_0_16px_rgba(212,168,75,0.65)]' : ''}`}
    >
      {filled ? (
        <>
          <div className="h-8 w-8 rounded-sm bg-[#d8c09a]" />
          <span
            className={`stamp-seal absolute -right-1 -bottom-1 px-1 text-[10px] leading-4 ${
              grade === 'none' ? 'text-[#6b5648]' : grade === 'A-' ? 'text-[#b23a2f]' : 'text-[#b23a2f]'
            }`}
          >
            {gradeLabel(grade ?? 'none')}
          </span>
          {glow ? <span className="plus-float absolute -top-2 right-0 text-[11px] text-[#b8860b]">+1</span> : null}
        </>
      ) : (
        <span className="text-lg text-[#b7a07a]">?</span>
      )}
      <span className="absolute -top-2 left-1 rounded bg-[#fff8ea] px-1 text-[9px] text-ink-soft">
        {lessonId}
      </span>
    </div>
  )
}
