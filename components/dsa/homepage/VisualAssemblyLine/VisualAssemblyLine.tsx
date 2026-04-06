export function VisualAssemblyLine() {
  const tape = [3, 0, 1, 0, 2];
  const W = 2,
    R = 3;
  return (
    <div className="py-[24px] px-[18px] flex flex-col gap-2 w-full">
      <div className="font-[ui-monospace,monospace] text-[0.52rem] text-[var(--ctp-text-faint)] mb-[2px] tracking-[0.06em] uppercase">
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
              border: `1.5px solid ${i === W ? 'var(--ctp-blue)' : i === R ? 'var(--ctp-peach)' : i < W ? 'var(--ctp-blue)' : 'var(--ctp-surface)'}`,
              borderRadius: 5,
              background:
                i === W
                  ? 'var(--ctp-blue-surface)'
                  : i === R
                    ? 'var(--ctp-peach-surface)'
                    : i < W
                      ? 'var(--ctp-blue-surface)'
                      : 'var(--ctp-bg-pane)',
              fontFamily: 'ui-monospace, monospace',
              fontSize: '0.875rem',
              fontWeight: i <= R ? 700 : 400,
              color:
                i === W
                  ? 'var(--ctp-blue)'
                  : i === R
                    ? 'var(--ctp-peach)'
                    : i < W
                      ? 'var(--ctp-blue)'
                      : 'var(--ctp-text-faint)',
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
                  ? 'var(--ctp-blue)'
                  : i === R
                    ? 'var(--ctp-peach)'
                    : 'transparent',
            }}
          >
            {i === W ? 'W' : i === R ? 'R' : '.'}
          </div>
        ))}
      </div>
      <div className="font-[ui-monospace,monospace] text-[0.56rem] text-[var(--ctp-text-faint)] mt-[4px] leading-[1.6]">
        <span className="text-[var(--ctp-blue)] font-bold">W</span> places
        keepers
        <br />
        <span className="text-[var(--ctp-peach)] font-bold">R</span>{' '}
        inspects everything
      </div>
    </div>
  );
}
