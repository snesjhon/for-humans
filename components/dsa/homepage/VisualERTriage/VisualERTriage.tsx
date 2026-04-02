export function VisualERTriage() {
  const levels = [[1], [3, 2], [8, 7, 4, 5]];
  const colors = [
    ['#d94f4f'],
    ['#d9804f', '#d9804f'],
    ['#a8a8a8', '#a8a8a8', '#a8a8a8', '#a8a8a8'],
  ];
  const sizes = [44, 36, 28];
  const fontSizes = ['1rem', '0.82rem', '0.68rem'];
  return (
    <div className="pt-[22px] px-[14px] pb-[14px] flex flex-col items-center gap-[7px] w-full">
      <div className="font-[ui-monospace,monospace] text-[0.52rem] text-[var(--fg-gutter)] self-start tracking-[0.06em] uppercase mb-[4px]">
        ER triage
      </div>
      <div className="font-[ui-monospace,monospace] text-[0.52rem] text-[var(--fg-gutter)] mb-[2px]">
        most critical always at top
      </div>
      {levels.map((row, r) => (
        <div
          key={r}
          className="flex justify-center gap-[7px]"
        >
          {row.map((n, c) => (
            <div
              key={c}
              style={{
                width: sizes[r],
                height: sizes[r],
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                border: `2px solid ${colors[r][c]}`,
                borderRadius: 6,
                background: `color-mix(in srgb, ${colors[r][c]} 12%, var(--bg))`,
                fontFamily: 'ui-monospace, monospace',
                fontSize: fontSizes[r],
                fontWeight: 700,
                color: colors[r][c],
              }}
            >
              {n}
            </div>
          ))}
        </div>
      ))}
      <div className="font-[ui-monospace,monospace] text-[0.54rem] text-[var(--fg-gutter)] mt-[4px] text-center leading-[1.6]">
        parent ≤ children
        <br />
        min always at root · O(log n)
      </div>
    </div>
  );
}
