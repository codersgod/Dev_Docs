'use client';
import { useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';

interface Props {
  html: string;
  playgroundCode?: string;
  playgroundTemplate?: string;
}

export default function MarkdownContent({ html, playgroundCode, playgroundTemplate }: Props) {
  const contentRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  useEffect(() => {
    const container = contentRef.current;
    if (!container) return;

    const codeWrappers = container.querySelectorAll<HTMLDivElement>('.code-block-wrapper');

    codeWrappers.forEach((wrapper, idx) => {
      wrapper.style.position = 'relative';

      /* ── Fade comment lines ── */
      const codeEl = wrapper.querySelector('code');
      if (codeEl && codeEl.textContent) {
        const lines = codeEl.textContent.split('\n');
        codeEl.innerHTML = lines.map(line => {
          const trimmed = line.trimStart();
          const isComment =
            trimmed.startsWith('//') ||
            trimmed.startsWith('#') ||
            trimmed.startsWith('/*') ||
            trimmed.startsWith('*') ||
            trimmed.startsWith('<!--');
          if (isComment) {
            return `<span style="color:rgba(255,255,255,0.28);font-style:italic">${line.replace(/</g,'&lt;').replace(/>/g,'&gt;')}</span>`;
          }
          return line.replace(/</g,'&lt;').replace(/>/g,'&gt;');
        }).join('\n');
      }

      /* ── Copy button ── */
      const copyBtn = document.createElement('button');
      copyBtn.textContent = 'Copy';
      copyBtn.className = 'code-copy-btn';
      Object.assign(copyBtn.style, {
        position: 'absolute',
        top: '10px',
        right: '10px',
        background: 'rgba(34, 85, 255, 0.15)',
        border: '1px solid rgba(34, 85, 255, 0.25)',
        color: 'rgba(34, 85, 255, 0.9)',
        padding: '3px 10px',
        borderRadius: '6px',
        fontSize: '11px',
        cursor: 'pointer',
        zIndex: '10',
        fontFamily: 'ui-monospace, monospace',
        letterSpacing: '0.02em',
      });
      copyBtn.addEventListener('click', () => {
        const code = wrapper.querySelector('code')?.textContent || '';
        navigator.clipboard.writeText(code).catch(() => {});
        copyBtn.textContent = '✓ Copied';
        setTimeout(() => { copyBtn.textContent = 'Copy'; }, 2000);
      });
      wrapper.appendChild(copyBtn);

      /* ── Try in Playground button (first code block only) ── */
      if (idx === 0) {
        const tryBtn = document.createElement('button');
        tryBtn.textContent = '▶ Try in Playground';
        tryBtn.className = 'code-try-btn';
        Object.assign(tryBtn.style, {
          position: 'absolute',
          bottom: '10px',
          right: '10px',
          background: 'rgba(34, 85, 255, 0.08)',
          border: '1px solid rgba(34, 85, 255, 0.18)',
          color: 'rgba(100, 140, 255, 0.85)',
          padding: '3px 10px',
          borderRadius: '6px',
          fontSize: '11px',
          cursor: 'pointer',
          zIndex: '10',
          fontFamily: 'ui-monospace, monospace',
          letterSpacing: '0.02em',
        });
        tryBtn.addEventListener('click', () => {
          const code = wrapper.querySelector('code')?.textContent || playgroundCode || '';
          const params = new URLSearchParams();
          if (code) params.set('code', encodeURIComponent(code));
          if (playgroundTemplate) params.set('template', playgroundTemplate);
          router.push(`/playground?${params.toString()}`);
        });
        wrapper.appendChild(tryBtn);
      }
    });

    // Cleanup on unmount
    return () => {
      container.querySelectorAll('.code-copy-btn, .code-try-btn').forEach((el) => el.remove());
    };
  }, [html, router, playgroundCode, playgroundTemplate]);

  return (
    <div
      ref={contentRef}
      className="markdown-content"
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}
