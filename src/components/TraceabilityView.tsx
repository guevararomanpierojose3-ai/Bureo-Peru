import { useState } from 'react';
import { 
  GitBranch, 
  Search, 
  Package, 
  Scale, 
  Camera, 
  CheckCircle2, 
  AlertTriangle, 
  ExternalLink, 
  ShieldCheck, 
  Calendar, 
  Layers, 
  ArrowRight, 
  Filter, 
  Image as ImageIcon,
  Radio,
  Sparkles,
  QrCode,
  Copy,
  Check
} from 'lucide-react';
import { DigitalEvidence } from '../types';

interface TraceabilityViewProps {
  onOpenLightbox: (imageUrl: string, title: string) => void;
  onOpenHtmlLinker: () => void;
  isDarkTheme?: boolean;
}

export default function TraceabilityView({ 
  onOpenLightbox, 
  onOpenHtmlLinker,
  isDarkTheme = true 
}: TraceabilityViewProps) {
  const [selectedLot, setSelectedLot] = useState('LOT-2026-X88');
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  const handleCopyTag = (code: string, url: string) => {
    const tag = `<img src="${url}" alt="${code}" width="600" height="400" />`;
    navigator.clipboard?.writeText(tag);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  const lots = [
    {
      id: 'LOT-2026-X88',
      supplier: 'Puerto Chimbote • Redes de Pesca HD-PE',
      receivedDate: '06/01/2026',
      weightKg: 420.5,
      netCleanKg: 414.8,
      contaminationRate: 1.35,
      status: 'Liberado Conforme',
      currentStage: 'Empaque Secundario',
      photos: [
        { code: 'FOTO-X88-1', url: '/assets/inspeccion-linea2.svg', title: 'Inspección de Lote en Línea #2' },
        { code: 'TARA-CAL-99', url: '/assets/tara-calibrada.svg', title: 'Calibración Balanza Analítica' }
      ]
    },
    {
      id: 'LOT-2026-A09',
      supplier: 'Caleta Paita • Redes de Enmalle Poliamida',
      receivedDate: '03/01/2026',
      weightKg: 650.0,
      netCleanKg: 631.8,
      contaminationRate: 2.80,
      status: 'En Retención / NC-004',
      currentStage: 'Área Corte Industrial (Criba #2)',
      photos: [
        { code: 'FOTO-BANDA-04', url: '/assets/foto-banda.svg', title: 'Rotura Criba Tolva #2' }
      ]
    },
    {
      id: 'LOT-2026-M14',
      supplier: 'Asociación Paracas • Cabos Reciclados',
      receivedDate: '08/01/2026',
      weightKg: 380.0,
      netCleanKg: 376.1,
      contaminationRate: 1.02,
      status: 'Liberado Conforme',
      currentStage: 'Extrusión Continua',
      photos: [
        { code: 'FOTO-LINEA-1', url: '/assets/inspeccion-linea2.svg', title: 'Control Extrusión Continua' }
      ]
    }
  ];

  const currentLotData = lots.find(l => l.id === selectedLot) || lots[0];

  return (
    <div className="space-y-6 pb-20 md:pb-8">
      {/* Subheader status bar */}
      <div className={`flex flex-wrap items-center justify-between gap-3 p-3.5 rounded-2xl border transition-all ${
        isDarkTheme 
          ? 'bg-slate-900/80 border-slate-800 backdrop-blur-xl text-slate-300' 
          : 'bg-white/80 border-slate-200 backdrop-blur-xl text-slate-700 shadow-xs'
      }`}>
        <div className="flex items-center gap-2 text-xs font-mono">
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 font-semibold">
            <Radio className="w-3 h-3 text-cyan-400" />
            TRAZABILIDAD DE LOTES INDUSTRIALES
          </span>
          <span className="text-slate-600 hidden sm:inline">•</span>
          <span className="text-emerald-400 font-semibold hidden sm:inline">ISO 9001 §8.5.2</span>
          <span className="text-slate-600 hidden md:inline">•</span>
          <span className="text-slate-400 hidden md:inline">Cadena NetPositiva Bureo Perú</span>
        </div>

        <span className="text-xs font-mono text-cyan-400">Custodia Verificada SHA-256</span>
      </div>

      {/* Main Title & Action Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className={`text-2xl sm:text-3xl font-extrabold tracking-tight ${isDarkTheme ? 'text-white' : 'text-slate-900'}`}>
            Genealogía & Trazabilidad de Lotes
          </h1>
          <p className={`text-xs sm:text-sm mt-1 ${isDarkTheme ? 'text-slate-400' : 'text-slate-600'}`}>
            Cadena de custodia desde acopio pesquero costero hasta pellets reciclados NetPositiva
          </p>
        </div>

        <button
          onClick={onOpenHtmlLinker}
          className={`flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold border transition-all self-start ${
            isDarkTheme 
              ? 'bg-slate-900 hover:bg-slate-800 text-cyan-400 border-cyan-500/30' 
              : 'bg-white hover:bg-slate-50 text-blue-700 border-blue-200 shadow-xs'
          }`}
        >
          <ImageIcon className="w-4 h-4" />
          <span>Vincular Fotos en HTML</span>
        </button>
      </div>

      {/* Lot Selector Pills */}
      <div className="flex flex-wrap gap-2 text-xs">
        {lots.map(l => (
          <button
            key={l.id}
            onClick={() => setSelectedLot(l.id)}
            className={`px-4 py-2 rounded-xl font-mono font-bold transition-all flex items-center gap-2 ${
              selectedLot === l.id
                ? isDarkTheme 
                  ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-lg glow-cyan' 
                  : 'bg-blue-600 text-white shadow-xs'
                : isDarkTheme 
                  ? 'bg-slate-900 border border-slate-800 text-slate-300 hover:bg-slate-800' 
                  : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50'
            }`}
          >
            <span>{l.id}</span>
            <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${
              l.status === 'Liberado Conforme' 
                ? 'bg-emerald-500/20 text-emerald-300' 
                : 'bg-rose-500/20 text-rose-300'
            }`}>
              {l.status === 'Liberado Conforme' ? '✓ OK' : '⚠ RETENIDO'}
            </span>
          </button>
        ))}
      </div>

      {/* Selected Lot Telemetry Overview */}
      <div className={`rounded-2xl p-5 sm:p-6 border transition-all ${
        isDarkTheme 
          ? 'bg-slate-900/80 border-slate-800 backdrop-blur-xl text-white shadow-2xl' 
          : 'bg-white border-slate-200 text-slate-900 shadow-sm'
      }`}>
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800/60 pb-4 mb-4">
          <div>
            <div className="flex items-center gap-3">
              <h2 className="text-xl font-extrabold font-mono text-cyan-400">{currentLotData.id}</h2>
              <span className={`px-2.5 py-0.5 rounded-full text-xs font-mono font-bold ${
                currentLotData.status === 'Liberado Conforme'
                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                  : 'bg-rose-500/20 text-rose-300 border border-rose-500/40'
              }`}>
                {currentLotData.status}
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-1 font-mono">{currentLotData.supplier}</p>
          </div>

          <div className="text-right">
            <span className="text-[10px] font-mono text-slate-400 block uppercase">ETAPA EN PLANTA</span>
            <span className="text-sm font-bold text-white font-mono">{currentLotData.currentStage}</span>
          </div>
        </div>

        {/* Mass Balance KPI Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
          <div className={`p-3 rounded-xl border text-xs ${isDarkTheme ? 'bg-slate-950/60 border-slate-800' : 'bg-slate-50 border-slate-200'}`}>
            <span className="text-[10px] font-mono text-slate-400 block uppercase">Peso Bruto Entrada</span>
            <span className="text-lg font-extrabold font-mono text-white">{currentLotData.weightKg} kg</span>
            <span className="text-[10px] text-slate-500 block mt-0.5">Balanza Mettler Toledo</span>
          </div>

          <div className={`p-3 rounded-xl border text-xs ${isDarkTheme ? 'bg-slate-950/60 border-slate-800' : 'bg-slate-50 border-slate-200'}`}>
            <span className="text-[10px] font-mono text-cyan-400 block uppercase font-bold">Masa Limpia Neta</span>
            <span className="text-lg font-extrabold font-mono text-cyan-300">{currentLotData.netCleanKg} kg</span>
            <span className="text-[10px] text-emerald-400 block mt-0.5">Rendimiento 98.6%</span>
          </div>

          <div className={`p-3 rounded-xl border text-xs ${isDarkTheme ? 'bg-slate-950/60 border-slate-800' : 'bg-slate-50 border-slate-200'}`}>
            <span className="text-[10px] font-mono text-slate-400 block uppercase">Tasa Contaminación</span>
            <span className={`text-lg font-extrabold font-mono ${
              currentLotData.contaminationRate <= 1.50 ? 'text-emerald-400' : 'text-rose-400'
            }`}>
              {currentLotData.contaminationRate}%
            </span>
            <span className="text-[10px] text-slate-400 block mt-0.5">Meta: &lt;1.50%</span>
          </div>

          <div className={`p-3 rounded-xl border text-xs ${isDarkTheme ? 'bg-slate-950/60 border-slate-800' : 'bg-slate-50 border-slate-200'}`}>
            <span className="text-[10px] font-mono text-slate-400 block uppercase">Recepción</span>
            <span className="text-lg font-extrabold font-mono text-white">{currentLotData.receivedDate}</span>
            <span className="text-[10px] text-slate-400 block mt-0.5">Turno Diurno</span>
          </div>
        </div>

        {/* Holographic Chain-of-Custody Flowchart */}
        <div className="mb-6">
          <h3 className="text-xs font-mono uppercase tracking-widest text-cyan-400 font-bold mb-3 flex items-center gap-1.5">
            <GitBranch className="w-3.5 h-3.5" />
            FLUJO DE CUSTODIA Y CONTROL EN PLANTA
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-4 gap-2.5">
            {[
              { step: '01', title: 'Acopio Costero', status: 'Completado', time: '05/01 14:00', ok: true },
              { step: '02', title: 'Pesaje & Tara', status: 'Verificado', time: '06/01 08:30', ok: true },
              { step: '03', title: 'Corte & Molienda', status: currentLotData.id === 'LOT-2026-A09' ? 'NC-004 Alerta' : 'Conforme', time: '06/01 11:20', ok: currentLotData.id !== 'LOT-2026-A09' },
              { step: '04', title: 'Extrusión / Pellets', status: 'En Proceso', time: '07/01 16:45', ok: true },
            ].map((node, i) => (
              <div 
                key={node.step}
                className={`p-3 rounded-xl border relative transition-all ${
                  !node.ok 
                    ? 'bg-rose-950/30 border-rose-500/40 text-rose-200' 
                    : isDarkTheme 
                      ? 'bg-slate-950/60 border-slate-800' 
                      : 'bg-slate-50 border-slate-200'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[10px] font-mono text-cyan-400 font-bold">{node.step}</span>
                  <span className={`text-[9px] font-mono px-1.5 py-0.2 rounded-full font-bold ${
                    node.ok ? 'bg-emerald-500/20 text-emerald-300' : 'bg-rose-500/20 text-rose-300'
                  }`}>
                    {node.status}
                  </span>
                </div>
                <div className="font-bold text-xs text-white">{node.title}</div>
                <div className="text-[10px] font-mono text-slate-400 mt-1">{node.time}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Physical Evidence Photo Inspector with HTML Image Tag Generator */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-xs font-mono uppercase tracking-widest text-cyan-400 font-bold flex items-center gap-1.5">
              <Camera className="w-3.5 h-3.5" />
              EVIDENCIAS FOTOGRÁFICAS VINCULADAS AL LOTE ({currentLotData.photos.length})
            </h3>
            <span className="text-[10px] font-mono text-slate-400">Haz clic para zoom con Lightbox</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {currentLotData.photos.map((photo) => (
              <div 
                key={photo.code}
                className={`rounded-2xl border p-3 flex flex-col justify-between transition-all group ${
                  isDarkTheme 
                    ? 'bg-slate-950/80 border-slate-800 hover:border-cyan-500/40' 
                    : 'bg-slate-50 border-slate-200 hover:border-blue-300'
                }`}
              >
                <div 
                  className="relative h-44 rounded-xl overflow-hidden cursor-pointer bg-slate-900 flex items-center justify-center mb-3"
                  onClick={() => onOpenLightbox(photo.url, photo.title)}
                >
                  <img 
                    src={photo.url} 
                    alt={photo.title} 
                    className="w-full h-full object-cover group-hover:scale-105 transition-all duration-300 opacity-90 group-hover:opacity-100"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute top-2 left-2 px-2 py-0.5 rounded-md bg-black/80 border border-slate-700 text-[10px] font-mono text-cyan-300">
                    {photo.code}
                  </div>
                  <div className="absolute inset-0 bg-cyan-500/10 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <span className="px-3 py-1.5 rounded-lg bg-black/80 text-white text-xs font-mono font-bold flex items-center gap-1.5 border border-cyan-400/50">
                      <ExternalLink className="w-3.5 h-3.5 text-cyan-400" />
                      Inspeccionar Zoom
                    </span>
                  </div>
                </div>

                <div>
                  <h4 className="text-xs font-bold text-white mb-1">{photo.title}</h4>
                  <div className="flex items-center justify-between text-[11px] font-mono text-slate-400">
                    <span>Etiqueta HTML:</span>
                    <button
                      onClick={() => handleCopyTag(photo.code, photo.url)}
                      className="px-2 py-0.5 rounded bg-slate-800 hover:bg-slate-700 text-cyan-400 flex items-center gap-1 transition-colors text-[10px]"
                      title="Copiar etiqueta <img src='...'> lista para HTML"
                    >
                      {copiedCode === photo.code ? (
                        <>
                          <Check className="w-3 h-3 text-emerald-400" />
                          <span className="text-emerald-400 font-bold">Copiado!</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3 h-3" />
                          <span>Copiar tag HTML</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
