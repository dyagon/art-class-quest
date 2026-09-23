import type { Grade, PassLight } from './types'

/** 成绩快照：供游戏局内与期末模拟器共用同一套加减分规则 */
export type ScoreSnapshot = {
  grades: Grade[]
  participateCount: number
  disciplineHit: boolean
  /** 仅过程灯用：还可再点几次「积极参与」 */
  remainingBonusSlots?: number
  /** 仅过程灯用：是否正在补救弹层 */
  inRescue?: boolean
  /** 通关判定：是否已有完整四课（模拟器默认 true） */
  complete?: boolean
}

export type ScoreBreakdown = {
  aPlus: number
  aMinus: number
  participate: number
  bonus: number
  discipline: number
  penalty: number
  uncovered: number
  hasFail: boolean
  canPass: boolean
  light: PassLight
  suggestions: string[]
}

export function isPassingGrade(grade: Grade) {
  return grade === 'A' || grade === 'A+'
}

export function countGrade(grades: Grade[], target: Grade) {
  return grades.filter((grade) => grade === target).length
}

export function computeScore(snapshot: ScoreSnapshot): ScoreBreakdown {
  const grades = snapshot.grades
  const aPlus = countGrade(grades, 'A+')
  const aMinus = countGrade(grades, 'A-')
  const participate = Math.max(0, snapshot.participateCount)
  const bonus = participate + aPlus
  const discipline = snapshot.disciplineHit ? 1 : 0
  const penalty = aMinus + discipline
  const uncovered = Math.max(0, penalty - bonus)
  const hasFail = grades.some((grade) => grade === 'none')
  const complete = snapshot.complete !== false
  const canPass = complete && grades.length >= 4 && !hasFail && uncovered === 0

  let light: PassLight
  if (hasFail) {
    light = 'red'
  } else if (uncovered === 0) {
    light = 'green'
  } else if (snapshot.inRescue) {
    light = 'yellow'
  } else if ((snapshot.remainingBonusSlots ?? 0) >= uncovered) {
    light = 'yellow'
  } else {
    light = 'red'
  }

  const suggestions = buildSuggestions({
    hasFail,
    uncovered,
    aMinus,
    aPlus,
    participate,
    discipline,
    canPass,
    remainingBonusSlots: snapshot.remainingBonusSlots ?? 0,
  })

  return {
    aPlus,
    aMinus,
    participate,
    bonus,
    discipline,
    penalty,
    uncovered,
    hasFail,
    canPass,
    light,
    suggestions,
  }
}

function buildSuggestions(input: {
  hasFail: boolean
  uncovered: number
  aMinus: number
  aPlus: number
  participate: number
  discipline: number
  canPass: boolean
  remainingBonusSlots: number
}): string[] {
  const tips: string[] = []

  if (input.hasFail) {
    tips.push('有课次不合格（缺交），必须先补交；缺交无法用加分弥补。')
  }

  if (input.uncovered > 0) {
    tips.push(
      `扣分缺口还差 ${input.uncovered}：可用「积极参与」加分，或冲刺更多 A+（每课 A+ 计 1 点抵扣）。`,
    )
    if (input.remainingBonusSlots > 0) {
      tips.push(`当前局内还剩约 ${input.remainingBonusSlots} 次积极参与机会。`)
    }
    if (input.discipline > 0 && input.participate + input.aPlus <= input.aMinus) {
      tips.push('纪律 -1 需在盖住全部 A- 之后，再用多出的加分弥补。')
    }
  }

  if (input.canPass) {
    tips.push('当前组合可达成期末优秀：无不合格，且 A- / 纪律扣分已被积极参与与 A+ 全部抵消。')
  } else if (!input.hasFail && input.uncovered === 0 && tips.length === 0) {
    tips.push('加减分已齐，确认四课都已结算即可通关。')
  }

  if (tips.length === 0) {
    tips.push('继续完成各课并留意通关灯提示。')
  }

  return tips
}

export function formatBonusTally(breakdown: Pick<ScoreBreakdown, 'bonus' | 'participate' | 'aPlus'>) {
  return `加分 ${breakdown.bonus}（参与${breakdown.participate} + A+${breakdown.aPlus}）`
}

export function formatPenaltyTally(
  breakdown: Pick<ScoreBreakdown, 'aMinus' | 'discipline'>,
) {
  return `A- ${breakdown.aMinus} 个${breakdown.discipline ? '，纪律 -1' : ''}`
}
