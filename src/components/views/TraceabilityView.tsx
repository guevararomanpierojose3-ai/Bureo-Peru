import React, { useState } from 'react';
import { 
  GitFork, 
  Search, 
  CheckCircle2, 
  AlertCircle, 
  Clock, 
  ArrowRight, 
  ShieldCheck, 
  Layers, 
  MapPin, 
  Calendar, 
  User, 
  Flame, 
  FileSpreadsheet, 
  AlertOctagon,
  Eye
} from 'lucide-react';
import { QualityRecord, CapaCase, DigitalEvidence, ActiveTab } from '../../types';

interface TraceabilityViewProps {
  records: QualityRecord[];
  capaCases: CapaCase[];
  evidences: DigitalEvidence[];
  onNavigateToTab: (tab: ActiveTab) => void;
  onOpenRecordDetail: (record: QualityRecord) => void;
  isDarkTheme?: boolean;
}

export default function TraceabilityView({
  records,
  capaCases,
  evidences,
  onNavigateToTab,
  onOpenRecordDetail,
  isDarkTheme = false
}: TraceabilityViewProps) {
  const [selectedLotCode, setSelectedLotCode] = useState<string>('Austral');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const lots = [
    {
      code: 'Austral',
      origin: 'Puerto Paita (Caleta La Islilla)',
      material: 'Redes de pesca de polietileno/nylon recuperadas',
      totalKg: 780,
      contaminationKg: 14.2,
      yieldPercent: 98.18,
      status: 'Conforme',
      date: '2026-09-09',
      operator: 'Marcos Salinas'
    },
    {
      code: 'Pacífico-B',
      origin: 'Chimbote (Muelle Coishco)',
      material: 'Redes cerqueras y cabos de fondeo',
      totalKg: 680,
      contaminationKg: 7.7,
      yieldPercent: 98.87,
      status: 'Conforme',
      date: '2026-09-08',
      operator: 'Elena Torres'
    },
    {
      code: 'Mar del Sur',
      origin: 'Pisco (San Andrés)',
      material: 'Artes de pesca artesanal',
      totalKg: 460,
      contaminationKg: 5.4,
      yieldPercent: 98.83,
      status: 'Conforme',
      date: '2026-09-07',
      operator: 'Roberto Díaz'
    }
  ];

  const currentLot = lots.find(l => l.code.toLowerCase() === selectedLotCode.toLowerCase()) || lots[0];

  // Associated records for current lot
  const lotRecords = records.filter(r => r.traceability.toLowerCase().includes(currentLot.code.toLowerCase()));
  const lotNcs = capaCases.filter(nc => nc.lotCode.toLowerCase().includes(currentLot.code.toLowerCase()) || nc.title.includes(currentLot.code));

  // The 8 stages of traceability (#30)
  const stages = [
    { number: 1, title: 'Recepción', desc: 'Arribo de redes a planta y pesaje en báscula', status: 'completed', time: '08:00 AM' },
    { number: 2, title: 'Proceso', desc: 'Lavado en tinas, desinfección y secado solar', status: 'completed', time: '10:30 AM' },
    { number: 3, title: 'Control de Calidad', desc: 'Muestreo de polímero y detección de tara', status: 'completed', time: '01:15 PM' },
    { number: 4, title: 'Contaminación', desc: `${currentLot.contaminationKg} kg merma segregada en corte`, status: 'completed', time: '02:45 PM' },
    { number: 5, title: 'No Conformidad', desc: lotNcs.length > 0 ? `Genera ${lotNcs[0].code}` : 'Sin desvío crítico', status: lotNcs.length > 0 ? 'warning' : 'completed', time: '03:10 PM' },
    { number: 6, title: 'Acción Correctiva', desc: lotNcs.length > 0 ? 'CAPA-AC-088 en proceso' : 'No requerida', status: 'completed', time: '04:00 PM' },
    { number: 7, title: 'Verificación', desc: 'Inspección de eficacia por Supervisor QA', status: 'completed', time: '05:30 PM' },
    { number: 8, title: 'Cierre', desc: 'Liberación de lote y certificación NetPlus®', status: 'active', time: 'En curso' },
  ];

  return (
    <div className="space-y-6 pb-12 animate-fadeIn">
      {/* Header Bar */}
      <div className={`p-5 rounded-2xl border ${isDarkTheme ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200 shadow-xs'}`}>
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base font-bold text-slate-900 dark:text-white">
                Cadena de Custodia & Trazabilidad de Lotes
              </h2>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 font-bold">
                NetPlus® Certified
              </span>
            </div>
            <p className="text-xs text-slate-500">
              Seguimiento completo de cada lote a lo largo de las 8 etapas del ciclo de vida industrial.
            </p>
          </div>

          {/* Lot Selector */}
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-slate-500">Seleccionar Lote:</span>
            <div className="flex gap-1">
              {lots.map(l => (
                <button
                  key={l.code}
                  onClick={() => setSelectedLotCode(l.code)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-mono font-bold transition-all cursor-pointer ${
                    currentLot.code === l.code
                      ? 'bg-blue-600 text-white shadow-xs'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200'
                  }`}
                >
                  {l.code}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Lot Summary Card & Mass Balance */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className={`p-4 rounded-2xl border md:col-span-2 ${isDarkTheme ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200 shadow-2xs'}`}>
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase font-mono">Detalle del Lote</span>
            <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-emerald-100 text-emerald-800">
              {currentLot.status}
            </span>
          </div>
          <h3 className="text-lg font-black text-slate-900 dark:text-white mt-1">
            Lote {currentLot.code}
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            {currentLot.material}
          </p>

          <div className="mt-4 grid grid-cols-2 gap-3 text-xs">
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-rose-500" />
              <span>{currentLot.origin}</span>
            </div>
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-blue-500" />
              <span>{currentLot.date}</span>
            </div>
            <div className="flex items-center gap-2">
              <User className="w-4 h-4 text-emerald-500" />
              <span>Supervisor: {currentLot.operator}</span>
            </div>
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-purple-500" />
              <span>Certificado Bureo NetPlus</span>
            </div>
          </div>
        </div>

        {/* Balance de Masas */}
        <div className={`p-4 rounded-2xl border ${isDarkTheme ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200 shadow-2xs'}`}>
          <span className="text-xs font-bold text-slate-400 uppercase font-mono">Balance de Masa</span>
          <div className="mt-2 space-y-2 text-xs">
            <div className="flex justify-between">
              <span className="text-slate-500">Masa de Entrada:</span>
              <strong className="font-mono">{currentLot.totalKg} kg</strong>
            </div>
            <div className="flex justify-between">
              <span className="text-rose-500 font-bold">Merma / Contam.:</span>
              <strong className="font-mono text-rose-600">-{currentLot.contaminationKg} kg</strong>
            </div>
            <div className="flex justify-between pt-1 border-t border-slate-200 dark:border-slate-800">
              <span className="text-emerald-600 font-bold">Pellet Conforme:</span>
              <strong className="font-mono text-emerald-600">{(currentLot.totalKg - currentLot.contaminationKg).toFixed(1)} kg</strong>
            </div>
          </div>
        </div>

        {/* Rendimiento */}
        <div className={`p-4 rounded-2xl border ${isDarkTheme ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200 shadow-2xs'}`}>
          <span className="text-xs font-bold text-slate-400 uppercase font-mono">Rendimiento Útil</span>
          <div className="mt-2">
            <span className="text-2xl font-black font-mono text-blue-600 dark:text-cyan-400">
              {currentLot.yieldPercent}%
            </span>
          </div>
          <p className="text-[10px] text-slate-500 mt-1">
            Meta de proceso: ≥ 98.0%
          </p>
          <div className="mt-3 w-full h-2 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
            <div style={{ width: `${currentLot.yieldPercent}%` }} className="h-full bg-emerald-500 rounded-full" />
          </div>
        </div>
      </div>

      {/* Visual Timeline: The 8 Stages of Traceability (#30) */}
      <div className={`p-5 rounded-2xl border ${isDarkTheme ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200 shadow-xs'}`}>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-bold text-slate-900 dark:text-white">
            Línea de Tiempo de las 8 Etapas de Trazabilidad
          </h3>
          <span className="text-xs font-mono text-slate-400">Etapa actual: 8/8</span>
        </div>

        {/* Responsive horizontal step layout */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-8 gap-3">
          {stages.map((stage) => {
            const isWarning = stage.status === 'warning';
            const isActive = stage.status === 'active';

            return (
              <div
                key={stage.number}
                className={`p-3 rounded-xl border relative flex flex-col justify-between transition-all ${
                  isWarning 
                    ? 'border-amber-300 dark:border-amber-800 bg-amber-50/50 dark:bg-amber-950/20' 
                    : isActive 
                      ? 'border-blue-500 bg-blue-50/40 dark:bg-blue-950/40 shadow-xs'
                      : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-mono font-bold ${
                      isWarning ? 'bg-amber-500 text-white' : isActive ? 'bg-blue-600 text-white animate-pulse' : 'bg-emerald-500 text-white'
                    }`}>
                      {stage.number}
                    </span>
                    <span className="text-[9px] font-mono text-slate-400">{stage.time}</span>
                  </div>
                  <h4 className="text-xs font-bold text-slate-900 dark:text-white mt-1">
                    {stage.title}
                  </h4>
                  <p className="text-[10px] text-slate-500 mt-0.5 leading-tight">
                    {stage.desc}
                  </p>
                </div>

                <div className="mt-2 pt-2 border-t border-slate-100 dark:border-slate-800 text-[9px] font-mono font-bold flex items-center gap-1">
                  {isWarning ? (
                    <span className="text-amber-600 flex items-center gap-0.5">⚠️ Desvío Abierto</span>
                  ) : isActive ? (
                    <span className="text-blue-600 flex items-center gap-0.5">🔄 En Proceso</span>
                  ) : (
                    <span className="text-emerald-600 flex items-center gap-0.5">✓ Completado</span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Associated Records & NCs for this Lot */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Registros de Calidad Asociados */}
        <div className={`p-4 rounded-2xl border ${isDarkTheme ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200 shadow-xs'}`}>
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-xs font-bold uppercase font-mono text-slate-500 flex items-center gap-1.5">
              <FileSpreadsheet className="w-4 h-4 text-blue-600" />
              Registros de Calidad Vinculados ({lotRecords.length})
            </h3>
            <button
              onClick={() => onNavigateToTab('registro')}
              className="text-xs font-bold text-blue-600 hover:underline"
            >
              Ir a Registros
            </button>
          </div>

          <div className="space-y-2">
            {lotRecords.map((r) => (
              <div 
                key={r.id} 
                onClick={() => onOpenRecordDetail(r)}
                className="p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 flex items-center justify-between hover:bg-slate-50 dark:hover:bg-slate-800/50 cursor-pointer text-xs"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-blue-600">{r.id}</span>
                    <span className="font-bold">{r.area}</span>
                  </div>
                  <div className="text-[10px] text-slate-500">
                    Proc: {r.processedKg} kg • Merma: {r.contaminationKg} kg ({r.contaminationPercent.toFixed(2)}%)
                  </div>
                </div>
                <button className="px-2 py-1 rounded bg-blue-50 text-blue-600 font-bold text-[10px]">
                  Ver
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* No Conformidades Vinculadas */}
        <div className={`p-4 rounded-2xl border ${isDarkTheme ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200 shadow-xs'}`}>
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-xs font-bold uppercase font-mono text-slate-500 flex items-center gap-1.5">
              <AlertOctagon className="w-4 h-4 text-rose-500" />
              No Conformidades Vinculadas ({lotNcs.length})
            </h3>
            <button
              onClick={() => onNavigateToTab('ncs')}
              className="text-xs font-bold text-rose-600 hover:underline"
            >
              Ir a NCs
            </button>
          </div>

          {lotNcs.length === 0 ? (
            <div className="py-8 text-center text-slate-400 text-xs">
              No hay no conformidades abiertas para este lote.
            </div>
          ) : (
            <div className="space-y-2">
              {lotNcs.map((nc) => (
                <div 
                  key={nc.id}
                  onClick={() => onNavigateToTab('ncs')}
                  className="p-2.5 rounded-xl border border-rose-200 dark:border-rose-900 bg-rose-50/30 dark:bg-rose-950/20 flex items-center justify-between hover:bg-rose-50 cursor-pointer text-xs"
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-bold text-rose-600">{nc.code}</span>
                      <span className="font-bold">{nc.title}</span>
                    </div>
                    <div className="text-[10px] text-slate-500">
                      Área: {nc.area} • Resp: {nc.responsibleName} • Estado: {nc.status}
                    </div>
                  </div>
                  <span className="px-2 py-0.5 rounded-full font-mono text-[10px] font-bold bg-rose-100 text-rose-800">
                    {nc.status}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
