export function VisualOdometer() {
  const pts = [
    { l: 'Start', m: 0 },
    { l: 'A', m: 10 },
    { l: 'B', m: 15 },
    { l: 'C', m: 30 },
  ];
  return (
    <div className="pt-[20px] px-[20px] pb-[10px]">
      <div className="relative mb-[6px]">
        <div className="h-[2px] bg-[var(--ctp-surface)] my-[10px]" />
        <div className="flex justify-between absolute top-0 left-0 right-0">
          {pts.map((p, i) => (
            <div
              key={i}
              className="flex flex-col items-center"
            >
              <div
                style={{
                  width: 6,
                  height: 6,
                  borderRadius: '50%',
                  background: i === 0 ? 'var(--ctp-text-faint)' : 'var(--ctp-peach)',
                  marginBottom: 2,
                  border: `2px solid ${i === 0 ? 'var(--ctp-text-faint)' : 'var(--ctp-peach)'}`,
                }}
              />
            </div>
          ))}
        </div>
      </div>
      <div className="flex justify-between mb-[10px]">
        {pts.map((p, i) => (
          <div
            key={i}
            className="flex flex-col items-center gap-[1px]"
          >
            <span
              style={{
                fontFamily: 'ui-monospace, monospace',
                fontSize: '0.55rem',
                color: i === 0 ? 'var(--ctp-text-faint)' : 'var(--ctp-peach)',
              }}
            >
              {p.l}
            </span>
            <span
              style={{
                fontFamily: 'ui-monospace, monospace',
                fontSize: '0.62rem',
                fontWeight: 700,
                color: i === 0 ? 'var(--ctp-text-faint)' : 'var(--ctp-peach)',
              }}
            >
              {p.m}
            </span>
          </div>
        ))}
      </div>
      <div className="font-[ui-monospace,monospace] text-[0.6rem] text-[var(--ctp-text-faint)] text-center">
        C − A ={' '}
        <span className="text-[var(--ctp-peach)] font-bold">
          30 − 10 = 20
        </span>{' '}
        miles
      </div>
    </div>
  );
}
