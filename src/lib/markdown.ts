import 'server-only';
import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { marked } from 'marked';
import type { NoteData, Heading } from '@/types';

// Escape HTML entities in code blocks
function escapeHtml(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

// Configure marked with custom renderer
marked.use({
  renderer: {
    code({ text, lang }: { text: string; lang?: string }) {
      const language = lang || 'plaintext';
      const escaped = escapeHtml(text);
      return `<div class="code-block-wrapper"><pre class="code-pre"><code class="language-${language}">${escaped}</code></pre></div>`;
    },
    heading({ tokens, depth }: any) {
      const text = this.parser.parseInline(tokens);
      const id = text
        .replace(/<[^>]*>/g, '') // Remove HTML tags
        .toLowerCase()
        .replace(/[`*_{}[\]()#+\-.!<>]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-')
        .trim();
      return `<h${depth} id="${id}" class="md-h${depth}">${text}</h${depth}>`;
    },
    blockquote({ tokens }: any) {
      const text = this.parser.parse(tokens);
      return `<blockquote class="md-blockquote">${text}</blockquote>`;
    },
    strong({ tokens }: any) {
      const text = this.parser.parseInline(tokens);
      return `<strong class="md-strong">${text}</strong>`;
    },
    em({ tokens }: any) {
      const text = this.parser.parseInline(tokens);
      return `<em class="md-em">${text}</em>`;
    },
    link({ href, title, tokens }: any) {
      const text = this.parser.parseInline(tokens);
      const titleAttr = title ? ` title="${title}"` : '';
      return `<a href="${href}"${titleAttr} class="md-link" target="_blank" rel="noopener noreferrer">${text}</a>`;
    },
    hr() {
      return `<hr class="md-hr" />`;
    },
    paragraph({ tokens }: any) {
      const text = this.parser.parseInline(tokens);
      return `<p class="md-p">${text}</p>`;
    },
    codespan({ text }: { text: string }) {
      const escaped = escapeHtml(text);
      return `<code class="md-code">${escaped}</code>`;
    },
    list({ ordered, items }: any) {
      const tag = ordered ? 'ol' : 'ul';
      const className = ordered ? 'md-ol md-list' : 'md-ul md-list';
      const body = items.map((item: any) => this.listitem(item)).join('');
      return `<${tag} class="${className}">${body}</${tag}>`;
    },
    listitem({ tokens }: any) {
      const text = this.parser.parse(tokens);
      return `<li class="md-li">${text}</li>`;
    },
    table({ header, rows }: any) {
      const renderCell = (cell: any, isHeader: boolean) => {
        const tag = isHeader ? 'th' : 'td';
        const alignClass = cell.align ? ` md-align-${cell.align}` : '';
        const text = this.parser.parseInline(cell.tokens);
        return `<${tag} class="md-${tag}${alignClass}">${text}</${tag}>`;
      };
      const headerHtml = `<tr class="md-tr">${header.map((cell: any) => renderCell(cell, true)).join('')}</tr>`;
      const bodyHtml = rows.map((row: any) =>
        `<tr class="md-tr">${row.map((cell: any) => renderCell(cell, false)).join('')}</tr>`
      ).join('');
      return `<div class="md-table-wrapper"><table class="md-table"><thead>${headerHtml}</thead><tbody>${bodyHtml}</tbody></table></div>`;
    },
    image({ href, title, text }: { href: string; title?: string | null; text: string }) {
      const titleAttr = title ? ` title="${title}"` : '';
      return `<div class="md-image-wrapper"><img src="${href}" alt="${text}"${titleAttr} class="md-image" loading="lazy" /></div>`;
    },
  },
});



function generateHeadingId(text: string): string {
  return text
    .toLowerCase()
    .replace(/[`*_{}[\]()#+\-.!<>]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim();
}

function extractHeadings(content: string): Heading[] {
  const headings: Heading[] = [];
  const headingRegex = /^(#{1,3})\s+(.+)$/gm;
  let match;
  while ((match = headingRegex.exec(content)) !== null) {
    const level = match[1].length;
    const rawText = match[2].replace(/[`*_]/g, '');
    headings.push({ level, text: rawText, id: generateHeadingId(rawText) });
  }
  return headings;
}

function extractFirstCodeBlock(content: string): string | undefined {
  const codeBlockRegex = /```(?:jsx?|tsx?)\n([\s\S]*?)```/;
  const match = content.match(codeBlockRegex);
  return match ? match[1].trim() : undefined;
}

export function getNoteData(category: string, slug: string): NoteData | null {
  const contentDir = path.join(process.cwd(), 'content');
  const filePath = path.join(contentDir, category, `${slug}.md`);

  if (!fs.existsSync(filePath)) return null;

  const fileContent = fs.readFileSync(filePath, 'utf-8');
  const { data, content } = matter(fileContent);

  const contentHtml = marked.parse(content) as string;

  return {
    title: data.title || slug,
    category: data.category || category,
    chapterId: data.chapterId || '',
    slug: data.slug || slug,
    description: data.description || '',
    playgroundTemplate: data.playgroundTemplate,
    contentHtml,
    headings: extractHeadings(content),
    firstCodeBlock: extractFirstCodeBlock(content),
  };
}
