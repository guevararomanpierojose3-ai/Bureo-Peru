import { useState } from 'react';
import { 
  Flame, 
  AlertTriangle, 
  Layers, 
  TrendingDown, 
  TrendingUp, 
  Filter, 
  Download, 
  ArrowUpRight, 
  Calendar, 
  Sparkles,
  ShieldAlert,
  BarChart3
} from 'lucide-react';
import { QualityRecord, AreaRanking } from '../../types';

interface ContaminationViewProps {
  records: QualityRecord[];
  areaRankings: AreaRanking[];
  paretoCauses: { cause: string; contaminationKg: number; sharePercent: number; cumulativePercent: number }[];
  onOpenRecordDetail: (record: QualityRecord) => void;
  isDarkTheme?: boolean;
}

export default function ContaminationView({
  records,
  areaRankings,
  paretoCauses,
  onOpenRecordDetail,
  isDarkTheme = false
}: ContaminationViewProps) {
  const [selectedAreaFilter, setSelectedAreaFilter] = useState<string>('TODAS');
  const [selectedCauseFilter, setSelectedCauseFilter] = useState<string>('TODAS');

  const totalProcessed = records.reduce((s, r) => s + r.processedKg, 0);
  const totalContamination = records.reduce((s, r) => s + r.contaminationKg, 0);
  const contaminationPct = totalProcessed > 0 ? (totalContamination / totalProcessed) * 100 : 0;

  // Corte specific data (#51)
  const corteArea = areaRankings.find(a => (a.area || a.name) === 'Corte') || {
    id: 'ar-corte',
    name: 'Corte',
    area: 'Corte',
    processedKg: 77333,
    contaminationKg: 2668,
    contaminationRate: 3.45,
    contaminationPercent: 3.45,
    complianceRate: 96.55,
    status: 'Crítico' as const,
    auditedLots: 45,
    ncCount: 8,
    position: 6
  };

  const filteredRecords = records.filter(r => {
    const matchesArea = selectedAreaFilter === 'TODAS' || r.area === selectedAreaFilter;
    const matchesCause = selectedCauseFilter === 'TODAS' || r.cause === selectedCauseFilter;
    return matchesArea && matchesCause;
  });

  return (
    <div className="space-y-6 pb-12 animate-fadeIn">
      {/* Top Banner: Contaminación & Alerta Crítica Corte (#51) */}
      <div className={`p-5 sm:p-6 rounded-2xl border transition-all ${
        isDarkTheme 
          ? 'bg-gradient-to-r from-rose-950/40 via-slate-900 to-slate-900 border-rose-900/60 text-white' 
          : 'bg-gradient-to-r from-rose-50 via-white to-slate-50 border-rose-200 text-slate-900 shadow-xs'
      }`}>
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-rose-600 text-white p-2.5 flex items-center justify-center shadow-lg shadow-rose-600/30 shrink-0">
              <Flame className="w-full h-full" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono font-bold text-rose-600 dark:text-rose-400 uppercase tracking-wider">
                  Módulo Especializado de Contaminación & Mermas
                </span>
                <span className="px-2 py-0.5 text-[10px] font-bold rounded-full bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300 font-mono">
                  ISO 9001: 8.7
                </span>
              </div>
              <h2 className="text-lg sm:text-xl font-black tracking-tight text-slate-900 dark:text-white">
                Control de Pérdidas y Merma de Calidad
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Identificación de focos de contaminación por área, tipo de residuo y correlación de causa raíz.
              </p>
            </div>
          </div>

          <div className="p-3 rounded-xl bg-white dark:bg-slate-900 border border-rose-300 dark:border-rose-800 shadow-sm flex items-center gap-3">
            <div className="text-right">
              <div className="text-[10px] uppercase font-mono font-bold text-rose-600">Área Más Afectada</div>
              <div className="text-sm font-black text-slate-900 dark:text-white">Corte (51.8% del total)</div>
            </div>
            <div className="p-2 rounded-lg bg-rose-100 dark:bg-rose-950 text-rose-600 font-mono font-bold text-xs">
              2,668 kg
            </div>
          </div>
        </div>
      </div>

      {/* 5 KPIs de Contaminación (#28) */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
        <div className={`p-4 rounded-2xl border ${isDarkTheme ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200 shadow-2xs'}`}>
          <span className="text-[11px] font-bold text-slate-500">Contaminación Total</span>
          <div className="mt-1 text-2xl font-black font-mono text-rose-600 dark:text-rose-400">
            {totalContamination.toFixed(1)} <span className="text-xs text-slate-400 font-mono">kg</span>
          </div>
          <p className="text-[10px] text-slate-400 mt-0.5">Masa segregada</p>
        </div>

        <div className={`p-4 rounded-2xl border ${isDarkTheme ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200 shadow-2xs'}`}>
          <span className="text-[11px] font-bold text-slate-500">% Contaminación Global</span>
          <div className="mt-1 text-2xl font-black font-mono text-slate-900 dark:text-white">
            {contaminationPct.toFixed(2)}%
          </div>
          <p className="text-[10px] text-emerald-600 font-bold mt-0.5">Meta: ≤ 1.50% (Cumple)</p>
        </div>

        <div className={`p-4 rounded-2xl border ${isDarkTheme ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200 shadow-2xs'}`}>
          <span className="text-[11px] font-bold text-slate-500">Área Crítica</span>
          <div className="mt-1 text-lg font-black font-mono text-rose-600 dark:text-rose-400 truncate">
            Corte (3.45%)
          </div>
          <p className="text-[10px] text-rose-600 font-bold mt-0.5">51.8% de toda la merma</p>
        </div>

        <div className={`p-4 rounded-2xl border ${isDarkTheme ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200 shadow-2xs'}`}>
          <span className="text-[11px] font-bold text-slate-500">Causa Principal</span>
          <div className="mt-1 text-sm font-black text-slate-900 dark:text-white truncate">
            Mezcla de material
          </div>
          <p className="text-[10px] text-slate-400 mt-0.5">42.1% participación</p>
        </div>

        <div className={`p-4 rounded-2xl border ${isDarkTheme ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200 shadow-2xs'}`}>
          <span className="text-[11px] font-bold text-slate-500">Trazabilidad Crítica</span>
          <div className="mt-1 text-lg font-black font-mono text-amber-600 dark:text-amber-400">
            Austral (1.82%)
          </div>
          <p className="text-[10px] text-slate-400 mt-0.5">14.2 kg merma</p>
        </div>
      </div>

      {/* Charts Section: Pareto 80/20 & Barras por Área */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Pareto Interactivo */}
        <div className={`lg:col-span-7 p-5 rounded-2xl border ${isDarkTheme ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200 shadow-xs'}`}>
          <div className="flex items-center justify-between mb-3">
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                Pareto de Causas Raíz de Contaminación
              </h3>
              <p className="text-xs text-slate-500">
                Identificación del 20% de causas que originan el 80% de las pérdidas
              </p>
            </div>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-purple-100 text-purple-800 dark:bg-purple-950 dark:text-purple-300 font-bold">
              80/20 Rule
            </span>
          </div>

          <div className="space-y-3 mt-4">
            {paretoCauses.map((cause, idx) => (
              <div key={cause.cause} className="text-xs">
                <div className="flex items-center justify-between mb-1">
                  <span className="font-bold text-slate-800 dark:text-slate-200 flex items-center gap-2">
                    <span className="w-5 h-5 rounded-md bg-slate-100 dark:bg-slate-800 font-mono text-center flex items-center justify-center text-[10px]">
                      {idx + 1}
                    </span>
                    {cause.cause}
                  </span>
                  <span className="font-mono text-slate-500">
                    {cause.contaminationKg.toFixed(1)} kg • {cause.sharePercent.toFixed(1)}% (Acumulado: {cause.cumulativePercent.toFixed(1)}%)
                  </span>
                </div>
                <div className="w-full h-3 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden flex">
                  <div style={{ width: `${cause.sharePercent}%` }} className="h-full bg-blue-600 rounded-full" />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Contaminación por Área Breakdown */}
        <div className={`lg:col-span-5 p-5 rounded-2xl border ${isDarkTheme ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200 shadow-xs'}`}>
          <div className="flex items-center justify-between mb-3">
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                Contaminación por Área de Planta
              </h3>
              <p className="text-xs text-slate-500">
                Kg y % de merma por cada fase del proceso
              </p>
            </div>
          </div>

          <div className="space-y-3 mt-4">
            {areaRankings.map((ar) => {
              const areaName = ar.area || ar.name;
              const isWorst = areaName === 'Corte';
              const contamPct = ar.contaminationPercent ?? ar.contaminationRate ?? 0;
              return (
                <div key={ar.id || areaName} className="text-xs">
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                      {areaName}
                      {isWorst && <span className="text-[9px] px-1 py-0.2 rounded bg-rose-100 text-rose-800 font-mono font-bold">51.8%</span>}
                    </span>
                    <span className="font-mono text-slate-500">
                      {ar.contaminationKg} kg ({contamPct.toFixed(2)}%)
                    </span>
                  </div>
                  <div className="w-full h-2.5 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                    <div 
                      style={{ width: `${Math.min(100, (ar.contaminationKg / 2700) * 100)}%` }} 
                      className={`h-full rounded-full ${isWorst ? 'bg-rose-600' : contamPct <= 1.5 ? 'bg-emerald-500' : 'bg-amber-500'}`} 
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Contamination Records Table */}
      <div className={`rounded-2xl border overflow-hidden ${isDarkTheme ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200 shadow-xs'}`}>
        <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3 bg-slate-50/50 dark:bg-slate-800/40">
          <div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">
              Eventos de Contaminación Registrados
            </h3>
            <p className="text-xs text-slate-500">
              Detalle de cada pesaje con merma detectada
            </p>
          </div>

          <div className="flex items-center gap-2">
            <select
              value={selectedAreaFilter}
              onChange={(e) => setSelectedAreaFilter(e.target.value)}
              className="px-3 py-1.5 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800"
            >
              <option value="TODAS">Todas las Áreas</option>
              {['Corte', 'Lavado', 'Tendido', 'Secado', 'Recogido', 'Empaque'].map(a => (
                <option key={a} value={a}>{a}</option>
              ))}
            </select>

            <select
              value={selectedCauseFilter}
              onChange={(e) => setSelectedCauseFilter(e.target.value)}
              className="px-3 py-1.5 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800"
            >
              <option value="TODAS">Todas las Causas</option>
              {['Mezcla de material', 'Plástico', 'Mala segregación', 'Selección incorrecta', 'Otros'].map(c => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className={`text-[10px] font-mono font-bold uppercase border-b ${
              isDarkTheme ? 'bg-slate-800 text-slate-400 border-slate-800' : 'bg-slate-50 text-slate-500 border-slate-200'
            }`}>
              <tr>
                <th className="py-2.5 px-4">ID Registro</th>
                <th className="py-2.5 px-3">Fecha</th>
                <th className="py-2.5 px-3">Área</th>
                <th className="py-2.5 px-3">Trazabilidad</th>
                <th className="py-2.5 px-3 text-right">Masa Proc.</th>
                <th className="py-2.5 px-3 text-right">Contam. (kg)</th>
                <th className="py-2.5 px-3 text-right">% Contam.</th>
                <th className="py-2.5 px-3">Causa</th>
                <th className="py-2.5 px-3">Defecto Identificado</th>
                <th className="py-2.5 px-3">Acción Inmediata</th>
                <th className="py-2.5 px-4 text-center">Acción</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {filteredRecords.map((r) => (
                <tr key={r.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40">
                  <td className="py-2.5 px-4 font-mono font-bold text-blue-600 dark:text-cyan-400">{r.id}</td>
                  <td className="py-2.5 px-3 text-slate-500 whitespace-nowrap">{r.date}</td>
                  <td className="py-2.5 px-3 font-bold">{r.area}</td>
                  <td className="py-2.5 px-3 font-mono">{r.traceability}</td>
                  <td className="py-2.5 px-3 text-right font-mono">{r.processedKg} kg</td>
                  <td className="py-2.5 px-3 text-right font-mono font-bold text-rose-600">{r.contaminationKg} kg</td>
                  <td className="py-2.5 px-3 text-right font-mono font-bold">
                    <span className={r.contaminationPercent > 1.5 ? 'text-rose-600' : 'text-emerald-600'}>
                      {r.contaminationPercent.toFixed(2)}%
                    </span>
                  </td>
                  <td className="py-2.5 px-3">{r.cause}</td>
                  <td className="py-2.5 px-3 text-slate-500 max-w-[150px] truncate" title={r.contaminationType}>
                    {r.contaminationType}
                  </td>
                  <td className="py-2.5 px-3 text-slate-500 max-w-[150px] truncate" title={r.immediateAction}>
                    {r.immediateAction || 'N/A'}
                  </td>
                  <td className="py-2.5 px-4 text-center">
                    <button
                      onClick={() => onOpenRecordDetail(r)}
                      className="px-2 py-1 rounded bg-blue-50 text-blue-600 hover:bg-blue-100 font-bold text-[11px] cursor-pointer"
                    >
                      Ver
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
