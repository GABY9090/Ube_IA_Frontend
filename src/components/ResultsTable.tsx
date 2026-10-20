import { ArrowDown, ArrowUp, ArrowUpDown } from 'lucide-react';
import { useState, useMemo } from 'react';
import type { ResultRow } from '@/types';

interface ResultsTableProps {
  columns: string[];
  rows: ResultRow[];
  maxRows?: number;
  compact?: boolean;
}

type SortDir = 'asc' | 'desc' | null;

export function ResultsTable({
  columns,
  rows,
  maxRows = 100,
  compact = false,
}: ResultsTableProps) {
  const [sortCol, setSortCol] = useState<string | null>(null);
  const [sortDir, setSortDir] = useState<SortDir>(null);

  const sortedRows = useMemo(() => {
    if (!sortCol || !sortDir) return rows;
    const sorted = [...rows].sort((a, b) => {
      const av = a[sortCol];
      const bv = b[sortCol];
      if (typeof av === 'number' && typeof bv === 'number') {
        return sortDir === 'asc' ? av - bv : bv - av;
      }
      const as = String(av ?? '');
      const bs = String(bv ?? '');
      return sortDir === 'asc' ? as.localeCompare(bs) : bs.localeCompare(as);
    });
    return sorted;
  }, [rows, sortCol, sortDir]);

  const displayRows = sortedRows.slice(0, maxRows);
  const hiddenCount = sortedRows.length - displayRows.length;

  const handleSort = (col: string) => {
    if (sortCol === col) {
      setSortDir(sortDir === 'asc' ? 'desc' : sortDir === 'desc' ? null : 'asc');
      if (sortDir === 'desc') setSortCol(null);
    } else {
      setSortCol(col);
      setSortDir('asc');
    }
  };

  return (
    <div className="rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 overflow-hidden dq-shadow-soft">
      <div className="overflow-x-auto dq-scrollbar">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-slate-50 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-700">
              {columns.map((col) => (
                <th
                  key={col}
                  onClick={() => handleSort(col)}
                  className="px-4 py-2.5 text-left font-semibold text-slate-600 dark:text-slate-300 text-[12px] uppercase tracking-wide
                    cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors select-none whitespace-nowrap"
                >
                  <div className="flex items-center gap-1.5">
                    <span>{col}</span>
                    {sortCol === col ? (
                      sortDir === 'asc' ? <ArrowUp className="w-3 h-3 text-bordeaux-500" /> : <ArrowDown className="w-3 h-3 text-bordeaux-500" />
                    ) : (
                      <ArrowUpDown className="w-3 h-3 text-slate-300 dark:text-slate-600" />
                    )}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {displayRows.map((row, idx) => (
              <tr
                key={idx}
                className={`border-b border-slate-100 dark:border-slate-800 transition-colors hover:bg-bordeaux-50/40 dark:hover:bg-bordeaux-950/20 ${
                  idx % 2 === 1 ? 'bg-slate-50/30 dark:bg-slate-800/20' : ''
                }`}
              >
                {columns.map((col) => {
                  const val = row[col];
                  const isNumeric = typeof val === 'number';
                  return (
                    <td
                      key={col}
                      className={`px-4 py-2.5 text-slate-700 dark:text-slate-300 ${compact ? 'text-[12px]' : 'text-[13px]'} ${
                        isNumeric ? 'text-right font-mono tabular-nums' : ''
                      } whitespace-nowrap`}
                    >
                      {val === null || val === undefined ? (
                        <span className="text-slate-300 dark:text-slate-600 italic">NULL</span>
                      ) : (
                        String(val)
                      )}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {hiddenCount > 0 && (
        <div className="px-4 py-2.5 text-[12px] text-slate-400 bg-slate-50/50 dark:bg-slate-800/30 border-t border-slate-100 dark:border-slate-800">
          {hiddenCount} ligne(s) supplémentaire(s) non affichée(s).
        </div>
      )}
    </div>
  );
}
