'use client';

import { useEffect, useRef, useId, useState } from 'react';

interface MermaidChartProps {
  chart: string;
}

function isDarkMode(): boolean {
  return document.documentElement.classList.contains('dark');
}

export default function MermaidChart({ chart }: MermaidChartProps) {
  const innerRef = useRef<HTMLDivElement>(null);
  const id = useId().replace(/:/g, '');
  const [error, setError] = useState<string | null>(null);
  const [dark, setDark] = useState(false);

  // Sync with the .dark class on <html> and watch for changes
  useEffect(() => {
    setDark(isDarkMode());
    const observer = new MutationObserver(() => setDark(isDarkMode()));
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!innerRef.current) return;
    let cancelled = false;

    async function run() {
      const mermaid = (await import('mermaid')).default;
      mermaid.initialize({
        startOnLoad: false,
        theme: dark ? 'dark' : 'default',
      });

      try {
        const { svg } = await mermaid.render(`mermaid-${id}`, chart.trim());
        if (cancelled || !innerRef.current) return;

        innerRef.current.innerHTML = svg;

        // Make SVG fill the column width responsively
        const svgEl = innerRef.current.querySelector('svg');
        if (svgEl) {
          svgEl.style.width = '100%';
          svgEl.style.height = 'auto';
        }
      } catch (err) {
        if (!cancelled) setError(String(err));
      }
    }

    run();
    return () => {
      cancelled = true;
    };
  }, [chart, id, dark]);

  return (
    <div className="my-7">
      <div ref={innerRef} />
      {error && (
        <pre
          className="text-[var(--ms-red)] text-[0.8rem] p-4 m-0"
        >
          [Mermaid parse error]{'\n'}
          {error}
        </pre>
      )}
    </div>
  );
}
