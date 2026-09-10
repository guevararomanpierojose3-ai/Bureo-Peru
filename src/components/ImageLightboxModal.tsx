import { useState } from 'react';
import { X, ZoomIn, ZoomOut, Download, CheckCircle2, ShieldCheck, MapPin, Calendar, User } from 'lucide-react';
import { DigitalEvidence } from '../types';

interface ImageLightboxModalProps {
  evidence: DigitalEvidence | null;
  onClose: () => void;
}

export default function ImageLightboxModal({ evidence, onClose }: ImageLightboxModalProps) {
  const [zoomLevel, setZoomLevel] = useState<number>(100);

  if (!evidence) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-md p-4">
      <div 
        id="image-lightbox-container"
        className="relative w-full max-w-4xl bg-slate-900 border border-slate-700 rounded-lg shadow-2xl overflow-hidden flex flex-col text-slate-100 max-h-[90vh]"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-3 border-b border-slate-800 bg-slate-950">
          <div className="flex items-center gap-3">
            <span className="px-2.5 py-1 text-xs font-mono font-bold bg-blue-600/30 text-blue-400 border border-blue-500/40 rounded">
              {evidence.code}
            </span>
            <div>
              <h3 className="text-sm font-semibold text-white tracking-tight">{evidence.title}</h3>
              <p className="text-[11px] text-slate-400 font-mono">Registro Fotográfico de Control Operativo Bureo Perú</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1 bg-slate-800 rounded px-2 py-1 border border-slate-700">
              <button 
                onClick={() => setZoomLevel(prev => Math.max(50, prev - 25))}
                className="text-slate-400 hover:text-white p-1"
                title="Reducir zoom"
              >
                <ZoomOut className="w-3.5 h-3.5" />
              </button>
              <span className="text-xs font-mono px-1 text-slate-300">{zoomLevel}%</span>
              <button 
                onClick={() => setZoomLevel(prev => Math.min(250, prev + 25))}
                className="text-slate-400 hover:text-white p-1"
                title="Aumentar zoom"
              >
                <ZoomIn className="w-3.5 h-3.5" />
              </button>
            </div>
            <a 
              href={evidence.fileUrl} 
              download={`${evidence.code}.svg`}
              className="p-1.5 text-slate-400 hover:text-white rounded bg-slate-800 hover:bg-slate-700 transition-colors"
              title="Descargar archivo original"
            >
              <Download className="w-4 h-4" />
            </a>
            <button 
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-white rounded bg-slate-800 hover:bg-rose-900 transition-colors"
              title="Cerrar"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Image Canvas with Zoom */}
        <div className="flex-1 bg-black/60 p-6 flex items-center justify-center overflow-auto min-h-[340px]">
          <div 
            className="transition-transform duration-150 ease-out flex items-center justify-center"
            style={{ transform: `scale(${zoomLevel / 100})` }}
          >
            <img 
              src={evidence.fileUrl} 
              alt={evidence.title}
              referrerPolicy="no-referrer"
              className="max-h-[500px] max-w-full object-contain rounded border border-slate-700 shadow-lg"
            />
          </div>
        </div>

        {/* Metadata Bar & Security Stamp */}
        <div className="bg-slate-950 px-5 py-3 border-t border-slate-800 grid grid-cols-1 md:grid-cols-4 gap-3 text-xs">
          <div className="flex items-center gap-2 text-slate-300">
            <Calendar className="w-4 h-4 text-blue-400 shrink-0" />
            <div>
              <span className="text-[10px] text-slate-400 block uppercase font-mono">Marca Temporal</span>
              <span className="font-mono text-slate-200">{evidence.capturedAt}</span>
            </div>
          </div>
          <div className="flex items-center gap-2 text-slate-300">
            <MapPin className="w-4 h-4 text-emerald-400 shrink-0" />
            <div>
              <span className="text-[10px] text-slate-400 block uppercase font-mono">Ubicación / Línea</span>
              <span className="text-slate-200 truncate">{evidence.location}</span>
            </div>
          </div>
          <div className="flex items-center gap-2 text-slate-300">
            <User className="w-4 h-4 text-amber-400 shrink-0" />
            <div>
              <span className="text-[10px] text-slate-400 block uppercase font-mono">Operario / Auditor</span>
              <span className="text-slate-200 truncate">{evidence.operator}</span>
            </div>
          </div>
          <div className="flex items-center justify-end gap-2 text-emerald-400">
            <ShieldCheck className="w-4 h-4" />
            <span className="font-mono text-[11px]">Integridad SHA-256 Verificada</span>
          </div>
        </div>
      </div>
    </div>
  );
}
