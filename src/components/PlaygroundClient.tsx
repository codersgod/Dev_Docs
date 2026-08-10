'use client';
import { useState, useEffect, useMemo, useCallback } from 'react';
import { useSearchParams } from 'next/navigation';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import { ArrowLeft, Play, RotateCcw, Copy } from 'lucide-react';

const MonacoEditor = dynamic(() => import('@monaco-editor/react'), { ssr: false });

/* ── Playground templates ─────────────────────────────────────────── */
const TEMPLATES: Record<string, string> = {
  'react-counter': `import React, { useState } from 'react';

export default function Counter() {
  const [count, setCount] = useState(0);

  return (
    <div style={{ padding: '32px', textAlign: 'center', fontFamily: 'system-ui' }}>
      <h2 style={{ fontSize: '48px', fontWeight: '700', margin: '0 0 24px', color: '#e2e8f0' }}>
        {count}
      </h2>
      <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
        <button
          onClick={() => setCount(prev => prev - 1)}
          style={{ padding: '10px 24px', background: '#2a2b38', color: '#e2e8f0', border: '1px solid #3a3b4a', borderRadius: '10px', fontSize: '18px', cursor: 'pointer' }}
        >
          −
        </button>
        <button
          onClick={() => setCount(prev => prev + 1)}
          style={{ padding: '10px 24px', background: '#b44dff', color: '#fff', border: 'none', borderRadius: '10px', fontSize: '18px', cursor: 'pointer' }}
        >
          +
        </button>
      </div>
      <button
        onClick={() => setCount(0)}
        style={{ marginTop: '16px', padding: '6px 16px', background: 'transparent', color: '#6b7280', border: '1px solid #374151', borderRadius: '8px', fontSize: '12px', cursor: 'pointer' }}
      >
        Reset
      </button>
    </div>
  );
}`,
  'react-effect': `import React, { useState, useEffect } from 'react';

export default function Timer() {
  const [seconds, setSeconds] = useState(0);
  const [running, setRunning] = useState(false);

  useEffect(() => {
    if (!running) return;
    const interval = setInterval(() => setSeconds(s => s + 1), 1000);
    return () => clearInterval(interval);
  }, [running]);

  const fmt = (n) => String(n).padStart(2, '0');

  return (
    <div style={{ padding: '32px', textAlign: 'center', fontFamily: 'ui-monospace, monospace' }}>
      <div style={{ fontSize: '56px', fontWeight: '700', color: '#e2e8f0', letterSpacing: '-2px', marginBottom: '24px' }}>
        {fmt(Math.floor(seconds / 60))}:{fmt(seconds % 60)}
      </div>
      <div style={{ display: 'flex', gap: '10px', justifyContent: 'center' }}>
        <button
          onClick={() => setRunning(r => !r)}
          style={{ padding: '10px 28px', background: running ? '#ef4444' : '#b44dff', color: '#fff', border: 'none', borderRadius: '10px', cursor: 'pointer', fontFamily: 'inherit' }}
        >
          {running ? 'Pause' : 'Start'}
        </button>
        <button
          onClick={() => { setSeconds(0); setRunning(false); }}
          style={{ padding: '10px 20px', background: '#1f2028', color: '#9ca3af', border: '1px solid #374151', borderRadius: '10px', cursor: 'pointer' }}
        >
          Reset
        </button>
      </div>
    </div>
  );
}`,
  default: `import React, { useState } from 'react';

export default function App() {
  const [text, setText] = useState('Hello, World!');

  return (
    <div style={{ padding: '32px', fontFamily: 'system-ui' }}>
      <h1 style={{ color: '#e2e8f0', marginBottom: '16px', fontSize: '24px' }}>
        {text}
      </h1>
      <input
        value={text}
        onChange={e => setText(e.target.value)}
        placeholder="Type something..."
        style={{
          width: '100%',
          padding: '10px 14px',
          background: '#1f2028',
          border: '1px solid #374151',
          borderRadius: '8px',
          color: '#e2e8f0',
          fontSize: '15px',
          outline: 'none',
        }}
      />
    </div>
  );
}`,
};

/* ── Code preprocessor ────────────────────────────────────────────── */
function processCodeForIframe(rawCode: string): { code: string; componentName: string } {
  const defaultFnMatch = rawCode.match(/export\s+default\s+function\s+(\w+)/);
  const defaultVarMatch = rawCode.match(/export\s+default\s+(?:const|let)\s+(\w+)/);
  const namedFnMatch = rawCode.match(/^(?:function|const)\s+(\w+)/m);

  const componentName =
    defaultFnMatch?.[1] || defaultVarMatch?.[1] || namedFnMatch?.[1] || 'App';

  const code = rawCode
    .replace(/^import\s[\s\S]*?from\s['"][^'"]*['"]\s*;?\n?/gm, '')
    .replace(/export\s+default\s+function\s+/g, 'function ')
    .replace(/export\s+default\s+(const|let)\s+/g, '$1 ')
    .replace(/export\s+default\s+/g, '')
    .replace(/^export\s+(function|class|const|let|var)\s+/gm, '$1 ')
    .trim();

  return { code, componentName };
}

function buildIframeSrc(rawCode: string): string {
  // Detect if code is a React component (has JSX or React imports or export default)
  const isReact = /import\s+React|from\s+['"]react['"]|export\s+default\s+function|<[A-Z]|<div|<h[1-6]|<p |<span|<button|<input/.test(rawCode);

  if (isReact) {
    const { code, componentName } = processCodeForIframe(rawCode);
    return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width,initial-scale=1" />
  <script src="https://unpkg.com/react@18/umd/react.development.js"></script>
  <script src="https://unpkg.com/react-dom@18/umd/react-dom.development.js"></script>
  <script src="https://unpkg.com/@babel/standalone@7/babel.min.js"></script>
  <style>
    *{box-sizing:border-box;margin:0;padding:0}
    body{background:#1a1b23;color:#e2e8f0;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;font-size:15px;min-height:100vh}
    button{cursor:pointer}
    input,textarea,select{font-family:inherit}
    #error{color:#f87171;background:#7f1d1d22;border:1px solid #7f1d1d;padding:12px 14px;border-radius:8px;font-family:ui-monospace,monospace;font-size:12px;margin:16px;white-space:pre-wrap;display:none}
  </style>
</head>
<body>
  <div id="root"></div>
  <div id="error"></div>
  <script type="text/babel" data-presets="react,env">
    const { useState, useEffect, useRef, useCallback, useMemo, useReducer, useContext, createContext } = React;

    ${code}

    (function mount() {
      try {
        const candidates = [
          typeof ${componentName} !== 'undefined' && ${componentName},
          typeof App !== 'undefined' && App,
          typeof Counter !== 'undefined' && Counter,
          typeof Timer !== 'undefined' && Timer,
          typeof Main !== 'undefined' && Main,
        ].filter(Boolean);
        const Root = candidates[0] || (() => React.createElement('p', {style:{color:'#f87171',padding:'16px'}}, 'No component found.'));
        ReactDOM.createRoot(document.getElementById('root')).render(React.createElement(Root));
      } catch(e) {
        const errEl = document.getElementById('error');
        errEl.textContent = e.message;
        errEl.style.display = 'block';
      }
    })();
  </script>
  <script>
    window.addEventListener('error', function(e){
      const errEl = document.getElementById('error');
      errEl.textContent = e.message;
      errEl.style.display = 'block';
    });
  </script>
</body>
</html>`;
  }

  // Plain JS — intercept console.log and display output
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width,initial-scale=1" />
  <style>
    *{box-sizing:border-box;margin:0;padding:0}
    body{background:#1a1b23;color:#e2e8f0;font-family:ui-monospace,'SFMono-Regular',Menlo,monospace;font-size:13px;min-height:100vh;padding:16px}
    .line{padding:3px 0;border-bottom:1px solid rgba(255,255,255,0.04);display:flex;gap:8px;align-items:flex-start}
    .arrow{color:#9b5de5;flex-shrink:0;font-size:11px;margin-top:1px}
    .val{color:#e2e8f0;white-space:pre-wrap;word-break:break-all}
    .val.err{color:#f87171}
    .val.info{color:#6b7280}
    #console{display:flex;flex-direction:column;gap:2px}
    .label{color:#6b7280;font-size:10px;text-transform:uppercase;letter-spacing:.08em;margin-bottom:8px}
  </style>
</head>
<body>
  <div class="label">Console output</div>
  <div id="console"></div>
  <script>
    const out = document.getElementById('console');
    function format(v) {
      if (v === null) return 'null';
      if (v === undefined) return 'undefined';
      if (typeof v === 'object') { try { return JSON.stringify(v, null, 2); } catch { return String(v); } }
      return String(v);
    }
    function addLine(args, cls) {
      const line = document.createElement('div');
      line.className = 'line';
      line.innerHTML = '<span class="arrow">›</span><span class="val ' + cls + '">' + args.map(format).join(' ') + '</span>';
      out.appendChild(line);
    }
    const _log = console.log.bind(console);
    console.log = (...a) => { _log(...a); addLine(a, ''); };
    console.warn = (...a) => { addLine(a, 'info'); };
    console.error = (...a) => { addLine(a, 'err'); };
    window.addEventListener('error', e => addLine([e.message], 'err'));
    try {
      ${rawCode
        .replace(/^import\s[\s\S]*?from\s['"][^'"]*['"]\s*;?\n?/gm, '')
        .replace(/^export\s+(default\s+)?(function|class|const|let|var)\s+/gm, '$2 ')
        .replace(/export\s+default\s+/g, '')
      }
    } catch(e) { addLine([e.message], 'err'); }
    if (!out.children.length) {
      const info = document.createElement('div');
      info.className = 'line';
      info.innerHTML = '<span class="arrow">›</span><span class="val info">No console output. Add console.log() to see results.</span>';
      out.appendChild(info);
    }
  </script>
</body>
</html>`;
}

/* ── Main component ───────────────────────────────────────────────── */
export default function PlaygroundClient() {
  const searchParams = useSearchParams();

  const initialCode = useMemo(() => {
    const codeParam = searchParams.get('code');
    const templateParam = searchParams.get('template');
    if (codeParam) return decodeURIComponent(codeParam);
    if (templateParam && TEMPLATES[templateParam]) return TEMPLATES[templateParam];
    return TEMPLATES.default;
  }, [searchParams]);

  const [code, setCode] = useState(initialCode);
  const [previewHtml, setPreviewHtml] = useState(() => buildIframeSrc(initialCode));
  const [copied, setCopied] = useState(false);

  // Debounced preview update
  useEffect(() => {
    const timer = setTimeout(() => {
      setPreviewHtml(buildIframeSrc(code));
    }, 600);
    return () => clearTimeout(timer);
  }, [code]);

  const handleRun = useCallback(() => {
    setPreviewHtml(buildIframeSrc(code));
  }, [code]);

  const handleReset = useCallback(() => {
    setCode(initialCode);
  }, [initialCode]);

  const handleCopy = useCallback(() => {
    navigator.clipboard.writeText(code).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }, [code]);

  return (
    <div className="flex flex-col h-screen bg-canvas">
      {/* Top bar */}
      <header className="flex items-center gap-3 px-4 py-2.5 bg-panel border-b border-white/5 flex-shrink-0">
        <button
          onClick={() => window.history.back()}
          className="flex items-center gap-1.5 text-textMuted hover:text-white text-sm transition-colors"
        >
          <ArrowLeft size={15} />
          <span>Back</span>
        </button>
        <div className="w-px h-4 bg-white/10" />
        <span className="text-white font-semibold text-sm">Playground</span>
        <span className="text-[10px] text-textMuted/50 bg-white/[0.04] border border-white/[0.07] px-2 py-0.5 rounded-full">
          React
        </span>
        <div className="flex-1" />
        <button
          onClick={handleCopy}
          className="flex items-center gap-1.5 text-textMuted hover:text-white text-xs px-3 py-1.5 rounded-lg bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.07] transition-all"
        >
          <Copy size={12} />
          {copied ? 'Copied!' : 'Copy'}
        </button>
        <button
          onClick={handleReset}
          className="flex items-center gap-1.5 text-textMuted hover:text-white text-xs px-3 py-1.5 rounded-lg bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.07] transition-all"
        >
          <RotateCcw size={12} />
          Reset
        </button>
        <button
          onClick={handleRun}
          className="flex items-center gap-1.5 text-white text-xs px-3 py-1.5 rounded-lg bg-neonPurple hover:bg-neonPurple/80 transition-all shadow-glow-purple"
        >
          <Play size={12} />
          Run
        </button>
      </header>

      {/* Split screen */}
      <div className="flex flex-1 overflow-hidden">
        {/* Editor panel */}
        <div className="w-1/2 flex flex-col border-r border-white/5">
          <div className="flex items-center gap-2 px-4 py-2 bg-[#141519] border-b border-white/[0.04]">
            <div className="flex gap-1.5">
              <div className="w-2.5 h-2.5 rounded-full bg-white/10" />
              <div className="w-2.5 h-2.5 rounded-full bg-white/10" />
              <div className="w-2.5 h-2.5 rounded-full bg-white/10" />
            </div>
            <span className="text-textMuted/50 text-[11px] font-mono ml-1">component.jsx</span>
          </div>
          <div className="flex-1 overflow-hidden">
            <MonacoEditor
              height="100%"
              defaultLanguage="javascript"
              value={code}
              onChange={(val) => setCode(val ?? '')}
              theme="vs-dark"
              options={{
                fontSize: 13,
                lineHeight: 22,
                fontFamily: "ui-monospace, 'SFMono-Regular', Menlo, monospace",
                fontLigatures: true,
                minimap: { enabled: false },
                scrollbar: { verticalScrollbarSize: 4, horizontalScrollbarSize: 4 },
                padding: { top: 16, bottom: 16 },
                lineNumbers: 'on',
                renderLineHighlight: 'gutter',
                bracketPairColorization: { enabled: true },
                smoothScrolling: true,
                cursorSmoothCaretAnimation: 'on',
                tabSize: 2,
                wordWrap: 'on',
                overviewRulerBorder: false,
              }}
              onMount={(editor, monaco) => {
                monaco.editor.defineTheme('fed-dark', {
                  base: 'vs-dark',
                  inherit: true,
                  rules: [],
                  colors: {
                    'editor.background': '#141519',
                    'editor.lineHighlightBackground': '#1a1b23',
                    'editorLineNumber.foreground': '#3a3b4a',
                    'editorLineNumber.activeForeground': '#6b6e80',
                    'editor.selectionBackground': '#b44dff30',
                  },
                });
                monaco.editor.setTheme('fed-dark');
                editor.focus();
              }}
            />
          </div>
        </div>

        {/* Preview panel */}
        <div className="w-1/2 flex flex-col bg-[#1a1b23]">
          <div className="flex items-center gap-2 px-4 py-2 bg-[#16171d] border-b border-white/[0.04]">
            <div className="flex gap-1.5">
              <div className="w-2.5 h-2.5 rounded-full bg-[#ff5f57]" />
              <div className="w-2.5 h-2.5 rounded-full bg-[#ffbd2e]" />
              <div className="w-2.5 h-2.5 rounded-full bg-[#28ca42]" />
            </div>
            <span className="text-textMuted/50 text-[11px] ml-1">Preview</span>
          </div>
          <iframe
            srcDoc={previewHtml}
            className="flex-1 w-full border-none"
            sandbox="allow-scripts"
            title="Code Preview"
          />
        </div>
      </div>
    </div>
  );
}
