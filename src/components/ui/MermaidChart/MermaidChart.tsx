'use client';

import { useEffect, useRef, useId, useState } from 'react';

interface MermaidChartProps {
  chart: string;
}

function isDarkMode(): boolean {
  return document.documentElement.classList.contains('dark');
}

function readThemeToken(name: string, fallback: string): string {
  const value = getComputedStyle(document.documentElement).getPropertyValue(name).trim();
  return value || fallback;
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
      const fontFamily = getComputedStyle(document.body).fontFamily || 'system-ui, sans-serif';
      const background = readThemeToken('--ms-bg-pane', dark ? '#1e1e2e' : '#eff1f5');
      const text = readThemeToken('--ms-text-body', dark ? '#cdd6f4' : '#4c4f69');
      const muted = readThemeToken('--ms-text-muted', dark ? '#a6adc8' : '#5c5f77');
      const surface = readThemeToken('--ms-surface', dark ? '#45475a' : '#ccd0da');
      const surfaceStrong = readThemeToken('--ms-surface-strong', dark ? '#585b70' : '#acb0be');
      const accent = readThemeToken('--ms-blue', dark ? '#89b4fa' : '#1e66f5');

      mermaid.initialize({
        startOnLoad: false,
        theme: 'base',
        themeVariables: {
          darkMode: dark,
          background,
          textColor: text,
          lineColor: surfaceStrong,
          fontFamily,
          xyChart: {
            backgroundColor: background,
            titleColor: text,
            xAxisLabelColor: muted,
            xAxisTitleColor: text,
            xAxisTickColor: surfaceStrong,
            xAxisLineColor: surface,
            yAxisLabelColor: muted,
            yAxisTitleColor: text,
            yAxisTickColor: surfaceStrong,
            yAxisLineColor: surface,
            plotColorPalette: accent,
          },
        },
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
