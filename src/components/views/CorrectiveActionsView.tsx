import React, { useState } from 'react';
import { 
  CheckSquare, 
  Plus, 
  Search, 
  Filter, 
  Calendar as CalendarIcon, 
  Clock, 
  CheckCircle2, 
  AlertTriangle, 
  User, 
  Award, 
  ArrowRight,
  TrendingUp,
  Percent
} from 'lucide-react';
import { CorrectiveActionItem, ActiveTab, ActionStatus } from '../../types';

interface CorrectiveActionsViewProps {
  correctiveActions: CorrectiveActionItem[];
  onAddAction: (action: CorrectiveActionItem) => void;
  onUpdateAction: (action: CorrectiveActionItem) => void;
  onNavigateToTab: (tab: ActiveTab) => void;
  isDarkTheme?: boolean;
}

export default function CorrectiveActionsView({
  correctiveActions,
  onAddAction,
  onUpdateAction,
  onNavigateToTab,
  isDarkTheme = false
}: CorrectiveActionsViewProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<string>('TODOS');
  const [selectedArea, setSelectedArea] = useState<string>('TODAS');
  const [selectedDateFilter, setSelectedDateFilter] = useState<string | null>(null);
  const [isNewModalOpen, setIsNewModalOpen] = useState(false);

  // Stats
  const total = correctiveActions.length;
  const pending = correctiveActions.filter(a => a.status === 'Pendiente').length;
  const inProgress = correctiveActions.filter(a => a.status === 'En proceso').length;
  const closed = correctiveActions.filter(a => a.status === 'Cerrada').length;
  const expired = correctiveActions.filter(a => a.status === 'Vencida').length;
  const closeRate = total > 0 ? Math.round((closed / total) * 100) : 0;

  const filteredActions = correctiveActions.filter(a => {
    const matchesSearch = 
      a.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      a.ncId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      a.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      a.responsibleName.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = selectedStatus === 'TODOS' || a.status === selectedStatus;
    const matchesArea = selectedArea === 'TODAS' || a.area === selectedArea;
    const matchesDate = !selectedDateFilter || a.commitmentDate === selectedDateFilter;

    return matchesSearch && matchesStatus && matchesArea && matchesDate;
  });

  // Mini Calendar dates generator for September 2026 (#20)
  const daysInSeptember = Array.from({ length: 30 }, (_, i) => {
    const dayNum = i + 1;
    const dateStr = `2026-09-${String(dayNum).padStart(2, '0')}`;
    const dayActions = correctiveActions.filter(a => a.commitmentDate === dateStr);
    return { day: dayNum, dateStr, actions: dayActions };
  });

  // New action form state
  const [newForm, setNewForm] = useState<Partial<CorrectiveActionItem>>({
    ncId: 'NC-2026-004',
    description: 'Instalar sistema de doble malla de cribado en línea de corte.',
    responsibleName: 'Carlos Mendoza',
    area: 'Corte',
    commitmentDate: '2026-09-22',
    status: 'En proceso',
    progressPercent: 30
  });

  const handleCreateAction = (e: React.FormEvent) => {
    e.preventDefault();
    const nextNum = correctiveActions.length + 1;
    const autoId = `CAPA-AC-${String(nextNum).padStart(3, '0')}`;

    const newAction: CorrectiveActionItem = {
      id: autoId,
      ncId: newForm.ncId || 'NC-2026-001',
      description: newForm.description || '',
      responsibleName: newForm.responsibleName || 'Carlos Mendoza',
      responsibleRole: 'Especialista de Calidad',
      area: newForm.area || 'Corte',
      startDate: '2026-09-09',
      commitmentDate: newForm.commitmentDate || '2026-09-22',
      status: (newForm.status as ActionStatus) || 'En proceso',
      progressPercent: newForm.progressPercent || 20
    };

    onAddAction(newAction);
    setIsNewModalOpen(false);
  };

  const handleUpdateProgress = (action: CorrectiveActionItem, newProgress: number) => {
    const updated: CorrectiveActionItem = {
      ...action,
      progressPercent: newProgress,
      status: newProgress === 100 ? 'Cerrada' : 'En proceso',
      closeDate: newProgress === 100 ? '2026-09-09' : undefined,
      closedDate: newProgress === 100 ? '2026-09-09' : undefined,
      efficacyVerification: newProgress === 100 ? '100% verificado en auditoría de planta' : undefined
    };
    onUpdateAction(updated);
  };

  return (
    <div className="space-y-6 pb-12 animate-fadeIn">
      {/* 6 KPIs de Acciones Correctivas (#33) */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        <div className={`p-4 rounded-2xl border ${isDarkTheme ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200 shadow-2xs'}`}>
          <span className="text-[11px] font-bold text-slate-500">Total Acciones</span>
          <div className="mt-1 text-2xl font-black font-mono text-slate-900 dark:text-white">
            {total}
          </div>
          <p className="text-[10px] text-slate-400 mt-0.5">Planes CAPA emitidos</p>
        </div>

        <div className={`p-4 rounded-2xl border ${isDarkTheme ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200 shadow-2xs'}`}>
          <span className="text-[11px] font-bold text-slate-500">Pendientes</span>
          <div className="mt-1 text-2xl font-black font-mono text-amber-600">
            {pending}
          </div>
          <p className="text-[10px] text-slate-400 mt-0.5">Por iniciar</p>
        </div>

        <div className={`p-4 rounded-2xl border ${isDarkTheme ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200 shadow-2xs'}`}>
          <span className="text-[11px] font-bold text-slate-500">En Proceso</span>
          <div className="mt-1 text-2xl font-black font-mono text-blue-600">
            {inProgress}
          </div>
          <p className="text-[10px] text-slate-400 mt-0.5">En ejecución activa</p>
        </div>

        <div className={`p-4 rounded-2xl border ${isDarkTheme ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200 shadow-2xs'}`}>
          <span className="text-[11px] font-bold text-slate-500">Vencidas</span>
          <div className="mt-1 text-2xl font-black font-mono text-rose-600">
            {expired}
          </div>
          <p className="text-[10px] text-rose-600 font-bold mt-0.5">Fuera de plazo</p>
        </div>

        <div className={`p-4 rounded-2xl border ${isDarkTheme ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200 shadow-2xs'}`}>
          <span className="text-[11px] font-bold text-slate-500">% Cumplimiento</span>
          <div className="mt-1 text-2xl font-black font-mono text-emerald-600">
            {closeRate}%
          </div>
          <p className="text-[10px] text-emerald-600 font-bold mt-0.5">{closed} cerradas</p>
        </div>

        <div className={`p-4 rounded-2xl border ${isDarkTheme ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200 shadow-2xs'}`}>
          <span className="text-[11px] font-bold text-slate-500">Eficacia CAPA</span>
          <div className="mt-1 text-2xl font-black font-mono text-purple-600">
            94%
          </div>
          <p className="text-[10px] text-slate-400 mt-0.5">Meta: ≥ 90%</p>
        </div>
      </div>

      {/* Calendario Visual Interactivo de Compromisos (#20) */}
      <div className={`p-5 rounded-2xl border ${isDarkTheme ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200 shadow-xs'}`}>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
          <div>
            <div className="flex items-center gap-2">
              <CalendarIcon className="w-4 h-4 text-blue-600" />
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                Calendario Visual de Compromisos SLA — Septiembre 2026
              </h3>
            </div>
            <p className="text-xs text-slate-500">
              Haz clic en cualquier día para filtrar las acciones correctivas con fecha de entrega programada
            </p>
          </div>

          {selectedDateFilter && (
            <button
              onClick={() => setSelectedDateFilter(null)}
              className="text-xs font-bold text-rose-600 hover:underline flex items-center gap-1"
            >
              <span>Limpiar filtro de fecha ({selectedDateFilter})</span>
            </button>
          )}
        </div>

        {/* Days Grid */}
        <div className="grid grid-cols-7 sm:grid-cols-10 md:grid-cols-15 gap-1.5">
          {daysInSeptember.map((d) => {
            const hasActions = d.actions.length > 0;
            const hasExpired = d.actions.some(a => a.status === 'Vencida');
            const hasClosed = d.actions.some(a => a.status === 'Cerrada');
            const isSelected = selectedDateFilter === d.dateStr;

            return (
              <button
                key={d.day}
                onClick={() => setSelectedDateFilter(isSelected ? null : d.dateStr)}
                className={`p-2 rounded-xl text-center flex flex-col items-center justify-center transition-all cursor-pointer border ${
                  isSelected 
                    ? 'ring-2 ring-blue-500 border-blue-500 bg-blue-50 dark:bg-blue-950 font-bold'
                    : hasExpired
                      ? 'border-rose-300 dark:border-rose-900 bg-rose-50/60 dark:bg-rose-950/30'
                      : hasActions
                        ? 'border-blue-200 dark:border-blue-900 bg-blue-50/40 dark:bg-blue-950/20'
                        : 'border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30 text-slate-400 hover:bg-slate-100'
                }`}
                title={`${d.day} Setiembre • ${d.actions.length} acciones`}
              >
                <span className="text-xs font-mono font-bold">{d.day}</span>
                <div className="flex gap-0.5 mt-1">
                  {hasExpired && <span className="w-1.5 h-1.5 rounded-full bg-rose-600" />}
                  {hasClosed && <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />}
                  {hasActions && !hasExpired && !hasClosed && <span className="w-1.5 h-1.5 rounded-full bg-blue-500" />}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Toolbar */}
      <div className={`p-4 rounded-2xl border flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 ${
        isDarkTheme ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200 shadow-xs'
      }`}>
        <div className="flex-1 flex flex-col sm:flex-row items-center gap-2">
          <div className="relative w-full sm:w-72">
            <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Buscar acción, NC, descripción, responsable..."
              className="w-full pl-9 pr-3 py-1.5 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 focus:outline-hidden"
            />
          </div>

          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="w-full sm:w-auto px-3 py-1.5 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 font-bold"
          >
            <option value="TODOS">Todos los Estados</option>
            <option value="Pendiente">Pendiente</option>
            <option value="En proceso">En proceso</option>
            <option value="Cerrada">Cerrada</option>
            <option value="Vencida">Vencida</option>
          </select>

          <select
            value={selectedArea}
            onChange={(e) => setSelectedArea(e.target.value)}
            className="w-full sm:w-auto px-3 py-1.5 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 font-bold"
          >
            <option value="TODAS">Todas las Áreas</option>
            {['Corte', 'Lavado', 'Tendido', 'Secado', 'Recogido', 'Empaque'].map(a => (
              <option key={a} value={a}>{a}</option>
            ))}
          </select>
        </div>

        <button
          onClick={() => setIsNewModalOpen(true)}
          className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-md shadow-blue-600/20 cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Nueva Acción Correctiva</span>
        </button>
      </div>

      {/* Main Table */}
      <div className={`rounded-2xl border overflow-hidden ${isDarkTheme ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200 shadow-xs'}`}>
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className={`text-[10px] font-mono font-bold uppercase border-b ${
              isDarkTheme ? 'bg-slate-800 text-slate-400 border-slate-800' : 'bg-slate-50 text-slate-500 border-slate-200'
            }`}>
              <tr>
                <th className="py-3 px-4">ID Acción</th>
                <th className="py-3 px-3">NC Vinculada</th>
                <th className="py-3 px-3">Área</th>
                <th className="py-3 px-3">Descripción del Plan de Mejora</th>
                <th className="py-3 px-3">Responsable</th>
                <th className="py-3 px-3">Fecha Compromiso</th>
                <th className="py-3 px-3">Progreso (%)</th>
                <th className="py-3 px-3">Estado</th>
                <th className="py-3 px-4 text-center">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {filteredActions.map((act) => {
                const isExpired = act.status === 'Vencida';
                const isClosed = act.status === 'Cerrada';

                return (
                  <tr key={act.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40">
                    <td className="py-3 px-4 font-mono font-bold text-blue-600 dark:text-cyan-400">
                      {act.id}
                    </td>
                    <td className="py-3 px-3">
                      <button
                        onClick={() => onNavigateToTab('ncs')}
                        className="font-mono text-rose-600 font-bold hover:underline"
                      >
                        {act.ncId}
                      </button>
                    </td>
                    <td className="py-3 px-3 font-bold">{act.area}</td>
                    <td className="py-3 px-3 max-w-sm truncate text-slate-800 dark:text-slate-200" title={act.description}>
                      {act.description}
                    </td>
                    <td className="py-3 px-3 truncate max-w-[120px]">{act.responsibleName}</td>
                    <td className="py-3 px-3 font-mono whitespace-nowrap">{act.commitmentDate}</td>
                    <td className="py-3 px-3 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <div className="w-16 h-2 rounded-full bg-slate-200 dark:bg-slate-700 overflow-hidden">
                          <div
                            style={{ width: `${act.progressPercent}%` }}
                            className={`h-full rounded-full ${isClosed ? 'bg-emerald-500' : isExpired ? 'bg-rose-500' : 'bg-blue-600'}`}
                          />
                        </div>
                        <span className="font-mono font-bold text-[11px]">{act.progressPercent}%</span>
                      </div>
                    </td>
                    <td className="py-3 px-3 whitespace-nowrap">
                      <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-full ${
                        isExpired ? 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300' :
                        isClosed ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300' :
                        'bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300'
                      }`}>
                        {act.status}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-center">
                      <div className="flex items-center justify-center gap-1">
                        {!isClosed && (
                          <button
                            onClick={() => handleUpdateProgress(act, 100)}
                            className="px-2 py-1 rounded bg-emerald-50 text-emerald-700 hover:bg-emerald-100 font-bold text-[10px] cursor-pointer"
                            title="Completar y verificar al 100%"
                          >
                            Cerrar 100%
                          </button>
                        )}
                        <button
                          onClick={() => {
                            const prog = prompt(`Nuevo % de avance para ${act.id} (actual: ${act.progressPercent}%):`, String(act.progressPercent));
                            if (prog !== null) {
                              const pNum = Math.max(0, Math.min(100, Number(prog) || 0));
                              handleUpdateProgress(act, pNum);
                            }
                          }}
                          className="px-2 py-1 rounded bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 font-bold text-[10px] cursor-pointer"
                        >
                          Progreso
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* New Action Modal */}
      {isNewModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fadeIn">
          <div className={`w-full max-w-xl rounded-2xl border shadow-2xl p-6 ${
            isDarkTheme ? 'bg-slate-900 border-slate-700 text-white' : 'bg-white border-slate-200 text-slate-900'
          }`}>
            <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800">
              <h3 className="text-sm font-bold">Emitir Acción Correctiva (CAPA)</h3>
              <button onClick={() => setIsNewModalOpen(false)} className="text-slate-400">✕</button>
            </div>

            <form onSubmit={handleCreateAction} className="py-4 space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-600 block mb-1">NC Asociada</label>
                  <input
                    type="text"
                    value={newForm.ncId}
                    onChange={(e) => setNewForm({ ...newForm, ncId: e.target.value })}
                    className="w-full p-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 font-mono"
                    required
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-600 block mb-1">Área de Implementación</label>
                  <select
                    value={newForm.area}
                    onChange={(e) => setNewForm({ ...newForm, area: e.target.value })}
                    className="w-full p-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800"
                  >
                    {['Corte', 'Lavado', 'Tendido', 'Secado', 'Recogido', 'Empaque'].map(a => (
                      <option key={a} value={a}>{a}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-600 block mb-1">Descripción del Plan Correctivo</label>
                <textarea
                  rows={2}
                  value={newForm.description}
                  onChange={(e) => setNewForm({ ...newForm, description: e.target.value })}
                  className="w-full p-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-600 block mb-1">Responsable</label>
                  <input
                    type="text"
                    value={newForm.responsibleName}
                    onChange={(e) => setNewForm({ ...newForm, responsibleName: e.target.value })}
                    className="w-full p-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800"
                    required
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-600 block mb-1">Fecha Compromiso SLA</label>
                  <input
                    type="date"
                    value={newForm.commitmentDate}
                    onChange={(e) => setNewForm({ ...newForm, commitmentDate: e.target.value })}
                    className="w-full p-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800"
                    required
                  />
                </div>
              </div>

              <div className="pt-3 border-t border-slate-200 dark:border-slate-800 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsNewModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-slate-300 dark:border-slate-700 font-bold"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-blue-600 text-white font-bold"
                >
                  Guardar Acción
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
