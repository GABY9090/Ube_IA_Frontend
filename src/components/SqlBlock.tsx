import { useState } from 'react';
import { Copy, Check, Code2, ChevronDown, ChevronUp } from 'lucide-react';
import { highlightSql } from '@/utils/sqlHighlight';

interface SqlBlockProps {
  sql: string;
  editable?: boolean;
}

export function SqlBlock({ sql }: SqlBlockProps) {
  const [copied, setCopied] = useState(false);
  const [expanded, setExpanded] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(sql);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const lines = sql.split('\n');
  const shouldCollapse = lines.length > 8;
  const visibleSql = shouldCollapse && !expanded
    ? lines.slice(0, 7).join('\n') + '\n...'
    : sql;

  return (
    <div className="rounded-xl border border-slate-700 bg-slate-900 dark:bg-slate-950 overflow-hidden dq-shadow-soft">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-2.5 bg-slate-800/50 dark:bg-slate-900/50 border-b border-slate-700/50">
        <div className="flex items-center gap-2 text-slate-300">
          <Code2 className="w-3.5 h-3.5 text-bordeaux-400" />
          <span className="text-[12px] font-medium tracking-wide">SQL</span>
        </div>
        <button
          onClick={handleCopy}
          className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-md text-[12px] font-medium
            text-slate-300 hover:text-white hover:bg-slate-700/70 transition-all"
          title="Copier le SQL"
        >
          {copied ? (
            <>
              <Check className="w-3.5 h-3.5 text-emerald-400" />
              <span className="text-emerald-400">Copié</span>
            </>
          ) : (
            <>
              <Copy className="w-3.5 h-3.5" />
              <span>Copier</span>
            </>
          )}
        </button>
      </div>

      {/* Code body */}
      <pre
        className="px-4 py-3.5 text-[13px] leading-relaxed overflow-x-auto dq-scrollbar text-slate-100"
        style={{ fontFamily: 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace' }}
        dangerouslySetInnerHTML={{ __html: highlightSql(visibleSql) }}
      />

      {/* Expand/collapse */}
      {shouldCollapse && (
        <button
          onClick={() => setExpanded(!expanded)}
          className="w-full flex items-center justify-center gap-1.5 py-2 text-[12px] font-medium
            text-slate-400 hover:text-slate-200 bg-slate-800/30 hover:bg-slate-800/60 transition-all"
        >
          {expanded ? (
            <>
              <ChevronUp className="w-3.5 h-3.5" />
              Réduire
            </>
          ) : (
            <>
              <ChevronDown className="w-3.5 h-3.5" />
              Afficher tout
            </>
          )}
        </button>
      )}
    </div>
  );
}
