/** 配图提示词见 docs/scene-prompts.md；出图后把 imageSrc 填为 /scenes/*.png */

export type SceneId =
  | 'lesson-1'
  | 'lesson-2'
  | 'lesson-3'
  | 'lesson-4'
  | 'rescue'
  | 'ending-pass'
  | 'ending-fail'

export type SceneDef = {
  id: SceneId
  name: string
  placeholderColor: string
  imageSrc: string
}

export const SCENES: Record<SceneId, SceneDef> = {
  'lesson-1': {
    id: 'lesson-1',
    name: '凌乱的画纸',
    placeholderColor: '#E8D5B7',
    imageSrc: '/scenes/lesson-1.png',
  },
  'lesson-2': {
    id: 'lesson-2',
    name: '课堂争执',
    placeholderColor: '#7A8B99',
    imageSrc: '/scenes/lesson-2.png',
  },
  'lesson-3': {
    id: 'lesson-3',
    name: '被毁的作品',
    placeholderColor: '#3D4F4A',
    imageSrc: '/scenes/lesson-3.png',
  },
  'lesson-4': {
    id: 'lesson-4',
    name: '丢失的材料',
    placeholderColor: '#C4A574',
    imageSrc: '/scenes/lesson-4.png',
  },
  rescue: {
    id: 'rescue',
    name: '灵感补救',
    placeholderColor: '#4A3F55',
    imageSrc: '/scenes/rescue.png',
  },
  'ending-pass': {
    id: 'ending-pass',
    name: '期末艺术展',
    placeholderColor: '#D4A84B',
    imageSrc: '/scenes/ending-pass.png',
  },
  'ending-fail': {
    id: 'ending-fail',
    name: '待精进日志',
    placeholderColor: '#6B7280',
    imageSrc: '/scenes/ending-fail.png',
  },
}

export function getScene(id: string): SceneDef {
  return SCENES[id as SceneId] ?? SCENES['lesson-1']
}
