export function VisualParkRanger() {
  const grid = [
    [1, 1, 0, 0],
    [1, 0, 0, 1],
    [0, 0, 0, 1],
    [0, 0, 0, 0],
  ];
  const flagged = new Set(['0,0', '0,1', '1,0', '1,3', '2,3']);
  return (
    <div className="pt-[14px] px-[16px] pb-[10px] flex flex-col items-center gap-2">
      <div className="flex flex-col gap-[3px]">
        {grid.map((row, r) => (
          <div key={r} className="flex gap-[3px]">
            {row.map((cell, c) => {
              const key = `${r},${c}`;
              const isFlag = flagged.has(key);
              return (
                <div
                  key={c}
                  className="w-[28px] h-[28px] flex items-center justify-center rounded-[3px] text-[0.62rem]"
                  style={{
                    border: `1px solid ${cell === 1 ? (isFlag ? 'var(--orange)' : '#52b87a') : 'var(--blue)'}`,
                    background:
                      cell === 1
                        ? isFlag
                          ? 'var(--orange-tint)'
                          : 'var(--green-tint)'
                        : 'var(--blue-tint)',
                    color:
                      cell === 1
                        ? isFlag
                          ? 'var(--orange)'
                          : '#52b87a'
                        : 'var(--blue)',
                  }}
                >
                  {isFlag ? '⚑' : cell === 1 ? '▪' : '~'}
                </div>
              );
            })}
          </div>
        ))}
      </div>
      <div className="font-[ui-monospace,monospace] text-[0.55rem] text-[var(--fg-gutter)]">
        <span className="text-[var(--orange)]">⚑</span> surveyed &nbsp;
        <span className="text-[#52b87a]">▪</span> land &nbsp;
        <span className="text-[var(--blue)]">~</span> ocean
      </div>
    </div>
  );
}
