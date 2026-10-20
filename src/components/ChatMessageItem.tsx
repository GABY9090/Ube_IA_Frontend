import { useState } from 'react';
import {
  Copy,
  Check,
  Sparkles,
  Table2,
  BarChart3,
  Code2,
  Clock,
  AlertTriangle,
  Inbox,
  WifiOff,
  Download,
  RefreshCw,
  ThumbsUp,
  ThumbsDown,
  FileSpreadsheet,
  ChevronRight,
} from 'lucide-react';
import type { ChatMessage as ChatMessageType } from '@/types';
import { SqlBlock } from './SqlBlock';
import { ResultsTable } from './ResultsTable';
import { DataChart } from './DataChart';
import { exportToCsv } from '@/utils/csvExport';

interface ChatMessageProps {
  message: ChatMessageType;
  onSendFollowUp: (text: string) => void;
}

export function ChatMessageItem({ message, onSendFollowUp }: ChatMessageProps) {
  const [activeTab, setActiveTab] = useState<'result' | 'chart' | 'sql'>('result');
  const [copied, setCopied] = useState(false);
  const [feedback, setFeedback] = useState<'up' | 'down' | null>(message.feedback ?? null);

  if (message.loading) {
    const step = message.loadingStep ?? 0;
    const steps = [
      "Analyse de la question…",
      "Génération de la requête…",
      "Exécution…",
    ];
    return (
      <div className="flex gap-3 dq-fade-in-up">
        <div className="w-8 h-8 rounded-lg dq-bordeaux-gradient flex items-center justify-center shrink-0">
          <Sparkles className="w-4 h-4 text-white" />
        </div>
        <div className="flex-1 pt-1.5 space-y-2">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-[13px] font-semibold text-slate-700 dark:text-slate-300">DataQuery AI</span>
          </div>
          <div className="space-y-1.5">
            {steps.map((s, idx) => (
              <div
                key={idx}
                className={`flex items-center gap-2 text-[13px] transition-all duration-300 ${
                  idx <= step
                    ? 'text-slate-600 dark:text-slate-300 opacity-100'
                    : 'text-slate-300 dark:text-slate-600 opacity-40'
                }`}
                style={{ animation: idx === step ? 'dq-step-fade 0.4s ease-out' : undefined }}
              >
                {idx < step ? (
                  <Check className="w-3.5 h-3.5 text-emerald-500" />
                ) : idx === step ? (
                  <span className="w-3.5 h-3.5 rounded-full border-2 border-bordeaux-500 border-t-transparent animate-spin shrink-0" />
                ) : (
                  <span className="w-3.5 h-3.5 rounded-full border border-slate-300 dark:border-slate-600 shrink-0" />
                )}
                {s}
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // User message
  if (message.role === 'user') {
    return (
      <div className="flex justify-end dq-fade-in-up">
        <div className="max-w-[85%] dq-bordeaux-bg text-white rounded-2xl rounded-tr-md px-4 py-3 dq-shadow-soft">
          <p className="text-[14px] leading-relaxed">{message.content}</p>
        </div>
      </div>
    );
  }

  // Assistant message
  const hasError = message.error !== null && message.error !== undefined;
  const hasData = message.results && message.columns && message.results.length > 0;

  const handleCopy = () => {
    navigator.clipboard.writeText(message.content + (message.explanation ? '\n\n' + message.explanation : ''));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="flex gap-3 dq-fade-in-up">
      <div className="w-8 h-8 rounded-lg dq-bordeaux-gradient flex items-center justify-center shrink-0">
        <Sparkles className="w-4 h-4 text-white" />
      </div>
      <div className="flex-1 min-w-0 pt-0.5 space-y-3">
        <div className="flex items-center gap-2">
          <span className="text-[13px] font-semibold text-slate-700 dark:text-slate-300">DataQuery AI</span>
          {message.executionTime && !hasError && (
            <span className="flex items-center gap-1 text-[11px] text-slate-400">
              <Clock className="w-3 h-3" />
              {message.executionTime}s
            </span>
          )}
        </div>

        {/* Error states */}
        {hasError && <ErrorBanner type={message.error!} />}

        {/* Normal response */}
        {!hasError && (
          <>
            {message.content && (
              <p className="text-[14px] text-slate-800 dark:text-slate-200 leading-relaxed">{message.content}</p>
            )}

            {message.explanation && (
              <div className="rounded-xl bg-bordeaux-50/60 dark:bg-bordeaux-950/30 border border-bordeaux-100 dark:border-bordeaux-900/50 p-3.5">
                <p className="text-[13px] text-slate-600 dark:text-slate-400 leading-relaxed">{message.explanation}</p>
              </div>
            )}

            {/* Tabs: Result / Chart / SQL */}
            {hasData && message.sql && (
              <>
                <div className="flex items-center gap-1 border-b border-slate-200 dark:border-slate-700">
                  {(['result', 'chart', 'sql'] as const).map((tab) => {
                    const icons = { result: Table2, chart: BarChart3, sql: Code2 };
                    const labels = { result: 'Résultat', chart: 'Graphique', sql: 'Requête SQL' };
                    const Icon = icons[tab];
                    return (
                      <button
                        key={tab}
                        onClick={() => setActiveTab(tab)}
                        className={`flex items-center gap-1.5 px-3 py-2 text-[13px] font-medium border-b-2 transition-all ${
                          activeTab === tab
                            ? 'border-bordeaux-500 text-bordeaux-700 dark:text-bordeaux-300'
                            : 'border-transparent text-slate-400 hover:text-slate-600 dark:hover:text-slate-300'
                        }`}
                      >
                        <Icon className="w-3.5 h-3.5" />
                        {labels[tab]}
                      </button>
                    );
                  })}
                </div>

                {/* Tab content */}
                {activeTab === 'result' && hasData && (
                  <ResultsTable columns={message.columns!} rows={message.results!} />
                )}
                {activeTab === 'chart' && hasData && message.chartType && (
                  <DataChart columns={message.columns!} rows={message.results!} chartType={message.chartType} />
                )}
                {activeTab === 'chart' && hasData && !message.chartType && (
                  <div className="rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 p-6 text-center">
                    <BarChart3 className="w-8 h-8 text-slate-300 dark:text-slate-600 mx-auto mb-2" />
                    <p className="text-[13px] text-slate-400">Aucun graphique disponible pour ces données.</p>
                  </div>
                )}
                {activeTab === 'sql' && message.sql && (
                  <SqlBlock sql={message.sql} />
                )}
              </>
            )}

            {/* Actions */}
            {!hasError && (
              <div className="flex items-center gap-1.5 flex-wrap pt-1">
                <ActionButton icon={copied ? Check : Copy} label={copied ? 'Copié' : 'Copier'} onClick={handleCopy} copied={copied} />
                {hasData && (
                  <>
                    <ActionButton icon={Download} label="CSV" onClick={() => exportToCsv(message.columns!, message.results!)} />
                    <ActionButton icon={FileSpreadsheet} label="Excel" onClick={() => exportToCsv(message.columns!, message.results!, 'dataquery.xlsx.csv')} />
                  </>
                )}
                <ActionButton icon={RefreshCw} label="Régénérer" onClick={() => onSendFollowUp(message.content)} />
                <div className="w-px h-5 bg-slate-200 dark:bg-slate-700 mx-0.5" />
                <button
                  onClick={() => setFeedback(feedback === 'up' ? null : 'up')}
                  className={`p-1.5 rounded-lg transition-all ${feedback === 'up' ? 'bg-emerald-50 dark:bg-emerald-900/30 text-emerald-500' : 'text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'}`}
                  title="Bonne réponse"
                >
                  <ThumbsUp className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => setFeedback(feedback === 'down' ? null : 'down')}
                  className={`p-1.5 rounded-lg transition-all ${feedback === 'down' ? 'bg-red-50 dark:bg-red-900/30 text-red-500' : 'text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'}`}
                  title="Mauvaise réponse"
                >
                  <ThumbsDown className="w-3.5 h-3.5" />
                </button>
              </div>
            )}

            {/* Follow-up suggestions */}
            {message.followUps && message.followUps.length > 0 && (
              <div className="flex flex-wrap gap-2 pt-2">
                {message.followUps.map((fu, idx) => (
                  <button
                    key={idx}
                    onClick={() => onSendFollowUp(fu)}
                    className="group flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-[12px] text-slate-600 dark:text-slate-300
                      hover:border-bordeaux-300 hover:bg-bordeaux-50 dark:hover:bg-bordeaux-950/30 hover:text-bordeaux-700 dark:hover:text-bordeaux-300 transition-all"
                  >
                    {fu}
                    <ChevronRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </button>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

function ActionButton({
  icon: Icon,
  label,
  onClick,
  copied,
}: {
  icon: typeof Copy;
  label: string;
  onClick: () => void;
  copied?: boolean;
}) {
  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-[12px] font-medium transition-all ${
        copied
          ? 'text-emerald-500 bg-emerald-50 dark:bg-emerald-900/30'
          : 'text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
      }`}
    >
      <Icon className="w-3.5 h-3.5" />
      {label}
    </button>
  );
}

function ErrorBanner({ type }: { type: 'sql' | 'empty' | 'connection' | 'out_of_scope' }) {
  const config = {
    sql: {
      icon: AlertTriangle,
      title: 'Erreur de syntaxe SQL',
      message: "La requête contient une erreur de syntaxe. Vérifiez les noms de colonnes et de tables.",
      color: 'text-amber-500',
      bg: 'bg-amber-50 dark:bg-amber-900/20',
      border: 'border-amber-200 dark:border-amber-800/40',
    },
    connection: {
      icon: WifiOff,
      title: 'Source de données indisponible',
      message: "Impossible de se connecter à la source de données. Vérifiez l'état de la connexion.",
      color: 'text-red-500',
      bg: 'bg-red-50 dark:bg-red-900/20',
      border: 'border-red-200 dark:border-red-800/40',
    },
    empty: {
      icon: Inbox,
      title: 'Aucun résultat',
      message: "La requête s'est exécutée avec succès mais n'a retourné aucune ligne.",
      color: 'text-slate-400',
      bg: 'bg-slate-50 dark:bg-slate-800/50',
      border: 'border-slate-200 dark:border-slate-700',
    },
    out_of_scope: {
      icon: AlertTriangle,
      title: 'Hors du domaine de données',
      message: "Je peux uniquement répondre à des questions sur les données. Posez une question sur la santé, l'agriculture ou les indicateurs européens.",
      color: 'text-bordeaux-600',
      bg: 'bg-bordeaux-50 dark:bg-bordeaux-950/30',
      border: 'border-bordeaux-200 dark:border-bordeaux-800/40',
    },
  }[type];

  const Icon = config.icon;

  return (
    <div className={`rounded-xl ${config.bg} border ${config.border} p-4`}>
      <div className="flex items-start gap-2.5">
        <Icon className={`w-5 h-5 ${config.color} shrink-0 mt-0.5`} />
        <div>
          <p className="text-[14px] font-semibold text-slate-700 dark:text-slate-300">{config.title}</p>
          <p className="text-[13px] text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">{config.message}</p>
        </div>
      </div>
    </div>
  );
}
