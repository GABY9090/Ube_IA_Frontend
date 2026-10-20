import { useState } from 'react';
import {
  User,
  Mail,
  GraduationCap,
  Building2,
  Pencil,
  Check,
  Sun,
  Moon,
  Monitor,
  Globe,
  Database,
  Rows3,
  Code2,
  LogOut,
  ArrowLeft,
} from 'lucide-react';
import type { ThemeMode, Language } from '@/types';
import { mockUserProfile } from '@/data/mockData';

interface ProfileViewProps {
  onBack: () => void;
  theme: ThemeMode;
  onThemeChange: (t: ThemeMode) => void;
  language: Language;
  onLanguageChange: (l: Language) => void;
  defaultDataSource: string;
  onDefaultDataSourceChange: (ds: string) => void;
  rowsPerPage: number;
  onRowsPerPageChange: (n: number) => void;
  showSqlByDefault: boolean;
  onShowSqlChange: (v: boolean) => void;
}

const dataSources = [
  { id: 'ds1', label: 'PostgreSQL — OMS Santé Europe' },
  { id: 'ds2', label: 'CSV — faostat_production.csv' },
  { id: 'ds3', label: 'JSON — faostat_trade.json' },
];

export function ProfileView({
  onBack,
  theme,
  onThemeChange,
  language,
  onLanguageChange,
  defaultDataSource,
  onDefaultDataSourceChange,
  rowsPerPage,
  onRowsPerPageChange,
  showSqlByDefault,
  onShowSqlChange,
}: ProfileViewProps) {
  const [editing, setEditing] = useState(false);
  const [profile, setProfile] = useState(mockUserProfile);

  const themeOptions: { id: ThemeMode; label: string; icon: typeof Sun }[] = [
    { id: 'light', label: 'Clair', icon: Sun },
    { id: 'dark', label: 'Sombre', icon: Moon },
    { id: 'auto', label: 'Auto', icon: Monitor },
  ];

  return (
    <div className="flex flex-col h-full bg-slate-50 dark:bg-slate-950 overflow-y-auto dq-scrollbar">
      <div className="max-w-2xl mx-auto w-full px-4 lg:px-6 py-6 space-y-5">
        {/* Header */}
        <div className="flex items-center gap-3">
          <button
            onClick={onBack}
            className="p-2 rounded-lg text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h1 className="text-xl font-bold text-slate-800 dark:text-slate-100">Profil</h1>
        </div>

        {/* User info card */}
        <div className="rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 p-5 dq-shadow-soft">
          <div className="flex items-start gap-4">
            <div className="w-16 h-16 rounded-full dq-bordeaux-bg flex items-center justify-center shrink-0">
              <User className="w-8 h-8 text-white" />
            </div>
            <div className="flex-1 min-w-0">
              {editing ? (
                <div className="space-y-2">
                  <input
                    value={profile.name}
                    onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-[14px] text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-bordeaux-400/30"
                    placeholder="Nom"
                  />
                  <input
                    value={profile.email}
                    onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-[14px] text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-bordeaux-400/30"
                    placeholder="Email"
                  />
                  <input
                    value={profile.role}
                    onChange={(e) => setProfile({ ...profile, role: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-[14px] text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-bordeaux-400/30"
                    placeholder="Rôle"
                  />
                  <input
                    value={profile.university}
                    onChange={(e) => setProfile({ ...profile, university: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-[14px] text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-bordeaux-400/30"
                    placeholder="Université"
                  />
                </div>
              ) : (
                <>
                  <h2 className="text-lg font-bold text-slate-800 dark:text-slate-100">{profile.name}</h2>
                  <div className="mt-2 space-y-1.5">
                    <InfoRow icon={Mail} text={profile.email} />
                    <InfoRow icon={GraduationCap} text={profile.role} />
                    <InfoRow icon={Building2} text={profile.university} />
                  </div>
                </>
              )}
            </div>
            <button
              onClick={() => setEditing(!editing)}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-[13px] font-medium transition-all shrink-0 ${
                editing
                  ? 'bg-emerald-500 text-white'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
              }`}
            >
              {editing ? <><Check className="w-4 h-4" /> OK</> : <><Pencil className="w-4 h-4" /> Modifier</>}
            </button>
          </div>
        </div>

        {/* Appearance */}
        <Section icon={Sun} title="Mode d'affichage">
          <div className="flex gap-2">
            {themeOptions.map((opt) => {
              const Icon = opt.icon;
              return (
                <button
                  key={opt.id}
                  onClick={() => onThemeChange(opt.id)}
                  className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-[13px] font-medium transition-all ${
                    theme === opt.id
                      ? 'dq-bordeaux-bg text-white'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {opt.label}
                </button>
              );
            })}
          </div>
        </Section>

        {/* Language */}
        <Section icon={Globe} title="Langue">
          <div className="flex gap-2">
            {(['fr', 'en'] as Language[]).map((lang) => (
              <button
                key={lang}
                onClick={() => onLanguageChange(lang)}
                className={`px-4 py-2.5 rounded-lg text-[13px] font-medium transition-all ${
                  language === lang
                    ? 'dq-bordeaux-bg text-white'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'
                }`}
              >
                {lang === 'fr' ? 'Français' : 'English'}
              </button>
            ))}
          </div>
        </Section>

        {/* Preferences */}
        <Section icon={Database} title="Préférences">
          <div className="space-y-4">
            <PrefRow icon={Database} label="Source de données par défaut">
              <select
                value={defaultDataSource}
                onChange={(e) => onDefaultDataSourceChange(e.target.value)}
                className="dq-select px-3 py-2 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-[13px] text-slate-700 dark:text-slate-300 focus:outline-none focus:ring-2 focus:ring-bordeaux-400/30"
              >
                {dataSources.map((ds) => (
                  <option key={ds.id} value={ds.id}>{ds.label}</option>
                ))}
              </select>
            </PrefRow>
            <PrefRow icon={Rows3} label="Lignes par page">
              <select
                value={String(rowsPerPage)}
                onChange={(e) => onRowsPerPageChange(Number(e.target.value))}
                className="dq-select px-3 py-2 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-[13px] text-slate-700 dark:text-slate-300 focus:outline-none focus:ring-2 focus:ring-bordeaux-400/30"
              >
                <option value="25">25</option>
                <option value="50">50</option>
                <option value="100">100</option>
              </select>
            </PrefRow>
            <PrefRow icon={Code2} label="Afficher le SQL par défaut">
              <button
                onClick={() => onShowSqlChange(!showSqlByDefault)}
                className={`relative w-10 h-6 rounded-full transition-all ${showSqlByDefault ? 'bg-bordeaux-500' : 'bg-slate-200 dark:bg-slate-700'}`}
              >
                <span className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white shadow-sm transition-transform ${showSqlByDefault ? 'translate-x-4' : ''}`} />
              </button>
            </PrefRow>
          </div>
        </Section>

        {/* Logout */}
        <div className="pt-2">
          <button className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-red-200 dark:border-red-900/50 text-red-500 dark:text-red-400 text-[13px] font-medium hover:bg-red-50 dark:hover:bg-red-900/20 transition-all">
            <LogOut className="w-4 h-4" />
            Déconnexion
          </button>
        </div>
      </div>
    </div>
  );
}

function Section({ icon: Icon, title, children }: { icon: typeof Sun; title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 p-5 dq-shadow-soft">
      <div className="flex items-center gap-2 mb-4">
        <Icon className="w-4 h-4 text-bordeaux-500" />
        <h3 className="text-[14px] font-semibold text-slate-700 dark:text-slate-200">{title}</h3>
      </div>
      {children}
    </div>
  );
}

function InfoRow({ icon: Icon, text }: { icon: typeof Mail; text: string }) {
  return (
    <div className="flex items-center gap-2 text-[13px] text-slate-500 dark:text-slate-400">
      <Icon className="w-3.5 h-3.5 text-slate-300 dark:text-slate-600" />
      {text}
    </div>
  );
}

function PrefRow({ icon: Icon, label, children }: { icon: typeof Database; label: string; children: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between gap-4">
      <div className="flex items-center gap-2.5">
        <Icon className="w-4 h-4 text-slate-400" />
        <span className="text-[13px] font-medium text-slate-600 dark:text-slate-300">{label}</span>
      </div>
      {children}
    </div>
  );
}
