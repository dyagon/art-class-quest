import { getChoice, getLesson } from './lessons'
import type { GameState, LessonId, LessonRecord, PassLight } from './types'

export function isPassingGrade(grade: LessonRecord['effectiveGrade']) {
  return grade === 'A' || grade === 'A+'
}

function visibleRecords(state: GameState): LessonRecord[] {
  return state.pendingRecord ? [...state.records, state.pendingRecord] : state.records
}

export function activeBonusCount(state: GameState) {
  return state.participatedLessons.length
}

export function aMinusCount(state: GameState) {
  return visibleRecords(state).filter((record) => record.effectiveGrade === 'A-').length
}

export function disciplinePenaltyCount(state: GameState) {
  return state.disciplineHit ? 1 : 0
}

export function penaltyCount(state: GameState) {
  return aMinusCount(state) + disciplinePenaltyCount(state)
}

export function uncoveredAMinus(state: GameState) {
  return Math.max(0, aMinusCount(state) - activeBonusCount(state))
}

export function uncoveredPenalty(state: GameState) {
  return Math.max(0, penaltyCount(state) - activeBonusCount(state))
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
  if (state.records.length < 4) return false
  if (state.records.some((record) => record.effectiveGrade === 'none')) return false
  return uncoveredPenalty(state) === 0
}

export function countedA(state: GameState) {
  return state.records.filter((record) => isPassingGrade(record.effectiveGrade)).length
}

export function getPassLight(state: GameState): PassLight {
  const records = visibleRecords(state)
  if (records.some((record) => record.rawGrade === 'none' || record.effectiveGrade === 'none')) {
    return 'red'
  }
  const uncovered = uncoveredPenalty(state)
  if (uncovered === 0) return 'green'
  if (state.phase.type === 'rescue') return 'yellow'
  if (remainingBonusSlots(state) >= uncovered) return 'yellow'
  return 'red'
}

export function diagnoseFail(state: GameState): string[] {
  const reasons: string[] = []
  if (state.disciplineHit && !isDisciplineCovered(state)) {
    reasons.push('第 2 课打断课堂，纪律 -1，未用积极加分弥补')
  }
  for (const record of state.records) {
    const lesson = getLesson(record.lessonId)
    if (record.effectiveGrade === 'none') {
      const choice = getChoice(record.lessonId, record.choiceId)
      reasons.push(
        choice.skipSubmit
          ? `${lesson.title}放弃创作，缺交作业`
          : `${lesson.title}忘记交作业，本课无成绩`,
      )
    }
  }
  const minus = aMinusCount(state)
  const bonus = activeBonusCount(state)
  const gap = uncoveredAMinus(state)
  if (gap > 0) {
    reasons.push(`有 ${minus} 个 A-，积极加分项 ${bonus} 个，还差 ${gap} 个才能弥补`)
  }
  return reasons
}

export function passLightCopy(light: PassLight) {
  if (light === 'green') return '完美通关中'
  if (light === 'yellow') return '处于危险 / 需补救'
  return '通关失败'
}

export function disciplineHudCopy(badge: DisciplineBadge) {
  if (badge === 'hit') return { title: '纪律 -1', hint: '可用积极加分弥补' }
  if (badge === 'covered') return { title: '纪律已弥补', hint: '积极加分已补回' }
  return { title: '纪律良好', hint: '课堂秩序稳定' }
}

export function passLightDetail(state: GameState) {
  const aCount = countedA(state)
  const bonus = activeBonusCount(state)
  const minus = aMinusCount(state)
  const badge = disciplineBadge(state)
  const disciplineBit =
    badge === 'hit' ? ' · 纪律 -1' : badge === 'covered' ? ' · 纪律已补' : ''
  return `A/A+ ${aCount}/4 · 加分 ${bonus} / A- ${minus}${disciplineBit}`
}
