import { BrainCircuit } from 'lucide-react';

export function AppIcon({ size = 32 }: { size?: number }) {
  return (
    <span style={{ display: 'inline-flex', transform: 'rotate(90deg)' }}>
      <BrainCircuit size={size} strokeWidth={1.5} />
    </span>
  );
}
