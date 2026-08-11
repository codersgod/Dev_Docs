'use client';
import { useRouter } from 'next/navigation';
import { ChevronRight, BookOpen } from 'lucide-react';
import Masonry from 'react-masonry-css';
import type { SkillData, Chapter, Topic } from '@/types';

const SKILL_COLORS: Record<string, string> = {
  javascript: '#F7DF1E',
  nodejs: '#5FA04E',
  react: '#61DAFB',
  typescript: '#3178C6',
  nextjs: '#e2e8f0',
};

interface TopicItemProps {
  topic: Topic;
  skill: string;
}

function TopicItem({ topic, skill }: TopicItemProps) {
  const router = useRouter();
  return (
    <li>
      <button
        onClick={() => router.push(`/notes/${skill}/${topic.slug}`)}
        className="w-full text-left group flex items-start gap-2.5 px-2.5 py-2 rounded-lg hover:bg-neonPurple/[0.07] transition-all duration-150 border border-transparent hover:border-neonPurple/20"
      >
        <ChevronRight
          size={13}
          className="mt-[3px] text-neonPurple/30 group-hover:text-neonPurple/80 transition-colors flex-shrink-0"
        />
        <div className="min-w-0">
          <span className="text-sm text-white/70 group-hover:text-white transition-colors block truncate leading-snug">
            {topic.name}
          </span>
          <span className="text-[11px] text-textMuted/70 mt-0.5 block leading-snug line-clamp-2">
            {topic.desc}
          </span>
        </div>
      </button>
    </li>
  );
}

interface ChapterCardProps {
  chapter: Chapter;
  skill: string;
  accentColor: string;
}

function ChapterCard({ chapter, skill, accentColor }: ChapterCardProps) {
  return (
    <div className="masonry-item bg-panel border border-neonPurple/20 rounded-2xl p-5 hover:border-neonPurple/70 hover:shadow-glow-purple transition-all duration-300 animate-fade-in" style={{ boxShadow: '0 0 0 0.5px rgba(180,77,255,0.12)' }}>
      <div className="flex items-center gap-2 mb-4">
        <div
          className="w-1 h-4 rounded-full flex-shrink-0"
          style={{ background: accentColor }}
        />
        <h2 className="text-neonPurple/80 font-semibold text-sm leading-tight" style={{ textShadow: '0 0 10px rgba(180,77,255,0.5)' }}>{chapter.title}</h2>
      </div>
      <ul className="space-y-0.5">
        {chapter.topics.map((topic) => (
          <TopicItem key={topic.slug} topic={topic} skill={skill} />
        ))}
      </ul>
    </div>
  );
}

interface Props {
  skill: string;
  data: SkillData;
}

export default function TopicGrid({ skill, data }: Props) {
  const accentColor = SKILL_COLORS[skill] || '#b44dff';
  const totalTopics = data.chapters.reduce((acc, ch) => acc + ch.topics.length, 0);

  const breakpointColumns = {
    default: 4,
    1536: 4,
    1280: 3,
    768: 2,
    640: 1,
  };

  return (
    <div className="flex-1 overflow-y-auto">
      {/* Hero header */}
      <div className="sticky top-0 z-10 bg-canvas/80 backdrop-blur-sm border-b border-white/5 px-4 md:px-8 py-4">
        <div className="flex items-center gap-3">
          <BookOpen size={16} className="text-textMuted" />
          <div className="flex items-center gap-2">
            <span
              className="text-xs font-semibold px-2.5 py-0.5 rounded-full border"
              style={{
                color: accentColor,
                background: `${accentColor}15`,
                borderColor: `${accentColor}30`,
              }}
            >
              {data.chapters.length} Chapters
            </span>
            <span className="text-xs text-textMuted">{totalTopics} Topics</span>
          </div>
        </div>
      </div>

      <div className="px-4 md:px-8 py-4 md:py-6">
        {/* Skill header */}
        <div className="relative mb-8 p-6 bg-panel border border-neonPurple/20 rounded-2xl overflow-hidden" style={{ boxShadow: '0 0 0 1px rgba(180,77,255,0.15), 0 8px 60px rgba(180,77,255,0.15), 0 2px 20px rgba(180,77,255,0.1)' }}>
          {/* Radial purple fade behind the title */}
          <div
            className="absolute inset-0"
            style={{
              background: 'linear-gradient(to right, rgba(180,77,255,0.10) 0%, transparent 100%)',
            }}
          />
          <div className="relative">
            <h1 className="text-2xl font-bold text-white mb-1" style={{ textShadow: '0 0 30px rgba(180,77,255,0.5)' }}>{data.title}</h1>
            <p className="text-textMuted text-sm leading-relaxed">{data.description}</p>
          </div>
        </div>

        {/* Chapter cards masonry grid */}
        <Masonry
          breakpointCols={breakpointColumns}
          className="masonry-grid"
          columnClassName="masonry-column"
        >
          {data.chapters.map((chapter) => (
            <ChapterCard
              key={chapter.id}
              chapter={chapter}
              skill={skill}
              accentColor={accentColor}
            />
          ))}
        </Masonry>
      </div>
    </div>
  );
}
