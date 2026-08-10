import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import CurriculumNav from '@/components/CurriculumNav';
import MarkdownContent from '@/components/MarkdownContent';
import OnPageIndex from '@/components/OnPageIndex';
import { getNoteData } from '@/lib/markdown';
import curriculumData from '@/data/curriculum.json';
import type { CurriculumData } from '@/types';
import Link from 'next/link';
import { ExternalLink } from 'lucide-react';

interface Props {
  params: Promise<{ category: string; slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { category, slug } = await params;
  const note = getNoteData(category, slug);
  return {
    title: note ? `${note.title} — FED Notes` : 'Note — FED Notes',
    description: note?.description,
  };
}

export default async function NotePage({ params }: Props) {
  const { category, slug } = await params;
  const curriculum = curriculumData as CurriculumData;
  const categoryData = curriculum[category];

  if (!categoryData) notFound();

  const note = getNoteData(category, slug);

  // Find topic meta from curriculum even if md file doesn't exist
  const topicMeta = categoryData.chapters
    .flatMap((ch) => ch.topics)
    .find((t) => t.slug === slug);

  if (!topicMeta) notFound();

  return (
    <div className="flex h-screen bg-canvas overflow-hidden">
      {/* Left: Curriculum Nav (desktop sidebar + mobile drawer) */}
      <CurriculumNav
        category={category}
        categoryData={categoryData}
        activeSlug={slug}
      />

      {/* Middle: Content */}
      <main className="flex-1 overflow-y-auto">
        {/* Sticky top bar */}
        <div className="sticky top-0 z-10 bg-canvas/80 backdrop-blur-sm border-b border-white/5 px-4 md:px-8 py-3 flex items-center gap-2">
          <Link href="/dashboard" className="text-textMuted hover:text-white text-xs transition-colors">
            Dashboard
          </Link>
          <span className="text-white/15 text-xs">/</span>
          <span className="text-textMuted text-xs hidden sm:inline">{categoryData.title}</span>
          <span className="text-white/15 text-xs hidden sm:inline">/</span>
          <span className="text-white/70 text-xs truncate">{topicMeta.name}</span>

          <div className="flex-1" />

          {note?.firstCodeBlock && (
            <Link
              href={`/playground?code=${encodeURIComponent(note.firstCodeBlock)}&template=${note.playgroundTemplate || ''}`}
              className="flex items-center gap-1.5 text-neonPurple text-xs px-2 md:px-3 py-1 rounded-lg bg-neonPurple/10 border border-neonPurple/30 hover:bg-neonPurple/20 transition-colors whitespace-nowrap"
            >
              <ExternalLink size={11} />
              <span className="hidden sm:inline">Open in Playground</span>
              <span className="sm:hidden">Playground</span>
            </Link>
          )}
        </div>

        <div className="px-4 md:px-8 py-6 md:py-8 max-w-3xl">
          {note ? (
            <>
              {/* Note header */}
              <div className="mb-8">
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-xs text-neonPurple bg-neonPurple/10 border border-neonPurple/30 px-2 py-0.5 rounded-full font-medium">
                    {categoryData.title}
                  </span>
                </div>
                <h1 className="text-2xl md:text-3xl font-bold text-white mb-2 leading-tight">{note.title}</h1>
                <p className="text-textMuted text-sm leading-relaxed">{note.description}</p>
              </div>

              {/* Markdown content */}
              <MarkdownContent
                html={note.contentHtml}
                playgroundCode={note.firstCodeBlock}
                playgroundTemplate={note.playgroundTemplate}
              />
            </>
          ) : (
            /* Coming Soon state */
            <div className="text-center py-20">
              <div className="w-12 h-12 rounded-2xl bg-neonPurple/10 border border-neonPurple/30 flex items-center justify-center mx-auto mb-5">
                <span className="text-neonPurple text-xl">✍</span>
              </div>
              <h1 className="text-2xl font-bold text-white mb-2">{topicMeta.name}</h1>
              <p className="text-textMuted text-sm mb-6 max-w-sm mx-auto">{topicMeta.desc}</p>
              <div className="inline-flex items-center gap-2 text-sm text-textMuted bg-panel border border-white/5 px-4 py-2 rounded-xl">
                <span className="w-1.5 h-1.5 rounded-full bg-yellow-400 animate-pulse" />
                Content coming soon
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Right: On Page Index (xl only) */}
      <OnPageIndex headings={note?.headings ?? []} />
    </div>
  );
}
