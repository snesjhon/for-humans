export function VisualTwoMessengers() {
  return (
    <div
      className="pt-[14px] px-[14px] pb-[10px] flex flex-col gap-[5px]"
    >
      {[
        {
          label: 'nums',
          vals: [1, 2, 3, 4],
          color: 'var(--ms-text-faint)',
          bg: 'var(--ms-bg-pane)',
          border: 'var(--ms-surface)',
        },
        {
          label: 'L →',
          vals: [1, 1, 2, 6],
          color: 'var(--ms-peach)',
          bg: 'var(--ms-peach-surface)',
          border: 'var(--ms-peach)',
        },
        {
          label: '← R',
          vals: [24, 12, 4, 1],
          color: 'var(--ms-blue)',
          bg: 'var(--ms-blue-surface)',
          border: 'var(--ms-blue)',
        },
        {
          label: 'out',
          vals: [24, 12, 8, 6],
          color: '#52b87a',
          bg: 'var(--ms-green-surface)',
          border: '#52b87a',
        },
      ].map(({ label, vals, color, bg, border }) => (
        <div
          key={label}
          className="flex items-center gap-[4px]"
        >
          <span
            className="font-[ui-monospace,monospace] text-[0.52rem] w-[32px] text-right shrink-0"
            style={{ color }}
          >
            {label}
          </span>
          {vals.map((n, i) => (
            <div
              key={i}
              style={{
                flex: 1,
                height: 26,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                border: `1px solid ${border}`,
                borderRadius: 4,
                fontFamily: 'ui-monospace, monospace',
                fontSize: '0.7rem',
                fontWeight: label === 'out' ? 700 : 500,
                background: bg,
                color,
              }}
            >
              {n}
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}
