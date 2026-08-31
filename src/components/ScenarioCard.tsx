import { useGame } from '../game/GameContext'
import { getLesson } from '../game/lessons'
import { ChoiceButtons } from './ChoiceButtons'
import { SceneBackdrop } from './SceneBackdrop'

export function ScenarioCard() {
  const { state, selectChoice, selectTiming, markParticipate } = useGame()
  if (state.phase.type === 'ending' || state.phase.type === 'intro') return null

  const lesson = getLesson(state.currentLesson)
  const expandedChoiceId = state.phase.type === 'submit' ? state.phase.choiceId : undefined
  const participated = state.participatedLessons.includes(state.currentLesson)

  return (
    <section className="flex min-h-0 flex-1 flex-col gap-4 overflow-auto px-4 py-4 md:px-6">
      <div className="overflow-hidden rounded-2xl border border-[#d2ba90] bg-[#fff9ee] shadow-inner">
        <SceneBackdrop sceneId={lesson.sceneId} className="h-36 md:h-52" />
        <div className="space-y-2 px-4 py-3">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="text-xs tracking-wide text-ink-soft">
              {lesson.title} / 共 4 课
            </div>
            <button
              type="button"
              onClick={markParticipate}
              disabled={participated}
              className="rounded-full border border-[#7d9bb8] bg-[#eef4ff] px-3 py-1 text-xs text-[#2f4a6b] transition hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {participated ? '本课已积极参与' : '积极参与回答问题'}
            </button>
          </div>
          <p className="font-display text-xl leading-relaxed md:text-2xl">{lesson.prompt}</p>
        </div>
      </div>

      <ChoiceButtons
        choices={lesson.choices}
        expandedChoiceId={expandedChoiceId}
        onChoose={selectChoice}
        onSelectTiming={selectTiming}
      />
    </section>
  )
}
