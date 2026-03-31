export function VisualTwoInspectors() {
  const chars = ['r', 'a', 'c', 'e', 'c', 'a', 'r'];
  const L = 2,
    R = 4;
  return (
    <div className="pt-[18px] px-[16px] pb-[12px]">
      <div
        className="flex justify-center gap-[3px] mb-[5px]"
      >
        {chars.map((c, i) => (
          <div
            key={i}
            style={{
              width: 27,
              height: 27,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              border: `1.5px solid ${i === L || i === R ? 'var(--blue)' : 'var(--border)'}`,
              borderRadius: 4,
              fontFamily: 'ui-monospace, monospace',
              fontSize: '0.72rem',
              fontWeight: i === L || i === R ? 700 : 400,
              background:
                i === L || i === R
                  ? 'color-mix(in srgb, var(--blue) 12%, var(--bg))'
                  : 'var(--bg)',
              color: i === L || i === R ? 'var(--blue)' : 'var(--fg-alt)',
            }}
          >
            {c}
          </div>
        ))}
      </div>
      <div
        className="flex justify-center gap-[3px] mb-[8px]"
      >
        {chars.map((_, i) => (
          <div
            key={i}
            className="w-[27px] text-center font-[ui-monospace,monospace] text-[0.5rem] text-[var(--blue)] font-bold"
          >
            {i === L ? 'L' : i === R ? 'R' : ''}
          </div>
        ))}
      </div>
      <div className="font-[ui-monospace,monospace] text-[0.62rem] text-[#52b87a] text-center">
        c == c ✓ — inspectors agree
      </div>
    </div>
  );
}
