import React from 'react';
import { 
  LayoutDashboard, 
  FileSpreadsheet, 
  Flame, 
  GitFork, 
  AlertOctagon, 
  CheckSquare, 
  Gauge, 
  FileText, 
  Users, 
  Sliders, 
  Settings, 
  LogOut, 
  ChevronRight,
  ShieldCheck,
  UserCheck,
  Building2,
  X,
  FlaskConical,
  Cpu
} from 'lucide-react';
import { ActiveTab, UserProfile, CompanyConfig, UserRole } from '../types';

interface SidebarProps {
  activeTab: ActiveTab;
  onSelectTab: (tab: ActiveTab) => void;
  currentUser: UserProfile;
  onChangeUserRole: (role: UserRole) => void;
  companyConfig: CompanyConfig;
  onLogout: () => void;
  openNcCount: number;
  openActionsCount: number;
  isMobileOpen: boolean;
  onCloseMobile: () => void;
  isDarkTheme?: boolean;
}

export default function Sidebar({
  activeTab,
  onSelectTab,
  currentUser,
  onChangeUserRole,
  companyConfig,
  onLogout,
  openNcCount,
  openActionsCount,
  isMobileOpen,
  onCloseMobile,
  isDarkTheme = false
}: SidebarProps) {
  const menuItems: {
    id: ActiveTab;
    label: string;
    icon: React.ElementType;
    badge?: number | string;
    badgeColor?: string;
  }[] = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'registro', label: 'Registro de Calidad', icon: FileSpreadsheet },
    { id: 'contaminacion', label: 'Contaminación', icon: Flame, badge: '51.8%', badgeColor: 'bg-rose-500 text-white' },
    { id: 'trazabilidad', label: 'Trazabilidad', icon: GitFork },
    { id: 'lab', label: 'Laboratorio & COA', icon: FlaskConical },
    { id: 'planta', label: 'Visión & IoT Planta', icon: Cpu, badge: 'Live', badgeColor: 'bg-cyan-600 text-white' },
    { id: 'ncs', label: 'No Conformidades', icon: AlertOctagon, badge: openNcCount, badgeColor: 'bg-amber-500 text-white' },
    { id: 'acciones', label: 'Acciones Correctivas', icon: CheckSquare, badge: openActionsCount, badgeColor: 'bg-blue-600 text-white' },
    { id: 'indicadores', label: 'Indicadores', icon: Gauge },
    { id: 'reportes', label: 'Reportes', icon: FileText },
    { id: 'personal', label: 'Personal', icon: Users },
    { id: 'parametros', label: 'Parámetros', icon: Sliders },
    { id: 'configuracion', label: 'Configuración', icon: Settings },
  ];

  const roleColors: Record<UserRole, { bg: string; text: string; border: string }> = {
    'ADMINISTRADOR': { bg: 'bg-purple-100 dark:bg-purple-950/60', text: 'text-purple-800 dark:text-purple-300', border: 'border-purple-300 dark:border-purple-800' },
    'GERENTE': { bg: 'bg-blue-100 dark:bg-blue-950/60', text: 'text-blue-800 dark:text-blue-300', border: 'border-blue-300 dark:border-blue-800' },
    'SUPERVISOR DE CALIDAD': { bg: 'bg-emerald-100 dark:bg-emerald-950/60', text: 'text-emerald-800 dark:text-emerald-300', border: 'border-emerald-300 dark:border-emerald-800' },
    'CONSULTA': { bg: 'bg-slate-100 dark:bg-slate-800', text: 'text-slate-700 dark:text-slate-300', border: 'border-slate-300 dark:border-slate-700' }
  };

  const currentRoleStyle = roleColors[currentUser.role];

  return (
    <>
      {/* Mobile backdrop */}
      {isMobileOpen && (
        <div 
          onClick={onCloseMobile}
          className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-40 lg:hidden"
        />
      )}

      {/* Sidebar container */}
      <aside className={`fixed lg:static top-0 bottom-0 left-0 z-50 w-72 flex flex-col transition-all duration-300 ${
        isMobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
      } ${
        isDarkTheme 
          ? 'bg-slate-950 border-r border-slate-800/90 text-slate-200' 
          : 'bg-white border-r border-slate-200 text-slate-800 shadow-xs'
      }`}>
        {/* Brand Header */}
        <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-10 h-10 rounded-xl overflow-hidden bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 p-1.5 flex items-center justify-center shrink-0 shadow-xs">
              {companyConfig.logoUrl ? (
                <img 
                  src={companyConfig.logoUrl} 
                  alt={companyConfig.name}
                  className="w-full h-full object-contain"
                  referrerPolicy="no-referrer"
                />
              ) : (
                <Building2 className="w-6 h-6 text-blue-600" />
              )}
            </div>
            <div className="min-w-0 flex-1">
              <h1 className="text-xs font-black tracking-tight text-slate-900 dark:text-white truncate uppercase">
                {companyConfig.name}
              </h1>
              <p className="text-[10px] font-bold text-blue-600 dark:text-cyan-400 tracking-wider font-mono truncate">
                QMS ENTERPRISE • ISO 9001
              </p>
            </div>
          </div>

          <button 
            onClick={onCloseMobile}
            className="lg:hidden p-1.5 rounded-lg text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Menu Navigation */}
        <div className="flex-1 overflow-y-auto px-3 py-3 space-y-0.5 custom-scrollbar">
          <div className="px-2 pb-1.5 text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 font-mono">
            Módulos del Sistema
          </div>

          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  onSelectTab(item.id);
                  onCloseMobile();
                }}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-bold transition-all group cursor-pointer ${
                  isActive
                    ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20'
                    : isDarkTheme
                      ? 'text-slate-300 hover:bg-slate-900 hover:text-white'
                      : 'text-slate-700 hover:bg-slate-100 hover:text-slate-950'
                }`}
              >
                <div className="flex items-center gap-3 truncate">
                  <Icon className={`w-4 h-4 shrink-0 transition-transform group-hover:scale-110 ${
                    isActive ? 'text-white' : 'text-slate-500 dark:text-slate-400'
                  }`} />
                  <span className="truncate">{item.label}</span>
                </div>

                <div className="flex items-center gap-1.5 shrink-0">
                  {item.badge !== undefined && (
                    <span className={`text-[10px] font-bold px-1.5 py-0.2 rounded-full font-mono ${
                      item.badgeColor || (isActive ? 'bg-white/20 text-white' : 'bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300')
                    }`}>
                      {item.badge}
                    </span>
                  )}
                  {isActive && <ChevronRight className="w-3.5 h-3.5 text-white/80" />}
                </div>
              </button>
            );
          })}
        </div>

        {/* User Card & Role Switcher at Bottom */}
        <div className="p-3 border-t border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-900/50">
          <div className="flex items-center gap-2.5 p-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 shadow-2xs">
            <div className="relative w-9 h-9 rounded-xl overflow-hidden bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shrink-0">
              <img 
                src={currentUser.avatarUrl || '/assets/marcos-salinas.svg'} 
                alt={currentUser.name} 
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
              <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-emerald-500 ring-2 ring-white dark:ring-slate-900" />
            </div>

            <div className="min-w-0 flex-1">
              <p className="text-xs font-bold text-slate-900 dark:text-white truncate">
                {currentUser.name}
              </p>
              <div className="flex items-center gap-1 mt-0.5">
                <span className={`text-[9px] font-bold px-1.5 py-0.2 rounded-md font-mono border ${currentRoleStyle.bg} ${currentRoleStyle.text} ${currentRoleStyle.border}`}>
                  {currentUser.role}
                </span>
              </div>
            </div>
          </div>

          {/* Role quick switch selector */}
          <div className="mt-2 pt-2 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between text-[10px]">
            <span className="text-slate-400 dark:text-slate-500 font-bold uppercase font-mono">
              Cambiar Rol:
            </span>
            <div className="flex items-center gap-1">
              {(['ADMINISTRADOR', 'GERENTE', 'SUPERVISOR DE CALIDAD', 'CONSULTA'] as UserRole[]).map((r) => (
                <button
                  key={r}
                  onClick={() => onChangeUserRole(r)}
                  className={`px-1.5 py-0.5 rounded text-[9px] font-mono font-bold transition-all cursor-pointer ${
                    currentUser.role === r
                      ? 'bg-blue-600 text-white'
                      : 'bg-slate-200/70 hover:bg-slate-300 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-400'
                  }`}
                  title={`Cambiar a rol ${r}`}
                >
                  {r === 'ADMINISTRADOR' ? 'Adm' : r === 'GERENTE' ? 'Ger' : r === 'SUPERVISOR DE CALIDAD' ? 'Sup' : 'Con'}
                </button>
              ))}
            </div>
          </div>

          {/* Settings & Logout */}
          <div className="mt-2 flex items-center justify-between gap-1.5">
            <button
              onClick={() => {
                onSelectTab('configuracion');
                onCloseMobile();
              }}
              className="flex-1 flex items-center justify-center gap-1 px-2 py-1.5 text-xs font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-200/60 dark:hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
            >
              <Settings className="w-3.5 h-3.5 text-slate-400" />
              <span>Configuración</span>
            </button>
            <button
              onClick={onLogout}
              className="flex items-center justify-center gap-1 px-2.5 py-1.5 text-xs font-bold text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded-lg transition-colors cursor-pointer"
              title="Cerrar sesión"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Salir</span>
            </button>
          </div>
        </div>
      </aside>
    </>
  );
}
