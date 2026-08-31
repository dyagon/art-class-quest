import { configKey, getChoice } from './lessons'
import { rollGrade } from './gradeConfig'
import type {
  AppState,
  GameAction,
  GameState,
  Grade,
  GradeConfigMap,
  LessonId,
  LessonRecord,
  RescueId,
  SubmitTiming,
} from './types'

export function createInitialGameState(): GameState {
  return {
    currentLesson: 1,
    phase: { type: 'intro' },
    records: [],
    pendingRecord: null,
    participatedLessons: [],
    disciplineHit: false,
    flashDiscipline: false,
    lastRolledGrade: null,
  }
}

export function createInitialAppState(): AppState {
  return {
    present: createInitialGameState(),
    history: [],
  }
}

export function canUndo(state: GameState): boolean {
  return state.phase.type !== 'intro'
}

export function gameReducer(state: AppState, action: GameAction): AppState {
  if (action.type === 'UNDO') {
    const present = rewindLesson(state.present)
    if (present === state.present) return state
    return { present, history: [] }
  }

  if (action.type === 'RESET') {
    return createInitialAppState()
  }

  if (action.type === 'CLEAR_FLASH') {
    if (!state.present.flashDiscipline) return state
    return {
      ...state,
      present: { ...state.present, flashDiscipline: false },
    }
  }

  const nextPresent = reducePresent(state.present, action)
  if (nextPresent === state.present) return state
  return {
    present: nextPresent,
    history: [],
  }
}

function rewindLesson(state: GameState): GameState {
  if (state.phase.type === 'intro') return state

  if (state.phase.type === 'submit' || state.phase.type === 'rescue') {
    return {
      ...state,
      phase: { type: 'choice' },
      pendingRecord: null,
      lastRolledGrade: state.records.at(-1)?.rawGrade ?? null,
      flashDiscipline: false,
      disciplineHit: disciplineFromRecords(state.records),
    }
  }

  if (state.records.length === 0) {
    return createInitialGameState()
  }

  const dropped = state.records[state.records.length - 1]
  const records = state.records.slice(0, -1)
  return {
    ...state,
    currentLesson: dropped.lessonId,
    phase: { type: 'choice' },
    records,
    pendingRecord: null,
    lastRolledGrade: records.at(-1)?.rawGrade ?? null,
    participatedLessons: state.participatedLessons.filter((id) => id !== dropped.lessonId),
    disciplineHit: disciplineFromRecords(records),
    flashDiscipline: false,
  }
}

function disciplineFromRecords(records: LessonRecord[]): boolean {
  return records.some((record) => getChoice(record.lessonId, record.choiceId).discipline === -1)
}

function reducePresent(state: GameState, action: GameAction): GameState {
  switch (action.type) {
    case 'START':
      if (state.phase.type !== 'intro') return state
      return { ...state, phase: { type: 'choice' } }
    case 'MARK_PARTICIPATE':
      return markParticipate(state)
    case 'SELECT_CHOICE':
      return selectChoice(state, action.choiceId)
    case 'SELECT_TIMING':
      return selectTiming(state, action.timing, action.config)
    case 'SELECT_RESCUE':
      return selectRescue(state, action.rescue)
    case 'DISMISS_RESCUE':
      return dismissRescue(state)
    default:
      return state
  }
}

function selectChoice(state: GameState, choiceId: string): GameState {
  if (state.phase.type !== 'choice' && state.phase.type !== 'submit') return state

  if (state.phase.type === 'submit' && state.phase.choiceId === choiceId) {
    return {
      ...state,
      phase: { type: 'choice' },
      flashDiscipline: false,
      disciplineHit: disciplineFromRecords(state.records),
    }
  }

  const choice = getChoice(state.currentLesson, choiceId)
  const next: GameState = {
    ...state,
    disciplineHit: disciplineFromRecords(state.records) || choice.discipline === -1,
    flashDiscipline: choice.discipline === -1,
    lastRolledGrade: null,
  }

  if (choice.skipSubmit) {
    return settleLesson(next, makeRecord(state.currentLesson, choiceId, null, 'none'))
  }

  if (choice.forceGrade) {
    return applyGrade(next, makeRecord(state.currentLesson, choiceId, null, choice.forceGrade))
  }

  return {
    ...next,
    phase: { type: 'submit', choiceId },
  }
}

function selectTiming(state: GameState, timing: SubmitTiming, config: GradeConfigMap): GameState {
  if (state.phase.type !== 'submit') return state
  const choiceId = state.phase.choiceId

  if (timing === 'forgot') {
    return settleLesson(state, makeRecord(state.currentLesson, choiceId, timing, 'none'))
  }

  const weights = config[configKey(state.currentLesson, choiceId)]?.[timing]
  const grade = weights ? rollGrade(weights) : 'A-'
  return applyGrade(state, makeRecord(state.currentLesson, choiceId, timing, grade))
}

function selectRescue(state: GameState, rescue: RescueId): GameState {
  if (state.phase.type !== 'rescue' || !state.pendingRecord) return state
  const pending = applyRescueChoice(state.pendingRecord, rescue)
  return settleLesson({ ...state, pendingRecord: null }, pending)
}

function dismissRescue(state: GameState): GameState {
  if (state.phase.type !== 'rescue' || !state.pendingRecord) return state
  const pending = state.pendingRecord
  return {
    ...state,
    phase: pending.timing
      ? { type: 'submit', choiceId: pending.choiceId }
      : { type: 'choice' },
    pendingRecord: null,
    lastRolledGrade: state.records.at(-1)?.rawGrade ?? null,
  }
}

function applyGrade(state: GameState, record: LessonRecord): GameState {
  if (record.rawGrade === 'A-') {
    return {
      ...state,
      pendingRecord: record,
      lastRolledGrade: record.rawGrade,
      phase: { type: 'rescue' },
    }
  }
  return settleLesson(state, record)
}

function markParticipate(state: GameState): GameState {
  if (state.phase.type === 'intro' || state.phase.type === 'ending') return state
  if (state.participatedLessons.includes(state.currentLesson)) return state
  return {
    ...state,
    participatedLessons: [...state.participatedLessons, state.currentLesson],
  }
}

function settleLesson(state: GameState, record: LessonRecord): GameState {
  const records = [...state.records, record]
  if (state.currentLesson === 4) {
    return {
      ...state,
      records,
      pendingRecord: null,
      lastRolledGrade: record.rawGrade,
      phase: { type: 'ending' },
    }
  }

  const nextLesson = (state.currentLesson + 1) as LessonId
  return {
    ...state,
    records,
    pendingRecord: null,
    currentLesson: nextLesson,
    lastRolledGrade: record.rawGrade,
    phase: { type: 'choice' },
  }
}

function applyRescueChoice(record: LessonRecord, rescue: RescueId): LessonRecord {
  if (rescue === 'askTeacher') {
    return {
      ...record,
      rescue,
      effectiveGrade: 'A',
      remediated: true,
    }
  }
  return {
    ...record,
    rescue,
    effectiveGrade: 'A-',
    remediated: false,
  }
}

function makeRecord(
  lessonId: LessonId,
  choiceId: string,
  timing: SubmitTiming | null,
  grade: Grade,
): LessonRecord {
  return {
    lessonId,
    choiceId,
    timing,
    rawGrade: grade,
    rescue: null,
    effectiveGrade: grade,
    remediated: false,
  }
}
