import { LayoutDashboard, FileText, GitBranch, AlertTriangle, Settings, FlaskConical, Cpu } from 'lucide-react';
import { ActiveTab } from '../types';

interface BottomNavProps {
  activeTab: ActiveTab;
  onSelectTab: (tab: ActiveTab) => void;
  openNcrCount?: number;
  isDarkTheme?: boolean;
}

export default function BottomNav({ 
  activeTab, 
  onSelectTab, 
  openNcrCount = 4,
  isDarkTheme = false 
}: BottomNavProps) {
  const navItems = [
    { id: 'indicadores' as ActiveTab, label: 'Control & Metas', icon: LayoutDashboard, shortcut: '1' },
    { id: 'lab' as ActiveTab, label: 'Laboratorio QA', icon: FlaskConical, shortcut: '2', isNew: true },
    { id: 'planta' as ActiveTab, label: 'Planta & Visión', icon: Cpu, shortcut: '3', isNew: true },
    { id: 'capa' as ActiveTab, label: 'NC & CAPA', icon: AlertTriangle, badge: openNcrCount, shortcut: '4' },
    { id: 'trazabilidad' as ActiveTab, label: 'Trazabilidad', icon: GitBranch, shortcut: '5' },
    { id: 'registro' as ActiveTab, label: 'Reportes ISO', icon: FileText, shortcut: '6' },
    { id: 'config' as ActiveTab, label: 'Sheets & API', icon: Settings, shortcut: '7' },
  ];

  return (
    <nav className={`fixed bottom-0 left-0 right-0 z-40 md:relative transition-colors ${
      isDarkTheme
        ? 'bg-slate-950/95 md:bg-slate-900/90 border-t md:border border-slate-800 backdrop-blur-xl md:rounded-2xl p-1.5 shadow-2xl'
        : 'bg-white/95 md:bg-white/90 border-t md:border border-slate-200/90 backdrop-blur-xl md:rounded-2xl p-1.5 shadow-sm'
    }`}>
      <div className="max-w-7xl mx-auto px-1 sm:px-2 overflow-x-auto no-scrollbar">
        <div className="flex items-center justify-between md:justify-start md:gap-1.5 min-w-max">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onSelectTab(item.id)}
                className={`relative flex flex-col md:flex-row items-center gap-1 md:gap-2 px-2.5 sm:px-3.5 py-2 rounded-xl text-xs font-bold transition-all group cursor-pointer ${
                  isActive
                    ? isDarkTheme
                      ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-lg shadow-cyan-500/25 glow-cyan'
                      : 'bg-gradient-to-r from-blue-600 to-cyan-600 text-white shadow-md shadow-blue-500/20'
                    : isDarkTheme
                      ? 'text-slate-400 hover:text-white hover:bg-slate-800/80'
                      : 'text-slate-600 hover:text-slate-950 hover:bg-slate-100'
                }`}
              >
                <div className="relative">
                  <Icon className={`w-4 h-4 transition-transform group-hover:scale-110 ${
                    isActive 
                      ? 'text-white' 
                      : isDarkTheme ? 'text-slate-400 group-hover:text-cyan-400' : 'text-slate-500 group-hover:text-blue-600'
                  }`} />
                  {item.badge && item.badge > 0 && (
                    <span className="absolute -top-1.5 -right-2 px-1.5 py-0.2 text-[9px] font-mono font-bold bg-rose-500 text-white rounded-full shadow-sm animate-pulse">
                      {item.badge}
                    </span>
                  )}
                </div>

                <span className="text-[11px] md:text-xs whitespace-nowrap tracking-tight">
                  {item.label}
                </span>

                {item.isNew && !isActive && (
                  <span className="hidden xl:inline text-[9px] font-bold px-1.5 py-0.2 rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                    NUEVO
                  </span>
                )}

                {/* Keyboard shortcut indicator */}
                <span className={`hidden lg:inline text-[9px] font-mono px-1 py-0.2 rounded transition-opacity ${
                  isActive 
                    ? 'bg-white/20 text-white' 
                    : isDarkTheme ? 'bg-slate-800 text-slate-500' : 'bg-slate-200 text-slate-500'
                }`}>
                  {item.shortcut}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </nav>
  );
}
