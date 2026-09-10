import { useState } from 'react';
import { 
  Menu, 
  Search, 
  Bell, 
  RefreshCw, 
  Calendar, 
  Palette, 
  ChevronDown, 
  Check, 
  AlertTriangle, 
  ShieldCheck, 
  Clock,
  Sparkles
} from 'lucide-react';
import { ActiveTab, UserProfile, ColorTheme } from '../types';

interface HeaderProps {
  activeTab: ActiveTab;
  onOpenMobileMenu: () => void;
  onOpenSearch: () => void;
  currentUser: UserProfile;
  currentTheme: ColorTheme;
  onChangeTheme: (theme: ColorTheme) => void;
  isSyncing: boolean;
  onTriggerSync: () => void;
  onNavigateToTab: (tab: ActiveTab) => void;
  isDarkTheme?: boolean;
}

export default function Header({
  activeTab,
  onOpenMobileMenu,
  onOpenSearch,
  currentUser,
  currentTheme,
  onChangeTheme,
  isSyncing,
  onTriggerSync,
  onNavigateToTab,
  isDarkTheme = false
}: HeaderProps) {
  const [showNotifications, setShowNotifications] = useState(false);
  const [showThemeMenu, setShowThemeMenu] = useState(false);

  const tabTitles: Record<ActiveTab, { title: string; subtitle: string; breadcrumb: string }> = {
    dashboard: { 
      title: 'Centro de Control Gerencial', 
      subtitle: 'Visión ejecutiva integral de calidad, contaminación, metas y riesgos',
      breadcrumb: 'Dashboard Ejecutivo' 
    },
    registro: { 
      title: 'Registro de Control de Calidad', 
      subtitle: 'Ensayos en línea, pesajes de tara, cálculo de contaminación y generación de NCs',
      breadcrumb: 'Operaciones / Registro' 
    },
    contaminacion: { 
      title: 'Dashboard de Contaminación', 
      subtitle: 'Análisis de Pareto, causas raíz, áreas críticas y masa de merma',
      breadcrumb: 'Calidad / Contaminación' 
    },
    trazabilidad: { 
      title: 'Trazabilidad Integral de Lotes', 
      subtitle: 'Cadena de custodia desde acopio costero hasta pellet certificado NetPlus',
      breadcrumb: 'Producción / Trazabilidad' 
    },
    ncs: { 
      title: 'Gestión de No Conformidades (NC)', 
      subtitle: 'Desviaciones operativas, clasificación de severidad y ciclo de vida',
      breadcrumb: 'Aseguramiento / No Conformidades' 
    },
    acciones: { 
      title: 'Acciones Correctivas (CAPA)', 
      subtitle: 'Planes de acción, responsables, compromisos SLA y verificación de eficacia',
      breadcrumb: 'Mejora Continua / Acciones' 
    },
    indicadores: { 
      title: 'Indicadores & Metas de Calidad', 
      subtitle: 'Tablero de mando con Brecha, Cumplimiento, Tendencia y Calidad Global (ICG)',
      breadcrumb: 'Gerencia / Indicadores' 
    },
    reportes: { 
      title: 'Generador de Reportes Oficiales', 
      subtitle: 'Emisión documental con exportación PDF, Excel e impresión para auditorías ISO',
      breadcrumb: 'Documentación / Reportes' 
    },
    personal: { 
      title: 'Personal & Control de Usuarios', 
      subtitle: 'Directorio de supervisores, analistas, roles RBAC y bitácora de actividad',
      breadcrumb: 'Organización / Personal' 
    },
    parametros: { 
      title: 'Parámetros & Metas de Proceso', 
      subtitle: 'Configuración de umbrales máximos de merma, ICG objetivo y plazos SLA',
      breadcrumb: 'Configuración / Parámetros' 
    },
    configuracion: { 
      title: 'Configuración de Empresa & Google Sheets', 
      subtitle: 'Identidad corporativa, integración Google Apps Script y bitácora de auditoría',
      breadcrumb: 'Sistema / Configuración' 
    },
    lab: {
      title: 'Laboratorio de Ensayos & Certificados (COA)',
      subtitle: 'Ensayos MFI, densidad, pureza FTIR y emisión de certificados de calidad',
      breadcrumb: 'Laboratorio / Ensayos'
    },
    planta: {
      title: 'Visión Artificial & Telemetría IoT en Planta',
      subtitle: 'Monitoreo de extrusoras en tiempo real y detección óptica de impurezas',
      breadcrumb: 'Operaciones / Planta'
    },
    capa: {
      title: 'Gestión de No Conformidades & CAPA',
      subtitle: 'Ciclo de resolución ISO, contención y verificación de eficacia',
      breadcrumb: 'Aseguramiento / CAPA'
    },
    config: {
      title: 'Configuración de Empresa & Google Sheets',
      subtitle: 'Identidad corporativa, integración Google Apps Script y bitácora de auditoría',
      breadcrumb: 'Sistema / Configuración'
    }
  };

  const currentTabInfo = tabTitles[activeTab] || tabTitles.dashboard;

  const themeOptions = [
    {
      id: 'ocean' as ColorTheme,
      name: 'Océano Cristalino',
      desc: 'Claro, nítido y alto contraste (Predeterminado)',
      colorPreview: 'bg-blue-600',
    },
    {
      id: 'eco' as ColorTheme,
      name: 'Eco NetPositiva',
      desc: 'Verde esmeralda y menta ecológica Patagonia',
      colorPreview: 'bg-emerald-600',
    },
    {
      id: 'cobalt' as ColorTheme,
      name: 'Zafiro Industrial',
      desc: 'Azul cobalto de alta energía y nitidez',
      colorPreview: 'bg-indigo-600',
    },
    {
      id: 'dark' as ColorTheme,
      name: 'Control Room Nocturno',
      desc: 'Fondo grafito noche para salas de control',
      colorPreview: 'bg-slate-900',
    }
  ];

  const currentThemeObj = themeOptions.find(t => t.id === currentTheme) || themeOptions[0];

  return (
    <header className={`sticky top-0 z-30 transition-colors backdrop-blur-xl border-b ${
      isDarkTheme 
        ? 'bg-slate-950/90 border-slate-800 text-white shadow-md' 
        : 'bg-white/95 border-slate-200 text-slate-900 shadow-2xs'
    }`}>
      <div className="px-4 sm:px-6 py-2.5 flex items-center justify-between gap-4">
        {/* Left: Mobile hamburger & Titles */}
        <div className="flex items-center gap-3 min-w-0">
          <button
            onClick={onOpenMobileMenu}
            className="lg:hidden p-2 rounded-xl border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
          >
            <Menu className="w-5 h-5" />
          </button>

          <div className="min-w-0">
            <div className="flex items-center gap-2 text-[11px] font-mono font-bold text-blue-600 dark:text-cyan-400">
              <span>QMS Enterprise</span>
              <span className="text-slate-300 dark:text-slate-700">/</span>
              <span className="text-slate-500 dark:text-slate-400 truncate">{currentTabInfo.breadcrumb}</span>
            </div>
            <h2 className="text-sm sm:text-base font-black tracking-tight text-slate-900 dark:text-white truncate">
              {currentTabInfo.title}
            </h2>
          </div>
        </div>

        {/* Center: Global Search Bar */}
        <div className="hidden md:flex items-center flex-1 max-w-md mx-2">
          <button
            onClick={onOpenSearch}
            className={`w-full flex items-center justify-between px-3.5 py-1.5 rounded-xl border text-xs transition-all cursor-pointer ${
              isDarkTheme
                ? 'bg-slate-900 border-slate-700/80 text-slate-300 hover:border-cyan-500'
                : 'bg-slate-100/80 border-slate-200 text-slate-600 hover:border-blue-400 hover:bg-white shadow-2xs'
            }`}
            title="Buscar registros, NC, acciones o lotes (Ctrl+K)"
          >
            <div className="flex items-center gap-2">
              <Search className="w-3.5 h-3.5 text-blue-600 dark:text-cyan-400" />
              <span className="text-slate-400 dark:text-slate-500">Buscar por ID, lote, área o causa...</span>
            </div>
            <kbd className={`px-1.5 py-0.5 rounded text-[10px] font-mono font-bold ${
              isDarkTheme ? 'bg-slate-800 text-slate-400 border border-slate-700' : 'bg-white text-slate-600 border border-slate-300'
            }`}>
              ⌘K
            </kbd>
          </button>
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          {/* Formatted Date */}
          <div className="hidden xl:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs font-mono text-slate-600 dark:text-slate-400">
            <Calendar className="w-3.5 h-3.5 text-slate-500" />
            <span>Miércoles, 9 Set 2026</span>
          </div>

          {/* Sync Apps Script Button */}
          <button
            onClick={onTriggerSync}
            disabled={isSyncing}
            className={`flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 text-xs font-mono font-bold rounded-xl border transition-all cursor-pointer ${
              isDarkTheme
                ? 'bg-emerald-950/40 border-emerald-500/40 text-emerald-300 hover:bg-emerald-900/40'
                : 'bg-emerald-50 border-emerald-300 text-emerald-800 hover:bg-emerald-100 shadow-2xs'
            }`}
            title="Sincronizar base de datos con Google Sheets"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isSyncing ? 'animate-spin text-emerald-500' : 'text-emerald-600'}`} />
            <span className="hidden sm:inline">GAS Sync</span>
          </button>

          {/* Theme Palette Dropdown */}
          <div className="relative">
            <button
              onClick={() => setShowThemeMenu(!showThemeMenu)}
              className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl border text-xs font-bold transition-all cursor-pointer ${
                isDarkTheme
                  ? 'bg-slate-900 border-slate-700 text-slate-200 hover:bg-slate-800'
                  : 'bg-slate-100 border-slate-200 text-slate-800 hover:bg-slate-200 shadow-2xs'
              }`}
              title="Cambiar paleta visual"
            >
              <Palette className="w-3.5 h-3.5 text-blue-600 dark:text-cyan-400" />
              <span className={`w-2.5 h-2.5 rounded-full ${currentThemeObj.colorPreview} inline-block border border-white/40`} />
              <ChevronDown className="w-3 h-3 text-slate-400" />
            </button>

            {showThemeMenu && (
              <div className={`absolute right-0 mt-2 w-64 rounded-2xl border shadow-2xl p-2 z-50 backdrop-blur-xl ${
                isDarkTheme ? 'bg-slate-900/95 border-slate-700 text-slate-100' : 'bg-white/95 border-slate-200 text-slate-900'
              }`}>
                <div className="px-3 py-1.5 border-b border-slate-200 dark:border-slate-800 text-[11px] font-black uppercase text-slate-500 font-mono">
                  Paleta de Color
                </div>
                <div className="space-y-1 mt-1">
                  {themeOptions.map((opt) => (
                    <button
                      key={opt.id}
                      onClick={() => {
                        onChangeTheme(opt.id);
                        setShowThemeMenu(false);
                      }}
                      className={`w-full p-2 rounded-xl text-left text-xs transition-all flex items-center justify-between cursor-pointer ${
                        currentTheme === opt.id
                          ? 'bg-blue-50 dark:bg-blue-950/60 font-bold text-blue-950 dark:text-white border border-blue-200 dark:border-blue-800'
                          : 'hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <span className={`w-3.5 h-3.5 rounded-full ${opt.colorPreview} border border-white/50`} />
                        <div>
                          <div className="font-bold">{opt.name}</div>
                          <div className="text-[10px] text-slate-500 dark:text-slate-400">{opt.desc}</div>
                        </div>
                      </div>
                      {currentTheme === opt.id && <Check className="w-3.5 h-3.5 text-blue-600 dark:text-cyan-400" />}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Notifications Bell */}
          <div className="relative">
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className={`p-2 rounded-xl border transition-all relative cursor-pointer ${
                isDarkTheme 
                  ? 'bg-slate-900 border-slate-800 text-slate-300 hover:bg-slate-800' 
                  : 'bg-slate-100 border-slate-200 text-slate-700 hover:bg-slate-200'
              }`}
              title="Notificaciones y Alertas"
            >
              <Bell className="w-4 h-4" />
              <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-rose-500 rounded-full ring-2 ring-white dark:ring-slate-900 animate-pulse" />
            </button>

            {showNotifications && (
              <div className={`absolute right-0 mt-2 w-80 rounded-2xl border shadow-2xl py-2 z-50 text-xs backdrop-blur-xl animate-fadeIn ${
                isDarkTheme 
                  ? 'bg-slate-900/95 border-slate-800 text-slate-200' 
                  : 'bg-white/95 border-slate-200 text-slate-800'
              }`}>
                <div className="px-4 py-2 border-b border-slate-200 dark:border-slate-800 flex justify-between items-center">
                  <span className="font-bold flex items-center gap-1.5 text-slate-900 dark:text-white">
                    <AlertTriangle className="w-3.5 h-3.5 text-amber-500" />
                    Alertas Operacionales
                  </span>
                  <span className="px-2 py-0.5 text-[10px] bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300 border border-rose-300 rounded-full font-mono font-bold">
                    1 Crítica
                  </span>
                </div>
                <div className="divide-y divide-slate-100 dark:divide-slate-800 max-h-64 overflow-y-auto">
                  <div 
                    onClick={() => {
                      onNavigateToTab('ncs');
                      setShowNotifications(false);
                    }}
                    className={`p-3 cursor-pointer transition-colors ${isDarkTheme ? 'hover:bg-rose-950/30' : 'hover:bg-rose-50'}`}
                  >
                    <p className="font-bold text-rose-600 dark:text-rose-400">NC-2026-004 Vencida</p>
                    <p className="text-[11px] mt-0.5 text-slate-600 dark:text-slate-400">Área Corte: Criba #2 vencida hace 6 días. Requiere recambio.</p>
                    <span className="text-[10px] font-mono mt-1 block text-slate-400">Hace 2 horas</span>
                  </div>
                  <div 
                    onClick={() => {
                      onNavigateToTab('acciones');
                      setShowNotifications(false);
                    }}
                    className={`p-3 cursor-pointer transition-colors ${isDarkTheme ? 'hover:bg-slate-800/50' : 'hover:bg-slate-50'}`}
                  >
                    <p className="font-bold text-blue-600 dark:text-blue-400">CAPA-AC-074 en Verificación</p>
                    <p className="text-[11px] mt-0.5 text-slate-600 dark:text-slate-400">Empaque: Doble chequeo completado al 95%. Listo para auditoría.</p>
                    <span className="text-[10px] font-mono mt-1 block text-slate-400">Hace 35 minutos</span>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* User Avatar Chip */}
          <div className="flex items-center gap-2 pl-2 border-l border-slate-200 dark:border-slate-800">
            <div className="w-8 h-8 rounded-xl overflow-hidden bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-2xs">
              <img 
                src={currentUser.avatarUrl || '/assets/marcos-salinas.svg'} 
                alt={currentUser.name} 
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
            </div>
            <div className="hidden lg:flex flex-col text-left">
              <span className="text-xs font-bold text-slate-900 dark:text-white leading-tight truncate max-w-[130px]">
                {currentUser.name}
              </span>
              <span className="text-[10px] font-bold text-blue-600 dark:text-cyan-400 font-mono">
                {currentUser.role}
              </span>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
