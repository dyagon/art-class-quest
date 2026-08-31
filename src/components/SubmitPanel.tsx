import { motion } from 'framer-motion'
import { TIMING_OPTIONS } from '../game/lessons'
import type { SubmitTiming } from '../game/types'

const toneClass: Record<string, string> = {
  good: 'border-[#7ea37f] bg-[#eef6ea]',
  warn: 'border-[#d4a84b] bg-[#fff6dd]',
  alert: 'border-[#d0894a] bg-[#ffefe0]',
  danger: 'border-[#c56a60] bg-[#fdecea]',
}

type SubmitPanelProps = {
  onSelect: (timing: SubmitTiming) => void
}

export function SubmitPanel({ onSelect }: SubmitPanelProps) {
  return (
    <motion.div
      initial={{ height: 0, opacity: 0 }}
      animate={{ height: 'auto', opacity: 1 }}
      className="overflow-hidden"
    >
      <div className="mt-3 rounded-xl border border-dashed border-[#c4a574] bg-[#fffaf0]/90 p-3">
        <p className="mb-2 text-sm text-ink">你打算何时完成并上交这份作品？</p>
        <div className="grid grid-cols-2 gap-2">
          {TIMING_OPTIONS.map((option) => (
            <motion.button
              key={option.id}
              type="button"
              whileTap={{ scale: 0.98 }}
              onClick={() => onSelect(option.id)}
              className={`rounded-lg border px-2 py-2 text-left transition hover:-translate-y-0.5 ${toneClass[option.tone]}`}
            >
              <div className="text-sm">{option.label}</div>
              <div className="text-[11px] text-ink-soft">{option.hint}</div>
            </motion.button>
          ))}
        </div>
      </div>
    </motion.div>
  )
}
