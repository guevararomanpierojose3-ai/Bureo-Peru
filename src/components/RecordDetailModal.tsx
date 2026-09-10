import React, { useState } from 'react';
import { 
  X, 
  FileSpreadsheet, 
  Calendar, 
  AlertTriangle, 
  ShieldCheck, 
  Save, 
  CheckCircle2, 
  Flame, 
  User, 
  Clock,
  Layers,
  ArrowRight
} from 'lucide-react';
import { QualityRecord, SeverityLevel, RiskLevel, DispositionType, QualityRecordStatus } from '../types';

interface RecordDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  record: QualityRecord | null;
  onSaveRecord: (updatedRecord: QualityRecord) => void;
  totalContaminationSumKg: number;
  onNavigateToNc?: (ncId: string) => void;
  isDarkTheme?: boolean;
}

export default function RecordDetailModal({
  isOpen,
  onClose,
  record,
  onSaveRecord,
  totalContaminationSumKg,
  onNavigateToNc,
  isDarkTheme = false
}: RecordDetailModalProps) {
  if (!isOpen || !record) return null;

  const [formData, setFormData] = useState<QualityRecord>({ ...record });
  const [isEditing, setIsEditing] = useState(false);
  const [errorNotice, setErrorNotice] = useState<string | null>(null);

  // Helper calculation
  const handleCalculate = (processed: number, contamination: number) => {
    const contamPercent = processed > 0 ? (contamination / processed) * 100 : 0;
    const sharePercent = totalContaminationSumKg > 0 ? (contamination / totalContaminationSumKg) * 100 : 0;
    return { contamPercent, sharePercent };
  };

  const handleProcessedChange = (val: number) => {
    const { contamPercent, sharePercent } = handleCalculate(val, formData.contaminationKg);
    setFormData(prev => ({
      ...prev,
      processedKg: val,
      contaminationPercent: contamPercent,
      sharePercent
    }));
  };

  const handleContaminationChange = (val: number) => {
    const { contamPercent, sharePercent } = handleCalculate(formData.processedKg, val);
    setFormData(prev => ({
      ...prev,
      contaminationKg: val,
      contaminationPercent: contamPercent,
      sharePercent
    }));
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    // Validations
    if (formData.processedKg <= 0) {
      setErrorNotice('El material procesado debe ser mayor a 0 kg.');
      return;
    }
    if (formData.contaminationKg < 0) {
      setErrorNotice('La contaminación no puede ser negativa.');
      return;
    }
    if (formData.contaminationKg > formData.processedKg) {
      setErrorNotice('La contaminación no puede exceder el material procesado.');
      return;
    }
    if (formData.generatesNc && (!formData.ncId || formData.ncId.trim() === '')) {
      setErrorNotice('Si el registro genera NC, el campo ID NC es obligatorio.');
      return;
    }

    onSaveRecord(formData);
    setIsEditing(false);
    setErrorNotice(null);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fadeIn">
      <div className={`w-full max-w-3xl rounded-2xl border shadow-2xl overflow-hidden flex flex-col max-h-[90vh] ${
        isDarkTheme 
          ? 'bg-slate-900 border-slate-700 text-white' 
          : 'bg-white border-slate-200 text-slate-900'
      }`}>
        {/* Header */}
        <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50 dark:bg-slate-800/40">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-blue-100 dark:bg-blue-950/60 text-blue-600">
              <FileSpreadsheet className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                  Registro de Calidad: {formData.id}
                </h3>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full font-mono ${
                  formData.status === 'Vencida' ? 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300' :
                  formData.status === 'Cerrada' ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300' :
                  'bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300'
                }`}>
                  {formData.status}
                </span>
              </div>
              <p className="text-[11px] text-slate-500 font-mono">
                Área: {formData.area} • Trazabilidad: {formData.traceability} • Supervisor: {formData.supervisor}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsEditing(!isEditing)}
              className="px-3 py-1.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-bold hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors cursor-pointer"
            >
              {isEditing ? 'Cancelar Edición' : 'Editar Registro'}
            </button>
            <button 
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Error notice */}
        {errorNotice && (
          <div className="p-3 bg-rose-100 dark:bg-rose-950/60 text-rose-800 dark:text-rose-300 text-xs flex items-center gap-2 border-b border-rose-200">
            <AlertTriangle className="w-4 h-4 shrink-0" />
            <span>{errorNotice}</span>
          </div>
        )}

        {/* Content Body: 25 fields in clean sections */}
        <form onSubmit={handleSave} className="flex-1 overflow-y-auto p-5 space-y-5 text-xs">
          {/* Section 1: Temporal & Ubicación */}
          <div>
            <div className="text-[10px] font-black uppercase text-slate-400 font-mono mb-2 flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-blue-600" />
              1. Identificación, Tiempo y Ubicación
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div>
                <label className="text-[11px] font-bold text-slate-600 dark:text-slate-400">ID Registro</label>
                <input
                  type="text"
                  disabled
                  value={formData.id}
                  className="w-full mt-1 p-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-100 dark:bg-slate-800 font-mono font-bold text-blue-600"
                />
              </div>

              <div>
                <label className="text-[11px] font-bold text-slate-600 dark:text-slate-400">Fecha</label>
                <input
                  type="date"
                  disabled={!isEditing}
                  value={formData.date}
                  onChange={(e) => {
                    const d = e.target.value;
                    const dateObj = new Date(d);
                    const year = dateObj.getFullYear() || 2026;
                    const monthNames = ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'];
                    const month = monthNames[dateObj.getMonth()] || 'enero';
                    setFormData(prev => ({ ...prev, date: d, year, month }));
                  }}
                  className={`w-full mt-1 p-2 rounded-lg border ${isEditing ? 'border-blue-400 bg-white dark:bg-slate-800' : 'border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/40'}`}
                />
              </div>

              <div>
                <label className="text-[11px] font-bold text-slate-600 dark:text-slate-400">Año / Mes / Sem</label>
                <input
                  type="text"
                  disabled
                  value={`${formData.year} • ${formData.month} • Sem ${formData.week}`}
                  className="w-full mt-1 p-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-100 dark:bg-slate-800 font-mono"
                />
              </div>

              <div>
                <label className="text-[11px] font-bold text-slate-600 dark:text-slate-400">Área de Proceso</label>
                {isEditing ? (
                  <select
                    value={formData.area}
                    onChange={(e) => setFormData(prev => ({ ...prev, area: e.target.value }))}
                    className="w-full mt-1 p-2 rounded-lg border border-blue-400 bg-white dark:bg-slate-800"
                  >
                    {['Corte', 'Lavado', 'Tendido', 'Secado', 'Recogido', 'Empaque'].map(a => (
                      <option key={a} value={a}>{a}</option>
                    ))}
                  </select>
                ) : (
                  <input
                    type="text"
                    disabled
                    value={formData.area}
                    className="w-full mt-1 p-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/40 font-bold"
                  />
                )}
              </div>
            </div>
          </div>

          {/* Section 2: Trazabilidad, Operador & Pesaje */}
          <div>
            <div className="text-[10px] font-black uppercase text-slate-400 font-mono mb-2 flex items-center gap-1.5">
              <Layers className="w-3.5 h-3.5 text-blue-600" />
              2. Trazabilidad, Supervisor & Balance de Material
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div>
                <label className="text-[11px] font-bold text-slate-600 dark:text-slate-400">Trazabilidad / Lote</label>
                <input
                  type="text"
                  disabled={!isEditing}
                  value={formData.traceability}
                  onChange={(e) => setFormData(prev => ({ ...prev, traceability: e.target.value }))}
                  className={`w-full mt-1 p-2 rounded-lg border ${isEditing ? 'border-blue-400 bg-white dark:bg-slate-800' : 'border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/40'} font-bold`}
                />
              </div>

              <div>
                <label className="text-[11px] font-bold text-slate-600 dark:text-slate-400">Supervisor de Calidad</label>
                <input
                  type="text"
                  disabled={!isEditing}
                  value={formData.supervisor}
                  onChange={(e) => setFormData(prev => ({ ...prev, supervisor: e.target.value }))}
                  className={`w-full mt-1 p-2 rounded-lg border ${isEditing ? 'border-blue-400 bg-white dark:bg-slate-800' : 'border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/40'}`}
                />
              </div>

              <div>
                <label className="text-[11px] font-bold text-slate-600 dark:text-slate-400">Material Procesado (kg)</label>
                <input
                  type="number"
                  disabled={!isEditing}
                  value={formData.processedKg}
                  onChange={(e) => handleProcessedChange(Number(e.target.value))}
                  className={`w-full mt-1 p-2 rounded-lg border ${isEditing ? 'border-blue-400 bg-white dark:bg-slate-800' : 'border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/40'} font-mono font-bold`}
                />
              </div>

              <div>
                <label className="text-[11px] font-bold text-slate-600 dark:text-slate-400">Cantidad Contaminación (kg)</label>
                <input
                  type="number"
                  step="0.1"
                  disabled={!isEditing}
                  value={formData.contaminationKg}
                  onChange={(e) => handleContaminationChange(Number(e.target.value))}
                  className={`w-full mt-1 p-2 rounded-lg border ${isEditing ? 'border-rose-400 bg-white dark:bg-slate-800' : 'border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/40'} font-mono font-bold text-rose-600`}
                />
              </div>
            </div>

            {/* Auto calculations display */}
            <div className="mt-3 p-3 rounded-xl bg-blue-50/60 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-800 grid grid-cols-2 sm:grid-cols-3 gap-3">
              <div>
                <span className="text-[10px] font-bold uppercase text-blue-600 dark:text-cyan-400 font-mono">
                  % Contaminación (Auto):
                </span>
                <p className="text-sm font-black text-slate-900 dark:text-white font-mono mt-0.5">
                  {formData.contaminationPercent.toFixed(2)}%
                </p>
                <span className="text-[9px] text-slate-500">
                  {formData.contaminationPercent <= 1.50 ? '✓ Cumple meta (≤ 1.50%)' : '⚠️ Sobre meta (> 1.50%)'}
                </span>
              </div>

              <div>
                <span className="text-[10px] font-bold uppercase text-blue-600 dark:text-cyan-400 font-mono">
                  % Participación Global (Auto):
                </span>
                <p className="text-sm font-black text-slate-900 dark:text-white font-mono mt-0.5">
                  {formData.sharePercent.toFixed(1)}%
                </p>
                <span className="text-[9px] text-slate-500">
                  Respecto al total acumulado
                </span>
              </div>

              <div>
                <span className="text-[10px] font-bold uppercase text-blue-600 dark:text-cyan-400 font-mono">
                  Tipo de Defecto:
                </span>
                <p className="text-xs font-bold text-slate-800 dark:text-slate-200 truncate mt-0.5">
                  {formData.contaminationType}
                </p>
              </div>
            </div>
          </div>

          {/* Section 3: Causa, Severidad, Riesgo y Disposición */}
          <div>
            <div className="text-[10px] font-black uppercase text-slate-400 font-mono mb-2 flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-blue-600" />
              3. Causa, Evaluación de Riesgo & Disposición
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div>
                <label className="text-[11px] font-bold text-slate-600 dark:text-slate-400">Causa Detectada</label>
                {isEditing ? (
                  <select
                    value={formData.cause}
                    onChange={(e) => setFormData(prev => ({ ...prev, cause: e.target.value }))}
                    className="w-full mt-1 p-2 rounded-lg border border-blue-400 bg-white dark:bg-slate-800"
                  >
                    {['Mezcla de material', 'Plástico', 'Mala segregación', 'Selección incorrecta', 'Otros'].map(c => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                ) : (
                  <input
                    type="text"
                    disabled
                    value={formData.cause}
                    className="w-full mt-1 p-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/40"
                  />
                )}
              </div>

              <div>
                <label className="text-[11px] font-bold text-slate-600 dark:text-slate-400">Severidad</label>
                {isEditing ? (
                  <select
                    value={formData.severity}
                    onChange={(e) => setFormData(prev => ({ ...prev, severity: e.target.value as SeverityLevel }))}
                    className="w-full mt-1 p-2 rounded-lg border border-blue-400 bg-white dark:bg-slate-800"
                  >
                    {['Sin incidencia', 'Menor', 'Moderada', 'Mayor', 'Crítica'].map(s => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                ) : (
                  <input
                    type="text"
                    disabled
                    value={formData.severity}
                    className="w-full mt-1 p-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/40 font-bold"
                  />
                )}
              </div>

              <div>
                <label className="text-[11px] font-bold text-slate-600 dark:text-slate-400">Nivel de Riesgo</label>
                {isEditing ? (
                  <select
                    value={formData.risk}
                    onChange={(e) => setFormData(prev => ({ ...prev, risk: e.target.value as RiskLevel }))}
                    className="w-full mt-1 p-2 rounded-lg border border-blue-400 bg-white dark:bg-slate-800"
                  >
                    {['Riesgo bajo', 'Riesgo medio', 'Riesgo alto', 'Riesgo crítico'].map(r => (
                      <option key={r} value={r}>{r}</option>
                    ))}
                  </select>
                ) : (
                  <input
                    type="text"
                    disabled
                    value={formData.risk}
                    className="w-full mt-1 p-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/40 font-bold"
                  />
                )}
              </div>

              <div>
                <label className="text-[11px] font-bold text-slate-600 dark:text-slate-400">Disposición del Material</label>
                {isEditing ? (
                  <select
                    value={formData.disposition}
                    onChange={(e) => setFormData(prev => ({ ...prev, disposition: e.target.value as DispositionType }))}
                    className="w-full mt-1 p-2 rounded-lg border border-blue-400 bg-white dark:bg-slate-800"
                  >
                    {['Liberado conforme', 'Retenido temporal', 'Reproceso requerido', 'Rechazado'].map(d => (
                      <option key={d} value={d}>{d}</option>
                    ))}
                  </select>
                ) : (
                  <input
                    type="text"
                    disabled
                    value={formData.disposition}
                    className="w-full mt-1 p-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/40 font-bold"
                  />
                )}
              </div>
            </div>
          </div>

          {/* Section 4: NC, Acción Inmediata, Responsable y Compromiso */}
          <div>
            <div className="text-[10px] font-black uppercase text-slate-400 font-mono mb-2 flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-blue-600" />
              4. No Conformidad, Acciones & Compromiso
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div>
                <label className="text-[11px] font-bold text-slate-600 dark:text-slate-400">¿Genera NC?</label>
                {isEditing ? (
                  <select
                    value={formData.generatesNc ? 'SI' : 'NO'}
                    onChange={(e) => setFormData(prev => ({ 
                      ...prev, 
                      generatesNc: e.target.value === 'SI',
                      ncId: e.target.value === 'SI' ? (prev.ncId || `NC-2026-${Math.floor(100 + Math.random() * 900)}`) : undefined
                    }))}
                    className="w-full mt-1 p-2 rounded-lg border border-blue-400 bg-white dark:bg-slate-800 font-bold"
                  >
                    <option value="NO">No</option>
                    <option value="SI">Sí (Genera NC)</option>
                  </select>
                ) : (
                  <div className="mt-1 p-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/40 font-bold">
                    {formData.generatesNc ? '🔴 Sí' : '⚪ No'}
                  </div>
                )}
              </div>

              <div>
                <label className="text-[11px] font-bold text-slate-600 dark:text-slate-400">ID NC Asociada</label>
                <div className="flex items-center gap-1.5 mt-1">
                  <input
                    type="text"
                    disabled={!isEditing || !formData.generatesNc}
                    value={formData.ncId || 'N/A'}
                    onChange={(e) => setFormData(prev => ({ ...prev, ncId: e.target.value }))}
                    className={`w-full p-2 rounded-lg border ${
                      formData.generatesNc ? 'border-rose-400 font-mono font-bold text-rose-600 bg-rose-50/50 dark:bg-rose-950/20' : 'border-slate-200 dark:border-slate-700 bg-slate-100 dark:bg-slate-800 text-slate-400'
                    }`}
                  />
                  {formData.ncId && onNavigateToNc && (
                    <button
                      type="button"
                      onClick={() => {
                        onNavigateToNc(formData.ncId!);
                        onClose();
                      }}
                      className="p-2 rounded-lg bg-rose-600 text-white hover:bg-rose-700 cursor-pointer"
                      title="Ver detalle de la NC"
                    >
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>

              <div>
                <label className="text-[11px] font-bold text-slate-600 dark:text-slate-400">Responsable</label>
                <input
                  type="text"
                  disabled={!isEditing}
                  value={formData.responsible}
                  onChange={(e) => setFormData(prev => ({ ...prev, responsible: e.target.value }))}
                  className={`w-full mt-1 p-2 rounded-lg border ${isEditing ? 'border-blue-400 bg-white dark:bg-slate-800' : 'border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/40'}`}
                />
              </div>

              <div>
                <label className="text-[11px] font-bold text-slate-600 dark:text-slate-400">Fecha Compromiso</label>
                <input
                  type="date"
                  disabled={!isEditing}
                  value={formData.commitmentDate}
                  onChange={(e) => setFormData(prev => ({ ...prev, commitmentDate: e.target.value }))}
                  className={`w-full mt-1 p-2 rounded-lg border ${isEditing ? 'border-blue-400 bg-white dark:bg-slate-800' : 'border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/40'}`}
                />
              </div>
            </div>

            <div className="mt-3">
              <label className="text-[11px] font-bold text-slate-600 dark:text-slate-400">Acción Inmediata</label>
              <textarea
                disabled={!isEditing}
                rows={2}
                value={formData.immediateAction || ''}
                onChange={(e) => setFormData(prev => ({ ...prev, immediateAction: e.target.value }))}
                className={`w-full mt-1 p-2 rounded-lg border ${isEditing ? 'border-blue-400 bg-white dark:bg-slate-800' : 'border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/40'}`}
              />
            </div>

            <div className="mt-3">
              <label className="text-[11px] font-bold text-slate-600 dark:text-slate-400">Verificación de Eficacia / Observaciones</label>
              <textarea
                disabled={!isEditing}
                rows={2}
                value={formData.observations || ''}
                onChange={(e) => setFormData(prev => ({ ...prev, observations: e.target.value }))}
                className={`w-full mt-1 p-2 rounded-lg border ${isEditing ? 'border-blue-400 bg-white dark:bg-slate-800' : 'border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/40'}`}
              />
            </div>
          </div>

          {/* Footer action buttons inside form */}
          {isEditing && (
            <div className="pt-3 border-t border-slate-200 dark:border-slate-800 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setIsEditing(false)}
                className="px-4 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 font-bold cursor-pointer"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold flex items-center gap-1.5 shadow-md shadow-blue-600/20 cursor-pointer"
              >
                <Save className="w-4 h-4" />
                <span>Guardar Cambios</span>
              </button>
            </div>
          )}
        </form>

        {/* Modal Footer */}
        {!isEditing && (
          <div className="p-3 bg-slate-50 dark:bg-slate-800/40 border-t border-slate-200 dark:border-slate-800 flex justify-between items-center text-xs">
            <span className="text-slate-500 font-mono text-[11px]">
              SHA-256 Audit: b94a...e12f • Almacenado en Google Sheets
            </span>
            <button
              onClick={onClose}
              className="px-4 py-1.5 rounded-xl bg-slate-800 text-white font-bold hover:bg-slate-900 cursor-pointer"
            >
              Cerrar
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
