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
                border: `1.5px solid ${isDup ? '#d94f4f' : isMounted ? 'var(--purple)' : 'var(--border)'}`,
                borderRadius: 5,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 2,
                background: isDup
                  ? 'color-mix(in srgb, #d94f4f 10%, var(--bg))'
                  : isMounted
                    ? 'color-mix(in srgb, var(--purple) 8%, var(--bg))'
                    : 'var(--bg)',
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
                      ? 'var(--purple)'
                      : 'var(--fg-gutter)',
                }}
              >
                {n}
              </span>
              <span
                style={{
                  fontSize: '0.5rem',
                  color: isDup ? '#d94f4f' : 'var(--purple)',
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
      <div className="font-[ui-monospace,monospace] text-[0.58rem] text-[var(--fg-gutter)]">
        album = {'{'}
        <span className="text-[var(--purple)]">1, 2, 3</span>
        {'}'}
      </div>
    </div>
  );
}
