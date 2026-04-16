import { Circle, CircleCheck, Book, BookOpen } from 'lucide-react';

interface ProgressMarkProps {
  completed: boolean;
  fundamentals?: boolean;
}

export function ProgressMark({ completed, fundamentals }: ProgressMarkProps) {
  const CircleIcon = completed ? CircleCheck : Circle;
  const FundamentalIcon = completed ? Book : BookOpen;
  const Icon = fundamentals ? FundamentalIcon : CircleIcon;

  return (
    <Icon
      aria-hidden="true"
      className={`h-3.5 w-3.5 shrink-0 ${
        completed ? 'text-[var(--ms-primary)]' : 'text-[var(--ms-text-subtle)]'
      }`}
    />
  );
}
