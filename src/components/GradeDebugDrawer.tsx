import { LESSONS } from '../game/lessons'
import { DEFAULT_GRADE_CONFIG, cloneConfig } from '../game/gradeConfig'
import { useGame } from '../game/GameContext'
import type { GradeConfigMap, TimingWeights } from '../game/types'
import { useMemo, useState } from 'react'

const TIMING_KEYS = ['onTime', 'late', 'finalMakeup'] as const
const TIMING_LABEL = {
  onTime: '及时上交',
  late: '晚交',
  finalMakeup: '期末补交',
}

export function GradeDebugDrawer() {
  const { debugOpen, setDebugOpen, config, updateConfig, restoreConfig } = useGame()
  const keys = useMemo(() => Object.keys(DEFAULT_GRADE_CONFIG), [])
  const [selectedKey, setSelectedKey] = useState(keys[0] ?? '')
  const weights = config[selectedKey]

  if (!debugOpen) return null

  const labelForKey = (key: string) => {
    const [lessonId, choiceId] = key.split(':')
    const lesson = LESSONS.find((item) => String(item.id) === lessonId)
    const choice = lesson?.choices.find((item) => item.id === choiceId)
    return `${lesson?.title ?? lessonId} · ${choice?.text ?? choiceId}`
  }

  const patch = (timing: keyof TimingWeights, field: 'APlus' | 'A' | 'AMinus', value: number) => {
    const next: GradeConfigMap = cloneConfig(config)
    next[selectedKey] = {
      ...next[selectedKey],
      [timing]: {
        ...next[selectedKey][timing],
        [field]: Number.isFinite(value) ? value : 0,
      },
    }
    updateConfig(next)
  }

  return (
    <aside className="absolute top-14 right-3 z-30 w-[min(24rem,calc(100%-1.5rem))] rounded-xl border border-[#b89a6d] bg-[#fffdf7] p-3 shadow-xl">
      <div className="mb-2 flex items-center justify-between">
        <h3 className="font-display text-lg">成绩概率调试</h3>
        <button type="button" className="text-xs text-ink-soft" onClick={() => setDebugOpen(false)}>
          关闭
        </button>
      </div>
      <p className="mb-2 text-[11px] leading-5 text-ink-soft">
        权重不必加总为 100，按比例掷骰。忘记交 / 放弃创作固定为未交；第 1 课「随便交了」固定 A-。
      </p>
      <select
        className="mb-3 w-full rounded-lg border border-[#d2ba90] bg-white px-2 py-1.5 text-xs"
        value={selectedKey}
        onChange={(event) => setSelectedKey(event.target.value)}
      >
        {keys.map((key) => (
          <option key={key} value={key}>
            {labelForKey(key)}
          </option>
        ))}
      </select>

      {weights
        ? TIMING_KEYS.map((timing) => (
            <div key={timing} className="mb-2 rounded-lg bg-[#f7edd8] p-2">
              <div className="mb-1 text-xs">{TIMING_LABEL[timing]}</div>
              <div className="grid grid-cols-3 gap-2">
                {(['APlus', 'A', 'AMinus'] as const).map((field) => (
                  <label key={field} className="text-[11px]">
                    {field === 'APlus' ? 'A+' : field === 'AMinus' ? 'A-' : 'A'}
                    <input
                      type="number"
                      min={0}
                      className="mt-0.5 w-full rounded border border-[#d2ba90] px-1 py-1"
                      value={weights[timing][field]}
                      onChange={(event) => patch(timing, field, Number(event.target.value))}
                    />
                  </label>
                ))}
              </div>
            </div>
          ))
        : null}

      <button
        type="button"
        onClick={restoreConfig}
        className="rounded-full border border-[#b89a6d] px-3 py-1 text-xs"
      >
        恢复默认权重
      </button>
    </aside>
  )
}
