import React, { useState, useMemo } from 'react';
import { 
  Plus, 
  Search, 
  Filter, 
  Download, 
  Eye, 
  Edit3, 
  Trash2, 
  AlertOctagon, 
  FileSpreadsheet, 
  ArrowUpDown, 
  CheckCircle2, 
  AlertTriangle,
  Clock,
  Layers,
  Flame,
  ArrowRight
} from 'lucide-react';
import { QualityRecord, ActiveTab, SeverityLevel, RiskLevel, DispositionType, QualityRecordStatus } from '../../types';

interface QualityRecordsViewProps {
  records: QualityRecord[];
  onAddRecord: (record: QualityRecord) => void;
  onUpdateRecord: (record: QualityRecord) => void;
  onDeleteRecord: (id: string) => void;
  onOpenRecordDetail: (record: QualityRecord) => void;
  onNavigateToTab: (tab: ActiveTab) => void;
  onSelectNcId?: (ncId: string) => void;
  isDarkTheme?: boolean;
}

export default function QualityRecordsView({
  records,
  onAddRecord,
  onUpdateRecord,
  onDeleteRecord,
  onOpenRecordDetail,
  onNavigateToTab,
  onSelectNcId,
  isDarkTheme = false
}: QualityRecordsViewProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedArea, setSelectedArea] = useState<string>('TODAS');
  const [selectedStatus, setSelectedStatus] = useState<string>('TODOS');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  // Stats calculation
  const totalProcessed = records.reduce((sum, r) => sum + r.processedKg, 0);
  const totalContamination = records.reduce((sum, r) => sum + r.contaminationKg, 0);
  const avgContamination = totalProcessed > 0 ? (totalContamination / totalProcessed) * 100 : 0;
  const recordsWithNc = records.filter(r => r.generatesNc).length;

  // Filtered records
  const filteredRecords = useMemo(() => {
    return records.filter(r => {
      const matchesSearch = 
        r.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        r.traceability.toLowerCase().includes(searchTerm.toLowerCase()) ||
        r.supervisor.toLowerCase().includes(searchTerm.toLowerCase()) ||
        r.cause.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (r.ncId && r.ncId.toLowerCase().includes(searchTerm.toLowerCase()));

      const matchesArea = selectedArea === 'TODAS' || r.area === selectedArea;
      const matchesStatus = selectedStatus === 'TODOS' || r.status === selectedStatus;

      return matchesSearch && matchesArea && matchesStatus;
    });
  }, [records, searchTerm, selectedArea, selectedStatus]);

  // Form State for New Record (All 25 fields #24, #25, #26)
  const initialNewRecord: Partial<QualityRecord> = {
    date: '2026-09-09',
    year: 2026,
    month: 'septiembre',
    week: 37,
    area: 'Corte',
    traceability: 'Austral',
    supervisor: 'Marcos Salinas',
    processedKg: 190,
    contaminationType: 'Restos de polipropileno / cabos trenzados',
    contaminationKg: 3.2,
    cause: 'Mezcla de material',
    severity: 'Moderada',
    risk: 'Riesgo medio',
    disposition: 'Reproceso requerido',
    generatesNc: true,
    ncId: `NC-2026-${Math.floor(100 + Math.random() * 900)}`,
    immediateAction: 'Segregación manual de lote y ajuste de cribas.',
    responsible: 'Elena Torres',
    commitmentDate: '2026-09-15',
    status: 'En proceso',
    observations: 'Inspección visual en tolva de corte.'
  };

  const [newForm, setNewForm] = useState<Partial<QualityRecord>>(initialNewRecord);
  const [formError, setFormError] = useState<string | null>(null);

  const handleCreateRecord = (e: React.FormEvent) => {
    e.preventDefault();

    if (!newForm.processedKg || newForm.processedKg <= 0) {
      setFormError('El material procesado debe ser mayor a 0 kg.');
      return;
    }
    if (newForm.contaminationKg === undefined || newForm.contaminationKg < 0) {
      setFormError('La contaminación no puede ser negativa.');
      return;
    }
    if (newForm.contaminationKg > newForm.processedKg) {
      setFormError('La contaminación no puede ser mayor que el material procesado.');
      return;
    }
    if (newForm.generatesNc && (!newForm.ncId || newForm.ncId.trim() === '')) {
      setFormError('Si genera NC, el campo ID NC es obligatorio.');
      return;
    }

    const nextIdNumber = records.length + 1;
    const autoId = `CAL-${String(nextIdNumber).padStart(5, '0')}`;
    const contamPercent = (newForm.contaminationKg / newForm.processedKg) * 100;
    const sharePercent = totalContamination > 0 ? (newForm.contaminationKg / totalContamination) * 100 : 0;

    const recordToSave: QualityRecord = {
      id: autoId,
      date: newForm.date || '2026-09-09',
      year: newForm.year || 2026,
      month: newForm.month || 'septiembre',
      week: newForm.week || 37,
      area: newForm.area || 'Corte',
      traceability: newForm.traceability || 'Austral',
      supervisor: newForm.supervisor || 'Marcos Salinas',
      processedKg: newForm.processedKg,
      contaminationType: newForm.contaminationType || 'Sin defecto',
      contaminationKg: newForm.contaminationKg,
      contaminationPercent: contamPercent,
      sharePercent: sharePercent,
      cause: newForm.cause || 'Mezcla de material',
      severity: (newForm.severity as SeverityLevel) || 'Menor',
      risk: (newForm.risk as RiskLevel) || 'Riesgo bajo',
      disposition: (newForm.disposition as DispositionType) || 'Liberado conforme',
      generatesNc: !!newForm.generatesNc,
      ncId: newForm.generatesNc ? newForm.ncId : undefined,
      immediateAction: newForm.immediateAction,
      responsible: newForm.responsible || 'Marcos Salinas',
      commitmentDate: newForm.commitmentDate || '2026-09-15',
      status: (newForm.status as QualityRecordStatus) || 'En proceso',
      observations: newForm.observations
    };

    onAddRecord(recordToSave);
    setIsCreateModalOpen(false);
    setNewForm(initialNewRecord);
    setFormError(null);
  };

  return (
    <div className="space-y-6 pb-12 animate-fadeIn">
      {/* Top Summary KPI Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className={`p-4 rounded-2xl border transition-all ${
          isDarkTheme ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200 shadow-2xs'
        }`}>
          <div className="flex items-center justify-between text-[11px] font-bold text-slate-500">
            <span>Total Ensayos</span>
            <FileSpreadsheet className="w-4 h-4 text-blue-500" />
          </div>
          <div className="mt-2 text-xl sm:text-2xl font-black font-mono text-slate-900 dark:text-white">
            {records.length}
          </div>
          <p className="text-[10px] text-slate-400 mt-0.5">Registros inspeccionados</p>
        </div>

        <div className={`p-4 rounded-2xl border transition-all ${
          isDarkTheme ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200 shadow-2xs'
        }`}>
          <div className="flex items-center justify-between text-[11px] font-bold text-slate-500">
            <span>Material Procesado</span>
            <Layers className="w-4 h-4 text-emerald-500" />
          </div>
          <div className="mt-2 text-xl sm:text-2xl font-black font-mono text-slate-900 dark:text-white">
            {totalProcessed.toLocaleString()} <span className="text-xs text-slate-400">kg</span>
          </div>
          <p className="text-[10px] text-emerald-600 font-bold mt-0.5">100% Pesado en tara</p>
        </div>

        <div className={`p-4 rounded-2xl border transition-all ${
          isDarkTheme ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200 shadow-2xs'
        }`}>
          <div className="flex items-center justify-between text-[11px] font-bold text-slate-500">
            <span>Contaminación Merma</span>
            <Flame className="w-4 h-4 text-rose-500" />
          </div>
          <div className="mt-2 text-xl sm:text-2xl font-black font-mono text-rose-600 dark:text-rose-400">
            {totalContamination.toFixed(1)} <span className="text-xs text-slate-400">kg</span>
          </div>
          <p className="text-[10px] text-slate-400 mt-0.5">Masa no conforme</p>
        </div>

        <div className={`p-4 rounded-2xl border transition-all ${
          isDarkTheme ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200 shadow-2xs'
        }`}>
          <div className="flex items-center justify-between text-[11px] font-bold text-slate-500">
            <span>% Contaminación Prom.</span>
            <span className="px-1.5 py-0.2 rounded text-[9px] font-mono bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 font-bold">
              Meta ≤ 1.5%
            </span>
          </div>
          <div className="mt-2 text-xl sm:text-2xl font-black font-mono text-slate-900 dark:text-white">
            {avgContamination.toFixed(2)}%
          </div>
          <p className="text-[10px] text-rose-600 font-bold mt-0.5">{recordsWithNc} generan NC</p>
        </div>
      </div>

      {/* Control Toolbar: Search, Filters & Add Record Button */}
      <div className={`p-4 rounded-2xl border flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 ${
        isDarkTheme ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200 shadow-xs'
      }`}>
        <div className="flex-1 flex flex-col sm:flex-row items-center gap-2">
          {/* Search */}
          <div className="relative w-full sm:w-72">
            <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Buscar por ID, lote, supervisor, causa..."
              className="w-full pl-9 pr-3 py-1.5 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 focus:outline-hidden focus:ring-2 focus:ring-blue-500 font-sans"
            />
          </div>

          {/* Filter Area */}
          <select
            value={selectedArea}
            onChange={(e) => setSelectedArea(e.target.value)}
            className="w-full sm:w-auto px-3 py-1.5 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 font-bold text-slate-700 dark:text-slate-300"
          >
            <option value="TODAS">Todas las Áreas</option>
            {['Corte', 'Lavado', 'Tendido', 'Secado', 'Recogido', 'Empaque'].map(a => (
              <option key={a} value={a}>{a}</option>
            ))}
          </select>

          {/* Filter Status */}
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="w-full sm:w-auto px-3 py-1.5 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 font-bold text-slate-700 dark:text-slate-300"
          >
            <option value="TODOS">Todos los Estados</option>
            <option value="Abierta">Abierta</option>
            <option value="En proceso">En proceso</option>
            <option value="Cerrada">Cerrada</option>
            <option value="Vencida">Vencida</option>
          </select>
        </div>

        {/* Add Record Primary Button */}
        <button
          onClick={() => setIsCreateModalOpen(true)}
          className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-md shadow-blue-600/20 transition-all cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Nuevo Registro de Calidad</span>
        </button>
      </div>

      {/* Main Records Table (#27) */}
      <div className={`rounded-2xl border overflow-hidden ${
        isDarkTheme ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200 shadow-xs'
      }`}>
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className={`text-[10px] font-mono font-bold uppercase border-b ${
              isDarkTheme ? 'bg-slate-800/80 border-slate-800 text-slate-400' : 'bg-slate-50 border-slate-200 text-slate-500'
            }`}>
              <tr>
                <th className="py-3 px-4">ID Registro</th>
                <th className="py-3 px-3">Fecha</th>
                <th className="py-3 px-3">Área</th>
                <th className="py-3 px-3">Trazabilidad</th>
                <th className="py-3 px-3">Supervisor</th>
                <th className="py-3 px-3 text-right">Procesado (kg)</th>
                <th className="py-3 px-3 text-right">Contam. (kg)</th>
                <th className="py-3 px-3 text-right">% Contam.</th>
                <th className="py-3 px-3">Causa Detectada</th>
                <th className="py-3 px-3">Severidad / Riesgo</th>
                <th className="py-3 px-3">Disposición</th>
                <th className="py-3 px-3 text-center">NC</th>
                <th className="py-3 px-3">Estado</th>
                <th className="py-3 px-4 text-center">Acciones</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {filteredRecords.map((r) => {
                const isOverLimit = r.contaminationPercent > 1.5;

                return (
                  <tr 
                    key={r.id} 
                    className="hover:bg-blue-50/30 dark:hover:bg-slate-800/60 transition-colors"
                  >
                    <td className="py-3 px-4 font-mono font-bold text-blue-600 dark:text-cyan-400">
                      {r.id}
                    </td>
                    <td className="py-3 px-3 text-slate-600 dark:text-slate-400 whitespace-nowrap">
                      {r.date}
                    </td>
                    <td className="py-3 px-3 font-bold text-slate-800 dark:text-slate-200">
                      {r.area}
                    </td>
                    <td className="py-3 px-3 font-mono text-slate-600 dark:text-slate-300">
                      {r.traceability}
                    </td>
                    <td className="py-3 px-3 text-slate-600 dark:text-slate-400 truncate max-w-[120px]">
                      {r.supervisor}
                    </td>
                    <td className="py-3 px-3 text-right font-mono font-bold text-slate-800 dark:text-slate-200">
                      {r.processedKg.toLocaleString()}
                    </td>
                    <td className="py-3 px-3 text-right font-mono font-bold text-rose-600 dark:text-rose-400">
                      {r.contaminationKg.toFixed(1)}
                    </td>
                    <td className="py-3 px-3 text-right font-mono">
                      <span className={`px-1.5 py-0.5 rounded font-bold ${
                        isOverLimit ? 'bg-rose-100 text-rose-700 dark:bg-rose-950 dark:text-rose-300' : 'text-emerald-600'
                      }`}>
                        {r.contaminationPercent.toFixed(2)}%
                      </span>
                    </td>
                    <td className="py-3 px-3 text-slate-700 dark:text-slate-300 max-w-[140px] truncate" title={r.cause}>
                      {r.cause}
                    </td>
                    <td className="py-3 px-3 whitespace-nowrap">
                      <span className={`text-[10px] font-bold px-1.5 py-0.2 rounded ${
                        r.severity === 'Crítica' ? 'bg-rose-100 text-rose-800 dark:bg-rose-950' :
                        r.severity === 'Mayor' ? 'bg-amber-100 text-amber-800 dark:bg-amber-950' :
                        'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300'
                      }`}>
                        {r.severity}
                      </span>
                    </td>
                    <td className="py-3 px-3 text-[11px] text-slate-600 dark:text-slate-400 whitespace-nowrap">
                      {r.disposition}
                    </td>
                    <td className="py-3 px-3 text-center">
                      {r.generatesNc && r.ncId ? (
                        <button
                          onClick={() => {
                            if (onSelectNcId) onSelectNcId(r.ncId!);
                            onNavigateToTab('ncs');
                          }}
                          className="px-2 py-0.5 rounded-full font-mono text-[10px] font-bold bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300 hover:underline cursor-pointer"
                          title="Ver No Conformidad"
                        >
                          {r.ncId}
                        </button>
                      ) : (
                        <span className="text-slate-400 text-[10px]">No</span>
                      )}
                    </td>
                    <td className="py-3 px-3 whitespace-nowrap">
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full font-mono ${
                        r.status === 'Vencida' ? 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300' :
                        r.status === 'Cerrada' ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300' :
                        'bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300'
                      }`}>
                        {r.status}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-center">
                      <div className="flex items-center justify-center gap-1">
                        <button
                          onClick={() => onOpenRecordDetail(r)}
                          className="p-1.5 rounded-lg text-slate-500 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                          title="Ver y editar los 25 campos completos"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => {
                            if (confirm(`¿Eliminar registro ${r.id}?`)) {
                              onDeleteRecord(r.id);
                            }
                          }}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                          title="Eliminar registro"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Footer info */}
        <div className="p-3 bg-slate-50 dark:bg-slate-800/40 border-t border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-2">
          <span>
            Mostrando <strong>{filteredRecords.length}</strong> de <strong>{records.length}</strong> registros de calidad
          </span>
          <div className="flex items-center gap-2">
            <span className="font-mono text-[11px]">Sincronizado con Google Sheets (Hoja: REGISTROS_CALIDAD)</span>
          </div>
        </div>
      </div>

      {/* Modal: Crear Nuevo Registro (#24, #25, #26) */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fadeIn">
          <div className={`w-full max-w-3xl rounded-2xl border shadow-2xl overflow-hidden flex flex-col max-h-[90vh] ${
            isDarkTheme ? 'bg-slate-900 border-slate-700 text-white' : 'bg-white border-slate-200 text-slate-900'
          }`}>
            <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-blue-50/50 dark:bg-blue-950/20">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-blue-600 text-white">
                  <FileSpreadsheet className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                    Nuevo Registro de Calidad
                  </h3>
                  <p className="text-[11px] text-slate-500">
                    Formulario normativo con cálculo automático de contaminación y generación de NC
                  </p>
                </div>
              </div>

              <button
                onClick={() => setIsCreateModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
              >
                ✕
              </button>
            </div>

            {formError && (
              <div className="p-3 bg-rose-100 text-rose-800 text-xs flex items-center gap-2 border-b border-rose-200">
                <AlertTriangle className="w-4 h-4" />
                <span>{formError}</span>
              </div>
            )}

            <form onSubmit={handleCreateRecord} className="p-5 overflow-y-auto space-y-4 text-xs">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div>
                  <label className="font-bold text-slate-600 dark:text-slate-400 block mb-1">Fecha</label>
                  <input
                    type="date"
                    value={newForm.date}
                    onChange={(e) => setNewForm({ ...newForm, date: e.target.value })}
                    className="w-full p-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800"
                    required
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-600 dark:text-slate-400 block mb-1">Área</label>
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
                  <label className="font-bold text-slate-600 dark:text-slate-400 block mb-1">Trazabilidad</label>
                  <input
                    type="text"
                    value={newForm.traceability}
                    onChange={(e) => setNewForm({ ...newForm, traceability: e.target.value })}
                    className="w-full p-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800"
                    required
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-600 dark:text-slate-400 block mb-1">Supervisor</label>
                  <input
                    type="text"
                    value={newForm.supervisor}
                    onChange={(e) => setNewForm({ ...newForm, supervisor: e.target.value })}
                    className="w-full p-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                <div>
                  <label className="font-bold text-slate-600 dark:text-slate-400 block mb-1">Material Procesado (kg)</label>
                  <input
                    type="number"
                    value={newForm.processedKg}
                    onChange={(e) => setNewForm({ ...newForm, processedKg: Number(e.target.value) })}
                    className="w-full p-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 font-mono font-bold"
                    required
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-600 dark:text-slate-400 block mb-1">Cantidad Contaminación (kg)</label>
                  <input
                    type="number"
                    step="0.1"
                    value={newForm.contaminationKg}
                    onChange={(e) => setNewForm({ ...newForm, contaminationKg: Number(e.target.value) })}
                    className="w-full p-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 font-mono font-bold text-rose-600"
                    required
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-600 dark:text-slate-400 block mb-1">% Contaminación Calculado</label>
                  <div className="p-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-100 dark:bg-slate-800 font-mono font-black text-blue-600 dark:text-cyan-400">
                    {newForm.processedKg && newForm.contaminationKg !== undefined
                      ? ((newForm.contaminationKg / newForm.processedKg) * 100).toFixed(2) + '%'
                      : '0.00%'}
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                <div>
                  <label className="font-bold text-slate-600 dark:text-slate-400 block mb-1">Causa Detectada</label>
                  <select
                    value={newForm.cause}
                    onChange={(e) => setNewForm({ ...newForm, cause: e.target.value })}
                    className="w-full p-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800"
                  >
                    {['Mezcla de material', 'Plástico', 'Mala segregación', 'Selección incorrecta', 'Otros'].map(c => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="font-bold text-slate-600 dark:text-slate-400 block mb-1">Severidad</label>
                  <select
                    value={newForm.severity}
                    onChange={(e) => setNewForm({ ...newForm, severity: e.target.value as SeverityLevel })}
                    className="w-full p-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800"
                  >
                    {['Sin incidencia', 'Menor', 'Moderada', 'Mayor', 'Crítica'].map(s => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="font-bold text-slate-600 dark:text-slate-400 block mb-1">Disposición</label>
                  <select
                    value={newForm.disposition}
                    onChange={(e) => setNewForm({ ...newForm, disposition: e.target.value as DispositionType })}
                    className="w-full p-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800"
                  >
                    {['Liberado conforme', 'Retenido temporal', 'Reproceso requerido', 'Rechazado'].map(d => (
                      <option key={d} value={d}>{d}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Generates NC */}
              <div className="p-3 rounded-xl border border-rose-200 dark:border-rose-900 bg-rose-50/50 dark:bg-rose-950/20 grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="flex items-center gap-2 font-bold text-slate-800 dark:text-slate-200 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={newForm.generatesNc}
                      onChange={(e) => setNewForm({ ...newForm, generatesNc: e.target.checked })}
                      className="rounded text-rose-600"
                    />
                    <span>¿Genera No Conformidad (NC)?</span>
                  </label>
                  <p className="text-[10px] text-slate-500 mt-1">
                    Crea automáticamente un registro de desvío en el módulo de No Conformidades.
                  </p>
                </div>

                {newForm.generatesNc && (
                  <div>
                    <label className="font-bold text-rose-700 dark:text-rose-300 block mb-1">ID NC Obligatorio</label>
                    <input
                      type="text"
                      value={newForm.ncId || ''}
                      onChange={(e) => setNewForm({ ...newForm, ncId: e.target.value })}
                      className="w-full p-2 rounded-lg border border-rose-300 bg-white dark:bg-slate-800 font-mono font-bold text-rose-600"
                      required
                    />
                  </div>
                )}
              </div>

              <div>
                <label className="font-bold text-slate-600 dark:text-slate-400 block mb-1">Acción Inmediata</label>
                <input
                  type="text"
                  value={newForm.immediateAction || ''}
                  onChange={(e) => setNewForm({ ...newForm, immediateAction: e.target.value })}
                  placeholder="ej: Parada de línea, cambio de operario o segregación en tolva..."
                  className="w-full p-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800"
                />
              </div>

              <div className="pt-3 border-t border-slate-200 dark:border-slate-800 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsCreateModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-slate-300 dark:border-slate-700 font-bold"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold flex items-center gap-1.5 shadow-md shadow-blue-600/20"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Guardar y Registrar</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
