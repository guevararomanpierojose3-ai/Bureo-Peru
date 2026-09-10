import React, { useState } from 'react';
import { 
  AlertOctagon, 
  Plus, 
  Search, 
  Filter, 
  CheckCircle2, 
  Clock, 
  AlertTriangle, 
  Calendar, 
  User, 
  FileCheck, 
  CheckSquare, 
  ArrowRight,
  ShieldAlert
} from 'lucide-react';
import { CapaCase, ActiveTab, SeverityLevel, RiskLevel, CapaStatus } from '../../types';

interface NcViewProps {
  capaCases: CapaCase[];
  onAddCapa: (capa: CapaCase) => void;
  onUpdateCapa: (capa: CapaCase) => void;
  onNavigateToTab: (tab: ActiveTab) => void;
  isDarkTheme?: boolean;
}

export default function NcView({
  capaCases,
  onAddCapa,
  onUpdateCapa,
  onNavigateToTab,
  isDarkTheme = false
}: NcViewProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<string>('TODOS');
  const [selectedArea, setSelectedArea] = useState<string>('TODAS');
  const [isNewModalOpen, setIsNewModalOpen] = useState(false);
  const [selectedNcForDetail, setSelectedNcForDetail] = useState<CapaCase | null>(null);

  // Stats
  const openCount = capaCases.filter(c => c.status === 'Abierta').length;
  const inProgressCount = capaCases.filter(c => c.status === 'En proceso').length;
  const verificationCount = capaCases.filter(c => c.status === 'Pendiente de verificación').length;
  const closedCount = capaCases.filter(c => c.status === 'Cerrada').length;
  const expiredCount = capaCases.filter(c => c.status === 'Vencida').length;

  const filteredCases = capaCases.filter(c => {
    const matchesSearch = 
      c.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.lotCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.responsibleName.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = selectedStatus === 'TODOS' || c.status === selectedStatus;
    const matchesArea = selectedArea === 'TODAS' || c.area === selectedArea;

    return matchesSearch && matchesStatus && matchesArea;
  });

  // Form for new NC
  const [newForm, setNewForm] = useState<Partial<CapaCase>>({
    title: 'Desviación en granulometría y mallas de corte',
    area: 'Corte',
    lotCode: 'Austral',
    description: 'Se identificó merma excesiva de cabos sintéticos superando el umbral de 1.5%.',
    cause: 'Mezcla de material',
    severity: 'Mayor',
    risk: 'Riesgo alto',
    responsibleName: 'Carlos Mendoza',
    commitmentDate: '2026-09-20',
    status: 'Abierta',
    immediateAction: 'Detención de tolva de alimentación y purga manual.'
  });

  const handleCreateNc = (e: React.FormEvent) => {
    e.preventDefault();
    const nextNum = capaCases.length + 1;
    const autoCode = `NC-2026-${String(nextNum).padStart(3, '0')}`;

    const newNc: CapaCase = {
      id: `case-${Date.now()}`,
      code: autoCode,
      date: '2026-09-09',
      detectedDate: '2026-09-09',
      title: newForm.title || 'Desviación de calidad',
      area: newForm.area || 'Corte',
      lotCode: newForm.lotCode || 'Austral',
      description: newForm.description || '',
      cause: newForm.cause || 'Mezcla de material',
      severity: (newForm.severity as SeverityLevel) || 'Mayor',
      risk: (newForm.risk as RiskLevel) || 'Riesgo alto',
      riskScore: 4,
      responsibleName: newForm.responsibleName || 'Carlos Mendoza',
      responsibleRole: 'Supervisor de Calidad',
      commitmentDate: newForm.commitmentDate || '2026-09-20',
      status: (newForm.status as CapaStatus) || 'Abierta',
      immediateAction: newForm.immediateAction
    };

    onAddCapa(newNc);
    setIsNewModalOpen(false);
  };

  const handleCloseNc = (nc: CapaCase) => {
    const updated: CapaCase = {
      ...nc,
      status: 'Cerrada',
      closeDate: '2026-09-09',
      closedDate: '2026-09-09',
      efficacyPercentage: 100,
      closedBy: 'Marcos Salinas'
    };
    onUpdateCapa(updated);
    setSelectedNcForDetail(null);
  };

  return (
    <div className="space-y-6 pb-12 animate-fadeIn">
      {/* 6 KPIs de No Conformidades (#31) */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        <div className={`p-4 rounded-2xl border ${isDarkTheme ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200 shadow-2xs'}`}>
          <span className="text-[11px] font-bold text-slate-500">NC Totales</span>
          <div className="mt-1 text-2xl font-black font-mono text-slate-900 dark:text-white">
            {capaCases.length}
          </div>
          <p className="text-[10px] text-slate-400 mt-0.5">Ciclo anual 2026</p>
        </div>

        <div className={`p-4 rounded-2xl border ${isDarkTheme ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200 shadow-2xs'}`}>
          <span className="text-[11px] font-bold text-slate-500">Abiertas</span>
          <div className="mt-1 text-2xl font-black font-mono text-amber-600">
            {openCount}
          </div>
          <p className="text-[10px] text-slate-400 mt-0.5">Recién creadas</p>
        </div>

        <div className={`p-4 rounded-2xl border ${isDarkTheme ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200 shadow-2xs'}`}>
          <span className="text-[11px] font-bold text-slate-500">En Proceso</span>
          <div className="mt-1 text-2xl font-black font-mono text-blue-600">
            {inProgressCount}
          </div>
          <p className="text-[10px] text-slate-400 mt-0.5">Con plan activo</p>
        </div>

        <div className={`p-4 rounded-2xl border ${isDarkTheme ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200 shadow-2xs'}`}>
          <span className="text-[11px] font-bold text-slate-500">Pend. Verif.</span>
          <div className="mt-1 text-2xl font-black font-mono text-purple-600">
            {verificationCount}
          </div>
          <p className="text-[10px] text-slate-400 mt-0.5">En prueba de eficacia</p>
        </div>

        <div className={`p-4 rounded-2xl border ${isDarkTheme ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200 shadow-2xs'}`}>
          <span className="text-[11px] font-bold text-slate-500">Cerradas</span>
          <div className="mt-1 text-2xl font-black font-mono text-emerald-600">
            {closedCount}
          </div>
          <p className="text-[10px] text-emerald-600 font-bold mt-0.5">Eficacia probada</p>
        </div>

        <div className={`p-4 rounded-2xl border ${isDarkTheme ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200 shadow-2xs'}`}>
          <span className="text-[11px] font-bold text-slate-500">Vencidas</span>
          <div className="mt-1 text-2xl font-black font-mono text-rose-600">
            {expiredCount}
          </div>
          <p className="text-[10px] text-rose-600 font-bold mt-0.5">Fuera de plazo SLA</p>
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
              placeholder="Buscar por código NC, título, lote, responsable..."
              className="w-full pl-9 pr-3 py-1.5 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 focus:outline-hidden"
            />
          </div>

          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="w-full sm:w-auto px-3 py-1.5 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 font-bold"
          >
            <option value="TODOS">Todos los Estados</option>
            <option value="Abierta">Abierta</option>
            <option value="En proceso">En proceso</option>
            <option value="Pendiente de verificación">Pendiente de verificación</option>
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
          className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-md shadow-rose-600/20 cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Registrar No Conformidad</span>
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
                <th className="py-3 px-4">Código NC</th>
                <th className="py-3 px-3">Fecha</th>
                <th className="py-3 px-3">Área</th>
                <th className="py-3 px-3">Lote</th>
                <th className="py-3 px-3">Título / Desviación</th>
                <th className="py-3 px-3">Causa</th>
                <th className="py-3 px-3">Severidad</th>
                <th className="py-3 px-3">Responsable</th>
                <th className="py-3 px-3">Compromiso SLA</th>
                <th className="py-3 px-3">Estado</th>
                <th className="py-3 px-4 text-center">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {filteredCases.map((nc) => {
                const isExpired = nc.status === 'Vencida';
                const isClosed = nc.status === 'Cerrada';

                return (
                  <tr key={nc.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40">
                    <td className="py-3 px-4 font-mono font-black text-rose-600">
                      {nc.code}
                    </td>
                    <td className="py-3 px-3 text-slate-500 whitespace-nowrap">
                      {nc.detectedDate || nc.date}
                    </td>
                    <td className="py-3 px-3 font-bold">
                      {nc.area}
                    </td>
                    <td className="py-3 px-3 font-mono text-slate-600 dark:text-slate-300">
                      {nc.lotCode}
                    </td>
                    <td className="py-3 px-3 max-w-[200px] truncate font-bold text-slate-800 dark:text-slate-200" title={nc.title}>
                      {nc.title}
                    </td>
                    <td className="py-3 px-3 text-slate-600 dark:text-slate-400">
                      {nc.cause}
                    </td>
                    <td className="py-3 px-3">
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                        nc.severity === 'Crítica' ? 'bg-rose-100 text-rose-800 dark:bg-rose-950' :
                        nc.severity === 'Mayor' ? 'bg-amber-100 text-amber-800 dark:bg-amber-950' :
                        'bg-slate-100 text-slate-700 dark:bg-slate-800'
                      }`}>
                        {nc.severity}
                      </span>
                    </td>
                    <td className="py-3 px-3 truncate max-w-[120px]">
                      {nc.responsibleName}
                    </td>
                    <td className="py-3 px-3 font-mono whitespace-nowrap">
                      {nc.commitmentDate}
                    </td>
                    <td className="py-3 px-3 whitespace-nowrap">
                      <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-full ${
                        isExpired ? 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300' :
                        isClosed ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300' :
                        'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                      }`}>
                        {nc.status}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-center">
                      <div className="flex items-center justify-center gap-1.5">
                        <button
                          onClick={() => setSelectedNcForDetail(nc)}
                          className="px-2 py-1 rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-100 font-bold text-[11px] cursor-pointer"
                        >
                          Ver Detalle
                        </button>
                        {!isClosed && (
                          <button
                            onClick={() => handleCloseNc(nc)}
                            className="px-2 py-1 rounded-lg bg-emerald-50 text-emerald-700 hover:bg-emerald-100 font-bold text-[11px] cursor-pointer"
                            title="Cerrar NC con verificación de eficacia"
                          >
                            Cerrar
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Detail Modal */}
      {selectedNcForDetail && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fadeIn">
          <div className={`w-full max-w-2xl rounded-2xl border shadow-2xl p-6 ${
            isDarkTheme ? 'bg-slate-900 border-slate-700 text-white' : 'bg-white border-slate-200 text-slate-900'
          }`}>
            <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <span className="font-mono font-black text-rose-600 text-sm">{selectedNcForDetail.code}</span>
                <span className="font-bold text-sm">{selectedNcForDetail.title}</span>
              </div>
              <button onClick={() => setSelectedNcForDetail(null)} className="text-slate-400 hover:text-slate-600">✕</button>
            </div>

            <div className="py-4 space-y-3 text-xs">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                <div><span className="text-slate-400">Área:</span> <strong>{selectedNcForDetail.area}</strong></div>
                <div><span className="text-slate-400">Lote:</span> <strong>{selectedNcForDetail.lotCode}</strong></div>
                <div><span className="text-slate-400">Detección:</span> <strong>{selectedNcForDetail.detectedDate}</strong></div>
                <div><span className="text-slate-400">SLA:</span> <strong>{selectedNcForDetail.commitmentDate}</strong></div>
              </div>

              <div>
                <span className="text-slate-400 block mb-1">Descripción:</span>
                <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800">{selectedNcForDetail.description}</div>
              </div>

              <div>
                <span className="text-slate-400 block mb-1">Acción Inmediata:</span>
                <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800">{selectedNcForDetail.immediateAction || 'Ninguna'}</div>
              </div>

              {selectedNcForDetail.efficiencyVerification && (
                <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300">
                  <strong>Verificación de Eficacia:</strong> {selectedNcForDetail.efficiencyVerification}
                </div>
              )}
            </div>

            <div className="pt-3 border-t border-slate-200 dark:border-slate-800 flex justify-between items-center">
              <button
                onClick={() => onNavigateToTab('acciones')}
                className="text-xs font-bold text-blue-600 hover:underline flex items-center gap-1"
              >
                <span>Ver Acciones Correctivas (CAPA)</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>

              <div className="flex gap-2">
                {selectedNcForDetail.status !== 'Cerrada' && (
                  <button
                    onClick={() => handleCloseNc(selectedNcForDetail)}
                    className="px-4 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs"
                  >
                    Marcar como Cerrada
                  </button>
                )}
                <button
                  onClick={() => setSelectedNcForDetail(null)}
                  className="px-4 py-1.5 rounded-xl bg-slate-200 dark:bg-slate-700 font-bold text-xs"
                >
                  Cerrar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* New NC Modal */}
      {isNewModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fadeIn">
          <div className={`w-full max-w-xl rounded-2xl border shadow-2xl p-6 ${
            isDarkTheme ? 'bg-slate-900 border-slate-700 text-white' : 'bg-white border-slate-200 text-slate-900'
          }`}>
            <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800">
              <h3 className="text-sm font-bold">Registrar No Conformidad (NC)</h3>
              <button onClick={() => setIsNewModalOpen(false)} className="text-slate-400">✕</button>
            </div>

            <form onSubmit={handleCreateNc} className="py-4 space-y-3 text-xs">
              <div>
                <label className="font-bold text-slate-600 block mb-1">Título de la Desviación</label>
                <input
                  type="text"
                  value={newForm.title}
                  onChange={(e) => setNewForm({ ...newForm, title: e.target.value })}
                  className="w-full p-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-600 block mb-1">Área</label>
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

                <div>
                  <label className="font-bold text-slate-600 block mb-1">Lote</label>
                  <input
                    type="text"
                    value={newForm.lotCode}
                    onChange={(e) => setNewForm({ ...newForm, lotCode: e.target.value })}
                    className="w-full p-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-600 block mb-1">Severidad</label>
                  <select
                    value={newForm.severity}
                    onChange={(e) => setNewForm({ ...newForm, severity: e.target.value as SeverityLevel })}
                    className="w-full p-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800"
                  >
                    {['Menor', 'Moderada', 'Mayor', 'Crítica'].map(s => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                </div>

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
              </div>

              <div>
                <label className="font-bold text-slate-600 block mb-1">Descripción del Incidente</label>
                <textarea
                  rows={2}
                  value={newForm.description}
                  onChange={(e) => setNewForm({ ...newForm, description: e.target.value })}
                  className="w-full p-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800"
                />
              </div>

              <div>
                <label className="font-bold text-slate-600 block mb-1">Acción Inmediata Contención</label>
                <input
                  type="text"
                  value={newForm.immediateAction}
                  onChange={(e) => setNewForm({ ...newForm, immediateAction: e.target.value })}
                  className="w-full p-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800"
                />
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
                  className="px-5 py-2 rounded-xl bg-rose-600 text-white font-bold"
                >
                  Guardar No Conformidad
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
