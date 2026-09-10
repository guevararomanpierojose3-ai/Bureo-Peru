import React, { useState } from 'react';
import { 
  Gauge, 
  TrendingUp, 
  TrendingDown, 
  Minus, 
  Target, 
  Award, 
  Layers, 
  Flame, 
  CheckCircle2, 
  AlertTriangle, 
  ArrowRight,
  ArrowUpRight,
  ArrowDownRight,
  Sliders
} from 'lucide-react';
import { IndicatorMetric, AreaRanking, ActiveTab } from '../../types';

interface IndicatorsViewProps {
  indicators: IndicatorMetric[];
  areaRankings: AreaRanking[];
  onNavigateToTab: (tab: ActiveTab) => void;
  isDarkTheme?: boolean;
}

export default function IndicatorsView({
  indicators,
  areaRankings,
  onNavigateToTab,
  isDarkTheme = false
}: IndicatorsViewProps) {
  const [comparisonType, setComparisonType] = useState<'mes' | 'año' | 'area'>('mes');

  // ICG Main Gauge metric
  const foundIcg = indicators.find(i => i.id === 'IND-01');
  const icgVal = foundIcg ? (foundIcg.result ?? foundIcg.value) : 94.8;
  const icgMetric = foundIcg || {
    id: 'IND-01',
    category: 'Calidad',
    name: 'Índice de Calidad Global (ICG)',
    unit: '%',
    value: 94.8,
    result: 94.8,
    target: 95.0,
    targetDirection: 'gte' as const,
    gap: -0.2,
    compliancePercentage: 99.8,
    compliancePercent: 99.8,
    trend: 'up',
    status: 'OPTIMO' as const
  };

  return (
    <div className="space-y-6 pb-12 animate-fadeIn">
      {/* Header Banner */}
      <div className={`p-5 rounded-2xl border ${isDarkTheme ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200 shadow-xs'}`}>
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base font-bold text-slate-900 dark:text-white">
                Tablero de Indicadores Clave & Metas (KPI / SLA)
              </h2>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300 font-bold">
                QMS Control Panel
              </span>
            </div>
            <p className="text-xs text-slate-500">
              Evaluación estricta de brechas operacionales, porcentaje de cumplimiento y dirección de tendencia.
            </p>
          </div>

          <button
            onClick={() => onNavigateToTab('parametros')}
            className="px-3.5 py-1.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 text-xs font-bold flex items-center gap-1.5 self-start md:self-auto cursor-pointer"
          >
            <Sliders className="w-3.5 h-3.5 text-blue-600" />
            <span>Configurar Metas</span>
          </button>
        </div>
      </div>

      {/* Hero: Gran Indicador Circular ICG (#36, #50) */}
      <div className={`p-6 rounded-2xl border ${isDarkTheme ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200 shadow-xs'}`}>
        <div className="flex flex-col lg:flex-row items-center justify-between gap-8">
          <div className="flex-1 space-y-3 text-center lg:text-left">
            <span className="text-xs font-mono font-bold text-blue-600 dark:text-cyan-400 uppercase tracking-wider">
              Indicador Maestro Consolidado
            </span>
            <h3 className="text-2xl font-black text-slate-900 dark:text-white">
              Índice de Calidad Global (ICG)
            </h3>
            <p className="text-xs text-slate-500 max-w-xl">
              Ponderación algorítmica de conformidad de lotes (50%), cumplimiento en tiempos de cierre de NC (25%) y eficacia de acciones correctivas implementadas (25%).
            </p>

            <div className="pt-2 flex flex-wrap justify-center lg:justify-start gap-4 text-xs font-mono">
              <div className="p-2.5 rounded-xl bg-slate-100 dark:bg-slate-800">
                <span className="text-slate-400 text-[10px] block">Meta Establecida</span>
                <strong className="text-sm text-slate-900 dark:text-white">≥ 95.0%</strong>
              </div>
              <div className="p-2.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300">
                <span className="text-[10px] block">Cumplimiento SLA</span>
                <strong className="text-sm">99.8% (Óptimo)</strong>
              </div>
              <div className="p-2.5 rounded-xl bg-blue-50 dark:bg-blue-950/40 text-blue-800 dark:text-blue-300">
                <span className="text-[10px] block">Brecha Actual</span>
                <strong className="text-sm">-0.2%</strong>
              </div>
            </div>
          </div>

          {/* Semicircular / Gauge Visual */}
          <div className="relative w-52 h-52 flex items-center justify-center shrink-0">
            <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
              <path
                className="text-slate-200 dark:text-slate-800"
                strokeWidth="3.2"
                stroke="currentColor"
                fill="none"
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              />
              <path
                className="text-blue-600 dark:text-cyan-400"
                strokeDasharray={`${icgVal}, 100`}
                strokeWidth="3.5"
                strokeLinecap="round"
                stroke="currentColor"
                fill="none"
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              />
            </svg>
            <div className="absolute flex flex-col items-center">
              <span className="text-3xl font-black font-mono text-slate-900 dark:text-white">
                {icgVal}%
              </span>
              <span className="text-[11px] font-bold text-emerald-600 dark:text-emerald-400 uppercase font-mono">
                ✓ Estado Óptimo
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Matriz de Indicadores Clave (#35): RESULTADO | META | BRECHA | CUMPLIMIENTO | TENDENCIA | ESTADO */}
      <div className={`rounded-2xl border overflow-hidden ${isDarkTheme ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200 shadow-xs'}`}>
        <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
          <h3 className="text-sm font-bold text-slate-900 dark:text-white">
            Matriz Detallada de Indicadores Operacionales
          </h3>
          <span className="text-xs font-mono text-slate-400">Norma ISO 9001:2015</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className={`text-[10px] font-mono font-bold uppercase border-b ${
              isDarkTheme ? 'bg-slate-800 text-slate-400 border-slate-800' : 'bg-slate-50 text-slate-500 border-slate-200'
            }`}>
              <tr>
                <th className="py-3 px-4">Indicador</th>
                <th className="py-3 px-3 text-right">Resultado</th>
                <th className="py-3 px-3 text-right">Meta Oficial</th>
                <th className="py-3 px-3 text-right">Brecha</th>
                <th className="py-3 px-3 text-right">Cumplimiento</th>
                <th className="py-3 px-3 text-center">Tendencia</th>
                <th className="py-3 px-4 text-center">Estado</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {indicators.map((ind) => {
                const statusStr = String(ind.status).toUpperCase();
                const isOptimal = statusStr === 'OPTIMO' || statusStr === 'CUMPLE';
                const isAlert = statusStr === 'ALERTA' || statusStr === 'ATENCION';
                const isCritical = statusStr === 'CRITICO';

                const val = ind.result ?? ind.value;
                const compPct = ind.compliancePercent ?? ind.compliancePercentage;
                const trendVal = ind.trend ?? (ind.gap >= 0 ? 'up' : 'down');

                return (
                  <tr key={ind.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40">
                    <td className="py-3 px-4">
                      <div className="font-bold text-slate-900 dark:text-white">{ind.name}</div>
                      <div className="text-[10px] font-mono text-slate-400">{ind.id} • Unidad: {ind.unit}</div>
                    </td>
                    <td className="py-3 px-3 text-right font-mono font-black text-slate-800 dark:text-slate-200 text-sm">
                      {val} {ind.unit}
                    </td>
                    <td className="py-3 px-3 text-right font-mono text-slate-500">
                      {ind.target} {ind.unit}
                    </td>
                    <td className="py-3 px-3 text-right font-mono font-bold">
                      <span className={ind.gap >= 0 ? 'text-emerald-600' : 'text-rose-600'}>
                        {ind.gap > 0 ? `+${ind.gap}` : ind.gap} {ind.unit}
                      </span>
                    </td>
                    <td className="py-3 px-3 text-right font-mono font-black text-blue-600 dark:text-cyan-400">
                      {compPct}%
                    </td>
                    <td className="py-3 px-3 text-center">
                      <div className="flex items-center justify-center">
                        {trendVal === 'up' ? (
                          <span className="flex items-center gap-0.5 text-emerald-600 font-bold text-[11px] font-mono">
                            <TrendingUp className="w-3.5 h-3.5" /> 🟢 Mejoró
                          </span>
                        ) : trendVal === 'down' ? (
                          <span className="flex items-center gap-0.5 text-rose-600 font-bold text-[11px] font-mono">
                            <TrendingDown className="w-3.5 h-3.5" /> 🔴 Empeoró
                          </span>
                        ) : (
                          <span className="flex items-center gap-0.5 text-amber-600 font-bold text-[11px] font-mono">
                            <Minus className="w-3.5 h-3.5" /> 🟡 Sin cambio
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="py-3 px-4 text-center">
                      <span className={`px-2.5 py-0.5 rounded-full font-mono text-[10px] font-bold ${
                        isOptimal ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300' :
                        isAlert ? 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300' :
                        'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300'
                      }`}>
                        {ind.status}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Comparador Interactivo (#37) */}
      <div className={`p-5 rounded-2xl border ${isDarkTheme ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200 shadow-xs'}`}>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
          <div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">
              Módulo Comparador Interactivo de Calidad
            </h3>
            <p className="text-xs text-slate-500">
              Análisis comparativo de rendimiento temporal y áreas operativas
            </p>
          </div>

          <div className="flex gap-1 p-1 rounded-xl bg-slate-100 dark:bg-slate-800">
            <button
              onClick={() => setComparisonType('mes')}
              className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                comparisonType === 'mes' ? 'bg-blue-600 text-white' : 'text-slate-600 dark:text-slate-400'
              }`}
            >
              Mes vs Mes Anterior
            </button>
            <button
              onClick={() => setComparisonType('año')}
              className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                comparisonType === 'año' ? 'bg-blue-600 text-white' : 'text-slate-600 dark:text-slate-400'
              }`}
            >
              2026 vs 2025
            </button>
            <button
              onClick={() => setComparisonType('area')}
              className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                comparisonType === 'area' ? 'bg-blue-600 text-white' : 'text-slate-600 dark:text-slate-400'
              }`}
            >
              Área vs Área
            </button>
          </div>
        </div>

        {/* Comparison Details Display */}
        {comparisonType === 'mes' && (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
            <div className="p-3 rounded-xl border border-slate-200 dark:border-slate-800">
              <span className="text-slate-400 text-[10px] font-mono uppercase">Contaminación Global</span>
              <div className="flex items-center justify-between mt-1">
                <span className="text-base font-bold font-mono">1.42% vs 1.68%</span>
                <span className="text-emerald-600 font-bold flex items-center text-[11px]"><ArrowDownRight className="w-3.5 h-3.5" /> -0.26% 🟢 Mejoró</span>
              </div>
            </div>
            <div className="p-3 rounded-xl border border-slate-200 dark:border-slate-800">
              <span className="text-slate-400 text-[10px] font-mono uppercase">Masa Merma Total</span>
              <div className="flex items-center justify-between mt-1">
                <span className="text-base font-bold font-mono">27.3 kg vs 34.1 kg</span>
                <span className="text-emerald-600 font-bold flex items-center text-[11px]"><ArrowDownRight className="w-3.5 h-3.5" /> -6.8 kg 🟢 Mejoró</span>
              </div>
            </div>
            <div className="p-3 rounded-xl border border-slate-200 dark:border-slate-800">
              <span className="text-slate-400 text-[10px] font-mono uppercase">Tiempo Cierre NC</span>
              <div className="flex items-center justify-between mt-1">
                <span className="text-base font-bold font-mono">6.2 d vs 7.8 d</span>
                <span className="text-emerald-600 font-bold flex items-center text-[11px]"><ArrowDownRight className="w-3.5 h-3.5" /> -1.6 días 🟢 Mejoró</span>
              </div>
            </div>
          </div>
        )}

        {comparisonType === 'año' && (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
            <div className="p-3 rounded-xl border border-slate-200 dark:border-slate-800">
              <span className="text-slate-400 text-[10px] font-mono uppercase">Tasa de Conformidad Anual</span>
              <div className="flex items-center justify-between mt-1">
                <span className="text-base font-bold font-mono">98.58% vs 96.80%</span>
                <span className="text-emerald-600 font-bold flex items-center text-[11px]"><ArrowUpRight className="w-3.5 h-3.5" /> +1.78% 🟢 Mejoró</span>
              </div>
            </div>
            <div className="p-3 rounded-xl border border-slate-200 dark:border-slate-800">
              <span className="text-slate-400 text-[10px] font-mono uppercase">NC Totales Emitidas</span>
              <div className="flex items-center justify-between mt-1">
                <span className="text-base font-bold font-mono">12 vs 28</span>
                <span className="text-emerald-600 font-bold flex items-center text-[11px]"><ArrowDownRight className="w-3.5 h-3.5" /> -57% desvíos 🟢</span>
              </div>
            </div>
            <div className="p-3 rounded-xl border border-slate-200 dark:border-slate-800">
              <span className="text-slate-400 text-[10px] font-mono uppercase">Eficacia Acciones CAPA</span>
              <div className="flex items-center justify-between mt-1">
                <span className="text-base font-bold font-mono">94% vs 85%</span>
                <span className="text-emerald-600 font-bold flex items-center text-[11px]"><ArrowUpRight className="w-3.5 h-3.5" /> +9% 🟢</span>
              </div>
            </div>
          </div>
        )}

        {comparisonType === 'area' && (
          <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 text-xs">
            <div className="flex justify-between items-center mb-2">
              <span className="font-bold">Mejor Área: 🥇 Empaque (0.42%)</span>
              <span className="font-bold text-rose-600">Área Crítica: 🚨 Corte (3.45%)</span>
            </div>
            <p className="text-[11px] text-slate-500">
              La brecha entre el área de mejor y peor desempeño es de <strong>3.03%</strong>. Las acciones de estandarización en Corte reducirían la merma total en más de 1,200 kg mensuales.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
