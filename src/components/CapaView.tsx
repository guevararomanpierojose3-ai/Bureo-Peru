import { useState } from 'react';
import { 
  AlertOctagon, 
  Clock, 
  CheckCircle2, 
  Plus, 
  FileText, 
  UserCheck, 
  ExternalLink,
  ShieldAlert,
  ArrowUpRight,
  Sparkles,
  Search,
  Check,
  Image as ImageIcon,
  Radio,
  Flame,
  ShieldCheck,
  Camera,
  Activity
} from 'lucide-react';
import { CapaCase, DigitalEvidence } from '../types';

interface CapaViewProps {
  cases: CapaCase[];
  onOpenNewModal: () => void;
  onOpenLightbox: (imageUrl: string, title: string) => void;
  onVerifyAndClose: (caseId: string) => void;
  onOpenHtmlLinker: () => void;
  isDarkTheme?: boolean;
}

export default function CapaView({ 
  cases, 
  onOpenNewModal, 
  onOpenLightbox,
  onVerifyAndClose,
  onOpenHtmlLinker,
  isDarkTheme = true 
}: CapaViewProps) {
  const [filter, setFilter] = useState<'Todas' | 'Abiertas' | 'En Proceso' | 'Por Verificar' | 'Cerradas'>('Todas');
  const [searchTerm, setSearchTerm] = useState('');
  const [elevatedAlert, setElevatedAlert] = useState(false);

  const filteredCases = cases.filter(c => {
    if (filter === 'Abiertas' && c.status !== 'Abierta') return false;
    if (filter === 'En Proceso' && c.status !== 'En Proceso') return false;
    if (filter === 'Por Verificar' && c.status !== 'Por Verificar') return false;
    if (filter === 'Cerradas' && c.status !== 'Cerrada Conforme') return false;

    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      return (
        c.code.toLowerCase().includes(term) ||
        c.area.toLowerCase().includes(term) ||
        c.title.toLowerCase().includes(term) ||
        c.responsibleName.toLowerCase().includes(term)
      );
    }
    return true;
  });

  return (
    <div className="space-y-6 pb-20 md:pb-8">
      {/* Subheader status bar */}
      <div className={`flex flex-wrap items-center justify-between gap-3 p-3.5 rounded-2xl border transition-all ${
        isDarkTheme 
          ? 'bg-slate-900/80 border-slate-800 backdrop-blur-xl text-slate-300' 
          : 'bg-white/80 border-slate-200 backdrop-blur-xl text-slate-700 shadow-xs'
      }`}>
        <div className="flex items-center gap-2 text-xs font-mono">
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 font-semibold">
            <Radio className="w-3 h-3 text-cyan-400" />
            CONTROL OPERATIVO DE CALIDAD
          </span>
          <span className="text-slate-600 hidden sm:inline">•</span>
          <span className="text-emerald-400 font-semibold hidden sm:inline">ISO 9001:2015</span>
          <span className="text-slate-600 hidden md:inline">•</span>
          <span className="text-slate-400 hidden md:inline">MATRIZ CAPA INDUSTRIAL</span>
        </div>

        <button
          onClick={onOpenNewModal}
          className="flex items-center gap-1.5 px-3 py-1 text-xs font-semibold rounded-xl bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white shadow-md shadow-cyan-600/25 transition-all"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Nueva No Conformidad</span>
        </button>
      </div>

      {/* Main Title & Action Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className={`text-2xl sm:text-3xl font-extrabold tracking-tight ${isDarkTheme ? 'text-white' : 'text-slate-900'}`}>
            Gestión de No Conformidades & CAPA
          </h1>
          <p className={`text-xs sm:text-sm mt-1 ${isDarkTheme ? 'text-slate-400' : 'text-slate-600'}`}>
            Control de Desviaciones, Ciclo de Resolución 5-Fases y Verificación de Eficacia
          </p>
        </div>

        <button
          onClick={onOpenHtmlLinker}
          className={`flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold border transition-all self-start ${
            isDarkTheme 
              ? 'bg-slate-900 hover:bg-slate-800 text-cyan-400 border-cyan-500/30' 
              : 'bg-white hover:bg-slate-50 text-blue-700 border-blue-200 shadow-xs'
          }`}
        >
          <ImageIcon className="w-4 h-4" />
          <span>Vincular Evidencia HTML</span>
        </button>
      </div>

      {/* Telemetría Operacional CAPA Bento Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
        <div className={`p-4 rounded-2xl border transition-all ${
          isDarkTheme ? 'bg-slate-900/80 border-slate-800 text-white' : 'bg-white border-slate-200 text-slate-900 shadow-sm'
        }`}>
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-[10px] font-mono uppercase text-slate-400">NC Activas</span>
            <span className="px-1.5 py-0.2 text-[9px] font-mono font-bold bg-rose-500/20 text-rose-300 border border-rose-500/40 rounded-full">
              1 CRÍTICA
            </span>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-extrabold font-mono text-rose-400">4</span>
            <span className="text-slate-400 text-xs font-mono">en proceso</span>
          </div>
          <span className="text-[11px] text-rose-400/90 block mt-1 font-mono">1 fuera de tolerancia</span>
        </div>

        <div className={`p-4 rounded-2xl border transition-all ${
          isDarkTheme ? 'bg-slate-900/80 border-slate-800 text-white' : 'bg-white border-slate-200 text-slate-900 shadow-sm'
        }`}>
          <span className="text-[10px] font-mono uppercase text-slate-400 block mb-1.5">Tasa de Cierre</span>
          <span className="text-2xl sm:text-3xl font-extrabold font-mono text-cyan-400">78.5%</span>
          <div className="w-full bg-slate-800 h-1.5 rounded-full mt-2 overflow-hidden">
            <div className="bg-gradient-to-r from-cyan-500 to-blue-500 h-full rounded-full" style={{ width: '78.5%' }}></div>
          </div>
        </div>

        <div className={`p-4 rounded-2xl border transition-all ${
          isDarkTheme ? 'bg-slate-900/80 border-slate-800 text-white' : 'bg-white border-slate-200 text-slate-900 shadow-sm'
        }`}>
          <span className="text-[10px] font-mono uppercase text-slate-400 block mb-1.5">Eficacia Verificada</span>
          <span className="text-2xl sm:text-3xl font-extrabold font-mono text-emerald-400">94.0%</span>
          <span className="text-[11px] text-emerald-400/90 block mt-1 font-mono font-semibold">✓ Objetivo ≥ 90%</span>
        </div>

        <div className={`p-4 rounded-2xl border transition-all ${
          isDarkTheme ? 'bg-slate-900/80 border-slate-800 text-white' : 'bg-white border-slate-200 text-slate-900 shadow-sm'
        }`}>
          <span className="text-[10px] font-mono uppercase text-slate-400 block mb-1.5">MTTR Resolución</span>
          <span className="text-2xl sm:text-3xl font-extrabold font-mono text-teal-300">4.2 <span className="text-xs font-normal text-slate-400">días</span></span>
          <span className="text-[11px] text-teal-400 block mt-1 font-mono">Meta ≤ 5.0 días</span>
        </div>
      </div>

      {/* High-Tech Glowing Critical Incident Card (NC-2026-004) */}
      <div className={`rounded-2xl p-5 border relative overflow-hidden transition-all glow-rose ${
        isDarkTheme 
          ? 'bg-rose-950/30 border-rose-500/40 text-rose-100' 
          : 'bg-rose-50 border-rose-300 text-rose-950 shadow-sm'
      }`}>
        <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
          <div className="flex items-center gap-2">
            <span className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-rose-500"></span>
            </span>
            <span className="font-mono font-extrabold text-base text-rose-400 tracking-tight">NC-2026-004</span>
            <span className="px-2.5 py-0.5 text-[10px] font-mono font-bold uppercase bg-rose-600 text-white rounded-full shadow-sm">
              ALERTA CRÍTICA • VENCIDA HACE 2D
            </span>
          </div>

          <span className="text-[11px] font-mono text-rose-300">Área: Corte Industrial • Criba Tolva #2</span>
        </div>

        <h3 className="text-base font-extrabold text-white mb-1">
          Desviación repetitiva de contaminación por rotura de criba en tolva #2 (Lote Austral-09)
        </h3>
        <p className="text-xs text-rose-200/90 mb-4 max-w-4xl">
          Se identificó presencia de partículas no conformes tras fatiga cíclica de material en la malla vibratoria primaria. Requiere reemplazo con malla ASTM E-11 y re-inspección de lote.
        </p>

        <div className={`grid grid-cols-1 sm:grid-cols-3 gap-3 p-3 rounded-xl border text-xs font-mono mb-4 ${
          isDarkTheme ? 'bg-slate-950/60 border-rose-500/20' : 'bg-white/80 border-rose-200'
        }`}>
          <div>
            <span className="text-rose-400 block text-[10px]">RESPONSABLE ASIGNADO</span>
            <span className="font-bold text-white">Ing. Marcos Salinas</span>
          </div>
          <div>
            <span className="text-rose-400 block text-[10px]">FECHA COMPROMISO</span>
            <span className="font-bold text-rose-300">03/01/2026 (Expirada)</span>
          </div>
          <div>
            <span className="text-rose-400 block text-[10px]">NIVEL DE RIESGO ISO</span>
            <span className="font-bold text-amber-300">Nivel 4 (Severidad Alta)</span>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button 
            onClick={() => onOpenLightbox('/assets/foto-banda.svg', 'Evidencia: Rotura de Criba Tolva #2')}
            className="px-4 py-2 bg-rose-600 hover:bg-rose-500 text-white rounded-xl font-bold text-xs flex items-center gap-2 transition-all shadow-md active:scale-95"
          >
            <ShieldAlert className="w-4 h-4" />
            <span>Auditar Acción & Evidencia Foto</span>
          </button>

          <button 
            onClick={() => setElevatedAlert(true)}
            className={`px-4 py-2 rounded-xl font-bold text-xs flex items-center gap-2 transition-all border ${
              isDarkTheme 
                ? 'bg-slate-900/80 hover:bg-slate-800 text-rose-300 border-rose-500/40' 
                : 'bg-white hover:bg-rose-100 text-rose-800 border-rose-300'
            }`}
          >
            <ArrowUpRight className="w-4 h-4" />
            <span>{elevatedAlert ? '✓ Escalado a Gerencia General' : 'Elevar a Gerencia General'}</span>
          </button>
        </div>
      </div>

      {/* Filter Tabs & Search Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        {/* Modern Filter Pills */}
        <div className={`flex flex-wrap gap-1.5 p-1 rounded-2xl border ${
          isDarkTheme ? 'bg-slate-900/80 border-slate-800' : 'bg-slate-100 border-slate-200'
        }`}>
          {(['Todas', 'Abiertas', 'En Proceso', 'Por Verificar', 'Cerradas'] as const).map((tab) => {
            const isActive = filter === tab;
            const count = 
              tab === 'Todas' ? cases.length :
              tab === 'Abiertas' ? cases.filter(c => c.status === 'Abierta').length :
              tab === 'En Proceso' ? cases.filter(c => c.status === 'En Proceso').length :
              tab === 'Por Verificar' ? cases.filter(c => c.status === 'Por Verificar').length :
              cases.filter(c => c.status === 'Cerrada Conforme').length;

            return (
              <button
                key={tab}
                onClick={() => setFilter(tab)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all flex items-center gap-1.5 ${
                  isActive
                    ? isDarkTheme 
                      ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-md' 
                      : 'bg-blue-600 text-white shadow-xs'
                    : isDarkTheme ? 'text-slate-400 hover:text-white' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <span>{tab}</span>
                <span className={`px-1.5 py-0.2 rounded-full text-[10px] font-mono ${
                  isActive ? 'bg-white/25 text-white' : isDarkTheme ? 'bg-slate-800 text-slate-400' : 'bg-slate-200 text-slate-600'
                }`}>
                  {count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Search Bar */}
        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 text-cyan-400 absolute left-3 top-3" />
          <input 
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Buscar por código, área, responsable..."
            className={`w-full pl-9 pr-3 py-2 text-xs rounded-xl border transition-all focus:outline-none ${
              isDarkTheme 
                ? 'bg-slate-900/80 border-slate-800 text-white placeholder-slate-500 focus:border-cyan-500/50' 
                : 'bg-white border-slate-200 text-slate-900 placeholder-slate-400 focus:border-blue-500'
            }`}
          />
        </div>
      </div>

      {/* Case Cards List */}
      <div className="space-y-4">
        {filteredCases.map((c) => {
          const isClosed = c.status === 'Cerrada Conforme';
          const isPendingVerification = c.status === 'Por Verificar';
          const isInProgress = c.status === 'En Proceso';

          return (
            <div 
              key={c.id}
              className={`rounded-2xl p-5 border transition-all space-y-4 ${
                isDarkTheme 
                  ? 'bg-slate-900/80 border-slate-800 hover:border-slate-700 backdrop-blur-xl text-white' 
                  : 'bg-white border-slate-200 text-slate-900 shadow-sm'
              }`}
            >
              {/* Header card */}
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-800/60 pb-3">
                <div className="flex items-center gap-3">
                  <span className="font-mono font-extrabold text-base text-cyan-400">{c.code}</span>
                  <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold uppercase tracking-wider ${
                    isClosed ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40' :
                    isPendingVerification ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40' :
                    isInProgress ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40' :
                    'bg-rose-500/20 text-rose-300 border border-rose-500/40'
                  }`}>
                    {c.status}
                  </span>
                </div>

                <div className="flex items-center gap-3">
                  {c.overdueText && (
                    <span className="text-xs font-mono text-amber-400 flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5 text-amber-400" />
                      {c.overdueText}
                    </span>
                  )}

                  {/* Verification action button */}
                  {!isClosed && (
                    <button
                      onClick={() => onVerifyAndClose(c.id)}
                      className="px-3 py-1 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all shadow-xs"
                    >
                      <UserCheck className="w-3.5 h-3.5" />
                      <span>Auditar & Cerrar</span>
                    </button>
                  )}
                </div>
              </div>

              {/* Area & Lot details */}
              <div className="text-xs font-mono text-slate-400">
                ÁREA: <span className="font-bold text-white">{c.area.toUpperCase()}</span> • LOTE ASOCIADO: <span className="font-bold text-cyan-300">{c.lotCode}</span>
              </div>

              <h4 className="text-sm font-bold text-slate-100">{c.title}</h4>

              {/* Root Cause & Corrective Action */}
              <div className={`rounded-xl p-3.5 text-xs space-y-2.5 border ${
                isDarkTheme ? 'bg-slate-950/60 border-slate-800' : 'bg-slate-50 border-slate-200'
              }`}>
                {c.rootCauseDiagnosis && (
                  <div>
                    <span className="text-[10px] font-mono uppercase text-cyan-400 block font-bold">
                      CAUSA RAÍZ DIAGNOSTICADA ({c.rootCauseMethod || '5 PORQUÉS'})
                    </span>
                    <p className="text-slate-300 mt-0.5">{c.rootCauseDiagnosis}</p>
                  </div>
                )}
                {c.correctiveActionPlan && (
                  <div>
                    <span className="text-[10px] font-mono uppercase text-emerald-400 block font-bold">
                      {c.correctiveActionCode || 'ACCIÓN TOMADA & EJECUTADA'}
                    </span>
                    <p className="text-slate-300 mt-0.5">{c.correctiveActionPlan}</p>
                  </div>
                )}
              </div>

              {/* 5-Phase Resolution Pipeline */}
              <div>
                <span className="text-[10px] font-mono uppercase text-slate-400 block mb-1.5 font-bold tracking-wider">
                  CICLO DE RESOLUCIÓN ISO (5 FASES)
                </span>
                <div className="grid grid-cols-5 gap-1.5 text-[11px] text-center font-mono">
                  <div className={`py-1 px-1.5 rounded-lg border transition-all ${
                    c.resolutionCycle?.detect 
                      ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40 font-bold' 
                      : 'bg-slate-900 text-slate-500 border-slate-800'
                  }`}>
                    1. Detectar {c.resolutionCycle?.detect ? '✓' : ''}
                  </div>
                  <div className={`py-1 px-1.5 rounded-lg border transition-all ${
                    c.resolutionCycle?.cause 
                      ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40 font-bold' 
                      : 'bg-slate-900 text-slate-500 border-slate-800'
                  }`}>
                    2. Causa {c.resolutionCycle?.cause ? '✓' : ''}
                  </div>
                  <div className={`py-1 px-1.5 rounded-lg border transition-all ${
                    c.resolutionCycle?.immediate 
                      ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40 font-bold' 
                      : 'bg-slate-900 text-slate-500 border-slate-800'
                  }`}>
                    3. Contención {c.resolutionCycle?.immediate ? '✓' : ''}
                  </div>
                  <div className={`py-1 px-1.5 rounded-lg border transition-all ${
                    c.resolutionCycle?.implement 
                      ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40 font-bold' 
                      : 'bg-slate-900 text-slate-500 border-slate-800'
                  }`}>
                    4. Implementar {c.resolutionCycle?.implement ? '✓' : ''}
                  </div>
                  <div className={`py-1 px-1.5 rounded-lg border transition-all ${
                    c.resolutionCycle?.efficacy 
                      ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40 font-bold' 
                      : 'bg-slate-900 text-slate-500 border-slate-800'
                  }`}>
                    5. Eficacia {c.resolutionCycle?.efficacy ? '✓' : ''}
                  </div>
                </div>
              </div>

              {/* Technical Digital Evidence Gallery (HTML-Linked Images) */}
              {c.evidenceFiles && c.evidenceFiles.length > 0 && (
                <div className="pt-2 border-t border-slate-800/60">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] font-mono uppercase text-cyan-400 font-bold flex items-center gap-1.5">
                      <Camera className="w-3.5 h-3.5" />
                      EVIDENCIA FOTOGRÁFICA VINCULADA ({c.evidenceFiles.length} ARCHIVOS)
                    </span>
                    <button 
                      onClick={onOpenHtmlLinker}
                      className="text-[10px] text-cyan-400 hover:text-cyan-300 flex items-center gap-1 font-mono transition-colors"
                    >
                      <ImageIcon className="w-3 h-3" />
                      Vincular más en HTML
                    </button>
                  </div>

                  <div className="flex flex-wrap gap-3">
                    {c.evidenceFiles.map((ev) => (
                      <div 
                        key={ev.id}
                        onClick={() => onOpenLightbox(ev.fileUrl, ev.title)}
                        className="group relative flex flex-col items-center border border-slate-800 hover:border-cyan-500/50 rounded-xl p-1.5 bg-slate-950/80 cursor-pointer transition-all hover:scale-105 w-28"
                      >
                        <div className="w-24 h-16 bg-slate-900 rounded-lg overflow-hidden flex items-center justify-center relative">
                          <img 
                            src={ev.fileUrl} 
                            alt={ev.title}
                            className="w-full h-full object-cover group-hover:opacity-90 transition-opacity"
                            referrerPolicy="no-referrer"
                          />
                          <span className="absolute bottom-1 right-1 px-1.5 py-0.2 text-[8px] font-mono bg-black/80 text-cyan-300 rounded">
                            {ev.code}
                          </span>
                        </div>
                        <span className="text-[10px] font-mono text-slate-300 mt-1.5 truncate w-full text-center">
                          {ev.title}
                        </span>
                      </div>
                    ))}

                    {/* PDF Technical Report */}
                    <div className="flex flex-col items-center justify-center border border-slate-800 rounded-xl p-2 bg-slate-950/80 w-28 h-24 text-slate-400">
                      <FileText className="w-6 h-6 text-cyan-400 mb-1" />
                      <span className="text-[10px] font-mono font-bold text-slate-300">INFORME.PDF</span>
                      <span className="text-[9px] font-mono text-slate-500">Firmado ISO</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
