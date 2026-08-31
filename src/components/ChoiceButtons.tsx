import { motion } from 'framer-motion'
import type { Choice } from '../game/types'
import { SubmitPanel } from './SubmitPanel'
import type { SubmitTiming } from '../game/types'

const noteColors = ['#fff6d1', '#ffe8dc', '#e8f2ff']

const tagClass = {
  warning: 'bg-[#fdecea] text-[#9b2c2c]',
  time: 'bg-[#eef4ff] text-[#3d5a80]',
  info: 'bg-[#eef6ea] text-[#2f5a3a]',
}

type ChoiceButtonsProps = {
  choices: Choice[]
  expandedChoiceId?: string
  onChoose: (choiceId: string) => void
  onSelectTiming: (timing: SubmitTiming) => void
}

export function ChoiceButtons({
  choices,
  expandedChoiceId,
  onChoose,
  onSelectTiming,
}: ChoiceButtonsProps) {
  return (
    <div className="grid gap-3 md:grid-cols-3">
      {choices.map((choice, index) => {
        const expanded = expandedChoiceId === choice.id
        const dimmed = Boolean(expandedChoiceId) && !expanded
        return (
          <motion.div
            key={choice.id}
            layout
            className={`rounded-xl border border-[#d7c19a] p-3 shadow-[0_6px_0_rgba(160,120,70,0.12)] ${
              dimmed ? 'opacity-70' : ''
            }`}
            style={{
              backgroundColor: noteColors[index % noteColors.length],
              rotate: expanded ? 0 : index === 1 ? -1.2 : index === 2 ? 1.1 : -0.4,
            }}
          >
            <motion.button
              type="button"
              whileHover={{ y: -3 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => onChoose(choice.id)}
              className="w-full cursor-pointer text-left"
            >
              <div className="mb-1 text-[11px] text-ink-soft">选项 {index + 1}</div>
              <div className={`font-display text-lg leading-snug ${expanded ? 'highlighter' : ''}`}>
                {choice.text}
              </div>
              {choice.tags?.length ? (
                <div className="mt-2 flex flex-wrap gap-1">
                  {choice.tags.map((tag) => (
                    <span key={tag.label} className={`rounded-full px-2 py-0.5 text-[10px] ${tagClass[tag.type]}`}>
                      {tag.label}
                    </span>
                  ))}
                </div>
              ) : null}
            </motion.button>
            {expanded ? <SubmitPanel onSelect={onSelectTiming} /> : null}
          </motion.div>
        )
      })}
    </div>
  )
}
