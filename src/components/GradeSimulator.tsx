import { AnimatePresence, motion } from 'framer-motion'
import { useEffect, useMemo, useState } from 'react'
import { useGame } from '../game/GameContext'
import { LESSONS, gradeLabel } from '../game/lessons'
import { computeScore, formatBonusTally, formatPenaltyTally } from '../game/scoreMath'
import { passLightCopy, scoreSnapshotFromState } from '../game/selectors'
import type { Grade, LessonId } from '../game/types'

const GRADE_OPTIONS: { value: Grade; label: string }[] = [
  { value: 'A+', label: 'A+' },
  { value: 'A', label: 'A' },
  { value: 'A-', label: 'A-' },
  { value: 'none', label: '不合格' },
]

const lightClass = {
  green: 'bg-[#3f6b4e]',
  yellow: 'bg-[#d4a84b]',
  red: 'bg-[#b23a2f]',
}

type LessonGrades = Record<LessonId, Grade>

function emptyGrades(): LessonGrades {
  return { 1: 'A', 2: 'A', 3: 'A', 4: 'A' }
}

function fromStateGrades(grades: Grade[]): LessonGrades {
  const next = emptyGrades()
  LESSONS.forEach((lesson, index) => {
    if (grades[index]) next[lesson.id] = grades[index]
  })
  return next
}

export function GradeSimulator() {
  const { state, simulatorOpen, setSimulatorOpen } = useGame()
  const [grades, setGrades] = useState<LessonGrades>(emptyGrades)
  const [participate, setParticipate] = useState(0)
  const [disciplineHit, setDisciplineHit] = useState(false)

  useEffect(() => {
    if (!simulatorOpen) return
    const snap = scoreSnapshotFromState(state)
    setGrades(fromStateGrades(snap.grades))
    setParticipate(snap.participateCount)
    setDisciplineHit(snap.disciplineHit)
    // 仅在打开时从当前局灌入，避免编辑过程中被局内状态冲掉
    // eslint-disable-next-line react-hooks/exhaustive-deps -- intentional open-only sync
  }, [simulatorOpen])

  const breakdown = useMemo(
    () =>
      computeScore({
        grades: [grades[1], grades[2], grades[3], grades[4]],
        participateCount: participate,
        disciplineHit,
        complete: true,
        remainingBonusSlots: Math.max(0, 4 - participate),
      }),
    [grades, participate, disciplineHit],
  )

  function syncFromGame() {
    const snap = scoreSnapshotFromState(state)
    setGrades(fromStateGrades(snap.grades))
    setParticipate(snap.participateCount)
    setDisciplineHit(snap.disciplineHit)
  }

  function resetDefaults() {
    setGrades(emptyGrades())
    setParticipate(0)
    setDisciplineHit(false)
  }

  return (
    <AnimatePresence>
      {simulatorOpen ? (
        <motion.div
          className="absolute inset-0 z-40 flex items-end justify-center bg-[#2a2118]/45 p-3 md:items-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => setSimulatorOpen(false)}
        >
          <motion.div
            role="dialog"
            aria-label="期末成绩模拟器"
            initial={{ y: 40, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 24, opacity: 0 }}
            className="max-h-[90%] w-full max-w-2xl overflow-auto rounded-2xl border border-[#d2ba90] bg-[#fff9ee] shadow-xl"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="sticky top-0 z-10 flex items-center justify-between border-b border-[#d2ba90]/80 bg-[#fff9ee]/95 px-4 py-3 backdrop-blur">
              <div>
                <h2 className="font-display text-xl">期末成绩模拟器</h2>
                <p className="text-[11px] text-ink-soft">手填等地与加减分，预测能否期末优秀</p>
              </div>
              <button
                type="button"
                onClick={() => setSimulatorOpen(false)}
                className="rounded-full border border-[#b89a6d] px-3 py-1 text-xs"
              >
                关闭
              </button>
            </div>

            <div className="space-y-4 px-4 py-4">
              <div className="grid gap-2 sm:grid-cols-2">
                {LESSONS.map((lesson) => (
                  <label
                    key={lesson.id}
                    className="flex items-center justify-between gap-2 rounded-xl border border-[#d2ba90] bg-[#f7ecd4] px-3 py-2"
                  >
                    <span className="text-sm">{lesson.title}</span>
                    <select
                      className="rounded-lg border border-[#c9b48d] bg-[#fff8ea] px-2 py-1 text-sm"
                      value={grades[lesson.id]}
                      onChange={(event) =>
                        setGrades((prev) => ({
                          ...prev,
                          [lesson.id]: event.target.value as Grade,
                        }))
                      }
                    >
                      {GRADE_OPTIONS.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  </label>
                ))}
              </div>

              <div className="flex flex-wrap items-center gap-3 rounded-xl border border-[#7d9bb8]/50 bg-[#eef4ff] px-3 py-3 text-sm text-[#2f4a6b]">
                <label className="flex items-center gap-2">
                  <span>积极参与</span>
                  <input
                    type="number"
                    min={0}
                    max={4}
                    value={participate}
                    onChange={(event) =>
                      setParticipate(Math.min(4, Math.max(0, Number(event.target.value) || 0)))
                    }
                    className="w-14 rounded-lg border border-[#9bb3cc] bg-white px-2 py-1 text-center"
                  />
                  <span className="text-xs opacity-80">/ 4</span>
                </label>
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={disciplineHit}
                    onChange={(event) => setDisciplineHit(event.target.checked)}
                  />
                  <span>纪律 -1</span>
                </label>
              </div>

              <div className="rounded-xl border border-[#d2ba90] bg-[#fff8ea] px-4 py-3">
                <div className="flex flex-wrap items-center gap-3">
                  <span className={`h-3 w-3 rounded-full ${lightClass[breakdown.light]}`} />
                  <span className="font-display text-lg">
                    {breakdown.canPass ? '预测：期末优秀' : `预测：${passLightCopy(breakdown.light)}`}
                  </span>
                </div>
                <p className="mt-2 text-xs text-ink-soft">
                  {formatBonusTally(breakdown)} · {formatPenaltyTally(breakdown)}
                  {breakdown.uncovered > 0 ? ` · 缺口 ${breakdown.uncovered}` : ' · 缺口 0'}
                </p>
                <div className="mt-3 grid grid-cols-4 gap-2">
                  {LESSONS.map((lesson) => {
                    const grade = grades[lesson.id]
                    const isFail = grade === 'none'
                    return (
                      <div
                        key={lesson.id}
                        className={`rounded-lg border p-2 text-center text-sm ${
                          isFail
                            ? 'border-[#b23a2f]/40 bg-[#f8e4e0] text-[#7a1f1f]'
                            : 'border-[#e0cfaa] bg-[#f7ecd4]'
                        }`}
                      >
                        <div className="text-[10px] text-ink-soft">{lesson.id}</div>
                        <div className="font-display">{gradeLabel(grade)}</div>
                      </div>
                    )
                  })}
                </div>
                <ul className="mt-3 space-y-1.5 text-sm leading-6 text-ink-soft">
                  {breakdown.suggestions.map((tip) => (
                    <li key={tip}>· {tip}</li>
                  ))}
                </ul>
              </div>

              <div className="flex flex-wrap gap-2 pb-1">
                <button
                  type="button"
                  onClick={syncFromGame}
                  className="rounded-full border border-[#7d9bb8] bg-[#eef4ff] px-3 py-1.5 text-xs text-[#2f4a6b]"
                >
                  从当前局填入
                </button>
                <button
                  type="button"
                  onClick={resetDefaults}
                  className="rounded-full border border-[#b89a6d] px-3 py-1.5 text-xs"
                >
                  重置为全 A
                </button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  )
}
