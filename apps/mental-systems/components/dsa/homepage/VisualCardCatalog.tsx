export function VisualCardCatalog() {
  const rows = [
    { k: '"name"', v: '"Alice"', bucket: 3 },
    { k: '"age"', v: '30', bucket: 7 },
    { k: '"city"', v: '"NYC"', bucket: 1 },
  ];
  return (
    <div className="py-[24px] px-[16px] flex flex-col gap-2 w-full">
      <div className="font-[ui-monospace,monospace] text-[0.52rem] text-[var(--fg-gutter)] mb-[4px] tracking-[0.06em] uppercase">
        card catalog
      </div>
      {rows.map(({ k, v, bucket }, i) => (
        <div key={i} className="flex items-center gap-[5px]">
          <div
            className="font-[ui-monospace,monospace] text-[0.65rem] text-[var(--orange)] rounded-[4px] px-[7px] py-[4px] whitespace-nowrap"
            style={{
              background: 'color-mix(in srgb, var(--orange) 8%, var(--bg))',
              border: '1px solid color-mix(in srgb, var(--orange) 25%, transparent)',
            }}
          >
            {k}
          </div>
          <span className="font-[ui-monospace,monospace] text-[0.55rem] text-[var(--fg-gutter)]">
            →
          </span>
          <div className="font-[ui-monospace,monospace] text-[0.55rem] text-[var(--fg-gutter)] bg-[var(--bg-alt)] border border-[var(--border)] rounded-[4px] px-[6px] py-[3px] whitespace-nowrap">
            slot {bucket}
          </div>
          <span className="font-[ui-monospace,monospace] text-[0.55rem] text-[var(--fg-gutter)]">
            →
          </span>
          <div
            className="font-[ui-monospace,monospace] text-[0.65rem] text-[#52b87a] rounded-[4px] px-[7px] py-[4px] flex-1 whitespace-nowrap overflow-hidden text-ellipsis"
            style={{
              background: 'color-mix(in srgb, #52b87a 7%, var(--bg))',
              border: '1px solid color-mix(in srgb, #52b87a 25%, transparent)',
            }}
          >
            {v}
          </div>
        </div>
      ))}
      <div className="font-[ui-monospace,monospace] text-[0.55rem] text-[var(--fg-gutter)] mt-[4px]">
        any key → O(1) lookup
      </div>
    </div>
  );
}
