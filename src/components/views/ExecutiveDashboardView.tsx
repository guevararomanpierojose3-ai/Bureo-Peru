import React, { useState } from 'react';
import { 
  TrendingUp, 
  TrendingDown, 
  AlertTriangle, 
  ShieldCheck, 
  Flame, 
  Award, 
  Calendar, 
  ChevronRight, 
  Layers, 
  CheckCircle2, 
  Clock, 
  AlertOctagon, 
  CheckSquare, 
  Eye, 
  Sparkles,
  ArrowUpRight,
  Filter,
  Play,
  Maximize2
} from 'lucide-react';
import { 
  QualityRecord, 
  CapaCase, 
  CorrectiveActionItem, 
  IndicatorMetric, 
  AreaRanking, 
  DigitalEvidence, 
  AuditLogEntry, 
  UserProfile, 
  ActiveTab 
} from '../../types';

interface ExecutiveDashboardViewProps {
  currentUser: UserProfile;
  qualityRecords: QualityRecord[];
  capaCases: CapaCase[];
  correctiveActions: CorrectiveActionItem[];
  indicators: IndicatorMetric[];
  areaRankings: AreaRanking[];
  evidences: DigitalEvidence[];
  auditLogs: AuditLogEntry[];
  monthlyQualityTrends: { month: string; contaminationPercent: number; conformityPercent: number; target: number }[];
  paretoCauses: { cause: string; contaminationKg: number; sharePercent: number; cumulativePercent: number }[];
  traceabilityRankings: { traceability: string; processedKg: number; contaminationKg: number; contaminationPercent: number; status: string }[];
  heatmapData: { area: string; monthlyContamination: number[] }[];
  onNavigateToTab: (tab: ActiveTab) => void;
  onOpenEvidence: (evidence: DigitalEvidence) => void;
  onSelectRecord: (record: QualityRecord) => void;
  isDarkTheme?: boolean;
}

export default function ExecutiveDashboardView({
  currentUser,
  qualityRecords,
  capaCases,
  correctiveActions,
  indicators,
  areaRankings,
  evidences,
  auditLogs,
  monthlyQualityTrends,
  paretoCauses,
  traceabilityRankings,
  heatmapData,
  onNavigateToTab,
  onOpenEvidence,
  onSelectRecord,
  isDarkTheme = false
}: ExecutiveDashboardViewProps) {
  const [selectedPeriod, setSelectedPeriod] = useState<'hoy' | 'semana' | 'mes' | 'año' | 'personalizado'>('mes');
  const [selectedMonthIndex, setSelectedMonthIndex] = useState<number | null>(8); // Septiembre
  const [hoveredHeatmapCell, setHoveredHeatmapCell] = useState<{ area: string; month: string; val: number } | null>(null);

  // Aggregations
  const totalProcessedKg = qualityRecords.reduce((acc, r) => acc + r.processedKg, 0);
  const totalContaminationKg = qualityRecords.reduce((acc, r) => acc + r.contaminationKg, 0);
  const globalContaminationPercent = totalProcessedKg > 0 ? (totalContaminationKg / totalProcessedKg) * 100 : 0;
  const globalConformityPercent = 100 - globalContaminationPercent;

  const openNcs = capaCases.filter(nc => nc.status === 'Abierta' || nc.status === 'En proceso');
  const expiredNcs = capaCases.filter(nc => nc.status === 'Vencida');
  const closedNcs = capaCases.filter(nc => nc.status === 'Cerrada');

  const pendingActions = correctiveActions.filter(a => a.status === 'Pendiente' || a.status === 'En proceso');
  const expiredActions = correctiveActions.filter(a => a.status === 'Vencida');
  const closedActions = correctiveActions.filter(a => a.status === 'Cerrada');

  const months = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Set', 'Oct', 'Nov', 'Dic'];

  // Global Quality Index (ICG): 94.8%
  const foundIcg = indicators.find(i => i.id === 'IND-01');
  const icgVal = foundIcg ? (foundIcg.result ?? foundIcg.value) : 94.8;
  const icgMetric = foundIcg || {
    result: 94.8,
    target: 95.0,
    compliancePercent: 99.8,
    gap: -0.2
  };

  return (
    <div className="space-y-6 pb-12 animate-fadeIn">
      {/* Executive Welcome & Period Selector Bar */}
      <div className={`p-4 sm:p-6 rounded-2xl border transition-all ${
        isDarkTheme 
          ? 'bg-gradient-to-r from-slate-900 via-slate-900 to-blue-950/40 border-slate-800 text-white' 
          : 'bg-gradient-to-r from-white via-blue-50/40 to-slate-50 border-slate-200 text-slate-900 shadow-xs'
      }`}>
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl overflow-hidden bg-white dark:bg-slate-800 border-2 border-blue-500 shadow-md shrink-0">
              <img 
                src={currentUser.avatarUrl || '/assets/marcos-salinas.svg'} 
                alt={currentUser.name} 
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono font-bold text-blue-600 dark:text-cyan-400 uppercase tracking-wider">
                  Panel Gerencial • Vista Directiva
                </span>
                <span className="px-2 py-0.5 text-[10px] font-bold rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 font-mono">
                  Planta Operativa
                </span>
              </div>
              <h1 className="text-lg sm:text-xl font-black tracking-tight text-slate-900 dark:text-white">
                Buenos días, {currentUser.name}
              </h1>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Resumen consolidado de calidad, contaminación por mermas y cumplimiento de acciones correctivas.
              </p>
            </div>
          </div>

          {/* Period Filter Buttons (#9) */}
          <div className="flex items-center gap-1 p-1 rounded-xl bg-slate-200/70 dark:bg-slate-800 border border-slate-300/80 dark:border-slate-700 self-start md:self-auto">
            {(['hoy', 'semana', 'mes', 'año', 'personalizado'] as const).map((p) => (
              <button
                key={p}
                onClick={() => setSelectedPeriod(p)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold capitalize transition-all cursor-pointer ${
                  selectedPeriod === p
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                {p === 'hoy' ? 'Hoy' : p === 'semana' ? 'Esta semana' : p === 'mes' ? 'Este mes' : p === 'año' ? 'Este año' : 'Personalizado'}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* FILA 1: 8 KPIs Clave con el Gran Gauge Circular ICG (#10, #50, #61) */}
      <div className="grid grid-cols-2 lg:grid-cols-4 xl:grid-cols-8 gap-3">
        {/* KPI 1: Material Procesado */}
        <div className={`p-4 rounded-2xl border transition-all ${
          isDarkTheme ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200 shadow-2xs'
        }`}>
          <div className="flex items-center justify-between text-slate-500 text-[11px] font-bold">
            <span>Material Procesado</span>
            <Layers className="w-4 h-4 text-blue-500" />
          </div>
          <div className="mt-2">
            <span className="text-xl sm:text-2xl font-black font-mono text-slate-900 dark:text-white">
              {totalProcessedKg.toLocaleString()}
            </span>
            <span className="text-xs text-slate-400 ml-1 font-mono">kg</span>
          </div>
          <p className="text-[10px] text-emerald-600 dark:text-emerald-400 font-bold mt-1 flex items-center gap-0.5">
            <TrendingUp className="w-3 h-3" /> +8.4% vs mes anterior
          </p>
        </div>

        {/* KPI 2: Contaminación */}
        <div className={`p-4 rounded-2xl border transition-all ${
          isDarkTheme ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200 shadow-2xs'
        }`}>
          <div className="flex items-center justify-between text-slate-500 text-[11px] font-bold">
            <span>Contaminación</span>
            <Flame className="w-4 h-4 text-rose-500" />
          </div>
          <div className="mt-2">
            <span className="text-xl sm:text-2xl font-black font-mono text-rose-600 dark:text-rose-400">
              {totalContaminationKg.toFixed(1)}
            </span>
            <span className="text-xs text-slate-400 ml-1 font-mono">kg</span>
          </div>
          <p className="text-[10px] text-slate-500 mt-1">
            Merma segregada en planta
          </p>
        </div>

        {/* KPI 3: % Contaminación */}
        <div className={`p-4 rounded-2xl border transition-all ${
          isDarkTheme ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200 shadow-2xs'
        }`}>
          <div className="flex items-center justify-between text-slate-500 text-[11px] font-bold">
            <span>% Contaminación</span>
            <span className="px-1.5 py-0.2 rounded text-[9px] font-mono font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
              Cumple
            </span>
          </div>
          <div className="mt-2">
            <span className="text-xl sm:text-2xl font-black font-mono text-slate-900 dark:text-white">
              {globalContaminationPercent.toFixed(2)}%
            </span>
          </div>
          <p className="text-[10px] text-slate-400 mt-1 font-mono">
            Meta: ≤ 1.50%
          </p>
        </div>

        {/* KPI 4: % Conforme */}
        <div className={`p-4 rounded-2xl border transition-all ${
          isDarkTheme ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200 shadow-2xs'
        }`}>
          <div className="flex items-center justify-between text-slate-500 text-[11px] font-bold">
            <span>% Conforme</span>
            <ShieldCheck className="w-4 h-4 text-emerald-500" />
          </div>
          <div className="mt-2">
            <span className="text-xl sm:text-2xl font-black font-mono text-emerald-600 dark:text-emerald-400">
              {globalConformityPercent.toFixed(2)}%
            </span>
          </div>
          <p className="text-[10px] text-slate-400 mt-1 font-mono">
            Meta: ≥ 98.50%
          </p>
        </div>

        {/* KPI 5: No Conformidades */}
        <div 
          onClick={() => onNavigateToTab('ncs')}
          className={`p-4 rounded-2xl border transition-all cursor-pointer hover:border-amber-400 ${
            isDarkTheme ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200 shadow-2xs'
          }`}
        >
          <div className="flex items-center justify-between text-slate-500 text-[11px] font-bold">
            <span>No Conformidades</span>
            <AlertOctagon className="w-4 h-4 text-amber-500" />
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-xl sm:text-2xl font-black font-mono text-slate-900 dark:text-white">
              {capaCases.length}
            </span>
            <span className="text-[10px] text-rose-600 font-mono font-bold">
              {expiredNcs.length} vencida
            </span>
          </div>
          <p className="text-[10px] text-slate-400 mt-1">
            {openNcs.length} activas en planta
          </p>
        </div>

        {/* KPI 6: Acciones Correctivas */}
        <div 
          onClick={() => onNavigateToTab('acciones')}
          className={`p-4 rounded-2xl border transition-all cursor-pointer hover:border-blue-400 ${
            isDarkTheme ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200 shadow-2xs'
          }`}
        >
          <div className="flex items-center justify-between text-slate-500 text-[11px] font-bold">
            <span>Acciones (CAPA)</span>
            <CheckSquare className="w-4 h-4 text-blue-500" />
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-xl sm:text-2xl font-black font-mono text-slate-900 dark:text-white">
              {correctiveActions.length}
            </span>
            <span className="text-[10px] text-emerald-600 font-mono font-bold">
              {closedActions.length} cerradas
            </span>
          </div>
          <p className="text-[10px] text-slate-400 mt-1">
            {pendingActions.length} en seguimiento
          </p>
        </div>

        {/* KPI 7: Eficacia */}
        <div className={`p-4 rounded-2xl border transition-all ${
          isDarkTheme ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200 shadow-2xs'
        }`}>
          <div className="flex items-center justify-between text-slate-500 text-[11px] font-bold">
            <span>Eficacia Acciones</span>
            <Award className="w-4 h-4 text-purple-500" />
          </div>
          <div className="mt-2">
            <span className="text-xl sm:text-2xl font-black font-mono text-purple-600 dark:text-purple-400">
              94%
            </span>
          </div>
          <p className="text-[10px] text-slate-400 mt-1 font-mono">
            Meta: ≥ 90%
          </p>
        </div>

        {/* KPI 8: Gran Gauge Circular ICG (#50) */}
        <div 
          onClick={() => onNavigateToTab('indicadores')}
          className={`p-4 rounded-2xl border transition-all cursor-pointer hover:border-cyan-400 relative overflow-hidden ${
            isDarkTheme ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200 shadow-2xs'
          }`}
        >
          <div className="flex items-center justify-between text-[11px] font-bold text-slate-500">
            <span>Índice ICG</span>
            <span className="text-[9px] font-mono text-blue-600 dark:text-cyan-400">Global</span>
          </div>

          <div className="mt-1 flex flex-col items-center justify-center">
            {/* SVG Semicircular / Circular Gauge */}
            <div className="relative w-16 h-16 flex items-center justify-center">
              <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                <path
                  className="text-slate-200 dark:text-slate-800"
                  strokeWidth="3.8"
                  stroke="currentColor"
                  fill="none"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                />
                <path
                  className="text-blue-600 dark:text-cyan-400"
                  strokeDasharray={`${icgVal}, 100`}
                  strokeWidth="3.8"
                  strokeLinecap="round"
                  stroke="currentColor"
                  fill="none"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                />
              </svg>
              <div className="absolute flex flex-col items-center">
                <span className="text-xs font-black font-mono text-slate-900 dark:text-white">
                  {icgVal}%
                </span>
              </div>
            </div>
            <p className="text-[9px] font-mono text-emerald-600 dark:text-emerald-400 font-bold mt-0.5">
              Meta 95% • 99.8% Cumpl.
            </p>
          </div>
        </div>
      </div>

      {/* FILA 2: Evolución de la Calidad (#11) & Contaminación por Área (#12, #51) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Gráfico 1: Evolución Mensual de la Calidad (7 cols) */}
        <div className={`lg:col-span-7 p-5 rounded-2xl border transition-all ${
          isDarkTheme ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200 shadow-xs'
        }`}>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                  Evolución Mensual de la Calidad
                </h3>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300 font-bold">
                  2026
                </span>
              </div>
              <p className="text-xs text-slate-500">
                % Contaminación vs Línea Meta (1.50%) y % Conformidad del producto
              </p>
            </div>

            <div className="flex items-center gap-3 text-[11px] font-mono">
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-blue-600 inline-block" /> % Contaminación
              </span>
              <span className="flex items-center gap-1.5 text-rose-500">
                <span className="w-3 h-0.5 bg-rose-500 inline-block border-t border-dashed" /> Meta (1.5%)
              </span>
            </div>
          </div>

          {/* Interactive Bar/Line Chart */}
          <div className="h-60 flex items-end gap-2 pt-6 pb-2 px-2 border-b border-slate-200 dark:border-slate-800 relative">
            {/* Meta horizontal dashed guide line at 1.50% */}
            <div className="absolute left-0 right-0 top-[60%] border-t-2 border-dashed border-rose-400/80 z-10 pointer-events-none flex items-center justify-end pr-2">
              <span className="text-[9px] font-mono bg-rose-50 dark:bg-rose-950 text-rose-600 px-1 rounded font-bold">
                META 1.50%
              </span>
            </div>

            {monthlyQualityTrends.map((trend, idx) => {
              const isSelected = selectedMonthIndex === idx;
              // Normalize height: max 4%
              const heightPercent = Math.min(100, (trend.contaminationPercent / 3.0) * 100);
              const isOverTarget = trend.contaminationPercent > trend.target;

              return (
                <div
                  key={trend.month}
                  onClick={() => setSelectedMonthIndex(idx)}
                  className="flex-1 flex flex-col items-center h-full justify-end group cursor-pointer relative"
                >
                  {/* Tooltip on hover or selected */}
                  {(isSelected || undefined) && (
                    <div className="absolute -top-7 z-20 px-1.5 py-0.5 rounded bg-slate-900 text-white text-[10px] font-mono whitespace-nowrap shadow-md">
                      {trend.contaminationPercent.toFixed(2)}%
                    </div>
                  )}

                  {/* Bar */}
                  <div
                    style={{ height: `${heightPercent}%` }}
                    className={`w-full max-w-[28px] rounded-t-lg transition-all ${
                      isOverTarget 
                        ? 'bg-rose-500 hover:bg-rose-600' 
                        : isSelected
                          ? 'bg-blue-600 ring-2 ring-blue-400'
                          : 'bg-blue-500/80 hover:bg-blue-600'
                    }`}
                  />
                  <span className={`text-[10px] font-mono mt-2 font-bold ${
                    isSelected ? 'text-blue-600 dark:text-cyan-400' : 'text-slate-400'
                  }`}>
                    {trend.month}
                  </span>
                </div>
              );
            })}
          </div>

          {/* Selected month details footer */}
          {selectedMonthIndex !== null && (
            <div className="mt-3 p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 flex items-center justify-between text-xs">
              <span className="text-slate-600 dark:text-slate-300">
                Mes seleccionado: <strong className="text-slate-900 dark:text-white">{monthlyQualityTrends[selectedMonthIndex].month}</strong>
              </span>
              <div className="flex items-center gap-4 font-mono text-[11px]">
                <span>Contam: <strong className="text-blue-600 dark:text-cyan-400">{monthlyQualityTrends[selectedMonthIndex].contaminationPercent.toFixed(2)}%</strong></span>
                <span>Conforme: <strong className="text-emerald-600">{monthlyQualityTrends[selectedMonthIndex].conformityPercent.toFixed(2)}%</strong></span>
                <span>Estado: <strong className={monthlyQualityTrends[selectedMonthIndex].contaminationPercent <= 1.5 ? 'text-emerald-600' : 'text-rose-600'}>
                  {monthlyQualityTrends[selectedMonthIndex].contaminationPercent <= 1.5 ? 'Cumple Meta' : 'Excedido'}
                </strong></span>
              </div>
            </div>
          )}
        </div>

        {/* Gráfico 2: Contaminación por Área con Alerta Crítica Corte (#12, #51) (5 cols) */}
        <div className={`lg:col-span-5 p-5 rounded-2xl border transition-all ${
          isDarkTheme ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200 shadow-xs'
        }`}>
          <div className="flex items-center justify-between mb-2">
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                Contaminación por Área
              </h3>
              <p className="text-xs text-slate-500">
                Masa de merma segregada y porcentaje de incidencia
              </p>
            </div>
            <button
              onClick={() => onNavigateToTab('contaminacion')}
              className="text-xs font-bold text-blue-600 dark:text-cyan-400 hover:underline flex items-center gap-1"
            >
              <span>Ver detalle</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Prominent High-Impact Callout: CORTE MAYOR CONTAMINACIÓN (#51) */}
          <div className="my-3 p-3 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-300 dark:border-rose-800 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-lg bg-rose-600 text-white animate-pulse">
                <AlertTriangle className="w-4 h-4" />
              </div>
              <div>
                <div className="text-[11px] font-black uppercase text-rose-700 dark:text-rose-300 tracking-wider font-mono">
                  🚨 CORTE — MAYOR CONTAMINACIÓN
                </div>
                <div className="text-xs font-bold text-slate-800 dark:text-slate-200">
                  2,668 kg merma acumulada • 51.8% del total
                </div>
              </div>
            </div>
            <button
              onClick={() => onNavigateToTab('registro')}
              className="px-2.5 py-1 text-[11px] rounded-lg bg-rose-600 hover:bg-rose-700 text-white font-bold cursor-pointer"
            >
              Ver Registros
            </button>
          </div>

          {/* Area bars list */}
          <div className="space-y-2.5 mt-2">
            {areaRankings.map((ar) => {
              const areaName = ar.area || ar.name;
              const isCritical = areaName === 'Corte';
              const contamPct = ar.contaminationPercent ?? ar.contaminationRate ?? 0;
              return (
                <div 
                  key={ar.id || areaName} 
                  onClick={() => onNavigateToTab('registro')}
                  className="group cursor-pointer"
                >
                  <div className="flex items-center justify-between text-xs mb-1">
                    <span className={`font-bold flex items-center gap-1.5 ${
                      isCritical ? 'text-rose-600 dark:text-rose-400' : 'text-slate-800 dark:text-slate-200'
                    }`}>
                      {areaName}
                      {isCritical && <span className="text-[9px] px-1 py-0.2 bg-rose-100 dark:bg-rose-950 text-rose-600 rounded font-mono font-bold">Crítico</span>}
                    </span>
                    <span className="font-mono text-[11px] text-slate-500">
                      {ar.contaminationKg.toLocaleString()} kg ({contamPct.toFixed(2)}%)
                    </span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                    <div
                      style={{ width: `${Math.min(100, (ar.contaminationKg / 2700) * 100)}%` }}
                      className={`h-full rounded-full transition-all ${
                        isCritical ? 'bg-rose-500' : contamPct <= 1.5 ? 'bg-emerald-500' : 'bg-amber-500'
                      }`}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* FILA 3: Pareto de Causas (#13, #52) & Estado de NC Donut (#18) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Pareto 80/20 (#13, #52) (7 cols) */}
        <div className={`lg:col-span-7 p-5 rounded-2xl border transition-all ${
          isDarkTheme ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200 shadow-xs'
        }`}>
          <div className="flex items-center justify-between mb-4">
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                  Análisis de Pareto de Causas Raíz
                </h3>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-purple-100 text-purple-800 dark:bg-purple-950 dark:text-purple-300 font-bold">
                  Principio 80/20
                </span>
              </div>
              <p className="text-xs text-slate-500">
                Barras: kg contaminación • Línea roja: % acumulado
              </p>
            </div>
            <span className="text-xs font-mono font-bold text-slate-500">
              Total: {totalContaminationKg.toFixed(1)} kg
            </span>
          </div>

          {/* Pareto Visual representation */}
          <div className="space-y-3">
            {paretoCauses.map((cause, i) => (
              <div key={cause.cause} className="text-xs">
                <div className="flex items-center justify-between mb-1">
                  <span className="font-bold text-slate-800 dark:text-slate-200 flex items-center gap-2">
                    <span className="w-4 h-4 rounded-full bg-slate-200 dark:bg-slate-800 text-[10px] flex items-center justify-center font-mono font-bold">
                      {i + 1}
                    </span>
                    {cause.cause}
                  </span>
                  <div className="font-mono text-[11px] flex items-center gap-3">
                    <span className="text-slate-600 dark:text-slate-400 font-bold">{cause.contaminationKg.toFixed(1)} kg ({cause.sharePercent.toFixed(1)}%)</span>
                    <span className="text-rose-600 dark:text-rose-400 font-bold">Acum: {cause.cumulativePercent.toFixed(1)}%</span>
                  </div>
                </div>
                {/* Dual bar: Blue is kg share, subtle overlay is cumulative % */}
                <div className="w-full h-3 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden flex relative">
                  <div 
                    style={{ width: `${cause.sharePercent}%` }} 
                    className="h-full bg-blue-600 rounded-l-full" 
                  />
                </div>
              </div>
            ))}
          </div>
          <div className="mt-4 pt-3 border-t border-slate-200 dark:border-slate-800 text-[11px] text-slate-500 flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-amber-500 shrink-0" />
            <span>El 80% de la merma se concentra en las dos primeras causas: <strong>Mezcla de material</strong> y <strong>Plástico no separable</strong>.</span>
          </div>
        </div>

        {/* Donut Estado de No Conformidades (#18) (5 cols) */}
        <div className={`lg:col-span-5 p-5 rounded-2xl border transition-all ${
          isDarkTheme ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200 shadow-xs'
        }`}>
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                Estado de No Conformidades
              </h3>
              <p className="text-xs text-slate-500">
                Distribución por ciclo de vida operacional
              </p>
            </div>
            <button
              onClick={() => onNavigateToTab('ncs')}
              className="text-xs font-bold text-blue-600 dark:text-cyan-400 hover:underline flex items-center gap-1"
            >
              <span>Ver todas ({capaCases.length})</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Donut diagram with legend */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-6 py-2">
            {/* Donut SVG */}
            <div className="relative w-36 h-36 flex items-center justify-center">
              <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                <circle cx="18" cy="18" r="14" fill="transparent" stroke="#e2e8f0" strokeWidth="5" />
                {/* Cerradas: 50% */}
                <circle cx="18" cy="18" r="14" fill="transparent" stroke="#10b981" strokeWidth="5" strokeDasharray="50 100" strokeDashoffset="0" />
                {/* En proceso: 25% */}
                <circle cx="18" cy="18" r="14" fill="transparent" stroke="#3b82f6" strokeWidth="5" strokeDasharray="25 100" strokeDashoffset="-50" />
                {/* Abiertas: 15% */}
                <circle cx="18" cy="18" r="14" fill="transparent" stroke="#f59e0b" strokeWidth="5" strokeDasharray="15 100" strokeDashoffset="-75" />
                {/* Vencidas: 10% */}
                <circle cx="18" cy="18" r="14" fill="transparent" stroke="#f43f5e" strokeWidth="5" strokeDasharray="10 100" strokeDashoffset="-90" />
              </svg>
              <div className="absolute flex flex-col items-center">
                <span className="text-xl font-black font-mono text-slate-900 dark:text-white">
                  {capaCases.length}
                </span>
                <span className="text-[10px] font-bold text-slate-400 uppercase">
                  Casos NC
                </span>
              </div>
            </div>

            {/* Legend List */}
            <div className="space-y-2 text-xs w-full sm:w-auto">
              <div className="flex items-center justify-between gap-4">
                <span className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                  <span>Cerradas</span>
                </span>
                <span className="font-mono font-bold">{closedNcs.length} (50%)</span>
              </div>

              <div className="flex items-center justify-between gap-4">
                <span className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-blue-500" />
                  <span>En Proceso</span>
                </span>
                <span className="font-mono font-bold">3 (25%)</span>
              </div>

              <div className="flex items-center justify-between gap-4">
                <span className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
                  <span>Abiertas</span>
                </span>
                <span className="font-mono font-bold">2 (15%)</span>
              </div>

              <div className="flex items-center justify-between gap-4">
                <span className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-rose-500" />
                  <span>Vencidas</span>
                </span>
                <span className="font-mono font-bold text-rose-600">{expiredNcs.length} (10%)</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* FILA 4: Heatmap de Áreas x Meses (#14) & Ranking de Áreas (#15) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Heatmap 6 áreas x 12 meses (#14) (7 cols) */}
        <div className={`lg:col-span-7 p-5 rounded-2xl border transition-all ${
          isDarkTheme ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200 shadow-xs'
        }`}>
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                Mapa Térmico de Contaminación (Áreas × Meses)
              </h3>
              <p className="text-xs text-slate-500">
                Intensidad semafórica de merma: Verde (≤1.0%), Amarillo (1.0–1.5%), Rojo (&gt;1.5%)
              </p>
            </div>

            {/* Scale legend */}
            <div className="flex items-center gap-1.5 text-[10px] font-mono">
              <span className="px-1.5 py-0.5 rounded bg-emerald-500 text-white font-bold">&lt;1%</span>
              <span className="px-1.5 py-0.5 rounded bg-amber-400 text-slate-900 font-bold">1.5%</span>
              <span className="px-1.5 py-0.5 rounded bg-rose-500 text-white font-bold">&gt;2%</span>
            </div>
          </div>

          {/* Matrix table */}
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead>
                <tr>
                  <th className="text-left font-bold text-slate-400 pb-2 text-[10px] font-mono uppercase">Área</th>
                  {months.map(m => (
                    <th key={m} className="text-center font-bold text-slate-400 pb-2 text-[10px] font-mono">{m}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {heatmapData.map((row) => (
                  <tr key={row.area}>
                    <td className="py-2 pr-2 font-bold text-slate-800 dark:text-slate-200 whitespace-nowrap">
                      {row.area}
                    </td>
                    {row.monthlyContamination.map((val, mi) => {
                      // color calc
                      let bgClass = 'bg-emerald-100 text-emerald-900 dark:bg-emerald-950 dark:text-emerald-200';
                      if (val > 1.50) {
                        bgClass = 'bg-rose-500 text-white font-bold';
                      } else if (val > 1.00) {
                        bgClass = 'bg-amber-300 text-amber-950 font-bold dark:bg-amber-700 dark:text-amber-100';
                      }

                      return (
                        <td key={mi} className="p-0.5 text-center">
                          <div
                            onMouseEnter={() => setHoveredHeatmapCell({ area: row.area, month: months[mi], val })}
                            onMouseLeave={() => setHoveredHeatmapCell(null)}
                            onClick={() => onNavigateToTab('registro')}
                            className={`p-1.5 rounded-md text-[10px] font-mono transition-transform hover:scale-110 cursor-pointer ${bgClass}`}
                            title={`${row.area} en ${months[mi]}: ${val.toFixed(2)}%`}
                          >
                            {val.toFixed(1)}%
                          </div>
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {hoveredHeatmapCell && (
            <div className="mt-2 text-right text-[11px] font-mono text-blue-600 dark:text-cyan-400">
              Celda activa: <strong>{hoveredHeatmapCell.area}</strong> en <strong>{hoveredHeatmapCell.month}</strong> → <strong>{hoveredHeatmapCell.val.toFixed(2)}%</strong>
            </div>
          )}
        </div>

        {/* Ranking de Áreas con Medallas (#15) (5 cols) */}
        <div className={`lg:col-span-5 p-5 rounded-2xl border transition-all ${
          isDarkTheme ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200 shadow-xs'
        }`}>
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                Ranking de Eficiencia por Área
              </h3>
              <p className="text-xs text-slate-500">
                Ordenado de menor a mayor contaminación
              </p>
            </div>
            <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800">
              6 Áreas
            </span>
          </div>

          <div className="space-y-2">
            {areaRankings.map((rank, idx) => {
              const rankName = rank.area || rank.name;
              const pos = rank.position || (idx + 1);
              const medal = pos === 1 ? '🥇' : pos === 2 ? '🥈' : pos === 3 ? '🥉' : `${pos}º`;
              const isBest = pos === 1;
              const isWorst = pos === 6 || rankName === 'Corte';
              const contamPct = rank.contaminationPercent ?? rank.contaminationRate ?? 0;

              return (
                <div
                  key={rank.id || rankName}
                  onClick={() => onNavigateToTab('registro')}
                  className={`p-2.5 rounded-xl border transition-all flex items-center justify-between cursor-pointer ${
                    isBest 
                      ? 'border-emerald-300 dark:border-emerald-800 bg-emerald-50/50 dark:bg-emerald-950/20' 
                      : isWorst 
                        ? 'border-rose-300 dark:border-rose-800 bg-rose-50/50 dark:bg-rose-950/20'
                        : 'border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/50'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className="text-base font-bold font-mono w-6 text-center">{medal}</span>
                    <div>
                      <div className="font-bold text-xs text-slate-900 dark:text-white flex items-center gap-1.5">
                        {rankName}
                        {isBest && <span className="text-[9px] px-1.5 py-0.2 rounded font-mono font-bold bg-emerald-100 text-emerald-800">Líder</span>}
                        {isWorst && <span className="text-[9px] px-1.5 py-0.2 rounded font-mono font-bold bg-rose-100 text-rose-800">Crítico</span>}
                      </div>
                      <div className="text-[10px] text-slate-500 font-mono">
                        {rank.processedKg.toLocaleString()} kg proc. • {rank.contaminationKg} kg merma
                      </div>
                    </div>
                  </div>

                  <div className="text-right font-mono">
                    <div className={`text-xs font-black ${
                      contamPct <= 1.5 ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'
                    }`}>
                      {contamPct.toFixed(2)}%
                    </div>
                    <div className="text-[9px] text-slate-400">
                      {contamPct <= 1.5 ? 'Cumple' : 'Alerta'}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* FILA 5: Acciones Correctivas y Alertas Gerenciales (#19, #20, #21) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Acciones Correctivas & Calendario (#19, #20) (6 cols) */}
        <div className={`lg:col-span-6 p-5 rounded-2xl border transition-all ${
          isDarkTheme ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200 shadow-xs'
        }`}>
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                Compromisos & Acciones Correctivas (CAPA)
              </h3>
              <p className="text-xs text-slate-500">
                Calendario operacional y seguimiento de vencimientos
              </p>
            </div>
            <button
              onClick={() => onNavigateToTab('acciones')}
              className="text-xs font-bold text-blue-600 dark:text-cyan-400 hover:underline flex items-center gap-1"
            >
              <span>Ver todas</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Quick Stats Grid */}
          <div className="grid grid-cols-4 gap-2 mb-4">
            <div className="p-2.5 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 text-center">
              <span className="text-[10px] font-bold text-amber-700 dark:text-amber-400 uppercase">Pendientes</span>
              <p className="text-lg font-black font-mono text-amber-800 dark:text-amber-300">2</p>
            </div>
            <div className="p-2.5 rounded-xl bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-800 text-center">
              <span className="text-[10px] font-bold text-blue-700 dark:text-blue-400 uppercase">En Proceso</span>
              <p className="text-lg font-black font-mono text-blue-800 dark:text-blue-300">2</p>
            </div>
            <div className="p-2.5 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 text-center">
              <span className="text-[10px] font-bold text-rose-700 dark:text-rose-400 uppercase">Vencidas</span>
              <p className="text-lg font-black font-mono text-rose-800 dark:text-rose-300">{expiredActions.length}</p>
            </div>
            <div className="p-2.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-center">
              <span className="text-[10px] font-bold text-emerald-700 dark:text-emerald-400 uppercase">% Cierre</span>
              <p className="text-lg font-black font-mono text-emerald-800 dark:text-emerald-300">78%</p>
            </div>
          </div>

          {/* Upcoming commitments list */}
          <div className="space-y-2">
            <div className="text-[10px] font-bold uppercase text-slate-400 font-mono">
              Próximos Vencimientos SLA:
            </div>
            {correctiveActions.slice(0, 3).map((act) => (
              <div 
                key={act.id} 
                onClick={() => onNavigateToTab('acciones')}
                className="p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 flex items-center justify-between text-xs hover:bg-slate-50 dark:hover:bg-slate-800/40 cursor-pointer"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-blue-600 dark:text-cyan-400">{act.id}</span>
                    <span className="text-slate-900 dark:text-white font-bold truncate max-w-[200px]">{act.description}</span>
                  </div>
                  <div className="text-[10px] text-slate-500 mt-0.5">
                    Resp: {act.responsibleName} • Área: {act.area}
                  </div>
                </div>
                <div className="text-right">
                  <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-full ${
                    act.status === 'Vencida' ? 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300' :
                    act.status === 'Cerrada' ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300' :
                    'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                  }`}>
                    {act.commitmentDate}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Alertas Gerenciales Que Requieren Atención (#21) (6 cols) */}
        <div className={`lg:col-span-6 p-5 rounded-2xl border transition-all ${
          isDarkTheme ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200 shadow-xs'
        }`}>
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                Alertas Gerenciales Que Requieren Atención
              </h3>
              <p className="text-xs text-slate-500">
                Puntos críticos que demandan intervención o visto bueno de Gerencia
              </p>
            </div>
            <span className="px-2 py-0.5 text-[10px] font-mono font-bold rounded-full bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300">
              6 Avisos
            </span>
          </div>

          <div className="space-y-2 text-xs">
            {/* Alert 1 */}
            <div 
              onClick={() => onNavigateToTab('acciones')}
              className="p-3 rounded-xl border border-rose-200 dark:border-rose-900 bg-rose-50/60 dark:bg-rose-950/20 flex items-start gap-3 cursor-pointer hover:bg-rose-100/50"
            >
              <span className="w-2.5 h-2.5 rounded-full bg-rose-600 mt-1 shrink-0 animate-ping" />
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-rose-700 dark:text-rose-300">🔴 Acción Correctiva Vencida: CAPA-AC-088</span>
                  <span className="text-[10px] font-mono text-rose-600">Vencida hace 6 días</span>
                </div>
                <p className="text-[11px] text-slate-600 dark:text-slate-400 mt-0.5">
                  Área Corte: Recambio de mallas de cribado desgastadas. Responsable: Carlos Mendoza.
                </p>
              </div>
            </div>

            {/* Alert 2 */}
            <div 
              onClick={() => onNavigateToTab('ncs')}
              className="p-3 rounded-xl border border-amber-200 dark:border-amber-900 bg-amber-50/60 dark:bg-amber-950/20 flex items-start gap-3 cursor-pointer hover:bg-amber-100/50"
            >
              <span className="w-2.5 h-2.5 rounded-full bg-amber-500 mt-1 shrink-0" />
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-amber-800 dark:text-amber-300">🟠 No Conformidad próxima a vencer: NC-2026-006</span>
                  <span className="text-[10px] font-mono text-amber-600">Vence en 3 días</span>
                </div>
                <p className="text-[11px] text-slate-600 dark:text-slate-400 mt-0.5">
                  Área Lavado: Desviación en temperatura de tinas. Lote Pacífico-B.
                </p>
              </div>
            </div>

            {/* Alert 3 */}
            <div 
              onClick={() => onNavigateToTab('contaminacion')}
              className="p-3 rounded-xl border border-rose-200 dark:border-rose-900 bg-rose-50/60 dark:bg-rose-950/20 flex items-start gap-3 cursor-pointer hover:bg-rose-100/50"
            >
              <span className="w-2.5 h-2.5 rounded-full bg-rose-600 mt-1 shrink-0" />
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-rose-700 dark:text-rose-300">🔴 Área sobre la meta mensual: CORTE (3.45%)</span>
                  <span className="text-[10px] font-mono text-rose-600">Meta: 1.50%</span>
                </div>
                <p className="text-[11px] text-slate-600 dark:text-slate-400 mt-0.5">
                  Generó 2,668 kg de merma acumulada. Se requiere auditoría de proceso en turno nocturno.
                </p>
              </div>
            </div>

            {/* Alert 4 */}
            <div 
              onClick={() => onNavigateToTab('registro')}
              className="p-3 rounded-xl border border-slate-200 dark:border-slate-800 flex items-start gap-3 cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800/40"
            >
              <span className="w-2.5 h-2.5 rounded-full bg-blue-500 mt-1 shrink-0" />
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-800 dark:text-slate-200">🟡 3 Registros de Calidad pendientes de visto bueno</span>
                  <span className="text-[10px] font-mono text-slate-400">Turno de hoy</span>
                </div>
                <p className="text-[11px] text-slate-500 mt-0.5">
                  Supervisores Elena Torres y Roberto Díaz ingresaron datos de tara en Secado.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* FILA 6: Matriz de Riesgo 5x5 (#17) & Ranking de Trazabilidad (#16) & Actividad Reciente (#22) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Matriz 5x5 (#17) (4 cols) */}
        <div className={`lg:col-span-4 p-5 rounded-2xl border transition-all ${
          isDarkTheme ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200 shadow-xs'
        }`}>
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                Matriz de Riesgo 5×5
              </h3>
              <p className="text-xs text-slate-500">
                Probabilidad × Severidad de desvíos
              </p>
            </div>
            <span className="text-[10px] font-mono font-bold px-1.5 py-0.5 rounded bg-rose-100 text-rose-800">
              1 Crítico
            </span>
          </div>

          {/* 5x5 Visual Grid */}
          <div className="space-y-1">
            <div className="text-[9px] font-mono text-slate-400 text-right">Probabilidad ↑ / Severidad →</div>
            {[5, 4, 3, 2, 1].map((prob) => (
              <div key={prob} className="flex items-center gap-1">
                <span className="w-3 text-[10px] font-mono font-bold text-slate-400 text-center">{prob}</span>
                {[1, 2, 3, 4, 5].map((sev) => {
                  const score = prob * sev;
                  let cellColor = 'bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300';
                  if (score >= 15) {
                    cellColor = 'bg-rose-500 text-white font-bold';
                  } else if (score >= 10) {
                    cellColor = 'bg-amber-400 text-amber-950 font-bold';
                  } else if (score >= 6) {
                    cellColor = 'bg-yellow-200 text-yellow-900';
                  }

                  // Sample badge on cell (prob=4, sev=4)
                  const hasIncident = prob === 4 && sev === 4;

                  return (
                    <div
                      key={sev}
                      onClick={() => onNavigateToTab('ncs')}
                      className={`flex-1 h-7 rounded flex items-center justify-center text-[10px] font-mono cursor-pointer transition-transform hover:scale-105 ${cellColor}`}
                      title={`Prob: ${prob}, Sev: ${sev} (Score: ${score})`}
                    >
                      {hasIncident ? '1' : ''}
                    </div>
                  );
                })}
              </div>
            ))}
          </div>

          <div className="mt-4 pt-3 border-t border-slate-200 dark:border-slate-800 flex justify-between text-[10px] font-mono text-slate-500">
            <span className="flex items-center gap-1"><span className="w-2 h-2 rounded bg-emerald-400" /> Bajo</span>
            <span className="flex items-center gap-1"><span className="w-2 h-2 rounded bg-yellow-300" /> Medio</span>
            <span className="flex items-center gap-1"><span className="w-2 h-2 rounded bg-amber-400" /> Alto</span>
            <span className="flex items-center gap-1"><span className="w-2 h-2 rounded bg-rose-500" /> Crítico</span>
          </div>
        </div>

        {/* Ranking de Trazabilidad (#16) (4 cols) */}
        <div className={`lg:col-span-4 p-5 rounded-2xl border transition-all ${
          isDarkTheme ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200 shadow-xs'
        }`}>
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                Ranking de Trazabilidad
              </h3>
              <p className="text-xs text-slate-500">
                Calidad por origen de red de pesca recuperada
              </p>
            </div>
            <button
              onClick={() => onNavigateToTab('trazabilidad')}
              className="text-xs font-bold text-blue-600 dark:text-cyan-400 hover:underline"
            >
              Ver lotes
            </button>
          </div>

          <div className="space-y-2.5">
            {traceabilityRankings.map((t, idx) => (
              <div 
                key={t.traceability}
                onClick={() => onNavigateToTab('trazabilidad')}
                className="p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-all cursor-pointer flex items-center justify-between text-xs"
              >
                <div className="flex items-center gap-2.5">
                  <span className="w-5 h-5 rounded-lg bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300 text-[10px] font-mono font-bold flex items-center justify-center">
                    {idx + 1}
                  </span>
                  <div>
                    <div className="font-bold text-slate-900 dark:text-white">{t.traceability}</div>
                    <div className="text-[10px] text-slate-500 font-mono">{t.processedKg.toLocaleString()} kg procesados</div>
                  </div>
                </div>

                <div className="text-right font-mono">
                  <div className={`font-bold ${t.contaminationPercent <= 1.5 ? 'text-emerald-600' : 'text-rose-600'}`}>
                    {t.contaminationPercent.toFixed(2)}%
                  </div>
                  <div className="text-[9px] text-slate-400">{t.contaminationKg} kg merma</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Actividad Reciente (#22) (4 cols) */}
        <div className={`lg:col-span-4 p-5 rounded-2xl border transition-all ${
          isDarkTheme ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200 shadow-xs'
        }`}>
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                Actividad Reciente
              </h3>
              <p className="text-xs text-slate-500">
                Bitácora en vivo de inspecciones y cambios
              </p>
            </div>
            <button
              onClick={() => onNavigateToTab('configuracion')}
              className="text-xs font-bold text-blue-600 dark:text-cyan-400 hover:underline"
            >
              Auditoría
            </button>
          </div>

          <div className="space-y-3">
            {auditLogs.slice(0, 4).map((log) => {
              const uName = log.userName || log.user;
              const uAvatar = log.userAvatar || '/assets/marcos-salinas.svg';
              const logTime = log.time || log.timestamp;
              return (
                <div key={log.id} className="flex items-start gap-2.5 text-xs">
                  <div className="w-7 h-7 rounded-lg overflow-hidden bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shrink-0 mt-0.5">
                    <img src={uAvatar} alt={uName} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-slate-800 dark:text-slate-200 truncate">{uName}</span>
                      <span className="text-[9px] font-mono text-slate-400">{logTime}</span>
                    </div>
                    <p className="text-[11px] text-slate-500 mt-0.5 truncate">
                      {log.action}: <span className="font-mono text-blue-600 dark:text-cyan-400">{log.affectedRecord || log.newValue || log.details}</span>
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* FILA 7: Galería de Evidencias Digitales (#23, #55) */}
      <div className={`p-5 rounded-2xl border transition-all ${
        isDarkTheme ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200 shadow-xs'
      }`}>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                Evidencias Digitales & Registros Visuales en Planta
              </h3>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300 font-bold">
                Fotos & Videos
              </span>
            </div>
            <p className="text-xs text-slate-500">
              Inspecciones fotográficas Antes/Después y videos técnicos de corte y molienda
            </p>
          </div>

          <button
            onClick={() => onOpenEvidence(evidences[0])}
            className="text-xs font-bold text-blue-600 dark:text-cyan-400 hover:underline flex items-center gap-1 self-start sm:self-auto cursor-pointer"
          >
            <span>Abrir Galería Completa ({evidences.length})</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Evidence Cards Carousel / Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {evidences.map((ev) => (
            <div
              key={ev.id}
              onClick={() => onOpenEvidence(ev)}
              className="group rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden hover:shadow-lg transition-all cursor-pointer bg-slate-50/50 dark:bg-slate-800/40 flex flex-col"
            >
              <div className="relative h-36 bg-black overflow-hidden flex items-center justify-center">
                {ev.type === 'video' ? (
                  <div className="relative w-full h-full flex items-center justify-center bg-slate-900">
                    <img 
                      src={ev.fileUrl} 
                      alt={ev.title} 
                      className="w-full h-full object-cover opacity-60 group-hover:scale-105 transition-transform" 
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute w-10 h-10 rounded-full bg-blue-600 text-white flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                      <Play className="w-5 h-5 ml-0.5" />
                    </div>
                    <span className="absolute bottom-2 left-2 px-1.5 py-0.5 rounded bg-black/70 text-white text-[9px] font-mono">
                      Video • {ev.videoDuration || '00:48'}
                    </span>
                  </div>
                ) : (
                  <img
                    src={ev.fileUrl}
                    alt={ev.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                    referrerPolicy="no-referrer"
                  />
                )}
                {ev.phase && (
                  <span className={`absolute top-2 left-2 px-2 py-0.5 rounded-md text-[9px] font-bold font-mono ${
                    ev.phase === 'Antes' ? 'bg-amber-500 text-white' : 'bg-emerald-600 text-white'
                  }`}>
                    {ev.phase}
                  </span>
                )}
              </div>

              <div className="p-3 flex-1 flex flex-col justify-between">
                <div>
                  <h4 className="font-bold text-xs text-slate-900 dark:text-white truncate">
                    {ev.title}
                  </h4>
                  <p className="text-[10px] text-slate-500 mt-0.5 font-mono">
                    {ev.location} • {ev.capturedAt}
                  </p>
                </div>
                <div className="mt-2 pt-2 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between text-[10px] font-mono text-slate-400">
                  <span>{ev.code}</span>
                  <span className="text-blue-600 dark:text-cyan-400 font-bold group-hover:underline">Ver detalle</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
