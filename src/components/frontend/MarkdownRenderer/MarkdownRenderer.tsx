'use client'

import BaseMarkdownRenderer, { type BaseSegment } from '@/components/ui/MarkdownRenderer/MarkdownRenderer'
import Evaluator from '../Evaluator/Evaluator'

interface EvaluatorSegment extends BaseSegment {
  type: 'evaluator'
  question: string
  index: number
}

function splitEvaluator(segments: BaseSegment[]): BaseSegment[] {
  let evaluatorIndex = 0
  const result: BaseSegment[] = []
  const fence = /^:::evaluator[ \t]*\r?\n([\s\S]*?)\r?\n:::[ \t]*$/gm

  for (const seg of segments) {
    if (seg.type !== 'markdown') {
      result.push(seg)
      continue
    }

    const text = (seg as BaseSegment & { text: string }).text
    let cursor = 0
    fence.lastIndex = 0
    let m: RegExpExecArray | null

    while ((m = fence.exec(text)) !== null) {
      if (m.index > cursor)
        result.push({ type: 'markdown', text: text.slice(cursor, m.index) })
      result.push({ type: 'evaluator', question: m[1].trim(), index: evaluatorIndex++ } as EvaluatorSegment)
      cursor = m.index + m[0].length
    }
    if (cursor < text.length)
      result.push({ type: 'markdown', text: text.slice(cursor) })
  }

  return result.filter(s => s.type !== 'markdown' || (s as BaseSegment & { text: string }).text.trim().length > 0)
}

interface Props {
  content: string
  className?: string
  prompts: string | string[]
  phase: number
  storageKeyPrefix: string
}

export default function MarkdownRenderer({ content, className, prompts, phase, storageKeyPrefix }: Props) {
  return (
    <BaseMarkdownRenderer
      content={content}
      className={className}
      extraPreprocessors={[splitEvaluator]}
      renderExtraSegment={(seg, i) => {
        if (seg.type !== 'evaluator') return null
        const { question, index } = seg as EvaluatorSegment
        const promptContent = Array.isArray(prompts)
          ? (prompts[index] ?? prompts[prompts.length - 1])
          : prompts
        return (
          <Evaluator
            key={i}
            question={question}
            promptContent={promptContent}
            phase={phase}
            storageKey={`${storageKeyPrefix}:${index}`}
          />
        )
      }}
    />
  )
}
