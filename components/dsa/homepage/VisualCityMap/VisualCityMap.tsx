export function VisualCityMap() {
  const nodes = [
    { id: 'A', x: 50, y: 10 },
    { id: 'B', x: 14, y: 42 },
    { id: 'C', x: 86, y: 42 },
    { id: 'D', x: 28, y: 80 },
    { id: 'E', x: 72, y: 80 },
  ];
  const edges = [
    ['A', 'B'],
    ['A', 'C'],
    ['B', 'C'],
    ['B', 'D'],
    ['C', 'E'],
    ['D', 'E'],
  ];
  return (
    <div className="pt-[22px] px-[14px] pb-[14px] w-full flex flex-col gap-2">
      <div className="font-[ui-monospace,monospace] text-[0.52rem] text-[var(--fg-gutter)] tracking-[0.06em] uppercase">
        city road map
      </div>
      <div className="relative h-[130px]">
        <svg
          className="absolute inset-0 w-full h-full"
          viewBox="0 0 100 95"
        >
          {edges.map(([a, b], i) => {
            const na = nodes.find((n) => n.id === a)!;
            const nb = nodes.find((n) => n.id === b)!;
            return (
              <line
                key={i}
                x1={na.x}
                y1={na.y}
                x2={nb.x}
                y2={nb.y}
                stroke="var(--border)"
                strokeWidth="1.5"
              />
            );
          })}
          {nodes.map(({ id, x, y }) => (
            <g key={id}>
              <circle
                cx={x}
                cy={y}
                r="10"
                fill="color-mix(in srgb, var(--blue) 10%, var(--bg))"
                stroke="var(--blue)"
                strokeWidth="1.5"
              />
              <text
                x={x}
                y={y + 4}
                textAnchor="middle"
                fontFamily="ui-monospace, monospace"
                fontSize="9"
                fontWeight="700"
                fill="var(--blue)"
              >
                {id}
              </text>
            </g>
          ))}
        </svg>
      </div>
      <div className="font-[ui-monospace,monospace] text-[0.55rem] text-[var(--fg-gutter)]">
        nodes + edges · visited set
      </div>
    </div>
  );
}
