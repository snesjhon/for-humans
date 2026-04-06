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

function readThemeColor(
  styles: CSSStyleDeclaration,
  name: string,
  fallback: string,
): string {
  const value = styles.getPropertyValue(name).trim();
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
      const styles = getComputedStyle(document.documentElement);
      const primary = readThemeColor(
        styles,
        '--ms-blue',
        dark ? '#89b4fa' : '#1e66f5',
      );
      const background = readThemeColor(
        styles,
        '--ms-bg-pane',
        dark ? '#1e1e2e' : '#eff1f5',
      );
      const backgroundAlt = readThemeColor(
        styles,
        '--ms-bg-pane-secondary',
        dark ? '#181825' : '#e6e9ef',
      );
      const foreground = readThemeColor(
        styles,
        '--ms-text-body',
        dark ? '#cdd6f4' : '#4c4f69',
      );
      const border = readThemeColor(
        styles,
        '--ms-surface',
        dark ? '#313244' : '#ccd0da',
      );

      const mermaid = (await import('mermaid')).default;
      mermaid.initialize({
        startOnLoad: false,
        theme: dark ? 'dark' : 'base',
        themeVariables: {
          primaryColor: backgroundAlt,
          primaryTextColor: foreground,
          primaryBorderColor: primary,
          secondaryColor: background,
          secondaryTextColor: foreground,
          secondaryBorderColor: primary,
          tertiaryColor: backgroundAlt,
          tertiaryTextColor: foreground,
          tertiaryBorderColor: border,
          background,
          mainBkg: backgroundAlt,
          nodeBorder: primary,
          clusterBkg: backgroundAlt,
          clusterBorder: border,
          titleColor: foreground,
          lineColor: primary,
          edgeLabelBackground: background,
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
          className="text-[var(--ms-red)] text-[0.8rem] p-4 m-0"
        >
          [Mermaid parse error]{'\n'}
          {error}
        </pre>
      )}
    </div>
  );
}
