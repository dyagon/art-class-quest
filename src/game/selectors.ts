import { getChoice, getLesson } from './lessons'
import {
  computeScore,
  formatBonusTally,
  isPassingGrade,
  type ScoreBreakdown,
  type ScoreSnapshot,
} from './scoreMath'
import type { GameState, LessonId, LessonRecord, PassLight } from './types'

export { isPassingGrade, formatBonusTally }
export type { ScoreBreakdown, ScoreSnapshot }

function visibleRecords(state: GameState): LessonRecord[] {
  return state.pendingRecord ? [...state.records, state.pendingRecord] : state.records
}

export function scoreSnapshotFromState(state: GameState): ScoreSnapshot {
  const records = visibleRecords(state)
  return {
    grades: records.map((record) => record.effectiveGrade),
    participateCount: state.participatedLessons.length,
    disciplineHit: state.disciplineHit,
    remainingBonusSlots: remainingBonusSlots(state),
    inRescue: state.phase.type === 'rescue',
    complete: state.phase.type === 'ending' && state.records.length >= 4,
  }
}

export function scoreFromState(state: GameState): ScoreBreakdown {
  return computeScore(scoreSnapshotFromState(state))
}

export function participateCount(state: GameState) {
  return state.participatedLessons.length
}

export function aPlusCount(state: GameState) {
  return visibleRecords(state).filter((record) => record.effectiveGrade === 'A+').length
}

/** 可抵扣加分 = 积极参与次数 + A+ 课次数 */
export function activeBonusCount(state: GameState) {
  return scoreFromState(state).bonus
}

export function aMinusCount(state: GameState) {
  return scoreFromState(state).aMinus
}

export function disciplinePenaltyCount(state: GameState) {
  return scoreFromState(state).discipline
}

export function penaltyCount(state: GameState) {
  return scoreFromState(state).penalty
}

export function uncoveredAMinus(state: GameState) {
  return Math.max(0, aMinusCount(state) - activeBonusCount(state))
}

export function uncoveredPenalty(state: GameState) {
  return scoreFromState(state).uncovered
}

export function isDisciplineCovered(state: GameState) {
  return state.disciplineHit && activeBonusCount(state) > aMinusCount(state)
}

export type DisciplineBadge = 'good' | 'hit' | 'covered'

export function disciplineBadge(state: GameState): DisciplineBadge {
  if (!state.disciplineHit) return 'good'
  if (isDisciplineCovered(state)) return 'covered'
  return 'hit'
}

export function remainingBonusSlots(state: GameState) {
  if (state.phase.type === 'intro' || state.phase.type === 'ending') return 0
  let slots = 0
  for (let lessonId = state.currentLesson; lessonId <= 4; lessonId += 1) {
    if (!state.participatedLessons.includes(lessonId as LessonId)) slots += 1
  }
  return slots
}

export function hasPassed(state: GameState) {
  if (state.phase.type !== 'ending') return false
  return scoreFromState(state).canPass
}

export function countedA(state: GameState) {
  return state.records.filter((record) => isPassingGrade(record.effectiveGrade)).length
}

export function getPassLight(state: GameState): PassLight {
  return scoreFromState(state).light
}

export function diagnoseFail(state: GameState): string[] {
  const reasons: string[] = []
  if (state.disciplineHit && !isDisciplineCovered(state)) {
    reasons.push('第 2 课打断课堂，纪律 -1，未用积极参与或 A+ 弥补')
  }
  for (const record of state.records) {
    const lesson = getLesson(record.lessonId)
    if (record.effectiveGrade === 'none') {
      const choice = getChoice(record.lessonId, record.choiceId)
      reasons.push(
        choice.skipSubmit
          ? `${lesson.title}放弃创作，不合格（缺交）`
          : `${lesson.title}忘记交作业，不合格（缺交）`,
      )
    }
  }
  const score = scoreFromState(state)
  const gap = Math.max(0, score.aMinus - score.bonus)
  if (gap > 0) {
    reasons.push(
      `有 ${score.aMinus} 个 A-，加分 ${score.bonus}（参与${score.participate} + A+${score.aPlus}），还差 ${gap} 个才能弥补 A-`,
    )
  } else if (score.uncovered > 0) {
    reasons.push(
      `加减分未齐：加分 ${score.bonus}（参与${score.participate} + A+${score.aPlus}），扣分 ${score.penalty}，还差 ${score.uncovered}`,
    )
  }
  return reasons
}

export function passLightCopy(light: PassLight) {
  if (light === 'green') return '完美通关中'
  if (light === 'yellow') return '处于危险 / 需补救'
  return '通关失败'
}

export function disciplineHudCopy(badge: DisciplineBadge) {
  if (badge === 'hit') return { title: '纪律 -1', hint: '可用积极参与或 A+ 弥补' }
  if (badge === 'covered') return { title: '纪律已弥补', hint: '加分已补回' }
  return { title: '纪律良好', hint: '课堂秩序稳定' }
}

export function passLightDetail(state: GameState) {
  const aCount = countedA(state)
  const score = scoreFromState(state)
  const badge = disciplineBadge(state)
  const disciplineBit =
    badge === 'hit' ? ' · 纪律 -1' : badge === 'covered' ? ' · 纪律已补' : ''
  return `A/A+ ${aCount}/4 · ${formatBonusTally(score)} / A- ${score.aMinus}${disciplineBit}`
}
