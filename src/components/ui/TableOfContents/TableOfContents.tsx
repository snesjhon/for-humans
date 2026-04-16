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
  const visible = headings.filter((h) => h.level <= 2);

  return (
    <div>
      <p className="text-xs font-semibold mb-4 text-[var(--ms-text-body)]">
        {title}
      </p>
      <div className="space-y-0.5">
        {visible.map((heading) => {
          console.log({ heading });
          const isActive = activeId === heading.id;
          const isH3 = heading.level === 3;
          return (
            <a
              key={heading.id}
              href={`#${heading.id}`}
              className={`block rounded-md py-1.5 pr-2 text-xs leading-snug transition-colors no-underline hover:bg-[var(--ms-primary-surface)] focus:outline-none ${
                isH3 ? 'pl-6' : 'pl-2'
              } ${
                isActive
                  ? 'bg-[var(--ms-primary-surface)] font-medium text-[var(--ms-primary)]'
                  : isH3
                    ? 'text-[var(--ms-text-faint)]'
                    : 'text-[var(--ms-text-subtle)]'
              }`}
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
    </div>
  );
}
