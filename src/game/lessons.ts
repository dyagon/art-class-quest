import type { Lesson, LessonId, RescueId, SubmitTiming } from './types'

export const LESSONS: Lesson[] = [
  {
    id: 1,
    title: '第一节课',
    prompt: '画面不太满意，你打算怎么处理？',
    sceneId: 'lesson-1',
    choices: [
      { id: 'casual', text: '随便交了', forceGrade: 'A-' },
      {
        id: 'research',
        text: '回去找资料，努力画到最好',
        tags: [{ label: '耗费课外时间', type: 'time' }],
      },
      { id: 'ask-teacher', text: '求助老师，修改到满意' },
    ],
  },
  {
    id: 2,
    title: '第二节课',
    prompt: '和同学发生争执，课堂气氛一下子紧了起来。你怎么办？',
    sceneId: 'lesson-2',
    choices: [
      { id: 'after-class', text: '课后解决，先回到课堂活动' },
      {
        id: 'interrupt',
        text: '事情严重，必须打断课堂',
        tags: [{ label: '影响课堂纪律', type: 'warning' }],
        discipline: -1,
      },
    ],
  },
  {
    id: 3,
    title: '第三节课',
    prompt: '作品被意外损坏，或被一笔「毁了」。接下来呢？',
    sceneId: 'lesson-3',
    choices: [
      { id: 'angry', text: '生气，别无他法' },
      { id: 'clever', text: '巧妙利用，弄拙成巧' },
      {
        id: 'redraw',
        text: '重画，画到非常完美',
        tags: [{ label: '耗费课外时间', type: 'time' }],
      },
    ],
  },
  {
    id: 4,
    title: '第四节课',
    prompt: '老师下发的创作材料不见了。你怎么应对？',
    sceneId: 'lesson-4',
    choices: [
      { id: 'give-up', text: '放弃创作', skipSubmit: true },
      { id: 'found-materials', text: '在生活中寻找类似材料，作品反而更有新意' },
      { id: 'ask-materials', text: '课前找老师，及时补充材料' },
    ],
  },
]

export const TIMING_OPTIONS: { id: SubmitTiming; label: string; hint: string; tone: string }[] = [
  { id: 'onTime', label: '及时上交', hint: '标准评分', tone: 'good' },
  { id: 'late', label: '晚交', hint: '可能降级', tone: 'warn' },
  { id: 'finalMakeup', label: '期末补交', hint: '评分更严', tone: 'alert' },
  { id: 'forgot', label: '忘记交', hint: '本课未交', tone: 'danger' },
]

export const RESCUE_OPTIONS: { id: RescueId; emoji: string; title: string; desc: string }[] = [
  {
    id: 'askTeacher',
    emoji: '🙋',
    title: '请教老师并修改画面',
    desc: '直接修正为 A，达成通关要求',
  },
  {
    id: 'participateLater',
    emoji: '🎨',
    title: '承认短板，后续课堂积极参与',
    desc: '成绩仍为 A-。请在各课点「积极参与回答问题」，用加分项抵消 A- 和纪律扣分',
  },
  {
    id: 'gambleAPlus',
    emoji: '🎲',
    title: '赌一把！期待后续作业冲刺 A+',
    desc: '后续课抽到 A+ 只让那一课本身过关，不会改掉前面的 A-',
  },
  {
    id: 'giveUp',
    emoji: '🏳️',
    title: '放弃加分',
    desc: '锁定 A-，本课无法再补救',
  },
]

export const SUGGESTED_ROUTE = [
  '画面不满意时，不要随便交；去找资料或请教老师，并尽量及时上交。',
  '与同学争执时尽量课后解决。打断课堂会纪律 -1，但可用后续「积极参与」加分补回。',
  '作品损坏时优先弄拙成巧，或抽时间重画并及时交；生气放弃则很难拿到 A。',
  '材料丢失时自己找替代或找老师补，不要放弃创作。',
  '若得到 A- 或纪律扣分，优先请教老师改成 A；或在各课点「积极参与回答问题」，用加分项 1:1 抵消。',
]

export function getLesson(id: LessonId): Lesson {
  const lesson = LESSONS.find((item) => item.id === id)
  if (!lesson) throw new Error(`未知课程: ${id}`)
  return lesson
}

export function getChoice(lessonId: LessonId, choiceId: string) {
  const choice = getLesson(lessonId).choices.find((item) => item.id === choiceId)
  if (!choice) throw new Error(`未知选项: ${lessonId}/${choiceId}`)
  return choice
}

export function configKey(lessonId: LessonId, choiceId: string) {
  return `${lessonId}:${choiceId}`
}

export function gradeLabel(grade: string) {
  if (grade === 'none') return '未交'
  return grade
}
