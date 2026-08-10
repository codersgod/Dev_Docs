'use client';
import Link from 'next/link';
import { ChevronRight, Menu, X } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import type { SkillData } from '@/types';

interface Props {
  category: string;
  categoryData: SkillData;
  activeSlug: string;
}

export default function CurriculumNav({ category, categoryData, activeSlug }: Props) {
  if (!categoryData) return null;

  const activeRef = useRef<HTMLAnchorElement>(null);
  const scrollRef = useRef<HTMLElement>(null);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const el = activeRef.current;
    const container = scrollRef.current;
    if (!el || !container) return;
    const elTop = el.offsetTop;
    const elHeight = el.offsetHeight;
    const containerHeight = container.clientHeight;
    container.scrollTop = elTop - containerHeight / 2 + elHeight / 2;
  }, [activeSlug]);

  // Close drawer on route change
  useEffect(() => { setMobileOpen(false); }, [activeSlug]);

  const NavContent = (
    <>
      {/* Header */}
      <div className="px-4 py-4 border-b border-white/5 sticky top-0 bg-panel z-10">
        <Link
          href="/dashboard"
          className="text-textMuted hover:text-white text-xs flex items-center gap-1 transition-colors mb-3 group"
        >
          <ChevronRight size={12} className="rotate-180 group-hover:-translate-x-0.5 transition-transform" />
          Dashboard
        </Link>
        <div className="flex items-center gap-2">
          <div className="w-5 h-5 rounded bg-neonPurple/15 border border-neonPurple/30 flex items-center justify-center">
            <span className="text-neonPurple text-[9px] font-bold">{categoryData.icon}</span>
          </div>
          <span className="text-white font-semibold text-sm">{categoryData.title}</span>
        </div>
      </div>

      {/* Curriculum tree */}
      <nav className="flex-1 px-3 py-4">
        {categoryData.chapters.map((chapter) => (
          <div key={chapter.id} className="mb-5">
            <p className="text-[10px] font-semibold text-neonPurple/60 uppercase tracking-widest px-2 mb-2" style={{ textShadow: '0 0 8px rgba(180,77,255,0.4)' }}>
              {chapter.title}
            </p>
            <ul className="space-y-0.5">
              {chapter.topics.map((topic) => {
                const isActive = topic.slug === activeSlug;
                return (
                  <li key={topic.slug}>
                    <Link
                      ref={isActive ? activeRef : null}
                      href={`/notes/${category}/${topic.slug}`}
                      style={isActive ? { boxShadow: '0 0 0 1px rgba(180,77,255,0.4), 0 0 12px rgba(180,77,255,0.25)' } : {}}
                      className={`flex items-center gap-2 px-2 py-1.5 rounded-lg text-sm transition-all duration-150
                        ${isActive
                          ? 'bg-neonPurple/10 text-neonPurple border border-neonPurple/50 font-medium'
                          : 'text-textMuted hover:text-white hover:bg-white/[0.04] border border-transparent'
                        }`}
                    >
                      {isActive && (
                        <span className="w-1.5 h-1.5 rounded-full bg-neonPurple flex-shrink-0 shadow-[0_0_6px_2px_rgba(180,77,255,0.8)]" />
                      )}
                      <span className="leading-snug truncate">{topic.name}</span>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </nav>
    </>
  );

  return (
    <>
      {/* ── Mobile drawer overlay ── */}
      {mobileOpen && (
        <div
          className="md:hidden fixed inset-0 z-40 bg-black/60 backdrop-blur-sm"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* ── Mobile drawer ── */}
      <aside
        className={`md:hidden fixed top-0 left-0 z-50 h-full w-[280px] bg-panel border-r border-white/5 flex flex-col overflow-y-auto transition-transform duration-300 ${mobileOpen ? 'translate-x-0' : '-translate-x-full'}`}
      >
        <button
          onClick={() => setMobileOpen(false)}
          className="absolute top-3 right-3 text-textMuted hover:text-white p-1"
        >
          <X size={18} />
        </button>
        {NavContent}
      </aside>

      {/* ── Desktop sidebar ── */}
      <aside
        ref={scrollRef}
        className="hidden md:flex w-[240px] flex-shrink-0 bg-panel border-r border-white/5 h-full overflow-y-auto flex-col"
      >
        {NavContent}
      </aside>

      {/* ── Mobile hamburger button (rendered in page topbar via portal-like sibling) ── */}
      <button
        onClick={() => setMobileOpen(true)}
        className="md:hidden fixed bottom-5 left-4 z-30 w-11 h-11 rounded-full bg-neonPurple flex items-center justify-center shadow-glow-purple"
        aria-label="Open navigation"
      >
        <Menu size={18} className="text-white" />
      </button>
    </>
  );
}
