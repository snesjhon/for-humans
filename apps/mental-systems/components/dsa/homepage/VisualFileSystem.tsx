export function VisualFileSystem() {
  return (
    <div className="py-[22px] px-[16px] flex flex-col items-center gap-2 w-full">
      <div className="font-[ui-monospace,monospace] text-[0.52rem] text-[var(--fg-gutter)] mb-[4px] self-start tracking-[0.06em] uppercase">
        binary tree
      </div>
      {/* Root */}
      <div className="flex justify-center">
        <div
          className="w-[44px] h-[36px] flex items-center justify-center border-2 border-[var(--purple)] rounded-[6px] font-[ui-monospace,monospace] text-[0.85rem] font-bold text-[var(--purple)]"
          style={{ background: 'color-mix(in srgb, var(--purple) 12%, var(--bg))' }}
        >
          15
        </div>
      </div>
      {/* Connectors */}
      <div className="relative w-full h-[12px]">
        <div className="absolute top-0 left-[50%] w-[28%] h-[1px] bg-[var(--border)] -translate-x-full" />
        <div className="absolute top-0 left-[50%] w-[28%] h-[1px] bg-[var(--border)]" />
      </div>
      {/* Level 2 */}
      <div className="flex gap-6">
        {[10, 20].map((n) => (
          <div
            key={n}
            className="w-[40px] h-[32px] flex items-center justify-center rounded-[5px] font-[ui-monospace,monospace] text-[0.75rem] font-semibold text-[var(--purple)]"
            style={{
              border: '1.5px solid color-mix(in srgb, var(--purple) 45%, transparent)',
              background: 'color-mix(in srgb, var(--purple) 7%, var(--bg))',
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
            className="w-[32px] h-[26px] flex items-center justify-center border border-[var(--border)] rounded-[4px] font-[ui-monospace,monospace] text-[0.65rem] text-[var(--fg-gutter)] bg-[var(--bg)]"
          >
            {n}
          </div>
        ))}
      </div>
      <div className="font-[ui-monospace,monospace] text-[0.52rem] text-[var(--fg-gutter)] mt-[2px]">
        left &lt; parent &lt; right
      </div>
    </div>
  );
}
