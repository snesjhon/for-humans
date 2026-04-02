export function VisualMountainClimber() {
  return (
    <div className="pt-[14px] px-[16px] pb-[10px] font-[ui-monospace,monospace] text-[0.72rem]">
      <div className="flex flex-col gap-1">
        <div className="flex items-center gap-[6px]">
          <span className="text-[var(--fg-gutter)] text-[0.6rem]">
            start
          </span>
          <span className="text-[var(--fg)] font-semibold">{`""`}</span>
          <span className="text-[var(--fg-gutter)] text-[0.55rem]">
            open=2, close=2
          </span>
        </div>
        <div className="flex flex-col gap-[3px] pl-[12px]">
          <div className="flex items-center gap-[5px]">
            <span className="text-[var(--fg-gutter)] text-[0.55rem]">
              ╰─
            </span>
            <span className="text-[#52b87a] font-bold">{`"("`}</span>
            <span className="text-[var(--fg-gutter)] text-[0.52rem]">
              open=1
            </span>
          </div>
          <div className="flex flex-col gap-[3px] pl-[16px]">
            <div className="flex items-center gap-[5px]">
              <span className="text-[var(--fg-gutter)] text-[0.52rem]">
                ├─
              </span>
              <span className="text-[#52b87a] font-bold">{`"(("`}</span>
              <span className="text-[var(--fg-gutter)] text-[0.52rem]">
                → "(())"{' '}
              </span>
              <span className="text-[#52b87a] text-[0.52rem]">✓</span>
            </div>
            <div className="flex items-center gap-[5px]">
              <span className="text-[var(--fg-gutter)] text-[0.52rem]">
                ╰─
              </span>
              <span className="text-[var(--blue)] font-bold">{`"()"`}</span>
              <span className="text-[var(--fg-gutter)] text-[0.52rem]">
                → "()()"{' '}
              </span>
              <span className="text-[#52b87a] text-[0.52rem]">✓</span>
            </div>
          </div>
        </div>
      </div>
      <div className="mt-[8px] text-[0.56rem] text-[var(--fg-gutter)]">
        <span className="text-[#52b87a]">(</span> = climb&nbsp;&nbsp;
        <span className="text-[var(--blue)]">)</span> =
        descend&nbsp;&nbsp;can&apos;t go below ground
      </div>
    </div>
  );
}
