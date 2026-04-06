export function VisualStampAlbum() {
  return (
    <div className="pt-[18px] px-[20px] pb-[12px] flex flex-col gap-[10px]">
      <div className="flex gap-[6px] items-center">
        {[1, 2, 3, 1].map((n, i) => {
          const isDup = i === 3;
          const isMounted = i < 3;
          return (
            <div
              key={i}
              style={{
                width: 44,
                height: 52,
                border: `1.5px solid ${isDup ? '#d94f4f' : isMounted ? 'var(--ctp-mauve)' : 'var(--ctp-surface)'}`,
                borderRadius: 5,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 2,
                background: isDup
                  ? 'var(--ctp-red-surface)'
                  : isMounted
                    ? 'var(--ctp-blue-surface)'
                    : 'var(--ctp-bg-pane)',
              }}
            >
              <span
                style={{
                  fontFamily: 'ui-monospace, monospace',
                  fontSize: '1rem',
                  fontWeight: 700,
                  color: isDup
                    ? '#d94f4f'
                    : isMounted
                      ? 'var(--ctp-blue)'
                      : 'var(--ctp-text-faint)',
                }}
              >
                {n}
              </span>
              <span
                style={{
                  fontSize: '0.5rem',
                  color: isDup ? '#d94f4f' : 'var(--ctp-blue)',
                }}
              >
                {isDup ? 'dup!' : '✓'}
              </span>
            </div>
          );
        })}
        <div className="ml-[4px] font-[ui-monospace,monospace] text-[0.58rem] text-[#d94f4f] leading-[1.5]">
          already
          <br />
          in album!
        </div>
      </div>
      <div className="font-[ui-monospace,monospace] text-[0.58rem] text-[var(--ctp-text-faint)]">
        album = {'{'}
        <span className="text-[var(--ctp-blue)]">1, 2, 3</span>
        {'}'}
      </div>
    </div>
  );
}
