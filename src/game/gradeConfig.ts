import { configKey } from './lessons'
import type { Grade, GradeConfigMap, GradeWeights, TimingWeights } from './types'

export const STORAGE_KEY = 'acq-grade-config'

const w = (APlus: number, A: number, AMinus: number): GradeWeights => ({
  APlus,
  A,
  AMinus,
})

const timings = (onTime: GradeWeights, late: GradeWeights, finalMakeup: GradeWeights): TimingWeights => ({
  onTime,
  late,
  finalMakeup,
})

export const DEFAULT_GRADE_CONFIG: GradeConfigMap = {
  [configKey(1, 'research')]: timings(w(35, 50, 15), w(10, 40, 50), w(5, 30, 65)),
  [configKey(1, 'ask-teacher')]: timings(w(40, 55, 5), w(15, 50, 35), w(8, 40, 52)),
  [configKey(2, 'after-class')]: timings(w(30, 55, 15), w(10, 45, 45), w(5, 35, 60)),
  [configKey(2, 'interrupt')]: timings(w(5, 35, 60), w(0, 20, 80), w(0, 10, 90)),
  [configKey(3, 'angry')]: timings(w(0, 0, 100), w(0, 0, 100), w(0, 0, 100)),
  [configKey(3, 'clever')]: timings(w(60, 35, 5), w(35, 45, 20), w(20, 50, 30)),
  [configKey(4, 'found-materials')]: timings(w(55, 40, 5), w(30, 50, 20), w(15, 50, 35)),
  [configKey(4, 'ask-materials')]: timings(w(35, 55, 10), w(12, 50, 38), w(6, 40, 54)),
  [configKey(3, 'redraw')]: timings(w(45, 45, 10), w(20, 50, 30), w(10, 40, 50)),
}

export function cloneConfig(config: GradeConfigMap): GradeConfigMap {
  return structuredClone(config)
}

export function loadGradeOverrides(): GradeConfigMap {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return {}
    return JSON.parse(raw) as GradeConfigMap
  } catch {
    return {}
  }
}

export function getMergedGradeConfig(): GradeConfigMap {
  return deepMergeConfig(DEFAULT_GRADE_CONFIG, loadGradeOverrides())
}

export function saveGradeConfig(config: GradeConfigMap) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(config))
}

export function resetGradeConfig() {
  localStorage.removeItem(STORAGE_KEY)
}

function deepMergeConfig(base: GradeConfigMap, overrides: GradeConfigMap): GradeConfigMap {
  const merged = cloneConfig(base)
  for (const [key, value] of Object.entries(overrides)) {
    merged[key] = {
      onTime: { ...merged[key]?.onTime, ...value.onTime },
      late: { ...merged[key]?.late, ...value.late },
      finalMakeup: { ...merged[key]?.finalMakeup, ...value.finalMakeup },
    }
  }
  return merged
}

export function rollGrade(weights: GradeWeights, random = Math.random): Grade {
  const total = Math.max(0, weights.APlus) + Math.max(0, weights.A) + Math.max(0, weights.AMinus)
  if (total <= 0) return 'A-'
  let cursor = random() * total
  if (cursor < weights.APlus) return 'A+'
  cursor -= weights.APlus
  if (cursor < weights.A) return 'A'
  return 'A-'
}
