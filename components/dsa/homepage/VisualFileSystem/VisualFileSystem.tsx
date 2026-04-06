export function VisualFileSystem() {
  return (
    <div className="py-[22px] px-[16px] flex flex-col items-center gap-2 w-full">
      <div className="font-[ui-monospace,monospace] text-[0.52rem] text-[var(--ctp-text-faint)] mb-[4px] self-start tracking-[0.06em] uppercase">
        binary tree
      </div>
      {/* Root */}
      <div className="flex justify-center">
        <div
          className="w-[44px] h-[36px] flex items-center justify-center border-2 border-[var(--ctp-blue)] rounded-[6px] font-[ui-monospace,monospace] text-[0.85rem] font-bold text-[var(--ctp-blue)]"
          style={{ background: 'var(--ctp-blue-surface)' }}
        >
          15
        </div>
      </div>
      {/* Connectors */}
      <div className="relative w-full h-[12px]">
        <div className="absolute top-0 left-[50%] w-[28%] h-[1px] bg-[var(--ctp-surface)] -translate-x-full" />
        <div className="absolute top-0 left-[50%] w-[28%] h-[1px] bg-[var(--ctp-surface)]" />
      </div>
      {/* Level 2 */}
      <div className="flex gap-6">
        {[10, 20].map((n) => (
          <div
            key={n}
            className="w-[40px] h-[32px] flex items-center justify-center rounded-[5px] font-[ui-monospace,monospace] text-[0.75rem] font-semibold text-[var(--ctp-blue)]"
            style={{
              border: '1.5px solid var(--ctp-blue)',
              background: 'var(--ctp-blue-surface)',
            }}
          >
            {n}
          </div>
        ))}
      </div>
      {/* Level 3 */}
      <div className="flex gap-[6px]">
        {[8, 12, 17, 25].map((n) => (
          <div
            key={n}
            className="w-[32px] h-[26px] flex items-center justify-center border border-[var(--ctp-surface)] rounded-[4px] font-[ui-monospace,monospace] text-[0.65rem] text-[var(--ctp-text-faint)] bg-[var(--ctp-bg-pane)]"
          >
            {n}
          </div>
        ))}
      </div>
      <div className="font-[ui-monospace,monospace] text-[0.52rem] text-[var(--ctp-text-faint)] mt-[2px]">
        left &lt; parent &lt; right
      </div>
    </div>
  );
}
