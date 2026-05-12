export function VisualCardCatalog() {
  const rows = [
    { k: '"name"', v: '"Alice"', bucket: 3 },
    { k: '"age"', v: '30', bucket: 7 },
    { k: '"city"', v: '"NYC"', bucket: 1 },
  ];
  return (
    <div className="py-6 px-4 flex flex-col gap-2 w-full">
      <div className="font-[ui-monospace,monospace] text-[0.52rem] text-[var(--ms-text-faint)] mb-[4px] tracking-[0.06em] uppercase">
        card catalog
      </div>
      {rows.map(({ k, v, bucket }, i) => (
        <div key={i} className="flex items-center gap-[5px]">
          <div
            className="font-[ui-monospace,monospace] text-[0.65rem] text-[var(--ms-blue)] rounded px-[7px] py-1 whitespace-nowrap"
            style={{
              background: 'var(--ms-blue-surface)',
              border: '1px solid var(--ms-blue)',
            }}
          >
            {k}
          </div>
          <span className="font-[ui-monospace,monospace] text-[0.55rem] text-[var(--ms-text-faint)]">
            →
          </span>
          <div className="font-[ui-monospace,monospace] text-[0.55rem] text-[var(--ms-text-faint)] bg-[var(--ms-bg-pane-secondary)] border border-[var(--ms-surface)] rounded px-1.5 py-[3px] whitespace-nowrap">
            slot {bucket}
          </div>
          <span className="font-[ui-monospace,monospace] text-[0.55rem] text-[var(--ms-text-faint)]">
            →
          </span>
          <div
            className="font-[ui-monospace,monospace] text-[0.65rem] text-[#52b87a] rounded px-[7px] py-1 flex-1 whitespace-nowrap overflow-hidden text-ellipsis"
            style={{
              background: 'var(--ms-green-surface)',
              border: '1px solid #52b87a',
            }}
          >
            {v}
          </div>
        </div>
      ))}
      <div className="font-[ui-monospace,monospace] text-[0.55rem] text-[var(--ms-text-faint)] mt-[4px]">
        any key → O(1) lookup
      </div>
    </div>
  );
}
