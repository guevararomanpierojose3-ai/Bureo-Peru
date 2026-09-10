import { useState, FormEvent } from 'react';
import { X, AlertTriangle, Plus, Upload, CheckCircle2 } from 'lucide-react';
import { CapaCase, DigitalEvidence } from '../types';

interface NewCapaModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (newCase: Partial<CapaCase>) => void;
}

export default function NewCapaModal({ isOpen, onClose, onSubmit }: NewCapaModalProps) {
  const [area, setArea] = useState('Área Corte Industrial');
  const [lotCode, setLotCode] = useState('Lote Austral-11');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [responsibleName, setResponsibleName] = useState('Ing. Marcos Salinas');
  const [riskLevel, setRiskLevel] = useState<number>(3);
  const [evidenceUrl, setEvidenceUrl] = useState('/assets/inspeccion-linea2.svg');
  const [evidenceTitle, setEvidenceTitle] = useState('Foto de Inspección en Línea');

  if (!isOpen) return null;

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!title) return;

    const newEvidence: DigitalEvidence = {
      id: `ev-${Date.now()}`,
      code: `FOTO-${Math.floor(10 + Math.random() * 90)}`,
      title: evidenceTitle || 'Evidencia técnica fotográfica',
      type: 'image',
      fileUrl: evidenceUrl || '/assets/inspeccion-linea2.svg',
      thumbnailUrl: evidenceUrl || '/assets/inspeccion-linea2.svg',
      capturedAt: new Date().toISOString().replace('T', ' ').slice(0, 19),
      location: area,
      operator: responsibleName,
      fileSize: '1.9 MB'
    };

    const newCase: Partial<CapaCase> = {
      code: `NC-2026-${String(Math.floor(10 + Math.random() * 90)).padStart(3, '0')}`,
      area,
      lotCode,
      title,
      description,
      status: 'Abierta',
      isCritical: riskLevel >= 4,
      isOverdue: false,
      overdueText: 'En Plazo',
      riskScore: riskLevel,
      risk: (riskLevel >= 4 ? 'Riesgo crítico' : riskLevel >= 3 ? 'Riesgo alto' : 'Riesgo medio') as any,
      responsibleName,
      responsibleRole: 'Responsable de Calidad',
      commitmentDate: '15/01/2026',
      rootCauseMethod: '5 Porqués',
      rootCauseDiagnosis: 'En evaluación de causa raíz por comitiva de planta.',
      correctiveActionCode: `CAPA-AC-${Math.floor(100 + Math.random() * 900)}`,
      correctiveActionPlan: 'Implementación inmediata de aislamiento de lote y contramedidas.',
      implementationProgress: 10,
      resolutionCycle: {
        detect: true,
        cause: false,
        immediate: false,
        implement: false,
        efficacy: false
      },
      evidenceFiles: [newEvidence]
    };

    onSubmit(newCase);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 overflow-y-auto">
      <div 
        id="new-capa-modal"
        className="relative w-full max-w-2xl bg-white border border-slate-200 rounded-lg shadow-2xl overflow-hidden my-6 text-slate-800"
      >
        <div className="flex items-center justify-between px-6 py-4 bg-slate-900 text-white border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-blue-600 rounded text-white">
              <Plus className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold">Registrar Nueva No Conformidad / CAPA</h3>
              <p className="text-xs text-slate-300 font-mono">Bureo Perú • ISO 9001:2015 Cláusula 10.2</p>
            </div>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white p-1">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4 text-xs">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Área de Planta</label>
              <select 
                value={area} 
                onChange={(e) => setArea(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded focus:border-blue-600 focus:outline-none"
              >
                <option>Área Corte Industrial</option>
                <option>Área Lavado Industrial</option>
                <option>Área Empaque Secundario</option>
                <option>Área Extrusión Continua</option>
                <option>Área Recogido y Enlace</option>
              </select>
            </div>
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Código de Lote Afectado</label>
              <input 
                type="text" 
                value={lotCode}
                onChange={(e) => setLotCode(e.target.value)}
                className="w-full px-3 py-2 font-mono border border-slate-300 rounded focus:border-blue-600 focus:outline-none"
                placeholder="ej. Lote Austral-11"
                required
              />
            </div>
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">Título de la Desviación</label>
            <input 
              type="text" 
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 rounded focus:border-blue-600 focus:outline-none"
              placeholder="Descripción breve y precisa del hallazgo"
              required
            />
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">Descripción Detallada / Hallazgo</label>
            <textarea 
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              className="w-full px-3 py-2 border border-slate-300 rounded focus:border-blue-600 focus:outline-none"
              placeholder="Detalle operativo de las condiciones, impacto y hallazgos inmediatos..."
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Responsable Asignado</label>
              <input 
                type="text" 
                value={responsibleName}
                onChange={(e) => setResponsibleName(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded focus:border-blue-600 focus:outline-none"
                required
              />
            </div>
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Índice de Riesgo (1 a 5)</label>
              <div className="flex gap-2 items-center">
                {[1, 2, 3, 4, 5].map((lvl) => (
                  <button
                    key={lvl}
                    type="button"
                    onClick={() => setRiskLevel(lvl)}
                    className={`flex-1 py-1.5 rounded font-bold transition-colors ${
                      riskLevel === lvl
                        ? lvl >= 4 
                          ? 'bg-rose-600 text-white' 
                          : 'bg-blue-600 text-white'
                        : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                    }`}
                  >
                    L{lvl}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Evidence photo linking from HTML */}
          <div className="p-3 bg-slate-50 border border-slate-200 rounded">
            <label className="block font-semibold text-slate-800 mb-1">
              Vinculación de Evidencia Fotográfica (HTML &lt;img src="..." /&gt;)
            </label>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-2 items-center">
              <div className="md:col-span-2">
                <input 
                  type="text"
                  value={evidenceUrl}
                  onChange={(e) => setEvidenceUrl(e.target.value)}
                  className="w-full px-2 py-1.5 font-mono text-[11px] border border-slate-300 rounded"
                  placeholder="URL o ruta ej: /assets/inspeccion-linea2.svg"
                />
              </div>
              <div className="flex items-center gap-2">
                <img 
                  src={evidenceUrl} 
                  alt="Vista previa" 
                  className="w-12 h-10 object-cover border border-slate-300 rounded bg-slate-200"
                  onError={(e) => {
                    (e.target as HTMLElement).setAttribute('src', '/assets/inspeccion-linea2.svg');
                  }}
                />
                <span className="text-[11px] text-slate-500 font-mono">Vista Previa</span>
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-3 border-t border-slate-200">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-slate-300 rounded text-slate-700 hover:bg-slate-50 font-medium"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded font-medium flex items-center gap-1.5"
            >
              <CheckCircle2 className="w-4 h-4" />
              Guardar y Notificar a Planta
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
