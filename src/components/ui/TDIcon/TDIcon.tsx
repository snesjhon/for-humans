import { BrainCircuit } from 'lucide-react';

export function TDIcon({ size = 32 }: { size?: number }) {
  return (
    <span className="inline-flex rotate-90">
      <BrainCircuit size={size} strokeWidth={1.5} />
    </span>
  );
}
