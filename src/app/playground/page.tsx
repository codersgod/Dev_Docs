import { Suspense } from 'react';
import PlaygroundClient from '@/components/PlaygroundClient';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Playground — FED Notes',
};

export default function PlaygroundPage() {
  return (
    <Suspense
      fallback={
        <div className="flex h-screen bg-canvas items-center justify-center">
          <div className="text-textMuted text-sm">Loading editor…</div>
        </div>
      }
    >
      <PlaygroundClient />
    </Suspense>
  );
}
