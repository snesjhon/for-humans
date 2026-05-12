export function VisualOdometer() {
  const pts = [
    { l: 'Start', m: 0 },
    { l: 'A', m: 10 },
    { l: 'B', m: 15 },
    { l: 'C', m: 30 },
  ];
  return (
    <div className="pt-5 px-5 pb-2.5">
      <div className="relative mb-1.5">
        <div className="h-[2px] bg-[var(--ms-surface)] my-[10px]" />
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
                  background: i === 0 ? 'var(--ms-text-faint)' : 'var(--ms-peach)',
                  marginBottom: 2,
                  border: `2px solid ${i === 0 ? 'var(--ms-text-faint)' : 'var(--ms-peach)'}`,
                }}
              />
            </div>
          ))}
        </div>
      </div>
      <div className="flex justify-between mb-2.5">
        {pts.map((p, i) => (
          <div
            key={i}
            className="flex flex-col items-center gap-px"
          >
            <span
              style={{
                fontFamily: 'ui-monospace, monospace',
                fontSize: '0.55rem',
                color: i === 0 ? 'var(--ms-text-faint)' : 'var(--ms-peach)',
              }}
            >
              {p.l}
            </span>
            <span
              style={{
                fontFamily: 'ui-monospace, monospace',
                fontSize: '0.62rem',
                fontWeight: 700,
                color: i === 0 ? 'var(--ms-text-faint)' : 'var(--ms-peach)',
              }}
            >
              {p.m}
            </span>
          </div>
        ))}
      </div>
      <div className="font-[ui-monospace,monospace] text-[0.6rem] text-[var(--ms-text-faint)] text-center">
        C − A ={' '}
        <span className="text-[var(--ms-peach)] font-bold">
          30 − 10 = 20
        </span>{' '}
        miles
      </div>
    </div>
  );
}
