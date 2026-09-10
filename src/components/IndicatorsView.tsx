import { useState } from 'react';
import { 
  ShieldCheck, 
  TrendingUp, 
  TrendingDown, 
  AlertTriangle, 
  CheckCircle2, 
  Sliders, 
  FileSpreadsheet, 
  FileDown, 
  Camera, 
  ExternalLink,
  ChevronRight,
  Info,
  Radio,
  Sparkles,
  Layers,
  Activity,
  Zap,
  Gauge
} from 'lucide-react';
import { IndicatorMetric, AreaRanking } from '../types';

interface IndicatorsViewProps {
  metrics: IndicatorMetric[];
  rankings: AreaRanking[];
  onOpenLightbox: (imageUrl: string, title: string) => void;
  onNavigateToArea?: (areaName: string) => void;
  onExportReport?: () => void;
  isDarkTheme?: boolean;
}

export default function IndicatorsView({ 
  metrics, 
  rankings, 
  onOpenLightbox, 
  onNavigateToArea,
  onExportReport,
  isDarkTheme = true
}: IndicatorsViewProps) {
  const [activePeriod, setActivePeriod] = useState<'hoy' | 'sem' | 'mes' | 'ano'>('mes');
  const [simContamTarget, setSimContamTarget] = useState<number>(1.50);
  const [simIcgTarget, setSimIcgTarget] = useState<number>(95.0);
  const [isSaved, setIsSaved] = useState(false);

  const handleSaveSim = () => {
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2500);
  };

  // Dynamic simulated score
  const dynamicIcgScore = (94.8 + (1.50 - simContamTarget) * 1.8 + (simIcgTarget - 95.0) * 0.1).toFixed(1);
  const numericIcg = Math.min(100, Math.max(70, parseFloat(dynamicIcgScore)));
  
  // Gauge calculation
  const radius = 74;
  const circumference = Math.PI * radius; // half circle
  const strokeDashoffset = circumference - (numericIcg / 100) * circumference;

  return (
    <div className="space-y-6 pb-20 md:pb-8">
      {/* Subheader status bar with cyber badges */}
      <div className={`flex flex-wrap items-center justify-between gap-3 p-3.5 rounded-2xl border transition-all ${
        isDarkTheme 
          ? 'bg-slate-900/80 border-slate-800 backdrop-blur-xl text-slate-300' 
          : 'bg-white/80 border-slate-200 backdrop-blur-xl text-slate-700 shadow-xs'
      }`}>
        <div className="flex items-center gap-2 text-xs font-mono">
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 font-semibold">
            <Radio className="w-3 h-3 animate-pulse text-cyan-400" />
            ISO 9001:2015 §9.1.3
          </span>
          <span className="text-slate-600 hidden sm:inline">•</span>
          <span className="text-emerald-400 font-semibold hidden sm:inline">AUDIT-READY HUD</span>
          <span className="text-slate-600 hidden md:inline">•</span>
          <span className={`text-[11px] font-mono hidden md:inline ${isDarkTheme ? 'text-slate-400' : 'text-slate-500'}`}>
            APPS SCRIPT v2.4 • DB_METAS_CALIDAD
          </span>
        </div>

        <div className="flex items-center gap-2">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400"></span>
          </span>
          <span className={`text-xs font-mono ${isDarkTheme ? 'text-slate-400' : 'text-slate-500'}`}>
            Telemetría en Vivo • Sincronizado
          </span>
        </div>
      </div>

      {/* Main Title & Period Selector */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className={`text-2xl sm:text-3xl font-extrabold tracking-tight ${isDarkTheme ? 'text-white' : 'text-slate-900'}`}>
              Indicadores & Metas de Calidad
            </h1>
            <span className="px-2 py-0.5 text-[10px] font-mono font-bold bg-cyan-500/20 text-cyan-400 border border-cyan-500/40 rounded-full">
              Q1-2026
            </span>
          </div>
          <p className={`text-xs sm:text-sm mt-1 ${isDarkTheme ? 'text-slate-400' : 'text-slate-600'}`}>
            Evaluación Cuantitativa, Brechas Operacionales y Metas Estratégicas Bureo Perú
          </p>
        </div>

        {/* Period Pills */}
        <div className={`flex items-center p-1 rounded-xl border text-xs font-medium self-start ${
          isDarkTheme ? 'bg-slate-900/90 border-slate-800' : 'bg-slate-100 border-slate-200'
        }`}>
          {(['hoy', 'sem', 'mes', 'ano'] as const).map((periodKey) => {
            const label = 
              periodKey === 'hoy' ? 'Hoy' :
              periodKey === 'sem' ? 'Semana 02' :
              periodKey === 'mes' ? 'Este Mes' : 'Año 2026';
            const isSelected = activePeriod === periodKey;
            return (
              <button
                key={periodKey}
                onClick={() => setActivePeriod(periodKey)}
                className={`px-3 py-1.5 rounded-lg transition-all ${
                  isSelected 
                    ? isDarkTheme 
                      ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-md font-semibold' 
                      : 'bg-blue-600 text-white shadow-xs font-semibold'
                    : isDarkTheme ? 'text-slate-400 hover:text-white' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {label}
              </button>
            );
          })}
        </div>
      </div>

      {/* TOP SECTION: Bento Grid with Holographic Gauge and Plant Health Matrix */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* TELEMETRY CORE: Tachometer / Gauge (7 cols) */}
        <div className={`lg:col-span-7 rounded-2xl p-5 sm:p-6 border relative overflow-hidden transition-all ${
          isDarkTheme 
            ? 'bg-slate-900/80 border-slate-800/90 backdrop-blur-xl text-white shadow-2xl' 
            : 'bg-white border-slate-200 text-slate-900 shadow-sm'
        }`}>
          {/* Subtle background glow */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none"></div>

          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-bold font-mono text-cyan-400 uppercase tracking-widest flex items-center gap-1.5">
              <Zap className="w-3.5 h-3.5 text-cyan-400" />
              TELEMETRY CORE • ÍNDICE GLOBAL
            </span>
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-mono font-bold bg-amber-500/15 text-amber-300 border border-amber-500/30">
              <Info className="w-3 h-3" />
              Meta 95.0%
            </span>
          </div>

          <h2 className="text-xl font-extrabold tracking-tight mb-4">
            Índice de Calidad Global (ICG)
          </h2>

          {/* Futuristic Glowing Tachometer */}
          <div className="flex flex-col items-center justify-center my-3 relative">
            <div className="relative w-60 h-36 flex items-end justify-center overflow-hidden">
              <svg className="w-60 h-60 transform -rotate-180" viewBox="0 0 180 180">
                <defs>
                  <linearGradient id="gaugeGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#ef4444" />
                    <stop offset="40%" stopColor="#f59e0b" />
                    <stop offset="75%" stopColor="#06b6d4" />
                    <stop offset="100%" stopColor="#10b981" />
                  </linearGradient>
                  <filter id="gaugeGlow">
                    <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
                    <feMerge>
                      <feMergeNode in="coloredBlur"/>
                      <feMergeNode in="SourceGraphic"/>
                    </feMerge>
                  </filter>
                </defs>

                {/* Base track */}
                <circle
                  cx="90"
                  cy="90"
                  r={radius}
                  fill="none"
                  stroke={isDarkTheme ? "#1e293b" : "#e2e8f0"}
                  strokeWidth="14"
                  strokeDasharray={`${circumference} ${circumference}`}
                  strokeLinecap="round"
                />

                {/* Animated active stroke */}
                <circle
                  cx="90"
                  cy="90"
                  r={radius}
                  fill="none"
                  stroke="url(#gaugeGradient)"
                  strokeWidth="14"
                  strokeDasharray={`${circumference} ${circumference}`}
                  strokeDashoffset={strokeDashoffset}
                  strokeLinecap="round"
                  filter="url(#gaugeGlow)"
                  className="transition-all duration-700 ease-out"
                />
              </svg>

              {/* Central counter */}
              <div className="absolute bottom-2 text-center">
                <span className={`text-[10px] uppercase font-mono block tracking-widest ${isDarkTheme ? 'text-slate-400' : 'text-slate-500'}`}>
                  SCORE CONSOLIDADO
                </span>
                <span className="text-4xl sm:text-5xl font-extrabold tracking-tight bg-gradient-to-r from-cyan-400 via-teal-300 to-emerald-400 bg-clip-text text-transparent">
                  {numericIcg.toFixed(1)}%
                </span>
              </div>
            </div>

            <div className="mt-3 text-xs font-mono px-3 py-1 rounded-full flex items-center gap-1.5 bg-rose-500/15 text-rose-300 border border-rose-500/30">
              <TrendingDown className="w-3.5 h-3.5" />
              <span>Brecha Operacional: -0.20% (Tolerable &lt; 0.50%)</span>
            </div>
          </div>

          {/* Triple Stat Row */}
          <div className="grid grid-cols-3 gap-2.5 pt-4 mt-2 text-center border-t border-slate-800/60">
            <div className={`p-2.5 rounded-xl border ${isDarkTheme ? 'bg-slate-950/60 border-slate-800' : 'bg-slate-50 border-slate-200'}`}>
              <span className="text-[10px] font-mono block text-slate-400">Cumplimiento</span>
              <span className="text-base font-bold text-emerald-400">99.78%</span>
              <span className="text-[10px] text-emerald-400/80 block mt-0.5">Aceptable</span>
            </div>

            <div className={`p-2.5 rounded-xl border ${isDarkTheme ? 'bg-cyan-950/30 border-cyan-500/30' : 'bg-blue-50 border-blue-200'}`}>
              <span className="text-[10px] font-mono block text-cyan-400">Meta Q1</span>
              <span className="text-base font-bold text-cyan-300">95.00%</span>
              <span className="text-[10px] text-cyan-400/80 block mt-0.5">Umbral ISO</span>
            </div>

            <div className={`p-2.5 rounded-xl border ${isDarkTheme ? 'bg-slate-950/60 border-slate-800' : 'bg-slate-50 border-slate-200'}`}>
              <span className="text-[10px] font-mono block text-slate-400">Vs Semana Ant.</span>
              <span className="text-base font-bold text-rose-400">-0.45%</span>
              <span className="text-[10px] text-rose-400/80 block mt-0.5">Tendencia</span>
            </div>
          </div>

          {/* Weighted Algorithm breakdown */}
          <div className={`mt-4 p-3 rounded-xl border text-xs space-y-2 ${
            isDarkTheme ? 'bg-slate-950/50 border-slate-800' : 'bg-slate-50 border-slate-200'
          }`}>
            <div className="flex justify-between items-center font-mono font-semibold text-[11px]">
              <span className={isDarkTheme ? 'text-slate-300' : 'text-slate-700'}>ALGORITMO PONDERADO (FÓRMULA)</span>
              <span className="text-cyan-400 font-bold">Σ = {numericIcg.toFixed(1)}%</span>
            </div>
            <div className="space-y-1.5 text-[11px]">
              <div className="flex justify-between items-center">
                <span className="flex items-center gap-1.5 text-slate-400">
                  <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
                  Conformidad Material (40%)
                </span>
                <span className="font-mono text-slate-200">98.58% <span className="text-slate-500">(39.43%)</span></span>
              </div>
              <div className="flex justify-between items-center">
                <span className="flex items-center gap-1.5 text-slate-400">
                  <span className="w-2 h-2 rounded-full bg-cyan-400"></span>
                  Eficacia Acciones CAPA (30%)
                </span>
                <span className="font-mono text-slate-200">94.00% <span className="text-slate-500">(28.20%)</span></span>
              </div>
              <div className="flex justify-between items-center">
                <span className="flex items-center gap-1.5 text-slate-400">
                  <span className="w-2 h-2 rounded-full bg-amber-400"></span>
                  Desv. Tolerable Limpieza (30%)
                </span>
                <span className="font-mono text-slate-200">90.67% <span className="text-slate-500">(27.20%)</span></span>
              </div>
            </div>
          </div>
        </div>

        {/* PLANT STATUS & PHYSICAL CONTROL POINT (5 cols) */}
        <div className="lg:col-span-5 flex flex-col gap-5">
          {/* Cyber Physical Control Point Card */}
          <div className="relative rounded-2xl overflow-hidden border border-cyan-500/30 bg-slate-900 shadow-xl group">
            <div className="relative h-44 sm:h-48 overflow-hidden">
              <img 
                src="/assets/inspeccion-linea2.svg" 
                alt="Punto de control físico Inspección de Lote en Línea #2"
                className="w-full h-full object-cover opacity-75 group-hover:opacity-90 group-hover:scale-105 transition-all duration-500 cursor-pointer"
                referrerPolicy="no-referrer"
                onClick={() => onOpenLightbox('/assets/inspeccion-linea2.svg', 'Punto de Control Físico - Línea #2')}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent p-4 flex flex-col justify-between">
                <div className="flex items-center justify-between">
                  <span className="px-2.5 py-0.5 text-[10px] font-mono font-bold bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 rounded-full flex items-center gap-1">
                    <Camera className="w-3 h-3 text-cyan-400" />
                    EVIDENCIA VISUAL
                  </span>
                  <span className="px-2 py-0.5 text-[10px] font-mono bg-black/70 border border-slate-700 rounded-lg text-slate-200">
                    LOT-2026-X88
                  </span>
                </div>

                <div>
                  <h3 className="text-base font-extrabold text-white">Inspección de Lote en Línea #2</h3>
                  <p className="text-xs text-slate-300 mt-0.5">Control de impurezas y densidad en redes recicladas</p>
                  <button
                    onClick={() => onOpenLightbox('/assets/inspeccion-linea2.svg', 'Punto de Control Físico - Línea #2')}
                    className="mt-2 px-3 py-1 rounded-lg bg-cyan-600/90 hover:bg-cyan-500 text-white text-[11px] font-medium flex items-center gap-1.5 transition-all"
                  >
                    <span>Abrir Visor Lightbox</span>
                    <ExternalLink className="w-3 h-3" />
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Plant Lines Live Status */}
          <div className={`p-4 rounded-2xl border transition-all flex-1 ${
            isDarkTheme 
              ? 'bg-slate-900/80 border-slate-800 backdrop-blur-xl text-white' 
              : 'bg-white border-slate-200 text-slate-900 shadow-sm'
          }`}>
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-mono font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                <Activity className="w-3.5 h-3.5 text-cyan-400" />
                ESTADO DE LÍNEAS PRODUCTIVAS
              </span>
              <span className="px-2 py-0.5 text-[10px] font-mono font-bold rounded-full bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                3 ACTIVAS
              </span>
            </div>

            <div className="space-y-2 text-xs">
              <div className={`p-2.5 rounded-xl border flex items-center justify-between ${
                isDarkTheme ? 'bg-slate-950/60 border-slate-800' : 'bg-slate-50 border-slate-200'
              }`}>
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
                  <span className="font-semibold">L1 • Extrusión & Pellets</span>
                </div>
                <div className="flex items-center gap-3 font-mono">
                  <span className="text-slate-400">98.4% OEE</span>
                  <span className="px-1.5 py-0.5 rounded text-[10px] bg-emerald-500/20 text-emerald-300">NORMAL</span>
                </div>
              </div>

              <div className={`p-2.5 rounded-xl border flex items-center justify-between ${
                isDarkTheme ? 'bg-rose-950/20 border-rose-500/30' : 'bg-rose-50 border-rose-200'
              }`}>
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-rose-400 animate-pulse"></span>
                  <span className="font-semibold text-rose-300">L2 • Corte Industrial</span>
                </div>
                <div className="flex items-center gap-3 font-mono">
                  <span className="text-rose-400">91.2% (NC-004)</span>
                  <span className="px-1.5 py-0.5 rounded text-[10px] bg-rose-500/20 text-rose-300">ALERTA</span>
                </div>
              </div>

              <div className={`p-2.5 rounded-xl border flex items-center justify-between ${
                isDarkTheme ? 'bg-slate-950/60 border-slate-800' : 'bg-slate-50 border-slate-200'
              }`}>
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
                  <span className="font-semibold">L3 • Lavado & Desalinización</span>
                </div>
                <div className="flex items-center gap-3 font-mono">
                  <span className="text-slate-400">96.8% OEE</span>
                  <span className="px-1.5 py-0.5 rounded text-[10px] bg-emerald-500/20 text-emerald-300">NORMAL</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Matriz de Indicadores Clave (Bento Grid) */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <h2 className={`text-lg font-extrabold tracking-tight ${isDarkTheme ? 'text-white' : 'text-slate-900'}`}>
              Matriz de Indicadores Clave (ISO 9001)
            </h2>
            <span className="px-2 py-0.5 text-[10px] font-mono font-bold bg-blue-500/20 text-blue-400 rounded-full">
              5 AUDITADOS
            </span>
          </div>
          <span className="text-xs font-mono text-slate-400">Umbrales Bureo 2026</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {metrics.map((m) => {
            const isCritical = m.status === 'critico';
            const isWarning = m.status === 'atencion';

            return (
              <div 
                key={m.id}
                className={`rounded-2xl p-4 border transition-all flex flex-col justify-between group hover:scale-[1.01] ${
                  isDarkTheme 
                    ? 'bg-slate-900/80 border-slate-800 hover:border-cyan-500/40 backdrop-blur-xl text-white' 
                    : 'bg-white border-slate-200 hover:border-blue-400 text-slate-900 shadow-sm'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] font-mono text-cyan-400 uppercase tracking-widest">{m.category}</span>
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-mono font-bold uppercase tracking-wider ${
                      isCritical 
                        ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40' 
                        : isWarning 
                          ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40' 
                          : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                    }`}>
                      {m.status === 'cumple' ? '✓ CUMPLE' : m.status === 'atencion' ? '⚠ ATENCIÓN' : '⚑ CRÍTICO'}
                    </span>
                  </div>

                  <h3 className="text-sm font-bold mb-3">{m.name}</h3>

                  <div className={`grid grid-cols-3 gap-2 py-2.5 px-3 rounded-xl border text-xs mb-3 ${
                    isDarkTheme ? 'bg-slate-950/60 border-slate-800' : 'bg-slate-50 border-slate-200'
                  }`}>
                    <div>
                      <span className="text-[10px] text-slate-400 block font-mono">RESULTADO</span>
                      <span className="font-extrabold font-mono text-base">
                        {m.value}{m.unit === '%' ? '%' : ''}
                      </span>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400 block font-mono">META</span>
                      <span className="font-mono text-slate-400">
                        {m.targetDirection === 'lte' ? '≤' : '≥'} {m.target}{m.unit === '%' ? '%' : ''}
                      </span>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400 block font-mono">BRECHA</span>
                      <span className={`font-mono font-bold ${
                        (m.gap >= 0 && m.targetDirection === 'gte') || (m.gap <= 0 && m.targetDirection === 'lte')
                          ? 'text-emerald-400' 
                          : 'text-rose-400'
                      }`}>
                        {m.gap > 0 ? `+${m.gap}` : m.gap}{m.unit === '%' ? '%' : ''}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between text-[11px] text-slate-400 pt-2 border-t border-slate-800/60 font-mono">
                  <span>{m.trendText}</span>
                  {m.compliancePercentage > 0 && (
                    <span className="font-bold text-cyan-400">{m.compliancePercentage}%</span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Ranking Calidad por Áreas */}
      <div className={`rounded-2xl p-5 border transition-all ${
        isDarkTheme 
          ? 'bg-slate-900/80 border-slate-800 backdrop-blur-xl text-white' 
          : 'bg-white border-slate-200 text-slate-900 shadow-sm'
      }`}>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-lg font-bold tracking-tight">Ranking Calidad por Áreas Productivas</h2>
            <p className="text-xs text-slate-400">Muestreo en tiempo real por celdas de trabajo Bureo Perú</p>
          </div>
          <div className="flex gap-1 text-[11px] font-mono bg-slate-800/80 p-1 rounded-xl border border-slate-700">
            <span className="px-2 py-0.5 bg-cyan-500 text-slate-950 rounded-lg font-bold shadow-xs">% Contam</span>
            <span className="px-2 py-0.5 text-slate-400">Cumplimiento</span>
          </div>
        </div>

        <div className="space-y-2.5">
          {rankings.map((area, idx) => {
            const isCrit = area.status === 'Crítico';
            return (
              <div 
                key={area.id}
                className={`p-3.5 rounded-xl border transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                  isCrit 
                    ? 'bg-rose-950/30 border-rose-500/40 text-rose-200' 
                    : isDarkTheme 
                      ? 'bg-slate-950/60 border-slate-800 hover:border-slate-700' 
                      : 'bg-slate-50 border-slate-200'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className={`w-7 h-7 rounded-xl flex items-center justify-center font-extrabold text-xs ${
                    idx === 0 
                      ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40' 
                      : idx === 1 
                        ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40' 
                        : 'bg-slate-800 text-slate-300 border border-slate-700'
                  }`}>
                    {idx + 1}
                  </div>
                  <div>
                    <span className="font-bold text-sm block">{area.name}</span>
                    <span className="text-xs font-mono text-slate-400">
                      {area.contaminationRate}% Contam. • {area.complianceRate}% Cumplimiento ({area.auditedLots} lotes)
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold uppercase tracking-wider ${
                    area.status === 'Excelente' 
                      ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40' 
                      : area.status === 'Conforme' 
                        ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40' 
                        : area.status === 'Observación' 
                          ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40' 
                          : 'bg-rose-500/30 text-rose-200 border border-rose-500/50 animate-pulse'
                  }`}>
                    {area.status}
                  </span>

                  {isCrit && onNavigateToArea && (
                    <button 
                      onClick={() => onNavigateToArea(area.name)}
                      className="px-3 py-1 bg-rose-600 hover:bg-rose-500 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all shadow-sm"
                    >
                      Inspeccionar CAPA
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Simulador de Metas Gerenciales (Interactive) */}
      <div className={`rounded-2xl p-5 border transition-all space-y-4 ${
        isDarkTheme 
          ? 'bg-slate-900/80 border-slate-800 backdrop-blur-xl text-white' 
          : 'bg-white border-slate-200 text-slate-900 shadow-sm'
      }`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sliders className="w-4 h-4 text-cyan-400" />
            <h2 className="text-lg font-bold tracking-tight">Simulador Gerencial de Metas & ICG</h2>
          </div>
          <span className="text-xs font-mono text-cyan-400 bg-cyan-500/10 px-2 py-0.5 rounded-md border border-cyan-500/30">
            SIMULACIÓN EN TIEMPO REAL
          </span>
        </div>

        <div className="space-y-4 text-xs">
          <div>
            <div className="flex justify-between items-center mb-1">
              <span className="font-semibold text-slate-300">Tolerancia Máxima de Contaminación (%)</span>
              <span className="font-mono font-bold text-cyan-400 text-sm">{simContamTarget.toFixed(2)}%</span>
            </div>
            <input 
              type="range" 
              min="0.50" 
              max="3.00" 
              step="0.10"
              value={simContamTarget}
              onChange={(e) => setSimContamTarget(parseFloat(e.target.value))}
              className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-cyan-400"
            />
            <div className="flex justify-between text-[10px] text-slate-400 font-mono mt-1">
              <span>0.50% (Exigente)</span>
              <span className="text-cyan-400">Actual: 1.50%</span>
              <span>3.00% (Laxo)</span>
            </div>
          </div>

          <div>
            <div className="flex justify-between items-center mb-1">
              <span className="font-semibold text-slate-300">Meta Deseada ICG (%)</span>
              <span className="font-mono font-bold text-cyan-400 text-sm">{simIcgTarget.toFixed(1)}%</span>
            </div>
            <input 
              type="range" 
              min="88.0" 
              max="99.0" 
              step="0.5"
              value={simIcgTarget}
              onChange={(e) => setSimIcgTarget(parseFloat(e.target.value))}
              className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-cyan-400"
            />
            <div className="flex justify-between text-[10px] text-slate-400 font-mono mt-1">
              <span>88.0%</span>
              <span className="text-cyan-400">Operacional: 95.0%</span>
              <span>99.0%</span>
            </div>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 pt-2">
          <button 
            onClick={handleSaveSim}
            className="flex-1 py-2.5 px-4 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white rounded-xl font-semibold text-xs flex items-center justify-center gap-2 transition-all shadow-md active:scale-98"
          >
            <FileSpreadsheet className="w-4 h-4" />
            {isSaved ? '✓ ¡Parámetros Actualizados en GAS!' : 'Guardar & Sincronizar con Google Sheets'}
          </button>
          
          <button 
            onClick={onExportReport}
            className={`py-2.5 px-4 rounded-xl font-semibold text-xs flex items-center justify-center gap-2 transition-all border ${
              isDarkTheme 
                ? 'bg-slate-800 hover:bg-slate-700 text-slate-200 border-slate-700' 
                : 'bg-slate-100 hover:bg-slate-200 text-slate-800 border-slate-300'
            }`}
          >
            <FileDown className="w-4 h-4" />
            Exportar Dossier Ejecutivo
          </button>
        </div>
      </div>
    </div>
  );
}
