import { useState, useEffect, useRef } from 'react';
import {
  Plus,
  Search,
  PanelLeftClose,
  PanelLeftOpen,
  MessageSquare,
  Star,
  StarOff,
  Pencil,
  Trash2,
  Check,
  X,
} from 'lucide-react';
import type { PageId, ConversationHistoryItem, ConversationHistoryGroup } from '@/types';
import { mockConversationHistory } from '@/data/mockData';

interface SidebarProps {
  collapsed: boolean;
  onToggleCollapse: () => void;
  currentPage: PageId;
  onNavigate: (page: PageId) => void;
  onNewConversation: () => void;
  activeConversationId: string | null;
  onSelectConversation: (id: string) => void;
  mobileOpen: boolean;
  onCloseMobile: () => void;
  searchQuery: string;
  onSearchChange: (q: string) => void;
  searchInputRef: React.RefObject<HTMLInputElement>;
}

export function Sidebar({
  collapsed,
  onToggleCollapse,
  currentPage,
  onNavigate,
  onNewConversation,
  activeConversationId,
  onSelectConversation,
  mobileOpen,
  onCloseMobile,
  searchQuery,
  onSearchChange,
  searchInputRef,
}: SidebarProps) {
  const [history, setHistory] = useState<ConversationHistoryGroup[]>(mockConversationHistory);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editValue, setEditValue] = useState('');
  const editInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (editingId && editInputRef.current) {
      editInputRef.current.focus();
      editInputRef.current.select();
    }
  }, [editingId]);

  const allConvs = history.flatMap((g) => g.conversations);
  const favorites = allConvs.filter((c) => c.pinned);

  const filteredGroups = history
    .map((group) => ({
      ...group,
      conversations: group.conversations.filter((c) =>
        c.title.toLowerCase().includes(searchQuery.toLowerCase()),
      ),
    }))
    .filter((g) => g.conversations.length > 0);

  const filteredFavorites = favorites.filter((c) =>
    c.title.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const togglePin = (id: string) => {
    setHistory((prev) =>
      prev.map((g) => ({
        ...g,
        conversations: g.conversations.map((c) =>
          c.id === id ? { ...c, pinned: !c.pinned } : c,
        ),
      })),
    );
  };

  const startRename = (conv: ConversationHistoryItem) => {
    setEditingId(conv.id);
    setEditValue(conv.title);
  };

  const confirmRename = () => {
    if (!editingId) return;
    setHistory((prev) =>
      prev.map((g) => ({
        ...g,
        conversations: g.conversations.map((c) =>
          c.id === editingId ? { ...c, title: editValue || c.title } : c,
        ),
      })),
    );
    setEditingId(null);
  };

  const deleteConv = (id: string) => {
    setHistory((prev) =>
      prev
        .map((g) => ({
          ...g,
          conversations: g.conversations.filter((c) => c.id !== id),
        }))
        .filter((g) => g.conversations.length > 0),
    );
  };

  const renderConversationItem = (conv: ConversationHistoryItem) => {
    const isActive = activeConversationId === conv.id;
    const isEditing = editingId === conv.id;

    return (
      <div
        key={conv.id}
        className={`group/conv relative flex items-center rounded-lg transition-all duration-150 ${
          isActive ? 'bg-bordeaux-50 dark:bg-bordeaux-950/40' : 'hover:bg-slate-100 dark:hover:bg-slate-800/60'
        }`}
      >
        {isEditing ? (
          <div className="w-full flex items-center gap-1 px-2 py-1.5">
            <input
              ref={editInputRef}
              value={editValue}
              onChange={(e) => setEditValue(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') confirmRename();
                if (e.key === 'Escape') setEditingId(null);
              }}
              className="flex-1 px-2 py-1 text-[13px] rounded bg-white dark:bg-slate-900 border border-bordeaux-400 text-slate-800 dark:text-slate-200 focus:outline-none"
            />
            <button onClick={confirmRename} className="p-1 rounded hover:bg-slate-200 dark:hover:bg-slate-700">
              <Check className="w-3.5 h-3.5 text-emerald-500" />
            </button>
            <button onClick={() => setEditingId(null)} className="p-1 rounded hover:bg-slate-200 dark:hover:bg-slate-700">
              <X className="w-3.5 h-3.5 text-slate-400" />
            </button>
          </div>
        ) : (
          <>
            <button
              onClick={() => {
                onSelectConversation(conv.id);
                onCloseMobile();
              }}
              className={`flex-1 flex items-center gap-2.5 px-2.5 py-2 text-left text-[13px] min-w-0 ${
                isActive ? 'text-bordeaux-700 dark:text-bordeaux-300 font-medium' : 'text-slate-600 dark:text-slate-300'
              }`}
            >
              {conv.pinned && <Star className="w-3 h-3 text-amber-400 fill-amber-400 shrink-0" />}
              {!conv.pinned && <MessageSquare className={`w-3.5 h-3.5 shrink-0 ${isActive ? 'text-bordeaux-500' : 'text-slate-300 dark:text-slate-600'}`} />}
              <span className="line-clamp-1 leading-snug">{conv.title}</span>
            </button>
            {/* Hover actions */}
            <div className="hidden group-hover/conv:flex items-center gap-0.5 pr-1.5 shrink-0">
              <button
                onClick={(e) => { e.stopPropagation(); togglePin(conv.id); }}
                className="p-1 rounded hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
                title={conv.pinned ? 'Désépingler' : 'Épingler'}
              >
                {conv.pinned ? <StarOff className="w-3 h-3 text-slate-400" /> : <Star className="w-3 h-3 text-slate-400" />}
              </button>
              <button
                onClick={(e) => { e.stopPropagation(); startRename(conv); }}
                className="p-1 rounded hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
                title="Renommer"
              >
                <Pencil className="w-3 h-3 text-slate-400" />
              </button>
              <button
                onClick={(e) => { e.stopPropagation(); deleteConv(conv.id); }}
                className="p-1 rounded hover:bg-red-50 dark:hover:bg-red-900/30 transition-colors"
                title="Supprimer"
              >
                <Trash2 className="w-3 h-3 text-slate-400 hover:text-red-500" />
              </button>
            </div>
          </>
        )}
      </div>
    );
  };

  return (
    <>
      {mobileOpen && (
        <div className="fixed inset-0 bg-slate-900/50 z-30 lg:hidden dq-fade-in" onClick={onCloseMobile} />
      )}

      <aside
        className={`
          fixed lg:relative z-40 h-full bg-white dark:bg-slate-900 border-r border-slate-200/80 dark:border-slate-800
          flex flex-col transition-all duration-300 ease-in-out
          ${collapsed ? 'lg:w-[68px]' : 'lg:w-[280px]'}
          ${mobileOpen ? 'w-[280px] translate-x-0' : 'w-[280px] -translate-x-full lg:translate-x-0'}
        `}
      >
        {/* Logo + collapse */}
        <div className="flex items-center justify-between px-3 h-14 border-b border-slate-200/80 dark:border-slate-800 shrink-0">
          {!collapsed && (
            <div className="flex items-center gap-2.5 overflow-hidden">
              <img src="/src/assets/uB-logo.svg" alt="uB" className="w-8 h-8 shrink-0" />
              <span className="font-bold text-slate-800 dark:text-slate-200 text-[15px] tracking-tight whitespace-nowrap">
                DataQuery <span className="dq-bordeaux-gradient-text">AI</span>
              </span>
            </div>
          )}
          {collapsed && (
            <img src="/src/assets/uB-logo.svg" alt="uB" className="w-8 h-8 mx-auto" />
          )}
          <button
            onClick={onToggleCollapse}
            className="hidden lg:flex p-1.5 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors shrink-0"
          >
            {collapsed ? <PanelLeftOpen className="w-4 h-4" /> : <PanelLeftClose className="w-4 h-4" />}
          </button>
          <button
            onClick={onCloseMobile}
            className="lg:hidden p-1.5 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            <PanelLeftClose className="w-4 h-4" />
          </button>
        </div>

        {/* New conversation */}
        <div className="p-3 shrink-0">
          <button
            onClick={() => { onNewConversation(); onCloseMobile(); }}
            className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl
              dq-bordeaux-bg text-white text-sm font-medium
              transition-all duration-200 hover:shadow-md
              ${collapsed ? 'lg:justify-center' : ''}`}
            title="Nouvelle conversation"
          >
            <Plus className="w-4 h-4 shrink-0" />
            {!collapsed && <span>Nouvelle conversation</span>}
          </button>
        </div>

        {/* Search */}
        {!collapsed && (
          <div className="px-3 pb-3 shrink-0">
            <div className="relative">
              <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                ref={searchInputRef}
                type="text"
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                placeholder="Rechercher… (Ctrl+K)"
                className="w-full pr-3 py-2 text-[13px] rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200/70 dark:border-slate-700
                  placeholder-slate-400 text-slate-700 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-bordeaux-400/30 focus:border-bordeaux-400
                  transition-all"
                style={{ paddingLeft: '2.1rem' }}
              />
            </div>
          </div>
        )}

        {/* History */}
        {!collapsed && (
          <div className="flex-1 overflow-y-auto dq-scrollbar px-3 pb-2">
            {/* Favorites section */}
            {filteredFavorites.length > 0 && (
              <div className="mb-3">
                <div className="flex items-center gap-2 px-1 py-2 text-[11px] font-semibold uppercase tracking-wider text-amber-500">
                  <Star className="w-3 h-3" />
                  Favoris
                </div>
                {filteredFavorites.map((conv) => renderConversationItem(conv))}
              </div>
            )}

            {/* Regular history */}
            <div className="flex items-center gap-2 px-1 py-2 text-[11px] font-semibold uppercase tracking-wider text-slate-400">
              Historique
            </div>
            {filteredGroups.length === 0 && filteredFavorites.length === 0 ? (
              <p className="px-1 py-4 text-[13px] text-slate-400 text-center">
                Aucune conversation trouvée.
              </p>
            ) : (
              filteredGroups.map((group) => (
                <div key={group.group} className="mb-3">
                  <p className="px-1 py-1.5 text-[11px] font-medium text-slate-400 dark:text-slate-500">{group.group}</p>
                  {group.conversations.filter((c) => !c.pinned).map((conv) => renderConversationItem(conv))}
                </div>
              ))
            )}
          </div>
        )}
      </aside>
    </>
  );
}
