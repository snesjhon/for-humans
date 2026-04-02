'use client';

import { useEffect, useRef, useState } from 'react';

interface Heading {
  id: string;
  text: string;
  level: number;
}

interface TableOfContentsProps {
  headings: Heading[];
  title?: string;
}

export default function TableOfContents({
  headings,
  title = 'Contents',
}: TableOfContentsProps) {
  const [activeId, setActiveId] = useState<string>('');
  const observerRef = useRef<IntersectionObserver | null>(null);

  useEffect(() => {
    const allIds = headings.map((h) => h.id);

    observerRef.current = new IntersectionObserver(
      (entries) => {
        // Find the topmost visible heading
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (visible.length > 0) setActiveId(visible[0].target.id);
      },
      { rootMargin: '-80px 0px -60% 0px', threshold: 0 },
    );

    allIds.forEach((id) => {
      const el = document.getElementById(id);
      if (el) observerRef.current?.observe(el);
    });

    return () => observerRef.current?.disconnect();
  }, [headings]);

  if (headings.length === 0) return null;

  // Only show h2 and h3
  const visible = headings.filter((h) => h.level <= 3);

  return (
    <nav>
      <p className="text-xs font-semibold mb-4 text-[var(--fg)]">{title}</p>
      <div className="space-y-0.5">
        {visible.map((heading) => {
          const isActive = activeId === heading.id;
          const isH3 = heading.level === 3;
          return (
            <a
              key={heading.id}
              href={`#${heading.id}`}
              className="block text-xs leading-snug py-1.5 rounded-md transition-colors no-underline focus:outline-none"
              style={{
                paddingLeft: isH3 ? '1.5rem' : '0.5rem',
                paddingRight: '0.5rem',
                color: isActive
                  ? 'var(--blue)'
                  : isH3
                    ? 'var(--fg-gutter)'
                    : 'var(--fg-comment)',
                background: isActive ? 'var(--blue-tint)' : 'transparent',
                fontWeight: isActive ? '500' : '400',
              }}
              onClick={(e) => {
                e.preventDefault();
                document
                  .getElementById(heading.id)
                  ?.scrollIntoView({ behavior: 'smooth', block: 'start' });
                setActiveId(heading.id);
              }}
            >
              {heading.text}
            </a>
          );
        })}
      </div>
    </nav>
  );
}
