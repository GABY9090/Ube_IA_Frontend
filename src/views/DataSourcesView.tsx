import {
  Database,
  FileText,
  Braces,
  CheckCircle2,
  MinusCircle,
  ChevronRight,
  ChevronDown,
  Table2,
  Type,
  ArrowLeft,
} from 'lucide-react';
import { useState } from 'react';
import { mockDataSources } from '@/data/mockData';

interface DataSourcesViewProps {
  onBack: () => void;
}

const typeIcons: Record<string, typeof Database> = {
  database: Database,
  'file-text': FileText,
  braces: Braces,
};

const statusConfig = {
  connected: { icon: CheckCircle2, label: 'Connecté', color: 'text-emerald-500', bg: 'bg-emerald-50 dark:bg-emerald-900/20', dot: 'bg-emerald-400' },
  disconnected: { icon: MinusCircle, label: 'Déconnecté', color: 'text-slate-400', bg: 'bg-slate-100 dark:bg-slate-800', dot: 'bg-slate-300 dark:bg-slate-600' },
  error: { icon: MinusCircle, label: 'Erreur', color: 'text-red-500', bg: 'bg-red-50 dark:bg-red-900/20', dot: 'bg-red-400' },
};

export function DataSourcesView({ onBack }: DataSourcesViewProps) {
  const [expanded, setExpanded] = useState<string | null>(mockDataSources[0].id);

  return (
    <div className="flex flex-col h-full bg-slate-50 dark:bg-slate-950 overflow-y-auto dq-scrollbar">
      <div className="max-w-3xl mx-auto w-full px-4 lg:px-6 py-6 space-y-5">
        <div className="flex items-center gap-3">
          <button
            onClick={onBack}
            className="p-2 rounded-lg text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-xl font-bold text-slate-800 dark:text-slate-100">Sources de données</h1>
            <p className="text-[13px] text-slate-500 dark:text-slate-400 mt-0.5">
              Vue d'ensemble des sources disponibles (lecture seule)
            </p>
          </div>
        </div>

        <div className="space-y-3">
          {mockDataSources.map((ds) => {
            const Icon = typeIcons[ds.icon] || Database;
            const status = statusConfig[ds.status];
            const isExpanded = expanded === ds.id;
            const totalRows = ds.tables.reduce((acc, t) => acc + t.rowCount, 0);

            return (
              <div key={ds.id} className="rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 overflow-hidden dq-shadow-soft">
                <button
                  onClick={() => setExpanded(isExpanded ? null : ds.id)}
                  className="w-full flex items-center gap-3 p-4 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors text-left"
                >
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${status.bg}`}>
                    <Icon className={`w-5 h-5 ${status.color}`} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-[14px] font-semibold text-slate-800 dark:text-slate-200 truncate">{ds.name}</h3>
                    <div className="flex items-center gap-3 mt-1">
                      <span className={`flex items-center gap-1 text-[12px] font-medium ${status.color}`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${status.dot}`} />
                        {status.label}
                      </span>
                      <span className="text-[12px] text-slate-400">{ds.type === 'relational' ? 'Base relationnelle' : ds.type.toUpperCase()}</span>
                      <span className="text-[12px] text-slate-400">{ds.tables.length} table(s)</span>
                    </div>
                  </div>
                  {!isExpanded && (
                    <span className="text-[12px] text-slate-400 hidden sm:block">{totalRows.toLocaleString()} lignes</span>
                  )}
                  {isExpanded ? <ChevronDown className="w-4 h-4 text-slate-400" /> : <ChevronRight className="w-4 h-4 text-slate-400" />}
                </button>

                {isExpanded && (
                  <div className="border-t border-slate-100 dark:border-slate-800 dq-fade-in p-4 space-y-2.5">
                    {ds.tables.map((table) => (
                      <div key={table.name} className="rounded-lg border border-slate-100 dark:border-slate-800 overflow-hidden">
                        <div className="flex items-center gap-2.5 px-3 py-2.5 bg-slate-50/80 dark:bg-slate-800/30">
                          <Table2 className="w-4 h-4 text-slate-400" />
                          <span className="text-[13px] font-medium text-slate-700 dark:text-slate-300 flex-1">{table.name}</span>
                          <span className="text-[11px] text-slate-400">{table.rowCount.toLocaleString()} lignes</span>
                          <span className="text-[11px] text-slate-400 hidden sm:block">{table.columns.length} colonnes</span>
                        </div>
                        <table className="w-full text-[12px]">
                          <thead>
                            <tr className="border-t border-slate-100 dark:border-slate-800">
                              <th className="px-3 py-1.5 text-left font-medium text-slate-400">Colonne</th>
                              <th className="px-3 py-1.5 text-left font-medium text-slate-400">Type</th>
                              <th className="px-3 py-1.5 text-left font-medium text-slate-400">Null</th>
                            </tr>
                          </thead>
                          <tbody>
                            {table.columns.map((col) => (
                              <tr key={col.name} className="border-t border-slate-50 dark:border-slate-800/50">
                                <td className="px-3 py-2 text-slate-700 dark:text-slate-300 font-medium">
                                  <div className="flex items-center gap-1.5">
                                    <Type className="w-3 h-3 text-slate-300 dark:text-slate-600" />
                                    {col.name}
                                  </div>
                                </td>
                                <td className="px-3 py-2">
                                  <code className="text-[11px] bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 px-1.5 py-0.5 rounded">
                                    {col.type}
                                  </code>
                                </td>
                                <td className="px-3 py-2">
                                  {col.nullable ? (
                                    <span className="text-amber-500 text-[11px]">Oui</span>
                                  ) : (
                                    <span className="text-slate-400 text-[11px]">Non</span>
                                  )}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
