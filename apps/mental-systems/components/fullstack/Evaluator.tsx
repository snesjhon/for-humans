'use client';

import { useState } from 'react';
import ChatSidebar from './ChatSidebar';

interface EvaluatorProps {
  promptContent: string;
  phase: number;
  storageKey?: string;
  question?: string;
}

export default function Evaluator({
  promptContent,
  phase,
  storageKey,
  question,
}: EvaluatorProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="border-b border-b-[var(--border)] pb-6">
      <p className="font-[ui-monospace,monospace] text-[0.65rem] font-bold tracking-[0.1em] uppercase text-[var(--fg-gutter)] mb-4">
        Check your understanding
      </p>

      {question && (
        <div
          className="py-4 px-5 rounded-xl mb-4 bg-[var(--purple-tint)]"
          style={{
            border:
              '1px solid color-mix(in srgb, var(--purple) 25%, transparent)',
          }}
        >
          <p className="text-base font-medium text-[var(--fg)] m-0 leading-[1.6]">
            {question}
          </p>
        </div>
      )}

      <button
        onClick={() => setIsOpen(true)}
        className="py-[8px] px-[20px] rounded-[6px] bg-[var(--purple)] text-white text-sm font-semibold border-0 cursor-pointer"
      >
        Discuss it →
      </button>

      <ChatSidebar
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        promptContent={promptContent}
        phase={phase}
        storageKey={storageKey}
        question={question}
      />
    </div>
  );
}
