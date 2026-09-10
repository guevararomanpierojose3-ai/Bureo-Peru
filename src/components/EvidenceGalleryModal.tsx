import { useState } from 'react';
import { 
  X, 
  Play, 
  Pause, 
  Download, 
  Image as ImageIcon, 
  Video as VideoIcon, 
  Calendar, 
  MapPin, 
  User, 
  Maximize2,
  FileCheck,
  CheckCircle2
} from 'lucide-react';
import { DigitalEvidence } from '../types';

interface EvidenceGalleryModalProps {
  isOpen: boolean;
  onClose: () => void;
  evidences: DigitalEvidence[];
  selectedEvidence?: DigitalEvidence | null;
  onSelectEvidence?: (ev: DigitalEvidence) => void;
  isDarkTheme?: boolean;
}

export default function EvidenceGalleryModal({
  isOpen,
  onClose,
  evidences,
  selectedEvidence,
  onSelectEvidence,
  isDarkTheme = false
}: EvidenceGalleryModalProps) {
  const [activeEv, setActiveEv] = useState<DigitalEvidence>(selectedEvidence || evidences[0]);
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);

  if (!isOpen || !activeEv) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fadeIn">
      <div className={`w-full max-w-4xl rounded-2xl border shadow-2xl overflow-hidden flex flex-col max-h-[90vh] ${
        isDarkTheme 
          ? 'bg-slate-900 border-slate-700 text-white' 
          : 'bg-white border-slate-200 text-slate-900'
      }`}>
        {/* Header */}
        <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className={`p-2 rounded-xl ${
              activeEv.type === 'video' ? 'bg-purple-100 dark:bg-purple-950/60 text-purple-600' : 'bg-blue-100 dark:bg-blue-950/60 text-blue-600'
            }`}>
              {activeEv.type === 'video' ? <VideoIcon className="w-5 h-5" /> : <ImageIcon className="w-5 h-5" />}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                  {activeEv.title}
                </h3>
                {activeEv.phase && (
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full font-mono ${
                    activeEv.phase === 'Antes' ? 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300' : 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                  }`}>
                    {activeEv.phase} de Acción
                  </span>
                )}
              </div>
              <p className="text-[11px] font-mono text-slate-500">
                Código: {activeEv.code} • Tamaño: {activeEv.fileSize}
              </p>
            </div>
          </div>

          <button 
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Media Canvas Body */}
        <div className="flex-1 overflow-hidden flex flex-col md:flex-row bg-black/90">
          <div className="flex-1 p-4 flex items-center justify-center min-h-[300px] relative">
            {activeEv.type === 'video' ? (
              <div className="w-full h-full flex flex-col items-center justify-center relative">
                <video
                  src={activeEv.fileUrl}
                  controls
                  autoPlay={isVideoPlaying}
                  className="max-h-[50vh] max-w-full rounded-lg shadow-lg"
                />
                <div className="absolute bottom-2 left-2 px-2 py-1 rounded bg-black/70 text-white text-[10px] font-mono">
                  Video Inspección Técnica • {activeEv.videoDuration || '00:48 min'}
                </div>
              </div>
            ) : (
              <div className="relative max-h-[50vh] max-w-full flex items-center justify-center">
                <img
                  src={activeEv.fileUrl}
                  alt={activeEv.title}
                  className="max-h-[50vh] max-w-full object-contain rounded-lg"
                  referrerPolicy="no-referrer"
                />
              </div>
            )}
          </div>

          {/* Sidebar Metadata */}
          <div className="w-full md:w-80 p-4 border-t md:border-t-0 md:border-l border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-xs overflow-y-auto space-y-3">
            <div>
              <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400 font-mono">
                Datos de Captura
              </div>
              <div className="mt-2 space-y-2 text-slate-600 dark:text-slate-300">
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-blue-600 shrink-0" />
                  <span>{activeEv.capturedAt}</span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-rose-500 shrink-0" />
                  <span>{activeEv.location}</span>
                </div>
                <div className="flex items-center gap-2">
                  <User className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>{activeEv.operator}</span>
                </div>
              </div>
            </div>

            {activeEv.associatedRecordId && (
              <div className="pt-2 border-t border-slate-200 dark:border-slate-800">
                <span className="text-[10px] font-bold uppercase text-slate-400 font-mono">
                  Registro Asociado:
                </span>
                <div className="mt-1 font-mono font-bold text-blue-600 dark:text-cyan-400">
                  {activeEv.associatedRecordId}
                </div>
              </div>
            )}

            {activeEv.associatedNcId && (
              <div className="pt-2 border-t border-slate-200 dark:border-slate-800">
                <span className="text-[10px] font-bold uppercase text-slate-400 font-mono">
                  No Conformidad Vinculada:
                </span>
                <div className="mt-1 font-mono font-bold text-rose-600">
                  {activeEv.associatedNcId}
                </div>
              </div>
            )}

            {/* List of other evidences */}
            <div className="pt-2 border-t border-slate-200 dark:border-slate-800">
              <span className="text-[10px] font-bold uppercase text-slate-400 font-mono block mb-2">
                Otras Evidencias ({evidences.length}):
              </span>
              <div className="space-y-1.5 max-h-40 overflow-y-auto">
                {evidences.map((ev) => (
                  <button
                    key={ev.id}
                    onClick={() => {
                      setActiveEv(ev);
                      if (onSelectEvidence) onSelectEvidence(ev);
                    }}
                    className={`w-full p-1.5 rounded-lg border text-left flex items-center gap-2 transition-all cursor-pointer ${
                      activeEv.id === ev.id
                        ? 'bg-blue-50 dark:bg-blue-950/60 border-blue-400 font-bold'
                        : 'border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800'
                    }`}
                  >
                    <div className="w-8 h-8 rounded bg-slate-200 dark:bg-slate-800 overflow-hidden shrink-0 flex items-center justify-center">
                      {ev.type === 'video' ? <VideoIcon className="w-4 h-4 text-purple-600" /> : <ImageIcon className="w-4 h-4 text-blue-600" />}
                    </div>
                    <div className="min-w-0 flex-1 truncate">
                      <div className="truncate text-[11px]">{ev.title}</div>
                      <div className="text-[9px] text-slate-400 font-mono">{ev.code}</div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-3 bg-slate-50 dark:bg-slate-800/60 border-t border-slate-200 dark:border-slate-800 flex justify-between items-center text-xs">
          <span className="text-slate-500 text-[11px]">
            Auditoría de Evidencias Digitales con Criptografía SHA-256 (ISO 9001:2015 Cláusula 8.7)
          </span>
          <div className="flex gap-2">
            <a
              href={activeEv.fileUrl}
              download={activeEv.code}
              target="_blank"
              rel="noreferrer"
              className="px-3 py-1.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 font-bold hover:bg-slate-100 flex items-center gap-1.5 cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Descargar</span>
            </a>
            <button
              onClick={onClose}
              className="px-4 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold cursor-pointer"
            >
              Cerrar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
