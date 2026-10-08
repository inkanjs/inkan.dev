// A small TypeScript highlighter for the landing page: strings, comments, keywords, numbers,
// calls. Enough for the snippets here, and no dependency that ships a whole grammar.
import type { ReactNode } from "react";

const TOKENS =
  /(\/\/[^\n]*)|("(?:[^"\\]|\\.)*"|'(?:[^'\\]|\\.)*'|`(?:[^`\\]|\\.)*`)|\b(import|from|export|const|let|await|async|return|new|type|function|if|for|of)\b|\b(\d[\d_]*(?:\.\d+)?)\b|\b([a-zA-Z_$][\w$]*)(?=\()/g;

export function highlight(source: string): ReactNode[] {
  const out: ReactNode[] = [];
  let last = 0;
  let key = 0;
  for (const m of source.matchAll(TOKENS)) {
    if (m.index > last) out.push(source.slice(last, m.index));
    const [text, comment, str, keyword, num, call] = m;
    const cls = comment ? "text-muted italic" : str ? "text-ok" : keyword ? "text-hot" : num ? "text-[#e3b341]" : call ? "text-term-ink font-semibold" : "";
    out.push(
      <span key={key++} className={cls}>
        {text}
      </span>,
    );
    last = m.index + text.length;
  }
  if (last < source.length) out.push(source.slice(last));
  return out;
}

/** A terminal-looking window around some code or output. */
export function Window({ title, children, className = "" }: { title: string; children: ReactNode; className?: string }) {
  return (
    <div
      className={`overflow-hidden rounded-2xl bg-term text-term-ink shadow-[0_30px_70px_rgba(0,0,0,.35),0_0_0_1px_rgba(255,255,255,.04)] ${className}`}
    >
      <div className="flex h-11 items-center gap-2 bg-term-bar px-4">
        <span className="size-3 rounded-full bg-[#e5534b]" />
        <span className="size-3 rounded-full bg-[#e3b341]" />
        <span className="size-3 rounded-full bg-[#57c26a]" />
        <span className="ml-3 truncate font-mono text-xs text-[#8a7d72]">{title}</span>
      </div>
      {children}
    </div>
  );
}

export function Code({ code, title, className }: { code: string; title: string; className?: string }) {
  return (
    <Window title={title} className={className}>
      <pre className="overflow-x-auto p-5 font-mono text-[13px] leading-relaxed sm:text-sm">
        <code>{highlight(code)}</code>
      </pre>
    </Window>
  );
}
