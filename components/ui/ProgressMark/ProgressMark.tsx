import { Circle, CircleCheck } from 'lucide-react';

interface ProgressMarkProps {
  completed: boolean;
  className?: string;
}

export function ProgressMark({
  completed,
  className = '',
}: ProgressMarkProps) {
  const Icon = completed ? CircleCheck : Circle;

  return (
    <Icon
      aria-hidden="true"
      className={`${
        completed ? 'icon-circle-check' : 'icon-circle'
      } ${
        completed ? 'text-[var(--ms-primary)]' : 'text-[var(--ms-surface)]'
      } ${className}`.trim()}
    />
  );
}
