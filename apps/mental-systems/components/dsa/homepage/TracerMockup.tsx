export function TracerMockup() {
  const nums = [1, 2, 3, 1];
  const result = [1, 1, 1, 0];
  const activeI = 3;

  return (
    <div
      className="border border-[var(--border)] rounded-[0.875rem] bg-[var(--bg)] shadow-[0_8px_32px_rgba(88,60,172,0.08),0_1px_4px_rgba(0,0,0,0.06)] overflow-hidden"
    >
      {/* header */}
      <div
        className="px-4 py-[10px] flex items-center gap-3 border-b border-b-[var(--border)] bg-[var(--bg-alt)]"
      >
        <span
          className="font-[ui-monospace,monospace] text-[0.58rem] tracking-[0.1em] text-[var(--purple)] font-bold uppercase px-2 py-[3px] rounded"
          style={{ background: 'color-mix(in srgb, var(--purple) 14%, transparent)' }}
        >
          FORWARD PASS
        </span>
        <span className="font-[ui-monospace,monospace] text-[0.7rem] text-[var(--fg-alt)]">
          album = <strong className="text-[var(--purple)]">3</strong>
        </span>
      </div>

      {/* grid */}
      <div className="px-5 pt-5 pb-4">
        <div className="flex items-start gap-[10px]">
          {/* row labels */}
          <div className="flex flex-col gap-1.5 pt-[12px]">
            {['nums', 'result'].map((lbl) => (
              <span
                key={lbl}
                className="font-[ui-monospace,monospace] text-[0.58rem] text-[var(--fg-gutter)] pr-[4px] h-11 flex items-center"
              >
                {lbl}
              </span>
            ))}
          </div>
          {/* columns */}
          <div className="flex gap-1.5">
            {nums.map((num, i) => {
              const isActive = i === activeI;
              const filled = i < activeI;
              return (
                <div
                  key={i}
                  className="flex flex-col items-center gap-1.5"
                >
                  {/* nums cell */}
                  <div
                    style={{
                      border: `1px solid ${isActive ? 'var(--purple)' : 'var(--border)'}`,
                      fontSize: '1rem',
                      fontFamily: 'ui-monospace, monospace',
                      background: isActive
                        ? 'color-mix(in srgb, var(--purple) 12%, var(--bg))'
                        : 'var(--bg)',
                      color: isActive ? 'var(--purple)' : 'var(--fg)',
                    }}
                    className="w-11 h-11 flex items-center justify-center rounded-md font-bold"
                  >
                    {num}
                  </div>
                  {/* result cell */}
                  <div
                    style={{
                      border: `1px solid ${isActive ? 'var(--purple)' : 'var(--border)'}`,
                      fontFamily: 'ui-monospace, monospace',
                      fontSize: '1rem',
                      fontWeight: filled ? 700 : 400,
                      background: filled
                        ? 'color-mix(in srgb, var(--purple) 8%, var(--bg))'
                        : isActive
                          ? 'color-mix(in srgb, var(--purple) 12%, var(--bg))'
                          : 'var(--bg)',
                      color:
                        filled || isActive ? 'var(--fg)' : 'var(--fg-gutter)',
                    }}
                    className="w-11 h-11 flex items-center justify-center rounded-md"
                  >
                    {result[i]}
                  </div>
                  <span className="font-[ui-monospace,monospace] text-[0.55rem] text-[var(--fg-gutter)]">
                    {i}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* label */}
        <div
          className="mt-[14px] px-3 py-[9px] rounded-md bg-[var(--bg-alt)] border border-[var(--border)]"
        >
          <p className="font-[ui-monospace,monospace] text-[0.72rem] text-[var(--fg-alt)] m-0 leading-[1.5]">
            Stamp <strong className="text-[var(--purple)]">1</strong>: already
            in album! →{' '}
            <strong className="text-[var(--green)]">return true ✓</strong>
          </p>
        </div>
      </div>

      {/* footer */}
      <div
        className="px-4 py-[10px] flex items-center justify-between border-t border-t-[var(--border)] bg-[var(--bg-alt)]"
      >
        <div className="flex gap-3">
          {['■ prefix stored', '■ final value'].map((lbl) => (
            <span
              key={lbl}
              className="font-[ui-monospace,monospace] text-[0.58rem] text-[var(--fg-gutter)]"
            >
              {lbl}
            </span>
          ))}
        </div>
        <div className="flex items-center gap-[8px]">
          {['← Prev', '5 / 6', 'Next →'].map((t, i) =>
            i === 1 ? (
              <span
                key={t}
                className="font-[ui-monospace,monospace] text-[0.68rem] text-[var(--fg-gutter)]"
              >
                {t}
              </span>
            ) : (
              <button
                key={t}
                className="border border-[var(--border)] bg-[var(--bg)] font-[ui-monospace,monospace] text-[0.68rem] text-[var(--fg-alt)] px-[10px] py-1 rounded cursor-pointer"
              >
                {t}
              </button>
            ),
          )}
        </div>
      </div>
    </div>
  );
}
