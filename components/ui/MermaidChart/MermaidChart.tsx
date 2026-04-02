'use client';

import { useEffect, useRef, useId, useState } from 'react';

interface MermaidChartProps {
  chart: string;
}

// Strip inline `style NodeName fill:#xxx` and `style NodeName fill:#xxx,stroke:#xxx,...`
// so all nodes use the theme's primaryColor instead of clashing hardcoded colors.
function stripInlineStyles(src: string): string {
  return src.replace(/^\s*style\s+\S+\s+fill:[^\n]*/gm, '');
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
        theme: dark ? 'dark' : 'base',
        themeVariables: dark ? {
          // Override accent to match the app's blue; dark theme handles
          // background, alternating row fills, and text contrast natively.
          primaryBorderColor: '#4a88d8',
          lineColor: '#4a88d8',
          edgeLabelBackground: '#1a2a2a',
          fontFamily: 'system-ui, -apple-system, sans-serif',
        } : {
          primaryColor: '#EDE8F8',
          primaryTextColor: '#303030',
          primaryBorderColor: '#583CAC',
          lineColor: '#583CAC',
          secondaryColor: '#E8F0FD',
          secondaryTextColor: '#303030',
          secondaryBorderColor: '#006CD8',
          tertiaryColor: '#E6F4EC',
          tertiaryTextColor: '#303030',
          tertiaryBorderColor: '#0A7F3D',
          background: '#F0F0FA',
          mainBkg: '#EDE8F8',
          nodeBorder: '#583CAC',
          clusterBkg: '#F0F0FA',
          titleColor: '#303030',
          edgeLabelBackground: '#FAFAFF',
          fontFamily: 'system-ui, -apple-system, sans-serif',
        },
      });

      try {
        const cleaned = stripInlineStyles(chart.trim());
        const { svg } = await mermaid.render(`mermaid-${id}`, cleaned);
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
          className="text-[var(--red)] text-[0.8rem] p-4 m-0"
        >
          [Mermaid parse error]{'\n'}
          {error}
        </pre>
      )}
    </div>
  );
}
