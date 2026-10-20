import { useState, useRef, useEffect } from 'react';
import {
  Send,
  Database,
  ChevronDown,
  Menu,
  User,
  HeartPulse,
  Activity,
  Wheat,
  Milk,
  LineChart,
  Award,
  BarChart3,
  Sparkles,
} from 'lucide-react';
import type { ChatMessage as ChatMessageType, ThemeMode, Language } from '@/types';
import {
  suggestionCards,
  generateAssistantResponse,
  createLoadingMessage,
  createMessage,
  loadingSteps,
} from '@/data/mockData';
import { ChatMessageItem } from './ChatMessageItem';

interface ChatViewProps {
  messages: ChatMessageType[];
  onMessagesChange: (messages: ChatMessageType[]) => void;
  onOpenSidebar: () => void;
  sidebarCollapsed: boolean;
  dataSource: string;
  onDataSourceChange: (source: string) => void;
  onOpenProfile: () => void;
  theme: ThemeMode;
  language: Language;
  showSqlByDefault: boolean;
  rowsPerPage: number;
}

const dataSources = [
  { id: 'ds1', label: 'PostgreSQL — OMS Santé Europe', type: 'PostgreSQL' },
  { id: 'ds2', label: 'CSV — faostat_production.csv', type: 'CSV' },
  { id: 'ds3', label: 'JSON — faostat_trade.json', type: 'JSON' },
];

const iconMap: Record<string, typeof HeartPulse> = {
  HeartPulse, Activity, Wheat, Milk, LineChart, Award,
};

export function ChatView({
  messages,
  onMessagesChange,
  onOpenSidebar,
  sidebarCollapsed,
  dataSource,
  onDataSourceChange,
  onOpenProfile,
  theme: _theme,
  language,
  showSqlByDefault: _showSqlByDefault,
  rowsPerPage: _rowsPerPage,
}: ChatViewProps) {
  const [input, setInput] = useState('');
  const [showDataSourceMenu, setShowDataSourceMenu] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const isEmpty = messages.length === 0;

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
    }
  }, [messages]);

  const handleSend = (text?: string) => {
    const question = (text ?? input).trim();
    if (!question) return;

    const userMsg = createMessage('user', question);
    const loadingMsg = createLoadingMessage();
    onMessagesChange([...messages, userMsg, loadingMsg]);
    setInput('');

    // Animate loading steps
    let step = 0;
    const stepInterval = setInterval(() => {
      step++;
      if (step < loadingSteps.length) {
        onMessagesChange([
          ...messages,
          userMsg,
          { ...loadingMsg, loadingStep: step },
        ]);
      }
    }, 600);

    // Final response
    setTimeout(() => {
      clearInterval(stepInterval);
      const response = generateAssistantResponse(question);
      onMessagesChange([...messages, userMsg, response]);
    }, 2200);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const currentSource = dataSources.find((ds) => ds.id === dataSource) || dataSources[0];

  return (
    <div className="flex flex-col h-full bg-slate-50 dark:bg-slate-950">
      {/* Header */}
      <header className="flex items-center justify-between px-4 lg:px-6 h-14 border-b border-slate-200/80 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md shrink-0 z-10">
        <div className="flex items-center gap-3">
          <button
            onClick={onOpenSidebar}
            className="lg:hidden p-2 rounded-lg text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <Menu className="w-5 h-5" />
          </button>
          <div className="lg:hidden flex items-center gap-2">
            <img src="/src/assets/uB-logo.svg" alt="uB" className="w-7 h-7" />
          </div>
          <h1 className="text-[15px] font-semibold text-slate-800 dark:text-slate-200 hidden sm:block">
            Assistant <span className="dq-bordeaux-gradient-text">DataQuery AI</span>
          </h1>
        </div>

        <div className="flex items-center gap-2">
          {/* Data source selector */}
          <div className="relative">
            <button
              onClick={() => setShowDataSourceMenu(!showDataSourceMenu)}
              className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200/70 dark:hover:bg-slate-700 text-[12px] text-slate-600 dark:text-slate-300 font-medium transition-colors"
            >
              <Database className="w-3.5 h-3.5 text-slate-400" />
              <span className="hidden sm:inline">{currentSource.label}</span>
              <span className="sm:hidden">{currentSource.type}</span>
              <ChevronDown className="w-3 h-3 text-slate-400" />
            </button>
            {showDataSourceMenu && (
              <>
                <div className="fixed inset-0 z-10" onClick={() => setShowDataSourceMenu(false)} />
                <div className="absolute right-0 mt-1.5 w-64 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 shadow-lg z-20 dq-fade-in overflow-hidden">
                  <p className="px-3 py-2 text-[11px] font-semibold uppercase tracking-wider text-slate-400 border-b border-slate-100 dark:border-slate-800">
                    Source de données
                  </p>
                  {dataSources.map((ds) => (
                    <button
                      key={ds.id}
                      onClick={() => { onDataSourceChange(ds.id); setShowDataSourceMenu(false); }}
                      className={`w-full flex items-center gap-2.5 px-3 py-2.5 text-[13px] transition-colors ${
                        ds.id === dataSource
                          ? 'bg-bordeaux-50 dark:bg-bordeaux-950/40 text-bordeaux-700 dark:text-bordeaux-300 font-medium'
                          : 'text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800'
                      }`}
                    >
                      <Database className={`w-3.5 h-3.5 ${ds.id === dataSource ? 'text-bordeaux-500' : 'text-slate-300 dark:text-slate-600'}`} />
                      <span className="flex-1 text-left">{ds.label}</span>
                      <span className="w-2 h-2 rounded-full bg-emerald-400" />
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>

          {/* Profile */}
          <button onClick={onOpenProfile} className="flex items-center gap-2 p-1 pr-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
            <div className="w-7 h-7 rounded-full bg-bordeaux-100 dark:bg-bordeaux-900/40 flex items-center justify-center">
              <User className="w-3.5 h-3.5 text-bordeaux-600 dark:text-bordeaux-400" />
            </div>
          </button>
        </div>
      </header>

      {/* Conversation area */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto dq-scrollbar">
        {isEmpty ? (
          <div className="min-h-full flex flex-col items-center justify-center px-4 py-8">
            <div className="w-full max-w-3xl dq-fade-in-up">
              {/* Greeting */}
              <div className="text-center mb-8">
                <div className="inline-flex w-14 h-14 rounded-2xl dq-bordeaux-gradient items-center justify-center mb-4 dq-shadow-lg">
                  <Sparkles className="w-7 h-7 text-white" />
                </div>
                <h2 className="text-2xl lg:text-3xl font-bold text-slate-800 dark:text-slate-100 mb-2">
                  {language === 'fr' ? 'Bonjour, que souhaitez-vous analyser ?' : 'Hello, what would you like to analyze?'}
                </h2>
                <p className="text-[15px] text-slate-500 dark:text-slate-400">
                  {language === 'fr' ? 'Interrogez vos données simplement, en langage naturel.' : 'Query your data simply, in natural language.'}
                </p>
              </div>

              {/* 6 suggestion cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 mb-6">
                {suggestionCards.map((card, idx) => {
                  const Icon = iconMap[card.icon] || BarChart3;
                  return (
                    <button
                      key={idx}
                      onClick={() => handleSend(card.title)}
                      className="group text-left p-4 rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 hover:border-bordeaux-300 dark:hover:border-bordeaux-700
                        hover:shadow-md transition-all duration-200 dq-fade-in-up"
                      style={{ animationDelay: `${idx * 60}ms` }}
                    >
                      <div className="flex items-start gap-3">
                        <div className="w-9 h-9 rounded-xl bg-bordeaux-50 dark:bg-bordeaux-950/40 flex items-center justify-center shrink-0">
                          <Icon className="w-[18px] h-[18px] text-bordeaux-600 dark:text-bordeaux-400" />
                        </div>
                        <p className="text-[13px] text-slate-700 dark:text-slate-300 leading-relaxed pt-1 group-hover:text-slate-900 dark:group-hover:text-slate-100">
                          {card.title}
                        </p>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        ) : (
          <div className="max-w-3xl mx-auto px-4 lg:px-6 py-6 space-y-6">
            {messages.map((msg) => (
              <ChatMessageItem
                key={msg.id}
                message={msg}
                onSendFollowUp={handleSend}
              />
            ))}
          </div>
        )}
      </div>

      {/* Input area */}
      <div className="shrink-0 px-4 lg:px-6 pb-4 pt-2 bg-gradient-to-t from-slate-50 dark:from-slate-950 to-transparent">
        <div className="max-w-3xl mx-auto">
          <div className="rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 dq-shadow-soft focus-within:border-bordeaux-400 focus-within:ring-2 focus-within:ring-bordeaux-500/15 transition-all">
            <textarea
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={language === 'fr' ? 'Posez une question sur vos données…' : 'Ask a question about your data…'}
              rows={1}
              className="w-full px-4 pt-3.5 pb-2 text-[14px] text-slate-800 dark:text-slate-200 placeholder-slate-400 dark:placeholder-slate-500
                resize-none focus:outline-none bg-transparent max-h-32 dq-scrollbar"
              style={{ minHeight: '48px' }}
            />
            <div className="flex items-center justify-between px-3 pb-2.5">
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-[11px] text-slate-500 dark:text-slate-400 font-medium">
                  <Database className="w-3 h-3 text-slate-400" />
                  <span className="hidden sm:inline">{currentSource.type}</span>
                  <span className="sm:hidden">{language === 'fr' ? 'Source' : 'Source'}</span>
                </div>
              </div>
              <button
                onClick={() => handleSend()}
                disabled={!input.trim()}
                className={`w-9 h-9 rounded-xl flex items-center justify-center transition-all ${
                  input.trim()
                    ? 'dq-bordeaux-bg text-white hover:shadow-md scale-100'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-300 dark:text-slate-600 cursor-not-allowed scale-95'
                }`}
                title={language === 'fr' ? 'Envoyer' : 'Send'}
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
          </div>
          <p className="text-center text-[12px] text-slate-500 dark:text-slate-400 mt-2.5">
            {language === 'fr'
              ? 'DataQuery AI génère des requêtes approximatives. Vérifiez le SQL avant exécution. Entrée pour envoyer, Maj+Entrée pour une nouvelle ligne, Ctrl+K pour rechercher.'
              : 'DataQuery AI generates approximate queries. Verify SQL before execution. Enter to send, Shift+Enter for new line, Ctrl+K to search.'}
          </p>
        </div>
      </div>
    </div>
  );
}
