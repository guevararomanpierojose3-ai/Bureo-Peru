import { useState } from 'react';
import { 
  Bell, 
  RefreshCw, 
  Code, 
  Search, 
  Sparkles, 
  Palette, 
  Radio, 
  FlaskConical, 
  Cpu,
  Check,
  ChevronDown
} from 'lucide-react';
import { ColorTheme } from '../types';

interface NavbarProps {
  onOpenHtmlLinker: () => void;
  isSyncing: boolean;
  onTriggerSync: () => void;
  currentTheme: ColorTheme;
  onChangeTheme: (theme: ColorTheme) => void;
  onOpenCommandPalette: () => void;
}

export default function Navbar({ 
  onOpenHtmlLinker, 
  isSyncing, 
  onTriggerSync,
  currentTheme,
  onChangeTheme,
  onOpenCommandPalette
}: NavbarProps) {
  const [showNotifications, setShowNotifications] = useState(false);
  const [showThemeMenu, setShowThemeMenu] = useState(false);

  const themeOptions = [
    {
      id: 'ocean' as ColorTheme,
      name: 'Océano Cristalino',
      desc: 'Claro, nítido y alto contraste (Recomendado)',
      colorPreview: 'bg-blue-600',
      badge: 'Predeterminado'
    },
    {
      id: 'eco' as ColorTheme,
      name: 'Eco NetPositiva',
      desc: 'Verde esmeralda y menta sostenible',
      colorPreview: 'bg-emerald-600',
      badge: 'Patagonia'
    },
    {
      id: 'cobalt' as ColorTheme,
      name: 'Zafiro Industrial',
      desc: 'Azul cobalto de alta energía y nitidez',
      colorPreview: 'bg-indigo-600',
      badge: 'Vibrante'
    },
    {
      id: 'dark' as ColorTheme,
      name: 'Control Room Nocturno',
      desc: 'Fondo grafito noche con luces neón',
      colorPreview: 'bg-slate-900',
      badge: 'Cyber'
    }
  ];

  const currentThemeObj = themeOptions.find(t => t.id === currentTheme) || themeOptions[0];
  const isDark = currentTheme === 'dark';

  return (
    <header className={`sticky top-0 z-40 transition-colors backdrop-blur-xl border-b ${
      isDark 
        ? 'bg-slate-950/90 border-slate-800 text-white shadow-xl' 
        : 'bg-white/95 border-slate-200/90 text-slate-900 shadow-xs'
    }`}>
      <div className="max-w-7xl mx-auto px-3 sm:px-6 flex items-center justify-between h-16 gap-3">
        {/* Left: Brand & Plant Title */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2.5">
            <div className={`p-1.5 rounded-xl transition-all ${isDark ? 'bg-cyan-500/10 border border-cyan-500/30' : 'bg-blue-50 border border-blue-200 shadow-xs'}`}>
              <img 
                src="/assets/bureo-logo.svg" 
                alt="Bureo" 
                className="h-6 sm:h-7 w-auto object-contain"
                referrerPolicy="no-referrer"
              />
            </div>
            
            <div className="flex flex-col">
              <div className="flex items-center gap-2">
                <span className={`text-xs sm:text-sm font-black tracking-tight leading-tight ${isDark ? 'text-white' : 'text-slate-900'}`}>
                  Bureo Perú • QMS Hub
                </span>
                <span className="px-1.5 py-0.2 text-[9px] font-mono font-bold rounded-full bg-blue-100 text-blue-800 border border-blue-300 dark:bg-cyan-500/20 dark:text-cyan-400 dark:border-cyan-500/40">
                  ISO 9001:2015
                </span>
              </div>
              <span className={`text-[10px] font-mono ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                NetPositiva Recycling • Planta Paita & Chimbote
              </span>
            </div>
          </div>
        </div>

        {/* Center: Command Palette Trigger */}
        <div className="flex items-center gap-2">
          <button
            onClick={onOpenCommandPalette}
            className={`hidden md:flex items-center gap-2 px-3.5 py-1.5 rounded-xl border text-xs transition-all cursor-pointer ${
              isDark
                ? 'bg-slate-900 border-slate-700/80 text-slate-300 hover:border-cyan-500 hover:bg-slate-800'
                : 'bg-slate-100 border-slate-200 text-slate-700 hover:border-blue-400 hover:bg-slate-50 shadow-2xs'
            }`}
            title="Buscar comandos, lotes o acciones (Ctrl+K / ⌘K)"
          >
            <Search className="w-3.5 h-3.5 text-blue-600 dark:text-cyan-400" />
            <span className="text-slate-500 dark:text-slate-400 font-sans">Buscar lote, ensayo o comando...</span>
            <kbd className={`ml-2 px-1.5 py-0.5 rounded text-[10px] font-mono font-bold ${
              isDark ? 'bg-slate-800 text-slate-400 border border-slate-700' : 'bg-white text-slate-600 border border-slate-300'
            }`}>
              ⌘K
            </kbd>
          </button>

          {/* Sync Apps Script Indicator Button */}
          <button
            onClick={onTriggerSync}
            disabled={isSyncing}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-mono font-bold rounded-xl border transition-all cursor-pointer ${
              isDark
                ? 'bg-emerald-950/40 border-emerald-500/40 text-emerald-300 hover:bg-emerald-900/40'
                : 'bg-emerald-50 border-emerald-300 text-emerald-800 hover:bg-emerald-100 shadow-2xs'
            }`}
            title="Sincronizar datos con Google Sheets (GAS v2.4)"
          >
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <RefreshCw className={`w-3.5 h-3.5 ${isSyncing ? 'animate-spin text-emerald-500' : 'text-emerald-600'}`} />
            <span className="hidden sm:inline">GAS Sync</span>
          </button>

          {/* Vincular Imágenes HTML Button */}
          <button
            onClick={onOpenHtmlLinker}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-xl bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white shadow-md shadow-blue-600/20 transition-all active:scale-95 cursor-pointer"
            title="Herramienta interactiva para vincular imágenes en HTML"
          >
            <Code className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Vincular</span>
            <span>Imágenes HTML</span>
          </button>
        </div>

        {/* Right: Interactive Theme Selector, Notifications & User */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* THEME SELECTOR DROPDOWN (Direct response to "DE SE COLOR NO QUE SE VEA") */}
          <div className="relative">
            <button
              onClick={() => setShowThemeMenu(!showThemeMenu)}
              className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl border text-xs font-bold transition-all cursor-pointer ${
                isDark
                  ? 'bg-slate-900 border-slate-700 text-slate-200 hover:bg-slate-800'
                  : 'bg-slate-100 border-slate-200 text-slate-800 hover:bg-slate-200 shadow-2xs'
              }`}
              title="Cambiar paleta de colores de la interfaz"
            >
              <Palette className="w-3.5 h-3.5 text-blue-600 dark:text-cyan-400" />
              <span className="hidden md:inline font-sans">{currentThemeObj.name}</span>
              <span className={`w-2.5 h-2.5 rounded-full ${currentThemeObj.colorPreview} inline-block border border-white/40`} />
              <ChevronDown className="w-3 h-3 text-slate-400" />
            </button>

            {/* Theme Dropdown Menu */}
            {showThemeMenu && (
              <div className={`absolute right-0 mt-2 w-72 rounded-2xl border shadow-2xl p-2 z-50 animate-fadeIn backdrop-blur-xl ${
                isDark 
                  ? 'bg-slate-900/95 border-slate-700 text-slate-100' 
                  : 'bg-white/95 border-slate-200 text-slate-900'
              }`}>
                <div className="px-3 py-2 border-b border-slate-200 dark:border-slate-800">
                  <span className="text-xs font-black uppercase tracking-wider block text-slate-900 dark:text-white">
                    Paleta de Colores
                  </span>
                  <p className="text-[11px] text-slate-500">
                    Elige el estilo visual que mejor se vea en tu pantalla:
                  </p>
                </div>

                <div className="space-y-1 mt-1">
                  {themeOptions.map((opt) => {
                    const isSelected = currentTheme === opt.id;
                    return (
                      <button
                        key={opt.id}
                        onClick={() => {
                          onChangeTheme(opt.id);
                          setShowThemeMenu(false);
                        }}
                        className={`w-full p-2.5 rounded-xl text-left text-xs transition-all flex items-start justify-between cursor-pointer ${
                          isSelected
                            ? isDark
                              ? 'bg-blue-950/60 border border-cyan-500/50 text-white'
                              : 'bg-blue-50 border border-blue-200 text-blue-950 font-bold'
                            : isDark
                            ? 'hover:bg-slate-800 text-slate-300'
                            : 'hover:bg-slate-100 text-slate-700'
                        }`}
                      >
                        <div className="flex items-center gap-2.5">
                          <span className={`w-4 h-4 rounded-full ${opt.colorPreview} shrink-0 shadow-xs border border-white/50`} />
                          <div>
                            <span className="font-bold block text-slate-900 dark:text-white">
                              {opt.name}
                            </span>
                            <span className="text-[10px] text-slate-500 dark:text-slate-400 block leading-tight">
                              {opt.desc}
                            </span>
                          </div>
                        </div>

                        {isSelected && (
                          <Check className="w-4 h-4 text-blue-600 dark:text-cyan-400 shrink-0 mt-0.5" />
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          {/* Notification Bell */}
          <div className="relative">
            <button 
              onClick={() => setShowNotifications(!showNotifications)}
              className={`p-2 rounded-xl border transition-all relative cursor-pointer ${
                isDark 
                  ? 'bg-slate-900 border-slate-800 text-slate-300 hover:bg-slate-800' 
                  : 'bg-slate-100 border-slate-200 text-slate-700 hover:bg-slate-200'
              }`}
              title="Notificaciones de Auditoría"
            >
              <Bell className="w-4 h-4" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-rose-500 rounded-full ring-2 ring-white dark:ring-slate-900 animate-pulse"></span>
            </button>

            {showNotifications && (
              <div className={`absolute right-0 mt-2 w-80 rounded-2xl border shadow-2xl py-2 z-50 text-xs backdrop-blur-xl animate-fadeIn ${
                isDark 
                  ? 'bg-slate-900/95 border-slate-800 text-slate-200' 
                  : 'bg-white/95 border-slate-200 text-slate-800'
              }`}>
                <div className="px-4 py-2 border-b border-slate-200 dark:border-slate-800 flex justify-between items-center">
                  <span className="font-bold flex items-center gap-1.5 text-slate-900 dark:text-white">
                    <Radio className="w-3.5 h-3.5 text-blue-600 dark:text-cyan-400" />
                    Alertas Operacionales
                  </span>
                  <span className="px-2 py-0.5 text-[10px] bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300 border border-rose-300 rounded-full font-mono font-bold">
                    1 Crítica
                  </span>
                </div>
                <div className="divide-y divide-slate-100 dark:divide-slate-800 max-h-60 overflow-y-auto">
                  <div className={`p-3 transition-colors ${isDark ? 'hover:bg-rose-950/30' : 'hover:bg-rose-50'}`}>
                    <p className="font-bold text-rose-600 dark:text-rose-400">NC-2026-004 Vencida</p>
                    <p className="text-[11px] mt-0.5 text-slate-600 dark:text-slate-400">Área Corte Industrial: Criba #2 requiere auditoría inmediata.</p>
                    <span className="text-[10px] font-mono mt-1 block text-slate-400">Hace 2 horas</span>
                  </div>
                  <div className={`p-3 transition-colors ${isDark ? 'hover:bg-slate-800/50' : 'hover:bg-slate-50'}`}>
                    <p className="font-bold text-emerald-600 dark:text-emerald-400">Ensayo Lote LOT-2026-NP92 Aprobado</p>
                    <p className="text-[11px] mt-0.5 text-slate-600 dark:text-slate-400">Laboratorio QA emitió CoA con 99.2% pureza polimérica.</p>
                    <span className="text-[10px] font-mono mt-1 block text-slate-400">Hace 15 minutos</span>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* User Profile */}
          <div className="flex items-center gap-2 pl-2 border-l border-slate-200 dark:border-slate-700">
            <div className="relative w-8 h-8 rounded-xl overflow-hidden border border-blue-400 dark:border-cyan-500/40 bg-slate-100 dark:bg-slate-800 shadow-sm">
              <img 
                src="/assets/marcos-salinas.svg" 
                alt="Ing. Marcos Salinas" 
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
            </div>
            <div className="hidden lg:flex flex-col">
              <span className={`text-xs font-bold leading-tight ${isDark ? 'text-slate-100' : 'text-slate-900'}`}>
                Ing. Marcos Salinas
              </span>
              <span className="text-[10px] text-blue-600 dark:text-cyan-400 font-mono font-bold">Jefe de Planta QA</span>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
