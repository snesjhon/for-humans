'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';

export interface NavLink {
  href: string;
  label: string;
}

export interface SiteHeaderProps {
  title: string;
  homeHref?: string;
  icon?: React.ReactNode;
  navLinks?: NavLink[];
}

export function isActivePath(pathname: string, href: string): boolean {
  if (href === '/') return pathname === '/';
  return pathname === href || pathname.startsWith(href + '/');
}

export function SiteHeader({
  title,
  homeHref = '/',
  icon,
  navLinks = [],
}: SiteHeaderProps) {
  const [scrolled, setScrolled] = useState(false);
  const [dark, setDark] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    setDark(document.documentElement.classList.contains('dark'));
    const check = () => setScrolled(window.scrollY > 12);
    check();
    window.addEventListener('scroll', check, { passive: true });
    return () => window.removeEventListener('scroll', check);
  }, []);

  const toggleDark = () => {
    const next = !dark;
    document.documentElement.classList.toggle('dark', next);
    setDark(next);
  };

  return (
    <header
      className={`sticky top-0 z-50 transition-[background-color] duration-500 ${
        scrolled ? 'bg-[var(--bg)] backdrop-blur-[16px]' : 'bg-transparent'
      }`}
    >
      <div className="relative">
        <nav className="w-full flex items-center gap-6 h-[68px] px-10">
          <Link
            href={homeHref}
            className="no-underline flex items-center gap-[10px] shrink-0 focus:outline-none"
          >
            {icon}
            <span className="italic font-normal text-[1.125rem] text-[var(--fg)] tracking-[-0.01em] [font-family:var(--font-display)]">
              {title}
            </span>
          </Link>

          {navLinks.map((link) => {
            const active = isActivePath(pathname, link.href);
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`text-sm no-underline transition-colors ${
                  active
                    ? 'border-b-2 border-b-[var(--primary)] pb-[2px] font-medium text-[var(--primary)]'
                    : 'text-[var(--fg-comment)]'
                }`}
              >
                {link.label}
              </Link>
            );
          })}

          <div className="ml-auto" />

          <button
            onClick={toggleDark}
            aria-label="Toggle dark mode"
            className="bg-transparent border border-[var(--border)] rounded-[6px] px-[8px] py-[4px] cursor-pointer text-[var(--fg-comment)] text-[14px] leading-none shrink-0"
          >
            {dark ? '☀' : '◑'}
          </button>
        </nav>

        <div
          aria-hidden="true"
          className={`absolute bottom-0 left-0 right-0 h-px pointer-events-none bg-[var(--border-dark)] transition-opacity duration-[450ms] ${
            scrolled ? 'opacity-100' : 'opacity-0'
          }`}
        />
      </div>
    </header>
  );
}
