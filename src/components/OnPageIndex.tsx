'use client';
import { useEffect, useState } from 'react';
import type { Heading } from '@/types';

interface Props {
  headings: Heading[];
}

export default function OnPageIndex({ headings }: Props) {
  const [activeId, setActiveId] = useState('');

  useEffect(() => {
    if (headings.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
          }
        }
      },
      { rootMargin: '-80px 0px -55% 0px', threshold: 0 }
    );

    headings.forEach(({ id }) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, [headings]);

  if (headings.length === 0) return <div className="w-[200px] flex-shrink-0 hidden xl:block" />;

  return (
    <aside className="w-[200px] flex-shrink-0 hidden xl:block py-8 pr-4">
      <p className="text-[10px] font-semibold text-textMuted/60 uppercase tracking-widest mb-4 px-2">
        On This Page
      </p>
      <ul className="space-y-0.5">
        {headings.map(({ id, text, level }) => (
          <li key={id}>
            <a
              href={`#${id}`}
              className={`block text-[13px] py-1 px-2 rounded-md transition-all duration-150 leading-snug
                ${level === 3 ? 'pl-4' : ''}
                ${activeId === id
                  ? 'text-neonPurple bg-neonPurple/[0.08]'
                  : 'text-textMuted hover:text-white/70 hover:bg-white/[0.03]'
                }`}
            >
              {text}
            </a>
          </li>
        ))}
      </ul>
    </aside>
  );
}
