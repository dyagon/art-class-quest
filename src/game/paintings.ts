import type { LessonId } from './types'

export type Painting = {
  lessonId: LessonId
  title: string
  artist: string
  year: string
  src: string
}

export const LESSON_PAINTINGS: Record<LessonId, Painting> = {
  1: {
    lessonId: 1,
    title: '雅典学院',
    artist: '拉斐尔',
    year: '1509–1511',
    src: '/backgrounds/athens.jpg',
  },
  2: {
    lessonId: 2,
    title: '星月夜',
    artist: '文森特·梵高',
    year: '1889',
    src: '/backgrounds/starry.jpg',
  },
  3: {
    lessonId: 3,
    title: '千里江山图（节选）',
    artist: '王希孟',
    year: '1113',
    src: '/backgrounds/qianli.jpg',
  },
  4: {
    lessonId: 4,
    title: '红黄蓝构图',
    artist: '彼埃·蒙德里安',
    year: '1930',
    src: '/backgrounds/mondrian.jpg',
  },
}

export function getLessonPainting(lessonId: LessonId): Painting {
  return LESSON_PAINTINGS[lessonId]
}

export function getActivePainting(lessonId: LessonId, phaseType: string): Painting {
  if (phaseType === 'intro') return LESSON_PAINTINGS[1]
  return LESSON_PAINTINGS[lessonId]
}
