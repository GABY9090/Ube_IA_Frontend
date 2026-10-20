export type PageId = 'chat' | 'datasources' | 'profile';

export type ThemeMode = 'light' | 'dark' | 'auto';
export type Language = 'fr' | 'en';

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  sql?: string;
  explanation?: string;
  results?: ResultRow[];
  columns?: string[];
  error?: 'sql' | 'empty' | 'connection' | 'out_of_scope' | null;
  executionTime?: number;
  chartType?: 'bar' | 'line' | 'pie' | null;
  loading?: boolean;
  loadingStep?: number;
  followUps?: string[];
  feedback?: 'up' | 'down' | null;
}

export type ResultRow = Record<string, string | number>;

export interface Conversation {
  id: string;
  title: string;
  messages: ChatMessage[];
  createdAt: number;
  updatedAt: number;
  pinned?: boolean;
}

export interface DataSourceDef {
  id: string;
  name: string;
  type: 'relational' | 'csv' | 'json';
  status: 'connected' | 'disconnected' | 'error';
  icon: string;
  tables: TableSchema[];
}

export interface TableSchema {
  name: string;
  columns: ColumnSchema[];
  rowCount: number;
}

export interface ColumnSchema {
  name: string;
  type: string;
  nullable: boolean;
}

export interface UserProfile {
  name: string;
  email: string;
  role: string;
  university: string;
  avatar?: string;
}

export interface ConversationHistoryItem {
  id: string;
  title: string;
  pinned?: boolean;
}

export interface ConversationHistoryGroup {
  group: string;
  conversations: ConversationHistoryItem[];
}
