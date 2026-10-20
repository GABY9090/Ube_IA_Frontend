import { useState, useEffect, useRef } from 'react';
import { Sidebar } from '@/components/Sidebar';
import { ChatView } from '@/components/ChatView';
import { ProfileView } from '@/views/ProfileView';
import { DataSourcesView } from '@/views/DataSourcesView';
import type { ChatMessage, PageId, ThemeMode, Language } from '@/types';

function App() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState<PageId>('chat');
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [activeConversationId, setActiveConversationId] = useState<string | null>(null);
  const [dataSource, setDataSource] = useState('ds1');
  const [searchQuery, setSearchQuery] = useState('');
  const [theme, setTheme] = useState<ThemeMode>('light');
  const [language, setLanguage] = useState<Language>('fr');
  const [rowsPerPage, setRowsPerPage] = useState(50);
  const [showSqlByDefault, setShowSqlByDefault] = useState(true);

  const searchInputRef = useRef<HTMLInputElement>(null);

  // Apply theme to document
  useEffect(() => {
    const root = document.documentElement;
    const applyTheme = (isDark: boolean) => {
      if (isDark) root.classList.add('dark');
      else root.classList.remove('dark');
    };

    if (theme === 'dark') {
      applyTheme(true);
    } else if (theme === 'light') {
      applyTheme(false);
    } else {
      // auto
      const mq = window.matchMedia('(prefers-color-scheme: dark)');
      applyTheme(mq.matches);
      const handler = (e: MediaQueryListEvent) => applyTheme(e.matches);
      mq.addEventListener('change', handler);
      return () => mq.removeEventListener('change', handler);
    }
  }, [theme]);

  // Ctrl+K shortcut to focus search
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        setMobileSidebarOpen(true);
        setTimeout(() => searchInputRef.current?.focus(), 100);
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, []);

  const handleNewConversation = () => {
    setMessages([]);
    setActiveConversationId(null);
    setCurrentPage('chat');
  };

  const handleNavigate = (page: PageId) => {
    setCurrentPage(page);
  };

  const handleSelectConversation = (id: string) => {
    setActiveConversationId(id);
    setCurrentPage('chat');
    setMessages([]);
  };

  const handleOpenSidebar = () => {
    if (window.innerWidth < 1024) {
      setMobileSidebarOpen(true);
    } else {
      setSidebarCollapsed(false);
    }
  };

  return (
    <div className="flex h-screen w-full overflow-hidden bg-slate-50 dark:bg-slate-950">
      <Sidebar
        collapsed={sidebarCollapsed}
        onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
        currentPage={currentPage}
        onNavigate={handleNavigate}
        onNewConversation={handleNewConversation}
        activeConversationId={activeConversationId}
        onSelectConversation={handleSelectConversation}
        mobileOpen={mobileSidebarOpen}
        onCloseMobile={() => setMobileSidebarOpen(false)}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        searchInputRef={searchInputRef}
      />

      <main className="flex-1 flex flex-col min-w-0 h-full">
        {currentPage === 'chat' && (
          <ChatView
            messages={messages}
            onMessagesChange={setMessages}
            onOpenSidebar={handleOpenSidebar}
            sidebarCollapsed={sidebarCollapsed}
            dataSource={dataSource}
            onDataSourceChange={setDataSource}
            onOpenProfile={() => setCurrentPage('profile')}
            theme={theme}
            language={language}
            showSqlByDefault={showSqlByDefault}
            rowsPerPage={rowsPerPage}
          />
        )}
        {currentPage === 'datasources' && (
          <DataSourcesView onBack={() => setCurrentPage('chat')} />
        )}
        {currentPage === 'profile' && (
          <ProfileView
            onBack={() => setCurrentPage('chat')}
            theme={theme}
            onThemeChange={setTheme}
            language={language}
            onLanguageChange={setLanguage}
            defaultDataSource={dataSource}
            onDefaultDataSourceChange={setDataSource}
            rowsPerPage={rowsPerPage}
            onRowsPerPageChange={setRowsPerPage}
            showSqlByDefault={showSqlByDefault}
            onShowSqlChange={setShowSqlByDefault}
          />
        )}
      </main>
    </div>
  );
}

export default App;
