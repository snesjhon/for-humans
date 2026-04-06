export function MentalModelMockup() {
  return (
    <div
      className="rounded-[0.875rem] overflow-hidden h-full flex flex-col border border-[var(--ctp-surface)] bg-[var(--ctp-bg-pane)] shadow-[0_4px_24px_rgba(0,0,0,0.06)]"
    >
      {/* problem header */}
      <div
        className="px-[18px] py-3 flex items-center gap-2.5 border-b border-b-[var(--ctp-surface)] bg-[var(--ctp-bg-pane-secondary)]"
      >
        <span className="font-[ui-monospace,monospace] text-[0.6rem] font-bold text-[var(--ctp-text-faint)]">
          217
        </span>
        <span className="w-[1px] h-[10px] bg-[var(--ctp-surface)] inline-block" />
        <span className="text-[0.875rem] font-semibold text-[var(--ctp-text-body)]">
          Contains Duplicate
        </span>
        <span className="ml-auto">
          <span className="font-[ui-monospace,monospace] text-[0.55rem] font-bold tracking-[0.1em] uppercase text-[var(--ctp-green)] bg-[var(--ctp-green-surface)] px-[7px] py-[2px] rounded-[3px]">
            Easy
          </span>
        </span>
      </div>

      {/* analogy section */}
      <div className="pt-[18px] px-[18px] pb-0 flex-1">
        <div className="flex items-center gap-1.5 mb-[14px]">
          <span className="font-[ui-monospace,monospace] text-[0.58rem] font-bold tracking-[0.1em] uppercase text-[var(--ctp-blue)]">
            📖 The Stamp Collector&apos;s Album
          </span>
        </div>
        <p className="font-display italic text-[0.9rem] leading-[1.65] text-[var(--ctp-text-subtle)] m-0 mb-[14px]">
          A collector scans a pile of stamps, checking their album before
          mounting each one. If the design is already mounted — a duplicate is
          found. Stop immediately.
        </p>
        <div className="flex gap-1.5 mb-[18px]">
          {[
            ['Hash Set', 'var(--ctp-blue)', 'var(--ctp-blue-surface)'],
            ['O(n) time', 'var(--ctp-blue)', 'var(--ctp-blue-surface)'],
          ].map(([lbl, color, bg]) => (
            <span
              key={lbl}
              className="px-[10px] py-[4px] rounded-[4px] text-[0.65rem] font-[ui-monospace,monospace] font-semibold"
              style={{ color, background: bg }}
            >
              {lbl}
            </span>
          ))}
        </div>
      </div>

      {/* trace preview strip */}
      <div
        className="px-[18px] py-3 flex gap-1.5 items-center border-t border-t-[var(--ctp-surface)] bg-[var(--ctp-bg-pane-secondary)]"
      >
        {[1, 2, 3, 1].map((n, i) => (
          <div
            key={i}
            style={{
              width: 32,
              height: 32,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              border: `1px solid ${i === 3 ? 'var(--ctp-blue)' : 'var(--ctp-surface)'}`,
              borderRadius: 5,
              fontFamily: 'ui-monospace, monospace',
              fontSize: '0.8rem',
              fontWeight: 700,
              background:
                i === 3
                  ? 'var(--ctp-blue-surface)'
                  : 'var(--ctp-bg-pane)',
              color: i === 3 ? 'var(--ctp-blue)' : 'var(--ctp-text-body)',
            }}
          >
            {n}
          </div>
        ))}
        <span className="font-[ui-monospace,monospace] text-[0.65rem] text-[var(--ctp-blue)] ml-[6px]">
          ← duplicate detected
        </span>
      </div>
    </div>
  );
}
