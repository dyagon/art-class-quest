import { useRef } from 'react'
import { useGame } from '../game/GameContext'

export function TopBar() {
  const { canUndo, undo, reset, debugOpen, setDebugOpen } = useGame()
  const clicks = useRef(0)
  const clickTimer = useRef<number>(0)

  return (
    <header className="flex items-center justify-between gap-3 border-b border-[#c9b48d]/70 px-4 py-2.5 md:px-5">
      <button
        type="button"
        className="font-display text-left text-lg text-ink md:text-xl"
        onClick={() => {
          window.clearTimeout(clickTimer.current)
          clicks.current += 1
          if (clicks.current >= 5) {
            clicks.current = 0
            setDebugOpen(!debugOpen)
            return
          }
          clickTimer.current = window.setTimeout(() => {
            clicks.current = 0
          }, 900)
        }}
        title="连续点标题 5 次可开关成绩概率调试"
      >
        美术课通关指南
      </button>
      <div className="flex shrink-0 items-center gap-2">
        <button
          type="button"
          onClick={undo}
          disabled={!canUndo}
          className="rounded-full border border-[#b89a6d] bg-[#fff8ea] px-3 py-1 text-xs text-ink-soft transition hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-40"
        >
          时光倒流
        </button>
        <button
          type="button"
          onClick={() => {
            if (window.confirm('确定要重置整局吗？')) reset()
          }}
          className="rounded-full border border-[#b89a6d] bg-[#fff1e4] px-3 py-1 text-xs text-ink-soft transition hover:-translate-y-0.5"
        >
          重置
        </button>
      </div>
    </header>
  )
}
