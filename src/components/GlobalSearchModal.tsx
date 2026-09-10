import React, { useState, useMemo } from 'react';
import { 
  Search, 
  X, 
  FileSpreadsheet, 
  AlertOctagon, 
  CheckSquare, 
  GitFork, 
  MapPin, 
  User, 
  ArrowRight,
  Flame
} from 'lucide-react';
import { QualityRecord, CapaCase, CorrectiveActionItem, ActiveTab } from '../types';

interface GlobalSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  qualityRecords: QualityRecord[];
  capaCases: CapaCase[];
  correctiveActions: CorrectiveActionItem[];
  onNavigateToTab: (tab: ActiveTab) => void;
  onSelectRecord?: (record: QualityRecord) => void;
  onSelectCapa?: (capa: CapaCase) => void;
  isDarkTheme?: boolean;
}

export default function GlobalSearchModal({
  isOpen,
  onClose,
  qualityRecords,
  capaCases,
  correctiveActions,
  onNavigateToTab,
  onSelectRecord,
  onSelectCapa,
  isDarkTheme = false
}: GlobalSearchModalProps) {
  const [query, setQuery] = useState('');

  const searchResults = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return null;

    const matchedRecords = qualityRecords.filter(r => 
      r.id.toLowerCase().includes(q) ||
      r.traceability.toLowerCase().includes(q) ||
      r.area.toLowerCase().includes(q) ||
      r.cause.toLowerCase().includes(q) ||
      r.responsible.toLowerCase().includes(q) ||
      r.contaminationType.toLowerCase().includes(q)
    );

    const matchedNcs = capaCases.filter(nc => 
      nc.code.toLowerCase().includes(q) ||
      nc.area.toLowerCase().includes(q) ||
      nc.lotCode.toLowerCase().includes(q) ||
      nc.title.toLowerCase().includes(q) ||
      nc.responsibleName.toLowerCase().includes(q) ||
      nc.cause.toLowerCase().includes(q)
    );

    const matchedActions = correctiveActions.filter(ac => 
      ac.id.toLowerCase().includes(q) ||
      ac.ncId.toLowerCase().includes(q) ||
      ac.description.toLowerCase().includes(q) ||
      ac.responsibleName.toLowerCase().includes(q) ||
      ac.area.toLowerCase().includes(q)
    );

    return {
      records: matchedRecords,
      ncs: matchedNcs,
      actions: matchedActions,
      total: matchedRecords.length + matchedNcs.length + matchedActions.length
    };
  }, [query, qualityRecords, capaCases, correctiveActions]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-16 px-4 bg-slate-950/75 backdrop-blur-xs animate-fadeIn">
      <div className={`w-full max-w-2xl rounded-2xl border shadow-2xl overflow-hidden transition-all ${
        isDarkTheme 
          ? 'bg-slate-900 border-slate-700 text-white' 
          : 'bg-white border-slate-200 text-slate-900'
      }`}>
        {/* Search Input Bar */}
        <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex items-center gap-3">
          <Search className="w-5 h-5 text-blue-600 dark:text-cyan-400 shrink-0" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Buscar ID Registro, NC, Acción, Trazabilidad, Área, Responsable o Causa..."
            className="w-full bg-transparent text-sm focus:outline-hidden placeholder:text-slate-400"
            autoFocus
          />
          {query && (
            <button 
              onClick={() => setQuery('')}
              className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
            >
              <X className="w-4 h-4" />
            </button>
          )}
          <kbd className="hidden sm:inline px-2 py-0.5 rounded text-[10px] font-mono bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-500">
            ESC
          </kbd>
        </div>

        {/* Results Body */}
        <div className="max-h-[60vh] overflow-y-auto p-4 space-y-4">
          {!query && (
            <div className="py-8 text-center text-slate-400 text-xs">
              <p className="font-bold">Escribe un término para buscar en todo el sistema.</p>
              <div className="mt-3 flex flex-wrap justify-center gap-1.5 text-[11px]">
                <button onClick={() => setQuery('CAL-00001')} className="px-2 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-blue-50 dark:hover:bg-blue-950 font-mono text-blue-600 dark:text-cyan-400">CAL-00001</button>
                <button onClick={() => setQuery('NC-2026-004')} className="px-2 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-rose-50 dark:hover:bg-rose-950 font-mono text-rose-600">NC-2026-004</button>
                <button onClick={() => setQuery('Austral')} className="px-2 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-emerald-50 dark:hover:bg-emerald-950 font-mono text-emerald-600">Austral</button>
                <button onClick={() => setQuery('Corte')} className="px-2 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200">Corte</button>
                <button onClick={() => setQuery('Mezcla de material')} className="px-2 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200">Mezcla de material</button>
              </div>
            </div>
          )}

          {searchResults && searchResults.total === 0 && (
            <div className="py-8 text-center text-slate-400 text-xs">
              No se encontraron coincidencias para "<span className="text-slate-600 dark:text-slate-200 font-bold">{query}</span>".
            </div>
          )}

          {/* Results: Quality Records */}
          {searchResults && searchResults.records.length > 0 && (
            <div>
              <div className="text-[10px] font-black uppercase text-slate-400 font-mono mb-1.5 flex items-center gap-1.5">
                <FileSpreadsheet className="w-3.5 h-3.5 text-blue-600" />
                Registros de Calidad ({searchResults.records.length})
              </div>
              <div className="space-y-1">
                {searchResults.records.map(r => (
                  <div
                    key={r.id}
                    onClick={() => {
                      if (onSelectRecord) onSelectRecord(r);
                      onNavigateToTab('registro');
                      onClose();
                    }}
                    className="p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 hover:bg-blue-50/50 dark:hover:bg-slate-800 transition-all cursor-pointer flex items-center justify-between text-xs"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-black text-blue-600 dark:text-cyan-400">{r.id}</span>
                        <span className="text-slate-900 dark:text-white font-bold">{r.area} • {r.traceability}</span>
                        <span className="text-[10px] px-1.5 py-0.2 rounded font-mono bg-slate-100 dark:bg-slate-800">{r.processedKg} kg</span>
                      </div>
                      <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                        Contaminación: {r.contaminationKg} kg ({r.contaminationPercent.toFixed(2)}%) • Causa: {r.cause} • {r.disposition}
                      </div>
                    </div>
                    <ArrowRight className="w-4 h-4 text-slate-400 shrink-0" />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Results: No Conformidades */}
          {searchResults && searchResults.ncs.length > 0 && (
            <div>
              <div className="text-[10px] font-black uppercase text-slate-400 font-mono mb-1.5 flex items-center gap-1.5">
                <AlertOctagon className="w-3.5 h-3.5 text-rose-500" />
                No Conformidades ({searchResults.ncs.length})
              </div>
              <div className="space-y-1">
                {searchResults.ncs.map(nc => (
                  <div
                    key={nc.id}
                    onClick={() => {
                      if (onSelectCapa) onSelectCapa(nc);
                      onNavigateToTab('ncs');
                      onClose();
                    }}
                    className="p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 hover:bg-rose-50/40 dark:hover:bg-slate-800 transition-all cursor-pointer flex items-center justify-between text-xs"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-black text-rose-600">{nc.code}</span>
                        <span className="text-slate-900 dark:text-white font-bold">{nc.title}</span>
                        <span className={`text-[10px] px-1.5 py-0.2 rounded font-mono font-bold ${
                          nc.status === 'Vencida' ? 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300' : 'bg-amber-100 text-amber-800'
                        }`}>{nc.status}</span>
                      </div>
                      <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                        Área: {nc.area} • Lote: {nc.lotCode} • Responsable: {nc.responsibleName}
                      </div>
                    </div>
                    <ArrowRight className="w-4 h-4 text-slate-400 shrink-0" />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Results: Corrective Actions */}
          {searchResults && searchResults.actions.length > 0 && (
            <div>
              <div className="text-[10px] font-black uppercase text-slate-400 font-mono mb-1.5 flex items-center gap-1.5">
                <CheckSquare className="w-3.5 h-3.5 text-emerald-600" />
                Acciones Correctivas ({searchResults.actions.length})
              </div>
              <div className="space-y-1">
                {searchResults.actions.map(ac => (
                  <div
                    key={ac.id}
                    onClick={() => {
                      onNavigateToTab('acciones');
                      onClose();
                    }}
                    className="p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 hover:bg-emerald-50/40 dark:hover:bg-slate-800 transition-all cursor-pointer flex items-center justify-between text-xs"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-black text-emerald-600">{ac.id}</span>
                        <span className="text-slate-900 dark:text-white font-bold truncate max-w-sm">{ac.description}</span>
                        <span className="text-[10px] px-1.5 py-0.2 rounded font-mono bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300">{ac.status}</span>
                      </div>
                      <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                        NC Asociada: {ac.ncId} • Responsable: {ac.responsibleName} • Compromiso: {ac.commitmentDate}
                      </div>
                    </div>
                    <ArrowRight className="w-4 h-4 text-slate-400 shrink-0" />
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-3 bg-slate-50 dark:bg-slate-800/50 border-t border-slate-200 dark:border-slate-800 flex justify-between items-center text-[11px] text-slate-500">
          <span>Pulsa sobre cualquier resultado para ir directamente al módulo</span>
          <button
            onClick={onClose}
            className="px-3 py-1 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 font-bold hover:bg-slate-100"
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
}
