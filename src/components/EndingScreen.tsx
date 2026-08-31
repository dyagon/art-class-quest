import { motion } from 'framer-motion'
import { useState } from 'react'
import { useGame } from '../game/GameContext'
import { LESSONS, SUGGESTED_ROUTE, gradeLabel } from '../game/lessons'
import { aMinusCount, activeBonusCount, diagnoseFail, hasPassed, uncoveredAMinus } from '../game/selectors'
import { SceneBackdrop } from './SceneBackdrop'

export function EndingScreen() {
  const { state, reset } = useGame()
  const [showRoute, setShowRoute] = useState(false)
  if (state.phase.type !== 'ending') return null

  const passed = hasPassed(state)
  const reasons = diagnoseFail(state)
  const bonus = activeBonusCount(state)
  const minus = aMinusCount(state)
  const gap = uncoveredAMinus(state)

  return (
    <section className="relative min-h-0 flex-1 overflow-auto px-4 py-4 md:px-6">
      {passed ? <Confetti /> : null}
      <motion.div
        initial={{ rotateY: 80, opacity: 0 }}
        animate={{ rotateY: 0, opacity: 1 }}
        className="relative overflow-hidden rounded-2xl border border-[#d2ba90] bg-[#fff9ee]"
      >
        <SceneBackdrop sceneId={passed ? 'ending-pass' : 'ending-fail'} className="h-32 md:h-40" />
        <div className="px-5 py-4">
          {passed ? (
            <>
              <div className="stamp-seal mb-3 inline-block px-3 py-1 text-stamp">ALL-A PASS</div>
              <h2 className="font-display text-2xl">期末优秀艺术展架</h2>
              <p className="mt-2 text-sm leading-7 text-ink-soft">
                你不仅展现了出色的绘画技能，更具备解决突发问题、良好情绪管理与守时的艺术家品质！
              </p>
              <p className="mt-2 text-xs text-ink-soft">
                积极加分项 {bonus}，A- {minus} 个，已全部弥补。
              </p>
            </>
          ) : (
            <>
              <div className="ink-splash pointer-events-none absolute top-8 right-8 h-24 w-24 rounded-full bg-[#6b7280]" />
              <h2 className="font-display text-2xl">待精进艺术日志</h2>
              <p className="mt-2 text-sm text-ink-soft">
                这轮还没通关。积极加分项 {bonus}，A- {minus} 个
                {gap > 0 ? `，还差 ${gap} 个未弥补` : ''}。看看卡在哪里：
              </p>
              <ul className="mt-3 space-y-1 text-sm">
                {reasons.map((reason) => (
                  <li key={reason}>× {reason}</li>
                ))}
              </ul>
            </>
          )}

          <div className="mt-5 grid grid-cols-4 gap-2">
            {LESSONS.map((lesson) => {
              const record = state.records.find((item) => item.lessonId === lesson.id)
              return (
                <div key={lesson.id} className="rounded-lg border border-[#d2ba90] bg-[#f7ecd4] p-2 text-center">
                  <div className="text-[11px] text-ink-soft">{lesson.title}</div>
                  <div className="mt-2 font-display text-xl">{gradeLabel(record?.effectiveGrade ?? 'none')}</div>
                </div>
              )
            })}
          </div>

          <div className="mt-5 flex flex-wrap gap-2">
            <button
              type="button"
              onClick={reset}
              className="rounded-full bg-ink px-4 py-2 text-sm text-[#fff8ea]"
            >
              重新制定策略（再试一次）
            </button>
            {!passed ? (
              <button
                type="button"
                onClick={() => setShowRoute((value) => !value)}
                className="rounded-full border border-[#b89a6d] px-4 py-2 text-sm"
              >
                {showRoute ? '收起建议路线' : '查看全 A 通关标准路线'}
              </button>
            ) : null}
          </div>

          {showRoute ? (
            <ol className="mt-4 list-decimal space-y-1 pl-5 text-sm leading-6 text-ink-soft">
              {SUGGESTED_ROUTE.map((line) => (
                <li key={line}>{line}</li>
              ))}
            </ol>
          ) : null}
        </div>
      </motion.div>
    </section>
  )
}

function Confetti() {
  const pieces = Array.from({ length: 28 }, (_, index) => index)
  const colors = ['#b23a2f', '#d4a84b', '#3d6b8a', '#3f6b4e', '#fff6d1']
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      {pieces.map((piece) => (
        <span
          key={piece}
          className="confetti-piece absolute top-0 h-2 w-1.5 rounded-sm"
          style={{
            left: `${(piece * 37) % 100}%`,
            backgroundColor: colors[piece % colors.length],
            animationDelay: `${(piece % 8) * 0.08}s`,
          }}
        />
      ))}
    </div>
  )
}
