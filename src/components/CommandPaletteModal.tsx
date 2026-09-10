import { useState, useEffect } from 'react';
import { 
  Search, 
  X, 
  LayoutDashboard, 
  FileText, 
  GitBranch, 
  AlertTriangle, 
  Settings, 
  Code, 
  Plus, 
  Sparkles, 
  ArrowRight,
  Database,
  ExternalLink,
  ShieldCheck,
  CheckCircle2,
  FlaskConical,
  Cpu
} from 'lucide-react';
import { ActiveTab, CapaCase } from '../types';

interface CommandPaletteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectTab: (tab: ActiveTab) => void;
  onOpenHtmlLinker: () => void;
  onOpenNewCapa: () => void;
  onTriggerSync: () => void;
  capaCases: CapaCase[];
}

export default function CommandPaletteModal({
  isOpen,
  onClose,
  onSelectTab,
  onOpenHtmlLinker,
  onOpenNewCapa,
  onTriggerSync,
  capaCases
}: CommandPaletteModalProps) {
  const [search, setSearch] = useState('');

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        // Toggle is handled upstream or through state
      }
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const quickActions = [
    {
      id: 'act-new-capa',
      title: 'Registrar Nueva No Conformidad (CAPA)',
      subtitle: 'Crear hallazgo, asignar responsable y subir evidencias',
      icon: Plus,
      color: 'text-cyan-400 bg-cyan-500/10 border-cyan-500/30',
      action: () => {
        onClose();
        onOpenNewCapa();
      }
    },
    {
      id: 'act-html-images',
      title: 'Herramienta: Vincular Imágenes en HTML',
      subtitle: 'Guía interactiva, banco de pruebas y generador de etiquetas <img>',
      icon: Code,
      color: 'text-indigo-400 bg-indigo-500/10 border-indigo-500/30',
      action: () => {
        onClose();
        onOpenHtmlLinker();
      }
    },
    {
      id: 'act-sync-gas',
      title: 'Sincronizar Google Sheets (GAS v2.4)',
      subtitle: 'Latencia ~18ms • Refrescar libro maestro y balance de masas',
      icon: Database,
      color: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30',
      action: () => {
        onClose();
        onTriggerSync();
      }
    },
    {
      id: 'act-tab-indicadores',
      title: 'Ir a Dashboard de Indicadores & Metas',
      subtitle: 'Tacómetro ICG 94.8%, matriz ISO 9001 y ranking de planta',
      icon: LayoutDashboard,
      color: 'text-blue-400 bg-blue-500/10 border-blue-500/30',
      action: () => {
        onClose();
        onSelectTab('indicadores');
      }
    },
    {
      id: 'act-tab-lab',
      title: 'Ir a Laboratorio Fisicoquímico QA',
      subtitle: 'Ensayos MFI, densidad, tracción y certificados CoA ASTM',
      icon: FlaskConical,
      color: 'text-cyan-400 bg-cyan-500/10 border-cyan-500/30',
      action: () => {
        onClose();
        onSelectTab('lab');
      }
    },
    {
      id: 'act-tab-planta',
      title: 'Ir a Monitoreo de Planta IoT & Visión Artificial',
      subtitle: 'Telemetría de extrusora, detector óptico de defectos y balance de masas',
      icon: Cpu,
      color: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30',
      action: () => {
        onClose();
        onSelectTab('planta');
      }
    },
    {
      id: 'act-tab-capa',
      title: 'Ir a Gestión de No Conformidades & CAPA',
      subtitle: `${capaCases.length} casos registrados • 1 alerta crítica`,
      icon: AlertTriangle,
      color: 'text-amber-400 bg-amber-500/10 border-amber-500/30',
      action: () => {
        onClose();
        onSelectTab('capa');
      }
    },
    {
      id: 'act-tab-trazabilidad',
      title: 'Ir a Trazabilidad de Lotes & Genealogía',
      subtitle: 'Redes NetPositiva desde caletas hasta pellets procesados',
      icon: GitBranch,
      color: 'text-teal-400 bg-teal-500/10 border-teal-500/30',
      action: () => {
        onClose();
        onSelectTab('trazabilidad');
      }
    },
    {
      id: 'act-tab-registro',
      title: 'Ir a Centro de Reportes Ejecutivos',
      subtitle: 'Certificados oficiales, exportación PDF/Excel y firma digital',
      icon: FileText,
      color: 'text-purple-400 bg-purple-500/10 border-purple-500/30',
      action: () => {
        onClose();
        onSelectTab('registro');
      }
    },
    {
      id: 'act-tab-config',
      title: 'Ir a Configuración y Auditoría GAS',
      subtitle: 'Libros maestros, registros inmutables SHA-256',
      icon: Settings,
      color: 'text-slate-400 bg-slate-500/10 border-slate-500/30',
      action: () => {
        onClose();
        onSelectTab('config');
      }
    }
  ];

  const filteredActions = quickActions.filter(a => 
    a.title.toLowerCase().includes(search.toLowerCase()) ||
    a.subtitle.toLowerCase().includes(search.toLowerCase())
  );

  const matchingCases = capaCases.filter(c =>
    c.code.toLowerCase().includes(search.toLowerCase()) ||
    c.title.toLowerCase().includes(search.toLowerCase()) ||
    c.area.toLowerCase().includes(search.toLowerCase()) ||
    c.lotCode.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-16 sm:pt-24 px-4 bg-slate-950/80 backdrop-blur-md animate-fadeIn">
      <div 
        className="w-full max-w-2xl bg-slate-900 border border-cyan-500/30 rounded-2xl shadow-2xl overflow-hidden text-slate-100 flex flex-col max-h-[80vh] glow-cyan"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search header */}
        <div className="flex items-center px-4 py-3.5 border-b border-slate-800 gap-3 bg-slate-950/60">
          <Search className="w-5 h-5 text-cyan-400 shrink-0" />
          <input 
            type="text" 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Escribe un comando, No Conformidad, lote o módulo... (ej: 'corte', 'lote', 'html')"
            className="w-full bg-transparent text-sm sm:text-base text-white placeholder-slate-500 focus:outline-none font-sans"
            autoFocus
          />
          <div className="hidden sm:flex items-center gap-1.5 px-2 py-0.5 rounded bg-slate-800 border border-slate-700 text-[10px] font-mono text-slate-400">
            <span>ESC</span>
          </div>
          <button 
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Action list */}
        <div className="overflow-y-auto divide-y divide-slate-800/60 p-2 text-xs">
          {/* Section: Quick Actions */}
          <div className="px-3 py-1.5 text-[11px] font-mono font-semibold uppercase tracking-wider text-cyan-400/80 flex items-center gap-1.5">
            <Sparkles className="w-3 h-3" />
            Acciones Rápidas & Telemetría
          </div>

          <div className="space-y-1 mb-3">
            {filteredActions.map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  onClick={item.action}
                  className="w-full flex items-center justify-between p-2.5 rounded-xl hover:bg-slate-800/80 transition-all text-left group border border-transparent hover:border-slate-700"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className={`p-2 rounded-lg border ${item.color} shrink-0`}>
                      <Icon className="w-4 h-4" />
                    </div>
                    <div className="truncate">
                      <div className="text-sm font-medium text-slate-200 group-hover:text-cyan-300 transition-colors truncate">
                        {item.title}
                      </div>
                      <div className="text-[11px] text-slate-400 truncate font-sans">
                        {item.subtitle}
                      </div>
                    </div>
                  </div>
                  <ArrowRight className="w-4 h-4 text-slate-600 group-hover:text-cyan-400 transition-colors shrink-0 ml-2" />
                </button>
              );
            })}
          </div>

          {/* Section: Capa matches */}
          {matchingCases.length > 0 && search.length > 1 && (
            <div>
              <div className="px-3 py-1.5 text-[11px] font-mono font-semibold uppercase tracking-wider text-amber-400/80 flex items-center gap-1.5 mt-2">
                <AlertTriangle className="w-3 h-3" />
                No Conformidades Coincidentes ({matchingCases.length})
              </div>
              <div className="space-y-1">
                {matchingCases.map((c) => (
                  <button
                    key={c.id}
                    onClick={() => {
                      onClose();
                      onSelectTab('capa');
                    }}
                    className="w-full flex items-center justify-between p-2.5 rounded-xl hover:bg-slate-800/80 transition-all text-left group border border-transparent hover:border-amber-500/20"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-bold text-amber-400">{c.code}</span>
                        <span className="text-xs text-slate-300">{c.area}</span>
                        {c.isCritical && (
                          <span className="px-1.5 py-0.2 text-[9px] font-mono font-bold bg-rose-500/20 text-rose-300 border border-rose-500/40 rounded">
                            CRÍTICA
                          </span>
                        )}
                      </div>
                      <div className="text-xs text-slate-400 mt-0.5 line-clamp-1">{c.title}</div>
                    </div>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-300">
                      {c.status}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer info */}
        <div className="px-4 py-2.5 bg-slate-950/80 border-t border-slate-800 text-[11px] font-mono text-slate-400 flex items-center justify-between">
          <span>QMS Industrial Bureo Perú • Command Deck v3.0</span>
          <span className="text-cyan-400">Pulsa ESC para cerrar</span>
        </div>
      </div>
    </div>
  );
}
