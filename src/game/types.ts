export type Grade = 'A+' | 'A' | 'A-' | 'none'

export type SubmitTiming = 'onTime' | 'late' | 'finalMakeup' | 'forgot'

export type LessonId = 1 | 2 | 3 | 4

export type RescueId = 'askTeacher' | 'participateLater' | 'gambleAPlus' | 'giveUp'

export type PassLight = 'green' | 'yellow' | 'red'

export type ChoiceTagType = 'warning' | 'time' | 'info'

export type GradeWeights = {
  APlus: number
  A: number
  AMinus: number
}

export type TimingWeights = {
  onTime: GradeWeights
  late: GradeWeights
  finalMakeup: GradeWeights
}

export type GradeConfigMap = Record<string, TimingWeights>

export type ChoiceTag = {
  label: string
  type: ChoiceTagType
}

export type Choice = {
  id: string
  text: string
  tags?: ChoiceTag[]
  forceGrade?: Grade
  skipSubmit?: boolean
  discipline?: -1
}

export type Lesson = {
  id: LessonId
  title: string
  prompt: string
  sceneId: string
  choices: Choice[]
}

export type LessonRecord = {
  lessonId: LessonId
  choiceId: string
  timing: SubmitTiming | null
  rawGrade: Grade
  rescue: RescueId | null
  effectiveGrade: Grade
  remediated: boolean
}

export type Phase =
  | { type: 'intro' }
  | { type: 'choice' }
  | { type: 'submit'; choiceId: string }
  | { type: 'rescue' }
  | { type: 'ending' }

export type GameState = {
  currentLesson: LessonId
  phase: Phase
  records: LessonRecord[]
  pendingRecord: LessonRecord | null
  participatedLessons: LessonId[]
  disciplineHit: boolean
  flashDiscipline: boolean
  lastRolledGrade: Grade | null
}

export type AppState = {
  present: GameState
  history: GameState[]
}

export type GameAction =
  | { type: 'START' }
  | { type: 'MARK_PARTICIPATE' }
  | { type: 'SELECT_CHOICE'; choiceId: string; config: GradeConfigMap }
  | { type: 'SELECT_TIMING'; timing: SubmitTiming; config: GradeConfigMap }
  | { type: 'SELECT_RESCUE'; rescue: RescueId }
  | { type: 'DISMISS_RESCUE' }
  | { type: 'UNDO' }
  | { type: 'RESET' }
  | { type: 'CLEAR_FLASH' }
