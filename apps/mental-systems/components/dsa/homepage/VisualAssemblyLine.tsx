export function VisualAssemblyLine() {
  const tape = [3, 0, 1, 0, 2];
  const W = 2,
    R = 3;
  return (
    <div className="py-[24px] px-[18px] flex flex-col gap-2 w-full">
      <div className="font-[ui-monospace,monospace] text-[0.52rem] text-[var(--fg-gutter)] mb-[2px] tracking-[0.06em] uppercase">
        conveyor belt
      </div>
      <div className="flex gap-[5px]">
        {tape.map((n, i) => (
          <div
            key={i}
            style={{
              flex: 1,
              height: 38,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              border: `1.5px solid ${i === W ? 'var(--blue)' : i === R ? 'var(--orange)' : i < W ? 'color-mix(in srgb, var(--blue) 40%, transparent)' : 'var(--border)'}`,
              borderRadius: 5,
              background:
                i === W
                  ? 'color-mix(in srgb, var(--blue) 14%, var(--bg))'
                  : i === R
                    ? 'color-mix(in srgb, var(--orange) 10%, var(--bg))'
                    : i < W
                      ? 'color-mix(in srgb, var(--blue) 7%, var(--bg))'
                      : 'var(--bg)',
              fontFamily: 'ui-monospace, monospace',
              fontSize: '0.875rem',
              fontWeight: i <= R ? 700 : 400,
              color:
                i === W
                  ? 'var(--blue)'
                  : i === R
                    ? 'var(--orange)'
                    : i < W
                      ? 'var(--blue)'
                      : 'var(--fg-gutter)',
            }}
          >
            {n}
          </div>
        ))}
      </div>
      <div className="flex gap-[5px]">
        {tape.map((_, i) => (
          <div
            key={i}
            className="flex-1 text-center font-[ui-monospace,monospace] text-[0.52rem] font-bold"
            style={{
              color:
                i === W
                  ? 'var(--blue)'
                  : i === R
                    ? 'var(--orange)'
                    : 'transparent',
            }}
          >
            {i === W ? 'W' : i === R ? 'R' : '.'}
          </div>
        ))}
      </div>
      <div className="font-[ui-monospace,monospace] text-[0.56rem] text-[var(--fg-gutter)] mt-[4px] leading-[1.6]">
        <span className="text-[var(--blue)] font-bold">W</span> places
        keepers
        <br />
        <span className="text-[var(--orange)] font-bold">R</span>{' '}
        inspects everything
      </div>
    </div>
  );
}
